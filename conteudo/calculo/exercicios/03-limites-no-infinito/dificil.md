# ♾️ Limites no infinito · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Limites no infinito](../../aulas/03-limites-no-infinito.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**. Use `∞` (ou `infinito`) e `-∞` quando for o caso.

---

## Exercício 07: Descobrindo o parâmetro

A taxa de acerto de uma cache com $n$ blocos é modelada por $T(n) = \dfrac{a n + 5}{5n + 2}$. Medições mostram que, para $n$ muito grande, a taxa se aproxima de $0{,}8$ (80%).

**a)** Encontre $a$.

<details>
<summary>Ver resposta</summary>

**Número:** `4`

Mesmo grau: o limite é $\frac{a}{5}$. Então $\frac{a}{5} = 0{,}8 \Rightarrow a = 4$.
</details>

**b)** Outro modelo é $S(n) = \dfrac{b n^2 + n}{4n^2 + 7}$, com limite $3$. Encontre $b$.

<details>
<summary>Ver resposta</summary>

**Número:** `12`

$\frac{b}{4} = 3 \Rightarrow b = 12$.
</details>

**c)** Um colega diz: "como $n$ vai para infinito, basta substituir $n = \infty$ e fazer $\frac{\infty}{\infty} = 1$". O que está errado?

<details>
<summary>Ver resposta</summary>

**Resposta esperada:** $\infty$ não é um número, então não dá para "substituir". E $\frac{\infty}{\infty}$ é uma **indeterminação**: o resultado depende de **quão rápido** cima e embaixo crescem. No item a, por exemplo, o limite é $0{,}8$, não 1. O certo é dividir tudo pela maior potência do denominador (ou comparar os graus).
</details>

---

## Exercício 08: Epidemia de malware

O número de máquinas infectadas por um malware, em milhares, $t$ dias depois do início, é $P(t) = \dfrac{80t + 50}{t + 5}$.

**a)** Calcule $P(0)$.

<details>
<summary>Ver resposta</summary>

**Número:** `10`

$P(0) = \frac{50}{5} = 10$: no início, 10 mil máquinas infectadas.
</details>

**b)** Calcule $\displaystyle\lim_{t \to \infty} P(t)$.

<details>
<summary>Ver resposta</summary>

**Número:** `80`

Mesmo grau: $\frac{80}{1} = 80$. A longo prazo, o modelo prevê cerca de 80 mil máquinas infectadas.
</details>

**c)** A reta $y = 80$ é assíntota horizontal do gráfico de $P$? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

Uma reta $y = L$ é assíntota horizontal quando $\displaystyle\lim_{t \to \infty} P(t) = L$. Foi o que deu no item b.
</details>

**d)** O número de infectadas chega a 80 mil em algum dia? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

Dividindo: $P(t) = 80 - \dfrac{350}{t + 5}$. Como $\frac{350}{t + 5} > 0$ para todo $t \geq 0$, sempre $P(t) < 80$. O valor se aproxima de 80 sem nunca chegar.
</details>

---

## Exercício 09: Sigmoide e algoritmos

**a)** A ativação sigmoide de redes neurais é $\sigma(x) = \dfrac{1}{1 + e^{-x}}$. Calcule $\displaystyle\lim_{x \to \infty} \sigma(x)$.

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$e^{-x} = \frac{1}{e^x} \to 0$, então $\sigma(x) \to \frac{1}{1 + 0} = 1$.
</details>

**b)** Calcule $\displaystyle\lim_{x \to -\infty} \sigma(x)$.

<details>
<summary>Ver resposta</summary>

**Número:** `0`

Com $x \to -\infty$, $e^{-x} \to \infty$, e $\frac{1}{1 + \infty} \to 0$. Por isso a sigmoide fica sempre entre 0 e 1, como uma probabilidade.
</details>

**c)** O algoritmo A faz $2n^3 + n$ operações e o B faz $n^3 + 50n^2$. Calcule $\displaystyle\lim_{n \to \infty} \frac{2n^3 + n}{n^3 + 50n^2}$.

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Mesmo grau (3): $\frac{2}{1} = 2$. Para entradas enormes, A faz cerca do **dobro** das operações de B. Os termos $n$ e $50n^2$ deixam de importar.
</details>
