# Exercício 03 · Saudação
# Conceitos: parâmetro com valor padrão e um dicionário dentro da função


def saudacao(nome, periodo="manhã"):
    frases = {"manhã": "Bom dia", "tarde": "Boa tarde", "noite": "Boa noite"}
    return frases[periodo] + ", " + nome + "!"


nome = input()
periodo = input()

if periodo == "":
    print(saudacao(nome))            # sem o segundo argumento: periodo vale "manhã"
else:
    print(saudacao(nome, periodo))
