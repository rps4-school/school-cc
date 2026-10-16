# 📊 Integral definida · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Integral definida e áreas](../../aulas/10-integral-definida.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**. Use `∞` (ou `infinito`) quando a integral divergir.

---

## Exercício 07: Simetria e substituição

Calcule:

**a)** $\displaystyle\int_{-3}^{3} (x^3 - 5x)\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `0`

$x^3 - 5x$ é **ímpar** (trocar $x$ por $-x$ troca o sinal) e o intervalo é simétrico: as duas metades se cancelam.
</details>

**b)** $\displaystyle\int_{-1}^{1} (x^4 + x)\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `2/5`

$x$ é ímpar (dá 0) e $x^4$ é par (dá o dobro de $\int_0^1$): $2 \cdot \dfrac{1}{5} = \dfrac{2}{5}$.
</details>

**c)** $\displaystyle\int_0^2 x\,(x^2 + 1)^2\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `62/3`

$u = x^2 + 1$, $x\,dx = \frac{1}{2}du$. Limites: $x = 0 \to u = 1$; $x = 2 \to u = 5$.

$$
\frac{1}{2}\int_1^5 u^2\,du = \frac{1}{2}\left[\frac{u^3}{3}\right]_1^5 = \frac{1}{2} \cdot \frac{125 - 1}{3} = \frac{62}{3}
$$
</details>

**d)** $\displaystyle\int_0^{\pi/2} \cos x \operatorname{sen}^2 x\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `1/3`

$u = \operatorname{sen} x$, $du = \cos x\,dx$. Limites: $0 \to 0$ e $\frac{\pi}{2} \to 1$. $\int_0^1 u^2\,du = \frac{1}{3}$.
</details>

---

## Exercício 08: Integrais impróprias

Calcule (escreva `∞` se divergir):

**a)** $\displaystyle\int_1^{\infty} \frac{1}{x^4}\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `1/3`

$\left[-\dfrac{1}{3x^3}\right]_1^t = \dfrac{1}{3} - \dfrac{1}{3t^3} \to \dfrac{1}{3}$.
</details>

**b)** $\displaystyle\int_1^{\infty} \frac{1}{\sqrt{x}}\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `∞`

$\Big[2\sqrt{x}\Big]_1^t = 2\sqrt{t} - 2 \to \infty$. Diverge: aqui $p = \frac{1}{2} \leq 1$.
</details>

**c)** $\displaystyle\int_0^{\infty} e^{-2x}\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `1/2`

$\left[-\dfrac{e^{-2x}}{2}\right]_0^t = \dfrac{1}{2} - \dfrac{e^{-2t}}{2} \to \dfrac{1}{2}$.
</details>

**d)** Um download começa a $80$ MB/s e a velocidade cai como $v(t) = 80\,e^{-0{,}4t}$. Quantos MB serão baixados no total, se ninguém interromper?

<details>
<summary>Ver resposta</summary>

**Número:** `200`

$\displaystyle\int_0^{\infty} 80\,e^{-0{,}4t}\,dt = 80 \cdot \frac{1}{0{,}4} = 200$ MB.
</details>

---

## Exercício 09: Regiões mais complicadas

**a)** Calcule a área entre $y = x^2 - 2x$ e $y = x$.

<details>
<summary>Ver resposta</summary>

**Número:** `9/2`

Cruzamentos: $x^2 - 2x = x \Rightarrow x^2 - 3x = 0 \Rightarrow x = 0$ ou $x = 3$. Em $x = 1$: reta vale $1$, parábola vale $-1$, então a reta está em cima.

$$
\int_0^3 \bigl(x - (x^2 - 2x)\bigr)\,dx = \int_0^3 (3x - x^2)\,dx = \frac{27}{2} - 9 = \frac{9}{2}
$$
</details>

**b)** Calcule $\displaystyle\int_0^{\pi} \cos x\,dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `0`

$\Big[\operatorname{sen} x\Big]_0^{\pi} = 0 - 0 = 0$.
</details>

**c)** Qual é a **área** entre $y = \cos x$ e o eixo $x$ em $[0, \pi]$?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

O cosseno é positivo em $[0, \frac{\pi}{2}]$ e negativo em $[\frac{\pi}{2}, \pi]$. Cada pedaço tem área 1: total **2**. A integral do item b deu 0 porque os pedaços se cancelam.
</details>

**d)** Calcule a área entre $y = e^x$ e $y = e^{-x}$ no intervalo $[0, 1]$.

<details>
<summary>Ver resposta</summary>

**Número:** `e + 1/e - 2`

Em $[0, 1]$, $e^x \geq e^{-x}$. $\displaystyle\int_0^1 (e^x - e^{-x})\,dx = \Big[e^x + e^{-x}\Big]_0^1 = (e + e^{-1}) - 2 \approx 1{,}0862$.
</details>
