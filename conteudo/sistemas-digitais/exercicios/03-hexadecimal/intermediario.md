# 🔣 Hexadecimal · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Hexadecimal](../../aulas/03-hexadecimal.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Decimal para hexa

Converta **3 000** para hexadecimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `BB8`

| Divisão | Quociente | Resto |
| ------- | --------- | ----- |
| 3 000 ÷ 16 | 187 | 8 → **8** |
| 187 ÷ 16 | 11 | 11 → **B** |
| 11 ÷ 16 | 0 | 11 → **B** |

De baixo para cima: **0xBB8**.

Conferindo: 11 × 256 + 11 × 16 + 8 = 2 816 + 176 + 8 = 3 000 ✔
</details>

---

## Exercício 05: Hexa com vírgula

Converta **101110,11₂** para hexadecimal e depois para decimal.

**a)** Em hexadecimal:

<details>
<summary>Ver resposta</summary>

**Resposta:** `2E,C`

Agrupe a partir da vírgula, completando com zeros (à esquerda na parte inteira e à direita na fração):

```
0010 1110 , 1100
 2    E   ,  C
```

**0x2E,C**
</details>

**b)** Em decimal:

<details>
<summary>Ver resposta</summary>

**Resposta:** `46,75`

0x2E = 2 × 16 + 14 = 46; 0x0,C = 12/16 = 0,75. Total: **46,75**.
</details>

---

## Exercício 06: Contando em hexa

Um contador de pacotes de rede mostra **0x2FF**.

**a)** Qual valor ele mostra depois de mais **um** pacote?

<details>
<summary>Ver resposta</summary>

**Resposta:** `300`

F + 1 passa de 15: o último F vira 0 e vai um. O próximo F também vira 0 e vai um. O 2 vira 3: **0x300**.
</details>

**b)** Quantos números existem de **0x2F0** até **0x2FF**, incluindo os dois?

<details>
<summary>Ver resposta</summary>

**Resposta:** `16`

Só muda o último algarismo, de 0 a F: **16** números.
</details>
