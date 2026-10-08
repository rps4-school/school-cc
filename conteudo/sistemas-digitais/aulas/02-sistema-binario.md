# 🔢 Sistema binário

> [← Analógico e digital](01-analogico-e-digital.md) · Próximo: [Hexadecimal →](03-hexadecimal.md)

**Nível:** 🟢 Iniciante

## 🎯 Você vai aprender

- Como funciona um **sistema posicional** (o decimal que você já usa e o binário).
- O que são **bit**, **byte**, **MSB** e **LSB**.
- Quantos valores cabem em **n bits**.
- Converter **binário → decimal**, inclusive números com vírgula.
- Converter **decimal → binário** pelos dois métodos: **divisão** e **subtração**.
- Converter a **parte fracionária** e entender por que às vezes há **perda de precisão**.

## Em uma frase

> 💡 No binário só existem os algarismos **0 e 1**, e cada posição vale **o dobro** da posição à direita: 1, 2, 4, 8, 16, 32...

## 1. Você já usa um sistema posicional

No decimal (base 10), o valor de um algarismo depende da **posição** dele. Em **453**:

| Posição | 2 | 1 | 0 |
| ------- | - | - | - |
| Peso (10^posição) | 10² = 100 | 10¹ = 10 | 10⁰ = 1 |
| Algarismo | 4 | 5 | 3 |
| Valor | 4 × 100 = 400 | 5 × 10 = 50 | 3 × 1 = 3 |

**Total:** 400 + 50 + 3 = **453**.

Depois da vírgula as posições ficam **negativas**. Em **27,53**:

| Posição | 1 | 0 | , | −1 | −2 |
| ------- | - | - | - | -- | -- |
| Peso | 10 | 1 | , | 10⁻¹ = 0,1 | 10⁻² = 0,01 |
| Algarismo | 2 | 7 | , | 5 | 3 |
| Valor | 20 | 7 | , | 0,5 | 0,03 |

O binário funciona **exatamente igual**, só que a base é **2**: os pesos são potências de 2.

## 2. Bits, bytes e os pesos

| Nome | O que é |
| ---- | ------- |
| **Bit** | Um algarismo binário: 0 ou 1 |
| **Nibble** | 4 bits |
| **Byte** | 8 bits |
| **MSB** (*Most Significant Bit*) | O bit **mais à esquerda**, o que vale mais |
| **LSB** (*Least Significant Bit*) | O bit **mais à direita**, o que vale menos |

Os pesos das posições (decore até 128, é o que mais cai):

| Posição | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 | , | −1 | −2 | −3 | −4 |
| ------- | - | - | - | - | - | - | - | - | - | -- | -- | -- | -- |
| Peso | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 | , | 0,5 | 0,25 | 0,125 | 0,0625 |

> 💡 **Para a esquerda, dobra. Para a direita, divide por 2.** Não precisa decorar a parte fracionária: 1 ÷ 2 = 0,5; ÷ 2 = 0,25; ÷ 2 = 0,125...

### Contando em binário (4 bits)

| Decimal | Binário | Decimal | Binário |
| ------- | ------- | ------- | ------- |
| 0 | 0000 | 8 | 1000 |
| 1 | 0001 | 9 | 1001 |
| 2 | 0010 | 10 | 1010 |
| 3 | 0011 | 11 | 1011 |
| 4 | 0100 | 12 | 1100 |
| 5 | 0101 | 13 | 1101 |
| 6 | 0110 | 14 | 1110 |
| 7 | 0111 | 15 | 1111 |

Repare: a coluna da direita alterna **0, 1, 0, 1**; a próxima alterna de **2 em 2**; a próxima de **4 em 4**; e a última de **8 em 8**.

## 3. Quanto cabe em n bits?

Cada bit tem 2 possibilidades. Com **n** bits:

| Fórmula | Significado |
| ------- | ----------- |
| **2ⁿ** | Quantidade de **valores diferentes** |
| **2ⁿ − 1** | **Maior número** (contando a partir do 0) |

