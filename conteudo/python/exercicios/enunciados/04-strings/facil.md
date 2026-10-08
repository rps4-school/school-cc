# 🔤 Strings · 🟢 Fácil

> [← voltar para Exercícios](../../README.md) · 📖 Antes, leia: [Strings](../../../resumos/04-strings.md) · Próximo: [Intermediário →](intermediario.md)

Em todos os exercícios de strings, cada entrada vem **em uma linha** e é lida com `input()`.

---

## Exercício 01: Tamanho e inversão

Leia uma frase e mostre quantos caracteres ela tem (espaços e pontuação contam) e a frase de trás para frente.

**Entrada:**
```text
Sorria! Hoje é quinta!
```
**Saída:**
```text
Tamanho: 22
Invertida: !atniuq é ejoH !airroS
```

> 💡 **Dica:** `len()` conta os caracteres. Para inverter, use o fatiamento `[::-1]`, o mesmo das listas.

[✅ Ver resposta](../../respostas/04-strings/facil/ex01_tamanho_e_inversao.py)

---

## Exercício 02: Maiúsculas e minúsculas

Leia uma frase e depois um trecho (com pelo menos 1 caractere). Mostre a frase em maiúsculas, em minúsculas, com `capitalize` e com `title`, e quantas vezes o trecho aparece nela.

**Entrada:**
```text
Sorria! Hoje é quinta!
a
```
**Saída:**
```text
Maiúsculas: SORRIA! HOJE É QUINTA!
Minúsculas: sorria! hoje é quinta!
Capitalize: Sorria! hoje é quinta!
Title: Sorria! Hoje É Quinta!
Ocorrências de "a": 2
```

> 💡 **Dica:** os métodos são `upper()`, `lower()`, `capitalize()`, `title()` e `count()`. Repare que `count("a")` **não** conta o `A` maiúsculo.

[✅ Ver resposta](../../respostas/04-strings/facil/ex02_maiusculas_e_minusculas.py)

---

## Exercício 03: Trocar palavra

Leia uma frase, uma palavra que está nela e outra palavra para pôr no lugar. Mostre a frase modificada, toda em **maiúsculas**.

A busca é por trecho e diferencia maiúsculas de minúsculas. Antes de trocar, confira se a palavra existe na frase. Se não existir, mostre `A palavra fornecida não está na frase`.

**Entrada:**
```text
Eu prefiro estudar matemática
matemática
português
```
**Saída:**
```text
EU PREFIRO ESTUDAR PORTUGUÊS
```

**Entrada:**
```text
Eu prefiro estudar matemática
física
português
```
**Saída:**
```text
A palavra fornecida não está na frase
```

> 💡 **Dica:** `palavra in frase` dá `True` ou `False`. E lembre que `replace()` **não muda** a frase original: ele devolve uma string nova.

[✅ Ver resposta](../../respostas/04-strings/facil/ex03_trocar_palavra.py)
