// Catálogo de componentes: terminais, onde as pernas caem na protoboard, propriedades e o que
// cada um faz no circuito. O desenho fica em desenhos.js; a elétrica, em circuito.js.

import { MODELOS, PASSO } from "./protoboard.js";

export const CORES_DE_LED = {
  vermelho: { nome: "vermelho", vf: 2.0, cor: "#ef4444", luz: "#fecaca" },
  amarelo: { nome: "amarelo", vf: 2.1, cor: "#eab308", luz: "#fef08a" },
  verde: { nome: "verde", vf: 2.2, cor: "#22c55e", luz: "#bbf7d0" },
  azul: { nome: "azul", vf: 3.0, cor: "#3b82f6", luz: "#bfdbfe" },
  branco: { nome: "branco", vf: 3.0, cor: "#e2e8f0", luz: "#ffffff" },
};

export const CORES_DE_FIO = {
  preto: "#111827",
  vermelho: "#dc2626",
  azul: "#2563eb",
  verde: "#16a34a",
  amarelo: "#ca8a04",
  laranja: "#ea580c",
  branco: "#d1d5db",
  roxo: "#7c3aed",
};

// Valores comerciais da série E12, de 10 Ω a 1 MΩ.
const E12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
export const RESISTORES = [1, 10, 100, 1000, 10000].flatMap((d) => E12.map((v) => v * d)).concat([1000000]);
export const POTENCIOMETROS = [1000, 10000, 100000];

// Placa Uno vista de cima, com a USB à esquerda: os conectores de cima (digitais) e de baixo
// (alimentação e analógicos). null é o espaço entre os dois blocos de cada conector.
const UNO_DIGITAIS = ["AREF", "GND.1", "13", "12", "~11", "~10", "~9", "8", null, "7", "~6", "~5", "4", "~3", "2", "TX 1", "RX 0"];
const UNO_ENERGIA = ["IOREF", "RESET", "3.3V", "5V", "GND.2", "GND.3", "VIN", null, "A0", "A1", "A2", "A3", "A4", "A5"];
export const UNO_PASSO = 11.5;

function pinosDoUno() {
  const pinos = [];
  for (const [nomes, x0, y, lado] of [[UNO_DIGITAIS, 98, 8, "cima"], [UNO_ENERGIA, 110, 178, "baixo"]]) {
    nomes.forEach((rotulo, i) => {
      if (!rotulo) return;
      let id = rotulo.replace("~", "").replace("TX ", "").replace("RX ", "");
      if (/^\d+$/.test(id)) id = `D${id}`;
      const rot = rotulo.startsWith("GND") ? "GND" : rotulo;
      pinos.push({ id, nome: nomeDoPinoDoUno(id), rotulo: rot, x: x0 + i * UNO_PASSO, y, lado, pwm: rotulo.startsWith("~") });
    });
  }
  return pinos;
}

function nomeDoPinoDoUno(id) {
  if (/^D\d+$/.test(id)) return `pino ${id.slice(1)}`;
  if (/^A\d$/.test(id)) return `pino ${id}`;
  if (id.startsWith("GND")) return `GND (${id.slice(4)})`;
  return id;
}

