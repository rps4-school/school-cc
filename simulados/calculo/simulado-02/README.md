# 📝 Simulado 02 · Cálculo

> [← voltar para Simulados](../../README.md)

**Nível:** 🟡 Intermediário

**Duração sugerida:** 1h · **Pontuação:** 100 pontos · **Assuntos:** todos (aulas 1 a 10)

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações ou IA. O [formulário](../../../conteudo/calculo/resumos/formulario.md) fica para depois.
> - **Calculadora científica** liberada, em **radianos** quando houver seno ou cosseno.
> - **Mostre as contas** no papel: resposta sem desenvolvimento vale metade.
> - São 10 questões de **10 pontos**. Os itens de uma questão valem partes iguais.
> - Só confira as respostas depois que o tempo acabar.

> 💡 **Corrigindo no site:** cada item tem um campo para digitar a sua resposta e conferir na hora (vale fração, decimal, `π`, `e`, `√` e funções equivalentes). Use só na correção, depois do tempo.

---

## Questão 01 · Funções · 10 pontos

**Pipeline e potência.** Um pipeline usa $g(x) = 2x - 5$ e depois $f(x) = x^2 + 1$.

**a)** Escreva $f(g(x))$, expandido.

<details>
<summary>Ver resposta</summary>

**Função:** `4x^2 - 20x + 26`

$(2x - 5)^2 + 1 = 4x^2 - 20x + 25 + 1$.
</details>

**b)** Calcule $g(f(2))$.

<details>
<summary>Ver resposta</summary>

**Número:** `5`

$f(2) = 5$ e $g(5) = 10 - 5 = 5$.
</details>

**c)** A potência de um processador é proporcional ao quadrado da frequência e vale $45$ W a $3$ GHz. Quanto vale a $4$ GHz?

<details>
<summary>Ver resposta</summary>

**Número:** `80`

$P = kf^2$: $45 = 9k \Rightarrow k = 5$. A $4$ GHz: $5 \cdot 16 = 80$ W.
</details>

---

## Questão 02 · Limites · 10 pontos

**a)** Calcule $\displaystyle\lim_{x \to -2} \frac{x^2 + 5x + 6}{x + 2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$(x + 2)(x + 3)$ em cima. Cancelando: $x + 3 \to 1$.
</details>

**b)** Calcule $\displaystyle\lim_{h \to 0} \frac{(1 + h)^3 - 1}{h}$.

<details>
<summary>Ver resposta</summary>

**Número:** `3`

$(1 + h)^3 - 1 = 3h + 3h^2 + h^3$. Dividindo por $h$: $3 + 3h + h^2 \to 3$.
</details>

**c)** Calcule $\displaystyle\lim_{x \to 2} \frac{\frac{1}{x} - \frac{1}{2}}{x - 2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `-1/4`

MMC: $\dfrac{2 - x}{2x(x - 2)} = -\dfrac{1}{2x} \to -\dfrac{1}{4}$.
</details>

---

## Questão 03 · Limites no infinito · 10 pontos

**a)** Calcule $\displaystyle\lim_{x \to \infty} \frac{4x^2 + 3x - 1}{2x^2 - x + 5}$.

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Mesmo grau: $\frac{4}{2} = 2$.
</details>

**b)** Calcule $\displaystyle\lim_{x \to -\infty} \frac{\sqrt{25x^2 + 3}}{5x - 2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

$\sqrt{25x^2 + 3} \sim 5\lvert x \rvert = -5x$ para $x < 0$. Então $\dfrac{-5x}{5x} = -1$.
</details>

**c)** Qual é a assíntota vertical de $f(x) = \dfrac{x + 1}{x^2 - 1}$? Responda o valor de $x$.

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$f(x) = \dfrac{x + 1}{(x - 1)(x + 1)} = \dfrac{1}{x - 1}$ para $x \neq -1$. Em $x = -1$ o fator cancela (buraco). Sobra a assíntota $x = 1$.
</details>

---

## Questão 04 · Derivada · 10 pontos

Seja $f(x) = x^3$.

**a)** Qual é a taxa média de variação entre $x = 1$ e $x = 2$?

<details>
<summary>Ver resposta</summary>

**Número:** `7`

$\dfrac{8 - 1}{2 - 1} = 7$.
</details>

**b)** Pela definição, calcule $f'(2)$.

<details>
<summary>Ver resposta</summary>

**Número:** `12`

$\dfrac{(2 + h)^3 - 8}{h} = \dfrac{12h + 6h^2 + h^3}{h} = 12 + 6h + h^2 \to 12$.
</details>

**c)** Para $y = x^3 - 12x$, qual é o valor de $y$ no ponto de tangente horizontal com $x > 0$?

<details>
<summary>Ver resposta</summary>

**Número:** `-16`

$y' = 3x^2 - 12 = 0 \Rightarrow x = \pm 2$. Com $x = 2$: $y = 8 - 24 = -16$.
</details>

---

## Questão 05 · Regras de derivação · 10 pontos

Derive:

**a)** $f(x) = (x^2 - 3x)\,e^x$

<details>
<summary>Ver resposta</summary>

**Função:** `e^x (x^2 - x - 3)`

$(2x - 3)e^x + (x^2 - 3x)e^x = e^x(x^2 - x - 3)$.
</details>

**b)** $g(x) = \sqrt{1 + 4x}$

<details>
<summary>Ver resposta</summary>

