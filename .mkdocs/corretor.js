/*
 * Corretor automático das perguntas (só no site: no GitHub fica só o "Ver resposta").
 *
 * O visual.py coloca um <div class="corretor"> antes de cada <details> que traz
 * a resposta numa destas formas:
 *   **Resposta:** `101101`          → confere o valor (número, texto, código)
 *   **Expressão:** `A'B + C`        → aceita qualquer expressão equivalente
 *   **Expressão mínima:** `B + C`   → equivalente E sem literais a mais
 *   **Número:** `1/4`               → o mesmo valor (0,25, 2/8, √2/2...); aceita "± tolerância"
 *   **Função:** `6x`                → função equivalente (testada em vários pontos)
 *   **Primitiva:** `x^3/3 + C`      → igual a menos de uma constante, e com o "+ C"
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

  // ---------- Matemática: 1/4, √2/2, 3x^2 + 2, ln(x) + C... ----------

  var FUNCOES_MAT = {
    sqrt: Math.sqrt, raiz: Math.sqrt, cbrt: Math.cbrt, ln: Math.log, exp: Math.exp, abs: Math.abs,
    sen: Math.sin, sin: Math.sin, cos: Math.cos, tg: Math.tan, tan: Math.tan,
    log: function (x) { return Math.log10(x); },
  };
  var NOMES_FUNCOES = Object.keys(FUNCOES_MAT).sort(function (a, b) { return b.length - a.length; });
  var SOBRESCRITOS = { "²": "^2", "³": "^3", "⁴": "^4", "⁵": "^5", "⁻¹": "^(-1)", "½": "(1/2)" };

  function lerTokensMat(texto) {
    texto = texto.replace(/[−–]/g, "-").replace(/[×·⋅*]/g, "*").replace(/÷/g, "/")
      .replace(/infinito|inf/gi, "∞").replace(/π/g, "pi");
    Object.keys(SOBRESCRITOS).forEach(function (s) { texto = texto.split(s).join(SOBRESCRITOS[s]); });
    var tokens = [];
    var i = 0;
    while (i < texto.length) {
      var c = texto[i];
      if (/\s/.test(c)) { i++; continue; }
      var num = /^\d+(?:[.,]\d+)?|^[.,]\d+/.exec(texto.slice(i));
      if (num) {
        tokens.push({ tipo: "num", valor: parseFloat(num[0].replace(",", ".")) });
        i += num[0].length;
        continue;
      }
      if (/[a-z]/i.test(c)) {
        var resto = texto.slice(i).toLowerCase();
        var nome = NOMES_FUNCOES.find(function (n) { return resto.indexOf(n) === 0; });
        if (nome) {
          i += nome.length;
          // log com base: log_5(x), log5(x) ou log_{5}(x)
          var base = nome === "log" ? /^_?\{?(\d+(?:[.,]\d+)?)\}?/.exec(texto.slice(i)) : null;
          if (base) {
            var b = parseFloat(base[1].replace(",", "."));
            tokens.push({ tipo: "func", f: function (x) { return Math.log(x) / Math.log(b); } });
            i += base[0].length;
          } else {
            tokens.push({ tipo: "func", f: FUNCOES_MAT[nome] });
          }
          continue;
        }
        if (resto.indexOf("pi") === 0) { tokens.push({ tipo: "num", valor: Math.PI }); i += 2; continue; }
        if (c === "e") { tokens.push({ tipo: "num", valor: Math.E }); i++; continue; }
        tokens.push({ tipo: "var", nome: c });
        i++;
        continue;
      }
      if ("+-*/^()|√∛∞".indexOf(c) >= 0) { tokens.push({ tipo: c }); i++; continue; }
      if (c === "[" || c === "{") { tokens.push({ tipo: "(" }); i++; continue; }
      if (c === "]" || c === "}") { tokens.push({ tipo: ")" }); i++; continue; }
      throw new Error("símbolo “" + c + "”");
    }
    return tokens;
  }

  // Precedência: + − ; * / e multiplicação implícita ; sinal ; ^ (associa à direita).
  function analisarMat(texto) {
    var tokens = lerTokensMat(texto);
    var pos = 0;
    var dentroDeModulo = 0;
    var variaveis = {};

    function olhar() { return tokens[pos] && tokens[pos].tipo; }
    function comecaFator(t) {
      return t === "num" || t === "var" || t === "func" || t === "(" || t === "√" || t === "∛" || t === "∞" ||
        (t === "|" && !dentroDeModulo);
    }
    function soma() {
      var a = produto();
      while (olhar() === "+" || olhar() === "-") {
        var op = tokens[pos++].tipo, b = produto();
        a = op === "+" ? juntar(a, b, function (x, y) { return x + y; }) : juntar(a, b, function (x, y) { return x - y; });
      }
      return a;
    }
    function produto() {
      var a = sinal();
      for (;;) {
        var t = olhar();
        if (t === "*") { pos++; a = juntar(a, sinal(), function (x, y) { return x * y; }); }
        else if (t === "/") { pos++; a = juntar(a, sinal(), function (x, y) { return x / y; }); }
        else if (comecaFator(t)) a = juntar(a, potencia(), function (x, y) { return x * y; }); // 2x, x(x+1)
        else return a;
      }
    }
    function sinal() {
      if (olhar() === "-") { pos++; var a = sinal(); return function (v) { return -a(v); }; }
      if (olhar() === "+") { pos++; return sinal(); }
      return potencia();
    }
    function potencia() {
      var base = primario();
      if (olhar() === "^") { pos++; var exp = sinal(); return juntar(base, exp, potenciaReal); }
      return base;
    }
    function primario() {
      var t = tokens[pos++];
      if (!t) throw new Error("expressão incompleta");
      if (t.tipo === "num") return function () { return t.valor; };
      if (t.tipo === "∞") return function () { return Infinity; };
      if (t.tipo === "var") { variaveis[t.nome] = true; return function (v) { return v[t.nome]; }; }
      if (t.tipo === "(") {
        var a = soma();
        if (olhar() !== ")") throw new Error("falta fechar um parêntese");
        pos++;
        return a;
      }
      if (t.tipo === "|") {
        dentroDeModulo++;
        var m = soma();
        dentroDeModulo--;
        if (olhar() !== "|") throw new Error("falta fechar o módulo |");
        pos++;
        return function (v) { return Math.abs(m(v)); };
      }
      if (t.tipo === "√" || t.tipo === "∛") {
        var r = olhar() === "(" ? primario() : potencia();
        var f = t.tipo === "√" ? Math.sqrt : Math.cbrt;
        return function (v) { return f(r(v)); };
      }
      if (t.tipo === "func") {
        var arg = olhar() === "(" ? primario() : potencia(); // ln x, sen x, ln x^2 = ln(x^2)
        return function (v) { return t.f(arg(v)); };
      }
      throw new Error("algo faltando antes de “" + t.tipo + "”");
    }
    function juntar(a, b, op) { return function (v) { return op(a(v), b(v)); }; }

    var valor = soma();
    if (pos < tokens.length) throw new Error("sobrou algo no fim");
    return { valor: valor, variaveis: Object.keys(variaveis) };
  }

  // Potência que aceita base negativa com expoente fracionário de denominador ímpar: (−8)^(1/3) = −2.
  function potenciaReal(b, e) {
    var r = Math.pow(b, e);
    if (isNaN(r) && b < 0) {
      for (var q = 1; q <= 9; q += 2) {
        var p = e * q;
        if (Math.abs(p - Math.round(p)) < 1e-9) return Math.pow(-Math.pow(-b, 1 / q), Math.round(p));
      }
    }
    return r;
  }

  function perto(a, b, tol) {
    if (a === b) return true; // inclusive ∞ = ∞
    if (!isFinite(a) || !isFinite(b)) return false;
    return Math.abs(a - b) <= (tol !== undefined ? tol : 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)));
  }

  function numeroBonito(x) {
    if (!isFinite(x)) return x > 0 ? "∞" : "−∞";
    var r = Math.round(x * 1e4) / 1e4;
    return String(r).replace(".", ",").replace("-", "−");
  }

  function valorConstante(texto) {
    var a = analisarMat(texto);
    if (a.variaveis.length) throw new Error("tem variável");
    return a.valor({});
  }

  function conferirNumero(resposta, digitado) {
    var opcoes = resposta.split(" | ");
    var aluno = null;
    try { aluno = valorConstante(digitado.replace(/^[^=]*=(?!=)/, "")); } catch (e) { /* talvez seja texto */ }
    var casas = (/[.,](\d+)\s*$/.exec(digitado.trim()) || [, ""])[1].length;
    var quase = false;
    for (var i = 0; i < opcoes.length; i++) {
      var op = opcoes[i].split("±");
      var certa = null;
      try { certa = valorConstante(op[0]); } catch (e) { /* alternativa em texto */ }
      if (certa === null) {
        if (limpar(opcoes[i]) === limpar(digitado)) return { certo: true };
        continue;
      }
      if (aluno === null || isNaN(aluno)) continue;
      var tol = op[1] ? valorConstante(op[1]) : undefined;
      if (perto(aluno, certa, tol)) return { certo: true };
      // Decimal arredondado ou truncado com pelo menos 2 casas: 0,33 ou 0,3333 para 1/3.
      if (tol === undefined && casas >= 2 && isFinite(certa) && Math.abs(aluno - certa) <= Math.pow(10, -casas) + 1e-12) return { certo: true };
      if (isFinite(certa) && Math.abs(aluno - certa) <= 0.05 * Math.max(1, Math.abs(certa))) quase = true;
    }
    if (aluno === null) {
      return { certo: false, dica: "Não entendi o número. Use vírgula ou ponto (0,25), fração (1/4), √, π, e, ln ou ∞." };
    }
    return quase ? { certo: false, dica: "Perto! Confira as contas ou use mais casas decimais (ou a fração exata)." } : { certo: false };
  }

  // Pontos de teste: valores "quebrados" para não acertar por coincidência; os negativos testam o domínio.
  var PONTOS = [0.37, 1.23, 2.71, 0.81, 3.17, 1.59, 4.42, 0.53, 2.06, -0.63, -1.37, -2.18, 1.91, 3.83];

  function separarConstante(texto) {
    var sem = texto.replace(/\s*\+\s*[ck]\s*$/i, "").replace(/^\s*[ck]\s*\+\s*/i, "");
    return { texto: sem, temConstante: sem !== texto };
  }

  function conferirFuncao(resposta, digitado, primitiva) {
    var limpo = digitado.replace(/^[^=]*=(?!=)/, "");
    var temC = false;
    if (primitiva) {
      var s = separarConstante(limpo);
      limpo = s.texto;
      temC = s.temConstante;
    }
    resposta = resposta.replace(/^[^=]*=(?!=)/, "");
    var certa = analisarMat(primitiva ? separarConstante(resposta).texto : resposta);
    var aluno;
    try {
      aluno = analisarMat(limpo);
    } catch (e) {
      return {
        certo: false,
        dica: "Não entendi a expressão (" + e.message + "). Exemplos: 3x^2 + 2, (x+1)/(x-2), √x, x^(1/3), e^(2x), ln(x), sen(x)" +
          (primitiva ? ", e no fim + C." : "."),
      };
    }
    var nomes = certa.variaveis.concat(aluno.variaveis).filter(function (n, i, l) { return l.indexOf(n) === i; }).sort();
    var sobrando = aluno.variaveis.filter(function (n) { return certa.variaveis.indexOf(n) < 0; });
    if (sobrando.length) return { certo: false, dica: "A resposta não usa a letra “" + sobrando[0] + "”. Confira a variável." };
    var validos = 0, diferenca = null;
    for (var k = 0; k < PONTOS.length; k++) {
      var v = {};
      nomes.forEach(function (n, j) { v[n] = PONTOS[(k + 3 * j) % PONTOS.length]; });
      var esperado = certa.valor(v), obtido = aluno.valor(v);
      if (!isFinite(esperado) || !isFinite(obtido)) continue; // fora do domínio de uma das duas
      validos++;
      var d = obtido - esperado;
      if (primitiva) {
        if (diferenca === null) { diferenca = d; continue; }
        if (perto(d, diferenca, 1e-6 * Math.max(1, Math.abs(esperado)))) continue;
      } else if (perto(obtido, esperado)) continue;
      var ponto = nomes.map(function (n) { return n + " = " + numeroBonito(v[n]); }).join(", ");
      return {
        certo: false,
        dica: primitiva
          ? "Derive a sua resposta e compare com a função do enunciado: as duas não diferem só por uma constante."
          : "Para " + ponto + ", a sua dá " + numeroBonito(obtido) + " e a certa dá " + numeroBonito(esperado) + ".",
      };
    }
    if (validos < 5) return { certo: false, dica: "Não deu para testar a sua expressão (ela não existe nos pontos de teste). Confira o domínio." };
    if (primitiva && !temC) return { certo: false, aviso: true, dica: "Quase lá: falta a constante “+ C” no final." };
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

  var EXEMPLOS = {
    valor: "Sua resposta", expressao: "Ex.: A'B + C", minima: "Ex.: A'B + C",
    numero: "Ex.: 1/4 ou 0,25", funcao: "Ex.: 3x^2 + 2", primitiva: "Ex.: x^3/3 + C",
  };

  function conferirPorTipo(tipo, resposta, digitado) {
    if (tipo === "valor") return conferirValor(resposta, digitado);
    if (tipo === "numero") return conferirNumero(resposta, digitado);
    if (tipo === "funcao" || tipo === "primitiva") return conferirFuncao(resposta, digitado, tipo === "primitiva");
    return conferirExpressao(resposta, digitado, tipo === "minima");
  }

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
      var r = conferirPorTipo(tipo, resposta, digitado);
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

  // Nos testes (Node) não há página: só exporta as funções de conferência.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { conferirPorTipo: conferirPorTipo, analisarMat: analisarMat };
    return;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
