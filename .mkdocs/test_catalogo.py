"""Testes do catálogo do portal. Rodar: python3 -m unittest discover -s .mkdocs -p "test_*.py" """

import os
import re
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _catalogo as c  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Linhas das tabelas-índice: "| [**Cálculo**](calculo/README.md) |" e "| [**Simulado 01**](calculo/simulado-01/README.md) |".
INDICE_TEMA = re.compile(r"^\| \[\*\*[^\]]+\*\*\]\(([\w-]+)/README\.md\)", re.M)
INDICE_SIMULADO = re.compile(r"^\| \[\*\*[^\]]+\*\*\]\(([\w-]+)/([\w-]+)/README\.md\)", re.M)


def ler(caminho):
    with open(os.path.join(RAIZ, caminho), encoding="utf-8") as f:
        return f.read()


class RepositorioReal(unittest.TestCase):
    """O conteúdo de verdade. Só invariantes: os testes continuam valendo quando alguém acrescenta aula,
    exercício, simulado ou tema (números exatos ficam nos casos de borda, com conteúdo de mentira)."""

    @classmethod
    def setUpClass(cls):
        cls.lista = c.montar(RAIZ)
        cls.temas = {t.slug: t for t in cls.lista}

    def test_todo_tema_do_indice_esta_no_catalogo_na_mesma_ordem(self):
        self.assertEqual([t.slug for t in self.lista], INDICE_TEMA.findall(ler("conteudo/README.md")))

    def test_area_e_icone(self):
        self.assertEqual((self.temas["calculo"].area, self.temas["calculo"].icone), ("Matemática", "integral"))
        self.assertEqual((self.temas["python"].area, self.temas["git"].area), ("Programação", "Programação"))

    def test_temas_do_indice(self):
        self.assertEqual(c.temas_do_indice(RAIZ), INDICE_TEMA.findall(ler("conteudo/README.md")))

    def test_trilha_de_calculo(self):
        t = self.temas["calculo"]
        self.assertGreaterEqual(len(t.unidades), 10)
        u = t.unidades[3]
        self.assertEqual((u.numero, u.titulo, u.src), ("4", "Derivada", "conteudo/calculo/aulas/04-derivada.md"))
        self.assertEqual(u.nivel, "Intermediário")
        self.assertTrue(u.descricao.startswith("Taxa de variação"))
        self.assertEqual([e.nivel for e in u.exercicios], ["facil", "intermediario", "dificil"])
        self.assertEqual(u.exercicios[0].src, "conteudo/calculo/exercicios/04-derivada/facil.md")
        self.assertGreater(u.exercicios[0].perguntas, 0)
        self.assertGreater(u.minutos, 1)

    def test_python_unidade_zero_sem_exercicios(self):
        u = self.temas["python"].unidades[0]
        self.assertEqual((u.numero, u.exercicios), ("0", []))
        self.assertEqual(self.temas["python"].unidades[1].exercicios[0].perguntas, 0)  # Python não tem corretor

    def test_git_este_arquivo_vira_introducao(self):
        u = self.temas["git"].unidades[0]
        self.assertEqual((u.titulo, u.src), ("Introdução", "conteudo/git/README.md"))

    def test_introducao_e_a_primeira_frase_do_readme(self):
        self.assertEqual(self.temas["sistemas-digitais"].introducao,
                         "Como o computador guarda números, letras e cores usando só 0 e 1, e como ele faz contas e toma "
                         "decisões com portas lógicas.")
        self.assertTrue(self.temas["python"].introducao.startswith("Lógica de programação com Python puro"))
        self.assertTrue(self.temas["git"].introducao.startswith("O Git é um sistema de controle de versão"))
        for t in self.lista:
            self.assertNotRegex(t.introducao, r"[*`\[\]]", t.slug)  # sem markdown

    def test_contagens_batem_com_os_arquivos(self):
        for t in self.lista:
            for u in t.unidades:
                for e in u.exercicios:
                    self.assertEqual(e.exercicios, ler(e.src).count("\n## Exercício"), e.src)

    def test_todo_simulado_do_indice_esta_no_seu_tema(self):
        for slug, pasta in INDICE_SIMULADO.findall(ler("simulados/README.md")):
            src = f"simulados/{slug}/{pasta}/README.md"
            self.assertIn(src, [s.src for s in self.temas[slug].simulados])
        s = self.temas["calculo"].simulados[0]
        self.assertEqual((s.titulo, s.src, s.duracao), ("Simulado 01", "simulados/calculo/simulado-01/README.md", "1h"))
        self.assertGreater(s.perguntas, 0)
        self.assertTrue(all(s.perguntas == 0 for s in self.temas["python"].simulados))  # Python: editor, sem corretor

    def test_totais_batem_com_os_arquivos(self):
        t = c.totais(self.lista)
        self.assertEqual(t["temas"], len(INDICE_TEMA.findall(ler("conteudo/README.md"))))
        exercicios = sum(ler(e.src).count("\n## Exercício") for x in self.lista for u in x.unidades for e in u.exercicios)
        self.assertEqual(t["exercicios"], exercicios)
        self.assertEqual(t["simulados"], len(INDICE_SIMULADO.findall(ler("simulados/README.md"))))

    def test_lugares(self):
        lugares = c.lugares(self.lista)
        ex = lugares["conteudo/calculo/exercicios/04-derivada/facil.md"]
        self.assertEqual((ex.tema.slug, ex.unidade.numero, ex.exercicio.nivel), ("calculo", "4", "facil"))
        self.assertEqual(lugares["simulados/calculo/simulado-02/README.md"].simulado.titulo, "Simulado 02")


