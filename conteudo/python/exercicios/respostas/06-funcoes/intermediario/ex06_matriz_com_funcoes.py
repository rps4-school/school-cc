# Exercício 06 · Matriz com funções
# Conceitos: funções que leem, transformam e mostram uma matriz (lista de listas)


def ler_matriz(linhas):
    matriz = []
    for i in range(linhas):
        matriz.append([int(x) for x in input().split()])
    return matriz


def transposta(matriz):
    # A linha j da transposta é formada pelo elemento j de cada linha da original
    nova = []
    for j in range(len(matriz[0])):
        linha = []
        for i in range(len(matriz)):
            linha.append(matriz[i][j])
        nova.append(linha)
    return nova


def mostrar(matriz):
    for linha in matriz:
        print(" ".join([str(x) for x in linha]))


m = ler_matriz(int(input()))

print("Transposta:")
mostrar(transposta(m))

somas = [str(sum(linha)) for linha in m]
print("Soma das linhas: " + " ".join(somas))
