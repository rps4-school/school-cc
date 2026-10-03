# ➕ Adição binária

> [← Codificação](04-codificacao.md) · Próximo: [Números negativos →](06-numeros-negativos.md)

**Nível:** 🟡 Intermediário

> 📖 **Antes, leia:** [Sistema binário](02-sistema-binario.md). Você vai precisar converter decimal ↔ binário para conferir as contas.

## 🎯 Você vai aprender

- A "tabuada" da soma binária, incluindo o caso **1 + 1 + 1**.
- Armar e resolver uma soma binária com a linha do **"vai um"** (*carry*).
- Conferir o resultado em decimal.
- O que acontece quando o resultado **não cabe** na quantidade de bits.

## Em uma frase

> 💡 Soma-se em binário **igual ao decimal**, coluna por coluna, da direita para a esquerda. A única diferença é que o "vai um" acontece quando a coluna chega a **2** (e não a 10).

## Lembrando a soma decimal

Em 3047 + 7869, quando uma coluna passa de 9, escrevemos a unidade e **"vai um"** para a coluna da esquerda:

```
Vai um:   1 0 1 1
            3 0 4 7
          + 7 8 6 9
          ---------
          1 0 9 1 6
```

Em binário é a mesma coisa, mas cada coluna só pode ter **0 ou 1**.

## A tabuada da soma binária

| Conta | Resultado | Escreve | Vai um |
| ----- | --------- | ------- | ------ |
| 0 + 0 | 0 | 0 | 0 |
| 0 + 1 | 1 | 1 | 0 |
| 1 + 0 | 1 | 1 | 0 |
| 1 + 1 | 10₂ (dois) | **0** | **1** |
| 1 + 1 + 1 (com o vai um) | 11₂ (três) | **1** | **1** |

> 💡 **Conte quantos 1 tem na coluna** (incluindo o vai um):
>
> - nenhum → escreve **0**;
> - um → escreve **1**;
> - dois → escreve **0** e vai um;
> - três → escreve **1** e vai um.

## 🧮 Passo a passo

1. Escreva os números **um embaixo do outro**, alinhados pela direita. Complete com zeros à esquerda se precisar.
2. Comece pela coluna da **direita**.
3. Conte os 1 da coluna (os dois bits + o vai um que chegou) e use a tabela acima.
4. Escreva o vai um **em cima da próxima coluna**.
5. Se sobrar vai um na última coluna, ele vira um **bit novo** à esquerda.
6. **Confira** convertendo tudo para decimal.

## Exemplos resolvidos

### Exemplo 1: 1011 + 0110 (11 + 6)

```
Vai um:   1 1 1
            1 0 1 1
        +   0 1 1 0
          ---------
          1 0 0 0 1
```

| Coluna (da direita) | Conta | Escreve | Vai um |
| ------------------- | ----- | ------- | ------ |
| 1ª | 1 + 0 | 1 | 0 |
| 2ª | 1 + 1 | 0 | 1 |
| 3ª | 0 + 1 + **1** | 0 | 1 |
| 4ª | 1 + 0 + **1** | 0 | 1 |
| Sobrou | **1** | 1 | — |

**Resultado: 10001₂ = 17**. Conferindo: 11 + 6 = 17 ✔

### Exemplo 2: 45 + 27

Primeiro converta: 45 = 101101₂ e 27 = 11011₂ (com 6 bits: 011011₂).

```
Vai um:   1 1 1 1 1 1
            1 0 1 1 0 1
        +   0 1 1 0 1 1
          -------------
          1 0 0 1 0 0 0
```

**Resultado: 1001000₂ = 64 + 8 = 72** ✔. Repare na 4ª coluna: 1 + 1 + 1 (vai um) = **escreve 1, vai 1**.

### Exemplo 3: 1111 + 1 (o vai um "em cascata")

```
Vai um:   1 1 1 1
            1 1 1 1
        +   0 0 0 1
          ---------
          1 0 0 0 0
```

15 + 1 = **16 = 10000₂**. Como no decimal, onde 999 + 1 = 1000, somar 1 a um número só de 1s vira **1 seguido de zeros**.

### Exemplo 4: 10110 + 1011 (22 + 11)

