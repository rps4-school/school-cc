# 📝 Simulado 03 · Cálculo

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

> 💡 **Corrigindo no site:** cada item tem um campo para digitar a sua resposta e conferir na hora (vale fração, decimal, `π`, `e`, `√` e funções equivalentes). Use só na correção, depois do tempo. Itens abertos (de explicar) não têm campo: compare com a resposta esperada.

---

## Questão 01 · Funções · 10 pontos

**Índices de uma tabela.** Um sistema mapeia índices por $f\colon [2, \infty) \to [-3, \infty)$, com $f(x) = x^2 - 4x + 1$.

**a)** Escreva $f^{-1}(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `2 + √(x + 3)`

$f(x) = (x - 2)^2 - 3$. Então $(x - 2)^2 = y + 3 \Rightarrow x = 2 + \sqrt{y + 3}$ (raiz positiva, porque $x \geq 2$).
</details>

**b)** Qual índice gerou a saída $6$?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

$f^{-1}(6) = 2 + \sqrt{9} = 5$. Conferindo: $f(5) = 25 - 20 + 1 = 6$. ✔️
</details>

**c)** O custo de um algoritmo é $c(n) = 2n^2 + 3n$. Simplifique $\dfrac{c(n + h) - c(n)}{h}$.

<details>
<summary>Ver resposta</summary>

**Função:** `4n + 2h + 3`

$c(n + h) - c(n) = 4nh + 2h^2 + 3h$. Dividindo por $h$: $4n + 2h + 3$.
</details>

---

## Questão 02 · Limites · 10 pontos

**a)** Calcule $\displaystyle\lim_{x \to 2} \frac{x^3 - 8}{x^2 - 3x + 2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `12`

$\dfrac{(x - 2)(x^2 + 2x + 4)}{(x - 2)(x - 1)} = \dfrac{x^2 + 2x + 4}{x - 1} \to \dfrac{12}{1} = 12$.
</details>

**b)** Calcule $\displaystyle\lim_{x \to 7} \frac{\sqrt{x + 2} - 3}{x - 7}$.

<details>
<summary>Ver resposta</summary>

**Número:** `1/6`

Conjugado: $\dfrac{1}{\sqrt{x + 2} + 3} \to \dfrac{1}{6}$.
</details>

**c)** Seja $g(x) = ax^2 + 1$ para $x < 2$ e $g(x) = 3x - a$ para $x \geq 2$. Qual valor de $a$ faz o limite em $x = 2$ existir?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

Esquerda: $4a + 1$. Direita: $6 - a$. $4a + 1 = 6 - a \Rightarrow 5a = 5 \Rightarrow a = 1$.
</details>

---

## Questão 03 · Limites no infinito · 10 pontos

**a)** A taxa de acerto de uma cache é $T(n) = \dfrac{a n^2 + 4}{3n^2 + n}$ e tende a $0{,}5$. Encontre $a$.

<details>
<summary>Ver resposta</summary>

**Número:** `1,5`

Mesmo grau: $\frac{a}{3} = 0{,}5 \Rightarrow a = 1{,}5$.
</details>

**b)** Calcule $\displaystyle\lim_{x \to \infty} \frac{2x^3 + 1}{\sqrt{9x^6 + x}}$.

<details>
<summary>Ver resposta</summary>

**Número:** `2/3`

$\sqrt{9x^6} = 3x^3$ (para $x > 0$): "grau" 3. Resultado: $\frac{2}{3}$.
</details>

**c)** As máquinas infectadas, em milhares, seguem $P(t) = \dfrac{90t + 30}{t + 6}$. Para qual valor o número se estabiliza?

<details>
<summary>Ver resposta</summary>

**Número:** `90`

$\displaystyle\lim_{t \to \infty} P(t) = \frac{90}{1} = 90$ mil máquinas.
</details>

---

## Questão 04 · Derivada · 10 pontos

**a)** Pela definição, derive $f(x) = \dfrac{1}{2x + 1}$.

<details>
<summary>Ver resposta</summary>

**Função:** `-2/(2x + 1)^2`

$\dfrac{1}{2x + 2h + 1} - \dfrac{1}{2x + 1} = \dfrac{-2h}{(2x + 2h + 1)(2x + 1)}$. Dividindo por $h$ e fazendo $h \to 0$: $-\dfrac{2}{(2x + 1)^2}$.
</details>

