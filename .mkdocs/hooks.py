"""Hooks do MkDocs que publicam o repositório inteiro, e não só os .md.

- Toda pasta sem README.md ganha uma página de listagem gerada.
- Pastas com README.md ganham a seção "Outros arquivos" quando têm arquivos
  que não são .md (PDFs, imagens...).
- Cada .py vira uma página com o código colorido, um botão de download e um
  link para o enunciado que aponta para ele.
- Links para pastas e para .py são reescritos no build, então o Markdown
  continua funcionando igual no GitHub.
"""

import os
import posixpath
import re

from mkdocs.structure.files import File, InclusionLevel
from mkdocs.structure.nav import Section
from mkdocs.utils import get_relative_url

from _componentes import COR_DO_NIVEL, NIVEL, NIVEL_DO_EXERCICIO, cartao, grade, sem_emoji

# Nomes de pasta sem README e que precisam de acento ou de um nome melhor.
TITULOS = {
    "exercicios": "Exercícios",
    "enunciados": "Enunciados",
    "respostas": "Respostas",
    "resumos": "Resumos",
    "materiais": "Materiais",
    "facil": "Fácil",
    "intermediario": "Intermediário",
    "dificil": "Difícil",
}

# Pastas de apoio (ex.: imagens usadas nas páginas): os arquivos são publicados,
# mas a pasta não ganha página de listagem nem aparece no menu.
PASTAS_OCULTAS = {"img"}

# Ordem das abas do topo. O que não estiver aqui fica no meio, em ordem alfabética.
ORDEM_TOPO_INICIO = ["README.md", "GUIA-DE-ACESSO.md"]
ORDEM_TOPO_FIM = ["niveis.md", "CONTRIBUTING.md"]

ORDEM_NIVEIS = {"facil": 1, "intermediario": 2, "dificil": 3}

LINK = re.compile(r"(\]\()(?!https?:|mailto:|#)([^)\s#]+)(#[^)\s]*)?(\))")
H1 = re.compile(r"^#\s+(.+)$", re.M)

_estado = {}


def _titulo_da_pasta(docs_dir, pasta):
    readme = os.path.join(docs_dir, pasta, "README.md")
    if os.path.exists(readme):
        with open(readme, encoding="utf-8") as f:
            achou = H1.search(f.read())
        if achou:
            return sem_emoji(achou.group(1))
    nome = posixpath.basename(pasta)
    if nome in TITULOS:
        return TITULOS[nome]
    nome = re.sub(r"^\d+-", "", nome)  # "01-condicionais" -> "condicionais"
    return nome.replace("-", " ").replace("_", " ").capitalize()


def _titulo_do_md(caminho):
    with open(caminho, encoding="utf-8") as f:
        achou = H1.search(f.read())
    return sem_emoji(achou.group(1)) if achou else os.path.basename(caminho)


def _ordem(nome):
    """Níveis em ordem didática (fácil, intermediário, difícil); o resto em ordem alfabética."""
    return (ORDEM_NIVEIS.get(posixpath.splitext(nome)[0], 0), nome)


def _indice(pasta, pastas_com_readme):
    """src_uri da página que representa a pasta (README ou listagem gerada)."""
    arquivo = "README.md" if pasta in pastas_com_readme else "index.md"
    return posixpath.join(pasta, arquivo) if pasta else arquivo


MARCADOR_LISTAGEM = "<!-- listagem-da-pasta -->"


def _pagina_da_pasta(pasta, docs_dir):
    """Só o título e um marcador: os cartões dependem das URLs finais e são montados em on_page_markdown."""
    return f"# {_titulo_da_pasta(docs_dir, pasta)}\n\n{MARCADOR_LISTAGEM}\n"


def _resumo_do_md(caminho):
    """Uma linha que diga o que tem na página: nº de exercícios ou o 1º parágrafo."""
    with open(caminho, encoding="utf-8") as f:
        texto = f.read()
    exercicios = len(re.findall(r"^## Exercício", texto, re.M))
    if exercicios:
        return f"{exercicios} exercício{'s' if exercicios > 1 else ''}"
    texto = NIVEL.sub("", texto)
    texto = re.sub(r"^(`{3,}|~{3,}).*?^\1\s*$", "", texto, flags=re.S | re.M)  # ignora blocos de código
    for linha in texto.splitlines():
        linha = linha.strip()
        if linha and not linha.startswith(("#", ">", "|", "-", "!", "<", "`", "*", "[")) and not linha[0].isdigit():
            linha = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", linha)
            linha = re.sub(r"\s*<https?://[^>]+>", "", linha)
            linha = sem_emoji(re.sub(r"[*`_]", "", linha))
            return linha if len(linha) <= 90 else linha[:87].rsplit(" ", 1)[0] + "…"
    return "Página"


def _descricao(nome, docs_dir, pasta):
    extensao = posixpath.splitext(nome)[1].lower()
    if extensao == ".md":
        return _resumo_do_md(os.path.join(docs_dir, pasta, nome))
    if extensao == ".py":
        return "Código Python"
    return f"Arquivo {extensao[1:].upper()}" if extensao else "Arquivo"


