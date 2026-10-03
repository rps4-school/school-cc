# 📝 Simulado 01 · Sistemas Digitais

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

**Resolução de um ADC.** Um kit de robótica lê um potenciômetro com um ADC de **10 bits**. A função de leitura devolve números inteiros a partir de 0.

**a)** Quantos valores digitais diferentes esse ADC produz?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1024`

2¹⁰ = **1 024** valores.
</details>

**b)** Qual é o **maior** valor que a função pode devolver?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1023`

Começando do 0, o maior é 2¹⁰ − 1 = **1 023**.
</details>

**c)** Se o ADC fosse de **12 bits**, quantos níveis **a mais** ele teria?

<details>
<summary>Ver resposta</summary>

**Resposta:** `3072`

2¹² = 4 096 níveis. 4 096 − 1 024 = **3 072** níveis a mais (o quádruplo do total).
</details>

---

## Questão 02 · Binário · 8 pontos

**Quantos bits preciso?.** O sistema acadêmico vai numerar **500 alunos** com códigos binários de **0 a 499**.

**a)** Qual é o menor número de bits necessário?

<details>
<summary>Ver resposta</summary>

**Resposta:** `9`

2⁸ − 1 = 255 não chega a 499; 2⁹ − 1 = **511** chega. São **9 bits**.
</details>

**b)** Com esse número de bits, qual é o maior código possível?

<details>
<summary>Ver resposta</summary>

**Resposta:** `511`

2⁹ − 1 = **511**.
</details>

**c)** Quantos códigos sobram sem uso?

<details>
<summary>Ver resposta</summary>

**Resposta:** `12`

Existem 2⁹ = 512 códigos e 500 alunos: 512 − 500 = **12**.
</details>

**d)** Se a turma crescer para **600** alunos (códigos 0 a 599), os 9 bits ainda bastam? (sim ou não)

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

O maior código com 9 bits é 511 < 599: **não**. Seriam necessários 10 bits (até 1 023).
</details>

---

## Questão 03 · Decimal para binário · 8 pontos

**Distância com vírgula.** Um app de corrida registra a distância **19,625 km** e envia o valor ao relógio em binário. Converta **19,625** para binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `10011,101`

**Parte inteira:**

| Divisão | Quociente | Resto |
| ------- | --------- | ----- |
| 19 ÷ 2 | 9 | **1** |
| 9 ÷ 2 | 4 | **1** |
| 4 ÷ 2 | 2 | **0** |
| 2 ÷ 2 | 1 | **0** |
| 1 ÷ 2 | 0 | **1** |

19 = **10011₂**

**Parte fracionária:**

| Conta | Resultado | Bit |
| ----- | --------- | --- |
| 0,625 × 2 | 1,25 | **1** |
| 0,25 × 2 | 0,5 | **0** |
| 0,5 × 2 | 1 | **1** |

0,625 = 0,101₂. Juntando: **10011,101₂**.

Conferindo: 16 + 2 + 1 + 0,5 + 0,125 = 19,625 ✔
</details>

---

## Questão 04 · Hexadecimal · 8 pontos

**Agrupando pelo lado certo.** Um conversor ADC de 10 bits devolveu **1101011001₂**. O firmware mostra os valores em hexadecimal.

**a)** Converta para hexadecimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `359`

Agrupe de 4 em 4 **a partir da direita** e complete o grupo da esquerda com zeros:

```
  11 0101 1001
0011 0101 1001
 3    5    9
```

**0x359**
</details>

**b)** Converta para decimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `857`

0x359 = 3 × 256 + 5 × 16 + 9 = 768 + 80 + 9 = **857**.

(Pelo binário: 512 + 256 + 64 + 16 + 8 + 1 = 857 ✔)
</details>

---

## Questão 05 · Codificação · 8 pontos

**Código-fonte em ASCII.** Um editor salva o código em ASCII. Uma das linhas do programa é exatamente `if (n<9)`, com um espaço entre `if` e o parêntese.

**a)** Escreva a sequência de bytes em hexadecimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `0x69 0x66 0x20 0x28 0x6E 0x3C 0x39 0x29`

| Caractere | Linha | Coluna | Hexa |
| --------- | ----- | ------ | ---- |
| i | 6 | 9 | 0x69 |
| f | 6 | 6 | 0x66 |
| espaço | 2 | 0 | 0x20 |
| ( | 2 | 8 | 0x28 |
| n | 6 | E | 0x6E |
| < | 3 | C | 0x3C |
| 9 | 3 | 9 | 0x39 |
| ) | 2 | 9 | 0x29 |

