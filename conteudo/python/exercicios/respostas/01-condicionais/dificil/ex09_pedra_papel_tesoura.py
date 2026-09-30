# Exercício 09 · Pedra, papel e tesoura
# Conceitos: .strip(), .lower(), not in, reduzir casos

jogador1 = input().strip().lower()  # "  Papel " -> "papel"
jogador2 = input().strip().lower()

opcoes = ("pedra", "papel", "tesoura")

if jogador1 not in opcoes or jogador2 not in opcoes:
    print("Jogada inválida")
elif jogador1 == jogador2:
    print("Empate")
# Só precisamos listar as 3 combinações em que o jogador 1 vence...
elif (
    (jogador1 == "pedra" and jogador2 == "tesoura")
    or (jogador1 == "tesoura" and jogador2 == "papel")
    or (jogador1 == "papel" and jogador2 == "pedra")
):
    print("Jogador 1 venceu")
# ...porque, se não foi inválida, nem empate, nem vitória do 1, o 2 venceu.
else:
    print("Jogador 2 venceu")
