# ⏱️ delay() e millis() · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [delay() e millis()](../../aulas/20-delay-e-millis.md) · Próximo: [Leitura analógica →](../21-leitura-analogica/facil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O int que estoura

**a)** O programa faz `int t = millis();`. A partir de quanto tempo de programa rodando o `t` fica negativo? Responda em segundos, com três casas.

<details>
<summary>Ver resposta</summary>

**Grandeza:** `32,768 s ± 0,001 s`

O `int` vai até 32 767. Com o `millis()` em **32 768** ms, o valor não cabe e vira −32 768: a partir de **32,768 s**.
</details>

**b)** O que `Serial.println(x);` mostra depois de `int x = 40000;`?

<details>
<summary>Ver resposta</summary>

**Número:** `-25536`

40 000 não cabe em 16 bits com sinal: sobra 40 000 − 65 536 = **−25 536**. O programa compila e roda assim, sem erro: o valor errado passa despercebido.
</details>

**c)** E se o tempo fosse guardado num `unsigned int`? Depois de quantos segundos ele voltaria a zero?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `65,536 s ± 0,001 s`

O `unsigned int` vai até 65 535: com o `millis()` em 65 536, ele volta a **0**. São **65,536 s**, pouco mais de um minuto. Por isso, `unsigned long`.
</details>

---

## Exercício 08: A volta do relógio

`antes` vale 4 294 967 000 (o `millis()` de quase 49,7 dias). Todas as variáveis são `unsigned long`.

**a)** O relógio voltou a zero, e `agora` vale 200. Quanto dá `agora - antes`?

<details>
<summary>Ver resposta</summary>

**Número:** `496`

Em 32 bits sem sinal, a conta "dá a volta": 200 − 4 294 967 000 + 4 294 967 296 = **496**. É o tempo que realmente passou.
</details>

**b)** Outro programa calcula `proximo = antes + 500;`. Quanto vale `proximo`?

<details>
<summary>Ver resposta</summary>

**Número:** `204`

4 294 967 500 não cabe: 4 294 967 500 − 4 294 967 296 = **204**.
</details>

**c)** Esse programa testa `if (millis() >= proximo)`, e o `millis()` vale 4 294 967 100 (ainda antes de voltar a zero). Quantos milissegundos **antes** da hora certa ele dispara?

<details>
<summary>Ver resposta</summary>

**Número:** `400`

4 294 967 100 ≥ 204: dispara já. A hora certa era `antes` + 500 = 4 294 967 500; o relógio está em `antes` + 100, então dispara **400 ms** antes. Com `agora - antes >= 500`, isso não acontece.
</details>

---

## Exercício 09: O semáforo como máquina de estados

O semáforo da seção 6 da aula: verde (estado 0) por 5 s, amarelo (1) por 2 s e vermelho (2) por 5 s, começando no verde em t = 0.

**a)** Qual LED está aceso em t = 6 s?

<details>
<summary>Ver resposta</summary>

**Resposta:** `amarelo`

Verde de 0 a 5 s, **amarelo** de 5 a 7 s.
</details>

**b)** E em t = 13,5 s?

<details>
<summary>Ver resposta</summary>

**Resposta:** `verde`

O ciclo tem 5 + 2 + 5 = 12 s. Em 13,5 s, faz 1,5 s que o ciclo recomeçou: **verde**.
</details>

**c)** Qual é o valor de `estado` depois de exatamente 3 trocas?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

0 → 1 → 2 → 0: `(estado + 1) % 3` volta a **0** depois do 2.
</details>

**d)** Por que essa versão deixa o semáforo responder na hora a um botão de pedestre, e a versão com `delay()` não? Responda com a letra.

(a) porque o `millis()` é mais preciso que o `delay()`; (b) porque o `loop()` nunca fica parado esperando: ele volta em microssegundos e pode ler o botão a cada volta; (c) porque o botão gera uma interrupção.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

A diferença não é precisão: é que o programa **nunca para**. Com `delay(5000)`, o botão ficaria até 5 s sem ser lido.
</details>
