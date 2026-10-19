// Desafios: o circuito inicial não passa, a montagem certa passa (em qualquer lugar da protoboard)
// e cada erro típico falha no critério certo, com uma dica.

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { conferirDesafio, TIPOS_DE_CRITERIO } from "../desafios.js";
import { validar } from "../projeto.js";
import { firmware, precisaDe } from "./firmware.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const D = "conteudo/sistemas-digitais/laboratorio/desafios";
const pastas = readdirSync(join(RAIZ, D), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);

function abrir(pasta, mudar = () => {}) {
  const dados = JSON.parse(readFileSync(join(RAIZ, D, pasta, "circuito.json"), "utf8"));
  mudar(dados);
  const r = validar(dados);
  assert.ok(r.ok, r.erros.join("\n"));
  return r.projeto;
}

const fio = (id, from, to, color = "preto") => ({ id, from, to, color });
const conferir = (projeto, hex) => conferirDesafio(projeto, projeto.desafio, { hex });
const falhas = (r) => r.itens.filter((i) => !i.ok).map((i) => i.texto);

test("todo desafio é um projeto válido, com critérios conhecidos e o sketch existente", () => {
  assert.ok(pastas.length >= 3);
  for (const pasta of pastas) {
    const p = abrir(pasta);
    assert.ok(p.desafio && p.desafio.id && p.desafio.criterios.length, pasta);
    for (const c of p.desafio.criterios) assert.ok(TIPOS_DE_CRITERIO.includes(c.tipo), `${pasta}: ${c.tipo}`);
    if (p.sketch) assert.ok(existsSync(join(RAIZ, D, pasta, p.sketch)), `${pasta}: ${p.sketch}`);
    assert.ok(existsSync(join(RAIZ, D, pasta, "README.md")), `${pasta}: falta o README`);
  }
});

// ---------- 01 · Monte o Blink ----------

// LED e resistor numa posição qualquer da protoboard, pino 8 → resistor → LED → GND.
function blink(d, { ohms = 220, invertido = false, origem = "uno:D8", sem = null } = {}) {
  d.components.push(
    { id: "r1", type: "resistor", x: 0, y: 0, props: { ohms }, mount: { 1: "pb1:b14", 2: "pb1:b18" } },
    { id: "led1", type: "led", x: 0, y: 0, props: { cor: "verde" }, mount: invertido ? { catodo: "pb1:e18", anodo: "pb1:e19" } : { anodo: "pb1:e18", catodo: "pb1:e19" } },
  );
  d.connections.push(fio("w1", origem, "pb1:a14", "verde"), fio("w2", "pb1:a19", "pb1:cima-17"), fio("w3", "uno:GND.1", "pb1:cima-1"));
  if (sem) d.connections = d.connections.filter((f) => f.id !== sem);
}

test("01 · Monte o Blink: só passa com o LED no pino 8, resistor certo e retorno ao GND", () => {
  const vazio = conferir(abrir("01-monte-o-blink"));
  assert.equal(vazio.ok, false, "o circuito inicial não tem LED");
  assert.match(vazio.itens[0].dica, /nenhum LED acendeu/);

  const certo = conferir(abrir("01-monte-o-blink", (d) => blink(d)));
  assert.ok(certo.ok, JSON.stringify(certo.itens));

  const com1k = conferir(abrir("01-monte-o-blink", (d) => blink(d, { ohms: 1000 })));
  assert.deepEqual(falhas(com1k).length, 1, "1 kΩ: corrente de menos");
  assert.match(com1k.itens[0].dica, /fora da faixa/);

  const invertido = conferir(abrir("01-monte-o-blink", (d) => blink(d, { invertido: true })));
  assert.equal(invertido.itens[0].ok, false, "LED invertido não acende");

  const no5v = conferir(abrir("01-monte-o-blink", (d) => blink(d, { origem: "uno:5V" })));
  assert.equal(no5v.itens[0].ok, false);
  assert.match(no5v.itens[0].dica, /não apaga/);

  const pino7 = conferir(abrir("01-monte-o-blink", (d) => blink(d, { origem: "uno:D7" })));
  assert.equal(pino7.itens[0].ok, false, "LED no pino 7");

  const semGnd = conferir(abrir("01-monte-o-blink", (d) => blink(d, { sem: "w3" })));
  assert.equal(semGnd.itens[0].ok, false, "sem o fio do GND");

  // Sem resistor: o LED vai direto do pino ao GND. O critério de erros acusa.
  const semResistor = conferir(abrir("01-monte-o-blink", (d) => {
    d.components.push({ id: "led1", type: "led", x: 0, y: 0, props: { cor: "vermelho" }, mount: { anodo: "pb1:e18", catodo: "pb1:e19" } });
    d.connections.push(fio("w1", "uno:D8", "pb1:a18", "verde"), fio("w2", "pb1:a19", "pb1:cima-17"), fio("w3", "uno:GND.1", "pb1:cima-1"));
  }));
  assert.equal(semResistor.ok, false);
  assert.equal(semResistor.itens[1].ok, false, "sem resistor é erro");
});

