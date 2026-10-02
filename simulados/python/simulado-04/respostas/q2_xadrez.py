# Simulado 04 · Questão 02 · Lista
# Exigido: nomes e idades em DUAS listas (com append); o mais velho é
# encontrado percorrendo a lista (sem max).

nomes = []
idades = []

quantidade = int(input("Quantidade de jogadores do time veterano: "))

# Jogador recusado não conta: repetimos até a lista ter "quantidade" nomes.
while len(nomes) < quantidade:
    nome = input("Nome completo do jogador: ")
    idade = int(input("Idade: "))
    if idade < 50:
        print(nome, "ainda não pode jogar no time veterano. Informe outro jogador.")
    else:
        nomes.append(nome)
        idades.append(idade)

print()
# A posição i é a mesma nas duas listas: nomes[i] tem idades[i] anos.
for i in range(len(nomes)):
    print("Nome:", nomes[i], "- Idade:", idades[i], "anos")

# Guarda a posição do mais velho e soma as idades no mesmo laço.
mais_velho = 0
soma = 0
for i in range(len(idades)):
    if idades[i] > idades[mais_velho]:
        mais_velho = i
    soma = soma + idades[i]

print()
print("Jogador mais experiente:", nomes[mais_velho])
print("Média de idade do time:", soma / len(idades), "anos")
