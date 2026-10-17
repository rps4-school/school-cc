# Portal de ensino: design do site

- **Data:** 2026-10-17
- **Branch:** `feat/site-portal-de-ensino`
- **Estado:** rascunho para revisão

## 1. Objetivo

O site deixa de ser uma documentação e passa a funcionar como um **portal de ensino**. O aluno chega, escolhe um tema e segue a trilha **aprenda → pratique → teste-se**, vendo o que já fez.

**Critérios de sucesso:**

- **Na página inicial, cada ação está a 1 clique:**
  - buscar;
  - continuar de onde parou;
  - abrir um tema.
- **Página do tema:** mostra a trilha, aula por aula, com os exercícios de cada nível e o que já foi concluído.
- **Lighthouse no celular, nas 4 páginas medidas** (seção 8):
  - Desempenho de 90 ou mais;
  - Acessibilidade de 95 ou mais;
  - CLS abaixo de 0,1.
- **O Markdown do conteúdo não muda.** O GitHub mostra tudo igual a hoje, e quem escreve conteúdo segue o mesmo formato.

## 2. Decisões já tomadas

| Decisão | Escolha |
| ------- | ------- |
| Onde | No site atual do school-cc (MkDocs Material 9.7.7), não no aluno2aluno |
| Como | **Hooks e componentes** (Python), Tailwind e JavaScript sem framework e sem bundler |
| Conteúdo | Continua só em Markdown, sem mudanças |
| Progresso | **No navegador** (localStorage), sem conta. A página avisa onde ele fica salvo e tem botões para exportar, importar e apagar |
| Temas | Só aparecem temas com conteúdo. As contagens são calculadas no build, não escritas à mão |
| Templates do Material | **Nenhum é sobrescrito**, para facilitar a atualização do Material |

## 3. Fora do escopo

- Login, servidor e sincronizar o progresso entre aparelhos. Isso é papel do aluno2aluno.
- Filtros por área no catálogo. Entram quando houver mais temas, porque hoje são 4 temas em 4 áreas.
- Pontos, medalhas e ranking. A única motivação extra é a sequência de dias estudados.
- Uso offline (PWA), comentários e fórum.
- Trocar a versão do MkDocs ou do Material.

## 4. Arquitetura

O build gera **HTML estático com atributos `data-*`**: tema, página, total de perguntas. Um JavaScript pequeno lê o progresso no localStorage e só **decora** a página, marcando o que foi concluído e preenchendo as barras. Sem JavaScript, o site funciona inteiro, só que sem progresso.

```
Markdown (conteudo/, simulados/)
   │
   ├─ _catalogo.py ── modelo: temas, trilhas, contagens (lido 1 vez, no on_files)
   ├─ hooks.py ────── estrutura: páginas de pasta, .py, links, abas
   └─ visual.py ───── apresentação: home, tema, aula, exercício, "Meu progresso"
         │                 └─ _componentes.py (HTML + classes do Tailwind)
         ▼
HTML estático + data-pagina / data-tema / data-perguntas
         │
         ▼
progresso.js (dados no localStorage) ◄── corretor.js (acertos e erros)
   └─ portal.js (desenha o progresso na home, tema, aula e "Meu progresso")
```

### 4.1 Arquivos

| Arquivo | O que muda |
| ------- | ---------- |
| `.mkdocs/_catalogo.py` (novo) | Lê o conteúdo e monta o modelo da seção 4.2. Só dados, sem HTML |
| `.mkdocs/_componentes.py` | Componentes novos (cartão de tema, barra de progresso, item da trilha, cabeçalho de tema, linha de informações da aula, botão Concluir) e `TEMAS` (área, ícone e cor de cada tema) |
| `.mkdocs/visual.py` | Home nova, cabeçalho e trilha do tema, informações e fim de aula e de exercício, página "Meu progresso" gerada (como a `niveis.md`). O cronômetro sai do script inline |
| `.mkdocs/hooks.py` | Abas do topo (seção 6.1) |
| `.mkdocs/progresso.js` (novo) | Guarda e lê o progresso (seção 5). As funções sem página são testadas no Node |
| `.mkdocs/portal.js` (novo) | Desenha o progresso nas páginas e cuida dos botões Concluir, Exportar, Importar e Apagar |
| `.mkdocs/cronometro.js` (novo) | O cronômetro da folha de prova, que hoje é um script inline |
| `.mkdocs/corretor.js` | Caixa compacta, placar único na página, acertos e erros salvos pelo `progresso.js` |
| `.mkdocs/editor.js` | Ao sair da página, cancela a fila e encerra o Python, que pesa dezenas de MB |
| `.mkdocs/tailwind.css` e `site.css` | Estilos novos, recompilados |
| `.mkdocs/mkdocs.yml` | Navegação instantânea, os scripts novos e a licença no rodapé |
| `.mkdocs/progresso.test.js` e `test_catalogo.py` (novos) | Testes (seção 9) |
| `.github/workflows/pages.yml` | Roda os testes novos |
| `CONTRIBUTING.md` | Explica que a tabela do roteiro vira a trilha no site e como dar área e ícone a um tema novo |

