# Exercício 09 · Calculadora com tabela de funções
# Conceitos: funções como valores de um dicionário, while com break e validação


def somar(a, b):
    return a + b


def subtrair(a, b):
    return a - b


def multiplicar(a, b):
    return a * b


def dividir(a, b):
    return a / b


# Os valores são as próprias funções (sem parênteses: não estão sendo chamadas aqui)
operacoes = {"+": somar, "-": subtrair, "*": multiplicar, "/": dividir}

feitas = 0
while True:
    linha = input()
    if linha == "fim":
        break

    a, operador, b = linha.split()
    a = int(a)
    b = int(b)

    if operador not in operacoes:
        print("Operação inválida: " + operador)
    elif operador == "/" and b == 0:
        print("Erro: divisão por zero")
    else:
        funcao = operacoes[operador]      # pega a função guardada no dicionário
        resultado = funcao(a, b)          # e chama com os dois números
        print(a, operador, b, "=", resultado)
        feitas += 1

print("Contas feitas:", feitas)
