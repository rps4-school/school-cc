# 🤖 Arduino Uno · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Arduino Uno](../../aulas/15-arduino-uno.md) · Próximo: [Programação Arduino →](../16-programacao-arduino/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O que deu errado?

Responda com a letra da alternativa.

**a)** Você clica em **Carregar** e a IDE diz que não encontra a porta. A placa está ligada (o LED ON acende). O mais provável é:

(a) o código tem um erro de sintaxe; (b) o cabo USB só carrega e não passa dados; (c) o LED do circuito está invertido.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

Erro de sintaxe aparece **antes**, na compilação, e LED invertido não impede o envio. Porta que não aparece costuma ser **cabo só de carga** (ou falta do driver, em placas compatíveis).
</details>

**b)** Um motor que puxa 300 mA foi ligado direto no pino 9. O que acontece?

(a) gira normalmente; (b) o pino pode queimar: o motor precisa de um transistor ou de um módulo; (c) gira mais devagar, sem nenhum risco.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

300 mA é mais de **sete vezes** o máximo absoluto do pino (40 mA). O pino só dá a ordem; quem entrega a corrente é um **transistor** ou um **módulo de ponte H**.
</details>

**c)** O exemplo Blink pisca o LED L da placa, mas o seu LED externo no pino 8 não acende com o seu código. Qual é o primeiro passo?

(a) conferir a montagem: pino, resistor, polaridade do LED e GND; (b) trocar a placa; (c) reinstalar a IDE.

<details>
<summary>Ver resposta</summary>

**Resposta:** `a`

O LED L piscando prova que a placa e a IDE funcionam. O problema está **no circuito ou no pino do código**: confira a montagem.
</details>

---

## Exercício 08: Contas de memória

Ao compilar, a IDE do Arduino mostra mensagens como estas:

```text
Sketch uses 3668 bytes (11%) of program storage space. Maximum is 32256 bytes.
Global variables use 224 bytes (10%) of dynamic memory, leaving 1824 bytes for local variables. Maximum is 2048 bytes.
```

**a)** A flash do ATmega328P tem 32 KB. Quantos bytes são, com 1 KB = 1 024 bytes?

<details>
<summary>Ver resposta</summary>

**Número:** `32768`

32 × 1 024 = **32 768** bytes.
</details>

**b)** O *bootloader* ocupa 512 bytes da flash. Quantos bytes sobram para o programa?

<details>
<summary>Ver resposta</summary>

**Número:** `32256`

32 768 − 512 = **32 256** bytes: é o *Maximum is 32256 bytes* da mensagem.
</details>

**c)** Outro sketch usa **500 bytes** de SRAM em variáveis globais. Quantos bytes sobram para as variáveis locais?

<details>
<summary>Ver resposta</summary>

**Número:** `1548`

A SRAM tem 2 KB = 2 048 bytes: 2 048 − 500 = **1 548** bytes. Na mensagem de exemplo, 2 048 − 224 = 1 824.
</details>

---

## Exercício 09: Qual placa escolher?

Use a tabela de placas da aula.

**a)** Um projeto precisa de **30 pinos digitais**. Qual placa da tabela atende?

<details>
<summary>Ver resposta</summary>

**Resposta:** `Mega 2560 | Mega | Arduino Mega | Arduino Mega 2560`

Só a **Mega 2560** passa de 20 pinos digitais: ela tem 54.
</details>

**b)** Outro projeto precisa de **8 entradas analógicas**, tem que caber na protoboard e ser programado pelo USB da própria placa. Qual?

<details>
<summary>Ver resposta</summary>

**Resposta:** `Nano | Arduino Nano`

Nano e Pro Mini têm 8 analógicas e são pequenas, mas a Pro Mini **não tem USB** na placa. Fica a **Nano**.
</details>

**c)** Um painel precisa de **Wi-Fi** e de uma **matriz de LEDs** na própria placa. Qual?

<details>
<summary>Ver resposta</summary>

**Resposta:** `Uno R4 WiFi | Uno R4 Wi-Fi | Arduino Uno R4 WiFi | Uno R4`

A **Uno R4 WiFi**: o mesmo formato do Uno, com Wi-Fi e a matriz de LEDs.
</details>
