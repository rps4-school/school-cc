# Exercício 06 · Calculadora
# Conceitos: comparar textos, tratar casos especiais antes, formatação :.2f

a = float(input())
op = input().strip()  # .strip() remove espaços acidentais nas pontas
b = float(input())

# A divisão por zero é testada antes para não quebrar o programa.
if op == "/" and b == 0:
    print("Erro: divisão por zero")
elif op == "+":
    print(f"Resultado: {a + b:.2f}")
elif op == "-":
    print(f"Resultado: {a - b:.2f}")
elif op == "*":
    print(f"Resultado: {a * b:.2f}")
elif op == "/":
    print(f"Resultado: {a / b:.2f}")
else:
    print("Operação inválida")