### 4.2 Modelo do catálogo

O modelo é montado uma vez por build:

```
Tema:      slug, título, descrição, área, ícone, nível, url, unidades, simulados
Unidade:   número, título, url, descrição, nível, minutos de leitura, exercícios
Exercício: nível (fácil/intermediário/difícil), url, quantos exercícios, quantas perguntas com corretor
Simulado:  título, url, nível, duração, quantas perguntas com corretor
```

De onde vem cada dado:

- **Tema e descrição:** da tabela do `conteudo/README.md`, que quem contribui já mantém.
- **Área, ícone e cor:** do `TEMAS`, no `_componentes.py`.
  - Exemplos: Python em Programação, Git em Engenharia de Software, Cálculo em Matemática, Sistemas Digitais em Hardware.
  - Tema sem entrada no `TEMAS` aparece mesmo assim, na área "Outros" e com o ícone de pasta.
- **Trilha:** a primeira tabela do README do tema cujo cabeçalho começa com `| # |`. As colunas são reconhecidas pelo nome:

  | Coluna | Nomes aceitos |
  | ------ | ------------- |
  | Unidade (link) | `Aula`, `Resumo` ou `Arquivo` |
  | Nível | `Nível` |
  | Descrição | `O que você aprende` ou `Você vai aprender` |
  | Exercícios | `Exercícios` |

  Funciona com as 4 tabelas de hoje. A linha **Este arquivo**, do Git, vira a unidade "o próprio README". Se não houver tabela, a página do tema fica como hoje, sem trilha e sem erro no build.
- **Perguntas com corretor:** contadas no Markdown com a mesma regra do `_corretores` (um `**Resposta:**`, `**Número:**`... dentro de `<details>`). Os exercícios são os `## Exercício`.
- **Minutos de leitura:** palavras fora de blocos de código ÷ 200, arredondado para cima, mínimo 1.
- **Simulados:** a pasta `simulados/<tema>/` e a tabela de `simulados/README.md`, que tem o nível e a duração.

## 5. Progresso no navegador

Tudo fica numa chave só, `school-cc:progresso`:

```json
{
  "versao": 1,
  "paginas": {
    "conteudo/calculo/exercicios/04-derivada/facil/": {
      "concluida": "2026-10-17",
      "acertos": { "0:9": "9" },
      "erros": { "1:5,2": { "rotulo": "Exercício 01: Robô na esteira · b)", "ancora": "exercício-01-robô-na-esteira" } }
    }
  },
  "dias": ["2026-10-15", "2026-10-17"],
  "ultima": { "pagina": "conteudo/calculo/aulas/04-derivada/", "titulo": "Derivada", "tema": "calculo" }
}
```

### Regras

- **Página:** é o caminho a partir da raiz do site, lida do `base` que o Material publica em `#__config`. O mesmo arquivo de progresso serve no `localhost` e no GitHub Pages.
- **Concluída:** acontece de duas formas:
  - o aluno clica em **Marcar como concluída**, em aulas, resumos e páginas de exercício; dá para desmarcar;
  - automaticamente, quando todas as perguntas com corretor da página estão certas.
- **Revisar:**
  - a pergunta entra quando o aluno erra e sai quando ele acerta;
  - o rótulo e a âncora vêm do build: o título do `##` mais próximo e a letra **a)**, **b)**... quando houver. Eles chegam ao corretor nos atributos `data-rotulo` e `data-ancora`.
- **Dias estudados:**
  - conta o dia (data local) em que o aluno confere uma resposta ou conclui uma página. Só abrir a página não conta;
  - guarda os últimos 120 dias.
- **Última página:** atualizada ao abrir uma aula, resumo, exercício ou simulado. Home e listagens não contam.
- **Migração:** na primeira vez, o site converte as chaves antigas do corretor (`school-cc:corretor:<caminho>`) e as apaga. Quem já tem acertos salvos não perde nada.
- **Exportar:** baixa `school-cc-progresso-AAAA-MM-DD.json`.
- **Importar:**
  - **junta** com o que já existe, sem apagar nada: conclusão mais antiga, acertos somados, dias unidos e última página mais recente;
  - arquivo inválido ou de outra versão é recusado com uma mensagem.
- **Apagar:** pede confirmação. Serve para computador compartilhado.
- **Sem localStorage:** em navegador bloqueado ou aba anônima restrita, tudo funciona sem salvar, e "Meu progresso" avisa.

## 6. Páginas

### 6.1 Cabeçalho e abas

