# Exercício 01 · Par ou ímpar
# Conceitos: input(), int(), operador % (resto da divisão), if/else

numero = int(input())

# Um número é par quando o resto da divisão por 2 é zero.
if numero % 2 == 0:
    print("par")
else:
    print("ímpar")
