# Portal de ensino: plano de implementação

> Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** transformar o site do school-cc num portal de ensino com catálogo de temas, trilhas, progresso no navegador e navegação instantânea, sem mudar o Markdown do conteúdo.

**Arquitetura:**

- **Build (Python):** um módulo novo, `_catalogo.py`, lê o conteúdo uma vez por build e monta o modelo (temas, trilhas, contagens). O `visual.py` usa esse modelo para gerar HTML estático com atributos `data-*`.
- **Navegador:** o `progresso.js` guarda o progresso no localStorage, e o `portal.js` só decora o HTML que o build gerou.

**Tecnologias:**

- MkDocs 1.6.1 e Material 9.7.7, com hooks em Python;
- Tailwind 4.3.3 sem preflight;
- JavaScript ES5 em IIFE, sem bundler;
- testes com `node:test` e `unittest`.

**Especificação:** `.mkdocs/specs/2026-10-17-portal-de-ensino-design.md`. Leia junto com este plano.

## Restrições globais

- Conteúdo em Markdown **não muda**: nada em `conteudo/` ou `simulados/` é editado.
- Nenhum template do Material é sobrescrito (sem `custom_dir`).
- Sem framework, sem bundler e sem dependência nova de runtime.
- Os scripts novos (`progresso.js`, `portal.js` e `cronometro.js`) somam **no máximo 20 KB** sem compressão.
- **Lighthouse no celular**, em home, tema Cálculo, aula 04 de Cálculo e exercício 04 fácil:
  - Desempenho de 90 ou mais;
  - Acessibilidade de 95 ou mais;
  - CLS abaixo de 0,1.
- Textos do site em pt-BR. Commits no formato `tipo(site): descrição`, em pt-BR, **só locais** na branch `feat/site-portal-de-ensino`.
- Nunca usar `innerHTML` com dados do localStorage ou de arquivo importado: só `textContent` e atributos.
- `CLAUDE.md` não é alterado nesta branch.
- Depois de mudar classes em `.py` ou `.js`, rode `npm run css --prefix .mkdocs`.
- O build valida com `SITE_DIR=<fora do repo> mkdocs build --strict -f .mkdocs/mkdocs.yml`.

## Foco da revisão

São as situações que os testes de unidade não pegam sozinhos. Cada uma tem um teste na tarefa dona:

1. **Arquivo de progresso importado e hostil:** um rótulo com `<script>` ou um caminho `javascript:`. Ele é recusado, ou mostrado como texto, e nenhum link sai do site (Tarefa 4, `lerArquivo`, e Tarefa 10, uso de `textContent`).
2. **localStorage bloqueado ou cheio:** o site funciona, o progresso vale só enquanto a aba está aberta e "Meu progresso" avisa (Tarefa 4, `salvar` com memória, e Tarefa 11, aviso).
3. **Trocar de página sem recarregar** (`navigation.instant`):
   - cada caixa monta uma vez só;
   - placar sem duplicar;
   - cronômetro e Python da página anterior param.

   É testado pelo roteiro CDP da Tarefa 3.
4. **Quem já tem acertos no formato antigo do corretor não perde nada:** a migração das chaves `school-cc:corretor:<caminho>` (Tarefa 4).
5. **Alguém edita a tabela do roteiro** (coluna nova, linha sem link, link quebrado): a página do tema continua sendo gerada, e o teste mostra o que mudou (Tarefa 2, casos de borda).

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
| ------- | ---------------- |
| `.mkdocs/_catalogo.py` (novo) | Modelo: temas, unidades, exercícios e simulados, mais contagens e tempo de leitura. Também `fora_de_codigo`, `perguntas`, `RESPOSTA` e `TIPOS_DE_RESPOSTA`, que saem do `visual.py` |
| `.mkdocs/test_catalogo.py` (novo) | `unittest` do catálogo, no repositório real e em casos de borda |
| `.mkdocs/progresso.js` (novo) | Dados do progresso (funções puras) e a API `window.SchoolCC.progresso` |
| `.mkdocs/progresso.test.js` (novo) | `node:test` das funções puras |
| `.mkdocs/portal.js` (novo) | Desenha o progresso no HTML do build e cuida de Concluir, Exportar, Importar e Apagar |
| `.mkdocs/cronometro.js` (novo) | O cronômetro da folha de prova, que sai do script inline |
| `.mkdocs/corretor.js` | Caixa compacta, placar único fixo, progresso pelo `SchoolCC.progresso`, `document$` |
| `.mkdocs/editor.js` | Encerra o Python ao ir para uma página sem editor |
| `.mkdocs/_componentes.py` | Cores das áreas e componentes: cartão de tema, barra, trilha, cabeçalho, informações, fim de página |
| `.mkdocs/visual.py` | Usa o catálogo: home, Conteúdo, tema, aula, exercício, simulado e a página `progresso.md` |
| `.mkdocs/hooks.py` | Abas (Início, Conteúdo, Simulados, Meu progresso, Colabore) e anterior e próxima na ordem do menu |
| `.mkdocs/tailwind.css` e `site.css` | Estilos novos (barra de leitura, placar e estados de concluído) |
| `.mkdocs/mkdocs.yml` | Recursos `navigation.instant*`, scripts novos e licença no rodapé |
| `.github/workflows/pages.yml` | Roda os testes novos |
| `CONTRIBUTING.md` | Tabela do roteiro vira a trilha. Como dar área e ícone a um tema novo |

Mudança em relação à especificação: o `TEMAS` (área e ícone) fica no `_catalogo.py`, porque é dado, e as cores das áreas ficam no `_componentes.py`, porque são apresentação.

---

### Tarefa 1: Medição do "antes"

**Arquivos:** nenhum no repositório. Os resultados vão para `<scratchpad>/redesign/antes/`.

- [ ] **Passo 1:** gerar o site da `main`:

  ```bash
  git stash -u
  git checkout main
  SITE_DIR=$S/site-antes mkdocs build --strict -f .mkdocs/mkdocs.yml
  git checkout feat/site-portal-de-ensino
  git stash pop
  ```

  Sem nada para guardar, use só `checkout`.
- [ ] **Passo 2:** servir o site com `python3 -m http.server 8002 -d $S/site-antes`.
- [ ] **Passo 3:** rodar o Lighthouse nas 4 páginas, no modo celular:

  ```bash
  npx -y lighthouse@12 <url> --quiet --chrome-flags="--headless=new --user-data-dir=$S/chrome-lh" \
    --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=$S/redesign/antes/<nome>.json
  ```

  As 4 páginas são `/`, `/conteudo/calculo/`, `/conteudo/calculo/aulas/04-derivada/` e `/conteudo/calculo/exercicios/04-derivada/facil/`.
- [ ] **Passo 4:** extrair para `antes/resumo.md`:
  - as notas;
  - LCP, CLS e TBT;
  - `total-byte-weight` e o número de requisições (`network-requests`).

---

### Tarefa 2: Catálogo (`_catalogo.py`) e testes

**Arquivos:**

- Criar: `.mkdocs/_catalogo.py` e `.mkdocs/test_catalogo.py`.
- Mudar: `.mkdocs/visual.py`. `_fora_de_codigo`, `RESPOSTA` e `TIPOS_DE_RESPOSTA` passam a vir do catálogo, e o `_corretores` usa `perguntas()`.

**Interfaces:**

- Consome: `NIVEIS`, `NIVEL`, `NIVEL_DO_EXERCICIO` e `sem_emoji`, de `_componentes`.
- Produz:
  - `montar(docs_dir) -> list[Tema]`;
  - `lugares(temas) -> dict[str, Lugar]`;
  - `totais(temas) -> dict`;
  - `fora_de_codigo(linhas)`;
  - `perguntas(linhas)`, que gera `(i, tipo, resposta)`;
  - `tabela_roteiro(markdown) -> re.Match | None`;
  - `contar_perguntas(md) -> int`;
  - `minutos_de_leitura(md) -> int`;
  - as dataclasses `Tema`, `Unidade`, `Exercicio`, `Simulado` e `Lugar`, com os campos abaixo.

- [ ] **Passo 1: escrever o teste que falha** (`.mkdocs/test_catalogo.py`):

