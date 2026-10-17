# 🧩 Funções · 🔴 Difícil

> [← voltar para Exercícios](../../README.md) · [← Intermediário](intermediario.md)

Os exercícios difíceis juntam **tudo** o que você estudou: condicionais, repetição, listas, strings, dicionários e funções. Divida o problema em funções pequenas, cada uma com uma tarefa.

---

## Exercício 07: Palavra mais frequente

Crie três funções:

- `limpar(texto)`: devolve a **lista** de palavras do texto, em minúsculas e sem os sinais `. , ! ? ; :`.
- `contar(palavras)`: devolve um **dicionário** com quantas vezes cada palavra aparece.
- `mais_frequente(contagem)`: devolve **dois valores**, a palavra que mais aparece e quantas vezes. Em caso de empate, vale a que apareceu primeiro no texto.

Leia um texto e mostre o total de palavras, quantas são diferentes e a mais frequente.

**Entrada:**
```text
O sol nasceu. O dia, que dia! O sol voltou.
```
**Saída:**
```text
Palavras: 10
Diferentes: 6
Mais frequente: o (3 vezes)
```

> 💡 **Dica:** para tirar os sinais, percorra `".,!?;:"` e faça `texto = texto.replace(sinal, "")`. Uma função devolve dois valores com `return palavra, vezes`, e quem chama recebe com `palavra, vezes = mais_frequente(contagem)`.

[✅ Ver resposta](../../respostas/06-funcoes/dificil/ex07_palavra_mais_frequente.py)

---

## Exercício 08: Caixa eletrônico

O caixa tem notas de **200, 100, 50, 20 e 10** reais. Crie duas funções:

- `sacar(valor)`: devolve um **dicionário** com quantas notas de cada valor entregar, usando sempre a maior nota possível. Só entram as notas usadas.
- `plural(quantidade, palavra)`: devolve a quantidade com a palavra no singular ou no plural (`1 nota`, `2 notas`).

Leia o valor do saque. Se ele não for um múltiplo de 10, mostre `Valor inválido: use um múltiplo de 10`. Senão, mostre as notas e o total de notas.

**Entrada:**
```text
570
```
**Saída:**
```text
2 notas de R$ 200
1 nota de R$ 100
1 nota de R$ 50
1 nota de R$ 20
Total: 5 notas
```

**Entrada:**
```text
75
```
**Saída:**
```text
Valor inválido: use um múltiplo de 10
```

> 💡 **Dica:** percorra a lista `[200, 100, 50, 20, 10]`. Para cada nota, `valor // nota` diz quantas cabem e `valor % nota` diz quanto sobra.

[✅ Ver resposta](../../respostas/06-funcoes/dificil/ex08_caixa_eletronico.py)

---

## Exercício 09: Calculadora com tabela de funções

Em Python, uma função também é um valor: dá para guardá-la num dicionário. Crie as funções `somar`, `subtrair`, `multiplicar` e `dividir` (cada uma recebe dois números e devolve o resultado) e um dicionário que liga cada símbolo à sua função:

```
operacoes = {"+": somar, "-": subtrair, "*": multiplicar, "/": dividir}
```

Leia contas no formato `numero operador numero`, uma por linha, até a linha `fim`. Para cada conta, mostre o resultado. Se o operador não existir, mostre `Operação inválida: <operador>`. Na divisão por zero, mostre `Erro: divisão por zero`. No fim, mostre quantas contas deram certo.

**Entrada:**
```text
3 + 4
10 / 4
7 % 2
5 / 0
6 * 7
fim
```
**Saída:**
```text
3 + 4 = 7
10 / 4 = 2.5
Operação inválida: %
Erro: divisão por zero
6 * 7 = 42
Contas feitas: 3
```

> 💡 **Dica:** `operacoes["+"]` **é** a função `somar`; com parênteses, ela é chamada: `operacoes["+"](3, 4)` dá `7`. Use `while True:` com `break` quando a linha for `fim`.

[✅ Ver resposta](../../respostas/06-funcoes/dificil/ex09_calculadora_com_tabela_de_funcoes.py)
