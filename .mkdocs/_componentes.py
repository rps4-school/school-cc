"""Pedaços de HTML (com classes do Tailwind) usados pelos hooks.

Tudo aqui é HTML em uma linha só: o Markdown trata blocos HTML sem indentação
como HTML puro, sem tentar interpretar o conteúdo.
"""

import re

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
    "arquivo": _SVG.format('<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>'),
    "chave": _SVG.format('<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.2-8.2M17 6l2 2M14 9l2 2"/>'),
    "livro": _SVG.format('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>'),
    "ferramenta": _SVG.format('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'),
    "relogio": _SVG.format('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>'),
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
