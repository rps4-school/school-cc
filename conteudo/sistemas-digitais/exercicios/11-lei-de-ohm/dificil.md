# 🔋 Tensão, corrente, resistência e Lei de Ohm · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Tensão, corrente, resistência e Lei de Ohm](../../aulas/11-lei-de-ohm.md) · Próximo: [Série e paralelo →](../12-serie-e-paralelo/facil.md)

Resolva no papel primeiro. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Projeto de uma lanterna

Você vai montar uma lanterna com **3 pilhas AA** (1,5 V cada) em série e um **LED branco** de 3 V, a 20 mA.

**a)** Qual é o resistor calculado?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `75 Ω`

Tensão das pilhas: 3 · 1,5 = 4,5 V. R = (4,5 − 3) / 0,02 = 1,5 / 0,02 = **75 Ω**.
</details>

**b)** Qual valor comercial da série E12 você usaria?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `82 Ω`

75 fica entre 68 e 82 na série E12: o próximo acima é **82 Ω** (o da lanterna da aula 10).
</details>

**c)** Com o resistor comercial, qual é a corrente no LED?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `18,3 mA ± 0,05 mA`

i = 1,5 / 82 ≈ 0,0183 A ≈ **18,3 mA**
</details>

**d)** (ampliação) Qual potência o resistor dissipa?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `27,4 mW ± 0,1 mW`

P = U · i = 1,5 · 0,0183 ≈ 0,0274 W ≈ **27,4 mW**. Um resistor de 1/4 W (250 mW) sobra.
</details>

---

## Exercício 08: Leu as cores errado

Um aluno quer acender um LED vermelho (2 V) no pino de 5 V do Arduino. Ele queria um resistor de **220 Ω**, mas leu as cores errado e usou um de **22 Ω**.

**a)** Pela Lei de Ohm, qual seria a corrente com 22 Ω?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `136 mA ± 1 mA`

i = (5 − 2) / 22 = 3 / 22 ≈ 0,136 A ≈ **136 mA**
</details>

**b)** Isso passa do máximo absoluto de 40 mA do pino? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

136 mA é mais de **3 vezes** o máximo absoluto. Na prática, a resistência interna do pino segura um pouco a corrente (fica perto de 60 mA), mas ainda acima do limite: o LED e o pino podem queimar.
</details>

**c)** Com o resistor certo, de 220 Ω, qual seria a corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `13,6 mA ± 0,05 mA`

i = 3 / 220 ≈ 0,0136 A ≈ **13,6 mA**: dentro do recomendado para o LED e para o pino.
</details>

**d)** Quantas vezes maior é a corrente com o resistor errado?

<details>
<summary>Ver resposta</summary>

**Número:** `10`

220 / 22 = **10**: com a mesma tensão, um resistor 10 vezes menor deixa passar uma corrente 10 vezes maior.
</details>

---

## Exercício 09: Descubra a bateria

Um LED amarelo (U do LED = 2,1 V) está aceso com um resistor de 330 Ω em série. O multímetro mostra **21 mA**.

**a)** Qual é a tensão no resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `6,93 V`

U = R · i = 330 · 0,021 = **6,93 V**
</details>

**b)** Qual é a tensão da bateria?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `9,03 V ± 0,05 V`

A tensão da bateria se divide entre o resistor e o LED: 6,93 + 2,1 = **9,03 V**. É uma bateria de **9 V** (a diferença vem dos valores típicos e da medição).
</details>

**c)** Se o resistor fosse trocado por um de 220 Ω, qual seria a corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `31,5 mA`

O resistor continua com 6,93 V: i = 6,93 / 220 = **31,5 mA**.
</details>

**d)** Essa troca é segura para um LED que trabalha com até 20 mA? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

31,5 mA passa bem dos 20 mA: o LED esquenta e dura muito menos, ou queima.
</details>
