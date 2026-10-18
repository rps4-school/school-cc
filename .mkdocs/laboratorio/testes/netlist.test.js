import assert from "node:assert/strict";
import test from "node:test";

import { montarRedes } from "../netlist.js";
import { montar } from "./ajuda.js";

test("fio, tira e barramento formam uma rede só", () => {
  const p = montar(
    [{ id: "pb", type: "protoboard-400" }, { id: "r1", type: "resistor", mount: { 1: "pb:a1", 2: "pb:a5" } }],
    [["pb:e1", "pb:cima+1"]],
  );
  const r = montarRedes(p);
  assert.ok(r.mesmaRede("r1:1", "pb:cima+20"), "perna → tira → fio → barramento");
  assert.ok(!r.mesmaRede("r1:1", "r1:2"));
  assert.ok(!r.mesmaRede("r1:1", "pb:f1"), "o canal separa");
});

test("os GND do Uno são um só e o IOREF é o 5V", () => {
  const r = montarRedes(montar([{ id: "uno", type: "arduino-uno-r3" }]));
  assert.ok(r.mesmaRede("uno:GND.1", "uno:GND.3"));
  assert.ok(r.mesmaRede("uno:IOREF", "uno:5V"));
  assert.ok(!r.mesmaRede("uno:5V", "uno:GND.2"));
});

test("botão: os pares sempre ligados; os dois lados só apertado", () => {
  const solto = montarRedes(montar([{ id: "bt", type: "botao" }]));
  assert.ok(solto.mesmaRede("bt:1a", "bt:1b"));
  assert.ok(!solto.mesmaRede("bt:1a", "bt:2a"));
  const apertado = montarRedes(montar([{ id: "bt", type: "botao", props: { apertado: true } }]));
  assert.ok(apertado.mesmaRede("bt:1b", "bt:2b"));
});

test("interruptor fechado liga, aberto não", () => {
  assert.ok(!montarRedes(montar([{ id: "s", type: "interruptor" }])).mesmaRede("s:1", "s:2"));
  assert.ok(montarRedes(montar([{ id: "s", type: "interruptor", props: { fechado: true } }])).mesmaRede("s:1", "s:2"));
});