**b)** $f(x) = \lvert x + 1 \rvert$ tem derivada em $x = -1$? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

Inclinação $-1$ à esquerda e $1$ à direita: bico.
</details>

**c)** Use a reta tangente de $\sqrt{x}$ em $x = 9$ para estimar $\sqrt{9{,}2}$. (4 casas.)

<details>
<summary>Ver resposta</summary>

**Número:** `3,033333 ± 0,0001`

$L(x) = 3 + \dfrac{1}{6}(x - 9)$, porque $f'(9) = \dfrac{1}{2 \cdot 3}$. $L(9{,}2) = 3 + \dfrac{0{,}2}{6} \approx 3{,}033333$ (o real é $3{,}033150$).
</details>

---

## Questão 05 · Regras de derivação · 10 pontos

**a)** Derive $f(x) = x^2 e^{-3x}$.

<details>
<summary>Ver resposta</summary>

**Função:** `e^(-3x) (2x - 3x^2)`

$2x\,e^{-3x} + x^2 \cdot (-3e^{-3x})$.
</details>

**b)** Derive $g(x) = \ln\left[(x - 1)^2 (x + 4)^3\right]$.

<details>
<summary>Ver resposta</summary>

**Função:** `2/(x - 1) + 3/(x + 4)`

$g(x) = 2\ln(x - 1) + 3\ln(x + 4)$.
</details>

**c)** Calcule $h'(1)$ para $h(x) = x\,e^{1 - x^2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

$h'(x) = e^{1 - x^2} + x \cdot e^{1 - x^2} \cdot (-2x) = e^{1 - x^2}(1 - 2x^2)$. Em $x = 1$: $1 \cdot (1 - 2) = -1$.
</details>

**d)** Para a sigmoide, calcule $\sigma'(\ln 2)$, usando $\sigma' = \sigma(1 - \sigma)$.

<details>
<summary>Ver resposta</summary>

**Número:** `2/9`

$\sigma(\ln 2) = \dfrac{1}{1 + \frac{1}{2}} = \dfrac{2}{3}$. Então $\sigma' = \dfrac{2}{3} \cdot \dfrac{1}{3} = \dfrac{2}{9}$.
</details>

---

## Questão 06 · Aplicações da derivada · 10 pontos

**a)** Com $300$ m de grade e um lado na parede, qual é a maior área retangular, em m²?

<details>
<summary>Ver resposta</summary>

**Número:** `11250`

$A(x) = x(300 - 2x)$; $A' = 300 - 4x = 0 \Rightarrow x = 75$. Lados $75$ e $150$: área $11\,250$ m².
</details>

**b)** O engajamento com uma notificação é $E(t) = \dfrac{10t}{(t + 4)^2}$. Qual é o engajamento máximo?

<details>
<summary>Ver resposta</summary>

**Número:** `5/8`

$E'(t) = \dfrac{10(4 - t)}{(t + 4)^3}$: positivo antes de 4, negativo depois. Máximo em $t = 4$: $E(4) = \dfrac{40}{64} = \dfrac{5}{8}$.
</details>

**c)** De uma placa de $24$ cm de lado, cortam-se quadrados de lado $x$ nos cantos para fazer uma caixa sem tampa. Qual é o volume máximo, em cm³?

<details>
<summary>Ver resposta</summary>

**Número:** `1024`

$V(x) = x(24 - 2x)^2$, $V'(x) = (24 - 2x)(24 - 6x) = 0 \Rightarrow x = 4$. $V(4) = 4 \cdot 16^2 = 1024$ cm³.
</details>

---

## Questão 07 · Bisseção · 10 pontos

Resolva $f(x) = x^3 - 2x^2 - 5 = 0$ em $[2, 3]$ com $\varepsilon = 10^{-2}$.

**a)** Qual é o menor $k$?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$2^{k+1} \geq 100 \Rightarrow k = 6$.
</details>

