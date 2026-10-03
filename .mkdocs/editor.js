/*
 * Editor de Python dos simulados (só no site: o Markdown do GitHub não muda).
 *
 * O visual.py coloca um <div class="editor-python"> antes do "Ver resposta" de
 * cada questão. Aqui ele vira um cartão com o botão "Abrir editor". Só no clique
 * baixamos o Monaco (o editor do VS Code) e o Python (Pyodide, no python-worker.js):
 * quem só lê a prova não paga esses megabytes.
 *
 * O terminal é interativo: o programa para no input(), o aluno digita e aperta
 * Enter. Por baixo, o código roda de novo com a entrada nova (veja o worker).
 */
(function () {
  "use strict";

  var MONACO = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs";
  // Hash do loader.js dessa versão: se o CDN entregar outro arquivo, o navegador recusa.
  var MONACO_SRI = "sha384-pHG02SG8pId94Np3AbPmBEJ1yPqaH0IkJGLSNGXYmuGhkazT8Lr/57WYpbkGjJtu";
  var WORKER = new URL("python-worker.js", document.currentScript.src).href;
  var TEMPO_LIMITE = 10000; // ms por execução; passou disso, é laço infinito
  var FOLGA = 1500; // ms para o programa acabar depois de já ter pedido uma entrada
  var TEM_IMPORT = /^\s*(import|from)\s+\w/m;

  var DISCRETO = "text-slate-500 dark:text-slate-400";
  var ERRO = "text-rose-600 dark:text-rose-400";
  var AVISO = "text-amber-700 dark:text-amber-300";

  // ---------- Python: um worker para a página, uma execução por vez ----------
  //
  // Cada "Executar" (ou Enter no terminal) vira uma tarefa na fila. O worker roda
  // uma de cada vez, e o relógio de 10 s só começa quando a tarefa entra no
  // worker. Se ela estourar o tempo (ou o aluno apertar Parar), só ela é
  // encerrada: o worker é recriado e as tarefas que esperavam continuam.

  var python = null; // { worker, pronto, sinal, carregado }
  var fila = []; // tarefas esperando a vez
  var atual = null; // a tarefa que está rodando agora
  var proximoId = 0;

  function iniciarPython() {
    if (python) return python;
    var worker = new Worker(WORKER);
    var sinal;
    var pronto = new Promise(function (ok, falha) {
      sinal = { ok: ok, falha: falha };
    });
    var este = { worker: worker, pronto: pronto, sinal: sinal, carregado: false };
    pronto.then(function () {
      este.carregado = true;
      proxima();
    }, function (erro) {
      if (python !== este) return;
      python = null; // deixa tentar de novo na próxima execução
      // Sem Python, ninguém da fila vai rodar: avisa todo mundo.
      fila.splice(0).forEach(function (t) { t.falha(erro); });
    });
    worker.onmessage = function (e) {
      var d = e.data;
      if (d.pronto) return sinal.ok();
      if (d.falhou) return sinal.falha(new Error(d.falhou));
      if (!atual || atual.id !== d.id) return;
      var t = atual;
      clearTimeout(t.relogio);
      responder(t, d);
      if (d.adiantado) {
        // O resultado saiu no meio da execução (o programa pediu uma entrada que ainda não
        // existe ou estourou a saída). Se um except: do aluno engoliu a parada, o programa
        // continua rodando à toa: damos uma folga e, se não acabar, encerramos o worker.
        t.relogio = setTimeout(function () {
          encerrarAtual("parado");
        }, FOLGA);
        return;
      }
      atual = null;
      proxima();
    };
    worker.onerror = function () {
      sinal.falha(new Error("Não deu para carregar o Python."));
    };
    python = este;
    return python;
  }

  // Cada tarefa recebe uma resposta só (a adiantada ou a do fim, o que vier primeiro).
  function responder(t, resultado) {
    if (t.respondida) return;
    t.respondida = true;
    t.ok(resultado);
  }

  function proxima() {
    if (atual || !python || !python.carregado || !fila.length) return;
    atual = fila.shift();
    atual.relogio = setTimeout(function () {
      encerrarAtual("tempo");
    }, TEMPO_LIMITE);
    python.worker.postMessage(atual.msg);
  }

  // Encerra o worker no meio da tarefa atual (laço infinito ou Parar) e recria para as outras.
  function encerrarAtual(estado) {
    var t = atual;
    atual = null;
    clearTimeout(t.relogio);
    python.worker.terminate();
    python = null;
    responder(t, { estado: estado });
    if (fila.length) iniciarPython();
  }

  function rodarPython(codigo, entradas, arquivo) {
    var tarefa = { id: ++proximoId };
    tarefa.msg = { id: tarefa.id, codigo: codigo, entradas: entradas, arquivo: arquivo };
    tarefa.promessa = new Promise(function (ok, falha) {
      tarefa.ok = ok;
      tarefa.falha = falha;
    });
    fila.push(tarefa);
    iniciarPython();
    proxima();
    return tarefa;
  }

  // Parar uma tarefa: se ela está rodando, encerra o worker; se está na fila, só sai da fila.
  function cancelarPython(tarefa) {
    if (atual === tarefa) return encerrarAtual("parado");
    var i = fila.indexOf(tarefa);
    if (i >= 0) {
      fila.splice(i, 1);
      responder(tarefa, { estado: "parado" });
    }
  }

  // ---------- Monaco: carregado uma vez, do CDN ----------

  var monaco = null;

  function temaAtual() {
    return document.body.getAttribute("data-md-color-scheme") === "slate" ? "vs-dark" : "vs";
  }

  function carregarMonaco() {
    if (monaco) return monaco;
    monaco = new Promise(function (ok, falha) {
      // Os workers do Monaco vêm de outro domínio (CDN): o navegador só aceita via data: URL.
      window.MonacoEnvironment = {
        getWorkerUrl: function () {
          return "data:text/javascript;charset=utf-8," + encodeURIComponent(
            "self.MonacoEnvironment={baseUrl:'" + MONACO + "/'};" +
            "importScripts('" + MONACO + "/base/worker/workerMain.js');"
          );
        },
      };
      var script = document.createElement("script");
      script.src = MONACO + "/loader.js";
      script.integrity = MONACO_SRI;
      script.crossOrigin = "anonymous";
      script.onerror = falha;
      script.onload = function () {
        window.require.config({ paths: { vs: MONACO } });
        window.require(["vs/editor/editor.main"], function () {
          configurarMonaco(window.monaco);
          ok(window.monaco);
        }, falha);
      };
      document.head.appendChild(script);
    });
    monaco.catch(function () {
      monaco = null;
    });
    return monaco;
  }

  var PALAVRAS = ["and", "break", "continue", "def", "elif", "else", "False", "for", "if", "in",
    "is", "None", "not", "or", "pass", "return", "True", "while"];
  var FUNCOES = ["abs", "float", "input", "int", "len", "max", "min", "print", "range", "round",
    "str", "sum"];
  var METODOS = ["append", "count", "index", "insert", "join", "lower", "pop", "remove", "reverse",
    "sort", "split", "strip", "upper"];
  var TRECHOS = {
    "for": "for ${1:i} in range(${2:n}):\n\t$0",
    "while": "while ${1:condicao}:\n\t$0",
    "if": "if ${1:condicao}:\n\t$0",
    "def": "def ${1:nome}(${2}):\n\t$0",
    "input": "input(\"${1:Mensagem: }\")",
  };

  function configurarMonaco(m) {
    // Tema claro ou escuro, junto com o botão de tema do site.
    new MutationObserver(function () {
      m.editor.setTheme(temaAtual());
    }).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });

    // Autocompletar simples: palavras-chave, funções e métodos que caem na prova.
    m.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: function (modelo, posicao) {
        var palavra = modelo.getWordUntilPosition(posicao);
        var faixa = {
          startLineNumber: posicao.lineNumber, endLineNumber: posicao.lineNumber,
          startColumn: palavra.startColumn, endColumn: palavra.endColumn,
        };
        var tipo = m.languages.CompletionItemKind;
        function item(rotulo, kind, texto, detalhe) {
          return {
            label: rotulo, kind: kind, insertText: texto || rotulo, range: faixa, detail: detalhe,
            insertTextRules: texto ? m.languages.CompletionItemInsertTextRule.InsertAsSnippet : undefined,
          };
        }
        var itens = PALAVRAS.map(function (p) { return item(p, tipo.Keyword); })
          .concat(FUNCOES.map(function (f) { return item(f, tipo.Function); }))
          .concat(METODOS.map(function (f) { return item(f, tipo.Method); }));
        Object.keys(TRECHOS).forEach(function (t) {
          itens.push(item(t, tipo.Snippet, TRECHOS[t], "trecho"));
        });
        return { suggestions: itens };
      },
    });
  }

  // ---------- Cartão de cada questão ----------

  function botao(classe, texto, extra) {
    return '<button type="button" class="' + classe + " md-button " + (extra || "") + '">' + texto + "</button>";
  }

  function montar(caixa) {
    var arquivo = caixa.dataset.arquivo;
    caixa.className = "editor-python my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white " +
      "shadow-sm dark:border-white/10 dark:bg-white/5";
    caixa.innerHTML =
      '<div class="flex flex-wrap items-center justify-between gap-3 px-5 py-3">' +
      '<div><div class="text-[0.6rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      "Resolver no site</div>" +
      '<div class="arquivo font-mono text-[0.8rem] font-semibold text-slate-900 dark:text-slate-100"></div></div>' +
      botao("abrir", "Abrir editor", "md-button--primary") +
      '<div class="falha hidden w-full text-[0.7rem] ' + ERRO + '"></div></div>';
    caixa.querySelector(".arquivo").textContent = arquivo;
    var abrir = caixa.querySelector(".abrir");
    abrir.onclick = function () {
      abrir.disabled = true;
      abrir.textContent = "Carregando…";
      iniciarPython(); // o Python já vai baixando enquanto o editor carrega
      carregarMonaco().then(function (m) {
        abrir.remove();
        criarEditor(caixa, m);
      }, function () {
        abrir.disabled = false;
        abrir.textContent = "Tentar de novo";
        var falha = caixa.querySelector(".falha");
        falha.textContent = "Não deu para carregar o editor. Confira a internet e tente de novo.";
        falha.classList.remove("hidden");
      });
    };
  }

  function criarEditor(caixa, m) {
    var arquivo = caixa.dataset.arquivo;
    var chave = "school-cc:editor:" + location.pathname + ":" + arquivo;
    var inicial = "# " + arquivo + " · Questão " + caixa.dataset.questao + "\n\n";
    var salvo = null;
    try {
      salvo = localStorage.getItem(chave);
    } catch (e) { /* navegador sem localStorage: só não salva */ }

    caixa.querySelector(".falha").remove();
    var painel = document.createElement("div");
    painel.innerHTML =
      '<div class="flex flex-wrap items-center gap-2 border-t border-slate-200 px-5 py-2 dark:border-white/10">' +
      botao("executar", "▶ Executar", "md-button--primary") +
      botao("parar", "■ Parar") +
      botao("limpar", "Limpar terminal") +
      botao("baixar", "") +
      botao("restaurar", "Recomeçar") +
      '<span class="ml-auto text-[0.62rem] ' + DISCRETO + '">Ctrl+Enter executa · salvo neste navegador</span></div>' +
      '<div class="codigo border-t border-slate-200 dark:border-white/10"></div>' +
      '<div class="border-t border-slate-200 dark:border-white/10">' +
      '<div class="px-5 pt-2 text-[0.6rem] font-bold uppercase tracking-wider ' + DISCRETO + '">Terminal</div>' +
      '<div class="tela bg-slate-50 px-5 pt-2 pb-4 text-slate-900 dark:bg-[#1e1e1e] dark:text-slate-200" role="log" aria-live="polite" aria-label="Terminal">' +
      '<input class="campo" type="text" hidden autocomplete="off" spellcheck="false" aria-label="Entrada do programa">' +
      "</div></div>";
    caixa.appendChild(painel);
    painel.querySelector(".baixar").textContent = "Baixar " + arquivo;

    var tela = painel.querySelector(".tela");
    var campo = painel.querySelector(".campo");
    var executar = painel.querySelector(".executar");
    var parar = painel.querySelector(".parar");
    var editor = m.editor.create(painel.querySelector(".codigo"), {
      value: salvo || inicial,
      language: "python",
      theme: temaAtual(),
      automaticLayout: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 14,
      tabSize: 4,
      insertSpaces: true,
      scrollBeyondLastLine: false,
      renderWhitespace: "selection",
      bracketPairColorization: { enabled: true },
      fixedOverflowWidgets: true,
      padding: { top: 12 },
    });
    var sessao = null; // { codigo, entradas } enquanto o programa roda ou espera entrada
    var tarefa = null; // a execução desta questão que está na fila ou rodando

    function escrever(texto, classe) {
      var span = document.createElement("span");
      if (classe) span.className = classe;
      span.textContent = texto;
      tela.insertBefore(span, campo);
      tela.scrollTop = tela.scrollHeight;
    }

    function limpar() {
      while (tela.firstChild !== campo) tela.removeChild(tela.firstChild);
      campo.hidden = true;
    }

    function rodando(sim) {
      executar.disabled = sim;
      parar.disabled = !sim && !sessao;
    }

    function quebra() {
      var texto = tela.textContent;
      return texto && !texto.endsWith("\n") ? "\n" : "";
    }

    function avisarImport(s) {
      if (TEM_IMPORT.test(s.codigo)) escrever("Atenção: a prova não permite import.\n\n", AVISO);
    }

    function mostrar(s, r) {
      if (r.saida === undefined) {
        // Parado de fora: a saída parcial ficou no worker encerrado.
        escrever(quebra() + (r.estado === "tempo"
          ? "[parado: passou de " + TEMPO_LIMITE / 1000 + " s. Tem um laço infinito?]"
          : "[parado]"), ERRO);
        sessao = null;
        return;
      }
      limpar();
      avisarImport(s);
      escrever(r.saida);
      if (r.estado === "aguardando") {
        campo.value = "";
        campo.hidden = false;
        campo.focus({ preventScroll: true });
        return;
      }
      sessao = null;
      if (r.estado === "erro") {
        escrever(quebra() + "\n" + (r.linha ? "Erro na linha " + r.linha + ":\n" : "") + r.erro, ERRO);
        if (r.linha) {
          var modelo = editor.getModel();
          m.editor.setModelMarkers(modelo, "python", [{
            startLineNumber: r.linha, endLineNumber: r.linha, startColumn: 1,
            endColumn: modelo.getLineMaxColumn(r.linha), message: r.erro.trim(),
            severity: m.MarkerSeverity.Error,
          }]);
        }
      } else if (r.estado === "saida-grande") {
        escrever(quebra() + "[parado: saída grande demais. Tem um print dentro de um laço infinito?]", ERRO);
      } else {
        escrever(quebra() + "\n[programa encerrado]", DISCRETO);
      }
    }

    function rodar() {
      var s = sessao;
      campo.hidden = true;
      rodando(true);
      if (!python || !python.carregado) {
        escrever(quebra() + "Carregando o Python (só na primeira vez, pode levar alguns segundos)…\n", DISCRETO);
      }
      var t = tarefa = rodarPython(s.codigo, s.entradas, arquivo);
      if (atual && atual !== t) escrever(quebra() + "Esperando outra questão terminar de rodar…\n", DISCRETO);
      t.promessa.then(function (r) {
        if (tarefa === t) tarefa = null;
        if (sessao !== s) return; // outra execução começou no meio
        mostrar(s, r);
        rodando(false);
      }, function () {
        if (tarefa === t) tarefa = null;
        if (sessao !== s) return;
        sessao = null;
        escrever(quebra() + "Não deu para carregar o Python. Confira a internet e execute de novo.", ERRO);
        rodando(false);
      });
    }

    executar.onclick = function () {
      m.editor.setModelMarkers(editor.getModel(), "python", []);
      limpar();
      sessao = { codigo: editor.getValue(), entradas: [] };
      avisarImport(sessao);
      rodar();
    };
    editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.Enter, function () {
      if (!executar.disabled) executar.onclick();
    });

    campo.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || !sessao) return;
      e.preventDefault();
      sessao.entradas.push(campo.value);
      escrever(campo.value + "\n"); // eco imediato; a próxima saída redesenha tudo
      rodar();
    });

    parar.onclick = function () {
      if (tarefa) return cancelarPython(tarefa); // rodando ou na fila: para só esta questão
      sessao = null; // só esperando entrada: basta largar a sessão
      campo.hidden = true;
      escrever(quebra() + "[parado]", ERRO);
      rodando(false);
    };

    painel.querySelector(".limpar").onclick = function () {
      if (tarefa) cancelarPython(tarefa);
      sessao = null;
      limpar();
      rodando(false);
    };

    painel.querySelector(".baixar").onclick = function () {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([editor.getValue()], { type: "text/x-python" }));
      link.download = arquivo;
      link.click();
      setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
    };

    painel.querySelector(".restaurar").onclick = function () {
      if (!confirm("Apagar o seu código de " + arquivo + " e começar de novo?")) return;
      editor.setValue(inicial);
      clearTimeout(espera); // o setValue dispara o autosave; sem isso ele regravaria o texto inicial
      try {
        localStorage.removeItem(chave);
      } catch (e) { /* sem localStorage */ }
    };

    var espera = null;
    function salvar() {
      try {
        localStorage.setItem(chave, editor.getValue());
      } catch (e) { /* sem localStorage: o código fica só na tela */ }
    }
    editor.onDidChangeModelContent(function () {
      m.editor.setModelMarkers(editor.getModel(), "python", []);
      clearTimeout(espera);
      espera = setTimeout(salvar, 400);
    });
    // Ctrl+S salva (no lugar do "Salvar página" do navegador), como no VS Code.
    editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyS, salvar);

    rodando(false);
    editor.focus();
  }

  function iniciar() {
    document.querySelectorAll(".editor-python[data-arquivo]:not([data-montado])").forEach(function (caixa) {
      caixa.dataset.montado = "1";
      montar(caixa);
    });
  }

  // O Material avisa por document$ a cada página mostrada, inclusive com navigation.instant,
  // em que o site troca de página sem recarregar. Sem ele, basta o carregamento normal.
  if (window.document$) window.document$.subscribe(iniciar);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
