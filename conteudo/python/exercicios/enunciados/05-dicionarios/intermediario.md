# 📒 Dicionários · 🟡 Intermediário

> [← voltar para Exercícios](../../README.md) · [← Fácil](facil.md) · Próximo: [Difícil →](dificil.md)

---

## Exercício 04: Frequência de palavras

Leia uma frase e mostre quantas vezes cada palavra aparece, na ordem da primeira aparição. Maiúsculas e minúsculas contam como a mesma palavra (mostre em minúsculas). No fim, mostre quantas palavras diferentes a frase tem. Use frases **sem pontuação**.

**Entrada:**
```text
Tudo que sobe desce e tudo que desce sobe
```
**Saída:**
```text
tudo: 2
que: 2
sobe: 2
desce: 2
e: 1
Palavras diferentes: 5
```

> 💡 **Dica:** `frase.lower().split()` dá a lista de palavras. Conte com o padrão `contagem[p] = contagem.get(p, 0) + 1`, e o número de palavras diferentes é o `len()` do dicionário.

[✅ Ver resposta](../../respostas/05-dicionarios/intermediario/ex04_frequencia_de_palavras.py)

---

## Exercício 05: Controle de estoque

Leia a quantidade de produtos e cada produto no formato `nome quantidade`. Depois leia a quantidade de movimentações e cada movimentação no formato `nome +5` (entrada) ou `nome -3` (saída).

- Uma entrada de um produto que ainda não existe **cria** o produto.
- Uma saída que deixaria o estoque negativo (ou de um produto que não existe) **não é feita**: mostre `Sem estoque suficiente de <nome>`.

No fim, mostre o estoque final, na ordem em que os produtos foram cadastrados.

**Entrada:**
```text
3
caneta 10
lapis 5
borracha 2
4
caneta -4
borracha -3
caderno +6
lapis +1
```
**Saída:**
```text
Sem estoque suficiente de borracha
Estoque final:
caneta: 6
lapis: 6
borracha: 2
caderno: 6
```

> 💡 **Dica:** `int("+6")` vale `6` e `int("-4")` vale `-4`, então dá para somar a movimentação direto. Antes de somar, calcule como o estoque **ficaria** e só guarde se não for negativo. `estoque.get(nome, 0)` trata o produto que ainda não existe.

[✅ Ver resposta](../../respostas/05-dicionarios/intermediario/ex05_controle_de_estoque.py)

---

## Exercício 06: Notas por aluno

Leia a quantidade de lançamentos e cada lançamento no formato `nome nota`. Um mesmo aluno pode aparecer várias vezes. Mostre, para cada aluno (na ordem da primeira aparição), quantas notas ele tem e a média, com uma casa decimal.

**Entrada:**
```text
5
Ana 8
Bruno 6
Ana 7
Bruno 9
Ana 6
```
**Saída:**
```text
Ana: 3 notas, média 7.0
Bruno: 2 notas, média 7.5
```

> 💡 **Dica:** este é o padrão "agrupar": um dicionário de listas. Se o aluno ainda não é chave, crie a lista vazia (`notas[nome] = []`); depois faça `notas[nome].append(nota)`. A média é `sum(lista) / len(lista)`, arredondada com `round(media, 1)`.

[✅ Ver resposta](../../respostas/05-dicionarios/intermediario/ex06_notas_por_aluno.py)
