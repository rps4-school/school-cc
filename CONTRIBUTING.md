# 🤝 Guia de Contribuição

> [← voltar para o início](README.md)

Antes de começar, siga o [Guia de Acesso](GUIA-DE-ACESSO.md) para configurar o Git, a chave SSH e a assinatura de commits.

## Onde colocar cada coisa

```
conteudo/<tema>/          ← python, git, sistemas-digitais, calculo...
├── README.md     ← sobre o tema, roteiro de estudo e links
├── resumos/      ← um .md por assunto
├── aulas/        ← aulas completas, quando um resumo não basta
├── exercicios/   ← listas e resoluções
└── materiais/    ← slides, PDFs e afins
```

- **Pastas e arquivos:** minúsculas, sem acento, palavras separadas por hífen.
  Exemplos: `estruturas-condicionais.md`, `lista-01.md`, `lista-01-resolucao.py`.
- **Arquivos Python** usam `_` no lugar do hífen (padrão da linguagem): `ex01_par_ou_impar.py`.
- **Simulado novo:** crie `simulados/<tema>/simulado-NN/README.md` com a prova e `respostas/qN_nome.py` com uma resposta por questão. Logo abaixo do nível, coloque a linha `**Duração sugerida:** 1h40 · **Pontuação:** 100 pontos · **Assuntos:** ...`: no site, ela vira a folha de prova com cronômetro. Use questões **próprias ou adaptadas**, nunca a prova original de uma disciplina. Depois, adicione o simulado na tabela de [`simulados/README.md`](simulados/README.md). Nos simulados de **Sistemas Digitais** e de **Cálculo** não há `respostas/`: cada item de `## Questão NN · Assunto · N pontos` tem a resposta num `<details>` com corretor (veja abaixo), e itens abertos trazem uma "Resposta esperada" sem corretor.
- **Nível de cada assunto:** logo abaixo do título, coloque uma linha `**Nível:** 🟢 Iniciante`, `**Nível:** 🟡 Intermediário` ou `**Nível:** 🔴 Avançado`. No site, ela vira uma etiqueta e entra na página "Por nível". Os exercícios não precisam dela, porque o nível vem do nome do arquivo (fácil, intermediário, difícil).
- **Roteiro do tema (vira a trilha no site):** no `README.md` do tema, a primeira tabela cujo cabeçalho começa com `| # |` é o roteiro. No site, ela vira uma trilha, com uma etapa por linha e o progresso do aluno. As colunas são reconhecidas pelo nome; a ordem não importa e uma coluna a mais não atrapalha:

    | Coluna | Nomes aceitos | O que vai nela |
    | ------ | ------------- | -------------- |
    | Número | `#` | `1`, `2`... (deve ser a primeira coluna) |
    | Unidade | `Aula`, `Resumo` ou `Arquivo` | Link para o `.md` da aula ou resumo. `**Este arquivo**` vira "Introdução" (o próprio README); outras linhas sem link, como `_A preencher._`, ficam fora da trilha |
    | Nível | `Nível` | `🟢 Iniciante`, `🟡 Intermediário` ou `🔴 Avançado` |
    | Descrição | `O que você aprende` ou `Você vai aprender` | Uma frase |
    | Exercícios | `Exercícios` | Links para `facil.md`, `intermediario.md` e `dificil.md` do assunto |

