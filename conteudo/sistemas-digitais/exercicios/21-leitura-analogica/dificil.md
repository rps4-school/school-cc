# 🎛️ Leitura analógica · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Leitura analógica](../../aulas/21-leitura-analogica.md) · Próximo: [PWM →](../22-pwm/facil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: A conta que engana

`leitura` é um `int` com o valor **511**. O que o `Serial.println` mostra em cada caso?

**a)**

```cpp
float v = leitura * 5 / 1023;
Serial.println(v);
```

<details>
<summary>Ver resposta</summary>

**Número:** `2`

`leitura * 5 / 1023` é conta só com inteiros: 2 555 / 1 023 = **2** (a parte decimal some). Só depois o 2 vira `float`, e o monitor mostra `2.00`.
</details>

**b)**

```cpp
float v = leitura * 5.0 / 1023;
Serial.println(v);
```

<details>
<summary>Ver resposta</summary>

**Número:** `2,50 ± 0,01`

Com `5.0`, a conta é com `float`: 2 555 / 1 023 = 2,4976 → o monitor mostra **2.50** (duas casas).
</details>

**c)**

```cpp
int p = leitura * 100 / 1023;
Serial.println(p);
```

<details>
<summary>Ver resposta</summary>

**Número:** `-14`

`511 * 100` = 51 100 não cabe num `int` de 16 bits: vira 51 100 − 65 536 = −14 436. Dividido por 1023: **−14**. O `map()` não tem esse problema porque faz a conta com `long`; à mão, escreva `leitura * 100L / 1023`.
</details>

---

## Exercício 08: Histerese

```cpp
int luz = analogRead(A0);
if (luz < 280) {
  digitalWrite(LED, HIGH);
} else if (luz > 320) {
  digitalWrite(LED, LOW);
}
```

O LED começa apagado, e as leituras chegam nesta ordem: **350, 310, 290, 275, 300, 330, 300**.

**a)** Depois da leitura 275, o LED está aceso ou apagado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `aceso | ligado`

275 < 280: o LED **acende**. (Com 310 e 290, entre os limites, ele ficou como estava: apagado.)
</details>

**b)** E depois da leitura 300 que vem em seguida?

<details>
<summary>Ver resposta</summary>

**Resposta:** `aceso | ligado`

300 está entre 280 e 320: nenhum `if` vale, o LED continua **aceso**. Com um limite só (300), ele teria apagado aqui.
</details>

**c)** Na sequência toda, quantas vezes o LED muda de estado?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Acende com 275 e apaga com 330: **2** mudanças. O último 300 não mexe em nada.
</details>

---

## Exercício 09: Sensor de temperatura (ampliação)

O LM35 é um sensor de temperatura que dá **10 mV por °C**: a 25 °C, a saída tem 0,25 V. Ele não está no laboratório do site; as contas são as mesmas de qualquer sensor de tensão.

**a)** A 25 °C, quanto dá `analogRead`?

<details>
<summary>Ver resposta</summary>

**Número:** `51 ± 1`

0,25 · 1023 / 5 = 51,15 → **51**.
</details>

**b)** A leitura deu 62. Qual é a temperatura, em °C, com uma casa decimal?

<details>
<summary>Ver resposta</summary>

**Número:** `30,3 ± 0,1`

V = 62 · 5 / 1023 = 0,303 V. A 10 mV por °C: 0,303 / 0,010 = **30,3 °C**. Em código: `float t = leitura * 500.0 / 1023;`.
</details>

**c)** Com a referência de 5 V, cada degrau do ADC vale uns 4,9 mV. Quantos °C isso dá no LM35?

<details>
<summary>Ver resposta</summary>

**Número:** `0,49 ± 0,01`

4,9 mV / 10 mV por °C ≈ **0,49 °C**: o termômetro "pula" de meio em meio grau.
</details>

**d)** Com `analogReference(INTERNAL)`, a referência vira 1,1 V. Quantos °C vale cada degrau agora?

<details>
<summary>Ver resposta</summary>

**Número:** `0,11 ± 0,01`

1,1 V / 1024 ≈ 1,07 mV por degrau → 1,07 / 10 ≈ **0,11 °C**. Mais precisão, mas só mede até 1,1 V (110 °C), o que basta para o LM35.
</details>