| Bits | Valores (2ⁿ) | Faixa |
| ---- | ------------ | ----- |
| 1 | 2 | 0 a 1 |
| 3 | 8 | 0 a 7 |
| 4 | 16 | 0 a 15 |
| 8 | 256 | 0 a 255 |
| 10 | 1 024 | 0 a 1 023 |
| 16 | 65 536 | 0 a 65 535 |

> ⚠️ **Erro clássico:** com 8 bits existem **256** valores, mas o maior é **255**, porque o primeiro é o 0.

## 4. Binário → decimal

### 🧮 Passo a passo

1. Escreva os **pesos** em cima de cada bit (da direita para a esquerda: 1, 2, 4, 8...).
2. Multiplique cada bit pelo seu peso (ou seja, **copie o peso onde tem 1**).
3. **Some** tudo.

### Exemplo 1: 10110₂

| Peso | 16 | 8 | 4 | 2 | 1 |
| ---- | -- | - | - | - | - |
| Bit | 1 | 0 | 1 | 1 | 0 |
| Valor | 16 | 0 | 4 | 2 | 0 |

16 + 4 + 2 = **22**

### Exemplo 2: 10110110₂ (um byte)

| Peso | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| ---- | --- | -- | -- | -- | - | - | - | - |
| Bit | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 0 |
| Valor | 128 | 0 | 32 | 16 | 0 | 4 | 2 | 0 |

128 + 32 + 16 + 4 + 2 = **182**

### Exemplo 3: 1101,01₂ (com vírgula)

| Peso | 8 | 4 | 2 | 1 | , | 0,5 | 0,25 |
| ---- | - | - | - | - | - | --- | ---- |
| Bit | 1 | 1 | 0 | 1 | , | 0 | 1 |
| Valor | 8 | 4 | 0 | 1 | , | 0 | 0,25 |

8 + 4 + 1 + 0,25 = **13,25**

## 5. Decimal → binário

### Método A: divisões sucessivas por 2

1. Divida o número por 2 e anote o **resto** (0 ou 1).
2. Divida o **quociente** por 2 de novo e anote o resto.
3. Repita até o quociente ser **0**.
4. Leia os restos **de baixo para cima**. O primeiro resto é o **LSB**.

**Exemplo 4: 45 → binário**

| Divisão | Quociente | Resto |
| ------- | --------- | ----- |
| 45 ÷ 2 | 22 | **1** ← LSB |
| 22 ÷ 2 | 11 | **0** |
| 11 ÷ 2 | 5 | **1** |
| 5 ÷ 2 | 2 | **1** |
| 2 ÷ 2 | 1 | **0** |
| 1 ÷ 2 | 0 | **1** ← MSB |

Lendo de baixo para cima: **45 = 101101₂**.

**Confira** voltando: 32 + 8 + 4 + 1 = 45 ✔

**Exemplo 5: 156 → binário**

| Divisão | Quociente | Resto |
| ------- | --------- | ----- |
| 156 ÷ 2 | 78 | 0 |
| 78 ÷ 2 | 39 | 0 |
| 39 ÷ 2 | 19 | 1 |
| 19 ÷ 2 | 9 | 1 |
| 9 ÷ 2 | 4 | 1 |
| 4 ÷ 2 | 2 | 0 |
| 2 ÷ 2 | 1 | 0 |
| 1 ÷ 2 | 0 | 1 |

De baixo para cima: **156 = 1001 1100₂**. Separar de 4 em 4 bits facilita a leitura.

### Método B: subtração das potências de 2

1. Escreva os pesos (…, 64, 32, 16, 8, 4, 2, 1) começando pelo **maior que cabe** no número.
2. Para cada peso, da esquerda para a direita: **cabe no que sobrou?** Escreva **1** e subtraia. **Não cabe?** Escreva **0**.
3. Pare quando chegar no peso 1.

