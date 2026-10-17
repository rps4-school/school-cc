# Exercício 04 · Boletim da turma
# Conceitos: função que recebe uma lista, função com condicionais e uma chamando a outra


def media(notas):
    return sum(notas) / len(notas)


def situacao(media):
    if media >= 7:
        return "Aprovado"
    elif media >= 5:
        return "Recuperação"
    else:
        return "Reprovado"


alunos = int(input())
for i in range(alunos):
    partes = input().split()                    # ["Ana", "8", "7.5", "8.5"]
    nome = partes[0]
    notas = [float(x) for x in partes[1:]]      # as notas ainda são texto: converte cada uma
    m = media(notas)
    print(nome + ": média", round(m, 1), "-", situacao(m))
