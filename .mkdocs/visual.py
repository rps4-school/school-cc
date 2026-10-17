"""Hook de apresentação: deixa o site uniforme sem mudar o Markdown do GitHub.

Roda depois do hooks.py (ordem em mkdocs.yml). Tudo aqui é só visual:
- publica o CSS compilado (.mkdocs/site.css, gerado pelo Tailwind);
- tira a navegação manual ("← voltar", "Próximo:"): o site já tem trilha e rodapé;
- tira os emojis dos títulos, mantendo o mesmo id de âncora do GitHub;
- troca citações com 💡 / ⚠️ / 📖 por caixas de dica, atenção e leitura;
- mostra Entrada e Saída dos exercícios lado a lado;
- transforma "✅ Ver resposta" em botão;
- nos simulados de Python, põe um editor (editor.js) antes da resposta de cada questão;
- nas perguntas com "**Resposta:**" dentro de <details>, põe o corretor automático (corretor.js);
- transforma a linha "**Nível:** ..." em tag e gera a página "Por nível";
- portal (dados do _catalogo.py, progresso desenhado pelo portal.js): página inicial com o catálogo de
  temas, cabeçalho de curso e trilha na página do tema (no lugar da tabela do roteiro), linha de
  informações e fim de página (concluir, próximos passos) nas aulas, exercícios e simulados, e a página
  "Meu progresso".
"""

import html
import json
import os
import posixpath
import re

from mkdocs.structure.files import File, InclusionLevel
from mkdocs.structure.nav import Section
from mkdocs.utils import get_relative_url
from pymdownx.slugs import slugify

from _catalogo import agrupar_por_area, fora_de_codigo, lugares, montar, perguntas, tabela_roteiro, totais
from _componentes import (
    EMOJI, NIVEIS, NIVEL, NIVEL_DO_EXERCICIO, area_slug, bloco_continuar, cabecalho_tema, cartao, cartao_area, cartao_tema,
    TIPOS, barra_de_filtros, faixa_como_estudar, filtros_do_catalogo, grupo_de_temas, item_de_nivel, legenda_dos_niveis,
    painel_de_nivel, NIVEL_VALOR,
    NOME_DO_NIVEL, fim_de_pagina, grade, heroi, informacoes, item_trilha, marcador_de_visita, plural, sem_emoji,
    simulados_do_tema, trilha, aviso_local, resumo_estudo, progresso_do_tema, revisar,
    abas_de_nivel, linha_de_informacoes, proximo_passo, segmentos, sobretitulo,
)
from _trilha import (
    Link, abas_do_site, caminho, html_das_abas, html_do_caminho, html_do_menu, montar_menu, rotulo_da_unidade,
)

# Arquivos desta pasta publicados no site (o MkDocs ignora pastas que começam com ".").
ARQUIVOS_DO_SITE = {
    "site.css": "assets/stylesheets/site.css",
    "editor.js": "assets/javascripts/editor.js",
    "python-worker.js": "assets/javascripts/python-worker.js",
    "corretor.js": "assets/javascripts/corretor.js",
    "katex-init.js": "assets/javascripts/katex-init.js",
    "diagramas.js": "assets/javascripts/diagramas.js",
    "progresso.js": "assets/javascripts/progresso.js",
    "cronometro.js": "assets/javascripts/cronometro.js",
    "portal.js": "assets/javascripts/portal.js",
}
PAGINA_PROGRESSO = "progresso.md"
MARCADOR_PROGRESSO = "<!-- meu-progresso -->"
# Abas que são uma página só: o título delas ainda não foi lido quando o menu é montado.
TITULOS_DAS_ABAS = {"README.md": "Início", PAGINA_PROGRESSO: "Meu progresso"}
PAGINA_NIVEIS = "niveis.md"
MARCADOR_NIVEIS = "<!-- por-nivel -->"
# A lista do plugin de tags fica escondida: as etiquetas de nível das páginas apontam para as âncoras
# dela (#tag:iniciante...), e o portal.js usa a âncora para abrir a página já filtrada.
CONTEUDO_NIVEIS = f"""# Por nível

{MARCADOR_NIVEIS}

<div class="lista-de-tags" hidden markdown="1">

<!-- material/tags -->

</div>
"""

_slug = slugify(case="lower")  # o mesmo do mkdocs.yml, que imita o GitHub
_estado = {}  # catálogo do portal (temas, trilhas, contagens), montado no on_files

