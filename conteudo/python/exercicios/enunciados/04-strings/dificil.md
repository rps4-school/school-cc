# 🔤 Strings · 🔴 Difícil

> [← voltar para Exercícios](../../README.md) · [← Intermediário](intermediario.md)

---

## Exercício 07: Palíndromo

Leia uma frase e diga se ela é um palíndromo, ou seja, se lida de trás para frente fica igual. **Desconsidere os espaços** e a diferença entre maiúsculas e minúsculas. Use frases **sem acento e sem pontuação**.

**Entrada:**
```text
A sacada da casa
```
**Saída:**
```text
É um palíndromo
```

**Entrada:**
```text
Python é legal
```
**Saída:**
```text
Não é um palíndromo
```

> 💡 **Dica:** primeiro tire os espaços com `replace(" ", "")` e passe tudo para minúsculas. Depois compare a frase com ela mesma invertida (`[::-1]`).

[✅ Ver resposta](../../respostas/04-strings/dificil/ex07_palindromo.py)

---

## Exercício 08: Nome para citação

Leia um nome completo, que pode ter espaços sobrando no começo e no fim. Mostre o nome no formato de citação (`SOBRENOME, Nome`) e as iniciais, cada uma seguida de ponto. O nome tem pelo menos duas palavras e o sobrenome é a última.

**Entrada:**
```text
   maria clara souza  
```
**Saída:**
```text
Citação: SOUZA, Maria Clara
Iniciais: M.C.S.
```

> 💡 **Dica:** `strip()` tira os espaços das pontas e `split()` devolve a lista de palavras. Com `partes[-1]` você pega o sobrenome, e `" ".join(partes[:-1])` junta o resto.

[✅ Ver resposta](../../respostas/04-strings/dificil/ex08_nome_para_citacao.py)

---

## Exercício 09: Comprimir texto

Leia um texto não vazio, só com letras minúsculas e sem espaços, e comprima-o: cada sequência de letras iguais seguidas vira a letra e a quantidade de vezes que ela se repete.

**Entrada:**
```text
aaabccdddd
```
**Saída:**
```text
a3b1c2d4
```

**Entrada:**
```text
abc
```
**Saída:**
```text
a1b1c1
```

> 💡 **Dica:** percorra o texto por índice e compare cada letra com a anterior. Se for igual, aumente o contador. Se for diferente, guarde a letra e a contagem e recomece. Não esqueça da **última** sequência depois do `for`.

[✅ Ver resposta](../../respostas/04-strings/dificil/ex09_comprimir_texto.py)
