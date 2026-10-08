# Exercício 03 · Trocar palavra
# Conceitos: operador in, replace() e upper()

frase = input()
palavra = input()
nova = input()

# Antes de trocar, confere se a palavra existe na frase
if palavra in frase:
    # replace() devolve uma string nova, então encadeamos o upper()
    print(frase.replace(palavra, nova).upper())
else:
    print("A palavra fornecida não está na frase")
