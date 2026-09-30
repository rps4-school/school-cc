# Exercício 09 · Maior sequência crescente
# Conceitos: range() a partir de 1, comparar com o anterior, guardar o "melhor até agora"

numeros = [int(x) for x in input().split()]

inicio_atual = 0    # onde começou a sequência que estamos olhando
melhor_inicio = 0   # onde começa a melhor sequência encontrada
melhor_tamanho = 1  # tamanho da melhor sequência encontrada

for i in range(1, len(numeros)):
    # Se não cresceu, a sequência quebrou: uma nova começa aqui.
    if numeros[i] <= numeros[i - 1]:
        inicio_atual = i

    tamanho_atual = i - inicio_atual + 1

    # Usamos > (e não >=) para, em caso de empate, ficar com a primeira.
    if tamanho_atual > melhor_tamanho:
        melhor_tamanho = tamanho_atual
        melhor_inicio = inicio_atual

sequencia = numeros[melhor_inicio:melhor_inicio + melhor_tamanho]
print(" ".join(str(n) for n in sequencia))
