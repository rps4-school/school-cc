# 🤖 Arduino Uno · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Arduino Uno](../../aulas/15-arduino-uno.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro, com a Lei de Ohm da [aula 11](../../aulas/11-lei-de-ohm.md). No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Corrente num pino

Um LED vermelho (2 V) está ligado ao pino 9, em HIGH (5 V), com um resistor de **100 Ω**.

**a)** Qual é a corrente no pino?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `30 mA`

O resistor fica com 5 − 2 = 3 V: i = 3 / 100 = 0,03 A = **30 mA**.
</details>

**b)** Ela passa dos 20 mA recomendados? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

**Sim:** 30 mA está acima dos 20 mA recomendados. Ainda não chega aos 40 mA do máximo absoluto, mas o pino trabalha forçado e o LED brilha além do necessário.
</details>

**c)** Qual é o **menor** resistor da série E12 que deixa a corrente em **até 20 mA**?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `150 Ω`

R = 3 / 0,02 = **150 Ω**, que já é um valor da série E12. Um resistor maior (220 Ω, 330 Ω) também serve, com o LED mais fraco.
</details>

---

## Exercício 05: A soma das correntes

Um painel tem LEDs ligados em vários pinos, cada um com **15 mA**.

**a)** Com 8 LEDs acesos ao mesmo tempo, qual é a corrente total?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `120 mA`

8 × 15 = **120 mA**.
</details>

**b)** Isso passa do limite de 200 mA do chip? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

**Não:** 120 mA está abaixo de 200 mA.
</details>

**c)** Quantos LEDs de 15 mA dá para acender ao mesmo tempo, no máximo, sem passar de 200 mA?

<details>
<summary>Ver resposta</summary>

**Número:** `13`

200 / 15 ≈ 13,3. Como não existe um terço de LED, são **13** LEDs (13 × 15 = 195 mA). Com 14, seriam 210 mA.
</details>

---

## Exercício 06: Alimentação

**a)** Pelo cabo USB, qual tensão a placa recebe?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `5 V`

O USB dá **5 V**, que já é a tensão de trabalho da placa.
</details>

**b)** Uma fonte de 9 V pode ser ligada no **jack**? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

**Sim:** o jack aceita de 7 a 12 V. O regulador da placa baixa para 5 V.
</details>

**c)** E a mesma fonte de 9 V pode ser ligada no **pino 5V**? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

**Não:** o pino 5V vai direto no circuito da placa, **sem passar pelo regulador**. Com 9 V ali, o microcontrolador queima. Fonte externa vai no jack ou no VIN.
</details>
