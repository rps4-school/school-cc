# ➖ Números negativos

> [← Adição binária](05-adicao-binaria.md) · Próximo: [Álgebra booleana →](07-algebra-booleana.md)

**Nível:** 🟡 Intermediário

> 📖 **Antes, leia:** [Adição binária](05-adicao-binaria.md). Aqui toda subtração vira uma soma.

## 🎯 Você vai aprender

- As três formas de guardar números negativos: **sinal-magnitude**, **complemento a 1** e **complemento a 2**.
- O **macete** para achar o complemento a 2 em segundos.
- Ler um número em complemento a 2 e descobrir o valor em decimal.
- A **faixa de valores** de cada representação.
- **Subtrair somando**, e reconhecer quando há **overflow**.

## Em uma frase

> 💡 No computador não existe o sinal "−": o negativo é um **padrão de bits** combinado. O mais usado é o **complemento a 2**, porque com ele a subtração vira uma soma comum.

> ⚠️ **A quantidade de bits é sempre fixa e combinada antes** (por exemplo, 8 bits). Sem saber quantos bits são, não dá para dizer se 1101 é 13 ou um negativo.

## 1. Sinal-magnitude (SM)

O jeito mais intuitivo: o **bit mais à esquerda (MSB) vira o sinal**, e o resto é o valor (a magnitude).

| MSB | Significado |
| --- | ----------- |
| 0 | positivo |
| 1 | negativo |

**Exemplo 1 (8 bits):**

| Número | Sinal | Magnitude (7 bits) | Sinal-magnitude |
| ------ | ----- | ------------------ | --------------- |
| +37 | 0 | 010 0101 | **0010 0101** |
| −37 | 1 | 010 0101 | **1010 0101** |

**Problemas:**

- Existem **dois zeros**: 0000 0000 (+0) e 1000 0000 (−0).
- A soma comum **não funciona**: o circuito teria que olhar os sinais, comparar os tamanhos e decidir se soma ou subtrai.

## 2. Complemento a 1 (C1)

Para fazer o negativo, **inverta todos os bits** do positivo (0 vira 1 e 1 vira 0).

**Exemplo 2:** +37 = 0010 0101 → **−37 em C1 = 1101 1010**

Continua com **dois zeros** (0000 0000 e 1111 1111) e a subtração ainda não é direta. Mas ele é o passo do meio para o complemento a 2.

## 3. Complemento a 2 (C2)

### 🧮 Os 3 passos

1. Escreva o número **positivo** em binário, com a quantidade de bits pedida.
2. **Inverta** todos os bits (complemento a 1).
3. **Some 1**.

**Exemplo 3: −37 em C2 (8 bits)**

| Passo | Bits |
| ----- | ---- |
| 1. +37 | 0010 0101 |
| 2. Inverter | 1101 1010 |
| 3. Somar 1 | **1101 1011** |

### ⚡ O macete (sem somar nada)

Leia o positivo **da direita para a esquerda**:

1. **Copie** os bits até o **primeiro 1**, inclusive ele.
2. **Inverta** todos os bits que sobraram à esquerda.

**Exemplo 4: −20 em C2 (8 bits)**

```
+20 =  0 0 0 1 0 | 1 0 0      ← copia até o primeiro 1 (vindo da direita): "100"
       inverte   | copia
−20 =  1 1 1 0 1 | 1 0 0   =  1110 1100
```

**Exemplo 3 de novo pelo macete:** +37 = 0010 010**1** → copia só o último 1 e inverte o resto → 1101 101**1**. Mesmo resultado ✔

> 💡 **O caminho de volta é igual.** Aplicar o complemento a 2 num negativo devolve o positivo: C2(1101 1011) = 0010 0101 = 37.

### Lendo um número em C2

| MSB | Como ler |
| --- | -------- |
| **0** | É positivo: converta normalmente |
| **1** | É negativo: faça o C2 para achar o tamanho e coloque o sinal "−" |

**Exemplo 5: quanto vale 1111 0000 (C2, 8 bits)?**

MSB = 1, então é negativo. C2(1111 0000) = 0001 0000 = 16. Logo vale **−16**.

> 💡 **Atalho do peso negativo:** em C2, o MSB vale **negativo**. Com 8 bits, o MSB vale **−128** e os outros valem o normal:
>
> 1111 0000 = −128 + 64 + 32 + 16 = **−16** ✔

## 4. Faixa de valores com n bits

