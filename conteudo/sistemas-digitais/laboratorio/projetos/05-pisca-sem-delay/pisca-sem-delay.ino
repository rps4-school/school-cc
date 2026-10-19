// Projeto 05 · Pisca sem delay: dois LEDs em ritmos diferentes, ao mesmo tempo, com millis().
// O LED do pino 8 troca a cada 500 ms e o do pino 9 a cada 300 ms. Nada de delay(): o loop()
// só confere o relógio e segue em frente.

const int LED_A = 8;
const int LED_B = 9;

unsigned long antesA = 0;   // quando o LED A trocou pela última vez
unsigned long antesB = 0;
int estadoA = LOW;
int estadoB = LOW;

void setup() {
  pinMode(LED_A, OUTPUT);
  pinMode(LED_B, OUTPUT);
}

void loop() {
  unsigned long agora = millis();

  if (agora - antesA >= 500) {
    antesA = agora;
    estadoA = !estadoA;
    digitalWrite(LED_A, estadoA);
  }

  if (agora - antesB >= 300) {
    antesB = agora;
    estadoB = !estadoB;
    digitalWrite(LED_B, estadoB);
  }
}
