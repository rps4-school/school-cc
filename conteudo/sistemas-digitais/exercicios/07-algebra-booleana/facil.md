# 🔀 Álgebra booleana · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Álgebra booleana](../../aulas/07-algebra-booleana.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Saídas das portas básicas

Dê a saída (0 ou 1) de cada porta.

**a)** **AND** com A = 1 e B = 1

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

AND só dá 1 quando **todas** as entradas são 1: **1**.
</details>

**b)** **OR** com A = 0 e B = 0

<details>
<summary>Ver resposta</summary>

**Resposta:** `0`

OR só dá 0 quando **todas** as entradas são 0: **0**.
</details>

**c)** **NOT** com A = 1

<details>
<summary>Ver resposta</summary>

**Resposta:** `0`

O NOT inverte: **0**.
</details>

**d)** **XOR** com A = 1 e B = 1

<details>
<summary>Ver resposta</summary>

**Resposta:** `0`

XOR dá 1 só quando as entradas são **diferentes**. Aqui são iguais: **0**.
</details>

---

## Exercício 02: Coluna da NAND

Escreva a coluna da saída de uma porta **NAND** para as entradas 00, 01, 10 e 11, nessa ordem (os 4 bits juntos).

<details>
<summary>Ver resposta</summary>

**Resposta:** `1110`

| A | B | AB | **(AB)'** |
| - | - | -- | --------- |
| 0 | 0 | 0 | **1** |
| 0 | 1 | 0 | **1** |
| 1 | 0 | 0 | **1** |
| 1 | 1 | 1 | **0** |

É a coluna da AND invertida: **1110**.
</details>

---

## Exercício 03: Propriedades

Simplifique cada expressão usando as propriedades da álgebra booleana.

**a)** **A + 0**

<details>
<summary>Ver resposta</summary>

**Expressão:** `A`

0 não muda a OR: **A + 0 = A**.
</details>

**b)** **A · A'** (0 ou 1)

<details>
<summary>Ver resposta</summary>

**Resposta:** `0`

Um dos dois sempre vale 0, então a AND dá sempre **0**.
</details>

**c)** **B · B**

<details>
<summary>Ver resposta</summary>

**Expressão:** `B`

Repetir não muda nada: **B · B = B**.
</details>
