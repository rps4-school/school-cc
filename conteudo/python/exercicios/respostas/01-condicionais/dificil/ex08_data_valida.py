# Exercício 08 · Data válida
# Conceitos: quebrar o problema em etapas, operador in, comparação encadeada

dia = int(input())
mes = int(input())
ano = int(input())

# Etapa 1: o ano é bissexto? (mesma regra do exercício 05)
bissexto = (ano % 4 == 0 and ano % 100 != 0) or ano % 400 == 0

# Etapa 2: quantos dias tem esse mês?
if mes == 2:
    dias_no_mes = 29 if bissexto else 28
elif mes in (4, 6, 9, 11):
    dias_no_mes = 30
else:
    dias_no_mes = 31

# Etapa 3: tudo dentro dos limites?
if ano >= 1 and 1 <= mes <= 12 and 1 <= dia <= dias_no_mes:
    print("Data válida")
else:
    print("Data inválida")
