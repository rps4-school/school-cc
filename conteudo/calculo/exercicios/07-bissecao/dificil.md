# ✂️ Bisseção · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Método da bisseção](../../aulas/07-bissecao.md)

Resolva no papel primeiro, com calculadora (em **radianos**, se houver seno ou cosseno). Use 6 casas decimais nas contas. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Quando o algoritmo quadrático perde?

O algoritmo A faz $50\,n \ln n$ operações e o B faz $n^2$. Para $n$ pequeno, B é mais rápido; a partir de certo $n$, A passa a ganhar. O ponto de virada satisfaz $n^2 = 50\,n \ln n$, isto é, $f(n) = n - 50\ln n = 0$.

**a)** $f(200) \approx -64{,}92$. Quanto vale $f(300)$? (2 casas.)

<details>
<summary>Ver resposta</summary>

**Número:** `14,81 ± 0,01`

$f(300) = 300 - 50\ln 300 \approx 300 - 285{,}19 = 14{,}81$. Sinais opostos: há raiz em $[200, 300]$.
</details>

**b)** Com $\varepsilon = 1$, qual é o menor $k$ da bisseção em $[200, 300]$?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

$\dfrac{100}{2^{k+1}} \leq 1 \Rightarrow 2^{k+1} \geq 100 \Rightarrow k = 6$.
</details>

**c)** Quanto vale $x_6$?

<details>
<summary>Ver resposta</summary>

**Número:** `282,03125 ± 0,01`

| $k$ | $a$ | $b$ | $x_k$ | $f(x_k)$ |
| --- | --- | --- | ----- | -------- |
| 0 | 200 | 300 | 250 | $-26{,}07$ |
| 1 | 250 | 300 | 275 | $-5{,}84$ |
| 2 | 275 | 300 | 287,5 | $+4{,}44$ |
| 3 | 275 | 287,5 | 281,25 | $-0{,}71$ |
| 4 | 281,25 | 287,5 | 284,375 | $+1{,}86$ |
| 5 | 281,25 | 284,375 | 282,8125 | $+0{,}57$ |
| 6 | 281,25 | 282,8125 | **282,03125** | $-0{,}07$ |
</details>

**d)** A partir de qual valor **inteiro** de $n$ o algoritmo A passa a ser mais rápido?

<details>
<summary>Ver resposta</summary>

**Número:** `283`

A raiz está perto de 282,1. Testando os inteiros vizinhos: $f(282) \approx -0{,}095 < 0$ (ainda $n^2 < 50n\ln n$, B ganha) e $f(283) \approx 0{,}728 > 0$ (A ganha). Resposta: $n = 283$.
</details>

---

## Exercício 08: Cache equilibrada com alta precisão

O tamanho $x$ de uma cache que equilibra custo e benefício satisfaz $x \ln x = 3$, isto é, $f(x) = x\ln x - 3 = 0$.

**a)** Com raiz em $[2, 3]$ e $\varepsilon = 10^{-3}$, qual é o menor $k$?

<details>
<summary>Ver resposta</summary>

**Número:** `9`

$\dfrac{1}{2^{k+1}} \leq 0{,}001 \Rightarrow 2^{k+1} \geq 1000$. Como $2^{10} = 1024$: $k = 9$.
</details>

**b)** Quanto vale $x_9$?

<details>
<summary>Ver resposta</summary>

**Número:** `2,856445 ± 0,0001`

| $k$ | $a$ | $b$ | $x_k$ | sinal de $f(x_k)$ |
| --- | --- | --- | ----- | ----------------- |
| 0 | 2 | 3 | 2,5 | $-$ |
| 1 | 2,5 | 3 | 2,75 | $-$ |
| 2 | 2,75 | 3 | 2,875 | $+$ |
| 3 | 2,75 | 2,875 | 2,8125 | $-$ |
| 4 | 2,8125 | 2,875 | 2,84375 | $-$ |
| 5 | 2,84375 | 2,875 | 2,859375 | $+$ |
| 6 | 2,84375 | 2,859375 | 2,8515625 | $-$ |
| 7 | 2,8515625 | 2,859375 | 2,85546875 | $-$ |
| 8 | 2,85546875 | 2,859375 | 2,857421875 | $+$ |
| 9 | 2,85546875 | 2,857421875 | **2,856445** | $-$ |
</details>

**c)** Qual é a cota de erro de $x_9$? (6 casas.)

<details>
<summary>Ver resposta</summary>

**Número:** `1/1024`

$\dfrac{1}{2^{10}} = \dfrac{1}{1024} \approx 0{,}000977 \leq 0{,}001$. ✔️
</details>

---

## Exercício 09: Quando a bisseção engana

**a)** Dá para usar a bisseção para achar a raiz de $f(x) = (x - 1)^2$ no intervalo $[0, 3]$? Responda **sim** ou **não**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

$f(0) = 1$ e $f(3) = 4$: mesmo sinal. A raiz $x = 1$ existe, mas a função só **encosta** no eixo, sem trocar de sinal. A bisseção não consegue começar.
</details>

**b)** Aplique a bisseção a $f(x) = \operatorname{tg} x$ em $[1, 2]$ (radianos). $f(1) > 0$ e $f(2) < 0$. De qual número os pontos médios se aproximam? (4 casas.)

<details>
<summary>Ver resposta</summary>

**Número:** `π/2 ± 0,0001`

Os pontos médios convergem para $\frac{\pi}{2} \approx 1{,}5708$, onde $\operatorname{tg} x$ tem uma **assíntota vertical**, não uma raiz. A troca de sinal veio de um "salto" para $\pm\infty$.
</details>

**c)** Que conferência simples teria mostrado que o resultado do item b não é raiz?

<details>
<summary>Ver resposta</summary>

**Resposta esperada:** calcular $f$ no resultado. Numa raiz, $\lvert f(x_k) \rvert$ fica cada vez **menor**; aqui ele fica cada vez **maior** (passa de 2 000 em $x_6 \approx 1{,}5703$). Também dava para checar antes a **continuidade**: $\operatorname{tg} x$ não é contínua em $[1, 2]$, então Bolzano não se aplica.
</details>
