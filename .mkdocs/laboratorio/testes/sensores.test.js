// Projetos 04 a 12: entradas, leitura analógica, PWM, buzzer, LED RGB, PIR, ultrassom e servo,
// rodando o firmware de verdade no ATmega328P emulado, em tempo simulado.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validar } from "../projeto.js";
import { criarSimulacao } from "../simulacao.js";
import { firmware, precisaDe } from "./firmware.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const P = "conteudo/sistemas-digitais/laboratorio/projetos";

function abrir(pasta, mudar = () => {}) {
  const dados = JSON.parse(readFileSync(join(RAIZ, P, pasta, "circuito.json"), "utf8"));
  mudar(dados);
  const r = validar(dados);
  assert.ok(r.ok, r.erros.join("\n"));
  return r.projeto;
}

function simular(pasta, hex, mudar) {
  return criarSimulacao({ projeto: abrir(pasta, mudar), hex: firmware(`${P}/${pasta}/${hex}`) });
}

// Muda uma propriedade de um componente com o programa rodando (botão, potenciômetro, luz, distância...).
function mexer(sim, pasta, id, props) {
  sim.mudarProjeto(abrir(pasta, (d) => {
    const c = d.components.find((x) => x.id === id);
    c.props = { ...(c.props || {}), ...props };
  }));
}

function serialAte(sim, segundos) {
  let texto = "";
  while (sim.tempo < segundos - 1e-9) {
    sim.avancar(Math.min(0.05, segundos - sim.tempo));
    texto += sim.quadro().serial;
  }
  return texto;
}

const comp = (sim, id) => sim.analise.componentes[id];

test("04: o LED acende só com o botão apertado; sem o pull-up, o pino solto lê LOW", precisaDe(`${P}/04-botao-e-led/botao-led.hex`, `${P}/04-botao-e-led/botao-sem-pullup.hex`), () => {
  const sim = simular("04-botao-e-led", "botao-led.hex");
  sim.avancar(0.05);
  assert.equal(comp(sim, "led1").ligado, false, "solto: apagado");
  mexer(sim, "04-botao-e-led", "bt1", { apertado: true });
  sim.avancar(0.05);
  assert.equal(comp(sim, "led1").ligado, true, "apertado: aceso");
  mexer(sim, "04-botao-e-led", "bt1", { apertado: false });
  sim.avancar(0.05);
  assert.equal(comp(sim, "led1").ligado, false);
  const defeito = simular("04-botao-e-led", "botao-sem-pullup.hex");
  defeito.avancar(0.05);
  assert.equal(defeito.pinos.D2.modo, "entrada");
  assert.equal(comp(defeito, "led1").ligado, true, "sem pull-up, o pino solto lê LOW e o LED acende sem ninguém apertar");
});

test("05: com millis(), cada LED tem o seu ritmo; com delay(), um espera o outro", precisaDe(`${P}/05-pisca-sem-delay/pisca-sem-delay.hex`, `${P}/05-pisca-sem-delay/pisca-com-delay.hex`), () => {
  const sim = simular("05-pisca-sem-delay", "pisca-sem-delay.hex");
  const hist = sim.registrarHistorico();
  sim.avancar(2.05);
  // O millis() anda em passos de 1,024 ms com correção: cada troca sai até 2 ms depois da conta.
  const trocas = (id) => hist.filter(([, i]) => i === id).map(([t]) => t * 1000);
  const perto = (lista, esperado) => lista.length === esperado.length && lista.every((t, i) => t >= esperado[i] && t - esperado[i] <= 2);
  assert.ok(perto(trocas("led1"), [500, 1000, 1500, 2000]), `LED A: ${trocas("led1")}`);
  assert.ok(perto(trocas("led2"), [300, 600, 900, 1200, 1500, 1800]), `LED B: ${trocas("led2")}`);
  const errado = simular("05-pisca-sem-delay", "pisca-com-delay.hex");
  const h2 = errado.registrarHistorico();
  errado.avancar(1.65);
  const acesos = h2.filter(([, , aceso]) => aceso).map(([t, id]) => [Math.round(t * 1000), id]);
  assert.deepEqual(acesos, [[0, "led1"], [1000, "led2"], [1600, "led1"]], "com delay, o LED B só pisca depois do A");
});

test("06: a leitura do potenciômetro, a tensão e a posição no monitor serial", precisaDe(`${P}/06-potenciometro-e-serial/potenciometro.hex`), () => {
  const sim = simular("06-potenciometro-e-serial", "potenciometro.hex");
  assert.equal(serialAte(sim, 0.1).trim(), "Leitura: 511  Tensão: 2.50 V  Posição: 49 %");
  mexer(sim, "06-potenciometro-e-serial", "pot1", { posicao: 100 });
  assert.match(serialAte(sim, 0.4), /Leitura: 1023 {2}Tensão: 5.00 V {2}Posição: 100 %/);
});