**Função:** `2/√(1 + 4x)`

$\frac{1}{2}(1 + 4x)^{-1/2} \cdot 4 = \dfrac{2}{\sqrt{1 + 4x}}$.
</details>

**c)** $h(x) = \log_2(x^2 + 1)$

<details>
<summary>Ver resposta</summary>

**Função:** `2x/((x^2 + 1) ln 2)`

$\dfrac{u'}{u \ln 2}$ com $u = x^2 + 1$.
</details>

---

## Questão 06 · Aplicações da derivada · 10 pontos

**a)** O tempo de processamento em lotes de tamanho $x$ é $T(x) = x + \dfrac{1600}{x}$. Qual lote minimiza o tempo?

<details>
<summary>Ver resposta</summary>

**Número:** `40`

$T'(x) = 1 - \dfrac{1600}{x^2} = 0 \Rightarrow x = 40$. $T'' = \dfrac{3200}{x^3} > 0$: mínimo.
</details>

**b)** Qual é o tempo mínimo?

<details>
<summary>Ver resposta</summary>

**Número:** `80`

$T(40) = 40 + 40 = 80$.
</details>

**c)** Qual é o máximo absoluto de $f(x) = x^2 - 6x + 5$ no intervalo $[0, 4]$?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

Crítico $x = 3$: $f(3) = -4$. Pontas: $f(0) = 5$ e $f(4) = -3$. O maior é **5**, na ponta $x = 0$.
</details>

---

## Questão 07 · Bisseção · 10 pontos

Resolva $f(x) = \cos x - 2x = 0$ em $[0, 1]$ (calculadora em **radianos**).

**a)** Quanto vale $x_2$?

<details>
<summary>Ver resposta</summary>

**Número:** `0,375`

$f(0) = 1 > 0$.

| $k$ | $a$ | $b$ | $x_k$ | $f(x_k)$ |
| --- | --- | --- | ----- | -------- |
| 0 | 0 | 1 | 0,5 | $-0{,}122417$ |
| 1 | 0 | 0,5 | 0,25 | $+0{,}468912$ |
| 2 | 0,25 | 0,5 | **0,375** | $+0{,}180508$ |
</details>

**b)** Qual é a cota de erro de $x_2$?

<details>
<summary>Ver resposta</summary>

**Número:** `0,125`

$\dfrac{1}{2^3} = 0{,}125$.
</details>

**c)** Qual é o menor $k$ para erro $\leq 10^{-3}$?

<details>
<summary>Ver resposta</summary>

**Número:** `9`

$2^{k+1} \geq 1000 \Rightarrow k + 1 = 10 \Rightarrow k = 9$.
</details>

---

## Questão 08 · Método de Newton · 10 pontos

Resolva $f(x) = x^3 - 2x - 3 = 0$ por Newton, com $x_0 = 2$.

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `1,9`

$f(2) = 8 - 4 - 3 = 1$ e $f'(x) = 3x^2 - 2$, $f'(2) = 10$. $x_1 = 2 - \frac{1}{10} = 1{,}9$.
</details>

**b)** Quanto vale $x_2$? (4 casas ou mais.)

<details>
<summary>Ver resposta</summary>

**Número:** `1,893318 ± 0,00005`

$f(1{,}9) = 6{,}859 - 3{,}8 - 3 = 0{,}059$ e $f'(1{,}9) = 10{,}83 - 2 = 8{,}83$. $x_2 = 1{,}9 - \dfrac{0{,}059}{8{,}83} \approx 1{,}893318$.
</details>

---

## Questão 09 · Primitivas · 10 pontos

**a)** Calcule $\displaystyle\int \left(x^3 - \frac{4}{x^2}\right)dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `x^4/4 + 4/x + C`

$\int x^{-2} = -x^{-1}$, então $-4 \cdot (-x^{-1}) = \dfrac{4}{x}$.
</details>

**b)** Calcule $\displaystyle\int 3x^2 (x^3 + 1)^4\,dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `(x^3 + 1)^5/5 + C`

$u = x^3 + 1$, $du = 3x^2\,dx$: $\int u^4\,du = \dfrac{u^5}{5}$.
</details>

**c)** Calcule $\displaystyle\int \cos(4x)\,dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `sen(4x)/4 + C`

$u = 4x$, $dx = \frac{du}{4}$: $\dfrac{\operatorname{sen}(4x)}{4} + C$.
</details>

---

## Questão 10 · Integral definida · 10 pontos

**a)** Calcule $\displaystyle\int_0^{\pi} \operatorname{sen} x\,dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `2`

$\Big[-\cos x\Big]_0^{\pi} = 1 + 1 = 2$.
</details>

**b)** Calcule $\displaystyle\int_{-2}^{2} (x^3 + 3x^2)\,dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `16`

$x^3$ é ímpar (dá 0). $3x^2$ é par: $2\int_0^2 3x^2\,dx = 2 \cdot 8 = 16$.
</details>

**c)** Estime $\displaystyle\int_0^1 x^2\,dx$ com 2 retângulos e altura na ponta **direita**.

<details>
<summary>Ver resposta</summary>

**Número:** `0,625`

$\Delta x = 0{,}5$; alturas $f(0{,}5) = 0{,}25$ e $f(1) = 1$. Soma: $1{,}25 \cdot 0{,}5 = 0{,}625$ (o exato é $\frac{1}{3}$).
</details>
