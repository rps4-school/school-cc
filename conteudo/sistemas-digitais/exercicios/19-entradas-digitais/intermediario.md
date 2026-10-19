# 🔘 Entradas digitais · 🟡 Intermediário

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Entradas digitais e botões](../../aulas/19-entradas-digitais.md) · Próximo: [Difícil →](dificil.md)

Responda sem rodar o código: é assim na prova. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 04: O monitor e o botão

O botão liga o pino 2 ao GND.

```cpp
void setup() {
  pinMode(2, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  Serial.println(digitalRead(2));
  delay(500);
}
```

Uma pessoa aperta o botão em t = 1,2 s e solta em t = 2,2 s. As linhas saem em t ≈ 0; 0,5; 1,0; 1,5; 2,0 e 2,5 s.

**a)** Nas 6 primeiras linhas, quantas vezes aparece `0`?

<details>
<summary>Ver resposta</summary>

**Número:** `2`

Só as leituras de 1,5 s e de 2,0 s caem com o botão apertado: **2** zeros. A sequência é `1 1 1 0 0 1`.
</details>

**b)** Qual é a 4ª linha?

<details>
<summary>Ver resposta</summary>

**Resposta:** `0`

A 4ª linha sai em t ≈ 1,5 s, com o botão apertado: **0**.
</details>

**c)** Se o botão fosse um pull-down (botão no 5V, resistor ao GND, `INPUT`), qual seria a 4ª linha?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1`

Com pull-down, apertado é HIGH: **1**.
</details>

---

## Exercício 05: O contador apressado

```cpp
int contagem = 0;

void setup() {
  pinMode(2, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(2) == LOW) {
    contagem = contagem + 1;
    Serial.println(contagem);
  }
  delay(100);
}
```

**a)** A pessoa segura o botão por 1 segundo, uma vez só. Qual é o último número no monitor?

<details>
<summary>Ver resposta</summary>

**Número:** `10 ± 1`

O `if` confere "**está** apertado", e o `loop()` passa por ele a cada 100 ms: em 1 s, umas **10** vezes. Um aperto vira 10.
</details>

**b)** Qual mudança faz o programa contar **1 por aperto**? Responda com a letra.

(a) guardar a leitura anterior e contar só quando ela passa de HIGH para LOW; (b) trocar o `delay(100)` por `delay(1000)`; (c) trocar `INPUT_PULLUP` por `INPUT`.

<details>
<summary>Ver resposta</summary>

**Resposta:** `a`

Contar a **borda** (HIGH → LOW) conta o instante do aperto, uma vez. O `delay(1000)` só conta mais devagar (segurando 3 s, conta 3), e o `INPUT` deixa o pino solto.
</details>

**c)** Com a correção, a pessoa aperta 3 vezes. Qual é o último número?

<details>
<summary>Ver resposta</summary>

**Número:** `3`

Uma borda de descida por aperto: **3**.
</details>

---

## Exercício 06: Que borda é essa?

O botão usa `INPUT_PULLUP`. Para cada par (`anterior`, `atual`), responda com a letra:

(a) acabou de apertar; (b) acabou de soltar; (c) continua apertado; (d) continua solto.

**a)** `anterior = LOW`, `atual = HIGH`

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

Com pull-up, LOW é apertado e HIGH é solto: foi de apertado para solto, **acabou de soltar** (borda de subida).
</details>

**b)** `anterior = HIGH`, `atual = HIGH`

<details>
<summary>Ver resposta</summary>

**Resposta:** `d`

Solto antes e solto agora: **continua solto**.
</details>

**c)** `anterior = HIGH`, `atual = LOW`

<details>
<summary>Ver resposta</summary>

**Resposta:** `a`

De solto para apertado: **acabou de apertar** (borda de descida). É esse caso que um contador de apertos conta.
</details>

**d)** No alarme com PIR (sem pull-up: HIGH = movimento), `antes = LOW` e `agora = HIGH`. O movimento começou ou acabou?

<details>
<summary>Ver resposta</summary>

**Resposta:** `começou | comecou`

Sem pull-up, a lógica é direta: de LOW (parado) para HIGH (movimento), o movimento **começou**. É a borda de subida que o [projeto 11](../../laboratorio/projetos/11-alarme-de-movimento/README.md) usa para escrever a mensagem uma vez.
</details>
