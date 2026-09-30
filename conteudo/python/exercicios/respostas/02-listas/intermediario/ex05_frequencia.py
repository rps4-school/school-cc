# Exercício 05 · Frequência
# Conceitos: .count(), lista de "já vistos"

numeros = [int(x) for x in input().split()]

ja_mostrados = []
for n in numeros:
    if n not in ja_mostrados:
        ja_mostrados.append(n)
        print(f"{n}: {numeros.count(n)}")