CERCA = re.compile(r"^(`{3,}|~{3,})")
TITULO = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
EXEMPLO = re.compile(r"\*\*Entrada:\*\*\n```text\n(.*?)```\n\*\*Saída:\*\*\n```text\n(.*?)```", re.S)
# Tabela-índice: "| [**Python**](python/README.md) | descrição |" vira uma grade de cartões.
TABELA_INDICE = re.compile(r"^\|[^\n]+\|\n\|[ :|-]+\|\n((?:\| \[\*\*[^\]]+\*\*\]\([^)]+\) \| [^\n]+ \|\n?)+)", re.M)
LINHA_INDICE = re.compile(r"^\| \[\*\*([^\]]+)\*\*\]\(([^)]+)\) \| (.+?) \|$", re.M)
# [ \t]* e não \s*: \s* engoliria a linha em branco e o "---" seguinte viraria um título.
VER_RESPOSTA = re.compile(r"^\[✅ Ver resposta\]\(([^)]+)\)[ \t]*$", re.M)
CAIXAS = {
    "💡": ("tip", "Dica"),
    "⚠️": ("warning", "Atenção"),
    "📖": ("info", "Antes de começar"),
    "📌": ("note", "Importante"),
}
# Linha de cabeçalho dos simulados: vira a "folha de prova" com cronômetro.
FOLHA_DE_PROVA = re.compile(
    r"^\*\*Duração sugerida:\*\* (?P<duracao>[^·]+?) · \*\*Pontuação:\*\* (?P<pontos>[^·]+?)"
    r" · \*\*Assuntos:\*\* (?P<assuntos>.+?)\s*$",
    re.M,
)
QUESTAO = re.compile(r"^## Questão (\d+)")


# Partes da linha de navegação que o site não mostra: "Voltar para Python" (com ou sem seta), qualquer link para
# o README e o "📖 Antes, leia" (os exercícios já têm "Rever a aula" na linha de informações).
VOLTAR = re.compile(r"voltar|\]\((?:\.\./)*README\.md\)|Antes, leia", re.I)


def _sem_navegacao_manual(linhas):
    # Só olha o começo da página, onde ficam os "← voltar".
    for i, linha in list(fora_de_codigo(linhas))[:8]:
        if not linha.startswith(">") or "←" not in linha and "Próximo:" not in linha:
            continue
        partes = [p.strip() for p in linha.lstrip("> ").split(" · ")]
        restantes = [p for p in partes
                     if "←" not in p and not p.startswith("Próximo:") and "→]" not in p and not VOLTAR.search(p)]
        linhas[i] = "> " + " · ".join(restantes) if restantes else ""
    return linhas


def _titulos_sem_emoji(linhas):
    for i, linha in fora_de_codigo(linhas):
        m = TITULO.match(linha)
        if m and EMOJI.search(m.group(2)):
            texto = m.group(2)
            ancora = _slug(re.sub(r"[`*_]", "", texto), "-")
            linhas[i] = f"{m.group(1)} {sem_emoji(texto)} {{ #{ancora} }}"
    return linhas


def _caixas(linhas):
    saida, i = [], 0
    dentro = {j for j, _ in fora_de_codigo(linhas)}
    while i < len(linhas):
        linha = linhas[i]
        emoji = next((e for e in CAIXAS if linha.startswith(f"> {e}")), None) if i in dentro else None
        if emoji is None:
            saida.append(linha)
            i += 1
            continue
        corpo = [linha[2 + len(emoji):].strip()]
        i += 1
        while i < len(linhas) and linhas[i].startswith(">"):
            corpo.append(linhas[i][1:].strip())
            i += 1
        tipo, titulo = CAIXAS[emoji]
        # "**Dica:** texto" vira o título da caixa, se for curto.
        m = re.match(r"^\*\*([^*`]{1,30}?):?\*\*:?\s*(.*)$", corpo[0])
        if m and len(m.group(1).split()) <= 3:
            titulo, corpo[0] = m.group(1).rstrip(":"), m.group(2)
        saida += ["", f'!!! {tipo} "{titulo}"', ""] + [f"    {c}" if c else "" for c in corpo] + [""]
    return saida


def _exemplos(markdown):
    secoes = re.split(r"(?=^## )", markdown, flags=re.M)
    for s, secao in enumerate(secoes):
        contador = iter(range(1, 100))

        def bloco(m):
            n = next(contador)
            coluna = (
                '<div markdown="block">\n'
                '<div class="mb-1 text-[0.62rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{}</div>\n\n'
                "```text\n{}```\n\n</div>"
            )
            return (
                '<div class="exemplo my-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 pt-3 pb-1 dark:border-white/10 dark:bg-white/[0.03]" markdown="block">\n'
                f'<div class="text-[0.7rem] font-semibold text-slate-700 dark:text-slate-200">Exemplo {n}</div>\n'
                '<div class="grid gap-x-4 sm:grid-cols-2" markdown="block">\n'
                + coluna.format("Entrada", m.group(1)) + "\n"
                + coluna.format("Saída", m.group(2)) + "\n"
                "</div>\n</div>"
            )

        secoes[s] = EXEMPLO.sub(bloco, secao)
    return "".join(secoes)


def _minutos(duracao):
    """'1h40' -> 100, '2h' -> 120, '90min' -> 90."""
    horas = re.search(r"(\d+)\s*h", duracao)
    minutos = re.search(r"h\s*(\d+)|(\d+)\s*min", duracao)
    total = int(horas.group(1)) * 60 if horas else 0
    if minutos:
        total += int(minutos.group(1) or minutos.group(2))
    return total or 60


