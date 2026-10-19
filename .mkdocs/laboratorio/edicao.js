// Edição com mouse, toque e teclado.
//
// - Arrastar um componente: move. Os de encaixar mostram em verde os furos onde as pernas vão cair
//   (em vermelho, se não cabem) e encaixam ao soltar.
// - Arrastar de um terminal (furo, pino, polo, ponta) até outro: cria um fio. Tocar num terminal e
//   depois em outro também funciona (melhor no celular).
// - Arrastar o fundo move a vista; a roda do mouse dá zoom.
// - Clicar no interruptor liga e desliga; segurar o botão aperta.
// - Teclado: Tab passa pelos componentes e fios; Enter ou espaço aciona; setas movem; R gira;
//   I inverte as pernas; Delete apaga; Esc cancela; + e − dão zoom.

import { TIPOS } from "./catalogo.js";
import { encaixarPelaPegada, furoNoPonto, porId, posicaoDoTerminal } from "./geometria.js";
import { deslocar, ehProtoboard } from "./protoboard.js";
import { copiar, separarTerminal } from "./projeto.js";
import { nomeDoTerminal } from "./vista.js";

const LIMIAR = 5; // px de movimento para um clique virar arraste

export function ligarEdicao(ctx) {
  const { svg, estado } = ctx;
  let gesto = null;

  function noMundo(e) {
    const r = svg.getBoundingClientRect();
    return { x: (e.clientX - r.left - estado.pan.x) / estado.zoom, y: (e.clientY - r.top - estado.pan.y) / estado.zoom };
  }

  // Terminal sob o ponteiro: um alvo desenhado (pino, polo, ponta, perna solta) ou o furo mais perto.
  function terminalEm(e, p) {
    const alvo = e.target.closest && e.target.closest("[data-term]");
    if (alvo) return alvo.getAttribute("data-term");
    const dono = e.target.closest && e.target.closest("[data-comp]");
    const comp = dono && porId(estado.projeto, dono.getAttribute("data-comp"));
    if (comp && !ehProtoboard(comp.type)) return null; // em cima do corpo de um componente
    return furoNoPonto(estado.projeto, p.x, p.y, 7.5 / Math.max(estado.zoom, 0.5));
  }

  function terminalNoPonto(clientX, clientY, p) {
    const el = document.elementFromPoint(clientX, clientY);
    return el && svg.contains(el) ? terminalEm({ target: el }, p) : null;
  }

  function criarFio(de, ate) {
    if (!de || !ate || de === ate) return;
    const [idDe] = separarTerminal(de);
    const [idAte] = separarTerminal(ate);
    if (idDe === idAte && !ehProtoboard(porId(estado.projeto, idDe).type)) {
      ctx.avisar("Um fio entre duas pernas do mesmo componente deixaria ele em curto. Ligue em outro lugar.");
      return;
    }
    ctx.mudar((p) => {
      p.connections.push({ id: ctx.novoId(p, "w"), from: de, to: ate, color: ctx.corDoFio() });
    }, `Fio ligado: ${nomeDoTerminal(estado.projeto, de)} → ${nomeDoTerminal(estado.projeto, ate)}.`);
  }

  // Botão e PIR: valem só enquanto o aluno segura (momentâneo, não entra no histórico).
  const MOMENTANEOS = { botao: "apertado", pir: "movimento" };
  function apertar(id, sim) {
    const comp = porId(estado.projeto, id);
    const campo = comp && MOMENTANEOS[comp.type];
    if (!campo || Boolean(comp.props[campo]) === sim) return;
    comp.props[campo] = sim;
    const frase = comp.type === "pir" ? (sim ? "Movimento na frente do sensor." : "Sem movimento.") : (sim ? "Botão apertado." : "Botão solto.");
    ctx.reanalisar(frase);
  }

  function alternar(comp) {
    if (comp.type === "interruptor") {
      ctx.mudar((p) => {
        const c = porId(p, comp.id);
        c.props.fechado = !c.props.fechado;
      }, comp.props.fechado ? "Interruptor aberto." : "Interruptor fechado.");
      return true;
    }
    if (comp.type === "multimetro") {
      const ordem = ["V", "A", "desligado"];
      const novo = ordem[(ordem.indexOf(comp.props.modo) + 1) % ordem.length];
      ctx.mudar((p) => {
        porId(p, comp.id).props.modo = novo;
      }, `Multímetro em ${novo === "desligado" ? "OFF" : novo}.`);
      return true;
    }
    return false;
  }

  // ---------- Ponteiro ----------

  function aoApertar(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const p = noMundo(e);
    const term = terminalEm(e, p);
    // Fio esperando o segundo toque.
    if (estado.fioEmCurso && estado.fioEmCurso.pendente) {
      e.preventDefault();
      const de = estado.fioEmCurso.de;
      estado.fioEmCurso = null;
      if (term && term !== de) criarFio(de, term);
      else ctx.avisar("Fio cancelado.");
      ctx.redesenharMarcas();
      return;
    }
    svg.setPointerCapture(e.pointerId);
    if (term) {
      gesto = { tipo: "fio", de: term, inicio: { x: e.clientX, y: e.clientY }, movido: false };
      estado.fioEmCurso = { de: term, ate: p };
      ctx.redesenharMarcas();
      return;
    }
    const fioEl = e.target.closest("[data-fio]");
    if (fioEl) {
      ctx.selecionar({ tipo: "fio", id: fioEl.getAttribute("data-fio") });
      gesto = null;
      return;
    }
    const compEl = e.target.closest("[data-comp]");
    if (compEl) {
      const comp = porId(estado.projeto, compEl.getAttribute("data-comp"));
      ctx.selecionar({ tipo: "comp", id: comp.id });
      const ancora = TIPOS[comp.type].pegada ? posicaoDoTerminal(estado.projeto, `${comp.id}:${TIPOS[comp.type].terminais[0].id}`) : { x: comp.x, y: comp.y };
      gesto = { tipo: "arrastar", id: comp.id, inicio: { x: e.clientX, y: e.clientY }, desloc: { x: ancora.x - p.x, y: ancora.y - p.y }, movido: false };
      if (MOMENTANEOS[comp.type]) apertar(comp.id, true);
      return;
    }
    ctx.selecionar(null);
    gesto = { tipo: "vista", inicio: { x: e.clientX, y: e.clientY }, pan: { ...estado.pan } };
  }

  function aoMover(e) {
    const p = noMundo(e);
    if (!gesto) {
      const term = e.pointerType === "touch" ? null : terminalEm(e, p);
      if (term !== estado.destaque) {
        estado.destaque = term;
        ctx.redesenharMarcas();
      }
      if (estado.fioEmCurso && estado.fioEmCurso.pendente) {
        estado.fioEmCurso.ate = p;
        ctx.redesenharMarcas();
      }
      return;
    }
    const dx = e.clientX - gesto.inicio.x;
    const dy = e.clientY - gesto.inicio.y;
    if (!gesto.movido && Math.hypot(dx, dy) < LIMIAR) return;
    gesto.movido = true;
    if (gesto.tipo === "vista") {
      estado.pan = { x: gesto.pan.x + dx, y: gesto.pan.y + dy };
      ctx.aplicarVista();
    } else if (gesto.tipo === "fio") {
      estado.fioEmCurso.ate = p;
      estado.destaque = terminalNoPonto(e.clientX, e.clientY, p);
      ctx.redesenharMarcas();
    } else if (gesto.tipo === "arrastar") {
      arrastar(gesto, p);
    }
  }

  function arrastar(g, p) {
    const original = porId(estado.projeto, g.id);
    if (MOMENTANEOS[original.type]) apertar(g.id, false);
    const rascunho = copiar(estado.projeto);
    const comp = porId(rascunho, g.id);
    const alvo = { x: p.x + g.desloc.x, y: p.y + g.desloc.y };
    if (TIPOS[comp.type].pegada) {
      delete comp.mount;
      comp.x = alvo.x;
      comp.y = alvo.y;
      const furo = furoNoPonto(rascunho, alvo.x, alvo.y, 9);
      if (furo) {
        const r = encaixarPelaPegada(rascunho, comp, furo);
        const furos = r.mount ? Object.values(r.mount) : [furo];
        g.encaixe = r.mount || null;
        estado.previa = { furos, ok: Boolean(r.mount), erro: r.erro };
      } else {
        g.encaixe = null;
        estado.previa = null;
      }
    } else {
      comp.x = Math.round(alvo.x);
      comp.y = Math.round(alvo.y);
    }
    g.rascunho = rascunho;
    ctx.previsualizar(rascunho);
  }

  function aoSoltar(e) {
    const g = gesto;
    gesto = null;
    if (svg.hasPointerCapture && svg.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId);
    if (!g) return;
    const p = noMundo(e);
    if (g.tipo === "fio") {
      const alvo = terminalNoPonto(e.clientX, e.clientY, p);
      if (!g.movido) {
        estado.fioEmCurso = { de: g.de, ate: p, pendente: true };
        ctx.avisar(`Fio a partir de ${nomeDoTerminal(estado.projeto, g.de)}: toque no outro terminal (Esc cancela).`);
        ctx.redesenharMarcas();
        return;
      }
      estado.fioEmCurso = null;
      if (alvo && alvo !== g.de) criarFio(g.de, alvo);
      else ctx.redesenharMarcas();
      return;
    }
    if (g.tipo === "arrastar") {
      const comp = porId(estado.projeto, g.id);
      if (comp && MOMENTANEOS[comp.type]) apertar(g.id, false);
      estado.previa = null;
      if (!g.movido) {
        if (comp && comp.type === "interruptor") alternar(comp);
        else ctx.redesenharMarcas();
        return;
      }
      const rascunho = g.rascunho;
      if (!rascunho) return;
      const novo = porId(rascunho, g.id);
      if (g.encaixe) {
        novo.mount = g.encaixe;
        ctx.mudar(() => rascunho, `${ctx.nome(novo)} encaixado.`);
      } else if (TIPOS[novo.type].pegada) {
        ctx.mudar(() => rascunho, `${ctx.nome(novo)} solto, fora da protoboard: as pernas não estão em furos.`);
      } else {
        ctx.mudar(() => rascunho, `${ctx.nome(novo)} movido.`);
      }
    }
  }

  function aoRolar(e) {
    e.preventDefault();
    const r = svg.getBoundingClientRect();
    ctx.zoomEm(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
  }

  // ---------- Teclado ----------

  function mover(sel, dx, dy, passo) {
    const comp = porId(estado.projeto, sel.id);
    if (!comp) return;
    if (comp.mount) {
      const mount = {};
      for (const [pino, furo] of Object.entries(comp.mount)) {
        const [placa, nome] = separarTerminal(furo);
        const alvo = deslocar(porId(estado.projeto, placa).type, nome, dx, dy);
        if (!alvo) return ctx.avisar("Não dá para mover mais para esse lado.");
        mount[pino] = `${placa}:${alvo}`;
      }
      const ocupado = estado.projeto.components.some((c) => c.id !== comp.id && Object.values(c.mount || {}).some((f) => Object.values(mount).includes(f)));
      if (ocupado) return ctx.avisar("Os furos desse lado já estão ocupados.");
      ctx.mudar((p) => {
        porId(p, comp.id).mount = mount;
      }, `${ctx.nome(comp)}: ${Object.values(mount).map((f) => nomeDoTerminal(estado.projeto, f).split(", ").slice(1).join(", ")).join(" e ")}.`);
      return;
    }
    ctx.mudar((p) => {
      const c = porId(p, comp.id);
      c.x += dx * passo;
      c.y += dy * passo;
    }, null);
  }

  function aoTeclar(e) {
    if (e.target.closest && e.target.closest("input, select, textarea")) return;
    if ((e.ctrlKey || e.metaKey) && /^[zy]$/i.test(e.key)) {
      if (e.key.toLowerCase() === "y" || e.shiftKey) ctx.refazer();
      else ctx.desfazer();
      e.preventDefault();
      return;
    }
    // Os atalhos só valem com o foco na área do circuito: num botão do painel, Enter é do botão.
    if (!ctx.area.contains(e.target) && e.key !== "Escape") return;
    const sel = estado.selecao;
    switch (e.key) {
      case "Escape":
        if (estado.fioEmCurso) {
          estado.fioEmCurso = null;
          ctx.avisar("Fio cancelado.");
          ctx.redesenharMarcas();
        } else {
          ctx.selecionar(null);
        }
        break;
      case "Delete":
      case "Backspace":
        if (sel) ctx.apagarSelecao();
        break;
      case "r":
      case "R":
        if (sel && sel.tipo === "comp") ctx.girar(sel.id);
        break;
      case "i":
      case "I":
        if (sel && sel.tipo === "comp") ctx.inverter(sel.id);
        break;
      case "+":
      case "=":
        ctx.zoomEm(1.2);
        break;
      case "-":
        ctx.zoomEm(1 / 1.2);
        break;
      case "0":
        ctx.ajustar();
        break;
      case "Enter":
      case " ": {
        if (!sel || sel.tipo !== "comp") return;
        const comp = porId(estado.projeto, sel.id);
        if (MOMENTANEOS[comp.type]) {
          if (!e.repeat) apertar(comp.id, true);
        } else if (!alternar(comp)) {
          return;
        }
        break;
      }
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown": {
        if (!sel || sel.tipo !== "comp") return;
        const [dx, dy] = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        mover(sel, dx, dy, e.shiftKey ? 32 : 8);
        break;
      }
      default:
        return;
    }
    e.preventDefault();
  }

  function aoSoltarTecla(e) {
    if ((e.key === "Enter" || e.key === " ") && estado.selecao && estado.selecao.tipo === "comp") apertar(estado.selecao.id, false);
  }

  // Foco do teclado num componente ou fio: seleciona.
  function aoFocar(e) {
    const el = e.target.closest && e.target.closest("[data-comp], [data-fio]");
    if (!el) return;
    const sel = el.hasAttribute("data-comp") ? { tipo: "comp", id: el.getAttribute("data-comp") } : { tipo: "fio", id: el.getAttribute("data-fio") };
    if (!estado.selecao || estado.selecao.id !== sel.id) ctx.selecionar(sel, { semFoco: true });
  }

  function aoSair() {
    if (!gesto && estado.destaque) {
      estado.destaque = null;
      ctx.redesenharMarcas();
    }
  }

  svg.addEventListener("pointerdown", aoApertar);
  svg.addEventListener("pointermove", aoMover);
  svg.addEventListener("pointerup", aoSoltar);
  svg.addEventListener("pointercancel", aoSoltar);
  svg.addEventListener("pointerleave", aoSair);
  svg.addEventListener("wheel", aoRolar, { passive: false });
  svg.addEventListener("focusin", aoFocar);
  ctx.raiz.addEventListener("keydown", aoTeclar);
  ctx.raiz.addEventListener("keyup", aoSoltarTecla);
  return {
    destruir() {
      ctx.raiz.removeEventListener("keydown", aoTeclar);
      ctx.raiz.removeEventListener("keyup", aoSoltarTecla);
    },
  };
}
