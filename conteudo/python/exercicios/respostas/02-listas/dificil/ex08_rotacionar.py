# Exercício 08 · Rotacionar
# Conceitos: % para "dar a volta", juntar fatias com +

itens = input().split()
k = int(input())

n = len(itens)
k = k % n  # girar n vezes volta ao início; 7 % 5 == 2

# Os k últimos vão para a frente:
# [1 2 3 | 4 5] -> [4 5] + [1 2 3]
rotacionada = itens[n - k:] + itens[:n - k]

print(" ".join(rotacionada))
