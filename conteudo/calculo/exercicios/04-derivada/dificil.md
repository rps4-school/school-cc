# 📐 Derivada · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Derivada](../../aulas/04-derivada.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O drone que para

Um drone segue a trajetória $y = x^4 - 2x^2 + 5$. Nos pontos de **tangente horizontal**, ele para de subir ou de descer.

**a)** Quantos pontos de tangente horizontal o gráfico tem?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

$y' = 4x^3 - 4x = 4x(x^2 - 1) = 4x(x - 1)(x + 1) = 0 \Rightarrow x = -1,\ 0,\ 1$. São **3** pontos.
</details>

**b)** Qual é a altura $y$ no ponto com $x = 1$?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

$y(1) = 1 - 2 + 5 = 4$. Por simetria, $y(-1) = 4$ também.
</details>

**c)** E no ponto com $x = 0$?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

$y(0) = 5$. Os três pontos são $(-1, 4)$, $(0, 5)$ e $(1, 4)$.
</details>

---

## Exercício 08: Onde não dá para derivar

**a)** Para $f(x) = \lvert x - 3 \rvert$, qual é a inclinação do gráfico **logo à esquerda** de $x = 3$?

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

Para $x < 3$: $f(x) = 3 - x$, reta de inclinação $-1$.
</details>

**b)** E **logo à direita**?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

Para $x > 3$: $f(x) = x - 3$, inclinação $1$.
</details>

**c)** $f'(3)$ existe? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

Os limites laterais da razão $\frac{f(3 + h) - f(3)}{h}$ são $-1$ e $1$: diferentes. O gráfico tem um **bico** em $x = 3$.
</details>

**d)** Por que $g(x) = \sqrt[3]{x}$ não tem derivada em $x = 0$, mesmo sendo contínua e sem bico?

<details>
<summary>Ver resposta</summary>

**Resposta esperada:** a tangente em $x = 0$ é **vertical**. Pela definição, $\dfrac{\sqrt[3]{h} - 0}{h} = \dfrac{1}{h^{2/3}} \to +\infty$: a inclinação seria infinita, e derivada tem que ser um número.
</details>

---

## Exercício 09: Aproximando pela tangente

Um microcontrolador sem a função `sqrt` estima raízes usando a reta tangente a $f(x) = \sqrt{x}$ em $x = 4$ (é a **linearização**).

**a)** Escreva essa reta tangente $L(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `2 + (x - 4)/4`

$f(4) = 2$ e $f'(x) = \dfrac{1}{2\sqrt{x}}$, então $f'(4) = \dfrac{1}{4}$. Reta: $L(x) = 2 + \dfrac{1}{4}(x - 4)$.
</details>

**b)** Use $L$ para estimar $\sqrt{4{,}1}$.

<details>
<summary>Ver resposta</summary>

**Número:** `2,025`

$L(4{,}1) = 2 + \dfrac{0{,}1}{4} = 2{,}025$.
</details>

**c)** O valor real é $\sqrt{4{,}1} \approx 2{,}024846$. Qual é o erro da estimativa? (Use 6 casas decimais.)

<details>
<summary>Ver resposta</summary>

**Número:** `0,000154 ± 0,000001`

$2{,}025 - 2{,}024846 = 0{,}000154$. Perto do ponto de tangência, a reta quase coincide com a curva.
</details>

**d)** A reta tangente a $y = x^2 + bx$ em $x = 1$ tem inclinação $5$. Quanto vale $b$?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

$y' = 2x + b$, então $y'(1) = 2 + b = 5 \Rightarrow b = 3$.
</details>
