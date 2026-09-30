# 📋 Listas

> [← Condicionais](01-condicionais.md) · Próximo: [Matrizes →](03-matrizes.md)

**Nível:** 🟡 Intermediário

Uma **lista** guarda vários valores em ordem, dentro de uma só variável.

```python
notas = [7.5, 9, 6]
nomes = ["Ana", "Bia", "Caio"]
vazia = []
```

## Acessando elementos

As posições (**índices**) começam em **0**:

```
notas =  [ 7.5,   9,   6  ]
índice:     0     1    2
negativo:  -3    -2   -1
```

| Código | Resultado | O que faz |
| ------ | --------- | --------- |
| `notas[0]` | `7.5` | Primeiro elemento |
| `notas[-1]` | `6` | Último elemento |
| `notas[0:2]` | `[7.5, 9]` | Fatia do índice 0 **até** o 2 (o 2 não entra) |
| `notas[::-1]` | `[6, 9, 7.5]` | Lista invertida |
| `notas[1] = 10` | — | Troca o valor da posição 1 |

## Métodos (mudam a lista)

| Método | O que faz | Exemplo |
| ------ | --------- | ------- |
| `.append(x)` | Adiciona `x` no final | `notas.append(8)` |
| `.insert(i, x)` | Adiciona `x` na posição `i` | `notas.insert(0, 5)` |
| `.extend(outra)` | Adiciona todos os itens de `outra` | `notas.extend([1, 2])` |
| `.remove(x)` | Remove o **primeiro** `x` que encontrar | `notas.remove(9)` |
| `.pop()` | Remove e devolve o último item | `ultimo = notas.pop()` |
| `.sort()` | Ordena a própria lista | `notas.sort()` |
| `.reverse()` | Inverte a própria lista | `notas.reverse()` |
| `.count(x)` | Quantas vezes `x` aparece | `notas.count(9)` |
| `.index(x)` | Posição do primeiro `x` | `notas.index(9)` |

## Funções built-in (não mudam a lista)

| Função | O que faz | Exemplo com `[3, 1, 2]` |
| ------ | --------- | ----------------------- |
| `len(l)` | Quantidade de itens | `3` |
| `sum(l)` | Soma dos itens | `6` |
| `max(l)` / `min(l)` | Maior e menor | `3` / `1` |
| `sorted(l)` | **Nova** lista ordenada | `[1, 2, 3]` |
| `x in l` | Verifica se `x` está na lista | `2 in l` → `True` |

## Percorrendo uma lista

```python
for nota in notas:                # cada item
    print(nota)

for i in range(len(notas)):       # cada índice
    print(i, notas[i])

for i, nota in enumerate(notas):  # índice e item juntos
    print(i, nota)
```

`range(inicio, fim, passo)` gera números: `range(3)` gera `0, 1, 2`, e `range(1, 10, 2)` gera `1, 3, 5, 7, 9`.

## Lendo uma lista do teclado

Para ler números digitados na mesma linha, como `3 1 2`:

```python
numeros = [int(x) for x in input().split()]
```

| Parte | O que faz | Resultado |
| ----- | --------- | --------- |
| `input()` | Lê a linha | `"3 1 2"` |
| `.split()` | Quebra nos espaços | `["3", "1", "2"]` |
| `int(x) for x in ...` | Converte cada pedaço | `[3, 1, 2]` |

E para imprimir a lista separada por espaços:

```python
print(" ".join(str(n) for n in numeros))   # 3 1 2
```

`join` só junta **textos**, por isso o `str(n)`.

## List comprehension

Um jeito curto de criar uma lista a partir de outra:

```python
quadrados = [n ** 2 for n in range(5)]         # [0, 1, 4, 9, 16]
pares     = [n for n in numeros if n % 2 == 0] # só os pares
```

## ⚠️ Cuidado: cópia × referência

```python
a = [1, 2, 3]
b = a          # b é a MESMA lista que a
b.append(4)
print(a)       # [1, 2, 3, 4]  😱

c = a.copy()   # c é uma cópia de verdade (a[:] também funciona)
```

## 📚 Referências

- [Tutorial Python: Listas](https://docs.python.org/pt-br/3/tutorial/introduction.html#lists)
- [Tutorial Python: Mais sobre listas](https://docs.python.org/pt-br/3/tutorial/datastructures.html#more-on-lists)
- [Python Tutor: veja a lista mudando passo a passo](https://pythontutor.com/python-compiler.html#mode=edit)
