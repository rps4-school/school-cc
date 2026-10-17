# Exercício 09 · Tabela do campeonato
# Conceitos: somar pontos num dicionário e montar a classificação escolhendo o melhor a cada volta

jogos = int(input())

pontos = {}
for i in range(jogos):
    time_a, gols_a, x, gols_b, time_b = input().split()   # o "x" é só um separador
    gols_a = int(gols_a)
    gols_b = int(gols_b)

    # Todo time que jogou entra na tabela, mesmo sem pontos
    pontos[time_a] = pontos.get(time_a, 0)
    pontos[time_b] = pontos.get(time_b, 0)

    if gols_a > gols_b:
        pontos[time_a] += 3
    elif gols_b > gols_a:
        pontos[time_b] += 3
    else:
        pontos[time_a] += 1
        pontos[time_b] += 1

# Classificação: a cada volta, acha o melhor time que sobrou, mostra e tira da lista
restantes = list(pontos.keys())
posicao = 1
while len(restantes) > 0:
    melhor = restantes[0]
    for time in restantes:
        # Mais pontos ganha; empatou nos pontos, ganha quem vem antes no alfabeto
        if pontos[time] > pontos[melhor] or (pontos[time] == pontos[melhor] and time < melhor):
            melhor = time

    if pontos[melhor] == 1:
        palavra = "ponto"
    else:
        palavra = "pontos"
    print(str(posicao) + ". " + melhor + " - " + str(pontos[melhor]) + " " + palavra)

    restantes.remove(melhor)
    posicao += 1
