# 📡 Sensores e atuadores · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Sensores e atuadores](../../aulas/23-sensores-e-atuadores.md) · Próximo: [Difícil →](dificil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

Use d ≈ t / 58 (d em cm, t em µs).

---

## Exercício 04: Contas do ultrassom

**a)** O Echo ficou 1 740 µs em HIGH. A que distância está o objeto, em cm?

<details>
<summary>Ver resposta</summary>

**Número:** `30`

1 740 / 58 = **30 cm**.
</details>

**b)** O objeto está a 1 m. Quanto tempo o Echo fica em HIGH?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `5,8 ms ± 0,1 ms`

100 cm · 58 µs/cm = 5 800 µs = **5,8 ms**.
</details>

**c)** Não há nada na frente do sensor até 5 m. Quanto devolve `pulseIn(ECHO, HIGH, 30000)`?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

Sem eco dentro de 30 000 µs, o `pulseIn` desiste e devolve **0**. O programa precisa tratar o 0 como "nada na frente".
</details>

---

## Exercício 05: O alarme com PIR

O programa é o do [projeto 11](../../laboratorio/projetos/11-alarme-de-movimento/README.md): `Movimento!` na borda de subida, e, enquanto houver movimento, um bipe de 150 ms seguido de 150 ms de silêncio.

**a)** Com movimento, a saída do PIR tem 3,3 V. O Uno lê HIGH ou LOW?

<details>
<summary>Ver resposta</summary>

**Resposta:** `HIGH | 1`

De 3 V para cima já é HIGH no Uno: **HIGH**.
</details>

**b)** Uma pessoa fica se mexendo na frente do sensor por 5 s. Quantas vezes aparece `Movimento!`?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

Só a borda de subida escreve: **1** vez, no começo do movimento.
</details>

**c)** Quantos bipes o buzzer dá nesses 5 s, mais ou menos?

<details>
<summary>Ver resposta</summary>

**Número:** `17 ± 1`

Cada volta com movimento leva 150 + 150 = 300 ms, e o primeiro bipe sai logo no começo: bipes em 0; 0,3; 0,6... até 4,8 s, umas **17** vezes (5 000 / 300 ≈ 16,7, mais o do instante 0).
</details>

---

## Exercício 06: O pulso do servo

A biblioteca `Servo` leva 0° a 180° para pulsos de 544 µs a 2 400 µs, em linha reta: pulso = 544 + ângulo · (2 400 − 544) / 180.

**a)** Qual é o pulso com `write(0)`, em µs?

<details>
<summary>Ver resposta</summary>

**Número:** `544`

O começo da faixa: **544 µs**.
</details>

**b)** E com `write(90)`?

<details>
<summary>Ver resposta</summary>

**Número:** `1472 ± 2`

544 + 90 · 1 856 / 180 = 544 + 928 = **1 472 µs**.
</details>

**c)** E com `write(45)`?

<details>
<summary>Ver resposta</summary>

**Número:** `1008 ± 2`

544 + 45 · 1 856 / 180 = 544 + 464 = **1 008 µs**. No laboratório, o ângulo do servo sai justamente da largura desse pulso.
</details>
