"""Pedaços de HTML (com classes do Tailwind) usados pelos hooks.

Tudo aqui é HTML em uma linha só: o Markdown trata blocos HTML sem indentação
como HTML puro, sem tentar interpretar o conteúdo.
"""

import html as _html
import re
import unicodedata

# Um emoji, com os modificadores que vêm grudados nele (variação, ZWJ, tom de pele).
EMOJI = re.compile(
    "(?:[\\u00a9\\u00ae\\u203c-\\u3299\\U0001F000-\\U0001FAFF]"
    "[\\ufe0f\\u200d\\u20e3\\U0001F3FB-\\U0001F3FF]*)+"
)


# Nível de um assunto: linha "**Nível:** 🟢 Iniciante" no Markdown.
NIVEIS = ("Iniciante", "Intermediário", "Avançado")
NIVEL = re.compile(r"^\*\*Nível:\*\*\s*(?:\S+\s+)?(Iniciante|Intermediário|Avançado)\s*$", re.M)
# Exercícios usam fácil/intermediário/difícil no nome do arquivo; no site viram a mesma escala.
NIVEL_DO_EXERCICIO = {"facil": "Iniciante", "intermediario": "Intermediário", "dificil": "Avançado"}
# Cor do cartão de cada nível (mesmo semáforo dos exercícios).
COR_DO_NIVEL = {"Iniciante": "facil", "Intermediário": "intermediario", "Avançado": "dificil"}


def sem_emoji(texto):
    """'🔀 Condicionais · 🟢 Fácil' -> 'Condicionais · Fácil'.

    No site, títulos e menu ficam uniformes; no GitHub os emojis continuam.
    """
    return re.sub(r"\s{2,}", " ", EMOJI.sub("", texto)).strip()


_SVG = (
    '<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{}</svg>'
)
ICONES = {
    "pasta": _SVG.format('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    "pagina": _SVG.format('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
    "codigo": _SVG.format('<path d="m9 8-4 4 4 4M15 8l4 4-4 4"/>'),
    "chip": _SVG.format('<rect x="7" y="7" width="10" height="10" rx="1"/>'
                        '<path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>'),
    "arquivo": _SVG.format('<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>'),
    "chave": _SVG.format('<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.2-8.2M17 6l2 2M14 9l2 2"/>'),
    "livro": _SVG.format('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>'),
    "ferramenta": _SVG.format('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'),
    "relogio": _SVG.format('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>'),
    "integral": _SVG.format('<path d="M15 4.5c-.6-1-1.4-1.5-2.3-1.3-1.4.3-1.7 1.8-1.9 3.3l-1.6 11c-.2 1.5-.5 3-1.9 3.3-.9.2-1.7-.3-2.3-1.3"/>'),
    "maos": _SVG.format('<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/>'),
}

# Cores do ícone de cada cartão. "facil", "intermediario" e "dificil" seguem o semáforo.
CORES = {
    "padrao": "bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
    "facil": "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
    "intermediario": "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
    "dificil": "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
}


def cartao(url, titulo, descricao="", icone="pagina", cor="padrao"):
    """Um link em forma de cartão: área de clique grande, foco visível e animação só se o usuário permitir."""
    return (
        f'<a href="{url}" class="group flex min-h-16 items-center gap-4 rounded-xl border border-slate-200 '
        "bg-white px-4 py-3 text-slate-900 no-underline shadow-sm transition "
        "hover:border-indigo-400 hover:shadow-md motion-safe:hover:-translate-y-0.5 "
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 "
        'dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-indigo-400">'
        f'<span class="grid size-10 shrink-0 place-items-center rounded-lg {CORES.get(cor, CORES["padrao"])}">'
        f"{ICONES[icone]}</span>"
        '<span class="min-w-0 flex-1">'
        f'<span class="block font-semibold leading-snug">{titulo}</span>'
        + (f'<span class="mt-0.5 block text-[0.68rem] leading-snug text-slate-500 dark:text-slate-400">{descricao}</span>' if descricao else "")
        + "</span>"
        '<span class="text-slate-400 transition group-hover:text-indigo-500 motion-safe:group-hover:translate-x-0.5" '
        'aria-hidden="true">→</span></a>'
    )


def grade(cartoes):
    return '<div class="my-6 grid gap-3 sm:grid-cols-2">' + "".join(cartoes) + "</div>"


# ---------- Portal: componentes da home, do tema e do fim das páginas ----------
# As cores e o desenho ficam no tailwind.css (classes com o nome do componente). Os atributos
# data-* são o contrato com o portal.js, que lê o progresso do aluno e só decora o HTML.


# Área do tema -> valor do data-area (cor da área no tailwind.css). Área nova sem cor: "outros".
AREAS = ("programacao", "engenharia-de-software", "matematica", "hardware")
NIVEL_SLUG = {"Iniciante": "facil", "Intermediário": "intermediario", "Avançado": "dificil"}
NOME_DO_NIVEL = {"facil": "Fácil", "intermediario": "Intermediário", "dificil": "Difícil"}

_LUPA = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
         'aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>')


