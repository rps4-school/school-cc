# Exercício 01 · Soma total
# Conceitos: ler matriz, dois for aninhados, acumulador

linhas, colunas = [int(x) for x in input().split()]

matriz = []
for _ in range(linhas):
    matriz.append([int(x) for x in input().split()])

soma = 0
for i in range(linhas):
    for j in range(colunas):
        soma += matriz[i][j]

print(f"Soma: {soma}")

# Versão curta com built-ins: soma de cada linha, depois soma dessas somas.
# soma = sum(sum(linha) for linha in matriz)
