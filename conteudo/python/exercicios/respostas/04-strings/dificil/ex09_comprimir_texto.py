# Exercício 09 · Comprimir texto
# Conceitos: percorrer a string por índice e comparar com o caractere anterior

texto = input()

resultado = ""
atual = texto[0]   # letra que estamos contando
quantas = 1        # quantas vezes ela apareceu seguida

for i in range(1, len(texto)):
    if texto[i] == atual:
        quantas += 1
    else:
        # A sequência acabou: guarda a letra e a contagem e começa outra
        resultado += atual + str(quantas)
        atual = texto[i]
        quantas = 1

# A última sequência não tem uma letra diferente depois dela, então guardamos aqui
resultado += atual + str(quantas)

print(resultado)
