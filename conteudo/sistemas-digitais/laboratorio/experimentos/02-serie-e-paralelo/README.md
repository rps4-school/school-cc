# 🔋 Experimento 02 · Série e paralelo

> [← voltar para o Laboratório Arduino](../../README.md) · Próximo: [Divisor de tensão →](../03-divisor-de-tensao/README.md)

**Nível:** 🟡 Intermediário

Meça as tensões e a corrente de dois resistores em série, depois monte os dois em paralelo e compare com as fórmulas da aula.

> 📖 **Antes, leia:** [Circuitos em série e paralelo](../../../aulas/12-circuitos-serie-e-paralelo.md).

<div class="laboratorio" data-projeto="circuito.json" data-titulo="Série e paralelo" data-descricao="R1 (1 kΩ) e R2 (2,2 kΩ) em série numa bateria de 9 V, com o multímetro medindo a tensão em R2."></div>

> 💡 O laboratório abre só no site. No GitHub, o circuito está em [`circuito.json`](circuito.json).

## 🎯 Objetivo

- Ver que, em série, a corrente é a mesma e as tensões se somam.
- Ver que, em paralelo, a tensão é a mesma e as correntes se somam.
- Conferir a resistência equivalente pela corrente total.

## 🔌 O que já vem montado

| Peça | Onde |
| ---- | ---- |
| Bateria de 9 V | Nos barramentos de cima |
| R1 = 1 kΩ | Coluna 3 → coluna 7 |
| R2 = 2,2 kΩ | Coluna 7 → coluna 11 |
| Fios | + → coluna 3; coluna 11 → − |
| Multímetro em **V** | Pontas nas colunas 7 e 11: mede R2 |

## 🧪 Roteiro

**Série**

| # | Faça | O que tem que aparecer |
| - | ---- | ---------------------- |
| 1 | Só olhe | **6,19 V** em R2 |
| 2 | Mude as pontas para as colunas 3 e 7 (aba **Conexões**) | **2,81 V** em R1. Somando: 2,81 + 6,19 = 9 V |
| 3 | Na aba **Medidas**, veja a corrente nos dois resistores | **2,81 mA** nos dois: em série, a corrente é uma só |

Pela fórmula: R eq = 1 000 + 2 200 = 3 200 Ω, e i = 9 / 3 200 ≈ 2,81 mA.

**Paralelo**

| # | Faça | O que tem que aparecer |
| - | ---- | ---------------------- |
| 4 | Apague R2 e o fio da coluna 11. Ponha um resistor de **1 kΩ** da coluna 3 à coluna 7 (linha b), ao lado de R1 | Os dois resistores ligam as mesmas colunas: estão em paralelo |
| 5 | Ponha o multímetro em **A** e em série: ponta vermelha na coluna 7, ponta preta no barramento − | **18,0 mA**: 9 mA em cada resistor |
| 6 | Troque o resistor novo por 2,2 kΩ | **13,1 mA**: 9 mA em R1 e 4,09 mA no de 2,2 kΩ |

Com dois de 1 kΩ: R eq = 1 000 / 2 = 500 Ω, e i = 9 / 500 = 18 mA.

## ✅ Para conferir

**1.** Em série, qual é a tensão em R2 (2,2 kΩ)?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `6,19 V`

i = 9 / 3 200 ≈ 2,81 mA, e U₂ = 2 200 · 0,00281 ≈ **6,19 V**.
</details>

**2.** Com R1 (1 kΩ) e outro de 1 kΩ em paralelo, qual é a corrente total?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `18 mA`

Cada um fica com os 9 V: 9 mA em cada. Total: **18 mA** (ou 9 / 500).
</details>

**3.** No paralelo de 1 kΩ com 2,2 kΩ, qual é a corrente no resistor de 2,2 kΩ?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4,09 mA`

Ele também fica com os 9 V: 9 / 2 200 ≈ **4,09 mA**.
</details>

## 📚 Referências

- BOYLESTAD, Robert L. *Introdução à análise de circuitos*. 12. ed. São Paulo: Pearson Prentice Hall, 2012. Capítulos 5 e 6.
- [Kit para Montar Circuito DC (PhET)](https://phet.colorado.edu/pt_BR/simulations/circuit-construction-kit-dc): para comparar com outro simulador.
