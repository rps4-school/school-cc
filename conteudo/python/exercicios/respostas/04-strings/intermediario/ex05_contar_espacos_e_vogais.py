# Exercício 05 · Contar espaços e vogais
# Conceitos: count(), lower() e for sobre uma string

frase = input()

print(f"Espaços: {frase.count(' ')}")

# lower() faz o "A" contar como "a"
minuscula = frase.lower()

# Um for sobre a string "aeiou" visita uma vogal por vez
for vogal in "aeiou":
    print(f"{vogal}: {minuscula.count(vogal)}")
