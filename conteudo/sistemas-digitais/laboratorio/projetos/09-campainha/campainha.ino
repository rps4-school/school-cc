// Projeto 09 · Campainha: apertou o botão do pino 2, o buzzer do pino 8 toca "dim-dom".
// tone(pino, frequência) liga a nota e noTone(pino) desliga. O botão usa o pull-up interno.

const int BOTAO = 2;
const int BUZZER = 8;

void setup() {
  pinMode(BOTAO, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(BOTAO) == LOW) {   // apertado
    Serial.println("Dim-dom!");
    tone(BUZZER, 880);   // lá agudo
    delay(300);
    tone(BUZZER, 659);   // mi
    delay(400);
    noTone(BUZZER);
    delay(300);          // pausa antes de tocar de novo
  }
}
