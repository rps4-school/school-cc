# ↩️ Primitivas · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Primitivas](../../aulas/09-primitivas.md)

Resolva no papel primeiro. No site, digite a primitiva **com o `+ C`** e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Regra da substituição

Calcule:

**a)** $\displaystyle\int (x^2 + 3)^4 \cdot 2x\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `(x^2 + 3)^5/5 + C`

$u = x^2 + 3$, $du = 2x\,dx$: $\int u^4\,du = \dfrac{u^5}{5} + C$.
</details>

**b)** $\displaystyle\int x^2 (x^3 - 1)^5\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `(x^3 - 1)^6/18 + C`

$u = x^3 - 1$, $du = 3x^2\,dx$, então $x^2\,dx = \frac{1}{3}du$:

$$
\int u^5 \cdot \frac{1}{3}\,du = \frac{1}{3} \cdot \frac{u^6}{6} + C = \frac{(x^3 - 1)^6}{18} + C
$$
</details>

**c)** $\displaystyle\int 3\operatorname{sen}(3x + 1)\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `-cos(3x + 1) + C`

$u = 3x + 1$, $du = 3\,dx$: $\int \operatorname{sen} u\,du = -\cos u + C$.
</details>

**d)** $\displaystyle\int x\,e^{x^2}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `e^(x^2)/2 + C`

$u = x^2$, $du = 2x\,dx$, então $x\,dx = \frac{1}{2}du$: $\frac{1}{2}\int e^u\,du = \dfrac{e^{x^2}}{2} + C$.
</details>

---

## Exercício 08: Substituições menos óbvias

Calcule:

**a)** $\displaystyle\int \frac{2x}{x^2 + 5}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `ln(x^2 + 5) + C`

$u = x^2 + 5$, $du = 2x\,dx$: $\int \frac{du}{u} = \ln \lvert u \rvert$. Como $x^2 + 5 > 0$, nem precisa do módulo.
</details>

**b)** $\displaystyle\int \frac{x}{\sqrt{x^2 + 1}}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `√(x^2 + 1) + C`

$u = x^2 + 1$, $x\,dx = \frac{1}{2}du$: $\frac{1}{2}\int u^{-1/2}\,du = \frac{1}{2} \cdot 2u^{1/2} = \sqrt{x^2 + 1} + C$.
</details>

**c)** $\displaystyle\int \operatorname{tg} x\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `-ln|cos(x)| + C`

$\operatorname{tg} x = \dfrac{\operatorname{sen} x}{\cos x}$. Com $u = \cos x$, $du = -\operatorname{sen} x\,dx$: $\int \dfrac{-du}{u} = -\ln \lvert u \rvert = -\ln \lvert \cos x \rvert + C$, que é o mesmo que $\ln \lvert \sec x \rvert + C$.
</details>

**d)** $\displaystyle\int \cos x \cdot \operatorname{sen}^4 x\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `sen(x)^5/5 + C`

$u = \operatorname{sen} x$, $du = \cos x\,dx$: $\int u^4\,du = \dfrac{\operatorname{sen}^5 x}{5} + C$. No corretor, vale `sen^5(x)/5 + C` ou `sen(x)^5/5 + C`.
</details>

---

## Exercício 09: Do ritmo para o total

**a)** Um servidor recebe requisições num ritmo de $r(t) = 30 + 12\sqrt{t}$ por minuto. Escreva o total $N(t)$ de requisições recebidas até o minuto $t$, sabendo que $N(0) = 0$.

<details>
<summary>Ver resposta</summary>

**Função:** `30t + 8t^(3/2)`

$N(t) = \int (30 + 12t^{1/2})\,dt = 30t + 12 \cdot \dfrac{t^{3/2}}{3/2} + C = 30t + 8t^{3/2} + C$, e $N(0) = 0$ dá $C = 0$.
</details>

**b)** Quantas requisições chegaram nos 4 primeiros minutos?

<details>
<summary>Ver resposta</summary>

**Número:** `184`

$N(4) = 120 + 8 \cdot 4^{3/2} = 120 + 8 \cdot 8 = 184$.
</details>

**c)** O custo marginal de produzir $x$ licenças é $C'(x) = 0{,}03x^2 - 1{,}2x + 20$, e o custo fixo é $C(0) = 500$. Escreva $C(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `0,01x^3 - 0,6x^2 + 20x + 500`

$C(x) = 0{,}03 \cdot \dfrac{x^3}{3} - 1{,}2 \cdot \dfrac{x^2}{2} + 20x + K = 0{,}01x^3 - 0{,}6x^2 + 20x + K$, e $C(0) = K = 500$.
</details>

**d)** Quanto custam 10 licenças?

<details>
<summary>Ver resposta</summary>

**Número:** `650`

$C(10) = 10 - 60 + 200 + 500 = 650$.
</details>
