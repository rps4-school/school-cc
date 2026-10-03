# ➕ Adição binária · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Adição binária](../../aulas/05-adicao-binaria.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Do decimal ao binário

Converta **58** e **43** para binário e some **em binário**. Dê o resultado em binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1100101`

58 = 111010₂ e 43 = 101011₂.

```
Vai um:  1 1 1   1
           1 1 1 0 1 0
        +  1 0 1 0 1 1
         -------------
         1 1 0 0 1 0 1
```

**1100101₂** = 64 + 32 + 4 + 1 = 101 ✔ (58 + 43 = 101)
</details>

---

## Exercício 05: Soma de dois bytes

Calcule **1011 0110₂ + 0110 1101₂**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `100100011`

```
Vai um:  1 1 1 1 1 1
           1 0 1 1 0 1 1 0
        +  0 1 1 0 1 1 0 1
         -----------------
         1 0 0 1 0 0 0 1 1
```

**1 0010 0011₂**. Conferindo: 182 + 109 = 291 ✔ (o resultado precisou de 9 bits)
</details>

---

## Exercício 06: Três parcelas

Calcule **101₂ + 110₂ + 111₂**. Dica: some as duas primeiras e depois some o resultado com a terceira.

<details>
<summary>Ver resposta</summary>

**Resposta:** `10010`

Primeiro, 101 + 110:

```
Vai um:  1
           1 0 1
        +  1 1 0
         -------
         1 0 1 1
```

Depois, 1011 + 0111:

```
Vai um:  1 1 1 1
           1 0 1 1
        +  0 1 1 1
         ---------
         1 0 0 1 0
```

**10010₂** = 18 ✔ (5 + 6 + 7 = 18)
</details>
