# 📋 Formulário de Cálculo

> [← voltar para Cálculo](../README.md)

**Nível:** 🟡 Intermediário

Todas as fórmulas das 10 aulas numa página. No fim, um guia para **reconhecer o tipo de questão** e escolher o método.

## 🧩 Funções

| Assunto | Fórmula ou regra |
| ------- | ---------------- |
| Domínio | Denominador $\neq 0$; raiz par $\geq 0$; $\ln(A)$ exige $A > 0$ |
| Composição | $(f \circ g)(x) = f(g(x))$: primeiro $g$, depois $f$ |
| Inversa | Troque $f(x)$ por $y$, isole $x$, troque os nomes |
| Injetora | Toda reta horizontal corta o gráfico no máximo uma vez |
| Afim | $f(x) = \text{fixo} + \text{taxa} \cdot x$ |
| Quadrado de binômio | $(a \pm b)^2 = a^2 \pm 2ab + b^2$ |

## 🎯 Limites

| Situação | O que fazer |
| -------- | ----------- |
| Substituição dá número | É o limite |
| $\frac{0}{0}$ com polinômios | Fatore e cancele o fator comum |
| $\frac{0}{0}$ com raiz | Multiplique pelo conjugado |
| $\frac{0}{0}$ com $(a + h)^n$ | Expanda e ponha $h$ em evidência |
| $\frac{0}{0}$ com frações | MMC |
| $\frac{k}{0}$ ($k \neq 0$) | $\pm\infty$: estude o sinal de cada lado |
| Função por partes | Limite existe $\iff$ laterais iguais |
| Confronto | $g \leq f \leq h$ e $g, h \to L$ $\Rightarrow$ $f \to L$ |
| Continuidade | $\lim_{x \to a} f(x) = f(a)$ |

| Fatoração | Fórmula |
| --------- | ------- |
| Diferença de quadrados | $a^2 - b^2 = (a - b)(a + b)$ |
| Diferença de cubos | $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ |
| Soma de cubos | $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$ |
| Trinômio | $ax^2 + bx + c = a(x - r_1)(x - r_2)$ |

## ♾️ Limites no infinito

| Fração de polinômios | Limite em $\pm\infty$ |
| -------------------- | --------------------- |
| Graus iguais | Razão dos coeficientes líderes |
| Grau de cima menor | $0$ |
| Grau de cima maior | $\pm\infty$ |

| Outros | Valor |
| ------ | ----- |
| $\frac{k}{x^n}$, $n > 0$ | $\to 0$ |
| $\sqrt{x^2}$ | $\lvert x \rvert$ ($= -x$ quando $x \to -\infty$) |
| $e^{-x}$ com $x \to \infty$ | $\to 0$ |
| Assíntota horizontal $y = L$ | $\lim_{x \to \pm\infty} f(x) = L$ |
| Assíntota vertical $x = a$ | Zero do denominador que **não** cancela |

## 📐 Derivada

$$
f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h} \qquad f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a}
$$

$$
\text{Reta tangente: } y - f(a) = f'(a)\,(x - a)
$$

| $f(x)$ | $f'(x)$ | $f(x)$ | $f'(x)$ |
| ------ | ------- | ------ | ------- |
| $c$ | $0$ | $\ln x$ | $\dfrac{1}{x}$ |
| $x^n$ | $n\,x^{n-1}$ | $\log_a x$ | $\dfrac{1}{x \ln a}$ |
| $e^x$ | $e^x$ | $\operatorname{sen} x$ | $\cos x$ |
| $a^x$ | $a^x \ln a$ | $\cos x$ | $-\operatorname{sen} x$ |
| $\sqrt{x}$ | $\dfrac{1}{2\sqrt{x}}$ | $\operatorname{tg} x$ | $\sec^2 x$ |

| Regra | Fórmula |
| ----- | ------- |
| Produto | $(f\,g)' = f'\,g + f\,g'$ |
| Quociente | $\left(\dfrac{f}{g}\right)' = \dfrac{f'\,g - f\,g'}{g^2}$ |
| Cadeia | $\bigl(f(g(x))\bigr)' = f'(g(x)) \cdot g'(x)$ |
| $e^u$, $\ln u$ | $u'\,e^u$ e $\dfrac{u'}{u}$ |
| Sigmoide | $\sigma' = \sigma\,(1 - \sigma)$ |
| Ordem $n$ de seno e cosseno | Ciclo de 4: use o resto de $n$ por 4 |

| Propriedade do $\ln$ | Fórmula |
| -------------------- | ------- |
| Produto | $\ln(ab) = \ln a + \ln b$ |
| Quociente | $\ln\left(\frac{a}{b}\right) = \ln a - \ln b$ |
| Potência | $\ln(a^n) = n \ln a$ |

## 📈 Aplicações da derivada

