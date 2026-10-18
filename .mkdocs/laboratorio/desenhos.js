// Desenhos SVG dos componentes (originais deste repositório). Cada função devolve um texto SVG.
// Componentes soltos (placa, fontes, multímetro) são desenhados na origem; quem chama põe o
// transform. Os de encaixar são desenhados entre as posições das pernas, já no mundo.

import { CORES_DE_FIO, CORES_DE_LED, TIPOS, UNO_PASSO, textoDeResistencia } from "./catalogo.js";
import { dimensoes, furos, marcas, PASSO } from "./protoboard.js";

const FONTE = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const n = (v) => Math.round(v * 10) / 10;

export function esc(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function texto(x, y, conteudo, tamanho, extra = "") {
  return `<text x="${n(x)}" y="${n(y)}" font-size="${tamanho}" font-family="${FONTE}" ${extra}>${esc(conteudo)}</text>`;
}

// ---------- Protoboard ----------

const cacheDePlaca = new Map();

export function desenharProtoboard(tipo) {
  if (cacheDePlaca.has(tipo)) return cacheDePlaca.get(tipo);
  const { largura, altura } = dimensoes(tipo);
  const m = marcas(tipo);
  const partes = [
    `<rect x="0" y="0" width="${largura}" height="${altura}" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>`,
    `<rect x="${PASSO}" y="${m.yCanal - 5}" width="${largura - 2 * PASSO}" height="10" rx="3" fill="#e2e8f0"/>`,
  ];
  for (const f of m.faixas) {
    const cor = f.sinal === "+" ? "#dc2626" : "#2563eb";
    partes.push(`<line x1="${n(f.x1)}" y1="${n(f.y)}" x2="${n(f.x2)}" y2="${n(f.y)}" stroke="${cor}" stroke-width="1.6"/>`);
  }
  for (const [y, sinal] of [[PASSO, "+"], [2 * PASSO, "−"], [16 * PASSO, "−"], [17 * PASSO, "+"]]) {
    const cor = sinal === "+" ? "#dc2626" : "#2563eb";
    partes.push(texto(PASSO * 0.55, y + 3.5, sinal, 10, `fill="${cor}" font-weight="700" text-anchor="middle"`));
    partes.push(texto(largura - PASSO * 0.55, y + 3.5, sinal, 10, `fill="${cor}" font-weight="700" text-anchor="middle"`));
  }
  for (const l of m.linhas) {
    partes.push(texto(PASSO * 0.55, l.y + 3, l.texto, 8, 'fill="#64748b" text-anchor="middle"'));
    partes.push(texto(largura - PASSO * 0.55, l.y + 3, l.texto, 8, 'fill="#64748b" text-anchor="middle"'));
  }
  for (const y of m.yNumeros) {
    for (const c of m.numeros) partes.push(texto(c.x, y + 3, c.texto, 7, 'fill="#64748b" text-anchor="middle"'));
  }
  const furosSvg = furos(tipo).map((f) => `M${n(f.x - 2.6)} ${n(f.y - 2.6)}h5.2v5.2h-5.2z`).join("");
  partes.push(`<path d="${furosSvg}" fill="#475569"/>`);
  const svg = partes.join("");
  cacheDePlaca.set(tipo, svg);
  return svg;
}

// ---------- Arduino Uno (USB à esquerda) ----------

// placa: { L: pino 13 em HIGH, TX: a serial mandou algo agora } quando um programa está rodando.
export function desenharUno(placa = {}) {
  const p = [];
  p.push('<rect x="0" y="0" width="300" height="200" rx="12" fill="#0f766e" stroke="#115e59" stroke-width="2"/>');
  p.push('<rect x="-16" y="26" width="52" height="44" rx="3" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>');
  p.push('<rect x="-10" y="138" width="42" height="36" rx="3" fill="#111827"/>');
  p.push('<rect x="46" y="10" width="18" height="18" rx="3" fill="#e5e7eb"/><circle cx="55" cy="19" r="5.5" fill="#b91c1c"/>');
  p.push(texto(55, 40, "RESET", 7.5, 'fill="#ffffff" text-anchor="middle"'));
  p.push('<rect x="118" y="112" width="140" height="34" rx="3" fill="#111827"/>');
  for (let i = 0; i < 14; i++) {
    const cx = 124 + i * 9.5;
    p.push(`<rect x="${n(cx)}" y="108" width="4" height="4" fill="#d1d5db"/><rect x="${n(cx)}" y="146" width="4" height="4" fill="#d1d5db"/>`);
  }
  p.push(texto(188, 133, "ATmega328P", 10, 'fill="#e5e7eb" text-anchor="middle"'));
  p.push(texto(96, 96, "UNO", 22, 'fill="#ffffff" font-weight="700" text-anchor="middle"'));
  const aceso = { L: placa.L, TX: placa.TX, RX: placa.RX, ON: true };
  for (const [x, y, nome, cor] of [[84, 44, "L", "#fbbf24"], [84, 56, "TX", "#fbbf24"], [84, 68, "RX", "#fbbf24"], [262, 70, "ON", "#4ade80"]]) {
    if (aceso[nome]) p.push(`<circle cx="${x + 4.5}" cy="${y + 2.5}" r="7" fill="${cor}" opacity="0.45" pointer-events="none"/>`);
    p.push(`<rect x="${x}" y="${y}" width="9" height="5" rx="1" fill="${cor}" fill-opacity="${aceso[nome] ? 1 : 0.35}" data-led-da-placa="${nome}"/>`);
    p.push(texto(x + 13, y + 5, nome, 7, 'fill="#ffffff"'));
  }
  for (const [lado, x0, y] of [["cima", 98, 8], ["baixo", 110, 178]]) {
    const pinos = TIPOS["arduino-uno-r3"].terminais.filter((t) => t.lado === lado);
    const ultimo = Math.max(...pinos.map((t) => t.x));
    p.push(`<rect x="${n(x0 - 6)}" y="${y - 7}" width="${n(ultimo - x0 + 12 + UNO_PASSO / 2)}" height="14" rx="2" fill="#1f2937"/>`);
    for (const t of pinos) {
      p.push(`<rect x="${n(t.x - 2.5)}" y="${n(t.y - 2.5)}" width="5" height="5" fill="#9ca3af"/>`);
      const rotulo = esc(t.rotulo);
      if (lado === "cima") {
        p.push(`<text transform="rotate(-90 ${n(t.x + 2.5)} ${y + 11})" x="${n(t.x + 2.5)}" y="${y + 11}" font-size="7.5" fill="#ffffff" text-anchor="end" font-family="${FONTE}">${rotulo}</text>`);
      } else {
        p.push(`<text transform="rotate(-90 ${n(t.x + 2.5)} 168)" x="${n(t.x + 2.5)}" y="168" font-size="7.5" fill="#ffffff" text-anchor="start" font-family="${FONTE}">${rotulo}</text>`);
      }
    }
  }
  return p.join("");
}

// ---------- Fontes ----------

export function desenharPilhas(props) {
  const qtd = Math.min(4, Math.max(1, props.quantidade || 2));
  const p = ['<rect x="0" y="0" width="120" height="64" rx="6" fill="#1f2937"/>'];
  for (let i = 0; i < qtd; i++) {
    const x = 8 + i * 27;
    p.push(`<rect x="${x}" y="8" width="23" height="48" rx="4" fill="#facc15"/><rect x="${x}" y="8" width="23" height="9" rx="3" fill="#a16207"/>`);
    p.push(texto(x + 11.5, 15, "+", 7, 'fill="#ffffff" text-anchor="middle" font-weight="700"'));
  }
  p.push('<path d="M120 14 H140" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/><path d="M120 50 H140" stroke="#111827" stroke-width="3" stroke-linecap="round"/>');
  p.push(texto(60, 76, `${qtd} × AA · ${String(1.5 * qtd).replace(".", ",")} V`, 9, 'fill="currentColor" text-anchor="middle" class="lab-legenda"'));
  return p.join("");
}

export function desenharBateria9v() {
  return [
    '<rect x="0" y="0" width="64" height="104" rx="6" fill="#1e293b"/>',
    '<rect x="0" y="0" width="64" height="26" rx="6" fill="#475569"/>',
    texto(32, 66, "9V", 20, 'fill="#facc15" text-anchor="middle" font-weight="800"'),
    '<rect x="13" y="-8" width="14" height="10" rx="3" fill="#cbd5e1"/><polygon points="37,-8 51,-8 54,-3 51,2 37,2 34,-3" fill="#cbd5e1"/>',
    '<path d="M20 -8 V-18" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/><path d="M44 -8 V-18" stroke="#111827" stroke-width="3" stroke-linecap="round"/>',
    texto(20, 14, "+", 10, 'fill="#ffffff" text-anchor="middle" font-weight="700"'),
    texto(44, 14, "−", 10, 'fill="#ffffff" text-anchor="middle" font-weight="700"'),
  ].join("");
}

// ---------- Multímetro ----------

export function desenharMultimetro(props, leitura) {
  const modo = props.modo || "V";
  const tela = modo === "desligado" ? "" : leitura || "";
  return [
    '<rect x="0" y="0" width="112" height="150" rx="10" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>',
    '<rect x="8" y="10" width="96" height="40" rx="4" fill="#d9f99d" stroke="#3f6212"/>',
    texto(98, 37, tela, 15, 'fill="#1a2e05" text-anchor="end" font-weight="700" class="lab-mm-tela"'),
    '<circle cx="56" cy="88" r="22" fill="#374151"/>',
    `<g transform="rotate(${modo === "V" ? -40 : modo === "A" ? 40 : 0} 56 88)"><rect x="54" y="66" width="4" height="22" rx="2" fill="#f9fafb"/></g>`,
    texto(26, 72, "V", 11, `fill="${modo === "V" ? "#111827" : "#78350f"}" font-weight="700" text-anchor="middle"`),
    texto(86, 72, "A", 11, `fill="${modo === "A" ? "#111827" : "#78350f"}" font-weight="700" text-anchor="middle"`),
    texto(56, 122, "OFF", 9, `fill="${modo === "desligado" ? "#111827" : "#78350f"}" font-weight="700" text-anchor="middle"`),
    '<circle cx="36" cy="140" r="6" fill="#dc2626"/><circle cx="76" cy="140" r="6" fill="#111827"/>',
    '<path d="M36 146 V168" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/><path d="M76 146 V168" stroke="#111827" stroke-width="3" stroke-linecap="round"/>',
    texto(20, 160, "V/A", 7, 'fill="#78350f" text-anchor="middle"'),
    texto(92, 160, "COM", 7, 'fill="#78350f" text-anchor="middle"'),
  ].join("");
}

// ---------- Componentes de encaixar: entre as posições das pernas ----------

const CORES_DAS_FAIXAS = ["#111827", "#92400e", "#dc2626", "#f97316", "#facc15", "#16a34a", "#2563eb", "#7c3aed", "#6b7280", "#f9fafb"];
const OURO = "#d4a017";
const PRATA = "#c0c0c0";

// 220 Ω → vermelho, vermelho, marrom, ouro; 4,7 kΩ → amarelo, violeta, vermelho, ouro.
export function faixasDoResistor(ohms) {
  let expoente = Math.floor(Math.log10(ohms)) - 1;
  let digitos = Math.round(ohms / 10 ** expoente);
  if (digitos >= 100) {
    digitos = Math.round(digitos / 10);
    expoente += 1;
  }
  const multiplicador = expoente >= 0 ? CORES_DAS_FAIXAS[expoente] : expoente === -1 ? OURO : PRATA;
  return [CORES_DAS_FAIXAS[Math.floor(digitos / 10)], CORES_DAS_FAIXAS[digitos % 10], multiplicador, OURO];
}

function eixo(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const comprimento = Math.hypot(dx, dy) || 1;
  return { meio: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }, angulo: (Math.atan2(dy, dx) * 180) / Math.PI, comprimento };
}

