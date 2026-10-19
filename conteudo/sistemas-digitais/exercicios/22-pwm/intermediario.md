# 🌗 PWM · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [PWM e analogWrite()](../../aulas/22-pwm.md) · Próximo: [Difícil →](dificil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Período e tempo ligado

**a)** O PWM do pino 9 tem 490 Hz. Qual é o período?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2,04 ms ± 0,01 ms`

T = 1 / 490 ≈ 0,00204 s = **2,04 ms**.
</details>

**b)** Com `analogWrite(9, 191)`, quanto tempo de cada período o pino fica em 5 V?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,53 ms ± 0,02 ms`

D = 191 / 255 ≈ 0,749 → t_on = 0,749 · 2,04 ms ≈ **1,53 ms**.
</details>

**c)** O pino 6 faz PWM a uns 980 Hz. Qual é o período dele?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,02 ms ± 0,01 ms`

T = 1 / 980 ≈ **1,02 ms**: metade do período dos pinos de 490 Hz.
</details>

---

## Exercício 05: O dimmer

O programa é o do [projeto 07](../../laboratorio/projetos/07-dimmer-pwm/README.md): `brilho = map(leitura, 0, 1023, 0, 255)` e `analogWrite(9, brilho)`. Com o LED sempre aceso, a corrente é de 12 mA.

**a)** Com o potenciômetro a 75 %, a leitura é 767. Quanto vale `brilho`?

<details>
<summary>Ver resposta</summary>

**Número:** `191`

767 · 255 / 1023 = 191,2 → **191**.
</details>

**b)** Qual é a corrente **média** no LED?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `9 mA ± 0,2 mA`

D = 191 / 255 ≈ 0,75 → 0,75 · 12 mA ≈ **9 mA**. Enquanto está ligado, o LED continua com 12 mA.
</details>

**c)** Alguém passa o LED (fio e código) para o pino 8, que não tem ~. Com o mesmo `brilho` de 191, o LED fica como? Responda com a letra.

(a) com 75 % do brilho; (b) aceso com o brilho todo; (c) apagado.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

Sem PWM, o `analogWrite` vira liga-desliga: de 128 para cima, HIGH. Com 191, o LED fica **aceso com o brilho todo**; com 127 ou menos, ficaria apagado.
</details>

---

## Exercício 06: Cores no LED RGB

LED RGB de **cátodo comum**: vermelho no pino 9, verde no 10 e azul no 11.

**a)** `analogWrite(9, 255); analogWrite(10, 0); analogWrite(11, 255);`. Que cor aparece?

<details>
<summary>Ver resposta</summary>

**Resposta:** `magenta | rosa | fúcsia`

Vermelho + azul = **magenta**.
</details>

**b)** Para o ciano, quais cores ficam em 255? Responda com a letra.

(a) vermelho e verde; (b) verde e azul; (c) vermelho e azul.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

Ciano = **verde + azul** (pinos 10 e 11 em 255, o 9 em 0).
</details>

**c)** Agora o LED é de **ânodo comum** (perna comum no 5V). Para acender só o vermelho, com o brilho todo, que valor vai em `analogWrite(9, ...)`?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

No ânodo comum, a cor acende com o pino em **LOW**: o vermelho vai em **0**, e o verde e o azul em 255 (apagados). Por isso se escreve `255 - valor`.
</details>
