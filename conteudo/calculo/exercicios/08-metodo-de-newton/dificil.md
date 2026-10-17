# 🚀 Método de Newton · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Método de Newton](../../aulas/08-metodo-de-newton.md)

Resolva no papel primeiro, com calculadora. Use 6 casas decimais e pare quando $\lvert x_k - x_{k-1} \rvert < \varepsilon$, entregando $x_k$. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O programa que nunca para

Um estudante programou Newton para $f(x) = x^3 - 5x$ e escolheu $x_0 = 1$. O programa nunca parou.

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

$f'(x) = 3x^2 - 5$. $f(1) = -4$ e $f'(1) = -2$. $x_1 = 1 - \dfrac{-4}{-2} = 1 - 2 = -1$.
</details>

**b)** Quanto vale $x_2$?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$f(-1) = 4$ e $f'(-1) = -2$. $x_2 = -1 - \dfrac{4}{-2} = 1$. Voltou ao início: os chutes ficam alternando $1, -1, 1, -1, \dots$ para sempre (um **ciclo**).
</details>

**c)** Recomeçando com $x_0 = 2$ e $\varepsilon = 10^{-4}$, qual raiz Newton encontra?

<details>
<summary>Ver resposta</summary>

**Número:** `√5 ± 0,0001`

| $k$ | $x_k$ | $\lvert x_k - x_{k-1} \rvert$ |
| --- | ----- | ----------------------------- |
| 1 | 2,285714 | 0,285714 |
| 2 | 2,237640 | 0,048074 |
| 3 | 2,236070 | 0,001570 |
| 4 | 2,236068 | 0,000002 |

Converge para $2{,}236068 \approx \sqrt{5}$, uma das raízes de $x^3 - 5x = x(x^2 - 5)$.
</details>

---

## Exercício 08: Raiz cúbica

Calcule $\sqrt[3]{10}$ resolvendo $f(x) = x^3 - 10 = 0$ com $x_0 = 2$ e $\varepsilon = 10^{-4}$.

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `13/6`

$x_1 = 2 - \dfrac{8 - 10}{12} = 2 + \dfrac{1}{6} = \dfrac{13}{6} \approx 2{,}166667$.
</details>

**b)** Em qual iteração $k$ o método para?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

| $k$ | $x_k$ | $\lvert x_k - x_{k-1} \rvert$ |
| --- | ----- | ----------------------------- |
| 1 | 2,166667 | 0,166667 |
| 2 | 2,154504 | 0,012163 |
| 3 | 2,154435 | 0,000069 |

Em $k = 3$ a diferença ficou abaixo de $0{,}0001$.
</details>

**c)** Qual é a resposta?

<details>
<summary>Ver resposta</summary>

**Número:** `2,154435 ± 0,0001`

$x_3 \approx 2{,}154435$. Conferindo: $2{,}154435^3 \approx 10{,}0000$.
</details>

---

## Exercício 09: Bisseção ou Newton?

Resolva $f(x) = e^x - 3x = 0$, que tem uma raiz em $[0, 1]$, com $\varepsilon = 10^{-4}$.

**a)** Pela bisseção em $[0, 1]$, qual é o menor $k$?

<details>
<summary>Ver resposta</summary>

**Número:** `13`

$\dfrac{1}{2^{k+1}} \leq 10^{-4} \Rightarrow 2^{k+1} \geq 10\,000$. Como $2^{13} = 8192$ e $2^{14} = 16\,384$: $k = 13$, ou seja, **14** pontos médios.
</details>

**b)** Por Newton com $x_0 = 0$, em qual iteração o critério de parada é atingido?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

$f'(x) = e^x - 3$.

| $k$ | $x_{k-1}$ | $f(x_{k-1})$ | $f'(x_{k-1})$ | $x_k$ | $\lvert x_k - x_{k-1} \rvert$ |
| --- | --------- | ------------ | ------------- | ----- | ----------------------------- |
| 1 | 0 | 1 | $-2$ | 0,5 | 0,5 |
| 2 | 0,5 | 0,148721 | $-1{,}351279$ | 0,610060 | 0,110060 |
| 3 | 0,610060 | 0,010362 | $-1{,}159459$ | 0,618997 | 0,008937 |
| 4 | 0,618997 | 0,000074 | $-1{,}142936$ | 0,619061 | 0,000065 |
</details>

**c)** Qual é a raiz?

<details>
<summary>Ver resposta</summary>

**Número:** `0,619061 ± 0,0001`

$x_4 \approx 0{,}619061$.
</details>

**d)** Cite uma vantagem da bisseção sobre Newton que justificaria usá-la mesmo sendo mais lenta.

<details>
<summary>Ver resposta</summary>

**Resposta esperada:** a bisseção **sempre converge** quando $f$ é contínua e troca de sinal no intervalo, e o número de iterações é **conhecido antes de começar** (bom para sistemas com tempo de resposta garantido). Ela também **não precisa da derivada**. Newton pode ciclar (exercício 07), divergir ou dividir por zero.
</details>