```python
"""Testes do catálogo do portal. Rodar: python3 -m unittest discover -s .mkdocs -p "test_*.py" """

import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _catalogo as c  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class RepositorioReal(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temas = {t.slug: t for t in c.montar(RAIZ)}

    def test_temas_na_ordem_do_indice(self):
        self.assertEqual(list(self.temas), ["python", "sistemas-digitais", "calculo", "git"])

    def test_area_e_icone(self):
        self.assertEqual((self.temas["calculo"].area, self.temas["calculo"].icone), ("Matemática", "integral"))
        self.assertEqual(self.temas["git"].area, "Engenharia de Software")

    def test_trilha_de_calculo(self):
        t = self.temas["calculo"]
        self.assertEqual(len(t.unidades), 10)
        u = t.unidades[3]
        self.assertEqual((u.numero, u.titulo, u.src), ("4", "Derivada", "conteudo/calculo/aulas/04-derivada.md"))
        self.assertEqual(u.nivel, "Intermediário")
        self.assertTrue(u.descricao.startswith("Taxa de variação"))
        self.assertEqual([e.nivel for e in u.exercicios], ["facil", "intermediario", "dificil"])
        self.assertEqual(u.exercicios[0].src, "conteudo/calculo/exercicios/04-derivada/facil.md")
        self.assertGreater(u.exercicios[0].perguntas, 0)
        self.assertGreater(u.minutos, 1)

    def test_python_unidade_zero_sem_exercicios(self):
        u = self.temas["python"].unidades[0]
        self.assertEqual((u.numero, u.exercicios), ("0", []))
        self.assertEqual(self.temas["python"].unidades[1].exercicios[0].perguntas, 0)  # Python não tem corretor

    def test_git_linha_sem_link_vira_introducao(self):
        u = self.temas["git"].unidades[0]
        self.assertEqual((u.titulo, u.src), ("Introdução", "conteudo/git/README.md"))
        self.assertEqual(len(self.temas["git"].unidades), 4)

    def test_contagens_batem_com_os_arquivos(self):
        for t in self.temas.values():
            for u in t.unidades:
                for e in u.exercicios:
                    with open(os.path.join(RAIZ, e.src), encoding="utf-8") as f:
                        self.assertEqual(e.exercicios, f.read().count("\n## Exercício"), e.src)

    def test_simulados(self):
        self.assertEqual([len(self.temas[s].simulados) for s in ("python", "sistemas-digitais", "calculo", "git")], [4, 4, 4, 0])
        s = self.temas["calculo"].simulados[0]
        self.assertEqual((s.titulo, s.src, s.duracao), ("Simulado 01", "simulados/calculo/simulado-01/README.md", "1h"))
        self.assertGreater(s.perguntas, 0)
        self.assertEqual(self.temas["python"].simulados[0].perguntas, 0)

    def test_totais(self):
        t = c.totais(list(self.temas.values()))
        self.assertEqual((t["temas"], t["simulados"]), (4, 12))
        self.assertEqual(t["exercicios"], 36 + 81 + 90)

    def test_lugares(self):
        lugares = c.lugares(list(self.temas.values()))
        ex = lugares["conteudo/calculo/exercicios/04-derivada/facil.md"]
        self.assertEqual((ex.tema.slug, ex.unidade.numero, ex.exercicio.nivel), ("calculo", "4", "facil"))
        self.assertEqual(lugares["simulados/calculo/simulado-02/README.md"].simulado.titulo, "Simulado 02")


class CasosDeBorda(unittest.TestCase):
    def repo(self, arquivos):
        raiz = tempfile.mkdtemp()
        for caminho, texto in arquivos.items():
            os.makedirs(os.path.dirname(os.path.join(raiz, caminho)), exist_ok=True)
            with open(os.path.join(raiz, caminho), "w", encoding="utf-8") as f:
                f.write(texto)
        return raiz

    INDICE = "| Tema | O que tem |\n| - | - |\n| [**Redes**](redes/README.md) | Camadas e protocolos |\n"

    def test_tema_sem_tabela_e_fora_do_TEMAS(self):
        raiz = self.repo({"conteudo/README.md": self.INDICE, "conteudo/redes/README.md": "# Redes\n\nTexto.\n"})
        (t,) = c.montar(raiz)
        self.assertEqual((t.slug, t.area, t.icone, t.unidades), ("redes", "Outros", "pasta", []))

    def test_coluna_nova_link_quebrado_e_linha_sem_exercicios(self):
        tabela = (
            "| # | Aula | Extra | Nível | Exercícios |\n| - | - | - | - | - |\n"
            "| 1 | [Camadas](aulas/01-camadas.md) | x | 🟢 Iniciante | [🟢](exercicios/01/facil.md) |\n"
            "| 2 | [Sumiu](aulas/02-sumiu.md) | x | 🟡 Intermediário | — |\n"
        )
        raiz = self.repo({
            "conteudo/README.md": self.INDICE,
            "conteudo/redes/README.md": "# Redes\n\n" + tabela,
            "conteudo/redes/aulas/01-camadas.md": "# Camadas\n\ntexto\n",
            "conteudo/redes/exercicios/01/facil.md": "# F\n\n## Exercício 01: A\n\n<details>\n\n**Número:** `2`\n</details>\n",
        })
        (t,) = c.montar(raiz)
        self.assertEqual([u.titulo for u in t.unidades], ["Camadas"])  # a 2 tem link quebrado: fica de fora
        self.assertEqual(t.unidades[0].nivel, "Iniciante")
        self.assertEqual((t.unidades[0].exercicios[0].exercicios, t.unidades[0].exercicios[0].perguntas), (1, 1))

    def test_perguntas_dentro_de_codigo_nao_contam(self):
        md = "```\n<details>\n**Número:** `1`\n</details>\n```\n\n<details>\n\n**Função:** `2x`\n</details>\n"
        self.assertEqual(c.contar_perguntas(md), 1)

    def test_minutos_de_leitura(self):
        self.assertEqual(c.minutos_de_leitura("palavra " * 401), 3)
        self.assertEqual(c.minutos_de_leitura(""), 1)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Passo 2:** rodar `python3 -m unittest discover -s .mkdocs -p "test_*.py"`. O esperado é falhar com `ModuleNotFoundError: _catalogo`.
- [ ] **Passo 3: implementar** `.mkdocs/_catalogo.py`:

```python
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
    caminho = os.path.join(docs_dir, src)
    if not os.path.isfile(caminho):
        return None
    with open(caminho, encoding="utf-8") as f:
        return f.read()


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
        else:  # "**Este arquivo**": a unidade é o próprio README do tema
            titulo, src = "Introdução", posixpath.join(pasta, "README.md")
        texto = _ler(docs_dir, src)
        if texto is None:
            continue  # link quebrado: o mkdocs build --strict já avisa
        exercicios = []
        for _, alvo in LINK.findall(celula("exercicios")):
            src_ex = posixpath.normpath(posixpath.join(pasta, alvo))
            nivel = posixpath.splitext(posixpath.basename(src_ex))[0]
            md = _ler(docs_dir, src_ex)
            if md is not None and nivel in NIVEL_DO_EXERCICIO:
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
```

- [ ] **Passo 4:** no `visual.py`:
  - apagar `_fora_de_codigo`, `RESPOSTA` e `TIPOS_DE_RESPOSTA`;
  - importar `from _catalogo import fora_de_codigo, perguntas`;
  - trocar `_fora_de_codigo(` por `fora_de_codigo(`;
  - reescrever o `_corretores` sobre `perguntas()`, ainda **sem** rótulo (o rótulo entra na Tarefa 5):

```python
def _corretores(markdown):
    """Põe o campo do corretor (corretor.js) antes de cada <details> que traz uma resposta conferível."""
    linhas = markdown.split("\n")
    caixas = {i: (tipo, resposta) for i, tipo, resposta in perguntas(linhas)}
    saida = []
    for i, linha in enumerate(linhas):
        if i in caixas:
            tipo, resposta = caixas[i]
            saida += [f'<div class="corretor" data-tipo="{tipo}" data-resposta="{html.escape(resposta, quote=True)}"></div>', ""]
        saida.append(linha)
    return "\n".join(saida)
```

- [ ] **Passo 5:** rodar os testes Python (PASS), depois `node --test .mkdocs/corretor.test.js` (PASS) e o build `--strict` (sem avisos novos). Comparar o HTML de uma página de exercício com o de antes: os `div.corretor` precisam continuar iguais.
- [ ] **Passo 6: fazer o commit**, com a mensagem `feat(site): adiciona catálogo de temas e trilhas lido do Markdown`.

---

### Tarefa 3: Abas, navegação instantânea e scripts que sobrevivem à troca de página

**Arquivos:**

- Mudar: `.mkdocs/hooks.py` (`on_nav`), `.mkdocs/mkdocs.yml`, `.mkdocs/visual.py` (folha de prova sem `<script>` e `ARQUIVOS_DO_SITE`), `.mkdocs/corretor.js` (início) e `.mkdocs/editor.js` (encerrar o Python).
- Criar: `.mkdocs/cronometro.js` e `<scratchpad>/cdp.mjs`, o roteiro de teste que **não** vai para o repositório.

**Interfaces:**

- Produz:
  - as abas, na ordem `README.md`, `conteudo`, `simulados`, `progresso.md` e a seção "Colabore" (Guia de Acesso e Como contribuir);
  - `niveis.md` dentro da seção Conteúdo;
  - anterior e próxima seguindo a ordem final do menu.
- `progresso.md` é criado na Tarefa 11. Até lá, a ordenação só ignora o que não existe.

- [ ] **Passo 1: `hooks.py`, no fim do `on_nav`.** Trocar `ORDEM_TOPO_INICIO`/`ORDEM_TOPO_FIM` por:

```python
# Abas do topo, nesta ordem. "Colabore" junta as páginas de quem contribui.
ORDEM_TOPO = ["README.md", "conteudo", "simulados", "progresso.md", "Colabore"]
COLABORE = ["GUIA-DE-ACESSO.md", "CONTRIBUTING.md"]
```

e, no `on_nav`, depois do `renomear(nav.items)`:

```python
    def nome(item):
        arquivo = getattr(item, "file", None)
        if arquivo is not None:
            return arquivo.src_uri
        return item.title if item.title == "Colabore" else (pasta_da_secao(item) or "").split("/")[0]

    por_nome = {nome(i): i for i in nav.items}
    colabore = [por_nome[s] for s in COLABORE if s in por_nome]
    if colabore:
        secao = Section("Colabore", colabore)
        for pagina in colabore:
            pagina.parent = secao
        nav.items = [i for i in nav.items if i not in colabore] + [secao]
    niveis, conteudo = por_nome.get("niveis.md"), por_nome.get("conteudo")
    if niveis is not None and conteudo is not None:
        nav.items.remove(niveis)
        conteudo.children.append(niveis)
        niveis.parent = conteudo

    fora = len(ORDEM_TOPO)
    nav.items.sort(key=lambda i: (ORDEM_TOPO.index(nome(i)) if nome(i) in ORDEM_TOPO else fora, nome(i)))

    # Anterior/próxima (rodapé) na ordem final do menu, e não na ordem em que o MkDocs leu as pastas.
    def paginas(itens):
        for item in itens:
            if isinstance(item, Section):
                yield from paginas(item.children)
            elif getattr(item, "file", None) is not None:
                yield item

    nav.pages = list(paginas(nav.items))
    for i, pagina in enumerate(nav.pages):
        pagina.previous_page = nav.pages[i - 1] if i else None
        pagina.next_page = nav.pages[i + 1] if i + 1 < len(nav.pages) else None
    return nav
```

  Apagar o `chave()` e o `nav.items.sort(key=chave)` antigos.
- [ ] **Passo 2: `mkdocs.yml`.**
  - Nos `features`, somar `navigation.instant`, `navigation.instant.prefetch` e `navigation.instant.progress`.
  - O `extra_javascript` fica nesta ordem: `progresso.js`, `editor.js`, `corretor.js`, `katex-init.js`, `cronometro.js` e `portal.js`. Até as Tarefas 4 e 10, `progresso.js` e `portal.js` são só o esqueleto da IIFE.
  - Trocar o `copyright` por:

    ```yaml
    'Feito de Aluno para Aluno · <a href="https://github.com/rps4-school/school-cc/blob/main/LICENSE">Licença Apache 2.0</a>'
    ```
- [ ] **Passo 3: `visual.py`.**
  - Publicar os 3 scripts novos pelo `ARQUIVOS_DO_SITE`.
  - Tirar o `<script>…</script>` do `_folha_de_prova`. O HTML com `data-cronometro` continua igual.
- [ ] **Passo 4: `cronometro.js`.** É a mesma lógica do script inline, iniciada pelo `document$`. Ao trocar de página, os relógios da página anterior param.

```js
/*
 * Cronômetro da folha de prova dos simulados (o visual.py põe <div data-cronometro="minutos">).
 * Com navigation.instant o site troca de página sem recarregar: o document$ do Material avisa
 * cada página nova, e os relógios da página anterior são parados.
 */
(function () {
  "use strict";

  var relogios = [];

  function montar(caixa) {
    var total = +caixa.dataset.cronometro * 60, resto = total, relogio = null;
    var visor = caixa.querySelector(".visor"), iniciar = caixa.querySelector(".iniciar"), zerar = caixa.querySelector(".zerar");
    function mostrar() {
      var h = Math.floor(resto / 3600), m = Math.floor(resto % 3600 / 60), s = resto % 60;
      visor.textContent = h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
      visor.classList.toggle("text-rose-600", resto <= 300);
    }
    function parar() { clearInterval(relogio); relogio = null; }
    iniciar.onclick = function () {
      if (relogio) { parar(); iniciar.textContent = "Continuar"; return; }
      iniciar.textContent = "Pausar";
      relogio = setInterval(function () {
        if (resto > 0) { resto--; mostrar(); return; }
        parar();
        visor.textContent = "Tempo esgotado!";
        iniciar.disabled = true;
      }, 1000);
    };
    zerar.onclick = function () { parar(); resto = total; iniciar.textContent = "Iniciar"; iniciar.disabled = false; mostrar(); };
    relogios.push(parar);
    mostrar();
  }

  function iniciar() {
    relogios.splice(0).forEach(function (parar) { parar(); });
    document.querySelectorAll("[data-cronometro]:not([data-montado])").forEach(function (caixa) {
      caixa.dataset.montado = "1";
      montar(caixa);
    });
  }

  if (window.document$) window.document$.subscribe(iniciar);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
```

- [ ] **Passo 5: `corretor.js`.**
  - Trocar as duas últimas linhas do início por `document$`, como no `editor.js`.
  - No `iniciar`, selecionar `.corretor[data-resposta]:not([data-montado])` e marcar `data-montado`.
- [ ] **Passo 6: `editor.js`.**
  - Somar a função abaixo, depois de `cancelarPython`.
  - No começo do `iniciar()`, chamar `if (!document.querySelector(".editor-python")) encerrarPython();`.

```js
  // Ao ir para uma página sem editor (navigation.instant), o Python, que pesa dezenas de MB, não serve mais.
  function encerrarPython() {
    fila.splice(0).forEach(function (t) { responder(t, { estado: "parado" }); });
    if (atual) {
      clearTimeout(atual.relogio);
      responder(atual, { estado: "parado" });
      atual = null;
    }
    if (python) {
      python.worker.terminate();
      python = null;
    }
  }
```

- [ ] **Passo 7: roteiro CDP** (`<scratchpad>/cdp.mjs`, Node 25, com `WebSocket` nativo).
  - Abre o Chrome headless com `--remote-debugging-port`.
  - Navega pelo site servido em `http.server`, clicando nos links para usar a navegação instantânea, e devolve os valores do `Runtime.evaluate`.
  - Confere este caminho: home → aula 04 → exercício 04 fácil → simulado 01 de Cálculo → simulado 01 de Python → aula 01 de Python.
  - Em cada página, confere:
    - `document.querySelectorAll('.corretor').length` igual ao número de `[data-montado]` e cada caixa com conteúdo;
    - `.arithmatex[data-katex]` presente onde há fórmula;
    - a folha de prova mostrando `1:00:00` (Cálculo) ou `1:40:00` (Python);
    - o editor montado no simulado de Python;
    - `location.href` mudou **sem** recarregar (`performance.getEntriesByType('navigation').length` continua 1 e um marcador `window.__marcador` sobrevive).
- [ ] **Passo 8:** build `--strict`, `node --test` e o roteiro CDP, tudo verde. Conferir as abas numa captura.
- [ ] **Passo 9: fazer o commit**, com a mensagem `feat(site): abas do portal e navegação instantânea`.

---

### Tarefa 4: Progresso no navegador (`progresso.js`) e testes

**Arquivos:** criar `.mkdocs/progresso.js` e `.mkdocs/progresso.test.js`.

**Interfaces:**

- Produz para o Node: `{ vazio, dia, valido, conferiu, concluir, recomecar, visitou, sequencia, juntar, lerArquivo, migrar, CHAVE_ANTIGA }`.
- Produz para a página, em `window.SchoolCC.progresso`:

  | Membro | O que faz |
  | ------ | --------- |
  | `disponivel` | Boolean |
  | `caminho(url?)` | Devolve a chave da página |
  | `url(chave)` | Devolve o endereço da página |
  | `ler()` | Devolve os dados |
  | `pagina(chave?)` | Devolve `{concluida, acertos, erros}` |
  | `conferiu(id, certo, {valor, rotulo, ancora})` | Registra uma resposta conferida |
  | `concluir(chave?, sim)` | Marca ou desmarca a página |
  | `recomecar(chave?)` | Limpa os acertos e erros da página |
  | `visitou({pagina, titulo, tema})` | Guarda a última página aberta |
  | `sequencia()` | Devolve a sequência de dias |
  | `exportar()` | Devolve uma string |
  | `importar(texto)` | Junta o arquivo ao progresso; dá erro (`throw`) se o arquivo for inválido |
  | `apagar()` | Apaga tudo |

  Toda mudança dispara o evento `school-cc:progresso` no `document`.

- [ ] **Passo 1: escrever o teste que falha** (`.mkdocs/progresso.test.js`):

```js
// Testes do progresso. Rodar: node --test .mkdocs/progresso.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const p = require("./progresso.js");

const HOJE = "2026-10-17";

test("conferiu: erro só entra se a pergunta ainda não foi acertada, e sai quando acerta", () => {
  const d = p.vazio();
  p.conferiu(d, "conteudo/x/", "0:5", false, { rotulo: "Exercício 01 · a)", ancora: "exercicio-01" }, HOJE);
  assert.deepEqual(d.paginas["conteudo/x/"].erros["0:5"], { rotulo: "Exercício 01 · a)", ancora: "exercicio-01" });
  p.conferiu(d, "conteudo/x/", "0:5", true, { valor: "5" }, HOJE);
  assert.equal(d.paginas["conteudo/x/"].acertos["0:5"], "5");
  assert.equal(d.paginas["conteudo/x/"].erros["0:5"], undefined);
  p.conferiu(d, "conteudo/x/", "0:5", false, { rotulo: "r", ancora: "a" }, HOJE);
  assert.equal(d.paginas["conteudo/x/"].erros["0:5"], undefined);
  assert.deepEqual(d.dias, [HOJE]);
});

test("concluir guarda a primeira data; desmarcar apaga", () => {
  const d = p.vazio();
  p.concluir(d, "a/", true, "2026-10-01");
  p.concluir(d, "a/", true, HOJE);
  assert.equal(d.paginas["a/"].concluida, "2026-10-01");
  p.concluir(d, "a/", false, HOJE);
  assert.equal(d.paginas["a/"].concluida, undefined);
});

test("recomecar limpa acertos e erros, mas não a conclusão", () => {
  const d = p.vazio();
  p.conferiu(d, "a/", "0:1", true, { valor: "1" }, HOJE);
  p.concluir(d, "a/", true, HOJE);
  p.recomecar(d, "a/");
  assert.deepEqual(d.paginas["a/"].acertos, {});
  assert.equal(d.paginas["a/"].concluida, HOJE);
});

test("sequencia de dias: conta até hoje, ou até ontem se hoje ainda não estudou, e atravessa o mês", () => {
  const dias = ["2026-09-30", "2026-10-01", "2026-10-02"];
  assert.equal(p.sequencia(dias, "2026-10-02"), 3);
  assert.equal(p.sequencia(dias, "2026-10-03"), 3);
  assert.equal(p.sequencia(dias, "2026-10-04"), 0);
  assert.equal(p.sequencia([], HOJE), 0);
});

test("guarda só os últimos 120 dias", () => {
  const d = p.vazio();
  for (let i = 0; i < 130; i++) p.concluir(d, "p" + i + "/", true, p.dia(new Date(2026, 0, 1 + i)));
  assert.equal(d.dias.length, 120);
  assert.equal(d.dias[0], p.dia(new Date(2026, 0, 11)));
});

test("juntar (importar) une sem apagar nada", () => {
  const a = p.vazio(), b = p.vazio();
  p.concluir(a, "x/", true, "2026-10-10");
  p.concluir(b, "x/", true, "2026-10-05");
  p.conferiu(a, "x/", "1:2", false, { rotulo: "r", ancora: "a" }, "2026-10-10");
  p.conferiu(b, "x/", "1:2", true, { valor: "2" }, "2026-10-05");
  p.conferiu(b, "y/", "0:3", true, { valor: "3" }, "2026-10-06");
  p.visitou(a, { pagina: "x/", titulo: "X", tema: "t", quando: "2026-10-10T10:00:00Z" });
  p.visitou(b, { pagina: "y/", titulo: "Y", tema: "t", quando: "2026-10-12T10:00:00Z" });
  const r = p.juntar(a, b);
  assert.equal(r.paginas["x/"].concluida, "2026-10-05");
  assert.equal(r.paginas["x/"].acertos["1:2"], "2");
  assert.equal(r.paginas["x/"].erros["1:2"], undefined);
  assert.equal(r.paginas["y/"].acertos["0:3"], "3");
  assert.deepEqual(r.dias, ["2026-10-05", "2026-10-06", "2026-10-10"]);
  assert.equal(r.ultima.pagina, "y/");
  assert.equal(a.paginas["y/"], undefined, "não muda o original");
});

test("lerArquivo recusa JSON inválido, outra versão e caminhos perigosos", () => {
  assert.throws(() => p.lerArquivo("{"), /JSON inválido/);
  assert.throws(() => p.lerArquivo(JSON.stringify({ versao: 2, paginas: {}, dias: [] })), /outra versão/);
  const hostil = { versao: 1, paginas: { "javascript:alert(1)": { acertos: {}, erros: {} } }, dias: [], ultima: null };
  assert.throws(() => p.lerArquivo(JSON.stringify(hostil)));
  const ultimaHostil = { versao: 1, paginas: {}, dias: [], ultima: { pagina: "https://mal.example/", titulo: "x" } };
  assert.throws(() => p.lerArquivo(JSON.stringify(ultimaHostil)));
  assert.throws(() => p.lerArquivo(JSON.stringify({ versao: 1, paginas: {}, dias: ["ontem"] })));
  const ok = p.vazio();
  p.conferiu(ok, "conteudo/a/", "0:1", false, { rotulo: "<script>alert(1)</script>", ancora: "x" }, HOJE);
  assert.deepEqual(p.lerArquivo(JSON.stringify(ok)), ok); // o rótulo é só texto: a página usa textContent
});

test("migrar converte as chaves antigas do corretor e devolve o que apagar", () => {
  const d = p.vazio();
  const apagar = p.migrar(d, [
    [p.CHAVE_ANTIGA + "/school-cc/conteudo/calculo/exercicios/04-derivada/facil/", '{"0:9":"9","1:5,2":"5,2"}'],
    [p.CHAVE_ANTIGA + "/school-cc/quebrado/", "{"],
    ["outra-coisa", "1"],
  ], "/school-cc/");
  assert.deepEqual(d.paginas["conteudo/calculo/exercicios/04-derivada/facil/"].acertos, { "0:9": "9", "1:5,2": "5,2" });
  assert.deepEqual(apagar, [p.CHAVE_ANTIGA + "/school-cc/conteudo/calculo/exercicios/04-derivada/facil/", p.CHAVE_ANTIGA + "/school-cc/quebrado/"]);
});
```

- [ ] **Passo 2:** rodar `node --test .mkdocs/progresso.test.js`. O esperado é falhar com `Cannot find module`.
- [ ] **Passo 3: implementar** `.mkdocs/progresso.js`:

```js
/*
 * Progresso do aluno: páginas concluídas, perguntas certas e erradas, dias estudados e a última página.
 * Fica só neste navegador (localStorage), numa chave só: sem conta e sem servidor.
 * As funções de dados são puras e testadas no Node (progresso.test.js). Na página, a API fica em
 * window.SchoolCC.progresso, e toda mudança dispara o evento "school-cc:progresso" no document.
 */
(function () {
  "use strict";

  var CHAVE = "school-cc:progresso";
  var CHAVE_ANTIGA = "school-cc:corretor:"; // + caminho da página: formato do corretor até out/2026
  var VERSAO = 1;
  var MAX_DIAS = 120;
  // Caminho de página: letras, números, "-", "_", "." e "/". Nada de "javascript:" nem "https://".
  var CAMINHO = /^[\w.\-\/]*$/;
  var DIA = /^\d{4}-\d{2}-\d{2}$/;

  function vazio() {
    return { versao: VERSAO, paginas: {}, dias: [], ultima: null };
  }

  function doisDigitos(n) {
    return (n < 10 ? "0" : "") + n;
  }

  // Data local, "AAAA-MM-DD": o dia em que o aluno estudou é o do relógio dele.
  function dia(data) {
    data = data || new Date();
    return data.getFullYear() + "-" + doisDigitos(data.getMonth() + 1) + "-" + doisDigitos(data.getDate());
  }

  function diaAnterior(texto) {
    var p = texto.split("-");
    return dia(new Date(+p[0], +p[1] - 1, +p[2] - 1));
  }

  function objeto(x) {
    return !!x && typeof x === "object" && !Array.isArray(x);
  }

  function valido(d) {
    if (!objeto(d) || d.versao !== VERSAO || !objeto(d.paginas) || !Array.isArray(d.dias)) return false;
    if (!d.dias.every(function (x) { return typeof x === "string" && DIA.test(x); })) return false;
    if (d.ultima != null && !(objeto(d.ultima) && typeof d.ultima.pagina === "string" && CAMINHO.test(d.ultima.pagina))) return false;
    return Object.keys(d.paginas).every(function (k) {
      var p = d.paginas[k];
      return CAMINHO.test(k) && objeto(p) && (p.acertos == null || objeto(p.acertos)) && (p.erros == null || objeto(p.erros));
    });
  }

  function pagina(d, caminho) {
    var p = d.paginas[caminho] || (d.paginas[caminho] = {});
    p.acertos = p.acertos || {};
    p.erros = p.erros || {};
    return p;
  }

  function estudou(d, hoje) {
    if (d.dias.indexOf(hoje) >= 0) return;
    d.dias.push(hoje);
    d.dias.sort();
    if (d.dias.length > MAX_DIAS) d.dias = d.dias.slice(-MAX_DIAS);
  }

  // info: { valor } no acerto; { rotulo, ancora } no erro (para a lista "Revisar").
  function conferiu(d, caminho, id, certo, info, hoje) {
    var p = pagina(d, caminho);
    if (certo) {
      p.acertos[id] = String(info.valor);
      delete p.erros[id];
    } else if (!(id in p.acertos)) {
      p.erros[id] = { rotulo: String(info.rotulo || ""), ancora: String(info.ancora || "") };
    }
    estudou(d, hoje);
  }

  function concluir(d, caminho, sim, hoje) {
    var p = pagina(d, caminho);
    if (!sim) delete p.concluida;
    else if (!p.concluida) {
      p.concluida = hoje;
      estudou(d, hoje);
    }
  }

  function recomecar(d, caminho) {
    var p = pagina(d, caminho);
    p.acertos = {};
    p.erros = {};
  }

  // ultima: { pagina, titulo, tema, quando (ISO) }
  function visitou(d, ultima) {
    d.ultima = ultima;
  }

  function sequencia(dias, hoje) {
    var tem = {};
    dias.forEach(function (x) { tem[x] = true; });
    var atual = tem[hoje] ? hoje : diaAnterior(hoje);
    var n = 0;
    while (tem[atual]) {
      n++;
      atual = diaAnterior(atual);
    }
    return n;
  }

  // Importar: junta b em a sem apagar nada. Não muda a nem b.
  function juntar(a, b) {
    var r = JSON.parse(JSON.stringify(a));
    Object.keys(b.paginas).forEach(function (k) {
      var de = b.paginas[k], para = pagina(r, k);
      if (de.concluida && (!para.concluida || de.concluida < para.concluida)) para.concluida = de.concluida;
      Object.keys(de.acertos || {}).forEach(function (id) {
        para.acertos[id] = de.acertos[id];
        delete para.erros[id];
      });
      Object.keys(de.erros || {}).forEach(function (id) {
        if (!(id in para.acertos)) para.erros[id] = de.erros[id];
      });
    });
    b.dias.forEach(function (x) { estudou(r, x); });
    if (b.ultima && (!r.ultima || String(b.ultima.quando || "") > String(r.ultima.quando || ""))) r.ultima = b.ultima;
    return r;
  }

  function lerArquivo(texto) {
    var d;
    try {
      d = JSON.parse(texto);
    } catch (e) {
      throw new Error("O arquivo não é um progresso do school-cc (JSON inválido).");
    }
    if (!valido(d)) throw new Error("O arquivo não é um progresso do school-cc, ou é de outra versão.");
    return d;
  }

  // pares: [[chave do localStorage, valor]]; raiz: caminho do site ("/school-cc/").
  // Devolve as chaves antigas que já podem ser apagadas.
  function migrar(d, pares, raiz) {
    var apagar = [];
    pares.forEach(function (par) {
      if (par[0].indexOf(CHAVE_ANTIGA) !== 0) return;
      var caminho = par[0].slice(CHAVE_ANTIGA.length);
      caminho = caminho.indexOf(raiz) === 0 ? caminho.slice(raiz.length) : caminho.replace(/^\//, "");
      var acertos = null;
      try {
        acertos = JSON.parse(par[1]);
      } catch (e) { /* valor quebrado: só apaga */ }
      if (objeto(acertos) && CAMINHO.test(caminho)) {
        var p = pagina(d, caminho);
        Object.keys(acertos).forEach(function (id) { p.acertos[id] = String(acertos[id]); });
      }
      apagar.push(par[0]);
    });
    return apagar;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      vazio: vazio, dia: dia, valido: valido, conferiu: conferiu, concluir: concluir, recomecar: recomecar,
      visitou: visitou, sequencia: sequencia, juntar: juntar, lerArquivo: lerArquivo, migrar: migrar,
      CHAVE_ANTIGA: CHAVE_ANTIGA,
    };
    return;
  }

  // ---------- Na página ----------

  // A raiz do site, calculada uma vez no carregamento completo (com navigation.instant o
  // #__config continua o da primeira página, e o "base" dele é relativo a ela).
  var raiz = (function () {
    try {
      return new URL(JSON.parse(document.getElementById("__config").textContent).base, location.href);
    } catch (e) {
      return new URL("/", location.href);
    }
  })();

  var disponivel = (function () {
    try {
      localStorage.setItem(CHAVE + ":teste", "1");
      localStorage.removeItem(CHAVE + ":teste");
      return true;
    } catch (e) {
      return false;
    }
  })();
  var memoria = vazio(); // sem localStorage: o progresso vale só enquanto a aba estiver aberta

  function carregar() {
    if (!disponivel) return memoria;
    try {
      var d = JSON.parse(localStorage.getItem(CHAVE));
      return valido(d) ? d : vazio();
    } catch (e) {
      return vazio();
    }
  }

  function salvar(d) {
    memoria = d;
    if (!disponivel) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(d));
    } catch (e) { /* cheio: fica na memória */ }
  }

  function mudar(fn) {
    var d = carregar();
    fn(d);
    salvar(d);
    document.dispatchEvent(new CustomEvent("school-cc:progresso"));
  }

  function caminho(url) {
    var p = new URL(url || location.href, location.href).pathname.replace(/index\.html$/, "");
    return p.indexOf(raiz.pathname) === 0 ? p.slice(raiz.pathname.length) : p.replace(/^\//, "");
  }

  if (disponivel) {
    try {
      var pares = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k.indexOf(CHAVE_ANTIGA) === 0) pares.push([k, localStorage.getItem(k)]);
      }
      if (pares.length) {
        var d = carregar();
        var apagar = migrar(d, pares, raiz.pathname);
        salvar(d);
        apagar.forEach(function (chave) { localStorage.removeItem(chave); });
      }
    } catch (e) { /* sem migração: os acertos antigos continuam onde estavam */ }
  }

  window.SchoolCC = window.SchoolCC || {};
  window.SchoolCC.progresso = {
    disponivel: disponivel,
    caminho: caminho,
    url: function (c) { return new URL(c, raiz).href; },
    ler: carregar,
    pagina: function (c) {
      var p = carregar().paginas[c || caminho()] || {};
      return { concluida: p.concluida || null, acertos: p.acertos || {}, erros: p.erros || {} };
    },
    conferiu: function (id, certo, info) { mudar(function (d) { conferiu(d, caminho(), id, certo, info, dia()); }); },
    concluir: function (c, sim) { mudar(function (d) { concluir(d, c || caminho(), sim, dia()); }); },
    recomecar: function (c) { mudar(function (d) { recomecar(d, c || caminho()); }); },
    visitou: function (info) {
      mudar(function (d) {
        visitou(d, { pagina: caminho(), titulo: info.titulo, tema: info.tema, quando: new Date().toISOString() });
      });
    },
    sequencia: function () { return sequencia(carregar().dias, dia()); },
    exportar: function () { return JSON.stringify(carregar(), null, 2); },
    importar: function (texto) {
      var b = lerArquivo(texto);
      mudar(function (d) {
        var r = juntar(d, b);
        d.paginas = r.paginas;
        d.dias = r.dias;
        d.ultima = r.ultima;
      });
    },
    apagar: function () {
      mudar(function (d) {
        d.paginas = {};
        d.dias = [];
        d.ultima = null;
      });
    },
  };
})();
```

- [ ] **Passo 4:** rodar `node --test .mkdocs/corretor.test.js .mkdocs/progresso.test.js`. Todos devem passar.
- [ ] **Passo 5: fazer o commit**, com a mensagem `feat(site): guarda o progresso do aluno no navegador`.

---

### Tarefa 5: Corretor compacto, placar único e rótulo das perguntas

**Arquivos:**

- Mudar: `.mkdocs/corretor.js` (montar, placar e progresso), `.mkdocs/visual.py` (`_corretores` com `data-rotulo` e `data-ancora`) e `.mkdocs/tailwind.css` (placar fixo).

**Interfaces:**

- Consome `SchoolCC.progresso.pagina()`, `.conferiu()`, `.concluir()` e `.recomecar()`.
- Produz:
  - a caixa `.corretor[data-tipo][data-resposta][data-rotulo][data-ancora]`;
  - o placar `.placar-pagina`, que é **um** por página, inserido pelo JS no fim de `.md-content__inner`.

- [ ] **Passo 1: `visual._corretores`.** Guardar o último `## ` (fora de código) e a última marca de pergunta (`**a)**` ou `**1.**`) desde ele. A âncora é o `{ #id }` que o `_titulos_sem_emoji` deixou, ou o slug do título.

```python
MARCA_DE_PERGUNTA = re.compile(r"^\*\*([a-z]\)|\d+\.)\*\*")
ANCORA_EXPLICITA = re.compile(r"\s*\{ #([^}]+) \}\s*$")


def _rotulo_e_ancora(titulo, marca):
    m = ANCORA_EXPLICITA.search(titulo)
    texto = ANCORA_EXPLICITA.sub("", titulo)
    ancora = m.group(1) if m else _slug(re.sub(r"[`*_]", "", texto), "-")
    texto = sem_emoji(re.sub(r"[`*_]|\$", "", texto))
    return (f"{texto} · {marca}" if marca else texto), ancora


