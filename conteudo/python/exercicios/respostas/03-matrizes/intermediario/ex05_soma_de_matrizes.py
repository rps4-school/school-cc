# Exercício 05 · Soma de matrizes
# Conceitos: ler duas matrizes seguidas, somar posição a posição

linhas, colunas = [int(x) for x in input().split()]

a = []
for _ in range(linhas):
    a.append([int(x) for x in input().split()])

b = []
for _ in range(linhas):
    b.append([int(x) for x in input().split()])

for i in range(linhas):
    linha_resultado = []
    for j in range(colunas):
        linha_resultado.append(a[i][j] + b[i][j])
    print(" ".join(str(x) for x in linha_resultado))