function perna(p, alvo, cor = "#94a3b8") {
  return `<path d="M${n(p.x)} ${n(p.y)} L${n(alvo.x)} ${n(alvo.y)}" stroke="${cor}" stroke-width="2" stroke-linecap="round"/>`;
}

export function desenharResistor(p1, p2, props) {
  const { meio, angulo, comprimento } = eixo(p1, p2);
  const corpo = Math.min(34, Math.max(18, comprimento - 12));
  const faixas = faixasDoResistor(props.ohms);
  const x0 = -corpo / 2;
  const listras = faixas.map((cor, i) => `<rect x="${n(x0 + 5 + i * (corpo - 12) / 3.4 + (i === 3 ? 3 : 0))}" y="-5" width="3" height="10" fill="${cor}"/>`).join("");
  return [
    perna(p1, p2),
    `<g transform="translate(${n(meio.x)} ${n(meio.y)}) rotate(${n(angulo)})">`,
    `<rect x="${n(x0)}" y="-5.5" width="${n(corpo)}" height="11" rx="5" fill="#e7d3a8" stroke="#a8875a" stroke-width="0.8"/>`,
    listras,
    "</g>",
  ].join("");
}

export function desenharLed(pA, pK, props, estado = {}) {
  const cor = CORES_DE_LED[props.cor] || CORES_DE_LED.vermelho;
  const { meio, angulo, comprimento } = eixo(pA, pK);
  const brilho = estado.ligado ? estado.brilho || 0 : 0;
  const metade = comprimento / 2;
  const halo = brilho > 0
    ? `<circle cx="0" cy="-1" r="${n(11 + brilho * 13)}" fill="url(#lab-brilho-${props.cor})" opacity="${n(0.4 + 0.6 * brilho)}" pointer-events="none"/>`
    : "";
  // Cúpula vista de cima, sobre as próprias pernas (não cobre os furos vizinhos), com o lado chato
  // no cátodo (+x). Um "+" marca o ânodo, a perna longa.
  const cupula = "M4.6 -5.6 A6.6 6.6 0 1 0 4.6 3.6 Z";
  return [
    `<g transform="translate(${n(meio.x)} ${n(meio.y)}) rotate(${n(angulo)})">`,
    `<path d="M${n(-metade)} 0 L-4 0 M${n(metade)} 0 L4 0" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>`,
    halo,
    `<path d="${cupula}" fill="#f8fafc"/>`,
    `<path d="${cupula}" fill="${cor.cor}" fill-opacity="${estado.ligado ? 1 : 0.45}" stroke="${cor.cor}" stroke-width="1.3"/>`,
    estado.ligado ? `<circle cx="-1" cy="-1" r="${n(2 + brilho * 2)}" fill="${cor.luz}" opacity="0.9"/>` : "",
    '<circle cx="-3" cy="-3.5" r="1.5" fill="#ffffff" opacity="0.75"/>',
    `<text x="${n(-metade)}" y="-8" font-size="8" font-weight="700" text-anchor="middle" fill="#64748b" font-family="${FONTE}" pointer-events="none">+</text>`,
    "</g>",
  ].join("");
}

