# 💻 Programação Arduino · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Programação Arduino em C/C++](../../aulas/16-programacao-arduino.md) · Próximo: [Intermediário →](intermediario.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: De Python para C++

**a)** Em Python, `x = 10` cria uma variável com um número inteiro. Escreva a mesma linha em C++.

<details>
<summary>Ver resposta</summary>

**Resposta:** `int x = 10; | int x = 10`

`int x = 10;`: o **tipo** vem antes do nome e o `;` fecha a instrução.
</details>

**b)** Que sinal termina cada instrução em C++?

<details>
<summary>Ver resposta</summary>

**Resposta:** `; | ponto e vírgula | ponto-e-vírgula`

O **ponto e vírgula** (`;`). Em Python, o fim da linha basta; em C++, não.
</details>

**c)** Como se escreve o `or` do Python em C++?

<details>
<summary>Ver resposta</summary>

**Resposta:** `||`

Duas barras verticais: `||`. O `and` vira `&&` e o `not` vira `!`.
</details>

---

## Exercício 02: Qual é o tipo?

**a)** Que tipo guarda o tempo em milissegundos que o `millis()` devolve?

<details>
<summary>Ver resposta</summary>

**Resposta:** `unsigned long`

`unsigned long`: 32 bits, de 0 a 4 294 967 295 ms (uns 49 dias).
</details>

**b)** Que tipo de 8 bits guarda um número de 0 a 255, como o brilho do PWM?

<details>
<summary>Ver resposta</summary>

**Resposta:** `byte | unsigned char | uint8_t`

`byte`: 8 bits, sem sinal, de 0 a 255.
</details>

**c)** Quantos bits tem o `int` do Uno?

<details>
<summary>Ver resposta</summary>

**Número:** `16`

**16 bits**, de −32 768 a 32 767. No computador, o `int` costuma ter 32 bits: cuidado ao trazer código de lá.
</details>

---

## Exercício 03: `setup()` ou `loop()`?

**a)** Em qual das duas funções vai o `pinMode(8, OUTPUT);`?

<details>
<summary>Ver resposta</summary>

**Resposta:** `setup | setup()`

No `setup()`: o pino só precisa ser configurado **uma vez**.
</details>

**b)** E o código que pisca o LED para sempre?

<details>
<summary>Ver resposta</summary>

**Resposta:** `loop | loop()`

No `loop()`, que se repete sem parar.
</details>

**c)** Cada volta do `loop()` de um sketch leva 1 s. Quantas voltas ele dá em 1 minuto?

<details>
<summary>Ver resposta</summary>

**Número:** `60`

1 minuto = 60 s, e cada volta leva 1 s: **60** voltas.
</details>
