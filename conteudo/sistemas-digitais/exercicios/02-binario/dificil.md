# 🔢 Binário · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Sistema binário](../../aulas/02-sistema-binario.md) · Próximo: [Hexadecimal →](../03-hexadecimal/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Perda de precisão

Um termômetro digital guarda a temperatura com **4 bits depois da vírgula**. A temperatura real é **12,7 °C**.

**a)** Como fica o valor em binário?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1100,1011`

- 12 = **1100₂**
- 0,7 com 4 bits:

| Conta | Resultado | Bit |
| ----- | --------- | --- |
| 0,7 × 2 | 1,4 | **1** |
| 0,4 × 2 | 0,8 | **0** |
| 0,8 × 2 | 1,6 | **1** |
| 0,6 × 2 | 1,2 | **1** |

A conta **não terminou** (ainda sobrava 0,2), mas só cabem 4 bits: **1100,1011₂**.
</details>

**b)** Qual valor, em decimal, fica realmente guardado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `12,6875`

1100,1011₂ = 12 + 0,5 + 0,125 + 0,0625 = **12,6875**
</details>

**c)** Qual é o erro (diferença entre o real e o guardado)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `0,0125`

12,7 − 12,6875 = **0,0125 °C**.
</details>

---

## Exercício 08: Quantos bits são necessários?

Um sistema de senhas de atendimento vai numerar clientes de **0 até 1 500**.

**a)** Qual é o menor número de bits que dá conta?

<details>
<summary>Ver resposta</summary>

**Resposta:** `11`

2¹⁰ − 1 = 1 023 não chega a 1 500; 2¹¹ − 1 = **2 047** chega. São **11 bits**.
</details>

**b)** Com esses bits, qual é o maior número que daria para guardar?

<details>
<summary>Ver resposta</summary>

**Resposta:** `2047`

2¹¹ − 1 = **2 047**.
</details>

---

## Exercício 09: Pacote com dois campos

Um sensor de uma escola envia pacotes de **12 bits**: os **5 primeiros** são o número da sala e os **7 últimos** são a temperatura (em °C). Chegou o pacote **1001 1010 1101**.

**a)** Qual é o número da sala?

<details>
<summary>Ver resposta</summary>

**Resposta:** `19`

Os 5 primeiros bits: **10011₂** = 16 + 2 + 1 = **19**.
</details>

**b)** Qual é a temperatura?

<details>
<summary>Ver resposta</summary>

**Resposta:** `45`

Os 7 últimos bits: **0101101₂**.

| Peso | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| ---- | -- | -- | -- | - | - | - | - |
| Bit | 0 | 1 | 0 | 1 | 1 | 0 | 1 |

32 + 8 + 4 + 1 = **45 °C**.
</details>
