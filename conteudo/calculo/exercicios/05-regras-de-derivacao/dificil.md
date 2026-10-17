# 🧮 Regras de derivação · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Regras de derivação](../../aulas/05-regras-de-derivacao.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**. O corretor aceita qualquer forma equivalente.

---

## Exercício 07: Várias camadas

Derive:

**a)** $f(x) = (e^x + 3)^4$

<details>
<summary>Ver resposta</summary>

**Função:** `4(e^x + 3)^3 e^x`

Fora: $u^4 \to 4u^3$. Dentro: $e^x + 3 \to e^x$.
</details>

**b)** $f(x) = \cos(\operatorname{sen} x)$

<details>
<summary>Ver resposta</summary>

**Função:** `-sen(sen(x)) cos(x)`

Fora: $\cos u \to -\operatorname{sen} u$. Dentro: $\operatorname{sen} x \to \cos x$.
</details>

**c)** $f(x) = \ln(\ln(2x))$

<details>
<summary>Ver resposta</summary>

**Função:** `1/(x ln(2x))`

Camada de fora: $\dfrac{(\ln 2x)'}{\ln 2x}$. E $(\ln 2x)' = \dfrac{2}{2x} = \dfrac{1}{x}$. Resultado: $\dfrac{1}{x \ln(2x)}$.
</details>

**d)** $f(x) = \sqrt{\ln x}$

<details>
<summary>Ver resposta</summary>

**Função:** `1/(2x√(ln(x)))`

$(\ln x)^{1/2} \Rightarrow \dfrac{1}{2}(\ln x)^{-1/2} \cdot \dfrac{1}{x} = \dfrac{1}{2x\sqrt{\ln x}}$.
</details>

---

## Exercício 08: Valores e parâmetros

**a)** Calcule a derivada de $f(x) = \dfrac{x + 2}{e^{x^2 - 1}}$ no ponto $x = 1$.

<details>
<summary>Ver resposta</summary>

**Número:** `-5`

Reescreva sem fração: $f(x) = (x + 2)\,e^{1 - x^2}$. Produto e cadeia:

$$
f'(x) = e^{1 - x^2} + (x + 2)\,e^{1 - x^2}(-2x) = e^{1 - x^2}\bigl(1 - 2x(x + 2)\bigr)
$$

Em $x = 1$: $e^0 (1 - 6) = -5$.
</details>

**b)** Para $f(x) = \ln(x^2 + k)$, qual valor de $k$ faz $f'(1) = \frac{1}{2}$?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

$f'(x) = \dfrac{2x}{x^2 + k}$, então $\dfrac{2}{1 + k} = \dfrac{1}{2} \Rightarrow 1 + k = 4 \Rightarrow k = 3$.
</details>

**c)** Quanto vale a derivada de ordem 2026 de $\cos x$, calculada em $x = 0$?

<details>
<summary>Ver resposta</summary>

**Número:** `-1`

O ciclo tem 4 passos e $2026 = 4 \cdot 506 + 2$: resto **2**. $(\cos x)'' = -\cos x$, e $-\cos 0 = -1$.
</details>

**d)** Para $f(x) = x^6$, quanto vale $f^{(6)}(x)$?

<details>
<summary>Ver resposta</summary>

**Número:** `720`

$6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 6! = 720$. A derivada de ordem 7 já seria zero.
</details>

---

## Exercício 09: Funções de ativação

Redes neurais usam funções de ativação, e o treino precisa das suas derivadas.

**a)** Derive a sigmoide $\sigma(x) = \dfrac{1}{1 + e^{-x}}$.

<details>
<summary>Ver resposta</summary>

**Função:** `e^(-x)/(1 + e^(-x))^2`

$(1 + e^{-x})^{-1} \Rightarrow -(1 + e^{-x})^{-2} \cdot (-e^{-x}) = \dfrac{e^{-x}}{(1 + e^{-x})^2}$.
</details>

**b)** Sabendo que $\sigma'(x) = \sigma(x)(1 - \sigma(x))$, calcule $\sigma'(\ln 3)$.

<details>
<summary>Ver resposta</summary>

**Número:** `3/16`

$e^{-\ln 3} = \frac{1}{3}$, então $\sigma(\ln 3) = \dfrac{1}{1 + \frac{1}{3}} = \dfrac{3}{4}$. Logo $\sigma'(\ln 3) = \dfrac{3}{4} \cdot \dfrac{1}{4} = \dfrac{3}{16}$.
</details>

**c)** A ativação **softplus** é $s(x) = \ln(1 + e^x)$. Derive.

<details>
<summary>Ver resposta</summary>

**Função:** `e^x/(1 + e^x)`

$\dfrac{u'}{u}$ com $u = 1 + e^x$. Curiosidade: dividindo em cima e embaixo por $e^x$, dá $\dfrac{1}{e^{-x} + 1} = \sigma(x)$. A derivada da softplus é a sigmoide!
</details>

**d)** Quanto vale $s'(0)$?

<details>
<summary>Ver resposta</summary>

**Número:** `1/2`

$\dfrac{e^0}{1 + e^0} = \dfrac{1}{2}$.
</details>
