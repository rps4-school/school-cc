# 🔀 Álgebra booleana · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Álgebra booleana](../../aulas/07-algebra-booleana.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Esteira com proteção

Uma esteira de fábrica só liga quando o **botão (B)** está apertado **e** a **tampa de proteção (T)** **não** está aberta. Considere T = 1 quando a tampa está aberta. Escreva a expressão que liga a esteira.

<details>
<summary>Ver resposta</summary>

**Expressão:** `BT'`

"B **e** não T" = **B · T'**.

| B | T | T' | **Liga** |
| - | - | -- | -------- |
| 0 | 0 | 1 | **0** |
| 0 | 1 | 0 | **0** |
| 1 | 0 | 1 | **1** |
| 1 | 1 | 0 | **0** |

Só liga com B = 1 e T = 0.
</details>

---

## Exercício 05: Simplificando passo a passo

Simplifique **(A + 0) · (B · 1) + C · C'**.

<details>
<summary>Ver resposta</summary>

**Expressão:** `AB`

| Passo | Expressão | Propriedade |
| ----- | --------- | ----------- |
| 1 | (A + 0)·(B · 1) + C·C' | — |
| 2 | A · (B · 1) + C·C' | A + 0 = A |
| 3 | A · B + C·C' | B · 1 = B |
| 4 | AB + 0 | C · C' = 0 |
| 5 | **AB** | X + 0 = X |
</details>

---

## Exercício 06: Portas de 5 entradas

Pense numa porta com **5 entradas**.

**a)** Quantas combinações de entrada existem?

<details>
<summary>Ver resposta</summary>

**Resposta:** `32`

2⁵ = **32**.
</details>

**b)** Numa **AND** de 5 entradas, quantas dessas combinações dão saída 1?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

Só a combinação **11111**: **1**.
</details>

**c)** Numa **OR** de 5 entradas, quantas dão saída 1?

<details>
<summary>Ver resposta</summary>

**Resposta:** `31`

Só **00000** dá 0. As outras 32 − 1 = **31** dão 1.
</details>
