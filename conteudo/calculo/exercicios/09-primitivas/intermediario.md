# ↩️ Primitivas · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Primitivas](../../aulas/09-primitivas.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a primitiva **com o `+ C`** e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Escreva como potência

Calcule:

**a)** $\displaystyle\int \frac{1}{x^4}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `-1/(3x^3) + C`

$x^{-4} \Rightarrow \dfrac{x^{-3}}{-3} = -\dfrac{1}{3x^3}$.
</details>

**b)** $\displaystyle\int \sqrt[3]{x}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `(3/4) x^(4/3) + C`

$x^{1/3} \Rightarrow \dfrac{x^{4/3}}{4/3} = \dfrac{3}{4}x^{4/3}$.
</details>

**c)** $\displaystyle\int \frac{3}{\sqrt{x}}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `6√x + C`

$3x^{-1/2} \Rightarrow 3 \cdot \dfrac{x^{1/2}}{1/2} = 6x^{1/2} = 6\sqrt{x}$.
</details>

**d)** $\displaystyle\int x\sqrt{x}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `(2/5) x^(5/2) + C`

$x \cdot x^{1/2} = x^{3/2} \Rightarrow \dfrac{x^{5/2}}{5/2} = \dfrac{2}{5}x^{5/2}$.
</details>

---

## Exercício 05: Simplifique antes

Não existe "regra do produto" nem "do quociente" para primitivas: arrume a função antes. Calcule:

**a)** $\displaystyle\int \frac{x^3 - 2x}{x}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `x^3/3 - 2x + C`

Divida cada termo por $x$: $\int (x^2 - 2)\,dx = \dfrac{x^3}{3} - 2x + C$.
</details>

**b)** $\displaystyle\int (x - 1)^2\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `x^3/3 - x^2 + x + C`

Expanda: $(x - 1)^2 = x^2 - 2x + 1$. Primitiva: $\dfrac{x^3}{3} - x^2 + x + C$. (Também vale $\frac{(x - 1)^3}{3} + C$: difere só por uma constante.)
</details>

**c)** $\displaystyle\int \frac{x^2 + \sqrt{x}}{x}\,dx$

<details>
<summary>Ver resposta</summary>

**Primitiva:** `x^2/2 + 2√x + C`

$\dfrac{x^2}{x} + \dfrac{x^{1/2}}{x} = x + x^{-1/2}$. Primitiva: $\dfrac{x^2}{2} + 2x^{1/2} + C$.
</details>

---

## Exercício 06: Achando o C

Agora o problema dá um valor da função, e o $C$ vira um número. Responda **sem** o $+\,C$.

**a)** Um robô tem velocidade $v(t) = 3t^2 + 4t$ m/s e está em $s(0) = 2$ m. Escreva $s(t)$.

<details>
<summary>Ver resposta</summary>

**Função:** `t^3 + 2t^2 + 2`

$s(t) = t^3 + 2t^2 + C$, e $s(0) = C = 2$.
</details>

**b)** Onde o robô está em $t = 3$ s?

<details>
<summary>Ver resposta</summary>

**Número:** `47`

$s(3) = 27 + 18 + 2 = 47$ m.
</details>

**c)** Ache $F$ com $F'(x) = e^x + 1$ e $F(0) = 5$.

<details>
<summary>Ver resposta</summary>

**Função:** `e^x + x + 4`

$F(x) = e^x + x + C$. $F(0) = 1 + 0 + C = 5 \Rightarrow C = 4$. Cuidado: $e^0 = 1$, não $0$.
</details>
