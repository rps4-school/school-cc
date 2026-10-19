# ⏱️ delay() e millis() · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [delay() e millis()](../../aulas/20-delay-e-millis.md) · Próximo: [Difícil →](dificil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: O botão do Blink

O botão liga o pino 2 ao GND (`INPUT_PULLUP` no `setup()`).

```cpp
void loop() {
  if (digitalRead(2) == LOW) {
    Serial.println("Apertou");
  }
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);
}
```

**a)** A pessoa aperta o botão de t = 0,5 s a t = 0,8 s. Aparece `Apertou`? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

O botão é lido em t = 0, 2, 4 s... Entre 0,5 e 0,8 s, o programa está preso no primeiro `delay`: o aperto **não** é visto.
</details>

**b)** Agora ela segura de t = 1,5 s a t = 2,5 s. Quantas vezes aparece `Apertou`?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

Só a leitura de t ≈ 2 s cai com o botão apertado: **1** vez.
</details>

**c)** Qual é o menor tempo que a pessoa precisa segurar o botão para ele ser visto **com certeza**?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2 s`

As leituras ficam 2 s uma da outra: segurando **2 s** (ou mais), pelo menos uma leitura pega o botão apertado.
</details>

---

## Exercício 05: Seguindo o millis()

O LED começa apagado.

```cpp
unsigned long antes = 0;
int estado = LOW;

void loop() {
  unsigned long agora = millis();
  if (agora - antes >= 400) {
    antes = agora;
    estado = !estado;
    digitalWrite(8, estado);
  }
}
```

**a)** Até t = 1 000 ms, quantas vezes o LED trocou de estado?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

As trocas acontecem em 400 e 800 ms: **2**. A próxima seria em 1 200 ms.
</details>

**b)** Em t = 1 000 ms, o LED está aceso ou apagado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `apagado | desligado`

Duas trocas a partir de apagado: acendeu em 400 ms e apagou em 800 ms. Está **apagado**.
</details>

**c)** Se alguém apagar a linha `antes = agora;`, o que acontece? Responda com a letra.

(a) o LED pisca mais devagar; (b) depois de 400 ms, o LED troca a cada volta do `loop()` e parece meio aceso; (c) o LED nunca acende.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

`antes` fica em 0 para sempre: depois de 400 ms, a condição é verdadeira em **toda** volta, e o LED troca milhares de vezes por segundo. O olho vê um LED meio aceso.
</details>

---

## Exercício 06: Dois ritmos

```cpp
void loop() {
  unsigned long agora = millis();
  if (agora - antesA >= 250) { antesA = agora; estadoA = !estadoA; digitalWrite(8, estadoA); }
  if (agora - antesB >= 400) { antesB = agora; estadoB = !estadoB; digitalWrite(9, estadoB); }
}
```

**a)** Nos primeiros 2,1 s, quantas trocas faz o LED do pino 8?

<details>
<summary>Ver resposta</summary>

**Número:** `8`

A cada 250 ms: em 250, 500, 750, 1 000, 1 250, 1 500, 1 750 e 2 000 ms. São **8**.
</details>

**b)** E o LED do pino 9?

<details>
<summary>Ver resposta</summary>

**Número:** `5`

A cada 400 ms: em 400, 800, 1 200, 1 600 e 2 000 ms. São **5**.
</details>

**c)** Em que instante os dois trocam juntos pela primeira vez?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2 s`

É o primeiro múltiplo comum de 250 e 400: o MMC, **2 000 ms** = 2 s. Com `delay`, esse "juntos" seria impossível de programar sem muita conta.
</details>
