# 📝 Simulado 01 · Python

> [← voltar para Simulados](../../README.md)

**Nível:** 🟡 Intermediário

**Duração sugerida:** 1h40 · **Pontuação:** 100 pontos · **Assuntos:** condicional, lista e matriz

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações ou IA.
> - Só Python puro: **nenhum `import`**.
> - Quando a questão tiver um **comando exigido**, não usá-lo vale metade da pontuação.
> - Código sem boas práticas (nomes claros, sem repetição à toa) perde 10% da questão.
> - Um arquivo por questão: `q1.py`, `q2.py` e `q3.py`.
> - Só abra as respostas depois que o tempo acabar.

---

## Questão 01 · Condicional · 20 pontos

Uma cafeteria instalou uma máquina com **6 botões**, numerados de **0 a 5**. Para pedir uma bebida, o cliente aperta **dois botões**: a máquina **soma** os dois números e prepara a bebida daquele código.

| Código | Bebida | Código | Bebida |
| :----: | ------ | :----: | ------ |
| 0 | ÁGUA | 4 | CHOCOLATE QUENTE |
| 1 | CAFÉ | 5 | SUCO |
| 2 | CAPPUCCINO | 6 | SMOOTHIE |
| 3 | CHÁ GELADO | 7 | MILKSHAKE |

Escreva um programa que leia os dois botões e mostre a soma e a bebida escolhida.

- Se algum botão não existir (fora de 0 a 5), mostre `Botão inexistente.`
- Se a soma não tiver bebida (acima de 7), mostre que a combinação é inválida.

> 📌 **Comando exigido:** `if` / `elif` / `else`. Não use listas nem dicionários.

**Exemplos de execução:**

```text
Primeiro botão (0 a 5): 2
Segundo botão (0 a 5): 4
Soma 6: SMOOTHIE
```

```text
Primeiro botão (0 a 5): 5
Segundo botão (0 a 5): 5
Soma 10: combinação inválida.
```

```text
Primeiro botão (0 a 5): 6
Segundo botão (0 a 5): 1
Botão inexistente.
```

[✅ Ver resposta](respostas/q1_cafeteria.py)

---

## Questão 02 · Lista · 40 pontos

Uma academia vai abrir uma turma de musculação e só aceita alunos a partir de **16 anos**. Desenvolva um programa que:

- Pergunte, a cada rodada, se o usuário deseja cadastrar um novo aluno, **encerrando quando ele digitar `NÃO`**.
- Leia o **nome completo** e a **idade** de cada aluno. O nome vai para **uma lista** e a idade para **outra lista**.
- Se a idade for **menor que 16**, avise que o aluno não pode se matricular e **não o adicione** às listas.
- No final, mostre os alunos matriculados com suas idades, o **aluno mais velho** e a **média de idade**.

> 📌 **Comando exigido:** duas listas preenchidas com `append`. O mais velho e a média devem ser calculados **a partir das listas**, e não direto dos `input`s.

**Exemplo de execução:**

```text
Deseja cadastrar um novo aluno? (SIM/NÃO): SIM
Nome completo: Diego Ramos
Idade: 25

Deseja cadastrar um novo aluno? (SIM/NÃO): SIM
Nome completo: Lia Costa
Idade: 15
Aluno não pode se matricular. Idade mínima: 16 anos.

Deseja cadastrar um novo aluno? (SIM/NÃO): SIM
Nome completo: Paulo Nunes
Idade: 31

Deseja cadastrar um novo aluno? (SIM/NÃO): NÃO

Alunos matriculados:
1. Diego Ramos - 25 anos
2. Paulo Nunes - 31 anos

Aluno mais velho: Paulo Nunes
Média de idade: 28.0 anos
```

[✅ Ver resposta](respostas/q2_academia.py)

---

## Questão 03 · Matriz · 40 pontos

Um cinema registrou o público de **3 sessões** (linhas) em **3 salas** (colunas) numa matriz **3x3**. Três analistas vão comparar os números, cada um com um critério:

| Analista | O que soma |
| -------- | ---------- |
| **Ana** | O público da **sala 1** (primeira coluna) nas três sessões |
| **Bruno** | O público da **sessão 2** (segunda linha) em todas as salas |
| **Caio** | A **diagonal principal** da matriz |

Crie um programa que:

- Leia os 9 valores da matriz.
- Mostre a matriz em formato de tabela.
- Calcule e mostre a soma de cada analista.
- Informe qual analista chegou ao **maior resultado** e com qual valor. Não é preciso tratar empates.

> 📌 **Comando exigido:** as somas devem ser feitas percorrendo a **matriz**.

**Exemplo de execução:**

```text
Digite o valor da posição [0][0]: 40
Digite o valor da posição [0][1]: 55
Digite o valor da posição [0][2]: 30
Digite o valor da posição [1][0]: 62
Digite o valor da posição [1][1]: 48
Digite o valor da posição [1][2]: 51
Digite o valor da posição [2][0]: 35
Digite o valor da posição [2][1]: 70
Digite o valor da posição [2][2]: 80

   40   55   30
   62   48   51
   35   70   80

Ana = 137
Bruno = 161
Caio = 168

Maior resultado: Caio, com 168.
```

[✅ Ver resposta](respostas/q3_cinema.py)
