# 🔧 Circuitos combinacionais · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Circuitos combinacionais](../../aulas/08-circuitos-combinacionais.md) · Próximo: [Mapa de Karnaugh →](../09-karnaugh/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Cofre com três chaves

O cofre de um banco abre (x = 1) quando o **gerente (A)** gira a chave dele **e** pelo menos um dos dois **caixas (B ou C)** gira a sua.

**a)** Escreva a coluna da saída da tabela-verdade, de 000 até 111.

<details>
<summary>Ver resposta</summary>

**Resposta:** `00000111`

| A | B | C | B + C | **x** |
| - | - | - | ----- | ----- |
| 0 | 0 | 0 | 0 | **0** |
| 0 | 0 | 1 | 1 | **0** |
| 0 | 1 | 0 | 1 | **0** |
| 0 | 1 | 1 | 1 | **0** |
| 1 | 0 | 0 | 0 | **0** |
| 1 | 0 | 1 | 1 | **1** |
| 1 | 1 | 0 | 1 | **1** |
| 1 | 1 | 1 | 1 | **1** |

Coluna: **00000111**.
</details>

**b)** Escreva a soma de produtos (um produto para cada linha com 1).

<details>
<summary>Ver resposta</summary>

**Expressão:** `AB'C + ABC' + ABC`

Linhas com 1: 101, 110 e 111 → **AB'C + ABC' + ABC**. (Simplificando, dá **A(B + C)**, o que o corretor também aceita.)
</details>

---

## Exercício 08: Circuito descrito por ligações

Um circuito é descrito assim: **P1 = NOR(A, B)**; **P2 = AND(P1, C)**; **x = OR(P2, D)**.

**a)** Escreva a expressão de x.

<details>
<summary>Ver resposta</summary>

**Expressão:** `(A + B)'C + D`

| Porta | Expressão da saída |
| ----- | ------------------ |
| P1 = NOR(A, B) | (A + B)' |
| P2 = AND(P1, C) | (A + B)'C |
| x = OR(P2, D) | **(A + B)'C + D** |
</details>

**b)** Quanto vale x com A = 0, B = 0, C = 1, D = 0?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

(0 + 0)' = 1; 1 · 1 = 1; 1 + 0 = **1**.
</details>

---

## Exercício 09: Detector de paridade

Para detectar erros de transmissão, um circuito recebe 3 bits (A, B, C) e dá **1** quando a quantidade de bits 1 é **ímpar**.

**a)** Escreva a coluna da saída, de 000 até 111.

<details>
<summary>Ver resposta</summary>

**Resposta:** `01101001`

| A | B | C | Quantos 1? | **x** |
| - | - | - | ---------- | ----- |
| 0 | 0 | 0 | 0 | **0** |
| 0 | 0 | 1 | 1 | **1** |
| 0 | 1 | 0 | 1 | **1** |
| 0 | 1 | 1 | 2 | **0** |
| 1 | 0 | 0 | 1 | **1** |
| 1 | 0 | 1 | 2 | **0** |
| 1 | 1 | 0 | 2 | **0** |
| 1 | 1 | 1 | 3 | **1** |

Coluna: **01101001**.
</details>

**b)** Escreva a expressão usando XOR.

<details>
<summary>Ver resposta</summary>

**Expressão:** `A ⊕ B ⊕ C`

XOR dá 1 quando as entradas são diferentes, ou seja, quando há **um** 1 entre duas. Encadeando: **A ⊕ B ⊕ C** dá 1 quando a quantidade de 1s é ímpar. Em soma de produtos seriam 4 produtos: A'B'C + A'BC' + AB'C' + ABC.
</details>
