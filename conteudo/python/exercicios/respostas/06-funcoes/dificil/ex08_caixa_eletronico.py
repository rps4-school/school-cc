# Exercício 08 · Caixa eletrônico
# Conceitos: função que devolve um dicionário, divisão inteira (//) e resto (%), outra função de apoio


def sacar(valor):
    entregues = {}
    for nota in [200, 100, 50, 20, 10]:
        quantidade = valor // nota      # quantas notas desse valor cabem
        if quantidade > 0:
            entregues[nota] = quantidade
            valor = valor % nota        # o que ainda falta entregar
    return entregues


def plural(quantidade, palavra):
    if quantidade == 1:
        return "1 " + palavra
    return str(quantidade) + " " + palavra + "s"


valor = int(input())

if valor % 10 != 0:
    print("Valor inválido: use um múltiplo de 10")
else:
    notas = sacar(valor)
    total = 0
    for nota, quantidade in notas.items():
        print(plural(quantidade, "nota") + " de R$ " + str(nota))
        total += quantidade
    print("Total: " + plural(total, "nota"))
