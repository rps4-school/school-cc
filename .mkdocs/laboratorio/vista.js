// Desenha o circuito: placas, componentes, fios e as marcas por cima (seleção, furos ligados,
// prévia do encaixe, fio sendo puxado e os avisos). Só monta texto SVG; quem põe na tela é o app.

import { descricao, rotulo, terminaisDoTipo, TIPOS } from "./catalogo.js";
import { formatar } from "./circuito.js";
import {
  desenharBateria9v, desenharBotao, desenharFio, desenharInterruptor, desenharLdr, desenharLed, desenharMultimetro,
  desenharPilhas, desenharPotenciometro, desenharProtoboard, desenharResistor, desenharUno, esc,
} from "./desenhos.js";
import { caixa, porId, posicaoDoTerminal, posicoesDoComponente } from "./geometria.js";
import { ehProtoboard, nomeDoFuro } from "./protoboard.js";
import { separarTerminal } from "./projeto.js";

const n = (v) => Math.round(v * 10) / 10;

// "Bateria, polo +" / "Protoboard, coluna 5, linha a" / "R1, perna 2".
export function nomeDoTerminal(projeto, ref) {
  const [id, pino] = separarTerminal(ref);
  const comp = porId(projeto, id);
  if (!comp) return ref;
  if (ehProtoboard(comp.type)) return `${rotulo(comp)}, ${nomeDoFuro(pino)}`;
  const t = terminaisDoTipo(comp.type).find((x) => x.id === pino);
  return `${rotulo(comp)}, ${t ? t.nome : pino}`;
}

function transformDoLivre(comp) {
  return `translate(${n(comp.x)} ${n(comp.y)})${comp.rot ? ` rotate(${comp.rot})` : ""}`;
}

function rotuloAcessivel(projeto, comp, analise) {
  let texto = descricao(comp);
  const r = analise && analise.componentes[comp.id];
  if (comp.type === "led" && r) texto += r.ligado ? ", aceso" : ", apagado";
  if (comp.type === "multimetro" && r) texto += `, mostra ${r.texto}`;
  const pernas = Object.entries(comp.mount || {}).map(([p, f]) => `${nomeDoTerminal(projeto, `${comp.id}:${p}`).split(", ").slice(1).join(", ")} em ${nomeDoTerminal(projeto, f)}`);
  if (pernas.length) texto += `. Encaixado: ${pernas.join("; ")}`;
  else if (!TIPOS[comp.type].livre && !ehProtoboard(comp.type)) texto += ". Solto, fora da protoboard";
  return texto;
}

function desenhoDoComponente(projeto, comp, analise, estado = {}) {
  const p = comp.props || {};
  const r = (analise && analise.componentes[comp.id]) || {};
  const pts = posicoesDoComponente(projeto, comp);
  switch (comp.type) {
    case "protoboard-400":
    case "protoboard-830":
      return `<g transform="translate(${n(comp.x)} ${n(comp.y)})">${desenharProtoboard(comp.type)}</g>`;
    case "arduino-uno-r3":
      return `<g transform="${transformDoLivre(comp)}">${desenharUno(estado.placa)}</g>`;
    case "pilhas":
      return `<g transform="${transformDoLivre(comp)}">${desenharPilhas(p)}</g>`;
    case "bateria-9v":
      return `<g transform="${transformDoLivre(comp)}">${desenharBateria9v()}</g>`;
    case "multimetro":
      return `<g transform="${transformDoLivre(comp)}">${desenharMultimetro(p, r.texto)}</g>`;
    case "resistor":
      return desenharResistor(pts["1"], pts["2"], p);
    case "led":
      return desenharLed(pts.anodo, pts.catodo, p, r);
    case "interruptor":
      return desenharInterruptor(pts["1"], pts["2"], p);
    case "ldr":
      return desenharLdr(pts["1"], pts["2"], p);
    case "potenciometro":
      return desenharPotenciometro(pts, p);
    case "botao":
      return desenharBotao(pts, p);
    default:
      return "";
  }
}

// Alvos dos terminais que não são furos: pinos do Uno, polos, pontas do multímetro e pernas soltas.
function alvosDosTerminais(projeto, comp) {
  if (ehProtoboard(comp.type)) return "";
  const pts = posicoesDoComponente(projeto, comp);
  return terminaisDoTipo(comp.type)
    .filter((t) => !(comp.mount && comp.mount[t.id]))
    .map((t) => {
      const p = pts[t.id];
      return p ? `<circle class="lab-terminal" data-term="${esc(`${comp.id}:${t.id}`)}" cx="${n(p.x)}" cy="${n(p.y)}" r="5.5"><title>${esc(nomeDoTerminal(projeto, `${comp.id}:${t.id}`))}</title></circle>` : "";
    })
    .join("");
}