- **Tema novo no portal:** basta a linha do tema na tabela de [`conteudo/README.md`](conteudo/README.md). As contagens (aulas, exercícios, simulados) saem dos arquivos. Para ter área e ícone próprios no catálogo, acrescente uma linha no `TEMAS` de `.mkdocs/_catalogo.py`; sem ela, o tema aparece em "Outros".
- **Numere o que tem ordem:** `01-variaveis.md`, `02-condicionais.md`, ...
- **O material é organizado por tema, e não por matéria ou período.** Um mesmo tema (ex.: `python`) serve para qualquer disciplina que o use.
- **Pergunta com correção automática:** coloque a resposta dentro de um bloco `<details>`, na primeira linha, num destes formatos. No GitHub o bloco vira "Ver resposta"; no site, ganha também um campo para o aluno digitar e conferir na hora:

    ```markdown
    **1.** Converta 45 para binário.

    <details>
    <summary>Ver resposta</summary>

    **Resposta:** `101101`

    Passo a passo...
    </details>
    ```

    | Primeira linha | O corretor aceita |
    | -------------- | ----------------- |
    | `` **Resposta:** `valor` `` | O mesmo valor, sem ligar para espaços, maiúsculas, acentos, `0x` ou vírgula/ponto. Separe alternativas com uma barra vertical entre espaços |
    | `` **Expressão:** `A'B + C` `` | Qualquer expressão booleana **equivalente** (compara a tabela-verdade) |
    | `` **Expressão mínima:** `A'B + C` `` | Equivalente **e** sem letras a mais (para perguntas de simplificação) |
    | `` **Número:** `1/4` `` | O mesmo valor numérico: `0,25`, `2/8`, `√2/2`, `π`, `e^2`, `ln 3`, `∞`. Decimais arredondados ou truncados com 2 casas ou mais também valem (`0,33` ou `0,3333` para `1/3`), desde que tenham 2 algarismos significativos (`0,00` não vale para `1/1024`) e a certa não seja um decimal exato (para `4`, `4,01` está errado). Aceita separador de milhar (`2.000`, `2 000`). Para métodos numéricos, dê a tolerância: `` `1,414214 ± 0,0001` ``. Textos como `não existe` entram como alternativa |
    | `` **Função:** `3x^2 + 2` `` | Qualquer função **equivalente**, testada em vários pontos (qualquer letra serve de variável) |
    | `` **Primitiva:** `x^3/3 + C` `` | Qualquer função que difere da certa só por uma **constante**, e avisa se faltar o `+ C`. Recusa resposta que não existe onde a certa existe (como `ln(x)` sem o módulo) |

    Para conferir se todo gabarito passa no próprio corretor, rode `node --test .mkdocs/corretor.test.js` (a CI também roda).

- **Exercícios de Sistemas Digitais e de Cálculo:** um arquivo por assunto e nível em `conteudo/<tema>/exercicios/<NN-tema>/<facil|intermediario|dificil>.md`, numerados de 01 a 09 como os de Python. A resposta fica no próprio arquivo, num `<details>` com corretor (veja o item acima), seguida da resolução passo a passo. **Toda resposta deve ser calculada**, não digitada de cabeça.
- **Fórmulas:** escreva em LaTeX, igual ao GitHub: `$x^2$` no meio do texto e `$$` numa linha sozinha antes e depois de uma fórmula em destaque. No site, o KaTeX desenha as fórmulas. Cuidados:
    - o `$` tem que ficar colado na fórmula (`$x$`, não `$ x $`); por isso "R$ 12,00" continua sendo texto;
    - dentro de tabelas, nunca use a barra vertical: escreva o módulo como `\lvert x \rvert`;
    - use `\operatorname{sen}` e `\operatorname{tg}` (em português) e deixe `\begin{cases}` só em fórmulas de destaque.
- **Mapas mentais:** use um bloco ` ```mermaid ` com `mindmap` (o GitHub e o site desenham). Nos nós, evite parênteses e colchetes, que mudam o formato da caixa.
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
- os exemplos `**Entrada:**` / `**Saída:**` aparecem lado a lado;
- perguntas com `**Resposta:**` dentro de `<details>` ganham um corretor automático (veja acima);
- nos simulados de Python, cada `## Questão NN` ganha um editor de Python (o mesmo do VS Code) com terminal, que roda no navegador. Basta manter o título `## Questão NN · ...` e o link `[✅ Ver resposta]`;
- a página inicial é um portal: catálogo de temas, "Continue de onde parou" e a página **Meu progresso**. O roteiro de cada tema vira a trilha (veja "Roteiro do tema" acima), e aulas, resumos, exercícios e simulados ganham "Marcar como concluída";
- o progresso do aluno fica **só no navegador dele** (localStorage), sem conta. Em "Meu progresso", ele pode exportar, importar e apagar.

O build roda em todo PR e **falha se houver link ou âncora quebrados**. Para ver o site no seu computador antes de abrir o PR:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r .mkdocs/requirements.txt
mkdocs serve -f .mkdocs/mkdocs.yml     # abra http://127.0.0.1:8000/school-cc/
```

Testes do site (a CI também roda):

```bash
python3 -m unittest discover -s .mkdocs -p "test_*.py"             # catálogo, componentes e corretor no build
node --test .mkdocs/corretor.test.js .mkdocs/progresso.test.js     # corretor e progresso do aluno
```

O site troca de página sem recarregar (navegação instantânea). Ela só funciona com links que estão no `sitemap.xml`, feito com o `site_url`: o `mkdocs serve` já cuida disso. Num `mkdocs build` servido por outro servidor local, use `SITE_URL=http://localhost:8000/ mkdocs build ...`.

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
