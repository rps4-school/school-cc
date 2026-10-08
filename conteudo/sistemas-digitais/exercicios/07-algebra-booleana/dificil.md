# 🔀 Álgebra booleana · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Álgebra booleana](../../aulas/07-algebra-booleana.md) · Próximo: [Circuitos combinacionais →](../08-circuitos/facil.md)

Resolva no papel primeiro. No site, digite a resposta e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: Meio-somador

Um meio-somador soma dois bits A e B. Ele tem duas saídas: **S** (soma) = A ⊕ B e **V** (vai um) = A · B.

**a)** Com A = 1 e B = 1, quais são **V** e **S**? Responda os dois bits juntos, primeiro V e depois S.

<details>
<summary>Ver resposta</summary>

**Resposta:** `10`

V = 1 · 1 = **1** e S = 1 ⊕ 1 = **0**. Juntos: **10**, que é exatamente 1 + 1 = 10₂ em binário.
</details>

**b)** Com A = 1 e B = 0, quais são V e S (V primeiro)?

<details>
<summary>Ver resposta</summary>

**Resposta:** `01`

V = 1 · 0 = **0** e S = 1 ⊕ 0 = **1**: **01**, ou seja, 1 + 0 = 1.
</details>

---

## Exercício 08: Interruptor de escada

A luz de uma escada tem um interruptor embaixo (**A**) e outro em cima (**B**). Ela fica **acesa** quando os interruptores estão em posições **diferentes**. Escreva a expressão da luz.

<details>
<summary>Ver resposta</summary>

**Expressão:** `A ⊕ B`

| A | B | **Luz** |
| - | - | ------- |
| 0 | 0 | **0** |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | **0** |

É a tabela da **XOR**: **A ⊕ B**. Sem o símbolo ⊕, a mesma coisa se escreve **A'B + AB'** (o corretor aceita as duas).
</details>

---

## Exercício 09: Login seguro

Um sistema libera o acesso quando a pessoa digita a **senha certa (S)** **e** confirma com a **biometria (B)** **ou** com um **token (T)**. Mas, se a conta estiver **suspensa (X)**, o acesso é sempre negado. Escreva a expressão do acesso.

<details>
<summary>Ver resposta</summary>

**Expressão:** `S(B + T)X'`

| Pedaço | Expressão |
| ------ | --------- |
| biometria ou token | B + T |
| senha **e** (biometria ou token) | S(B + T) |
| e a conta **não** suspensa | **S(B + T)X'** |

Também vale escrever **SBX' + STX'** (é a mesma coisa, distribuindo o S e o X').
</details>
