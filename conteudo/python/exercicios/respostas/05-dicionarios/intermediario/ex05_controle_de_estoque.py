# Exercício 05 · Controle de estoque
# Conceitos: atualizar valores de um dicionário e validar antes de guardar

estoque = {}
quantidade = int(input())
for i in range(quantidade):
    nome, qtd = input().split()
    estoque[nome] = int(qtd)

movimentos = int(input())
for i in range(movimentos):
    nome, mudanca = input().split()
    # int("+6") é 6 e int("-4") é -4: dá para somar direto
    novo = estoque.get(nome, 0) + int(mudanca)   # produto novo começa com 0
    if novo < 0:
        print("Sem estoque suficiente de " + nome)   # não guarda: o estoque fica como estava
    else:
        estoque[nome] = novo   # atualiza ou, se for um produto novo, cria a chave no fim

print("Estoque final:")
for nome, qtd in estoque.items():
    print(nome + ":", qtd)
