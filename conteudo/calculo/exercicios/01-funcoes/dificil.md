# 🧩 Funções · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Funções reais](../../aulas/01-funcoes.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Taxa média de custo

O custo de um algoritmo para uma entrada de tamanho $n$ é $c(n) = 3n^2 - 2n + 5$. A **taxa média** de variação do custo quando a entrada vai de $n$ para $n + h$ é o quociente de diferenças.

**a)** Calcule e simplifique $\dfrac{c(n + h) - c(n)}{h}$, com $h \neq 0$.

<details>
<summary>Ver resposta</summary>

**Função:** `6n + 3h - 2`

| Passo | Conta |
| ----- | ----- |
| $c(n + h)$ | $3(n + h)^2 - 2(n + h) + 5 = 3n^2 + 6nh + 3h^2 - 2n - 2h + 5$ |
| Menos $c(n)$ | $6nh + 3h^2 - 2h$ |
| Dividido por $h$ | $\dfrac{h(6n + 3h - 2)}{h} = 6n + 3h - 2$ |
</details>

**b)** Quanto vale essa taxa com $n = 2$ e $h = 0{,}1$?

<details>
<summary>Ver resposta</summary>

**Número:** `10,3`

$6 \cdot 2 + 3 \cdot 0{,}1 - 2 = 12 + 0{,}3 - 2 = 10{,}3$.
</details>

**c)** O que sobra da expressão do item a quando $h$ fica muito pequeno (perto de 0)?

<details>
<summary>Ver resposta</summary>

**Função:** `6n - 2`

O termo $3h$ some: sobra $6n - 2$. Essa é a **derivada** de $c(n)$, a taxa **instantânea**. Ela aparece de novo na [aula de Derivada](../../aulas/04-derivada.md).
</details>

---

## Exercício 08: Inversa com domínio restrito

Um sistema mapeia índices por $f\colon [3, \infty) \to [-5, \infty)$, com $f(x) = x^2 - 6x + 4$.

**a)** Escreva $f^{-1}(x)$.

<details>
<summary>Ver resposta</summary>

**Função:** `3 + √(x + 5)`

Complete o quadrado: $x^2 - 6x + 4 = (x - 3)^2 - 5$.

$$
y = (x - 3)^2 - 5 \;\Rightarrow\; (x - 3)^2 = y + 5 \;\Rightarrow\; x - 3 = \sqrt{y + 5}
$$

Usamos a raiz **positiva** porque $x \geq 3$. Logo $f^{-1}(x) = 3 + \sqrt{x + 5}$.
</details>

**b)** Calcule $f(6)$.

<details>
<summary>Ver resposta</summary>

**Número:** `4`

$f(6) = 36 - 36 + 4 = 4$.
</details>

**c)** Confira: quanto vale $f^{-1}(4)$?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$f^{-1}(4) = 3 + \sqrt{9} = 6$. Voltou ao ponto de partida, como esperado. ✔️
</details>

**d)** Por que foi preciso restringir o domínio a $[3, \infty)$?

<details>
<summary>Ver resposta</summary>

**Resposta esperada:** em $\mathbb{R}$ inteiro, a parábola **não é injetora**: por exemplo, $f(0) = f(6) = 4$. Aí o código $4$ teria duas origens e a "inversa" não saberia qual devolver. A partir do vértice ($x = 3$), a parábola só sobe, cada saída vem de uma única entrada, e a inversa existe.
</details>

---

## Exercício 09: Calor, frequência e potência

Num teste de carga, a temperatura de um processador depois de $t$ minutos é $T(t) = 30 + 5t$ (°C). A frequência depende da temperatura: $f(T) = 4{,}1 - 0{,}02\,T$ (GHz). E a potência é proporcional ao quadrado da frequência: $P = 4f^2$ (W).

**a)** Escreva a frequência em função do tempo, $f(T(t))$.

<details>
<summary>Ver resposta</summary>

**Função:** `3,5 - 0,1t`

$f(30 + 5t) = 4{,}1 - 0{,}02(30 + 5t) = 4{,}1 - 0{,}6 - 0{,}1t = 3{,}5 - 0{,}1t$.
</details>

**b)** Depois de quantos minutos a frequência cai para $2{,}5$ GHz?

<details>
<summary>Ver resposta</summary>

**Número:** `10`

$3{,}5 - 0{,}1t = 2{,}5 \Rightarrow 0{,}1t = 1 \Rightarrow t = 10$ minutos.
</details>

**c)** Qual é a potência nesse instante, em W?

<details>
<summary>Ver resposta</summary>

**Número:** `25`

$P = 4 \cdot 2{,}5^2 = 4 \cdot 6{,}25 = 25$ W.
</details>

**d)** A potência começa em $t = 0$ com $f = 3{,}5$ GHz. Em quantos por cento ela **caiu** até $t = 10$? (Responda só o número.)

<details>
<summary>Ver resposta</summary>

**Número:** `49 ± 0,5`

Em $t = 0$: $P = 4 \cdot 3{,}5^2 = 49$ W. Em $t = 10$: $25$ W. A queda é $\dfrac{49 - 25}{49} = \dfrac{24}{49} \approx 0{,}49$, ou seja, cerca de **49%**. A frequência caiu só $\frac{1}{3{,}5} \approx 29\%$, mas a potência cai mais porque depende do **quadrado**.
</details>
