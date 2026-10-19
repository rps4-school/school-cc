# 📝 Simulado 06 · Sistemas Digitais (fundamentos de Arduino)

> [← voltar para Simulados](../../README.md)

**Nível:** 🟡 Intermediário

**Duração sugerida:** 1h · **Pontuação:** 100 pontos · **Assuntos:** Arduino Uno, programação, saídas digitais, monitor serial e botões (aulas 15 a 19)

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações, calculadora ou IA. As contas foram feitas para sair à mão.
> - **Responda sem rodar o código**, como na prova: leia o programa e preveja o que acontece.
> - **Mostre as contas** no papel: resposta sem desenvolvimento vale metade.
> - Cada questão vale **10 pontos**. Os itens de uma questão valem partes iguais.
> - Só confira as respostas depois que o tempo acabar.

> 💡 **Corrigindo no site:** cada item tem um campo para digitar a sua resposta e conferir na hora. A unidade é opcional e qualquer prefixo vale (`15 mA` ou `0,015 A`). Use só na correção, depois do tempo.

---

## Questão 01 · A placa · 10 pontos

**A placa da feira de ciências.** A equipe vai usar um Arduino Uno R3 no projeto.

**a)** Quantos pinos digitais o Uno tem (do 0 ao 13)?

<details>
<summary>Ver resposta</summary>

**Número:** `14`

Do 0 ao 13 são **14** pinos digitais (6 deles com PWM).
</details>

**b)** Quantas entradas analógicas ele tem?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

De **A0 a A5**: 6 entradas analógicas.
</details>

**c)** O ATmega328P do Uno roda a quantos milhões de ciclos por segundo (MHz)?

<details>
<summary>Ver resposta</summary>

**Número:** `16`

O cristal da placa é de **16 MHz**: 16 milhões de ciclos por segundo.
</details>

---

## Questão 02 · Limites de corrente · 10 pontos

**O placar de LEDs.** Cada LED do placar fica num pino próprio e puxa **15 mA**.

**a)** Com 5 LEDs acesos ao mesmo tempo, qual é a corrente total dos pinos?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `75 mA`

5 × 15 mA = **75 mA**.
</details>

**b)** Cada LED está abaixo do limite recomendado por pino? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

**Sim:** o recomendado por pino é 20 mA, e cada LED puxa 15 mA.
</details>

**c)** O chip aguenta até 200 mA somando todos os pinos. Quantos LEDs de 15 mA, no máximo, podem ficar acesos juntos sem passar disso?

<details>
<summary>Ver resposta</summary>

**Número:** `13`

200 / 15 = 13,3 → **13** LEDs (13 × 15 = 195 mA). Com 14, seriam 210 mA.
</details>

---

## Questão 03 · setup() e loop() · 10 pontos

```cpp
int voltas = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("Ligou");
}

void loop() {
  voltas = voltas + 1;
  Serial.println(voltas);
  delay(500);
}
```

**a)** Nos primeiros 10 s, quantas vezes aparece `Ligou`?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

O `setup()` roda **uma vez**, quando a placa liga.
</details>

**b)** Contando a linha `Ligou`, o que aparece na 4ª linha do monitor?

<details>
<summary>Ver resposta</summary>

**Resposta:** `3`

`Ligou`, `1`, `2`, **`3`**.
</details>

**c)** Se a declaração `int voltas = 0;` for para dentro do `loop()`, que número passa a aparecer em todas as linhas depois de `Ligou`?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

Local, `voltas` nasce com 0 a cada volta, ganha 1 e é impressa: sempre **1**.
</details>

---

## Questão 04 · Tipos e contas · 10 pontos

O que cada variável guarda no fim?

**a)** `byte b = 200; b = b + 100;`

<details>
<summary>Ver resposta</summary>

**Número:** `44`

300 não cabe em 8 bits: 300 − 256 = **44**.
</details>

**b)** `int r = 17 / 5;`

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Divisão entre inteiros joga fora o resto: 17 / 5 = **3** (resto 2).
</details>

**c)** `float m = 17 / 5.0;`

<details>
<summary>Ver resposta</summary>

**Número:** `3,4`

Com `5.0`, a conta é com vírgula: **3,4**.
</details>

---

## Questão 05 · LED no pino · 10 pontos

**O LED amarelo.** Um LED amarelo (2,1 V) vai num pino de 5 V, com **10 mA**.

**a)** Qual resistor dá exatamente 10 mA?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `290 Ω`

R = (5 − 2,1) / 0,010 = 2,9 / 0,010 = **290 Ω**.
</details>

**b)** 290 Ω não é valor comercial. Qual é o valor da série E12 logo acima dele?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `330 Ω`

Na E12: …, 220, 270, **330**, 390… O de cima deixa a corrente um pouco menor, do lado seguro.
</details>

**c)** Com 330 Ω, qual é a corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `8,8 mA ± 0,1 mA`

i = 2,9 / 330 ≈ **8,8 mA**.
</details>

---

## Questão 06 · Blink ritmado · 10 pontos

