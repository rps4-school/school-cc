# ♾️ Limites no infinito · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Limites no infinito](../../aulas/03-limites-no-infinito.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**. Use `∞` (ou `infinito`) e `-∞` quando for o caso.

---

## Exercício 04: Normas e raízes

Modelos de custo às vezes envolvem normas, que são raízes de somas de quadrados. Calcule:

**a)** $\displaystyle\lim_{x \to \infty} \frac{\sqrt{9x^2 + 1}}{2x - 1}$

<details>
<summary>Ver resposta</summary>

**Número:** `3/2`

$\sqrt{9x^2 + 1} = \lvert x \rvert\sqrt{9 + \frac{1}{x^2}}$, e para $x > 0$, $\lvert x \rvert = x$:

$$
\frac{x\sqrt{9 + \frac{1}{x^2}}}{x\left(2 - \frac{1}{x}\right)} \to \frac{3}{2}
$$
</details>

**b)** $\displaystyle\lim_{x \to -\infty} \frac{\sqrt{9x^2 + 1}}{2x - 1}$

<details>
<summary>Ver resposta</summary>

**Número:** `-3/2`

Agora $x < 0$, então $\lvert x \rvert = -x$: o resultado troca de sinal, $-\frac{3}{2}$. Faz sentido: a raiz é positiva e o denominador é negativo.
</details>

**c)** $\displaystyle\lim_{x \to \infty} \frac{5x^2 + 1}{\sqrt{4x^4 + x}}$

<details>
<summary>Ver resposta</summary>

**Número:** `5/2`

A raiz se comporta como $\sqrt{4x^4} = 2x^2$: "grau" 2, igual ao de cima. Resultado: $\frac{5}{2}$.
</details>

---

## Exercício 05: Caçando assíntotas

Uma métrica de desempenho tem gráfico $f(x) = \dfrac{x^2 + x - 6}{x^2 - 4}$.

**a)** Qual é a assíntota vertical? Responda o valor de $x$.

<details>
<summary>Ver resposta</summary>

**Número:** `-2`

Fatore: $f(x) = \dfrac{(x + 3)(x - 2)}{(x - 2)(x + 2)}$. O fator $(x - 2)$ cancela; sobra o zero $x = -2$ no denominador, onde o numerador vale $1 \neq 0$. Assíntota vertical: $x = -2$.
</details>

**b)** Qual é a assíntota horizontal? Responda o valor de $y$.

<details>
<summary>Ver resposta</summary>

**Número:** `1`

Mesmo grau (2), coeficientes líderes $1$ e $1$: $y = 1$.
</details>

**c)** Em $x = 2$ não há assíntota, só um buraco. Quanto vale $\displaystyle\lim_{x \to 2} f(x)$?

<details>
<summary>Ver resposta</summary>

**Número:** `5/4`

Depois de cancelar: $\dfrac{x + 3}{x + 2} \to \dfrac{5}{4}$.
</details>

---

## Exercício 06: Usuários depois da campanha

Os usuários ativos de um aplicativo, $t$ meses depois de uma campanha, são $U(t) = 2000 + \dfrac{15\,000\,t}{t^2 + 6t + 25}$.

**a)** Calcule $U(5)$.

<details>
<summary>Ver resposta</summary>

**Número:** `2937,5`

$U(5) = 2000 + \dfrac{75\,000}{25 + 30 + 25} = 2000 + \dfrac{75\,000}{80} = 2000 + 937{,}5 = 2937{,}5$.
</details>

**b)** Calcule $\displaystyle\lim_{t \to \infty} U(t)$.

<details>
<summary>Ver resposta</summary>

**Número:** `2000`

A fração tem grau 1 em cima e 2 embaixo: vai a 0. Sobra $2000$. A campanha dá um pico, mas a longo prazo a base volta para cerca de 2 000 usuários (a assíntota horizontal é $y = 2000$).
</details>
