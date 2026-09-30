# 📝 Simulado 03 · Python

> [← voltar para Simulados](../../README.md)

**Nível:** 🔴 Avançado

**Duração sugerida:** 2h · **Pontuação:** 100 pontos · **Assuntos:** condicional, repetição, lista e matriz

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações ou IA.
> - Só Python puro: **nenhum `import`**.
> - Quando a questão tiver um **comando exigido**, não usá-lo vale metade da pontuação.
> - Código sem boas práticas (nomes claros, sem repetição à toa) perde 10% da questão.
> - Um arquivo por questão: `q1.py`, `q2.py` e `q3.py`.
> - Só abra as respostas depois que o tempo acabar.

---

## Questão 01 · Condicional e repetição · 20 pontos

O controle de um drone tem **6 botões**, numerados de **0 a 5**. O piloto aperta **dois botões** e o drone executa a manobra cujo código é a **soma** dos dois.

| Código | Manobra | Código | Manobra |
| :----: | ------- | :----: | ------- |
| 0 | DECOLAR | 4 | AVANÇAR |
| 1 | SUBIR | 5 | RECUAR |
| 2 | DESCER | 6 | FOTOGRAFAR |
| 3 | GIRAR | 7 | POUSAR |

Escreva um programa que **continue lendo combinações** até que o primeiro botão digitado seja **`-1`**. Nesse momento, ele mostra `Controle desligado.` e termina.

- Se algum botão não existir (fora de 0 a 5), mostre `Botão inexistente.`
- Se a soma não tiver manobra (acima de 7), mostre `Combinação inválida.`

> 📌 **Comando exigido:** `if` / `elif` / `else` dentro de um `while`. Não use listas nem dicionários.

**Exemplo de execução:**

```text
Primeiro botão (0 a 5, ou -1 para sair): 2
Segundo botão (0 a 5): 1
Manobra: GIRAR

Primeiro botão (0 a 5, ou -1 para sair): 4
Segundo botão (0 a 5): 4
Combinação inválida.

Primeiro botão (0 a 5, ou -1 para sair): 9
Segundo botão (0 a 5): 0
Botão inexistente.

Primeiro botão (0 a 5, ou -1 para sair): -1
Controle desligado.
```

[✅ Ver resposta](respostas/q1_drone.py)

---

## Questão 02 · Lista · 40 pontos

Uma biblioteca comunitária vai cadastrar leitores. Só podem se cadastrar pessoas com **12 anos ou mais**, e **ninguém pode ser cadastrado duas vezes**. Desenvolva um programa que:

- Leia o **nome completo** de cada leitor. Se o nome **já estiver na lista**, mostre `Leitor já cadastrado.` e não peça a idade.
- Leia a **idade**. Se for **menor que 12**, avise que o leitor não pode se cadastrar e **não o adicione**.
- Nomes e idades ficam em **duas listas**.
- Depois de cada cadastro, pergunte se deseja cadastrar outro leitor, **encerrando com `NÃO`**.
- No final, mostre os leitores cadastrados, o **mais novo**, o **mais velho**, a **média de idade** e **quantos cadastros foram recusados por idade**.

> 📌 **Comando exigido:** duas listas preenchidas com `append`. Use a própria lista para descobrir se o nome já existe.

**Exemplo de execução:**

```text
Nome completo: Nina Alves
Idade: 14
Deseja cadastrar outro leitor? (SIM/NÃO): SIM

Nome completo: Tomás Brito
Idade: 10
Leitor não pode se cadastrar. Idade mínima: 12 anos.
Deseja cadastrar outro leitor? (SIM/NÃO): SIM

Nome completo: Nina Alves
Leitor já cadastrado.
Deseja cadastrar outro leitor? (SIM/NÃO): SIM

Nome completo: Eva Prado
Idade: 35
Deseja cadastrar outro leitor? (SIM/NÃO): NÃO

Leitores cadastrados:
1. Nina Alves - 14 anos
2. Eva Prado - 35 anos

Leitor mais novo: Nina Alves
Leitor mais velho: Eva Prado
Média de idade: 24.5 anos
Cadastros recusados por idade: 1
```

[✅ Ver resposta](respostas/q2_biblioteca.py)

---

## Questão 03 · Matriz · 40 pontos

Uma professora guarda as notas de **4 alunos** (linhas) em **4 provas** (colunas) numa matriz **4x4** de números reais.

Crie um programa que:

- Leia as **16 notas** e mostre o boletim em formato de tabela, com uma linha por aluno.
- **Repita** as consultas até a operação ser **`F`** (fim). Em cada consulta, peça primeiro a **operação** e depois o **aluno** (linha, de 0 a 3):

    | Letra | Operação |
    | :---: | -------- |
    | `S` | Soma das notas do aluno |
    | `M` | Média do aluno, com `APROVADO` (7 ou mais) ou `REPROVADO` |
    | `X` | Maior nota do aluno |
    | `N` | Menor nota do aluno |

- Para outra letra, mostre `Opção Inválida`. Para um aluno fora de 0 a 3, mostre `Aluno inválido.`

> 📌 **Comando exigido:** as notas devem ser lidas **da matriz** (a linha do aluno).

**Exemplo de execução:**

```text
Nota do aluno 0, prova 0: 7.5
Nota do aluno 0, prova 1: 8.0
Nota do aluno 0, prova 2: 6.5
Nota do aluno 0, prova 3: 9.0
Nota do aluno 1, prova 0: 6.0
Nota do aluno 1, prova 1: 5.5
Nota do aluno 1, prova 2: 7.0
Nota do aluno 1, prova 3: 6.5
Nota do aluno 2, prova 0: 9.5
Nota do aluno 2, prova 1: 9.0
Nota do aluno 2, prova 2: 8.5
Nota do aluno 2, prova 3: 10.0
Nota do aluno 3, prova 0: 8.0
Nota do aluno 3, prova 1: 6.0
Nota do aluno 3, prova 2: 7.5
Nota do aluno 3, prova 3: 7.0

Boletim:
Aluno 0:   7.5   8.0   6.5   9.0
Aluno 1:   6.0   5.5   7.0   6.5
Aluno 2:   9.5   9.0   8.5  10.0
Aluno 3:   8.0   6.0   7.5   7.0

Digite a operação (S/M/X/N, ou F para fim): M
Digite o aluno (linha 0 a 3): 2
Média: 9.25 (APROVADO)

Digite a operação (S/M/X/N, ou F para fim): M
Digite o aluno (linha 0 a 3): 1
Média: 6.25 (REPROVADO)

Digite a operação (S/M/X/N, ou F para fim): X
Digite o aluno (linha 0 a 3): 0
Maior nota: 9.0

Digite a operação (S/M/X/N, ou F para fim): Q
Digite o aluno (linha 0 a 3): 3
Opção Inválida

Digite a operação (S/M/X/N, ou F para fim): S
Digite o aluno (linha 0 a 3): 5
Aluno inválido.

Digite a operação (S/M/X/N, ou F para fim): F
Consulta encerrada.
```

[✅ Ver resposta](respostas/q3_boletim.py)
