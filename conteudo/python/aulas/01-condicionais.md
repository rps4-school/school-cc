# 🔀 Condicionais

> [← Como executar Python](00-como-executar-python.md) · Próximo: [Listas →](02-listas.md)

**Nível:** 🟢 Iniciante

Condicionais fazem o programa **tomar decisões**: "se isso for verdade, faça aquilo".

## `if`, `elif`, `else`

```python
nota = float(input())

if nota >= 7:
    print("Aprovado")
elif nota >= 5:            # "senão, se..."
    print("Recuperação")
else:                      # "senão"
    print("Reprovado")
```

- O Python testa **de cima para baixo** e executa **só o primeiro** bloco verdadeiro.
- `elif` e `else` são opcionais.
- O que está **dentro** do bloco precisa estar **indentado**, com 4 espaços.

## Comparações

| Operador | Significado | Exemplo | Resultado |
| -------- | ----------- | ------- | --------- |
| `==` | Igual | `3 == 3` | `True` |
| `!=` | Diferente | `3 != 4` | `True` |
| `>` `<` | Maior, menor | `5 > 2` | `True` |
| `>=` `<=` | Maior ou igual, menor ou igual | `5 <= 5` | `True` |
| `in` | Está contido em | `"a" in "casa"` | `True` |
| `not in` | Não está contido em | `3 not in (1, 2)` | `True` |

Dá para **encadear** comparações: `0 <= nota <= 10`.

## Operadores lógicos

| Operador | Verdadeiro quando... | Exemplo |
| -------- | -------------------- | ------- |
| `and` | **as duas** condições são verdadeiras | `idade >= 18 and tem_cnh` |
| `or` | **pelo menos uma** é verdadeira | `dia == "sab" or dia == "dom"` |
| `not` | a condição é **falsa** | `not chovendo` |

## If em uma linha (ternário)

```python
status = "par" if n % 2 == 0 else "ímpar"
```

## ⚠️ Erros comuns

| Erro | Certo |
| ---- | ----- |
| `if x = 5:` (atribuição) | `if x == 5:` (comparação) |
| Esquecer os `:` no fim do `if` | `if x > 0:` |
| Misturar tabs e espaços | Use sempre 4 espaços |
| `if x == 1 or 2:` (sempre verdadeiro!) | `if x == 1 or x == 2:` ou `if x in (1, 2):` |

## 📚 Referências

- [Tutorial Python: Comandos `if`](https://docs.python.org/pt-br/3/tutorial/controlflow.html#if-statements)
- [Comparações e operadores booleanos](https://docs.python.org/pt-br/3/library/stdtypes.html#boolean-operations-and-or-not)
