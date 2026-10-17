# 🧩 Funções · 🟢 Fácil

> [← voltar para Exercícios](../../README.md) · 📖 Antes, leia: [Funções](../../../aulas/06-funcoes.md) · Próximo: [Intermediário →](intermediario.md)

Em todos os exercícios de funções, **crie as funções pedidas com `def`** e use-as no programa. A leitura (`input`) e a saída (`print`) ficam fora delas, a não ser que o enunciado diga outra coisa.

---

## Exercício 01: Área e perímetro

Crie as funções `area(base, altura)` e `perimetro(base, altura)`, que **devolvem** (com `return`) a área e o perímetro de um retângulo. Leia a base e a altura (números reais) e mostre os dois resultados.

**Entrada:**
```text
3
4.5
```
**Saída:**
```text
Área: 13.5
Perímetro: 15.0
```

> 💡 **Dica:** a área é `base * altura` e o perímetro é `2 * (base + altura)`. As funções só calculam e devolvem; quem mostra é o `print`, fora delas.

[✅ Ver resposta](../../respostas/06-funcoes/facil/ex01_area_e_perimetro.py)

---

## Exercício 02: Par ou ímpar

Crie a função `eh_par(numero)`, que devolve `True` se o número for par e `False` se for ímpar. Leia vários números inteiros na mesma linha, diga se cada um é par ou ímpar e, no fim, quantos são pares.

**Entrada:**
```text
4 7 10 15
```
**Saída:**
```text
4 é par
7 é ímpar
10 é par
15 é ímpar
Total de pares: 2
```

> 💡 **Dica:** uma função pode devolver direto o resultado de uma comparação: `return numero % 2 == 0`. Na hora de usar, escreva `if eh_par(n):`, sem `== True`.

[✅ Ver resposta](../../respostas/06-funcoes/facil/ex02_par_ou_impar.py)

---

## Exercício 03: Saudação

Crie a função `saudacao(nome, periodo="manhã")`, que devolve a saudação certa para o período: `Bom dia` (manhã), `Boa tarde` (tarde) ou `Boa noite` (noite), seguida de vírgula, do nome e de `!`. Guarde as saudações num **dicionário** dentro da função.

Leia o nome e, na linha seguinte, o período. Se a linha do período vier **vazia**, chame a função só com o nome, para usar o valor padrão (é o que acontece no segundo exemplo).

**Entrada:**
```text
Ana
tarde
```
**Saída:**
```text
Boa tarde, Ana!
```

**Entrada:**
```text
Bruno

```
**Saída:**
```text
Bom dia, Bruno!
```

> 💡 **Dica:** um parâmetro com valor padrão (`periodo="manhã"`) pode ser omitido na chamada: `saudacao("Bruno")`. Uma linha vazia lida com `input()` é a string `""`.

[✅ Ver resposta](../../respostas/06-funcoes/facil/ex03_saudacao.py)
