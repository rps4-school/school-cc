# Simulado 04 · Questão 01 · Lista
# Exigido: os códigos válidos ficam numa lista; o relatório é calculado a partir dela.

defeitos = ["teclas soltas ou faltando", "necessita de limpeza",
            "necessita troca do cabo ou conector", "quebrado ou inutilizado"]
codigos = []

quantidade = int(input("Quantidade de teclados: "))

# while (e não for): um código inválido não conta, então repetimos
# até a lista ter um código para cada teclado.
while len(codigos) < quantidade:
    codigo = int(input("Defeito do teclado " + str(len(codigos) + 1) + " (1 a 4): "))
    if codigo >= 1 and codigo <= 4:
        codigos.append(codigo)
    else:
        print("Código inválido.")

print()
print("Quantidade de teclados:", quantidade)
print()
# Os números vêm primeiro: assim o \t alinha as colunas sozinho.
print("Qtd\t%\tSituação")
for i in range(4):
    total = codigos.count(i + 1)          # quantos teclados têm esse código
    percentual = total * 100 // quantidade  # // = divisão inteira
    print(str(total) + "\t" + str(percentual) + "%\t" + str(i + 1) + "- " + defeitos[i])
