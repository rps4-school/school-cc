# Exercício 06 · Notas por aluno
# Conceitos: o padrão "agrupar", um dicionário em que cada valor é uma lista

lancamentos = int(input())

notas = {}
for i in range(lancamentos):
    nome, nota = input().split()
    if nome not in notas:
        notas[nome] = []                 # primeira nota do aluno: começa com a lista vazia
    notas[nome].append(float(nota))      # notas[nome] é a lista; append muda a lista guardada

for nome, lista in notas.items():
    media = sum(lista) / len(lista)
    print(nome + ":", len(lista), "notas, média", round(media, 1))