def _corretores(markdown):
    """Põe o campo do corretor (corretor.js) antes de cada <details> que traz uma resposta conferível.
    O rótulo e a âncora (título da seção + "a)") vão para a lista "Revisar" de quem errou."""
    linhas = markdown.split("\n")
    caixas = {i: (tipo, resposta) for i, tipo, resposta in perguntas(linhas)}
    titulos = {i: linha[3:] for i, linha in fora_de_codigo(linhas) if linha.startswith("## ")}
    saida, titulo, marca = [], "", ""
    for i, linha in enumerate(linhas):
        if i in titulos:
            titulo, marca = titulos[i], ""
        elif MARCA_DE_PERGUNTA.match(linha):
            marca = MARCA_DE_PERGUNTA.match(linha).group(1)
        if i in caixas:
            tipo, resposta = caixas[i]
            rotulo, ancora = _rotulo_e_ancora(titulo, marca)
            atributos = " ".join(f'data-{k}="{html.escape(v, quote=True)}"' for k, v in
                                 (("tipo", tipo), ("resposta", resposta), ("rotulo", rotulo), ("ancora", ancora)))
            saida += [f'<div class="corretor" {atributos}></div>', ""]
        saida.append(linha)
    return "\n".join(saida)
```

- [ ] **Passo 2: `corretor.js`.**
  - Trocar `chave`, `lerAcertos`, `salvarAcerto` e `atualizarPlacar` por funções que usam `window.SchoolCC.progresso`. Sem a API, o corretor guarda os acertos num objeto em memória.
  - Caixa compacta, em uma linha:
    - campo com `aria-label="Sua resposta"`;
    - botão **Conferir**;
    - logo abaixo, a resposta com `aria-live="polite"`.

    A caixa não tem mais `.placar`.
  - Ao conferir:
    - acerto: `progresso.conferiu(id, true, {valor})`;
    - erro de verdade: `progresso.conferiu(id, false, {rotulo, ancora})`;
    - aviso (falta o `+ C`): não conta como erro.
  - Quando `feitos === total`, chamar `progresso.concluir(null, true)`.
  - O placar `.placar-pagina` é criado uma vez:
    - fica no fim de `.md-content__inner`, com `position: sticky; bottom: 1rem`;
    - tem `role="status"` e o texto "3 de 9 certas", com uma barra (`role="progressbar"`);
    - tem o botão **Recomeçar**, que faz `confirm("Apagar os acertos desta página?")`, `progresso.recomecar()`, limpa os campos e redesenha.
- [ ] **Passo 3:** `tailwind.css`:
  - `.placar-pagina`: sticky embaixo, alinhado à direita a partir de 768 px e com a largura inteira no celular;
  - fundo do tema;
  - sombra;
  - `@media print { display: none }`.

  Depois, recompilar o CSS.
- [ ] **Passo 4:** `node --test` (o corretor continua verde) e build `--strict`.
- [ ] **Passo 5: checar pelo CDP** no exercício 04 fácil:
  - errar a "b)": `ler().paginas[…].erros` tem o rótulo `Exercício 01: Robô na esteira · b)`;
  - acertar: o erro sai e o placar diz "1 de N";
  - trocar de página e voltar: o acerto continua, e há 1 placar só;
  - semear uma chave antiga `school-cc:corretor:/conteudo/...` e recarregar: ela vira progresso e some.
- [ ] **Passo 6: fazer o commit**, com a mensagem `feat(site): corretor compacto com placar único e lista de revisão`.

---

### Tarefa 6: Componentes e direção visual

**Arquivos:** mudar `.mkdocs/_componentes.py` e `.mkdocs/tailwind.css`.

- [ ] **Passo 1:** definir a direção visual a partir da seção 7 da especificação:
  - catálogo de cursos;
  - índigo como cor principal;
  - a cor das áreas diferente do semáforo dos níveis;
  - claro e escuro;
  - celular primeiro;
  - Tailwind sem preflight, dentro do Material.

  Registrar as decisões (paleta das áreas, raios, sombras, escala de títulos) num comentário no topo do `tailwind.css`.
- [ ] **Passo 2:** em `_componentes.py`, criar estas funções. Todas devolvem **uma linha** de HTML e respeitam os contratos `data-*` abaixo:

  | Função | O que gera |
  | ------ | ---------- |
  | `CORES_DA_AREA` (dict) | Para cada área (Programação, Engenharia de Software, Matemática, Hardware, Outros), as classes do ícone, do destaque e da borda |
  | `barra(rotulo)` | `<div class="barra-progresso" role="progressbar" aria-label="{rotulo}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span style="width:0%"></span></div>` |
  | `cartao_tema(tema, url, paginas)` | Elemento raiz com `data-progresso-tema="{slug}" data-paginas="{chaves separadas por espaço}"`: ícone, área, nível, título, descrição, contagens e `barra()` dentro de `[data-so-com-progresso]`. O espaço é reservado com `visibility: hidden`, não com `display: none` |
  | `bloco_continuar(url_temas)` | `<div data-continuar>` com os dois estados, `[data-estado="vazio"]` e `[data-estado="progresso"] hidden`, ambos com altura mínima igual, e `a[data-continuar-link]`, `[data-continuar-titulo]`, `[data-continuar-tema]` |
  | `cabecalho_tema(tema, contagens, primeira_url, paginas)` | Área, nível, contagens, `barra()` e `a[data-proxima]` ("Começar") |
  | `item_trilha(unidade, url, chave, exercicios)` | `<li data-unidade data-pagina="{chave}" data-titulo="Aula N · Título">` com número, título, descrição, nível, minutos e marca de concluída. `exercicios` são `[(nivel, url, chave, perguntas)]`, e cada botão de exercício é `a[data-pagina][data-perguntas]` com um `[data-acertos]` vazio |
  | `informacoes(partes, link=None)` | A linha "Cálculo · Aula 4 de 10 · ~12 min" |
  | `fim_de_pagina(chave, texto_botao, extras)` | `button[data-concluir="{chave}"][aria-pressed="false"]` e os cartões de `extras` (Pratique agora, próxima aula ou próximo nível) |
  | `marcador_de_visita(tema_slug, titulo)` | `<span hidden data-visita data-tema="…" data-titulo="…"></span>` |

