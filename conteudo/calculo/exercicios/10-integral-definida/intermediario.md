# 📊 Integral definida · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Integral definida e áreas](../../aulas/10-integral-definida.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Integral não é área

Seja $f(x) = x^2 - 1$ no intervalo $[0, 2]$.

**a)** Calcule $\displaystyle\int_0^2 (x^2 - 1)\,dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `2/3`

$\left[\dfrac{x^3}{3} - x\right]_0^2 = \dfrac{8}{3} - 2 = \dfrac{2}{3}$.
</details>

**b)** Calcule a **área** entre o gráfico de $f$ e o eixo $x$ nesse intervalo.

<details>
<summary>Ver resposta</summary>

**Número:** `2`

$f$ é negativa em $[0, 1)$ e positiva em $(1, 2]$ (o zero é $x = 1$). Separe:

| Pedaço | Integral | Área |
| ------ | -------- | ---- |
| $[0, 1]$ | $\frac{1}{3} - 1 = -\frac{2}{3}$ | $\frac{2}{3}$ |
| $[1, 2]$ | $\left(\frac{8}{3} - 2\right) - \left(\frac{1}{3} - 1\right) = \frac{4}{3}$ | $\frac{4}{3}$ |

Área total: $\frac{2}{3} + \frac{4}{3} = 2$. A integral ($\frac{2}{3}$) é menor porque desconta a parte de baixo.
</details>

---

## Exercício 05: Área entre curvas

Calcule a área da região:

**a)** entre $y = x^2$ e $y = 4$.

<details>
<summary>Ver resposta</summary>

**Número:** `32/3`

Cruzam em $x^2 = 4 \Rightarrow x = \pm 2$; a reta $y = 4$ está em cima.

$$
\int_{-2}^{2} (4 - x^2)\,dx = \left[4x - \frac{x^3}{3}\right]_{-2}^{2} = \left(8 - \frac{8}{3}\right) - \left(-8 + \frac{8}{3}\right) = \frac{32}{3}
$$
</details>

**b)** entre $y = x$ e $y = x^3$, no intervalo $[0, 1]$.

<details>
<summary>Ver resposta</summary>

**Número:** `1/4`

Em $[0, 1]$, $x \geq x^3$ (por exemplo, $0{,}5 > 0{,}125$). $\int_0^1 (x - x^3)\,dx = \frac{1}{2} - \frac{1}{4} = \frac{1}{4}$.
</details>

**c)** entre $y = e^x$ e $y = x$, no intervalo $[0, 1]$.

<details>
<summary>Ver resposta</summary>

**Número:** `e - 3/2`

$e^x > x$ sempre. $\displaystyle\int_0^1 (e^x - x)\,dx = \left[e^x - \frac{x^2}{2}\right]_0^1 = \left(e - \frac{1}{2}\right) - 1 = e - \frac{3}{2} \approx 1{,}2183$.
</details>

---

## Exercício 06: Somas de Riemann

Estime $\displaystyle\int_0^2 (x^2 + 1)\,dx$ com $n = 4$ retângulos.

**a)** Com a altura na ponta **direita** de cada pedaço.

<details>
<summary>Ver resposta</summary>

**Número:** `5,75`

$\Delta x = 0{,}5$. Pontas direitas: $0{,}5;\ 1;\ 1{,}5;\ 2$.

| $x_i$ | 0,5 | 1 | 1,5 | 2 |
| ----- | --- | - | --- | - |
| $f(x_i)$ | 1,25 | 2 | 3,25 | 5 |

Soma: $(1{,}25 + 2 + 3{,}25 + 5) \cdot 0{,}5 = 11{,}5 \cdot 0{,}5 = 5{,}75$.
</details>

**b)** Com a altura na ponta **esquerda**.

<details>
<summary>Ver resposta</summary>

**Número:** `3,75`

Pontas esquerdas: $0;\ 0{,}5;\ 1;\ 1{,}5$, com alturas $1;\ 1{,}25;\ 2;\ 3{,}25$. Soma: $7{,}5 \cdot 0{,}5 = 3{,}75$.
</details>

**c)** Qual é o valor exato da integral?

<details>
<summary>Ver resposta</summary>

**Número:** `14/3`

$\left[\dfrac{x^3}{3} + x\right]_0^2 = \dfrac{8}{3} + 2 = \dfrac{14}{3} \approx 4{,}667$. Fica entre as duas estimativas, como esperado para uma função crescente.
</details>
