# 📐 Derivada · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Derivada](../../aulas/04-derivada.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Definição com mais contas

Use a definição com $h$ para derivar:

**a)** $f(x) = 2x^2 - 3x + 1$

<details>
<summary>Ver resposta</summary>

**Função:** `4x - 3`

| Passo | Conta |
| ----- | ----- |
| $f(x + h)$ | $2x^2 + 4xh + 2h^2 - 3x - 3h + 1$ |
| Menos $f(x)$ | $4xh + 2h^2 - 3h$ |
| Divide por $h$ | $4x + 2h - 3$ |
| $h \to 0$ | $4x - 3$ |
</details>

**b)** $f(x) = x^3$

<details>
<summary>Ver resposta</summary>

**Função:** `3x^2`

$(x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3$. Então $\dfrac{3x^2h + 3xh^2 + h^3}{h} = 3x^2 + 3xh + h^2 \to 3x^2$.
</details>

**c)** $f(x) = \dfrac{1}{x + 1}$

<details>
<summary>Ver resposta</summary>

**Função:** `-1/(x + 1)^2`

MMC: $\dfrac{1}{x + h + 1} - \dfrac{1}{x + 1} = \dfrac{(x + 1) - (x + h + 1)}{(x + h + 1)(x + 1)} = \dfrac{-h}{(x + h + 1)(x + 1)}$.

Dividindo por $h$: $\dfrac{-1}{(x + h + 1)(x + 1)} \to -\dfrac{1}{(x + 1)^2}$.
</details>

---

## Exercício 05: Derivada num ponto

Use $f'(a) = \displaystyle\lim_{x \to a} \frac{f(x) - f(a)}{x - a}$.

**a)** $f(x) = \sqrt{x}$ em $a = 4$. (Um algoritmo de busca tem custo proporcional a $\sqrt{n}$.)

<details>
<summary>Ver resposta</summary>

**Número:** `1/4`

$\displaystyle\lim_{x \to 4} \frac{\sqrt{x} - 2}{x - 4} = \lim_{x \to 4} \frac{\sqrt{x} - 2}{(\sqrt{x} - 2)(\sqrt{x} + 2)} = \frac{1}{4}$.
</details>

**b)** $f(x) = \dfrac{1}{x}$ em $a = 3$.

<details>
<summary>Ver resposta</summary>

**Número:** `-1/9`

$\dfrac{\frac{1}{x} - \frac{1}{3}}{x - 3} = \dfrac{3 - x}{3x(x - 3)} = -\dfrac{1}{3x} \to -\dfrac{1}{9}$.
</details>

**c)** $f(x) = x^2$ em $a = -2$.

<details>
<summary>Ver resposta</summary>

**Número:** `-4`

$\dfrac{x^2 - 4}{x + 2} = x - 2 \to -4$. Inclinação negativa: à esquerda do vértice, a parábola desce.
</details>

---

## Exercício 06: Retas tangentes

Em computação gráfica, curvas são desenhadas aproximando trechos por retas tangentes.

**a)** Escreva a reta tangente a $y = x^2 - 2x$ no ponto de abscissa $x_0 = 3$.

<details>
<summary>Ver resposta</summary>

**Função:** `4x - 9`

Ponto: $f(3) = 9 - 6 = 3$. Inclinação: $f'(x) = 2x - 2$, $f'(3) = 4$. Reta: $y - 3 = 4(x - 3) \Rightarrow y = 4x - 9$.
</details>

**b)** Escreva a reta tangente a $y = x^3 + x$ em $x_0 = 1$.

<details>
<summary>Ver resposta</summary>

**Função:** `4x - 2`

Ponto: $f(1) = 2$. Inclinação: $f'(x) = 3x^2 + 1$, $f'(1) = 4$. Reta: $y - 2 = 4(x - 1) \Rightarrow y = 4x - 2$.
</details>

**c)** Em que valor de $y$ a reta do item b corta o eixo vertical?

<details>
<summary>Ver resposta</summary>

**Número:** `-2`

Em $x = 0$: $y = 4 \cdot 0 - 2 = -2$.
</details>