def _cartoes_da_pasta(page, files, docs_dir, e):
    pasta, subpastas, arquivos = e["listagens"][page.file.src_uri]
    if not subpastas and not arquivos:
        contribuir = files.get_file_from_path("CONTRIBUTING.md")
        link = get_relative_url(contribuir.url, page.url) if contribuir else "#"
        return (
            '<div class="my-6 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center '
            'text-slate-500 dark:border-white/15 dark:text-slate-400">'
            '<p class="m-0 font-semibold text-slate-700 dark:text-slate-200">Esta pasta ainda está vazia</p>'
            f'<p class="mt-1 mb-0 text-[0.72rem]">Tem material para compartilhar? <a href="{link}">Veja como contribuir</a>.</p></div>'
        )

    itens = []
    prefixo = _titulo_da_pasta(docs_dir, pasta) + " · "  # "Condicionais · Fácil" -> "Fácil" dentro de Condicionais
    for sub in sorted(subpastas, key=_ordem):
        caminho = posixpath.join(pasta, sub)
        destino = files.get_file_from_path(_indice(caminho, e["readmes"]))
        qtd = e["quantidade"].get(caminho, 0)
        descricao = f"{qtd} {'item' if qtd == 1 else 'itens'}"
        itens.append(cartao(get_relative_url(destino.url, page.url), _titulo_da_pasta(docs_dir, caminho),
                            descricao, "pasta", posixpath.splitext(sub)[0]))
    for nome in sorted(arquivos, key=_ordem):
        caminho = posixpath.join(pasta, nome)
        alvo = e["py_paginas"].get(caminho, caminho)
        destino = files.get_file_from_path(alvo)
        if destino is None:
            continue
        titulo = _titulo_do_md(os.path.join(docs_dir, caminho)) if nome.endswith(".md") else nome
        titulo = titulo[len(prefixo):] if titulo.startswith(prefixo) else titulo
        descricao = _descricao(nome, docs_dir, pasta)
        cor = posixpath.splitext(nome)[0]  # facil/intermediario/dificil já têm cor
        if nome.endswith(".md"):
            with open(os.path.join(docs_dir, caminho), encoding="utf-8") as f:
                achou = NIVEL.search(f.read())
            if achou:
                descricao = f"{achou.group(1)} · {descricao}"
                cor = COR_DO_NIVEL[achou.group(1)]
            elif cor in NIVEL_DO_EXERCICIO:
                descricao = f"{NIVEL_DO_EXERCICIO[cor]} · {descricao}"
        icone = "pagina" if nome.endswith(".md") else "codigo" if nome.endswith(".py") else "arquivo"
        itens.append(cartao(get_relative_url(destino.url, page.url), titulo, descricao, icone, cor))
    return grade(itens)


def _outros_arquivos(pasta, arquivos, docs_dir):
    linhas = ["", "---", "", "## Outros arquivos desta pasta", ""]
    linhas += [f"- [{nome}]({nome})" for nome in sorted(arquivos)]
    return "\n".join(linhas + [""])


def _pagina_do_py(src_py, codigo, enunciado):
    nome = posixpath.basename(src_py)
    pasta = posixpath.dirname(src_py)
    botoes = []
    if enunciado:
        botoes.append(f"[← Ver enunciado]({posixpath.relpath(enunciado[0], pasta)}#{enunciado[1]}){{ .md-button }}")
    botoes.append(f"[Baixar {nome}]({nome}){{ .md-button .md-button--primary download }}")
    return "\n".join([
        f"# {nome}",
        "",
        " ".join(botoes),
        "",
        f'````python title="{nome}" linenums="1"',
        codigo.rstrip("\n"),
        "````",
        "",
        f"Para rodar no terminal: `python3 {nome}`",
        "",
    ])


