# 📝 Simulado 07 · Sistemas Digitais (entradas, saídas e sensores)

> [← voltar para Simulados](../../README.md)

**Nível:** 🔴 Avançado

**Duração sugerida:** 1h30 · **Pontuação:** 100 pontos · **Assuntos:** botões, millis(), leitura analógica, PWM, buzzer, ultrassom, servo e motor (aulas 19 a 23)

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações, calculadora ou IA. As contas foram feitas para sair à mão.
> - **Responda sem rodar o código**, como na prova.
> - Use leitura ≈ V · 1023 / 5 no ADC (±1 está certo), D = valor / 255 no PWM e d ≈ t / 58 no ultrassom (d em cm, t em µs).
> - **Mostre as contas** no papel: resposta sem desenvolvimento vale metade.
> - Cada questão vale **10 pontos**. Os itens de uma questão valem partes iguais.

> 💡 **Corrigindo no site:** cada item tem um campo para digitar a sua resposta e conferir na hora. A unidade é opcional e qualquer prefixo vale (`1,5 ms` ou `0,0015 s`). Use só na correção, depois do tempo.

---

## Questão 01 · Pull-down · 10 pontos

**A campainha da oficina.** O botão liga o pino 4 ao **5V**, e um resistor de **4,7 kΩ** liga o pino 4 ao GND (`INPUT`).

**a)** Com o botão solto, o pino lê HIGH ou LOW?

<details>
<summary>Ver resposta</summary>

**Resposta:** `LOW | 0`

Solto, o resistor puxa o pino para o GND: **LOW**.
</details>

**b)** Com o botão apertado, qual é a corrente no resistor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,06 mA ± 0,01 mA`

i = 5 V / 4,7 kΩ ≈ **1,06 mA**.
</details>

**c)** Nessa montagem, `anterior = LOW` e `atual = HIGH`. Responda com a letra.

(a) acabou de apertar; (b) acabou de soltar; (c) continua apertado.

<details>
<summary>Ver resposta</summary>

**Resposta:** `a`

Com pull-down, apertado é HIGH: ir de LOW para HIGH é **acabar de apertar**. (Com pull-up, seria o contrário.)
</details>

---

## Questão 02 · Duas tarefas com millis() · 10 pontos

```cpp
void loop() {
  unsigned long agora = millis();
  if (agora - antesA >= 200) { antesA = agora; trocaLedA(); }
  if (agora - antesB >= 350) { antesB = agora; trocaLedB(); }
}
```

**a)** Do início até t = 2,15 s, quantas vezes o LED A troca?

<details>
<summary>Ver resposta</summary>

**Número:** `10`

Em 200, 400, …, 2 000 ms: **10** trocas. A próxima seria em 2 200 ms, depois de 2,15 s.
</details>

**b)** E o LED B?

<details>
<summary>Ver resposta</summary>

**Número:** `6`

Em 350, 700, 1 050, 1 400, 1 750 e 2 100 ms: **6** trocas.
</details>

**c)** Em que instante os dois trocam juntos pela primeira vez?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,4 s`

MMC de 200 e 350 = **1 400 ms** = 1,4 s.
</details>

---

## Questão 03 · O relógio e os tipos · 10 pontos

**a)** `antes` vale 4 294 966 296 (1 000 ms antes de o `millis()` voltar a zero) e `agora` vale 500, depois da volta. Quanto dá `agora - antes` em `unsigned long`?

<details>
<summary>Ver resposta</summary>

**Número:** `1500`

Faltavam 1 000 ms para o zero, e passaram mais 500: **1 500** ms. A subtração sem sinal dá a volta junto.
</details>

**b)** Com `int t = millis();` e o `millis()` em 50 000, quanto vale `t` no Uno?

<details>
<summary>Ver resposta</summary>

**Número:** `-15536`

50 000 não cabe em 16 bits com sinal: 50 000 − 65 536 = **−15 536**.
</details>

**c)** Com `delay(3000)` no `loop()`, qual é o maior tempo que um botão pode ficar sem ser lido?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 s`

Durante o `delay`, nada é lido: até **3 s**.
</details>

---

## Questão 04 · O ADC · 10 pontos

**a)** O pino A1 está com 1,5 V. Quanto dá `analogRead(A1)`?

<details>
<summary>Ver resposta</summary>

**Número:** `307 ± 1`

1,5 · 1023 / 5 = 306,9 → **306** ou **307** (as duas contas usuais).
</details>

**b)** A leitura deu 818. Qual é a tensão, com duas casas?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4,00 V ± 0,01 V`

818 · 5 / 1023 ≈ **4,00 V**.
</details>

**c)** Quanto dá `map(818, 0, 1023, 0, 180)`?

<details>
<summary>Ver resposta</summary>

**Número:** `143`

818 · 180 / 1023 = 143,9 → o `map()` trunca: **143**.
</details>

---

## Questão 05 · Sensor de luz · 10 pontos

**A lâmpada do jardim.** O LDR vai do 5V ao A0 e um resistor de **10 kΩ** vai do A0 ao GND. O programa acende a lâmpada quando `analogRead(A0) < 300`.

