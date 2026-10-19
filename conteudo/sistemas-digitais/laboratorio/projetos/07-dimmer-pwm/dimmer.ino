// Projeto 07 · Dimmer com PWM: o potenciômetro do A0 controla o brilho do LED do pino 9.
// analogRead vai de 0 a 1023 e analogWrite de 0 a 255: o map() faz a conversão.

const int LED = 9;   // pino com ~: faz PWM

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int leitura = analogRead(A0);
  int brilho = map(leitura, 0, 1023, 0, 255);
  analogWrite(LED, brilho);

  Serial.print("Brilho: ");
  Serial.println(brilho);
  delay(250);
}
