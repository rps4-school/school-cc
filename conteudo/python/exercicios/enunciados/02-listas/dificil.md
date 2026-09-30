# 📋 Listas · 🔴 Difícil

> [← voltar para Exercícios](../../README.md) · [← Intermediário](intermediario.md)

---

## Exercício 07: Juntar listas ordenadas

Leia duas listas de inteiros, uma por linha, **já em ordem crescente**. Mostre uma única lista com todos os números em ordem crescente.

⛔ **Proibido** usar `sort()` e `sorted()`.

**Entrada:**
```text
1 4 9
2 3 10 12
```
**Saída:**
```text
1 2 3 4 9 10 12
```

> 💡 **Dica:** use dois índices, `i` para a primeira lista e `j` para a segunda. Compare `a[i]` com `b[j]`, coloque o menor no resultado e avance só aquele índice. Quando uma lista acabar, copie o que sobrou da outra.

[✅ Ver resposta](../../respostas/02-listas/dificil/ex07_juntar_ordenadas.py)

---

## Exercício 08: Rotacionar

Leia uma lista na primeira linha e um número `k` (0 ou maior) na segunda. Gire a lista `k` posições para a **direita**: os últimos itens voltam para o começo.

**Entrada:**
```text
1 2 3 4 5
2
```
**Saída:**
```text
4 5 1 2 3
```

**Entrada:**
```text
1 2 3 4 5
7
```
**Saída:**
```text
4 5 1 2 3
```

> 💡 **Dica:** girar 5 vezes uma lista de 5 itens dá nela mesma. Então `k % len(lista)` é o que importa. Depois é só juntar duas fatias.

[✅ Ver resposta](../../respostas/02-listas/dificil/ex08_rotacionar.py)

---

## Exercício 09: Maior sequência crescente

Leia uma lista de inteiros e mostre o **maior trecho seguido** em que cada número é **maior** que o anterior. Se houver empate, mostre o que aparece primeiro.

**Entrada:**
```text
1 2 0 3 4 5 1
```
**Saída:**
```text
0 3 4 5
```

**Entrada:**
```text
5 4 3
```
**Saída:**
```text
5
```

> 💡 **Dica:** percorra a lista guardando onde a sequência **atual** começou. Quando `lista[i] <= lista[i - 1]`, a sequência quebra e recomeça em `i`. Guarde também o início e o tamanho da **melhor** sequência vista até agora.

[✅ Ver resposta](../../respostas/02-listas/dificil/ex09_maior_sequencia_crescente.py)
