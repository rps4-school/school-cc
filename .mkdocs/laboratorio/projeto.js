// Formato do projeto do laboratório (schema 1): validar, normalizar, migrar e serializar.
//
// A elétrica não usa coordenadas: ela vem dos fios (connections) e das pernas encaixadas em furos
// (mount). x e y só dizem onde desenhar. Terminal é "componente:pino", como "uno:D8" ou "pb:a12".

import { CORES_DE_FIO, CORES_DE_LED, propsPadrao, terminaisDoTipo, TIPOS } from "./catalogo.js";
import { ehProtoboard, existeFuro } from "./protoboard.js";

export const VERSAO = 1;
const ID = /^[A-Za-z][A-Za-z0-9_-]{0,39}$/;
const ROTACOES = [0, 90, 180, 270];

// Mudanças de formato entre versões: MIGRACOES[n] leva um projeto da versão n para a n + 1.
const MIGRACOES = {};

export function separarTerminal(ref) {
  const i = typeof ref === "string" ? ref.indexOf(":") : -1;
  return i > 0 ? [ref.slice(0, i), ref.slice(i + 1)] : [null, null];
}

export function terminalExiste(projeto, ref) {
  const [id, pino] = separarTerminal(ref);
  const comp = id && projeto.components.find((c) => c.id === id);
  if (!comp) return false;
  if (ehProtoboard(comp.type)) return existeFuro(comp.type, pino);
  return terminaisDoTipo(comp.type).some((t) => t.id === pino);
}

export function projetoVazio(titulo = "Meu circuito") {
  return {
    schemaVersion: VERSAO,
    id: "meu-circuito",
    title: titulo,
    components: [{ id: "pb1", type: "protoboard-400", x: 360, y: 40 }],
    connections: [],
  };
}

// Leva um projeto antigo até a versão atual. Versão mais nova que a deste site: erro.
export function migrar(dados) {
  const v = dados.schemaVersion;
  if (!Number.isInteger(v) || v < 1) throw new Error("schemaVersion ausente ou inválido.");
  if (v > VERSAO) {
    throw new Error(`Este projeto foi feito numa versão mais nova do laboratório (schema ${v}). Atualize a página e tente de novo.`);
  }
  let atual = dados;
  for (let n = v; n < VERSAO; n++) atual = MIGRACOES[n](atual);
  return atual;
}

function numero(valor, padrao) {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : padrao;
}

// Confere e completa um projeto. Devolve { ok, erros, projeto }: os erros vêm em português, com o caminho
// do campo, e o projeto só vale se ok.
export function validar(dados) {
  const erros = [];
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return { ok: false, erros: ["O arquivo não é um projeto do laboratório (esperava um objeto JSON)."], projeto: null };
  }
  let base;
  try {
    base = migrar(dados);
  } catch (e) {
    return { ok: false, erros: [e.message], projeto: null };
  }
  const projeto = {
    ...base,
    schemaVersion: VERSAO,
    id: typeof base.id === "string" && base.id ? base.id : "projeto",
    title: typeof base.title === "string" && base.title ? base.title : "Circuito sem nome",
    components: [],
    connections: [],
  };
  if (!Array.isArray(base.components)) erros.push("components: precisa ser uma lista.");
  if (base.connections !== undefined && !Array.isArray(base.connections)) erros.push("connections: precisa ser uma lista.");

  const ids = new Set();
  (Array.isArray(base.components) ? base.components : []).forEach((c, i) => {
    const onde = `components[${i}]`;
    if (!c || typeof c !== "object") return erros.push(`${onde}: precisa ser um objeto.`);
    if (typeof c.id !== "string" || !ID.test(c.id)) return erros.push(`${onde}.id: use letras, números, - ou _ (começando por letra).`);
    if (ids.has(c.id)) return erros.push(`${onde}.id: "${c.id}" repetido.`);
    ids.add(c.id);
    if (!TIPOS[c.type]) return erros.push(`${onde}.type: tipo desconhecido "${c.type}".`);
    const rot = numero(c.rot, 0);
    if (!ROTACOES.includes(rot)) erros.push(`${onde}.rot: use 0, 90, 180 ou 270.`);
    const props = { ...propsPadrao(c.type), ...(c.props && typeof c.props === "object" ? c.props : {}) };
    const comp = { id: c.id, type: c.type, x: numero(c.x, 0), y: numero(c.y, 0) };
    if (rot) comp.rot = rot;
    if (Object.keys(props).length) comp.props = props;
    if (c.mount !== undefined) comp.mount = c.mount;
    projeto.components.push(comp);
    validarProps(comp, onde, erros);
  });

  // Encaixes: depois de conhecer todos os componentes (o furo é de uma protoboard do projeto).
  const ocupados = new Map();
  projeto.components.forEach((comp, i) => {
    if (comp.mount === undefined) return;
    const onde = `components[${i}].mount`;
    if (!comp.mount || typeof comp.mount !== "object" || Array.isArray(comp.mount)) {
      erros.push(`${onde}: precisa ser um objeto { pino: "protoboard:furo" }.`);
      delete comp.mount;
      return;
    }
    if (TIPOS[comp.type].livre || TIPOS[comp.type].placa) {
      erros.push(`${onde}: ${TIPOS[comp.type].nome} não encaixa na protoboard (ligue com fios).`);
      return;
    }
    const pinos = terminaisDoTipo(comp.type).map((t) => t.id);
    for (const [pino, furo] of Object.entries(comp.mount)) {
      if (!pinos.includes(pino)) erros.push(`${onde}.${pino}: ${TIPOS[comp.type].nome} não tem o pino "${pino}".`);
      const [placa, nome] = separarTerminal(furo);
      const alvo = projeto.components.find((x) => x.id === placa);
      if (!alvo || !ehProtoboard(alvo.type)) erros.push(`${onde}.${pino}: "${furo}" não é furo de uma protoboard do projeto.`);
      else if (!existeFuro(alvo.type, nome)) erros.push(`${onde}.${pino}: a protoboard ${placa} não tem o furo "${nome}".`);
      else if (ocupados.has(furo)) erros.push(`${onde}.${pino}: o furo ${furo} já tem a perna de ${ocupados.get(furo)}.`);
      else ocupados.set(furo, comp.id);
    }
  });

  const idsDeFio = new Set();
  (Array.isArray(base.connections) ? base.connections : []).forEach((f, i) => {
    const onde = `connections[${i}]`;
    if (!f || typeof f !== "object") return erros.push(`${onde}: precisa ser um objeto.`);
    const id = typeof f.id === "string" && ID.test(f.id) ? f.id : `w${i + 1}`;
    if (idsDeFio.has(id) || ids.has(id)) return erros.push(`${onde}.id: "${id}" repetido.`);
    idsDeFio.add(id);
    for (const ponta of ["from", "to"]) {
      if (!terminalExiste(projeto, f[ponta])) erros.push(`${onde}.${ponta}: terminal "${f[ponta]}" não existe.`);
    }
    if (f.from === f.to) erros.push(`${onde}: o fio começa e termina no mesmo terminal.`);
    const cor = CORES_DE_FIO[f.color] ? f.color : "preto";
    projeto.connections.push({ id, from: f.from, to: f.to, color: cor });
  });

  return { ok: erros.length === 0, erros, projeto: erros.length === 0 ? projeto : null };
}

