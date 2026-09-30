# Exercício 05 · Ano bissexto
# Conceitos: %, and, or, parênteses para agrupar condições

ano = int(input())

# "divisível por X" é o mesmo que "resto da divisão por X igual a zero".
bissexto = (ano % 4 == 0 and ano % 100 != 0) or ano % 400 == 0

if bissexto:
    print(f"{ano} é bissexto")
else:
    print(f"{ano} não é bissexto")
