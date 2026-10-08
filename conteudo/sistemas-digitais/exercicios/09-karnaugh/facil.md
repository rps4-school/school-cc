# 🗺️ Mapa de Karnaugh · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Mapa de Karnaugh](../../aulas/09-mapa-de-karnaugh.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Mapa de 2 variáveis

Um mapa de 2 variáveis tem **1** nas casas **AB'** e **AB** (e 0 nas outras). Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `A`

| A \ B | **B'** | **B** |
| ----- | ------ | ----- |
| **A'** | 0 | 0 |
| **A** | **1** | **1** |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | linha A inteira | B | **A** |

**x = A**
</details>

---

## Exercício 02: Uma coluna inteira

Uma tabela de 3 variáveis tem saída **1** nas linhas **001, 011, 101 e 111**. Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `C`

| AB \ C | **C'** | **C** |
| ------ | ------ | ----- |
| **A'B'** | 0 | **1** |
| **A'B** | 0 | **1** |
| **AB** | 0 | **1** |
| **AB'** | 0 | **1** |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | coluna C inteira (4 casas) | A e B | **C** |

**x = C**

Um grupo de 4 num mapa de 3 variáveis tira duas letras: sobra uma só.
</details>

---

## Exercício 03: Uma dupla

Uma tabela de 3 variáveis tem saída **1** só nas linhas **100** e **110**. Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `AC'`

| AB \ C | **C'** | **C** |
| ------ | ------ | ----- |
| **A'B'** | 0 | 0 |
| **A'B** | 0 | 0 |
| **AB** | **1** | 0 |
| **AB'** | **1** | 0 |

| Grupo | Casas | O que muda (sai) | Termo |
| ----- | ----- | ---------------- | ----- |
| 1 | coluna C', linhas AB' e AB | B | **AC'** |

**x = AC'**
</details>
