# 📡 Sensores e atuadores · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Sensores e atuadores](../../aulas/23-sensores-e-atuadores.md) · Próximo: [Intermediário →](intermediario.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Sensor ou atuador?

Responda **sensor** ou **atuador**.

**a)** PIR

<details>
<summary>Ver resposta</summary>

**Resposta:** `sensor`

O PIR **informa** o Arduino (tem movimento ou não): é um **sensor**.
</details>

**b)** Buzzer

<details>
<summary>Ver resposta</summary>

**Resposta:** `atuador`

O Arduino **comanda** o buzzer: é um **atuador**.
</details>

**c)** HC-SR04

<details>
<summary>Ver resposta</summary>

**Resposta:** `sensor`

O Arduino dispara a medida, mas quem **informa** a distância é o HC-SR04: é um **sensor**.
</details>

---

## Exercício 02: Notas no buzzer

**a)** `tone(8, 440);` toca qual frequência?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `440 Hz`

O segundo argumento é a frequência: **440 Hz** (o lá).
</details>

**b)** Qual é o período dessa onda?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2,27 ms ± 0,01 ms`

T = 1 / 440 ≈ 0,00227 s = **2,27 ms**.
</details>

**c)** Quanto tempo dura a nota de `tone(8, 659, 400);`?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `400 ms`

O terceiro argumento é a duração em ms: **400 ms**. O programa não espera: se a próxima linha tocar outra nota, ela corta essa.
</details>

---

## Exercício 03: O servo

**a)** O servo recebe um pulso a cada 20 ms. Quantos pulsos por segundo?

<details>
<summary>Ver resposta</summary>

**Número:** `50`

1 000 ms / 20 ms = **50** pulsos por segundo (50 Hz).
</details>

**b)** Com a biblioteca `Servo`, um pulso de uns 1,5 ms deixa o eixo em quantos graus?

<details>
<summary>Ver resposta</summary>

**Número:** `90`

1,5 ms é o meio da faixa: **90°**. 0° fica perto de 0,5 ms, e 180°, perto de 2,4 ms.
</details>

**c)** O fio laranja do SG90 vai no 5V, no GND ou no pino do Arduino?

<details>
<summary>Ver resposta</summary>

**Resposta:** `pino | no pino | sinal | pino do Arduino`

Laranja é o **sinal**: vai no **pino**. O vermelho vai no 5V e o marrom no GND.
</details>
