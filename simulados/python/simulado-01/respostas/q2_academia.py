# Simulado 01 · Questão 02 · Lista
# Exigido: nomes e idades em DUAS listas (com append); resultados calculados a partir das listas.

IDADE_MINIMA = 16

nomes = []
idades = []

resposta = input("Deseja cadastrar um novo aluno? (SIM/NÃO): ").strip().upper()
while resposta != "NÃO" and resposta != "NAO":
    nome = input("Nome completo: ")
    idade = int(input("Idade: "))

    if idade < IDADE_MINIMA:
        print(f"Aluno não pode se matricular. Idade mínima: {IDADE_MINIMA} anos.")
    else:
        nomes.append(nome)
        idades.append(idade)

    print()
    resposta = input("Deseja cadastrar um novo aluno? (SIM/NÃO): ").strip().upper()

print()
if len(nomes) == 0:
    print("Nenhum aluno matriculado.")
else:
    print("Alunos matriculados:")
    for i in range(len(nomes)):
        print(f"{i + 1}. {nomes[i]} - {idades[i]} anos")

    # As duas listas andam juntas: a posição da maior idade é a posição do nome.
    posicao_mais_velho = idades.index(max(idades))
    media = sum(idades) / len(idades)

    print()
    print(f"Aluno mais velho: {nomes[posicao_mais_velho]}")
    print(f"Média de idade: {media:.1f} anos")
