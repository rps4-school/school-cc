# 🤝 Guia de Contribuição

> [← voltar para o início](README.md)

Antes de começar, siga o [Guia de Acesso](GUIA-DE-ACESSO.md) para configurar o Git, a chave SSH e a assinatura de commits.

## Onde colocar cada coisa

```
conteudo/<tema>/          ← python, git, math...
├── README.md     ← sobre o tema, roteiro de estudo e links
├── resumos/      ← um .md por assunto
├── exercicios/   ← listas e resoluções
└── materiais/    ← slides, PDFs e afins
```

- **Pastas e arquivos:** minúsculas, sem acento, palavras separadas por hífen.
  Exemplos: `estruturas-condicionais.md`, `lista-01.md`, `lista-01-resolucao.py`.
- **Arquivos Python** usam `_` no lugar do hífen (padrão da linguagem): `ex01_par_ou_impar.py`.
- **Simulado novo:** crie `simulados/<tema>/simulado-NN/README.md` com a prova e `respostas/qN_nome.py` com uma resposta por questão. Logo abaixo do nível, coloque a linha `**Duração sugerida:** 1h40 · **Pontuação:** 100 pontos · **Assuntos:** ...`: no site, ela vira a folha de prova com cronômetro. Use questões **próprias ou adaptadas**, nunca a prova original de uma disciplina. Depois, adicione o simulado na tabela de [`simulados/README.md`](simulados/README.md).
- **Nível de cada assunto:** logo abaixo do título, coloque uma linha `**Nível:** 🟢 Iniciante`, `**Nível:** 🟡 Intermediário` ou `**Nível:** 🔴 Avançado`. No site, ela vira uma etiqueta e entra na página "Por nível". Os exercícios não precisam dela, porque o nível vem do nome do arquivo (fácil, intermediário, difícil).
- **Numere o que tem ordem:** `01-variaveis.md`, `02-condicionais.md`, ...
- **O material é organizado por tema, e não por matéria ou período.** Um mesmo tema (ex.: `python`) serve para qualquer disciplina que o use.
- **Tema novo:** crie `conteudo/<tema>/README.md` e só as pastas que tiverem conteúdo. Depois adicione o tema nas tabelas de [`conteudo/README.md`](conteudo/README.md) e do [README principal](README.md).

## Branches

| Tipo | Padrão | Exemplo |
| ---- | ------ | ------- |
| Resumo | `resumo/<tema>-<assunto>` | `resumo/python-lacos` |
| Exercício | `exercicio/<tema>-<assunto>` | `exercicio/math-lista-01` |
| Correção | `fix/<descricao>` | `fix/link-quebrado-git` |
| Estrutura/docs | `docs/<descricao>` | `docs/adiciona-tema-linux` |

## Commits

Use o formato `tipo(escopo): descrição`, no imperativo e em minúsculas:

```
docs(python): adiciona resumo de laços de repetição
feat(math): adiciona lista 01 com resolução
fix(git): corrige exemplo de rebase
```

| Tipo | Quando usar |
| ---- | ----------- |
| `docs` | Resumos, READMEs, dicas, roadmap |
| `feat` | Exercícios, códigos, novos materiais |
| `fix` | Correções de conteúdo ou links |
| `chore` | Organização, renomear e mover arquivos |

**Escopo = nome da pasta do tema:** `python`, `git`, `math`... Para mudanças fora de `conteudo/`, use `site` ou deixe sem escopo.

Todos os commits devem ser **assinados** (veja o [passo 8 do Guia de Acesso](GUIA-DE-ACESSO.md#8-assinar-commits)).

## CLAUDE.md

**Não altere o `CLAUDE.md` em PR.** Ele só é editado direto na `main`, por quem mantém o repositório. Um PR que mexe nele falha no check **Proteger CLAUDE.md**. Se a sua mudança precisa de uma regra nova lá, avise no PR.

## Site (GitHub Pages)

Todo o repositório vira o site <https://rps4-school.github.io/school-cc/>, publicado automaticamente a cada merge na `main`. **Não é preciso fazer nada além de escrever o Markdown.** No site:

- pastas sem README viram uma página de cartões, e cada `.py` vira uma página com o código colorido;
- os links "← voltar" e os emojis dos títulos somem (o site já tem menu e trilha de navegação);
- citações que começam com 💡, ⚠️ ou 📖 viram caixas de dica, atenção e leitura;
- os exemplos `**Entrada:**` / `**Saída:**` aparecem lado a lado.

O build roda em todo PR e **falha se houver link ou âncora quebrados**. Para ver o site no seu computador antes de abrir o PR:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r .mkdocs/requirements.txt
mkdocs serve -f .mkdocs/mkdocs.yml     # abra http://127.0.0.1:8000/school-cc/
```

Só quem mexer no visual (`.mkdocs/visual.py`, `_componentes.py`, `hooks.py` ou `tailwind.css`) precisa de Node, para recompilar o CSS e fazer commit do `.mkdocs/site.css`:

```bash
npm ci --prefix .mkdocs
npm run css --prefix .mkdocs           # ou css:watch, enquanto edita
```

## Boas práticas

- ✍️ **Escreva com suas palavras.** Um resumo é mais útil que uma cópia do slide.
- 📎 **Cite a fonte** de materiais de terceiros (livro, site, vídeo).
- 🚫 **Não suba** material protegido por direitos autorais sem permissão (livros em PDF, provas oficiais etc.). Prefira colocar o link.
- 🔐 **Nunca suba** senhas, tokens, chaves ou dados pessoais.
- 🖼️ Prefira Markdown e código a imagens de texto. Se usar imagens, deixe na mesma pasta do resumo que usa a imagem.
