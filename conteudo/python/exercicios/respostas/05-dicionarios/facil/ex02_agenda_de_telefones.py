# Exercício 02 · Agenda de telefones
# Conceitos: preencher um dicionário num laço e testar a chave com in

quantidade = int(input())

agenda = {}
for i in range(quantidade):
    nome, telefone = input().split()   # "Ana 99999-1234" vira duas variáveis
    agenda[nome] = telefone            # a chave é o nome; o valor, o telefone

procurado = input()

# in procura entre as CHAVES do dicionário
if procurado in agenda:
    print("Telefone de " + procurado + ": " + agenda[procurado])
else:
    print(procurado + " não está na agenda")
