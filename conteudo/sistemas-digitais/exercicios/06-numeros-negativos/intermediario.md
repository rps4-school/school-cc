# ➖ Números negativos · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Números negativos](../../aulas/06-numeros-negativos.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Faixas com 10 bits

Considere números de **10 bits**.

**a)** Qual é o **menor** valor em complemento a 2?

<details>
<summary>Ver resposta</summary>

**Resposta:** `−512`

−2ⁿ⁻¹ = −2⁹ = **−512**.
</details>

**b)** Qual é o **maior** valor em complemento a 2?

<details>
<summary>Ver resposta</summary>

**Resposta:** `511`

2ⁿ⁻¹ − 1 = 512 − 1 = **511**.
</details>

**c)** Qual é o **menor** valor em sinal-magnitude?

<details>
<summary>Ver resposta</summary>

**Resposta:** `−511`

Em sinal-magnitude o menor é −(2ⁿ⁻¹ − 1) = **−511** (um a menos que no C2, porque existe o "−0").
</details>

---

## Exercício 05: Subtração com resultado negativo

Calcule **64 − 100** em complemento a 2 com 8 bits.

**a)** Qual é o resultado em binário?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1101 1100`

64 = 0100 0000; 100 = 0110 0100, então −100 = 1001 1100.

```
Vai um:
           0 1 0 0 0 0 0 0     (+64)
        +  1 0 0 1 1 1 0 0     (−100)
         -----------------
           1 1 0 1 1 1 0 0
```

**1101 1100**
</details>

**b)** Quanto vale em decimal?

<details>
<summary>Ver resposta</summary>

**Resposta:** `-36`

MSB = 1 → negativo. C2(1101 1100) = 0010 0100 = 36. Resultado: **−36** ✔ (64 − 100 = −36)
</details>

---

## Exercício 06: C1 e C2 lado a lado

Represente **−100** com 8 bits:

**a)** em complemento a 1;

<details>
<summary>Ver resposta</summary>

**Resposta:** `1001 1011`

+100 = 0110 0100. Invertendo tudo: **1001 1011**.
</details>

**b)** em complemento a 2.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1001 1100`

C1 + 1: 1001 1011 + 1 = **1001 1100**.
</details>
