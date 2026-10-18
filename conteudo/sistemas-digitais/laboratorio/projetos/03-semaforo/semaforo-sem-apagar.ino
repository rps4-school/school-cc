// Projeto 03 · Semáforo, com defeito: falta apagar o vermelho no começo do loop().
// Da segunda volta em diante, o vermelho fica aceso junto com o verde e o amarelo.

const int VERDE = 8;
const int AMARELO = 9;
const int VERMELHO = 10;

void setup() {
  pinMode(VERDE, OUTPUT);
  pinMode(AMARELO, OUTPUT);
  pinMode(VERMELHO, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Siga: só o verde... só que ninguém apaga o vermelho da volta anterior.
  digitalWrite(VERDE, HIGH);
  Serial.println("Verde");
  delay(5000);

  // Atenção: só o amarelo.
  digitalWrite(VERDE, LOW);
  digitalWrite(AMARELO, HIGH);
  Serial.println("Amarelo");
  delay(2000);

  // Pare: só o vermelho.
  digitalWrite(AMARELO, LOW);
  digitalWrite(VERMELHO, HIGH);
  Serial.println("Vermelho");
  delay(5000);
}
