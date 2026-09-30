# Simulado 03 · Questão 01 · Condicional + repetição
# Comando exigido: if/elif/else dentro de um while (sem listas nem dicionários)

botao1 = int(input("Primeiro botão (0 a 5, ou -1 para sair): "))
while botao1 != -1:
    botao2 = int(input("Segundo botão (0 a 5): "))

    if botao1 < 0 or botao1 > 5 or botao2 < 0 or botao2 > 5:
        print("Botão inexistente.")
    else:
        soma = botao1 + botao2
        if soma == 0:
            print("Manobra: DECOLAR")
        elif soma == 1:
            print("Manobra: SUBIR")
        elif soma == 2:
            print("Manobra: DESCER")
        elif soma == 3:
            print("Manobra: GIRAR")
        elif soma == 4:
            print("Manobra: AVANÇAR")
        elif soma == 5:
            print("Manobra: RECUAR")
        elif soma == 6:
            print("Manobra: FOTOGRAFAR")
        elif soma == 7:
            print("Manobra: POUSAR")
        else:
            print("Combinação inválida.")

    print()
    botao1 = int(input("Primeiro botão (0 a 5, ou -1 para sair): "))

print("Controle desligado.")
