// ATmega328P a 16 MHz emulado pelo avr8js: CPU, timers 0 a 2, portas B, C e D, serial (USART0) e ADC.
// O firmware é o .hex que o arduino-cli gerou na CI; aqui não se compila nada.

import { CPU } from "./vendor/avr8js/cpu/cpu.js";
import { avrInstruction } from "./vendor/avr8js/cpu/instruction.js";
import { adcConfig, AVRADC } from "./vendor/avr8js/peripherals/adc.js";
import { AVRIOPort, PinState, portBConfig, portCConfig, portDConfig } from "./vendor/avr8js/peripherals/gpio.js";
import { AVRTimer, timer0Config, timer1Config, timer2Config } from "./vendor/avr8js/peripherals/timer.js";
import { AVRUSART, usart0Config } from "./vendor/avr8js/peripherals/usart.js";
import { CANAL_ADC, PINOS } from "./uno.js";

export const FREQUENCIA = 16e6;

const MODOS = { [PinState.Low]: "saida", [PinState.High]: "saida", [PinState.Input]: "entrada", [PinState.InputPullUp]: "pullup" };

export function criarEmulador(flash) {
  const cpu = new CPU(new Uint16Array(flash.buffer.slice(flash.byteOffset, flash.byteOffset + flash.byteLength)));
  for (const config of [timer0Config, timer1Config, timer2Config]) new AVRTimer(cpu, config);
  const portas = { B: new AVRIOPort(cpu, portBConfig), C: new AVRIOPort(cpu, portCConfig), D: new AVRIOPort(cpu, portDConfig) };
  const usart = new AVRUSART(cpu, usart0Config, FREQUENCIA);
  const adc = new AVRADC(cpu, adcConfig);
  let mudou = true;
  for (const porta of Object.values(portas)) porta.addListener(() => { mudou = true; });
  const fila = []; // bytes esperando para entrar pela serial (RX)

  return {
    cpu,
    usart,
    get ciclos() {
      return cpu.cycles;
    },
    get tempo() {
      return cpu.cycles / FREQUENCIA;
    },
    // Roda até o ciclo `ate`. aoMudar(ciclo) é chamado logo depois de cada instrução que mexe nos pinos.
    executar(ate, aoMudar) {
      while (cpu.cycles < ate) {
        avrInstruction(cpu);
        cpu.tick();
        if (mudou) {
          mudou = false;
          if (aoMudar) aoMudar(cpu.cycles);
        }
        if (fila.length && !usart.rxBusy) usart.writeByte(fila.shift());
      }
    },
    // { D8: { modo: "saida", nivel: 1 }, D2: { modo: "pullup", nivel: 1 }, ... } para os 20 pinos.
    pinos() {
      const saida = {};
      for (const [nome, [porta, bit]] of Object.entries(PINOS)) {
        const s = portas[porta].pinState(bit);
        saida[nome] = { modo: MODOS[s], nivel: s === PinState.High || s === PinState.InputPullUp ? 1 : 0 };
      }
      return saida;
    },
    // Nível que chega num pino de entrada, vindo do circuito.
    definirEntrada(pino, alto) {
      const [porta, bit] = PINOS[pino];
      portas[porta].setPin(bit, alto);
    },
    // Tensão nas entradas analógicas (A0 a A5), lida pelo analogRead.
    definirTensao(pino, volts) {
      if (pino in CANAL_ADC) adc.channelValues[CANAL_ADC[pino]] = Math.min(5, Math.max(0, volts));
    },
    receberSerial(bytes) {
      fila.push(...bytes);
    },
    // Chama fn daqui a `ciclos` ciclos, no tempo simulado (o eco do sensor ultrassônico usa isto).
    agendar(ciclos, fn) {
      cpu.addClockEvent(fn, Math.max(1, Math.round(ciclos)));
    },
  };
}
