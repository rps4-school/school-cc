# Menu da trilha e páginas: plano de implementação

> **Para quem executa:** siga as tarefas na ordem, uma de cada vez. Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** o menu lateral das páginas de tema vira a trilha do tema, e aula, exercícios e resposta ganham o mesmo cabeçalho e um único próximo passo. No Python, "Resumos" vira "Aulas".

**Arquitetura:**

- `_trilha.py` (novo) monta, a partir do catálogo, o HTML do menu e do caminho.
- `visual.py` põe esse HTML em `page.meta`.
- Dois templates sobrescritos (`overrides/partials/nav.html` e `path.html`) mostram o que estiver em `page.meta` e, se não houver nada, o original do Material.
- O resto do layout é feito em `visual.py`, `hooks.py`, `_componentes.py`, `portal.js` e no CSS (Tailwind).

**Tecnologia:** MkDocs 1.6.1, Material 9.7.7, Python 3 (unittest), JavaScript sem framework, Tailwind 4.3.3 (compilado para `site.css`).

**Especificação:** [2026-10-17-menu-e-paginas-design.md](2026-10-17-menu-e-paginas-design.md)

**Referência visual:** a página de comparação aprovada no desenho (fora do repositório). Menu: opção A. Páginas: seção 2.

## Restrições globais

- Textos do site e mensagens de commit em pt-BR. Commits no formato `tipo(escopo): descrição`: `feat(site)` e `docs(site)` na branch do portal; `docs(python)` na branch do conteúdo.
- Nenhuma referência a ferramentas de IA em commits, PRs ou arquivos.
- Nada de push, PR ou merge: só commits locais.
- **Versões:**
  - `mkdocs-material==9.7.7` e MkDocs 1.6.x, sem atualizar;
  - os templates sobrescritos saíram da 9.7.7.
- **CSS:** depois de mudar classes, recompilar com `npm run css --prefix .mkdocs` e incluir `site.css` no commit.
- **Contratos de dados do `portal.js`:** `data-pagina`, `data-concluida`, `data-estado-texto`, `data-concluir`, `data-perguntas` e `data-acertos` não mudam de significado.
- **Escuro:** o modo escuro segue `[data-md-color-scheme=slate]`.
- **Toque:** no celular, os alvos de toque têm 44 px de altura.
- **Antes de cada commit:**
  - o build `--strict` passa sem avisos;
  - `$S/suite.sh` está verde;
  - para o portal, os roteiros novos também estão verdes.

## Pontos para a revisão

1. **Tema cuja unidade é o próprio README** ("Este arquivo" → Introdução): o menu não pode duplicar a unidade, e o README marca essa unidade como atual. Teste na Tarefa 2.
2. **Página do tema fora da trilha** (`exercicios/README.md`, índices gerados): menu sem unidade atual, e a página aparece em "Mais" (exceto os índices gerados). Teste na Tarefa 2.
3. **`.py` sem enunciado ou com seção que não é "Exercício NN: Título"** (respostas de simulado): a página fica como hoje, sem erro. Teste na Tarefa 5.
4. **Página de exercício sem `## Exercício`** ou com corretor (Cálculo, Sistemas Digitais): o cartão só envolve os títulos de exercício e não quebra os corretores. Teste na Tarefa 4.
5. **Navegação instantânea entre página de tema e página fora de tema:** o menu troca entre a trilha e o menu do Material. Roteiro na Tarefa 7.

---

### Tarefa 1: filtro da navegação manual

**Arquivos:**
- Modificar: `.mkdocs/visual.py` (`_sem_navegacao_manual`)
- Teste: `.mkdocs/test_visual.py`

- [ ] **Passo 1: testes que falham** (classe `NavegacaoManual` em `test_visual.py`)

