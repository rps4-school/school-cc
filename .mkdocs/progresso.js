/*
 * Progresso do aluno, salvo só neste navegador (localStorage), sem conta. Funções puras testadas no
 * Node (progresso.test.js); na página, a API é window.SchoolCC.progresso e avisa pelo evento "school-cc:progresso".
 */
(function () {
  "use strict";

  var CHAVE = "school-cc:progresso";
  var CHAVE_ANTIGA = "school-cc:corretor:"; // + caminho da página: formato do corretor até out/2026
  var VERSAO = 1;
  var MAX_DIAS = 120;
  // Só letras, números, "-", "_", "." e "/": nada de "javascript:".
  var CAMINHO = /^[\w.\-\/]*$/;
  var DIA = /^\d{4}-\d{2}-\d{2}$/;

  function vazio() {
    return { versao: VERSAO, paginas: {}, dias: [], ultima: null };
  }

  function doisDigitos(n) {
    return (n < 10 ? "0" : "") + n;
  }

  // "AAAA-MM-DD" no relógio do aluno.
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

  // info: { valor } no acerto; { rotulo, ancora } no erro ("Revisar").
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

  // Importar: junta b em a sem apagar nada.
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

  // pares: [[chave, valor]] do localStorage; devolve as chaves antigas para apagar.
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

  // Raiz do site, uma vez só: com navigation.instant o #__config é sempre o da 1ª página.
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
