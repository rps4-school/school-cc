"""Hook de apresentação: deixa o site uniforme sem mudar o Markdown do GitHub.

Roda depois do hooks.py (ordem em mkdocs.yml). Tudo aqui é só visual:
- publica o CSS compilado (.mkdocs/site.css, gerado pelo Tailwind);
- tira a navegação manual ("← voltar", "Próximo:"): o site já tem trilha e rodapé;
- tira os emojis dos títulos, mantendo o mesmo id de âncora do GitHub;
- troca citações com 💡 / ⚠️ / 📖 por caixas de dica, atenção e leitura;
- mostra Entrada e Saída dos exercícios lado a lado;
- transforma "✅ Ver resposta" em botão;
- nos simulados, põe um editor de Python (editor.js) antes da resposta de cada questão;
- monta a página inicial (hero + cartões);
- transforma a linha "**Nível:** ..." em tag e gera a página "Por nível".
"""

import os
import posixpath
import re

from mkdocs.structure.files import File, InclusionLevel
from mkdocs.structure.nav import Section
from mkdocs.utils import get_relative_url
from pymdownx.slugs import slugify

from _componentes import EMOJI, NIVEIS, NIVEL, NIVEL_DO_EXERCICIO, cartao, grade, sem_emoji

# Arquivos desta pasta publicados no site (o MkDocs ignora pastas que começam com ".").
ARQUIVOS_DO_SITE = {
    "site.css": "assets/stylesheets/site.css",
    "editor.js": "assets/javascripts/editor.js",
    "python-worker.js": "assets/javascripts/python-worker.js",
}
PAGINA_NIVEIS = "niveis.md"
CONTEUDO_NIVEIS = """# Por nível

Todo o conteúdo, do mais simples ao mais avançado. Os exercícios seguem a mesma escala:
**fácil** é Iniciante, **intermediário** é Intermediário e **difícil** é Avançado.

<!-- material/tags -->
"""

_slug = slugify(case="lower")  # o mesmo do mkdocs.yml, que imita o GitHub

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


def _fora_de_codigo(linhas):
    """Gera (índice, linha) só das linhas que não estão dentro de blocos de código."""
    cerca = None
    for i, linha in enumerate(linhas):
        m = CERCA.match(linha.lstrip())
        if m:
            if cerca is None:
                cerca = m.group(1)
            elif m.group(1).startswith(cerca[0]) and len(m.group(1)) >= len(cerca):
                cerca = None
            continue
        if cerca is None:
            yield i, linha


def _sem_navegacao_manual(linhas):
    # Só olha o começo da página, onde ficam os "← voltar".
    for i, linha in list(_fora_de_codigo(linhas))[:8]:
        if not linha.startswith(">") or "←" not in linha and "Próximo:" not in linha:
            continue
        partes = [p.strip() for p in linha.lstrip("> ").split(" · ")]
        restantes = [p for p in partes if "←" not in p and not p.startswith("Próximo:") and "→]" not in p]
        linhas[i] = "> " + " · ".join(restantes) if restantes else ""
    return linhas


def _titulos_sem_emoji(linhas):
    for i, linha in _fora_de_codigo(linhas):
        m = TITULO.match(linha)
        if m and EMOJI.search(m.group(2)):
            texto = m.group(2)
            ancora = _slug(re.sub(r"[`*_]", "", texto), "-")
            linhas[i] = f"{m.group(1)} {sem_emoji(texto)} {{ #{ancora} }}"
    return linhas


def _caixas(linhas):
    saida, i = [], 0
    dentro = {j for j, _ in _fora_de_codigo(linhas)}
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
        "<script>(function(){document.querySelectorAll('[data-cronometro]').forEach(function(caixa){"
        "var total=+caixa.dataset.cronometro*60,resto=total,relogio=null;"
        "var visor=caixa.querySelector('.visor'),iniciar=caixa.querySelector('.iniciar'),zerar=caixa.querySelector('.zerar');"
        "function mostrar(){var h=Math.floor(resto/3600),m=Math.floor(resto%3600/60),s=resto%60;"
        "visor.textContent=h+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');"
        "visor.classList.toggle('text-rose-600',resto<=300);}"
        "iniciar.onclick=function(){if(relogio){clearInterval(relogio);relogio=null;iniciar.textContent='Continuar';return;}"
        "iniciar.textContent='Pausar';relogio=setInterval(function(){if(resto>0){resto--;mostrar();}"
        "else{clearInterval(relogio);relogio=null;visor.textContent='Tempo esgotado!';iniciar.disabled=true;}},1000);};"
        "zerar.onclick=function(){clearInterval(relogio);relogio=null;resto=total;iniciar.textContent='Iniciar';"
        "iniciar.disabled=false;mostrar();};mostrar();});})();</script>"
    )


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


