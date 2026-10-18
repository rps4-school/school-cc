// Projeto 01 · Blink: o LED do pino 8 fica 1 s aceso e 1 s apagado,
// e o monitor serial mostra cada troca.

const int LED = 8;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED, HIGH);
  Serial.println("Ligado");
  delay(1000);

  digitalWrite(LED, LOW);
  Serial.println("Desligado");
  delay(1000);
}
