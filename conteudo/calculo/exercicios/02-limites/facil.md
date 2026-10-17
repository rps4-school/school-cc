# 🎯 Limites · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Limites](../../aulas/02-limites.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Substituição direta

Um monitor de rede acompanha o tempo de resposta quando a carga se aproxima de certo valor. Calcule:

**a)** $\displaystyle\lim_{x \to 3} (2x^2 - x + 1)$

<details>
<summary>Ver resposta</summary>

**Número:** `16`

Polinômio: é só substituir. $2 \cdot 9 - 3 + 1 = 16$.
</details>

**b)** $\displaystyle\lim_{x \to -2} \frac{x^3 + 3x}{x + 4}$

<details>
<summary>Ver resposta</summary>

**Número:** `-7`

O denominador vale $2 \neq 0$: substitua. $\dfrac{-8 - 6}{2} = \dfrac{-14}{2} = -7$.
</details>

**c)** $\displaystyle\lim_{x \to 0} (5x^3 - 4x + 2)$

<details>
<summary>Ver resposta</summary>

**Número:** `2`

$0 - 0 + 2 = 2$.
</details>

---

## Exercício 02: Indeterminação por fatoração

A vazão média de um link é dada por frações que não podem ser avaliadas diretamente no ponto. Calcule:

**a)** $\displaystyle\lim_{x \to 6} \frac{x^2 - 36}{x - 6}$

<details>
<summary>Ver resposta</summary>

**Número:** `12`

$\frac{0}{0}$. Diferença de quadrados: $\dfrac{(x - 6)(x + 6)}{x - 6} = x + 6 \to 12$.
</details>

**b)** $\displaystyle\lim_{x \to 5} \frac{x^2 - 3x - 10}{x - 5}$

<details>
<summary>Ver resposta</summary>

**Número:** `7`

$x = 5$ zera o numerador, então $(x - 5)$ é fator: $x^2 - 3x - 10 = (x - 5)(x + 2)$. Cancelando: $x + 2 \to 7$.
</details>

**c)** $\displaystyle\lim_{x \to -3} \frac{x^2 + 6x + 9}{x + 3}$

<details>
<summary>Ver resposta</summary>

**Número:** `0`

$x^2 + 6x + 9 = (x + 3)^2$. Cancelando um fator: $x + 3 \to 0$.
</details>

---

## Exercício 03: Laterais de um plano de internet

Um plano cobra de um jeito até 2 GB e de outro jeito a partir daí:

$$
f(x) = \begin{cases} 3x + 1, & x < 2 \\ x^2 + 3, & x \geq 2 \end{cases}
$$

**a)** Calcule o limite pela esquerda em $x = 2$.

<details>
<summary>Ver resposta</summary>

**Número:** `7`

Para $x < 2$ vale $3x + 1$: $3 \cdot 2 + 1 = 7$.
</details>

**b)** Calcule o limite pela direita em $x = 2$.

<details>
<summary>Ver resposta</summary>

**Número:** `7`

Para $x \geq 2$ vale $x^2 + 3$: $4 + 3 = 7$.
</details>

**c)** Quanto vale $\displaystyle\lim_{x \to 2} f(x)$? (Se não existir, escreva **não existe**.)

<details>
<summary>Ver resposta</summary>

**Número:** `7`

Os dois laterais valem 7, então o limite **existe e vale 7**. A cobrança não dá "salto" em 2 GB.
</details>