// ---------- 02 · O resistor certo ----------

test("02 · O resistor certo: de 10 a 15 mA com a bateria de 9 V", () => {
  const ohms = (valor) => (d) => { d.components.find((c) => c.id === "r1").props.ohms = valor; };
  assert.equal(conferir(abrir("02-resistor-certo")).ok, false, "100 Ω: corrente demais");
  for (const v of [470, 560, 680]) assert.ok(conferir(abrir("02-resistor-certo", ohms(v))).ok, `${v} Ω`);
  for (const v of [330, 820]) {
    const r = conferir(abrir("02-resistor-certo", ohms(v)));
    assert.equal(r.ok, false, `${v} Ω`);
    assert.match(r.itens[0].dica, v < 470 ? /maior/ : /menor/);
  }
  const invertido = conferir(abrir("02-resistor-certo", (d) => {
    ohms(560)(d);
    d.components.find((c) => c.id === "led1").mount = { anodo: "pb1:c8", catodo: "pb1:c7" };
  }));
  assert.equal(invertido.ok, false, "LED invertido");
});

// ---------- 03 · O botão acende o LED (roda o firmware do projeto 04) ----------

const HEX = "conteudo/sistemas-digitais/laboratorio/projetos/04-botao-e-led/botao-led.hex";

function fiosDoBotao(d, { botaoEm = "pb1:cima-11", ledDe = "uno:D8" } = {}) {
  d.connections.push(
    fio("w1", "uno:D2", "pb1:a10", "amarelo"), fio("w2", "pb1:a12", botaoEm),
    fio("w3", ledDe, "pb1:a20", "verde"), fio("w4", "pb1:a25", "pb1:cima-21"),
    fio("w5", "uno:GND.1", "pb1:cima-1"),
  );
  if (botaoEm.startsWith("pb1:cima+")) d.connections.push(fio("w6", "uno:5V", "pb1:cima+1", "vermelho"));
}

test("03 · O botão acende o LED: o laboratório roda o programa e aperta o botão sozinho", precisaDe(HEX), () => {
  const hex = firmware(HEX);
  const vazio = conferir(abrir("03-botao-acende-o-led"), hex);
  assert.equal(vazio.ok, false, "sem fios");

  const certo = conferir(abrir("03-botao-acende-o-led", (d) => fiosDoBotao(d)), hex);
  assert.ok(certo.ok, JSON.stringify(certo.itens));

  const botaoNo5v = conferir(abrir("03-botao-acende-o-led", (d) => fiosDoBotao(d, { botaoEm: "pb1:cima+11" })), hex);
  assert.equal(botaoNo5v.ok, false, "botão no 5V: com o pull-up, o pino nunca vai a LOW");
  assert.match(botaoNo5v.itens[1].dica, /apertado, o LED ficou apagado/);

  const ledNo5v = conferir(abrir("03-botao-acende-o-led", (d) => fiosDoBotao(d, { ledDe: "uno:5V" })), hex);
  assert.equal(ledNo5v.ok, false);
  assert.match(ledNo5v.itens[1].dica, /solto, o LED ficou aceso/);
});

test("03 · sem o firmware, o critério do programa não passa e explica por quê", () => {
  const r = conferir(abrir("03-botao-acende-o-led", (d) => fiosDoBotao(d)), null);
  assert.equal(r.ok, false);
  assert.match(r.itens[1].dica, /firmware/);
});