test("07: o potenciômetro controla o brilho por PWM", precisaDe(`${P}/07-dimmer-pwm/dimmer.hex`), () => {
  const sim = simular("07-dimmer-pwm", "dimmer.hex", (d) => { d.components.find((c) => c.id === "pot1").props.posicao = 25; });
  sim.avancar(0.3);
  const antes = sim.quadro().serial;
  sim.avancar(0.2);
  const q = sim.quadro();
  const cheia = (5 - 2) / 245;
  assert.ok(Math.abs(q.leds.led1.corrente / cheia - 63 / 255) < 0.01, `razão do brilho: ${q.leds.led1.corrente / cheia}`);
  assert.match(antes + q.serial, /^Brilho: 63\r\n/);
});

test("08: o LED acende quando escurece", precisaDe(`${P}/08-luz-automatica/luz-automatica.hex`), () => {
  const sim = simular("08-luz-automatica", "luz-automatica.hex");
  assert.match(serialAte(sim, 0.1), /^Luz: \d+/);
  assert.equal(comp(sim, "led1").ligado, false, "com 80 % de luz, apagado");
  mexer(sim, "08-luz-automatica", "ldr1", { luz: 20 });
  serialAte(sim, 0.4);
  assert.equal(comp(sim, "led1").ligado, true, "com 20 % de luz, aceso");
});

test("09: a campainha toca 880 Hz e depois 659 Hz", precisaDe(`${P}/09-campainha/campainha.hex`), () => {
  const sim = simular("09-campainha", "campainha.hex");
  sim.avancar(0.05);
  assert.deepEqual(sim.quadro().sons, {}, "sem apertar, mudo");
  mexer(sim, "09-campainha", "bt1", { apertado: true });
  sim.avancar(0.25);
  const primeira = sim.quadro();
  assert.ok(Math.abs(primeira.sons.bz1 - 880) < 3, `primeira nota: ${primeira.sons.bz1} Hz`);
  assert.match(primeira.serial, /Dim-dom!/);
  sim.avancar(0.3);
  assert.ok(Math.abs(sim.quadro().sons.bz1 - 659) < 3, "segunda nota");
});

test("10: o LED RGB mistura as cores com PWM", precisaDe(`${P}/10-led-rgb/rgb.hex`), () => {
  const sim = simular("10-led-rgb", "rgb.hex");
  const cor = (t) => {
    sim.avancar(t - sim.tempo);
    const c = comp(sim, "rgb1").canais;
    return ["r", "g", "b"].map((k) => c[k].ligado);
  };
  assert.deepEqual(cor(0.5), [true, false, false], "vermelho");
  assert.deepEqual(cor(1.5), [false, true, false], "verde");
  assert.deepEqual(cor(2.5), [false, false, true], "azul");
  assert.deepEqual(cor(3.5), [true, true, false], "amarelo");
  assert.deepEqual(cor(5.5), [true, true, true], "branco");
  assert.deepEqual(cor(6.5), [false, false, false], "apagado");
});

test("11: o PIR dispara o alarme e a mensagem sai uma vez por movimento", precisaDe(`${P}/11-alarme-de-movimento/alarme.hex`), () => {
  const sim = simular("11-alarme-de-movimento", "alarme.hex");
  assert.equal(serialAte(sim, 0.3), "", "parado: nada");
  mexer(sim, "11-alarme-de-movimento", "pir1", { movimento: true });
  sim.avancar(0.1);
  const q = sim.quadro();
  assert.ok(Math.abs(q.sons.bz1 - 1000) < 5, `bipe de ${q.sons.bz1} Hz`);
  assert.equal(q.pinos.D13.nivel, 1, "o LED L acende junto");
  const texto = q.serial + serialAte(sim, 1.5);
  assert.equal(texto, "Movimento!\r\n", "uma mensagem só, mesmo com o movimento durando");
  mexer(sim, "11-alarme-de-movimento", "pir1", { movimento: false });
  sim.avancar(0.5);
  sim.quadro();
  sim.avancar(0.3);
  assert.deepEqual(sim.quadro().sons, { bz1: 0 }, "parou o movimento, parou o bipe");
});

test("12: o ultrassom mede a distância e o servo levanta a cancela abaixo de 20 cm", precisaDe(`${P}/12-cancela-automatica/cancela.hex`), () => {
  const sim = simular("12-cancela-automatica", "cancela.hex");
  const texto = serialAte(sim, 0.5);
  assert.match(texto, /^Distância: 50 cm\r\n/);
  assert.ok(Math.abs(sim.quadro().servos.servo1 - 0) < 2, "50 cm: fechada");
  mexer(sim, "12-cancela-automatica", "us1", { distancia: 12 });
  const depois = serialAte(sim, 1.2);
  assert.match(depois, /Distância: 12 cm/);
  assert.ok(Math.abs(sim.quadro().servos.servo1 - 90) < 2, `12 cm: aberta (${sim.quadro().servos.servo1}°)`);
  mexer(sim, "12-cancela-automatica", "us1", { distancia: 420 });
  assert.match(serialAte(sim, 1.8), /Distância: 0 cm/, "sem eco em 30 ms, pulseIn devolve 0");
});
