# 🌗 PWM · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [PWM e analogWrite()](../../aulas/22-pwm.md) · Próximo: [Intermediário →](intermediario.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

Use D = valor / 255 e V_média = D · 5 V.

---

## Exercício 01: Os pinos com ~

**a)** Quantos pinos do Uno fazem PWM?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

Os pinos **3, 5, 6, 9, 10 e 11**: 6 ao todo, marcados com ~ na placa.
</details>

**b)** O pino 10 faz PWM? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

**Sim:** o 10 está na lista (timer 1, junto com o 9).
</details>

**c)** O pino 13 faz PWM? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

**Não:** o 13 (o do LED L) só faz liga e desliga.
</details>

---

## Exercício 02: Ciclo de trabalho

Qual é o ciclo de trabalho, em porcentagem?

**a)** `analogWrite(9, 255)`

<details>
<summary>Ver resposta</summary>

**Número:** `100`

255 / 255 = **100 %**: o pino fica sempre em 5 V.
</details>

**b)** `analogWrite(9, 0)`

<details>
<summary>Ver resposta</summary>

**Número:** `0`

**0 %**: o pino fica sempre em 0 V.
</details>

**c)** `analogWrite(9, 191)`

<details>
<summary>Ver resposta</summary>

**Número:** `75 ± 0,5`

191 / 255 ≈ 0,749 → **75 %**.
</details>

---

## Exercício 03: Tensão média

**a)** Qual é a tensão média com `analogWrite(5, 128)`?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2,5 V ± 0,02 V`

D = 128 / 255 ≈ 0,502 → 0,502 · 5 V ≈ **2,5 V**.
</details>

**b)** E com `analogWrite(5, 102)`?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2 V ± 0,02 V`

D = 102 / 255 = 0,4 → 0,4 · 5 V = **2 V**.
</details>

**c)** Que valor de `analogWrite` dá 1 V de média?

<details>
<summary>Ver resposta</summary>

**Número:** `51 ± 1`

D = 1 / 5 = 0,2 → 0,2 · 255 = **51**.
</details>