```python
class NavegacaoManual(unittest.TestCase):
    def tirar(self, linha):
        return visual._sem_navegacao_manual(["# T", "", linha, "", "Texto"])[2]

    def test_ultimo_resumo_sem_seta_some(self):
        self.assertEqual(self.tirar("> [← Dicionários](05-dicionarios.md) · [Voltar para Python](../README.md)"), "")

    def test_voltar_com_seta_some(self):
        self.assertEqual(self.tirar("> [← Primitivas](09-primitivas.md) · [Voltar para Cálculo →](../README.md)"), "")

    def test_antes_leia_some(self):
        linha = "> [← voltar para Exercícios](../../README.md) · 📖 Antes, leia: [Listas](../../../resumos/02-listas.md) · Próximo: [Intermediário →](intermediario.md)"
        self.assertEqual(self.tirar(linha), "")

    def test_citacao_comum_fica(self):
        self.assertEqual(self.tirar("> 💡 Dica: use [o tutor](https://pythontutor.com)."), "> 💡 Dica: use [o tutor](https://pythontutor.com).")
```

- [ ] **Passo 2:** rodar `python3 -m unittest test_visual -v` (em `.mkdocs/`). **Esperado:** os três primeiros falham; o caso da dica passa.
- [ ] **Passo 3: implementação.** A linha de navegação continua sendo reconhecida por "←" ou "Próximo:". Dentro dela, saem também:
  - as partes com link para `README.md`;
  - as partes que contêm "voltar" (sem diferenciar maiúsculas);
  - as partes que contêm "Antes, leia".

```python
VOLTAR = re.compile(r"voltar|\]\((?:\.\./)*README\.md\)|Antes, leia", re.I)

def _sem_navegacao_manual(linhas):
    # Só olha o começo da página, onde ficam os "← voltar".
    for i, linha in list(fora_de_codigo(linhas))[:8]:
        if not linha.startswith(">") or "←" not in linha and "Próximo:" not in linha:
            continue
        partes = [p.strip() for p in linha.lstrip("> ").split(" · ")]
        restantes = [p for p in partes if "←" not in p and not p.startswith("Próximo:") and "→]" not in p and not VOLTAR.search(p)]
        linhas[i] = "> " + " · ".join(restantes) if restantes else ""
    return linhas
```

- [ ] **Passo 4:** rodar os testes. **Esperado:** passam.
- [ ] **Passo 5: commit** `fix(site): tira da página o "Voltar para" e o "Antes, leia" que sobravam da navegação manual`

### Tarefa 2: dados e HTML do menu da trilha e do caminho (`_trilha.py`)

**Arquivos:**
- Criar: `.mkdocs/_trilha.py`
- Criar: `.mkdocs/test_trilha.py`
- Modificar: `.mkdocs/visual.py` (`_rotulo_da_unidade` passa a vir de `_trilha.rotulo_da_unidade`)

**Interfaces (produz):**

```python
def rotulo_da_unidade(unidade) -> str          # "Aula" | "Resumo" | "Parte" (pela pasta)
def plural_do_rotulo(rotulo) -> str            # "aulas" | "resumos" | "partes"
@dataclass Nivel(nivel, url, chave, atual=False)
@dataclass Item(numero, titulo, url, chave, atual=False, aberta=False, niveis=[])
@dataclass Link(titulo, url, chave="", atual=False)
@dataclass Menu(tema, area, icone, url_tema, url_conteudo, rotulo, itens, simulados, mais)
def montar_menu(tema, src_atual, url, chave, url_conteudo, mais=(), src_enunciado=None) -> Menu
    # url(src) -> endereço relativo à página; chave(src) -> File.url; mais: [(titulo, src)]
    # src_enunciado: nas respostas, o enunciado (abre a unidade e marca o nível)
def html_do_menu(menu) -> str
def html_das_abas(abas: list[Link]) -> str      # atalhos do celular
def caminho(tema, url, url_conteudo, unidade=None, exercicio=None, resposta=False, pagina_do_tema=False) -> list[Link]
def html_do_caminho(links: list[Link]) -> str   # <li class="md-path__item">..., o último com aria-current
```