def _folha_de_prova(m):
    minutos = _minutos(m.group("duracao"))
    info = [("Duração", m.group("duracao")), ("Pontuação", m.group("pontos")), ("Assuntos", m.group("assuntos"))]
    campos = [("Nome", "flex-1 min-w-48"), ("Data", "w-32"), ("Nota", "w-24")]
    return (
        '<div class="my-6 overflow-hidden rounded-2xl border-2 border-slate-800 bg-white shadow-sm '
        'dark:border-slate-400 dark:bg-white/5">'
        '<div class="flex flex-wrap items-center justify-between gap-2 bg-slate-800 px-5 py-2 text-white '
        'dark:bg-slate-700">'
        '<span class="text-[0.7rem] font-extrabold uppercase tracking-[0.2em]">Folha de prova</span>'
        '<span class="text-[0.65rem] uppercase tracking-wider text-slate-300">Simulado · sem consulta</span></div>'
        '<div class="grid gap-px bg-slate-200 sm:grid-cols-3 dark:bg-white/10">'
        + "".join(
            f'<div class="bg-white px-5 py-3 dark:bg-slate-900"><div class="text-[0.6rem] font-bold uppercase '
            f'tracking-wider text-slate-500 dark:text-slate-400">{rotulo}</div>'
            f'<div class="text-[0.8rem] font-semibold text-slate-900 dark:text-slate-100">{valor}</div></div>'
            for rotulo, valor in info
        )
        + '</div><div class="flex flex-wrap gap-x-6 gap-y-3 px-5 pt-4 pb-2">'
        + "".join(
            f'<div class="{largura}"><span class="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 '
            f'dark:text-slate-400">{campo}</span><div class="mt-4" style="border-bottom: 1.5px dashed #94a3b8"></div></div>'
            for campo, largura in campos
        )
        + f'</div><div class="flex flex-wrap items-center gap-3 px-5 pt-2 pb-4" data-cronometro="{minutos}">'
        '<span class="visor font-mono text-[1.3rem] font-bold tabular-nums text-slate-900 dark:text-slate-100" '
        'role="timer" aria-label="Tempo restante"></span>'
        '<button type="button" class="iniciar md-button md-button--primary">Iniciar</button>'
        '<button type="button" class="zerar md-button">Zerar</button></div></div>'
    )  # o cronometro.js faz o relógio andar


def _editores(markdown):
    """Põe o editor de Python antes do "Ver resposta" de cada "## Questão NN" (o editor.js monta)."""
    secoes = re.split(r"(?=^## )", markdown, flags=re.M)
    for s, secao in enumerate(secoes):
        m = QUESTAO.match(secao)
        if not m:
            continue
        editor = f'<div class="editor-python" data-questao="{m.group(1)}" data-arquivo="q{int(m.group(1))}.py"></div>'
        secoes[s], trocas = VER_RESPOSTA.subn(lambda r: f"{editor}\n\n{r.group(0)}", secao, count=1)
        if not trocas:
            secoes[s] = f"{secao.rstrip()}\n\n{editor}\n\n"
    return "".join(secoes)


MARCA_DE_PERGUNTA = re.compile(r"^\*\*([a-z]\)|\d+\.)\*\*")
ANCORA_EXPLICITA = re.compile(r"\s*\{ #([^}]+) \}\s*$")


def _rotulo_e_ancora(titulo, marca):
    m = ANCORA_EXPLICITA.search(titulo)
    texto = ANCORA_EXPLICITA.sub("", titulo)
    ancora = m.group(1) if m else _slug(re.sub(r"[`*_]", "", texto), "-")
    texto = sem_emoji(re.sub(r"[`*_]|\$", "", texto))
    return (f"{texto} · {marca}" if marca else texto), ancora


def _corretores(markdown):
    """Põe o campo do corretor (corretor.js) antes de cada <details> que traz uma resposta conferível.
    O rótulo e a âncora (título da seção + "a)") vão para a lista "Revisar" de quem errou."""
    linhas = markdown.split("\n")
    caixas = {i: (tipo, resposta) for i, tipo, resposta in perguntas(linhas)}
    titulos = {i: linha[3:] for i, linha in fora_de_codigo(linhas) if linha.startswith("## ")}
    saida, titulo, marca = [], "", ""
    for i, linha in enumerate(linhas):
        if i in titulos:
            titulo, marca = titulos[i], ""
        elif MARCA_DE_PERGUNTA.match(linha):
            marca = MARCA_DE_PERGUNTA.match(linha).group(1)
        if i in caixas:
            tipo, resposta = caixas[i]
            rotulo, ancora = _rotulo_e_ancora(titulo, marca)
            atributos = " ".join(f'data-{k}="{html.escape(v, quote=True)}"' for k, v in
                                 (("tipo", tipo), ("resposta", resposta), ("rotulo", rotulo), ("ancora", ancora)))
            saida += [f'<div class="corretor" {atributos}></div>', ""]
        saida.append(linha)
    return "\n".join(saida)


def _url(files, page, src):
    arquivo = files.get_file_from_path(src)
    return get_relative_url(arquivo.url, page.url) if arquivo else "#"


def _tabelas_indice(markdown, page, files):
    pasta = posixpath.dirname(page.file.src_uri)

    def grade_de(m):
        cartoes = []
        for titulo, link, descricao in LINHA_INDICE.findall(m.group(1)):
            src = posixpath.normpath(posixpath.join(pasta, link))
            cartoes.append(cartao(_url(files, page, src), titulo, descricao, "pasta"))
        return grade(cartoes) + "\n"

    return TABELA_INDICE.sub(grade_de, markdown)


