# Exercício 04 · Nome em escada
# Conceitos: fatiamento nome[:i], range() e upper()

nome = input().upper()

# Na volta i, mostramos as i primeiras letras: nome[:1], nome[:2], ...
for i in range(1, len(nome) + 1):
    print(nome[:i])
