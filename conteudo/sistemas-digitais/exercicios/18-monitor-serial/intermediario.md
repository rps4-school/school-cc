# 📟 Monitor serial · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Monitor serial](../../aulas/18-monitor-serial.md) · Próximo: [Difícil →](dificil.md)

Responda sem rodar o código: é assim na prova. Escreva exatamente o que o monitor mostra. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Contas no monitor

O que aparece em cada linha?

**a)** `Serial.println(9 / 2);`

<details>
<summary>Ver resposta</summary>

**Resposta:** `4`

Divisão entre inteiros: 9 / 2 = 4, com resto jogado fora. Aparece **4**.
</details>

**b)** `Serial.println(9 % 2);`

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

O **resto** da divisão: 9 = 2 × 4 + **1**.
</details>

**c)** `Serial.println(10.0 / 4);`

<details>
<summary>Ver resposta</summary>

**Resposta:** `2.50`

O `10.0` tem vírgula, então a conta dá 2,5. O `println` de um número com vírgula mostra **2 casas** e usa **ponto**: `2.50`.
</details>

---

## Exercício 05: O Blink que fala

```cpp
const int LED = 8;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED, HIGH);
  Serial.println("Ligado");
  delay(1000);

  digitalWrite(LED, LOW);
  Serial.println("Desligado");
  delay(1000);
}
```

**a)** Quantas linhas o monitor mostra nos primeiros 4,5 s?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

Uma linha a cada segundo, começando em 0 s: em 0, 1, 2, 3 e 4 s. São **5** linhas.
</details>

**b)** Qual é a 6ª linha?

<details>
<summary>Ver resposta</summary>

**Resposta:** `Desligado`

As linhas alternam, começando por `Ligado`: as ímpares são `Ligado` e as pares, **`Desligado`**.
</details>

**c)** Alguém tira o LED da protoboard. O monitor para de mostrar as linhas? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

**Não:** o programa continua rodando igual e mandando as mensagens. A serial mostra o que o **programa** faz, e não o que acontece no circuito.
</details>

---

## Exercício 06: A velocidade da serial

**a)** A 9600 baud, quantos bits passam pelo fio em 1 segundo?

<details>
<summary>Ver resposta</summary>

**Número:** `9600`

**Baud** é bits por segundo: 9 600.
</details>

**b)** Cada caractere vai com 1 bit de início, 8 bits de dados e 1 bit de fim. Quantos bits são, ao todo?

<details>
<summary>Ver resposta</summary>

**Número:** `10`

1 + 8 + 1 = **10** bits por caractere.
</details>

**c)** Quantos caracteres por segundo cabem nessa velocidade, no máximo?

<details>
<summary>Ver resposta</summary>

**Número:** `960`

9 600 / 10 = **960** caracteres por segundo.
</details>
