# 🔤 Codificação · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Codificação](../../aulas/04-codificacao.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Texto em ASCII

Escreva **"Pi"** em ASCII, com os códigos em hexadecimal. Use a tabela da [aula de Codificação](../../aulas/04-codificacao.md#tabela-ascii-caracteres-visíveis).

<details>
<summary>Ver resposta</summary>

**Resposta:** `0x50 0x69`

| Caractere | Linha | Coluna | Hexa |
| --------- | ----- | ------ | ---- |
| P | 5 | 0 | 0x50 |
| i | 6 | 9 | 0x69 |

**"Pi" = 0x50 0x69**. Repare que o `P` maiúsculo e o `i` minúsculo estão em linhas diferentes.
</details>

---

## Exercício 02: Mensagem escondida

Um sensor mandou os bytes **0x4F 0x4B**. Que texto eles formam em ASCII?

<details>
<summary>Ver resposta</summary>

**Resposta:** `OK`

0x4F → linha 4, coluna F → **O**; 0x4B → linha 4, coluna B → **K**. A mensagem é **"OK"**.
</details>

---

## Exercício 03: Cifrando

Cifre a palavra **"dado"** com a Cifra de César de chave **2**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `fcfq`

| Original | d | a | d | o |
| -------- | - | - | - | - |
| +2 | f | c | f | q |

**"fcfq"**
</details>