def _chave(files, src):
    """Chave do progresso de uma página: o endereço dela a partir da raiz do site (o File.url)."""
    arquivo = files.get_file_from_path(src)
    return arquivo.url if arquivo else src


def _numeros_do_tema(tema):
    """'10 aulas · 90 exercícios · 4 simulados' (o que o tema não tem fica de fora)."""
    pastas = {posixpath.basename(posixpath.dirname(u.src)) for u in tema.unidades}
    nome = ("aula", "aulas") if "aulas" in pastas else ("resumo", "resumos") if "resumos" in pastas else ("página", "páginas")
    partes = [plural(len(tema.unidades), *nome) if tema.unidades else ""]
    if tema.total_exercicios:
        partes.append(plural(tema.total_exercicios, "exercício", "exercícios"))
    if tema.simulados:
        partes.append(plural(len(tema.simulados), "simulado", "simulados"))
    return " · ".join(p for p in partes if p)


def _temas_por_area():
    """[(área, [Tema])], na ordem de conteudo/README.md (a mesma do menu)."""
    por_slug = {t.slug: t for t in _estado["temas"]}
    return [(area, [por_slug[s] for s in slugs]) for area, slugs in agrupar_por_area(list(por_slug))]


def _catalogo(page, files):
    """Página Conteúdo: filtros (busca e área) e os cartões compactos de tema, agrupados por área."""
    grupos = _temas_por_area()
    secoes = "".join(
        grupo_de_temas(area, "".join(
            cartao_tema(t, _url(files, page, t.src), [_chave(files, src) for src in t.paginas], _numeros_do_tema(t))
            for t in temas
        ))
        for area, temas in grupos
    )
    return (f"{filtros_do_catalogo([(area, len(temas)) for area, temas in grupos])}\n\n{secoes}\n\n"
            f'<p class="temas-rodape"><a href="{_url(files, page, PAGINA_NIVEIS)}">Ver todo o conteúdo por nível →</a></p>')


def _por_nivel(page, files):
    """Página "Por nível": filtros (nível, área, tipo) e os itens agrupados por área e tema, como nas
    plataformas de curso (Codecademy, Coursera). Aulas e resumos pelo nível da tabela do roteiro, exercícios
    pelo nome do arquivo (fácil = Iniciante...), simulados pela tabela de simulados/README.md."""
    url = lambda src: _url(files, page, src)  # noqa: E731
    secoes, todos = [], []
    for area, temas in _temas_por_area():
        paineis = []
        for t in temas:
            itens = []
            for u in t.unidades:
                itens.append(("aula", f"{rotulo_da_unidade(u)} {u.numero} · {u.titulo}", u.src, u.nivel, f"~{u.minutos} min"))
                for e in u.exercicios:
                    meta = plural(e.perguntas, "pergunta", "perguntas") if e.perguntas else plural(e.exercicios, "exercício", "exercícios")
                    itens.append(("exercicio", f"{u.titulo} · {NOME_DO_NIVEL[e.nivel]}", e.src, NIVEL_DO_EXERCICIO[e.nivel], meta))
            itens += [("simulado", s.titulo, s.src, s.nivel, s.duracao) for s in t.simulados]
            itens = [i for i in itens if i[3]]  # sem nível não entra
            todos += [(i[0], i[3], area) for i in itens]
            if itens:
                paineis.append(painel_de_nivel(t, url(t.src), [
                    item_de_nivel(tipo, titulo, url(src), _chave(files, src), nivel, area, meta)
                    for tipo, titulo, src, nivel, meta in itens
                ]))
        if paineis:
            secoes.append(grupo_de_temas(area, "".join(paineis), painel=False))
    conta = lambda chave: {v: sum(1 for i in todos if i[chave] == v) for v in {i[chave] for i in todos}}  # noqa: E731
    por_tipo, por_nivel, por_area = conta(0), conta(1), conta(2)
    filtros = barra_de_filtros([
        ("nivel", "Nível", [(NIVEL_VALOR[n], n, por_nivel.get(n, 0)) for n in NIVEIS], len(todos)),
        ("area", "Área", [(area_slug(a), a, por_area[a]) for a, _ in _temas_por_area() if a in por_area], len(todos)),
        ("tipo", "Tipo", [(v, nome, por_tipo.get(v, 0)) for v, nome in TIPOS], len(todos)),
    ], "item", "itens")
    return (
        "Escolha o nível e, se quiser, a área e o tipo. Tudo fica agrupado por área e por tema.\n\n"
        f"{legenda_dos_niveis()}\n\n{filtros}\n\n{''.join(secoes)}\n"
    )


def _areas(page, files):
    """Home: um bloco por área, com os temas como etiquetas. O catálogo completo fica em Conteúdo."""
    catalogo = _url(files, page, "conteudo/README.md")
    blocos = "".join(
        cartao_area(area, [(t, _url(files, page, t.src), [_chave(files, src) for src in t.paginas]) for t in temas],
                    f"{catalogo}#area-{area_slug(area)}")
        for area, temas in _temas_por_area()
    )
    return f'<div class="areas">{blocos}</div>'


