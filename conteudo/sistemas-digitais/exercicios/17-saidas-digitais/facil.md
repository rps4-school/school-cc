# 💡 Saídas digitais · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Saídas digitais, LED e Blink](../../aulas/17-saidas-digitais.md) · Próximo: [Intermediário →](intermediario.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Complete o Blink

O LED no pino 8 tem que ficar 0,5 s aceso e 0,5 s apagado.

```cpp
void setup() {
  pinMode(8, ____);        // (a)
}

void loop() {
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, ____);   // (b)
  delay(____);             // (c)
}
```

**a)** O que vai na lacuna (a)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `OUTPUT`

`OUTPUT`: o pino 8 vira **saída**.
</details>

**b)** E na lacuna (b)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `LOW`

`LOW` põe 0 V no pino e apaga o LED.
</details>

**c)** E na lacuna (c)?

<details>
<summary>Ver resposta</summary>

**Número:** `500`

0,5 s = **500 ms**, o mesmo tempo do LED aceso.
</details>

---

## Exercício 02: Tempos em milissegundos

**a)** Quantos milissegundos são 0,3 s?

<details>
<summary>Ver resposta</summary>

**Número:** `300`

0,3 × 1 000 = **300 ms**.
</details>

**b)** Que valor vai no `delay` para esperar 2 s?

<details>
<summary>Ver resposta</summary>

**Número:** `2000`

2 × 1 000 = **2 000 ms**: `delay(2000);`.
</details>

**c)** Um LED pisca com período de 1 s. Quantas vezes ele acende em 1 minuto?

<details>
<summary>Ver resposta</summary>

**Número:** `60`

Um ciclo por segundo, durante 60 s: **60** vezes.
</details>

---

## Exercício 03: O LED no pino

**a)** O ânodo do LED (a perna longa) vai do lado do pino ou do lado do GND?

<details>
<summary>Ver resposta</summary>

**Resposta:** `pino | do pino | lado do pino | do lado do pino`

Do lado do **pino** (pelo resistor). O cátodo, a perna curta, vai ao GND.
</details>

**b)** Com um LED vermelho (2 V), qual resistor deixa 15 mA no pino em HIGH (5 V)?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 Ω`

R = (5 − 2) / 0,015 = **200 Ω**.
</details>

**c)** 200 Ω não existe na série E12. Qual é o valor comercial logo **acima**?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `220 Ω`

Na E12, depois de 180 vem **220 Ω**. Com ele, a corrente fica em 3 / 220 ≈ 13,6 mA.
</details>