**b)** Quanto vale $x_6$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,695313 ± 0,0001`

$f(2) = -5$ e $f(3) = 4$.

| $k$ | $a$ | $b$ | $x_k$ | $f(x_k)$ |
| --- | --- | --- | ----- | -------- |
| 0 | 2 | 3 | 2,5 | $-1{,}875$ |
| 1 | 2,5 | 3 | 2,75 | $+0{,}671875$ |
| 2 | 2,5 | 2,75 | 2,625 | $-0{,}693359$ |
| 3 | 2,625 | 2,75 | 2,6875 | $-0{,}034424$ |
| 4 | 2,6875 | 2,75 | 2,71875 | $+0{,}312714$ |
| 5 | 2,6875 | 2,71875 | 2,703125 | $+0{,}137653$ |
| 6 | 2,6875 | 2,703125 | **2,6953125** | $+0{,}051243$ |
</details>

**c)** Qual é a cota de erro de $x_6$?

<details>
<summary>Ver resposta</summary>

**Número:** `1/128`

$\dfrac{1}{2^7} = \dfrac{1}{128} \approx 0{,}0078$.
</details>

---

## Questão 08 · Método de Newton · 10 pontos

Resolva $f(x) = e^x - 4x = 0$ por Newton, com $x_0 = 0$ e $\varepsilon = 10^{-4}$.

**a)** Quanto vale $x_1$?

<details>
<summary>Ver resposta</summary>

**Número:** `1/3`

$f(0) = 1$ e $f'(x) = e^x - 4$, $f'(0) = -3$. $x_1 = 0 - \dfrac{1}{-3} = \dfrac{1}{3}$.
</details>

**b)** Em qual iteração o critério de parada é atingido?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

| $k$ | $x_k$ | $\lvert x_k - x_{k-1} \rvert$ |
| --- | ----- | ----------------------------- |
| 1 | 0,333333 | 0,333333 |
| 2 | 0,357246 | 0,023913 |
| 3 | 0,357403 | 0,000156 |
| 4 | 0,357403 | 0,000000 |
</details>

**c)** Qual é a raiz?

<details>
<summary>Ver resposta</summary>

**Número:** `0,357403 ± 0,0001`

$x_4 \approx 0{,}357403$.
</details>

---

## Questão 09 · Primitivas · 10 pontos

**a)** Calcule $\displaystyle\int \frac{x}{x^2 + 4}\,dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `ln(x^2 + 4)/2 + C`

$u = x^2 + 4$, $x\,dx = \frac{du}{2}$: $\frac{1}{2}\ln(x^2 + 4) + C$.
</details>

**b)** Calcule $\displaystyle\int \frac{x + 2}{\sqrt{x}}\,dx$.

<details>
<summary>Ver resposta</summary>

**Primitiva:** `(2/3) x^(3/2) + 4√x + C`

$\dfrac{x + 2}{x^{1/2}} = x^{1/2} + 2x^{-1/2}$. Primitiva: $\frac{2}{3}x^{3/2} + 4x^{1/2} + C$.
</details>

**c)** Um robô tem $v(t) = 6t^2 - 4t + 1$ m/s e $s(0) = 3$ m. Onde ele está em $t = 2$?

<details>
<summary>Ver resposta</summary>

**Número:** `13`

$s(t) = 2t^3 - 2t^2 + t + 3$. $s(2) = 16 - 8 + 2 + 3 = 13$ m.
</details>

---

## Questão 10 · Integral definida · 10 pontos

**a)** Calcule a área entre $y = x^2 - 4$ e $y = 2x - 1$.

<details>
<summary>Ver resposta</summary>

**Número:** `32/3`

Cruzamentos: $x^2 - 4 = 2x - 1 \Rightarrow x^2 - 2x - 3 = 0 \Rightarrow x = -1$ ou $x = 3$. A reta fica em cima (em $x = 0$: $-1 > -4$).

$$
\int_{-1}^{3} (-x^2 + 2x + 3)\,dx = \left[-\frac{x^3}{3} + x^2 + 3x\right]_{-1}^{3} = 9 - \left(-\frac{5}{3}\right) = \frac{32}{3}
$$
</details>

**b)** Calcule $\displaystyle\int_0^1 x\,e^{x^2}\,dx$.

<details>
<summary>Ver resposta</summary>

**Número:** `(e - 1)/2`

$u = x^2$ (de 0 a 1), $x\,dx = \frac{du}{2}$: $\frac{1}{2}\int_0^1 e^u\,du = \dfrac{e - 1}{2} \approx 0{,}8591$.
</details>

**c)** Um download começa a $120$ MB/s e cai como $v(t) = 120\,e^{-0{,}6t}$. Quanto será baixado no total?

<details>
<summary>Ver resposta</summary>

**Número:** `200`

$\displaystyle\int_0^{\infty} 120\,e^{-0{,}6t}\,dt = \frac{120}{0{,}6} = 200$ MB.
</details>
