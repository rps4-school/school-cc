# Exercício 03 · Contagem de votos
# Conceitos: o padrão "contar com dicionário" e percorrer com items()

quantidade = int(input())

votos = {}
for i in range(quantidade):
    nome = input()
    # get(nome, 0) devolve 0 no primeiro voto do candidato; depois, o total até agora
    votos[nome] = votos.get(nome, 0) + 1

# O dicionário lembra a ordem em que cada chave entrou
for nome, total in votos.items():
    print(nome + ":", total)
