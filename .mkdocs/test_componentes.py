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
        self.assertIn('role="progressbar"', html)  # o anel: sempre visível ("–" sem progresso)
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


class Catalogo(unittest.TestCase):
    def test_linha_de_tema_lista_editorial(self):
        t = tema(introducao="Do zero às integrais.")
        html = c.cartao_tema(t, "calculo/", ["a/", "b/"], "10 aulas · 90 exercícios · 4 simulados")
        self.assertIn('class="cartao-tema"', html)
        self.assertIn('<span class="cartao-tema__desc">Do zero às integrais.</span>', html)
        self.assertEqual(html.count('class="cartao-tema__num"'), 3)
        self.assertEqual(html.count("<svg"), 1 + 3 + 1)  # ícone do tema, 3 números e a seta
        self.assertIn('class="anel" role="progressbar"', html)
        self.assertIn('aria-valuenow="0"', html)
        self.assertIn("data-progresso-texto", html)

    def test_sem_introducao_usa_a_descricao_do_indice(self):
        html = c.cartao_tema(tema(), "calculo/", [], "10 aulas")
        self.assertIn('<span class="cartao-tema__desc">Funções e <code>limites</code> &lt;b&gt;</span>', html)

    def test_cartao_tema_tem_texto_de_busca_sem_acento(self):
        html = c.cartao_tema(tema(), "calculo/", ["a/"], "10 aulas")
        self.assertIn('data-busca="calculo funcoes e limites &lt;b&gt; matematica"', html)

    def test_cartao_de_area_lista_os_temas_com_progresso(self):
        html = c.cartao_area("Programação", [(tema(slug="python", titulo="Python", area="Programação"), "python/", ["p/1/", "p/2/"]),
                                              (tema(slug="git", titulo="Git", area="Programação"), "git/", ["g/"])],
                             "conteudo/#area-programacao")
        self.assertNotIn("\n", html)
        self.assertIn('data-area="programacao"', html)
        self.assertIn("2 temas", html)
        self.assertIn('href="conteudo/#area-programacao"', html)
        self.assertIn('data-progresso-tema="python" data-paginas="p/1/ p/2/"', html)
        self.assertIn('href="git/"', html)
        self.assertIn("data-progresso-texto", html)

    def test_area_com_muitos_temas_mostra_seis_e_um_mais(self):
        temas = [(tema(slug=f"t{i}", titulo=f"Tema {i}", area="Programação"), f"t{i}/", []) for i in range(8)]
        html = c.cartao_area("Programação", temas, "conteudo/#area-programacao")
        self.assertEqual(html.count('class="area__tema"'), 6)
        self.assertIn(">+2 temas</a>", html)
        self.assertIn("8 temas", html)

    def test_filtros_do_catalogo_tem_busca_e_faceta_de_area(self):
        html = c.filtros_do_catalogo([("Programação", 2), ("Matemática", 1)])
        self.assertIn("data-filtros", html)
        self.assertNotIn("data-filtros hidden", html)  # sem JavaScript, o CSS esconde (.no-js do Material)
        self.assertIn('data-faceta="area" data-valor="" aria-pressed="true">Todos <span data-contagem>3</span>', html)
        self.assertIn('data-faceta="area" data-valor="programacao" aria-pressed="false">Programação <span data-contagem>2</span>', html)
        self.assertIn('type="search"', html)
        self.assertIn('role="status"', html)
        self.assertIn('data-singular="tema" data-plural="temas"', html)

    def test_filtros_por_nivel_tem_tres_facetas_e_limpar(self):
        html = c.barra_de_filtros([
            ("nivel", "Nível", [("iniciante", "Iniciante", 5), ("avancado", "Avançado", 2)], 7),
            ("tipo", "Tipo", [("aula", "Aulas e resumos", 3), ("exercicio", "Exercícios", 4)], 7),
        ], "item", "itens")
        self.assertIn('role="group" aria-label="Nível"', html)
        self.assertIn('data-faceta="nivel" data-valor="iniciante" aria-pressed="false">Iniciante <span data-contagem>5</span>', html)
        self.assertIn('data-faceta="tipo" data-valor="" aria-pressed="true"', html)
        self.assertIn("data-limpar hidden", html)
        self.assertNotIn('type="search"', html)

    def test_item_de_nivel(self):
        html = c.item_de_nivel("exercicio", "Derivada · Fácil", "ex/facil/", "conteudo/calculo/ex/facil/", "Iniciante", "Matemática", "9 perguntas")
        for trecho in ('data-item data-pagina="conteudo/calculo/ex/facil/"', 'data-nivel="iniciante"', 'data-area="matematica"',
                       'data-tipo="exercicio"', "Derivada · Fácil", "9 perguntas", 'class="nivel nivel--facil"', "data-estado-texto"):
            self.assertIn(trecho, html)

    def test_legenda_explica_os_tres_niveis(self):
        html = c.legenda_dos_niveis()
        for nivel in ("Iniciante", "Intermediário", "Avançado"):
            self.assertIn(f">{nivel}</span>", html)
        self.assertIn("fácil", html)

    def test_grupo_de_temas_tem_ancora_da_area(self):
        html = c.grupo_de_temas("Matemática", "<a>x</a>")
        self.assertIn('id="area-matematica"', html)
        self.assertIn("data-grupo", html)
        self.assertIn('data-area="matematica"', html)