export function desenharInterruptor(p1, p2, props) {
  const { meio, angulo, comprimento } = eixo(p1, p2);
  const l = Math.max(24, comprimento - 4);
  const x = props.fechado ? l / 2 - 10 : -l / 2 + 2;
  return [
    perna(p1, p2),
    `<g transform="translate(${n(meio.x)} ${n(meio.y)}) rotate(${n(angulo)})">`,
    `<rect x="${n(-l / 2)}" y="-8" width="${n(l)}" height="16" rx="4" fill="#334155"/>`,
    `<rect x="${n(x)}" y="-6" width="8" height="12" rx="2" fill="${props.fechado ? "#22c55e" : "#e2e8f0"}"/>`,
    "</g>",
  ].join("");
}

export function desenharLdr(p1, p2, props) {
  const { meio, angulo } = eixo(p1, p2);
  const zigue = "M-6 -9 h4 v4 h-4 v4 h4 v4 h-4 v4";
  return [
    perna(p1, p2),
    `<g transform="translate(${n(meio.x)} ${n(meio.y)}) rotate(${n(angulo)})">`,
    '<circle cx="0" cy="-7" r="10" fill="#fde68a" stroke="#b45309" stroke-width="1"/>',
    `<path d="${zigue}" transform="translate(4 -2)" stroke="#b91c1c" stroke-width="1.4" fill="none"/>`,
    "</g>",
    texto(meio.x, meio.y + 14, `☀ ${props.luz} %`, 8, 'fill="currentColor" text-anchor="middle" class="lab-legenda"'),
  ].join("");
}

