# 📝 Simulado 04 · Cálculo

> [← voltar para Simulados](../../README.md)

**Nível:** 🔴 Avançado

**Duração sugerida:** 1h30 · **Pontuação:** 100 pontos · **Assuntos:** todos (aulas 1 a 10)

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

**a)** Escreva a inversa de $g(x) = \dfrac{5x - 1}{2x + 3}$.

<details>
<summary>Ver resposta</summary>

**Função:** `(3x + 1)/(5 - 2x)`

$y(2x + 3) = 5x - 1 \Rightarrow 2yx - 5x = -1 - 3y \Rightarrow x(2y - 5) = -(3y + 1) \Rightarrow x = \dfrac{3y + 1}{5 - 2y}$.
</details>

**b)** A função $h(x) = \dfrac{\sqrt{x - 1}}{x^2 - 9}$ aceita todo $x \geq 1$, menos um. Qual?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

O denominador zera em $\pm 3$, mas só o $3$ está em $x \geq 1$.
</details>

**c)** Num teste de carga, $T(t) = 25 + 4t$ (°C) e a frequência é $f(T) = 3{,}9 - 0{,}03\,T$ (GHz). Em quantos minutos a frequência chega a $2{,}55$ GHz?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

$f(T(t)) = 3{,}9 - 0{,}03(25 + 4t) = 3{,}15 - 0{,}12t$. Igualando a $2{,}55$: $0{,}12t = 0{,}6 \Rightarrow t = 5$ minutos.
</details>

---

## Questão 02 · Limites · 10 pontos

Use `∞`, `-∞` ou **não existe** quando for o caso.

**a)** Calcule $\displaystyle\lim_{x \to -1} \frac{x^3 + 1}{x^2 - 1}$.

<details>
<summary>Ver resposta</summary>

**Número:** `-3/2`

Soma de cubos: $\dfrac{(x + 1)(x^2 - x + 1)}{(x - 1)(x + 1)} = \dfrac{x^2 - x + 1}{x - 1} \to \dfrac{3}{-2}$.
</details>

**b)** Calcule $\displaystyle\lim_{h \to 0} \frac{(2 + h)^4 - 16}{h}$.

<details>
<summary>Ver resposta</summary>

**Número:** `32`

É a derivada de $x^4$ em $x = 2$: $4 \cdot 2^3 = 32$. Expandindo: $(2 + h)^4 - 16 = 32h + 24h^2 + 8h^3 + h^4$.
</details>

**c)** Calcule $\displaystyle\lim_{x \to 2^-} \frac{x}{x - 2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `-∞`

Com $x$ um pouco menor que 2: numerador $\approx 2 > 0$ e denominador negativo e pequeno. O quociente vai a $-\infty$.
</details>

---

## Questão 03 · Limites no infinito · 10 pontos

**a)** Calcule $\displaystyle\lim_{x \to -\infty} \frac{\sqrt{4x^2 + x}}{3x + 2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `-2/3`

$\sqrt{4x^2 + x} \sim 2\lvert x \rvert = -2x$ para $x < 0$. Então $\dfrac{-2x}{3x} = -\dfrac{2}{3}$.
</details>

**b)** Seja $f(x) = \dfrac{2x^2 - 8}{x^2 - x - 2}$. Qual é a assíntota vertical? Responda o valor de $x$.

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

$f(x) = \dfrac{2(x - 2)(x + 2)}{(x - 2)(x + 1)}$. O $(x - 2)$ cancela (buraco em $x = 2$); sobra $x = -1$.
</details>

**c)** Qual é a assíntota horizontal dessa $f$? Responda o valor de $y$.

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Mesmo grau: $\frac{2}{1} = 2$.
</details>

---

## Questão 04 · Derivada · 10 pontos

**a)** Pela definição, calcule $f'(16)$ para $f(x) = \sqrt{x}$.

<details>
<summary>Ver resposta</summary>

**Número:** `1/8`

$\displaystyle\lim_{x \to 16} \frac{\sqrt{x} - 4}{x - 16} = \lim_{x \to 16} \frac{1}{\sqrt{x} + 4} = \frac{1}{8}$.
</details>

**b)** Escreva a reta tangente a $y = \dfrac{1}{x}$ em $x_0 = 2$.

<details>
<summary>Ver resposta</summary>

**Função:** `1 - x/4`

Ponto $\left(2, \frac{1}{2}\right)$, inclinação $-\frac{1}{x^2} = -\frac{1}{4}$. $y - \frac{1}{2} = -\frac{1}{4}(x - 2) \Rightarrow y = 1 - \frac{x}{4}$.
</details>

