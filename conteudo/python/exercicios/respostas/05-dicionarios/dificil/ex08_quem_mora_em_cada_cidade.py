# Exercício 08 · Quem mora em cada cidade?
# Conceitos: "virar" os dados (a cidade passa a ser a chave) e ordenar chaves e listas

quantidade = int(input())

moradores = {}
for i in range(quantidade):
    nome, cidade = input().split()
    if cidade not in moradores:
        moradores[cidade] = []
    moradores[cidade].append(nome)

# sorted(dicionário) devolve as chaves em ordem alfabética
for cidade in sorted(moradores):
    print(cidade + ": " + ", ".join(sorted(moradores[cidade])))
