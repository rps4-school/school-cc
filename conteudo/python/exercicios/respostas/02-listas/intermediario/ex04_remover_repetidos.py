# Exercício 04 · Remover repetidos
# Conceitos: lista vazia + append, operador not in

numeros = [int(x) for x in input().split()]

sem_repetidos = []
for n in numeros:
    # Só adiciona se ainda não estiver no resultado.
    if n not in sem_repetidos:
        sem_repetidos.append(n)

print(" ".join(str(n) for n in sem_repetidos))
