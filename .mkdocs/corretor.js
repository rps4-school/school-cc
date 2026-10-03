/*
 * Corretor automático das perguntas (só no site: no GitHub fica só o "Ver resposta").
 *
 * O visual.py coloca um <div class="corretor"> antes de cada <details> que traz
 * a resposta numa destas formas:
 *   **Resposta:** `101101`          → confere o valor (número, texto, código)
 *   **Expressão:** `A'B + C`        → aceita qualquer expressão equivalente
 *   **Expressão mínima:** `B + C`   → equivalente E sem literais a mais
 * Aqui o div vira um campo com o botão "Conferir". Nada vai para servidor nenhum.
 */
(function () {
  "use strict";

  var CHAVE = "school-cc:corretor:" + location.pathname;
  var CERTO = "text-emerald-700 dark:text-emerald-300";
  var ERRADO = "text-rose-700 dark:text-rose-300";
  var AVISO = "text-amber-700 dark:text-amber-300";

  // ---------- Valores: 101101, 0x2D, 11,75, "vlvwhpdv"... ----------

  function semAcento(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  // Tira o que não muda o valor: espaços, maiúsculas, acentos, "0x", "#", base em subscrito.
  function limpar(texto) {
    return semAcento(texto).toLowerCase()
      .replace(/[−–]/g, "-")        // sinal de menos tipográfico
      .replace(/[₀-₉]+/g, "")      // (1011)₂ → (1011)
      .replace(/^\((.*)\)$/, "$1")  // (1011) → 1011
      .replace(/0x/g, "")
      .replace(/[#\s_]/g, "");
  }

  // "00101101" → "101101", mas "0,101" continua "0,101".
  function semZerosAEsquerda(valor) {
    return valor.replace(/^0+(?=[0-9a-z])/, "");
  }

  function conferirValor(resposta, digitado) {
    var aluno = limpar(digitado);
    var tentativas = [aluno.replace(/\./g, ",")];
    // "16.777.216": ponto como separador de milhar.
    if (aluno.indexOf(".") >= 0) tentativas.push(aluno.replace(/\./g, ""));
    var opcoes = resposta.split(" | ").map(function (r) { return limpar(r).replace(/\./g, ","); });
    for (var i = 0; i < opcoes.length; i++) {
      var certa = opcoes[i];
      for (var j = 0; j < tentativas.length; j++) {
        var t = tentativas[j];
        if (t === certa) return { certo: true };
        // Resposta com zeros à esquerda (ex.: 8 bits) só aceita com a mesma quantidade de dígitos.
        if (semZerosAEsquerda(t) === semZerosAEsquerda(certa)) {
          if (/^0[0-9a-z]/.test(certa)) {
            return { certo: false, dica: "Quase! O valor está certo, mas escreva com " + certa.length + " dígitos (complete com zeros à esquerda)." };
          }
          return { certo: true };
        }
      }
    }
    return { certo: false };
  }

  // ---------- Expressões booleanas: A'B + C, !(A+B), A⊕B... ----------

  var NAO_PREFIXO = "!¬~";
  var NAO_SUFIXO = "'’´`";
  var OU = "+|∨";
  var E = "·*.&∧⋅×";
  var XOU = "⊕^";

  function analisar(texto) {
    // "X = A'B + C" → "A'B + C"
    texto = texto.replace(/^\s*[a-z]\w*\s*=(?!=)/i, "");
    var tokens = [];
    for (var i = 0; i < texto.length; i++) {
      var c = texto[i];
      if (/\s/.test(c)) continue;
      if (/[a-z]/i.test(c)) tokens.push({ tipo: "var", nome: c.toUpperCase() });
      else if (c === "0" || c === "1") tokens.push({ tipo: "const", valor: c === "1" });
      else if ("([{".indexOf(c) >= 0) tokens.push({ tipo: "(" });
      else if (")]}".indexOf(c) >= 0) tokens.push({ tipo: ")" });
      else if (NAO_PREFIXO.indexOf(c) >= 0) tokens.push({ tipo: "!" });
      else if (NAO_SUFIXO.indexOf(c) >= 0) tokens.push({ tipo: "'" });
      else if (OU.indexOf(c) >= 0) tokens.push({ tipo: "+" });
      else if (E.indexOf(c) >= 0) tokens.push({ tipo: "·" });
      else if (XOU.indexOf(c) >= 0) tokens.push({ tipo: "⊕" });
      else throw new Error("símbolo “" + c + "”");
    }
    var pos = 0;
    var variaveis = {};
    var literais = 0;

    function olhar() { return tokens[pos] && tokens[pos].tipo; }

    // Precedência, da mais fraca para a mais forte: OR, XOR, AND, NOT.
    function ou() {
      var a = xou();
      while (olhar() === "+") { pos++; a = juntar(a, xou(), function (x, y) { return x || y; }); }
      return a;
    }
    function xou() {
      var a = e();
      while (olhar() === "⊕") { pos++; a = juntar(a, e(), function (x, y) { return x !== y; }); }
      return a;
    }
    function e() {
      var a = nao();
      for (;;) {
        if (olhar() === "·") pos++;
        else if (!/^(var|const|\(|!)$/.test(olhar() || "")) break; // AB = A·B
        a = juntar(a, nao(), function (x, y) { return x && y; });
      }
      return a;
    }
    function nao() {
      if (olhar() === "!") { pos++; var dentro = nao(); return function (v) { return !dentro(v); }; }
      var a = primario();
      while (olhar() === "'") { pos++; a = inverter(a); }
      return a;
    }
    function primario() {
      var t = tokens[pos++];
      if (!t) throw new Error("expressão incompleta");
      if (t.tipo === "var") { variaveis[t.nome] = true; literais++; return function (v) { return v[t.nome]; }; }
      if (t.tipo === "const") return function () { return t.valor; };
      if (t.tipo === "(") {
        var a = ou();
        if (olhar() !== ")") throw new Error("falta fechar um parêntese");
        pos++;
        return a;
      }
      throw new Error("algo faltando antes de “" + (t.tipo === "·" ? "·" : t.tipo) + "”");
    }
    function juntar(a, b, op) { return function (v) { return op(a(v), b(v)); }; }
    function inverter(a) { return function (v) { return !a(v); }; }

    var funcao = ou();
    if (pos < tokens.length) throw new Error("sobrou algo no fim");
    return { valor: funcao, variaveis: Object.keys(variaveis), literais: literais };
  }

  function letras(n) {
    return n + (n === 1 ? " letra" : " letras");
  }

  function conferirExpressao(resposta, digitado, minima) {
    var certa = analisar(resposta);
    var aluno;
    try {
      aluno = analisar(digitado);
    } catch (e) {
      return {
        certo: false,
        dica: "Não entendi a expressão (" + e.message + "). Use letras para as variáveis, ' para NOT, + para OR, " +
          "· ou nada para AND (AB = A·B) e ⊕ ou ^ para XOR.",
      };
    }
    var nomes = certa.variaveis.concat(aluno.variaveis).filter(function (n, i, l) { return l.indexOf(n) === i; }).sort();
    for (var linha = 0; linha < 1 << nomes.length; linha++) {
      var v = {};
      nomes.forEach(function (n, i) { v[n] = !!(linha >> (nomes.length - 1 - i) & 1); });
      var esperado = certa.valor(v), obtido = aluno.valor(v);
      if (esperado !== obtido) {
        var entrada = nomes.map(function (n) { return n + "=" + (v[n] ? 1 : 0); }).join(", ");
        return {
          certo: false,
          dica: "Para " + entrada + ", a sua dá " + (obtido ? 1 : 0) + " e a certa dá " + (esperado ? 1 : 0) + ".",
        };
      }
    }
    if (minima && aluno.literais > certa.literais) {
      return {
        certo: false,
        aviso: true,
        dica: "Equivalente, mas dá para simplificar: a forma mínima tem " + letras(certa.literais) +
          " e a sua tem " + letras(aluno.literais) + ".",
      };
    }
    return { certo: true };
  }

  // ---------- Placar da página ----------

  function lerAcertos() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || {};
    } catch (e) {
      return {};
    }
  }

  function salvarAcerto(id, texto) {
    try {
      var acertos = lerAcertos();
      acertos[id] = texto;
      localStorage.setItem(CHAVE, JSON.stringify(acertos));
    } catch (e) { /* sem localStorage: o placar só não fica salvo */ }
  }

  function atualizarPlacar(total) {
    var feitos = 0;
    document.querySelectorAll(".corretor").forEach(function (c) { if (c.dataset.acertou) feitos++; });
    document.querySelectorAll(".corretor .placar").forEach(function (p) {
      p.textContent = feitos + " de " + total + " certas nesta página";
    });
  }

  // ---------- Montagem ----------

  var EXEMPLOS = { valor: "Sua resposta", expressao: "Ex.: A'B + C", minima: "Ex.: A'B + C" };

  function montar(caixa, indice, total, acertos) {
    var tipo = caixa.dataset.tipo;
    var resposta = caixa.dataset.resposta;
    var id = indice + ":" + resposta;
    caixa.className = "corretor not-prose my-3 rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-3 " +
      "dark:border-indigo-400/20 dark:bg-indigo-400/5";
    caixa.innerHTML =
      '<label class="flex flex-wrap items-center gap-2">' +
      '<span class="w-full text-[0.62rem] font-bold uppercase tracking-wider text-indigo-700 sm:w-auto ' +
      'dark:text-indigo-300">Sua resposta</span>' +
      '<input type="text" autocomplete="off" spellcheck="false" class="campo min-w-0 flex-1 rounded-lg border ' +
      "border-slate-300 bg-white px-3 py-1.5 font-mono text-[0.8rem] text-slate-900 dark:border-white/15 " +
      'dark:bg-slate-900 dark:text-slate-100">' +
      '<button type="button" class="conferir md-button md-button--primary">Conferir</button></label>' +
      '<div class="retorno mt-1 min-h-[1.2em] text-[0.72rem] font-semibold" aria-live="polite"></div>' +
      '<div class="placar text-[0.6rem] text-slate-500 dark:text-slate-400"></div>';
    var campo = caixa.querySelector(".campo");
    var retorno = caixa.querySelector(".retorno");
    var erros = 0;
    campo.placeholder = EXEMPLOS[tipo] || EXEMPLOS.valor;

    function mostrar(texto, cor) {
      retorno.className = "retorno mt-1 min-h-[1.2em] text-[0.72rem] font-semibold " + cor;
      retorno.textContent = texto;
    }

    function conferir() {
      var digitado = campo.value.trim();
      if (!digitado) return mostrar("Digite a sua resposta primeiro.", AVISO);
      var r = tipo === "valor" ? conferirValor(resposta, digitado) : conferirExpressao(resposta, digitado, tipo === "minima");
      if (r.certo) {
        mostrar("✅ Certo!", CERTO);
        caixa.dataset.acertou = "1";
        salvarAcerto(id, digitado);
        atualizarPlacar(total);
        return;
      }
      if (r.aviso) return mostrar("⚠️ " + r.dica, AVISO);
      erros++;
      var texto = "❌ Ainda não." + (r.dica ? " " + r.dica : "");
      if (erros >= 2) texto += " Abra “Ver resposta” logo abaixo para ver o passo a passo.";
      mostrar(texto, ERRADO);
    }

    caixa.querySelector(".conferir").onclick = conferir;
    campo.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); conferir(); }
    });

    if (acertos[id] !== undefined) {
      campo.value = acertos[id];
      caixa.dataset.acertou = "1";
      mostrar("✅ Você já acertou esta.", CERTO);
    }
  }

  function iniciar() {
    var caixas = document.querySelectorAll(".corretor[data-resposta]");
    if (!caixas.length) return;
    var acertos = lerAcertos();
    caixas.forEach(function (c, i) { montar(c, i, caixas.length, acertos); });
    atualizarPlacar(caixas.length);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