class CasosDeBorda(unittest.TestCase):
    def repo(self, arquivos):
        raiz = tempfile.mkdtemp()
        for caminho, texto in arquivos.items():
            os.makedirs(os.path.dirname(os.path.join(raiz, caminho)), exist_ok=True)
            with open(os.path.join(raiz, caminho), "wb") as f:
                f.write(texto if isinstance(texto, bytes) else texto.encode("utf-8"))
        return raiz

    INDICE = "| Tema | O que tem |\n| - | - |\n| [**Redes**](redes/README.md) | Camadas e protocolos |\n"

    def test_tema_sem_tabela_e_fora_do_TEMAS(self):
        raiz = self.repo({"conteudo/README.md": self.INDICE, "conteudo/redes/README.md": "# Redes\n\nTexto.\n"})
        (t,) = c.montar(raiz)
        self.assertEqual((t.slug, t.area, t.icone, t.unidades), ("redes", "Outros", "pasta", []))

    def test_coluna_nova_link_quebrado_e_linha_sem_exercicios(self):
        tabela = (
            "| # | Aula | Extra | Nível | Exercícios |\n| - | - | - | - | - |\n"
            "| 1 | [Camadas](aulas/01-camadas.md) | x | 🟢 Iniciante | [🟢](exercicios/01/facil.md) |\n"
            "| 2 | [Sumiu](aulas/02-sumiu.md) | x | 🟡 Intermediário | — |\n"
        )
        raiz = self.repo({
            "conteudo/README.md": self.INDICE,
            "conteudo/redes/README.md": "# Redes\n\n" + tabela,
            "conteudo/redes/aulas/01-camadas.md": "# Camadas\n\ntexto\n",
            "conteudo/redes/exercicios/01/facil.md": "# F\n\n## Exercício 01: A\n\n<details>\n\n**Número:** `2`\n</details>\n",
        })
        (t,) = c.montar(raiz)
        self.assertEqual([u.titulo for u in t.unidades], ["Camadas"])  # a 2 tem link quebrado: fica de fora
        self.assertEqual(t.unidades[0].nivel, "Iniciante")
        self.assertEqual((t.unidades[0].exercicios[0].exercicios, t.unidades[0].exercicios[0].perguntas), (1, 1))

    def test_link_para_arquivo_que_nao_e_markdown_nao_derruba_o_build(self):
        tabela = (
            "| # | Aula | Exercícios |\n| - | - | - |\n"
            "| 1 | [Slides](aulas/slides.png) | [Lista](exercicios/01/lista.pdf) |\n"
            "| 2 | [Camadas](aulas/02-camadas.md) | [PDF](exercicios/02/facil.pdf) · [🟢](exercicios/02/facil.md) |\n"
        )
        raiz = self.repo({
            "conteudo/README.md": self.INDICE,
            "conteudo/redes/README.md": "# Redes\n\n" + tabela,
            "conteudo/redes/aulas/slides.png": b"\x89PNG\r\n\x1a\n\xff\xfe\x00",
            "conteudo/redes/exercicios/01/lista.pdf": b"%PDF-1.7\n\xe2\xe3\xcf\xd3\xff",
            "conteudo/redes/exercicios/02/facil.pdf": b"%PDF\xff\xfe",
            "conteudo/redes/aulas/02-camadas.md": "# Camadas\n\ntexto\n",
            "conteudo/redes/exercicios/02/facil.md": "# F\n\n## Exercício 01: A\n",
        })
        (t,) = c.montar(raiz)
        self.assertEqual([u.titulo for u in t.unidades], ["Camadas"])
        self.assertEqual([e.src for e in t.unidades[0].exercicios], ["conteudo/redes/exercicios/02/facil.md"])

    def test_so_este_arquivo_vira_introducao(self):
        tabela = (
            "| # | Aula | Nível |\n| - | - | - |\n"
            "| 1 | **Este arquivo** | 🟢 Iniciante |\n"
            "| 2 | _A preencher._ | 🟡 Intermediário |\n"
            "| 3 | Em breve | 🔴 Avançado |\n"
        )
        raiz = self.repo({"conteudo/README.md": self.INDICE, "conteudo/redes/README.md": "# Redes\n\n" + tabela})
        (t,) = c.montar(raiz)
        self.assertEqual([(u.numero, u.titulo) for u in t.unidades], [("1", "Introdução")])

    def test_agrupar_por_area_na_ordem_em_que_a_area_aparece(self):
        grupos = c.agrupar_por_area(["python", "sistemas-digitais", "calculo", "git", "redes"])
        self.assertEqual(grupos, [("Programação", ["python", "git"]), ("Hardware", ["sistemas-digitais"]),
                                  ("Matemática", ["calculo"]), ("Outros", ["redes"])])

    def test_introducao_ignora_citacao_tabela_e_codigo(self):
        md = ("# T\n\n> [← voltar](../README.md)\n\n**Nível:** 🟢 Iniciante\n\n| a | b |\n| - | - |\n\n```\ncodigo\n```\n\n"
              "Um [tema](x.md) com **negrito** e `código`. Segunda frase.\n")
        self.assertEqual(c.introducao(md), "Um tema com negrito e código.")
        self.assertEqual(c.introducao("# Só título\n\n## Seção\n"), "")

    def test_perguntas_dentro_de_codigo_nao_contam(self):
        md = "```\n<details>\n**Número:** `1`\n</details>\n```\n\n<details>\n\n**Função:** `2x`\n</details>\n"
        self.assertEqual(c.contar_perguntas(md), 1)

    def test_minutos_de_leitura(self):
        self.assertEqual(c.minutos_de_leitura("palavra " * 401), 3)
        self.assertEqual(c.minutos_de_leitura(""), 1)


if __name__ == "__main__":
    unittest.main()
