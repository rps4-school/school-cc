# Exercício 02 · Soma de cada linha
# Conceitos: cada linha é uma lista, sum(), enumerate(start=1)

linhas, colunas = [int(x) for x in input().split()]

matriz = []
for _ in range(linhas):
    matriz.append([int(x) for x in input().split()])

# enumerate devolve (número, item); start=1 faz a contagem começar em 1.
for numero, linha in enumerate(matriz, start=1):
    print(f"Linha {numero}: {sum(linha)}")
