// Projeto 01 · Blink com intervalo de 500 ms: período de 1 s, o dobro da frequência do original.

const int LED = 8;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED, HIGH);
  Serial.println("Ligado");
  delay(500);

  digitalWrite(LED, LOW);
  Serial.println("Desligado");
  delay(500);
}
