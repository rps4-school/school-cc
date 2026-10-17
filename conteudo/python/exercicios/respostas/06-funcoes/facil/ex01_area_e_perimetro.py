# Exercício 01 · Área e perímetro
# Conceitos: def, parâmetros e return (a função calcula; o print fica fora dela)


def area(base, altura):
    return base * altura


def perimetro(base, altura):
    return 2 * (base + altura)


base = float(input())
altura = float(input())

# O valor devolvido pelo return aparece no lugar da chamada
print("Área:", area(base, altura))
print("Perímetro:", perimetro(base, altura))
