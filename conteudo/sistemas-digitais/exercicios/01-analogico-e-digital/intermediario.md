# 📡 Analógico e digital · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Analógico e digital](../../aulas/01-analogico-e-digital.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Resolução de um ADC

A placa de um robô lê um sensor de luz com um ADC de **12 bits**. O menor valor que ele devolve é 0.

**a)** Quantos valores diferentes esse ADC consegue produzir?

<details>
<summary>Ver resposta</summary>

**Resposta:** `4096`

Com n bits existem 2ⁿ valores: 2¹² = **4 096**.
</details>

**b)** Qual é o maior valor que ele pode devolver?

<details>
<summary>Ver resposta</summary>

**Resposta:** `4095`

Contando a partir do 0, o maior é 2ⁿ − 1 = 4 096 − 1 = **4 095**.
</details>

---

## Exercício 05: Tamanho de um áudio

Um aplicativo de reuniões grava a voz com **16 000 amostras por segundo**, **16 bits por amostra** e **um canal** (mono).

**a)** Quantos **bits** são gerados em 1 segundo?

<details>
<summary>Ver resposta</summary>

**Resposta:** `256000`

16 000 amostras × 16 bits = **256 000 bits** por segundo.
</details>

**b)** Quantos **bytes** ocupa uma gravação de **10 segundos**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `320000`

256 000 bits × 10 s = 2 560 000 bits. Dividindo por 8: **320 000 bytes**.
</details>

**c)** Quanto é isso em **KB** (1 KB = 1 024 bytes)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `312,5`

320 000 ÷ 1 024 = **312,5 KB**.
</details>

---

## Exercício 06: Lei de Moore

Um processador de 2010 tinha **2 milhões** de transistores. Suponha que a quantidade **dobre a cada 2 anos**.

**a)** Quantos períodos de 2 anos existem entre 2010 e 2018?

<details>
<summary>Ver resposta</summary>

**Resposta:** `4`

2018 − 2010 = 8 anos; 8 ÷ 2 = **4** períodos.
</details>

**b)** Quantos transistores (em milhões) um processador equivalente teria em 2018?

<details>
<summary>Ver resposta</summary>

**Resposta:** `32 | 32 milhões | 32000000`

Dobrar 4 vezes é multiplicar por 2⁴ = 16: 2 × 16 = **32 milhões**. (2 → 4 → 8 → 16 → 32.)
</details>
