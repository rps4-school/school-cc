# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A study-material repository for Computer Science (Ciência da Computação) students, made by students. Don't name the institution in the content. It holds summaries, exercises, roadmaps and tips. It is mostly Markdown, plus standalone Python exercise solutions, published as a site (see "Site" below). There is no test framework.

**All content is written in Brazilian Portuguese.** New material and commit messages must be in pt-BR too.

## Layout and conventions

- **Content is organized by topic, never by course term or subject:** `conteudo/<tema>/` (today `python/`, `git/` and `sistemas-digitais/`; future ones like `math/`). Each topic has a `README.md` (about, study roadmap, links) and only the folders it actually uses (`resumos/`, `aulas/`, `exercicios/`, `materiais/`, `img/`). `aulas/` holds full lessons (theory, worked examples, "Erros comuns", "Macetes", a "✅ Teste rápido" and Referências) for topics where a short summary isn't enough, like `sistemas-digitais/`. Don't create empty topics.
- Navigation on GitHub is by hand. Every page starts with a `> [← voltar ...]` breadcrumb, and index tables list the children: the root `README.md` and `conteudo/README.md` list the topics.

  **When you add a topic or exercise, update the parent indexes as well.**
- Names are lowercase, without accents, with hyphens (`sistemas-digitais`). Numbered when order matters (`01-condicionais.md`). The exception is Python files, which use `_` (`ex01_par_ou_impar.py`).
- **Level of each topic page:** right below the H1 breadcrumb, a line `**Nível:** 🟢 Iniciante` / `🟡 Intermediário` / `🔴 Avançado` (exact words; `tags_allowed` in `mkdocs.yml` fails the build on anything else). `visual.py` turns it into a Material tag and the generated `niveis.md` page lists pages by level. Exercise pages (anything under `/exercicios/`) get the tag from their filename (`facil` → Iniciante, `intermediario` → Intermediário, `dificil` → Avançado). Index tables on GitHub also have a "Nível" column: keep both in sync.
- `simulados/<tema>/simulado-NN/`: practice exams. `README.md` is the exam (rules, "Questão NN · Assunto · N pontos" sections, "📌 Comando exigido" boxes, execution examples) and `respostas/qN_*.py` holds one answer per question. The line `**Duração sugerida:** … · **Pontuação:** … · **Assuntos:** …` becomes the exam sheet with a countdown timer on the site (`visual.py`). **Never publish original course exams:** adapt them (new story and values, same skill). Execution examples must come from actually running the answer (prompts plus typed input). Sistemas Digitais exams (`simulados/sistemas-digitais/`) have no `respostas/` folder and no Python editor: each item has its answer in a `<details>` read by the answer checker (open-ended items get a "Resposta esperada" without it), questions 01–08 are worth 8 points and 09–12 are worth 9, and circuit figures live in the exam's `img/` folder.
- Diagrams: SVG files in an `img/` folder next to the page (white background, so they work in dark mode) or ` ```mermaid ` blocks (`gitGraph` for branches). Both render on GitHub and on the site. Avoid ASCII drawings.
- Content style: short text, lots of tables, and a `## 📚 Referências` section at the end, with pt-BR sources when they exist. Don't invent syllabus content: sections that depend on the real course stay as `_A preencher._`.

## Python exercises (`conteudo/python/exercicios/`)

- The statement lives in `enunciados/<NN-tema>/<facil|intermediario|dificil>.md`. The answer is a separate file in `respostas/<NN-tema>/<nivel>/exNN_nome.py`. Exercises are numbered 01–09 within each topic: 01–03 easy, 04–06 intermediate, 07–09 hard.
- **Statement format (treat it as a contract):**
  - each exercise is a `## Exercício NN: Título` section;
  - it has pairs of ` ```text ` blocks, labeled `**Entrada:**` / `**Saída:**`;
  - it ends with a link `[✅ Ver resposta](../../respostas/...py)`.

  Use ` ```text ` **only** for input/output examples. Diagrams go in plain ` ``` ` blocks.
- Answers use **only pure Python, with no `import`** (the purpose is educational). They read from `input()`, write with `print()` and include comments explaining the reasoning. The output must match the statement exactly, including accents and capitalization.
- Test one answer:

  ```bash
  printf "3\n8\n" | python3 conteudo/python/exercicios/respostas/01-condicionais/facil/ex02_maior_de_dois.py
  ```

  To validate everything, parse each statement's `text` block pairs, run the linked `.py` with the input, and compare its output to the expected output.

## Sistemas Digitais exercises (`conteudo/sistemas-digitais/exercicios/`)

- One file per topic and level: `<NN-tema>/<facil|intermediario|dificil>.md` (topics follow the 9 lessons in `aulas/`), with exercises numbered 01–09 like Python. There is no `respostas/` folder: each `## Exercício NN: Título` has its answers inline, one `<details>` per item (`**a)**`, `**b)**`...), whose first line is ``**Resposta:** `…` ``, ``**Expressão:** `…` `` or ``**Expressão mínima:** `…` `` (the site's answer checker reads it), followed by the step-by-step solution.
- The level tag comes from the filename, as with Python (any page under `/exercicios/`). Folder titles with accents come from `TITULOS` in `hooks.py`, looked up after dropping the `NN-` prefix.
- Exercises are original or adapted (new story and values) from the course lists and the user's own question banks; every answer must be computed, not typed by hand, and expressions must be checked against their truth table (and for minimality, when the item asks for the minimal form).

