# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A study-material repository for Computer Science (Ciência da Computação) students, made by students. Don't name the institution in the content. It holds lessons, summaries, exercises, practice exams, roadmaps and tips. It is mostly Markdown, plus standalone Python exercise solutions, published as a study portal (see "Site" below). The site code has tests (see "Tests").

**All content is written in Brazilian Portuguese.** New material and commit messages must be in pt-BR too.

## Layout and conventions

- **Content is organized by topic, never by course term or subject:** `conteudo/<tema>/` (today `python/`, `git/`, `calculo/` and `sistemas-digitais/`). Each topic has a `README.md` (about, study roadmap, links) and only the folders it actually uses: `aulas/` (one lesson per subject), `resumos/` (summaries and cheat sheets, like Cálculo's `formulario.md`), `exercicios/`, `materiais/`, `img/`. Don't create empty topics.
- **New topic:** add its row to the tables in `conteudo/README.md` and the root `README.md`, and its area and icon to `TEMAS` in `.mkdocs/_catalogo.py` (Programação, Hardware, Matemática...). Without an entry there, it shows up under "Outros".
- **The roadmap table in each topic README drives the site** (topic page, left menu, counts, "Por nível"): `| # | Aula | Nível | O que você aprende | Exercícios |`. The unit column may be called Aula, Resumo or Arquivo. Each row links the lesson and, in the Exercícios column, its `facil.md` / `intermediario.md` / `dificil.md`. "Este arquivo" makes the README itself a unit; rows without a link (`_A preencher._`) are skipped.
- Navigation on GitHub is by hand. Every page starts with a `> [← voltar ...]` breadcrumb, and index tables list the children: the root `README.md` and `conteudo/README.md` list the topics.

  **When you add a topic or exercise, update the parent indexes as well.**
- Names are lowercase, without accents, with hyphens (`sistemas-digitais`). Numbered when order matters (`01-condicionais.md`). The exception is Python files, which use `_` (`ex01_par_ou_impar.py`).
- **Level of each topic page:** right below the H1 breadcrumb, a line `**Nível:** 🟢 Iniciante` / `🟡 Intermediário` / `🔴 Avançado` (exact words; `tags_allowed` in `mkdocs.yml` fails the build on anything else). `visual.py` turns it into a Material tag and the generated `niveis.md` page lists pages by level. Exercise statements get the tag from their filename (`facil` → Iniciante, `intermediario` → Intermediário, `dificil` → Avançado). Index tables on GitHub also have a "Nível" column: keep both in sync.
- **Auto-grader:** inside a `<details>`, a first line `**Resposta:** \`...\`` (or `Número`, `Expressão`, `Expressão mínima`, `Função`, `Primitiva`) becomes an answer box on the site (`corretor.js`). Formulas use `$...$` / `$$...$$` (KaTeX), as on GitHub.
- `simulados/<tema>/simulado-NN/`: practice exams. `README.md` is the exam (rules, "Questão NN · Assunto · N pontos" sections, "📌 Comando exigido" boxes, execution examples) and `respostas/qN_*.py` holds one answer per question. The line `**Duração sugerida:** … · **Pontuação:** … · **Assuntos:** …` becomes the exam sheet with a countdown timer on the site (`visual.py`). **Never publish original course exams:** adapt them (new story and values, same skill). Execution examples must come from actually running the answer (prompts plus typed input).
- Diagrams: SVG files in an `img/` folder next to the page (white background, so they work in dark mode) or ` ```mermaid ` blocks (`gitGraph` for branches). Both render on GitHub and on the site. Avoid ASCII drawings.
- Content style: short text, lots of tables, and a `## 📚 Referências` section at the end, with pt-BR sources when they exist. Don't invent syllabus content: sections that depend on the real course stay as `_A preencher._`.

## Python exercises (`conteudo/python/exercicios/`)

- Lessons live in `conteudo/python/aulas/NN-tema.md`. The statement lives in `enunciados/<NN-tema>/<facil|intermediario|dificil>.md`. The answer is a separate file in `respostas/<NN-tema>/<nivel>/exNN_nome.py`. Exercises are numbered 01–09 within each topic: 01–03 easy, 04–06 intermediate, 07–09 hard.
- **Statement format (treat it as a contract):**
  - each exercise is a `## Exercício NN: Título` section;
  - it has pairs of ` ```text ` blocks, labeled `**Entrada:**` / `**Saída:**`;
  - it ends with a link `[✅ Ver resposta](../../respostas/...py)`.

  The site takes the answer page title from that `## Exercício NN: Título` section.

  Use ` ```text ` **only** for input/output examples. Diagrams go in plain ` ``` ` blocks.
- Answers use **only pure Python, with no `import`** (the purpose is educational). They read from `input()`, write with `print()` and include comments explaining the reasoning. The output must match the statement exactly, including accents and capitalization.
- Test one answer:

  ```bash
  printf "3\n8\n" | python3 conteudo/python/exercicios/respostas/01-condicionais/facil/ex02_maior_de_dois.py
  ```

  To validate everything, parse each statement's `text` block pairs, run the linked `.py` with the input, and compare its output to the expected output.

## Site (GitHub Pages)

- The whole repo is published with MkDocs Material to <https://rps4-school.github.io/school-cc/> by `.github/workflows/pages.yml`: it builds on every PR and deploys on push to `main`. The config lives in `.mkdocs/`. `docs_dir` is the repo root (`..`), and `site_dir` must stay outside the repo (the `SITE_DIR` env var).
- **The site is a study portal:**
  - home with one block per area, and a generated page per area (`conteudo/<área>/index.md`);
  - "Conteúdo" (catalog with search and area filter), "Por nível", the topic page with the trail, and "Meu progresso";
  - **progress lives only in the student's browser** (`localStorage`, key `school-cc:progresso`, in `progresso.js`). There is no login.
- Python modules in `.mkdocs/`:
  - `hooks.py` (structure) and `visual.py` (presentation), in this order (`mkdocs.yml`);
  - `_catalogo.py`: topics, trails and practice exams read from the Markdown tables (data only);
  - `_componentes.py`: HTML pieces (Tailwind classes) and the `data-*` contracts that `portal.js` reads;
  - `_trilha.py`: the left menu and the breadcrumb.
- `.mkdocs/hooks.py` does what isn't obvious:
  - generates an `index.md` with a grid of cards for each folder without a README, except folders in `PASTAS_OCULTAS` (e.g. `img/`): those are published but don't show up in the menu;
  - adds "Outros arquivos" to the README of any folder that has non-`.md` files;
  - turns each `.py` into a page `<nome>.md` with the code and a link back to the statement (`resposta_de` in its front matter);
  - keeps exercise answers and their folders out of the menu (`NOT_IN_NAV`), and flattens `enunciados/` in the Material menu;
  - rewrites links to folders and `.py` files to point at those pages;
  - adds `markdown="1"` to `<details>`;
  - orders the top tabs, groups topics by area (the area page is the section index) and puts levels in the order Fácil → Intermediário → Difícil;
  - `REDIRECIONAMENTOS`: when a folder is renamed, add its old → new prefix, and the build writes redirect pages at the old URLs.

  **Folder names without a README and without an accent get their title from `TITULOS`** in the hook.
- `.mkdocs/visual.py` only changes how the site shows content; the Markdown on GitHub stays the same:
  - removes the manual navigation (`← voltar`, `Próximo:`, `Voltar para`, `📖 Antes, leia`) and all emoji from titles, keeping GitHub's anchor id via `{ #id }`;
  - turns `> 💡` / `> ⚠️` / `> 📖` blockquotes into tip/warning/info admonitions;
  - puts `**Entrada:**`/`**Saída:**` pairs side by side;
  - turns `[✅ Ver resposta]` into a button, and index tables (`| [**X**](link) | desc |`) into cards;
  - builds the portal pages (home, catalog, area pages, "Por nível", "Meu progresso") and the topic trail;
  - adds the header (overline, level, reading time, "Sugerir melhoria") and the single next-step block to lessons, exercises and answers;
  - puts the left menu and the breadcrumb in `page.meta`;
  - inserts the overline and the exercise cards in `on_page_context`, after search indexing, so search keeps one entry per page.
- **Two Material templates are overridden** in `.mkdocs/overrides/partials/` (`nav.html`, `path.html`). Versions are pinned in `.mkdocs/requirements.txt` (don't upgrade to MkDocs 2.x). `test_hooks.py` fails when `mkdocs-material` changes version: compare both files with the new ones before bumping it.
- JavaScript, with no framework, no bundler and always `defer`:
  - `portal.js`, `progresso.js`, `corretor.js`, `cronometro.js`, `diagramas.js` (Mermaid on demand), `katex-init.js`;
  - `editor.js` + `python-worker.js`: the Python editor in the Python practice exams.

  With `navigation.instant`, scripts start from Material's `document$` and mark what they mounted with `data-montado`. Data for scripts goes in `data-*` attributes, never in `<script>` tags inside the content, because those re-run on every page change.
- Styling: `.mkdocs/tailwind.css` → **`.mkdocs/site.css` is committed** (compiled with `npm run css --prefix .mkdocs`; CI fails if it's stale). Tailwind is loaded **without preflight** and with `important` utilities, so it doesn't break Material. Dark mode follows `[data-md-color-scheme=slate]`. After changing classes in the hooks, recompile the CSS.
- Validate locally, the same way as CI (first time: `pip install -r .mkdocs/requirements.txt` and `npm ci --prefix .mkdocs`):

  ```bash
  SITE_DIR=/tmp/school-cc-site mkdocs build --strict -f .mkdocs/mkdocs.yml
  ```

  Anchors use GitHub's slugify, so `#exercício-05-...` works in both places. Instant navigation only intercepts links listed in `sitemap.xml`, which is built from `site_url`: for a local build served by another server, set `SITE_URL=http://localhost:8000/`.
- `CLAUDE.md` is excluded from the site (`exclude_docs`).

## Tests

- **Python** (`unittest`, no extra dependency), covering catalog, components, hooks, menu and breadcrumb: `python3 -m unittest discover -s .mkdocs -p "test_*.py"`.
- **JavaScript** (`node:test`), covering the auto-grader and the progress store: `node --test .mkdocs/corretor.test.js .mkdocs/progresso.test.js`.
- `.github/workflows/testes.yml` runs both on every PR. `pages.yml` runs the strict build and checks that `site.css` is up to date.
- Python answers are checked by running them with the statement inputs (see "Python exercises").

## Git in this repo

- The remote uses the SSH alias `github.com-school`, and the repo-local config forces the `~/.ssh/school` key (`core.sshCommand`). Commits are SSH-signed (`commit.gpgsign=true`) with a repo-local identity (`user.name`/`user.email`). Don't change the local `user.*` or `core.sshCommand`.
- Commit messages follow `tipo(escopo): descrição` in pt-BR:
  - types: `docs`, `feat`, `fix`, `chore`, `ci`;
  - scope = the topic folder name (`python`, `git`...), or `site` for `.mkdocs/`.

  Changes go through a branch and a PR to `main` (see `CONTRIBUTING.md` and `GUIA-DE-ACESSO.md`).
- **`main` is protected by a ruleset:** PRs need 1 approval, merges are squash only, and commits must be signed. A PR opened by the maintainer account itself can only be merged with admin rights (`gh pr merge --admin --squash`). Ask before using that.
- Branch names: `resumo/<tema>-<assunto>`, `exercicio/<tema>-<assunto>`, `feat/<descricao>`, `fix/<descricao>`, `docs/<descricao>`.
- PR reviews: the `revisor-de-pr` agent (`.claude/agents/`) is set up for this repo.
- **`CLAUDE.md` is only edited directly on `main`, never in a PR or feature branch.** Don't commit changes to it on any other branch; if a PR touches it, restore it with `git checkout origin/main -- CLAUDE.md` before squashing. The `Proteger CLAUDE.md` check (`.github/workflows/claude-md.yml`) fails PRs that change it.
- Links are all relative. After moving or renaming files, check that none are broken.
