"""Testes do menu da trilha e do caminho no topo (_trilha.py).
Rodar: python3 -m unittest discover -s .mkdocs -p "test_*.py" """

import os
import re
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _trilha as t  # noqa: E402
from _catalogo import Exercicio, Simulado, Tema, Unidade  # noqa: E402

PASTA = "conteudo/python"


def exercicios(n):
    return [Exercicio(nivel, f"{PASTA}/exercicios/0{n}/{nivel}.md", 3, 0) for nivel in ("facil", "intermediario", "dificil")]


def tema(**mudar):
    dados = dict(
        slug="python", titulo="Python", descricao="", area="Programação", icone="codigo", nivel="Iniciante",
        src=f"{PASTA}/README.md",
        unidades=[
            Unidade("0", "Como executar Python", f"{PASTA}/aulas/00-como-executar.md", "", "Iniciante", 2),
            Unidade("1", "Condicionais", f"{PASTA}/aulas/01-condicionais.md", "", "Iniciante", 2, exercicios(1)),
            Unidade("2", "Listas & <tuplas>", f"{PASTA}/aulas/02-listas.md", "", "Intermediário", 2, exercicios(2)),
        ],
        simulados=[Simulado("Simulado 01", "simulados/python/simulado-01/README.md", "Iniciante", "1 h", 0)],
    )
    dados.update(mudar)
    return Tema(**dados)


def url(src):
    return "/" + src


def chave(src):
    return "k:" + src


def menu(src_atual, **extra):
    return t.montar_menu(tema(**extra.pop("tema", {})), src_atual, url, chave, "/conteudo/", **extra)


class MontarMenu(unittest.TestCase):
    def test_na_aula_a_unidade_e_atual_e_aberta(self):
        m = menu(f"{PASTA}/aulas/02-listas.md")
        self.assertEqual([(i.atual, i.aberta) for i in m.itens], [(False, False), (False, False), (True, True)])
        self.assertEqual([n.nivel for n in m.itens[2].niveis], ["facil", "intermediario", "dificil"])
        self.assertFalse(any(n.atual for n in m.itens[2].niveis))

    def test_no_nivel_a_unidade_fica_aberta_e_o_nivel_atual(self):
        m = menu(f"{PASTA}/exercicios/02/intermediario.md")
        listas = m.itens[2]
        self.assertEqual((listas.atual, listas.aberta), (False, True))
        self.assertEqual([n.atual for n in listas.niveis], [False, True, False])

    def test_na_resposta_vale_o_enunciado(self):
        m = menu(f"{PASTA}/exercicios/respostas/02/dificil/ex07_x.md", src_enunciado=f"{PASTA}/exercicios/02/dificil.md")
        self.assertTrue(m.itens[2].aberta)
        self.assertEqual([n.atual for n in m.itens[2].niveis], [False, False, True])

    def test_no_readme_do_tema_nada_aberto(self):
        m = menu(f"{PASTA}/README.md")
        self.assertFalse(any(i.atual or i.aberta for i in m.itens))

    def test_unidade_que_e_o_proprio_readme(self):
        intro = Unidade("0", "Introdução", f"{PASTA}/README.md", "", None, 3)
        m = menu(f"{PASTA}/README.md", tema={"unidades": [intro]})
        self.assertEqual(len(m.itens), 1)
        self.assertTrue(m.itens[0].atual)

    def test_partes_sem_exercicios(self):
        git = [Unidade("1", "Comandos", "conteudo/git/comandos.md", "", "Iniciante", 3),
               Unidade("2", "Branches", "conteudo/git/branches.md", "", "Iniciante", 3)]
        m = menu("conteudo/git/comandos.md", tema={"slug": "git", "titulo": "Git", "src": "conteudo/git/README.md",
                                                   "unidades": git, "simulados": []})
        self.assertEqual(m.rotulo, "partes")
        self.assertEqual([i.niveis for i in m.itens], [[], []])

    def test_urls_chaves_simulados_e_mais(self):
        m = menu(f"{PASTA}/exercicios/README.md", mais=[("Exercícios de Python", f"{PASTA}/exercicios/README.md")])
        self.assertEqual((m.url_tema, m.url_conteudo, m.rotulo), ("/conteudo/python/README.md", "/conteudo/", "aulas"))
        self.assertEqual(m.itens[1].chave, "k:conteudo/python/aulas/01-condicionais.md")
        self.assertEqual([(s.titulo, s.url) for s in m.simulados], [("Simulado 01", "/simulados/python/simulado-01/README.md")])
        self.assertEqual([(x.titulo, x.atual) for x in m.mais], [("Exercícios de Python", True)])


