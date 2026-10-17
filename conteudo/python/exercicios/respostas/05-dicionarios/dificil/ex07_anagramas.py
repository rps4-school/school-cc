# Exercício 07 · Anagramas
# Conceitos: uma chave calculada (as letras em ordem) para agrupar num dicionário de listas

quantidade = int(input())

grupos = {}
for i in range(quantidade):
    palavra = input()
    # Anagramas têm as mesmas letras: em ordem, viram a mesma string ("roma" -> "amor")
    chave = "".join(sorted(palavra))
    if chave not in grupos:
        grupos[chave] = []
    grupos[chave].append(palavra)

# Os grupos saem na ordem em que cada chave apareceu pela primeira vez
for palavras in grupos.values():
    print(", ".join(palavras))
