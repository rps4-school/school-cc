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


class InclusaoDosGerados(unittest.TestCase):
    def test_respostas_de_conteudo_ficam_fora_do_menu(self):
        for src in ("conteudo/python/exercicios/respostas/index.md",
                    "conteudo/python/exercicios/respostas/06-funcoes/facil/ex01_area.md"):
            self.assertEqual(hooks._inclusao_do_gerado(src), InclusionLevel.NOT_IN_NAV, src)

    def test_o_resto_fica_no_menu(self):
        for src in ("conteudo/python/exercicios/enunciados/index.md", "simulados/python/simulado-01/respostas/q1_x.md",
                    "conteudo/python/aulas/index.md"):
            self.assertEqual(hooks._inclusao_do_gerado(src), InclusionLevel.INCLUDED, src)


if __name__ == "__main__":
    unittest.main()