- [ ] **Passo 3:** recompilar o CSS e fazer o commit, com a mensagem `feat(site): componentes do portal`.

---

### Tarefa 7: Início e Conteúdo

**Arquivos:** mudar `.mkdocs/visual.py` (`on_files` monta o catálogo; `_inicio`; cartões de tema no `conteudo/README.md`).

- [ ] **Passo 1:** no `on_files` do `visual.py`:
  - guardar `_estado["temas"] = montar(config["docs_dir"])` e `_estado["lugares"] = lugares(temas)`;
  - a chave de progresso de um src é `files.get_file_from_path(src).url`. Criar o helper `_chave(files, src)`.
- [ ] **Passo 2:** reescrever o `_inicio(markdown, page, files)`:
  - hero com título, frase, `<label for="__search">` estilizado como campo ("Buscar aulas, exercícios, fórmulas… /") e os 4 números de `totais()`;
  - `bloco_continuar` ao lado (em 2 colunas a partir de 1024 px);
  - `## Temas`, com um `cartao_tema` por tema;
  - faixa "Como estudar aqui" (Aprenda → Pratique → Teste-se);
  - `return` só com esses blocos: o resto do README não aparece na home do site.
- [ ] **Passo 3:** em `conteudo/README.md`, a tabela-índice de temas vira `cartao_tema`, e não `cartao`, mais o link "Ver por nível" para `niveis.md`. A troca acontece no `_tabelas_indice`, quando `page.file.src_uri == "conteudo/README.md"`.
- [ ] **Passo 4:**
  - rodar o build `--strict`;
  - tirar capturas da home (claro, escuro e celular) e de Conteúdo;
  - conferir que não há rolagem para o lado em 375 px (`document.documentElement.scrollWidth <= 375` pelo CDP).
