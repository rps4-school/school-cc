// Projeto 03 · Semáforo: verde por 5 s, amarelo por 2 s e vermelho por 5 s,
// um LED de cada vez. O monitor serial mostra a cor de cada fase.

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
  // Siga: só o verde. O vermelho da volta anterior apaga aqui.
  digitalWrite(VERMELHO, LOW);
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
