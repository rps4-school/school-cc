# 🧩 Desafio 02 · O resistor certo

> [← voltar para o Laboratório Arduino](../../README.md)

**Nível:** 🟢 Iniciante

Uma bateria de 9 V acende um LED vermelho por um resistor de 100 Ω, e o multímetro mostra a corrente: alta demais. Calcule e escolha um resistor que deixe a corrente **entre 10 mA e 15 mA**.

> 📖 **Antes, leia:** o resistor do LED na aula de [Lei de Ohm](../../../aulas/11-lei-de-ohm.md). O [experimento 01](../../experimentos/01-led-com-resistor/README.md) usa o mesmo circuito.

<div class="laboratorio" data-projeto="circuito.json" data-titulo="Desafio no laboratório" data-descricao="Bateria, resistor de 100 Ω, LED e multímetro: troque o resistor na aba Selecionado e clique em Conferir a montagem, na aba Instruções."></div>

> 💡 O desafio só roda no site. No GitHub, o circuito inicial e os critérios estão em [`circuito.json`](circuito.json).

## 🎯 Objetivo

Usar a Lei de Ohm para escolher um resistor **comercial** (série E12) que deixe o LED com uma corrente segura.

## ✅ O que o laboratório confere

| Critério | Como é conferido |
| -------- | ---------------- |
| O LED acende com corrente entre 10 mA e 15 mA | O simulador calcula a corrente do LED com o resistor que você escolheu |
| Sem erros na montagem | Nada de curto ou LED sem resistor |

Quando tudo passa, esta página fica marcada como concluída em **Meu progresso**, no site.

## 🆘 Dicas

<details>
<summary>Dica 1: a conta</summary>

O resistor fica com o que sobra da bateria: 9 V − 2 V (do LED) = 7 V. Com R = U / i, para 10 mA dá 700 Ω e para 15 mA dá uns 467 Ω. Qualquer valor entre os dois serve.
</details>

<details>
<summary>Dica 2: valores comerciais</summary>

Na série E12, entre 467 Ω e 700 Ω estão **470 Ω**, **560 Ω** e **680 Ω**.
</details>

## 🔑 Solução

<details>
<summary>Ver a solução</summary>

| Resistor | Corrente | Passa? |
| -------- | -------- | ------ |
| 330 Ω | (9 − 2) / 330 ≈ 21 mA | ❌ Demais |
| 470 Ω | ≈ 14,9 mA | ✅ |
| 560 Ω | ≈ 12,5 mA | ✅ |
| 680 Ω | ≈ 10,3 mA | ✅ |
| 820 Ω | ≈ 8,5 mA | ❌ De menos |

560 Ω deixa a corrente bem no meio da faixa.
</details>

## 📚 Referências

- BOYLESTAD, Robert L. *Introdução à análise de circuitos*. 12. ed. São Paulo: Pearson Prentice Hall, 2012. Lei de Ohm.
- [Kit para Montar Circuito DC (PhET)](https://phet.colorado.edu/pt_BR/simulations/circuit-construction-kit-dc).
