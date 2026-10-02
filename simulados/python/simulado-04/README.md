# 📝 Simulado 04 · Python

> [← voltar para Simulados](../../README.md)

**Nível:** 🟡 Intermediário

**Duração sugerida:** 2h · **Pontuação:** 100 pontos · **Assuntos:** lista e matriz

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações ou IA.
> - Só Python puro: **nenhum `import`**.
> - Quando a questão tiver um **comando exigido**, não usá-lo vale metade da pontuação.
> - Código sem boas práticas (nomes claros, sem repetição à toa) perde 10% da questão.
> - Um arquivo por questão: `q1.py`, `q2.py`, `q3.py` e `q4.py`.
> - Só abra as respostas depois que o tempo acabar.

---

## Questão 01 · Lista · 20 pontos

O laboratório de informática juntou uma pilha de **teclados velhos**, e um monitor vai testar um por um para ver o que dá para aproveitar. Desenvolva um programa que registre esse levantamento:

- Leia a **quantidade** de teclados e, depois, o **código do defeito** de cada um:

    | Código | Defeito |
    | :----: | ------- |
    | 1 | teclas soltas ou faltando |
    | 2 | necessita de limpeza |
    | 3 | necessita troca do cabo ou conector |
    | 4 | quebrado ou inutilizado |

- Código fora de 1 a 4 **não entra na lista**: mostre `Código inválido.` e peça de novo para o **mesmo teclado**.
- No final, mostre o relatório com a **quantidade** e o **percentual** (inteiro) de cada defeito, separados por `\t`, no formato do exemplo.

> 📌 **Comando exigido:** guarde os códigos válidos numa **lista** e calcule o relatório a partir dela.

**Exemplo de execução:**

```text
Quantidade de teclados: 10
Defeito do teclado 1 (1 a 4): 2
Defeito do teclado 2 (1 a 4): 1
Defeito do teclado 3 (1 a 4): 4
Defeito do teclado 4 (1 a 4): 2
Defeito do teclado 5 (1 a 4): 7
Código inválido.
Defeito do teclado 5 (1 a 4): 3
Defeito do teclado 6 (1 a 4): 2
Defeito do teclado 7 (1 a 4): 1
Defeito do teclado 8 (1 a 4): 2
Defeito do teclado 9 (1 a 4): 0
Código inválido.
Defeito do teclado 9 (1 a 4): 2
Defeito do teclado 10 (1 a 4): 1

Quantidade de teclados: 10

Qtd	%	Situação
3	30%	1- teclas soltas ou faltando
5	50%	2- necessita de limpeza
1	10%	3- necessita troca do cabo ou conector
1	10%	4- quebrado ou inutilizado
```

[✅ Ver resposta](respostas/q1_teclados.py)

---

## Questão 02 · Lista · 30 pontos

Um clube de xadrez vai montar o **time veterano** para um torneio. Só podem entrar jogadores com **50 anos ou mais**. Desenvolva um programa que:

- Pergunte **quantos jogadores** o time terá.
- Leia o **nome completo** e a **idade** de cada jogador. Nomes e idades ficam em **duas listas**.
- Se a idade for **menor que 50**, avise que o jogador não pode entrar. Ele **não conta** na quantidade: peça **outro jogador** para a mesma vaga.
- No final, mostre cada jogador com a idade, o **jogador mais experiente** (o mais velho) e a **média de idade** do time.

> 📌 **Comando exigido:** duas listas preenchidas com `append`. Encontre o mais velho **percorrendo a lista** com um laço (sem `max`).

**Exemplo de execução:**

