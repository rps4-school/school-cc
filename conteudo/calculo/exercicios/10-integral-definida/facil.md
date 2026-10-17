# 📊 Integral definida · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Integral definida e áreas](../../aulas/10-integral-definida.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir** (vale fração, decimal, `e`, `π` e `ln`); no GitHub, abra **Ver resposta**.

---

## Exercício 01: Teorema Fundamental do Cálculo

Calcule:

**a)** $\displaystyle\int_0^2 3x^2\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `8`

$\Big[x^3\Big]_0^2 = 8 - 0 = 8$.
</details>

**b)** $\displaystyle\int_1^4 (2x - 1)\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `12`

$\Big[x^2 - x\Big]_1^4 = (16 - 4) - (1 - 1) = 12$.
</details>

**c)** $\displaystyle\int_0^1 e^x\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `e - 1`

$\Big[e^x\Big]_0^1 = e - e^0 = e - 1 \approx 1{,}7183$.
</details>

**d)** $\displaystyle\int_0^{\pi/2} \operatorname{sen} x\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `1`

$\Big[-\cos x\Big]_0^{\pi/2} = -\cos\frac{\pi}{2} + \cos 0 = 0 + 1 = 1$.
</details>

---

## Exercício 02: Propriedades

Sabe-se que $\displaystyle\int_0^3 f(x)\,dx = 5$ e $\displaystyle\int_3^7 f(x)\,dx = 2$. Calcule:

**a)** $\displaystyle\int_0^7 f(x)\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `7`

Dividir o intervalo: $\int_0^7 = \int_0^3 + \int_3^7 = 5 + 2 = 7$.
</details>

**b)** $\displaystyle\int_3^0 f(x)\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `-5`

Inverter os limites troca o sinal: $-5$.
</details>

**c)** $\displaystyle\int_0^3 4f(x)\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `20`

A constante sai: $4 \cdot 5 = 20$.
</details>

**d)** $\displaystyle\int_2^2 f(x)\,dx$

<details>
<summary>Ver resposta</summary>

**Número:** `0`

Intervalo de largura zero: a integral é $0$.
</details>

---

## Exercício 03: Do ritmo para o total

**a)** Um servidor recebe $r(t) = 10 + 4t$ requisições por minuto. Quantas chegam nos 5 primeiros minutos?

<details>
<summary>Ver resposta</summary>

**Número:** `100`

$\displaystyle\int_0^5 (10 + 4t)\,dt = \Big[10t + 2t^2\Big]_0^5 = 50 + 50 = 100$ requisições.
</details>

**b)** Um robô anda com velocidade $v(t) = 3t^2$ m/s. Quantos metros ele percorre entre $t = 1$ e $t = 3$ s?

<details>
<summary>Ver resposta</summary>

**Número:** `26`

$\displaystyle\int_1^3 3t^2\,dt = \Big[t^3\Big]_1^3 = 27 - 1 = 26$ m.
</details>
