# 🔢 Binário · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Sistema binário](../../aulas/02-sistema-binario.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Vagas livres

O painel de um estacionamento guarda em **8 bits** o número de vagas livres. O valor lido foi **0110 1101₂**. Quantas vagas estão livres?

<details>
<summary>Ver resposta</summary>

**Resposta:** `109`

| Peso | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| ---- | --- | -- | -- | -- | - | - | - | - |
| Bit | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 1 |

64 + 32 + 8 + 4 + 1 = **109** vagas.
</details>

---

## Exercício 02: Pelo método da divisão

Converta **78** para binário usando divisões sucessivas por 2.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1001110`

| Divisão | Quociente | Resto |
| ------- | --------- | ----- |
| 78 ÷ 2 | 39 | **0** |
| 39 ÷ 2 | 19 | **1** |
| 19 ÷ 2 | 9 | **1** |
| 9 ÷ 2 | 4 | **1** |
| 4 ÷ 2 | 2 | **0** |
| 2 ÷ 2 | 1 | **0** |
| 1 ÷ 2 | 0 | **1** |

Lendo os restos de baixo para cima: **1001110₂**.

Conferindo: 64 + 8 + 4 + 2 = 78 ✔
</details>

---

## Exercício 03: Campo de 9 bits

Um jogo guarda a pontuação de cada fase num campo de **9 bits**, começando do 0.

**a)** Quantos valores diferentes cabem nesse campo?

<details>
<summary>Ver resposta</summary>

**Resposta:** `512`

2⁹ = **512**.
</details>

**b)** Qual é a maior pontuação possível?

<details>
<summary>Ver resposta</summary>

**Resposta:** `511`

2⁹ − 1 = **511**.
</details>
