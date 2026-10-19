# 🔘 Entradas digitais · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Entradas digitais e botões](../../aulas/19-entradas-digitais.md) · Próximo: [Intermediário →](intermediario.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: O botão no pino 7

Um botão liga o pino 7 ao GND, sem nenhum resistor externo.

**a)** Complete: `pinMode(7, ______);`

<details>
<summary>Ver resposta</summary>

**Resposta:** `INPUT_PULLUP`

Sem resistor externo, quem segura o pino em HIGH com o botão solto é o pull-up **interno**.
</details>

**b)** O que `Serial.println(digitalRead(7));` mostra com o botão **solto**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

Solto, o pull-up puxa o pino para o 5V: HIGH, que é impresso como **1**.
</details>

**c)** E com o botão **apertado**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `0`

Apertado, o botão liga o pino ao GND: LOW, impresso como **0**.
</details>

---

## Exercício 02: HIGH, LOW ou indefinido?

Um Uno alimentado com 5 V recebe estas tensões num pino de entrada. Responda **HIGH**, **LOW** ou **indefinido**.

**a)** 4,2 V

<details>
<summary>Ver resposta</summary>

**Resposta:** `HIGH`

De 3 V para cima é HIGH garantido.
</details>

**b)** 0,9 V

<details>
<summary>Ver resposta</summary>

**Resposta:** `LOW`

De 1,5 V para baixo é LOW garantido.
</details>

**c)** 2,4 V

<details>
<summary>Ver resposta</summary>

**Resposta:** `indefinido`

Entre 1,5 V e 3 V, a leitura pode ser qualquer uma: **indefinido**. Um circuito bem feito nunca deixa a entrada nessa faixa.
</details>

---

## Exercício 03: Pull-down no papel

O botão liga o pino 4 ao **5V**, e um resistor de **10 kΩ** liga o pino 4 ao GND. O pino está como `INPUT`.

**a)** Com o botão solto, `digitalRead(4)` dá HIGH ou LOW?

<details>
<summary>Ver resposta</summary>

**Resposta:** `LOW | 0`

Solto, o único caminho do pino é o resistor até o GND: ele **puxa para baixo** (pull-down). **LOW**.
</details>

**b)** E com o botão apertado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `HIGH | 1`

Apertado, o botão liga o pino direto ao 5V: **HIGH**. Com pull-down, a lógica é a "natural": apertado = HIGH.
</details>

**c)** Com o botão apertado, qual é a corrente no resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `0,5 mA`

O resistor fica entre o 5V (pelo botão) e o GND: i = 5 V / 10 kΩ = **0,5 mA**. Sem esse resistor, apertar o botão seria um curto.
</details>
