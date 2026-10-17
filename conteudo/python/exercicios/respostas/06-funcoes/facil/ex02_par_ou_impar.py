# Exercício 02 · Par ou ímpar
# Conceitos: função que devolve True/False, usada num if; listas


def eh_par(numero):
    # A comparação já é True ou False: dá para devolver direto
    return numero % 2 == 0


numeros = [int(x) for x in input().split()]

pares = 0
for n in numeros:
    if eh_par(n):
        print(n, "é par")
        pares += 1
    else:
        print(n, "é ímpar")

print("Total de pares:", pares)