def _leitura(minutos):
    return f"~{round(minutos / 60)} h de leitura" if minutos >= 90 else f"~{minutos} min de leitura"


def _pagina_do_tema(markdown, tema, page, files):
    """README do tema: cabeçalho de curso depois do título; a tabela do roteiro vira a trilha; "Teste-se"
    com os simulados no fim da seção do roteiro."""
    url = lambda src: _url(files, page, src)  # noqa: E731
    numeros = _numeros_do_tema(tema)
    if tema.unidades:
        numeros += " · " + _leitura(sum(u.minutos for u in tema.unidades))
    primeira = url(tema.unidades[0].src) if tema.unidades else None
    cabecalho = cabecalho_tema(tema, numeros, primeira, [_chave(files, src) for src in tema.paginas])
    markdown = re.sub(r"^# .*$", lambda m: f"{m.group(0)}\n\n{cabecalho}\n", markdown, count=1, flags=re.M)

    m = tabela_roteiro(markdown)
    if not (m and tema.unidades):
        return markdown
    itens = [
        item_trilha(u.numero, u.titulo, url(u.src), _chave(files, u.src), u.descricao, u.nivel, u.minutos,
                    [(e.nivel, url(e.src), _chave(files, e.src), e.perguntas) for e in u.exercicios],
                    rotulo_da_unidade(u))
        for u in tema.unidades
    ]
    antes, depois = markdown[: m.start()], markdown[m.end():]
    if tema.simulados:
        teste = "## Teste-se\n\n" + simulados_do_tema([
            (s.titulo, url(s.src), _chave(files, s.src), s.perguntas, s.nivel, s.duracao) for s in tema.simulados
        ]) + "\n\n"
        proxima = re.search(r"^## ", depois, re.M)
        depois = depois[: proxima.start()] + teste + depois[proxima.start():] if proxima else depois + "\n\n" + teste
    return f"{antes}{trilha(itens, tema.area)}\n{depois}"


# Por tipo de unidade: (rótulo da próxima, texto do botão, texto depois de marcado, "rever ...").
TEXTOS_DA_UNIDADE = {
    "Aula": ("Próxima aula", "Marcar aula como concluída", "Aula concluída", "Rever a aula"),
    "Resumo": ("Próximo resumo", "Marcar resumo como concluído", "Resumo concluído", "Rever o resumo"),
    "Parte": ("Próxima parte", "Marcar como concluída", "Concluída", "Rever a parte"),
}


def _tema_da_pagina(temas, src):
    """O tema cuja pasta contém a página (conteudo/python/... -> Python)."""
    return next((t for t in temas if src.startswith(posixpath.dirname(t.src) + "/")), None)


def _mais_do_tema(tema, files):
    """[(título, src)]: páginas do tema fora da trilha (formulário, lista de exercícios...). Ficam de fora as
    geradas (listagens de pasta e páginas de .py) e as respostas."""
    pasta = posixpath.dirname(tema.src) + "/"
    da_trilha = {tema.src} | {u.src for u in tema.unidades} | {e.src for u in tema.unidades for e in u.exercicios}
    mais = []
    for f in files.documentation_pages():
        src = f.src_uri
        if not src.startswith(pasta) or src in da_trilha or f.generated_by or "/respostas/" in src:
            continue
        with open(f.abs_src_path, encoding="utf-8") as arquivo:
            achou = re.search(r"^#\s+(.+)$", arquivo.read(), re.M)
        mais.append((sem_emoji(achou.group(1)) if achou else posixpath.basename(src), src))
    return sorted(mais, key=lambda m: m[1])


def _menu_e_caminho(page, files, tema):
    """Menu da trilha e caminho no topo, em page.meta (os templates de overrides/partials/ só os mostram)."""
    src = page.file.src_uri
    url = lambda alvo: _url(files, page, alvo)  # noqa: E731
    chave = lambda alvo: _chave(files, alvo)  # noqa: E731
    url_conteudo = url("conteudo/README.md")
    enunciado = page.meta.get("resposta_de")  # nas respostas: o enunciado que aponta para elas
    lugar = _estado["lugares"].get(enunciado or src)
    menu = montar_menu(tema, src, url, chave, url_conteudo, _estado["mais"].get(tema.slug, ()), enunciado)
    page.meta["trilha"] = html_do_menu(menu)
    page.meta["trilha_tema"] = tema.titulo
    page.meta["trilha_abas"] = html_das_abas([Link(a.titulo, url(a.url)) for a in _estado["abas"]])
    if src == tema.src:
        links = caminho(tema, url, url_conteudo, pagina_do_tema=True)
    elif lugar and lugar.exercicio:
        links = caminho(tema, url, url_conteudo, lugar.unidade, lugar.exercicio, resposta=bool(enunciado))
    elif lugar and lugar.unidade:
        links = caminho(tema, url, url_conteudo, lugar.unidade)
    else:
        links = caminho(tema, url, url_conteudo)
    page.meta["caminho"] = html_do_caminho(links)


