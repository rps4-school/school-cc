# 🧩 Funções · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Funções reais](../../aulas/01-funcoes.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Índice de carga

Um balanceador calcula um índice de carga com $f(x) = \dfrac{2x - 1}{x^2 + 3}$.

**a)** Calcule $f(0)$.

<details>
<summary>Ver resposta</summary>

**Número:** `-1/3`

$f(0) = \dfrac{0 - 1}{0 + 3} = -\dfrac{1}{3}$.
</details>

**b)** Calcule $f(1)$.

<details>
<summary>Ver resposta</summary>

**Número:** `1/4`

$f(1) = \dfrac{2 - 1}{1 + 3} = \dfrac{1}{4}$.
</details>

**c)** Calcule $f(-1)$.

<details>
<summary>Ver resposta</summary>

**Número:** `-3/4`

$f(-1) = \dfrac{-2 - 1}{(-1)^2 + 3} = \dfrac{-3}{4}$. Repare no parêntese: $(-1)^2 = 1$.
</details>

**d)** Escreva $f(2a)$, simplificado.

<details>
<summary>Ver resposta</summary>

**Função:** `(4a - 1)/(4a^2 + 3)`

Troque todo $x$ por $(2a)$: $\dfrac{2(2a) - 1}{(2a)^2 + 3} = \dfrac{4a - 1}{4a^2 + 3}$.
</details>

---

## Exercício 02: O que a API aceita

Uma API só aceita entradas em que a fórmula "não quebra", isto é, o domínio da função.

**a)** Em $f(x) = \dfrac{x + 5}{x^2 - 4x}$, o denominador zera em dois valores. Qual é o **menor** deles?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

$x^2 - 4x = x(x - 4) = 0 \Rightarrow x = 0$ ou $x = 4$. O menor é **0**.
</details>

**b)** E o **maior**?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

Do item anterior: **4**. O domínio é $\mathbb{R} - \lbrace 0, 4 \rbrace$.
</details>

**c)** Em $g(x) = \sqrt{x - 6}$, qual é o **menor** $x$ do domínio?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

A raiz exige $x - 6 \geq 0$, ou seja, $x \geq 6$. Domínio: $[6, \infty)$.
</details>

**d)** O domínio de $h(x) = \ln(10 - 2x)$ é $x < k$. Quanto vale $k$?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

O logaritmo exige $10 - 2x > 0 \Rightarrow 10 > 2x \Rightarrow x < 5$.
</details>

---

## Exercício 03: Armazenamento em nuvem

Um serviço cobra 18 reais fixos por mês mais 0,05 real por GB armazenado.

**a)** Escreva o custo mensal $C(x)$ para $x$ GB.

<details>
<summary>Ver resposta</summary>

**Função:** `18 + 0,05x`

"Fixo mais taxa por unidade" é uma função afim: $C(x) = 18 + 0{,}05x$.
</details>

**b)** Quanto custa armazenar 200 GB?

<details>
<summary>Ver resposta</summary>

**Número:** `28`

$C(200) = 18 + 0{,}05 \cdot 200 = 18 + 10 = 28$ reais.
</details>

**c)** Com 43 reais por mês, quantos GB cabem no orçamento?

<details>
<summary>Ver resposta</summary>

**Número:** `500`

$18 + 0{,}05x = 43 \Rightarrow 0{,}05x = 25 \Rightarrow x = \dfrac{25}{0{,}05} = 500$ GB.
</details>
