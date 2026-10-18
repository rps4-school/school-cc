import assert from "node:assert/strict";
import test from "node:test";

import { novoId, projetoVazio, serializar, validar, VERSAO } from "../projeto.js";

const BASE = {
  schemaVersion: VERSAO,
  id: "blink-led-d8",
  title: "Meu primeiro Blink",
  components: [
    { id: "uno", type: "arduino-uno-r3", x: 40, y: 40 },
    { id: "pb", type: "protoboard-400", x: 420, y: 60 },
    { id: "r1", type: "resistor", props: { ohms: 220 }, mount: { 1: "pb:c10", 2: "pb:c14" } },
    { id: "led1", type: "led", props: { cor: "vermelho" }, mount: { anodo: "pb:e14", catodo: "pb:e15" } },
  ],
  connections: [
    { id: "w1", from: "uno:D8", to: "pb:a10", color: "verde" },
    { id: "w2", from: "uno:GND.1", to: "pb:a15", color: "preto" },
  ],
  sketch: "blink.ino",
  metadata: { esperado: { led: "led1", pino: "D8" } },
};

function erros(dados) {
  return validar(dados).erros.join("\n");
}

test("o exemplo do spec é válido e volta igual depois de serializar", () => {
  const r = validar(BASE);
  assert.ok(r.ok, r.erros.join("\n"));
  const texto = serializar(r.projeto);
  const de_novo = validar(JSON.parse(texto));
  assert.ok(de_novo.ok);
  assert.equal(serializar(de_novo.projeto), texto);
  assert.equal(de_novo.projeto.sketch, "blink.ino", "campos que o laboratório não usa ficam");
});

test("propriedades que faltam vêm do catálogo", () => {
  const r = validar({ ...BASE, components: [{ id: "r1", type: "resistor" }, { id: "mm1", type: "multimetro" }], connections: [] });
  assert.ok(r.ok);
  assert.equal(r.projeto.components[0].props.ohms, 220);
  assert.equal(r.projeto.components[1].props.modo, "V");
});

test("erros em português, com o caminho do campo", () => {
  assert.match(erros({ ...BASE, components: [{ id: "x1", type: "capacitor" }] }), /components\[0\]\.type: tipo desconhecido "capacitor"/);
  assert.match(erros({ ...BASE, components: [...BASE.components, { id: "r1", type: "resistor" }] }), /"r1" repetido/);
  assert.match(erros({ ...BASE, connections: [{ id: "w1", from: "uno:D99", to: "pb:a1" }] }), /terminal "uno:D99" não existe/);
  assert.match(erros({ ...BASE, connections: [{ id: "w1", from: "pb:a1", to: "pb:a1" }] }), /mesmo terminal/);
  const furoRepetido = { id: "r2", type: "resistor", mount: { 1: "pb:c10", 2: "pb:c20" } };
  assert.match(erros({ ...BASE, components: [...BASE.components, furoRepetido] }), /o furo pb:c10 já tem a perna de r1/);
  assert.match(erros({ ...BASE, components: [{ id: "r1", type: "resistor", props: { ohms: -5 } }] }), /props\.ohms/);
  assert.match(erros({ ...BASE, components: [{ id: "bat", type: "bateria-9v", mount: { "+": "pb:a1" } }, BASE.components[1]] }), /não encaixa na protoboard/);
});

test("versão do formato: mais nova é recusada, ausente também", () => {
  assert.match(erros({ ...BASE, schemaVersion: VERSAO + 1 }), /versão mais nova/);
  assert.match(erros({ ...BASE, schemaVersion: undefined }), /schemaVersion/);
  assert.match(erros([1, 2]), /não é um projeto/);
});

test("ids novos não repetem", () => {
  const p = validar(BASE).projeto;
  assert.equal(novoId(p, "r"), "r2");
  assert.equal(novoId(p, "w"), "w3");
  assert.ok(validar(projetoVazio()).ok);
});
