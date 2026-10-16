# ✂️ Bisseção · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Método da bisseção](../../aulas/07-bissecao.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro, com calculadora (em **radianos**, se houver seno ou cosseno). Use 6 casas decimais nas contas. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Tamanho ideal do bloco

O tamanho ideal $x$ de um bloco de dados satisfaz $x^3 - 2x - 5 = 0$. Use a bisseção em $[2, 3]$ com $\varepsilon = 10^{-2}$.

**a)** Qual é o menor $k$ que garante a precisão?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$\dfrac{1}{2^{k+1}} \leq 0{,}01 \Rightarrow 2^{k+1} \geq 100 \Rightarrow k = 6$.
</details>

**b)** Quanto vale $x_6$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,101563 ± 0,0001`

| $k$ | $a$ | $b$ | $x_k$ | $f(x_k)$ |
| --- | --- | --- | ----- | -------- |
| 0 | 2 | 3 | 2,5 | $+5{,}625$ |
| 1 | 2 | 2,5 | 2,25 | $+1{,}890625$ |
| 2 | 2 | 2,25 | 2,125 | $+0{,}345703$ |
| 3 | 2 | 2,125 | 2,0625 | $-0{,}351318$ |
| 4 | 2,0625 | 2,125 | 2,09375 | $-0{,}008942$ |
| 5 | 2,09375 | 2,125 | 2,109375 | $+0{,}166836$ |
| 6 | 2,09375 | 2,109375 | **2,1015625** | $+0{,}078562$ |

$x_6 = 2{,}1015625$, com erro garantido $\leq 0{,}0078$.
</details>

**c)** A raiz exata é $r \approx 2{,}094551$. O erro real de $x_6$ ficou dentro da cota? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

$\lvert 2{,}1015625 - 2{,}094551 \rvert \approx 0{,}0070 \leq 0{,}0078$. A cota é uma garantia: o erro real nunca passa dela.
</details>

---

## Exercício 05: Animação que encontra o cosseno

Numa animação, um objeto na posição $x$ encontra a curva $y = \cos x$ quando $\cos x = x$, ou seja, $f(x) = \cos x - x = 0$. Use a bisseção em $[0, 1]$ com $\varepsilon = 10^{-2}$ (calculadora em **radianos**).

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `0,75`

$f(0) = 1 > 0$. $x_0 = 0{,}5$, $f(0{,}5) = 0{,}377583 > 0$: troque $a$. Intervalo $[0{,}5;\ 1]$, então $x_1 = 0{,}75$.
</details>

**b)** Quanto vale $x_6$?

<details>
<summary>Ver resposta</summary>

**Número:** `0,742188 ± 0,0001`

| $k$ | $a$ | $b$ | $x_k$ | $f(x_k)$ |
| --- | --- | --- | ----- | -------- |
| 0 | 0 | 1 | 0,5 | $+0{,}377583$ |
| 1 | 0,5 | 1 | 0,75 | $-0{,}018311$ |
| 2 | 0,5 | 0,75 | 0,625 | $+0{,}185963$ |
| 3 | 0,625 | 0,75 | 0,6875 | $+0{,}085335$ |
| 4 | 0,6875 | 0,75 | 0,71875 | $+0{,}033879$ |
| 5 | 0,71875 | 0,75 | 0,734375 | $+0{,}007875$ |
| 6 | 0,734375 | 0,75 | **0,7421875** | $-0{,}005196$ |
</details>

---

## Exercício 06: Isolar e refinar

Considere $f(x) = \sqrt{x} - 4e^{-x}$, com $x \geq 0$.

**a)** Testando $x = 0, 1, 2, 3$, em qual intervalo de tamanho 1 está a raiz? Responda a ponta **esquerda**.

<details>
<summary>Ver resposta</summary>

**Número:** `1`

| $x$ | 0 | 1 | 2 | 3 |
| --- | - | - | - | - |
| $f(x)$ | $-4$ | $-0{,}4715$ | $0{,}8729$ | $1{,}5329$ |

O sinal troca entre 1 e 2: a raiz está em $[1, 2]$.
</details>

**b)** A raiz nesse intervalo é única? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

$f'(x) = \dfrac{1}{2\sqrt{x}} + 4e^{-x} > 0$ para $x > 0$: $f$ só cresce, então cruza o eixo uma única vez.
</details>

**c)** Quanto vale $x_2$ da bisseção em $[1, 2]$?

<details>
<summary>Ver resposta</summary>

**Número:** `1,375`

| $k$ | $a$ | $b$ | $x_k$ | $f(x_k)$ |
| --- | --- | --- | ----- | -------- |
| 0 | 1 | 2 | 1,5 | $+0{,}332224$ |
| 1 | 1 | 1,5 | 1,25 | $-0{,}027985$ |
| 2 | 1,25 | 1,5 | **1,375** | $+0{,}161246$ |
</details>

**d)** Qual é a cota de erro de $x_2$?

<details>
<summary>Ver resposta</summary>

**Número:** `0,125`

$\dfrac{2 - 1}{2^{3}} = 0{,}125$.
</details>
