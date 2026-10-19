// Projeto 05 · Pisca sem delay, do jeito errado: os mesmos dois LEDs com delay().
// Cada delay() para o programa inteiro, então os dois LEDs ficam presos no mesmo ritmo.

const int LED_A = 8;
const int LED_B = 9;

void setup() {
  pinMode(LED_A, OUTPUT);
  pinMode(LED_B, OUTPUT);
}

void loop() {
  digitalWrite(LED_A, HIGH);
  delay(500);
  digitalWrite(LED_A, LOW);
  delay(500);

  digitalWrite(LED_B, HIGH);
  delay(300);
  digitalWrite(LED_B, LOW);
  delay(300);
}
