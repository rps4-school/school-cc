# 🔧 Circuitos combinacionais · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Circuitos combinacionais](../../aulas/08-circuitos-combinacionais.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Tabela-verdade com colunas intermediárias

Monte a tabela-verdade de **x = (A + B')C** e escreva a coluna de x, da linha 000 até a 111 (os 8 bits juntos).

<details>
<summary>Ver resposta</summary>

**Resposta:** `01000101`

| A | B | C | B' | A + B' | **x** |
| - | - | - | -- | ------ | ----- |
| 0 | 0 | 0 | 1 | 1 | **0** |
| 0 | 0 | 1 | 1 | 1 | **1** |
| 0 | 1 | 0 | 0 | 0 | **0** |
| 0 | 1 | 1 | 0 | 0 | **0** |
| 1 | 0 | 0 | 1 | 1 | **0** |
| 1 | 0 | 1 | 1 | 1 | **1** |
| 1 | 1 | 0 | 0 | 1 | **0** |
| 1 | 1 | 1 | 0 | 1 | **1** |

Coluna: **01000101**. Só dá 1 quando C = 1 **e** (A = 1 ou B = 0).
</details>

---

## Exercício 05: Da tabela para a soma de produtos

Uma tabela-verdade de 3 variáveis tem saída **1** só nas linhas **011**, **101** e **110**. Escreva a soma de produtos.

<details>
<summary>Ver resposta</summary>

**Expressão:** `A'BC + AB'C + ABC'`

| Linha | A | B | C | Produto |
| ----- | - | - | - | ------- |
| 011 | 0 | 1 | 1 | **A'BC** |
| 101 | 1 | 0 | 1 | **AB'C** |
| 110 | 1 | 1 | 0 | **ABC'** |

Variável que vale 0 entra barrada. Juntando com OR: **x = A'BC + AB'C + ABC'**. (Essa função dá 1 quando **exatamente dois** bits são 1.)
</details>

---

## Exercício 06: Expressão com NOT por fora

Considere **y = ((A + B)C)' + D**.

**a)** Calcule y para A = 1, B = 0, C = 1, D = 0.

<details>
<summary>Ver resposta</summary>

**Resposta:** `0`

A + B = 1; (A + B)C = 1 · 1 = 1; ((A + B)C)' = 0; 0 + D = 0 + 0 = **0**.
</details>

**b)** E para A = 1, B = 0, C = 1, D = 1?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

Até o NOT é igual (deu 0); depois 0 + 1 = **1**. Com D = 1 a saída é sempre 1.
</details>
