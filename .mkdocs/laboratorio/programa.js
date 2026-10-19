// O programa do Arduino no laboratório: as abas Código e Serial e o worker que roda o firmware.
//
// O site não compila C++. Ele roda o .hex que o arduino-cli gerou na CI para cada sketch do projeto
// (o principal e as variantes). Executar usa o firmware do sketch cujo texto é igual ao do editor;
// com o texto editado, o laboratório avisa e não finge que rodou. O ponto para ligar um compilador
// de verdade no futuro é compilar() (ver o spec, seção 8).

import { esc } from "./desenhos.js";

const API_ARDUINO = [
  ["pinMode", "pinMode(${1:pino}, ${2|OUTPUT,INPUT,INPUT_PULLUP|});", "Configura o pino como saída ou entrada"],
  ["digitalWrite", "digitalWrite(${1:pino}, ${2|HIGH,LOW|});", "Põe 5 V (HIGH) ou 0 V (LOW) no pino"],
  ["digitalRead", "digitalRead(${1:pino})", "Lê HIGH ou LOW num pino de entrada"],
  ["analogRead", "analogRead(${1:A0})", "Lê de 0 a 1023 (0 a 5 V)"],
  ["analogWrite", "analogWrite(${1:pino}, ${2:0});", "PWM de 0 a 255 nos pinos com ~"],
  ["delay", "delay(${1:1000});", "Espera, em milissegundos"],
  ["millis", "millis()", "Milissegundos desde que a placa ligou (unsigned long)"],
  ["Serial.begin", "Serial.begin(${1:9600});", "Abre a serial"],
  ["Serial.print", "Serial.print(${1});", "Escreve na mesma linha"],
  ["Serial.println", "Serial.println(${1});", "Escreve e pula a linha"],
  ["Serial.available", "Serial.available()", "Quantos bytes chegaram"],
  ["Serial.read", "Serial.read()", "Lê um byte que chegou"],
];
const CONSTANTES = ["HIGH", "LOW", "INPUT", "OUTPUT", "INPUT_PULLUP", "LED_BUILTIN", "A0", "A1", "A2", "A3", "A4", "A5"];

// O avr8js dá a taxa real do hardware (9600 vira 9615,4 baud a 16 MHz, como no Uno de verdade): mostramos a
// taxa padrão mais perto, que é a que o programa pediu no Serial.begin.
const BAUDS = [300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 31250, 38400, 57600, 74880, 115200, 230400, 250000, 500000, 1000000, 2000000];

export function baudPadrao(real) {
  if (!real) return 0;
  const perto = BAUDS.reduce((a, b) => (Math.abs(b - real) < Math.abs(a - real) ? b : a));
  return Math.abs(perto - real) / perto < 0.035 ? perto : Math.round(real);
}

export function normalizarCodigo(texto) {
  return String(texto).replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
}

let completarRegistrado = false;

function registrarCompletar(m) {
  if (completarRegistrado) return;
  completarRegistrado = true;
  m.languages.registerCompletionItemProvider("cpp", {
    provideCompletionItems(modelo, posicao) {
      const palavra = modelo.getWordUntilPosition(posicao);
      const faixa = { startLineNumber: posicao.lineNumber, endLineNumber: posicao.lineNumber, startColumn: palavra.startColumn, endColumn: palavra.endColumn };
      const regra = m.languages.CompletionItemInsertTextRule.InsertAsSnippet;
      return {
        suggestions: API_ARDUINO.map(([rotulo, texto, detalhe]) => ({ label: rotulo, kind: m.languages.CompletionItemKind.Function, insertText: texto, insertTextRules: regra, detail: detalhe, range: faixa }))
          .concat(CONSTANTES.map((c) => ({ label: c, kind: m.languages.CompletionItemKind.Constant, insertText: c, range: faixa }))),
      };
    },
  });
}