class CabecalhoDaPagina(unittest.TestCase):
    def test_sobretitulo(self):
        self.assertEqual(c.sobretitulo("Aula 2 de 6"), '<p class="sobretitulo" data-search-exclude>Aula 2 de 6</p>')
        self.assertEqual(c.sobretitulo("Aula 2 de 6", "Programação"),
                         '<p class="sobretitulo" data-search-exclude data-area="programacao">Aula 2 de 6</p>')

    def test_linha_de_informacoes(self):
        html = c.linha_de_informacoes("Intermediário", "../niveis/", ["~8 min de leitura"], [("Sugerir melhoria", "https://x/edit"), ("Nada", None)])
        self.assertIn('<a class="md-tag md-tag-icon md-tag--intermediario" href="../niveis/#tag:intermediário">Intermediário</a>', html)
        self.assertIn("~8 min de leitura</span>", html)
        self.assertIn('href="https://x/edit"', html)
        self.assertNotIn("Nada", html)
        self.assertNotIn("\n", html)

    def test_cabecalho_e_fim_fora_da_busca(self):
        for html in (c.linha_de_informacoes("Iniciante", "n/", ["x"]), c.segmentos([("a/", True)]),
                     c.abas_de_nivel([("facil", "f/", "k/", True)]), c.proximo_passo("k/", "Marcar", "Feito"),
                     c.sobretitulo("Aula 1 de 2")):
            self.assertIn("data-search-exclude", html)

    def test_linha_sem_nivel(self):
        self.assertNotIn("md-tag", c.linha_de_informacoes(None, "../niveis/", ["3 exercícios"]))

    def test_segmentos(self):
        html = c.segmentos([("a/", False), ("b/", True), ("c/", False)])
        self.assertIn('aria-hidden="true"', html)
        self.assertEqual(html.count("data-pagina="), 3)
        self.assertIn('<i data-pagina="b/" class="atual"></i>', html)

    def test_abas_de_nivel(self):
        html = c.abas_de_nivel([("facil", "../facil/", "k/f/", False), ("intermediario", "./", "k/i/", True)])
        self.assertIn('<nav class="abas-nivel" aria-label="Níveis" data-search-exclude>', html)
        self.assertEqual(html.count('aria-current="page"'), 1)
        self.assertRegex(html, r'href="\./" data-pagina="k/i/" aria-current="page"><span class="ponto nivel--intermediario"')
        self.assertIn(">Fácil<", html)


class ProximoPasso(unittest.TestCase):
    PRATIQUE = [("facil", "f/", "k/f/", 0, 3), ("intermediario", "i/", "k/i/", 9, 2), ("dificil", "d/", "k/d/", 0, 3)]

    def test_aula_com_exercicios(self):
        html = c.proximo_passo("k/aula/", "Marcar aula como concluída", "Aula concluída", pratique=self.PRATIQUE,
                               secundario=("Próxima aula", "Matrizes", "../03/"))
        self.assertIn('<section class="fim proximo-passo" aria-label="Próximo passo" data-search-exclude>', html)
        self.assertIn('data-concluir="k/aula/"', html)
        self.assertIn("Agora, pratique", html)
        self.assertEqual(html.count('class="exercicio nivel-cartao'), 3)
        self.assertEqual(html.count(" prim\""), 1)  # só o Fácil é a ação principal
        self.assertIn('data-pagina="k/i/" data-perguntas="9"', html)
        self.assertIn("9 perguntas", html)
        self.assertIn("3 exercícios", html)
        self.assertRegex(html, r'<a class="fim__proximo proximo-passo__depois" href="\.\./03/">Já praticou\? Próxima aula: <b>Matrizes</b>')
        self.assertNotIn("\n", html)

    def test_sem_exercicios_o_proximo_e_a_acao_principal(self):
        html = c.proximo_passo("k/", "Marcar", "Feito", principal=("Próxima aula", "Listas", "../02/"))
        self.assertNotIn("Agora, pratique", html)
        self.assertRegex(html, r'<a class="fim__proximo proximo-passo__principal" href="\.\./02/"><span class="fim__rotulo">Próxima aula</span>')

    def test_fim_da_trilha(self):
        html = c.proximo_passo("k/", "Marcar", "Feito", principal=("Fim da trilha", "Teste-se nos simulados", "../#teste-se"))
        self.assertIn("Fim da trilha", html)
        self.assertIn('href="../#teste-se"', html)


if __name__ == "__main__":
    unittest.main()
