# 🔀 Condicionais · 🔴 Difícil

> [← voltar para Exercícios](../../README.md) · [← Intermediário](intermediario.md)

---

## Exercício 07: Calculadora de IMC

Leia o peso (kg) e a altura (m), um por linha. Se algum dos dois for menor ou igual a 0, mostre `Dados inválidos`. Senão, calcule o IMC = peso ÷ altura², mostre com 2 casas decimais e, na linha de baixo, a classificação:

| IMC | Classificação |
| --- | ------------- |
| Menor que 18,5 | `Abaixo do peso` |
| De 18,5 até menos de 25 | `Peso normal` |
| De 25 até menos de 30 | `Sobrepeso` |
| De 30 até menos de 35 | `Obesidade grau I` |
| De 35 até menos de 40 | `Obesidade grau II` |
| 40 ou mais | `Obesidade grau III` |

**Entrada:**
```text
70
1.75
```
**Saída:**
```text
IMC: 22.86
Peso normal
```

**Entrada:**
```text
120
1.70
```
**Saída:**
```text
IMC: 41.52
Obesidade grau III
```

**Entrada:**
```text
-5
1.80
```
**Saída:**
```text
Dados inválidos
```

> 💡 **Dica:** potência em Python é `**`. Guarde a classificação numa variável e imprima no final.

[✅ Ver resposta](../../respostas/01-condicionais/dificil/ex07_imc.py)

---

## Exercício 08: Data válida

Leia dia, mês e ano, um por linha, e diga se a data existe (`Data válida` ou `Data inválida`). Regras:

- O ano deve ser 1 ou maior, e o mês deve estar entre 1 e 12.
- Abril, junho, setembro e novembro têm 30 dias. Os outros meses têm 31, menos fevereiro.
- Fevereiro tem 29 dias em ano bissexto e 28 nos outros (regra do bissexto no [exercício 05](intermediario.md#exercício-05-ano-bissexto)).

**Entrada:**
```text
29
2
2024
```
**Saída:**
```text
Data válida
```

**Entrada:**
```text
29
2
2023
```
**Saída:**
```text
Data inválida
```

**Entrada:**
```text
31
4
2025
```
**Saída:**
```text
Data inválida
```

> 💡 **Dica:** primeiro descubra **quantos dias** o mês tem e guarde numa variável. Depois é só comparar o dia com ela.

[✅ Ver resposta](../../respostas/01-condicionais/dificil/ex08_data_valida.py)

---

## Exercício 09: Pedra, papel e tesoura

Leia a jogada do jogador 1 e a do jogador 2, uma por linha. Aceite maiúsculas e minúsculas. Mostre `Jogador 1 venceu`, `Jogador 2 venceu` ou `Empate`. Se alguma jogada não for `pedra`, `papel` ou `tesoura`, mostre `Jogada inválida`.

Regras: pedra ganha de tesoura, tesoura ganha de papel e papel ganha de pedra.

**Entrada:**
```text
pedra
tesoura
```
**Saída:**
```text
Jogador 1 venceu
```

**Entrada:**
```text
Papel
TESOURA
```
**Saída:**
```text
Jogador 2 venceu
```

**Entrada:**
```text
papel
papel
```
**Saída:**
```text
Empate
```

**Entrada:**
```text
lagarto
pedra
```
**Saída:**
```text
Jogada inválida
```

> 💡 **Dica:** `.lower()` deixa o texto em minúsculas e `.strip()` tira espaços das pontas. Liste só os casos em que o **jogador 1** vence. Se não for empate nem vitória dele, quem venceu foi o jogador 2.

[✅ Ver resposta](../../respostas/01-condicionais/dificil/ex09_pedra_papel_tesoura.py)