O **espaço** também é um caractere (0x20).
</details>

**b)** Quantos bytes a linha ocupa?

<details>
<summary>Ver resposta</summary>

**Resposta:** `8`

Um byte por caractere: **8 bytes**.
</details>

---

## Questão 06 · Adição binária · 8 pontos

**Soma com vírgula.** Um app de corrida soma duas distâncias guardadas em binário com parte fracionária: **110,01₂** e **10,111₂**. Some os valores em binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1001,001`

Alinhe as vírgulas completando com zeros: **110,010** + **010,111**. Sem as vírgulas, a conta é 110010 + 010111:

```
Vai um:  1 1   1 1
           1 1 0 0 1 0
        +  0 1 0 1 1 1
         -------------
         1 0 0 1 0 0 1
```

Volta a vírgula (3 casas): **1001,001₂**.

Conferindo: 6,25 + 2,875 = 9,125, e 1001,001₂ = 8 + 1 + 0,125 = 9,125 ✔
</details>

---

## Questão 07 · Números negativos · 8 pontos

**Freezer de laboratório.** O sensor de um freezer envia a temperatura em complemento a 2 com 8 bits. O valor recebido foi **1111 0011**. Qual é a temperatura em decimal?

<details>
<summary>Ver resposta</summary>

**Resposta:** `-13`

MSB = 1, então é negativo. C2(1111 0011) = 0000 1101 = 13. Temperatura: **−13 °C**.

Pelo peso negativo: −128 + 64 + 32 + 16 + 2 + 1 = **−13** ✔
</details>

---

## Questão 08 · Overflow · 8 pontos

**Positivo + positivo = negativo?.** Um contador de pontos de 8 bits em C2 está em **85** e o jogador ganha **60** pontos.

**a)** Faça a soma em binário. Qual é o resultado nos 8 bits?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1001 0001`

```
Vai um:    1 1 1 1 1
           0 1 0 1 0 1 0 1     (+85)
        +  0 0 1 1 1 1 0 0     (+60)
         -----------------
           1 0 0 1 0 0 0 1
```

**1001 0001**
</details>

**b)** Que valor (em decimal) o registrador mostra?

<details>
<summary>Ver resposta</summary>

**Resposta:** `-111`

MSB = 1 → em C2 é negativo: −128 + 16 + 1 = **−111**.
</details>

**c)** Houve overflow? (sim ou não)

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

Positivo + positivo deu negativo: **sim**. O certo seria 145, maior que 127.
</details>

---

## Questão 09 · Álgebra booleana · 9 pontos

**Login com dois fatores.** Um app de banco libera o acesso (**L = 1**) quando a **senha está correta (A)** e, além disso, o usuário confirma o **token (B)** **ou** a **biometria (C)**.

**a)** Escreva a expressão de L.

<details>
<summary>Ver resposta</summary>

**Expressão:** `A(B + C)`

"A **e** (B **ou** C)" = **A(B + C)**. Os parênteses são obrigatórios: AB + C liberaria só com a biometria.
</details>

**b)** Monte a tabela-verdade. Em quantas das 8 combinações o acesso é liberado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `3`

| A | B | C | B + C | **L** |
| - | - | - | ----- | ----- |
| 0 | 0 | 0 | 0 | **0** |
| 0 | 0 | 1 | 1 | **0** |
| 0 | 1 | 0 | 1 | **0** |
| 0 | 1 | 1 | 1 | **0** |
| 1 | 0 | 0 | 0 | **0** |
| 1 | 0 | 1 | 1 | **1** |
| 1 | 1 | 0 | 1 | **1** |
| 1 | 1 | 1 | 1 | **1** |

**3** combinações (101, 110 e 111).
</details>

**c)** Um app inseguro usa **L = A + B**. Em quantas combinações ele libera o acesso?

<details>
<summary>Ver resposta</summary>

**Resposta:** `6`

A + B só nega quando A = 0 e B = 0 (2 das 8 linhas, com C = 0 ou 1): libera em **6**. Com ele, basta o token, mesmo sem senha. O de dois fatores é bem mais seguro.
</details>

---

## Questão 10 · Circuitos combinacionais · 9 pontos

