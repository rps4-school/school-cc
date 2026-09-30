# Simulado 03 · Questão 03 · Matriz
# Linhas = alunos, colunas = provas. Consultas repetidas até a operação F.

matriz = []
for i in range(4):
    linha = []
    for j in range(4):
        linha.append(float(input(f"Nota do aluno {i}, prova {j}: ")))
    matriz.append(linha)

print()
print("Boletim:")
for i in range(4):
    print(f"Aluno {i}:" + "".join(f"{nota:>6.1f}" for nota in matriz[i]))
print()

operacao = input("Digite a operação (S/M/X/N, ou F para fim): ").strip()
while operacao != "F":
    aluno = int(input("Digite o aluno (linha 0 a 3): "))

    if aluno < 0 or aluno > 3:
        print("Aluno inválido.")
        print()
        operacao = input("Digite a operação (S/M/X/N, ou F para fim): ").strip()
        continue

    notas = matriz[aluno]  # a linha inteira é a lista de notas do aluno
    if operacao == "S":
        print(f"Soma das notas: {round(sum(notas), 2)}")
    elif operacao == "M":
        media = sum(notas) / len(notas)
        situacao = "APROVADO" if media >= 7 else "REPROVADO"
        print(f"Média: {round(media, 2)} ({situacao})")
    elif operacao == "X":
        print(f"Maior nota: {max(notas)}")
    elif operacao == "N":
        print(f"Menor nota: {min(notas)}")
    else:
        print("Opção Inválida")
    print()
    operacao = input("Digite a operação (S/M/X/N, ou F para fim): ").strip()

print("Consulta encerrada.")
