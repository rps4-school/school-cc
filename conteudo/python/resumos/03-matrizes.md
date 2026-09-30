# 🔢 Matrizes

> [← Listas](02-listas.md) · [Voltar para Python](../README.md)

**Nível:** 🟡 Intermediário

Em Python, uma **matriz** é uma **lista de listas**: cada lista de dentro é uma linha.

```python
matriz = [
    [1, 2, 3],   # linha 0
    [4, 5, 6],   # linha 1
]
```

## Acessando elementos

Use `matriz[linha][coluna]`, com os dois índices começando em **0**:

```
            coluna 0  coluna 1  coluna 2
linha 0  →     1         2         3
linha 1  →     4         5         6
```

| Código | Resultado | O que é |
| ------ | --------- | ------- |
| `matriz[1][2]` | `6` | Linha 1, coluna 2 |
| `matriz[0]` | `[1, 2, 3]` | A linha 0 inteira |
| `len(matriz)` | `2` | Número de **linhas** |
| `len(matriz[0])` | `3` | Número de **colunas** |

## Percorrendo: dois `for`, um dentro do outro

```python
for i in range(len(matriz)):          # cada linha
    for j in range(len(matriz[0])):   # cada coluna
        print(matriz[i][j])
```

## Lendo do teclado

Formato usado nos exercícios: primeiro `linhas colunas`, depois uma linha por vez.

```
2 3
1 2 3
4 5 6
```

```python
linhas, colunas = [int(x) for x in input().split()]
matriz = []
for _ in range(linhas):   # _ = "não vou usar essa variável"
    matriz.append([int(x) for x in input().split()])
```

## Imprimindo

```python
for linha in matriz:
    print(" ".join(str(n) for n in linha))
```

## Criando uma matriz vazia

```python
zeros = [[0] * colunas for _ in range(linhas)]   # ✅ certo
```

> ⚠️ **Armadilha:** `[[0] * colunas] * linhas` cria linhas que são **a mesma lista**. Se você mudar uma, todas mudam!

## Padrões úteis

| Quer... | Código |
| ------- | ------ |
| Somar tudo | `sum(sum(linha) for linha in matriz)` |
| Somar a linha `i` | `sum(matriz[i])` |
| Pegar a coluna `j` | `[linha[j] for linha in matriz]` |
| Diagonal principal (matriz quadrada) | `[matriz[i][i] for i in range(n)]` |
| Diagonal secundária | `[matriz[i][n - 1 - i] for i in range(n)]` |
| Transposta | `[list(col) for col in zip(*matriz)]` |

## 📚 Referências

- [Tutorial Python: List comprehensions aninhadas](https://docs.python.org/pt-br/3/tutorial/datastructures.html#nested-list-comprehensions)
- [Python FAQ: Como criar uma lista multidimensional?](https://docs.python.org/pt-br/3/faq/programming.html#how-do-i-create-a-multidimensional-list)
