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
- monta a página inicial (hero + cartões);
- transforma a linha "**Nível:** ..." em tag e gera a página "Por nível".
"""

import html
import os
import posixpath
import re

from mkdocs.structure.files import File, InclusionLevel
from mkdocs.structure.nav import Section
from mkdocs.utils import get_relative_url
from pymdownx.slugs import slugify

from _catalogo import fora_de_codigo, lugares, montar, perguntas, totais
from _componentes import (
    EMOJI, NIVEIS, NIVEL, NIVEL_DO_EXERCICIO, bloco_continuar, cartao, cartao_tema, faixa_como_estudar, grade, heroi,
    plural, sem_emoji,
)

# Arquivos desta pasta publicados no site (o MkDocs ignora pastas que começam com ".").
ARQUIVOS_DO_SITE = {
    "site.css": "assets/stylesheets/site.css",
    "editor.js": "assets/javascripts/editor.js",
    "python-worker.js": "assets/javascripts/python-worker.js",
    "corretor.js": "assets/javascripts/corretor.js",
    "katex-init.js": "assets/javascripts/katex-init.js",
    "progresso.js": "assets/javascripts/progresso.js",
    "cronometro.js": "assets/javascripts/cronometro.js",
    "portal.js": "assets/javascripts/portal.js",
}
PAGINA_NIVEIS = "niveis.md"
CONTEUDO_NIVEIS = """# Por nível

Todo o conteúdo, do mais simples ao mais avançado. Os exercícios seguem a mesma escala:
**fácil** é Iniciante, **intermediário** é Intermediário e **difícil** é Avançado.

<!-- material/tags -->
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


def _sem_navegacao_manual(linhas):
    # Só olha o começo da página, onde ficam os "← voltar".
    for i, linha in list(fora_de_codigo(linhas))[:8]:
        if not linha.startswith(">") or "←" not in linha and "Próximo:" not in linha:
            continue
        partes = [p.strip() for p in linha.lstrip("> ").split(" · ")]
        restantes = [p for p in partes if "←" not in p and not p.startswith("Próximo:") and "→]" not in p]
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


def _temas(page, files):
    """A grade de cartões de tema (home e Conteúdo) e o link para "Por nível"."""
    cartoes = [
        cartao_tema(tema, _url(files, page, tema.src), [_chave(files, src) for src in tema.paginas], _numeros_do_tema(tema))
        for tema in _estado["temas"]
    ]
    return (f'<div class="temas">{"".join(cartoes)}</div>\n\n'
            f'<p class="temas-rodape"><a href="{_url(files, page, PAGINA_NIVEIS)}">Ver todo o conteúdo por nível →</a></p>')


def _inicio(page, files):
    """A home do site é só o portal: o README da raiz continua igual no GitHub."""
    t = totais(_estado["temas"])
    numeros = [(t["temas"], "temas"), (t["aulas"], "aulas e resumos"), (t["exercicios"], "exercícios"),
               (t["simulados"], "simulados")]
    continuar = bloco_continuar(_url(files, page, "conteudo/README.md"))
    return (
        f"{heroi(numeros, continuar)}\n\n## Temas\n\n{_temas(page, files)}\n\n"
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
    for origem, destino in ARQUIVOS_DO_SITE.items():
        with open(os.path.join(os.path.dirname(__file__), origem), encoding="utf-8") as f:
            files.append(File.generated(config, destino, content=f.read(), inclusion=InclusionLevel.NOT_IN_NAV))
    files.append(File.generated(config, PAGINA_NIVEIS, content=CONTEUDO_NIVEIS, inclusion=InclusionLevel.INCLUDED))
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
    if page.file.src_uri == "conteudo/README.md":  # a tabela de temas vira o catálogo do portal
        markdown = TABELA_INDICE.sub(lambda m: _temas(page, files) + "\n", markdown, count=1)
    markdown = _tabelas_indice(markdown, page, files)
    if page.file.src_uri.startswith("simulados/") and FOLHA_DE_PROVA.search(markdown):
        markdown = FOLHA_DE_PROVA.sub(_folha_de_prova, markdown)
        if page.file.src_uri.startswith("simulados/python/"):
            markdown = _editores(markdown)
    markdown = _corretores(markdown)
    markdown = VER_RESPOSTA.sub(r"[Ver resposta →](\1){ .md-button }", markdown)
    if page.file.src_uri == "README.md":
        markdown = _inicio(page, files)
        # Página inicial sem menu lateral nem índice: mais espaço para o hero e os cartões.
        page.meta["hide"] = ["navigation", "toc"]
        page.edit_url = None  # sem "editar"/"ver fonte": a home do site não é o README
    return markdown


def on_page_content(html, page, config, files):
    # O título completo ("Condicionais · Fácil") fica: ele aparece sozinho na página "Por nível".
    if page.file.src_uri == "README.md":
        page.title = "Início"
    return html


def on_nav(nav, config, files):
    def limpar(itens):
        for item in itens:
            if isinstance(item, Section):
                item.title = sem_emoji(item.title)
                limpar(item.children)

    limpar(nav.items)
    return nav
