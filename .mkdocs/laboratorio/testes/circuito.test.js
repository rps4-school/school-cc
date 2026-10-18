// Elétrica: os números das aulas têm que sair iguais no laboratório.

import assert from "node:assert/strict";
import test from "node:test";

import { analisar, formatar, resistenciaDoLdr } from "../circuito.js";
import { resolver } from "../solucionador.js";
import { bancada, montar, perto } from "./ajuda.js";

test("formatar: três algarismos, vírgula e prefixo", () => {
  assert.equal(formatar(0.017942, "A"), "17,9 mA");
  assert.equal(formatar(4.9836, "V"), "4,98 V");
  assert.equal(formatar(9, "V"), "9,00 V");
  assert.equal(formatar(0.99996, "A"), "1,00 A");
  assert.equal(formatar(-0.52, "V"), "−520 mV");
  assert.equal(formatar(0, "V"), "0 V");
  assert.equal(formatar(0.0000123, "A"), "12,3 µA");
});

test("solucionador: divisor e LED aceso, apagado e invertido", () => {
  // 9 V (nó 1) → 2 kΩ → nó 2 → 1 kΩ → terra (nó 0): 3 V no meio (aula 12, teste rápido 6).
  const divisor = resolver({ nos: 3, resistores: [{ a: 1, b: 2, r: 2000 }, { a: 2, b: 0, r: 1000 }], fontes: [{ p: 1, n: 0, v: 9, rint: 1e-6 }] });
  assert.ok(perto(divisor.tensoes[2], 3));
  const led = { vf: 2, rs: 0.05, joelho: 0.03, rs2: 10 };
  const aceso = resolver({ nos: 3, resistores: [{ a: 1, b: 2, r: 390 }], fontes: [{ p: 1, n: 0, v: 9, rint: 0.1 }], leds: [{ a: 2, k: 0, ...led }] });
  assert.ok(aceso.leds[0].ligado && perto(aceso.leds[0].i, 7 / 390.15), `i = ${aceso.leds[0].i}`);
  const invertido = resolver({ nos: 3, resistores: [{ a: 1, b: 2, r: 390 }], fontes: [{ p: 1, n: 0, v: 9, rint: 0.1 }], leds: [{ a: 0, k: 2, ...led }] });
  assert.ok(!invertido.leds[0].ligado && invertido.leds[0].i === 0);
  assert.ok(invertido.leds[0].v < -8.9, "o LED invertido fica com a tensão toda, ao contrário");
  const pouca = resolver({ nos: 2, fontes: [{ p: 1, n: 0, v: 1.5, rint: 0.05 }], leds: [{ a: 1, k: 0, ...led }] });
  assert.ok(!pouca.leds[0].ligado, "uma pilha (1,5 V) não acende LED vermelho (2 V)");
});

test("LED sem resistor: centenas de mA, não um curto de dezenas de ampères", () => {
  const sol = resolver({ nos: 2, fontes: [{ p: 1, n: 0, v: 9, rint: 0.1 }], leds: [{ a: 1, k: 0, vf: 2, rs: 0.05, joelho: 0.03, rs2: 10 }] });
  assert.ok(sol.convergiu);
  assert.ok(sol.leds[0].i > 0.5 && sol.leds[0].i < 1, `i = ${sol.leds[0].i}`);
});

test("LEDs de cores diferentes em paralelo num resistor só: o de menor tensão leva tudo", () => {
  const sol = resolver({
    nos: 3, resistores: [{ a: 1, b: 2, r: 330 }], fontes: [{ p: 1, n: 0, v: 9, rint: 0.1 }],
    leds: [{ a: 2, k: 0, vf: 2, rs: 0.05 }, { a: 2, k: 0, vf: 3, rs: 0.05 }],
  });
  assert.ok(sol.leds[0].ligado && !sol.leds[1].ligado);
});

test("LED com resistor de 390 Ω na bateria de 9 V: 17,9 mA no amperímetro em série", () => {
  // bat+ → barramento + → R (a1–a5) → LED (b5–b6)... o amperímetro fica entre o cátodo e o barramento −.
  const p = bancada(
    [
      { id: "r1", type: "resistor", props: { ohms: 390 }, mount: { 1: "pb:a1", 2: "pb:a5" } },
      { id: "led1", type: "led", mount: { anodo: "pb:b5", catodo: "pb:b6" } },
      { id: "mm1", type: "multimetro", props: { modo: "A" }, x: 0, y: 320 },
    ],
    [["pb:cima+2", "pb:e1"], ["pb:e6", "mm1:vermelha"], ["mm1:preta", "pb:cima-3"]],
  );
  const a = analisar(p);
  assert.ok(a.componentes.led1.ligado);
  assert.equal(a.componentes.mm1.texto, "17,9 mA");
  assert.ok(perto(a.componentes.r1.tensao, 7 * 390 / 390.15));
});

