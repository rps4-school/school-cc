# 🔋 Experimento 03 · Divisor de tensão

> [← voltar para o Laboratório Arduino](../../README.md)

**Nível:** 🟡 Intermediário

Três divisores na mesma bateria: dois resistores iguais, um potenciômetro e um sensor de luz (LDR). É o circuito que o Arduino usa para ler um botão giratório e a claridade.

> 📖 **Antes, leia:** a seção de divisor de tensão da aula [Circuitos em série e paralelo](../../../aulas/12-circuitos-serie-e-paralelo.md#4-divisor-de-tensão) e o potenciômetro e o LDR em [Componentes eletrônicos](../../../aulas/14-componentes-eletronicos.md).

<div class="laboratorio" data-projeto="circuito.json" data-titulo="Divisor de tensão" data-descricao="Dois resistores de 10 kΩ, um potenciômetro e um LDR com resistor, todos na bateria de 9 V."></div>

> 💡 O laboratório abre só no site. No GitHub, o circuito está em [`circuito.json`](circuito.json).

## 🎯 Objetivo

- Conferir a fórmula do divisor: U saída = U · R₂ / (R₁ + R₂).
- Ver o potenciômetro como um divisor que o aluno ajusta com a mão.
- Ver o LDR mudando a tensão com a luz.

## 🔌 O que já vem montado

| Divisor | Peças | Ponto do meio |
| ------- | ----- | ------------- |
| Fixo | R1 = 10 kΩ (+ → coluna 7) e R2 = 10 kΩ (coluna 7 → −) | Coluna 7 |
| Ajustável | Potenciômetro de 10 kΩ nas colunas 18 a 20: pino 1 no −, pino 3 no + | Coluna 19 (o cursor) |
| De luz | LDR do + até a coluna 26, e 10 kΩ da coluna 26 ao − | Coluna 26 |

O multímetro (em **V**) começa com a ponta vermelha na coluna 7 e a preta no barramento −.

## 🧪 Roteiro

| # | Faça | O que tem que aparecer |
| - | ---- | ---------------------- |
| 1 | Só olhe | **4,50 V**: resistores iguais dividem os 9 V ao meio |
| 2 | Troque R2 por **22 kΩ** | **6,18 V**: o resistor de baixo maior fica com a maior parte |
| 3 | Volte R2 para 10 kΩ. Leve a ponta vermelha para a coluna 19 (linha i) | **4,50 V** com o cursor em 50 % |
| 4 | No potenciômetro, mova o cursor para 0 %, 25 %, 75 % e 100 % | **0 V**, **2,25 V**, **6,75 V** e **9,00 V** |
| 5 | Leve a ponta vermelha para a coluna 26 (linha e). Mude a luz do LDR de 0 % a 100 % | De **89 mV** no escuro a **8,18 V** com luz forte |

> ⚠️ No passo 4, com o cursor em 0 %, o multímetro mostra **450 µV**, quase zero: o simulador deixa uma resistência mínima no cursor, como no componente de verdade.

## ✅ Para conferir

**1.** Com R1 = R2 = 10 kΩ em 9 V, qual é a tensão no ponto do meio?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4,5 V`

9 · 10 / 20 = **4,5 V**.
</details>

**2.** Com o cursor do potenciômetro em 75 % (do pino 1, no −, para o pino 3, no +), qual é a tensão no cursor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `6,75 V`

75 % de 9 V = **6,75 V**.
</details>

**3.** No divisor de luz, a tensão no ponto do meio sobe ou desce quando a luz aumenta? Responda sobe ou desce.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sobe`

Com luz, a resistência do LDR (o de cima) **cai**. O resistor de baixo fica com uma parte maior dos 9 V: a tensão **sobe**.
</details>

## 🧠 O que o simulador simplifica

O LDR vai de 1 MΩ (escuro) a 1 kΩ (luz forte), numa curva parecida com a dos sensores comuns. Um LDR de verdade varia de modelo para modelo: confira o datasheet do seu.

## 📚 Referências

- BOYLESTAD, Robert L. *Introdução à análise de circuitos*. 12. ed. São Paulo: Pearson Prentice Hall, 2012. Capítulo 5 (regra do divisor de tensão).
- MONK, Simon. *Programação com Arduino: começando com sketches*. 2. ed. Porto Alegre: Bookman, 2017. Capítulo sobre entradas analógicas.
