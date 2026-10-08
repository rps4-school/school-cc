# 📝 Simulado 02 · Sistemas Digitais

> [← voltar para Simulados](../../README.md)

**Nível:** 🟡 Intermediário

**Duração sugerida:** 1h · **Pontuação:** 100 pontos · **Assuntos:** todos (aulas 1 a 9)

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações, calculadora ou IA.
> - A única consulta permitida é a **tabela ASCII** (está na [aula de Codificação](../../../conteudo/sistemas-digitais/aulas/04-codificacao.md)).
> - **Mostre as contas** no papel: resposta sem desenvolvimento vale metade.
> - As questões 01 a 08 valem **8 pontos** e as 09 a 12 valem **9**. Os itens de uma questão valem partes iguais.
> - Só confira as respostas depois que o tempo acabar.

> 💡 **Corrigindo no site:** cada item tem um campo para digitar a sua resposta e conferir na hora. Use só na correção, depois do tempo. Itens abertos (de explicar) não têm campo: compare com a resposta esperada.

---

## Questão 01 · Analógico e digital · 8 pontos

**Monitorando um data center.** Um sensor de temperatura grava cada leitura com **16 bits**. A equipe discute duas opções: **uma leitura a cada 10 minutos** ou **uma leitura por hora**.

**a)** Quantas amostras a opção de **10 em 10 minutos** gera em 24 horas?

<details>
<summary>Ver resposta</summary>

**Resposta:** `144`

Uma hora tem 6 intervalos de 10 min: 6 × 24 = **144** amostras.
</details>

**b)** E a opção de **uma por hora**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `24`

**24** amostras.
</details>

**c)** Quantos **bytes** por dia ocupa a opção de 10 em 10 minutos?

<details>
<summary>Ver resposta</summary>

**Resposta:** `288`

16 bits = 2 bytes. 144 × 2 = **288 bytes**.
</details>

**d)** Houve um pico de temperatura que durou **20 minutos**. Qual opção tem mais chance de registrá-lo? (10 minutos ou 1 hora)

<details>
<summary>Ver resposta</summary>

**Resposta:** `10 minutos | 10 | 10 min | a cada 10 minutos`

A de **10 minutos**: ela tira pelo menos uma amostra durante os 20 minutos do pico. Com uma leitura por hora, o pico pode acontecer inteiro entre duas leituras. É o efeito da **taxa de amostragem**.
</details>

---

## Questão 02 · Binário · 8 pontos

**Balança de laboratório.** Uma balança envia o peso em gramas no formato **110110,101₂**. Converta para decimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `54,625`

| Peso | 32 | 16 | 8 | 4 | 2 | 1 | , | 0,5 | 0,25 | 0,125 |
| ---- | -- | -- | - | - | - | - | - | --- | ---- | ----- |
| Bit | 1 | 1 | 0 | 1 | 1 | 0 | , | 1 | 0 | 1 |

32 + 16 + 4 + 2 + 0,5 + 0,125 = **54,625 g**
</details>

---

## Questão 03 · Decimal para binário · 8 pontos

**Horas trabalhadas.** Um app de finanças converte para binário dois valores de horas trabalhadas.

**a)** Converta **12,75**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1100,11`

12 = **1100₂**.

| Conta | Resultado | Bit |
| ----- | --------- | --- |
| 0,75 × 2 | 1,5 | **1** |
| 0,5 × 2 | 1 | **1** |

**1100,11₂**
</details>

**b)** Converta **5,125**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `101,001`

5 = **101₂**.

| Conta | Resultado | Bit |
| ----- | --------- | --- |
| 0,125 × 2 | 0,25 | **0** |
| 0,25 × 2 | 0,5 | **0** |
| 0,5 × 2 | 1 | **1** |

**101,001₂**
</details>

---

## Questão 04 · Hexadecimal · 8 pontos

**Binário com vírgula para hexa.** Um conversor gerou **111000110101,01101₂**. Converta para hexadecimal, mostrando os grupos de 4 bits.

<details>
<summary>Ver resposta</summary>

**Resposta:** `E35,68`

Agrupe **a partir da vírgula**: para a esquerda na parte inteira, para a direita na fração, completando a fração com zeros **à direita**:

```
1110 0011 0101 , 0110 1000
 E    3    5   ,  6    8
