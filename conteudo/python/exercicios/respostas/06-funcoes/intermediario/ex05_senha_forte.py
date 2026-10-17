# Exercício 05 · Senha forte
# Conceitos: função que devolve uma lista; percorrer uma string com métodos de caractere


def problemas(senha):
    tem_maiuscula = False
    tem_minuscula = False
    tem_numero = False
    for c in senha:
        if c.isupper():
            tem_maiuscula = True
        elif c.islower():
            tem_minuscula = True
        elif c.isdigit():
            tem_numero = True

    faltando = []
    if len(senha) < 8:
        faltando.append("pelo menos 8 caracteres")
    if not tem_maiuscula:
        faltando.append("uma letra maiúscula")
    if not tem_minuscula:
        faltando.append("uma letra minúscula")
    if not tem_numero:
        faltando.append("um número")
    return faltando


lista = problemas(input())

if len(lista) == 0:
    print("Senha forte")
else:
    print("Senha fraca. Falta:")
    for item in lista:
        print("- " + item)
