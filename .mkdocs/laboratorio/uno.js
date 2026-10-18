// Arduino Uno: cada pino é um bit de uma porta do ATmega328P (aula 17, seção 7).

export const PINOS = {
  D0: ["D", 0], D1: ["D", 1], D2: ["D", 2], D3: ["D", 3], D4: ["D", 4], D5: ["D", 5], D6: ["D", 6], D7: ["D", 7],
  D8: ["B", 0], D9: ["B", 1], D10: ["B", 2], D11: ["B", 3], D12: ["B", 4], D13: ["B", 5],
  A0: ["C", 0], A1: ["C", 1], A2: ["C", 2], A3: ["C", 3], A4: ["C", 4], A5: ["C", 5],
};

export const PWM = ["D3", "D5", "D6", "D9", "D10", "D11"];
export const CANAL_ADC = { A0: 0, A1: 1, A2: 2, A3: 3, A4: 4, A5: 5 };
export const SERIAL = ["D0", "D1"]; // RX e TX
export const LED_DA_PLACA = "D13"; // o LED L

// Abaixo de 1,5 V o pino lê LOW; acima de 3 V, HIGH (30 % e 60 % de 5 V). No meio, fica o que estava.
export const LIMIAR_BAIXO = 1.5;
export const LIMIAR_ALTO = 3.0;
