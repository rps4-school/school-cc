# 🧩 Funções · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Funções reais](../../aulas/01-funcoes.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Pipeline de duas etapas

Um pipeline aplica duas etapas: $g(x) = 3x - 1$ comprime o dado e $f(x) = x^2 + 2$ calcula o custo.

**a)** Escreva $f(g(x))$ (primeiro comprime, depois calcula o custo).

<details>
<summary>Ver resposta</summary>

**Função:** `9x^2 - 6x + 3`

$f(3x - 1) = (3x - 1)^2 + 2 = 9x^2 - 6x + 1 + 2 = 9x^2 - 6x + 3$.
</details>

**b)** Escreva $g(f(x))$.

<details>
<summary>Ver resposta</summary>

**Função:** `3x^2 + 5`

$g(x^2 + 2) = 3(x^2 + 2) - 1 = 3x^2 + 5$.
</details>

**c)** Calcule $f(g(1))$.

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$g(1) = 2$ e $f(2) = 4 + 2 = 6$. Conferindo pela fórmula do item a: $9 - 6 + 3 = 6$.
</details>

**d)** As duas ordens dão a mesma função? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

$9x^2 - 6x + 3 \neq 3x^2 + 5$ (em $x = 0$, dão $3$ e $5$). No pipeline, a ordem das etapas muda o resultado.
</details>

---

## Exercício 05: Desfazendo a codificação

Um sistema de brinquedo codifica números e precisa da função que desfaz a codificação.

**a)** A codificação é $f(x) = 6x + 11$. Escreva $f^{-1}(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `(x - 11)/6`

$y = 6x + 11 \Rightarrow y - 11 = 6x \Rightarrow x = \dfrac{y - 11}{6}$. Trocando os nomes: $f^{-1}(x) = \dfrac{x - 11}{6}$.
</details>

**b)** Qual número original gerou o código $53$?

<details>
<summary>Ver resposta</summary>

**Número:** `7`

$f^{-1}(53) = \dfrac{53 - 11}{6} = \dfrac{42}{6} = 7$. Conferindo: $f(7) = 42 + 11 = 53$. ✔️
</details>

**c)** Outra codificação é $g(x) = \dfrac{2x - 3}{x + 4}$. Escreva $g^{-1}(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `(4x + 3)/(2 - x)`

| Passo | Conta |
| ----- | ----- |
| Troque por $y$ | $y = \dfrac{2x - 3}{x + 4}$ |
| Tire a fração | $y(x + 4) = 2x - 3 \Rightarrow yx + 4y = 2x - 3$ |
| Junte os $x$ | $yx - 2x = -3 - 4y \Rightarrow x(y - 2) = -(4y + 3)$ |
| Isole | $x = \dfrac{-(4y + 3)}{y - 2} = \dfrac{4y + 3}{2 - y}$ |

Logo $g^{-1}(x) = \dfrac{4x + 3}{2 - x}$.
</details>

---

## Exercício 06: Funções hash e colisões

Uma função hash é boa quando **não tem colisões**: entradas diferentes dão saídas diferentes (é **injetora**). Considere domínio $\mathbb{R}$, salvo indicação. Responda **sim** ou **não**.

**a)** $f(x) = 5 - 2x$ é injetora?

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

É uma reta inclinada (sempre desce): cada saída vem de uma única entrada.
</details>

**b)** $f(x) = x^4 + 1$ é injetora?

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

$f(1) = f(-1) = 2$: colisão.
</details>

**c)** $f(x) = x^3 + 1$ é injetora?

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

$x^3$ é sempre crescente, e somar 1 só desloca o gráfico. Toda reta horizontal corta uma vez.
</details>

**d)** $f(x) = x^2$ com domínio $(-\infty, 0]$ é injetora?

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

Só sobra o lado esquerdo da parábola, que é sempre decrescente.
</details>

**e)** Qual é o **menor valor** da imagem de $h(x) = x^2 - 4x + 7$?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Completando o quadrado: $x^2 - 4x + 7 = (x - 2)^2 + 3 \geq 3$, com igualdade em $x = 2$. A imagem é $[3, \infty)$, então $h$ **não** é sobrejetora de $\mathbb{R}$ em $\mathbb{R}$.
</details>
