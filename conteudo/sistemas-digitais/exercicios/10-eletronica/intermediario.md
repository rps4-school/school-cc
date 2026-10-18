# ⚡ Introdução à eletrônica · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Introdução à eletrônica](../../aulas/10-introducao-a-eletronica.md) · Próximo: [Difícil →](dificil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Contínua ou alternada?

Diga se cada fonte fornece corrente **contínua** ou **alternada**.

**a)** A bateria de 9 V de um detector de fumaça.

<details>
<summary>Ver resposta</summary>

**Resposta:** `contínua | corrente contínua | CC | DC`

Pilhas e baterias têm polo + e polo − fixos: a corrente vai sempre no mesmo sentido.
</details>

**b)** A tomada da sala.

<details>
<summary>Ver resposta</summary>

**Resposta:** `alternada | corrente alternada | CA | AC`

Na tomada, o sentido da corrente inverte o tempo todo.
</details>

**c)** A porta USB do notebook.

<details>
<summary>Ver resposta</summary>

**Resposta:** `contínua | corrente contínua | CC | DC`

A USB fornece 5 V contínuos. É por isso que ela alimenta o Arduino.
</details>

**d)** Quantos ciclos por segundo a corrente da tomada faz no Brasil? Escreva só o número.

<details>
<summary>Ver resposta</summary>

**Número:** `60`

No Brasil, a rede elétrica é de **60 Hz**: 60 ciclos por segundo.
</details>

---

## Exercício 05: Lendo o esquema da lanterna

Use o esquema abaixo, o mesmo do Exemplo 1 da aula.

![Esquema de uma lanterna com componentes numerados de 1 a 4](../../img/esquema-lanterna.svg)

**a)** Qual número indica o componente que **limita a corrente**?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

O ③ é o **resistor** (zigue-zague). Sem ele, a corrente no LED ficaria alta demais.
</details>

**b)** Qual número indica o componente que **transforma energia elétrica em luz**?

<details>
<summary>Ver resposta</summary>

**Número:** `4`

O ④ é o **LED**: o triângulo com a barra e as duas setinhas saindo.
</details>

**c)** Com o interruptor ② aberto, o LED acende? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

Com o interruptor aberto, o caminho tem um buraco: o circuito fica aberto e não há corrente.
</details>

**d)** Se o LED ④ fosse virado ao contrário, com o triângulo apontando para a direita, ele acenderia?

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

A corrente sai do + da bateria, dá a volta pelo resistor e chega ao LED pela **direita**. Para acender, ela precisa entrar pelo ânodo (o lado largo do triângulo). Virado, o LED fica com o cátodo desse lado e não deixa a corrente passar.
</details>

---

## Exercício 06: Qual corrente é maior?

Em cada par, escreva a **maior** corrente, com a unidade.

**a)** 0,05 A ou 500 mA?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `500 mA`

0,05 A = 50 mA. Então **500 mA** é dez vezes maior.
</details>

**b)** 2 500 µA ou 2 mA?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2500 µA`

2 500 µA = 2 500 ÷ 1 000 = 2,5 mA. Então **2 500 µA** é maior que 2 mA.
</details>

**c)** 0,8 A ou 750 mA?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `0,8 A`

0,8 A = 800 mA, maior que 750 mA.
</details>

> 💡 Para comparar, ponha tudo na **mesma unidade** primeiro (aqui, mA). Comparar só os números (500 com 0,05) engana.
