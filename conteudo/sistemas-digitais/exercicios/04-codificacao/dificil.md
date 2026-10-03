# 🔤 Codificação · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Codificação](../../aulas/04-codificacao.md) · Próximo: [Adição binária →](../05-adicao-binaria/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Tamanho de uma foto

Uma câmera de segurança tira fotos de **800 × 600** pixels, coloridas em RGB (**24 bits** por pixel), sem compressão.

**a)** Quantos **bytes** ocupa uma foto?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1440000`

24 bits = 3 bytes por pixel. 800 × 600 = 480 000 pixels × 3 = **1 440 000 bytes**.
</details>

**b)** Quanto é isso em **KB**?

<details>
<summary>Ver resposta</summary>

**Resposta:** `1 406,25`

1 440 000 ÷ 1 024 = **1 406,25 KB**.
</details>

---

## Exercício 08: Quantos pixels cabem?

Uma tela de relógio tem uma memória de **2 KB** para guardar a imagem.

**a)** Quantos pixels cabem se a imagem for em **preto e branco** (1 bit por pixel)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `16384`

2 KB = 2 × 1 024 = 2 048 bytes = 2 048 × 8 = **16 384 bits**. Com 1 bit por pixel: **16 384 pixels** (por exemplo, 128 × 128).
</details>

**b)** E em **tons de cinza** (8 bits por pixel)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `2048`

Com 1 byte por pixel: 2 048 bytes = **2 048 pixels**. Oito vezes menos.
</details>

---

## Exercício 09: César dentro do computador

Um programa cifra letras **maiúsculas** somando a chave ao código ASCII. Se o resultado passar de `Z` (0x5A), ele subtrai 26.

**a)** Com chave **3**, qual é o código hexa que o programa calcula para a letra **Y** **antes** de corrigir?

<details>
<summary>Ver resposta</summary>

**Resposta:** `5C`

Y = 0x59. 0x59 + 3 = **0x5C**, que passa de 0x5A (`Z`).
</details>

**b)** E depois de corrigir (subtrair 26)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `42`

0x5C = 92; 92 − 26 = 66 = **0x42**, que é a letra **B**. De fato: Y → Z → A → B.
</details>

**c)** Como fica a palavra **"XYZ"** cifrada com chave 3?

<details>
<summary>Ver resposta</summary>

**Resposta:** `ABC`

X → A, Y → B, Z → C: **"ABC"**. Todas "dão a volta" no alfabeto.
</details>