def _inicio(markdown, page, files):
    # Tira o título, a introdução e o aviso "Leia no site" (redundante aqui).
    markdown = re.sub(r"\A# .+?\n\n.+?\n\n", "", markdown, flags=re.S)
    markdown = re.sub(r"^> 🌐 \*\*Leia no site:\*\*.*\n\n?", "", markdown, flags=re.M)
    # "Primeiros passos", "Conteúdo" e "Simulados" são o que o hero e os cartões já mostram.
    for secao in ("Primeiros passos", "Conteúdo", "Simulados"):
        markdown = re.sub(rf"^## [^\n]*{secao}[^\n]*\n.*?(?=^## )", "", markdown, flags=re.S | re.M)
    heroi = (
        '<div class="clear-both mb-10 overflow-hidden rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50 '
        "via-white to-sky-50 px-6 py-10 sm:px-10 sm:py-14 dark:border-white/10 dark:from-indigo-500/15 "
        'dark:via-transparent dark:to-sky-500/10">'
        '<span class="inline-block rounded-full bg-indigo-600/10 px-3 py-1 text-[0.62rem] font-semibold uppercase '
        'tracking-wider text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200">Ciência da Computação · De aluno para aluno</span>'
        '<h1 class="mt-4 mb-3 text-[1.7rem] leading-tight font-extrabold tracking-tight text-slate-900 sm:text-[2.2rem] '
        'dark:text-white">Material de estudo, em um só lugar</h1>'
        '<p class="m-0 max-w-2xl text-[0.85rem] leading-relaxed text-slate-600 dark:text-slate-300">Resumos curtos, '
        "exercícios com resposta comentada e guias práticos, organizados por tema.</p>"
        '<div class="mt-7 flex flex-wrap gap-3">'
        f'<a class="md-button md-button--primary" href="{_url(files, page, "conteudo/README.md")}">Começar a estudar</a>'
        f'<a class="md-button" href="{_url(files, page, "GUIA-DE-ACESSO.md")}">Primeiro acesso</a>'
        "</div></div>"
    )
    cartoes = grade([
        cartao(_url(files, page, "conteudo/python/README.md"), "Python",
               "Resumos e 27 exercícios com resposta", "codigo"),
        cartao(_url(files, page, "conteudo/git/README.md"), "Git",
               "Comandos, branches e como desfazer erros", "ferramenta"),
        cartao(_url(files, page, "GUIA-DE-ACESSO.md"), "Guia de Acesso",
               "Conta, chave SSH, commits assinados e PR", "chave"),
        cartao(_url(files, page, "simulados/README.md"), "Simulados",
               "Provas de treino com tempo, pontuação e cronômetro", "relogio"),
        cartao(_url(files, page, "niveis.md"), "Por nível",
               "Todo o conteúdo, do iniciante ao avançado", "livro"),
        cartao(_url(files, page, "CONTRIBUTING.md"), "Como contribuir",
               "Onde colocar cada coisa e padrões de commit", "maos"),
    ])
    return f"{heroi}\n\n## Por onde começar\n\n{cartoes}\n\n{markdown}"


def on_config(config):
    # Na página "Por nível", os grupos seguem a ordem Iniciante → Intermediário → Avançado.
    tags = next(p for nome, p in config["plugins"].items() if nome.endswith("tags"))
    tags.config.listings_tags_sort_by = lambda tag, *_: NIVEIS.index(tag.name) if tag.name in NIVEIS else len(NIVEIS)
    return config


def on_files(files, config):
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
    elif "/enunciados/" in page.file.src_uri:
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
    markdown = _tabelas_indice(markdown, page, files)
    if page.file.src_uri.startswith("simulados/") and FOLHA_DE_PROVA.search(markdown):
        markdown = FOLHA_DE_PROVA.sub(_folha_de_prova, markdown)
        markdown = _editores(markdown)
    markdown = VER_RESPOSTA.sub(r"[Ver resposta →](\1){ .md-button }", markdown)
    if page.file.src_uri == "README.md":
        markdown = _inicio(markdown, page, files)
        # Página inicial sem menu lateral nem índice: mais espaço para o hero e os cartões.
        page.meta["hide"] = ["navigation", "toc"]
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
