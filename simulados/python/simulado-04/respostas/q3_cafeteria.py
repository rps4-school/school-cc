# Simulado 04 · Questão 03 · Matriz
# Exigido: os 9 valores ficam numa matriz 3x3 (lista de listas).

cafes = ["Espresso", "Cappuccino", "Cold brew"]

# Cada linha é um café; as colunas são preço, preparo e nota.
matriz = []
for i in range(3):
    print(cafes[i])
    linha = []
    linha.append(float(input("Preço: ")))
    linha.append(float(input("Preparo (min): ")))
    linha.append(float(input("Nota: ")))
    matriz.append(linha)

# a) Tabela: o \t separa as colunas.
print()
print("Café\tPreço\tPreparo\tNota")
for i in range(3):
    print(cafes[i] + "\t" + str(matriz[i][0]) + "\t" + str(matriz[i][1]) + "\t" + str(matriz[i][2]))

# b) Preço médio: soma a coluna 0 de cada linha.
soma_precos = 0
for i in range(3):
    soma_precos = soma_precos + matriz[i][0]

# c) Diagonal principal: linha e coluna com o mesmo índice, matriz[i][i].
soma_diagonal = 0
for i in range(3):
    soma_diagonal = soma_diagonal + matriz[i][i]

print()
print("Preço médio:", round(soma_precos / 3, 2))
print("Soma da diagonal principal:", soma_diagonal)