```text
Quantidade de jogadores do time veterano: 3
Nome completo do jogador: Marta Quintela Bastos
Idade: 58
Nome completo do jogador: Caio Benício Toledo
Idade: 47
Caio Benício Toledo ainda não pode jogar no time veterano. Informe outro jogador.
Nome completo do jogador: Rogério Pires Damasceno
Idade: 61
Nome completo do jogador: Isadora Leme Furtado
Idade: 73

Nome: Marta Quintela Bastos - Idade: 58 anos
Nome: Rogério Pires Damasceno - Idade: 61 anos
Nome: Isadora Leme Furtado - Idade: 73 anos

Jogador mais experiente: Isadora Leme Furtado
Média de idade do time: 64.0 anos
```

[✅ Ver resposta](respostas/q2_xadrez.py)

---

## Questão 03 · Matriz · 25 pontos

Uma cafeteria quer comparar os **três cafés** mais pedidos: Espresso, Cappuccino e Cold brew. Para cada um, ela anota o **preço** (primeira coluna), o **tempo de preparo em minutos** (segunda coluna) e a **nota dos clientes** (terceira coluna). Usando uma matriz **3x3**, crie um programa que faça esse cadastro e depois:

1. Mostre a matriz em **formato de tabela**.
2. Mostre o **preço médio** dos três cafés.
3. Mostre a **soma da diagonal principal** (as posições `[0][0]`, `[1][1]` e `[2][2]`).

```
 ■ □ □
 □ ■ □      ■ = diagonal principal
 □ □ ■
```

> 📌 **Comando exigido:** os 9 valores ficam numa **matriz** (lista de listas), lida com dois `for` aninhados.

**Exemplo de execução:**

```text
Espresso
Preço: 6.5
Preparo (min): 2
Nota: 8.7
Cappuccino
Preço: 9.9
Preparo (min): 4
Nota: 9.2
Cold brew
Preço: 14
Preparo (min): 12
Nota: 8.9

Café	Preço	Preparo	Nota
Espresso	6.5	2.0	8.7
Cappuccino	9.9	4.0	9.2
Cold brew	14.0	12.0	8.9

Preço médio: 10.13
Soma da diagonal principal: 19.4
```

[✅ Ver resposta](respostas/q3_cafeteria.py)

---

## Questão 04 · Matriz · 25 pontos

Crie um programa que leia três informações, **nesta ordem**:

1. O número de uma **linha** da matriz (de **0 a 2**). Se for inválido, peça de novo.
2. Uma letra **maiúscula** com a operação: **`S`** (soma) ou **`M`** (média). Se for outra letra, peça de novo.
3. Os **9 números inteiros** de uma matriz 3x3.

Depois, mostre a matriz em **formato de tabela** e, em seguida, a **soma** ou a **média** dos elementos da **linha escolhida**. Lembre que a primeira linha é a **0**. Por exemplo, com a linha `1`, entram na conta só os elementos marcados:

```
 □ □ □      linha 0
 ■ ■ ■      linha 1  ← escolhida
 □ □ □      linha 2
```

> 📌 **Comando exigido:** a conta usa os valores **lidos da matriz** (`matriz[linha][j]`), num laço.

**Exemplo de execução:**

```text
Linha (0 a 2): 3
Linha inválida! Informe de 0 a 2: 1
Operação (S para soma, M para média): P
Operação inválida! Digite S ou M: M
Valor [0][0]: 4
Valor [0][1]: 7
Valor [0][2]: 1
Valor [1][0]: 5
Valor [1][1]: 2
Valor [1][2]: 9
Valor [2][0]: 8
Valor [2][1]: 6
Valor [2][2]: 3

4	7	1
5	2	9
8	6	3

Média da linha 1: 5.33
```

```text
Linha (0 a 2): 0
Operação (S para soma, M para média): S
Valor [0][0]: 4
Valor [0][1]: 7
Valor [0][2]: 1
Valor [1][0]: 5
Valor [1][1]: 2
Valor [1][2]: 9
Valor [2][0]: 8
Valor [2][1]: 6
Valor [2][2]: 3

4	7	1
5	2	9
8	6	3

Soma da linha 0: 12
```

[✅ Ver resposta](respostas/q4_linha.py)
