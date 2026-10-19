# 🧩 Desafio 01 · Monte o Blink

> [← voltar para o Laboratório Arduino](../../README.md)

**Nível:** 🟢 Iniciante

O programa do Blink já está na placa, com o LED no pino 8. Falta o circuito: você põe o LED e o resistor na protoboard, liga os fios e o laboratório confere se a montagem funciona.

> 📖 **Antes, leia:** [Saídas digitais, LED e Blink](../../../aulas/17-saidas-digitais.md). O [projeto 01](../../projetos/01-blink/README.md) mostra uma montagem pronta, mas tente sem olhar.

<div class="laboratorio" data-projeto="circuito.json" data-titulo="Desafio no laboratório" data-descricao="Só a placa e a protoboard: monte o LED com resistor no pino 8 e clique em Conferir a montagem, na aba Instruções."></div>

> 💡 O desafio só roda no site. No GitHub, o circuito inicial e os critérios estão em [`circuito.json`](circuito.json).

## 🎯 Objetivo

Montar, do zero, o circuito do Blink: **pino 8 → resistor → LED → GND**.

## ✅ O que o laboratório confere

A conferência não olha **onde** você pôs as peças: ela mede o que o circuito **faz**. Qualquer montagem que funcione passa.

| Critério | Como é conferido |
| -------- | ---------------- |
| Com o pino 8 em HIGH, um LED acende com corrente de 5 mA a 20 mA | O simulador põe o pino 8 em 5 V e calcula a corrente de cada LED |
| Com o pino 8 em LOW, esse LED apaga | O simulador põe o pino em 0 V: se o LED continua aceso, ele está ligado em outro lugar (no 5V, por exemplo) |
| Sem erros na montagem | Nada de curto, LED sem resistor ou corrente demais no pino |

Quando tudo passa, esta página fica marcada como concluída em **Meu progresso**, no site.

## 🆘 Dicas

<details>
<summary>Dica 1: que resistor?</summary>

Com 5 V e um LED de uns 2 V, 220 Ω dá uns 12 mA. Com 1 kΩ, o LED acende fraco (uns 3 mA) e não passa; com 100 Ω, passa do limite.
</details>

<details>
<summary>Dica 2: o LED não acende</summary>

Siga o caminho da corrente com o dedo: pino 8 → resistor → **perna longa** do LED → perna curta → GND. Se o LED estiver virado, selecione e use **Inverter** (tecla I). Lembre que o barramento − precisa de um fio até o GND da placa.
</details>

<details>
<summary>Dica 3: o LED acende, mas não pisca</summary>

O fio está no 5V, e não no pino 8. Clique em **Executar**: o LED do Blink troca a cada segundo.
</details>

## 🔑 Uma montagem que passa

<details>
<summary>Ver uma solução</summary>

| Peça | Onde |
| ---- | ---- |
| Resistor de 220 Ω | Colunas 14 e 18 |
| LED | Perna longa na coluna 18, perna curta na 19 |
| Fios | Pino 8 → coluna 14; coluna 19 → barramento −; barramento − → GND |

Qualquer outra posição com as mesmas ligações também passa.
</details>

## 📚 Referências

- MCROBERTS, Michael. *Arduino básico*. 2. ed. São Paulo: Novatec, 2015. Projeto 1.
- [Exemplo Blink, da documentação do Arduino](https://docs.arduino.cc/built-in-examples/basics/Blink/) (em inglês).
