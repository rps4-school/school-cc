# ⏱️ delay() e millis() · 🟢 Fácil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [delay() e millis()](../../aulas/20-delay-e-millis.md) · Próximo: [Intermediário →](intermediario.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 01: Os tipos do relógio

**a)** Qual é o maior valor que um `int` guarda no Uno?

<details>
<summary>Ver resposta</summary>

**Número:** `32767`

16 bits com sinal: de −32 768 a **32 767**.
</details>

**b)** Quantos bits tem um `unsigned long`?

<details>
<summary>Ver resposta</summary>

**Número:** `32`

**32** bits sem sinal: de 0 a 4 294 967 295.
</details>

**c)** Depois de quantos dias o `millis()` volta a zero? Responda com uma casa decimal.

<details>
<summary>Ver resposta</summary>

**Número:** `49,7 ± 0,1`

2³² ms = 4 294 967 296 ms. Dividindo por 1 000 (s), 60 (min), 60 (h) e 24 (dias): ≈ **49,7 dias**.
</details>

---

## Exercício 02: Convertendo o tempo

**a)** `millis()` devolveu 3 600 000. Quantos minutos se passaram desde o início do programa?

<details>
<summary>Ver resposta</summary>

**Número:** `60`

3 600 000 ms = 3 600 s = **60** minutos (1 hora).
</details>

**b)** Quanto tempo o `delay(2500)` espera?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2,5 s`

O `delay` recebe milissegundos: 2 500 ms = **2,5 s**.
</details>

**c)** `micros()` devolveu 1 500 000. Quantos milissegundos são?

<details>
<summary>Ver resposta</summary>

**Número:** `1500`

1 ms = 1 000 µs: 1 500 000 / 1 000 = **1 500** ms.
</details>

---

## Exercício 03: delay ou millis?

Para cada situação, responda **delay** ou **millis**.

**a)** No `setup()`, esperar 2 s para o sensor estabilizar, sem precisar fazer mais nada.

<details>
<summary>Ver resposta</summary>

**Resposta:** `delay | delay()`

Não há outra tarefa esperando: um `delay(2000)` resolve.
</details>

**b)** Piscar um LED e, ao mesmo tempo, responder na hora a um botão.

<details>
<summary>Ver resposta</summary>

**Resposta:** `millis | millis()`

Com `delay`, o botão só seria lido entre as esperas. Com `millis()`, o `loop()` nunca para.
</details>

**c)** Dois LEDs, um trocando a cada 300 ms e o outro a cada 500 ms.

<details>
<summary>Ver resposta</summary>

**Resposta:** `millis | millis()`

Cada LED precisa do seu relógio. Com `delay`, um espera o outro. É o [projeto 05](../../laboratorio/projetos/05-pisca-sem-delay/README.md).
</details>
