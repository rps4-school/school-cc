"""Testes do hook de estrutura (hooks.py). Rodar: python3 -m unittest discover -s .mkdocs -p "test_*.py" """

import importlib.metadata
import os
import sys
import unittest
from types import SimpleNamespace

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hooks  # noqa: E402
from mkdocs.structure.files import InclusionLevel  # noqa: E402
from mkdocs.structure.nav import Section  # noqa: E402

# Os dois templates de overrides/partials/ (nav.html e path.html) saíram desta versão do Material.
VERSAO_DOS_TEMPLATES = "9.7.7"


def pagina(src):
    return SimpleNamespace(file=SimpleNamespace(src_uri=src), children=None, parent=None, title=None)


def secao(titulo, filhos):
    s = Section(titulo, filhos)
    for f in filhos:
        f.parent = s
    return s


def srcs(itens):
    return [getattr(i, "file", None) and i.file.src_uri or i.title for i in itens]


class TravaDeVersao(unittest.TestCase):
    def test_material_na_versao_dos_templates_sobrescritos(self):
        self.assertEqual(
            importlib.metadata.version("mkdocs-material"), VERSAO_DOS_TEMPLATES,
            "O Material mudou de versão: compare .mkdocs/overrides/partials/nav.html e path.html com os da versão nova "
            "(material/templates/partials/) e atualize VERSAO_DOS_TEMPLATES.",
        )


class LimparTema(unittest.TestCase):
    def setUp(self):
        p = "conteudo/python"
        self.enunciados = secao("Enunciados", [
            pagina(f"{p}/exercicios/enunciados/index.md"),
            secao("Condicionais", [pagina(f"{p}/exercicios/enunciados/01-condicionais/facil.md")]),
            secao("Listas", [pagina(f"{p}/exercicios/enunciados/02-listas/facil.md")]),
        ])
        self.exercicios = secao("Exercícios de Python", [pagina(f"{p}/exercicios/README.md"), self.enunciados])
        self.aulas = secao("Aulas", [pagina(f"{p}/aulas/00-como-executar.md"), pagina(f"{p}/aulas/01-condicionais.md")])
        self.materiais = secao("Materiais", [pagina(f"{p}/materiais/slides.md")])
        self.tema = secao("Python", [self.exercicios, self.materiais, pagina(f"{p}/README.md"), self.aulas])

    def test_ordem_readme_aulas_exercicios_e_o_resto(self):
        hooks._limpar_tema(self.tema)
        self.assertEqual(srcs(self.tema.children), ["conteudo/python/README.md", "Aulas", "Exercícios de Python", "Materiais"])

    def test_enunciados_some_e_os_assuntos_sobem(self):
        hooks._limpar_tema(self.tema)
        self.assertEqual(srcs(self.exercicios.children), ["conteudo/python/exercicios/README.md", "Condicionais", "Listas"])
        self.assertTrue(all(f.parent is self.exercicios for f in self.exercicios.children))

    def test_resumos_antes_de_exercicios(self):
        resumos = secao("Resumos", [pagina("conteudo/calculo/resumos/formulario.md")])
        aulas = secao("Aulas", [pagina("conteudo/calculo/aulas/01.md")])
        exercicios = secao("Exercícios", [pagina("conteudo/calculo/exercicios/01/facil.md")])
        tema = secao("Cálculo", [exercicios, resumos, pagina("conteudo/calculo/README.md"), aulas])
        hooks._limpar_tema(tema)
        self.assertEqual(srcs(tema.children), ["conteudo/calculo/README.md", "Aulas", "Resumos", "Exercícios"])


class AgruparPorArea(unittest.TestCase):
    def test_pagina_da_area_vira_o_indice_da_secao(self):
        import tempfile
        with tempfile.TemporaryDirectory() as raiz:
            os.makedirs(os.path.join(raiz, "conteudo", "python"))
            os.makedirs(os.path.join(raiz, "conteudo", "git"))
            with open(os.path.join(raiz, "conteudo", "README.md"), "w", encoding="utf-8") as f:
                f.write("| Tema | O que tem |\n| --- | --- |\n| [**Python**](python/README.md) | x |\n| [**Git**](git/README.md) | y |\n")
            python = secao("Python", [pagina("conteudo/python/README.md")])
            git = secao("Git", [pagina("conteudo/git/README.md")])
            indice = pagina("conteudo/programacao/index.md")
            area_gerada = secao("Programacao", [indice])
            conteudo = secao("Conteúdo", [pagina("conteudo/README.md"), git, area_gerada, python])
            hooks._agrupar_por_area(conteudo, raiz, hooks._pasta_da_secao)
            self.assertEqual(srcs(conteudo.children), ["conteudo/README.md", "Programação"])
            programacao = conteudo.children[1]
            self.assertEqual(srcs(programacao.children), ["conteudo/programacao/index.md", "Python", "Git"])
            self.assertIs(indice.parent, programacao)


