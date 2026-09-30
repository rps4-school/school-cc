# Simulado 02 · Questão 03 · Matriz
# Linhas = horários, colunas = cidades. Toda conta é feita lendo a matriz.

matriz = []
for i in range(4):
    linha = []
    for j in range(4):
        linha.append(float(input(f"Temperatura [{i}][{j}]: ")))
    matriz.append(linha)

print()
print("Temperaturas registradas:")
for linha in matriz:
    print("".join(f"{valor:>7.1f}" for valor in linha))
print()

cidade = int(input("Digite a cidade (coluna 0 a 3): "))
operacao = input("Digite a operação (S/M/X/N): ").strip()

if cidade < 0 or cidade > 3:
    print("Cidade inválida.")
else:
    # Pega a coluna escolhida: um valor de cada linha.
    valores = []
    for i in range(4):
        valores.append(matriz[i][cidade])

    if operacao == "S":
        resultado = sum(valores)
    elif operacao == "M":
        resultado = sum(valores) / len(valores)
    elif operacao == "X":
        resultado = max(valores)
    elif operacao == "N":
        resultado = min(valores)
    else:
        resultado = None

    if resultado is None:
        print("Opção Inválida")
    else:
        print("Valores analisados: " + ", ".join(str(v) for v in valores))
        print(f"Resultado ({operacao}): {round(resultado, 2)}")
