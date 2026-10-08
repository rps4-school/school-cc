# ➖ Números negativos · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Números negativos](../../aulas/06-numeros-negativos.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Sinal-magnitude

Represente **−45** em sinal-magnitude com 8 bits.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1010 1101`

Sinal **1** (negativo) + 45 em 7 bits (0101101): **1010 1101**.
</details>

---

## Exercício 02: Complemento a 2

Represente **−45** em complemento a 2 com 8 bits.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1101 0011`

+45 = 0010 1101. Pelo macete: copie até o primeiro 1 (vindo da direita), que já é o último bit, e inverta o resto: **1101 0011**.

Pelos 3 passos: inverter → 1101 0010; somar 1 → 1101 0011 ✔
</details>

---

## Exercício 03: Lendo um negativo

Quanto vale **1110 0100** em complemento a 2 (8 bits)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `-28`

MSB = 1, então é negativo. C2(1110 0100) = 0001 1100 = 28. Logo, **−28**.

Pelo peso negativo: −128 + 64 + 32 + 4 = **−28** ✔
</details>