export function desenharMundo(estado) {
  const { projeto, analise } = estado;
  const ordem = (c) => (ehProtoboard(c.type) ? 0 : TIPOS[c.type].livre ? 1 : 2);
  const comps = [...projeto.components].sort((a, b) => ordem(a) - ordem(b));
  const partes = comps.map((c) => {
    const corpo = desenhoDoComponente(projeto, c, analise, estado);
    const nome = esc(ehProtoboard(c.type) ? `${rotulo(c)} (${TIPOS[c.type].nome})` : rotuloAcessivel(projeto, c, analise));
    return `<g class="lab-comp" data-comp="${esc(c.id)}" tabindex="0" role="button" aria-label="${nome}">${corpo}${alvosDosTerminais(projeto, c)}</g>`;
  });
  for (const fio of projeto.connections) {
    const p1 = posicaoDoTerminal(projeto, fio.from);
    const p2 = posicaoDoTerminal(projeto, fio.to);
    if (!p1 || !p2) continue;
    const nome = esc(`Fio ${fio.color}: de ${nomeDoTerminal(projeto, fio.from)} até ${nomeDoTerminal(projeto, fio.to)}`);
    partes.push(`<g class="lab-fio" data-fio="${esc(fio.id)}" tabindex="0" role="button" aria-label="${nome}">` +
      `<path d="M${n(p1.x)} ${n(p1.y)} L${n(p2.x)} ${n(p2.y)}" class="lab-fio-alvo"/>${desenharFio(p1, p2, fio.color)}</g>`);
  }
  return partes.join("");
}

const CORES_DO_NIVEL = { erro: "#dc2626", aviso: "#d97706", dica: "#2563eb" };

// Marcas por cima de tudo: furos ligados ao terminal apontado, seleção, prévia do encaixe, fio em curso e avisos.
export function desenharMarcas(estado) {
  const { projeto, analise, diagnosticos = [], selecao, destaque, previa, fioEmCurso } = estado;
  const partes = [];
  if (destaque && analise) {
    const rede = analise.redes.rede(destaque);
    if (rede >= 0) {
      for (const ref of analise.redes.redes[rede]) {
        const p = posicaoDoTerminal(projeto, ref);
        if (p) partes.push(`<circle class="lab-ligado" cx="${n(p.x)}" cy="${n(p.y)}" r="5"/>`);
      }
      const p = posicaoDoTerminal(projeto, destaque);
      const v = analise.tensaoDaRede(rede);
      if (p) {
        const texto = `${nomeDoTerminal(projeto, destaque)}${v === null ? "" : ` · ${formatar(v, "V")}`}`;
        partes.push(`<g class="lab-dica-furo" transform="translate(${n(p.x + 10)} ${n(p.y - 12)})"><rect x="-4" y="-11" width="${n(texto.length * 5.6 + 8)}" height="16" rx="4"/><text x="0" y="0">${esc(texto)}</text></g>`);
      }
    }
  }
  if (previa) {
    for (const ref of previa.furos) {
      const p = posicaoDoTerminal(projeto, ref);
      if (p) partes.push(`<circle class="${previa.ok ? "lab-previa" : "lab-previa lab-previa-ruim"}" cx="${n(p.x)}" cy="${n(p.y)}" r="6"/>`);
    }
  }
  if (selecao && selecao.tipo === "comp") {
    const comp = porId(projeto, selecao.id);
    if (comp) {
      const b = caixa(projeto, comp);
      partes.push(`<rect class="lab-selecao" x="${n(b.x - 4)}" y="${n(b.y - 4)}" width="${n(b.largura + 8)}" height="${n(b.altura + 8)}" rx="6"/>`);
    }
  }
  if (selecao && selecao.tipo === "fio") {
    const fio = projeto.connections.find((f) => f.id === selecao.id);
    if (fio) {
      for (const ref of [fio.from, fio.to]) {
        const p = posicaoDoTerminal(projeto, ref);
        if (p) partes.push(`<circle class="lab-selecao-ponta" cx="${n(p.x)}" cy="${n(p.y)}" r="7"/>`);
      }
    }
  }
  if (fioEmCurso) {
    const p = posicaoDoTerminal(projeto, fioEmCurso.de);
    if (p) {
      partes.push(`<circle class="lab-previa" cx="${n(p.x)}" cy="${n(p.y)}" r="6"/>`);
      if (fioEmCurso.ate) partes.push(`<path class="lab-fio-em-curso" d="M${n(p.x)} ${n(p.y)} L${n(fioEmCurso.ate.x)} ${n(fioEmCurso.ate.y)}"/>`);
    }
  }
  // Um selo por componente, com a cor do aviso mais grave.
  const pior = new Map();
  for (const d of diagnosticos) {
    for (const id of d.ids) if (!pior.has(id)) pior.set(id, d.nivel);
  }
  for (const [id, nivel] of pior) {
    const comp = porId(projeto, id);
    if (!comp || ehProtoboard(comp.type)) continue;
    const b = caixa(projeto, comp);
    partes.push(`<g class="lab-selo" transform="translate(${n(b.x + b.largura)} ${n(b.y)})"><circle r="7.5" fill="${CORES_DO_NIVEL[nivel]}"/><text y="3.5" text-anchor="middle">!</text></g>`);
  }
  return partes.join("");
}
