# 🧮 Regras de derivação · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Regras de derivação](../../aulas/05-regras-de-derivacao.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**. O corretor aceita qualquer forma equivalente.

---

## Exercício 04: Regra da cadeia

Derive:

**a)** $y = (3 - 2x^2)^6$

<details>
<summary>Ver resposta</summary>

**Função:** `-24x (3 - 2x^2)^5`

Fora: $u^6 \to 6u^5$. Dentro: $3 - 2x^2 \to -4x$. Resultado: $6(3 - 2x^2)^5 \cdot (-4x)$.
</details>

**b)** $y = \sqrt{7 - 3x}$

<details>
<summary>Ver resposta</summary>

**Função:** `-3/(2√(7 - 3x))`

$(7 - 3x)^{1/2} \Rightarrow \frac{1}{2}(7 - 3x)^{-1/2} \cdot (-3) = -\dfrac{3}{2\sqrt{7 - 3x}}$.
</details>

**c)** $y = e^{\sqrt{3x}}$

<details>
<summary>Ver resposta</summary>

**Função:** `3e^(√(3x))/(2√(3x))`

Fora: $e^u \to e^u$. Dentro: $\sqrt{3x} = (3x)^{1/2} \to \frac{1}{2}(3x)^{-1/2} \cdot 3 = \dfrac{3}{2\sqrt{3x}}$. Resultado: $e^{\sqrt{3x}} \cdot \dfrac{3}{2\sqrt{3x}}$.
</details>

**d)** $y = (x^3 + 2)^{2/3}$

<details>
<summary>Ver resposta</summary>

**Função:** `2x^2 (x^3 + 2)^(-1/3)`

$\frac{2}{3}(x^3 + 2)^{-1/3} \cdot 3x^2 = 2x^2 (x^3 + 2)^{-1/3} = \dfrac{2x^2}{\sqrt[3]{x^3 + 2}}$.
</details>

---

## Exercício 05: Logaritmos

Derive (use as propriedades do logaritmo antes, quando ajudar):

**a)** $f(x) = \ln(4x - 1)$

<details>
<summary>Ver resposta</summary>

**Função:** `4/(4x - 1)`

$\dfrac{u'}{u}$ com $u = 4x - 1$.
</details>

**b)** $f(x) = \ln(x^2 + 9)$

<details>
<summary>Ver resposta</summary>

**Função:** `2x/(x^2 + 9)`

$\dfrac{u'}{u}$ com $u = x^2 + 9$.
</details>

**c)** $f(x) = \ln(x^3)$

<details>
<summary>Ver resposta</summary>

**Função:** `3/x`

Propriedade: $\ln(x^3) = 3\ln x$, então $f'(x) = \dfrac{3}{x}$.
</details>

**d)** $f(x) = \ln\left[(x + 2)^4 (x - 1)^3\right]$

<details>
<summary>Ver resposta</summary>

**Função:** `4/(x + 2) + 3/(x - 1)`

Abra com as propriedades: $f(x) = 4\ln(x + 2) + 3\ln(x - 1)$. Agora derive cada termo.
</details>

**e)** $f(x) = \ln\left(\dfrac{x}{x + 3}\right)$

<details>
<summary>Ver resposta</summary>

**Função:** `1/x - 1/(x + 3)`

$f(x) = \ln x - \ln(x + 3)$. Simplificando o resultado: $\dfrac{1}{x} - \dfrac{1}{x + 3} = \dfrac{3}{x(x + 3)}$.
</details>

---

## Exercício 06: Juntando regras

Derive:

**a)** $f(x) = x^2 e^{-2x}$

<details>
<summary>Ver resposta</summary>

**Função:** `e^(-2x) (2x - 2x^2)`

Produto, com cadeia em $e^{-2x}$ (derivada $-2e^{-2x}$): $2x\,e^{-2x} + x^2 \cdot (-2e^{-2x}) = e^{-2x}(2x - 2x^2)$.
</details>

**b)** $f(x) = \dfrac{e^x}{1 - x}$

<details>
<summary>Ver resposta</summary>

**Função:** `e^x (2 - x)/(1 - x)^2`

Quociente: $\dfrac{e^x(1 - x) - e^x \cdot (-1)}{(1 - x)^2} = \dfrac{e^x(1 - x + 1)}{(1 - x)^2} = \dfrac{e^x(2 - x)}{(1 - x)^2}$.
</details>

**c)** O custo de treinar um modelo por $t$ épocas é $C(t) = t\,e^{2t} - t^2$. Calcule $C'(t)$.

<details>
<summary>Ver resposta</summary>

**Função:** `e^(2t) (1 + 2t) - 2t`

Produto em $t\,e^{2t}$: $1 \cdot e^{2t} + t \cdot 2e^{2t} = e^{2t}(1 + 2t)$. E $(t^2)' = 2t$.
</details>
