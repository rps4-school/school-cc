// Projeto 04 · Botão e LED: o LED do pino 8 acende enquanto o botão do pino 2 está apertado.
// Com INPUT_PULLUP, o pino 2 fica em HIGH com o botão solto; apertado, o botão liga o pino ao GND (LOW).

const int BOTAO = 2;
const int LED = 8;

void setup() {
  pinMode(BOTAO, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BOTAO) == LOW) {   // apertado
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}
