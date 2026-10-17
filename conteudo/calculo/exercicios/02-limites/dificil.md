# 🎯 Limites · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Limites](../../aulas/02-limites.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Fila quase cheia

O tempo médio de espera numa fila é $T(\rho) = \dfrac{3}{1 - \rho}$ segundos, onde $\rho$ é a ocupação do servidor ($0 \leq \rho < 1$). Use `∞` (ou `infinito`) e `-∞` quando for o caso.

**a)** Calcule $\displaystyle\lim_{\rho \to 1^-} \frac{3}{1 - \rho}$.

<details>
<summary>Ver resposta</summary>

**Número:** `∞`

Com $\rho$ um pouco **menor** que 1, $1 - \rho$ é **positivo e pequeno**: $\frac{3}{0{,}001} = 3000$. O limite é $+\infty$: com o servidor quase lotado, a espera cresce sem limite.
</details>

**b)** Calcule, só matematicamente, $\displaystyle\lim_{\rho \to 1^+} \frac{3}{1 - \rho}$.

<details>
<summary>Ver resposta</summary>

**Número:** `-∞`

Com $\rho$ um pouco **maior** que 1, $1 - \rho$ é **negativo e pequeno**: $\frac{3}{-0{,}001} = -3000$. O limite é $-\infty$.
</details>

**c)** Calcule $\displaystyle\lim_{x \to 2} \frac{1}{(x - 2)^2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `∞`

O quadrado deixa o denominador **positivo dos dois lados**. Os dois laterais dão $+\infty$, então o limite é $+\infty$.
</details>

**d)** Calcule $\displaystyle\lim_{x \to 0} \frac{1}{x}$. (Se não existir, escreva **não existe**.)

<details>
<summary>Ver resposta</summary>

**Resposta:** `não existe | ∄`

Pela direita dá $+\infty$ e pela esquerda dá $-\infty$. Laterais diferentes: o limite **não existe**.
</details>

---

## Exercício 08: Sinal espremido

Um sinal com ruído oscila muito rápido, mas sua amplitude é controlada. Use o Teorema do Confronto.

**a)** Calcule $\displaystyle\lim_{x \to 0} x\,\operatorname{sen}\left(\frac{1}{x}\right)$.

<details>
<summary>Ver resposta</summary>

**Número:** `0`

$-1 \leq \operatorname{sen}(\tfrac{1}{x}) \leq 1$. Multiplicando por $\lvert x \rvert$: $-\lvert x \rvert \leq x\operatorname{sen}(\tfrac{1}{x}) \leq \lvert x \rvert$. Os dois lados vão a 0, então o limite é **0**.
</details>

**b)** Uma função satisfaz $4x - 4 \leq f(x) \leq x^2$ para todo $x$. Quanto vale $\displaystyle\lim_{x \to 2} f(x)$?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

$\displaystyle\lim_{x \to 2} (4x - 4) = 4$ e $\displaystyle\lim_{x \to 2} x^2 = 4$. Espremida entre dois limites iguais, $f(x) \to 4$.
</details>

**c)** Calcule $\displaystyle\lim_{x \to \infty} \frac{\operatorname{sen} x}{x}$.

<details>
<summary>Ver resposta</summary>

**Número:** `0`

Para $x > 0$: $-\dfrac{1}{x} \leq \dfrac{\operatorname{sen} x}{x} \leq \dfrac{1}{x}$, e os dois lados vão a 0.
</details>

---

## Exercício 09: Continuidade sob medida

Um sistema de cobrança precisa ser **contínuo** (sem saltos no preço).

**a)** Seja $f(x) = \dfrac{x^2 - 9}{x - 3}$ para $x \neq 3$ e $f(3) = k$. Qual valor de $k$ deixa $f$ contínua em $x = 3$?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

Contínua exige $f(3) = \displaystyle\lim_{x \to 3} f(x)$. O limite é $\displaystyle\lim_{x \to 3} (x + 3) = 6$, então $k = 6$.
</details>

**b)** Seja $g(x) = ax + 1$ para $x < 2$ e $g(x) = x^2 - a$ para $x \geq 2$. Qual valor de $a$ faz o limite em $x = 2$ existir?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

Esquerda: $2a + 1$. Direita: $4 - a$. Igualando: $2a + 1 = 4 - a \Rightarrow 3a = 3 \Rightarrow a = 1$.
</details>

**c)** Com esse $a$, quanto vale $\displaystyle\lim_{x \to 2} g(x)$?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

$2 \cdot 1 + 1 = 3$ e $4 - 1 = 3$. Os laterais coincidem: o limite é **3** (e $g(2) = 3$, então $g$ é contínua).
</details>

**d)** Desafio: calcule $\displaystyle\lim_{x \to 0} \frac{(x + 3)^2 - 9}{x}$.

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$(x + 3)^2 - 9 = x^2 + 6x = x(x + 6)$. Cancelando: $x + 6 \to 6$.
</details>
