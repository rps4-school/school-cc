# Exercício 07 · Palavra mais frequente
# Conceitos: dividir o problema em funções; strings, listas e dicionário; devolver dois valores


def limpar(texto):
    texto = texto.lower()
    for sinal in ".,!?;:":
        texto = texto.replace(sinal, "")
    return texto.split()


def contar(palavras):
    contagem = {}
    for palavra in palavras:
        contagem[palavra] = contagem.get(palavra, 0) + 1
    return contagem


def mais_frequente(contagem):
    melhor = ""
    maior = 0
    for palavra, vezes in contagem.items():
        # Só troca se for MAIOR: no empate, fica a que apareceu primeiro no texto
        if vezes > maior:
            melhor = palavra
            maior = vezes
    return melhor, maior        # dois valores de uma vez


palavras = limpar(input())
contagem = contar(palavras)
palavra, vezes = mais_frequente(contagem)   # recebe os dois valores

print("Palavras:", len(palavras))
print("Diferentes:", len(contagem))
print("Mais frequente: " + palavra + " (" + str(vezes) + " vezes)")
