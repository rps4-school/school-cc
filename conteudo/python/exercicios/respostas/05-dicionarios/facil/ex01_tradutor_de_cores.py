# Exercício 01 · Tradutor de cores
# Conceitos: criar um dicionário e buscar com get(chave, padrão)

cores = {
    "vermelho": "red",
    "azul": "blue",
    "verde": "green",
    "amarelo": "yellow",
    "preto": "black",
    "branco": "white",
}

cor = input().lower()   # "Azul" vira "azul", que é como a chave está guardada

# get devolve o valor da chave ou, se ela não existir, o texto padrão
print(cores.get(cor, "Cor desconhecida"))
