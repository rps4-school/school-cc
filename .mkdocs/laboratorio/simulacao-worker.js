// Worker (type: "module") que roda a simulação no ritmo do relógio, sem travar a página.
//
// Mensagens que recebe: { tipo: "carregar", projeto, hex } · "executar" · "parar" · "reiniciar" ·
// { tipo: "projeto", projeto } · { tipo: "serial", texto }.
// Mensagens que manda: { tipo: "quadro", ... } (uns 30 por segundo) e { tipo: "erro", mensagem }.

import { criarSimulacao } from "./simulacao.js";

const FATIA = 0.002; // s simulados por volta do laço
const ORCAMENTO = 24; // ms de conta por volta, para o worker responder às mensagens
const INTERVALO_DO_QUADRO = 33; // ms

let sim = null;
let rodando = false;
let base = null; // { real, sim }: onde o relógio e a simulação estavam juntos
let ultimoQuadro = 0;
let amostras = []; // [real, sim] do último segundo, para a velocidade

function enviarQuadro() {
  const q = sim.quadro();
  const agora = performance.now();
  amostras.push([agora, q.tempo]);
  while (amostras.length > 2 && agora - amostras[0][0] > 1000) amostras.shift();
  const [r0, s0] = amostras[0];
  const velocidade = rodando && agora - r0 > 200 ? Math.round(((q.tempo - s0) * 1000 * 100) / (agora - r0)) : null;
  postMessage({ tipo: "quadro", ...q, rodando, velocidade });
  ultimoQuadro = agora;
}

function passo() {
  if (!rodando || !sim) return;
  const agora = performance.now();
  const alvo = base.sim + (agora - base.real) / 1000;
  const inicio = performance.now();
  try {
    while (sim.tempo < alvo && performance.now() - inicio < ORCAMENTO) sim.avancar(Math.min(FATIA, alvo - sim.tempo + 1e-6));
  } catch (e) {
    rodando = false;
    postMessage({ tipo: "erro", mensagem: `O emulador parou: ${e.message}` });
    return;
  }
  // Atrasou mais de 0,2 s (computador lento): não tenta compensar, só segue mais devagar.
  if (alvo - sim.tempo > 0.2) base = { real: performance.now(), sim: sim.tempo };
  if (performance.now() - ultimoQuadro >= INTERVALO_DO_QUADRO) enviarQuadro();
  setTimeout(passo, sim.tempo >= alvo ? 4 : 0);
}

self.onmessage = (e) => {
  const m = e.data;
  try {
    switch (m.tipo) {
      case "carregar":
        rodando = false;
        sim = criarSimulacao({ projeto: m.projeto, hex: m.hex });
        amostras = [];
        enviarQuadro();
        break;
      case "executar":
        if (!sim || rodando) break;
        sim.continuar();
        rodando = true;
        base = { real: performance.now(), sim: sim.tempo };
        amostras = [];
        passo();
        break;
      case "parar":
        rodando = false;
        if (sim) {
          sim.parar();
          enviarQuadro();
        }
        break;
      case "reiniciar":
        if (!sim) break;
        sim.reiniciar();
        base = { real: performance.now(), sim: 0 };
        amostras = [];
        enviarQuadro();
        break;
      case "projeto":
        if (sim) sim.mudarProjeto(m.projeto);
        if (sim && !rodando) enviarQuadro();
        break;
      case "serial":
        if (sim) sim.enviarSerial(m.texto);
        break;
      default:
    }
  } catch (erro) {
    rodando = false;
    postMessage({ tipo: "erro", mensagem: erro.message });
  }
};