- [ ] **Passo 1: testes que falham** (`test_trilha.py`, com tema de mentira montado com `Tema`/`Unidade`/`Exercicio`/`Simulado` do `_catalogo`). Casos:
  - **`montar_menu` na aula 2:**
    - o item 2 tem `atual` e `aberta`, e os outros não;
    - os níveis vêm na ordem Fácil, Intermediário, Difícil.
  - **No nível intermediário da aula 2:** o item 2 está `aberta`, não está `atual`, e o nível intermediário está `atual`.
  - **Na resposta** (`src_atual` = o `.py.md`, `src_enunciado` = o difícil da aula 2): o item 2 está `aberta` e o difícil está `atual`.
  - **No README do tema:** nenhum item aberto.
  - **Unidade que é o próprio README** ("Introdução", `src == tema.src`): no README ela está `atual`, e não há item duplicado.
  - **Git** (unidades sem exercícios): itens sem `niveis`, e o rótulo é "partes".
  - **`html_do_menu`:**
    - tem `aria-current="page"` só no link da página atual;
    - tem `data-pagina` em todo item e todo nível;
    - o botão da seta tem `aria-expanded="true"` na unidade aberta e `"false"` nas outras, e não existe quando a unidade não tem níveis;
    - a lista de níveis tem `hidden` nas unidades fechadas;
    - "Simulados" e "Mais" só aparecem quando há itens;
    - o HTML fica numa linha só;
    - títulos com `<` e `&` saem escapados;
    - `data-paginas` do progresso lista as chaves das unidades;
    - aparece o texto "de 3 aulas concluídas".
  - **`caminho`:**

    | Página | Caminho esperado |
    | ------ | ---------------- |
    | Tema | `[Área]` (link `conteudo/#area-programacao`) |
    | Aula | `[Área, Tema]` |
    | Exercícios | `[Área, Tema, Aula]` |
    | Resposta | `[Tema, Aula, Nível]`, com o nível apontando para o enunciado |

  - **`html_do_caminho`:** o último item tem `aria-current="page"`, e todos usam as classes `md-path__item`/`md-path__link`.
- [ ] **Passo 2:** rodar `python3 -m unittest test_trilha -v`. **Esperado:** erro de importação (o módulo não existe).
- [ ] **Passo 3: implementação**, como na referência visual (seção 1, opção A). Estrutura do HTML do menu:

```html
<a class="trilha-lateral__volta" href="{url_conteudo}">‹ Todo o conteúdo</a>
<a class="trilha-lateral__tema" href="{url_tema}" data-area="{area_slug}"><span class="trilha-lateral__icone">{ICONES[icone]}</span><span><small>{área}</small><b>{tema}</b></span></a>
<div class="trilha-lateral__progresso" data-progresso-menu data-paginas="{chaves das unidades}"><div class="trilha-lateral__barra" role="progressbar" aria-label="{Rótulos} concluídas em {tema}" aria-valuemin="0" aria-valuemax="{M}" aria-valuenow="0"><i></i></div><p><span data-feitas>0</span> de {M} {rotulo} concluídas</p></div>
<ol class="trilha-lateral__lista">
  <li class="trilha-lateral__item" [data-aberta]>
    <div class="trilha-lateral__linha"><a class="trilha-lateral__link" href data-pagina [aria-current="page"]><span class="trilha-lateral__estado" aria-hidden="true">{numero}</span><span class="trilha-lateral__titulo">{titulo}</span><span class="sr-only" data-estado-texto></span></a>
      <button type="button" class="trilha-lateral__abrir" aria-expanded aria-controls="trilha-niveis-{i}" aria-label="Exercícios de {titulo}"></button></div>
    <div class="trilha-lateral__niveis" id="trilha-niveis-{i}" [hidden]><p>Praticar</p><ul><li><a href data-pagina [aria-current]><span class="ponto nivel--facil" aria-hidden="true"></span>Fácil<span class="sr-only" data-estado-texto></span></a></li>…</ul></div>
  </li>
</ol>
<p class="trilha-lateral__secao">Simulados</p><ul class="trilha-lateral__simples">…</ul>
<p class="trilha-lateral__secao">Mais</p><ul class="trilha-lateral__simples">…</ul>
```

