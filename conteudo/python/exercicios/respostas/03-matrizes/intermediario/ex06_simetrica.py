# Exercício 06 · Matriz simétrica
# Conceitos: variável "bandeira" (flag), comparar m[i][j] com m[j][i]

n = int(input())

matriz = []
for _ in range(n):
    matriz.append([int(x) for x in input().split()])

simetrica = True  # supomos que sim, até provar o contrário
for i in range(n):
    for j in range(n):
        if matriz[i][j] != matriz[j][i]:
            simetrica = False

if simetrica:
    print("Simétrica")
else:
    print("Não simétrica")

# Melhoria: basta olhar acima da diagonal, usando range(i + 1, n) no for de dentro.