**c)** Para $y = 2x^3 - 3x^2 - 12x + 7$, qual é o **maior** $x$ com tangente horizontal?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

$y' = 6x^2 - 6x - 12 = 6(x - 2)(x + 1)$: zera em $-1$ e $2$.
</details>

---

## Questão 05 · Regras de derivação · 10 pontos

**a)** Derive $f(x) = \cos(x^2)$.

<details>
<summary>Ver resposta</summary>

**Função:** `-2x sen(x^2)`

Cadeia: $-\operatorname{sen}(x^2) \cdot 2x$.
</details>

**b)** Derive $g(x) = (x^2 + 1)^3 (2x - 1)$.

<details>
<summary>Ver resposta</summary>

**Função:** `6x (x^2 + 1)^2 (2x - 1) + 2(x^2 + 1)^3`

Produto, com cadeia no primeiro fator: $3(x^2 + 1)^2 \cdot 2x \cdot (2x - 1) + (x^2 + 1)^3 \cdot 2$.
</details>

**c)** Derive $h(x) = \ln(\ln x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `1/(x ln(x))`

$\dfrac{(\ln x)'}{\ln x} = \dfrac{1/x}{\ln x}$.
</details>

**d)** Quanto vale a derivada de ordem 2027 de $\operatorname{sen} x$ em $x = 0$?

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

$2027 = 4 \cdot 506 + 3$: resto 3, então $-\cos x$. Em $0$: $-1$.
</details>

---

## Questão 06 · Aplicações da derivada · 10 pontos

**a)** Qual é o máximo absoluto de $f(x) = x^3 - 3x^2 + 1$ em $[-1, 3]$?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$f'(x) = 3x^2 - 6x = 3x(x - 2)$: críticos $0$ e $2$.

| $x$ | $-1$ | $0$ | $2$ | $3$ |
| --- | ---- | --- | --- | --- |
| $f(x)$ | $-3$ | $1$ | $-3$ | $1$ |

O máximo é **1** (em $x = 0$ e em $x = 3$, empatados).
</details>

**b)** E o mínimo absoluto?

<details>
<summary>Ver resposta</summary>

**Número:** `-3`

Pela tabela: **$-3$**, em $x = -1$ e em $x = 2$.
</details>

**c)** Para $g(x) = x^4 - 4x^3$, qual é o valor do mínimo local?

<details>
<summary>Ver resposta</summary>

**Número:** `-27`

$g'(x) = 4x^3 - 12x^2 = 4x^2(x - 3)$: críticos $0$ e $3$. $g''(x) = 12x^2 - 24x$; $g''(3) = 36 > 0$: mínimo, com $g(3) = 81 - 108 = -27$.
</details>

