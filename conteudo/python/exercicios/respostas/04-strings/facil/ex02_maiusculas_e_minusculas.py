# Exercício 02 · Maiúsculas e minúsculas
# Conceitos: upper(), lower(), capitalize(), title() e count()

frase = input()
trecho = input()

# Os métodos de texto não mudam a frase original: eles devolvem uma string nova
print(f"Maiúsculas: {frase.upper()}")
print(f"Minúsculas: {frase.lower()}")
print(f"Capitalize: {frase.capitalize()}")
print(f"Title: {frase.title()}")

# count() diferencia maiúscula de minúscula: "a" não conta o "A"
print(f"Ocorrências de \"{trecho}\": {frase.count(trecho)}")
