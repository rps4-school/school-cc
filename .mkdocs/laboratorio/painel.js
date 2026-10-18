// Painel ao lado do circuito, em abas: Adicionar, Selecionado, Conexões (ligar sem arrastar),
// Medidas (leituras e avisos), Projeto (salvar, abrir, exportar) e Instruções.
// Tudo o que dá para fazer arrastando também dá para fazer aqui, só com o teclado.

import {
  CORES_DE_FIO, CORES_DE_LED, descricao, MODOS_DO_MULTIMETRO, POTENCIOMETROS, RESISTORES, rotulo, terminaisDoTipo,
  textoDeResistencia, TIPOS,
} from "./catalogo.js";
import { formatar } from "./circuito.js";
import { esc } from "./desenhos.js";
import { porId } from "./geometria.js";
import { ehProtoboard, furos, lerFuro } from "./protoboard.js";
import { nomeDoTerminal } from "./vista.js";

const ABAS = [
  ["adicionar", "Adicionar"],
  ["selecionado", "Selecionado"],
  ["conexoes", "Conexões"],
  ["medidas", "Medidas"],
  ["codigo", "Código"],
  ["serial", "Serial"],
  ["projeto", "Projeto"],
  ["instrucoes", "Instruções"],
];
const ICONES = { erro: "⛔", aviso: "⚠️", dica: "💡" };

function botao(acao, texto, extra = "") {
  return `<button type="button" class="lab-btn" data-acao="${acao}" ${extra}>${texto}</button>`;
}

function opcoes(lista, atual) {
  return lista.map(([valor, texto]) => `<option value="${esc(valor)}"${String(valor) === String(atual) ? " selected" : ""}>${esc(texto)}</option>`).join("");
}

// Opções de terminal agrupadas: cada componente, e cada protoboard em barramentos e blocos de 10 colunas.
function opcoesDeTerminal(projeto, atual = "", comVazio = "") {
  const partes = comVazio ? [`<option value="">${esc(comVazio)}</option>`] : [];
  for (const c of projeto.components) {
    if (ehProtoboard(c.type)) continue;
    const itens = terminaisDoTipo(c.type).map((t) => [`${c.id}:${t.id}`, t.nome]);
    partes.push(`<optgroup label="${esc(descricao(c))}">${opcoes(itens, atual)}</optgroup>`);
  }
  for (const c of projeto.components) {
    if (!ehProtoboard(c.type)) continue;
    const grupos = new Map();
    for (const f of furos(c.type)) {
      const info = lerFuro(f.id);
      const grupo = info.linha ? `colunas ${Math.floor((info.coluna - 1) / 10) * 10 + 1} a ${Math.floor((info.coluna - 1) / 10) * 10 + 10}` : "barramentos";
      if (!grupos.has(grupo)) grupos.set(grupo, []);
      grupos.get(grupo).push([`${c.id}:${f.id}`, info.linha ? f.id : f.id.replace("cima", "cima ").replace("baixo", "baixo ")]);
    }
    for (const [grupo, itens] of grupos) partes.push(`<optgroup label="${esc(`${rotulo(c)} · ${grupo}`)}">${opcoes(itens, atual)}</optgroup>`);
  }
  return partes.join("");
}

