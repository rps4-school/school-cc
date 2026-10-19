// Projeto 08 · Luz automática: o LED do pino 8 acende quando escurece.
// O LDR vai do 5V ao A0 e um resistor de 10 kΩ vai do A0 ao GND: com mais luz, a resistência do
// LDR cai e a tensão no A0 sobe. Abaixo do limite, está escuro.

const int LED = 8;
const int LIMITE = 300;   // leitura abaixo disso: escuro

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int luz = analogRead(A0);

  if (luz < LIMITE) {
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }

  Serial.print("Luz: ");
  Serial.println(luz);
  delay(250);
}