- [ ] **Passo 5: fazer o commit**, com a mensagem `feat(site): página inicial e catálogo de temas do portal`.

---

### Tarefa 8: Página do tema

**Arquivos:** mudar `.mkdocs/visual.py`.

- [ ] **Passo 1:** se `page.file.src_uri` é o `src` de um tema, fazer três coisas.
  1. Inserir o `cabecalho_tema` logo depois da linha do H1.
  2. Trocar o trecho da `tabela_roteiro(markdown)` por `<ol class="trilha">` com um `item_trilha` por unidade.
  3. Inserir "Teste-se" logo depois da trilha, se `tema.simulados` não estiver vazio: cartões com nível e duração, cada um com `data-pagina` e `data-perguntas`.
- [ ] **Passo 2:** tema sem trilha (`unidades == []`): só o cabeçalho, e a tabela continua normal.
- [ ] **Passo 3:** rodar o build `--strict`, tirar as capturas de Cálculo, Python e Git e conferir, pelo leitor de acessibilidade do Lighthouse, que a trilha é uma lista ordenada com links nomeados.
- [ ] **Passo 4: fazer o commit**, com a mensagem `feat(site): página do tema com trilha e simulados`.

---

### Tarefa 9: Aula, exercício e simulado

**Arquivos:** mudar `.mkdocs/visual.py` e `.mkdocs/tailwind.css` (barra de leitura).

