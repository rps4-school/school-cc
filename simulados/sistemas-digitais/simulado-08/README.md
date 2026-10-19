# 📝 Simulado 08 · Sistemas Digitais (desafio prático integrado)

> [← voltar para Simulados](../../README.md)

**Nível:** 🔴 Avançado

**Duração sugerida:** 1h30 · **Pontuação:** 100 pontos · **Assuntos:** montagem, saídas e entradas digitais, millis(), máquina de estados e buzzer (aulas 15 a 23, com o laboratório)

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações, calculadora ou IA.
> - As questões 01 e 02 são feitas **no laboratório do site**. As outras, no papel, **sem rodar o código**.
> - Os itens de uma questão valem partes iguais.
> - Só confira as respostas da parte B depois que o tempo acabar.

## 🧭 O que é corrigido, e como

| Parte | Questões | Pontos | Correção |
| ----- | -------- | ------ | -------- |
| A · Montagem | 01 e 02 | 30 | ✅ **Automática:** o laboratório confere o circuito pelo que ele faz (corrente de cada LED com o pino em HIGH e em LOW, erros de montagem) e, na questão 02, roda o programa e aperta o botão sozinho |
| B · Ler o programa | 03 a 05 | 40 | ✅ **Automática:** cada item tem um campo com a resposta conferida. As respostas saíram do programa compilado rodando no Arduino simulado |
| C · Escrever código | 06 e 07 | 30 | ✍️ **Sem correção automática** (o site não compila C++): compare com a **resposta esperada** e a **rubrica** de cada questão |

---

## Questão 01 · Ligue o semáforo · 20 pontos

**Parte A, no laboratório.** Os três LEDs já estão na protoboard, cada um com o seu resistor de 220 Ω, mas **fora da ordem** do semáforo e sem fios. O programa é o semáforo do [projeto 03](../../../conteudo/sistemas-digitais/laboratorio/projetos/03-semaforo/README.md): **verde no pino 8, amarelo no 9 e vermelho no 10**.

Ligue cada pino ao LED da cor certa, os cátodos ao GND, e clique em **Conferir a montagem** (aba Instruções).

<div class="laboratorio" data-projeto="circuito.json" data-titulo="Questão 01 no laboratório" data-descricao="Três LEDs fora da ordem, sem fios: ligue cada cor ao seu pino e clique em Conferir a montagem, na aba Instruções."></div>

> 💡 A questão só roda no site. No GitHub, o circuito inicial e os critérios estão em [`circuito.json`](circuito.json).

| Critério conferido | Pontos |
| ------------------ | ------ |
| Pino 8 em HIGH acende o LED **verde** (de 5 a 20 mA), e ele apaga com o pino em LOW | 5 |
| Pino 9 → LED **amarelo**, do mesmo jeito | 5 |
| Pino 10 → LED **vermelho**, do mesmo jeito | 5 |
| Com os três pinos em HIGH, nenhum erro de montagem | 5 |

---

## Questão 02 · O botão acende o LED · 10 pontos

**Parte A, no laboratório.** Faça o [desafio 03 · O botão acende o LED](../../../conteudo/sistemas-digitais/laboratorio/desafios/03-botao-acende-o-led/README.md). O laboratório roda o programa, aperta e solta o botão e olha o LED.

| Critério conferido | Pontos |
| ------------------ | ------ |
| Montagem sem erros | 5 |
| O LED acende só enquanto o botão está apertado | 5 |

---

## O programa do cruzamento (questões 03 a 05)

Verde no pino 8, amarelo no 9, vermelho no 10, botão de pedestre no 2 (com `INPUT_PULLUP`) e buzzer no 12. O programa começa em t = 0, no verde.

```cpp
const int VERDE = 8, AMARELO = 9, VERMELHO = 10;
const int BOTAO = 2, BUZZER = 12;
const unsigned long TEMPO[] = {6000, 2000, 5000};   // verde, amarelo, vermelho
const char *NOME[] = {"Verde", "Amarelo", "Vermelho"};

int estado = 0;              // 0 = verde, 1 = amarelo, 2 = vermelho
unsigned long inicio = 0;    // quando o estado atual começou
bool pedido = false;         // alguém apertou o botão neste verde
int anterior = HIGH;

void acender(int e) {
  digitalWrite(VERDE, e == 0);
  digitalWrite(AMARELO, e == 1);
  digitalWrite(VERMELHO, e == 2);
}

void setup() {
  pinMode(VERDE, OUTPUT);
  pinMode(AMARELO, OUTPUT);
  pinMode(VERMELHO, OUTPUT);
  pinMode(BOTAO, INPUT_PULLUP);
  Serial.begin(9600);
  acender(estado);
  Serial.println(NOME[estado]);
}

void loop() {
  unsigned long agora = millis();

  int atual = digitalRead(BOTAO);
  if (anterior == HIGH && atual == LOW && estado == 0 && !pedido) {
    pedido = true;
    tone(BUZZER, 1000, 100);   // bipe curto: pedido aceito
    Serial.println("Pedido");
  }
  anterior = atual;

  unsigned long duracao = TEMPO[estado];
  if (estado == 0 && pedido) {
    duracao = 3000;            // com pedido, o verde dura no máximo 3 s
  }

  if (agora - inicio >= duracao) {
    estado = (estado + 1) % 3;
    inicio = agora;
    if (estado == 0) {
      pedido = false;
    }
    acender(estado);
    Serial.println(NOME[estado]);
  }
}
```

