# Simulado 02 · Questão 01 · Condicional
# Comando exigido: if/elif/else (sem listas nem dicionários)

botao1 = int(input("Primeiro botão (0 a 5): "))
botao2 = int(input("Segundo botão (0 a 5): "))

if botao1 < 0 or botao1 > 5 or botao2 < 0 or botao2 > 5:
    print("Botão inexistente.")
else:
    soma = botao1 + botao2

    if soma == 0:
        receita = "OMELETE"
    elif soma == 1:
        receita = "PANQUECA"
    elif soma == 2:
        receita = "TAPIOCA"
    elif soma == 3:
        receita = "CUSCUZ"
    elif soma == 4:
        receita = "CREPE"
    elif soma == 5:
        receita = "SANDUÍCHE"
    elif soma == 6:
        receita = "SALADA"
    elif soma == 7:
        receita = "SOPA"
    else:
        receita = ""  # soma 8, 9 ou 10: não existe receita

    if receita == "":
        print("Combinação inválida.")
    else:
        print(f"Receita: {receita}")
        # Regra extra: botões iguais preparam porção dupla.
        if botao1 == botao2:
            print("Porção dupla!")
