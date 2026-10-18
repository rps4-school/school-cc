# 📟 Monitor serial · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Monitor serial](../../aulas/18-monitor-serial.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: O contador que não conta

```cpp
void setup() {
  Serial.begin(9600);
}

void loop() {
  int contagem = 0;
  contagem = contagem + 1;
  Serial.println(contagem);
  delay(1000);
}
```

**a)** O que aparece na 3ª linha do monitor?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

`contagem` é **local**: nasce com 0 a cada volta do `loop()`, ganha 1 e é impressa. Todas as linhas mostram **1**.
</details>

**b)** Para o monitor mostrar 1, 2, 3..., o que fazer? Responda com a letra.

(a) criar `contagem` fora das funções, como variável global; (b) trocar o `println` por `print`; (c) aumentar o `delay`.

<details>
<summary>Ver resposta</summary>

**Resposta:** `a`

Global, `int contagem = 0;` é criada **uma vez** e guarda o valor entre as voltas. O `print` só juntaria tudo na mesma linha (`111...`) e o `delay` só mudaria o ritmo.
</details>

**c)** Com a correção, o que aparece na 3ª linha?

<details>
<summary>Ver resposta</summary>

**Resposta:** `3`

A cada volta, a global ganha 1 e é impressa: 1, 2, **3**.
</details>

---

## Exercício 08: O monitor diz uma coisa, o LED faz outra

O código é o Blink com mensagens (`Ligado` com o pino em HIGH, `Desligado` com o pino em LOW, 1 s cada). Mas o LED foi montado **invertido**.

**a)** Nos primeiros 3,5 s, quantas vezes aparece `Ligado`?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

As linhas saem em 0, 1, 2 e 3 s: `Ligado`, `Desligado`, `Ligado`, `Desligado`. São **2** vezes `Ligado`.
</details>

**b)** O monitor mostra `Ligado` mesmo com o LED invertido? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

**Sim:** o programa não sabe como o LED foi montado. Ele só escreve o que mandaram escrever.
</details>

**c)** Logo depois de aparecer `Ligado`, o LED invertido está aceso ou apagado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `apagado`

O pino está em 5 V, mas o LED invertido **bloqueia** a corrente: fica **apagado** o tempo todo. Por isso, para testar um circuito, olhe o circuito (ou meça com o multímetro), e não o monitor.
</details>

---

## Exercício 09: A letra no fio (ampliação)

A letra `C` tem código ASCII **67**.

**a)** O que aparece com `Serial.println('C', HEX);`?

<details>
<summary>Ver resposta</summary>

**Resposta:** `43`

67 = 4 × 16 + 3 → **43** em hexadecimal.
</details>

**b)** 67 = 0100 0011 em binário. Na serial, os 8 bits saem do **menos** significativo para o **mais**. Escreva os 8 bits na ordem em que saem no fio.

<details>
<summary>Ver resposta</summary>

**Resposta:** `11000010`

Lendo 0100 0011 de trás para a frente: **1100 0010**. O primeiro a sair é o bit da direita (b0 = 1).
</details>

**c)** A 9600 baud, quanto tempo leva um caractere inteiro, com os bits de início e de fim?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,04 ms ± 0,01 ms`

São 10 bits, cada um de 1 / 9 600 s: 10 / 9 600 ≈ 0,00104 s = **1,04 ms**.
</details>
