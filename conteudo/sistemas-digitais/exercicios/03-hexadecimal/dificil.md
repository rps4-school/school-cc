# 🔣 Hexadecimal · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Hexadecimal](../../aulas/03-hexadecimal.md) · Próximo: [Codificação →](../04-codificacao/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Mapa de memória

Um microcontrolador tem memória nos endereços de **0x0000** até **0x1FFF**. Cada endereço guarda **1 byte**.

**a)** Quantos endereços existem?

<details>
<summary>Ver resposta</summary>

**Resposta:** `8192`

0x1FFF = 1 × 4 096 + 15 × 256 + 15 × 16 + 15 = 8 191. Contando o 0x0000: 8 191 + 1 = **8 192** endereços.
</details>

**b)** Quantos **KB** de memória são?

<details>
<summary>Ver resposta</summary>

**Resposta:** `8`

8 192 bytes ÷ 1 024 = **8 KB**.
</details>

---

## Exercício 08: Endereços de rede

Um endereço **MAC** (da placa de rede) tem **48 bits** e um endereço **IPv6** tem **128 bits**. Os dois são escritos em hexadecimal.

**a)** Quantos algarismos hexadecimais tem um endereço MAC?

<details>
<summary>Ver resposta</summary>

**Resposta:** `12`

Cada algarismo hexa = 4 bits: 48 ÷ 4 = **12** algarismos (por exemplo, 3C:52:82:1F:A0:B4).
</details>

**b)** E um endereço IPv6?

<details>
<summary>Ver resposta</summary>

**Resposta:** `32`

128 ÷ 4 = **32** algarismos.
</details>

---

## Exercício 09: Hexa grande para decimal

Converta os dois valores para decimal.

**a)** **0x1A2B**

<details>
<summary>Ver resposta</summary>

**Resposta:** `6699`

| Peso | 4 096 | 256 | 16 | 1 |
| ---- | ----- | --- | -- | - |
| Algarismo | 1 | A = 10 | 2 | B = 11 |
| Valor | 4 096 | 2 560 | 32 | 11 |

4 096 + 2 560 + 32 + 11 = **6 699**
</details>

**b)** **0xC0,8**

<details>
<summary>Ver resposta</summary>

**Resposta:** `192,5`

0xC0 = 12 × 16 + 0 = 192; 0x0,8 = 8/16 = 0,5. Total: **192,5**.
</details>
