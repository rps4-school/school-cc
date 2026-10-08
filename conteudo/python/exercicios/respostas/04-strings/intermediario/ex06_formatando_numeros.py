# Exercício 06 · Formatando números
# Conceitos: formatação com f-string (b, o, x, X, f, e, %)

inteiro = int(input())
real = float(input())

# Depois dos ":" vem o tipo de formatação
print(f"Binário: {inteiro:b}")
print(f"Octal: {inteiro:o}")
print(f"Hexadecimal: {inteiro:x}")
print(f"Hexadecimal maiúsculo: {inteiro:X}")

print(f"Duas casas: {real:.2f}")
print(f"Científica: {real:e}")
# ".1%" multiplica por 100, mostra 1 casa decimal e põe o "%"
print(f"Porcentagem: {real:.1%}")
