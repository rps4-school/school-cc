# Exercício 01 · Tamanho e inversão
# Conceitos: len() e fatiamento com passo negativo [::-1]

frase = input()

# len() conta todos os caracteres, inclusive espaços e pontuação
print(f"Tamanho: {len(frase)}")

# [::-1] percorre a string do fim para o começo
print(f"Invertida: {frase[::-1]}")
