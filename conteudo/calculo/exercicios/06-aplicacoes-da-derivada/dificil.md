# 📈 Aplicações da derivada · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Aplicações da derivada](../../aulas/06-aplicacoes-da-derivada.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Tamanho do lote

Um sistema processa dados em lotes de tamanho $x$. O tempo total, em segundos, é $T(x) = 2x + \dfrac{800}{x}$ ($x > 0$): lotes grandes demoram para encher, e lotes pequenos geram muito overhead.

**a)** Qual tamanho de lote minimiza o tempo?

<details>
<summary>Ver resposta</summary>

**Número:** `20`

$T'(x) = 2 - \dfrac{800}{x^2} = 0 \Rightarrow x^2 = 400 \Rightarrow x = 20$ (só vale o positivo). $T''(x) = \dfrac{1600}{x^3} > 0$: é **mínimo**.
</details>

**b)** Qual é o tempo mínimo?

<details>
<summary>Ver resposta</summary>

**Número:** `80`

$T(20) = 40 + 40 = 80$ s. Repare que, no ótimo, as duas parcelas ficaram iguais.
</details>

---

## Exercício 08: Caixa de papelão

De uma placa quadrada de $18$ cm de lado, cortam-se quadrados de lado $x$ nos quatro cantos, e as abas são dobradas para formar uma caixa sem tampa.

**a)** Qual $x$ dá o maior volume?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

A base fica com lado $18 - 2x$ e a altura é $x$: $V(x) = x(18 - 2x)^2$, com $0 < x < 9$.

$$
V'(x) = (18 - 2x)^2 + x \cdot 2(18 - 2x)(-2) = (18 - 2x)(18 - 2x - 4x) = (18 - 2x)(18 - 6x)
$$

$V' = 0$ em $x = 9$ (caixa sem base, descartado) ou $x = 3$.
</details>

**b)** Qual é o volume máximo, em cm³?

<details>
<summary>Ver resposta</summary>

**Número:** `432`

$V(3) = 3 \cdot 12^2 = 432$ cm³.
</details>

---

## Exercício 09: Engajamento com notificações

O engajamento com uma notificação, $t$ horas depois do envio, é $E(t) = \dfrac{12t}{(t + 3)^2}$, com $t \geq 0$.

**a)** Em qual instante o engajamento é máximo?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Quociente: $E'(t) = \dfrac{12(t + 3)^2 - 12t \cdot 2(t + 3)}{(t + 3)^4} = \dfrac{12(t + 3 - 2t)}{(t + 3)^3} = \dfrac{12(3 - t)}{(t + 3)^3}$.

$E' > 0$ para $t < 3$ e $E' < 0$ para $t > 3$: máximo em $t = 3$.
</details>

**b)** Qual é o valor máximo?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$E(3) = \dfrac{36}{36} = 1$.
</details>

**c)** Esse máximo é **global** (o maior de todos para $t \geq 0$)? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

A função só cresce antes de $t = 3$ e só decresce depois. Nenhum outro ponto passa de 1.
</details>

**d)** A função é crescente para $t > 3$? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

Para $t > 3$, $E'(t) < 0$: ela **decresce**.
</details>

**e)** Calcule $\displaystyle\lim_{t \to \infty} E(t)$.

<details>
<summary>Ver resposta</summary>

**Número:** `0`

Grau 1 em cima e 2 embaixo: o engajamento some com o tempo.
</details>