def _proxima_unidade(tema, unidade):
    i = tema.unidades.index(unidade)
    return tema.unidades[i + 1] if i + 1 < len(tema.unidades) else None


# Exercício no HTML final: o título "Exercício NN: Título" (com o ¶ do permalink) e o índice da direita.
H2_EXERCICIO = re.compile(r'<h2 id="([^"]+)">Exercício (\d+): (.*?)(<a class="headerlink"[^>]*>.*?</a>)?</h2>', re.S)
EXERCICIO_NO_INDICE = re.compile(r"^Exercício (\d+): (.+)$")
FIM_DO_CARTAO = ("<hr />", "<div hidden data-visita", "<h2")
ANCORA_DO_TITULO = re.compile(r"\s*\{ #[^}]+\}\s*$")


def _cartoes_de_exercicio(html):
    """Cada "## Exercício NN: Título" vira um cartão, com o número num selo. O cartão vai até o <hr /> que separa
    os exercícios, o próximo <h2> ou o fim da página. Feito no HTML final para não mexer no Markdown."""
    achados = list(H2_EXERCICIO.finditer(html))
    if not achados:
        return html
    partes = [html[: achados[0].start()]]
    for i, m in enumerate(achados):
        fim = achados[i + 1].start() if i + 1 < len(achados) else len(html)
        corpo = html[m.end(): fim]
        corte = min((p for p in (corpo.find(marca) for marca in FIM_DO_CARTAO) if p >= 0), default=len(corpo))
        dentro, resto = corpo[:corte], corpo[corte:]
        if resto.startswith("<hr />"):
            resto = resto[len("<hr />"):]  # entre cartões, o separador sobra
        titulo = f'<h2 id="{m.group(1)}"><span class="num">{m.group(2)}</span> {m.group(3)}{m.group(4) or ""}</h2>'
        partes.append(f'<section class="exercicio-cartao">{titulo}{dentro}</section>{resto}')
    return "".join(partes)


def _indice_de_exercicios(toc):
    """No índice da direita, "Exercício 03: Saudação" vira "03 · Saudação"."""
    for item in toc:
        m = EXERCICIO_NO_INDICE.match(item.title)
        if m:
            item.title = f"{m.group(1)} · {m.group(2)}"
        _indice_de_exercicios(item.children)


def _esconder(page, *itens):
    page.meta["hide"] = list(dict.fromkeys([*page.meta.get("hide", []), *itens]))


def _titulo_visivel(original, novo):
    """Troca o texto do título e mantém a âncora explícita ({ #id }), se houver."""
    if novo is None:
        return original
    ancora = ANCORA_DO_TITULO.search(original)
    return novo + (ancora.group(0) if ancora else "")


