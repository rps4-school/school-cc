# Simulado 03 · Questão 02 · Lista
# Exigido: nomes e idades em DUAS listas (com append); sem nomes repetidos;
# resultados calculados a partir das listas.

IDADE_MINIMA = 12

nomes = []
idades = []
recusados = 0

continuar = "SIM"
while continuar != "NÃO" and continuar != "NAO":
    nome = input("Nome completo: ").strip()

    # "in" procura o nome na lista inteira.
    if nome in nomes:
        print("Leitor já cadastrado.")
    else:
        idade = int(input("Idade: "))
        if idade < IDADE_MINIMA:
            print(f"Leitor não pode se cadastrar. Idade mínima: {IDADE_MINIMA} anos.")
            recusados += 1
        else:
            nomes.append(nome)
            idades.append(idade)

    continuar = input("Deseja cadastrar outro leitor? (SIM/NÃO): ").strip().upper()
    print()

if len(nomes) == 0:
    print("Nenhum leitor cadastrado.")
else:
    print("Leitores cadastrados:")
    for i in range(len(nomes)):
        print(f"{i + 1}. {nomes[i]} - {idades[i]} anos")

    print()
    print(f"Leitor mais novo: {nomes[idades.index(min(idades))]}")
    print(f"Leitor mais velho: {nomes[idades.index(max(idades))]}")
    print(f"Média de idade: {sum(idades) / len(idades):.1f} anos")

print(f"Cadastros recusados por idade: {recusados}")