| Aba | O que tem |
| --- | --------- |
| Início | A home do portal |
| Conteúdo | Os temas, com "Por nível" dentro |
| Simulados | As provas de treino |
| Meu progresso | A página gerada da seção 6.8 |
| Colabore | Guia de Acesso e Como contribuir. Sai do meio da navegação de quem estuda, mas continua fácil de achar |

A busca do Material continua no cabeçalho.

### 6.2 Início

1. **Hero:**
   - título e uma frase;
   - um campo de busca grande, que é um `<label for="__search">` e abre a busca do Material sem JavaScript (atalho `/`);
   - os números do build: temas, aulas e resumos, exercícios e simulados.
2. **Cartão "Continue de onde parou",** ao lado do hero:
   - com progresso, mostra a última página, o tema e o botão **Continuar**;
   - sem progresso, mostra "Primeira vez aqui?", com 3 passos curtos e o botão **Ver temas**;
   - os dois estados têm o mesmo tamanho, para a página não pular quando o JavaScript troca o conteúdo.
3. **Catálogo,** com um cartão por tema:
   - ícone e cor da área, área e nível;
   - "10 aulas · 90 exercícios · 4 simulados";
   - a barra de progresso. O espaço dela é reservado e ela só aparece quando há progresso.
4. **Faixa "Como estudar aqui":**
   - Aprenda: as aulas;
   - Pratique: os exercícios com correção na hora;
   - Teste-se: os simulados com cronômetro.
5. **Fora do site:** as seções do README que são para quem contribui ("Como o repositório está organizado", "Licença") saem da home do site e continuam no GitHub. A licença vai para o rodapé.

### 6.3 Conteúdo

Os mesmos cartões de tema da home, todos, com o link "Ver por nível".

### 6.4 Tema (o README do tema)

- **Cabeçalho do curso,** logo abaixo do título:
  - área e nível;
  - contagens;
  - barra de progresso;
  - botão **Começar**, que vai para a 1ª unidade, ou **Continuar: Aula 5**, que vai para a próxima unidade ainda não concluída.
- **Trilha,** no lugar da tabela do roteiro, com uma linha por unidade:
  - número, título e descrição;
  - nível e tempo de leitura;
  - marca de concluída;
  - três botões de exercício (Fácil, Intermediário e Difícil), com "x de n" quando houver progresso.
- **Teste-se:** os simulados do tema, com nível, duração e situação (feito, quantas certas).
- **Resto do README:** continua abaixo, como hoje ("Como estudar", mapas, links).

### 6.5 Aula e resumo

- **Linha de informações abaixo do título,** por exemplo: "Cálculo · Aula 4 de 10 · ~12 min". O nível continua na etiqueta que o Material já mostra.
- **Barra de leitura** de 3 px, logo abaixo do cabeçalho:
  - é feita só com CSS (animação ligada à rolagem);
  - o navegador sem suporte simplesmente não mostra a barra.
- **No fim da página:**
  - **Marcar como concluída**;
  - **Pratique agora**, com os 3 níveis da mesma unidade e os acertos de cada um;
  - **Próxima aula**.

### 6.6 Exercícios

- **Linha de informações:** "Cálculo · Aula 4 · Fácil · 9 perguntas · Rever a aula".
- **Corretor compacto:** o campo e o botão numa linha, com a resposta logo embaixo. O placar sai de cada caixa.
- **Placar único e fixo:**
  - fica na parte de baixo da tela no celular e preso no canto da coluna de conteúdo no computador;
  - mostra "3 de 9 certas", com uma barra;
  - tem o botão **Recomeçar**, que limpa os acertos da página.
- **No fim:** **Marcar como concluída** e o próximo nível ("Intermediário →") ou a próxima aula.
- **Python:** os exercícios não têm corretor, então a página só ganha o botão de concluir.

### 6.7 Simulados

- A folha de prova continua igual. O cronômetro passa a vir do `cronometro.js`.
- O placar é o mesmo dos exercícios.
- Ao terminar, o aluno clica em **Marcar como feito**. O resultado fica salvo com as certas ("Feito · 8 de 12 certas"). Nos simulados de Python, que não têm corretor, fica só "Feito".

### 6.8 Meu progresso

É uma página gerada, como a `niveis.md`, e tem:

- **Aviso no topo:** "Seu progresso fica salvo só neste navegador", com **Exportar**, **Importar** e **Apagar**.
- **Resumo:**
  - sequência atual de dias;
  - uma grade dos dias estudados nas últimas 8 semanas;
  - páginas concluídas;
  - perguntas certas.
- **Por tema:** a barra e o próximo passo.
- **Revisar:** as perguntas erradas que ainda não foram acertadas, por tema, com link direto para cada uma.
- **Sem JavaScript:** um texto explicando que a página precisa dele.

