# 📋 Listas · 🟡 Intermediário

> [← voltar para Exercícios](../../README.md) · [← Fácil](facil.md) · Próximo: [Difícil →](dificil.md)

---

## Exercício 04: Remover repetidos

Leia uma lista de números inteiros e mostre a lista sem repetições, **mantendo a ordem** em que cada número apareceu pela primeira vez.

**Entrada:**
```text
3 1 3 2 1 5
```
**Saída:**
```text
3 1 2 5
```

> 💡 **Dica:** crie uma lista vazia e só faça `append` do número se ele ainda **não estiver** nela (`not in`).

[✅ Ver resposta](../../respostas/02-listas/intermediario/ex04_remover_repetidos.py)

---

## Exercício 05: Frequência

Leia uma lista de números inteiros e mostre quantas vezes cada número aparece, na ordem em que apareceu pela primeira vez.

**Entrada:**
```text
4 2 4 4 7 2
```
**Saída:**
```text
4: 3
2: 2
7: 1
```

> 💡 **Dica:** `lista.count(x)` diz quantas vezes `x` aparece. Cuidado para não mostrar o mesmo número duas vezes!

[✅ Ver resposta](../../respostas/02-listas/intermediario/ex05_frequencia.py)

---

## Exercício 06: Segundo maior

Leia uma lista de números inteiros e mostre o **segundo maior valor diferente**. Se todos forem iguais, mostre `Não existe segundo maior`.

**Entrada:**
```text
5 9 9 3
```
**Saída:**
```text
Segundo maior: 5
```

**Entrada:**
```text
7 7 7
```
**Saída:**
```text
Não existe segundo maior
```

> 💡 **Dica:** descubra o maior. Depois, monte uma lista **sem** ele e pegue o maior dela.

[✅ Ver resposta](../../respostas/02-listas/intermediario/ex06_segundo_maior.py)
