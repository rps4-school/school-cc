// Projeto 02 · Dois LEDs alternados: quando o LED do pino 8 acende,
// o do pino 9 apaga, e eles trocam a cada 500 ms.

const int LED_A = 8;
const int LED_B = 9;

void setup() {
  pinMode(LED_A, OUTPUT);
  pinMode(LED_B, OUTPUT);
}

void loop() {
  digitalWrite(LED_A, HIGH);
  digitalWrite(LED_B, LOW);
  delay(500);

  digitalWrite(LED_A, LOW);
  digitalWrite(LED_B, HIGH);
  delay(500);
}
