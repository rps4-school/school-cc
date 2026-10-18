# 💻 Programação Arduino · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Programação Arduino em C/C++](../../aulas/16-programacao-arduino.md) · Próximo: [Saídas digitais →](../17-saidas-digitais/facil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O valor que dá a volta

Quanto vale a variável no fim de cada trecho?

**a)** `byte b = 200; b = b + 100;`

<details>
<summary>Ver resposta</summary>

**Número:** `44`

200 + 100 = 300, que não cabe em 8 bits (máximo 255). O valor dá a volta: 300 − 256 = **44**.
</details>

**b)** `byte b = 128; b = b * 2;`

<details>
<summary>Ver resposta</summary>

**Número:** `0`

128 × 2 = 256 = 1 0000 0000 em binário: o 1 fica no **9º bit**, que não existe no `byte`. Sobra **0**.
</details>

**c)** `unsigned int u = 0; u = u - 1;`

<details>
<summary>Ver resposta</summary>

**Número:** `65535`

Sem sinal, abaixo de 0 o valor dá a volta para o **maior** valor do tipo: 2¹⁶ − 1 = **65 535** (16 bits em 1).
</details>

---

## Exercício 08: O `if` que sempre acerta

```cpp
int x = 3;

if (x = 1) {
  Serial.println("x vale 1");
}
```

**a)** Depois do `if`, quanto vale `x`?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

`x = 1` **guarda** 1 em `x`; não compara nada. Depois do `if`, `x` vale **1**.
</details>

**b)** Que operador deveria estar no `if` para comparar?

<details>
<summary>Ver resposta</summary>

**Resposta:** `==`

`if (x == 1)` compara sem mudar o `x`.
</details>

**c)** Do jeito que está, a mensagem "x vale 1" aparece? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

**Sim**, sempre. O valor de `x = 1` é 1, e qualquer número diferente de 0 conta como **verdadeiro**. Com os avisos do compilador ligados (na IDE: **Arquivo → Preferências → Avisos do compilador**), aparece *suggest parentheses around assignment used as truth value* apontando a linha.
</details>

---

## Exercício 09: A pegadinha do `1000 * 60`

```cpp
unsigned long umMinuto = 1000 * 60;
```

**a)** Antes de ir para a variável, de que tipo são os números `1000` e `60`?

<details>
<summary>Ver resposta</summary>

**Resposta:** `int`

Um número inteiro escrito no código que cabe num `int` é `int`. Então a conta `1000 * 60` é feita em `int`, de 16 bits no Uno.
</details>

**b)** 60 000 cabe num `int` do Uno? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

**Não:** o `int` vai só até 32 767. A conta estoura **antes** de chegar ao `unsigned long`, e a variável recebe um valor errado. Com os avisos do compilador ligados, a IDE mostra *integer overflow in expression* nessa linha.
</details>

**c)** Qual das linhas guarda 60 000 certo? Responda com a letra.

(a) `unsigned long m = 1000 * 60;`
(b) `unsigned long m = 1000UL * 60;`
(c) `int m = 60000;`

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

Com o `UL`, o `1000` já é `unsigned long`, e a conta inteira é feita em 32 bits. A (a) estoura na conta e a (c) estoura na variável, que é `int`.
</details>
