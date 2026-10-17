"""Catálogo do portal: temas, trilhas e contagens, lidos do Markdown uma vez por build.

Só dados, sem HTML. As fontes são as tabelas que quem contribui já mantém:
- conteudo/README.md: os temas e a descrição de cada um;
- a tabela "| # | Aula | ..." do README de cada tema: a trilha (aula, nível, descrição, exercícios);
- simulados/README.md: os simulados de cada tema, com nível e duração.
"""

import os
import posixpath
import re
from dataclasses import dataclass, field
from typing import Optional

from _componentes import NIVEIS, NIVEL, NIVEL_DO_EXERCICIO, sem_emoji

# Área e ícone (de _componentes.ICONES) de cada pasta de conteudo/. Tema novo sem entrada aqui
# aparece mesmo assim, em "Outros".
TEMAS = {
    "python": ("Programação", "codigo"),
    "git": ("Engenharia de Software", "ferramenta"),
    "calculo": ("Matemática", "integral"),
    "sistemas-digitais": ("Hardware", "chip"),
}
AREA_PADRAO = ("Outros", "pasta")

# Pergunta com corretor: dentro do <details>, a primeira linha "**Resposta:** `...`" (ou Número...).
RESPOSTA = re.compile(r"^\*\*(Resposta|Expressão|Expressão mínima|Número|Função|Primitiva):\*\* `([^`]+)`", re.M)
TIPOS_DE_RESPOSTA = {
    "Resposta": "valor", "Expressão": "expressao", "Expressão mínima": "minima",
    "Número": "numero", "Função": "funcao", "Primitiva": "primitiva",
}

CERCA = re.compile(r"^(`{3,}|~{3,})")
LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
LINHA_COM_LINK_EM_NEGRITO = re.compile(r"^\| \[\*\*([^\]]+)\*\*\]\(([^)]+)\) \|(.*)\|\s*$", re.M)
# A tabela da trilha: cabeçalho começando com "| # |", separador e as linhas.
TABELA_ROTEIRO = re.compile(r"^\|\s*#\s*\|.*\|[ \t]*\n\|[ :|-]+\|[ \t]*\n(?:\|.*\|[ \t]*(?:\n|$))+", re.M)
# Nome da coluna -> o que ela é. A unidade é a 1ª coluna com link (Aula, Resumo ou Arquivo).
COLUNAS = {
    "unidade": ("aula", "resumo", "arquivo"),
    "nivel": ("nível",),
    "descricao": ("o que você aprende", "você vai aprender"),
    "exercicios": ("exercícios",),
}
PALAVRAS_POR_MINUTO = 200


@dataclass
class Exercicio:
    nivel: str  # facil, intermediario ou dificil
    src: str
    exercicios: int  # seções "## Exercício"
    perguntas: int  # perguntas com corretor


@dataclass
class Unidade:
    numero: str
    titulo: str
    src: str
    descricao: str
    nivel: Optional[str]
    minutos: int
    exercicios: list = field(default_factory=list)


@dataclass
class Simulado:
    titulo: str
    src: str
    nivel: Optional[str]
    duracao: str
    perguntas: int


@dataclass
class Tema:
    slug: str
    titulo: str
    descricao: str
    area: str
    icone: str
    nivel: Optional[str]
    src: str
    unidades: list = field(default_factory=list)
    simulados: list = field(default_factory=list)

    @property
    def total_exercicios(self):
        return sum(e.exercicios for u in self.unidades for e in u.exercicios)

    @property
    def paginas(self):
        """Páginas que contam no progresso do tema, na ordem da trilha: cada unidade e os seus exercícios."""
        return [src for u in self.unidades for src in [u.src] + [e.src for e in u.exercicios]]


@dataclass
class Lugar:
    """Onde uma página fica no catálogo (para a linha de informações e o fim da página)."""
    tema: Tema
    unidade: Optional[Unidade] = None
    exercicio: Optional[Exercicio] = None
    simulado: Optional[Simulado] = None


def fora_de_codigo(linhas):
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


def perguntas(linhas):
    """Gera (índice do <details>, tipo, resposta) de cada pergunta com corretor."""
    fora = {i for i, _ in fora_de_codigo(linhas)}
    for i, linha in enumerate(linhas):
        if i in fora and linha.startswith("<details"):
            fim = next((j for j in range(i + 1, len(linhas)) if linhas[j].startswith("</details>")), len(linhas))
            m = RESPOSTA.search("\n".join(linhas[i:fim]))
            if m:
                yield i, TIPOS_DE_RESPOSTA[m.group(1)], m.group(2)


def contar_perguntas(markdown):
    return sum(1 for _ in perguntas(markdown.split("\n")))


def contar_exercicios(markdown):
    return len(re.findall(r"^## Exercício", markdown, re.M))


