// Projeto 01 · Blink, com defeito: o código usa o pino 7, mas o LED está no pino 8.
// O programa roda normalmente e o pino 7 troca de estado, só que o LED não pisca.

const int LED = 7;

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