---

## Questão 03 · Sem pedestre · 12 pontos

Ninguém aperta o botão.

**a)** Quanto tempo dura um ciclo completo do semáforo?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `13 s`

6 s de verde + 2 s de amarelo + 5 s de vermelho = **13 s**.
</details>

**b)** Qual LED está aceso em t = 7 s?

<details>
<summary>Ver resposta</summary>

**Resposta:** `amarelo`

Verde de 0 a 6 s, **amarelo** de 6 a 8 s.
</details>

**c)** Qual é a 4ª linha do monitor serial?

<details>
<summary>Ver resposta</summary>

**Resposta:** `Verde`

`Verde` (no `setup()`), `Amarelo` (6 s), `Vermelho` (8 s) e **`Verde`** de novo (13 s).
</details>

---

## Questão 04 · O botão de pedestre · 16 pontos

Em cada item, o programa acabou de começar (t = 0, no verde).

**a)** O pedestre aperta em t = 1 s. Em que instante o verde acaba?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 s`

Com pedido, o verde dura no máximo 3 s **desde que começou** (t = 0): acaba em **3 s**. No laboratório, a linha `Amarelo` sai em 3,01 s.
</details>

**b)** Com o mesmo aperto em t = 1 s, em que instante o verde volta?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `10 s`

Verde até 3 s, amarelo até 5 s, vermelho até **10 s**. O ciclo encurtou de 13 s para 10 s.
</details>

**c)** Agora o pedestre aperta em t = 4,5 s. Em que instante o verde acaba?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4,5 s`

Em 4,5 s, o verde já passou de 3 s: com o pedido, `agora - inicio >= 3000` vale na hora. O verde acaba em **4,5 s**, logo depois do bipe.
</details>

**d)** O pedestre aperta 3 vezes no mesmo verde. Quantas vezes aparece `Pedido`?

<details>
<summary>Ver resposta</summary>

**Número:** `1`

Depois do primeiro aperto, `pedido` fica `true` e o `if` não vale mais até o próximo verde: **1** vez.
</details>

---

## Questão 05 · Por dentro do programa · 12 pontos

**a)** O pedestre aperta em t = 10 s (no vermelho). Aparece `Pedido`? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não | nao`

O `if` exige `estado == 0` (verde). No vermelho, o aperto é ignorado.
</details>

**b)** Quanto tempo dura o bipe de pedido aceito?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `100 ms`

`tone(BUZZER, 1000, 100)`: **100 ms** a 1 000 Hz. O `tone()` com duração não para o programa.
</details>

**c)** Por que o programa não usa `delay(6000)` para o verde? Responda com a letra.

(a) porque o `delay` não aceita valores acima de 5 000; (b) porque, durante o `delay`, o botão não seria lido; (c) porque o `millis()` é mais preciso.

<details>
<summary>Ver resposta</summary>

**Resposta:** `b`

Com `delay(6000)`, o programa ficaria parado 6 s sem olhar o botão. Com `millis()`, o `loop()` volta em microssegundos e lê o botão o tempo todo.
</details>

---

## Questão 06 · Luz do pedestre · 15 pontos

**Parte C, no papel.** Acrescente um LED de pedestre no **pino 13** (o LED L da placa) que fica aceso **só durante o vermelho**. Escreva só as linhas que mudam e diga onde elas entram.

<details>
<summary>Ver a resposta esperada e a rubrica</summary>

Esta questão **não tem correção automática**. Uma resposta que funciona:

```cpp
// no setup():
pinMode(13, OUTPUT);

// dentro de acender(), junto com os outros digitalWrite:
digitalWrite(13, e == 2);    // pedestre: só no vermelho
```

Rodando no laboratório, o pino 13 fica em HIGH no vermelho (de 8 a 13 s) e em LOW no verde e no amarelo.

| Rubrica | Pontos |
| ------- | ------ |
| `pinMode(13, OUTPUT)` no `setup()` | 5 |
| O pino 13 acende no vermelho | 5 |
| O pino 13 apaga no verde e no amarelo (por exemplo, por estar dentro de `acender()`) | 5 |

Outras soluções valem, como um `if (estado == 2)` no `loop()`, desde que o LED apague nos outros estados.
</details>

---

## Questão 07 · Contador de pedidos · 15 pontos

**Parte C, no papel.** A cada pedido aceito, o monitor deve mostrar quantos pedidos já foram feitos desde que a placa ligou, numa linha `Pedidos: N`. Escreva só as linhas que mudam e diga onde elas entram.

<details>
<summary>Ver a resposta esperada e a rubrica</summary>

Esta questão **não tem correção automática**. Uma resposta que funciona:

```cpp
// fora das funções, junto com as outras variáveis:
int pedidos = 0;             // pedidos aceitos desde que a placa ligou

// dentro do if do pedido, depois de Serial.println("Pedido"):
pedidos = pedidos + 1;
Serial.print("Pedidos: ");
Serial.println(pedidos);
```

Rodando no laboratório com apertos em 1 s e em 11 s, o monitor mostra `Pedidos: 1` e, no verde seguinte, `Pedidos: 2`.

| Rubrica | Pontos |
| ------- | ------ |
| Variável **global** (uma local voltaria a 0 a cada volta do `loop()`) | 5 |
| Soma 1 só quando o pedido é aceito (dentro do `if`) | 5 |
| Linha no formato `Pedidos: N` (`print` e depois `println`) | 5 |
</details>
