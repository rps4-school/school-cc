# 🗺️ Mapa de Karnaugh · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Mapa de Karnaugh](../../aulas/09-mapa-de-karnaugh.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Faixa de valores

Um número de 4 bits **N = ABCD** (A é o MSB) chega a um circuito que acende um LED quando **6 ≤ N ≤ 11**. Monte o mapa e escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `AB' + A'BC`

| AB \ CD | **C'D'** | **C'D** | **CD** | **CD'** |
| ------- | -------- | ------- | ------ | ------- |
| **A'B'** | 0 | 0 | 0 | 0 |
| **A'B** | 0 | 0 | **1** | **1** |
| **AB** | 0 | 0 | 0 | 0 |
| **AB'** | **1** | **1** | **1** | **1** |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | linha AB' inteira (8, 9, 10, 11) | C e D | **AB'** |
| 2 | linha A'B, colunas CD e CD' (7 e 6) | D | **A'BC** |

**x = AB' + A'BC**

Repare que os números 6 a 11 viram as casas 0110, 0111, 1000, 1001, 1010 e 1011.
</details>

---

## Exercício 08: Ímpares menores que 12

O LED de um contador de 4 bits (N = ABCD) acende quando **N é ímpar e menor que 12**. Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `A'D + B'D`

| AB \ CD | **C'D'** | **C'D** | **CD** | **CD'** |
| ------- | -------- | ------- | ------ | ------- |
| **A'B'** | 0 | **1** | **1** | 0 |
| **A'B** | 0 | **1** | **1** | 0 |
| **AB** | 0 | 0 | 0 | 0 |
| **AB'** | 0 | **1** | **1** | 0 |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | linhas A'B' e A'B, colunas C'D e CD (1, 3, 5, 7) | B e C | **A'D** |
| 2 | linhas A'B' e AB', colunas C'D e CD (1, 3, 9, 11; pela borda) | A e C | **B'D** |

**x = A'D + B'D**

Ímpar = D = 1. Os ímpares 13 e 15 (linha AB) ficam de fora, por isso não dá para usar só D.
</details>

---

## Exercício 09: Três de quatro

Uma votação tem **4 jurados** (A, B, C, D). O projeto passa quando **pelo menos 3** votam sim. Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `ABC + ABD + ACD + BCD`

| AB \ CD | **C'D'** | **C'D** | **CD** | **CD'** |
| ------- | -------- | ------- | ------ | ------- |
| **A'B'** | 0 | 0 | 0 | 0 |
| **A'B** | 0 | 0 | **1** | 0 |
| **AB** | 0 | **1** | **1** | **1** |
| **AB'** | 0 | 0 | **1** | 0 |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | linha AB, colunas CD e CD' (15 e 14) | D | **ABC** |
| 2 | linha AB, colunas C'D e CD (13 e 15) | C | **ABD** |
| 3 | coluna CD, linhas AB e AB' (15 e 11) | B | **ACD** |
| 4 | coluna CD, linhas A'B e AB (7 e 15) | A | **BCD** |

**x = ABC + ABD + ACD + BCD**

A casa 1111 (os quatro votam sim) entra nos quatro grupos. Cada grupo é "três jurados específicos votaram sim".
</details>
