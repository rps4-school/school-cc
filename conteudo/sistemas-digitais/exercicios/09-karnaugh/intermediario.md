# 🗺️ Mapa de Karnaugh · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Mapa de Karnaugh](../../aulas/09-mapa-de-karnaugh.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Grupo de 4 pela borda

Uma tabela de 3 variáveis tem saída **1, 1, 0, 0, 1, 1, 1, 0** (linhas 000 a 111). Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `B' + AC'`

| AB \ C | **C'** | **C** |
| ------ | ------ | ----- |
| **A'B'** | **1** | **1** |
| **A'B** | 0 | 0 |
| **AB** | **1** | 0 |
| **AB'** | **1** | **1** |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | linhas A'B' e AB' inteiras (vizinhas pela borda) | A e C | **B'** |
| 2 | coluna C', linhas AB e AB' | B | **AC'** |

**x = B' + AC'**

O 1 da casa AB'C' entra nos dois grupos, e tudo bem.
</details>

---

## Exercício 05: Quadrado num mapa de 4 variáveis

Um mapa de 4 variáveis tem **1** só nas linhas **0000, 0001, 0100 e 0101** da tabela. Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `A'C'`

| AB \ CD | **C'D'** | **C'D** | **CD** | **CD'** |
| ------- | -------- | ------- | ------ | ------- |
| **A'B'** | **1** | **1** | 0 | 0 |
| **A'B** | **1** | **1** | 0 | 0 |
| **AB** | 0 | 0 | 0 | 0 |
| **AB'** | 0 | 0 | 0 | 0 |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | linhas A'B' e A'B, colunas C'D' e C'D | B e D | **A'C'** |

**x = A'C'**
</details>

---

## Exercício 06: Dois grupos de 4

Um mapa de 4 variáveis tem **1** nas linhas **0, 2, 5, 7, 8, 10, 13 e 15** da tabela-verdade. Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `B'D' + BD`

| AB \ CD | **C'D'** | **C'D** | **CD** | **CD'** |
| ------- | -------- | ------- | ------ | ------- |
| **A'B'** | **1** | 0 | 0 | **1** |
| **A'B** | 0 | **1** | **1** | 0 |
| **AB** | 0 | **1** | **1** | 0 |
| **AB'** | **1** | 0 | 0 | **1** |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | os 4 cantos | A e C | **B'D'** |
| 2 | o quadrado do centro (A'B e AB, C'D e CD) | A e C | **BD** |

**x = B'D' + BD**

Essa função dá 1 quando B = D: é o XNOR de B e D.
</details>