export const TIPOS = {
  "protoboard-400": {
    nome: MODELOS["protoboard-400"].nome, categoria: "Placas", prefixo: "pb", placa: true,
    descricao: "30 colunas; barramentos inteiros",
  },
  "protoboard-830": {
    nome: MODELOS["protoboard-830"].nome, categoria: "Placas", prefixo: "pb", placa: true,
    descricao: "63 colunas; barramentos divididos no meio",
  },
  "arduino-uno-r3": {
    nome: "Arduino Uno R3", categoria: "Placas", prefixo: "uno", livre: true, largura: 300, altura: 200,
    terminais: pinosDoUno(),
    descricao: "5V, 3.3V e GND alimentam o circuito",
  },
  pilhas: {
    nome: "Pilhas AA", categoria: "Fontes", prefixo: "pilhas", livre: true, largura: 120, altura: 64,
    terminais: [{ id: "+", nome: "polo +", x: 140, y: 14 }, { id: "-", nome: "polo −", x: 140, y: 50 }],
    props: { quantidade: 2 },
    descricao: "1,5 V cada, em série",
  },
  "bateria-9v": {
    nome: "Bateria de 9 V", categoria: "Fontes", prefixo: "bat", livre: true, largura: 64, altura: 104,
    terminais: [{ id: "+", nome: "polo +", x: 20, y: -18 }, { id: "-", nome: "polo −", x: 44, y: -18 }],
    descricao: "9 V",
  },
  resistor: {
    nome: "Resistor", categoria: "Componentes", prefixo: "r",
    terminais: [{ id: "1", nome: "perna 1" }, { id: "2", nome: "perna 2" }],
    pegada: [[0, 0], [4, 0]],
    props: { ohms: 220 },
    descricao: "Limita a corrente",
  },
  led: {
    nome: "LED", categoria: "Componentes", prefixo: "led",
    terminais: [{ id: "anodo", nome: "ânodo (+, perna longa)" }, { id: "catodo", nome: "cátodo (−, perna curta)" }],
    pegada: [[0, 0], [1, 0]],
    props: { cor: "vermelho" },
    descricao: "Acende com a corrente no sentido certo",
  },
  interruptor: {
    nome: "Interruptor", categoria: "Componentes", prefixo: "s",
    terminais: [{ id: "1", nome: "terminal 1" }, { id: "2", nome: "terminal 2" }],
    pegada: [[0, 0], [2, 0]],
    props: { fechado: false },
    descricao: "Liga e desliga o caminho",
  },
  botao: {
    nome: "Botão de 4 pinos", categoria: "Componentes", prefixo: "bt",
    terminais: [
      { id: "1a", nome: "pino 1a" }, { id: "2a", nome: "pino 2a" },
      { id: "1b", nome: "pino 1b (ligado ao 1a)" }, { id: "2b", nome: "pino 2b (ligado ao 2a)" },
    ],
    pegada: [[0, 0], [2, 0], [0, 1], [2, 1]],
    props: { apertado: false },
    descricao: "Os pares 1 e 2 se ligam quando aperta",
  },
  potenciometro: {
    nome: "Potenciômetro", categoria: "Componentes", prefixo: "pot",
    terminais: [{ id: "1", nome: "terminal 1" }, { id: "cursor", nome: "cursor (meio)" }, { id: "3", nome: "terminal 3" }],
    pegada: [[0, 0], [1, 0], [2, 0]],
    props: { ohms: 10000, posicao: 50 },
    descricao: "Divisor de tensão ajustável",
  },
  ldr: {
    nome: "LDR (sensor de luz)", categoria: "Componentes", prefixo: "ldr",
    terminais: [{ id: "1", nome: "perna 1" }, { id: "2", nome: "perna 2" }],
    pegada: [[0, 0], [2, 0]],
    props: { luz: 50 },
    descricao: "A resistência cai com a luz",
  },
  "led-rgb": {
    nome: "LED RGB", categoria: "Componentes", prefixo: "rgb",
    terminais: [
      { id: "r", nome: "vermelho (R)" }, { id: "comum", nome: "comum (cátodo, a perna mais longa)" },
      { id: "g", nome: "verde (G)" }, { id: "b", nome: "azul (B)" },
    ],
    pegada: [[0, 0], [1, 0], [2, 0], [3, 0]],
    descricao: "Três LEDs num só, com o cátodo comum",
  },
  buzzer: {
    nome: "Buzzer", categoria: "Atuadores", prefixo: "bz",
    terminais: [{ id: "+", nome: "positivo (+, a perna longa)" }, { id: "-", nome: "negativo (−)" }],
    pegada: [[0, 0], [2, 0]],
    props: { som: false },
    descricao: "Piezo passivo: toca a frequência do tone()",
  },
  servo: {
    nome: "Servo motor", categoria: "Atuadores", prefixo: "servo", livre: true, largura: 96, altura: 56,
    terminais: [
      { id: "gnd", nome: "fio marrom (GND)", x: -36, y: 16 }, { id: "vcc", nome: "fio vermelho (5V)", x: -36, y: 28 },
      { id: "sinal", nome: "fio laranja (sinal)", x: -36, y: 40 },
    ],
    descricao: "Gira de 0° a 180° conforme o pulso",
  },
  pir: {
    nome: "Sensor de movimento (PIR)", categoria: "Sensores", prefixo: "pir",
    terminais: [{ id: "vcc", nome: "VCC (5V)" }, { id: "saida", nome: "OUT (saída)" }, { id: "gnd", nome: "GND" }],
    pegada: [[0, 0], [1, 0], [2, 0]],
    props: { movimento: false },
    descricao: "Saída em HIGH quando há movimento",
  },
  hcsr04: {
    nome: "Sensor ultrassônico (HC-SR04)", categoria: "Sensores", prefixo: "us",
    terminais: [{ id: "vcc", nome: "VCC (5V)" }, { id: "trig", nome: "Trig" }, { id: "eco", nome: "Echo" }, { id: "gnd", nome: "GND" }],
    pegada: [[0, 0], [1, 0], [2, 0], [3, 0]],
    props: { distancia: 50 },
    descricao: "Mede distâncias de 2 cm a 4 m pelo eco",
  },
  multimetro: {
    nome: "Multímetro", categoria: "Medição", prefixo: "mm", livre: true, largura: 112, altura: 150,
    terminais: [{ id: "vermelha", nome: "ponta vermelha (V/A)", x: 36, y: 168 }, { id: "preta", nome: "ponta preta (COM)", x: 76, y: 168 }],
    props: { modo: "V" },
    descricao: "Mede tensão (V) ou corrente (A)",
  },
};

export const MODOS_DO_MULTIMETRO = { V: "tensão (V)", A: "corrente (A)", desligado: "desligado" };

export function tipo(nome) {
  return TIPOS[nome] || null;
}

export function terminaisDoTipo(nome) {
  const t = TIPOS[nome];
  return t && t.terminais ? t.terminais : [];
}

export function propsPadrao(nome) {
  const t = TIPOS[nome];
  return t && t.props ? { ...t.props } : {};
}

