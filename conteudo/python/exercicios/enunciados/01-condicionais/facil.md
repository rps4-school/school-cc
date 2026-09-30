# 🔀 Condicionais · 🟢 Fácil

> [← voltar para Exercícios](../../README.md) · 📖 Antes, leia: [Condicionais](../../../resumos/01-condicionais.md) · Próximo: [Intermediário →](intermediario.md)

---

## Exercício 01: Par ou ímpar

Leia um número inteiro e mostre `par` se ele for par ou `ímpar` se for ímpar.

**Entrada:**
```text
4
```
**Saída:**
```text
par
```

**Entrada:**
```text
7
```
**Saída:**
```text
ímpar
```

> 💡 **Dica:** o operador `%` devolve o resto da divisão. Quanto é `n % 2` para um número par?

[✅ Ver resposta](../../respostas/01-condicionais/facil/ex01_par_ou_impar.py)

---

## Exercício 02: Maior de dois

Leia dois números inteiros, um por linha, e mostre qual é o maior. Se forem iguais, mostre `Os números são iguais`.

**Entrada:**
```text
3
8
```
**Saída:**
```text
O maior é 8
```

**Entrada:**
```text
5
5
```
**Saída:**
```text
Os números são iguais
```

> 💡 **Dica:** são três casos possíveis. Use `if`, `elif` e `else`.

[✅ Ver resposta](../../respostas/01-condicionais/facil/ex02_maior_de_dois.py)

---

## Exercício 03: Situação do aluno

Leia uma nota (pode ter casas decimais) e mostre a situação do aluno:

| Nota | Situação |
| ---- | -------- |
| Menor que 0 ou maior que 10 | `Nota inválida` |
| 7 ou mais | `Aprovado` |
| De 5 até menos de 7 | `Recuperação` |
| Menor que 5 | `Reprovado` |

**Entrada:**
```text
8.5
```
**Saída:**
```text
Aprovado
```

**Entrada:**
```text
6
```
**Saída:**
```text
Recuperação
```

**Entrada:**
```text
11
```
**Saída:**
```text
Nota inválida
```

> 💡 **Dica:** teste o caso inválido **primeiro**. A ordem dos `elif` importa!

[✅ Ver resposta](../../respostas/01-condicionais/facil/ex03_situacao_do_aluno.py)
