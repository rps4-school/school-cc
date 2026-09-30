# Exercício 04 · Tipo de triângulo
# Conceitos: condições compostas com or, comparação encadeada (a == b == c)

a = int(input())
b = int(input())
c = int(input())

# Desigualdade triangular: cada lado precisa ser menor que a soma dos outros dois.
nao_forma = (
    a <= 0 or b <= 0 or c <= 0
    or a >= b + c
    or b >= a + c
    or c >= a + b
)

if nao_forma:
    print("Não forma um triângulo")
elif a == b == c:
    print("Equilátero")
elif a == b or a == c or b == c:  # como não são os 3 iguais, são exatamente 2
    print("Isósceles")
else:
    print("Escaleno")