test("três LEDs vermelhos em série com 150 Ω em 9 V: 20 mA", () => {
  const p = bancada(
    [
      { id: "r1", type: "resistor", props: { ohms: 150 }, mount: { 1: "pb:a1", 2: "pb:a5" } },
      { id: "led1", type: "led", mount: { anodo: "pb:b5", catodo: "pb:b6" } },
      { id: "led2", type: "led", mount: { anodo: "pb:c6", catodo: "pb:c7" } },
      { id: "led3", type: "led", mount: { anodo: "pb:d7", catodo: "pb:d8" } },
    ],
    [["pb:cima+2", "pb:e1"], ["pb:e8", "pb:cima-2"]],
  );
  const a = analisar(p);
  for (const id of ["led1", "led2", "led3"]) assert.equal(formatar(a.componentes[id].corrente, "A"), "20,0 mA");
});

test("série e paralelo com o voltímetro", () => {
  // 1 kΩ (a1–a5) e 2,2 kΩ (b5–b9) em série entre + e −.
  const serie = bancada(
    [
      { id: "r1", type: "resistor", props: { ohms: 1000 }, mount: { 1: "pb:a1", 2: "pb:a5" } },
      { id: "r2", type: "resistor", props: { ohms: 2200 }, mount: { 1: "pb:b5", 2: "pb:b9" } },
      { id: "mm1", type: "multimetro", x: 0, y: 320 },
    ],
    [["pb:cima+2", "pb:e1"], ["pb:e9", "pb:cima-2"], ["mm1:vermelha", "pb:d5"], ["mm1:preta", "pb:d9"]],
  );
  const a = analisar(serie);
  assert.equal(a.componentes.mm1.texto, "6,19 V");
  assert.equal(formatar(a.componentes.r1.corrente, "A"), "2,81 mA");
  // Dois de 1 kΩ em paralelo: 9 mA em cada, 18 mA no total.
  const paralelo = bancada(
    [
      { id: "r1", type: "resistor", props: { ohms: 1000 }, mount: { 1: "pb:a1", 2: "pb:a5" } },
      { id: "r2", type: "resistor", props: { ohms: 1000 }, mount: { 1: "pb:b1", 2: "pb:b5" } },
    ],
    [["pb:cima+2", "pb:e1"], ["pb:e5", "pb:cima-2"]],
  );
  const b = analisar(paralelo);
  assert.equal(formatar(b.componentes.r1.corrente + b.componentes.r2.corrente, "A"), "18,0 mA");
});

test("potenciômetro e LDR como divisores", () => {
  // Pino 1 no −, pino 3 no +: com o cursor em 25 %, 2,25 V.
  const p = bancada(
    [
      { id: "pot1", type: "potenciometro", props: { ohms: 10000, posicao: 25 }, mount: { 1: "pb:a10", cursor: "pb:a11", 3: "pb:a12" } },
      { id: "mm1", type: "multimetro", x: 0, y: 320 },
    ],
    [["pb:e10", "pb:cima-5"], ["pb:e12", "pb:cima+5"], ["mm1:vermelha", "pb:c11"], ["mm1:preta", "pb:cima-9"]],
  );
  assert.equal(analisar(p).componentes.mm1.texto, "2,25 V");
  assert.ok(perto(resistenciaDoLdr(0), 1e6) && perto(resistenciaDoLdr(100), 1e3));
});

test("5V do Arduino: 5 mA num resistor de 1 kΩ até o GND", () => {
  const p = montar(
    [{ id: "uno", type: "arduino-uno-r3" }, { id: "pb", type: "protoboard-400" }, { id: "r1", type: "resistor", props: { ohms: 1000 }, mount: { 1: "pb:a3", 2: "pb:a7" } }],
    [["uno:5V", "pb:e3"], ["uno:GND.2", "pb:e7"]],
  );
  assert.equal(formatar(analisar(p).componentes.r1.corrente, "A"), "5,00 mA");
});

test("pino de saída do Uno (para o emulador): LED aceso só em HIGH", () => {
  const p = montar(
    [
      { id: "uno", type: "arduino-uno-r3" }, { id: "pb", type: "protoboard-400" },
      { id: "r1", type: "resistor", props: { ohms: 220 }, mount: { 1: "pb:a10", 2: "pb:a14" } },
      { id: "led1", type: "led", mount: { anodo: "pb:e14", catodo: "pb:e15" } },
    ],
    [["uno:D8", "pb:c10"], ["uno:GND.1", "pb:a15"]],
  );
  const alto = analisar(p, { pinos: { D8: { modo: "saida", nivel: 1 } } });
  assert.ok(alto.componentes.led1.ligado);
  assert.equal(formatar(alto.componentes.led1.corrente, "A"), "12,2 mA"); // (5 − 2) / (220 + 25)
  assert.ok(!analisar(p, { pinos: { D8: { modo: "saida", nivel: 0 } } }).componentes.led1.ligado);
  assert.ok(!analisar(p).componentes.led1.ligado, "sem programa, o pino fica solto");
});
