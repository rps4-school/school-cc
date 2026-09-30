# Exercício 07 · Multiplicação de matrizes
# Conceitos: função para não repetir código, três for aninhados


def ler_matriz():
    """Lê 'linhas colunas' e depois a matriz. Devolve (matriz, linhas, colunas)."""
    linhas, colunas = [int(x) for x in input().split()]
    matriz = []
    for _ in range(linhas):
        matriz.append([int(x) for x in input().split()])
    return matriz, linhas, colunas


a, linhas_a, colunas_a = ler_matriz()
b, linhas_b, colunas_b = ler_matriz()

# Só dá para multiplicar se colunas de A == linhas de B.
if colunas_a != linhas_b:
    print("Multiplicação impossível")
else:
    # O resultado tem o número de linhas de A e o de colunas de B.
    for i in range(linhas_a):
        linha_resultado = []
        for j in range(colunas_b):
            # Linha i de A "vezes" coluna j de B.
            soma = 0
            for k in range(colunas_a):
                soma += a[i][k] * b[k][j]
            linha_resultado.append(soma)
        print(" ".join(str(x) for x in linha_resultado))
