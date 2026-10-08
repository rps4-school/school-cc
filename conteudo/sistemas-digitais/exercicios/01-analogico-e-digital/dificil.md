# 📡 Analógico e digital · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Analógico e digital](../../aulas/01-analogico-e-digital.md) · Próximo: [Binário →](../02-binario/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Ruído e decisão de bits

Um cabo envia bits usando **0 V** para o 0 e **3,3 V** para o 1. Por causa do ruído, o receptor nunca mede o valor exato, então decide assim: abaixo de **1,65 V** é 0; a partir de 1,65 V é 1. Ele mediu, em ordem (o primeiro é o MSB):

2,9 V · 0,4 V · 3,6 V · 3,1 V · 0,2 V · 1,9 V · 0,7 V · 3 V

**a)** Qual sequência de 8 bits foi recebida?

<details>
<summary>Ver resposta</summary>

**Resposta:** `10110101`

| Tensão | 2,9 | 0,4 | 3,6 | 3,1 | 0,2 | 1,9 | 0,7 | 3 |
| ------ | --- | --- | --- | --- | --- | --- | --- | - |
| Bit | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 1 |

Sequência: **1011 0101**. Mesmo com ruído (2,9 V em vez de 3,3 V, 0,4 V em vez de 0 V), cada bit foi lido certo: essa é a grande vantagem do digital.
</details>

**b)** Que número decimal essa sequência representa?

<details>
<summary>Ver resposta</summary>

**Resposta:** `181`

| Peso | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| ---- | --- | -- | -- | -- | - | - | - | - |
| Bit | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 1 |

128 + 32 + 16 + 4 + 1 = **181**
</details>

---

## Exercício 08: Quantos bits para a balança?

Uma balança de cozinha mede de **0 a 50 kg**, de **0,1 em 0,1 kg** (0; 0,1; 0,2; ...; 50,0). O valor vai para o chip por um ADC.

**a)** Quantos valores diferentes a balança precisa representar?

<details>
<summary>Ver resposta</summary>

**Resposta:** `501`

De 0 a 50 em passos de 0,1 são 50 ÷ 0,1 = 500 passos, **mais o zero**: **501** valores.
</details>

**b)** Qual é o **menor** número de bits do ADC que dá conta?

<details>
<summary>Ver resposta</summary>

**Resposta:** `9`

2⁸ = 256 não basta; 2⁹ = **512** ≥ 501. São **9 bits**.
</details>

**c)** Com esses bits, quantos códigos ficam sem uso?

<details>
<summary>Ver resposta</summary>

**Resposta:** `11`

512 − 501 = **11** códigos sobrando.
</details>

---

## Exercício 09: Áudio com qualidade de CD

Um trecho de música com qualidade de CD usa **44 100 amostras por segundo**, **16 bits por amostra** e **2 canais** (estéreo).

**a)** Quantos **bytes** são gerados por segundo?

<details>
<summary>Ver resposta</summary>

**Resposta:** `176400`

44 100 × 16 bits × 2 canais = 1 411 200 bits por segundo ÷ 8 = **176 400 bytes/s**.
</details>

**b)** Quantos **bytes** ocupa um trecho de **30 segundos**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `5292000`

176 400 × 30 = **5 292 000 bytes**.
</details>

**c)** Quanto é isso em **MB**, com 2 casas decimais (1 MB = 1 048 576 bytes)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `5,05`

5 292 000 ÷ 1 048 576 ≈ **5,05 MB**.
</details>
