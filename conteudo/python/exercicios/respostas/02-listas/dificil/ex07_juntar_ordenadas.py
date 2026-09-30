# Exercício 07 · Juntar listas ordenadas
# Conceitos: while, dois índices, .extend(), fatiamento
# Essa técnica é o coração do algoritmo Merge Sort.

a = [int(x) for x in input().split()]
b = [int(x) for x in input().split()]

resultado = []
i = 0  # posição atual em a
j = 0  # posição atual em b

# Enquanto as duas listas ainda têm itens, pega o menor da "frente" de cada uma.
while i < len(a) and j < len(b):
    if a[i] <= b[j]:
        resultado.append(a[i])
        i += 1
    else:
        resultado.append(b[j])
        j += 1

# Uma delas acabou: o que sobrou da outra já está em ordem.
resultado.extend(a[i:])
resultado.extend(b[j:])

print(" ".join(str(n) for n in resultado))