**d)** Em $x = 0$, $g''(0) = 0$. A função $g$ tem extremo local (máximo ou mínimo) em $x = 0$? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | não tem | nenhum | nenhum dos dois`

O teste da 2ª derivada não decide. Pela 1ª derivada: $g'(x) = 4x^2(x - 3) < 0$ dos dois lados de $0$ (perto dele). A função só desce: não há extremo em $x = 0$.
</details>

---

## Questão 07 · Bisseção · 10 pontos

O algoritmo A faz $30\,n\ln n$ operações e o B faz $n^2$. O ponto de virada satisfaz $f(n) = n - 30\ln n = 0$.

**a)** $f(100) \approx -38{,}16$. Quanto vale $f(200)$? (2 casas.)

<details>
<summary>Ver resposta</summary>

**Número:** `41,05 ± 0,005`

$200 - 30\ln 200 \approx 200 - 158{,}95 = 41{,}05$. Há troca de sinal em $[100, 200]$.
</details>

**b)** Com $\varepsilon = 1$, quanto vale o $x_k$ final da bisseção em $[100, 200]$?

<details>
<summary>Ver resposta</summary>

**Número:** `150,78125 ± 0,01`

Menor $k$: $\frac{100}{2^{k+1}} \leq 1 \Rightarrow k = 6$.

| $k$ | $a$ | $b$ | $x_k$ | $f(x_k)$ |
| --- | --- | --- | ----- | -------- |
| 0 | 100 | 200 | 150 | $-0{,}32$ |
| 1 | 150 | 200 | 175 | $+20{,}06$ |
| 2 | 150 | 175 | 162,5 | $+9{,}78$ |
| 3 | 150 | 162,5 | 156,25 | $+4{,}71$ |
| 4 | 150 | 156,25 | 153,125 | $+2{,}19$ |
| 5 | 150 | 153,125 | 151,5625 | $+0{,}93$ |
| 6 | 150 | 151,5625 | **150,78125** | $+0{,}31$ |
</details>

**c)** Para $n \geq 2$, a partir de qual $n$ inteiro o algoritmo A passa a ser mais rápido?

<details>
<summary>Ver resposta</summary>

**Número:** `151`

$f(150) \approx -0{,}32 < 0$ (B ainda ganha) e $f(151) \approx 0{,}48 > 0$ (A ganha). Em $n = 1$, A também ganha ($\ln 1 = 0$): por isso a condição $n \geq 2$.
</details>

---

## Questão 08 · Método de Newton · 10 pontos

**a)** Pelo método de Herão para $\sqrt{30}$ com $x_0 = 5$, quanto vale $x_2$? (4 casas.)

<details>
<summary>Ver resposta</summary>

**Número:** `5,477273 ± 0,0001`

$x_1 = \frac{1}{2}(5 + 6) = 5{,}5$. $x_2 = \frac{1}{2}\left(5{,}5 + \frac{30}{5{,}5}\right) = \frac{5{,}5 + 5{,}454545}{2} = 5{,}477273$.
</details>

**b)** Por que Newton não pode começar em $x_0 = 1$ para $f(x) = x^3 - 3x$? Quanto vale $f'(1)$?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

$f'(x) = 3x^2 - 3$, então $f'(1) = 0$: tangente horizontal, divisão por zero.
</details>

**c)** Resolva $\cos x = x^2$ por Newton com $x_0 = 1$ e $\varepsilon = 10^{-3}$ (radianos).

<details>
<summary>Ver resposta</summary>

**Número:** `0,824132 ± 0,0001`

$f(x) = \cos x - x^2$, $f'(x) = -\operatorname{sen} x - 2x$.

| $k$ | $x_k$ | $\lvert x_k - x_{k-1} \rvert$ |
| --- | ----- | ----------------------------- |
| 1 | 0,838218 | 0,161782 |
| 2 | 0,824242 | 0,013977 |
| 3 | 0,824132 | 0,000110 |
</details>

---

## Questão 09 · Primitivas · 10 pontos

**a)** Calcule $\displaystyle\int \operatorname{sen} x \cos x\,dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `sen(x)^2/2 + C`

$u = \operatorname{sen} x$, $du = \cos x\,dx$: $\int u\,du = \frac{u^2}{2}$. (Com $u = \cos x$ sai $-\frac{\cos^2 x}{2} + C$, que difere só por uma constante. As duas estão certas.)
</details>

**b)** Calcule $\displaystyle\int \frac{e^{2x}}{1 + e^{2x}}\,dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `ln(1 + e^(2x))/2 + C`

$u = 1 + e^{2x}$, $du = 2e^{2x}\,dx$: $\frac{1}{2}\int \frac{du}{u} = \frac{1}{2}\ln(1 + e^{2x}) + C$.
</details>

**c)** Calcule $\displaystyle\int (3x - 2)^5\,dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `(3x - 2)^6/18 + C`

$u = 3x - 2$, $dx = \frac{du}{3}$: $\frac{1}{3} \cdot \frac{u^6}{6}$.
</details>

**d)** O custo marginal é $C'(x) = 0{,}06x^2 + 10$ e o custo fixo é $C(0) = 200$. Quanto custam $10$ unidades?

<details>
<summary>Ver resposta</summary>

**Número:** `320`

$C(x) = 0{,}02x^3 + 10x + 200$. $C(10) = 20 + 100 + 200 = 320$.
</details>

---

## Questão 10 · Integral definida · 10 pontos

**a)** Calcule $\displaystyle\int_1^4 \left(\sqrt{x} + \frac{1}{x}\right)dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `14/3 + ln 4`

$\left[\frac{2}{3}x^{3/2} + \ln x\right]_1^4 = \frac{2}{3}(8 - 1) + \ln 4 = \frac{14}{3} + \ln 4 \approx 6{,}0530$.
</details>

**b)** Calcule a **área** entre $y = x^3 - x$ e o eixo $x$, em $[-1, 1]$.

<details>
<summary>Ver resposta</summary>

**Número:** `1/2`

A integral daria 0 (função ímpar). Mas $x^3 - x \geq 0$ em $[-1, 0]$ e $\leq 0$ em $[0, 1]$. Cada pedaço tem área $\int_0^1 (x - x^3)\,dx = \frac{1}{4}$. Total: $\frac{1}{2}$.
</details>

**c)** Calcule $\displaystyle\int_0^{\sqrt{\pi}} x\operatorname{sen}(x^2)\,dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$u = x^2$ (de $0$ a $\pi$), $x\,dx = \frac{du}{2}$: $\frac{1}{2}\int_0^{\pi} \operatorname{sen} u\,du = \frac{1}{2} \cdot 2 = 1$.
</details>
