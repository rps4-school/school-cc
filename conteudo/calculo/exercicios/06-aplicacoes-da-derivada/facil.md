# 📈 Aplicações da derivada · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Aplicações da derivada](../../aulas/06-aplicacoes-da-derivada.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Pontos críticos

**a)** $f(x) = x^3 - 12x + 1$ tem dois pontos críticos. Qual é o **menor**?

<details>
<summary>Ver resposta</summary>

**Número:** `-2`

$f'(x) = 3x^2 - 12 = 3(x^2 - 4) = 0 \Rightarrow x = \pm 2$. O menor é $-2$.
</details>

**b)** E o **maior**?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Do item anterior: $x = 2$.
</details>

**c)** Qual é o ponto crítico de $g(x) = x^2 - 10x + 3$?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

$g'(x) = 2x - 10 = 0 \Rightarrow x = 5$. É o vértice da parábola.
</details>

---

## Exercício 02: Uso de memória

O uso de memória de um processo, num modelo teórico, segue $M(x) = x^3 - 3x^2 - 24x + 1$.

**a)** Em qual $x$ está o **máximo local**?

<details>
<summary>Ver resposta</summary>

**Número:** `-2`

$M'(x) = 3x^2 - 6x - 24 = 3(x - 4)(x + 2)$. Quadro de sinais:

| Intervalo | $x < -2$ | $-2 < x < 4$ | $x > 4$ |
| --------- | -------- | ------------ | ------- |
| $M'$ | $+$ | $-$ | $+$ |
| $M$ | cresce | decresce | cresce |

De $+$ para $-$ em $x = -2$: máximo local.
</details>

**b)** Qual é o **valor** desse máximo local?

<details>
<summary>Ver resposta</summary>

**Número:** `29`

$M(-2) = -8 - 12 + 48 + 1 = 29$.
</details>

**c)** Em qual $x$ está o **mínimo local**?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

De $-$ para $+$ em $x = 4$, com $M(4) = 64 - 48 - 96 + 1 = -79$.
</details>

**d)** Em $x = 0$, a função está **crescendo** ou **decrescendo**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `decrescendo`

$M'(0) = -24 < 0$. Pelo quadro, $x = 0$ está no trecho $(-2, 4)$, onde $M$ decresce.
</details>

---

## Exercício 03: Concavidade

Seja $f(x) = x^3 + 3x^2 - 2$.

**a)** Em qual $x$ está o ponto de inflexão?

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

$f'(x) = 3x^2 + 6x$ e $f''(x) = 6x + 6 = 0 \Rightarrow x = -1$. O sinal de $f''$ troca ali (negativo antes, positivo depois).
</details>

**b)** Qual é o $y$ do ponto de inflexão?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

$f(-1) = -1 + 3 - 2 = 0$. Ponto de inflexão: $(-1, 0)$.
</details>

**c)** Em $x = 2$, a concavidade é **para cima** ou **para baixo**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `para cima`

$f''(2) = 18 > 0$: concavidade para cima ($\cup$).
</details>
