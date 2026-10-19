// Projeto 11 · Alarme de movimento: o sensor PIR no pino 2 dispara o LED do pino 13 e um bipe no
// buzzer do pino 8. A mensagem só sai quando o movimento começa (borda de subida), não a cada volta.

const int PIR = 2;
const int BUZZER = 8;
const int LED = 13;

int antes = LOW;   // o que o sensor lia na volta anterior

void setup() {
  pinMode(PIR, INPUT);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int agora = digitalRead(PIR);

  if (agora == HIGH && antes == LOW) {
    Serial.println("Movimento!");
  }
  antes = agora;

  if (agora == HIGH) {
    digitalWrite(LED, HIGH);
    tone(BUZZER, 1000);
    delay(150);
    noTone(BUZZER);
    digitalWrite(LED, LOW);
    delay(150);
  }
}
