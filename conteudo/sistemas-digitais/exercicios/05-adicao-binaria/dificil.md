# ➕ Adição binária · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Adição binária](../../aulas/05-adicao-binaria.md) · Próximo: [Números negativos →](../06-numeros-negativos/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Registrador de 8 bits

Um registrador de **8 bits** guarda 200 e recebe mais 100.

**a)** Qual é o resultado completo da soma em binário?

<details>
<summary>Ver resposta</summary>

**Resposta:** `100101100`

```
Vai um:  1 1
           1 1 0 0 1 0 0 0
        +  0 1 1 0 0 1 0 0
         -----------------
         1 0 0 1 0 1 1 0 0
```

**100101100₂** = 300. Precisa de **9 bits**.
</details>

**b)** O que fica guardado nos 8 bits do registrador (em binário)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `0010 1100`

O vai um final não cabe e se perde. Ficam os 8 bits da direita: **0010 1100₂** = 44. Por isso 200 + 100 "deu" 44.
</details>

---

## Exercício 08: Somando em hexa pelo binário

Um protocolo soma os bytes **0x3C** e **0x5A** para conferir a mensagem.

**a)** Qual é a soma em binário (8 bits)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1001 0110`

0x3C = 0011 1100 e 0x5A = 0101 1010.

```
Vai um:    1 1 1 1
           0 0 1 1 1 1 0 0
        +  0 1 0 1 1 0 1 0
         -----------------
           1 0 0 1 0 1 1 0
```

**1001 0110₂**
</details>

**b)** E em hexadecimal?

<details>
<summary>Ver resposta</summary>

**Resposta:** `96`

1001 0110 → **0x96** (= 150; e de fato 60 + 90 = 150).
</details>

---

## Exercício 09: Soma com vírgula

Calcule **101,11₂ + 11,01₂**. Dica: alinhe as vírgulas e some como se fossem inteiros.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1001 | 1001,00 | 1001,0`

Alinhando pela vírgula: 101,11 + 011,01. Sem as vírgulas, a conta é 10111 + 01101:

```
Vai um:  1 1 1 1 1
           1 0 1 1 1
        +  0 1 1 0 1
         -----------
         1 0 0 1 0 0
```

Colocando a vírgula de volta (2 casas): **1001,00₂ = 9**. Conferindo: 5,75 + 3,25 = 9 ✔
</details>
