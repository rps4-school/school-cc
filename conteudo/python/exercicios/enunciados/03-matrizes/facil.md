# 🔢 Matrizes · 🟢 Fácil

> [← voltar para Exercícios](../../README.md) · 📖 Antes, leia: [Matrizes](../../../resumos/03-matrizes.md) · Próximo: [Intermediário →](intermediario.md)

Formato de entrada: a primeira linha traz `linhas colunas`, e depois vem uma linha da matriz por vez. Nas matrizes **quadradas**, a primeira linha traz só `N`.

---

## Exercício 01: Soma total

Leia uma matriz de inteiros e mostre a soma de todos os elementos.

**Entrada:**
```text
2 3
1 2 3
4 5 6
```
**Saída:**
```text
Soma: 21
```

> 💡 **Dica:** dois `for`, um dentro do outro, e uma variável acumulando a soma.

[✅ Ver resposta](../../respostas/03-matrizes/facil/ex01_soma_total.py)

---

## Exercício 02: Soma de cada linha

Leia uma matriz de inteiros e mostre a soma de cada linha.

**Entrada:**
```text
2 3
1 2 3
4 5 6
```
**Saída:**
```text
Linha 1: 6
Linha 2: 15
```

> 💡 **Dica:** cada linha é uma lista, e `sum()` funciona nela. Use `enumerate(matriz, start=1)` para numerar a partir de 1.

[✅ Ver resposta](../../respostas/03-matrizes/facil/ex02_soma_das_linhas.py)

---

## Exercício 03: Diagonal principal

Leia uma matriz quadrada `N x N` e mostre os elementos da diagonal principal e a soma deles.

**Entrada:**
```text
3
1 2 3
4 5 6
7 8 9
```
**Saída:**
```text
Diagonal: 1 5 9
Soma: 15
```

> 💡 **Dica:** na diagonal principal, o número da linha é igual ao da coluna: `matriz[i][i]`.

[✅ Ver resposta](../../respostas/03-matrizes/facil/ex03_diagonal_principal.py)
