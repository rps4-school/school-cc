# Exercício 03 · Situação do aluno
# Conceitos: float(), or, ordem dos elif

nota = float(input())

# O caso inválido vem primeiro: se viesse depois, uma nota 11
# entraria no "nota >= 7" e seria considerada "Aprovado".
if nota < 0 or nota > 10:
    print("Nota inválida")
elif nota >= 7:
    print("Aprovado")
elif nota >= 5:  # aqui já sabemos que nota < 7
    print("Recuperação")
else:
    print("Reprovado")
