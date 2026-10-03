# ➖ Números negativos · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Números negativos](../../aulas/06-numeros-negativos.md) · Próximo: [Álgebra booleana →](../07-algebra-booleana/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Tem overflow?

Uma ULA de **8 bits** (complemento a 2) fez as somas abaixo. Para cada uma, responda **sim** ou **não**: houve overflow? Tente decidir só olhando os sinais.

**a)** **0101 0000 + 0011 0000**

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

```
Vai um:    1 1 1
           0 1 0 1 0 0 0 0
        +  0 0 1 1 0 0 0 0
         -----------------
           1 0 0 0 0 0 0 0
```

80 + 48: sinais **iguais**; o resultado 1000 0000 vale −128. O sinal mudou: **overflow** (o certo seria 128, fora de −128 a 127).
</details>

**b)** **1100 0000 + 1110 0000**

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

```
Vai um:  1 1
           1 1 0 0 0 0 0 0
        +  1 1 1 0 0 0 0 0
         -----------------
         1 1 0 1 0 0 0 0 0
```

−64 + (−32): sinais **iguais**; o resultado 1010 0000 vale −96. O sinal se manteve: **sem overflow**.
</details>

**c)** **1000 0001 + 1111 1110**

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

```
Vai um:  1
           1 0 0 0 0 0 0 1
        +  1 1 1 1 1 1 1 0
         -----------------
         1 0 1 1 1 1 1 1 1
```

−127 + (−2): sinais **iguais**; o resultado 0111 1111 vale 127. O sinal mudou: **overflow** (o certo seria −129, fora de −128 a 127).
</details>

**d)** **0111 0000 + 1001 0000**

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

```
Vai um:  1 1 1 1
           0 1 1 1 0 0 0 0
        +  1 0 0 1 0 0 0 0
         -----------------
         1 0 0 0 0 0 0 0 0
```

112 + (−112): sinais **diferentes**; o resultado 0000 0000 vale 0. Sinais diferentes **nunca** dão overflow.
</details>

---

## Exercício 08: Com 6 bits

Calcule **17 − 31** em complemento a 2 com **6 bits**.

**a)** Qual é o resultado em binário?

<details>
<summary>Ver resposta</summary>

**Resposta:** `110010`

17 = 010001; 31 = 011111, então −31 = 100001.

```
Vai um:            1
           0 1 0 0 0 1     (+17)
        +  1 0 0 0 0 1     (−31)
         -------------
           1 1 0 0 1 0
```

**110010**
</details>

**b)** Quanto vale em decimal?

<details>
<summary>Ver resposta</summary>

**Resposta:** `-14`

MSB 1 → negativo. Com 6 bits o MSB vale −32: −32 + 16 + 2 = **−14** ✔ (17 − 31 = −14)
</details>

---

## Exercício 09: Quando 8 bits não bastam

Calcule **−90 − 50** (ou seja, −90 + (−50)) em complemento a 2 com 8 bits.

**a)** Qual é o resultado nos 8 bits?

<details>
<summary>Ver resposta</summary>

**Resposta:** `0111 0100`

−90 = 1010 0110 e −50 = 1100 1110.

```
Vai um:  1       1 1 1
           1 0 1 0 0 1 1 0     (−90)
        +  1 1 0 0 1 1 1 0     (−50)
         -----------------
         1 0 1 1 1 0 1 0 0
```

Descartando o vai um: **0111 0100** (vale 116).
</details>

**b)** Houve overflow?

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

Negativo + negativo deu **positivo** (116): **overflow**. O certo seria −140, menor que −128.
</details>

**c)** Qual é o **menor** número de bits que faria essa conta caber em C2?

<details>
<summary>Ver resposta</summary>

**Resposta:** `9`

Com 9 bits a faixa é −256 a 255, e −140 cabe. Com 8 bits (−128 a 127) não cabe. Resposta: **9 bits**.
</details>
