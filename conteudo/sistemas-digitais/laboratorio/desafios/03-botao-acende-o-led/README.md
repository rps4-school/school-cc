# 🧩 Desafio 03 · O botão acende o LED

> [← voltar para o Laboratório Arduino](../../README.md)

**Nível:** 🟡 Intermediário

As peças já estão na protoboard (botão, resistor e LED) e o programa já está na placa, mas não há nenhum fio. Ligue tudo para o programa funcionar: o LED acende **só enquanto** o botão está apertado. A conferência roda o programa de verdade e aperta o botão sozinha.

> 📖 **Antes, leia:** [Entradas digitais e botões](../../../aulas/19-entradas-digitais.md). O [projeto 04](../../projetos/04-botao-e-led/README.md) usa o mesmo programa.

<div class="laboratorio" data-projeto="circuito.json" data-titulo="Desafio no laboratório" data-descricao="Botão, resistor e LED na protoboard, sem fios: ligue tudo e clique em Conferir a montagem, na aba Instruções."></div>

> 💡 O desafio só roda no site. No GitHub, o circuito inicial e os critérios estão em [`circuito.json`](circuito.json).

## 🎯 Objetivo

Ler o programa e montar o circuito que ele espera:

```cpp
const int BOTAO = 2;
const int LED = 8;

void setup() {
  pinMode(BOTAO, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BOTAO) == LOW) {   // apertado
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}
```

## ✅ O que o laboratório confere

| Critério | Como é conferido |
| -------- | ---------------- |
| Sem erros na montagem | Com o pino 8 em HIGH: nada de curto, LED sem resistor ou corrente demais no pino |
| O LED acende só enquanto o botão está apertado | O laboratório roda o firmware do projeto 04 no Arduino simulado, com o botão solto, depois apertado, depois solto de novo (50 ms em cada), e olha o LED no fim de cada etapa |

Quando tudo passa, esta página fica marcada como concluída em **Meu progresso**, no site.

## 🆘 Dicas

<details>
<summary>Dica 1: quantos fios?</summary>

Cinco: dois para o botão (pino 2 e GND), dois para o LED (pino 8 e GND) e um do barramento − ao GND da placa.
</details>

<details>
<summary>Dica 2: o botão vai no 5V ou no GND?</summary>

No **GND**. Com o `INPUT_PULLUP`, o pino já fica em HIGH sozinho; apertar precisa levar o pino a LOW. Ligado no 5V, apertar não muda nada.
</details>

<details>
<summary>Dica 3: o LED fica aceso o tempo todo</summary>

O resistor do LED está ligado no 5V, e não no pino 8.
</details>

## 🔑 Uma montagem que passa

<details>
<summary>Ver uma solução</summary>

| Fio | De | Até |
| --- | -- | --- |
| Amarelo | Pino 2 | Coluna 10 (perna do botão) |
| Preto | Coluna 12 (outra perna do botão) | Barramento − |
| Verde | Pino 8 | Coluna 20 (resistor) |
| Preto | Coluna 25 (perna curta do LED) | Barramento − |
| Preto | Barramento − | GND da placa |
</details>

## 📚 Referências

- MCROBERTS, Michael. *Arduino básico*. 2. ed. São Paulo: Novatec, 2015. Projeto 4 (botão).
- [Exemplo Button, da documentação do Arduino](https://docs.arduino.cc/built-in-examples/digital/Button/) (em inglês).
