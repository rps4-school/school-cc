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
const JANELA_DO_SOM = 0.25; // s: a frequência do buzzer é medida nas bordas deste intervalo
const SERVO = { min: 544e-6, max: 2400e-6 }; // largura do pulso em 0° e em 180° (biblioteca Servo)
const ECO = { atraso: 450e-6, porCm: 58.3e-6, semObjeto: 0.038 }; // HC-SR04: ida e volta do som

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
  let estados = {}; // estado interno dos sensores: { us1: { eco: true } }
  let sinais = {}; // nível anterior do sinal que cada buzzer, servo e sensor observa
  let inicioDoPulso = {};
  let bordas = {}; // buzzer → ciclos das bordas de subida recentes
  let angulos = {}; // servo → ângulo
  let medindo = new Set(); // sensores ultrassônicos com um eco agendado

  const uno = () => atual.components.find((c) => c.type === "arduino-uno-r3");

  // Só os pinos que o programa configurou: entrada solta é o padrão do circuito.
  function pinosUsados() {
    const usados = {};
    for (const [nome, p] of Object.entries(pinos)) if (p.modo !== "entrada") usados[nome] = p;
    return usados;
  }

  function resolver() {
    const usados = pinosUsados();
    const chave = JSON.stringify([usados, estados]);
    let a = cache.get(chave);
    if (!a) {
      a = analisar(atual, { pinos: usados, estados });
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
        if (r.canais) {
          for (const [k, canal] of Object.entries(r.canais)) somas[`${id}.${k}`] = (somas[`${id}.${k}`] || 0) + canal.corrente * dt;
        } else if (r.corrente !== undefined && r.ligado !== undefined) {
          somas[id] = (somas[id] || 0) + r.corrente * dt;
        }
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

  // O sensor recebeu o pulso no Trig: o eco sobe depois de uns 450 µs e fica alto pelo tempo da ida e
  // volta do som (58,3 µs por cm). Sem objeto até 4 m, ele desiste depois de 38 ms.
  function disparar(c) {
    const d = c.props.distancia;
    const duracao = d > 400 ? ECO.semObjeto : Math.max(d, 2) * ECO.porCm;
    const atraso = ECO.atraso * FREQUENCIA;
    medindo.add(c.id);
    emu.agendar(atraso, () => {
      estados[c.id] = { eco: true };
      atualizar(emu.ciclos);
    });
    emu.agendar(atraso + duracao * FREQUENCIA, () => {
      estados[c.id] = { eco: false };
      medindo.delete(c.id);
      atualizar(emu.ciclos);
    });
  }

  // Bordas que interessam: o buzzer (para a frequência), o pulso do servo e o Trig do ultrassom.
  function observar(ciclo) {
    for (const c of atual.components) {
      const r = analise.componentes[c.id];
      if (!r || !["buzzer", "servo", "hcsr04"].includes(c.type)) continue;
      const v = c.type === "buzzer" ? r.tensao : r.tensoes[c.type === "servo" ? "sinal" : "trig"];
      const alto = v !== null && v !== undefined && v > 2.5;
      const antes = Boolean(sinais[c.id]);
      sinais[c.id] = alto;
      if (alto === antes) continue;
      if (c.type === "buzzer") {
        if (alto) (bordas[c.id] = bordas[c.id] || []).push(ciclo);
        continue;
      }
      if (alto) {
        inicioDoPulso[c.id] = ciclo;
        continue;
      }
      const largura = inicioDoPulso[c.id] === undefined ? 0 : (ciclo - inicioDoPulso[c.id]) / FREQUENCIA;
      if (!analise.alimentados.has(c.id)) continue;
      if (c.type === "servo" && largura >= 400e-6 && largura <= 2600e-6) {
        angulos[c.id] = Math.min(180, Math.max(0, ((largura - SERVO.min) / (SERVO.max - SERVO.min)) * 180));
      }
      if (c.type === "hcsr04" && largura >= 10e-6 && !medindo.has(c.id)) disparar(c);
    }
  }

  function atualizar(ciclo) {
    acumular(ciclo);
    pinos = emu.pinos();
    const antes = analise;
    analise = resolver();
    alimentarEntradas();
    observar(ciclo);
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
    estados = {};
    sinais = {};
    inicioDoPulso = {};
    bordas = {};
    angulos = {};
    medindo = new Set();
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
      const medir = (chave, agora) => {
        const media = janela > 0 ? (somas[chave] || 0) / janela : agora;
        leds[chave] = { corrente: media, brilho: Math.min(1, media / 0.015), ligado: media >= 50e-6 };
      };
      for (const [id, r] of Object.entries(analise.componentes)) {
        if (r.canais) for (const [k, canal] of Object.entries(r.canais)) medir(`${id}.${k}`, canal.corrente);
        else if (r.ligado !== undefined) medir(id, r.corrente);
      }
      // Frequência de cada buzzer: bordas de subida dos últimos 0,25 s.
      const sons = {};
      for (const [id, lista] of Object.entries(bordas)) {
        const recentes = lista.filter((t) => emu.ciclos - t <= JANELA_DO_SOM * FREQUENCIA);
        bordas[id] = recentes;
        const intervalo = recentes.length >= 2 ? (recentes[recentes.length - 1] - recentes[0]) / FREQUENCIA : 0;
        sons[id] = intervalo > 0 ? (recentes.length - 1) / intervalo : 0;
      }
      inicioDoQuadro = emu.ciclos;
      somas = {};
      const texto = serial.length ? decodificador.decode(new Uint8Array(serial), { stream: true }) : "";
      serial = [];
      return {
        tempo: emu.ciclos / FREQUENCIA, ciclos: emu.ciclos, pinos, leds, serial: texto, baud: emu.usart.baudRate,
        sons, servos: { ...angulos }, estados: JSON.parse(JSON.stringify(estados)),
      };
    },
  };
}

export { PINOS };
