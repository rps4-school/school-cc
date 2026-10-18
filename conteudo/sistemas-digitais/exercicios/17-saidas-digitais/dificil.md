# 💡 Saídas digitais · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Saídas digitais, LED e Blink](../../aulas/17-saidas-digitais.md) · Próximo: [Monitor serial →](../18-monitor-serial/facil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O LED que nunca apaga

Este Blink deixa o LED **sempre aceso**, aparentemente:

```cpp
void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
}
```

**a)** Por quanto tempo o LED fica aceso em cada volta do `loop()`?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1 s`

O `delay(1000)` depois do `HIGH` segura o LED aceso por **1 s**. Depois do `LOW`, o `loop()` recomeça na hora e liga de novo: o LED fica apagado por alguns **microssegundos**, rápido demais para o olho.
</details>

**b)** Para consertar, você põe um `delay` depois do `LOW` e muda o valor do primeiro: o LED tem que piscar com período de **400 ms**, com tempos iguais aceso e apagado. Que valor vai em cada `delay`?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 ms`

Período = aceso + apagado = 400 ms, com os dois iguais: **200 ms** em cada `delay`.
</details>

**c)** Com o conserto, quantas vezes o LED acende em 8 s?

<details>
<summary>Ver resposta</summary>

**Número:** `20`

8 000 / 400 = **20** ciclos, e o LED acende uma vez em cada um.
</details>

---

## Exercício 08: Diagnóstico da montagem

O código é o Blink certo no pino 8. Para cada defeito, responda com a letra.

**a)** O LED está com a perna longa ligada ao GND. O que fazer?

(a) virar o LED; (b) trocar o resistor por um maior; (c) aumentar o `delay`.

<details>
<summary>Ver resposta</summary>

**Resposta:** `a`

O LED está **invertido**: a perna longa (ânodo) tem que ir do lado do pino. Virado, ele bloqueia a corrente e não acende.
</details>

**b)** O código esqueceu o `pinMode(8, OUTPUT);`. O que se vê?

(a) o LED fica bem fraquinho, quase apagado; (b) o LED pisca normal; (c) o LED queima.

<details>
<summary>Ver resposta</summary>

**Resposta:** `a`

Sem o `pinMode`, o pino continua como **entrada**. Nesse caso, `digitalWrite(8, HIGH)` só liga um resistor interno de dezenas de kΩ (o *pull-up*, da aula de entradas): passa uma corrente minúscula e o LED mal acende.
</details>

**c)** O cátodo do LED foi para uma tira da protoboard que não está ligada a nada. O que acontece?

(a) o LED acende normal; (b) o LED não acende: falta o caminho de volta até o GND; (c) o LED pisca mais rápido.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

Sem ligação com o GND, o circuito fica **aberto** e não passa corrente. O pino continua trocando entre 5 V e 0 V, mas o LED não acende.
</details>

---

## Exercício 09: O pino é um bit (ampliação)

Os pinos 8 a 13 do Uno são os bits 0 a 5 do registrador **PORTB**.

**a)** Qual bit do PORTB corresponde ao pino 10?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Pino 8 → bit 0, pino 9 → bit 1, pino 10 → bit **2**.
</details>

**b)** Que valor em hexadecimal, escrito no PORTB, deixa só os pinos **8 e 13** em HIGH?

<details>
<summary>Ver resposta</summary>

**Resposta:** `0x21 | 21`

Pino 8 = bit 0 e pino 13 = bit 5: 0010 0001 em binário = **0x21** (33 em decimal).
</details>

**c)** Depois de `PORTB = 0x0C;` (com os pinos como saída), quais pinos ficam em HIGH?

<details>
<summary>Ver resposta</summary>

**Resposta:** `10 e 11 | 10, 11 | 10 11 | 11 e 10 | 11, 10 | pinos 10 e 11`

0x0C = 0000 1100: bits **2 e 3** em 1, que são os pinos **10 e 11**.
</details>
