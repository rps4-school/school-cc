# 🔣 Hexadecimal

> [← Sistema binário](02-sistema-binario.md) · Próximo: [Codificação →](04-codificacao.md)

**Nível:** 🟢 Iniciante

## 🎯 Você vai aprender

- Por que o **hexadecimal** (base 16) existe e onde ele aparece.
- Os 16 algarismos, de **0 a F**, e o prefixo **0x**.
- Converter **hexadecimal ↔ decimal**.
- O **atalho do nibble**: hexadecimal ↔ binário sem passar pelo decimal, inclusive com vírgula.
- Contar em hexadecimal.

## Em uma frase

> 💡 Cada algarismo hexadecimal vale **exatamente 4 bits**. Por isso o hexadecimal é um jeito **curto** de escrever binário.

## Por que existe?

Binário é ótimo para o computador, mas péssimo para gente: **1011 0110 1110** é difícil de ler e fácil de errar. Em hexadecimal, o mesmo número é só **B6E**.

| Onde aparece | Exemplo |
| ------------ | ------- |
| Cores em páginas web | `#FF8000` (laranja) |
| Endereços de memória | `0x7FFE1A2C` |
| Endereço MAC da placa de rede | `3C:52:82:1F:A0:B4` |
| Códigos de caracteres | a letra `A` é `0x41` |

## Os 16 algarismos

Depois do 9 acabam os algarismos que conhecemos, então usamos **letras**:

| Decimal | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| ------- | - | - | - | - | - | - | - | - | - | - | -- | -- | -- | -- | -- | -- |
| Hexa | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | **A** | **B** | **C** | **D** | **E** | **F** |

Para não confundir 10 decimal com 10 hexadecimal, indicamos a base:

| Jeito de escrever | Significa |
| ----------------- | --------- |
| `0x10` | 10 em hexadecimal = 16 em decimal |
| `10₁₆` | o mesmo, com a base em subscrito |
| `#10` | usado em cores |

## Os pesos em base 16

Igual ao binário e ao decimal, só que cada posição vale **16 vezes** a da direita:

| Posição | 3 | 2 | 1 | 0 | , | −1 | −2 |
| ------- | - | - | - | - | - | -- | -- |
| Peso | 16³ = 4 096 | 16² = 256 | 16¹ = 16 | 16⁰ = 1 | , | 1/16 = 0,0625 | 1/256 |

## 1. Hexadecimal → decimal

### 🧮 Passo a passo

1. Troque cada letra pelo valor dela (A = 10 ... F = 15).
2. Multiplique cada algarismo pelo peso da posição.
3. Some.

**Exemplo 1: 0x2F**

| Peso | 16 | 1 |
| ---- | -- | - |
| Algarismo | 2 | F = 15 |
| Valor | 2 × 16 = 32 | 15 × 1 = 15 |

32 + 15 = **47**

**Exemplo 2: 0x1F4**

| Peso | 256 | 16 | 1 |
| ---- | --- | -- | - |
| Algarismo | 1 | F = 15 | 4 |
| Valor | 256 | 240 | 4 |

256 + 240 + 4 = **500**

## 2. Decimal → hexadecimal: divisões sucessivas por 16

Mesma ideia do binário, só que dividindo por **16**. Os restos vão de 0 a 15; troque 10 a 15 pela letra.

**Exemplo 3: 1000 → hexadecimal**

| Divisão | Quociente | Resto | Algarismo |
| ------- | --------- | ----- | --------- |
| 1000 ÷ 16 | 62 | 8 | **8** ← menos significativo |
| 62 ÷ 16 | 3 | 14 | **E** |
| 3 ÷ 16 | 0 | 3 | **3** ← mais significativo |

De baixo para cima: **1000 = 0x3E8**. Conferindo: 3 × 256 + 14 × 16 + 8 = 768 + 224 + 8 = 1000 ✔

> 💡 **Como achar o resto sem calculadora:** 1000 ÷ 16 dá 62 e "sobra" 1000 − 62 × 16 = 1000 − 992 = **8**.

## 3. O atalho do nibble: hexadecimal ↔ binário

Como 16 = 2⁴, **cada algarismo hexa vira exatamente 4 bits** (um nibble). Esta tabela resolve tudo:

| Hexa | Binário | Hexa | Binário |
| ---- | ------- | ---- | ------- |
| 0 | 0000 | 8 | 1000 |
| 1 | 0001 | 9 | 1001 |
| 2 | 0010 | A | 1010 |
| 3 | 0011 | B | 1011 |
| 4 | 0100 | C | 1100 |
| 5 | 0101 | D | 1101 |
| 6 | 0110 | E | 1110 |
| 7 | 0111 | F | 1111 |

### Binário → hexadecimal

1. Separe os bits em grupos de 4, **a partir da vírgula** (para a esquerda na parte inteira, para a direita na fração).
2. Complete os grupos incompletos com **zeros** (à esquerda na parte inteira, à direita na fração).
3. Troque cada grupo pelo algarismo hexa.

**Exemplo 4: 101101101110₂**

```
1011 0110 1110
 B    6    E      →  0xB6E
```

**Exemplo 5: 1101011₂ (só 7 bits)**

