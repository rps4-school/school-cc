# Exercício 01 · Soma e média
# Conceitos: ler lista com split(), sum(), len()

# "1 2 3 4" -> ["1", "2", "3", "4"] -> [1, 2, 3, 4]
numeros = [int(x) for x in input().split()]

soma = sum(numeros)
media = soma / len(numeros)

print(f"Soma: {soma}")
print(f"Média: {media:.2f}")
