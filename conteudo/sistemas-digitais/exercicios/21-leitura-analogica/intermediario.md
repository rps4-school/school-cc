# 🎛️ Leitura analógica · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Leitura analógica](../../aulas/21-leitura-analogica.md) · Próximo: [Difícil →](dificil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

Use leitura ≈ V · 1023 / 5. Nas leituras, ±1 está certo.

---

## Exercício 04: map() na mão

Lembre: o `map()` faz a conta só com inteiros e **trunca**.

**a)** `map(512, 0, 1023, 0, 255)`

<details>
<summary>Ver resposta</summary>

**Número:** `127`

512 · 255 / 1023 = 130 560 / 1 023 = 127,6 → **127**.
</details>

**b)** `map(1000, 0, 1023, 0, 100)`

<details>
<summary>Ver resposta</summary>

**Número:** `97`

1000 · 100 / 1023 = 97,75 → **97**.
</details>

**c)** `map(300, 200, 800, 0, 100)`

<details>
<summary>Ver resposta</summary>

**Número:** `16`

(300 − 200) · (100 − 0) / (800 − 200) + 0 = 10 000 / 600 = 16,67 → **16**.
</details>

---

## Exercício 05: O potenciômetro a 40 %

Um potenciômetro de 10 kΩ tem as pontas no 5V e no GND e o cursor no A0. O cursor está a **40 %** do curso, a partir do lado do GND. O programa é o do [projeto 06](../../laboratorio/projetos/06-potenciometro-e-serial/README.md).

**a)** Qual é a tensão no cursor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2 V`

40 % de 5 V = **2 V**.
</details>

**b)** Quanto dá `analogRead(A0)`?

<details>
<summary>Ver resposta</summary>

**Número:** `409 ± 1`

2 · 1023 / 5 = 409,2 → **409**.
</details>

**c)** O programa imprime `Posição: N %`, com `N = map(leitura, 0, 1023, 0, 100)`. Quanto vale N?

<details>
<summary>Ver resposta</summary>

**Número:** `39`

409 · 100 / 1023 = 39,98 → o `map()` trunca: **39**. O cursor está a 40 %, mas o monitor diz 39 %. No laboratório, a linha sai assim: `Leitura: 409  Tensão: 2.00 V  Posição: 39 %`.
</details>

---

## Exercício 06: O LDR no divisor

O LDR vai do 5V ao A0, e um resistor de 10 kΩ vai do A0 ao GND.

**a)** Com o LDR em 10 kΩ, qual é a tensão no A0?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2,5 V`

V = 5 · 10 / (10 + 10) = **2,5 V**: resistências iguais dividem a tensão no meio.
</details>

**b)** A sala escurece e o LDR vai a 40 kΩ. Quanto dá `analogRead(A0)`?

<details>
<summary>Ver resposta</summary>

**Número:** `204 ± 1`

V = 5 · 10 / (40 + 10) = 1 V → 1 · 1023 / 5 = 204,6 → **204**.
</details>

**c)** O programa acende o LED quando `analogRead(A0) < 300`. Com o LDR em 40 kΩ, o LED está aceso ou apagado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `aceso | ligado`

204 < 300: está escuro, o LED fica **aceso**.
</details>
