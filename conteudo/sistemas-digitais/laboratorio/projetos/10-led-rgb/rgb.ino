// Projeto 10 · LED RGB: uma cor por segundo, misturando vermelho, verde e azul com PWM.
// O LED é de cátodo comum: a perna maior vai no GND, e cada cor tem o seu resistor.

const int VERMELHO = 9;   // pinos com ~
const int VERDE = 10;
const int AZUL = 11;

void cor(int r, int g, int b, const char *nome) {
  analogWrite(VERMELHO, r);
  analogWrite(VERDE, g);
  analogWrite(AZUL, b);
  Serial.println(nome);
  delay(1000);
}

void setup() {
  pinMode(VERMELHO, OUTPUT);
  pinMode(VERDE, OUTPUT);
  pinMode(AZUL, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  cor(255, 0, 0, "Vermelho");
  cor(0, 255, 0, "Verde");
  cor(0, 0, 255, "Azul");
  cor(255, 255, 0, "Amarelo");
  cor(255, 0, 255, "Magenta");
  cor(255, 255, 255, "Branco");
  cor(0, 0, 0, "Apagado");
}
