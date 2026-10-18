# 📟 Monitor serial · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Monitor serial](../../aulas/18-monitor-serial.md) · Próximo: [Intermediário →](intermediario.md)

Responda sem rodar o código: é assim na prova. Escreva exatamente o que o monitor mostra. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: `print` ou `println`?

```cpp
Serial.print("A");
Serial.print("B");
Serial.println("C");
Serial.println("D");
```

**a)** O que aparece na primeira linha do monitor?

<details>
<summary>Ver resposta</summary>

**Resposta:** `ABC`

Os dois `print` continuam na mesma linha, e o `println("C")` escreve o C e só **então** pula: **ABC**.
</details>

**b)** E na segunda linha?

<details>
<summary>Ver resposta</summary>

**Resposta:** `D`

Depois do pulo de linha, vem o **D**.
</details>

**c)** Quantas linhas com texto aparecem?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

**2** linhas: `ABC` e `D`.
</details>

---

## Exercício 02: Bases no monitor

O que o monitor mostra em cada linha?

**a)** `Serial.println(10, BIN);`

<details>
<summary>Ver resposta</summary>

**Resposta:** `1010`

10 = 8 + 2 = **1010** em binário.
</details>

**b)** `Serial.println(255, HEX);`

<details>
<summary>Ver resposta</summary>

**Resposta:** `FF`

255 = 15 × 16 + 15 → **FF**.
</details>

**c)** `Serial.write(66);`

<details>
<summary>Ver resposta</summary>

**Resposta:** `B`

O `write` manda o **byte** 66, e o monitor mostra o caractere desse código ASCII: **B**.
</details>

---

## Exercício 03: Abrindo a serial

**a)** Em qual função do sketch vai o `Serial.begin`?

<details>
<summary>Ver resposta</summary>

**Resposta:** `setup | setup()`

No `setup()`: a serial só precisa ser aberta **uma vez**.
</details>

**b)** O código tem `Serial.begin(9600);`. Em que velocidade, em baud, o monitor tem que estar?

<details>
<summary>Ver resposta</summary>

**Número:** `9600`

A **mesma** do código: 9600.
</details>

**c)** Quais pinos do Uno a serial usa?

<details>
<summary>Ver resposta</summary>

**Resposta:** `0 e 1 | 0, 1 | 0 1 | 1 e 0 | 1, 0 | pinos 0 e 1 | RX e TX | TX e RX`

Os pinos **0 (RX) e 1 (TX)**. Com a serial ligada, deixe-os livres.
</details>