- [ ] **Passo 4:** rodar `python3 -m unittest discover -s .mkdocs -p "test_*.py"`. **Esperado:** tudo verde.
- [ ] **Passo 5: commit** `feat(site): monta o menu da trilha e o caminho do tema a partir do catálogo`

### Tarefa 3: templates, menu do Material mais limpo e respostas fora do menu

**Arquivos:**
- Criar:
  - `.mkdocs/overrides/partials/nav.html` (cópia do 9.7.7 com o ramo da trilha);
  - `.mkdocs/overrides/partials/path.html`.
- Modificar:
  - `.mkdocs/mkdocs.yml` (`theme.custom_dir: overrides`);
  - `.mkdocs/visual.py`:
    - `on_nav` guarda as abas;
    - `on_page_markdown` põe `trilha`, `trilha_tema`, `trilha_abas` e `caminho` em `page.meta`;
    - `on_files` calcula o "Mais" de cada tema;
  - `.mkdocs/hooks.py`:
    - `on_files`: respostas de `conteudo/` e índices de `respostas/` com `InclusionLevel.NOT_IN_NAV`;
    - `on_nav`: `_limpar_tema`.
- Teste: `.mkdocs/test_hooks.py` (novo) e `test_trilha.py`.

- [ ] **Passo 1: testes que falham.**
  - **`_limpar_tema(secao, pasta_da_secao)`** (com `Section` do MkDocs e páginas de mentira, que têm `file.src_uri` e `children=None`):
    - a ordem fica README, `aulas`, `resumos`, `exercicios` e o resto;
    - "Enunciados" some, e os assuntos dele viram filhos de "Exercícios" (com `parent` certo);
    - o índice de "Enunciados" sai.
  - **`_inclusao_do_gerado(src)`:**
    - `NOT_IN_NAV` para `conteudo/**/respostas/**`;
    - `INCLUDED` para o resto, inclusive `simulados/**/respostas/*.md`.
  - **Trava de versão** (`test_hooks.py`): `importlib.metadata.version("mkdocs-material") == "9.7.7"`. A mensagem explica que os dois templates de `overrides/partials/` precisam ser comparados com os da versão nova.
  - **Abas:** `abas_do_site(itens_do_nav)` (em `_trilha.py`) devolve, na ordem das abas, Início, Conteúdo, Simulados, Meu progresso e Colabore, com o endereço da primeira página de cada uma (`test_trilha.py`, com `Section` e páginas de mentira).
- [ ] **Passo 2:** rodar. **Esperado:** falham por falta das funções.
- [ ] **Passo 3: implementação.**
  - **`nav.html`:** `{% if page and page.meta and page.meta.trilha %}`. Nesse caso, o arquivo desenha:
    - um `<nav class="md-nav md-nav--primary trilha-lateral" aria-label="Trilha de {{ page.meta.trilha_tema | e }}" data-md-level="0">`;
    - o mesmo `md-nav__title` do original (o topo da gaveta no celular);
    - `{{ page.meta.trilha }}`;
    - o bloco "Nesta página", só no celular, com `page.toc` até o nível 2 (se o primeiro item for o h1, usa os filhos dele);
    - `{{ page.meta.trilha_abas }}`.

    Senão, desenha o conteúdo original do 9.7.7, sem mudança.
  - **`path.html`:** se houver `page.meta.caminho`, desenha `<nav class="md-path caminho" aria-label="Caminho"><ol class="md-path__list">{{ page.meta.caminho }}</ol></nav>`; senão, o original.
  - **Tema da página:** é aquele cuja pasta (`dirname(tema.src)`) é prefixo do `src`.
    - Para as respostas, vale o `page.meta.resposta_de`, criado na Tarefa 5. Até lá, a resposta abre o menu sem nível marcado.
  - **"Mais":** as páginas `.md` do tema que não são:
    - o README;
    - uma unidade ou um nível;
    - um arquivo gerado (`file.generated_by`);
    - uma página dentro de `/respostas/`.

    Os títulos vêm do primeiro `# ` sem emoji, e a lista é ordenada por `src`.