- [ ] **Passo 1:** se `lugar = _estado["lugares"].get(src)`, colocar logo depois do H1 a linha `informacoes(...)` e o `marcador_de_visita(...)`. A linha muda conforme o tipo de página:

  | Página | Linha de informações |
  | ------ | -------------------- |
  | Aula ou resumo | "{Tema} · Aula {n} de {total} · ~{min} min". Nos resumos, "Resumo" no lugar de "Aula" |
  | Exercício | "{Tema} · Aula {n} · {Fácil/Intermediário/Difícil} · {k} perguntas", com o link "Rever a aula" |
  | Simulado | "{Tema} · Simulado · {duração}" |

- [ ] **Passo 2:** no fim da página, colocar o `fim_de_pagina(...)`. O texto do botão e os extras mudam conforme o tipo de página:

  | Página | Botão | Extras |
  | ------ | ----- | ------ |
  | Aula | "Marcar aula como concluída" | "Pratique agora", com os 3 níveis (`data-pagina` e `data-perguntas`), e "Próxima: {título}" |
  | Exercício | "Marcar como concluída" | O próximo nível da mesma unidade ou, depois do difícil, a próxima aula |
  | Simulado | "Marcar como feito" | Nenhum |

- [ ] **Passo 3:** só em aula e resumo, colocar `<div class="barra-leitura" aria-hidden="true"></div>` logo depois do H1. No `tailwind.css`:

