# 🔧 Circuitos combinacionais · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Circuitos combinacionais](../../aulas/08-circuitos-combinacionais.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Calculando a saída

Calcule **x = AB + C'** para A = 1, B = 0, C = 0.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

1 · 0 + 0' = 0 + 1 = **1**
</details>

---

## Exercício 02: Do circuito para a expressão

Uma porta **NOT** inverte B. Uma porta **AND** recebe **A** e a saída do NOT. A saída da AND entra numa porta **OR** junto com **C**. Escreva a expressão da saída.

<details>
<summary>Ver resposta</summary>

**Expressão:** `AB' + C`

| Porta | Recebe | Saída |
| ----- | ------ | ----- |
| NOT | B | B' |
| AND | A e B' | AB' |
| OR | AB' e C | **AB' + C** |
</details>

---

## Exercício 03: Cuidado com a ordem

Calcule **A + BC** para A = 0, B = 1, C = 0.

<details>
<summary>Ver resposta</summary>

**Resposta:** `0`

AND antes de OR: BC = 1 · 0 = 0. Depois, A + 0 = 0 + 0 = **0**.

(Se você fez (A + B)·C, deu 0 também por coincidência. Com A = 1, B = 0, C = 0, as duas dariam resultados diferentes.)
</details>