- [ ] **Passo 4:** rodar unittest e `$S/build.sh`. **Esperado:** verde; o build `--strict` passa sem avisos.
- [ ] **Passo 5:** captura de uma aula no computador e no celular (`shot.mjs`): o menu da trilha aparece no lugar da árvore. Ainda sem o CSS final.
- [ ] **Passo 6: commit** `feat(site): menu da trilha nas páginas de tema e caminho curto no topo`

### Tarefa 4: cabeçalho, abas de nível, cartões de exercício e próximo passo

**Arquivos:**
- Modificar:
  - `.mkdocs/_componentes.py`: `sobretitulo`, `linha_de_informacoes`, `segmentos`, `abas_de_nivel`, `proximo_passo` (substitui `fim_de_pagina` em aulas e exercícios);
  - `.mkdocs/visual.py`: `_pagina_da_trilha`, `on_page_content` (cartões e índice), `_esconder(page, *itens)`.
- Teste: `.mkdocs/test_componentes.py` e `.mkdocs/test_visual.py`.

- [ ] **Passo 1: testes que falham.**
  - **`sobretitulo("Aula 2 de 6")`:** `<p class="sobretitulo">Aula 2 de 6</p>`.
  - **`linha_de_informacoes(nivel, partes, links)`:**
    - o selo de nível leva a classe da cor e um link para Por nível (`#tag:<nível>`, a mesma âncora que as etiquetas do Material usam hoje; confira no build);
    - os itens ficam em `<span>` e os links em `<a>`.
  - **`segmentos(itens)`:** cada `<i>` tem `data-pagina`, o atual leva `class="atual"`, e o conjunto tem `aria-hidden="true"`.
  - **`abas_de_nivel`:** `<nav class="abas-nivel" aria-label="Níveis">`, com `aria-current="page"` no nível atual e o ponto de cor.
  - **`proximo_passo`:**
    - aula com exercícios: o botão `data-concluir`, o título "Agora, pratique" e 3 cartões (o primeiro com `prim`, cada um com `data-pagina` e `data-perguntas` quando houver perguntas), mais o link "Já praticou? Próxima aula: X";
    - aula sem exercícios: o próximo vira a ação principal;
    - última aula sem exercícios: "Você chegou ao fim da trilha", com os simulados ou com o link do tema;
    - exercícios: o próximo nível ou, no Difícil, a próxima aula.
  - **`_cartoes_de_exercicio(html)`** (função de `visual`):
    - cada `<h2 id="exercício-01-...">Exercício 01: Título<a class="headerlink"...>¶</a></h2>` e o que vem até o próximo `<hr />`, o próximo exercício ou o marcador de visita ficam dentro de `<section class="exercicio-cartao">`;
    - o título vira `<span class="num">01</span> Título`, com o `id` e o `headerlink` mantidos;
    - um `<h2>` que não é exercício fica de fora;
    - os corretores dentro do cartão continuam iguais;
    - o `<hr />` entre exercícios sai.
  - **`_indice_de_exercicios(toc)`:** "Exercício 01: Título" vira "01 · Título", inclusive dentro dos filhos do h1.
- [ ] **Passo 2:** rodar. **Esperado:** falham.
- [ ] **Passo 3: implementação.** Em `_pagina_da_trilha`, por tipo de página:
  - **Aula:**
    - o sobretítulo `"{Rótulo} {numero} de {ultimo}"` entra antes do `# `;
    - depois do título, a linha de informações (nível, "~N min de leitura", "✎ Sugerir melhoria" com o `page.edit_url`, que em seguida vira `None`) e os segmentos;
    - `_esconder(page, "tags", "footer")`;
    - o `proximo_passo`.
  - **Exercícios:**
    - o sobretítulo `"Exercícios · {Rótulo} {numero}"`;
    - o texto visível do `# ` passa a ser o nome da unidade ("Funções"), porque o nível já está nas abas, e a âncora é mantida;
    - o `page.title` continua "Funções · Fácil": ele é reposto em `on_page_content`, porque é o título da aba do navegador, da busca e da lista Por nível;
    - a linha com o nível, "N exercícios" (ou "N perguntas"), "↺ Rever a aula" e "✎ Sugerir melhoria";
    - as abas de nível;
    - `_esconder(page, "tags", "footer")`;
    - o `proximo_passo`.
  - **Simulado:** fica como hoje.

  Em `on_page_content`, nas páginas de exercício: `_cartoes_de_exercicio` e `_indice_de_exercicios(page.toc)`.