class HtmlDoMenu(unittest.TestCase):
    def html(self, src_atual, **extra):
        return t.html_do_menu(menu(src_atual, **extra))

    def test_uma_linha_e_escapado(self):
        html = self.html(f"{PASTA}/aulas/02-listas.md")
        self.assertNotIn("\n", html)
        self.assertIn("Listas &amp; &lt;tuplas&gt;", html)
        self.assertNotIn("<tuplas>", html)

    def test_aria_current_so_na_pagina_atual(self):
        html = self.html(f"{PASTA}/exercicios/02/intermediario.md")
        self.assertEqual(html.count('aria-current="page"'), 1)
        self.assertRegex(html, r'href="/conteudo/python/exercicios/02/intermediario.md"[^>]*aria-current="page"')

    def test_todo_item_e_nivel_tem_data_pagina(self):
        html = self.html(f"{PASTA}/README.md")
        self.assertEqual(html.count("data-pagina="), 3 + 6 + 1)  # unidades, níveis e o simulado
        self.assertIn('data-progresso-menu data-paginas="k:conteudo/python/aulas/00-como-executar.md '
                      'k:conteudo/python/aulas/01-condicionais.md k:conteudo/python/aulas/02-listas.md"', html)
        self.assertIn("de 3 aulas concluídas", html)
        self.assertIn('aria-valuemax="3"', html)

    def test_seta_e_niveis_escondidos_fora_da_unidade_aberta(self):
        html = self.html(f"{PASTA}/aulas/02-listas.md")
        self.assertEqual(html.count('class="trilha-lateral__abrir"'), 2)  # a unidade 0 não tem exercícios
        self.assertIn('aria-expanded="false" aria-controls="trilha-niveis-2"', html)
        self.assertIn('aria-expanded="true" aria-controls="trilha-niveis-3"', html)
        self.assertIn('id="trilha-niveis-2" hidden', html)
        self.assertRegex(html, r'id="trilha-niveis-3">')

    def test_simulados_e_mais_so_quando_existem(self):
        html = self.html(f"{PASTA}/README.md")
        self.assertIn(">Simulados<", html)
        self.assertNotIn(">Mais<", html)
        html = self.html(f"{PASTA}/README.md", tema={"simulados": []}, mais=[("Formulário", f"{PASTA}/resumos/formulario.md")])
        self.assertNotIn(">Simulados<", html)
        self.assertIn(">Mais<", html)


class Caminho(unittest.TestCase):
    def nomes(self, links):
        return [(l.titulo, l.url) for l in links]

    def setUp(self):
        self.tema = tema()
        self.listas = self.tema.unidades[2]

    def test_pagina_do_tema(self):
        links = t.caminho(self.tema, url, "/conteudo/", pagina_do_tema=True)
        self.assertEqual(self.nomes(links), [("Programação", "/conteudo/#area-programacao")])

    def test_aula(self):
        links = t.caminho(self.tema, url, "/conteudo/", unidade=self.listas)
        self.assertEqual(self.nomes(links), [("Programação", "/conteudo/#area-programacao"), ("Python", "/conteudo/python/README.md")])

    def test_exercicios(self):
        links = t.caminho(self.tema, url, "/conteudo/", unidade=self.listas, exercicio=self.listas.exercicios[0])
        self.assertEqual([l.titulo for l in links], ["Programação", "Python", "Listas & <tuplas>"])
        self.assertEqual(links[2].url, "/conteudo/python/aulas/02-listas.md")

    def test_resposta(self):
        links = t.caminho(self.tema, url, "/conteudo/", unidade=self.listas, exercicio=self.listas.exercicios[2], resposta=True)
        self.assertEqual(self.nomes(links), [
            ("Python", "/conteudo/python/README.md"), ("Listas & <tuplas>", "/conteudo/python/aulas/02-listas.md"),
            ("Difícil", "/conteudo/python/exercicios/02/dificil.md"),
        ])

    def test_html_do_caminho(self):
        html = t.html_do_caminho(t.caminho(self.tema, url, "/conteudo/", unidade=self.listas))
        self.assertEqual(html.count('<li class="md-path__item">'), 2)
        self.assertIn('<a href="/conteudo/python/README.md" class="md-path__link"><span class="md-ellipsis">Python</span></a>', html)
        self.assertNotIn("\n", html)


class Rotulos(unittest.TestCase):
    def test_rotulo_pela_pasta(self):
        self.assertEqual(t.rotulo_da_unidade(Unidade("1", "x", "conteudo/c/aulas/01.md", "", None, 1)), "Aula")
        self.assertEqual(t.rotulo_da_unidade(Unidade("1", "x", "conteudo/p/resumos/01.md", "", None, 1)), "Resumo")
        self.assertEqual(t.rotulo_da_unidade(Unidade("1", "x", "conteudo/git/x.md", "", None, 1)), "Parte")
        self.assertEqual([t.plural_do_rotulo(r) for r in ("Aula", "Resumo", "Parte")], ["aulas", "resumos", "partes"])


if __name__ == "__main__":
    unittest.main()
