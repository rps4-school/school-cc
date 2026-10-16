# ✂️ Bisseção · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Método da bisseção](../../aulas/07-bissecao.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro, com calculadora. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**. Aqui a contagem começa em $x_0$ (o primeiro ponto médio).

---

## Exercício 01: Existe raiz?

Use o Teorema de Bolzano. Responda **sim** ou **não**.

**a)** $f(x) = x^3 - 4x + 1$ tem garantia de raiz em $[0, 1]$?

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

É polinômio (contínua), $f(0) = 1 > 0$ e $f(1) = 1 - 4 + 1 = -2 < 0$. Sinais opostos: existe raiz.
</details>

**b)** $f(x) = x^2 + 1$ tem garantia de raiz em $[-1, 1]$?

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

$f(-1) = 2$ e $f(1) = 2$: mesmo sinal, Bolzano não garante nada. (E de fato $x^2 + 1 \geq 1$ nunca zera.)
</details>

**c)** $f(x) = \dfrac{1}{x - 2}$ tem garantia de raiz em $[1, 3]$, já que $f(1) = -1$ e $f(3) = 1$?

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

$f$ **não é contínua** em $[1, 3]$: tem assíntota vertical em $x = 2$. Ela troca de sinal "pulando", sem cruzar o eixo. Bolzano exige continuidade.
</details>

---

## Exercício 02: Primeiros passos

Um microcontrolador sem `sqrt` calcula $\sqrt{7}$ resolvendo $f(x) = x^2 - 7 = 0$ por bisseção em $[2, 3]$.

**a)** Quanto vale $x_0$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,5`

$x_0 = \dfrac{2 + 3}{2} = 2{,}5$, com $f(2{,}5) = 6{,}25 - 7 = -0{,}75 < 0$.
</details>

**b)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,75`

$f(2) = -3 < 0$ e $f(2{,}5) < 0$: mesmo sinal, então $a = 2{,}5$. Novo intervalo $[2{,}5;\ 3]$ e $x_1 = 2{,}75$, com $f(2{,}75) = 0{,}5625 > 0$.
</details>

**c)** Quanto vale $x_2$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,625`

Agora $f(2{,}75) > 0$ e $f(2{,}5) < 0$: a raiz está em $[2{,}5;\ 2{,}75]$. $x_2 = 2{,}625$. (O valor real é $\sqrt{7} \approx 2{,}6458$.)
</details>

---

## Exercício 03: Quantas iterações?

**a)** Na bisseção em $[2, 3]$, qual é a cota de erro de $x_3$?

<details>
<summary>Ver resposta</summary>

**Número:** `0,0625`

$\dfrac{3 - 2}{2^{3 + 1}} = \dfrac{1}{16} = 0{,}0625$.
</details>

**b)** Com raiz em $[1, 2]$ e precisão $\varepsilon = 0{,}01$, qual é o menor $k$?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$\dfrac{1}{2^{k+1}} \leq 0{,}01 \Rightarrow 2^{k+1} \geq 100$. Como $2^6 = 64$ e $2^7 = 128$: $k + 1 = 7$, $k = 6$.
</details>

**c)** Com raiz em $[0, 4]$ e $\varepsilon = 10^{-3}$, qual é o menor $k$?

<details>
<summary>Ver resposta</summary>

**Número:** `11`

$\dfrac{4}{2^{k+1}} \leq 0{,}001 \Rightarrow 2^{k+1} \geq 4000$. Como $2^{11} = 2048$ e $2^{12} = 4096$: $k + 1 = 12$, $k = 11$.
</details>
