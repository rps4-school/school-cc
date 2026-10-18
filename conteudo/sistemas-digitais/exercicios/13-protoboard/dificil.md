# 🧪 Protoboard, polaridade e medição · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Protoboard, polaridade e medição](../../aulas/13-protoboard-e-medicao.md) · Próximo: [Componentes →](../14-componentes/facil.md)

Resolva no papel primeiro. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O barramento dividido

Numa protoboard grande, o 5V e o GND do Arduino foram ligados no **começo** dos barramentos + e −, perto da coluna 1. O circuito do LED foi montado perto da **coluna 50** e usa os barramentos + e − dali. A protoboard é do tipo com os barramentos **divididos no meio**.

![Barramento dividido ao meio e um jumper ligando as metades](../../img/protoboard-barramento-dividido.svg)

**a)** O LED acende? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

A alimentação está na metade da **esquerda** dos barramentos; o circuito usa a metade da **direita**. Sem ligação entre as metades, o LED não recebe nada.
</details>

**b)** Com o multímetro em **continuidade**, você encosta uma ponta no + da coluna 1 e a outra no + da coluna 50. Ele apita?

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

O bipe só acontece quando os dois pontos estão ligados. Esse teste é o jeito mais rápido de descobrir se o barramento é dividido.
</details>

**c)** Qual é o número mínimo de jumpers para o LED acender sem mudar o circuito de lugar?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Os dois barramentos estão divididos e o circuito usa os dois: um jumper une as metades do **+** e outro une as metades do **−**.
</details>

---

## Exercício 08: Depurando com o voltímetro

Um LED vermelho com resistor de 220 Ω, no 5V, não acende. Com o circuito ligado, você mede:

| Onde | Tensão |
| ---- | ------ |
| Nas pontas do resistor | 0 V |
| Nas pontas do LED | 5 V |

**a)** Passa corrente no circuito? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

Com 0 V no resistor, i = U / R = 0 / 220 = 0. Não há corrente.
</details>

**b)** Qual é o defeito mais provável? Responda com a letra.

| Letra | Defeito |
| ----- | ------- |
| a | O resistor está em curto (0 Ω) |
| b | O LED está invertido |
| c | O resistor está ligado no GND em vez do 5V |

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

| Letra | O que o voltímetro mostraria |
| ----- | ---------------------------- |
| a | 0 V no resistor, mas com corrente **alta**: o LED acenderia forte (e poderia queimar), em vez de ficar apagado |
| **b** | O LED bloqueia a corrente: **0 V no resistor** e os **5 V todos no LED** ✓ |
| c | Sem 5V no caminho, o LED não teria tensão: 0 V nele |

Toda a tensão "parada" num componente indica que o caminho trava **nele**.
</details>

**c)** Depois de virar o LED, qual tensão o voltímetro deve mostrar no resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 V`

O LED fica com uns 2 V e o resistor com o resto: 5 − 2 = **3 V** (e a corrente vai a 3 / 220 ≈ 13,6 mA).
</details>

---

## Exercício 09: Medindo um painel de LEDs

Um painel tem **3 LEDs vermelhos em paralelo**, cada um com o seu resistor, ligados ao 5V do Arduino. O amperímetro, em série com cada ramo, mostra **15 mA** em cada um.

**a)** Qual é a corrente no fio do GND, que junta os três ramos?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `45 mA`

Em paralelo, as correntes se somam: 3 · 15 = **45 mA**.
</details>

**b)** O voltímetro mostra 2 V em cada LED. Qual é a tensão em cada resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 V`

Cada ramo recebe os 5 V: 5 − 2 = **3 V** no resistor.
</details>

**c)** Qual é o valor dos resistores montados?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 Ω`

R = U / i = 3 / 0,015 = **200 Ω**
</details>

**d)** Para medir a corrente **total** do painel, onde vai o amperímetro? Responda com a letra.

| Letra | Onde |
| ----- | ---- |
| a | Em paralelo com um dos LEDs |
| b | No lugar do fio que leva o 5V ao barramento + |
| c | Entre o barramento + e o barramento − |

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

A corrente total passa pelo fio que alimenta o barramento: o amperímetro entra **no lugar dele**, em série. A opção c é um **curto** (o amperímetro tem quase 0 Ω) e a opção a desvia a corrente do LED.
</details>