def minutos_de_leitura(markdown):
    texto = "\n".join(linha for _, linha in fora_de_codigo(markdown.split("\n")))
    return max(1, -(-len(re.findall(r"\w+", texto)) // PALAVRAS_POR_MINUTO))


def tabela_roteiro(markdown):
    return TABELA_ROTEIRO.search(markdown)


def _ler(docs_dir, src):
    """Texto de um arquivo do repositório, ou None se ele não existe ou não é texto UTF-8."""
    caminho = os.path.join(docs_dir, src)
    if not os.path.isfile(caminho):
        return None
    try:
        with open(caminho, encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        return None


def _celulas(linha):
    return [c.strip() for c in linha.strip().strip("|").split("|")]


def _nivel_em(texto):
    m = re.search("|".join(NIVEIS), texto)
    return m.group(0) if m else None


def _colunas(cabecalho):
    nomes = [n.lower() for n in _celulas(cabecalho)]
    return {chave: next((i for i, n in enumerate(nomes) if n in aceitos), None) for chave, aceitos in COLUNAS.items()}


def _trilha(markdown, pasta, docs_dir):
    m = tabela_roteiro(markdown)
    if not m:
        return []
    linhas = m.group(0).rstrip("\n").split("\n")
    col = _colunas(linhas[0])
    if col["unidade"] is None:
        return []
    unidades = []
    for linha in linhas[2:]:
        celulas = _celulas(linha)

        def celula(chave):
            i = col[chave]
            return celulas[i] if i is not None and i < len(celulas) else ""

        link = LINK.search(celula("unidade"))
        if link:
            titulo, src = link.group(1), posixpath.normpath(posixpath.join(pasta, link.group(2)))
            if not src.endswith(".md"):
                continue  # slides, PDF...: não é uma etapa da trilha
        elif re.sub(r"[*_]", "", celula("unidade")).strip().lower() == "este arquivo":
            titulo, src = "Introdução", posixpath.join(pasta, "README.md")  # a unidade é o próprio README
        else:
            continue  # "_A preencher._", "Em breve"...: ainda não é uma etapa
        texto = _ler(docs_dir, src)
        if texto is None:
            continue  # link quebrado: o mkdocs build --strict já avisa
        exercicios = []
        for _, alvo in LINK.findall(celula("exercicios")):
            src_ex = posixpath.normpath(posixpath.join(pasta, alvo))
            nivel, extensao = posixpath.splitext(posixpath.basename(src_ex))
            if extensao != ".md" or nivel not in NIVEL_DO_EXERCICIO:
                continue  # só facil.md, intermediario.md e dificil.md
            md = _ler(docs_dir, src_ex)
            if md is not None:
                exercicios.append(Exercicio(nivel, src_ex, contar_exercicios(md), contar_perguntas(md)))
        unidades.append(Unidade(
            numero=celulas[0], titulo=sem_emoji(re.sub(r"[*`]", "", titulo)), src=src,
            descricao=celula("descricao"), nivel=_nivel_em(celula("nivel")),
            minutos=minutos_de_leitura(texto), exercicios=exercicios,
        ))
    return unidades


def _simulados(docs_dir):
    """Simulados por tema (a pasta em simulados/), na ordem da tabela de simulados/README.md."""
    por_tema = {}
    for titulo, link, resto in LINHA_COM_LINK_EM_NEGRITO.findall(_ler(docs_dir, "simulados/README.md") or ""):
        src = posixpath.normpath(posixpath.join("simulados", link))
        texto = _ler(docs_dir, src)
        if texto is None:
            continue
        celulas = _celulas(resto)
        por_tema.setdefault(src.split("/")[1], []).append(Simulado(
            titulo=titulo, src=src, nivel=_nivel_em(celulas[0]) if celulas else None,
            duracao=celulas[1] if len(celulas) > 1 else "", perguntas=contar_perguntas(texto),
        ))
    return por_tema


def montar(docs_dir):
    """Os temas de conteudo/README.md, na ordem da tabela, cada um com a sua trilha e os seus simulados."""
    simulados = _simulados(docs_dir)
    temas = []
    for titulo, link, resto in LINHA_COM_LINK_EM_NEGRITO.findall(_ler(docs_dir, "conteudo/README.md") or ""):
        src = posixpath.normpath(posixpath.join("conteudo", link))
        if not src.endswith(".md"):
            src = posixpath.join(src, "README.md")
        texto = _ler(docs_dir, src)
        if texto is None:
            continue
        slug = src.split("/")[1]
        area, icone = TEMAS.get(slug, AREA_PADRAO)
        nivel = NIVEL.search(texto)
        temas.append(Tema(
            slug=slug, titulo=titulo, descricao=_celulas(resto)[0], area=area, icone=icone,
            nivel=nivel.group(1) if nivel else None, src=src,
            unidades=_trilha(texto, posixpath.dirname(src), docs_dir), simulados=simulados.get(slug, []),
        ))
    return temas


def lugares(temas):
    """src -> Lugar de cada página da trilha e de cada simulado."""
    saida = {}
    for tema in temas:
        for unidade in tema.unidades:
            saida.setdefault(unidade.src, Lugar(tema, unidade))
            for exercicio in unidade.exercicios:
                saida[exercicio.src] = Lugar(tema, unidade, exercicio)
        for simulado in tema.simulados:
            saida[simulado.src] = Lugar(tema, simulado=simulado)
    return saida


def totais(temas):
    return {
        "temas": len(temas),
        "aulas": sum(len(t.unidades) for t in temas),
        "exercicios": sum(t.total_exercicios for t in temas),
        "simulados": sum(len(t.simulados) for t in temas),
    }