```css
/* Barra de leitura: só CSS (animação ligada à rolagem). Sem suporte, não aparece. */
.barra-leitura { display: none; }
@supports (animation-timeline: scroll()) {
  .barra-leitura {
    display: block; position: fixed; inset: 2.4rem 0 auto 0; height: 3px; z-index: 5;
    background: var(--md-primary-fg-color--light); transform-origin: 0 50%;
    animation: barra-leitura linear both; animation-timeline: scroll(root);
  }
  @keyframes barra-leitura { from { transform: scaleX(0); } to { transform: scaleX(1); } }
}
@media print { .barra-leitura { display: none; } }
```

- [ ] **Passo 4:** rodar o build `--strict` e tirar as capturas da aula 04, do exercício 04 fácil, do simulado 01 de Cálculo e da aula 01 de Python.
- [ ] **Passo 5: fazer o commit**, com a mensagem `feat(site): informações, fim de página e barra de leitura nas aulas e exercícios`.

---

### Tarefa 10: `portal.js`, que desenha o progresso

**Arquivos:** criar `.mkdocs/portal.js` (no lugar do esqueleto) e mudar `tailwind.css` (`[data-concluida]`).

**Interfaces:** consome a API da Tarefa 4 e os contratos `data-*` da Tarefa 6.

- [ ] **Passo 1:** implementar. Toda saída usa `textContent`, `setAttribute` e `style.width`, nunca `innerHTML` com dados. O script:
  - lê os dados uma vez por desenho (`progresso.ler()`);
  - inicia pelo `document$`, redesenha no evento `school-cc:progresso` e no `storage`, para outra aba.