**a)** De dia, o LDR tem 15 kΩ. Qual é a tensão no A0?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2 V`

V = 5 · 10 / (15 + 10) = **2 V**.
</details>

**b)** À noite, o LDR vai a 90 kΩ. Quanto dá `analogRead(A0)`?

<details>
<summary>Ver resposta</summary>

**Número:** `102 ± 1`

V = 5 · 10 / (90 + 10) = 0,5 V → 0,5 · 1023 / 5 = 102,3 → **102**.
</details>

**c)** À noite, a lâmpada está acesa ou apagada?

<details>
<summary>Ver resposta</summary>

**Resposta:** `acesa | aceso | ligada`

102 < 300: **acesa**.
</details>

---

## Questão 06 · PWM · 10 pontos

**a)** Com `analogWrite(10, 153)`, qual é a tensão média no pino?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 V ± 0,02 V`

D = 153 / 255 = 0,6 → 0,6 · 5 V = **3 V**.
</details>

**b)** O pino 6 faz PWM a uns 980 Hz. Qual é o período?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,02 ms ± 0,01 ms`

T = 1 / 980 ≈ **1,02 ms**.
</details>

**c)** Com `analogWrite(6, 153)`, quanto tempo de cada período o pino fica em 5 V?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `0,61 ms ± 0,01 ms`

0,6 · 1,02 ms ≈ **0,61 ms**.
</details>

---

## Questão 07 · LED RGB · 10 pontos

Vermelho no pino 9, verde no 10 e azul no 11.

**a)** LED de **cátodo comum** com `analogWrite(9, 255); analogWrite(10, 255); analogWrite(11, 0);`. Que cor aparece?

<details>
<summary>Ver resposta</summary>

**Resposta:** `amarelo`

Vermelho + verde = **amarelo**.
</details>

**b)** Agora o LED é de **ânodo comum**. Para acender só o azul, com o brilho todo, que valor vai em `analogWrite(11, ...)`?

<details>
<summary>Ver resposta</summary>

**Número:** `0`

No ânodo comum, a cor acende com o pino em **LOW**: **0** no azul e 255 nos outros dois.
</details>

**c)** O programa toca um `tone()` enquanto faz PWM no pino 11. O PWM do 11 continua funcionando? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

O `tone()` usa o timer 2, o mesmo dos pinos 3 e 11: o PWM do 11 **para** enquanto o tom toca.
</details>

---

## Questão 08 · Buzzer · 10 pontos

**a)** `tone(8, 523);` toca o dó. Qual é o período da onda, em ms, com duas casas?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,91 ms ± 0,01 ms`

T = 1 / 523 ≈ 0,00191 s = **1,91 ms**.
</details>

**b)** Qual frequência toca o mesmo dó **uma oitava abaixo**? Responda com uma casa decimal.

<details>
<summary>Ver resposta</summary>

**Grandeza:** `261,5 Hz ± 0,5 Hz`

Uma oitava abaixo é a **metade** da frequência: 523 / 2 = **261,5 Hz** (na tabela, 262 Hz).
</details>

**c)** `tone(8, 523, 300);` e, logo depois, `Serial.println("Tocou");`. A mensagem sai antes ou depois de o som acabar?

<details>
<summary>Ver resposta</summary>

**Resposta:** `antes`

O `tone()` com duração **não espera**: liga o som e segue. A mensagem sai **antes** de o som acabar.
</details>

---

## Questão 09 · Ultrassom · 10 pontos

**A vaga da garagem.** Um HC-SR04 mede a distância até o carro.

**a)** O Echo ficou 2 320 µs em HIGH. A que distância está o carro, em cm?

<details>
<summary>Ver resposta</summary>

**Número:** `40`

2 320 / 58 = **40 cm**.
</details>

**b)** O carro está a 2,5 m. Quanto tempo o Echo fica em HIGH?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `14,5 ms ± 0,1 ms`

250 · 58 = 14 500 µs = **14,5 ms**.
</details>

**c)** O programa usa `pulseIn(ECHO, HIGH, 20000)` e `distancia = t / 58` (conta inteira). Qual é a maior distância que ele consegue medir, em cm?

<details>
<summary>Ver resposta</summary>

**Número:** `344`

Acima de 20 000 µs, o `pulseIn` devolve 0. 20 000 / 58 = 344,8 → **344 cm**.
</details>

---

## Questão 10 · Servo e motor · 10 pontos

**a)** A biblioteca `Servo` leva 0° a 180° para pulsos de 544 µs a 2 400 µs, em linha reta. Qual é o pulso com `write(135)`, em µs?

<details>
<summary>Ver resposta</summary>

**Número:** `1936 ± 2`

544 + 135 · (2 400 − 544) / 180 = 544 + 1 392 = **1 936 µs**.
</details>

**b)** Um motor de 250 mA é ligado por um transistor com ganho β = 50. Qual é a corrente mínima na base?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `5 mA`

I_B = 250 mA / 50 = **5 mA**.
</details>

**c)** Para dar 10 mA na base (com V_BE = 0,7 V e o pino em 5 V), qual resistor de base?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `430 Ω`

R_B = (5 − 0,7) / 0,010 = **430 Ω**.
</details>
