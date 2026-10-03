# 🔢 Binário · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Sistema binário](../../aulas/02-sistema-binario.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Pelo método da subtração

Converta **203** para binário pelo método da **subtração** das potências de 2.

<details>
<summary>Ver resposta</summary>

**Resposta:** `11001011`

| Peso | Cabe? | Bit | Sobra |
| ---- | ----- | --- | ----- |
| 128 | 203 ≥ 128, sim | **1** | 203 − 128 = 75 |
| 64 | 75 ≥ 64, sim | **1** | 75 − 64 = 11 |
| 32 | 11 ≥ 32, não | **0** | 11 |
| 16 | 11 ≥ 16, não | **0** | 11 |
| 8 | 11 ≥ 8, sim | **1** | 11 − 8 = 3 |
| 4 | 3 ≥ 4, não | **0** | 3 |
| 2 | 3 ≥ 2, sim | **1** | 3 − 2 = 1 |
| 1 | 1 ≥ 1, sim | **1** | 1 − 1 = 0 |

**203 = 1100 1011₂**
</details>

---

## Exercício 05: Número com vírgula

Um sensor de nível de água mede **9,375 cm**. Converta esse valor para binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1001,011`

- Parte inteira: 9 = 8 + 1 = **1001₂**
- Parte fracionária (multiplicações por 2):

| Conta | Resultado | Bit |
| ----- | --------- | --- |
| 0,375 × 2 | 0,75 | **0** |
| 0,75 × 2 | 1,5 | **1** |
| 0,5 × 2 | 1 | **1** |

De cima para baixo: 0,011₂. Juntando: **1001,011₂**.
</details>

---

## Exercício 06: Do binário com vírgula para o decimal

Converta **11001,011₂** para decimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `25,375`

| Peso | 16 | 8 | 4 | 2 | 1 | , | 0,5 | 0,25 | 0,125 |
| ---- | -- | - | - | - | - | - | --- | ---- | ----- |
| Bit | 1 | 1 | 0 | 0 | 1 | , | 0 | 1 | 1 |

16 + 8 + 1 + 0,25 + 0,125 = **25,375**
</details>