**Exemplo 6: 89 → binário**

| Peso | Cabe no que sobrou? | Bit | Sobra |
| ---- | ------------------- | --- | ----- |
| 64 | 89 ≥ 64, sim | **1** | 89 − 64 = 25 |
| 32 | 25 ≥ 32, não | **0** | 25 |
| 16 | 25 ≥ 16, sim | **1** | 25 − 16 = 9 |
| 8 | 9 ≥ 8, sim | **1** | 9 − 8 = 1 |
| 4 | 1 ≥ 4, não | **0** | 1 |
| 2 | 1 ≥ 2, não | **0** | 1 |
| 1 | 1 ≥ 1, sim | **1** | 0 |

**89 = 1011001₂** (64 + 16 + 8 + 1).

> 💡 **Qual método usar?** Os dois dão o mesmo resultado. A **subtração** é mais rápida para números pequenos, se você sabe as potências de 2 de cor. A **divisão** é mais segura para números grandes. Na prova, use o que o enunciado pedir.

## 6. Parte fracionária: multiplicações sucessivas por 2

Para a parte **depois da vírgula**, o caminho é o contrário: em vez de dividir, **multiplique por 2**.

1. Multiplique a fração por 2.
2. A **parte inteira** do resultado (0 ou 1) é o próximo bit.
3. Se o resultado for **maior ou igual a 1**, tire 1 e continue só com a fração.
4. Pare quando a fração virar **0** ou quando atingir o **limite de bits** pedido.
5. Leia os bits **de cima para baixo**. O primeiro bit fica logo depois da vírgula.

**Exemplo 7: 0,8125 → binário**

| Conta | Resultado | Bit | Continua com |
| ----- | --------- | --- | ------------ |
| 0,8125 × 2 | 1,625 | **1** | 0,625 |
| 0,625 × 2 | 1,25 | **1** | 0,25 |
| 0,25 × 2 | 0,5 | **0** | 0,5 |
| 0,5 × 2 | 1,0 | **1** | 0 (fim) |

De cima para baixo: **0,8125 = 0,1101₂**.

**Exemplo 8: 6,375 → binário (inteiro e fração separados)**

- Parte inteira: **6 = 110₂**
- Parte fracionária: 0,375 × 2 = 0,75 → **0**; 0,75 × 2 = 1,5 → **1** (sobra 0,5); 0,5 × 2 = 1,0 → **1** (fim) → **0,011₂**
- Juntando: **6,375 = 110,011₂**

**Exemplo 9: 0,3 com 4 bits depois da vírgula (perda de precisão)**

| Conta | Resultado | Bit | Continua com |
| ----- | --------- | --- | ------------ |
| 0,3 × 2 | 0,6 | **0** | 0,6 |
| 0,6 × 2 | 1,2 | **1** | 0,2 |
| 0,2 × 2 | 0,4 | **0** | 0,4 |
| 0,4 × 2 | 0,8 | **0** | 0,8 |

Com 4 bits: **0,0100₂**. Mas a conta não acabou (sobrou 0,8)! Voltando para decimal: 0,0100₂ = 0,25, e não 0,3. O **erro** é 0,3 − 0,25 = **0,05**.

> ⚠️ Algumas frações **nunca terminam** em binário (como 0,1 e 0,3). Com poucos bits, o computador guarda só uma **aproximação**. É por isso que, em várias linguagens de programação, `0.1 + 0.2` não dá exatamente `0.3`.

## ⚠️ Erros comuns

| Erro | Como evitar |
| ---- | ----------- |
| Ler os restos da divisão de cima para baixo | Na **divisão**, o primeiro resto é o **LSB**: leia de **baixo para cima** |
| Ler os bits da fração de baixo para cima | Na **multiplicação**, o primeiro bit fica **colado na vírgula**: leia de **cima para baixo** |
| Parar a divisão quando o quociente é 1 | Vá até o quociente ser **0**: o último 1 também é um bit |
| Esquecer os zeros do meio na subtração | Escreva **todos** os pesos, e marque 0 nos que não cabem |
| Achar que 2ⁿ é o maior número | O maior é **2ⁿ − 1** |

