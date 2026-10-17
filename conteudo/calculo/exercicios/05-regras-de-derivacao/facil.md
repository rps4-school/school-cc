# 🧮 Regras de derivação · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Regras de derivação](../../aulas/05-regras-de-derivacao.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**. O corretor aceita qualquer forma equivalente (simplificada ou não).

---

## Exercício 01: Potências

Derive:

**a)** $f(x) = 4x^5 - 3x^3 + 2x$

<details>
<summary>Ver resposta</summary>

**Função:** `20x^4 - 9x^2 + 2`

Termo a termo: $4 \cdot 5x^4 - 3 \cdot 3x^2 + 2$.
</details>

**b)** $f(x) = x^{1/4} + x^{-2}$

<details>
<summary>Ver resposta</summary>

**Função:** `(1/4)x^(-3/4) - 2x^(-3)`

"Desce e diminui um": $\frac{1}{4}x^{1/4 - 1} = \frac{1}{4}x^{-3/4}$ e $-2x^{-3}$.
</details>

**c)** $f(x) = \dfrac{2}{x^5}$

<details>
<summary>Ver resposta</summary>

**Função:** `-10/x^6`

$2x^{-5} \Rightarrow -10x^{-6} = -\dfrac{10}{x^6}$.
</details>

**d)** $f(x) = \sqrt{x} + 3x$

<details>
<summary>Ver resposta</summary>

**Função:** `1/(2√x) + 3`

$x^{1/2} \Rightarrow \frac{1}{2}x^{-1/2} = \dfrac{1}{2\sqrt{x}}$, e $3x \Rightarrow 3$.
</details>

---

## Exercício 02: Exponencial, logaritmo e trigonométricas

Derive:

**a)** $f(x) = 5e^x - 2\ln x$

<details>
<summary>Ver resposta</summary>

**Função:** `5e^x - 2/x`

$(e^x)' = e^x$ e $(\ln x)' = \frac{1}{x}$.
</details>

**b)** $f(x) = 3\operatorname{sen} x + 2\cos x$

<details>
<summary>Ver resposta</summary>

**Função:** `3cos(x) - 2sen(x)`

Seno vira cosseno; cosseno vira **menos** seno.
</details>

**c)** $f(x) = \log_3 x$

<details>
<summary>Ver resposta</summary>

**Função:** `1/(x ln 3)`

$(\log_a x)' = \dfrac{1}{x \ln a}$ com $a = 3$.
</details>

**d)** $f(x) = 4^x$

<details>
<summary>Ver resposta</summary>

**Função:** `4^x ln 4`

$(a^x)' = a^x \ln a$. Cuidado: não é $x \cdot 4^{x-1}$, que seria a regra da potência (base variável).
</details>

---

## Exercício 03: Produto e quociente

Derive:

**a)** $f(x) = e^x (x^2 - 3)$

<details>
<summary>Ver resposta</summary>

**Função:** `e^x (x^2 + 2x - 3)`

Produto: $e^x(x^2 - 3) + e^x \cdot 2x = e^x(x^2 + 2x - 3)$.
</details>

**b)** $f(x) = \dfrac{x^2 - 1}{x + 3}$

<details>
<summary>Ver resposta</summary>

**Função:** `(x^2 + 6x + 1)/(x + 3)^2`

Quociente: $\dfrac{2x(x + 3) - (x^2 - 1) \cdot 1}{(x + 3)^2} = \dfrac{2x^2 + 6x - x^2 + 1}{(x + 3)^2} = \dfrac{x^2 + 6x + 1}{(x + 3)^2}$.
</details>

**c)** $f(x) = x^2 \ln x$

<details>
<summary>Ver resposta</summary>

**Função:** `2x ln(x) + x`

Produto: $2x \ln x + x^2 \cdot \dfrac{1}{x} = 2x\ln x + x$.
</details>
