# 🔀 Condicionais · 🟡 Intermediário

> [← voltar para Exercícios](../../README.md) · [← Fácil](facil.md) · Próximo: [Difícil →](dificil.md)

---

## Exercício 04: Tipo de triângulo

Leia três lados inteiros, um por linha. Primeiro verifique se eles **formam um triângulo**: todos os lados precisam ser maiores que 0, e cada lado precisa ser menor que a soma dos outros dois. Se não formarem, mostre `Não forma um triângulo`. Se formarem, mostre o tipo:

| Tipo | Regra |
| ---- | ----- |
| `Equilátero` | 3 lados iguais |
| `Isósceles` | Exatamente 2 lados iguais |
| `Escaleno` | Todos os lados diferentes |

**Entrada:**
```text
3
3
3
```
**Saída:**
```text
Equilátero
```

**Entrada:**
```text
5
5
8
```
**Saída:**
```text
Isósceles
```

**Entrada:**
```text
3
4
5
```
**Saída:**
```text
Escaleno
```

**Entrada:**
```text
1
2
10
```
**Saída:**
```text
Não forma um triângulo
```

> 💡 **Dica:** junte as condições de "não forma" com `or`. Em Python, `a == b == c` funciona!

[✅ Ver resposta](../../respostas/01-condicionais/intermediario/ex04_tipo_de_triangulo.py)

---

## Exercício 05: Ano bissexto

Leia um ano e diga se ele é bissexto. Um ano é bissexto se:

- é divisível por 4 **e não** é divisível por 100, **ou**
- é divisível por 400.

**Entrada:**
```text
2024
```
**Saída:**
```text
2024 é bissexto
```

**Entrada:**
```text
1900
```
**Saída:**
```text
1900 não é bissexto
```

**Entrada:**
```text
2000
```
**Saída:**
```text
2000 é bissexto
```

> 💡 **Dica:** "divisível por 4" é `ano % 4 == 0`. Use parênteses para agrupar o `and` e o `or`.

[✅ Ver resposta](../../respostas/01-condicionais/intermediario/ex05_ano_bissexto.py)

---

## Exercício 06: Calculadora

Leia um número, uma operação (`+`, `-`, `*` ou `/`) e outro número, um por linha. Mostre o resultado com 2 casas decimais.

- Divisão por zero: mostre `Erro: divisão por zero`.
- Operação desconhecida: mostre `Operação inválida`.

**Entrada:**
```text
10
/
4
```
**Saída:**
```text
Resultado: 2.50
```

**Entrada:**
```text
5
/
0
```
**Saída:**
```text
Erro: divisão por zero
```

**Entrada:**
```text
2
^
3
```
**Saída:**
```text
Operação inválida
```

> 💡 **Dica:** a operação é texto, então compare com `op == "+"`. Para 2 casas decimais: `f"{valor:.2f}"`.

[✅ Ver resposta](../../respostas/01-condicionais/intermediario/ex06_calculadora.py)