- [ ] **Passo 4:** unittest, `suite.sh` e o validador de Python. **Esperado:** verde. Na página Por nível, o número de itens e os títulos ("Funções · Fácil") são os mesmos de antes da tarefa. Conte no build anterior e no novo.
- [ ] **Passo 5: commit** `feat(site): cabeçalho único, abas de nível, cartões de exercício e próximo passo`

### Tarefa 5: página da resposta

**Arquivos:**
- Modificar:
  - `.mkdocs/hooks.py`: `enunciado_de` guarda também o título da seção; `_pagina_do_py`;
  - `.mkdocs/visual.py`: a resposta lê `page.meta.resposta_de` e monta o menu e o caminho.
- Teste: `.mkdocs/test_hooks.py`.

- [ ] **Passo 1: testes que falham.**
  - **`_pagina_do_py("conteudo/python/exercicios/respostas/06-funcoes/facil/ex01_area_e_perimetro.py", codigo, ("conteudo/python/exercicios/enunciados/06-funcoes/facil.md", "exercício-01-área-e-perímetro", "Exercício 01: Área e perímetro"))`:**
    - começa com o front matter `resposta_de: conteudo/python/exercicios/enunciados/06-funcoes/facil.md` e `exercicio: "01"`;
    - tem `<p class="sobretitulo">Resposta · Exercício 01</p>` antes de `# Área e perímetro`;
    - tem `[← Voltar ao enunciado](../../../enunciados/06-funcoes/facil.md#exercício-01-área-e-perímetro){ .md-button }`;
    - tem `[⤓ Baixar .py](ex01_area_e_perimetro.py){ .md-button .md-button--primary download }`;
    - tem o bloco de código com `title="ex01_area_e_perimetro.py"`.
  - **Com título "Questão 01 · Listas · 2 pontos"** (simulado): o formato de hoje, com `# q1_x.py` e "← Ver enunciado".
  - **Sem enunciado:** o formato de hoje.
- [ ] **Passo 2:** rodar. **Esperado:** falham.
- [ ] **Passo 3: implementação.** Em `visual.on_page_markdown`, quando há `page.meta.get("resposta_de")`:
  - o `Lugar` do enunciado dá a unidade e o nível;
  - o caminho é `caminho(..., resposta=True)`;
  - o menu é `montar_menu(..., src_enunciado=...)`;
  - `page.edit_url = None`;
  - `page.title` = "Resposta: Área e perímetro" (aba do navegador e busca), reposto em `on_page_content`.
- [ ] **Passo 4:** unittest e build. **Esperado:** verde; a resposta sai sem o rodapé de próxima resposta, porque está fora do menu.
- [ ] **Passo 5: commit** `feat(site): página da resposta com o nome do exercício e volta direto ao enunciado`

### Tarefa 6: redirecionamento dos endereços antigos

**Arquivos:**
- Modificar: `.mkdocs/hooks.py` (`REDIRECIONAMENTOS`, `_redirecionamentos`, `_pagina_de_redirecionamento`, `on_post_build`; as URLs publicadas ficam no `_estado` no fim do `on_files`)
- Teste: `.mkdocs/test_hooks.py`

- [ ] **Passo 1: testes que falham.**

