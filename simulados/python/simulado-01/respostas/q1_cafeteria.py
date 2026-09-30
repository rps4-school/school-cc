# Simulado 01 · Questão 01 · Condicional
# Comando exigido: if/elif/else (sem listas nem dicionários)

botao1 = int(input("Primeiro botão (0 a 5): "))
botao2 = int(input("Segundo botão (0 a 5): "))

# Primeiro, valida os botões: só existem os de 0 a 5.
if botao1 < 0 or botao1 > 5 or botao2 < 0 or botao2 > 5:
    print("Botão inexistente.")
else:
    soma = botao1 + botao2

    # Cada soma corresponde a uma bebida. Somas acima de 7 não existem.
    if soma == 0:
        print(f"Soma {soma}: ÁGUA")
    elif soma == 1:
        print(f"Soma {soma}: CAFÉ")
    elif soma == 2:
        print(f"Soma {soma}: CAPPUCCINO")
    elif soma == 3:
        print(f"Soma {soma}: CHÁ GELADO")
    elif soma == 4:
        print(f"Soma {soma}: CHOCOLATE QUENTE")
    elif soma == 5:
        print(f"Soma {soma}: SUCO")
    elif soma == 6:
        print(f"Soma {soma}: SMOOTHIE")
    elif soma == 7:
        print(f"Soma {soma}: MILKSHAKE")
    else:
        print(f"Soma {soma}: combinação inválida.")
