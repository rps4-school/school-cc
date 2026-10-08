# 🔤 Strings · 🟡 Intermediário

> [← voltar para Exercícios](../../README.md) · [← Fácil](facil.md) · Próximo: [Difícil →](dificil.md)

---

## Exercício 04: Nome em escada

Leia um nome e mostre-o na vertical, em forma de escada, usando só letras maiúsculas: a primeira linha tem 1 letra, a segunda tem 2, e assim por diante.

**Entrada:**
```text
maria
```
**Saída:**
```text
M
MA
MAR
MARI
MARIA
```

> 💡 **Dica:** `nome[:3]` pega as 3 primeiras letras. Use um `for` com `range(1, len(nome) + 1)` e fatie com o valor da volta.

[✅ Ver resposta](../../respostas/04-strings/intermediario/ex04_nome_em_escada.py)

---

## Exercício 05: Contar espaços e vogais

Leia uma frase e mostre quantos espaços em branco ela tem e quantas vezes aparece cada vogal (`a`, `e`, `i`, `o`, `u`). Maiúscula e minúscula contam como a mesma letra. Use frases **sem acento**.

**Entrada:**
```text
Estudar Python faz bem
```
**Saída:**
```text
Espaços: 3
a: 2
e: 2
i: 0
o: 1
u: 1
```

> 💡 **Dica:** passe a frase para minúsculas com `lower()` e use `count()` para cada vogal. Um `for vogal in "aeiou":` visita uma vogal por vez.

[✅ Ver resposta](../../respostas/04-strings/intermediario/ex05_contar_espacos_e_vogais.py)

---

## Exercício 06: Formatando números

Leia um número inteiro e depois um número real. Mostre o inteiro em binário, octal e hexadecimal (minúsculo e maiúsculo). Mostre o real com 2 casas decimais, em notação científica (formato padrão, 6 casas) e como porcentagem com 1 casa decimal.

**Entrada:**
```text
171
0.256
```
**Saída:**
```text
Binário: 10101011
Octal: 253
Hexadecimal: ab
Hexadecimal maiúsculo: AB
Duas casas: 0.26
Científica: 2.560000e-01
Porcentagem: 25.6%
```

> 💡 **Dica:** a formatação vai depois dos dois-pontos dentro da chave do f-string. Por exemplo, `f"{n:b}"` mostra `n` em binário. Veja a tabela de tipos no resumo.

[✅ Ver resposta](../../respostas/04-strings/intermediario/ex06_formatando_numeros.py)