## Site (GitHub Pages)

- The whole repo is published with MkDocs Material to <https://rps4-school.github.io/school-cc/> by `.github/workflows/pages.yml`: it builds on every PR and deploys on push to `main`. The config lives in `.mkdocs/`. `docs_dir` is the repo root (`..`), and `site_dir` must stay outside the repo (the `SITE_DIR` env var).
- Two hooks, in this order (`mkdocs.yml`): `hooks.py` (structure) and `visual.py` (presentation only). Both import `_componentes.py` (HTML cards with Tailwind classes, `sem_emoji`).
- `.mkdocs/hooks.py` does what isn't obvious:
  - generates an `index.md` with a grid of cards for each folder without a README, except folders in `PASTAS_OCULTAS` (e.g. `img/`): those are published but don't show up in the menu;
  - adds "Outros arquivos" to the README of any folder that has non-`.md` files;
  - turns each `.py` into a page `<nome>.md` with the code and a link back to the statement;
  - rewrites links to folders and `.py` files to point at those pages;
  - adds `markdown="1"` to `<details>`;
  - orders the top tabs and puts levels in the order Fácil → Intermediário → Difícil.

  **Folder names without a README and without an accent get their title from `TITULOS`** in the hook.
- `.mkdocs/visual.py` only changes how the site shows content; the Markdown on GitHub stays the same:
  - removes the manual navigation (`← voltar`, `Próximo:`) and all emoji from titles, keeping GitHub's anchor id via `{ #id }`;
  - turns `> 💡` / `> ⚠️` / `> 📖` blockquotes into tip/warning/info admonitions;
  - puts `**Entrada:**`/`**Saída:**` pairs side by side;
  - turns `[✅ Ver resposta]` into a button, and index tables (`| [**X**](link) | desc |`) into cards;
  - builds the home page (hero + cards, no sidebars);
  - before each `<details>` whose first line is ``**Resposta:** `…` ``, ``**Expressão:** `…` `` or ``**Expressão mínima:** `…` ``, puts a `<div class="corretor">` that `.mkdocs/corretor.js` turns into an answer box. `Resposta` compares values loosely (spaces, case, accents, `0x`, comma or dot, ` | ` alternatives; leading zeros only count when the answer has them). `Expressão` accepts any equivalent Boolean expression by comparing truth tables, and `Expressão mínima` also rejects ones with more literals. It's pure JS with no CDN, and per-page progress is kept in `localStorage`. Every answer in these blocks must be checked by actually computing it;
  - on Python exam pages (`simulados/python/`, with the `**Duração sugerida:**` line), puts a `<div class="editor-python">` before each question's `[✅ Ver resposta]`. `.mkdocs/editor.js` turns it into a Monaco editor with an interactive terminal, and `.mkdocs/python-worker.js` runs the code with Pyodide. The editor **depends on the jsDelivr CDN**: Monaco and Pyodide load from it only when the student clicks "Abrir editor", with versions pinned in the JS and an SRI hash on Monaco's `loader.js` (update `MONACO_SRI` when bumping the version; Pyodide is loaded with `importScripts` in the worker, which has no SRI). `input()` works by re-running the program with the inputs typed so far (GitHub Pages can't send the COOP/COEP headers that SharedArrayBuffer needs), which is fine because exams forbid `import`. When the program asks for an input that doesn't exist yet (or prints too much), the worker posts that result to the page *before* raising, so a bare `except:` in the student's code can't hide it; if the program keeps running after that, `editor.js` kills the worker after a short grace period (`FOLGA`). There is one worker per page and one run at a time: the 10 s timeout starts when a run reaches the worker, and a timeout or "Parar" kills only that run (the worker is recreated for the queued ones). Files in `.mkdocs/` aren't picked up by MkDocs, so `visual.py` publishes them through `ARQUIVOS_DO_SITE`.
- Styling: `.mkdocs/tailwind.css` → **`.mkdocs/site.css` is committed** (compiled with `npm run css --prefix .mkdocs`; CI fails if it's stale). Tailwind is loaded **without preflight** and with `important` utilities, so it doesn't break Material. Dark mode follows `[data-md-color-scheme=slate]`. After changing classes in the hooks, recompile the CSS.
- Validate locally, the same way as CI:

  ```bash
  SITE_DIR=/tmp/school-cc-site mkdocs build --strict -f .mkdocs/mkdocs.yml
  ```

  Anchors use GitHub's slugify, so `#exercício-05-...` works in both places. Versions are pinned in `.mkdocs/requirements.txt`: don't upgrade to MkDocs 2.x.
- `CLAUDE.md` is excluded from the site (`exclude_docs`).

## Git in this repo

- The remote uses the SSH alias `github.com-school`, and the repo-local config forces the `~/.ssh/school` key (`core.sshCommand`). Commits are SSH-signed (`commit.gpgsign=true`) with a repo-local identity (`user.name`/`user.email`). Don't change the local `user.*` or `core.sshCommand`.
- Commit messages follow `tipo(escopo): descrição` in pt-BR:
  - types: `docs`, `feat`, `fix`, `chore`;
  - scope = the topic folder name (`python`, `git`...), or `site` for `.mkdocs/`.

  Changes go through a branch and a PR to `main` (see `CONTRIBUTING.md` and `GUIA-DE-ACESSO.md`).
- Links are all relative. After moving or renaming files, check that none are broken.