export function desenharPotenciometro(pts, props) {
  const lista = [pts["1"], pts.cursor, pts["3"]].filter(Boolean);
  const cx = lista.reduce((s, p) => s + p.x, 0) / lista.length;
  const cy = lista.reduce((s, p) => s + p.y, 0) / lista.length - 16;
  const angulo = -135 + 2.7 * props.posicao;
  return [
    ...lista.map((p) => perna(p, { x: cx + (p.x - cx) * 0.5, y: cy + 10 })),
    `<rect x="${n(cx - 15)}" y="${n(cy - 13)}" width="30" height="26" rx="4" fill="#1d4ed8"/>`,
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="9.5" fill="#e2e8f0" stroke="#64748b"/>`,
    `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(cx)}" y2="${n(cy - 8.5)}" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round" transform="rotate(${n(angulo)} ${n(cx)} ${n(cy)})"/>`,
  ].join("");
}

export function desenharBotao(pts, props) {
  const lista = ["1a", "2a", "1b", "2b"].map((k) => pts[k]).filter(Boolean);
  const cx = lista.reduce((s, p) => s + p.x, 0) / lista.length;
  const cy = lista.reduce((s, p) => s + p.y, 0) / lista.length;
  return [
    ...lista.map((p) => perna(p, { x: cx + (p.x - cx) * 0.55, y: cy + (p.y - cy) * 0.55 })),
    `<rect x="${n(cx - 13)}" y="${n(cy - 13)}" width="26" height="26" rx="3" fill="#334155"/>`,
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="${props.apertado ? 7 : 8.5}" fill="${props.apertado ? "#991b1b" : "#ef4444"}" stroke="#7f1d1d"/>`,
  ].join("");
}

