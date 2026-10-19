# 🔘 Entradas digitais · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Entradas digitais e botões](../../aulas/19-entradas-digitais.md) · Próximo: [delay() e millis() →](../20-delay-e-millis/facil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Liga e desliga

```cpp
const int BOTAO = 2;
const int LED = 8;
int anterior = HIGH;
int estado = LOW;

void setup() {
  pinMode(BOTAO, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int atual = digitalRead(BOTAO);
  if (anterior == HIGH && atual == LOW) {
    estado = !estado;
    digitalWrite(LED, estado);
    if (estado == HIGH) {
      Serial.println("Ligado");
    } else {
      Serial.println("Desligado");
    }
  }
  anterior = atual;
}
```

**a)** Com um botão ideal (sem trepidação), a pessoa aperta 5 vezes. No fim, o LED está aceso ou apagado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `aceso | ligado`

Cada aperto inverte o estado, a partir de apagado: aceso, apagado, aceso, apagado, **aceso**. Número ímpar de apertos, LED aceso.
</details>

**b)** Quantas linhas aparecem no monitor?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

Uma linha por borda de descida: **5** (`Ligado`, `Desligado`, `Ligado`, `Desligado`, `Ligado`).
</details>

**c)** Na placa, o botão trepida: em **cada** aperto, o sinal vai a LOW **2 vezes**. Depois dos mesmos 5 apertos, o LED está aceso ou apagado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `apagado | desligado`

São 2 bordas por aperto: 10 inversões. Número par, o LED volta ao começo: **apagado**. Para o aluno, parece que o botão "não funciona" ou "funciona às vezes".
</details>

---

## Exercício 08: Debounce com delay

O código é o da seção 7 da aula, com `anterior = HIGH` e `apertos = 0` declarados fora das funções:

```cpp
void loop() {
  int atual = digitalRead(BOTAO);       // INPUT_PULLUP
  if (atual != anterior) {
    if (atual == LOW) {
      apertos = apertos + 1;
      Serial.println(apertos);
    }
    delay(50);
  }
  anterior = atual;
}
```

**a)** Um aperto trepida 3 vezes em 4 ms e depois fica firme em LOW. Quantos apertos o programa conta?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

A primeira descida conta 1 e para o programa por 50 ms. Quando ele volta a ler, a trepidação (4 ms) já passou e o pino está firme em LOW, igual ao `anterior`: conta **1**.
</details>

**b)** Cada aperto tem duas mudanças (apertar e soltar), e cada mudança trava o programa por 50 ms. No máximo, quantos apertos por segundo ele consegue contar?

<details>
<summary>Ver resposta</summary>

**Número:** `10`

Um aperto ocupa pelo menos 50 + 50 = 100 ms: **10** por segundo. Mais rápido que isso (o que nenhuma pessoa faz), os apertos se perdem.
</details>

**c)** Durante o `delay(50)`, o programa consegue ler outro sensor? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

**Não:** o `delay` para tudo. Com um botão só, tudo bem; com vários sensores, é melhor marcar a hora com `millis()`, como mostra a [aula seguinte](../../aulas/20-delay-e-millis.md).
</details>

---

## Exercício 09: Resistores e registradores

**a)** O pull-up interno de um Uno tem 35 kΩ. Com o botão apertado (pino ligado ao GND), qual é a corrente nele?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `0,14 mA ± 0,01 mA`

i = 5 V / 35 kΩ ≈ 0,000143 A ≈ **0,14 mA**. Bem menos que a corrente de um LED.
</details>

**b)** Um aluno usou um pull-down de **220 Ω** em vez de 10 kΩ. Com o botão apertado, qual é a corrente no resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `22,7 mA ± 0,2 mA`

i = 5 V / 220 Ω ≈ **22,7 mA**: funciona, mas gasta 45 vezes mais que com 10 kΩ só para segurar um botão.
</details>

**c)** Quanta potência esse resistor de 220 Ω dissipa com o botão apertado?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `114 mW ± 2 mW`

P = U² / R = 25 / 220 ≈ 0,114 W = **114 mW**. Um resistor comum de 1/4 W (250 mW) aguenta, mas esquenta à toa.
</details>

**d)** (ampliação) Os pinos 0 a 7 são os bits 0 a 7 do registrador de entrada **PIND**. Os pinos 0 a 7 estão todos em HIGH, menos o 2, que tem um botão apertado (pull-up). Quanto vale `PIND`, em hexadecimal?

<details>
<summary>Ver resposta</summary>

**Resposta:** `FB`

Todos os bits em 1 menos o bit 2: 1111 1011 = **0xFB**. Ler `PIND` pega os 8 pinos de uma vez só.
</details>
