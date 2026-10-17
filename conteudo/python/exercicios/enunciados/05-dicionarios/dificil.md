# 📒 Dicionários · 🔴 Difícil

> [← voltar para Exercícios](../../README.md) · [← Intermediário](intermediario.md)

---

## Exercício 07: Anagramas

Dois **anagramas** têm exatamente as mesmas letras, em outra ordem (como `amor` e `roma`). Leia a quantidade de palavras e uma palavra por linha (em minúsculas). Mostre os grupos de anagramas, um grupo por linha, com as palavras separadas por vírgula, na ordem em que cada grupo e cada palavra apareceram.

**Entrada:**
```text
6
amor
roma
pato
mora
topa
casa
```
**Saída:**
```text
amor, roma, mora
pato, topa
casa
```

> 💡 **Dica:** anagramas viram a mesma string quando você ordena as letras: `"".join(sorted("roma"))` dá `"amor"`. Use essa string ordenada como **chave** de um dicionário de listas.

[✅ Ver resposta](../../respostas/05-dicionarios/dificil/ex07_anagramas.py)

---

## Exercício 08: Quem mora em cada cidade?

Leia a quantidade de pessoas e cada pessoa no formato `nome cidade`. Mostre cada cidade, em ordem alfabética, seguida dos moradores, também em ordem alfabética e separados por vírgula.

**Entrada:**
```text
5
Caio Recife
Bia Olinda
Ana Recife
Davi Olinda
Edu Paulista
```
**Saída:**
```text
Olinda: Bia, Davi
Paulista: Edu
Recife: Ana, Caio
```

> 💡 **Dica:** é o mesmo dado "virado ao contrário": a cidade vira a chave e a lista de nomes vira o valor. `sorted(dicionario)` devolve as chaves em ordem, e `", ".join(sorted(lista))` monta a linha.

[✅ Ver resposta](../../respostas/05-dicionarios/dificil/ex08_quem_mora_em_cada_cidade.py)

---

## Exercício 09: Tabela do campeonato

Leia a quantidade de jogos e cada jogo no formato `TimeA golsA x golsB TimeB`. Vitória vale 3 pontos, empate vale 1 e derrota vale 0. Mostre a classificação: mais pontos primeiro e, em caso de empate em pontos, em ordem alfabética. Escreva `ponto` no singular quando o time tiver 1 ponto.

**Entrada:**
```text
3
Sport 2 x 1 Nautico
Nautico 1 x 1 Santa
Santa 0 x 3 Sport
```
**Saída:**
```text
1. Sport - 6 pontos
2. Nautico - 1 ponto
3. Santa - 1 ponto
```

> 💡 **Dica:** `time_a, gols_a, x, gols_b, time_b = input().split()` separa o jogo (o `x` é só um separador). Some os pontos num dicionário. Para a classificação, repita: ache o melhor time que sobrou, mostre e tire da lista.

[✅ Ver resposta](../../respostas/05-dicionarios/dificil/ex09_tabela_do_campeonato.py)