def on_files(files, config):
    docs_dir = config["docs_dir"]
    excluidos = {f.src_uri for f in files if f.inclusion.is_excluded()}

    readmes, pastas = set(), {}
    for raiz, dirs, nomes in os.walk(docs_dir):
        dirs[:] = sorted(d for d in dirs if not d.startswith((".", "_")) and d != "venv")
        rel = os.path.relpath(raiz, docs_dir).replace(os.sep, "/")
        rel = "" if rel == "." else rel
        visiveis = sorted(
            n for n in nomes
            if not n.startswith(".") and posixpath.join(rel, n).lstrip("/") not in excluidos
        )
        if "README.md" in visiveis:
            readmes.add(rel)
        pastas[rel] = (dirs, visiveis)

    # Descobre qual enunciado aponta para cada .py (para o link "Ver enunciado").
    enunciado_de = {}
    for f in files:
        if f.src_uri.endswith(".md") and not f.inclusion.is_excluded():
            texto = open(f.abs_src_path, encoding="utf-8").read()
            for secao in re.split(r"\n(?=## )", texto):
                titulo = secao.splitlines()[0].lstrip("# ").strip()
                ancora = re.sub(r"[^\w\- ]", "", titulo.lower()).strip().replace(" ", "-")
                for _, alvo, _, _ in LINK.findall(secao):
                    if alvo.endswith(".py"):
                        py = posixpath.normpath(posixpath.join(posixpath.dirname(f.src_uri), alvo))
                        enunciado_de.setdefault(py, (f.src_uri, ancora))

    e = _estado
    e.clear()
    e.update(readmes=readmes, pastas=set(pastas), py_paginas={}, gerados_py=set(), listagens={}, quantidade={})
    for pasta, (subpastas, arquivos) in pastas.items():
        e["quantidade"][pasta] = len([d for d in subpastas if d not in PASTAS_OCULTAS]) + len(arquivos)

    for pasta, (subpastas, arquivos) in pastas.items():
        subpastas = [d for d in subpastas if d not in PASTAS_OCULTAS]
        if posixpath.basename(pasta) in PASTAS_OCULTAS:
            continue
        if pasta in readmes:
            estaticos = [n for n in arquivos if not n.endswith((".md", ".py"))]
            if estaticos and pasta:  # na raiz, LICENSE já está linkado no README
                e.setdefault("extras", {})[posixpath.join(pasta, "README.md")] = _outros_arquivos(
                    pasta, estaticos, docs_dir
                )
        else:
            src = _indice(pasta, readmes)
            e["listagens"][src] = (pasta, subpastas, arquivos)
            conteudo = _pagina_da_pasta(pasta, docs_dir)
            files.append(File.generated(config, src, content=conteudo, inclusion=InclusionLevel.INCLUDED))

        for nome in arquivos:
            if nome.endswith(".py"):
                src_py = posixpath.join(pasta, nome)
                src_md = src_py[:-3] + ".md"
                if files.get_file_from_path(src_md):
                    continue  # já existe um .md com esse nome; não sobrescreve
                with open(os.path.join(docs_dir, src_py), encoding="utf-8") as f:
                    codigo = f.read()
                pagina = _pagina_do_py(src_py, codigo, enunciado_de.get(src_py))
                files.append(File.generated(config, src_md, content=pagina, inclusion=InclusionLevel.INCLUDED))
                e["py_paginas"][src_py] = src_md
                e["gerados_py"].add(src_md)
    return files


def on_page_markdown(markdown, page, config, files):
    e = _estado
    src = page.file.src_uri
    pasta = posixpath.dirname(src)

    if src in e.get("extras", {}):
        markdown += e["extras"][src]

    if src in e["listagens"]:
        markdown = markdown.replace(MARCADOR_LISTAGEM, _cartoes_da_pasta(page, files, config["docs_dir"], e))

    # No GitHub o Markdown dentro de <details> é renderizado; aqui precisa do atributo.
    markdown = markdown.replace("<details>", '<details markdown="1">')

    if src in e["gerados_py"]:
        return markdown  # o link de download precisa continuar apontando para o .py

    def trocar(m):
        antes, alvo, ancora, depois = m.groups()
        destino = posixpath.normpath(posixpath.join(pasta, alvo))
        destino = "" if destino == "." else destino
        if alvo.endswith("/") or destino in e["pastas"]:
            if destino in e["pastas"]:
                novo = _indice(destino, e["readmes"])
                return f"{antes}{posixpath.relpath(novo, pasta or '.')}{ancora or ''}{depois}"
        if destino in e["py_paginas"]:
            novo = e["py_paginas"][destino]
            return f"{antes}{posixpath.relpath(novo, pasta or '.')}{ancora or ''}{depois}"
        return m.group(0)

    return LINK.sub(trocar, markdown)


def on_nav(nav, config, files):
    docs_dir = config["docs_dir"]

    def pasta_da_secao(secao):
        for filho in secao.children:
            arquivo = getattr(filho, "file", None)
            if arquivo is not None:
                return posixpath.dirname(arquivo.src_uri)
            if isinstance(filho, Section):
                sub = pasta_da_secao(filho)
                if sub is not None:
                    return posixpath.dirname(sub)
        return None

    def ordem_nivel(item):
        # Níveis em ordem didática, e não alfabética. O resto mantém a ordem (sort é estável).
        arquivo = getattr(item, "file", None)
        if arquivo is not None:
            nome = posixpath.splitext(posixpath.basename(arquivo.src_uri))[0]
            if nome in ("README", "index"):
                return -1
        else:
            nome = posixpath.basename(pasta_da_secao(item) or "")
        return ORDEM_NIVEIS.get(nome, 0)

    def renomear(itens):
        itens.sort(key=ordem_nivel)
        for item in itens:
            if isinstance(item, Section):
                pasta = pasta_da_secao(item)
                if pasta:
                    item.title = _titulo_da_pasta(docs_dir, pasta)
                renomear(item.children)

    renomear(nav.items)

    def chave(item):
        arquivo = getattr(item, "file", None)
        nome = arquivo.src_uri if arquivo is not None else (pasta_da_secao(item) or "").split("/")[0]
        if nome in ORDEM_TOPO_INICIO:
            return (0, ORDEM_TOPO_INICIO.index(nome), "")
        if nome in ORDEM_TOPO_FIM:
            return (2, ORDEM_TOPO_FIM.index(nome), "")
        return (1, 0, nome)

    nav.items.sort(key=chave)
    return nav