def _e(texto):
    return _html.escape(str(texto), quote=True)


def area_slug(area):
    sem_acento = unicodedata.normalize("NFKD", area).encode("ascii", "ignore").decode().lower()
    slug = re.sub(r"[^a-z0-9]+", "-", sem_acento).strip("-")
    return slug if slug in AREAS else "outros"


def inline(texto):
    """Markdown de uma linha (tabelas do README) -> HTML seguro: só `código` e **negrito**."""
    texto = _e(sem_emoji(texto))
    texto = re.sub(r"`([^`]+)`", r"<code>\1</code>", texto)
    return re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", texto)


def plural(n, singular, varios):
    return f"{n} {singular if n == 1 else varios}"


def barra(rotulo):
    return (f'<span class="barra-progresso" role="progressbar" aria-label="{_e(rotulo)}" aria-valuemin="0" '
            'aria-valuemax="100" aria-valuenow="0"><span></span></span>')


def _nivel(nivel):
    """Etiqueta de nível (Iniciante/Intermediário/Avançado) com a cor do semáforo."""
    if not nivel:
        return ""
    return f'<span class="nivel nivel--{NIVEL_SLUG.get(nivel, "facil")}">{_e(nivel)}</span>'


def cartao_tema(tema, url, paginas, numeros):
    return (
        f'<a class="cartao-tema" href="{_e(url)}" data-area="{area_slug(tema.area)}" '
        f'data-progresso-tema="{_e(tema.slug)}" data-paginas="{_e(" ".join(paginas))}">'
        f'<span class="cartao-tema__topo"><span class="cartao-tema__icone">{ICONES.get(tema.icone, ICONES["pasta"])}</span>'
        f'<span class="cartao-tema__area">{_e(tema.area)}</span>{_nivel(tema.nivel)}</span>'
        f'<span class="cartao-tema__titulo">{_e(tema.titulo)}</span>'
        f'<span class="cartao-tema__descricao">{inline(tema.descricao)}</span>'
        f'<span class="cartao-tema__numeros">{_e(numeros)}</span>'
        f'<span class="cartao-tema__progresso" data-so-com-progresso>{barra("Progresso em " + tema.titulo)}'
        '<span data-progresso-texto>0%</span></span></a>'
    )


def bloco_continuar(url_temas):
    """Os dois estados ocupam o mesmo espaço: a página não pula quando o portal.js troca um pelo outro."""
    return (
        '<div class="continuar" data-continuar>'
        '<div class="continuar__estado" data-estado="vazio">'
        '<p class="continuar__rotulo">Primeira vez aqui?</p>'
        '<ol class="continuar__passos"><li>Escolha um tema</li><li>Leia a aula e faça o teste rápido</li>'
        '<li>Pratique, do fácil ao difícil</li></ol>'
        f'<a class="md-button md-button--primary" href="{_e(url_temas)}">Ver temas</a></div>'
        '<div class="continuar__estado" data-estado="progresso" hidden>'
        '<p class="continuar__rotulo">Continue de onde parou</p>'
        '<p class="continuar__tema" data-continuar-tema></p>'
        '<p class="continuar__titulo" data-continuar-titulo></p>'
        '<a class="md-button md-button--primary" data-continuar-link href="#">Continuar</a></div></div>'
    )


def heroi(numeros, continuar):
    """numeros: [(4, "temas"), ...]. A busca é um <label> do campo do Material (abre sem JavaScript)."""
    itens = "".join(f"<div><dt>{_e(nome)}</dt><dd>{_e(n)}</dd></div>" for n, nome in numeros)
    return (
        '<section class="heroi">'
        '<div class="heroi__texto">'
        '<p class="heroi__selo">Ciência da Computação · de aluno para aluno</p>'
        '<h1 class="heroi__titulo">Estude por trilhas. <span class="heroi__marca">Pratique com correção na hora.</span></h1>'
        '<p class="heroi__sub">Aulas, exercícios e simulados organizados por tema, do básico ao avançado. '
        'Aberto, gratuito e escrito por quem está no curso.</p>'
        f'<label class="heroi__busca" for="__search" tabindex="0" role="button">{_LUPA}'
        '<span>Buscar aulas, exercícios, fórmulas…</span><kbd>/</kbd></label>'
        f'<dl class="heroi__numeros">{itens}</dl></div>'
        f"{continuar}</section>"
    )


def faixa_como_estudar(url_simulados):
    passos = (
        ("01", "Aprenda", "Aulas curtas, com exemplos resolvidos e um teste rápido no fim."),
        ("02", "Pratique", "Exercícios em três níveis. Digite a resposta e o site corrige na hora."),
        ("03", "Teste-se", f'<a href="{_e(url_simulados)}">Simulados</a> com tempo marcado, como na prova.'),
    )
    return (
        '<ol class="como-estudar">'
        + "".join(f'<li><span class="como-estudar__n">{n}</span><strong>{titulo}</strong><span>{texto}</span></li>'
                  for n, titulo, texto in passos)
        + "</ol>"
    )