```js
  function concluida(d, chave, perguntas) {
    var p = d.paginas[chave];
    if (!p) return false;
    if (p.concluida) return true;
    return perguntas > 0 && Object.keys(p.acertos || {}).length >= perguntas;
  }
```

  O que o `portal.js` desenha:

  | Elemento | O que faz |
  | -------- | --------- |
  | `[data-progresso-tema]` | Calcula o % de `data-paginas` concluídas. Em cada página da lista, o total de perguntas vem do `[data-pagina="chave"][data-perguntas]` correspondente no documento, ou 0. Atualiza a barra (`aria-valuenow`) e mostra `[data-so-com-progresso]` quando o % for maior que 0 |
  | `[data-pagina]` | `setAttribute("data-concluida", "")` quando a página está concluída. Nos que têm `data-perguntas` maior que 0, escreve "x de n" no `[data-acertos]` |
  | `[data-continuar]` | Com `ultima`, mostra o estado "progresso" com o título, o nome do tema (do `[data-progresso-tema="slug"]` mais próximo, ou o slug) e o link `progresso.url(ultima.pagina)` |
  | `a[data-proxima]` | Encontra o 1º `[data-unidade]` da trilha não concluído, ou com algum exercício não concluído, e troca o texto para "Continuar: {data-titulo}" e o `href` para o link da unidade. Com tudo concluído, o texto fica "Revisar a trilha" |
  | `button[data-concluir]` | `aria-pressed` reflete `pagina(chave).concluida`. O clique alterna `progresso.concluir(chave, !atual)`, e o texto muda para "Concluída ✓" |
  | `[data-visita]` | Na montagem (não no redesenho), chama `progresso.visitou({titulo, tema})` |

- [ ] **Passo 2:** `tailwind.css`: estilos de `[data-concluida]`, com marca ✓ e cor de concluído, e de `button[data-concluir][aria-pressed="true"]`.
- [ ] **Passo 3:** conferir pelo CDP:
  - **página de exercício:** acertar todas → o tema Cálculo na home mostra mais de 0 % e o cartão "Continue" aponta para a página;
  - **aula:** "Marcar como concluída" → na trilha, a linha da aula ganha `data-concluida`;
  - **importação hostil:** `importar` com um rótulo `<img src=x onerror=…>` → a lista mostra o texto literal (verificado na Tarefa 11);
  - **tamanho:** `wc -c` dos 3 scripts novos somados dá no máximo 20 480 bytes.
- [ ] **Passo 4: fazer o commit**, com a mensagem `feat(site): mostra o progresso na home, no tema e nas aulas`.

---

### Tarefa 11: Página "Meu progresso"

**Arquivos:** mudar `.mkdocs/visual.py` (`on_files` gera `progresso.md`; `on_page_markdown` a monta) e `.mkdocs/portal.js` (desenho da página).

- [ ] **Passo 1:** gerar a página no `on_files`, com `File.generated(config, "progresso.md", content="# Meu progresso\n\n<!-- meu-progresso -->\n", inclusion=InclusionLevel.INCLUDED)`. No `on_page_markdown`, trocar o marcador por:
  - **o aviso** "Seu progresso fica salvo só neste navegador…", com os botões `[data-exportar]`, `[data-importar]` (com um `<input type="file" accept="application/json" hidden>`) e `[data-apagar]`, mais a mensagem `[data-mensagem] role="status"`;
  - **o resumo**: `[data-sequencia]`, `[data-dias]` (uma grade de 56 células `<span data-dia="AAAA-MM-DD">` preenchidas pelo JS a partir de hoje, porque o build não sabe a data do aluno), `[data-total-concluidas]` e `[data-total-certas]`;
  - **por tema**: um bloco `[data-progresso-tema]` por tema, com a barra, o link do tema e `[data-proximo-passo]`;
  - **revisar**: `<div data-revisar>` vazio, com o texto "Nenhuma pergunta para revisar." em `[data-revisar-vazio]`;
  - `<noscript>`: "Esta página precisa de JavaScript para ler o seu progresso.";
  - `page.meta["hide"] = ["navigation", "toc"]`.
- [ ] **Passo 2:** em `portal.js`, desenhar a página com DOM criado por `document.createElement` e `textContent`:
  - **Revisar:** os erros de `ler().paginas`, agrupados pelo 2º segmento do caminho (o tema). Cada item é um link `progresso.url(caminho) + "#" + encodeURIComponent(ancora)`, com o texto do rótulo;
  - **Exportar:** `Blob` mais `a.download = "school-cc-progresso-" + dia + ".json"`;
  - **Importar:** um `FileReader` chama `progresso.importar(texto)`. A mensagem diz "Progresso importado e juntado ao que já estava aqui." ou mostra o `erro.message`;
  - **Apagar:** pede `confirm("Apagar todo o progresso deste navegador? Não dá para desfazer.")`;
  - **Sem `progresso.disponivel`:** um aviso amarelo, "Este navegador não deixa o site salvar dados. O progresso vale só enquanto esta aba estiver aberta."
- [ ] **Passo 3:** conferir pelo CDP:
  - **revisar:** errar uma pergunta → ela aparece em Revisar com o link certo; acertar → some;
  - **exportar e importar:** exportar, apagar e importar → tudo volta;
  - **arquivo hostil:** importar o arquivo hostil da Tarefa 10 → o texto aparece literal, e nenhum `img` é criado;
  - **sem armazenamento:** com `localStorage.setItem` sobrescrito para dar erro (`Page.addScriptToEvaluateOnNewDocument`) → o aviso aparece.
- [ ] **Passo 4: fazer o commit**, com a mensagem `feat(site): página Meu progresso com revisão, exportar e importar`.

---

### Tarefa 12: Acabamento, medição do "depois" e documentação

**Arquivos:** mudar `.github/workflows/pages.yml` e `CONTRIBUTING.md`.

- [ ] **Passo 1: CI.** Trocar o passo "Corretor" por:

```yaml
      # Corretor (todo gabarito passa nele) e progresso do aluno, no navegador.
      - name: Testes de JavaScript
        run: node --test .mkdocs/corretor.test.js .mkdocs/progresso.test.js
```

e somar, depois do `pip install`:

```yaml
      # Catálogo do portal: temas, trilhas e contagens lidos das tabelas do Markdown.
      - name: Catálogo
        run: python -m unittest discover -s .mkdocs -p "test_*.py"
```

- [ ] **Passo 2: `CONTRIBUTING.md`.** Na seção do site, explicar:
  - a tabela "| # | Aula | Nível | O que você aprende | Exercícios |" do README do tema vira a trilha no site, com as colunas aceitas;
  - um tema novo aparece sozinho em "Outros", e para ter área e ícone basta uma linha no `TEMAS` do `.mkdocs/_catalogo.py`.
- [ ] **Passo 3: acessibilidade.**
  - Lighthouse de Acessibilidade de 95 ou mais nas 4 páginas.
  - Navegar por Tab na home, no tema e no exercício: o foco é visível e a ordem é lógica.
  - Com "reduzir movimento" (`Emulation.setEmulatedMedia` com `prefers-reduced-motion: reduce`), nada anima.
- [ ] **Passo 4: medir o "depois",** com o mesmo comando da Tarefa 1, no site da branch. Se o LCP do celular for dominado pelas fontes do Google:
  - ativar o plugin `privacy` (`- privacy` em `plugins`, com o `cache_dir` fora do repositório ou no `.gitignore`);
  - medir de novo;
  - manter só se melhorar.

  Montar a tabela antes e depois em `<scratchpad>/redesign/resultado.md`.
- [ ] **Passo 5: capturas finais** (claro, escuro e celular) das 6 páginas, em `<scratchpad>/redesign/depois/`.
- [ ] **Passo 6: verificação completa:**
  - build `--strict`;
  - os 3 testes;
  - `git diff main --stat`, que não pode tocar `conteudo/`, `simulados/` nem `CLAUDE.md`;
  - CSS compilado igual ao do repositório.
- [ ] **Passo 7:** revisão da branch inteira. Corrigir o que for confirmado.
- [ ] **Passo 8: fazer o commit**, com a mensagem `docs(site): documenta a trilha do portal e roda os testes novos na CI`.
- [ ] **Passo 9:** servir o site final localmente e mandar ao usuário o link, a tabela antes e depois e as capturas. **Sem push, PR ou merge até a aprovação.**
