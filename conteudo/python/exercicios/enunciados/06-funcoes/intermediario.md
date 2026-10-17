# 🧩 Funções · 🟡 Intermediário

> [← voltar para Exercícios](../../README.md) · [← Fácil](facil.md) · Próximo: [Difícil →](dificil.md)

Aqui as funções trabalham com **listas, strings e matrizes**. Crie as funções pedidas com `def`.

---

## Exercício 04: Boletim da turma

Crie duas funções:

- `media(notas)`: recebe uma **lista** de notas e devolve a média.
- `situacao(media)`: devolve `Aprovado` (média 7 ou mais), `Recuperação` (de 5 até menos de 7) ou `Reprovado` (menos de 5).

Leia a quantidade de alunos e cada aluno no formato `nome nota1 nota2 nota3`. Mostre o nome, a média com uma casa decimal e a situação.

**Entrada:**
```text
3
Ana 8 7.5 8.5
Bruno 5 6 4
Carla 3 4.5 5
```
**Saída:**
```text
Ana: média 8.0 - Aprovado
Bruno: média 5.0 - Recuperação
Carla: média 4.2 - Reprovado
```

> 💡 **Dica:** `partes = input().split()` dá `["Ana", "8", "7.5", "8.5"]`: o nome é `partes[0]` e as notas são `partes[1:]`, que ainda são texto. Converta com `[float(x) for x in partes[1:]]`. Uma função pode chamar a outra: `situacao(media(notas))`.

[✅ Ver resposta](../../respostas/06-funcoes/intermediario/ex04_boletim_da_turma.py)

---

## Exercício 05: Senha forte

Crie a função `problemas(senha)`, que devolve uma **lista** com o que falta na senha, nesta ordem:

1. `pelo menos 8 caracteres`
2. `uma letra maiúscula`
3. `uma letra minúscula`
4. `um número`

Leia uma senha. Se a lista vier vazia, mostre `Senha forte`. Senão, mostre `Senha fraca. Falta:` e cada problema numa linha, começando com `- `.

**Entrada:**
```text
Python2026
```
**Saída:**
```text
Senha forte
```

**Entrada:**
```text
abc12
```
**Saída:**
```text
Senha fraca. Falta:
- pelo menos 8 caracteres
- uma letra maiúscula
```

> 💡 **Dica:** os métodos `c.isupper()`, `c.islower()` e `c.isdigit()` dizem se o caractere `c` é maiúsculo, minúsculo ou um algarismo. Percorra a senha com `for c in senha:` e guarde o que encontrou.

[✅ Ver resposta](../../respostas/06-funcoes/intermediario/ex05_senha_forte.py)

---

## Exercício 06: Matriz com funções

Crie três funções:

- `ler_matriz(linhas)`: lê `linhas` linhas de números inteiros e devolve a matriz (uma lista de listas).
- `transposta(matriz)`: devolve uma **nova** matriz, em que as linhas viram colunas.
- `mostrar(matriz)`: mostra cada linha com os números separados por espaço.

Leia a quantidade de linhas e a matriz. Mostre a transposta e a soma de cada linha da matriz original.

**Entrada:**
```text
2
1 2 3
4 5 6
```
**Saída:**
```text
Transposta:
1 4
2 5
3 6
Soma das linhas: 6 15
```

> 💡 **Dica:** na transposta, a nova linha `j` é formada pelo elemento `j` de cada linha antiga. Para mostrar, converta os números com `str()` e junte com `" ".join(...)`.

[✅ Ver resposta](../../respostas/06-funcoes/intermediario/ex06_matriz_com_funcoes.py)
