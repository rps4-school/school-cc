# 🐍 Como executar Python

> [← voltar para Python](../README.md) · Próximo: [Condicionais →](01-condicionais.md)

**Nível:** 🟢 Iniciante

Como instalar o Python, rodar os seus programas e ler o que o usuário digita.

## Instalar e conferir

```bash
python3 --version    # precisa ser 3.6 ou mais novo
```

Se não estiver instalado, baixe em <https://www.python.org/downloads/>. No Windows, marque **"Add Python to PATH"** durante a instalação e use `python` no lugar de `python3`.

## 3 jeitos de rodar código

| Jeito | Comando | Quando usar |
| ----- | ------- | ----------- |
| **Modo interativo** (REPL) | `python3` | Testar uma linha rápida. Saia com `exit()`. |
| **Arquivo** | `python3 meu_arquivo.py` | Programas e exercícios |
| **Arquivo com entrada pronta** | `python3 meu_arquivo.py < entrada.txt` | Não precisar digitar a entrada toda vez |

Também dá para passar a entrada pelo `echo`:

```bash
echo "4" | python3 ex01_par_ou_impar.py
printf "3\n8\n" | python3 ex02_maior_de_dois.py   # \n = nova linha
```

## Entrada e saída

| Comando | O que faz | Exemplo |
| ------- | --------- | ------- |
| `input()` | Lê **uma linha** digitada. Sempre devolve **texto** (`str`). | `nome = input()` |
| `print()` | Mostra algo na tela | `print("Olá", nome)` |
| `int()` | Converte para número inteiro | `idade = int(input())` |
| `float()` | Converte para número com vírgula | `nota = float(input())` |
| `str()` | Converte para texto | `str(10)` → `"10"` |

> ⚠️ `input()` **sempre** devolve texto: `"2" + "3"` dá `"23"`, e não `5`. Converta com `int()` ou `float()` antes de fazer contas.

## Formatando a saída com f-string

Coloque um `f` antes das aspas e as variáveis entre `{}`:

```python
nome = "Ana"
media = 7.456
print(f"{nome} tirou {media:.2f}")   # Ana tirou 7.46
```

`:.2f` significa "com 2 casas decimais".

## Operadores

| Operador | Significado | Exemplo | Resultado |
| -------- | ----------- | ------- | --------- |
| `+ - *` | Soma, subtração, multiplicação | `2 * 3` | `6` |
| `/` | Divisão (sempre dá `float`) | `7 / 2` | `3.5` |
| `//` | Divisão inteira | `7 // 2` | `3` |
| `%` | Resto da divisão | `7 % 2` | `1` |
| `**` | Potência | `2 ** 3` | `8` |

## Pedindo ajuda ao próprio Python

| Comando | O que faz |
| ------- | --------- |
| `type(x)` | Mostra o tipo de `x` (`int`, `str`, `list`...) |
| `help(print)` | Mostra a documentação de um comando |
| `dir(list)` | Lista tudo o que dá para fazer com uma lista |

## 📚 Referências

- [Tutorial oficial do Python (em português)](https://docs.python.org/pt-br/3/tutorial/index.html)
- [Funções embutidas (built-in)](https://docs.python.org/pt-br/3/library/functions.html)
- [Python Tutor: veja seu código rodando passo a passo](https://pythontutor.com/python-compiler.html#mode=edit)
