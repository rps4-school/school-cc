// Do projeto ao resultado: monta as redes, transforma cada componente em elementos elétricos,
// resolve e devolve o que cada componente está fazendo (LED aceso, corrente, leitura do multímetro).

import { CORES_DE_LED, TIPOS } from "./catalogo.js";
import { montarRedes } from "./netlist.js";
import { resolver } from "./solucionador.js";

// Fontes e LEDs quase ideais, como nas contas das aulas: a leitura bate com a conta no papel.
export const PARAMETROS = {
  rsLed: 0.05, // Ω em série com o LED aceso, até o joelho
  joelhoLed: 0.03, // A: acima disso, o LED já estaria queimando
  rs2Led: 10, // Ω acima do joelho
  rintPilha: 0.05, // Ω por pilha
  rintBateria: 0.1,
  voltimetro: 10e6, // Ω entre as pontas no modo V
  amperimetro: 0.05, // Ω entre as pontas no modo A
  pino: { rint: 25, pullup: 35000 }, // pino de saída e resistor de pull-up do ATmega328P
  buzzer: 10000, // Ω de um buzzer piezo passivo: quase não puxa corrente
  rgb: { r: 2.0, g: 3.0, b: 3.0 }, // tensão de cada cor do LED RGB
};

// Abaixo disso, o LED está tecnicamente conduzindo, mas não se vê luz nenhuma.
const LED_VISIVEL = 50e-6;

// Limites de corrente (A) a partir dos quais a fonte está em curto.
export const LIMITES = { pilhas: 2, "bateria-9v": 2, "5V": 0.5, "3.3V": 0.15 };

export function resistenciaDoLdr(luz) {
  return 10 ** (6 - (3 * luz) / 100); // 1 MΩ no escuro, 1 kΩ com luz forte
}

export function tensaoDoLed(cor) {
  return (CORES_DE_LED[cor] || CORES_DE_LED.vermelho).vf;
}

