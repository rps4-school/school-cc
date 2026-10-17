# 🚀 Método de Newton · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Método de Newton](../../aulas/08-metodo-de-newton.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro, com calculadora. Use 6 casas decimais e pare quando $\lvert x_k - x_{k-1} \rvert < \varepsilon$, entregando $x_k$. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Equação de desempenho

O ponto de equilíbrio de um sistema satisfaz $x^3 - 3x - 5 = 0$. Use Newton com $x_0 = 2$ e $\varepsilon = 10^{-3}$.

**a)** Em qual iteração $k$ o critério de parada é atingido?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

$f'(x) = 3x^2 - 3$.

| $k$ | $x_{k-1}$ | $f(x_{k-1})$ | $f'(x_{k-1})$ | $x_k$ | $\lvert x_k - x_{k-1} \rvert$ |
| --- | --------- | ------------ | ------------- | ----- | ----------------------------- |
| 1 | 2 | $-3$ | 9 | 2,333333 | 0,333333 |
| 2 | 2,333333 | 0,703704 | 13,333333 | 2,280556 | 0,052778 |
| 3 | 2,280556 | 0,019351 | 12,602801 | 2,279020 | 0,001535 |
| 4 | 2,279020 | 0,000016 | 12,581797 | 2,279019 | 0,000001 |

Em $k = 3$ a diferença ($0{,}0015$) ainda não é menor que $0{,}001$. Para em $k = 4$.
</details>

**b)** Qual é a raiz aproximada?

<details>
<summary>Ver resposta</summary>

**Número:** `2,279019 ± 0,0001`

$x_4 \approx 2{,}279019$.
</details>

---

## Exercício 05: Confiabilidade

Num modelo de confiabilidade, o instante em que a probabilidade de sobrevivência $e^{-x}$ se iguala à fração de tempo decorrido $x$ satisfaz $f(x) = x - e^{-x} = 0$. Use Newton com $x_0 = 1$ e $\varepsilon = 10^{-3}$.

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `0,537883 ± 0,0001`

$f'(x) = 1 + e^{-x}$. $f(1) = 1 - 0{,}367879 = 0{,}632121$ e $f'(1) = 1{,}367879$. Então $x_1 = 1 - \dfrac{0{,}632121}{1{,}367879} \approx 0{,}537883$.
</details>

**b)** Qual é a raiz, pelo critério de parada?

<details>
<summary>Ver resposta</summary>

**Número:** `0,567143 ± 0,0001`

| $k$ | $x_k$ | $\lvert x_k - x_{k-1} \rvert$ |
| --- | ----- | ----------------------------- |
| 1 | 0,537883 | 0,462117 |
| 2 | 0,566987 | 0,029104 |
| 3 | 0,567143 | 0,000156 |

Para em $k = 3$: $x_3 \approx 0{,}567143$.
</details>

---

## Exercício 06: A mesma cache, agora com Newton

A cache do [exercício 08 da bisseção](../07-bissecao/dificil.md#exercício-08-cache-equilibrada-com-alta-precisão) satisfaz $f(x) = x\ln x - 3 = 0$. Use Newton com $x_0 = 3$ e $\varepsilon = 10^{-3}$.

**a)** Escreva $f'(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `ln(x) + 1`

Produto: $(x \ln x)' = 1 \cdot \ln x + x \cdot \dfrac{1}{x} = \ln x + 1$.
</details>

**b)** Qual é a raiz aproximada?

<details>
<summary>Ver resposta</summary>

**Número:** `2,857391 ± 0,0001`

| $k$ | $x_{k-1}$ | $f(x_{k-1})$ | $f'(x_{k-1})$ | $x_k$ | $\lvert x_k - x_{k-1} \rvert$ |
| --- | --------- | ------------ | ------------- | ----- | ----------------------------- |
| 1 | 3 | 0,295837 | 2,098612 | 2,859032 | 0,140968 |
| 2 | 2,859032 | 0,003365 | 2,050483 | 2,857391 | 0,001641 |
| 3 | 2,857391 | 0,000000 | 2,049909 | 2,857391 | 0,000000 |
</details>

**c)** Quantas iterações Newton usou? (A bisseção precisou de 10 pontos médios, $x_0$ a $x_9$.)

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Três iterações, e com muito mais precisão: o erro real de $x_3$ é menor que $10^{-6}$, enquanto o da bisseção era quase $0{,}001$.
</details>
