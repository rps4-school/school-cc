"""Testes do hook de apresentação. Rodar: python3 -m unittest discover -s .mkdocs -p "test_*.py" """

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import visual  # noqa: E402


class Corretores(unittest.TestCase):
    def caixas(self, markdown):
        return [l for l in visual._corretores(markdown).split("\n") if l.startswith('<div class="corretor"')]

    def test_rotulo_tem_a_secao_e_a_letra_e_a_ancora_do_titulo(self):
        md = (
            "## Exercício 01: Robô na esteira { #exercício-01-robô-na-esteira }\n\n"
            "**a)** Qual é a média?\n\n<details>\n\n**Número:** `9`\n</details>\n\n"
            "**b)** E agora?\n\n<details>\n\n**Número:** `5,2`\n</details>\n"
        )
        a, b = self.caixas(md)
        self.assertIn('data-rotulo="Exercício 01: Robô na esteira · a)"', a)
        self.assertIn('data-rotulo="Exercício 01: Robô na esteira · b)"', b)
        self.assertIn('data-ancora="exercício-01-robô-na-esteira"', b)
        self.assertIn('data-resposta="5,2"', b)

    def test_teste_rapido_numerado_e_titulo_sem_ancora_explicita(self):
        md = "## Teste rápido\n\n**2.** Derive.\n\n<details>\n\n**Função:** `10x`\n</details>\n"
        (caixa,) = self.caixas(md)
        self.assertIn('data-rotulo="Teste rápido · 2."', caixa)
        self.assertIn('data-ancora="teste-rápido"', caixa)

    def test_marca_de_outra_secao_nao_vaza(self):
        md = "## A\n\n**a)** x\n\n## B\n\n<details>\n\n**Resposta:** `sim`\n</details>\n"
        (caixa,) = self.caixas(md)
        self.assertIn('data-rotulo="B"', caixa)

    def test_rotulo_escapa_aspas_e_tira_formula(self):
        md = '## Questão 3 · "Limite" de $x^2$\n\n<details>\n\n**Número:** `4`\n</details>\n'
        (caixa,) = self.caixas(md)
        self.assertIn('data-rotulo="Questão 3 · &quot;Limite&quot; de x^2"', caixa)


class NavegacaoManual(unittest.TestCase):
    def tirar(self, linha):
        return visual._sem_navegacao_manual(["# T", "", linha, "", "Texto"])[2]

    def test_ultima_aula_com_voltar_sem_seta_some(self):
        self.assertEqual(self.tirar("> [← Dicionários](05-dicionarios.md) · [Voltar para Python](../README.md)"), "")

    def test_voltar_com_seta_some(self):
        self.assertEqual(self.tirar("> [← Primitivas](09-primitivas.md) · [Voltar para Cálculo →](../README.md)"), "")

    def test_antes_leia_some(self):
        linha = ("> [← voltar para Exercícios](../../README.md) · 📖 Antes, leia: [Listas](../../../resumos/02-listas.md)"
                 " · Próximo: [Intermediário →](intermediario.md)")
        self.assertEqual(self.tirar(linha), "")

    def test_citacao_comum_fica(self):
        linha = "> 💡 Dica: use [o tutor](https://pythontutor.com)."
        self.assertEqual(self.tirar(linha), linha)


if __name__ == "__main__":
    unittest.main()
