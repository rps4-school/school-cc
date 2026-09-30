# Exercício 03 · Inverter a lista
# Conceitos: fatiamento [::-1], " ".join()

# Aqui nem precisamos converter para int: vamos só reorganizar os textos.
itens = input().split()

invertida = itens[::-1]  # [início:fim:passo]; passo -1 anda de trás para frente

print(" ".join(invertida))
