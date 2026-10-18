import assert from "node:assert/strict";
import test from "node:test";

import { analisar } from "../circuito.js";
import { diagnosticar } from "../diagnostico.js";
import { bancada, montar } from "./ajuda.js";

function codigos(projeto) {
  return diagnosticar(projeto, analisar(projeto)).map((d) => d.codigo);
}

const LED_CERTO = [
  { id: "r1", type: "resistor", props: { ohms: 390 }, mount: { 1: "pb:a1", 2: "pb:a5" } },
  { id: "led1", type: "led", mount: { anodo: "pb:b5", catodo: "pb:b6" } },
];
const FIOS_CERTOS = [["pb:cima+2", "pb:e1"], ["pb:e6", "pb:cima-2"]];

test("circuito certo: nenhum erro nem aviso", () => {
  assert.deepEqual(codigos(bancada(LED_CERTO, FIOS_CERTOS)), []);
});

test("fio do + direto no −: curto", () => {
  const p = bancada([], [["pb:cima+5", "pb:cima-5"]]);
  assert.deepEqual(codigos(p), ["curto"]);
  const d = diagnosticar(p, analisar(p))[0];
  assert.match(d.mensagem, /^Curto-circuito: a Bateria está fornecendo/);
});

test("amperímetro em paralelo com a bateria", () => {
  const p = bancada([{ id: "mm1", type: "multimetro", props: { modo: "A" } }], [["mm1:vermelha", "pb:cima+4"], ["mm1:preta", "pb:cima-4"]]);
  assert.deepEqual(codigos(p), ["amperimetro-em-paralelo"]);
});

test("LED sem resistor: o LED queimaria, e não é chamado de curto", () => {
  const p = bancada([{ id: "led1", type: "led", mount: { anodo: "pb:b5", catodo: "pb:b6" } }], [["pb:cima+2", "pb:e5"], ["pb:e6", "pb:cima-2"]]);
  assert.deepEqual(codigos(p), ["led-sem-resistor"]);
});

test("resistor pequeno: corrente acima de 20 mA é aviso", () => {
  const p = bancada([{ ...LED_CERTO[0], props: { ohms: 270 } }, LED_CERTO[1]], FIOS_CERTOS); // 25,9 mA
  assert.deepEqual(codigos(p), ["led-corrente-alta"]);
});

test("LED invertido", () => {
  const p = bancada([LED_CERTO[0], { id: "led1", type: "led", mount: { anodo: "pb:b6", catodo: "pb:b5" } }], FIOS_CERTOS);
  assert.deepEqual(codigos(p), ["led-invertido"]);
});

test("as duas pernas do resistor na mesma tira", () => {
  const p = bancada([{ ...LED_CERTO[0], mount: { 1: "pb:a1", 2: "pb:c1" } }, LED_CERTO[1]], FIOS_CERTOS);
  assert.ok(codigos(p).includes("mesma-tira"));
});

test("perna solta: o cátodo não volta para o −, e o − da bateria não chega a ninguém", () => {
  const p = bancada(LED_CERTO, [["pb:cima+2", "pb:e1"]]);
  const d = diagnosticar(p, analisar(p));
  assert.deepEqual(d.map((x) => x.codigo), ["perna-solta", "perna-solta"]);
  const textos = d.map((x) => x.mensagem).sort();
  assert.deepEqual(textos, [
    "Cátodo (−, perna curta) de LED1 não chega a nenhum componente: falta o caminho de volta até o − (ou o GND).",
    "Polo − de Bateria não chega a nenhum componente.",
  ]);
});

test("barramento dividido da protoboard grande", () => {
  const p = montar(
    [
      { id: "pb", type: "protoboard-830" }, { id: "bat", type: "bateria-9v" },
      { id: "r1", type: "resistor", props: { ohms: 390 }, mount: { 1: "pb:a40", 2: "pb:a44" } },
      { id: "led1", type: "led", mount: { anodo: "pb:b44", catodo: "pb:b45" } },
    ],
    [["bat:+", "pb:cima+1"], ["bat:-", "pb:cima-1"], ["pb:cima+40", "pb:e40"], ["pb:e45", "pb:cima-40"]],
  );
  assert.ok(codigos(p).includes("barramento-dividido"));
  const emendado = montar(p.components, [...p.connections, { id: "w9", from: "pb:cima+25", to: "pb:cima+26" }, { id: "w10", from: "pb:cima-25", to: "pb:cima-26" }]);
  assert.deepEqual(codigos(emendado), []);
});

test("9 V num pino do Arduino", () => {
  const p = montar(
    [{ id: "uno", type: "arduino-uno-r3" }, { id: "bat", type: "bateria-9v" }],
    [["bat:+", "uno:D8"], ["bat:-", "uno:GND.1"]],
  );
  assert.deepEqual(codigos(p), ["tensao-no-pino"]);
});

test("pino de saída sem resistor no LED: corrente demais no pino", () => {
  const p = montar(
    [{ id: "uno", type: "arduino-uno-r3" }, { id: "pb", type: "protoboard-400" }, { id: "led1", type: "led", mount: { anodo: "pb:a10", catodo: "pb:a11" } }],
    [["uno:D8", "pb:c10"], ["uno:GND.1", "pb:c11"]],
  );
  const c = diagnosticar(p, analisar(p, { pinos: { D8: { modo: "saida", nivel: 1 } } })).map((d) => d.codigo);
  assert.deepEqual(c, ["led-sem-resistor", "corrente-no-pino"]);
});
