# Exercício 07 · Palíndromo
# Conceitos: replace(), lower() e fatiamento [::-1]

frase = input()

# Sem espaços e sem diferença entre maiúscula e minúscula
limpa = frase.replace(" ", "").lower()

# Um palíndromo é igual à sua versão invertida
if limpa == limpa[::-1]:
    print("É um palíndromo")
else:
    print("Não é um palíndromo")
