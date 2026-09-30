# 🔢 Matrizes · 🟡 Intermediário

> [← voltar para Exercícios](../../README.md) · [← Fácil](facil.md) · Próximo: [Difícil →](dificil.md)

---

## Exercício 04: Transposta

Leia uma matriz e mostre a sua **transposta**: as linhas viram colunas.

**Entrada:**
```text
2 3
1 2 3
4 5 6
```
**Saída:**
```text
1 4
2 5
3 6
```

> 💡 **Dica:** a transposta tem `colunas` linhas. O elemento `[i][j]` da original vai para a posição `[j][i]`.

[✅ Ver resposta](../../respostas/03-matrizes/intermediario/ex04_transposta.py)

---

## Exercício 05: Soma de matrizes

Leia `linhas colunas` e, em seguida, duas matrizes desse tamanho: primeiro a matriz A inteira, depois a B. Mostre A + B.

**Entrada:**
```text
2 2
1 2
3 4
5 6
7 8
```
**Saída:**
```text
6 8
10 12
```

> 💡 **Dica:** cada elemento do resultado é `a[i][j] + b[i][j]`.

[✅ Ver resposta](../../respostas/03-matrizes/intermediario/ex05_soma_de_matrizes.py)

---

## Exercício 06: Matriz simétrica

Leia uma matriz quadrada `N x N` e diga se ela é `Simétrica` ou `Não simétrica`. Uma matriz é simétrica quando `m[i][j] == m[j][i]` para todo `i` e `j`, ou seja, quando ela é igual à sua transposta.

**Entrada:**
```text
3
1 2 3
2 5 6
3 6 9
```
**Saída:**
```text
Simétrica
```

**Entrada:**
```text
2
1 2
3 4
```
**Saída:**
```text
Não simétrica
```

> 💡 **Dica:** comece com `simetrica = True`. Se achar **um** par diferente, mude para `False`.

[✅ Ver resposta](../../respostas/03-matrizes/intermediario/ex06_simetrica.py)