```
Vai um:   1 1 1 1
            1 0 1 1 0
        +   0 1 0 1 1
          -----------
          1 0 0 0 0 1
```

**Resultado: 100001₂ = 32 + 1 = 33** ✔

## E quando não cabe?

Dentro do computador, os números têm **tamanho fixo** (por exemplo, 8 bits). Se o resultado precisar de um bit a mais, esse vai um final **não tem onde ficar** e se perde:

```
            1 1 1 1 1 1 1 1      (255)
        +   0 0 0 0 0 0 0 1      (1)
          -----------------
          1 0 0 0 0 0 0 0 0      (256 precisa de 9 bits!)
```

Com 8 bits, sobram só os zeros: o resultado "dá a volta" e vira **0**. Na próxima aula você vai ver o **overflow**, que é como esse problema aparece nos números com sinal.

## ⚠️ Erros comuns

| Erro | Como evitar |
| ---- | ----------- |
| Escrever "2" numa coluna | Em binário não existe 2: 1 + 1 = **0, vai 1** |
| Esquecer o vai um na coluna seguinte | Escreva o 1 **em cima** da próxima coluna assim que ele aparecer |
| Esquecer o caso 1 + 1 + 1 | Três 1s = **escreve 1, vai 1** |
| Desalinhar números de tamanhos diferentes | Complete o menor com **zeros à esquerda** |
| Perder o último vai um | Ele vira o bit **mais à esquerda** do resultado |

## 💡 Macetes

- **Confira sempre em decimal.** Se 11 + 6 não deu 17, refaça.
- **Somar um número com ele mesmo** é deslocar uma casa para a esquerda (multiplicar por 2): 1101 + 1101 = 11010.
- Somar 1 a um número que termina em **0** só troca o último bit para 1.

## ✅ Teste rápido

**1.** Calcule **101₂ + 011₂**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1000`

```
Vai um:   1 1 1
            1 0 1
        +   0 1 1
          -------
          1 0 0 0
```

5 + 3 = 8 = **1000₂** ✔
</details>

**2.** Calcule **1110₂ + 0111₂**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `10101`

```
Vai um:   1 1 1
            1 1 1 0
        +   0 1 1 1
          ---------
          1 0 1 0 1
```

14 + 7 = 21 = 16 + 4 + 1 = **10101₂** ✔
</details>

**3.** Calcule **11111111₂ + 1₂**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `100000000`

Vai um em cascata pelas 8 colunas: **1 0000 0000₂** = 256 (precisa de 9 bits).
</details>

**4.** Converta **39** e **25** para binário e some em binário. Qual é o resultado (em binário)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1000000`

39 = 100111₂ e 25 = 011001₂.

```
Vai um:   1 1 1 1 1 1
            1 0 0 1 1 1
        +   0 1 1 0 0 1
          -------------
          1 0 0 0 0 0 0
```

**1000000₂ = 64** ✔ (39 + 25 = 64)
</details>

**5.** Calcule **1101₂ + 1101₂**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `11010`

```
Vai um:   1 1   1
            1 1 0 1
        +   1 1 0 1
          ---------
          1 1 0 1 0
```

13 + 13 = 26 = **11010₂**. Repare: é o 1101 deslocado uma casa para a esquerda (× 2).
</details>

**6.** Quantos bits são necessários para guardar o resultado de **255 + 1**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `9`

255 + 1 = 256 = 1 0000 0000₂: **9 bits**. Com 8 bits o máximo é 2⁸ − 1 = 255.
</details>

## ✏️ Agora pratique

São 9 exercícios sobre este assunto, do fácil ao difícil, com resolução passo a passo:

| 🟢 Fácil | 🟡 Intermediário | 🔴 Difícil |
| -------- | ---------------- | ---------- |
| [Exercícios 01 a 03](../exercicios/05-adicao-binaria/facil.md) | [Exercícios 04 a 06](../exercicios/05-adicao-binaria/intermediario.md) | [Exercícios 07 a 09](../exercicios/05-adicao-binaria/dificil.md) |

## 📚 Referências

- TOCCI, Ronald J.; WIDMER, Neal S.; MOSS, Gregory L. *Sistemas digitais: princípios e aplicações*. 11. ed. Pearson, 2011. Seções 6.1 e 6.2.
