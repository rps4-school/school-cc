# Exercício 06 · Segundo maior
# Conceitos: max(), list comprehension com filtro, lista vazia é "falsa"

numeros = [int(x) for x in input().split()]

maior = max(numeros)

# Todos os números, menos os que são iguais ao maior.
restantes = [n for n in numeros if n != maior]

# Uma lista vazia vale como False em um if.
if restantes:
    print(f"Segundo maior: {max(restantes)}")
else:
    print("Não existe segundo maior")
