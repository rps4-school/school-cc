# Exercício 07 · Calculadora de IMC
# Conceitos: potência (**), faixas com elif, guardar resultado em variável

peso = float(input())
altura = float(input())

if peso <= 0 or altura <= 0:
    print("Dados inválidos")
else:
    imc = peso / altura ** 2
    print(f"IMC: {imc:.2f}")

    # Como os elif são testados em ordem, cada um já sabe que
    # as faixas anteriores não valeram. Por isso basta o limite de cima.
    if imc < 18.5:
        classificacao = "Abaixo do peso"
    elif imc < 25:
        classificacao = "Peso normal"
    elif imc < 30:
        classificacao = "Sobrepeso"
    elif imc < 35:
        classificacao = "Obesidade grau I"
    elif imc < 40:
        classificacao = "Obesidade grau II"
    else:
        classificacao = "Obesidade grau III"

    print(classificacao)
