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


class PaginasDeArea(unittest.TestCase):
    def test_uma_por_area_sem_pisar_numa_pasta_de_verdade(self):
        import tempfile
        with tempfile.TemporaryDirectory() as raiz:
            os.makedirs(os.path.join(raiz, "conteudo", "hardware"))  # um tema que se chamasse "hardware"
            grupos = [("Programação", ["python"]), ("Hardware", ["sd"]), ("Matemática", ["calculo"])]
            self.assertEqual(visual._paginas_de_area(grupos, raiz), {
                "conteudo/programacao/index.md": "Programação", "conteudo/matematica/index.md": "Matemática",
            })


class TemaDaPagina(unittest.TestCase):
    def test_pela_pasta_do_tema_sem_confundir_prefixo(self):
        from types import SimpleNamespace
        python = SimpleNamespace(src="conteudo/python/README.md")
        avancado = SimpleNamespace(src="conteudo/python-avancado/README.md")
        temas = [python, avancado]
        self.assertIs(visual._tema_da_pagina(temas, "conteudo/python/aulas/01.md"), python)
        self.assertIs(visual._tema_da_pagina(temas, "conteudo/python/README.md"), python)
        self.assertIs(visual._tema_da_pagina(temas, "conteudo/python-avancado/x.md"), avancado)
        self.assertIsNone(visual._tema_da_pagina(temas, "conteudo/README.md"))
        self.assertIsNone(visual._tema_da_pagina(temas, "simulados/python/README.md"))


class MaisDoTema(unittest.TestCase):
    PASTA = "conteudo/sd/"
    COM_README = {"conteudo/sd", "conteudo/sd/exercicios", "conteudo/sd/laboratorio", "conteudo/sd/laboratorio/projetos/01-blink"}

    def dentro(self, src):
        return visual._dentro_de_secao(src, self.PASTA, self.COM_README)

    def test_readme_de_subpasta_entra_no_mais(self):
        self.assertFalse(self.dentro("conteudo/sd/laboratorio/README.md"))
        self.assertFalse(self.dentro("conteudo/sd/exercicios/README.md"))

    def test_paginas_dentro_de_subpasta_com_readme_ficam_de_fora(self):
        self.assertTrue(self.dentro("conteudo/sd/laboratorio/projetos/01-blink/README.md"))
        self.assertTrue(self.dentro("conteudo/sd/laboratorio/experimentos.md"))

    def test_pasta_sem_readme_e_raiz_do_tema_continuam(self):
        self.assertFalse(self.dentro("conteudo/sd/resumos/formulario.md"))  # resumos/ não tem README
        self.assertFalse(self.dentro("conteudo/sd/cola.md"))


class SobretituloDepoisDaBusca(unittest.TestCase):
    def test_entra_antes_do_primeiro_h1(self):
        html = '<p>x</p><h1 id="a">A</h1><h1 id="b">B</h1>'
        self.assertEqual(visual._com_sobretitulo(html, "<p class=s>S</p>"), '<p>x</p><p class=s>S</p><h1 id="a">A</h1><h1 id="b">B</h1>')

    def test_sem_h1_vai_no_comeco(self):
        self.assertEqual(visual._com_sobretitulo("<p>x</p>", "<p>S</p>"), "<p>S</p><p>x</p>")


class CartoesDeExercicio(unittest.TestCase):
    H2 = '<h2 id="exercício-0{n}-x">Exercício 0{n}: Título {n}<a class="headerlink" href="#exercício-0{n}-x" title="Permanent link">&para;</a></h2>'

    def test_cada_exercicio_vira_um_cartao(self):
        html = ("<p>Intro</p>\n<hr />\n" + self.H2.format(n=1) + "\n<p>Um</p>\n<hr />\n" + self.H2.format(n=2)
                + '\n<div class="corretor" data-x></div>\n<div hidden data-visita></div><section class="fim"></section>')
        saida = visual._cartoes_de_exercicio(html)
        self.assertEqual(saida.count('<section class="exercicio-cartao">'), 2)
        self.assertIn('<h2 id="exercício-01-x"><span class="num">01</span> Título 1<a class="headerlink"', saida)
        self.assertIn('<div class="corretor" data-x></div>\n</section>', saida)
        self.assertEqual(saida.count("<hr />"), 1)  # fica só o que separa a introdução
        self.assertTrue(saida.index("</section>") < saida.index("data-visita"))

    def test_h2_que_nao_e_exercicio_fica_de_fora(self):
        html = self.H2.format(n=1) + "<p>Um</p>" + '<h2 id="referências">Referências</h2><p>x</p>'
        saida = visual._cartoes_de_exercicio(html)
        self.assertIn('</section><h2 id="referências">', saida)

    def test_pagina_sem_exercicio_nao_muda(self):
        html = '<h2 id="questão-1">Questão 1</h2><p>x</p>'
        self.assertEqual(visual._cartoes_de_exercicio(html), html)

    def test_indice(self):
        from types import SimpleNamespace as N
        filho = N(title="Exercício 03: Saudação", children=[])
        toc = [N(title="Funções · Fácil", children=[filho, N(title="Outra coisa", children=[])])]
        visual._indice_de_exercicios(toc)
        self.assertEqual(filho.title, "03 · Saudação")
        self.assertEqual(toc[0].children[1].title, "Outra coisa")


if __name__ == "__main__":
    unittest.main()
