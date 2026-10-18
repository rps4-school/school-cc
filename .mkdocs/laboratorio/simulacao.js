// Programa + circuito no mesmo tempo simulado.
//
// O emulador roda o firmware; quando o programa muda um pino, o circuito é resolvido de novo com os
// pinos de saída como fontes. Os pinos de entrada recebem o nível da rede deles, e A0 a A5, a tensão.
// O brilho de cada LED é a corrente média no tempo (o que já cobre o PWM). O tempo é sempre o
// simulado (ciclos ÷ 16 MHz), nunca o relógio: os testes rodam rápido e dão sempre o mesmo resultado.

import { analisar } from "./circuito.js";
import { criarEmulador, FREQUENCIA } from "./emulador.js";
import { lerIntelHex } from "./intelhex.js";
import { CANAL_ADC, LIMIAR_ALTO, LIMIAR_BAIXO, PINOS } from "./uno.js";

const MAX_CACHE = 64;

export function criarSimulacao({ projeto, hex }) {
  const flash = lerIntelHex(hex);
  let emu = null;
  let atual = projeto;
  let pinos = {};
  let analise = null;
  const cache = new Map();
  let marca = 0; // ciclo da última mudança de estado
  let inicioDoQuadro = 0;
  let somas = {}; // LED → integral da corrente no tempo, desde o início do quadro
  let serial = [];
  let decodificador = new TextDecoder();
  let parado = false;
  let historico = null; // [tempo, id, aceso] de cada LED que muda (ligado nos testes)
  let entradas = {};

  const uno = () => atual.components.find((c) => c.type === "arduino-uno-r3");

  // Só os pinos que o programa configurou: entrada solta é o padrão do circuito.
  function pinosUsados() {
    const usados = {};
    for (const [nome, p] of Object.entries(pinos)) if (p.modo !== "entrada") usados[nome] = p;
    return usados;
  }

  function resolver() {
    const usados = pinosUsados();
    const chave = JSON.stringify(usados);
    let a = cache.get(chave);
    if (!a) {
      a = analisar(atual, { pinos: usados });
      if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
      cache.set(chave, a);
    }
    return a;
  }

  function acumular(ate) {
    if (!analise) return;
    const dt = (ate - marca) / FREQUENCIA;
    if (dt > 0) {
      for (const [id, r] of Object.entries(analise.componentes)) {
        if (r.corrente !== undefined && r.ligado !== undefined) somas[id] = (somas[id] || 0) + r.corrente * dt;
      }
    }
    marca = ate;
  }

  // Entradas digitais e analógicas a partir da tensão da rede de cada pino.
  function alimentarEntradas() {
    const placa = uno();
    if (!placa) return;
    for (const [nome, p] of Object.entries(pinos)) {
      const rede = analise.redes.rede(`${placa.id}:${nome}`);
      const v = analise.tensaoDaRede(rede);
      if (p.modo !== "saida") {
        const tensao = v === null ? (p.modo === "pullup" ? 5 : 0) : v;
        const antes = entradas[nome];
        const alto = tensao >= LIMIAR_ALTO ? true : tensao <= LIMIAR_BAIXO ? false : antes === undefined ? false : antes;
        if (alto !== antes) {
          entradas[nome] = alto;
          emu.definirEntrada(nome, alto);
        }
      }
      if (nome in CANAL_ADC) emu.definirTensao(nome, v === null ? 0 : v);
    }
  }

  function atualizar(ciclo) {
    acumular(ciclo);
    pinos = emu.pinos();
    const antes = analise;
    analise = resolver();
    alimentarEntradas();
    if (historico) {
      for (const [id, r] of Object.entries(analise.componentes)) {
        if (r.ligado === undefined) continue;
        const era = antes && antes.componentes[id] ? antes.componentes[id].ligado : null;
        if (era !== r.ligado) historico.push([ciclo / FREQUENCIA, id, r.ligado]);
      }
    }
  }

  function reiniciar() {
    emu = criarEmulador(flash);
    emu.usart.onByteTransmit = (b) => serial.push(b);
    cache.clear();
    pinos = {};
    entradas = {};
    analise = null;
    marca = 0;
    inicioDoQuadro = 0;
    somas = {};
    serial = [];
    decodificador = new TextDecoder();
    if (historico) historico.length = 0;
    atualizar(0);
  }

  reiniciar();

  return {
    get tempo() {
      return emu.ciclos / FREQUENCIA;
    },
    get ciclos() {
      return emu.ciclos;
    },
    get parado() {
      return parado;
    },
    get analise() {
      return analise;
    },
    get pinos() {
      return pinos;
    },
    get baud() {
      return emu.usart.baudRate;
    },
    // Avança `segundos` de tempo simulado (nada, se estiver parado).
    avancar(segundos) {
      if (parado) return;
      const ate = emu.ciclos + Math.round(segundos * FREQUENCIA);
      emu.executar(ate, atualizar);
    },
    parar() {
      parado = true;
    },
    continuar() {
      parado = false;
    },
    reiniciar,
    // O aluno mudou o circuito com o programa rodando (fio, botão, potenciômetro...).
    mudarProjeto(novo) {
      acumular(emu.ciclos);
      atual = novo;
      cache.clear();
      analise = null;
      atualizar(emu.ciclos);
    },
    enviarSerial(texto) {
      emu.receberSerial([...new TextEncoder().encode(texto)]);
    },
    registrarHistorico() {
      historico = [];
      for (const [id, r] of Object.entries(analise.componentes)) if (r.ligado) historico.push([0, id, true]);
      return historico;
    },
    // O que mudou desde o último quadro: pinos, brilho médio de cada LED, texto novo da serial.
    quadro() {
      acumular(emu.ciclos);
      const janela = (emu.ciclos - inicioDoQuadro) / FREQUENCIA;
      const leds = {};
      for (const [id, r] of Object.entries(analise.componentes)) {
        if (r.ligado === undefined) continue;
        const media = janela > 0 ? (somas[id] || 0) / janela : r.corrente;
        leds[id] = { corrente: media, brilho: Math.min(1, media / 0.015), ligado: media >= 50e-6 };
      }
      inicioDoQuadro = emu.ciclos;
      somas = {};
      const texto = serial.length ? decodificador.decode(new Uint8Array(serial), { stream: true }) : "";
      serial = [];
      return { tempo: emu.ciclos / FREQUENCIA, ciclos: emu.ciclos, pinos, leds, serial: texto, baud: emu.usart.baudRate };
    },
  };
}

export { PINOS };
