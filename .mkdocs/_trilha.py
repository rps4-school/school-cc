"""Menu da trilha (coluna da esquerda nas páginas de um tema) e caminho no topo da página.

Os dados vêm do catálogo (_catalogo.py) e o HTML vai para page.meta: os templates sobrescritos
(overrides/partials/nav.html e path.html) só o mostram. Quem chama passa:
- url(src): o endereço da página a partir da página atual;
- chave(src): a chave do progresso (o File.url), a mesma do resto do portal.
O portal.js marca data-concluida nos [data-pagina] e preenche a contagem [data-progresso-menu].
"""

import posixpath
from dataclasses import dataclass, field

from _componentes import ICONES, NOME_DO_NIVEL, _e, area_slug

# Rótulo da unidade pela pasta: Cálculo e Sistemas Digitais têm aulas/; o Git tem os arquivos soltos.
ROTULOS = {"aulas": "Aula", "resumos": "Resumo"}
PLURAIS = {"Aula": ("aulas", "concluídas"), "Resumo": ("resumos", "concluídos"), "Parte": ("partes", "concluídas")}


def rotulo_da_unidade(unidade):
    """"Aula", "Resumo" ou "Parte", pela pasta da unidade."""
    return ROTULOS.get(posixpath.basename(posixpath.dirname(unidade.src)), "Parte")


def plural_do_rotulo(rotulo):
    return PLURAIS[rotulo][0]


@dataclass
class Nivel:
    nivel: str  # facil, intermediario ou dificil
    url: str
    chave: str
    atual: bool = False


@dataclass
class Item:
    numero: str
    titulo: str
    url: str
    chave: str
    atual: bool = False  # a página aberta é esta unidade
    aberta: bool = False  # a página aberta é desta unidade: a aula, um nível ou uma resposta
    niveis: list = field(default_factory=list)


@dataclass
class Link:
    titulo: str
    url: str
    chave: str = ""
    atual: bool = False


@dataclass
class Menu:
    tema: str
    area: str
    icone: str
    url_tema: str
    url_conteudo: str
    rotulo: str  # "aulas", "resumos" ou "partes"
    itens: list
    simulados: list
    mais: list


def montar_menu(tema, src_atual, url, chave, url_conteudo, mais=(), src_enunciado=None):
    """Menu do tema visto da página src_atual. Nas respostas, src_enunciado (o nível que aponta para a
    resposta) abre a unidade e marca o nível. mais: [(título, src)] das outras páginas do tema."""
    referencia = src_enunciado or src_atual
    itens = []
    for u in tema.unidades:
        niveis = [Nivel(e.nivel, url(e.src), chave(e.src), e.src == referencia) for e in u.exercicios]
        atual = u.src == src_atual
        itens.append(Item(u.numero, u.titulo, url(u.src), chave(u.src), atual, atual or any(n.atual for n in niveis), niveis))
    rotulo = rotulo_da_unidade(tema.unidades[0]) if tema.unidades else "Aula"
    return Menu(
        tema=tema.titulo, area=tema.area, icone=tema.icone, url_tema=url(tema.src), url_conteudo=url_conteudo,
        rotulo=plural_do_rotulo(rotulo), itens=itens,
        simulados=[Link(s.titulo, url(s.src), chave(s.src), s.src == src_atual) for s in tema.simulados],
        mais=[Link(titulo, url(src), "", src == src_atual) for titulo, src in mais],
    )


def _atual(sim):
    return ' aria-current="page"' if sim else ""


def _ativo(sim):
    # md-nav__link--active: o Material rola o menu até este link depois de fixar a altura da coluna.
    return ' class="md-nav__link--active"' if sim else ""


def _nivel(n):
    return (f'<li><a{_ativo(n.atual)} href="{_e(n.url)}" data-pagina="{_e(n.chave)}"{_atual(n.atual)}>'
            f'<span class="ponto nivel--{n.nivel}" aria-hidden="true"></span>{NOME_DO_NIVEL[n.nivel]}'
            f'<span class="sr-only" data-estado-texto></span></a></li>')