def _pagina_da_trilha(markdown, lugar, page, files):
    """Aula, exercícios ou simulado: cabeçalho (sobretítulo e linha de informações), marcador de visita e o fim
    da página (concluir e o próximo passo)."""
    tema, unidade = lugar.tema, lugar.unidade
    url = lambda src: _url(files, page, src)  # noqa: E731
    chave = _chave(files, page.file.src_uri)
    if lugar.simulado:
        s = lugar.simulado
        topo = informacoes([tema.titulo, "Simulado", s.duracao])
        markdown = re.sub(r"^# .*$", lambda m: f"{m.group(0)}\n\n{topo}\n", markdown, count=1, flags=re.M)
        fim = fim_de_pagina(chave, "Marcar como feito", feito="Feito")
        return f"{markdown.rstrip()}\n\n{marcador_de_visita(tema.slug, f'{s.titulo} · {tema.titulo}')}{fim}\n"

    rotulo = rotulo_da_unidade(unidade)
    rotulo_proxima, botao, feito, rever = TEXTOS_DA_UNIDADE[rotulo]
    seguinte = _proxima_unidade(tema, unidade)
    proxima = (rotulo_proxima, seguinte.titulo, url(seguinte.src)) if seguinte else None
    fim_da_trilha = (("Fim da trilha", "Teste-se nos simulados", url(tema.src) + "#teste-se") if tema.simulados
                     else ("Fim da trilha", f"Voltar para {tema.titulo}", url(tema.src)))
    pagina_do_tema = page.file.src_uri == tema.src  # o README como unidade: ele já tem o cabeçalho de curso
    edicao = page.edit_url
    if not pagina_do_tema:
        page.edit_url = None  # os ícones do Material saem; o link vira "Sugerir melhoria" na linha de informações
    url_niveis = url(PAGINA_NIVEIS)
    if lugar.exercicio:
        e = lugar.exercicio
        nome = NOME_DO_NIVEL[e.nivel]
        quantas = plural(e.perguntas, "pergunta", "perguntas") if e.perguntas else plural(e.exercicios, "exercício", "exercícios")
        antes = sobretitulo(f"Exercícios · {rotulo} {unidade.numero}", tema.area)
        depois = (linha_de_informacoes(None, url_niveis, [quantas], [(rever, url(unidade.src)), ("Sugerir melhoria", edicao)])
                  + abas_de_nivel([(x.nivel, url(x.src), _chave(files, x.src), x is e) for x in unidade.exercicios]))
        novo_titulo = unidade.titulo  # o nível já está nas abas
        page.meta["titulo_da_pagina"] = f"{unidade.titulo} · {nome}"  # aba do navegador e busca (on_page_content)
        i = unidade.exercicios.index(e)
        if i + 1 < len(unidade.exercicios):
            outro = unidade.exercicios[i + 1]
            principal = ("Próximo nível", NOME_DO_NIVEL[outro.nivel], url(outro.src))
        else:
            principal = proxima or fim_da_trilha
        fim = proximo_passo(chave, "Marcar exercícios como concluídos", "Exercícios concluídos", principal=principal)
        visita = f"{unidade.titulo} · {nome}"
    else:
        nivel = (page.meta.get("tags") or [None])[0]
        antes = sobretitulo(f"{rotulo} {unidade.numero} de {tema.unidades[-1].numero}", tema.area)
        depois = (linha_de_informacoes(nivel, url_niveis, [f"~{unidade.minutos} min de leitura"], [("Sugerir melhoria", edicao)])
                  + segmentos([(_chave(files, u.src), u is unidade) for u in tema.unidades])
                  + '<div class="barra-leitura" aria-hidden="true"></div>')
        novo_titulo = None
        pratique = [(x.nivel, url(x.src), _chave(files, x.src), x.perguntas, x.exercicios) for x in unidade.exercicios]
        if pratique:
            fim = proximo_passo(chave, botao, feito, pratique=pratique, secundario=proxima)
        else:
            fim = proximo_passo(chave, botao, feito, principal=proxima or fim_da_trilha)
        visita = f"{rotulo} {unidade.numero} · {unidade.titulo}"
    if not pagina_do_tema:
        # Com o sobretítulo antes do "# Título", o MkDocs não acha mais o título da página (aba do navegador,
        # busca, topo da página ao rolar): ele é guardado aqui e reposto em on_page_content.
        h1 = re.search(r"^# (.*)$", markdown, re.M)
        if h1 and "titulo_da_pagina" not in page.meta:
            page.meta["titulo_da_pagina"] = re.sub(r"[`*]", "", ANCORA_DO_TITULO.sub("", h1.group(1))).strip()
        markdown = re.sub(r"^# (.*)$", lambda m: f"{antes}\n\n# {_titulo_visivel(m.group(1), novo_titulo)}\n\n{depois}\n",
                          markdown, count=1, flags=re.M)
        _esconder(page, "tags", "footer")  # o nível está na linha de informações; o próximo passo substitui o rodapé
    return f"{markdown.rstrip()}\n\n{marcador_de_visita(tema.slug, visita)}{fim}\n"


def _meu_progresso(page, files):
    """A página "Meu progresso": tudo aqui é preenchido pelo portal.js com o que está no navegador."""
    blocos, titulos = [], {}
    for tema in [t for _, temas in _temas_por_area() for t in temas]:
        blocos.append(progresso_do_tema(tema, _url(files, page, tema.src), [_chave(files, s) for s in tema.paginas]))
        for src, lugar in _estado["lugares"].items():
            if lugar.tema is not tema:
                continue
            if lugar.simulado:
                titulo = f"{lugar.simulado.titulo} · {tema.titulo}"
            elif lugar.exercicio:
                titulo = f"{lugar.unidade.titulo} · {NOME_DO_NIVEL[lugar.exercicio.nivel]}"
            else:
                titulo = f"{rotulo_da_unidade(lugar.unidade)} {lugar.unidade.numero} · {lugar.unidade.titulo}"
            titulos[_chave(files, src)] = titulo
    # Num atributo, e não num <script>: com navigation.instant o Material reexecuta os <script> do conteúdo.
    dados = html.escape(json.dumps(titulos, ensure_ascii=False), quote=True)
    return (
        f"{aviso_local()}\n\n## Resumo\n\n{resumo_estudo()}\n\n## Por tema\n\n"
        f'<div class="progresso-temas">{"".join(blocos)}</div>\n\n## Revisar\n\n{revisar()}\n\n'
        f'<div hidden data-titulos="{dados}"></div>\n\n'
        "<noscript><p>Esta página precisa de JavaScript para ler o seu progresso.</p></noscript>\n"
    )


def _inicio(page, files):
    """A home do site é só o portal: o README da raiz continua igual no GitHub."""
    t = totais(_estado["temas"])
    numeros = [(t["temas"], "temas"), (t["aulas"], "aulas e resumos"), (t["exercicios"], "exercícios"),
               (t["simulados"], "simulados")]
    continuar = bloco_continuar(_url(files, page, "conteudo/README.md"))
    return (
        f"{heroi(numeros, continuar)}\n\n## Explore por área\n\n{_areas(page, files)}\n\n"
        f"## Como estudar aqui\n\n{faixa_como_estudar(_url(files, page, 'simulados/README.md'))}\n"
    )


def on_config(config):
    # Na página "Por nível", os grupos seguem a ordem Iniciante → Intermediário → Avançado.
    tags = next(p for nome, p in config["plugins"].items() if nome.endswith("tags"))
    tags.config.listings_tags_sort_by = lambda tag, *_: NIVEIS.index(tag.name) if tag.name in NIVEIS else len(NIVEIS)
    return config


