# Exercício 02 · Maior de dois
# Conceitos: if/elif/else, f-string

a = int(input())
b = int(input())

# Três casos possíveis: a é maior, b é maior ou são iguais.
if a > b:
    print(f"O maior é {a}")
elif b > a:
    print(f"O maior é {b}")
else:
    print("Os números são iguais")
