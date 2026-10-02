# Simulado 04 · Questão 04 · Matriz
# Exigido: a conta usa os valores lidos da matriz (matriz[linha][j]), num laço.

linha_escolhida = int(input("Linha (0 a 2): "))
while linha_escolhida < 0 or linha_escolhida > 2:
    linha_escolhida = int(input("Linha inválida! Informe de 0 a 2: "))

operacao = input("Operação (S para soma, M para média): ")
while operacao != "S" and operacao != "M":
    operacao = input("Operação inválida! Digite S ou M: ")

matriz = []
for i in range(3):
    linha = []
    for j in range(3):
        linha.append(int(input("Valor [" + str(i) + "][" + str(j) + "]: ")))
    matriz.append(linha)

# Mostra a matriz como tabela, uma linha por vez.
print()
for i in range(3):
    print(str(matriz[i][0]) + "\t" + str(matriz[i][1]) + "\t" + str(matriz[i][2]))

# Na linha escolhida, só a coluna (j) muda.
soma = 0
for j in range(3):
    soma = soma + matriz[linha_escolhida][j]

print()
if operacao == "S":
    print("Soma da linha " + str(linha_escolhida) + ":", soma)
else:
    print("Média da linha " + str(linha_escolhida) + ":", round(soma / 3, 2))