## 7. Visual

- **Direção:** um catálogo de cursos limpo, não uma documentação:
  - hierarquia forte;
  - cartões de tema com a cor da área;
  - bastante respiro;
  - a fonte Inter, que já é carregada.

  Os detalhes ficam para a implementação.
- **Cores:**
  - o índigo continua como cor principal;
  - cada área ganha uma cor de destaque, diferente do semáforo dos níveis (verde, amarelo e vermelho), para não confundir área com dificuldade.
- **Funciona igual em:**
  - modo claro e escuro;
  - celular primeiro: uma coluna até 640 px, margem de 16 px e sem rolagem para o lado.
- **Acessibilidade:**
  - contraste AA, foco visível e alvos de toque com 44 px ou mais;
  - animações desligadas com "reduzir movimento";
  - barras com `role="progressbar"` e `aria-valuenow`;
  - **Marcar como concluída** com `aria-pressed`;
  - placar e resposta do corretor com `aria-live="polite"`.

## 8. Desempenho

- **Navegação instantânea:** `navigation.instant`, `.prefetch` e `.progress`. O site troca de página sem recarregar e baixa a próxima ao passar o mouse.
- **Scripts:** todos começam pelo `document$` do Material, com alternativa para quando ele não existe, e não montam duas vezes a mesma caixa (`data-montado`). O script inline do cronômetro vira arquivo.
- **Medição antes e depois:**
  - Lighthouse no modo celular, nas 4 páginas: home, tema Cálculo, aula 04 de Cálculo e o exercício 04 fácil;
  - registro de: notas, LCP, CLS, TBT, bytes transferidos e número de requisições.
- **Peso dos scripts novos** (`progresso.js`, `portal.js` e `cronometro.js`): no máximo 20 KB juntos, sem compressão.
- **Fontes:** se as fontes do Google forem o gargalo do LCP, ativamos o plugin `privacy` do Material para servi-las pelo próprio site. A decisão sai da medição e fica registrada no PR.

## 9. Testes e verificação

- `mkdocs build --strict` continua passando.
- `node --test .mkdocs/corretor.test.js .mkdocs/progresso.test.js` cobre:
  - migração;
  - junção na importação;
  - sequência de dias;
  - recusa de arquivo inválido.
- `python3 -m unittest discover -s .mkdocs -p "test_*.py"` cobre:
  - a leitura das 4 tabelas de roteiro reais;
  - os casos de borda: sem tabela, linha sem link, tema sem exercícios;
  - as contagens, que precisam bater com os arquivos.
- **CI:** o `pages.yml` roda os dois.
- **Capturas** com o Chrome headless, antes e depois: modo claro, modo escuro e celular, nas páginas home, tema, aula, exercício, simulado e "Meu progresso".
- **Teste manual da navegação instantânea:** de aula para exercício para simulado, sem recarregar. KaTeX, Mermaid, corretor, editor de Python e cronômetro precisam funcionar depois de cada troca, e o download dos `.py` também.

## 10. Riscos

| Risco | Como tratamos |
| ----- | ------------- |
| Alguém muda o formato da tabela do roteiro | O tema volta a mostrar a tabela normal, e o teste do catálogo falha na CI |
| Script quebra com a navegação instantânea | Todo script começa pelo `document$` e é idempotente. O teste manual da seção 9 cobre os 5 casos |
| Python do editor continua ocupando memória fora do simulado | O `editor.js` encerra o worker ao trocar de página |
| Atualização do Material quebra o visual | Nenhum template é sobrescrito |
| Aluno perde o progresso ao limpar o navegador | Aviso na página e botão de exportar |
| Computador compartilhado mistura o progresso | Botão **Apagar** com confirmação e aviso |

## 11. Entrega em fases

Cada fase vira commits **locais** na branch.

1. **Base:**
   - medir o "antes";
   - `_catalogo.py` com testes;
   - abas;
   - navegação instantânea com os scripts adaptados (cronômetro, corretor, editor).
2. **Progresso:**
   - `progresso.js` com testes;
   - migração das chaves antigas;
   - corretor compacto com placar único;
   - Marcar como concluída.
3. **Páginas:** home, Conteúdo, tema com trilha, aula, exercício e simulado.
4. **Meu progresso.**
5. **Acabamento:**
   - acessibilidade;
   - medir o "depois" (e o `privacy`, se precisar);
   - `CONTRIBUTING.md`;
   - capturas.

No fim, o site sobe localmente para você validar. Push, PR e merge só com a sua aprovação.

## 12. Como vamos trabalhar

- **Plano:** um plano de implementação, escrito a partir desta especificação.
- **Execução:** uma tarefa por vez, com o teste escrito antes do código e a verificação completa antes de dar cada fase como pronta.
- **Revisão:** a branch inteira é revisada antes do PR.
