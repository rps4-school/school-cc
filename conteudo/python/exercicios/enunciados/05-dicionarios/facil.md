# 📒 Dicionários · 🟢 Fácil

> [← voltar para Exercícios](../../README.md) · 📖 Antes, leia: [Dicionários](../../../aulas/05-dicionarios.md) · Próximo: [Intermediário →](intermediario.md)

Nestes exercícios, cada informação vem **em uma linha** e é lida com `input()`. Quando a linha tem duas informações, separe com `split()`.

---

## Exercício 01: Tradutor de cores

Crie um dicionário que traduz cores do português para o inglês:

| Português | Inglês |
| --------- | ------ |
| vermelho | red |
| azul | blue |
| verde | green |
| amarelo | yellow |
| preto | black |
| branco | white |

Leia o nome de uma cor em português (pode vir com letras maiúsculas) e mostre a tradução. Se a cor não estiver no dicionário, mostre `Cor desconhecida`.

**Entrada:**
```text
Azul
```
**Saída:**
```text
blue
```

**Entrada:**
```text
roxo
```
**Saída:**
```text
Cor desconhecida
```

> 💡 **Dica:** passe a cor para minúsculas com `lower()`. O `get(chave, padrão)` devolve o valor da chave ou, se ela não existir, o padrão: dá para resolver sem `if`.

[✅ Ver resposta](../../respostas/05-dicionarios/facil/ex01_tradutor_de_cores.py)

---

## Exercício 02: Agenda de telefones

Leia a quantidade de contatos e, em seguida, cada contato no formato `nome telefone`. Por último, leia um nome e mostre o telefone dele. Se o nome não estiver na agenda, avise.

**Entrada:**
```text
3
Ana 99999-1234
Bia 98888-4321
Caio 97777-0000
Bia
```
**Saída:**
```text
Telefone de Bia: 98888-4321
```

**Entrada:**
```text
2
Ana 99999-1234
Caio 97777-0000
Duda
```
**Saída:**
```text
Duda não está na agenda
```

> 💡 **Dica:** `nome, telefone = input().split()` separa a linha em duas variáveis. Guarde com `agenda[nome] = telefone` e, na busca, use `in` para saber se a chave existe.

[✅ Ver resposta](../../respostas/05-dicionarios/facil/ex02_agenda_de_telefones.py)

---

## Exercício 03: Contagem de votos

Leia a quantidade de votos e, em seguida, um voto por linha (o nome do candidato). Mostre quantos votos cada candidato recebeu, na ordem em que cada um apareceu pela primeira vez.

**Entrada:**
```text
5
Ana
Bruno
Ana
Carla
Ana
```
**Saída:**
```text
Ana: 3
Bruno: 1
Carla: 1
```

> 💡 **Dica:** este é o padrão "contar com dicionário": `votos[nome] = votos.get(nome, 0) + 1`. Para mostrar, percorra com `for nome, total in votos.items():`. O dicionário lembra a ordem em que as chaves entraram.

[✅ Ver resposta](../../respostas/05-dicionarios/facil/ex03_contagem_de_votos.py)
