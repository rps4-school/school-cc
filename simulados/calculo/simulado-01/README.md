# 📝 Simulado 01 · Cálculo

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

**Codificador.** Um sistema codifica números com $f(x) = \dfrac{3x + 2}{x - 4}$.

**a)** Calcule $f(2)$.

<details>
<summary>Ver resposta</summary>

**Número:** `-4`

$f(2) = \dfrac{6 + 2}{2 - 4} = \dfrac{8}{-2} = -4$.
</details>

**b)** Qual é o único número real fora do domínio de $f$?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

O denominador zera em $x = 4$.
</details>

**c)** Escreva $f^{-1}(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `(4x + 2)/(x - 3)`

$y(x - 4) = 3x + 2 \Rightarrow yx - 3x = 4y + 2 \Rightarrow x(y - 3) = 4y + 2 \Rightarrow x = \dfrac{4y + 2}{y - 3}$. Logo $f^{-1}(x) = \dfrac{4x + 2}{x - 3}$.
</details>

---

## Questão 02 · Limites · 10 pontos

**a)** Calcule $\displaystyle\lim_{x \to 3} \frac{x^2 - x - 6}{x - 3}$.

<details>
<summary>Ver resposta</summary>

**Número:** `5`

$\frac{0}{0}$. $x^2 - x - 6 = (x - 3)(x + 2)$. Cancelando: $x + 2 \to 5$.
</details>

**b)** Calcule $\displaystyle\lim_{x \to 1} \frac{\sqrt{x + 3} - 2}{x - 1}$.

<details>
<summary>Ver resposta</summary>

**Número:** `1/4`

Conjugado: $\dfrac{x + 3 - 4}{(x - 1)(\sqrt{x + 3} + 2)} = \dfrac{1}{\sqrt{x + 3} + 2} \to \dfrac{1}{4}$.
</details>

**c)** Seja $f(x) = 2x + 3$ para $x < 1$ e $f(x) = x^2 + 4$ para $x \geq 1$. Quanto vale $\displaystyle\lim_{x \to 1} f(x)$? (Se não existir, escreva **não existe**.)

<details>
<summary>Ver resposta</summary>

**Número:** `5`

Esquerda: $2 + 3 = 5$. Direita: $1 + 4 = 5$. Iguais: o limite é **5**.
</details>

---

## Questão 03 · Limites no infinito · 10 pontos

**a)** Calcule $\displaystyle\lim_{n \to \infty} \frac{6n^2 - n}{2n^2 + 9}$.

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Mesmo grau: $\frac{6}{2} = 3$.
</details>

**b)** Calcule $\displaystyle\lim_{n \to \infty} \frac{7n + 2}{2n^2 - n}$.

<details>
<summary>Ver resposta</summary>

**Número:** `0`

Grau de cima (1) menor que o de baixo (2).
</details>

**c)** Com $n$ servidores, a latência é $L(n) = 20 + \dfrac{300}{n}$ ms. Qual é a latência mínima de que o sistema se aproxima?

<details>
<summary>Ver resposta</summary>

**Número:** `20`

$\displaystyle\lim_{n \to \infty} L(n) = 20 + 0 = 20$ ms.
</details>

---

## Questão 04 · Derivada · 10 pontos

**a)** Usando a definição $f'(x) = \displaystyle\lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$, derive $f(x) = x^2 + 5x$.

<details>
<summary>Ver resposta</summary>

**Função:** `2x + 5`

$\dfrac{(x + h)^2 + 5(x + h) - x^2 - 5x}{h} = \dfrac{2xh + h^2 + 5h}{h} = 2x + h + 5 \to 2x + 5$.
</details>

**b)** Escreva a reta tangente ao gráfico de $f$ no ponto de abscissa $x_0 = 1$.

<details>
<summary>Ver resposta</summary>

**Função:** `7x - 1`

$f(1) = 6$ e $f'(1) = 7$. Reta: $y - 6 = 7(x - 1) \Rightarrow y = 7x - 1$.
</details>

---

## Questão 05 · Regras de derivação · 10 pontos

Derive:

**a)** $f(x) = x^3 e^x$

<details>
<summary>Ver resposta</summary>

**Função:** `e^x (x^3 + 3x^2)`

Produto: $3x^2 e^x + x^3 e^x$.
</details>

**b)** $g(x) = \ln(x^2 + 4)$

<details>
<summary>Ver resposta</summary>

**Função:** `2x/(x^2 + 4)`

$\dfrac{u'}{u}$ com $u = x^2 + 4$.
</details>

**c)** $h(x) = \dfrac{2x + 1}{x - 3}$

<details>
<summary>Ver resposta</summary>

**Função:** `-7/(x - 3)^2`

$\dfrac{2(x - 3) - (2x + 1)}{(x - 3)^2} = \dfrac{-7}{(x - 3)^2}$.
</details>

