# 🌗 PWM · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [PWM e analogWrite()](../../aulas/22-pwm.md) · Próximo: [Sensores e atuadores →](../23-sensores-e-atuadores/facil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Lendo o osciloscópio

Um osciloscópio no pino 9 mostra uma onda quadrada que fica **0,51 ms** em 5 V a cada **2,04 ms**.

**a)** Qual é o ciclo de trabalho, em porcentagem?

<details>
<summary>Ver resposta</summary>

**Número:** `25 ± 0,5`

D = 0,51 / 2,04 = 0,25 → **25 %**.
</details>

**b)** Que valor foi passado ao `analogWrite`?

<details>
<summary>Ver resposta</summary>

**Número:** `64 ± 1`

0,25 · 255 ≈ 63,75 → **64**.
</details>

**c)** Qual é a tensão média no pino?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,25 V ± 0,02 V`

0,25 · 5 V = **1,25 V**. Um multímetro em tensão contínua mostraria algo perto disso, porque ele também tira a média.
</details>

---

## Exercício 08: Quem disputa o timer (ampliação)

**a)** O programa toca um `tone()` no pino 8 e, ao mesmo tempo, faz `analogWrite(11, 128)` num LED. Enquanto o tom toca, o LED do pino 11 continua com metade do brilho? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

O `tone()` usa o **timer 2**, o mesmo do PWM dos pinos 3 e 11: enquanto ele toca, o PWM do 11 **não** funciona. Passe o LED para o 5, o 6, o 9 ou o 10.
</details>

**b)** No Uno, a biblioteca `Servo` desliga o PWM de quais pinos? Responda com a letra.

(a) 3 e 11; (b) 5 e 6; (c) 9 e 10.

<details>
<summary>Ver resposta</summary>

**Resposta:** `c`

A `Servo` usa o **timer 1**, que faz o PWM do **9 e do 10**. O servo pode ficar nesses pinos (ele não usa o PWM do `analogWrite`), mas um LED com `analogWrite` ali para de funcionar.
</details>

**c)** Qual timer conta o `millis()` e faz o PWM dos pinos 5 e 6? Responda com o número.

<details>
<summary>Ver resposta</summary>

**Número:** `0`

O **timer 0**. Por isso não se mexe na configuração dele: o `millis()` e o `delay()` sairiam errados.
</details>

---

## Exercício 09: Velocidade do motor

Um motor gira a 3 000 rpm com 5 V. Ele é ligado por um transistor, com o PWM do pino 9 (490 Hz) na base. Suponha que a velocidade é proporcional à tensão média.

**a)** Com `analogWrite(9, 153)`, qual é a tensão média no motor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 V ± 0,02 V`

D = 153 / 255 = 0,6 → 0,6 · 5 V = **3 V**.
</details>

**b)** Em quantas rpm o motor gira, nessa suposição?

<details>
<summary>Ver resposta</summary>

**Número:** `1800 ± 20`

0,6 · 3 000 = **1 800 rpm**. (Um motor de verdade não é tão linear: com pouca tensão, ele pode nem sair do lugar.)
</details>

**c)** Por que o motor fica no transistor e não direto no pino? Responda com a letra.

(a) porque o pino aguenta poucos miliampères, e o motor pede centenas; (b) porque o pino não faz PWM; (c) porque o motor precisa de corrente alternada.

<details>
<summary>Ver resposta</summary>

**Resposta:** `a`

O pino aguenta uns **20 mA** (40 mA no máximo). Um motor pequeno pede de 100 a 500 mA: o transistor chaveia essa corrente, e o pino só comanda a base. Detalhes na aula de [Sensores e atuadores](../../aulas/23-sensores-e-atuadores.md).
</details>