```
 110 1011   →  complete com um zero à esquerda
0110 1011
 6    B      →  0x6B
```

**Exemplo 6: 1101,1001₂ (com vírgula)**

```
1101 , 1001
 D   ,  9     →  0xD,9
```

E em decimal: 0xD,9 = 13 + 9/16 = 13 + 0,5625 = **13,5625**.

### Hexadecimal → binário

Troque cada algarismo pelos seus 4 bits.

**Exemplo 7: 0x3A,8**

```
 3    A   ,  8
0011 1010 , 1000   →  111010,1₂  (os zeros das pontas podem sair)
```

Conferindo em decimal: 0x3A = 3 × 16 + 10 = 58 e 0x0,8 = 8/16 = 0,5, então **58,5**.

> ⚠️ **Os zeros do meio nunca saem.** Em 0x3A, o 3 vira **0011** e o A vira **1010**. Escrever "11 1010" no lugar de "0011 1010" está certo; escrever "111 101" está errado.

## 4. Contando em hexadecimal

Quando um algarismo passa de **F**, ele volta para 0 e "vai um" para a esquerda (como 9 → 10 no decimal):

| ... | 0x1AD | 0x1AE | 0x1AF | **0x1B0** | 0x1B1 | ... |
| --- | ----- | ----- | ----- | --------- | ----- | --- |

**Quanto cabe em n algarismos hexa?** Cada algarismo tem 16 possibilidades, então **16ⁿ** valores, de 0 até 16ⁿ − 1:

| Algarismos | Faixa | Valores |
| ---------- | ----- | ------- |
| 2 (um byte) | 0x00 a 0xFF (0 a 255) | 256 |
| 3 | 0x000 a 0xFFF (0 a 4 095) | 4 096 |
| 4 | 0x0000 a 0xFFFF (0 a 65 535) | 65 536 |

## ⚠️ Erros comuns

| Erro | Como evitar |
| ---- | ----------- |
| Agrupar de 4 em 4 começando pela esquerda | Na parte inteira, comece **pela direita** (pela vírgula) |
| Esquecer que A = 10 (e não 1) | Escreva a tabela 10 a 15 = A a F no canto da prova |
| Ler os restos da divisão por 16 de cima para baixo | Igual ao binário: **de baixo para cima** |
| Achar que 0x10 = 10 | 0x10 = 1 × 16 + 0 = **16** |

## 💡 Macetes

- **Decore só 8, 4, 2, 1** dentro do nibble: B = 8 + 2 + 1 = 1011.
- **Hexa → decimal grande?** Às vezes é mais fácil passar para binário e depois para decimal, ou o contrário.
- **0xFF = 255** é o maior valor de um byte. Aparece o tempo todo (cores, máscaras de rede).

## ✅ Teste rápido

**1.** Converta **0xFF** para decimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `255`

15 × 16 + 15 × 1 = 240 + 15 = **255**
</details>

**2.** Converta **200** para hexadecimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `C8`

200 ÷ 16 = 12 resto **8**; 12 ÷ 16 = 0 resto **12 = C**. De baixo para cima: **0xC8**.
Conferindo: 12 × 16 + 8 = 192 + 8 = 200 ✔
</details>

**3.** Converta **11100101₂** para hexadecimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `E5`

1110 → **E** e 0101 → **5**: **0xE5**
</details>

**4.** Converta **0x7C** para binário com **8 bits**.

<details>
<summary>Ver resposta</summary>

**Resposta:** `0111 1100`

7 → **0111** e C → **1100**: **0111 1100₂**
</details>

**5.** Qual é o número que vem **logo depois** de 0x1AF?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1B0`

F + 1 passa de 15: o F vira 0 e "vai um" para o A, que vira B. **0x1B0**.
</details>

**6.** Quantos valores diferentes dá para escrever com **3 algarismos** hexadecimais?

<details>
<summary>Ver resposta</summary>

**Resposta:** `4096`

16³ = **4 096** (de 0x000 até 0xFFF, ou seja, 0 a 4 095).
</details>

**7.** Converta **0x3E8** para decimal.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1000`

3 × 256 + 14 × 16 + 8 = 768 + 224 + 8 = **1 000** (é o Exemplo 3 ao contrário).
</details>

**8.** Converta **0xA,C** para binário.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1010,11 | 1010,1100`

A → **1010** e C → **1100**: **1010,1100₂**. Os zeros no fim da fração podem sair: **1010,11₂** (= 10,75).
</details>

## ✏️ Agora pratique

São 9 exercícios sobre este assunto, do fácil ao difícil, com resolução passo a passo:

| 🟢 Fácil | 🟡 Intermediário | 🔴 Difícil |
| -------- | ---------------- | ---------- |
| [Exercícios 01 a 03](../exercicios/03-hexadecimal/facil.md) | [Exercícios 04 a 06](../exercicios/03-hexadecimal/intermediario.md) | [Exercícios 07 a 09](../exercicios/03-hexadecimal/dificil.md) |

## 📚 Referências

- TOCCI, Ronald J.; WIDMER, Neal S.; MOSS, Gregory L. *Sistemas digitais: princípios e aplicações*. 11. ed. Pearson, 2011. Seções 2.4 e 2.5.
