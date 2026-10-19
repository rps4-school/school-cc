// Projeto 12 · Cancela automática: o sensor ultrassônico mede a distância e, com um carro a menos
// de 20 cm, o servo levanta a cancela (90°). Sem carro, ela fica baixada (0°).
// O sensor responde a um pulso de 10 µs no Trig com um pulso no Echo que dura 58 µs por centímetro.

#include <Servo.h>

const int TRIG = 9;
const int ECHO = 10;
const int SERVO = 6;

Servo cancela;

long medirDistancia() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long duracao = pulseIn(ECHO, HIGH, 30000);   // até 30 ms; 0 se não voltar eco
  // 58 µs por centímetro (ida e volta). Somar 29 (metade de 58) arredonda para o centímetro mais
  // perto: o pulseIn mede um pouquinho a menos (as interrupções do millis() roubam alguns ciclos),
  // e a divisão inteira sozinha jogaria 49,97 cm para 49.
  return (duracao + 29) / 58;
}

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  cancela.attach(SERVO);
  cancela.write(0);
  Serial.begin(9600);
}

void loop() {
  long distancia = medirDistancia();

  if (distancia > 0 && distancia < 20) {
    cancela.write(90);   // abre
  } else {
    cancela.write(0);    // fecha
  }

  Serial.print("Distância: ");
  Serial.print(distancia);
  Serial.println(" cm");
  delay(200);
}