def cabecalho_tema(tema, numeros, primeira_url, paginas):
    return (
        f'<div class="curso" data-area="{area_slug(tema.area)}" data-progresso-tema="{_e(tema.slug)}" '
        f'data-paginas="{_e(" ".join(paginas))}">'
        f'<div class="curso__topo"><span class="cartao-tema__icone">{ICONES.get(tema.icone, ICONES["pasta"])}</span>'
        f'<span class="cartao-tema__area">{_e(tema.area)}</span>{_nivel(tema.nivel)}</div>'
        f'<p class="curso__numeros">{_e(numeros)}</p>'
        f'<div class="curso__progresso"><span data-progresso-texto>0% concluído</span>{barra("Progresso em " + tema.titulo)}</div>'
        f'<a class="md-button md-button--primary curso__acao" data-proxima href="{_e(primeira_url)}">Começar a trilha</a>'
        "</div>"
    )


def _exercicios(exercicios):
    """Botões Fácil/Intermediário/Difícil; o portal.js escreve "x de n" no [data-acertos]."""
    return "".join(
        f'<a class="exercicio nivel--{nivel}" href="{_e(url)}" data-pagina="{_e(chave)}" data-perguntas="{perguntas}">'
        f'{NOME_DO_NIVEL[nivel]}<span class="exercicio__acertos" data-acertos></span></a>'
        for nivel, url, chave, perguntas in exercicios
    )


def item_trilha(numero, titulo, url, chave, descricao, nivel, minutos, exercicios, rotulo):
    """Uma estação da trilha. exercicios: [(nivel, url, chave, perguntas)]."""
    meta = _nivel(nivel) + f'<span class="etapa__tempo">~{minutos} min</span>'
    return (
        f'<li class="etapa" data-unidade data-pagina="{_e(chave)}" data-titulo="{_e(rotulo + " " + numero + " · " + titulo)}">'
        f'<span class="etapa__numero" aria-hidden="true">{_e(numero)}</span>'
        '<div class="etapa__corpo">'
        f'<a class="etapa__titulo" href="{_e(url)}">{_e(titulo)}<span class="sr-only" data-estado-texto></span></a>'
        + (f'<p class="etapa__descricao">{inline(descricao)}</p>' if descricao else "")
        + f'<p class="etapa__meta">{meta}</p>'
        + (f'<p class="etapa__exercicios"><span class="etapa__rotulo">Exercícios</span>{_exercicios(exercicios)}</p>'
           if exercicios else "")
        + "</div></li>"
    )


def trilha(itens, area):
    return f'<ol class="trilha" data-area="{area_slug(area)}">' + "".join(itens) + "</ol>"


def simulados_do_tema(simulados):
    """simulados: [(titulo, url, chave, perguntas, nivel, duracao)]."""
    cartoes = "".join(
        f'<a class="simulado" href="{_e(url)}" data-pagina="{_e(chave)}" data-perguntas="{perguntas}">'
        f'<span class="simulado__titulo">{_e(titulo)}</span>'
        f'<span class="simulado__meta">{_nivel(nivel)}<span>{_e(duracao)}</span></span>'
        '<span class="simulado__estado" data-acertos></span></a>'
        for titulo, url, chave, perguntas, nivel, duracao in simulados
    )
    return f'<div class="simulados">{cartoes}</div>'


def informacoes(partes, link=None):
    """A linha abaixo do título: "Cálculo · Aula 4 de 10 · ~12 min"."""
    itens = "".join(f"<span>{_e(p)}</span>" for p in partes if p)
    if link:
        itens += f'<a href="{_e(link[1])}">{_e(link[0])}</a>'
    return f'<p class="informacoes">{itens}</p>'


def fim_de_pagina(chave, texto_botao, pratique=None, proximo=None):
    """Concluir + próximos passos. pratique: [(nivel, url, chave, perguntas)]; proximo: (rótulo, título, url)."""
    partes = [
        f'<button type="button" class="fim__concluir" data-concluir="{_e(chave)}" aria-pressed="false">'
        f'<span class="fim__marca" aria-hidden="true"></span><span data-concluir-texto>{_e(texto_botao)}</span></button>'
    ]
    if pratique:
        partes.append(f'<div class="fim__bloco"><p class="fim__rotulo">Pratique agora</p>'
                      f'<p class="etapa__exercicios">{_exercicios(pratique)}</p></div>')
    if proximo:
        rotulo, titulo, url = proximo
        partes.append(f'<a class="fim__bloco fim__proximo" href="{_e(url)}"><span class="fim__rotulo">{_e(rotulo)}</span>'
                      f'<span class="fim__titulo">{_e(titulo)} <span aria-hidden="true">→</span></span></a>')
    return '<section class="fim" aria-label="Próximos passos">' + "".join(partes) + "</section>"


def marcador_de_visita(tema_slug, titulo):
    return f'<span hidden data-visita data-tema="{_e(tema_slug)}" data-titulo="{_e(titulo)}"></span>'
