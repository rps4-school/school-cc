# Exercício 04 · Transposta
# Conceitos: inverter a ordem dos for (coluna por fora, linha por dentro)

linhas, colunas = [int(x) for x in input().split()]

matriz = []
for _ in range(linhas):
    matriz.append([int(x) for x in input().split()])

# Cada COLUNA da original vira uma LINHA da transposta.
for j in range(colunas):
    nova_linha = []
    for i in range(linhas):
        nova_linha.append(matriz[i][j])
    print(" ".join(str(x) for x in nova_linha))

# Versão curta com built-ins: zip(*matriz) agrupa os elementos de cada coluna.
# for coluna in zip(*matriz):
#     print(" ".join(str(x) for x in coluna))
