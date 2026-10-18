# 🧩 Componentes eletrônicos · 🔴 Difícil

> [← voltar para Exercícios](../README.md) · 📖 Antes, leia: [Componentes eletrônicos](../../aulas/14-componentes-eletronicos.md) · Próximo: [Arduino Uno →](../15-arduino-uno/facil.md)

Resolva no papel primeiro. No site, digite a resposta (com a unidade, se quiser) e clique em **Conferir**; no GitHub, abra **Ver resposta**.

---

## Exercício 07: LED RGB

Um LED RGB de **cátodo comum** vai no 5 V. Cada cor deve ter **15 mA**. As tensões são: vermelho 2 V, verde 3 V e azul 3 V.

**a)** Qual é o resistor calculado para o vermelho?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 Ω`

R = (5 − 2) / 0,015 = **200 Ω**
</details>

**b)** E para o verde?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `133 Ω ± 1 Ω`

R = (5 − 3) / 0,015 ≈ **133 Ω**. O azul usa o mesmo valor, porque tem a mesma tensão.
</details>

**c)** A perna comum (a mais longa) vai no GND ou no 5 V?

<details>
<summary>Ver resposta</summary>

**Resposta:** `GND | terra`

No **cátodo comum**, os três cátodos estão juntos nessa perna: ela vai no **GND**, e cada cor recebe o + pelo seu resistor.
</details>

**d)** Com as três cores acesas ao mesmo tempo (luz branca), qual é a corrente na perna comum?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `45 mA`

As três correntes saem pela perna comum: 3 · 15 = **45 mA**.
</details>

---

## Exercício 08: Ligando um motor

Um motor pede **200 mA** de uma bateria de 9 V. Um pino do Arduino fornece no máximo 20 mA, então você vai usar um transistor NPN como chave.

**a)** Dá para ligar o motor direto no pino? Responda sim ou não.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

200 mA é 10 vezes o que o pino aguenta. O pino só dá a ordem; a corrente do motor vem da bateria, pelo transistor.
</details>

**b)** (ampliação) O transistor tem ganho 100: a corrente no coletor é 100 vezes a da base. Qual corrente de base liga o motor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2 mA`

i B = i C / 100 = 200 / 100 = **2 mA**: bem dentro do que o pino fornece.
</details>

**c)** Qual é a corrente no emissor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `202 mA`

i E = i B + i C = 2 + 200 = **202 mA**
</details>

**d)** (ampliação) O pino fornece 5 V, e entre a base e o emissor ficam 0,7 V. Qual resistor de base dá os 2 mA?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `2150 Ω`

R = (5 − 0,7) / 0,002 = 4,3 / 0,002 = **2 150 Ω**. Na prática se usa um valor **menor** (como 1 kΩ, que dá 4,3 mA): uma folga de corrente garante que o transistor conduza por completo.
</details>

---

## Exercício 09: A ponte H

Use a figura da ponte H, com as chaves S1, S2, S3 e S4.

![Ponte H com as chaves S1, S2, S3 e S4 em volta do motor](../../img/ponte-h.svg)

**a)** Com S1 fechada, qual outra chave precisa fechar para o motor girar?

<details>
<summary>Ver resposta</summary>

**Resposta:** `S4`

A corrente desce por S1, atravessa o motor da esquerda para a direita e precisa de um caminho até o GND do **outro lado**: S4. É a diagonal.
</details>

**b)** Para o motor girar ao contrário, S2 fecha junto com qual chave?

<details>
<summary>Ver resposta</summary>

**Resposta:** `S3`

A outra diagonal: a corrente desce por S2, atravessa o motor da direita para a esquerda e vai ao GND por **S3**.
</details>

**c)** O que acontece se S1 e S3 fecharem ao mesmo tempo?

<details>
<summary>Ver resposta</summary>

**Resposta:** `curto-circuito | curto circuito | curto`

S1 e S3 ficam do mesmo lado: juntas, ligam o + direto ao GND, sem passar pelo motor. É um **curto**, que queima os transistores. Nos módulos prontos, cada entrada decide se um lado do motor vai ao + ou ao GND, nunca aos dois: esse curto não acontece por engano no código.
</details>