// opcoes.pinos: { D8: { modo: "saida", nivel: 1 } | { modo: "pullup" } | { modo: "entrada" } } dos pinos
// do Uno que o programa configurou (o emulador preenche; sem ele, todos ficam como entrada solta).
// opcoes.estados: estado interno de sensores que mudam com o tempo, como { us1: { eco: true } } do HC-SR04.
export function analisar(projeto, opcoes = {}) {
  const redes = montarRedes(projeto);
  // Sensores e o servo só funcionam com o VCC num + (5V do Uno, pilhas, bateria) e o GND num −.
  const positivos = new Set();
  const negativos = new Set();
  for (const x of projeto.components) {
    if (x.type === "arduino-uno-r3") {
      positivos.add(redes.rede(`${x.id}:5V`));
      negativos.add(redes.rede(`${x.id}:GND.1`));
    } else if (x.type === "pilhas" || x.type === "bateria-9v") {
      positivos.add(redes.rede(`${x.id}:+`));
      negativos.add(redes.rede(`${x.id}:-`));
    }
  }
  const alimentados = new Set();
  const usados = new Map(); // rede → nó do sistema
  const no = (rede) => {
    if (rede < 0) return -1;
    if (!usados.has(rede)) usados.set(rede, usados.size);
    return usados.get(rede);
  };
  const resistores = [];
  const fontes = [];
  const leds = [];
  const origem = { resistores: [], fontes: [], leds: [] };
  const r = (a, b, ohms, dono) => {
    resistores.push({ a: no(a), b: no(b), r: ohms });
    origem.resistores.push(dono);
  };
  const fonte = (p, n, v, rint, dono) => {
    fontes.push({ p: no(p), n: no(n), v, rint });
    origem.fontes.push(dono);
  };
  const ref = (c, t) => redes.rede(`${c.id}:${t}`);
  const alimentado = (c) => {
    const sim = positivos.has(ref(c, "vcc")) && negativos.has(ref(c, "gnd"));
    if (sim) alimentados.add(c.id);
    return sim;
  };
  const led = (a, k, vf, dono) => {
    leds.push({ a: no(a), k: no(k), vf, rs: PARAMETROS.rsLed, joelho: PARAMETROS.joelhoLed, rs2: PARAMETROS.rs2Led });
    origem.leds.push(dono);
  };

  let terra = -1;
  for (const c of projeto.components) {
    const p = c.props || {};
    switch (c.type) {
      case "resistor":
        r(ref(c, "1"), ref(c, "2"), Math.max(p.ohms, 0.01), { comp: c.id });
        break;
      case "potenciometro": {
        const pos = Math.min(Math.max(p.posicao / 100, 0), 1);
        r(ref(c, "1"), ref(c, "cursor"), Math.max(p.ohms * pos, 0.5), { comp: c.id, parte: "1" });
        r(ref(c, "cursor"), ref(c, "3"), Math.max(p.ohms * (1 - pos), 0.5), { comp: c.id, parte: "3" });
        break;
      }
      case "ldr":
        r(ref(c, "1"), ref(c, "2"), resistenciaDoLdr(p.luz), { comp: c.id });
        break;
      case "led":
        led(ref(c, "anodo"), ref(c, "catodo"), tensaoDoLed(p.cor), { comp: c.id });
        break;
      case "led-rgb":
        for (const canal of ["r", "g", "b"]) led(ref(c, canal), ref(c, "comum"), PARAMETROS.rgb[canal], { comp: c.id, canal });
        break;
      case "buzzer":
        r(ref(c, "+"), ref(c, "-"), PARAMETROS.buzzer, { comp: c.id });
        break;
      case "servo":
        alimentado(c);
        r(ref(c, "sinal"), ref(c, "gnd"), 10000, { comp: c.id, parte: "sinal" });
        r(ref(c, "vcc"), ref(c, "gnd"), 1000, { comp: c.id, parte: "motor" });
        break;
      case "pir":
        r(ref(c, "vcc"), ref(c, "gnd"), 50000, { comp: c.id, parte: "consumo" });
        // A saída do sensor é empurrada para 3,3 V (movimento) ou 0 V, como no HC-SR501.
        if (alimentado(c)) fonte(ref(c, "saida"), ref(c, "gnd"), p.movimento ? 3.3 : 0, 100, { comp: c.id, parte: "saida", limite: Infinity });
        break;
      case "hcsr04": {
        r(ref(c, "vcc"), ref(c, "gnd"), 330, { comp: c.id, parte: "consumo" });
        r(ref(c, "trig"), ref(c, "gnd"), 10000, { comp: c.id, parte: "trig" });
        const eco = Boolean(opcoes.estados && opcoes.estados[c.id] && opcoes.estados[c.id].eco);
        if (alimentado(c)) fonte(ref(c, "eco"), ref(c, "gnd"), eco ? 5 : 0, 100, { comp: c.id, parte: "eco", limite: Infinity });
        break;
      }
      case "pilhas":
        fonte(ref(c, "+"), ref(c, "-"), 1.5 * p.quantidade, PARAMETROS.rintPilha * p.quantidade, { comp: c.id, limite: LIMITES.pilhas });
        if (terra < 0) terra = ref(c, "-");
        break;
      case "bateria-9v":
        fonte(ref(c, "+"), ref(c, "-"), 9, PARAMETROS.rintBateria, { comp: c.id, limite: LIMITES["bateria-9v"] });
        if (terra < 0) terra = ref(c, "-");
        break;
      case "arduino-uno-r3": {
        const gnd = ref(c, "GND.1");
        terra = gnd; // o GND da placa é a referência de todo o circuito
        fonte(ref(c, "5V"), gnd, 5, 0.1, { comp: c.id, pino: "5V", limite: LIMITES["5V"] });
        fonte(ref(c, "3.3V"), gnd, 3.3, 0.5, { comp: c.id, pino: "3.3V", limite: LIMITES["3.3V"] });
        for (const [pino, estado] of Object.entries(opcoes.pinos || {})) {
          if (estado.modo === "saida") {
            fonte(ref(c, pino), gnd, estado.nivel ? 5 : 0, PARAMETROS.pino.rint, { comp: c.id, pino, saida: true, limite: Infinity });
          } else if (estado.modo === "pullup") {
            r(ref(c, pino), ref(c, "5V"), PARAMETROS.pino.pullup, { comp: c.id, pino, pullup: true });
          }
        }
        break;
      }
      case "multimetro":
        if (p.modo === "V") r(ref(c, "vermelha"), ref(c, "preta"), PARAMETROS.voltimetro, { comp: c.id, medidor: "V" });
        if (p.modo === "A") r(ref(c, "vermelha"), ref(c, "preta"), PARAMETROS.amperimetro, { comp: c.id, medidor: "A" });
        break;
      default:
    }
  }

  const nos = Math.max(usados.size, 1);
  const noTerra = terra >= 0 && usados.has(terra) ? usados.get(terra) : 0;
  const sol = resolver({ nos, terra: noTerra, resistores, fontes, leds });
  const tensaoDaRede = (rede) => (usados.has(rede) ? sol.tensoes[usados.get(rede)] : null);

  // Resultado por componente.
  const componentes = {};
  for (const c of projeto.components) {
    if (TIPOS[c.type].placa) continue;
    const tensoes = {};
    for (const t of TIPOS[c.type].terminais) tensoes[t.id] = tensaoDaRede(ref(c, t.id));
    componentes[c.id] = { tensoes };
  }
  origem.resistores.forEach((dono, i) => {
    const res = componentes[dono.comp];
    const corrente = sol.resistores[i];
    const el = resistores[i];
    const tensao = sol.tensoes[el.a] - sol.tensoes[el.b];
    if (dono.medidor === "V") Object.assign(res, { leitura: tensao, unidade: "V" });
    else if (dono.medidor === "A") Object.assign(res, { leitura: corrente, unidade: "A" });
    else if (dono.pullup) (res.pullups = res.pullups || {})[dono.pino] = corrente;
    else if (dono.parte) (res.partes = res.partes || {})[dono.parte] = { corrente, tensao };
    else Object.assign(res, { corrente, tensao, potencia: corrente * tensao });
  });
  origem.leds.forEach((dono, i) => {
    const r = sol.leds[i];
    const dados = {
      ligado: r.ligado && r.i >= LED_VISIVEL, // nanoampères de fuga não acendem LED
      corrente: r.i,
      tensao: r.v,
      brilho: r.ligado ? Math.min(1, r.i / 0.015) : 0,
    };
    const res = componentes[dono.comp];
    if (dono.canal) {
      (res.canais = res.canais || {})[dono.canal] = dados;
      res.ligado = Object.values(res.canais).some((x) => x.ligado);
    } else {
      Object.assign(res, dados);
    }
  });
  origem.fontes.forEach((dono, i) => {
    const res = componentes[dono.comp];
    const f = fontes[i];
    const corrente = sol.fontes[i];
    const curtoDireto = f.p === f.n;
    const info = { corrente, limite: dono.limite, curto: curtoDireto || Math.abs(corrente) > dono.limite, saida: Boolean(dono.saida) };
    if (dono.pino) (res.pinos = res.pinos || {})[dono.pino] = info;
    else Object.assign(res, info);
  });
  for (const c of projeto.components) {
    if (c.type === "multimetro") {
      const res = componentes[c.id];
      const modo = (c.props || {}).modo;
      if (modo === "desligado") res.texto = "OFF";
      else res.texto = formatar(res.leitura || 0, res.unidade || modo);
    }
  }

  return { redes, componentes, tensaoDaRede, alimentados, convergiu: sol.convergiu, iteracoes: sol.iteracoes, terra };
}

const PREFIXOS = [[1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"]];

// 0,01786 A → "17,9 mA"; 4,9836 V → "4,98 V"; 220 Ω → "220 Ω". Três algarismos significativos.
export function formatar(valor, unidade) {
  if (!Number.isFinite(valor)) return `— ${unidade}`;
  const abs = Math.abs(valor);
  if (abs < 1e-9) return `0 ${unidade}`;
  let i = PREFIXOS.findIndex(([f]) => abs >= f);
  if (i < 0) i = PREFIXOS.length - 1;
  let texto = (abs / PREFIXOS[i][0]).toPrecision(3);
  if (Number(texto) >= 1000 && i > 0) texto = (abs / PREFIXOS[--i][0]).toPrecision(3); // 999,96 mA → 1,00 A
  return `${valor < 0 ? "−" : ""}${texto.replace(".", ",")} ${PREFIXOS[i][1]}${unidade}`;
}