| Sinal | Significa |
| ----- | --------- |
| $f' > 0$ / $f' < 0$ | cresce / decresce |
| $f'$ de $+$ para $-$ | máximo local |
| $f'$ de $-$ para $+$ | mínimo local |
| $f'' > 0$ / $f'' < 0$ | concavidade para cima / para baixo |
| $f''$ troca de sinal | ponto de inflexão |
| $f'(c) = 0$ e $f''(c) < 0$ | máximo local (teste da 2ª derivada) |
| $f'(c) = 0$ e $f''(c) > 0$ | mínimo local |

**Intervalo fechado $[a, b]$:** compare $f$ nos críticos **e nas pontas**. **Otimização:** função objetivo, restrição, derivada igual a zero, confirmar.

## ✂️ Bisseção e 🚀 Newton

| | Bisseção | Newton |
| --- | -------- | ------ |
| Fórmula | $x_k = \dfrac{a + b}{2}$ | $x_k = x_{k-1} - \dfrac{f(x_{k-1})}{f'(x_{k-1})}$ |
| Começa com | $[a, b]$ com $f(a)f(b) < 0$ | Chute $x_0$ |
| Parada | Menor $k$ com $\dfrac{b - a}{2^{k+1}} \leq \varepsilon$ | $\lvert x_k - x_{k-1} \rvert < \varepsilon$ |
| Erro de $x_k$ | $\leq \dfrac{b_0 - a_0}{2^{k+1}}$ | — |
| Converge sempre? | Sim | Não |

| Teorema | Enunciado |
| ------- | --------- |
| Bolzano | $f$ contínua e $f(a)f(b) < 0$ $\Rightarrow$ existe raiz em $(a, b)$ |
| Unicidade | Além disso, $f'$ com sinal constante $\Rightarrow$ a raiz é única |
| Herão | $\sqrt{A}$: $x_k = \frac{1}{2}\left(x_{k-1} + \frac{A}{x_{k-1}}\right)$ |

## ↩️ Primitivas

| $f(x)$ | $\int f(x)\,dx$ | $f(x)$ | $\int f(x)\,dx$ |
| ------ | --------------- | ------ | --------------- |
| $x^n$ ($n \neq -1$) | $\dfrac{x^{n+1}}{n + 1} + C$ | $\operatorname{sen} x$ | $-\cos x + C$ |
| $\dfrac{1}{x}$ | $\ln \lvert x \rvert + C$ | $\cos x$ | $\operatorname{sen} x + C$ |
| $e^{kx}$ | $\dfrac{e^{kx}}{k} + C$ | $\sec^2 x$ | $\operatorname{tg} x + C$ |
| $a^x$ | $\dfrac{a^x}{\ln a} + C$ | $k$ | $kx + C$ |

**Substituição:** $\int f(g(x))\,g'(x)\,dx = \int f(u)\,du$, com $u = g(x)$.

## 📊 Integral definida

$$
\int_a^b f(x)\,dx = F(b) - F(a) \qquad \text{(Teorema Fundamental do Cálculo)}
$$

| Assunto | Fórmula |
| ------- | ------- |
| Soma de Riemann | $\sum f(x_i)\,\Delta x$, com $\Delta x = \frac{b - a}{n}$ |
| Inverter limites | $\int_b^a f = -\int_a^b f$ |
| Área entre curvas | $\int_a^b (\text{cima} - \text{baixo})\,dx$ |
| Função ímpar em $[-a, a]$ | $0$ |
| Função par em $[-a, a]$ | $2\int_0^a f$ |
| $\int_1^{\infty} \frac{1}{x^p}\,dx$ | $\frac{1}{p - 1}$ se $p > 1$; diverge se $p \leq 1$ |
| $\int_0^{\infty} e^{-kx}\,dx$ | $\frac{1}{k}$ ($k > 0$) |

## 🔎 Reconheça o tipo de questão

| A questão pede ou mostra... | Use |
| --------------------------- | --- |
| "Domínio", fórmula com fração, raiz ou ln | Condições do domínio |
| $f(g(x))$, "pipeline", "primeiro... depois..." | Composição |
| "Desfazer", "qual entrada gerou" | Inversa |
| $\lim$ e a substituição dá $\frac{0}{0}$ | Fatorar, conjugado, expandir ou MMC |
| $\lim$ com $x \to \infty$ | Regra dos graus |
| "Assíntota" | Limite no infinito (horizontal) e zero do denominador (vertical) |
| $\frac{f(x + h) - f(x)}{h}$ | Definição de derivada |
| "Taxa instantânea", "velocidade", "marginal" | Derivada |
| "Reta tangente" | $y - f(a) = f'(a)(x - a)$ |
| "Máximo", "mínimo", "cresce", "côncava" | Sinais de $f'$ e $f''$ |
| "Maior área", "menor custo", "lote ideal" | Otimização |
| "Existe raiz em $[a, b]$?" | Bolzano |
| "Aproxime a raiz", intervalo dado | Bisseção |
| "Aproxime a raiz", chute $x_0$ dado | Newton |
| $\int$ sem limites | Primitiva (com $+\,C$) |
| $\int_a^b$, "área", "total a partir da taxa" | TFC |
