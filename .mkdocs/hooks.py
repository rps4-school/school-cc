"""Hooks do MkDocs que publicam o repositório inteiro, e não só os .md.

- Toda pasta sem README.md ganha uma página de listagem gerada.
- Pastas com README.md ganham a seção "Outros arquivos" quando têm arquivos
  que não são .md (PDFs, imagens...).
- Cada .py vira uma página com o código colorido, um botão de download e um
  link para o enunciado que aponta para ele.
- Links para pastas e para .py são reescritos no build, então o Markdown
  continua funcionando igual no GitHub.
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

from _catalogo import agrupar_por_area, temas_do_indice
from _componentes import COR_DO_NIVEL, NIVEL, NIVEL_DO_EXERCICIO, area_slug, cartao, grade, sem_emoji

# Nomes de pasta sem README e que precisam de acento ou de um nome melhor.
TITULOS = {
    "exercicios": "Exercícios",
    "enunciados": "Enunciados",
    "respostas": "Respostas",
    "resumos": "Resumos",
    "aulas": "Aulas",
    "materiais": "Materiais",
    "facil": "Fácil",
    "intermediario": "Intermediário",
    "dificil": "Difícil",
    # Assuntos dos exercícios de Sistemas Digitais (o número da pasta sai antes de consultar).
    "analogico-e-digital": "Analógico e digital",
    "binario": "Binário",
    "codificacao": "Codificação",
    "adicao-binaria": "Adição binária",
    "numeros-negativos": "Números negativos",
    "algebra-booleana": "Álgebra booleana",
    "circuitos": "Circuitos",
    "karnaugh": "Mapa de Karnaugh",
    "eletronica": "Introdução à eletrônica",
    "lei-de-ohm": "Lei de Ohm",
    "serie-e-paralelo": "Série e paralelo",
    "protoboard": "Protoboard e medição",
    "componentes": "Componentes eletrônicos",
    "arduino-uno": "Arduino Uno",
    "programacao-arduino": "Programação Arduino",
    "saidas-digitais": "Saídas digitais",
    "sistemas-digitais": "Sistemas Digitais",  # pasta dos simulados
    # Assuntos dos exercícios de Python que precisam de acento.
    "dicionarios": "Dicionários",
    # Assuntos dos exercícios de Cálculo.
    "calculo": "Cálculo",  # pasta dos simulados
    "funcoes": "Funções",
    "limites-no-infinito": "Limites no infinito",
    "regras-de-derivacao": "Regras de derivação",
    "aplicacoes-da-derivada": "Aplicações da derivada",
    "bissecao": "Bisseção",
    "metodo-de-newton": "Método de Newton",
    "integral-definida": "Integral definida",
}

# Pastas de apoio (ex.: imagens usadas nas páginas): os arquivos são publicados,
# mas a pasta não ganha página de listagem nem aparece no menu.
PASTAS_OCULTAS = {"img"}

# Abas do topo, nesta ordem (o que não estiver aqui vai para o fim, em ordem alfabética).
# "Colabore" junta as páginas de quem contribui; "Por nível" (niveis.md) fica dentro de Conteúdo.
ORDEM_TOPO = ["README.md", "conteudo", "simulados", "progresso.md", "Colabore"]
COLABORE = ["GUIA-DE-ACESSO.md", "CONTRIBUTING.md"]

ORDEM_NIVEIS = {"facil": 1, "intermediario": 2, "dificil": 3}

LINK = re.compile(r"(\]\()(?!https?:|mailto:|#)([^)\s#]+)(#[^)\s]*)?(\))")
H1 = re.compile(r"^#\s+(.+)$", re.M)

_estado = {}
_slug = slugify(case="lower")  # o mesmo do mkdocs.yml (ids iguais aos do GitHub)


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
    if nome in TITULOS:
        return TITULOS[nome]
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


# Pastas que mudaram de nome: os endereços antigos continuam funcionando (o build grava neles uma página
# que redireciona). Antigo -> novo, como prefixo do endereço publicado.
REDIRECIONAMENTOS = {"conteudo/python/resumos/": "conteudo/python/aulas/"}


def _redirecionamentos(urls, mapa):
    """[(endereço antigo, destino relativo a ele)] de cada página publicada num prefixo novo. Não redireciona
    um endereço que ainda tem página."""
    publicados = set(urls)
    saida = []
    for antigo, novo in mapa.items():
        for url in sorted(u for u in publicados if u.startswith(novo)):
            velho = antigo + url[len(novo):]
            if velho not in publicados:
                saida.append((velho, posixpath.relpath(url, velho) + "/"))
    return saida


def _pagina_de_redirecionamento(destino):
    d = html.escape(destino, quote=True)
    return (
        '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>Esta página mudou de endereço</title>\n'
        f'<meta name="robots" content="noindex">\n<link rel="canonical" href="{d}">\n'
        f'<meta http-equiv="refresh" content="0; url={d}">\n'
        f"<script>location.replace({json.dumps(destino)} + location.hash)</script>\n</head>\n"
        f'<body><p>Esta página mudou de endereço: <a href="{d}">abrir a página nova</a>.</p></body>\n</html>\n'
    )


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
    texto = re.sub(r"^\s*\$\$.*?\$\$\s*$", "", texto, flags=re.S | re.M)  # e fórmulas em bloco
    for linha in texto.splitlines():
        linha = linha.strip()
        if linha and not linha.startswith(("#", ">", "|", "-", "!", "<", "`", "*", "[")) and not linha[0].isdigit():
            return _cortar_resumo(linha)
    return "Página"


# Fórmula no meio do texto, com o "$" colado como no arithmatex: $x^2$ sim, R$ 12,00 não.
FORMULA = re.compile(r"(?<![\\$])\$(?=\S)([^$\n]+?)(?<=\S)\$(?!\$)")


def _cortar_resumo(linha, limite=90):
    """Texto limpo de ~90 caracteres. As fórmulas viram spans que o katex-init.js desenha e nunca são cortadas."""
    formulas = [f.replace("\\dfrac", "\\frac") for f in FORMULA.findall(linha)]  # fração baixa, no tamanho do texto
    linha = FORMULA.sub("\0", linha)
    linha = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", linha)
    linha = re.sub(r"\s*<https?://[^>]+>", "", linha)
    pedacos = sem_emoji(re.sub(r"[*`_]", "", linha)).split("\0")  # texto, fórmula, texto, fórmula...
    saida, tamanho = "", 0
    for i, texto in enumerate(pedacos):
        if tamanho + len(texto) > limite:
            return (saida + texto[: max(0, limite - 3 - tamanho)].rsplit(" ", 1)[0]).rstrip(" ,;:.") + "…"
        saida, tamanho = saida + texto, tamanho + len(texto)
        if i < len(formulas):
            if tamanho + len(formulas[i]) > limite:
                return saida.rstrip(" ,;:.") + "…"
            saida += f'<span class="arithmatex">\\({html.escape(formulas[i], quote=False)}\\)</span>'
            tamanho += len(formulas[i])
    return saida


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


EXERCICIO = re.compile(r"^Exercício (\d+): (.+)$")


def _pagina_do_py(src_py, codigo, enunciado):
    """Página de um .py. enunciado: (src do .md, âncora, título da seção) de quem aponta para ele, ou None.
    Resposta de "## Exercício NN: Título": o título é o do exercício (o arquivo fica no cabeçalho do código) e o
    front matter diz ao visual.py qual é o enunciado (menu da trilha e caminho) e o sobretítulo, que ele põe no
    HTML depois da busca indexar a página."""
    nome = posixpath.basename(src_py)
    pasta = posixpath.dirname(src_py)
    codigo = [f'````python title="{nome}" linenums="1"', codigo.rstrip("\n"), "````", "", f"Para rodar no terminal: `python3 {nome}`", ""]
    exercicio = EXERCICIO.match(enunciado[2]) if enunciado else None
    if exercicio:
        numero, titulo = exercicio.groups()
        voltar = f"{posixpath.relpath(enunciado[0], pasta)}#{enunciado[1]}"
        return "\n".join([
            "---",
            f"title: {json.dumps('Resposta: ' + sem_emoji(re.sub(r'[`*]', '', titulo)), ensure_ascii=False)}",
            f"resposta_de: {json.dumps(enunciado[0], ensure_ascii=False)}",
            f"sobretitulo: {json.dumps(f'Resposta · Exercício {numero}', ensure_ascii=False)}",
            "---",
            "",
            f"# {titulo}",
            "",
            f"[← Voltar ao enunciado]({voltar}){{ .md-button }} [⤓ Baixar .py]({nome}){{ .md-button .md-button--primary download }}",
            "",
            *codigo,
        ])
    botoes = []
    if enunciado:
        botoes.append(f"[← Ver enunciado]({posixpath.relpath(enunciado[0], pasta)}#{enunciado[1]}){{ .md-button }}")
    botoes.append(f"[Baixar {nome}]({nome}){{ .md-button .md-button--primary download }}")
    return "\n".join([f"# {nome}", "", " ".join(botoes), "", *codigo])


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
                ancora = _slug(re.sub(r"[`*_]", "", titulo), "-")
                for _, alvo, _, _ in LINK.findall(secao):
                    if alvo.endswith(".py"):
                        py = posixpath.normpath(posixpath.join(posixpath.dirname(f.src_uri), alvo))
                        enunciado_de.setdefault(py, (f.src_uri, ancora, titulo))

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
            files.append(File.generated(config, src, content=conteudo, inclusion=_inclusao_do_gerado(src)))

        for nome in arquivos:
            if nome.endswith(".py"):
                src_py = posixpath.join(pasta, nome)
                src_md = src_py[:-3] + ".md"
                if files.get_file_from_path(src_md):
                    continue  # já existe um .md com esse nome; não sobrescreve
                with open(os.path.join(docs_dir, src_py), encoding="utf-8") as f:
                    codigo = f.read()
                pagina = _pagina_do_py(src_py, codigo, enunciado_de.get(src_py))
                files.append(File.generated(config, src_md, content=pagina, inclusion=_inclusao_do_gerado(src_md)))
                e["py_paginas"][src_py] = src_md
                e["gerados_py"].add(src_md)
    e["urls"] = [f.url for f in files.documentation_pages()]
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


def _pasta_da_secao(secao):
    """A pasta de uma seção do menu: a do primeiro arquivo dentro dela."""
    for filho in secao.children:
        arquivo = getattr(filho, "file", None)
        if arquivo is not None:
            return posixpath.dirname(arquivo.src_uri)
        if isinstance(filho, Section):
            sub = _pasta_da_secao(filho)
            if sub is not None:
                return posixpath.dirname(sub)
    return None


# Dentro de um tema, o conteúdo vem antes dos exercícios (o resto mantém a ordem, depois deles).
ORDEM_NO_TEMA = {"aulas": 1, "resumos": 2, "exercicios": 3}


def _nome_da_pasta(item):
    return posixpath.basename(_pasta_da_secao(item) or "") if isinstance(item, Section) else None


def _limpar_tema(tema):
    """Menu do Material dentro de um tema: página do tema, aulas, resumos, exercícios e o resto. A seção
    "Enunciados" sai e os assuntos dela sobem para "Exercícios" (as respostas já ficam fora do menu)."""
    def ordem(item):
        arquivo = getattr(item, "file", None)
        if arquivo is not None:
            return 0 if posixpath.basename(arquivo.src_uri) in ("README.md", "index.md") else 9
        return ORDEM_NO_TEMA.get(_nome_da_pasta(item), 9)

    tema.children.sort(key=ordem)
    for exercicios in (f for f in tema.children if _nome_da_pasta(f) == "exercicios"):
        filhos = []
        for item in exercicios.children:
            if _nome_da_pasta(item) != "enunciados":
                filhos.append(item)
                continue
            for assunto in item.children:
                if getattr(assunto, "file", None) is not None and assunto.file.src_uri.endswith("/index.md"):
                    continue  # a listagem gerada da pasta "enunciados"
                assunto.parent = exercicios
                filhos.append(assunto)
        exercicios.children = filhos


def _inclusao_do_gerado(src):
    """As respostas dos exercícios (e as listagens das pastas delas) ficam fora do menu: o aluno chega pelo
    botão "Ver resposta". Continuam publicadas e na busca."""
    if src.startswith("conteudo/") and "/respostas/" in src:
        return InclusionLevel.NOT_IN_NAV
    return InclusionLevel.INCLUDED


def _agrupar_por_area(conteudo, docs_dir, pasta_da_secao):
    """Dentro de Conteúdo, os temas ficam em seções por área (Programação > Python, Git...), na ordem da
    tabela de conteudo/README.md. As pastas e os endereços das páginas não mudam."""
    temas, paginas_de_area = {}, {}
    for item in conteudo.children:
        pasta = pasta_da_secao(item) if isinstance(item, Section) else None
        if pasta and pasta.count("/") >= 1:
            slug = pasta.split("/")[1]
            if os.path.isdir(os.path.join(docs_dir, "conteudo", slug)):
                temas[slug] = item
            else:  # conteudo/<área>/index.md, gerada pelo visual.py: vira o índice da seção da área
                paginas_de_area[slug] = item
    indice = temas_do_indice(docs_dir)
    ordem = [s for s in indice if s in temas] + sorted(s for s in temas if s not in indice)
    areas = []
    for area, slugs in agrupar_por_area(ordem):
        indice = paginas_de_area.get(area_slug(area))
        secao = Section(area, (indice.children if indice else []) + [temas[s] for s in slugs])
        secao.parent = conteudo
        for tema in secao.children:
            tema.parent = secao
        areas.append(secao)
    resto = [i for i in conteudo.children if i not in temas.values() and i not in paginas_de_area.values()]
    conteudo.children = [i for i in resto if getattr(i, "file", None) is not None and i.file.src_uri == "conteudo/README.md"]
    conteudo.children += areas + [i for i in resto if i not in conteudo.children]


def on_nav(nav, config, files):
    docs_dir = config["docs_dir"]
    pasta_da_secao = _pasta_da_secao

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

    def nome(item):
        arquivo = getattr(item, "file", None)
        if arquivo is not None:
            return arquivo.src_uri
        return item.title if item.title == "Colabore" else (pasta_da_secao(item) or "").split("/")[0]

    por_nome = {nome(i): i for i in nav.items}
    colabore = [por_nome[s] for s in COLABORE if s in por_nome]
    if colabore:
        secao = Section("Colabore", colabore)
        for pagina in colabore:
            pagina.parent = secao
        nav.items = [i for i in nav.items if i not in colabore] + [secao]
    niveis, conteudo = por_nome.get("niveis.md"), por_nome.get("conteudo")
    if conteudo is not None:
        _agrupar_por_area(conteudo, docs_dir, pasta_da_secao)
        for area in (i for i in conteudo.children if isinstance(i, Section)):
            for tema in (i for i in area.children if isinstance(i, Section)):
                _limpar_tema(tema)
    if niveis is not None and conteudo is not None:
        nav.items.remove(niveis)
        conteudo.children.append(niveis)
        niveis.parent = conteudo

    fora = len(ORDEM_TOPO)
    nav.items.sort(key=lambda i: (ORDEM_TOPO.index(nome(i)) if nome(i) in ORDEM_TOPO else fora, nome(i)))

    # Anterior/próxima (rodapé) na ordem final do menu, e não na ordem em que o MkDocs leu as pastas.
    def paginas(itens):
        for item in itens:
            if isinstance(item, Section):
                yield from paginas(item.children)
            elif getattr(item, "file", None) is not None:
                yield item

    nav.pages = list(paginas(nav.items))
    for i, pagina in enumerate(nav.pages):
        pagina.previous_page = nav.pages[i - 1] if i else None
        pagina.next_page = nav.pages[i + 1] if i + 1 < len(nav.pages) else None
    return nav


def on_post_build(config):
    for velho, destino in _redirecionamentos(_estado.get("urls", []), REDIRECIONAMENTOS):
        caminho = os.path.join(config["site_dir"], velho, "index.html")
        if os.path.exists(caminho):
            continue
        os.makedirs(os.path.dirname(caminho), exist_ok=True)
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(_pagina_de_redirecionamento(destino))
