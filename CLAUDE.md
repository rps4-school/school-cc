# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A study-material repository for Computer Science (Ciência da Computação) students, made by students. Don't name the institution in the content. It holds summaries, exercises, roadmaps and tips. It is mostly Markdown, plus standalone Python exercise solutions, published as a site (see "Site" below). There is no test framework.

**All content is written in Brazilian Portuguese.** New material and commit messages must be in pt-BR too.

## Layout and conventions

- **Content is organized by topic, never by course term or subject:** `conteudo/<tema>/` (today `python/` and `git/`; future ones like `math/`). Each topic has a `README.md` (about, study roadmap, links) and only the folders it actually uses (`resumos/`, `exercicios/`, `materiais/`, `img/`). Don't create empty topics.
- Navigation on GitHub is by hand. Every page starts with a `> [← voltar ...]` breadcrumb, and index tables list the children: the root `README.md` and `conteudo/README.md` list the topics.

  **When you add a topic or exercise, update the parent indexes as well.**
- Names are lowercase, without accents, with hyphens (`sistemas-digitais`). Numbered when order matters (`01-condicionais.md`). The exception is Python files, which use `_` (`ex01_par_ou_impar.py`).
- **Level of each topic page:** right below the H1 breadcrumb, a line `**Nível:** 🟢 Iniciante` / `🟡 Intermediário` / `🔴 Avançado` (exact words; `tags_allowed` in `mkdocs.yml` fails the build on anything else). `visual.py` turns it into a Material tag and the generated `niveis.md` page lists pages by level. Exercise statements get the tag from their filename (`facil` → Iniciante, `intermediario` → Intermediário, `dificil` → Avançado). Index tables on GitHub also have a "Nível" column: keep both in sync.
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
  - builds the home page (hero + cards, no sidebars).
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
