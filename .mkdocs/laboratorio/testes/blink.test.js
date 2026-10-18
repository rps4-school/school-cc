// Marco de aceite do laboratório (spec, seção 7.6): o Blink do enunciado nos 9 casos, em tempo simulado.
// O validador olha o LED do circuito, nunca a serial.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { analisar } from "../circuito.js";
import { diagnosticar } from "../diagnostico.js";
import { validar } from "../projeto.js";
import { criarSimulacao } from "../simulacao.js";
import { firmware, precisaDe } from "./firmware.js";

const PASTA = "conteudo/sistemas-digitais/laboratorio/projetos/01-blink";
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const BLINK = `${PASTA}/blink.hex`;
const PINO_7 = `${PASTA}/blink-pino-7.hex`;
const MEIO_SEGUNDO = `${PASTA}/blink-500ms.hex`;
const opcoes = precisaDe(BLINK, PINO_7, MEIO_SEGUNDO);

function projeto(mudar = () => {}) {
  const dados = JSON.parse(readFileSync(join(RAIZ, PASTA, "circuito.json"), "utf8"));
  mudar(dados);
  const r = validar(dados);
  assert.ok(r.ok, r.erros.join("\n"));
  return r.projeto;
}

// Roda `segundos` em fatias de 50 ms e devolve as trocas do LED (tempo, aceso) e a serial.
function rodar(p, hex, segundos) {
  const sim = criarSimulacao({ projeto: p, hex: firmware(hex) });
  const historico = sim.registrarHistorico();
  let serial = "";
  for (let t = 0; t < segundos - 1e-9; t += 0.05) {
    sim.avancar(0.05);
    serial += sim.quadro().serial;
  }
  const trocas = historico.filter(([, id]) => id === "led1").map(([t, , aceso]) => [t, aceso]);
  return { sim, trocas, serial };
}

function perto(t, esperado) {
  return Math.abs(t - esperado) <= 0.01 * Math.max(esperado, 0.1) + 0.002; // ±1 %
}

const comp = (dados, id) => dados.components.find((c) => c.id === id);

test("1. circuito e código certos: o LED troca a cada 1 s", opcoes, () => {
  const { trocas } = rodar(projeto(), BLINK, 4.5);
  assert.deepEqual(trocas.map(([, a]) => a), [true, false, true, false, true]);
  [0, 1, 2, 3, 4].forEach((k, i) => assert.ok(perto(trocas[i][0], k), `troca ${i}: ${trocas[i][0]} s, esperado ${k} s`));
});

test("2. código no pino 7: o LED externo nunca acende, e o diagnóstico aponta o pino", opcoes, () => {
  const p = projeto();
  const { sim, trocas } = rodar(p, PINO_7, 3);
  assert.deepEqual(trocas, []);
  const codigos = diagnosticar(p, sim.analise, { pinos: sim.pinos }).map((d) => d.codigo);
  assert.ok(codigos.includes("pino-errado"), codigos.join(", "));
});

test("3. LED fora da protoboard: não acende, e o diagnóstico aponta", opcoes, () => {
  const p = projeto((d) => {
    delete comp(d, "led1").mount;
    Object.assign(comp(d, "led1"), { x: 420, y: 420 });
  });
  const { sim, trocas } = rodar(p, BLINK, 2.5);
  assert.deepEqual(trocas, []);
  assert.ok(diagnosticar(p, sim.analise, { pinos: sim.pinos }).some((d) => d.codigo === "fora-do-circuito"));
});

test("4. sem o fio do GND: não acende (falta o caminho de volta)", opcoes, () => {
  const p = projeto((d) => {
    d.connections = d.connections.filter((f) => f.id !== "w3");
  });
  const { sim, trocas } = rodar(p, BLINK, 2.5);
  assert.deepEqual(trocas, []);
  const textos = diagnosticar(p, sim.analise, { pinos: sim.pinos }).map((d) => d.mensagem).join("\n");
  assert.match(textos, /caminho de volta até o − \(ou o GND\)/);
});

test("5. LED invertido: não acende, e aparece o aviso de polaridade", opcoes, () => {
  const p = projeto((d) => {
    comp(d, "led1").mount = { anodo: "pb1:e6", catodo: "pb1:e5" };
  });
  const sim = criarSimulacao({ projeto: p, hex: firmware(BLINK) });
  const historico = sim.registrarHistorico();
  sim.avancar(0.5); // pino 8 em HIGH
  assert.deepEqual(historico, []);
  assert.ok(diagnosticar(p, sim.analise, { pinos: sim.pinos }).some((d) => d.codigo === "led-invertido"));
});

test("6. variante de 500 ms: pisca no dobro da frequência", opcoes, () => {
  const { trocas } = rodar(projeto(), MEIO_SEGUNDO, 2.25);
  assert.deepEqual(trocas.map(([, a]) => a), [true, false, true, false, true]);
  [0, 0.5, 1, 1.5, 2].forEach((k, i) => assert.ok(perto(trocas[i][0], k), `troca ${i}: ${trocas[i][0]} s, esperado ${k} s`));
});

test("7. Reiniciar volta pinos, ciclos e serial ao começo", opcoes, () => {
  const sim = criarSimulacao({ projeto: projeto(), hex: firmware(BLINK) });
  sim.avancar(1.5);
  assert.match(sim.quadro().serial, /Ligado\r\nDesligado\r\n/);
  sim.reiniciar();
  assert.equal(sim.ciclos, 0);
  assert.equal(sim.quadro().serial, "");
  assert.equal(sim.pinos.D8.modo, "entrada", "antes do setup(), todo pino é entrada");
  sim.avancar(0.1);
  assert.ok(sim.analise.componentes.led1.ligado, "depois de reiniciar, o programa recomeça e acende o LED");
  assert.equal(sim.quadro().serial, "Ligado\r\n");
});

test("8. Parar congela os ciclos; continuar retoma", opcoes, () => {
  const sim = criarSimulacao({ projeto: projeto(), hex: firmware(BLINK) });
  sim.avancar(0.3);
  sim.parar();
  const ciclos = sim.ciclos;
  sim.avancar(1);
  assert.equal(sim.ciclos, ciclos);
  sim.continuar();
  sim.avancar(0.2);
  assert.ok(sim.ciclos > ciclos);
});

test("9. LED desconectado: a serial imprime \"Ligado\" mesmo assim, e o validador olha o LED", opcoes, () => {
  const p = projeto((d) => {
    delete comp(d, "led1").mount;
  });
  const { trocas, serial } = rodar(p, BLINK, 2.5);
  assert.match(serial, /^Ligado\r\nDesligado\r\nLigado\r\n$/);
  assert.deepEqual(trocas, [], "o LED nunca acende, digam o que disserem as mensagens");
  assert.ok(!analisar(p, { pinos: { D8: { modo: "saida", nivel: 1 } } }).componentes.led1.ligado);
});
