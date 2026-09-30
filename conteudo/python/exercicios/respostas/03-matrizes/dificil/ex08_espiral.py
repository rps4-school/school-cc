# Exercício 08 · Espiral
# Conceitos: quatro limites que vão encolhendo, range() de trás para frente

linhas, colunas = [int(x) for x in input().split()]

matriz = []
for _ in range(linhas):
    matriz.append([int(x) for x in input().split()])

resultado = []
topo, base = 0, linhas - 1
esquerda, direita = 0, colunas - 1

while topo <= base and esquerda <= direita:
    # 1. Linha de cima, da esquerda para a direita.
    for j in range(esquerda, direita + 1):
        resultado.append(matriz[topo][j])
    topo += 1

    # 2. Coluna da direita, de cima para baixo.
    for i in range(topo, base + 1):
        resultado.append(matriz[i][direita])
    direita -= 1

    # 3. Linha de baixo, da direita para a esquerda (se ainda sobrar linha).
    if topo <= base:
        for j in range(direita, esquerda - 1, -1):
            resultado.append(matriz[base][j])
        base -= 1

    # 4. Coluna da esquerda, de baixo para cima (se ainda sobrar coluna).
    if esquerda <= direita:
        for i in range(base, topo - 1, -1):
            resultado.append(matriz[i][esquerda])
        esquerda += 1

print(" ".join(str(x) for x in resultado))