export function montarPainel(ctx) {
  const { estado } = ctx;
  const raiz = document.createElement("div");
  raiz.className = "lab-painel";
  raiz.innerHTML =
    `<div class="lab-abas" role="tablist" aria-label="Painel do laboratório">${ABAS.map(([id, nome]) =>
      `<button type="button" role="tab" id="lab-aba-${id}" aria-controls="lab-conteudo-${id}" data-aba="${id}">${nome}</button>`).join("")}</div>` +
    ABAS.map(([id]) => `<div class="lab-conteudo" role="tabpanel" id="lab-conteudo-${id}" aria-labelledby="lab-aba-${id}" data-conteudo="${id}" hidden></div>`).join("");
  let aba = "adicionar";

  function mostrarAba(nova, foco = false) {
    aba = nova;
    raiz.dataset.abaAtiva = nova; // o CSS alarga o painel nas abas Código e Serial
    for (const b of raiz.querySelectorAll("[data-aba]")) {
      const ativa = b.dataset.aba === nova;
      b.setAttribute("aria-selected", String(ativa));
      b.tabIndex = ativa ? 0 : -1;
      if (ativa && foco) b.focus();
    }
    for (const c of raiz.querySelectorAll("[data-conteudo]")) c.hidden = c.dataset.conteudo !== nova;
    desenharAba(nova);
  }

  // ---------- Conteúdo de cada aba ----------

  function htmlAdicionar() {
    const grupos = new Map();
    for (const [tipo, t] of Object.entries(TIPOS)) {
      if (!grupos.has(t.categoria)) grupos.set(t.categoria, []);
      grupos.get(t.categoria).push(`<button type="button" class="lab-peca" data-acao="adicionar" data-tipo="${tipo}"><b>${esc(t.nome)}</b><small>${esc(t.descricao || "")}</small></button>`);
    }
    return [...grupos].map(([cat, itens]) => `<h3>${esc(cat)}</h3><div class="lab-pecas">${itens.join("")}</div>`).join("") +
      '<p class="lab-nota">Os componentes de encaixar entram num lugar livre da protoboard. Depois, arraste para outro lugar ou escolha os furos na aba <b>Selecionado</b>.</p>';
  }

  function htmlSelecionado() {
    const sel = estado.selecao;
    if (!sel) return '<p class="lab-nota">Clique num componente ou num fio (ou use Tab na área do circuito) para ver e mudar as propriedades dele.</p>';
    if (sel.tipo === "fio") {
      const fio = estado.projeto.connections.find((f) => f.id === sel.id);
      if (!fio) return "";
      return `<h3>Fio</h3><p>De <b>${esc(nomeDoTerminal(estado.projeto, fio.from))}</b><br>até <b>${esc(nomeDoTerminal(estado.projeto, fio.to))}</b></p>` +
        `<label class="lab-campo">Cor <select data-campo="cor-fio">${opcoes(Object.keys(CORES_DE_FIO).map((c) => [c, c]), fio.color)}</select></label>` +
        `<div class="lab-acoes">${botao("apagar", "Apagar fio")}</div>`;
    }
    const comp = porId(estado.projeto, sel.id);
    if (!comp) return "";
    const p = comp.props || {};
    const r = (estado.analise && estado.analise.componentes[comp.id]) || {};
    const campos = [];
    switch (comp.type) {
      case "resistor":
        campos.push(`<label class="lab-campo">Resistência <select data-campo="ohms">${opcoes(RESISTORES.map((v) => [v, textoDeResistencia(v)]).concat(RESISTORES.includes(p.ohms) ? [] : [[p.ohms, textoDeResistencia(p.ohms)]]), p.ohms)}</select></label>`);
        campos.push(`<label class="lab-campo">Ou digite, em Ω <input type="number" min="0.1" max="10000000" step="any" value="${p.ohms}" data-campo="ohms"></label>`);
        break;
      case "led":
        campos.push(`<label class="lab-campo">Cor <select data-campo="cor">${opcoes(Object.entries(CORES_DE_LED).map(([k, c]) => [k, `${c.nome} (${String(c.vf).replace(".", ",")} V)`]), p.cor)}</select></label>`);
        break;
      case "pilhas":
        campos.push(`<label class="lab-campo">Pilhas em série <select data-campo="quantidade">${opcoes([1, 2, 3, 4].map((q) => [q, `${q} × AA = ${String(1.5 * q).replace(".", ",")} V`]), p.quantidade)}</select></label>`);
        break;
      case "interruptor":
        campos.push(`<div class="lab-acoes">${botao("alternar", p.fechado ? "Abrir o interruptor" : "Fechar o interruptor")}</div>`);
        break;
      case "botao":
        campos.push(`<div class="lab-acoes">${botao("segurar", p.apertado ? "Soltar o botão" : "Manter apertado")}</div><p class="lab-nota">Na área do circuito, segure o botão com o mouse (ou Enter) para apertar só enquanto segura.</p>`);
        break;
      case "potenciometro":
        campos.push(`<label class="lab-campo">Valor <select data-campo="ohms">${opcoes(POTENCIOMETROS.map((v) => [v, textoDeResistencia(v)]), p.ohms)}</select></label>`);
        campos.push(`<label class="lab-campo">Posição do cursor: <output data-leitura-prop="posicao">${p.posicao} %</output><input type="range" min="0" max="100" step="1" value="${p.posicao}" data-campo="posicao"></label>`);
        break;
      case "ldr":
        campos.push(`<label class="lab-campo">Luz no sensor: <output data-leitura-prop="luz">${p.luz} %</output><input type="range" min="0" max="100" step="1" value="${p.luz}" data-campo="luz"></label>`);
        break;
      case "multimetro":
        campos.push(`<fieldset class="lab-campo"><legend>Mede</legend>${Object.entries(MODOS_DO_MULTIMETRO).map(([m, nome]) =>
          `<label class="lab-radio"><input type="radio" name="lab-modo" value="${m}" data-campo="modo"${p.modo === m ? " checked" : ""}> ${esc(nome)}</label>`).join("")}</fieldset>`);
        campos.push('<p class="lab-nota">Tensão: pontas em paralelo com o que você quer medir. Corrente: abra o circuito e ponha o multímetro em série.</p>');
        break;
      default:
    }
    if (TIPOS[comp.type].pegada) {
      campos.push(`<h3>Pernas</h3>${terminaisDoTipo(comp.type).map((t) =>
        `<label class="lab-campo">${esc(t.nome)} <select data-campo="mount" data-pino="${esc(t.id)}">${opcoesDeTerminal({ components: estado.projeto.components.filter((c) => ehProtoboard(c.type)) }, (comp.mount || {})[t.id] || "", "— solta, fora da protoboard —")}</select></label>`).join("")}`);
    }
    if (TIPOS[comp.type].livre && comp.type !== "multimetro") {
      campos.push('<p class="lab-nota">Ligue com fios: arraste de um terminal (pino, polo) até um furo, ou use a aba <b>Conexões</b>.</p>');
    }
    if (comp.type === "arduino-uno-r3") {
      campos.push('<p class="lab-nota">A placa alimenta o circuito pelo <b>5V</b>, pelo <b>3.3V</b> e pelo <b>GND</b>. Os pinos digitais e analógicos seguem o programa: sem programa rodando, eles ficam soltos. Veja as abas <b>Código</b> e <b>Serial</b>.</p>');
    }
    const leitura = r.texto ? `<p class="lab-leitura" data-leitura="${esc(comp.id)}">${esc(r.texto)}</p>` : `<div data-leitura="${esc(comp.id)}">${htmlResumo(comp, r)}</div>`;
    const inverte = ["led", "resistor", "ldr", "interruptor", "potenciometro"].includes(comp.type) && comp.mount;
    return `<h3>${esc(descricao(comp))}</h3>${leitura}${campos.join("")}` +
      `<div class="lab-acoes">${ehProtoboard(comp.type) ? "" : botao("girar", "Girar (R)")}${inverte ? botao("inverter", "Inverter as pernas (I)") : ""}${botao("apagar", "Apagar (Delete)")}</div>`;
  }

  function htmlResumo(comp, r) {
    switch (comp.type) {
      case "led": return `<p class="lab-leitura">${r.ligado ? `Aceso · ${esc(formatar(r.corrente, "A"))}` : "Apagado"}</p>`;
      case "resistor":
      case "ldr": return r.corrente === undefined ? "" : `<p class="lab-leitura">${esc(formatar(Math.abs(r.tensao), "V"))} · ${esc(formatar(Math.abs(r.corrente), "A"))}</p>`;
      case "pilhas":
      case "bateria-9v": return r.corrente === undefined ? "" : `<p class="lab-leitura">Fornecendo ${esc(formatar(Math.max(0, r.corrente), "A"))}</p>`;
      default: return "";
    }
  }

  function htmlConexoes() {
    const p = estado.projeto;
    const lista = p.connections.map((f) =>
      `<li><span class="lab-cor" style="background:${CORES_DE_FIO[f.color]}"></span><span>${esc(nomeDoTerminal(p, f.from))} → ${esc(nomeDoTerminal(p, f.to))}</span>` +
      `${botao("selecionar-fio", "Ver", `data-id="${esc(f.id)}"`)}${botao("apagar-fio", "Apagar", `data-id="${esc(f.id)}" aria-label="Apagar o fio de ${esc(nomeDoTerminal(p, f.from))} até ${esc(nomeDoTerminal(p, f.to))}"`)}</li>`).join("");
    return '<h3>Ligar dois terminais</h3>' +
      `<label class="lab-campo">De <select data-campo="ligar-de">${opcoesDeTerminal(p, estado.ligarDe || "", "Escolha o terminal")}</select></label>` +
      `<label class="lab-campo">Até <select data-campo="ligar-ate">${opcoesDeTerminal(p, estado.ligarAte || "", "Escolha o terminal")}</select></label>` +
      `<label class="lab-campo">Cor do fio <select data-campo="cor-novo-fio">${opcoes(Object.keys(CORES_DE_FIO).map((c) => [c, c]), estado.corDoFio)}</select></label>` +
      `<div class="lab-acoes">${botao("ligar", "Ligar")}</div>` +
      `<h3>Fios (${p.connections.length})</h3>${lista ? `<ul class="lab-lista">${lista}</ul>` : '<p class="lab-nota">Nenhum fio ainda.</p>'}`;
  }

  function htmlMedidas() {
    const p = estado.projeto;
    const a = estado.analise;
    const avisos = (estado.diagnosticos || []).map((d) =>
      `<li class="lab-diag lab-diag-${d.nivel}"><span aria-hidden="true">${ICONES[d.nivel]}</span><span>${esc(d.mensagem)}</span>${d.ids.length ? botao("mostrar", "Mostrar", `data-id="${esc(d.ids[0])}"`) : ""}</li>`).join("");
    const leituras = p.components.filter((c) => !ehProtoboard(c.type) && c.type !== "arduino-uno-r3").map((c) => {
      const r = (a && a.componentes[c.id]) || {};
      const valor = r.texto ? `<b>${esc(r.texto)}</b>` : htmlResumo(c, r).replace(/<\/?p[^>]*>/g, "");
      return valor ? `<li><span>${esc(descricao(c))}</span><span>${valor}</span></li>` : "";
    }).join("");
    return `<h3>Avisos</h3>${avisos ? `<ul class="lab-lista">${avisos}</ul>` : '<p class="lab-nota">Nada de errado por aqui. 👍</p>'}` +
      `<h3>Leituras</h3>${leituras ? `<ul class="lab-lista lab-leituras">${leituras}</ul>` : '<p class="lab-nota">Monte um circuito para ver as leituras.</p>'}`;
  }

  function htmlProjeto() {
    const salvos = ctx.listarSalvos().map((s) =>
      `<li><span>${esc(s.nome)}<small>${esc(new Date(s.salvoEm).toLocaleString("pt-BR"))}</small></span>${botao("abrir-salvo", "Abrir", `data-id="${esc(s.id)}"`)}${botao("apagar-salvo", "Apagar", `data-id="${esc(s.id)}" aria-label="Apagar o projeto salvo ${esc(s.nome)}"`)}</li>`).join("");
    const exemplos = (ctx.exemplos() || []).map((ex) =>
      `<li><span>${esc(ex.titulo)}<small>${esc(ex.descricao || "")}</small></span>${botao("exemplo", "Abrir", `data-url="${esc(ex.url)}"`)}</li>`).join("");
    return `<label class="lab-campo">Nome do projeto <input type="text" maxlength="80" value="${esc(estado.projeto.title)}" data-campo="titulo"></label>` +
      `<div class="lab-acoes">${botao("salvar", "Salvar neste navegador")}${botao("baixar", "Baixar arquivo (.json)")}${botao("importar", "Abrir arquivo (.json)")}</div>` +
      `<div class="lab-acoes">${botao("desfazer", "Desfazer (Ctrl+Z)")}${botao("refazer", "Refazer (Ctrl+Y)")}</div>` +
      `<div class="lab-acoes">${ctx.temInicial() ? botao("inicial", "Voltar ao circuito inicial") : ""}${botao("vazio", "Começar do zero")}</div>` +
      `<h3>Salvos neste navegador</h3>${salvos ? `<ul class="lab-lista">${salvos}</ul>` : '<p class="lab-nota">Nada salvo ainda. O circuito desta página também fica guardado sozinho enquanto você mexe.</p>'}` +
      (exemplos ? `<h3>Exemplos</h3><ul class="lab-lista">${exemplos}</ul>` : "") +
      '<h3>O que este simulador faz</h3><p class="lab-nota">Corrente contínua: pilhas, bateria, 5V do Arduino, resistores, LEDs, interruptor, botão, potenciômetro, LDR e multímetro, com fontes e LEDs quase ideais (como nas contas das aulas). O programa do Arduino roda num ATmega328P emulado, a partir do firmware compilado no build do site: código editado aqui não compila. Não simula capacitores, motores nem transistores.</p>';
  }

  function htmlInstrucoes() {
    const meta = estado.projeto.metadata || {};
    const texto = meta.instrucoes ? `<div class="lab-instrucoes">${esc(meta.instrucoes).replace(/\n/g, "<br>")}</div>` : '<p class="lab-nota">Este circuito não tem instruções. Veja a página de onde você abriu o laboratório.</p>';
    return `${texto}<h3>Como usar</h3><ul class="lab-ajuda"><li><b>Ligar:</b> arraste de um furo, pino ou polo até outro (ou toque em um e depois no outro).</li><li><b>Mover:</b> arraste o componente; os de encaixar mostram os furos em verde.</li><li><b>Ver o que está ligado:</b> passe o mouse num furo: os furos da mesma tira acendem.</li><li><b>Teclado:</b> Tab escolhe, setas movem, R gira, I inverte as pernas, Delete apaga, Enter aciona o interruptor e o botão.</li><li><b>Zoom:</b> roda do mouse ou os botões + e −.</li></ul>`;
  }

  const HTML = { adicionar: htmlAdicionar, selecionado: htmlSelecionado, conexoes: htmlConexoes, medidas: htmlMedidas, projeto: htmlProjeto, instrucoes: htmlInstrucoes };

  // Seletor que acha de novo o controle focado depois de refazer a aba (o foco não se perde).
  function seletorDe(el) {
    const partes = [];
    for (const a of ["data-campo", "data-pino", "data-acao", "data-id", "data-tipo", "data-url"]) {
      if (el.hasAttribute(a)) partes.push(`[${a}="${CSS.escape(el.getAttribute(a))}"]`);
    }
    if (el.type === "radio") partes.push(`[value="${CSS.escape(el.value)}"]`);
    return partes.length ? partes.join("") : null;
  }

  function desenharAba(id) {
    const caixa = raiz.querySelector(`[data-conteudo="${id}"]`);
    // Código e Serial são do programa.js: o editor e o texto da serial ficam vivos entre as trocas de aba.
    const externo = ctx.abaExterna(id);
    if (externo) {
      if (externo.parentNode !== caixa) caixa.appendChild(externo);
      if (!caixa.hidden) ctx.aoMostrarAba(id);
      return;
    }
    const ativo = document.activeElement;
    const chave = ativo && caixa.contains(ativo) ? seletorDe(ativo) : null;
    caixa.innerHTML = HTML[id]();
    if (chave) {
      const el = caixa.querySelector(chave);
      if (el) el.focus({ preventScroll: true });
    }
  }

  // ---------- Eventos ----------

  raiz.addEventListener("click", (e) => {
    const abaEl = e.target.closest("[data-aba]");
    if (abaEl) return mostrarAba(abaEl.dataset.aba);
    const b = e.target.closest("[data-acao]");
    if (!b) return;
    const id = b.dataset.id;
    switch (b.dataset.acao) {
      case "adicionar": return ctx.adicionar(b.dataset.tipo);
      case "girar": return ctx.girar(estado.selecao.id);
      case "inverter": return ctx.inverter(estado.selecao.id);
      case "apagar": return ctx.apagarSelecao();
      case "alternar": return ctx.mudarProp(estado.selecao.id, "fechado", (v) => !v);
      case "segurar": return ctx.mudarProp(estado.selecao.id, "apertado", (v) => !v);
      case "ligar": {
        const de = raiz.querySelector('[data-campo="ligar-de"]').value;
        const ate = raiz.querySelector('[data-campo="ligar-ate"]').value;
        return ctx.ligar(de, ate);
      }
      case "selecionar-fio": return ctx.selecionar({ tipo: "fio", id });
      case "apagar-fio": return ctx.apagarFio(id);
      case "mostrar": return ctx.selecionar({ tipo: "comp", id });
      case "salvar": return ctx.salvar();
      case "baixar": return ctx.exportar();
      case "importar": return ctx.importar();
      case "abrir-salvo": return ctx.abrirSalvo(id);
      case "apagar-salvo": return ctx.apagarSalvo(id);
      case "exemplo": return ctx.abrirExemplo(b.dataset.url);
      case "inicial": return ctx.voltarAoInicial();
      case "vazio": return ctx.comecarDoZero();
      case "desfazer": return ctx.desfazer();
      case "refazer": return ctx.refazer();
      default:
    }
  });

  // Setas trocam de aba, como pede o padrão de abas (WAI-ARIA).
  raiz.querySelector(".lab-abas").addEventListener("keydown", (e) => {
    const i = ABAS.findIndex(([id]) => id === aba);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const prox = (i + (e.key === "ArrowRight" ? 1 : ABAS.length - 1)) % ABAS.length;
      mostrarAba(ABAS[prox][0], true);
      e.preventDefault();
    }
  });

  function campoMudou(e, final) {
    const el = e.target.closest("[data-campo]");
    if (!el) return;
    const sel = estado.selecao;
    const valor = el.value;
    switch (el.dataset.campo) {
      case "ohms": {
        const v = Number(valor);
        if (final && v >= 0.1 && v <= 1e7) ctx.mudarProp(sel.id, "ohms", () => v);
        break;
      }
      case "cor": if (final) ctx.mudarProp(sel.id, "cor", () => valor); break;
      case "quantidade": if (final) ctx.mudarProp(sel.id, "quantidade", () => Number(valor)); break;
      case "posicao":
      case "luz": {
        const out = raiz.querySelector(`[data-leitura-prop="${el.dataset.campo}"]`);
        if (out) out.textContent = `${valor} %`;
        ctx.mudarProp(sel.id, el.dataset.campo, () => Number(valor), { semHistorico: !final });
        break;
      }
      case "modo": if (final) ctx.mudarProp(sel.id, "modo", () => valor); break;
      case "mount": if (final) ctx.encaixarPerna(sel.id, el.dataset.pino, valor); break;
      case "cor-fio": if (final) ctx.mudarCorDoFio(sel.id, valor); break;
      case "cor-novo-fio": estado.corDoFio = valor; break;
      case "ligar-de": estado.ligarDe = valor; break;
      case "ligar-ate": estado.ligarAte = valor; break;
      case "titulo": if (final) ctx.mudarTitulo(valor); break;
      default:
    }
  }
  raiz.addEventListener("input", (e) => campoMudou(e, false));
  raiz.addEventListener("change", (e) => campoMudou(e, true));

  mostrarAba("adicionar");

  return {
    elemento: raiz,
    mostrarAba,
    // Depois de cada mudança. Enquanto o aluno arrasta um controle deslizante (mudança sem histórico),
    // a aba não é refeita (o controle sairia da mão dele): só as leituras mudam.
    atualizar({ semHistorico } = {}) {
      if (aba === "selecionado" && semHistorico) {
        const sel = estado.selecao;
        const comp = sel && sel.tipo === "comp" && porId(estado.projeto, sel.id);
        const alvo = comp && raiz.querySelector(`[data-leitura="${CSS.escape(comp.id)}"]`);
        const r = comp && estado.analise && estado.analise.componentes[comp.id];
        if (alvo && r) {
          if (r.texto) alvo.textContent = r.texto;
          else alvo.innerHTML = htmlResumo(comp, r);
        }
        const titulo = raiz.querySelector('[data-conteudo="selecionado"] h3');
        if (titulo && comp) titulo.textContent = descricao(comp);
        return;
      }
      desenharAba(aba);
    },
  };
}
