# 🚀 Método de Newton · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Método de Newton](../../aulas/08-metodo-de-newton.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro, com calculadora. Use 6 casas decimais nas contas; o corretor aceita a resposta com 4 casas ou mais. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Raiz de 6 sem `sqrt`

Um microcontrolador calcula $\sqrt{6}$ resolvendo $f(x) = x^2 - 6 = 0$ pelo método de Newton, com $x_0 = 2$.

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,5`

$f'(x) = 2x$. $x_1 = 2 - \dfrac{4 - 6}{4} = 2 + 0{,}5 = 2{,}5$.
</details>

**b)** Quanto vale $x_2$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,45`

$x_2 = 2{,}5 - \dfrac{6{,}25 - 6}{5} = 2{,}5 - 0{,}05 = 2{,}45$.
</details>

**c)** Quanto vale $x_3$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,449490 ± 0,0001`

$x_3 = 2{,}45 - \dfrac{0{,}0025}{4{,}9} \approx 2{,}45 - 0{,}000510 = 2{,}449490$. O valor real é $\sqrt{6} \approx 2{,}4494897$: em 3 passos, 6 casas certas.
</details>

---

## Exercício 02: Método de Herão

Para $\sqrt{20}$, use $x_k = \dfrac{1}{2}\left(x_{k-1} + \dfrac{20}{x_{k-1}}\right)$ com $x_0 = 4$.

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `4,5`

$\dfrac{1}{2}\left(4 + \dfrac{20}{4}\right) = \dfrac{4 + 5}{2} = 4{,}5$.
</details>

**b)** Quanto vale $x_2$?

<details>
<summary>Ver resposta</summary>

**Número:** `4,472222 ± 0,0001`

$\dfrac{1}{2}\left(4{,}5 + \dfrac{20}{4{,}5}\right) = \dfrac{4{,}5 + 4{,}444444}{2} = 4{,}472222$. O real é $\sqrt{20} \approx 4{,}472136$.
</details>

---

## Exercício 03: Montando a fórmula

Considere $f(x) = x^3 - 5$ (a raiz é $\sqrt[3]{5}$).

**a)** Escreva a função de iteração $g(x) = x - \dfrac{f(x)}{f'(x)}$, simplificada.

<details>
<summary>Ver resposta</summary>

**Função:** `2x/3 + 5/(3x^2)`

$f'(x) = 3x^2$. Então $g(x) = x - \dfrac{x^3 - 5}{3x^2} = x - \dfrac{x}{3} + \dfrac{5}{3x^2} = \dfrac{2x}{3} + \dfrac{5}{3x^2}$.
</details>

**b)** Com $x_0 = 2$, quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `1,75`

$g(2) = \dfrac{4}{3} + \dfrac{5}{12} = \dfrac{16 + 5}{12} = \dfrac{21}{12} = 1{,}75$.
</details>

**c)** Para $h(x) = x^2 - 4x + 1$, por que Newton não pode começar em $x_0 = 2$? Quanto vale $h'(2)$?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

$h'(x) = 2x - 4$, então $h'(2) = 0$. A tangente em $x = 2$ (o vértice da parábola) é **horizontal**: nunca corta o eixo $x$, e a fórmula divide por zero.
</details>
