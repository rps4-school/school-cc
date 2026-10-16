# ♾️ Limites no infinito · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Limites no infinito](../../aulas/03-limites-no-infinito.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**. Use `∞` (ou `infinito`) e `-∞` quando for o caso.

---

## Exercício 01: Mesmo grau

O tempo de execução, em milissegundos por item, de três algoritmos é dado pelas frações abaixo. Calcule:

**a)** $\displaystyle\lim_{n \to \infty} \frac{8n^2 + n + 3}{2n^2 + 1}$

<details>
<summary>Ver resposta</summary>

**Número:** `4`

Mesmo grau (2): divida os coeficientes líderes, $\frac{8}{2} = 4$. Para entradas enormes, cerca de 4 ms por item.
</details>

**b)** $\displaystyle\lim_{x \to \infty} \frac{7x - 2}{2x + 9}$

<details>
<summary>Ver resposta</summary>

**Número:** `7/2`

Mesmo grau (1): $\frac{7}{2} = 3{,}5$.
</details>

**c)** $\displaystyle\lim_{x \to -\infty} \frac{9x^2 + x}{3x^2 - 2}$

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Mesmo grau (2): $\frac{9}{3} = 3$. Com expoente par, ir para $-\infty$ não muda o sinal.
</details>

---

## Exercício 02: Graus diferentes

**a)** $\displaystyle\lim_{x \to \infty} \frac{7x + 2}{x^3 + 1}$

<details>
<summary>Ver resposta</summary>

**Número:** `0`

Grau de cima (1) menor que o de baixo (3): o limite é **0**.
</details>

**b)** $\displaystyle\lim_{x \to \infty} \frac{x^3 + 2}{5x^2 + 1}$

<details>
<summary>Ver resposta</summary>

**Número:** `∞`

Grau de cima maior. Dividindo por $x^2$: $\dfrac{x + \frac{2}{x^2}}{5 + \frac{1}{x^2}} \to \dfrac{\infty}{5} = +\infty$.
</details>

**c)** $\displaystyle\lim_{x \to -\infty} \frac{x^3 + 2}{5x^2 + 1}$

<details>
<summary>Ver resposta</summary>

**Número:** `-∞`

Mesma conta, mas agora o $x$ que sobra em cima vai para $-\infty$: o limite é $-\infty$.
</details>

---

## Exercício 03: Mais servidores, menos latência

Com $n$ servidores, a latência de um sistema distribuído é $L(n) = 30 + \dfrac{450}{n}$ ms.

**a)** Qual é a latência com 10 servidores?

<details>
<summary>Ver resposta</summary>

**Número:** `75`

$L(10) = 30 + 45 = 75$ ms.
</details>

**b)** Calcule $\displaystyle\lim_{n \to \infty} L(n)$.

<details>
<summary>Ver resposta</summary>

**Número:** `30`

$\frac{450}{n} \to 0$, então $L(n) \to 30$ ms.
</details>

**c)** Existe algum número finito de servidores com latência **exatamente** igual a esse limite? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

$L(n) = 30$ exigiria $\frac{450}{n} = 0$, o que nunca acontece. O limite é atingido só "no infinito": a latência se aproxima de 30 ms sem chegar lá.
</details>
