# 🔋 Experimento 01 · LED com resistor

> [← voltar para o Laboratório Arduino](../../README.md) · Próximo: [Série e paralelo →](../02-serie-e-paralelo/README.md)

**Nível:** 🟢 Iniciante

Meça a corrente de um LED com o multímetro e veja, sem queimar nada, o que acontece com o resistor errado, sem resistor e com o LED virado.

> 📖 **Antes, leia:** [Tensão, corrente, resistência e Lei de Ohm](../../../aulas/11-lei-de-ohm.md) (o resistor do LED) e [Protoboard, polaridade e medição](../../../aulas/13-protoboard-e-medicao.md).

<div class="laboratorio" data-projeto="circuito.json" data-titulo="LED com resistor" data-descricao="Bateria de 9 V, resistor de 390 Ω, LED vermelho e o multímetro medindo a corrente, já montados."></div>

> 💡 O laboratório abre só no site. No GitHub, o circuito está em [`circuito.json`](circuito.json).

## 🎯 Objetivo

- Conferir no multímetro a conta do resistor do LED.
- Ver os avisos de corrente alta, LED invertido e amperímetro ligado errado.
- Medir as tensões do resistor e do LED e ver que elas somam a da bateria.

## 🔌 O que já vem montado

| Peça | Onde |
| ---- | ---- |
| Bateria de 9 V | + no barramento + de cima, − no barramento − |
| Resistor de 390 Ω | Coluna 3 → coluna 7 (linha a) |
| LED vermelho | Ânodo na coluna 7, cátodo na coluna 8 (linha c) |
| Multímetro em **A** (corrente) | Em série: da coluna 8 (ponta vermelha) ao barramento − (ponta preta) |

Caminho da corrente: + → coluna 3 → resistor → LED → multímetro → −.

## 🧪 Roteiro

| # | Faça | O que tem que aparecer |
| - | ---- | ---------------------- |
| 1 | Só olhe | O LED aceso e o multímetro em **17,9 mA**. A conta: (9 − 2) / 390 ≈ 17,9 mA |
| 2 | Clique no resistor e, na aba **Selecionado**, troque para **270 Ω** | **25,9 mA** e um aviso: acima dos 20 mA recomendados |
| 3 | Troque para **100 Ω** | **66,3 mA** e um erro: o LED queimaria |
| 4 | Volte para 390 Ω. Clique no LED e use **Inverter as pernas** (tecla **I**) | O LED apaga, o multímetro vai a 0 e aparece o aviso de **LED invertido** |
| 5 | Inverta o LED de volta. Passe o mouse num furo livre da coluna 7 | Os furos da tira acendem em verde: a perna do resistor e o ânodo do LED estão ligados por ela |

## 📏 Medindo tensões

O multímetro em **V** mede tensão **em paralelo**. Para isso, ele sai do caminho da corrente, e o caminho precisa ser fechado com um fio:

1. Puxe um fio da coluna 8 (linha e) até o barramento −. Agora o LED volta pelo fio.
2. Clique no multímetro e escolha **tensão (V)**.
3. Clique em cada fio do multímetro e apague, ou use a aba **Conexões**. Ligue a ponta vermelha na coluna 7 e a preta na coluna 8: **2,00 V** no LED.
4. Mude as pontas para as colunas 3 e 7: **7,00 V** no resistor. 2 + 7 = 9 V, a tensão da bateria.

## ⚠️ O erro clássico

Com o multímetro em **A**, ligue as pontas direto no + e no − da bateria (em paralelo). O laboratório mostra o **curto-circuito**: o amperímetro tem resistência quase zero e, em paralelo, vira um fio entre os polos. Na vida real, isso queima o fusível do multímetro (ou a bateria esquenta).

## ✅ Para conferir

**1.** Qual corrente o multímetro mostra no circuito montado (390 Ω)?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `17,9 mA`

(9 − 2) / 390 ≈ 0,0179 A = **17,9 mA**.
</details>

**2.** Com 270 Ω, qual é a corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `25,9 mA`

(9 − 2) / 270 ≈ **25,9 mA**: o LED acende mais forte, mas passa dos 20 mA recomendados.
</details>

**3.** Quanto somam as tensões medidas no LED e no resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `9 V`

2,00 + 7,00 = **9 V**: num circuito em série, as tensões se somam até dar a da fonte.
</details>

## 🧠 O que o simulador simplifica

- A bateria e o LED são quase ideais, como nas contas das aulas: a tensão do LED fica em 2,0 V e a da bateria não cai com a corrente.
- Acima de 30 mA, o LED do simulador não queima: ele só mostra o erro. Na vida real, ele queimaria em pouco tempo.

## 📚 Referências

- BOYLESTAD, Robert L. *Introdução à análise de circuitos*. 12. ed. São Paulo: Pearson Prentice Hall, 2012. Capítulo 4 (Lei de Ohm).
- MCROBERTS, Michael. *Arduino básico*. 2. ed. São Paulo: Novatec, 2015. Projeto 1 (o resistor do LED).
