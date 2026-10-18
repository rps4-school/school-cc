# 💻 Programação Arduino · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Programação Arduino em C/C++](../../aulas/16-programacao-arduino.md) · Próximo: [Difícil →](dificil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Contas com inteiros

Quanto vale cada expressão, no Uno?

**a)** `10 / 3`

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Os dois são inteiros: divisão inteira. 10 = 3 × 3 + 1, e o resto é jogado fora: **3**.
</details>

**b)** `17 % 5`

<details>
<summary>Ver resposta</summary>

**Número:** `2`

O `%` dá o **resto**: 17 = 5 × 3 + **2**.
</details>

**c)** A variável `media`, depois de `float media = (3 + 4) / 2;`

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Primeiro a conta: `(3 + 4) / 2` = `7 / 2`, entre inteiros, dá 3. Só depois o 3 vai para o `float`: **3.0**.
</details>

**d)** A variável `media`, depois de `float media = (3 + 4) / 2.0;`

<details>
<summary>Ver resposta</summary>

**Número:** `3,5`

O `2.0` tem vírgula: a conta é feita com vírgula, e `7 / 2.0` = **3.5**.
</details>

---

## Exercício 05: Global ou local?

```cpp
int total = 0;

void loop() {
  int vezes = 0;
  vezes = vezes + 1;
  total = total + 1;
}
```

**a)** Depois de **5 voltas** do `loop()`, quanto vale `total`?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

`total` é **global**: criada uma vez, fora das funções, guarda o valor entre as voltas. Vale 1, 2, 3, 4 e **5**.
</details>

**b)** E quanto vale `vezes` no fim da 5ª volta?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

`vezes` é **local**: nasce de novo, com 0, a cada volta, e termina sempre com **1**.
</details>

---

## Exercício 06: Funções

```cpp
int dobro(int x) {
  return 2 * x;
}

int maisUm(int x) {
  return x + 1;
}
```

**a)** Quanto vale `dobro(6)`?

<details>
<summary>Ver resposta</summary>

**Número:** `12`

2 × 6 = **12**.
</details>

**b)** E `maisUm(dobro(5))`?

<details>
<summary>Ver resposta</summary>

**Número:** `11`

De dentro para fora: `dobro(5)` = 10, e `maisUm(10)` = **11**.
</details>

**c)** Uma função que só pisca um LED e não devolve nada tem qual tipo de retorno?

<details>
<summary>Ver resposta</summary>

**Resposta:** `void`

`void`: quer dizer "não devolve nada". É o mesmo tipo de `setup()` e `loop()`.
</details>