class InclusaoDosGerados(unittest.TestCase):
    def test_respostas_de_conteudo_ficam_fora_do_menu(self):
        for src in ("conteudo/python/exercicios/respostas/index.md",
                    "conteudo/python/exercicios/respostas/06-funcoes/facil/ex01_area.md"):
            self.assertEqual(hooks._inclusao_do_gerado(src), InclusionLevel.NOT_IN_NAV, src)

    def test_o_resto_fica_no_menu(self):
        for src in ("conteudo/python/exercicios/enunciados/index.md", "simulados/python/simulado-01/respostas/q1_x.md",
                    "conteudo/python/aulas/index.md"):
            self.assertEqual(hooks._inclusao_do_gerado(src), InclusionLevel.INCLUDED, src)


class PaginaDaResposta(unittest.TestCase):
    PY = "conteudo/python/exercicios/respostas/06-funcoes/facil/ex01_area_e_perimetro.py"
    ENUNCIADO = ("conteudo/python/exercicios/enunciados/06-funcoes/facil.md", "exercício-01-área-e-perímetro",
                 "Exercício 01: Área e perímetro")

    def test_resposta_de_exercicio(self):
        md = hooks._pagina_do_py(self.PY, "print(1)\n", self.ENUNCIADO)
        # O sobretítulo vai no front matter (o visual.py o põe no HTML depois da busca indexar a página).
        self.assertTrue(md.startswith(
            '---\ntitle: "Resposta: Área e perímetro"\n'
            'resposta_de: "conteudo/python/exercicios/enunciados/06-funcoes/facil.md"\n'
            'sobretitulo: "Resposta · Exercício 01"\n---\n\n# Área e perímetro\n'), md[:300])
        self.assertNotIn('class="sobretitulo"', md)
        self.assertIn("[← Voltar ao enunciado](../../../enunciados/06-funcoes/facil.md#exercício-01-área-e-perímetro){ .md-button }", md)
        self.assertIn("[⤓ Baixar .py](ex01_area_e_perimetro.py){ .md-button .md-button--primary download }", md)
        self.assertIn('````python title="ex01_area_e_perimetro.py" linenums="1"\nprint(1)\n````', md)
        self.assertIn("Para rodar no terminal: `python3 ex01_area_e_perimetro.py`", md)

    def test_questao_de_simulado_fica_como_hoje(self):
        md = hooks._pagina_do_py("simulados/python/simulado-01/respostas/q1_x.py", "x = 1\n",
                                 ("simulados/python/simulado-01/README.md", "questão-01", "Questão 01 · Listas · 2 pontos"))
        self.assertTrue(md.startswith("# q1_x.py\n"))
        self.assertIn("[← Ver enunciado](../README.md#questão-01){ .md-button }", md)

    def test_sem_enunciado_fica_como_hoje(self):
        md = hooks._pagina_do_py("conteudo/x/y.py", "x\n", None)
        self.assertTrue(md.startswith("# y.py\n"))
        self.assertNotIn("enunciado", md)


class Redirecionamentos(unittest.TestCase):
    def test_redireciona_cada_pagina_do_prefixo_novo(self):
        urls = ["conteudo/python/aulas/", "conteudo/python/aulas/02-listas/", "conteudo/python/"]
        self.assertEqual(hooks._redirecionamentos(urls, {"conteudo/python/resumos/": "conteudo/python/aulas/"}), [
            ("conteudo/python/resumos/", "../aulas/"),
            ("conteudo/python/resumos/02-listas/", "../../aulas/02-listas/"),
        ])

    def test_nao_sobrescreve_pagina_que_existe(self):
        self.assertEqual(hooks._redirecionamentos(["a/novo/x/", "a/velho/x/"], {"a/velho/": "a/novo/"}), [])

    def test_sem_pagina_no_prefixo_novo_nao_redireciona(self):
        self.assertEqual(hooks._redirecionamentos(["a/velho/x/"], {"a/velho/": "a/novo/"}), [])

    def test_pagina_de_redirecionamento(self):
        html = hooks._pagina_de_redirecionamento("../../aulas/02-listas/")
        for trecho in ('http-equiv="refresh" content="0; url=../../aulas/02-listas/"', 'rel="canonical" href="../../aulas/02-listas/"',
                       'name="robots" content="noindex"', '<a href="../../aulas/02-listas/">', "location.hash", 'lang="pt-BR"'):
            self.assertIn(trecho, html)

    def test_lista_do_repositorio(self):
        self.assertEqual(hooks.REDIRECIONAMENTOS, {"conteudo/python/resumos/": "conteudo/python/aulas/"})


if __name__ == "__main__":
    unittest.main()