## 💡 Macetes

- **Potências de 2 de cor:** 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024.
- **Número ímpar termina em 1**, número par termina em 0 (o LSB vale 1).
- **Confira sempre** voltando para decimal: leva 10 segundos e evita perder a questão.
- Um binário só de 1s com n bits vale **2ⁿ − 1**: 1111₂ = 15, 111111₂ = 63.

## ✅ Teste rápido

**1.** Converta **1011010₂** para decimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `90`

| Peso | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| ---- | -- | -- | -- | - | - | - | - |
| Bit | 1 | 0 | 1 | 1 | 0 | 1 | 0 |

64 + 16 + 8 + 2 = **90**
</details>

**2.** Converta **37** para binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `100101`

Divisões: 37 → 18 resto **1**; 18 → 9 resto **0**; 9 → 4 resto **1**; 4 → 2 resto **0**; 2 → 1 resto **0**; 1 → 0 resto **1**.
De baixo para cima: **100101₂**. Conferindo: 32 + 4 + 1 = 37 ✔
</details>

**3.** Converta **10110110₂** para decimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `182`

128 + 32 + 16 + 4 + 2 = **182** (é o Exemplo 2 desta aula).
</details>

**4.** Converta **0,625** para binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `0,101`

0,625 × 2 = 1,25 → **1**; 0,25 × 2 = 0,5 → **0**; 0,5 × 2 = 1,0 → **1** (fim). De cima para baixo: **0,101₂**.
</details>

**5.** Converta **11,25** para binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1011,01`

- 11 = 8 + 2 + 1 = **1011₂**
- 0,25 × 2 = 0,5 → **0**; 0,5 × 2 = 1,0 → **1** → **0,01₂**

Juntando: **1011,01₂**
</details>

**6.** Qual é o **maior** número decimal que dá para representar com **10 bits**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1023`

2¹⁰ − 1 = 1 024 − 1 = **1 023**
</details>

**7.** Quantos valores **diferentes** dá para representar com **6 bits**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `64`

2⁶ = **64** valores (de 0 a 63).
</details>

**8.** Converta **0,1** para binário usando **5 bits** depois da vírgula.

<details>
<summary>Ver resposta</summary>

**Resposta:** `0,00011`

| Conta | Resultado | Bit |
| ----- | --------- | --- |
| 0,1 × 2 | 0,2 | 0 |
| 0,2 × 2 | 0,4 | 0 |
| 0,4 × 2 | 0,8 | 0 |
| 0,8 × 2 | 1,6 | 1 |
| 0,6 × 2 | 1,2 | 1 |

**0,00011₂**, que vale 0,09375. A conta não terminou, então há **perda de precisão** (erro de 0,00625).
</details>

## ✏️ Agora pratique

São 9 exercícios sobre este assunto, do fácil ao difícil, com resolução passo a passo:

| 🟢 Fácil | 🟡 Intermediário | 🔴 Difícil |
| -------- | ---------------- | ---------- |
| [Exercícios 01 a 03](../exercicios/02-binario/facil.md) | [Exercícios 04 a 06](../exercicios/02-binario/intermediario.md) | [Exercícios 07 a 09](../exercicios/02-binario/dificil.md) |

## 📚 Referências

- TOCCI, Ronald J.; WIDMER, Neal S.; MOSS, Gregory L. *Sistemas digitais: princípios e aplicações*. 11. ed. Pearson, 2011. Seções 1.4 a 1.9 e capítulo 2.
- [Khan Academy: números binários (em português)](https://pt.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:digital-information/xcae6f4a7ff015e7d:binary-numbers/a/bits-and-binary)
