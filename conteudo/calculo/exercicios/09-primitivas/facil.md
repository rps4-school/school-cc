# ↩️ Primitivas · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Primitivas](../../aulas/09-primitivas.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a primitiva **com o `+ C`** e clique em **Conferir** (qualquer resposta que difere da certa só por uma constante é aceita); no GitHub, abra **Ver resposta**. Sempre dá para conferir derivando.

---

## Exercício 01: Primitivas iniciais

Calcule:

**a)** $\displaystyle\int 5\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `5x + C`

A derivada de $5x$ é $5$.
</details>

**b)** $\displaystyle\int x^4\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `x^5/5 + C`

Soma 1 no expoente e divide pelo novo expoente: $\dfrac{x^5}{5}$.
</details>

**c)** $\displaystyle\int 8x^3\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `2x^4 + C`

$8 \cdot \dfrac{x^4}{4} = 2x^4$. Conferindo: $(2x^4)' = 8x^3$.
</details>

**d)** $\displaystyle\int e^x\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `e^x + C`

$e^x$ é a sua própria derivada, então também é a sua própria primitiva.
</details>

---

## Exercício 02: Soma e diferença

Calcule:

**a)** $\displaystyle\int (3x^2 - 4x + 1)\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `x^3 - 2x^2 + x + C`

Termo a termo: $3 \cdot \dfrac{x^3}{3} - 4 \cdot \dfrac{x^2}{2} + x$.
</details>

**b)** $\displaystyle\int (x^3 + 2x - 7)\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `x^4/4 + x^2 - 7x + C`

$\dfrac{x^4}{4} + x^2 - 7x + C$.
</details>

**c)** $\displaystyle\int (2e^x - 3\cos x)\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `2e^x - 3sen(x) + C`

$\int e^x = e^x$ e $\int \cos x = \operatorname{sen} x$.
</details>

---

## Exercício 03: Funções elementares

Calcule:

**a)** $\displaystyle\int \frac{4}{x}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `4 ln|x| + C`

$\int \frac{1}{x}\,dx = \ln \lvert x \rvert$. No corretor, `4ln(x)` também é aceito.
</details>

**b)** $\displaystyle\int \operatorname{sen} x\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `-cos(x) + C`

Porque $(-\cos x)' = \operatorname{sen} x$. O sinal de menos é o erro mais comum aqui.
</details>

**c)** $\displaystyle\int e^{3x}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `e^(3x)/3 + C`

Derivar $e^{3x}$ multiplica por 3; para desfazer, divida por 3.
</details>

**d)** $\displaystyle\int 2^x\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `2^x/ln(2) + C`

$(2^x)' = 2^x \ln 2$, então $\int 2^x\,dx = \dfrac{2^x}{\ln 2} + C$.
</details>