// Pegada girada: [dColuna, dLinha] de cada terminal, para 0, 90, 180 ou 270 graus (sentido horário).
export function pegada(nome, rot = 0) {
  const t = TIPOS[nome];
  if (!t || !t.pegada) return null;
  return t.pegada.map(([dc, dl]) => {
    switch (((rot % 360) + 360) % 360) {
      case 90: return [-dl, dc];
      case 180: return [-dc, -dl];
      case 270: return [dl, -dc];
      default: return [dc, dl];
    }
  });
}

// Posição de um terminal de componente solto (não encaixado), girada em torno da origem do componente.
export function posicaoLivre(comp, terminal) {
  const t = TIPOS[comp.type];
  let dx;
  let dy;
  if (t.livre) {
    const def = t.terminais.find((x) => x.id === terminal);
    if (!def) return null;
    dx = def.x;
    dy = def.y;
  } else if (t.pegada) {
    const i = t.terminais.findIndex((x) => x.id === terminal);
    if (i < 0) return null;
    [dx, dy] = t.pegada[i].map((v) => v * PASSO);
  } else {
    return null;
  }
  const rot = (((comp.rot || 0) % 360) + 360) % 360;
  const [rx, ry] = rot === 90 ? [-dy, dx] : rot === 180 ? [-dx, -dy] : rot === 270 ? [dy, -dx] : [dx, dy];
  return { x: (comp.x || 0) + rx, y: (comp.y || 0) + ry };
}

// Ligações por dentro do componente, que dependem do estado (chave fechada, botão apertado).
export function ligacoesInternas(comp) {
  const p = comp.props || {};
  switch (comp.type) {
    case "arduino-uno-r3":
      return [["GND.1", "GND.2"], ["GND.1", "GND.3"], ["IOREF", "5V"]];
    case "interruptor":
      return p.fechado ? [["1", "2"]] : [];
    case "botao":
      return [["1a", "1b"], ["2a", "2b"]].concat(p.apertado ? [["1a", "2a"]] : []);
    default:
      return [];
  }
}

// Nome curto para mostrar ao aluno: "R1", "LED2", "Bateria 1".
export function rotulo(comp) {
  const n = String(comp.id).match(/(\d+)$/);
  const numero = n ? n[1] : "";
  switch (comp.type) {
    case "resistor": return `R${numero}`;
    case "led": return `LED${numero}`;
    case "interruptor": return `S${numero}`;
    case "botao": return `Botão ${numero}`.trim();
    case "potenciometro": return `Pot${numero}`;
    case "ldr": return `LDR${numero}`;
    case "multimetro": return `Multímetro ${numero}`.trim();
    case "led-rgb": return `RGB${numero}`;
    case "buzzer": return `Buzzer ${numero}`.trim();
    case "servo": return `Servo ${numero}`.trim();
    case "pir": return `PIR ${numero}`.trim();
    case "hcsr04": return `Ultrassom ${numero}`.trim();
    case "pilhas": return `Pilhas ${numero}`.trim();
    case "bateria-9v": return `Bateria ${numero}`.trim();
    case "arduino-uno-r3": return "Arduino Uno";
    default: return TIPOS[comp.type] && TIPOS[comp.type].placa ? `Protoboard ${numero}`.trim() : comp.id;
  }
}

// "220 Ω", "4,7 kΩ", "10 kΩ", "1 MΩ".
export function textoDeResistencia(ohms) {
  const [v, u] = ohms >= 1e6 ? [ohms / 1e6, "MΩ"] : ohms >= 1e3 ? [ohms / 1e3, "kΩ"] : [ohms, "Ω"];
  return `${String(Math.round(v * 100) / 100).replace(".", ",")} ${u}`;
}

// Descrição de um componente com o valor principal: "R1 · 220 Ω".
export function descricao(comp) {
  const p = comp.props || {};
  const base = rotulo(comp);
  switch (comp.type) {
    case "resistor": return `${base} · ${textoDeResistencia(p.ohms)}`;
    case "led": return `${base} · ${(CORES_DE_LED[p.cor] || CORES_DE_LED.vermelho).nome}`;
    case "potenciometro": return `${base} · ${textoDeResistencia(p.ohms)}, ${p.posicao} %`;
    case "ldr": return `${base} · luz ${p.luz} %`;
    case "pilhas": return `${base} · ${p.quantidade} × AA (${String(1.5 * p.quantidade).replace(".", ",")} V)`;
    case "bateria-9v": return `${base} · 9 V`;
    case "interruptor": return `${base} · ${p.fechado ? "fechado" : "aberto"}`;
    case "botao": return `${base} · ${p.apertado ? "apertado" : "solto"}`;
    case "multimetro": return `${base} · ${MODOS_DO_MULTIMETRO[p.modo] || p.modo}`;
    case "pir": return `${base} · ${p.movimento ? "com movimento" : "parado"}`;
    case "hcsr04": return `${base} · objeto a ${p.distancia} cm`;
    case "buzzer": return `${base} · som ${p.som ? "ligado" : "desligado"}`;
    default: return base;
  }
}
