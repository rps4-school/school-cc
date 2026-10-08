# Exercício 08 · Nome para citação
# Conceitos: strip(), split(), join(), title() e upper()

# strip() tira os espaços das pontas e split() separa as palavras
partes = input().strip().split()

# O sobrenome é a última palavra; o resto é o nome
sobrenome = partes[-1].upper()
nome = " ".join(partes[:-1]).title()

# A primeira letra de cada palavra, em maiúscula, com um ponto depois
iniciais = ""
for parte in partes:
    iniciais += parte[0].upper() + "."

print(f"Citação: {sobrenome}, {nome}")
print(f"Iniciais: {iniciais}")