```python
def test_redireciona_cada_pagina_do_prefixo_novo(self):
    urls = ["conteudo/python/aulas/", "conteudo/python/aulas/02-listas/", "conteudo/python/README/"]
    self.assertEqual(hooks._redirecionamentos(urls, {"conteudo/python/resumos/": "conteudo/python/aulas/"}), [
        ("conteudo/python/resumos/", "../aulas/"),
        ("conteudo/python/resumos/02-listas/", "../../aulas/02-listas/"),
    ])

def test_nao_sobrescreve_pagina_que_existe(self):
    urls = ["a/novo/x/", "a/velho/x/"]
    self.assertEqual(hooks._redirecionamentos(urls, {"a/velho/": "a/novo/"}), [])

def test_sem_pagina_no_prefixo_novo_nao_redireciona(self):
    self.assertEqual(hooks._redirecionamentos(["a/velho/x/"], {"a/velho/": "a/novo/"}), [])

def test_pagina_de_redirecionamento(self):
    html = hooks._pagina_de_redirecionamento("../../aulas/02-listas/")
    for trecho in ('http-equiv="refresh" content="0; url=../../aulas/02-listas/"', 'rel="canonical"',
                   'name="robots" content="noindex"', 'href="../../aulas/02-listas/"', "location.hash"):
        self.assertIn(trecho, html)
```

- [ ] **Passo 2:** rodar. **Esperado:** falham.
- [ ] **Passo 3: implementação.** `on_post_build(config)` grava `site_dir/<antigo>/index.html` só quando o arquivo não existe.
- [ ] **Passo 4:** unittest e build. **Esperado:** verde. Na branch do portal, Python ainda está em `resumos/`, então nenhum arquivo é gravado.
- [ ] **Passo 5: commit** `feat(site): redireciona os endereços antigos das páginas que mudaram de pasta`

### Tarefa 7: CSS, `portal.js` e roteiros no navegador

**Arquivos:**
- Modificar: `.mkdocs/tailwind.css` (e `site.css` compilado), `.mkdocs/portal.js`.
- Roteiros: `$S/cdp/t18-trilha.mjs`, `$S/cdp/t19-paginas-novas.mjs`.

- [ ] **Passo 1: roteiros que falham** (contra `$S/site-novo` em `localhost:8003`).
  - **t18, menu da trilha:**
    - no computador, numa aula, existe `.trilha-lateral` com o tema certo, a unidade atual tem `aria-current`, e a seta abre e fecha outra unidade (`aria-expanded` e `hidden`);
    - depois de marcar a aula como concluída, o item ganha `data-concluida`, e o texto "1 de N" aparece;
    - no celular (375 px), a gaveta mostra a trilha, "Nesta página" e os atalhos das abas, e os itens têm pelo menos 44 px de altura;
    - a navegação instantânea da aula para Conteúdo mostra o menu do Material, e a volta mostra a trilha;
    - a página da resposta tem o menu com o nível marcado.
  - **t19, páginas:**
    - na aula: sobretítulo, segmentos, nenhum `.md-footer__inner` visível e nenhum `.md-tags` visível;
    - nos exercícios: abas de nível com `aria-current`, `.exercicio-cartao` com o mesmo número de `## Exercício`, e o índice com "01 · ";
    - na resposta, o título é o nome do exercício;
    - no celular, o caminho ocupa uma linha só (altura de uma linha).
- [ ] **Passo 2:** rodar. **Esperado:** falham no que depende de CSS e de JS (contagem, seta, 44 px, linha única).
- [ ] **Passo 3: implementação.**
  - **`portal.js`:**
    - `[data-progresso-menu]` conta as `data-paginas` concluídas e atualiza `[data-feitas]`, a barra (`--pct`) e o `aria-valuenow`;
    - um clique em `.trilha-lateral__abrir` alterna o `aria-expanded` e o `hidden`, com delegação de evento ligada uma vez só;
    - um clique em link `#...` dentro de `.trilha-lateral` fecha a gaveta (`#__drawer`);
    - ao abrir a página, o item atual rola até ficar visível no menu (`block: "nearest"`).
  - **CSS:** os valores da referência visual. Inclui:
    - o menu;
    - o caminho de uma linha no celular (abaixo de 60em, só o último item, com "‹ ");
    - o sobretítulo, a linha de informações, os segmentos e as abas de nível;
    - o cartão do exercício e o próximo passo;
    - o espaço menor no topo no celular;
    - o modo escuro.
