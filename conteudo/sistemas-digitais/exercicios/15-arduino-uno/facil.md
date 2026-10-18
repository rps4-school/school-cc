# 🤖 Arduino Uno · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Arduino Uno](../../aulas/15-arduino-uno.md) · Próximo: [Intermediário →](intermediario.md)

Resolva com a figura da placa da aula, se precisar. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Os números do Uno

**a)** Quantas entradas analógicas o Uno tem?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

De **A0 a A5**: seis entradas analógicas.
</details>

**b)** Qual é a frequência do clock do ATmega328P, em MHz?

<details>
<summary>Ver resposta</summary>

**Número:** `16`

**16 MHz**: 16 milhões de ciclos por segundo.
</details>

**c)** Quantos KB de SRAM (a memória das variáveis) ele tem?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Só **2 KB** de SRAM, contra 32 KB de flash para o programa. Por isso, no Arduino, cada variável conta.
</details>

---

## Exercício 02: Que placa é essa?

Use a tabela de placas da aula.

**a)** Redonda, feita para costurar em roupas.

<details>
<summary>Ver resposta</summary>

**Resposta:** `LilyPad | Arduino LilyPad | Lily Pad`

A **LilyPad**, ligada com linha condutiva no lugar dos fios.
</details>

**b)** Tem 54 pinos digitais, para projetos com muitos sensores e motores.

<details>
<summary>Ver resposta</summary>

**Resposta:** `Mega 2560 | Mega | Arduino Mega | Arduino Mega 2560`

A **Mega 2560**: 54 digitais e 16 analógicos.
</details>

**c)** Tem Wi-Fi e Bluetooth num formato pequeno.

<details>
<summary>Ver resposta</summary>

**Resposta:** `Nano 33 IoT | Arduino Nano 33 IoT`

A **Nano 33 IoT**. A Uno R4 WiFi também tem Wi-Fi, mas no tamanho do Uno.
</details>

---

## Exercício 03: Partes da placa

**a)** Qual é o nome, no código, do LED que já vem ligado ao pino 13?

<details>
<summary>Ver resposta</summary>

**Resposta:** `LED_BUILTIN`

`LED_BUILTIN`, que no Uno vale 13. Na placa, ele aparece com a letra **L**.
</details>

**b)** Os pinos 0 e 1 têm outra função, além de digitais. Qual?

<details>
<summary>Ver resposta</summary>

**Resposta:** `serial | comunicação serial | a serial | RX e TX | RX/TX | TX e RX`

São a **comunicação serial** (RX no 0, TX no 1), que também é usada para carregar o programa e pelo monitor serial.
</details>

**c)** O pino A0 também pode ser usado como pino digital? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

**Sim:** A0 a A5 leem tensões, mas também funcionam como entradas e saídas digitais.
</details>