def _item(item, n):
    ativo = " md-nav__link--active" if item.atual else ""
    link = (f'<a class="trilha-lateral__link{ativo}" href="{_e(item.url)}" data-pagina="{_e(item.chave)}"{_atual(item.atual)}>'
            f'<span class="trilha-lateral__estado" aria-hidden="true">{_e(item.numero)}</span>'
            f'<span class="trilha-lateral__titulo">{_e(item.titulo)}</span><span class="sr-only" data-estado-texto></span></a>')
    if not item.niveis:
        return f'<li class="trilha-lateral__item"><div class="trilha-lateral__linha">{link}</div></li>'
    alvo = f"trilha-niveis-{n}"
    aberta = "true" if item.aberta else "false"
    botao = (f'<button type="button" class="trilha-lateral__abrir" aria-expanded="{aberta}" aria-controls="{alvo}" '
             f'aria-label="Exercícios de {_e(item.titulo)}"></button>')
    niveis = "".join(_nivel(v) for v in item.niveis)
    return (f'<li class="trilha-lateral__item"{" data-aberta" if item.aberta else ""}>'
            f'<div class="trilha-lateral__linha">{link}{botao}</div>'
            f'<div class="trilha-lateral__niveis" id="{alvo}"{"" if item.aberta else " hidden"}><p>Praticar</p><ul>{niveis}</ul></div></li>')


def _simples(link):
    chave = f' data-pagina="{_e(link.chave)}"' if link.chave else ""
    return f'<li><a{_ativo(link.atual)} href="{_e(link.url)}"{chave}{_atual(link.atual)}>{_e(link.titulo)}</a></li>'


def _secao(titulo, links):
    if not links:
        return ""
    return f'<p class="trilha-lateral__secao">{titulo}</p><ul class="trilha-lateral__simples">{"".join(_simples(l) for l in links)}</ul>'


def html_do_menu(menu):
    partes = [
        f'<a class="trilha-lateral__volta" href="{_e(menu.url_conteudo)}">‹ Todo o conteúdo</a>',
        f'<a class="trilha-lateral__tema" href="{_e(menu.url_tema)}" data-area="{area_slug(menu.area)}">'
        f'<span class="trilha-lateral__icone">{ICONES.get(menu.icone, ICONES["pasta"])}</span>'
        f'<span class="trilha-lateral__nome"><small>{_e(menu.area)}</small><b>{_e(menu.tema)}</b></span></a>',
    ]
    if menu.itens:
        total = len(menu.itens)
        rotulo, concluidas = next(v for v in PLURAIS.values() if v[0] == menu.rotulo)
        chaves = " ".join(i.chave for i in menu.itens)
        partes.append(
            f'<div class="trilha-lateral__progresso" data-progresso-menu data-paginas="{_e(chaves)}">'
            f'<div class="trilha-lateral__barra" role="progressbar" aria-label="{rotulo.capitalize()} {concluidas} em {_e(menu.tema)}" '
            f'aria-valuemin="0" aria-valuemax="{total}" aria-valuenow="0"><i></i></div>'
            f'<p><span data-feitas>0</span> de {total} {rotulo} {concluidas}</p></div>'
        )
        partes.append('<ol class="trilha-lateral__lista">' + "".join(_item(i, n) for n, i in enumerate(menu.itens, 1)) + "</ol>")
    partes.append(_secao("Simulados", menu.simulados))
    partes.append(_secao("Mais", menu.mais))
    return "".join(partes)


def abas_do_site(itens, titulos):
    """[Link(título, src da primeira página)] das abas do topo, na ordem do menu. titulos: nomes das abas que
    são uma página só (o título da página ainda não foi lido quando o menu é montado)."""
    def primeira(item):
        arquivo = getattr(item, "file", None)
        if arquivo is not None:
            return arquivo.src_uri
        return next((src for src in map(primeira, item.children or []) if src), None)

    abas = []
    for item in itens:
        src = primeira(item)
        if src:
            abas.append(Link(titulos.get(src) or item.title or src, src))
    return abas


def html_das_abas(abas):
    """Atalhos das abas do topo: no celular, as abas não aparecem e a gaveta é o único caminho até elas."""
    return f'<div class="trilha-lateral__abas">{_secao("Navegação", abas)}</div>'


def caminho(tema, url, url_conteudo, unidade=None, exercicio=None, resposta=False, pagina_do_tema=False):
    """O caminho no topo: só o que ajuda a se localizar (Início e Conteúdo já estão nas abas)."""
    area = Link(tema.area, f"{url_conteudo}#area-{area_slug(tema.area)}")
    do_tema = Link(tema.titulo, url(tema.src))
    if pagina_do_tema:
        return [area]
    if resposta:
        return [do_tema, Link(unidade.titulo, url(unidade.src)), Link(NOME_DO_NIVEL[exercicio.nivel], url(exercicio.src))]
    if exercicio:
        return [area, do_tema, Link(unidade.titulo, url(unidade.src))]
    return [area, do_tema]


def html_do_caminho(links):
    return "".join(
        f'<li class="md-path__item"><a href="{_e(l.url)}" class="md-path__link"><span class="md-ellipsis">{_e(l.titulo)}</span></a></li>'
        for l in links
    )
