# 🏋️ Exercícios de Python

> [← voltar para Python](../README.md)

Exercícios para praticar **só com Python puro**: nada de `import` nem bibliotecas externas. A ideia é aprender a lógica usando os comandos que já vêm na linguagem.

## 📖 Antes de começar

Leia os resumos, na ordem:

1. [Como executar Python](../resumos/00-como-executar-python.md)
2. [Condicionais](../resumos/01-condicionais.md)
3. [Listas](../resumos/02-listas.md)
4. [Matrizes](../resumos/03-matrizes.md)

## 📝 Exercícios

| Tema | 🟢 Fácil | 🟡 Intermediário | 🔴 Difícil |
| ---- | -------- | ---------------- | ---------- |
| **Condicionais** | [01 a 03](enunciados/01-condicionais/facil.md) | [04 a 06](enunciados/01-condicionais/intermediario.md) | [07 a 09](enunciados/01-condicionais/dificil.md) |
| **Listas** | [01 a 03](enunciados/02-listas/facil.md) | [04 a 06](enunciados/02-listas/intermediario.md) | [07 a 09](enunciados/02-listas/dificil.md) |
| **Matrizes** | [01 a 03](enunciados/03-matrizes/facil.md) | [04 a 06](enunciados/03-matrizes/intermediario.md) | [07 a 09](enunciados/03-matrizes/dificil.md) |

## 🗂️ Como está organizado

```
exercicios/
├── enunciados/          ← as questões (.md)
│   ├── 01-condicionais/
│   │   ├── facil.md
│   │   ├── intermediario.md
│   │   └── dificil.md
│   ├── 02-listas/
│   └── 03-matrizes/
└── respostas/           ← as resoluções comentadas (.py)
    ├── 01-condicionais/
    │   ├── facil/
    │   ├── intermediario/
    │   └── dificil/
    ├── 02-listas/
    └── 03-matrizes/
```

## ✅ Como praticar

1. Leia o enunciado e os exemplos de **entrada** e **saída**.
2. Crie o seu arquivo **fora** da pasta `respostas/`, por exemplo `~/estudos/ex01.py`.
3. Rode e digite a entrada do exemplo:

   ```bash
   python3 ex01.py
   ```

   Ou passe a entrada direto, sem digitar:

   ```bash
   echo "4" | python3 ex01.py
   printf "3\n8\n" | python3 ex02.py    # \n separa as linhas
   ```

4. Compare a sua saída com a do exemplo. Precisa ser **idêntica**, inclusive maiúsculas e acentos.
5. Só depois abra a resposta. Se a sua ficou diferente mas funciona, **tudo bem**: existe mais de um jeito certo.

> 💡 **Travou?** Leia a 💡 **Dica** do exercício, releia o resumo do tema ou cole o seu código no [Python Tutor](https://pythontutor.com/python-compiler.html#mode=edit) para ver o que acontece linha por linha.

## 🧱 Regras

- ✅ Pode usar: `input`, `print`, `int`, `float`, `str`, `len`, `sum`, `max`, `min`, `range`, `enumerate`, `sorted`, `zip`, `any`, métodos de lista e de texto, e list comprehension.
- ⛔ Não pode: `import` de qualquer coisa.
- ⛔ Alguns exercícios proíbem funções específicas, e o enunciado avisa quando isso acontece.

## 🤝 Quer adicionar exercícios?

Siga o mesmo formato: enunciado em `enunciados/<tema>/<nivel>.md`, com pelo menos um exemplo de entrada e saída em blocos ` ```text `, e resposta em `respostas/<tema>/<nivel>/exNN_nome.py`. Veja o [Guia de Contribuição](../../../CONTRIBUTING.md).
