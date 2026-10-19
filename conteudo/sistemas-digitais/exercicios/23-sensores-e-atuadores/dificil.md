# 📡 Sensores e atuadores · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Sensores e atuadores](../../aulas/23-sensores-e-atuadores.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O resistor da base

Um motor de **150 mA** é ligado por um transistor NPN com ganho β = 100. O pino dá 5 V, e a junção base-emissor consome 0,7 V.

**a)** Qual é a corrente mínima na base?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,5 mA`

I_B = I_C / β = 150 mA / 100 = **1,5 mA**.
</details>

**b)** Com margem de 5 vezes, qual resistor de base dá essa corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `573 Ω ± 3 Ω`

I_B = 5 · 1,5 mA = 7,5 mA → R_B = (5 − 0,7) V / 7,5 mA ≈ **573 Ω**. Um valor comercial perto: 560 Ω.
</details>

**c)** Com o resistor comercial de 560 Ω, qual é a corrente na base?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `7,7 mA ± 0,1 mA`

(5 − 0,7) / 560 ≈ **7,7 mA**: bem abaixo dos 20 mA do pino, e uns 5 vezes o mínimo.
</details>

**d)** Que peça protege o transistor do pico de tensão quando o motor desliga? Responda com a letra.

(a) um capacitor em série com o motor; (b) um diodo em paralelo com o motor, com o cátodo no lado positivo; (c) um resistor maior na base.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

O **diodo de roda livre**, em paralelo com o motor e "ao contrário" (cátodo no +), dá um caminho para a corrente do motor quando o transistor corta.
</details>

---

## Exercício 08: O relé

Um relé tem bobina de 5 V com resistência de 70 Ω.

**a)** Qual é a corrente da bobina?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `71 mA ± 1 mA`

i = 5 V / 70 Ω ≈ **71 mA**: mais de três vezes o que o pino aguenta. A bobina vai num transistor (com diodo), ou se usa um módulo de relé.
</details>

**b)** Uma lâmpada de 12 V deve ficar **acesa** com o relé desligado e **apagar** quando ele é acionado. Ela vai no contato NA ou NF?

<details>
<summary>Ver resposta</summary>

**Resposta:** `NF | normalmente fechado`

**NF** (normalmente fechado): fechado com a bobina desligada, abre quando ela é acionada.
</details>

**c)** O módulo de relé é "acionado em LOW". O programa fez `digitalWrite(7, HIGH);` no pino de controle. O relé está acionado? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

Acionado em LOW quer dizer o contrário do que parece: com o pino em HIGH, o relé fica **desligado**. Confira sempre a descrição do módulo.
</details>

---

## Exercício 09: A cancela por dentro

O programa é o do [projeto 12](../../laboratorio/projetos/12-cancela-automatica/README.md): `distancia = (t + 29) / 58` (conta inteira) e a cancela sobe (90°) quando `distancia > 0 && distancia < 20`.

**a)** O Echo ficou 870 µs em HIGH. Quanto vale `distancia`?

<details>
<summary>Ver resposta</summary>

**Número:** `15`

(870 + 29) / 58 = 899 / 58 = 15,5 → conta inteira: **15**.
</details>

**b)** Com essa distância, qual é o ângulo da cancela?

<details>
<summary>Ver resposta</summary>

**Número:** `90`

15 está entre 1 e 19: a cancela sobe para **90°**.
</details>

**c)** Uma versão antiga do programa fazia `distancia = t / 58`. Com o Echo em 2 899 µs, quanto ela dava?

<details>
<summary>Ver resposta</summary>

**Número:** `49`

2 899 / 58 = 49,98 → a conta inteira trunca: **49**. Com o `+ 29`, dá 50, o centímetro mais perto.
</details>

**d)** Com o limite de 30 000 µs no `pulseIn`, qual é a maior distância que o **programa** consegue medir, em cm?

<details>
<summary>Ver resposta</summary>

**Número:** `517 ± 1`

(30 000 + 29) / 58 = 517. O sensor mesmo só garante até uns 400 cm: o limite do programa está folgado.
</details>
