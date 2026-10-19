# 🎛️ Leitura analógica · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Leitura analógica](../../aulas/21-leitura-analogica.md) · Próximo: [Intermediário →](intermediario.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

Use leitura ≈ V · 1023 / 5 e V ≈ leitura · 5 / 1023. Nas leituras, ±1 está certo.

---

## Exercício 01: A escala do ADC

**a)** Quantos pinos de entrada analógica tem o Uno?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

De **A0 a A5**: 6 pinos, todos ligados ao mesmo ADC.
</details>

**b)** Qual é a maior leitura que o `analogRead` devolve?

<details>
<summary>Ver resposta</summary>

**Número:** `1023`

10 bits: 1024 valores, de 0 a **1023**.
</details>

**c)** Precisa de `pinMode(A0, INPUT)` antes do `analogRead(A0)`? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

**Não:** os pinos analógicos já começam como entrada.
</details>

---

## Exercício 02: Da tensão à leitura

Quanto dá `analogRead(A0)` com estas tensões no pino?

**a)** 0 V

<details>
<summary>Ver resposta</summary>

**Número:** `0`

O começo da escala: **0**.
</details>

**b)** 2 V

<details>
<summary>Ver resposta</summary>

**Número:** `409 ± 1`

2 · 1023 / 5 = 409,2 → **409**.
</details>

**c)** 3,3 V

<details>
<summary>Ver resposta</summary>

**Número:** `675 ± 1`

3,3 · 1023 / 5 = 675,2 → **675**.
</details>

---

## Exercício 03: Da leitura à tensão

Qual é a tensão no pino, com duas casas decimais?

**a)** Leitura 1023

<details>
<summary>Ver resposta</summary>

**Grandeza:** `5 V`

O fundo da escala: **5 V**.
</details>

**b)** Leitura 512

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2,50 V ± 0,01 V`

512 · 5 / 1023 = 2,502 → **2,50 V**.
</details>

**c)** Leitura 205

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,00 V ± 0,01 V`

205 · 5 / 1023 = 1,002 → **1,00 V**. Cada volt vale uns 205 degraus.
</details>
