# 💡 Saídas digitais · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Saídas digitais, LED e Blink](../../aulas/17-saidas-digitais.md) · Próximo: [Difícil →](dificil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: Síncronos, alternados ou ritmados?

Os LEDs estão nos pinos 8 e 9. Diga como cada `loop()` faz os LEDs piscarem: **síncronos**, **alternados** ou **ritmados**.

**a)**

```cpp
void loop() {
  digitalWrite(8, HIGH);
  digitalWrite(9, LOW);
  delay(400);
  digitalWrite(8, LOW);
  digitalWrite(9, HIGH);
  delay(400);
}
```

<details>
<summary>Ver resposta</summary>

**Resposta:** `alternados | alternado`

Quando um liga, o outro desliga: **alternados**.
</details>

**b)**

```cpp
void loop() {
  digitalWrite(8, HIGH);
  digitalWrite(9, HIGH);
  delay(400);
  digitalWrite(8, LOW);
  digitalWrite(9, LOW);
  delay(400);
}
```

<details>
<summary>Ver resposta</summary>

**Resposta:** `síncronos | síncrono | sincronizados | sincronizado | juntos`

Os dois ligam e desligam juntos: **síncronos**.
</details>

**c)**

```cpp
void loop() {
  digitalWrite(8, HIGH);
  delay(100);
  digitalWrite(8, LOW);
  delay(100);
  digitalWrite(8, HIGH);
  delay(100);
  digitalWrite(8, LOW);
  delay(700);
}
```

<details>
<summary>Ver resposta</summary>

**Resposta:** `ritmados | ritmado`

Duas piscadas rápidas e uma pausa longa, como uma batida de coração: **ritmados**. O período é 100 + 100 + 100 + 700 = 1 000 ms.
</details>

---

## Exercício 05: O LED num pino, o código em outro

O LED foi montado no **pino 6**, com resistor, mas o código usa `const int LED = 7;`.

**a)** O LED pisca? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

**Não:** o código liga e desliga o pino 7, e o LED está no 6.
</details>

**b)** Sem mexer no fio, que número tem que ir na constante `LED`?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

`const int LED = 6;`: como o resto do código usa só `LED`, basta trocar **um número**.
</details>

**c)** Com o código errado, o pino 7 está mudando de estado? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

**Sim:** o programa roda normalmente e o pino 7 troca entre 5 V e 0 V. Só não tem LED nele. Um multímetro no pino 7 mostraria a tensão mudando.
</details>

---

## Exercício 06: Semáforo na linha do tempo

O semáforo acende **um LED de cada vez**: verde por 5 s, amarelo por 2 s e vermelho por 5 s, e então recomeça.

**a)** Qual é o período do semáforo?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `12 s`

5 + 2 + 5 = **12 s**.
</details>

**b)** Contando do momento em que o verde acende, qual cor está acesa em t = 6 s?

<details>
<summary>Ver resposta</summary>

**Resposta:** `amarelo`

O verde vai de 0 a 5 s, o amarelo de **5 a 7 s** e o vermelho de 7 a 12 s. Em 6 s, é o **amarelo**.
</details>

**c)** Quantos ciclos completos o semáforo faz em 1 minuto?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

60 / 12 = **5** ciclos.
</details>