```

**0xE35,68**. Erro clássico: completar a fração com zeros à **esquerda** (0000 1101), o que mudaria o valor.
</details>

---

## Questão 05 · Codificação · 8 pontos

**Uma linha de código.** Um arquivo-fonte em ASCII contém a linha `x = 7;` (com espaços dos dois lados do `=`).

**a)** Escreva os bytes em hexadecimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `0x78 0x20 0x3D 0x20 0x37 0x3B`

| Caractere | Linha | Coluna | Hexa |
| --------- | ----- | ------ | ---- |
| x | 7 | 8 | 0x78 |
| espaço | 2 | 0 | 0x20 |
| = | 3 | D | 0x3D |
| espaço | 2 | 0 | 0x20 |
| 7 | 3 | 7 | 0x37 |
| ; | 3 | B | 0x3B |

O caractere `7` é **0x37**, não 7.
</details>

**b)** Quantos bytes a linha ocupa?

<details>
<summary>Ver resposta</summary>

**Resposta:** `6`

**6 bytes** (os dois espaços contam).
</details>

---

## Questão 06 · Adição binária · 8 pontos

**Checksum de um pacote.** Um protocolo calcula o **checksum** somando todos os bytes do pacote e guardando só os **8 bits menos significativos**. Bytes do pacote: **0x12, 0x34, 0x56, 0x78**.

**a)** Qual é a soma total em hexadecimal?

<details>
<summary>Ver resposta</summary>

**Resposta:** `114`

Somando em pares: 0x12 + 0x34 = 0x46; 0x56 + 0x78 = 0xCE; 0x46 + 0xCE = **0x114** (em decimal: 18 + 52 + 86 + 120 = 276). Em binário: 1 0001 0100.
</details>

**b)** Qual é o checksum (8 bits), em binário?

<details>
<summary>Ver resposta</summary>

**Resposta:** `0001 0100`

Só os 8 bits da direita de 1 0001 0100: **0001 0100** = 0x14. O "1" da esquerda é descartado.
</details>

---

## Questão 07 · Números negativos · 8 pontos

**As três representações.** O controle de um forno precisa registrar **−90** (temperatura relativa). Use **8 bits**.

**a)** Escreva +90 em binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `0101 1010`

90 = 64 + 16 + 8 + 2 = **0101 1010**
</details>

**b)** −90 em sinal-magnitude:

<details>
<summary>Ver resposta</summary>

**Resposta:** `1101 1010`

Troca só o MSB: **1101 1010**
</details>

**c)** −90 em complemento a 1:

<details>
<summary>Ver resposta</summary>

**Resposta:** `1010 0101`

Inverte tudo: **1010 0101**
</details>

**d)** −90 em complemento a 2:

<details>
<summary>Ver resposta</summary>

**Resposta:** `1010 0110`

C1 + 1 (ou o macete): **1010 0110**
</details>

---

## Questão 08 · Subtração em C2 · 8 pontos

**Meta de calorias.** Um app de academia calcula a diferença entre as calorias gastas (40) e a meta (100): **40 − 100** em C2 de 8 bits.

**a)** Qual é o resultado em binário?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1100 0100`

40 = 0010 1000 e −100 = 1001 1100.

```
Vai um:      1 1 1
           0 0 1 0 1 0 0 0     (+40)
        +  1 0 0 1 1 1 0 0     (−100)
         -----------------
           1 1 0 0 0 1 0 0
```

**1100 0100**
</details>

**b)** Quanto vale em decimal?

<details>
<summary>Ver resposta</summary>

**Resposta:** `-60`

MSB 1 → negativo. C2(1100 0100) = 0011 1100 = 60. Resultado: **−60** ✔ (40 − 100 = −60)
</details>

---

## Questão 09 · Álgebra booleana · 9 pontos

**Robô aspirador.** Um robô aspirador começa a limpar (**X = 1**) quando chega o **horário programado (A = 1)** e **não há ninguém em casa**. O sensor de presença dá **B = 1** quando **há alguém** em casa.

**a)** Escreva X.

<details>
<summary>Ver resposta</summary>

**Expressão:** `AB'`

"A **e não** B" = **AB'**.
</details>

**b)** Escreva a coluna da tabela-verdade de X (entradas 00, 01, 10, 11).

<details>
<summary>Ver resposta</summary>

**Resposta:** `0010`