| Representação | Menor | Maior | Com 8 bits | Zeros |
| ------------- | ----- | ----- | ---------- | ----- |
| Sinal-magnitude | −(2ⁿ⁻¹ − 1) | 2ⁿ⁻¹ − 1 | −127 a 127 | dois |
| Complemento a 1 | −(2ⁿ⁻¹ − 1) | 2ⁿ⁻¹ − 1 | −127 a 127 | dois |
| **Complemento a 2** | **−2ⁿ⁻¹** | **2ⁿ⁻¹ − 1** | **−128 a 127** | **um só** |

O C2 tem **um negativo a mais** porque não desperdiça um padrão com o "−0". Valores especiais com 8 bits:

| Bits | Valor em C2 |
| ---- | ----------- |
| 0000 0000 | 0 |
| 0111 1111 | +127 (o maior) |
| 1000 0000 | −128 (o menor) |
| 1111 1111 | −1 |

## 5. Subtraindo com uma soma

Para fazer **A − B**, calcule **A + (−B)**: troque B pelo seu C2 e **some**.

### 🧮 Passo a passo

1. Escreva A e B em binário, com a quantidade de bits pedida.
2. Troque o **B** pelo seu C2 (se a conta for A − B).
3. Some normalmente, como na aula anterior.
4. **Descarte** o vai um que sair pela esquerda (ele não faz parte do resultado).
5. Leia o resultado em C2 (se o MSB for 1, é negativo).

### Exemplo 6: 90 − 37 (8 bits)

90 = 0101 1010 e −37 = 1101 1011.

```
Vai um:  1 1   1 1   1
           0 1 0 1 1 0 1 0     (+90)
        +  1 1 0 1 1 0 1 1     (−37)
         -----------------
         1 0 0 1 1 0 1 0 1
         ↑ descarta
```

Resultado: **0011 0101 = 53** ✔ (90 − 37 = 53)

### Exemplo 7: 37 − 90 (8 bits, resultado negativo)

37 = 0010 0101 e −90 = 1010 0110 (macete: 0101 10**10** → copia "10", inverte o resto).

```
Vai um:      1     1
           0 0 1 0 0 1 0 1     (+37)
        +  1 0 1 0 0 1 1 0     (−90)
         -----------------
           1 1 0 0 1 0 1 1
```

MSB = 1, então é negativo. C2(1100 1011) = 0011 0101 = 53, logo o resultado é **−53** ✔

### Exemplo 8: 13 − 9 com 6 bits

13 = 001101 e 9 = 001001, então −9 = 110111.

```
Vai um:  1 1 1 1 1 1
           0 0 1 1 0 1     (+13)
        +  1 1 0 1 1 1     (−9)
         -------------
         1 0 0 0 1 0 0
         ↑ descarta
```

Resultado: **000100 = 4** ✔

## 6. Overflow: quando o resultado não cabe

Com 8 bits em C2 só cabem números de **−128 a 127**. Se a conta der fora disso, o resultado aparece **errado**: isso é **overflow** (estouro).

### 🧮 Como reconhecer (sem converter nada)

| Os dois números são... | O resultado deu... | Overflow? |
| ---------------------- | ------------------ | --------- |
| Positivo + positivo | **negativo** (MSB 1) | **Sim** |
| Negativo + negativo | **positivo** (MSB 0) | **Sim** |
| De sinais **diferentes** | qualquer coisa | **Nunca** |

### Exemplo 9: 100 + 50 (8 bits)

```
Vai um:    1 1
           0 1 1 0 0 1 0 0     (+100)
        +  0 0 1 1 0 0 1 0     (+50)
         -----------------
           1 0 0 1 0 1 1 0     → MSB 1: deu negativo (−106)!
```

Positivo + positivo deu negativo: **overflow**. O certo seria 150, que é maior que 127.

### Exemplo 10: −100 − 50 (8 bits)

−100 = 1001 1100 e −50 = 1100 1110.

```
Vai um:  1     1 1 1
           1 0 0 1 1 1 0 0     (−100)
        +  1 1 0 0 1 1 1 0     (−50)
         -----------------
         1 0 1 1 0 1 0 1 0     → descarta o vai um: 0110 1010 = +106!
```

Negativo + negativo deu positivo: **overflow**. O certo seria −150, que é menor que −128.

> ⚠️ **Vai um final não é overflow.** No Exemplo 6 sobrou um vai um à esquerda e o resultado estava **certo**. Para saber se houve overflow, olhe os **sinais**, não o vai um.

## ⚠️ Erros comuns

