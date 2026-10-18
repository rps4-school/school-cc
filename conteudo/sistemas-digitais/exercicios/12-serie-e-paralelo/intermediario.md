# 🔗 Circuitos em série e paralelo · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Circuitos em série e paralelo](../../aulas/12-circuitos-serie-e-paralelo.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Três ramos em paralelo

Três resistores, de 20 Ω, 30 Ω e 60 Ω, estão em paralelo numa bateria de 12 V.

**a)** Qual é a resistência equivalente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `10 Ω`

1 / R eq = 1/20 + 1/30 + 1/60 = 3/60 + 2/60 + 1/60 = 6/60. Invertendo: R eq = 60 / 6 = **10 Ω**, menor que o menor dos três.
</details>

**b)** Qual é a tensão no resistor de 30 Ω?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `12 V`

Em paralelo, todos ficam com a tensão da bateria: **12 V**.
</details>

**c)** Qual é a corrente no resistor de 20 Ω?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `0,6 A`

i = 12 / 20 = **0,6 A**
</details>

**d)** Qual é a corrente total da bateria?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,2 A`

| Ramo | Corrente |
| ---- | -------- |
| 20 Ω | 12 / 20 = 0,6 A |
| 30 Ω | 12 / 30 = 0,4 A |
| 60 Ω | 12 / 60 = 0,2 A |
| **Total** | **1,2 A** |

Conferindo com a R eq: 12 / 10 = 1,2 A.
</details>

---

## Exercício 05: O mesmo par, duas ligações

Você tem uma bateria de 9 V e dois resistores de 45 Ω.

**a)** Ligados em **série**, qual é a resistência equivalente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `90 Ω`

45 + 45 = **90 Ω**
</details>

**b)** Em série, qual é a tensão em cada resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4,5 V`

Iguais em série dividem a tensão ao meio: 9 / 2 = **4,5 V**.
</details>

**c)** Ligados em **paralelo**, qual é a resistência equivalente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `22,5 Ω`

Iguais em paralelo: 45 / 2 = **22,5 Ω**
</details>

**d)** Em paralelo, qual é a corrente total da bateria?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `0,4 A`

i = 9 / 22,5 = **0,4 A** (0,2 A em cada resistor). Em série, ela seria só 9 / 90 = 0,1 A: a ligação em paralelo puxa **4 vezes mais** corrente da bateria.
</details>

---

## Exercício 06: Divisor de tensão para o Arduino

Um módulo fornece **9 V**, mas o pino do Arduino aceita no máximo **5 V**. Para baixar a tensão, usa-se um divisor: R₁ em cima e R₂ ligado ao GND, com o pino no ponto do meio.

**a)** Com R₁ = 10 kΩ e R₂ = 10 kΩ, qual tensão chega ao pino?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4,5 V`

U saída = 9 · 10 / (10 + 10) = **4,5 V**: resistores iguais dividem ao meio.
</details>

**b)** E com R₁ = 3,3 kΩ e R₂ = 4,7 kΩ?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `5,29 V ± 0,01 V`

U saída = 9 · 4,7 / (3,3 + 4,7) = 9 · 4,7 / 8 ≈ **5,29 V**
</details>

**c)** A montagem do item b é segura para o pino? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

5,29 V passa do máximo de 5 V. O resistor ligado ao GND ficou grande demais: para baixar a saída, R₂ precisa ser menor em relação a R₁ (como no item a).
</details>
