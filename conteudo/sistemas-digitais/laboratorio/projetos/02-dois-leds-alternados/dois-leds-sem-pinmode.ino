// Projeto 02 · Dois LEDs alternados, com defeito: falta o pinMode do LED B.
// O pino 9 continua como entrada, e o digitalWrite(HIGH) só liga o pull-up interno: o LED B fica fraquinho.

const int LED_A = 8;
const int LED_B = 9;

void setup() {
  pinMode(LED_A, OUTPUT);
}

void loop() {
  digitalWrite(LED_A, HIGH);
  digitalWrite(LED_B, LOW);
  delay(500);

  digitalWrite(LED_A, LOW);
  digitalWrite(LED_B, HIGH);
  delay(500);
}
