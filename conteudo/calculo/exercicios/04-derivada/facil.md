# 📐 Derivada · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Derivada](../../aulas/04-derivada.md) · Próximo: [Intermediário →](intermediario.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Robô na esteira

A posição de um robô numa esteira é $s(t) = 2t^2 + t$ metros, com $t$ em segundos.

**a)** Qual é a velocidade **média** entre $t = 1$ e $t = 3$?

<details>
<summary>Ver resposta</summary>

**Número:** `9`

$s(3) = 18 + 3 = 21$ e $s(1) = 2 + 1 = 3$. Taxa média: $\dfrac{21 - 3}{3 - 1} = \dfrac{18}{2} = 9$ m/s.
</details>

**b)** E entre $t = 1$ e $t = 1{,}1$?

<details>
<summary>Ver resposta</summary>

**Número:** `5,2`

$s(1{,}1) = 2 \cdot 1{,}21 + 1{,}1 = 3{,}52$. Taxa média: $\dfrac{3{,}52 - 3}{0{,}1} = \dfrac{0{,}52}{0{,}1} = 5{,}2$ m/s.
</details>

**c)** Qual é a velocidade **instantânea** em $t = 1$?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

Pela definição: $\dfrac{s(1 + h) - s(1)}{h} = \dfrac{2(1 + h)^2 + (1 + h) - 3}{h} = \dfrac{5h + 2h^2}{h} = 5 + 2h \to 5$ m/s. As taxas médias (9, depois 5,2) se aproximavam disso.
</details>

---

## Exercício 02: Pela definição

Use $f'(x) = \displaystyle\lim_{h \to 0} \frac{f(x + h) - f(x)}{h}$ para derivar:

**a)** $f(x) = 3x^2$

<details>
<summary>Ver resposta</summary>

**Função:** `6x`

$\dfrac{3(x + h)^2 - 3x^2}{h} = \dfrac{6xh + 3h^2}{h} = 6x + 3h \to 6x$.
</details>

**b)** $f(x) = 7x - 2$

<details>
<summary>Ver resposta</summary>

**Função:** `7`

$\dfrac{7(x + h) - 2 - (7x - 2)}{h} = \dfrac{7h}{h} = 7$. A derivada de uma reta é a sua inclinação.
</details>

**c)** $f(x) = x^2 + 3x$

<details>
<summary>Ver resposta</summary>

**Função:** `2x + 3`

$\dfrac{(x + h)^2 + 3(x + h) - x^2 - 3x}{h} = \dfrac{2xh + h^2 + 3h}{h} = 2x + h + 3 \to 2x + 3$.
</details>

---

## Exercício 03: Custo marginal

Atender $x$ usuários custa $C(x) = 500 + 4x + 0{,}01x^2$ reais por mês.

**a)** Escreva $C'(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `4 + 0,02x`

A constante some, $4x$ vira $4$ e $0{,}01x^2$ vira $0{,}02x$: $C'(x) = 4 + 0{,}02x$.
</details>

**b)** Qual é o **custo marginal** com 100 usuários (o custo aproximado do próximo usuário)?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$C'(100) = 4 + 2 = 6$ reais por usuário.
</details>

**c)** Se $f'(2) = -3$, a função está **subindo** ou **descendo** perto de $x = 2$?

<details>
<summary>Ver resposta</summary>

**Resposta:** `descendo | decrescendo | decrescente | decresce | caindo | diminuindo`

Derivada negativa: a função **decresce** ali, perdendo cerca de 3 unidades de altura para cada unidade a mais de $x$.
</details>
