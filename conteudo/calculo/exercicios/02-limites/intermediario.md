# 🎯 Limites · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Limites](../../aulas/02-limites.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Fatorando em cima e embaixo

Num modelo de fila, a razão entre duas medidas de desempenho perde o sentido em alguns pontos. Calcule:

**a)** $\displaystyle\lim_{x \to -3} \frac{x^2 + 3x}{x^2 - 2x - 15}$

<details>
<summary>Ver resposta</summary>

**Número:** `3/8`

$\frac{0}{0}$. Fatore os dois: $\dfrac{x(x + 3)}{(x - 5)(x + 3)} = \dfrac{x}{x - 5} \to \dfrac{-3}{-8} = \dfrac{3}{8}$.
</details>

**b)** $\displaystyle\lim_{x \to 1} \frac{x^3 - 1}{x^2 - 1}$

<details>
<summary>Ver resposta</summary>

**Número:** `3/2`

Diferença de cubos em cima e de quadrados embaixo:

$$
\frac{(x - 1)(x^2 + x + 1)}{(x - 1)(x + 1)} = \frac{x^2 + x + 1}{x + 1} \to \frac{3}{2}
$$
</details>

**c)** $\displaystyle\lim_{x \to 4} \frac{x^2 - 16}{x^2 - 6x + 8}$

<details>
<summary>Ver resposta</summary>

**Número:** `4`

$\dfrac{(x - 4)(x + 4)}{(x - 4)(x - 2)} = \dfrac{x + 4}{x - 2} \to \dfrac{8}{2} = 4$.
</details>

---

## Exercício 05: Raízes e conjugados

Um algoritmo de compressão usa raízes quadradas no cálculo do ganho. Calcule:

**a)** $\displaystyle\lim_{x \to 16} \frac{\sqrt{x} - 4}{x - 16}$

<details>
<summary>Ver resposta</summary>

**Número:** `1/8`

$x - 16 = (\sqrt{x} - 4)(\sqrt{x} + 4)$. Cancelando: $\dfrac{1}{\sqrt{x} + 4} \to \dfrac{1}{8}$.
</details>

**b)** $\displaystyle\lim_{x \to 0} \frac{\sqrt{x + 4} - 2}{x}$

<details>
<summary>Ver resposta</summary>

**Número:** `1/4`

Multiplique pelo conjugado $\sqrt{x + 4} + 2$:

$$
\frac{x + 4 - 4}{x(\sqrt{x + 4} + 2)} = \frac{1}{\sqrt{x + 4} + 2} \to \frac{1}{4}
$$
</details>

**c)** $\displaystyle\lim_{x \to 5} \frac{\sqrt{3x + 1} - 4}{x - 5}$

<details>
<summary>Ver resposta</summary>

**Número:** `3/8`

Conjugado $\sqrt{3x + 1} + 4$. Em cima: $3x + 1 - 16 = 3x - 15 = 3(x - 5)$.

$$
\frac{3(x - 5)}{(x - 5)(\sqrt{3x + 1} + 4)} = \frac{3}{\sqrt{3x + 1} + 4} \to \frac{3}{4 + 4} = \frac{3}{8}
$$
</details>

---

## Exercício 06: Expandir e tirar o MMC

Em física de jogos, a velocidade instantânea aparece como limite de razões com $h$ pequeno. Calcule:

**a)** $\displaystyle\lim_{h \to 0} \frac{(-2 + h)^2 - 4}{h}$

<details>
<summary>Ver resposta</summary>

**Número:** `-4`

$(-2 + h)^2 - 4 = 4 - 4h + h^2 - 4 = h(h - 4)$. Cancelando: $h - 4 \to -4$.
</details>

**b)** $\displaystyle\lim_{h \to 0} \frac{(2 + h)^3 - 8}{h}$

<details>
<summary>Ver resposta</summary>

**Número:** `12`

$(2 + h)^3 = 8 + 12h + 6h^2 + h^3$. Então $\dfrac{12h + 6h^2 + h^3}{h} = 12 + 6h + h^2 \to 12$.
</details>

**c)** $\displaystyle\lim_{x \to 4} \frac{\frac{1}{x} - \frac{1}{4}}{x - 4}$

<details>
<summary>Ver resposta</summary>

**Número:** `-1/16`

MMC em cima: $\dfrac{1}{x} - \dfrac{1}{4} = \dfrac{4 - x}{4x} = \dfrac{-(x - 4)}{4x}$. Então

$$
\frac{-(x - 4)}{4x(x - 4)} = -\frac{1}{4x} \to -\frac{1}{16}
$$
</details>