| A | B | B' | **X** |
| - | - | -- | ----- |
| 0 | 0 | 1 | **0** |
| 0 | 1 | 0 | **0** |
| 1 | 0 | 1 | **1** |
| 1 | 1 | 0 | **0** |

Coluna: **0010**.
</details>

**c)** Em quantas das 4 situações o robô **não** começa a limpar?

<details>
<summary>Ver resposta</summary>

**Resposta:** `3`

Só a linha A = 1, B = 0 liga. Nas outras **3**, não.
</details>

---

## Questão 10 · Circuitos combinacionais · 9 pontos

**Portão automático.** O controle de um portão automático segue **x = (A + B)'C + AB'**. Monte a tabela-verdade com colunas intermediárias e escreva a coluna de x (linhas 000 a 111).

<details>
<summary>Ver resposta</summary>

**Resposta:** `01001100`

| A | B | C | A + B | (A + B)' | (A + B)'C | B' | AB' | **x** |
| - | - | - | ----- | -------- | --------- | -- | --- | ----- |
| 0 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | **0** |
| 0 | 0 | 1 | 0 | 1 | 1 | 1 | 0 | **1** |
| 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | **0** |
| 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | **0** |
| 1 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | **1** |
| 1 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | **1** |
| 1 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | **0** |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | **0** |

Coluna: **01001100**.
</details>

---

## Questão 11 · Soma de produtos · 9 pontos

**Irrigação inteligente.** Uma bomba de irrigação (**I = 1**) liga se o **solo estiver seco (S = 1)** e **não estiver chovendo (C = 0)**, ou se o **modo teste (T = 1)** estiver ativo e não estiver chovendo.

**a)** Monte a tabela-verdade (ordem S, C, T) e escreva a coluna de I.

<details>
<summary>Ver resposta</summary>

**Resposta:** `01001100`

| S | C | T | C' | **I** |
| - | - | - | -- | ----- |
| 0 | 0 | 0 | 1 | **0** |
| 0 | 0 | 1 | 1 | **1** |
| 0 | 1 | 0 | 0 | **0** |
| 0 | 1 | 1 | 0 | **0** |
| 1 | 0 | 0 | 1 | **1** |
| 1 | 0 | 1 | 1 | **1** |
| 1 | 1 | 0 | 0 | **0** |
| 1 | 1 | 1 | 0 | **0** |

Coluna: **01001100**.
</details>

**b)** Escreva I em soma de produtos canônica.

<details>
<summary>Ver resposta</summary>

**Expressão:** `S'C'T + SC'T' + SC'T`

Linhas com 1: 001, 100 e 101 → **S'C'T + SC'T' + SC'T**.
</details>

**c)** Simplifique.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `SC' + TC'`

S'C'T + SC'T = C'T(S' + S) = **C'T**; SC'T' + SC'T = SC'(T' + T) = **SC'** (o SC'T foi usado duas vezes). Resultado: **I = SC' + TC' = C'(S + T)**: "não chove **e** (solo seco **ou** teste)", como na frase.
</details>

---

## Questão 12 · Mapa de Karnaugh · 9 pontos

**Duas respostas certas.** Uma tabela de 3 variáveis tem **1** nas linhas **000, 001, 100, 110 e 111**.

**a)** Monte o mapa e escreva uma expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `A'B' + AB + AC'`

| AB \ C | **C'** | **C** |
| ------ | ------ | ----- |
| **A'B'** | **1** | **1** |
| **A'B** | 0 | 0 |
| **AB** | **1** | **1** |
| **AB'** | **1** | 0 |

| Grupo | Casas | Termo |
| ----- | ----- | ----- |
| 1 | linha A'B' (000, 001) | **A'B'** |
| 2 | linha AB (110, 111) | **AB** |
| 3 | coluna C', linhas AB e AB' (110, 100) | **AC'** |

**x = A'B' + AB + AC'**
</details>

**b)** Existe outra expressão mínima, com o mesmo número de letras? Escreva-a.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `A'B' + AB + B'C'`

Sim. O 1 da casa 100 pode ser agrupado de outro jeito: com o 000, pela borda (coluna C', linhas A'B' e AB'), dando **B'C'**.

**x = A'B' + AB + B'C'**. As duas têm 3 termos e 6 letras, e as duas estão certas.
</details>
