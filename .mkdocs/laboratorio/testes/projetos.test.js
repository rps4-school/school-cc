// Os projetos 02 e 03 e as variantes com defeito deles: o que os casos de teste das páginas prometem.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validar } from "../projeto.js";
import { criarSimulacao } from "../simulacao.js";
import { firmware, precisaDe } from "./firmware.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const PROJETOS = "conteudo/sistemas-digitais/laboratorio/projetos";
const DOIS = `${PROJETOS}/02-dois-leds-alternados`;
const SEMAFORO = `${PROJETOS}/03-semaforo`;

function simular(pasta, hex) {
  const r = validar(JSON.parse(readFileSync(join(RAIZ, pasta, "circuito.json"), "utf8")));
  assert.ok(r.ok, r.erros.join("\n"));
  return criarSimulacao({ projeto: r.projeto, hex: firmware(`${pasta}/${hex}`) });
}

function ate(sim, t) {
  sim.avancar(t - sim.tempo);
  return sim.analise.componentes;
}

test("projeto 02: os LEDs se revezam a cada 500 ms, nunca os dois juntos", precisaDe(`${DOIS}/dois-leds.hex`), () => {
  const sim = simular(DOIS, "dois-leds.hex");
  for (const [t, a, b] of [[0.25, true, false], [0.75, false, true], [1.25, true, false], [1.75, false, true]]) {
    const c = ate(sim, t);
    assert.deepEqual([c.led1.ligado, c.led2.ligado], [a, b], `em ${t} s`);
  }
});

test("projeto 02, sem o pinMode: o LED B só recebe o pull-up e fica bem fraquinho", precisaDe(`${DOIS}/dois-leds-sem-pinmode.hex`), () => {
  const sim = simular(DOIS, "dois-leds-sem-pinmode.hex");
  const c = ate(sim, 0.75); // vez do LED B
  assert.equal(sim.pinos.D9.modo, "pullup");
  assert.ok(c.led2.corrente > 0 && c.led2.corrente < 0.0002, `corrente do LED B: ${c.led2.corrente} A`);
  assert.ok(ate(sim, 1.25).led1.corrente > 0.01, "o LED A pisca normal");
});

test("projeto 03: verde, amarelo e vermelho, um de cada vez; sem apagar, o vermelho fica", precisaDe(`${SEMAFORO}/semaforo.hex`, `${SEMAFORO}/semaforo-sem-apagar.hex`), () => {
  const certo = simular(SEMAFORO, "semaforo.hex");
  const acesos = (c) => ["led1", "led2", "led3"].filter((id) => c[id].ligado);
  assert.deepEqual([2.5, 6, 9.5, 14].map((t) => acesos(ate(certo, t))), [["led1"], ["led2"], ["led3"], ["led1"]]);
  const defeito = simular(SEMAFORO, "semaforo-sem-apagar.hex");
  assert.deepEqual(acesos(ate(defeito, 2.5)), ["led1"], "na primeira volta, tudo certo");
  assert.deepEqual(acesos(ate(defeito, 14)), ["led1", "led3"], "na segunda, o vermelho continua aceso com o verde");
  assert.deepEqual(acesos(ate(defeito, 18)), ["led2", "led3"], "e com o amarelo");
});