---

## Questão 06 · Aplicações da derivada · 10 pontos

**Carga de CPU.** Num modelo, a carga de um servidor segue $f(x) = x^3 - 3x^2 - 9x + 2$.

**a)** Em qual $x$ está o máximo local?

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

$f'(x) = 3x^2 - 6x - 9 = 3(x - 3)(x + 1)$. O sinal vai de $+$ para $-$ em $x = -1$: máximo local, com $f(-1) = 7$.
</details>

**b)** Qual é o valor do mínimo local?

<details>
<summary>Ver resposta</summary>

**Número:** `-25`

Em $x = 3$ (sinal de $-$ para $+$): $f(3) = 27 - 27 - 27 + 2 = -25$.
</details>

**c)** Em qual $x$ está o ponto de inflexão?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$f''(x) = 6x - 6 = 0 \Rightarrow x = 1$, e o sinal troca ali.
</details>

---

## Questão 07 · Bisseção · 10 pontos

O equilíbrio de um balanceador satisfaz $f(x) = x^3 + x - 3 = 0$, com raiz em $[1, 2]$.

**a)** Quanto vale $x_2$ da bisseção (a contagem começa em $x_0$)?

<details>
<summary>Ver resposta</summary>

**Número:** `1,125`

| $k$ | $a$ | $b$ | $x_k$ | $f(x_k)$ |
| --- | --- | --- | ----- | -------- |
| 0 | 1 | 2 | 1,5 | $+1{,}875$ |
| 1 | 1 | 1,5 | 1,25 | $+0{,}203125$ |
| 2 | 1 | 1,25 | **1,125** | $-0{,}451172$ |

Com $f(1) = -1 < 0$: cada $f(x_k)$ positivo troca o $b$.
</details>

**b)** Qual é a cota de erro de $x_2$?

<details>
<summary>Ver resposta</summary>

**Número:** `0,125`

$\dfrac{2 - 1}{2^3} = 0{,}125$.
</details>

**c)** Qual é o menor $k$ que garante erro $\leq 0{,}01$?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$2^{k+1} \geq 100 \Rightarrow k + 1 = 7 \Rightarrow k = 6$.
</details>

---

## Questão 08 · Método de Newton · 10 pontos

Calcule $\sqrt{11}$ resolvendo $f(x) = x^2 - 11 = 0$ por Newton, com $x_0 = 3$.

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `10/3`

$x_1 = 3 - \dfrac{9 - 11}{6} = 3 + \dfrac{1}{3} = \dfrac{10}{3} \approx 3{,}333333$.
</details>

**b)** Quanto vale $x_2$? (4 casas ou mais.)

<details>
<summary>Ver resposta</summary>

**Número:** `3,316667 ± 0,0001`

$f(x_1) = 11{,}111111 - 11 = 0{,}111111$ e $f'(x_1) = 6{,}666667$. $x_2 = 3{,}333333 - 0{,}016667 = 3{,}316667$. O real é $\sqrt{11} \approx 3{,}316625$.
</details>

---

## Questão 09 · Primitivas · 10 pontos

**a)** Calcule $\displaystyle\int (6x^2 - 4x + 3)\,dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `2x^3 - 2x^2 + 3x + C`

Termo a termo, com um único $+\,C$.
</details>

**b)** Calcule $\displaystyle\int \left(\frac{2}{x} + e^x\right)dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `2ln|x| + e^x + C`

$\int \frac{1}{x} = \ln \lvert x \rvert$ e $\int e^x = e^x$.
</details>

**c)** Ache $F$ com $F'(x) = 4x^3$ e $F(1) = 3$.

<details>
<summary>Ver resposta</summary>

**Função:** `x^4 + 2`

$F(x) = x^4 + C$ e $F(1) = 1 + C = 3 \Rightarrow C = 2$.
</details>

---

## Questão 10 · Integral definida · 10 pontos

**a)** Calcule $\displaystyle\int_0^3 (x^2 + 1)\,dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `12`

$\left[\dfrac{x^3}{3} + x\right]_0^3 = 9 + 3 = 12$.
</details>

**b)** Calcule a área entre $y = 2x$ e $y = x^2$.

<details>
<summary>Ver resposta</summary>

**Número:** `4/3`

Cruzam em $x^2 = 2x \Rightarrow x = 0$ ou $x = 2$. Em $[0, 2]$ a reta está em cima: $\int_0^2 (2x - x^2)\,dx = 4 - \frac{8}{3} = \frac{4}{3}$.
</details>

**c)** Calcule $\displaystyle\int_1^{\infty} \frac{2}{x^3}\,dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$\left[-\dfrac{1}{x^2}\right]_1^t = 1 - \dfrac{1}{t^2} \to 1$.
</details>