def on_files(files, config):
    _estado["temas"] = montar(config["docs_dir"])
    _estado["lugares"] = lugares(_estado["temas"])
    _estado["mais"] = {tema.slug: _mais_do_tema(tema, files) for tema in _estado["temas"]}
    for origem, destino in ARQUIVOS_DO_SITE.items():
        with open(os.path.join(os.path.dirname(__file__), origem), encoding="utf-8") as f:
            files.append(File.generated(config, destino, content=f.read(), inclusion=InclusionLevel.NOT_IN_NAV))
    files.append(File.generated(config, PAGINA_NIVEIS, content=CONTEUDO_NIVEIS, inclusion=InclusionLevel.INCLUDED))
    files.append(File.generated(config, PAGINA_PROGRESSO, content=f"# Meu progresso\n\n{MARCADOR_PROGRESSO}\n",
                                inclusion=InclusionLevel.INCLUDED))
    return files


def _nivel(markdown, page):
    """Tira a linha "**Nível:** ..." do texto e vira tag (o plugin de tags lê page.meta depois de nós)."""
    nivel = None
    m = NIVEL.search(markdown)
    if m:
        nivel = m.group(1)
        markdown = markdown[: m.start()] + markdown[m.end():]
    elif "/exercicios/" in page.file.src_uri:  # fácil, intermediário ou difícil pelo nome do arquivo
        nivel = NIVEL_DO_EXERCICIO.get(posixpath.splitext(posixpath.basename(page.file.src_uri))[0])
    if nivel:
        page.meta["tags"] = [nivel]
    return markdown


def on_page_markdown(markdown, page, config, files):
    markdown = _nivel(markdown, page)
    linhas = markdown.split("\n")
    linhas = _sem_navegacao_manual(linhas)
    linhas = _titulos_sem_emoji(linhas)
    linhas = _caixas(linhas)
    markdown = "\n".join(linhas)
    markdown = _exemplos(markdown)
    tema = next((t for t in _estado["temas"] if t.src == page.file.src_uri), None)
    if tema:
        markdown = _pagina_do_tema(markdown, tema, page, files)
    lugar = _estado["lugares"].get(page.file.src_uri)
    if lugar:
        markdown = _pagina_da_trilha(markdown, lugar, page, files)
    tema_da_pagina = _tema_da_pagina(_estado["temas"], page.file.src_uri)
    if tema_da_pagina:
        _menu_e_caminho(page, files, tema_da_pagina)
    if page.file.src_uri == "conteudo/README.md":  # a tabela de temas vira o catálogo do portal
        markdown = TABELA_INDICE.sub(lambda m: _catalogo(page, files) + "\n", markdown, count=1)
        page.meta["hide"] = ["toc"]  # o catálogo usa a largura toda
    markdown = _tabelas_indice(markdown, page, files)
    if page.file.src_uri.startswith("simulados/") and FOLHA_DE_PROVA.search(markdown):
        markdown = FOLHA_DE_PROVA.sub(_folha_de_prova, markdown)
        if page.file.src_uri.startswith("simulados/python/"):
            markdown = _editores(markdown)
    markdown = _corretores(markdown)
    markdown = VER_RESPOSTA.sub(r"[Ver resposta →](\1){ .md-button }", markdown)
    if page.file.src_uri == PAGINA_NIVEIS:
        markdown = markdown.replace(MARCADOR_NIVEIS, _por_nivel(page, files))
        page.meta["hide"] = ["toc"]
        page.edit_url = None
    if page.file.src_uri == PAGINA_PROGRESSO:
        markdown = markdown.replace(MARCADOR_PROGRESSO, _meu_progresso(page, files))
        page.meta["hide"] = ["navigation", "toc"]
        page.edit_url = None
    if page.file.src_uri == "README.md":
        markdown = _inicio(page, files)
        # Página inicial sem menu lateral nem índice: mais espaço para o hero e os cartões.
        page.meta["hide"] = ["navigation", "toc"]
        page.edit_url = None  # sem "editar"/"ver fonte": a home do site não é o README
    return markdown


def on_page_content(html, page, config, files):
    if page.file.src_uri == "README.md":
        page.title = "Início"
    lugar = _estado["lugares"].get(page.file.src_uri)
    if lugar and lugar.exercicio:
        html = _cartoes_de_exercicio(html)
        _indice_de_exercicios(page.toc)
    # Título da página guardado no _pagina_da_trilha. Nos exercícios, o título visível é só a aula ("Funções"),
    # mas a aba do navegador e a busca precisam do nível.
    if page.meta.get("titulo_da_pagina"):
        page.title = page.meta["titulo_da_pagina"]
    return html


def on_nav(nav, config, files):
    _estado["abas"] = abas_do_site(nav.items, TITULOS_DAS_ABAS)

    def limpar(itens):
        for item in itens:
            if isinstance(item, Section):
                item.title = sem_emoji(item.title)
                limpar(item.children)

    limpar(nav.items)
    return nav