// ---------- Fios ----------

export function caminhoDoFio(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const d = Math.hypot(dx, dy);
  if (d < 60) return `M${n(p1.x)} ${n(p1.y)} L${n(p2.x)} ${n(p2.y)}`;
  // Curva suave, que sobe um pouco no meio (fica mais fácil de seguir com o olho).
  const curva = Math.min(48, d / 5);
  let [nx, ny] = [-dy / d, dx / d];
  if (ny > 0) [nx, ny] = [-nx, -ny];
  const c1 = { x: p1.x + dx / 3 + nx * curva, y: p1.y + dy / 3 + ny * curva };
  const c2 = { x: p1.x + (2 * dx) / 3 + nx * curva, y: p1.y + (2 * dy) / 3 + ny * curva };
  return `M${n(p1.x)} ${n(p1.y)} C${n(c1.x)} ${n(c1.y)} ${n(c2.x)} ${n(c2.y)} ${n(p2.x)} ${n(p2.y)}`;
}

export function desenharFio(p1, p2, cor) {
  const d = caminhoDoFio(p1, p2);
  const tinta = CORES_DE_FIO[cor] || CORES_DE_FIO.preto;
  return [
    `<path d="${d}" stroke="#ffffff" stroke-opacity="0.75" stroke-width="5.5" fill="none" stroke-linecap="round"/>`,
    `<path d="${d}" stroke="${tinta}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    `<circle cx="${n(p1.x)}" cy="${n(p1.y)}" r="2.6" fill="${tinta}"/><circle cx="${n(p2.x)}" cy="${n(p2.y)}" r="2.6" fill="${tinta}"/>`,
  ].join("");
}

// Gradientes do brilho dos LEDs (vão uma vez no <defs>).
export function definicoes() {
  return Object.entries(CORES_DE_LED).map(([nome, c]) =>
    `<radialGradient id="lab-brilho-${nome}"><stop offset="0" stop-color="${c.luz}" stop-opacity="1"/><stop offset="0.45" stop-color="${c.cor}" stop-opacity="0.55"/><stop offset="1" stop-color="${c.cor}" stop-opacity="0"/></radialGradient>`,
  ).join("");
}

export { textoDeResistencia };