- [ ] **Passo 4:** `suite.sh t18-trilha t19-paginas-novas` e os roteiros que já existem (t3 a t17). **Esperado:** tudo verde. Se algum roteiro antigo dependia do layout antigo (rodapé, etiquetas, `informacoes`), ajuste o roteiro e registre a decisão.
- [ ] **Passo 5:** capturas no claro e no escuro, no computador e no celular: aula, exercícios, resposta e tema. Comparar com a referência visual.
- [ ] **Passo 6:** Lighthouse no celular (aula, exercício, resposta, tema). **Esperado:** acessibilidade 100 e desempenho de 90 ou mais.
- [ ] **Passo 7: commit** `feat(site): estilo do menu da trilha e das páginas de aula, exercício e resposta` (com o `site.css`)

### Tarefa 8: documentação

**Arquivos:**
- Modificar: `CONTRIBUTING.md` (seção do site), com o menu da trilha, as respostas fora do menu, os templates sobrescritos e a trava de versão.

- [ ] **Passo 1:** escrever.
- [ ] **Passo 2:** build. **Esperado:** passa.
- [ ] **Passo 3: commit** `docs(site): documenta o menu da trilha e os templates sobrescritos`

### Tarefa 9: Resumos → Aulas (branch `resumo/python-dicionarios-e-funcoes`)

**Arquivos:**
- Mover: `conteudo/python/resumos/` → `conteudo/python/aulas/`
- Modificar:
  - `README.md`, `conteudo/README.md`, `conteudo/python/README.md` e `conteudo/python/exercicios/README.md`;
  - os 6 `enunciados/*/facil.md` de Python;
  - os `intermediario.md` e `dificil.md` que tenham "Antes, leia";
  - `CONTRIBUTING.md`;
  - `conteudo/python/aulas/06-funcoes.md` (linha de navegação).
- **Não tocar:** `CLAUDE.md`, nem os `resumos/` de Cálculo.

- [ ] **Passo 1: o teste que falha.** O build da prévia com a lista de redirecionamentos e `grep -rn "python/resumos\|\.\./resumos/" --include=*.md conteudo README.md CONTRIBUTING.md` (sem o CLAUDE.md). **Esperado:** acha links.
- [ ] **Passo 2:** `git mv` e a troca dos links.
  - Os enunciados usam `../../../resumos/`, e os READMEs usam `resumos/`.
  - Revise trecho a trecho, porque o Cálculo também tem `resumos/`.
- [ ] **Passo 3:** os textos.
  - A coluna "Resumo" da tabela do roteiro vira "Aula".
  - "Resumos (…)" vira "Aulas (…)".
  - "resumo" vira "aula" quando o texto se refere a essas páginas.
  - A linha 3 de `06-funcoes.md` vira `> [← Dicionários](05-dicionarios.md) · [Voltar para Python →](../README.md)`.
- [ ] **Passo 4:**
  - o `grep` volta vazio;
  - o build `--strict` passa na branch e na prévia;
  - `validar_python.py` dá 88 de 88;
  - na prévia, `/conteudo/python/resumos/02-listas/` redireciona para `/conteudo/python/aulas/02-listas/`.
- [ ] **Passo 5: commit** `docs(python): renomeia resumos para aulas`

### Tarefa 10: prévia, revisão final e entrega

- [ ] **Passo 1:** recriar a prévia (worktree temporária `previa/portal-com-python`, a partir do portal, com merge do conteúdo e sem assinar), fazer o build em `$S/site-validacao` com `SITE_URL=http://localhost:8000/`, e conferir que a porta 8000 serve a prévia.
- [ ] **Passo 2:** revisão final do conjunto todo, por quem não escreveu o código. Cobre o diff das duas branches desde a main e os pontos para a revisão deste plano.
- [ ] **Passo 3:** os achados Críticos e Importantes são corrigidos com TDD, numa passada só. Os Menores vão para o registro e para a mensagem final.
- [ ] **Passo 4:** a mensagem ao usuário, com:
  - o link da prévia;
  - o que mudou;
  - as decisões registradas;
  - os itens menores adiados;
  - a lembrança de que nada foi enviado e de que o CLAUDE.md da main precisa ser atualizado depois dos merges.
