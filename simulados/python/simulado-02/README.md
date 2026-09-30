# 📝 Simulado 02 · Python

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

Um robô de cozinha tem um painel com **6 botões**, numerados de **0 a 5**. O cozinheiro aperta **dois botões** e o robô prepara a receita cujo código é a **soma** dos dois.

| Código | Receita | Código | Receita |
| :----: | ------- | :----: | ------- |
| 0 | OMELETE | 4 | CREPE |
| 1 | PANQUECA | 5 | SANDUÍCHE |
| 2 | TAPIOCA | 6 | SALADA |
| 3 | CUSCUZ | 7 | SOPA |

Escreva um programa que leia os dois botões e mostre a receita.

- Se algum botão não existir (fora de 0 a 5), mostre `Botão inexistente.`
- Se a soma não tiver receita (acima de 7), mostre `Combinação inválida.`
- **Regra extra:** se os dois botões forem **iguais**, mostre também `Porção dupla!`

> 📌 **Comando exigido:** `if` / `elif` / `else`. Não use listas nem dicionários.

**Exemplos de execução:**

```text
Primeiro botão (0 a 5): 1
Segundo botão (0 a 5): 1
Receita: TAPIOCA
Porção dupla!
```

```text
Primeiro botão (0 a 5): 4
Segundo botão (0 a 5): 5
Combinação inválida.
```

[✅ Ver resposta](respostas/q1_robo_de_cozinha.py)

---

## Questão 02 · Lista · 40 pontos

A organização de uma corrida de rua está montando a lista de inscritos. Só podem correr pessoas com **18 anos ou mais**. Desenvolva um programa que:

- Leia o **nome completo** e a **idade** de cada corredor. O nome vai para **uma lista** e a idade para **outra lista**.
- Se a idade for **menor que 18**, avise que o corredor não pode se inscrever e **não o adicione** às listas.
- Depois de cada cadastro, pergunte se deseja inscrever outro corredor, **encerrando quando o usuário digitar `NÃO`**.
- No final, mostre os inscritos com suas idades, o **corredor mais novo** e a **média de idade**.

> 📌 **Comando exigido:** duas listas preenchidas com `append`. O mais novo e a média devem ser calculados **a partir das listas**.

**Exemplo de execução:**

```text
Nome completo: Rafael Lima
Idade: 17
Corredor não pode se inscrever. Idade mínima: 18 anos.
Deseja inscrever outro corredor? (SIM/NÃO): SIM

Nome completo: Júlia Rocha
Idade: 29
Deseja inscrever outro corredor? (SIM/NÃO): SIM

Nome completo: Marcos Dias
Idade: 21
Deseja inscrever outro corredor? (SIM/NÃO): NÃO

Corredores inscritos:
Júlia Rocha - 29 anos
Marcos Dias - 21 anos

Corredor mais novo: Marcos Dias
Média de idade: 25.0 anos
```

[✅ Ver resposta](respostas/q2_maratona.py)

---

## Questão 03 · Matriz · 40 pontos

Uma estação meteorológica mede a temperatura de **4 cidades** (colunas) em **4 horários** do dia (linhas). Cada medição é um número real (`float`).

Crie um programa que:

- Leia os **16 valores** e guarde numa matriz **4x4**.
- Mostre a matriz em formato de tabela.
- Peça o **número da cidade** (coluna, de 0 a 3) e uma **operação**, com uma letra maiúscula:

    | Letra | Operação |
    | :---: | -------- |
    | `S` | Soma das temperaturas |
    | `M` | Média |
    | `X` | Maior temperatura |
    | `N` | Menor temperatura |

- Mostre os valores da coluna escolhida e o resultado. Para qualquer outra letra, mostre `Opção Inválida`. Para uma cidade fora de 0 a 3, mostre `Cidade inválida.`

> 📌 **Comando exigido:** os valores devem ser lidos **da matriz**. A indexação começa em zero: a primeira cidade é a coluna 0.

**Exemplos de execução:**

```text
Temperatura [0][0]: 22.5
Temperatura [0][1]: 24.0
Temperatura [0][2]: 19.5
Temperatura [0][3]: 30.0
Temperatura [1][0]: 25.0
Temperatura [1][1]: 26.5
Temperatura [1][2]: 21.0
Temperatura [1][3]: 32.5
Temperatura [2][0]: 28.0
Temperatura [2][1]: 27.0
Temperatura [2][2]: 23.5
Temperatura [2][3]: 33.0
Temperatura [3][0]: 23.5
Temperatura [3][1]: 25.5
Temperatura [3][2]: 20.0
Temperatura [3][3]: 29.5

Temperaturas registradas:
   22.5   24.0   19.5   30.0
   25.0   26.5   21.0   32.5
   28.0   27.0   23.5   33.0
   23.5   25.5   20.0   29.5

Digite a cidade (coluna 0 a 3): 1
Digite a operação (S/M/X/N): M
Valores analisados: 24.0, 26.5, 27.0, 25.5
Resultado (M): 25.75
```

Com a mesma matriz, escolhendo uma letra que não existe:

```text
Digite a cidade (coluna 0 a 3): 3
Digite a operação (S/M/X/N): Z
Opção Inválida
```

[✅ Ver resposta](respostas/q3_estacao_meteorologica.py)