| Erro | Como evitar |
| ---- | ----------- |
| Fazer o C2 sem completar os bits | Primeiro escreva o positivo com **todos** os bits (0010 0101, não 100101) |
| Inverter o positivo e esquecer de somar 1 | Inverter é C1. **C2 = C1 + 1** (ou use o macete) |
| Ler 1111 0000 como 240 | Em C2, MSB 1 = **negativo**: vale −16 |
| Achar que o vai um final é overflow | Overflow é **sinal errado**, não vai um |
| Dizer que −128 cabe em 8 bits em sinal-magnitude | Em SM e C1 a faixa é −127 a 127. Só o C2 chega a −128 |

## 💡 Macetes

- **C2 relâmpago:** copia até o primeiro 1 (da direita), inverte o resto.
- **MSB vale negativo:** com n bits, o MSB vale −2ⁿ⁻¹ (−128 com 8 bits, −32 com 6 bits).
- **−1 é tudo 1:** 1111 1111 em 8 bits, 111111 em 6 bits.
- **Overflow só com sinais iguais.** Sinais diferentes: pode somar tranquilo.

## ✅ Teste rápido

**1.** Represente **−5** em **sinal-magnitude** com 8 bits.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1000 0101`

Sinal **1** (negativo) + magnitude 5 em 7 bits (000 0101) = **1000 0101**.
</details>

**2.** Represente **−37** em **complemento a 1** com 8 bits.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1101 1010`

+37 = 0010 0101. Invertendo todos os bits: **1101 1010**.
</details>

**3.** Represente **−20** em **complemento a 2** com 8 bits.

<details>
<summary>Ver resposta</summary>

**Resposta:** `1110 1100`

+20 = 0001 0100. Macete: copia "100" e inverte "00010" → "11101". Juntando: **1110 1100**.
</details>

**4.** Quanto vale, em decimal, o número **1011 0100** em complemento a 2 (8 bits)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `-76`

MSB = 1, então é negativo. C2(1011 0100) = 0100 1100 = 64 + 8 + 4 = 76. Logo, **−76**.

Pelo peso negativo: −128 + 32 + 16 + 4 = **−76** ✔
</details>

**5.** Qual é o **menor** número que dá para representar em complemento a 2 com **6 bits**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `-32`

−2ⁿ⁻¹ = −2⁵ = **−32**. (A faixa completa é −32 a 31.)
</details>

**6.** Calcule **25 − 30** em complemento a 2 com 8 bits. Qual é o resultado em binário?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1111 1011`

25 = 0001 1001 e −30 = 1110 0010 (30 = 0001 1110).

```
           0 0 0 1 1 0 0 1     (+25)
        +  1 1 1 0 0 0 1 0     (−30)
         -----------------
           1 1 1 1 1 0 1 1
```

MSB 1 → negativo: C2(1111 1011) = 0000 0101 = 5, ou seja, **−5** ✔
</details>

**7.** Ao calcular **70 + 70** em complemento a 2 com 8 bits, acontece overflow? (Responda sim ou não.)

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

0100 0110 + 0100 0110 = **1000 1100**: positivo + positivo deu MSB 1 (negativo, −116). O certo seria 140, que passa de 127. **Overflow.**
</details>

**8.** Como fica o **−1** em complemento a 2 com 8 bits?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1111 1111`

+1 = 0000 0001. Macete: copia o "1" e inverte o resto → **1111 1111**.
</details>

## ✏️ Agora pratique

São 9 exercícios sobre este assunto, do fácil ao difícil, com resolução passo a passo:

| 🟢 Fácil | 🟡 Intermediário | 🔴 Difícil |
| -------- | ---------------- | ---------- |
| [Exercícios 01 a 03](../exercicios/06-numeros-negativos/facil.md) | [Exercícios 04 a 06](../exercicios/06-numeros-negativos/intermediario.md) | [Exercícios 07 a 09](../exercicios/06-numeros-negativos/dificil.md) |

## 📖 Para ir além (fora da ementa)

Dentro do processador, a ULA (a parte que faz as contas) tem um bit chamado **flag de overflow (V)**. Ele é ligado justamente pela regra dos sinais desta aula, e é assim que linguagens como C e Java "sabem" que uma conta com `int` estourou.

## 📚 Referências

- TOCCI, Ronald J.; WIDMER, Neal S.; MOSS, Gregory L. *Sistemas digitais: princípios e aplicações*. 11. ed. Pearson, 2011. Seções 6.2 a 6.4.
