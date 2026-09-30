# Exercício 02 · Maior e menor
# Conceitos: max(), min() e a versão "na mão" com for

numeros = [int(x) for x in input().split()]

print(f"Maior: {max(numeros)}")
print(f"Menor: {min(numeros)}")

# Desafio extra: sem max() e min().
# Começamos supondo que o primeiro é o maior e o menor,
# e corrigimos sempre que aparecer alguém que ganhe dele.
#
# maior = numeros[0]
# menor = numeros[0]
# for n in numeros:
#     if n > maior:
#         maior = n
#     if n < menor:
#         menor = n
