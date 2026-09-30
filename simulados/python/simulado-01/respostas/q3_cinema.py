# Simulado 01 · Questão 03 · Matriz
# Linhas = sessões, colunas = salas. Toda conta é feita lendo a matriz.

matriz = []
for i in range(3):
    linha = []
    for j in range(3):
        linha.append(int(input(f"Digite o valor da posição [{i}][{j}]: ")))
    matriz.append(linha)

print()
for linha in matriz:
    print("".join(f"{valor:>5}" for valor in linha))

# Ana: público da sala 1 (coluna 0) nas três sessões.
ana = 0
for i in range(3):
    ana += matriz[i][0]

# Bruno: público da sessão 2 (linha 1) em todas as salas.
bruno = sum(matriz[1])

# Caio: diagonal principal (sessão 1 na sala 1, sessão 2 na sala 2...).
caio = 0
for i in range(3):
    caio += matriz[i][i]

print()
print(f"Ana = {ana}")
print(f"Bruno = {bruno}")
print(f"Caio = {caio}")

# Empates não são tratados (o enunciado pede para ignorar).
if ana > bruno and ana > caio:
    vencedor, valor = "Ana", ana
elif bruno > caio:
    vencedor, valor = "Bruno", bruno
else:
    vencedor, valor = "Caio", caio

print()
print(f"Maior resultado: {vencedor}, com {valor}.")
