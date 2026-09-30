# 🔢 Matrizes · 🔴 Difícil

> [← voltar para Exercícios](../../README.md) · [← Intermediário](intermediario.md)

---

## Exercício 07: Multiplicação de matrizes

Leia a matriz A (primeiro `linhas colunas`, depois os valores) e, em seguida, a matriz B no mesmo formato. Mostre A × B. Se o número de **colunas de A** for diferente do número de **linhas de B**, mostre `Multiplicação impossível`.

Cada elemento do resultado é: `c[i][j] = a[i][0]*b[0][j] + a[i][1]*b[1][j] + ...`

**Entrada:**
```text
2 3
1 2 3
4 5 6
3 2
7 8
9 10
11 12
```
**Saída:**
```text
58 64
139 154
```

**Entrada:**
```text
2 2
1 2
3 4
3 1
1
2
3
```
**Saída:**
```text
Multiplicação impossível
```

> 💡 **Dica:** são **três** `for`: `i` percorre as linhas de A, `j` as colunas de B e `k` soma os produtos. Criar uma função `ler_matriz()` evita repetir código.

[✅ Ver resposta](../../respostas/03-matrizes/dificil/ex07_multiplicacao.py)

---

## Exercício 08: Espiral

Leia uma matriz e mostre os elementos **em espiral**: começando no canto superior esquerdo e andando no sentido horário, de fora para dentro.

**Entrada:**
```text
3 4
1 2 3 4
5 6 7 8
9 10 11 12
```
**Saída:**
```text
1 2 3 4 8 12 11 10 9 5 6 7
```

```
 1 → 2 → 3 → 4
               ↓
 5 → 6 → 7    8
 ↑             ↓
 9 ← 10 ← 11 ← 12
```

> 💡 **Dica:** guarde 4 limites: `topo`, `base`, `esquerda` e `direita`. Percorra o topo, a direita, a base e a esquerda, e depois "encolha" cada limite. Repita enquanto `topo <= base` e `esquerda <= direita`.

[✅ Ver resposta](../../respostas/03-matrizes/dificil/ex08_espiral.py)

---

## Exercício 09: Jogo da velha

Leia um tabuleiro 3x3 de jogo da velha: 3 linhas com 3 caracteres cada, sendo `X`, `O` ou `.` para as casas vazias. Mostre o resultado:

| Situação | Saída |
| -------- | ----- |
| X tem uma linha, coluna ou diagonal completa | `X venceu` |
| O tem uma linha, coluna ou diagonal completa | `O venceu` |
| Ninguém venceu e não há casas vazias | `Empate` |
| Ninguém venceu e ainda há casas vazias | `Em andamento` |

Considere que o tabuleiro é sempre válido (os dois nunca vencem ao mesmo tempo).

**Entrada:**
```text
XXX
OO.
...
```
**Saída:**
```text
X venceu
```

**Entrada:**
```text
O.X
.OX
..O
```
**Saída:**
```text
O venceu
```

**Entrada:**
```text
XOX
OXO
OXO
```
**Saída:**
```text
Empate
```

**Entrada:**
```text
X..
.O.
...
```
**Saída:**
```text
Em andamento
```

> 💡 **Dica:** monte uma lista com as 8 "trincas" possíveis (3 linhas, 3 colunas e 2 diagonais). Depois verifique se alguma tem os três símbolos iguais e diferentes de `.`.

[✅ Ver resposta](../../respostas/03-matrizes/dificil/ex09_jogo_da_velha.py)
