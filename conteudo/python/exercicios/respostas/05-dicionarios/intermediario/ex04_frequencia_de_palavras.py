# Exercício 04 · Frequência de palavras
# Conceitos: contar com dicionário, split() e len() de um dicionário

palavras = input().lower().split()

contagem = {}
for palavra in palavras:
    contagem[palavra] = contagem.get(palavra, 0) + 1

for palavra, vezes in contagem.items():
    print(palavra + ":", vezes)

# Cada palavra diferente é uma chave: o tamanho do dicionário é o total de palavras diferentes
print("Palavras diferentes:", len(contagem))
