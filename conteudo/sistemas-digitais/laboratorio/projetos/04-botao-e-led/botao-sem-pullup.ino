// Projeto 04 · Botão e LED, com defeito: o pino do botão está como INPUT, sem o pull-up interno.
// Com o botão solto, o pino 2 fica solto ("flutuando"): no simulador ele lê LOW, e o LED fica aceso.

const int BOTAO = 2;
const int LED = 8;

void setup() {
  pinMode(BOTAO, INPUT);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BOTAO) == LOW) {
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}
