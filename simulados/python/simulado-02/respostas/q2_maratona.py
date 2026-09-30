# Simulado 02 · Questão 02 · Lista
# Exigido: nomes e idades em DUAS listas (com append); resultados calculados a partir das listas.

IDADE_MINIMA = 18

nomes = []
idades = []

continuar = "SIM"
while continuar != "NÃO" and continuar != "NAO":
    nome = input("Nome completo: ")
    idade = int(input("Idade: "))

    if idade < IDADE_MINIMA:
        print(f"Corredor não pode se inscrever. Idade mínima: {IDADE_MINIMA} anos.")
    else:
        nomes.append(nome)
        idades.append(idade)

    continuar = input("Deseja inscrever outro corredor? (SIM/NÃO): ").strip().upper()
    print()

if len(nomes) == 0:
    print("Nenhum corredor inscrito.")
else:
    print("Corredores inscritos:")
    for i in range(len(nomes)):
        print(f"{nomes[i]} - {idades[i]} anos")

    # Percorre a lista guardando a posição da menor idade vista até agora.
    posicao_mais_novo = 0
    for i in range(1, len(idades)):
        if idades[i] < idades[posicao_mais_novo]:
            posicao_mais_novo = i

    print()
    print(f"Corredor mais novo: {nomes[posicao_mais_novo]}")
    print(f"Média de idade: {sum(idades) / len(idades):.1f} anos")
