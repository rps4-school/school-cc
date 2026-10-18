# 📝 Simulado 05 · Sistemas Digitais (eletrônica básica)

> [← voltar para Simulados](../../README.md)

**Nível:** 🟡 Intermediário

**Duração sugerida:** 1h · **Pontuação:** 100 pontos · **Assuntos:** eletrônica básica (aulas 10 a 14)

> ⚠️ **Regras da prova:**
>
> - Individual e **sem consulta**: nada de internet, anotações, calculadora ou IA. As contas foram feitas para sair à mão.
> - A única consulta permitida é a **tabela de cores** do resistor (está na [aula de componentes](../../../conteudo/sistemas-digitais/aulas/14-componentes-eletronicos.md)).
> - **Mostre as contas** no papel: resposta sem desenvolvimento vale metade.
> - Cada questão vale **10 pontos**. Os itens de uma questão valem partes iguais.
> - Só confira as respostas depois que o tempo acabar.

> 💡 **Corrigindo no site:** cada item tem um campo para digitar a sua resposta e conferir na hora. A unidade é opcional e qualquer prefixo vale (`3 mA` ou `0,003 A`). Use só na correção, depois do tempo.

---

## Questão 01 · Circuito elétrico · 10 pontos

**O carrinho parou.** Um carrinho de controle remoto funciona com 4 pilhas AA. Um dia, ele para de andar.

**a)** Abrindo o carrinho, você acha um fio partido entre as pilhas e o motor. Com o fio partido, o circuito está aberto ou fechado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `aberto`

O fio partido interrompe o caminho: sem caminho completo, não há corrente.
</details>

**b)** As pilhas fornecem corrente contínua ou alternada?

<details>
<summary>Ver resposta</summary>

**Resposta:** `contínua | corrente contínua | CC | DC`

Pilhas têm + e − fixos: a corrente vai sempre no mesmo sentido.
</details>

**c)** Qual é a tensão das 4 pilhas em série?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `6 V`

4 × 1,5 = **6 V**
</details>

---

## Questão 02 · Prefixos · 10 pontos

**Lendo a etiqueta.** Escreva **só o número**, na unidade pedida.

**a)** O motor do carrinho puxa 350 mA. Quanto é isso em ampere?

<details>
<summary>Ver resposta</summary>

**Número:** `0,35`

350 ÷ 1 000 = **0,35 A**
</details>

**b)** Um sensor consome 0,0025 A. Quanto é isso em mA?

<details>
<summary>Ver resposta</summary>

**Número:** `2,5`

0,0025 × 1 000 = **2,5 mA**
</details>

**c)** Um resistor tem 6,8 kΩ. Quanto é isso em ohms?

<details>
<summary>Ver resposta</summary>

**Número:** `6800`

6,8 × 1 000 = **6 800 Ω**
</details>

---

## Questão 03 · Lei de Ohm · 10 pontos

**a)** Uma fonte de 12 V está ligada a um resistor de 4 kΩ. Qual é a corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 mA`

i = 12 V / 4 kΩ = **3 mA**
</details>

**b)** Passam 25 mA por um resistor de 200 Ω. Qual é a tensão nele?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `5 V`

U = 200 · 0,025 = **5 V**
</details>

**c)** Com 9 V, um resistor deixa passar 45 mA. Qual é a resistência?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 Ω`

R = 9 / 0,045 = **200 Ω**
</details>

---

## Questão 04 · Resistor do LED · 10 pontos

**Faróis do carrinho.** Um LED amarelo (2 V, 20 mA) vai ser ligado nas 4 pilhas do carrinho (6 V).

**a)** Qual é o resistor calculado?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `200 Ω`

R = (6 − 2) / 0,02 = 4 / 0,02 = **200 Ω**
</details>

**b)** Qual valor comercial da série E12 você usaria?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `220 Ω`

200 não está na série (que tem 180 e 220): o próximo acima é **220 Ω**.
</details>

**c)** Com o resistor comercial, a corrente fica maior ou menor que 20 mA?

<details>
<summary>Ver resposta</summary>

**Resposta:** `menor`

Resistor maior, corrente menor: 4 / 220 ≈ 18 mA. É por isso que se arredonda **para cima**.
</details>

---

## Questão 05 · Série · 10 pontos

Uma fonte de 18 V alimenta R₁ = 2 kΩ e R₂ = 4 kΩ em série.

**a)** Qual é a resistência equivalente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `6 kΩ`

2 + 4 = **6 kΩ**
</details>

