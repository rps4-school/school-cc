"""Testes do catálogo do portal. Rodar: python3 -m unittest discover -s .mkdocs -p "test_*.py" """

import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _catalogo as c  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class RepositorioReal(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temas = {t.slug: t for t in c.montar(RAIZ)}

    def test_temas_na_ordem_do_indice(self):
        self.assertEqual(list(self.temas), ["python", "sistemas-digitais", "calculo", "git"])

    def test_area_e_icone(self):
        self.assertEqual((self.temas["calculo"].area, self.temas["calculo"].icone), ("Matemática", "integral"))
        self.assertEqual(self.temas["git"].area, "Engenharia de Software")

    def test_trilha_de_calculo(self):
        t = self.temas["calculo"]
        self.assertEqual(len(t.unidades), 10)
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

    def test_git_linha_sem_link_vira_introducao(self):
        u = self.temas["git"].unidades[0]
        self.assertEqual((u.titulo, u.src), ("Introdução", "conteudo/git/README.md"))
        self.assertEqual(len(self.temas["git"].unidades), 4)

    def test_contagens_batem_com_os_arquivos(self):
        for t in self.temas.values():
            for u in t.unidades:
                for e in u.exercicios:
                    with open(os.path.join(RAIZ, e.src), encoding="utf-8") as f:
                        self.assertEqual(e.exercicios, f.read().count("\n## Exercício"), e.src)

    def test_simulados(self):
        self.assertEqual([len(self.temas[s].simulados) for s in ("python", "sistemas-digitais", "calculo", "git")], [4, 4, 4, 0])
        s = self.temas["calculo"].simulados[0]
        self.assertEqual((s.titulo, s.src, s.duracao), ("Simulado 01", "simulados/calculo/simulado-01/README.md", "1h"))
        self.assertGreater(s.perguntas, 0)
        self.assertEqual(self.temas["python"].simulados[0].perguntas, 0)

    def test_totais(self):
        t = c.totais(list(self.temas.values()))
        self.assertEqual((t["temas"], t["simulados"]), (4, 12))
        self.assertEqual(t["exercicios"], 36 + 81 + 90)

    def test_lugares(self):
        lugares = c.lugares(list(self.temas.values()))
        ex = lugares["conteudo/calculo/exercicios/04-derivada/facil.md"]
        self.assertEqual((ex.tema.slug, ex.unidade.numero, ex.exercicio.nivel), ("calculo", "4", "facil"))
        self.assertEqual(lugares["simulados/calculo/simulado-02/README.md"].simulado.titulo, "Simulado 02")


class CasosDeBorda(unittest.TestCase):
    def repo(self, arquivos):
        raiz = tempfile.mkdtemp()
        for caminho, texto in arquivos.items():
            os.makedirs(os.path.dirname(os.path.join(raiz, caminho)), exist_ok=True)
            with open(os.path.join(raiz, caminho), "w", encoding="utf-8") as f:
                f.write(texto)
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

    def test_perguntas_dentro_de_codigo_nao_contam(self):
        md = "```\n<details>\n**Número:** `1`\n</details>\n```\n\n<details>\n\n**Função:** `2x`\n</details>\n"
        self.assertEqual(c.contar_perguntas(md), 1)

    def test_minutos_de_leitura(self):
        self.assertEqual(c.minutos_de_leitura("palavra " * 401), 3)
        self.assertEqual(c.minutos_de_leitura(""), 1)


if __name__ == "__main__":
    unittest.main()
