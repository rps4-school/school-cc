# Exercício 09 · Jogo da velha
# Conceitos: matriz de caracteres, montar as "trincas", any()

# list("XO.") -> ["X", "O", "."]
tabuleiro = [list(input().strip()) for _ in range(3)]

# As 8 formas de vencer: 3 linhas, 3 colunas e 2 diagonais.
trincas = []
for i in range(3):
    trincas.append(tabuleiro[i])                            # linha i
for j in range(3):
    trincas.append([tabuleiro[i][j] for i in range(3)])     # coluna j
trincas.append([tabuleiro[i][i] for i in range(3)])         # diagonal principal
trincas.append([tabuleiro[i][2 - i] for i in range(3)])     # diagonal secundária

vencedor = None
for trinca in trincas:
    if trinca[0] != "." and trinca[0] == trinca[1] == trinca[2]:
        vencedor = trinca[0]

# any() devolve True se pelo menos um item for verdadeiro.
tem_casa_vazia = any("." in linha for linha in tabuleiro)

if vencedor is not None:
    print(f"{vencedor} venceu")
elif tem_casa_vazia:
    print("Em andamento")
else:
    print("Empate")
