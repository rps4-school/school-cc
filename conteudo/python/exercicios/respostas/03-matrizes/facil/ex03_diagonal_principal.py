# Exercício 03 · Diagonal principal
# Conceitos: matriz quadrada, matriz[i][i]

n = int(input())

matriz = []
for _ in range(n):
    matriz.append([int(x) for x in input().split()])

# Na diagonal principal, linha == coluna.
diagonal = [matriz[i][i] for i in range(n)]

print("Diagonal: " + " ".join(str(x) for x in diagonal))
print(f"Soma: {sum(diagonal)}")