**b)** Qual é a corrente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 mA`

18 V / 6 kΩ = **3 mA**
</details>

**c)** Qual é a tensão em R₂?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `12 V`

U₂ = 4 kΩ · 3 mA = **12 V** (e R₁ fica com 6 V: 6 + 12 = 18 V).
</details>

---

## Questão 06 · Paralelo · 10 pontos

Uma bateria de 6 V alimenta R₁ = 12 Ω e R₂ = 6 Ω em paralelo.

**a)** Qual é a corrente em R₁?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `0,5 A`

Em paralelo, cada um fica com os 6 V: 6 / 12 = **0,5 A**.
</details>

**b)** Qual é a corrente total da bateria?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,5 A`

R₂: 6 / 6 = 1 A. Total: 0,5 + 1 = **1,5 A**.
</details>

**c)** Qual é a resistência equivalente?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4 Ω`

(12 · 6) / (12 + 6) = 72 / 18 = **4 Ω**. Conferindo: 6 / 4 = 1,5 A.
</details>

---

## Questão 07 · Divisor de tensão · 10 pontos

Um divisor em **10 V** tem R₁ = 3 kΩ em cima e R₂ = 2 kΩ ligado ao GND.

**a)** Qual é a tensão no ponto do meio?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `4 V`

U saída = 10 · 2 / (3 + 2) = 20 / 5 = **4 V**
</details>

**b)** Se R₂ for trocado por um de 3 kΩ, qual será a tensão no meio?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `5 V`

Agora são iguais: 10 · 3 / 6 = **5 V**, metade.
</details>

**c)** Mantendo R₂ = 2 kΩ, qual R₁ deixa o ponto do meio com 2 V?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `8 kΩ`

2 = 10 · 2 / (R₁ + 2) → R₁ + 2 = 10 → R₁ = **8 kΩ**.
</details>

---

## Questão 08 · Protoboard · 10 pontos

Numa protoboard com a–e na metade de cima e f–j na de baixo, diga se os furos estão ligados por dentro. Responda sim ou não.

**a)** a7 e d7.

<details>
<summary>Ver resposta</summary>

**Resposta:** `sim`

Mesma coluna, mesma metade: mesmo nó.
</details>

**b)** e7 e f7.

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

O canal central separa as metades.
</details>

**c)** Um LED foi encaixado com o ânodo em b12 e o cátodo em d12. Ele pode acender?

<details>
<summary>Ver resposta</summary>

**Resposta:** `não`

As duas pernas estão no **mesmo nó** (coluna 12, a–e): não há tensão entre elas. O LED precisa ter as pernas em colunas diferentes (ou atravessar o canal).
</details>

---

## Questão 09 · Multímetro · 10 pontos

Uma fonte de 12 V alimenta R₁ = 1 kΩ e R₂ = 3 kΩ em série.

**a)** O voltímetro é ligado nas pontas de R₁. Quanto ele mostra?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 V`

i = 12 V / 4 kΩ = 3 mA; U₁ = 1 kΩ · 3 mA = **3 V**.
</details>

**b)** O amperímetro é ligado em série. Quanto ele mostra?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `3 mA`

**3 mA**, a mesma corrente em todo o circuito.
</details>

**c)** Para medir a resistência de R₂ com o ohmímetro, o circuito deve estar ligado ou desligado?

<details>
<summary>Ver resposta</summary>

**Resposta:** `desligado`

O ohmímetro mede com a própria bateria: com o circuito ligado, a medida sai errada.
</details>

---

## Questão 10 · Componentes · 10 pontos

**a)** Qual é o valor do resistor **marrom, preto, marrom, dourado**?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `100 Ω`

Marrom (1), preto (0), marrom (× 10): 10 × 10 = **100 Ω**
</details>

**b)** Qual é a tolerância dele? Escreva só o número, em %.

<details>
<summary>Ver resposta</summary>

**Número:** `5`

Dourado = **± 5 %**
</details>

**c)** Um potenciômetro está entre 5 V e GND, com o cursor em **um quarto** do curso (a partir do GND). Qual é a tensão no cursor?

<details>
<summary>Ver resposta</summary>

**Grandeza:** `1,25 V`

Um quarto de 5 V: 5 / 4 = **1,25 V**.
</details>

**d)** Para ligar o motor de 350 mA do carrinho num pino do Arduino (que aguenta 20 mA), que componente faz o papel de chave? Responda com uma palavra.

<details>
<summary>Ver resposta</summary>

**Resposta:** `transistor`

O **transistor**: a corrente pequena do pino na base controla a corrente grande do motor no coletor.
</details>
