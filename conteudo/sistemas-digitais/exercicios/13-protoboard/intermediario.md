# 🧪 Protoboard, polaridade e medição · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Protoboard, polaridade e medição](../../aulas/13-protoboard-e-medicao.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Onde está o curto?

Uma colega montou um LED vermelho (2 V) com resistor de 220 Ω no 5V do Arduino. Ao ligar o cabo USB, a placa desligou. A montagem foi esta:

| Peça | De | Para |
| ---- | -- | ---- |
| Fio vermelho | 5V do Arduino | barramento + |
| Fio preto | GND do Arduino | barramento − |
| Fio amarelo | barramento + | a5 |
| Resistor | c5 | c9 |
| LED | ânodo em e9 | cátodo em e10 |
| Fio verde | b10 | barramento − |
| Fio azul | d5 | barramento − |

**a)** Qual fio provoca o curto-circuito? Responda com a cor.

<details>
<summary>Ver resposta</summary>

**Resposta:** `azul | fio azul`

A coluna 5 recebe o 5V pelo fio amarelo (a5). O fio azul liga **a mesma coluna 5** (d5) ao barramento −. Resultado: 5V ligado direto no GND, sem nada no meio.
</details>

**b)** Com esse fio no lugar, o LED acende? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

O curto puxa o 5V para perto de 0 V (por isso a placa desligou): não sobra tensão para o LED.
</details>

**c)** Sem o fio azul, qual é a corrente no LED?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `13,6 mA ± 0,05 mA`

i = (5 − 2) / 220 ≈ **13,6 mA**: o resto da montagem está certo.
</details>

---

## Exercício 05: O LED não acende

Outra montagem, com o mesmo LED e resistor:

| Peça | De | Para |
| ---- | -- | ---- |
| Fio vermelho | 5V do Arduino | barramento + |
| Fio preto | GND do Arduino | barramento − |
| Resistor | barramento + | a3 |
| LED | ânodo em e3 | cátodo em f3 |
| Fio verde | e4 | barramento − |

**a)** O furo f3 está ligado ao furo e3? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

O canal central separa e3 (metade de cima) de f3 (metade de baixo). O LED atravessa o canal: tudo bem, as pernas dele **devem** ficar em nós diferentes.
</details>

**b)** Com essa montagem, o LED acende?

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

O cátodo está na coluna 3, metade de **baixo** (f3). O fio verde sai da coluna **4**, metade de cima (e4), que não está ligada a nada. O caminho de volta ao GND não existe.
</details>

**c)** Para consertar, o fio verde deve sair de qual furo: (a) e3, (b) g3 ou (c) e5? Responda com a letra.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

| Opção | O que acontece |
| ----- | -------------- |
| a) e3 | Liga o **ânodo** ao GND: o LED fica em curto e o resistor vai direto para o GND. O LED não acende |
| **b) g3** | Mesmo nó do cátodo (f–j da coluna 3): fecha o caminho. **O LED acende** |
| c) e5 | Coluna vazia: nada muda |
</details>

---

## Exercício 06: O amperímetro no lugar errado

Uma bateria de 9 V alimenta R₁ = 1 kΩ e R₂ = 2 kΩ em série.

**a)** Qual tensão o voltímetro mostra nas pontas de R₂?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `6 V`

i = 9 / 3 000 = 3 mA; U₂ = 2 000 · 0,003 = **6 V**.
</details>

**b)** Qual corrente o amperímetro mostra, ligado em série?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 mA`

i = 9 V / 3 kΩ = **3 mA**
</details>

**c)** Um aluno ligou o amperímetro **em paralelo com R₂**, por engano. Considere o amperímetro ideal (0 Ω). Qual corrente ele mostra?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `9 mA`

O amperímetro, com 0 Ω, é um curto em volta de R₂: sobra só R₁ no circuito. i = 9 / 1 000 = **9 mA**, o triplo do normal.
</details>

**d)** Nessa situação, qual é a tensão em R₂?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `0 V`

R₂ ficou com as duas pontas ligadas pelo amperímetro: **0 V**. Toda a tensão foi para R₁. Por isso o amperímetro nunca vai em paralelo: num circuito sem R₁, ele seria um curto direto na bateria.
</details>
