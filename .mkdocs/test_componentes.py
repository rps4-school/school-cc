"""Testes dos componentes do portal (contratos data-* que o portal.js lê).
Rodar: python3 -m unittest discover -s .mkdocs -p "test_*.py" """

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _componentes as c  # noqa: E402
from _catalogo import Tema  # noqa: E402


def tema(**mudar):
    dados = dict(slug="calculo", titulo="Cálculo", descricao="Funções e `limites` <b>", area="Matemática",
                 icone="integral", nivel="Iniciante", src="conteudo/calculo/README.md")
    dados.update(mudar)
    return Tema(**dados)


class Componentes(unittest.TestCase):
    def test_html_em_uma_linha(self):
        for html in (c.barra("x"), c.cartao_tema(tema(), "calculo/", ["a/", "b/"], "10 aulas"), c.bloco_continuar("conteudo/"),
                     c.cabecalho_tema(tema(), "10 aulas", "aulas/01/", ["a/"]), c.fim_de_pagina("a/", "Concluir")):
            self.assertNotIn("\n", html)

    def test_area_vira_slug_e_area_desconhecida_vira_outros(self):
        self.assertEqual(c.area_slug("Engenharia de Software"), "engenharia-de-software")
        self.assertEqual(c.area_slug("Matemática"), "matematica")
        self.assertEqual(c.area_slug("Astronomia"), "outros")

    def test_inline_escapa_html_e_entende_codigo_e_negrito(self):
        self.assertEqual(c.inline("A **base** `0x` <b>"), "A <strong>base</strong> <code>0x</code> &lt;b&gt;")

    def test_barra_acessivel(self):
        html = c.barra("Progresso em Cálculo")
        for trecho in ('role="progressbar"', 'aria-label="Progresso em Cálculo"', 'aria-valuenow="0"'):
            self.assertIn(trecho, html)

    def test_cartao_tema_tem_o_contrato_do_portal(self):
        html = c.cartao_tema(tema(), "calculo/", ["conteudo/calculo/aulas/01/", "conteudo/calculo/x/"], "10 aulas · 90 exercícios")
        self.assertIn('data-progresso-tema="calculo"', html)
        self.assertIn('data-paginas="conteudo/calculo/aulas/01/ conteudo/calculo/x/"', html)
        self.assertIn('data-area="matematica"', html)
        self.assertIn("data-so-com-progresso", html)
        self.assertIn("<code>limites</code> &lt;b&gt;", html)
        self.assertIn('href="calculo/"', html)

    def test_continuar_tem_os_dois_estados(self):
        html = c.bloco_continuar("conteudo/")
        self.assertIn('data-estado="vazio"', html)
        self.assertIn('data-estado="progresso" hidden', html)
        for alvo in ("data-continuar-link", "data-continuar-titulo", "data-continuar-tema"):
            self.assertIn(alvo, html)

    def test_item_da_trilha(self):
        html = c.item_trilha("4", "Derivada", "aulas/04/", "conteudo/calculo/aulas/04/", "Taxa `dy`", "Intermediário", 12,
                             [("facil", "ex/facil/", "conteudo/calculo/ex/facil/", 9)], "Aula")
        self.assertIn('data-unidade data-pagina="conteudo/calculo/aulas/04/" data-titulo="Aula 4 · Derivada"', html)
        self.assertIn('data-pagina="conteudo/calculo/ex/facil/" data-perguntas="9"', html)
        self.assertIn("data-acertos", html)
        self.assertIn("<code>dy</code>", html)

    def test_fim_de_pagina_e_marcador(self):
        html = c.fim_de_pagina("conteudo/a/", "Marcar aula como concluída",
                               pratique=[("facil", "f/", "conteudo/f/", 3)], proximo=("Próxima aula", "Limites", "l/"))
        self.assertIn('data-concluir="conteudo/a/" aria-pressed="false"', html)
        self.assertIn('data-pagina="conteudo/f/" data-perguntas="3"', html)
        self.assertIn('href="l/"', html)
        self.assertEqual(c.marcador_de_visita("calculo", 'Aula 4 · "x"'),
                         '<div hidden data-visita data-tema="calculo" data-titulo="Aula 4 · &quot;x&quot;"></div>')


if __name__ == "__main__":
    unittest.main()
