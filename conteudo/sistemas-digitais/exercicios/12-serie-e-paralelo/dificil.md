# 🔗 Circuitos em série e paralelo · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Circuitos em série e paralelo](../../aulas/12-circuitos-serie-e-paralelo.md) · Próximo: [Protoboard →](../13-protoboard/facil.md)

Resolva no papel primeiro. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Circuito misto

O circuito tem a mesma forma do Exemplo 5 da aula, com outros valores: uma bateria de **12 V**, R₁ = **200 Ω** em série com o paralelo de R₂ = **600 Ω** e R₃ = **300 Ω**.

**a)** Qual é a resistência equivalente do paralelo de R₂ e R₃?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 Ω`

(600 · 300) / (600 + 300) = 180 000 / 900 = **200 Ω**
</details>

**b)** Qual é a resistência equivalente do circuito todo?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `400 Ω`

R₁ em série com o paralelo: 200 + 200 = **400 Ω**
</details>

**c)** Qual é a corrente da bateria?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `30 mA`

i = 12 / 400 = 0,03 A = **30 mA**. Toda ela passa por R₁.
</details>

**d)** Qual é a tensão no paralelo (em R₂ e em R₃)?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `6 V`

U = 200 Ω · 0,03 A = **6 V**. Os outros 6 V ficam em R₁ (200 · 0,03): 6 + 6 = 12 V.
</details>

**e)** Qual é a corrente em R₃?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `20 mA`

i₃ = 6 / 300 = **20 mA**. Em R₂: 6 / 600 = 10 mA. Conferindo: 20 + 10 = 30 mA.
</details>

---

## Exercício 08: Painel de LEDs

Um painel tem **três LEDs vermelhos** (U do LED = 2 V, 15 mA) e é alimentado por **5 V**.

**a)** Ligando os LEDs em paralelo, cada um com o seu resistor, qual é o resistor calculado?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 Ω`

Cada ramo recebe os 5 V: R = (5 − 2) / 0,015 = **200 Ω**.
</details>

**b)** Usando o valor comercial (220 Ω) em cada ramo, qual é a corrente total do painel?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `40,9 mA ± 0,05 mA`

Cada ramo: 3 / 220 ≈ 13,6 mA. Três ramos: 3 · 3 / 220 = 9 / 220 ≈ **40,9 mA**.
</details>

**c)** Dá para ligar os três LEDs em **série** nos 5 V? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

Em série, as tensões dos LEDs somam: 3 · 2 = 6 V, mais do que os 5 V da fonte. Eles nem acendem.
</details>

**d)** Com uma bateria de 9 V, os três LEDs em série a 15 mA: qual é o resistor calculado?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 Ω`

R = (9 − 3 · 2) / 0,015 = 3 / 0,015 = **200 Ω**: o mesmo valor do item a, mas agora um resistor só, para a fileira inteira.
</details>

---

## Exercício 09: Sensor de luz (prévia do Arduino)

Um **LDR** é um resistor que muda com a luz: tem cerca de **10 kΩ no claro** e **100 kΩ na penumbra**. Ele é o R₂ (ligado ao GND) de um divisor de tensão em 5 V, com R₁ = 10 kΩ em cima.

**a)** Qual é a tensão no ponto do meio, no claro?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2,5 V`

U saída = 5 · 10 / (10 + 10) = **2,5 V**
</details>

**b)** E na penumbra?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4,55 V ± 0,01 V`

U saída = 5 · 100 / (10 + 100) = 500 / 110 ≈ **4,55 V**
</details>

**c)** Quando escurece, a tensão no ponto do meio **sobe** ou **desce**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `sobe | aumenta`

No escuro, o LDR (o resistor de baixo) fica maior e pega uma parte maior da tensão: de 2,5 V para cerca de 4,55 V.
</details>

**d)** Se o LDR for para **cima** (como R₁) e o resistor de 10 kΩ para baixo, o que acontece com a tensão do meio quando escurece?

<details>
<summary>Ver resposta</summary>

**Resposta:** `desce | diminui | cai`

Agora o LDR é o de cima: no escuro, U saída = 5 · 10 / (100 + 10) ≈ 0,45 V, contra 2,5 V no claro. Trocar a posição inverte o comportamento. Na aula de leitura analógica, o Arduino vai ler essa tensão para saber se está claro ou escuro.
</details>
