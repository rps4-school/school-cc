// Projeto 06 · Potenciômetro e monitor serial: lê o A0 e mostra a leitura, a tensão e a posição.
// O cursor do potenciômetro vai no A0; as pontas, no 5V e no GND (um divisor de tensão ajustável).

void setup() {
  Serial.begin(9600);
}

void loop() {
  int leitura = analogRead(A0);                  // 0 a 1023
  float tensao = leitura * 5.0 / 1023;           // 0 a 5 V
  int porcento = map(leitura, 0, 1023, 0, 100);  // 0 a 100 %

  Serial.print("Leitura: ");
  Serial.print(leitura);
  Serial.print("  Tensão: ");
  Serial.print(tensao);
  Serial.print(" V  Posição: ");
  Serial.print(porcento);
  Serial.println(" %");

  delay(250);
}