**Tabela com NOT sobre um grupo.** A habilitação de um módulo de memória é **X = AB' + (A'C)' + BC**. Monte a tabela-verdade com colunas intermediárias e escreva a coluna de X (linhas 000 a 111).

<details>
<summary>Ver resposta</summary>

**Resposta:** `10111111`

| A | B | C | A' | B' | AB' | A'C | (A'C)' | BC | **X** |
| - | - | - | -- | -- | --- | --- | ------ | -- | ----- |
| 0 | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 0 | **1** |
| 0 | 0 | 1 | 1 | 1 | 0 | 1 | 0 | 0 | **0** |
| 0 | 1 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | **1** |
| 0 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 1 | **1** |
| 1 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 0 | **1** |
| 1 | 0 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | **1** |
| 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | **1** |
| 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | **1** |

Coluna de X: **10111111**. Repare: o apóstrofo depois do parêntese inverte o **grupo** A'C inteiro, não cada letra.
</details>

---

## Questão 11 · Soma de produtos · 9 pontos

**Luz de erro da impressora.** A luz de erro de uma impressora (**E = 1**) acende quando há **papel atolado (J)**, ou quando acontecem **ao mesmo tempo** "sem papel" (**P**) e "toner baixo" (**T**).

**a)** Monte a tabela-verdade (ordem P, T, J) e escreva a coluna de E.

<details>
<summary>Ver resposta</summary>

**Resposta:** `01010111`

| P | T | J | PT | **E** |
| - | - | - | -- | ----- |
| 0 | 0 | 0 | 0 | **0** |
| 0 | 0 | 1 | 0 | **1** |
| 0 | 1 | 0 | 0 | **0** |
| 0 | 1 | 1 | 0 | **1** |
| 1 | 0 | 0 | 0 | **0** |
| 1 | 0 | 1 | 0 | **1** |
| 1 | 1 | 0 | 1 | **1** |
| 1 | 1 | 1 | 1 | **1** |

Coluna: **01010111**.
</details>

**b)** Escreva E na forma soma de produtos canônica (um produto por linha com 1).

<details>
<summary>Ver resposta</summary>

**Expressão:** `P'T'J + P'TJ + PT'J + PTJ' + PTJ`

Linhas com 1: 001, 011, 101, 110, 111 → **P'T'J + P'TJ + PT'J + PTJ' + PTJ**.
</details>

**c)** Simplifique.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `J + PT`

Os quatro produtos com J (J vale 1, P e T variam) viram **J**; o PTJ' junta com o PTJ e vira **PT**. Resultado: **E = J + PT**, exatamente a frase do enunciado.
</details>

---

## Questão 12 · Mapa de Karnaugh · 9 pontos

**Cuidado com o grupo redundante.** Um circuito de proteção de uma fonte tem 4 sensores (A, B, C, D). A saída de desligamento **Y = 1** nas linhas **0, 1, 2, 3, 5, 7, 13 e 15** da tabela-verdade.

**a)** Um aluno respondeu **Y = A'B' + A'D + BD**. A expressão está correta (dá a mesma tabela)? (sim ou não)

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

| AB \ CD | **C'D'** | **C'D** | **CD** | **CD'** |
| ------- | -------- | ------- | ------ | ------- |
| **A'B'** | **1** | **1** | **1** | **1** |
| **A'B** | 0 | **1** | **1** | 0 |
| **AB** | 0 | **1** | **1** | 0 |
| **AB'** | 0 | 0 | 0 | 0 |

A'B' cobre 0, 1, 2, 3; A'D cobre 1, 3, 5, 7; BD cobre 5, 7, 13, 15. Juntos cobrem todos os 1s e nenhum 0: **sim**, está correta.
</details>

**b)** Ela é mínima? (sim ou não)

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

**Não.** Todos os 1s do grupo A'D (1, 3, 5, 7) já estão cobertos por A'B' (1, 3) e BD (5, 7). O grupo A'D é **redundante** e pode sair.
</details>

**c)** Escreva a expressão mínima.

<details>
<summary>Ver resposta</summary>

**Expressão mínima:** `A'B' + BD`

| Grupo | Casas | Termo |
| ----- | ----- | ----- |
| 1 | linha A'B' inteira (0, 1, 3, 2) | **A'B'** |
| 2 | linhas A'B e AB, colunas C'D e CD (5, 7, 13, 15) | **BD** |

**Y = A'B' + BD**
</details>