export function criarPrograma(ctx) {
  let programas = []; // { arquivo, rotulo, fonte, hex, relatorio }
  let principal = null; // arquivo do sketch do projeto (os outros são variantes)
  let escolhido = 0;
  let worker = null;
  let estadoDoWorker = "vazio"; // vazio | pronto | rodando | parado
  let carregado = null; // arquivo carregado no worker
  let editor = null;
  let pedidoDoEditor = null;
  let serialTexto = "";

  const codigo = document.createElement("div");
  codigo.className = "lab-codigo";
  const serial = document.createElement("div");
  serial.className = "lab-serial-painel";
  serial.innerHTML =
    '<p class="lab-nota" data-baud>A serial aparece aqui quando o programa rodar.</p>' +
    '<pre class="lab-serial" role="log" aria-label="Monitor serial" tabindex="0"></pre>' +
    '<form class="lab-enviar" data-enviar><label class="lab-campo">Mandar para o Arduino <input type="text" autocomplete="off" spellcheck="false" maxlength="200"></label>' +
    '<div class="lab-acoes"><button type="submit" class="lab-btn">Enviar (com nova linha)</button><button type="button" class="lab-btn" data-limpar>Limpar o monitor</button></div></form>';
  const saida = serial.querySelector(".lab-serial");

  serial.querySelector("[data-enviar]").addEventListener("submit", (e) => {
    e.preventDefault();
    const campo = serial.querySelector("input");
    if (!worker || estadoDoWorker === "vazio") return ctx.avisar("Execute o programa antes de mandar texto pela serial.");
    worker.postMessage({ tipo: "serial", texto: `${campo.value}\n` });
    ctx.avisar(`Enviado pela serial: ${campo.value}`);
    campo.value = "";
  });
  serial.querySelector("[data-limpar]").addEventListener("click", () => {
    serialTexto = "";
    saida.textContent = "";
  });

  function escreverSerial(texto) {
    serialTexto = (serialTexto + texto).slice(-20000);
    saida.textContent = serialTexto;
    saida.scrollTop = saida.scrollHeight;
  }

  // ---------- Código ----------

  function desenharCodigo() {
    if (!ctx.temUno()) {
      codigo.innerHTML = '<p class="lab-nota">Este circuito não tem Arduino. Para rodar um programa, abra um dos projetos de Arduino do laboratório (o Blink, por exemplo).</p>';
      return;
    }
    if (!programas.length) {
      codigo.innerHTML = '<p class="lab-nota">Este circuito não tem programa. Abra um projeto de Arduino do laboratório (o Blink, por exemplo) para rodar o código compilado dele. Sem programa, os pinos da placa ficam soltos.</p>';
      return;
    }
    codigo.innerHTML =
      `<label class="lab-campo">Programa <select data-programa>${programas.map((p, i) => `<option value="${i}"${i === escolhido ? " selected" : ""}>${esc(p.rotulo)}</option>`).join("")}</select></label>` +
      '<p class="lab-nota" data-status-codigo aria-live="polite"></p>' +
      '<div class="lab-editor" data-editor></div>' +
      '<div class="lab-acoes"><button type="button" class="lab-btn" data-restaurar>Restaurar o código</button><button type="button" class="lab-btn" data-baixar>Baixar .ino</button></div>' +
      '<details class="lab-compilacao"><summary>Como este programa foi compilado</summary><pre data-relatorio></pre></details>';
    codigo.querySelector("[data-programa]").addEventListener("change", (e) => escolher(Number(e.target.value)));
    codigo.querySelector("[data-restaurar]").addEventListener("click", () => {
      definirTexto(programas[escolhido].fonte);
      ctx.avisar(`Código de ${programas[escolhido].arquivo} restaurado.`);
    });
    codigo.querySelector("[data-baixar]").addEventListener("click", () => {
      const p = programas[escolhido];
      ctx.baixar(p.arquivo, editor ? editor.getValue() : p.fonte, "text/plain");
    });
    mostrarRelatorio();
    atualizarStatus();
  }

  function mostrarRelatorio() {
    const p = programas[escolhido];
    const alvo = codigo.querySelector("[data-relatorio]");
    if (!alvo || !p) return;
    alvo.textContent = p.relatorio
      ? `${p.relatorio.relatorio.join("\n")}\n\nCompilado no build do site com arduino-cli ${p.relatorio.arduinoCli} e o core arduino:avr ${p.relatorio.coreAvr}, para a placa ${p.relatorio.placa}.${(p.relatorio.bibliotecas || []).length ? ` Bibliotecas: ${p.relatorio.bibliotecas.join(", ")}.` : ""}`
      : "O firmware deste programa não foi compilado neste build do site.";
  }

  // O Monaco (do CDN) só carrega quando o aluno abre a aba Código.
  function montarEditor() {
    const caixa = codigo.querySelector("[data-editor]");
    const p = programas[escolhido];
    if (!caixa || !p || editor || pedidoDoEditor) return;
    const carregar = window.SchoolCC && window.SchoolCC.carregarMonaco;
    if (!carregar) {
      caixa.innerHTML = `<pre class="lab-codigo-texto">${esc(p.fonte)}</pre>`;
      atualizarStatus();
      return;
    }
    caixa.innerHTML = '<p class="lab-nota">Carregando o editor…</p>';
    const pedido = (pedidoDoEditor = carregar());
    pedido.then((m) => {
      if (pedido !== pedidoDoEditor) return;
      registrarCompletar(m);
      caixa.innerHTML = "";
      if (editor) editor.dispose();
      editor = m.editor.create(caixa, {
        value: p.fonte,
        language: "cpp",
        theme: document.body.getAttribute("data-md-color-scheme") === "slate" ? "vs-dark" : "vs",
        automaticLayout: true,
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fixedOverflowWidgets: true,
        tabSize: 2,
      });
      editor.onDidChangeModelContent(atualizarStatus);
      atualizarStatus();
    }, () => {
      pedidoDoEditor = null;
      caixa.innerHTML = `<p class="lab-nota">Não deu para carregar o editor (confira a internet). O código do programa:</p><pre class="lab-codigo-texto">${esc(p.fonte)}</pre>`;
      atualizarStatus();
    });
  }

  function definirTexto(texto) {
    if (editor) editor.setValue(texto);
    atualizarStatus();
  }

  // O texto do editor bate com algum sketch compilado? Devolve o índice, ou -1.
  function compilar(texto) {
    const alvo = normalizarCodigo(texto);
    const i = programas.findIndex((p) => normalizarCodigo(p.fonte) === alvo);
    return i;
  }

  function textoAtual() {
    return editor ? editor.getValue() : programas[escolhido] ? programas[escolhido].fonte : "";
  }

  function atualizarStatus() {
    const status = codigo.querySelector("[data-status-codigo]");
    if (!status) return;
    const i = compilar(textoAtual());
    if (i < 0) {
      status.className = "lab-nota lab-nota-aviso";
      status.textContent = "⚠️ Este site não compila código editado. Para rodar a sua versão, baixe o .ino e use a IDE do Arduino (ou o Wokwi). Para voltar a um programa que roda aqui, use Restaurar ou escolha outro programa.";
    } else if (!programas[i].hex) {
      status.className = "lab-nota lab-nota-aviso";
      status.textContent = "⚠️ O firmware deste programa não foi compilado neste build do site, então ele não roda aqui.";
    } else {
      status.className = "lab-nota";
      status.textContent = `✓ ${programas[i].arquivo}: compilado no build do site. Clique em Executar.`;
    }
  }

  function escolher(i) {
    escolhido = i;
    if (estadoDoWorker !== "vazio" && carregado !== programas[i].arquivo) descarregar();
    definirTexto(programas[i].fonte);
    mostrarRelatorio();
    ctx.avisar(`Programa: ${programas[i].rotulo}.`);
  }

  // ---------- Worker ----------

  function garantirWorker() {
    if (worker) return worker;
    worker = new Worker(new URL("./simulacao-worker.js", import.meta.url), { type: "module" });
    worker.onmessage = (e) => {
      const m = e.data;
      if (m.tipo === "quadro") {
        if (m.serial) escreverSerial(m.serial);
        const baud = serial.querySelector("[data-baud]");
        baud.textContent = m.baud ? `Monitor serial a ${baudPadrao(m.baud)} baud (o mesmo do Serial.begin).` : "O programa ainda não chamou Serial.begin.";
        ctx.aoQuadro(m);
      } else if (m.tipo === "erro") {
        estadoDoWorker = "parado";
        ctx.avisar(m.mensagem);
        ctx.aoMudarExecucao();
      }
    };
    worker.onerror = () => {
      ctx.avisar("O simulador do Arduino parou com um erro. Use Reiniciar.");
      encerrar();
    };
    return worker;
  }

  function descarregar() {
    if (worker) worker.terminate();
    worker = null;
    estadoDoWorker = "vazio";
    carregado = null;
    ctx.aoMudarExecucao();
  }

  function executar() {
    if (!ctx.temUno()) return ctx.avisar("Este circuito não tem Arduino para rodar um programa.");
    if (!programas.length) return ctx.avisar("Este circuito não tem programa. Abra um projeto de Arduino do laboratório.");
    if (estadoDoWorker === "rodando") return;
    const i = compilar(textoAtual());
    if (i < 0) {
      ctx.mostrarAba("codigo");
      return ctx.avisar("Este site não compila código editado. Restaure o código ou escolha um dos programas do projeto.");
    }
    const p = programas[i];
    if (!p.hex) return ctx.avisar("O firmware deste programa não foi compilado neste build do site.");
    const w = garantirWorker();
    if (estadoDoWorker === "vazio" || carregado !== p.arquivo) {
      w.postMessage({ tipo: "carregar", projeto: ctx.projeto(), hex: p.hex });
      carregado = p.arquivo;
      serialTexto = "";
      saida.textContent = "";
    }
    w.postMessage({ tipo: "executar" });
    estadoDoWorker = "rodando";
    ctx.avisar(`Rodando ${p.arquivo}.`);
    ctx.aoMudarExecucao();
  }

  function parar() {
    if (!worker || estadoDoWorker !== "rodando") return;
    worker.postMessage({ tipo: "parar" });
    estadoDoWorker = "parado";
    ctx.avisar("Programa parado. Executar continua de onde parou; Reiniciar começa do zero.");
    ctx.aoMudarExecucao();
  }

  function reiniciar() {
    if (!worker || estadoDoWorker === "vazio") return executar();
    worker.postMessage({ tipo: "reiniciar" });
    serialTexto = "";
    saida.textContent = "";
    ctx.avisar("Reiniciado: o programa recomeçou do setup().");
  }

  function encerrar() {
    descarregar();
  }

  return {
    elementoCodigo: codigo,
    elementoSerial: serial,
    // Busca o sketch do projeto, as variantes e o firmware de cada um (ao lado do circuito.json).
    async carregar(projeto, base) {
      descarregar();
      programas = [];
      escolhido = 0;
      if (editor) editor.dispose();
      editor = null;
      pedidoDoEditor = null;
      principal = projeto.sketch || null;
      if (projeto.sketch && base) {
        const lista = [{ arquivo: projeto.sketch, rotulo: `Código do projeto (${projeto.sketch})` }]
          .concat((projeto.variantes || []).map((v) => ({ arquivo: v.arquivo, rotulo: v.rotulo || v.arquivo })));
        programas = (await Promise.all(lista.map(async (p) => {
          const url = (nome) => new URL(nome, base).href;
          const texto = async (nome) => {
            try {
              const r = await fetch(url(nome), { cache: "no-cache" });
              return r.ok ? r.text() : null;
            } catch (e) {
              return null;
            }
          };
          const fonte = await texto(p.arquivo);
          if (fonte === null) return null;
          const hex = await texto(p.arquivo.replace(/\.ino$/, ".hex"));
          const relatorio = await texto(p.arquivo.replace(/\.ino$/, ".compilacao.json"));
          let info = null;
          try {
            info = relatorio ? JSON.parse(relatorio) : null;
          } catch (e) { /* relatório ilegível: segue sem ele */ }
          return { ...p, fonte, hex: hex && hex.startsWith(":") ? hex : null, relatorio: info };
        }))).filter(Boolean);
      }
      desenharCodigo();
      ctx.aoMudarExecucao();
      return programas.length;
    },
    desenharCodigo,
    aoMostrarAba(aba) {
      if (aba === "codigo") montarEditor();
    },
    temPrograma: () => programas.length > 0,
    // Firmware do sketch do projeto (não o da variante escolhida): é com ele que os desafios conferem.
    hexPrincipal() {
      const p = programas.find((x) => x.arquivo === principal);
      return p ? p.hex : null;
    },
    get estado() {
      return estadoDoWorker;
    },
    executar,
    parar,
    reiniciar,
    encerrar,
    projetoMudou(projeto) {
      if (worker && estadoDoWorker !== "vazio") worker.postMessage({ tipo: "projeto", projeto });
    },
  };
}