```cpp
void setup() {
  pinMode(12, OUTPUT);
}

void loop() {
  digitalWrite(12, HIGH);
  delay(250);
  digitalWrite(12, LOW);
  delay(750);
}
```

**a)** Qual é o período do pisca?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1 s`

250 + 750 = 1 000 ms = **1 s**.
</details>

**b)** Em que porcentagem do tempo o LED fica aceso?

<details>
<summary>Ver resposta</summary>

**Número:** `25`

250 de 1 000 ms: **25 %**.
</details>

**c)** O LED foi montado no pino 11. Ele pisca? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

O programa liga e desliga o pino **12**: o LED no 11 fica apagado.
</details>

---

## Questão 07 · Semáforo de pedestre · 10 pontos

Verde no pino 8, amarelo no 9 e vermelho no 10. O ciclo começa em t = 0.

```cpp
void loop() {
  digitalWrite(8, HIGH);
  delay(4000);
  digitalWrite(8, LOW);
  for (int i = 0; i < 3; i++) {
    digitalWrite(9, HIGH);
    delay(500);
    digitalWrite(9, LOW);
    delay(500);
  }
  digitalWrite(10, HIGH);
  delay(5000);
  digitalWrite(10, LOW);
}
```

**a)** Quanto tempo dura um ciclo inteiro?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `12 s`

4 s de verde + 3 × (0,5 + 0,5) s de amarelo piscando + 5 s de vermelho = **12 s**.
</details>

**b)** Qual LED está aceso em t = 5,2 s? Responda verde, amarelo, vermelho ou nenhum.

<details>
<summary>Ver resposta</summary>

**Resposta:** `amarelo`

O amarelo acende em 4 s, apaga em 4,5 s e acende de novo em 5 s: em 5,2 s, **amarelo**.
</details>

**c)** E em t = 6,7 s?

<details>
<summary>Ver resposta</summary>

**Resposta:** `nenhum`

O terceiro aceso do amarelo vai de 6 s a 6,5 s; de 6,5 s a 7 s, tudo apagado: **nenhum**. O vermelho só acende em 7 s.
</details>

---

## Questão 08 · Monitor serial · 10 pontos

**a)** O que aparece com `Serial.println(26, HEX);`?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1A`

26 = 1 × 16 + 10 → **1A**.
</details>

**b)** E com `Serial.println(10, BIN);`?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1010`

10 = 8 + 2 → **1010**.
</details>

**c)** Qual é a primeira linha do monitor depois destes comandos?

```cpp
Serial.print("A");
Serial.print(1);
Serial.println("B");
Serial.println(2);
```

<details>
<summary>Ver resposta</summary>

**Resposta:** `A1B`

`print` continua na mesma linha; só o `println("B")` pula. Primeira linha: **A1B**; segunda: `2`.
</details>

---

## Questão 09 · Caçando o erro · 10 pontos

O botão (com `INPUT_PULLUP`) está no pino 2 e o LED no pino 8.

```cpp
void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);
}

void loop() {
  int b = digitalRead(2);
  if (b = LOW) {
    digitalWrite(8, HIGH);
  } else {
    digitalWrite(8, LOW);
  }
}
```

**a)** Com esse código, quando o LED acende? Responda com a letra.

(a) só com o botão apertado; (b) nunca; (c) sempre.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

`b = LOW` **guarda** 0 em `b` e vale 0, que é "falso": o programa sempre cai no `else`. O LED **nunca** acende.
</details>

**b)** Que operador corrige o `if`?

<details>
<summary>Ver resposta</summary>

**Resposta:** `==`

`if (b == LOW)` **compara**. Um `=` sozinho atribui.
</details>

**c)** Outro aluno acertou o `if`, mas esqueceu o `pinMode(8, OUTPUT)`. Com o botão apertado, o LED fica como? Responda com a letra.

(a) aceso com o brilho todo; (b) aceso bem fraco; (c) piscando.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

Sem `pinMode`, o pino continua entrada: o `digitalWrite(8, HIGH)` só liga o pull-up interno, de dezenas de kΩ. Passa uma corrente minúscula: o LED fica **bem fraco**.
</details>

---

## Questão 10 · Botão e borda · 10 pontos

```cpp
int anterior = HIGH;
int apertos = 0;

void loop() {
  int atual = digitalRead(2);          // INPUT_PULLUP
  if (anterior == HIGH && atual == LOW) {
    apertos = apertos + 1;
    Serial.println(apertos);
  }
  anterior = atual;
  delay(20);
}
```

**a)** Com o botão apertado, `digitalRead(2)` devolve HIGH ou LOW?

<details>
<summary>Ver resposta</summary>

**Resposta:** `LOW | 0`

Com o pull-up interno, apertado liga o pino ao GND: **LOW**.
</details>

**b)** Uma pessoa aperta 4 vezes, devagar. Qual é o último número no monitor?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

Uma borda de descida por aperto: **4**.
</details>

**c)** Ela segura o botão apertado por 3 s, sem soltar. Quantas linhas novas aparecem?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

Segurando, `anterior` e `atual` ficam LOW: só a primeira leitura é borda. **1** linha.
</details>
