# 🔋 Tensão, corrente, resistência e Lei de Ohm · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Tensão, corrente, resistência e Lei de Ohm](../../aulas/11-lei-de-ohm.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: LED verde no Arduino

Um LED verde (U do LED = 2,2 V) vai no pino de 5 V do Arduino, com corrente de 10 mA.

**a)** Qual é o resistor **calculado**?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `280 Ω`

R = (5 − 2,2) / 0,01 = 2,8 / 0,01 = **280 Ω**
</details>

**b)** Qual **valor comercial** da série E12 você usaria?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `330 Ω`

Na série E12, 280 fica entre **270** e **330**. O próximo **acima** é **330 Ω** (com 270 Ω, a corrente passaria um pouco dos 10 mA).
</details>

**c)** Com o resistor comercial, qual é a corrente no LED?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `8,48 mA ± 0,02 mA`

i = 2,8 / 330 ≈ 0,00848 A ≈ **8,48 mA**: um pouco abaixo dos 10 mA planejados, como esperado.
</details>

---

## Exercício 05: A tensão no resistor

Passam 10 mA por um resistor de 470 Ω.

**a)** Qual é a tensão no resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4,7 V`

U = R · i = 470 · 0,01 = **4,7 V**. Com o atalho: 0,47 kΩ · 10 mA = 4,7 V.
</details>

**b)** Se a corrente cair para a metade, qual será a nova tensão?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2,35 V`

Com o mesmo resistor, tensão e corrente são proporcionais: metade da corrente, metade da tensão. 4,7 / 2 = **2,35 V**.
</details>

**c)** (ampliação) Qual é a potência dissipada no resistor no item a?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `47 mW`

P = U · i = 4,7 · 0,01 = 0,047 W = **47 mW**, bem abaixo dos 250 mW de um resistor de 1/4 W.
</details>

---

## Exercício 06: Proporção

**a)** Com o mesmo resistor, a tensão passou de 3 V para 9 V. A corrente era 6 mA. Qual é a nova corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `18 mA`

A tensão **triplicou** (9 / 3 = 3), então a corrente também triplica: 6 · 3 = **18 mA**.
</details>

**b)** Com a mesma tensão, um resistor de 1 kΩ foi trocado por um de 4 kΩ. A corrente era 8 mA. Qual é a nova corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2 mA`

A resistência ficou **4 vezes maior**, então a corrente fica 4 vezes menor: 8 / 4 = **2 mA**.
</details>

**c)** Na mesma tensão do item b, qual resistor faria a corrente ficar em 16 mA?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `500 Ω`

Primeiro a tensão: U = 1 kΩ · 8 mA = 8 V. Depois: R = 8 / 0,016 = **500 Ω**. Faz sentido: o dobro da corrente original pede metade da resistência original.
</details>