function validarProps(comp, onde, erros) {
  const p = comp.props || {};
  const faixa = (campo, min, max) => {
    if (typeof p[campo] !== "number" || !(p[campo] >= min && p[campo] <= max)) {
      erros.push(`${onde}.props.${campo}: use um número de ${min} a ${max}.`);
    }
  };
  switch (comp.type) {
    case "resistor": faixa("ohms", 0.1, 1e7); break;
    case "potenciometro": faixa("ohms", 100, 1e7); faixa("posicao", 0, 100); break;
    case "ldr": faixa("luz", 0, 100); break;
    case "pilhas": faixa("quantidade", 1, 4); break;
    case "led":
      if (!CORES_DE_LED[p.cor]) erros.push(`${onde}.props.cor: use ${Object.keys(CORES_DE_LED).join(", ")}.`);
      break;
    case "multimetro":
      if (!["V", "A", "desligado"].includes(p.modo)) erros.push(`${onde}.props.modo: use "V", "A" ou "desligado".`);
      break;
    default:
  }
}

// JSON com as chaves numa ordem fixa (fica fácil de ler e de comparar no Git).
const ORDEM = ["schemaVersion", "id", "title", "level", "board", "components", "connections", "sketch", "variantes", "capabilities", "metadata"];
const ORDEM_COMP = ["id", "type", "x", "y", "rot", "props", "mount"];

function ordenar(obj, ordem) {
  const saida = {};
  for (const k of ordem) if (obj[k] !== undefined) saida[k] = obj[k];
  for (const k of Object.keys(obj)) if (!(k in saida) && obj[k] !== undefined) saida[k] = obj[k];
  return saida;
}

export function serializar(projeto) {
  const p = ordenar(projeto, ORDEM);
  p.components = projeto.components.map((c) => ordenar({ ...c, x: Math.round(c.x), y: Math.round(c.y) }, ORDEM_COMP));
  p.connections = projeto.connections.map((f) => ordenar(f, ["id", "from", "to", "color"]));
  return `${JSON.stringify(p, null, 2)}\n`;
}

export function copiar(projeto) {
  return JSON.parse(JSON.stringify(projeto));
}

// Próximo id livre com o prefixo: "r1", "r2"...
export function novoId(projeto, prefixo) {
  const usados = new Set(projeto.components.map((c) => c.id).concat(projeto.connections.map((f) => f.id)));
  for (let n = 1; ; n++) if (!usados.has(`${prefixo}${n}`)) return `${prefixo}${n}`;
}
