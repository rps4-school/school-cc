# 📈 Aplicações da derivada · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Aplicações da derivada](../../aulas/06-aplicacoes-da-derivada.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Temperatura do chip no teste

Num teste de 3 segundos, a temperatura relativa de um chip é $T(t) = 2t^3 - 9t^2 + 12t$, com $t \in [0, 3]$.

**a)** Qual é o **máximo absoluto** de $T$ nesse intervalo?

<details>
<summary>Ver resposta</summary>

**Número:** `9`

$T'(t) = 6t^2 - 18t + 12 = 6(t - 1)(t - 2)$: críticos em $t = 1$ e $t = 2$, os dois dentro do intervalo.

| $t$ | $0$ (ponta) | $1$ | $2$ | $3$ (ponta) |
| --- | ----------- | --- | --- | ----------- |
| $T(t)$ | $0$ | $5$ | $4$ | $9$ |

O maior valor é **9**.
</details>

**b)** Em qual instante $t$ ele acontece?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Em $t = 3$, **numa ponta** do intervalo. O máximo **local** ($t = 1$, valor 5) não é o absoluto: por isso as pontas nunca podem ser esquecidas.
</details>

**c)** Qual é o **mínimo absoluto**?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

Pela tabela, o menor valor é $T(0) = 0$, também numa ponta.
</details>

---

## Exercício 05: Teste da segunda derivada

Classifique os pontos críticos de $f(x) = x^4 - 18x^2 + 3$.

**a)** Quanto vale $f''(0)$?

<details>
<summary>Ver resposta</summary>

**Número:** `-36`

$f'(x) = 4x^3 - 36x = 4x(x^2 - 9)$, críticos em $0$ e $\pm 3$. $f''(x) = 12x^2 - 36$, então $f''(0) = -36$.
</details>

**b)** Então $x = 0$ é ponto de **máximo** ou de **mínimo** local?

<details>
<summary>Ver resposta</summary>

**Resposta:** `máximo`

$f''(0) < 0$: concavidade para baixo, então é **máximo** local, com $f(0) = 3$.
</details>

**c)** Qual é o valor do **mínimo local** (em $x = \pm 3$)?

<details>
<summary>Ver resposta</summary>

**Número:** `-78`

$f''(\pm 3) = 108 - 36 = 72 > 0$: mínimos. $f(3) = 81 - 162 + 3 = -78$, e $f(-3)$ dá o mesmo.
</details>

---

## Exercício 06: Sala de servidores

Uma sala de servidores retangular será cercada com $240$ m de grade. Um dos lados fica encostado numa parede e não precisa de grade.

**a)** Qual deve ser cada lado **perpendicular** à parede, em metros?

<details>
<summary>Ver resposta</summary>

**Número:** `60`

Com $x$ os dois lados perpendiculares e $y$ o paralelo: $2x + y = 240 \Rightarrow y = 240 - 2x$. Área $A(x) = x(240 - 2x) = 240x - 2x^2$. $A'(x) = 240 - 4x = 0 \Rightarrow x = 60$, e $A'' = -4 < 0$: máximo.
</details>

**b)** E o lado **paralelo** à parede?

<details>
<summary>Ver resposta</summary>

**Número:** `120`

$y = 240 - 2 \cdot 60 = 120$ m.
</details>

**c)** Qual é a área máxima, em m²?

<details>
<summary>Ver resposta</summary>

**Número:** `7200`

$60 \cdot 120 = 7200$ m².
</details>
