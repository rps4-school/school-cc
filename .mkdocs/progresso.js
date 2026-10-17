/*
 * Progresso do aluno, salvo só neste navegador (localStorage), sem conta. Funções puras testadas no
 * Node (progresso.test.js); na página, a API é window.SchoolCC.progresso e avisa pelo evento "school-cc:progresso".
 */
(function () {
  "use strict";

  var CHAVE = "school-cc:progresso";
  var CHAVE_RECUPERAR = CHAVE + ":recuperar"; // dado salvo que não deu para ler: guardado, nunca apagado
  var CHAVE_ANTIGA = "school-cc:corretor:"; // + caminho da página: formato do corretor até out/2026
  var VERSAO = 1;
  var MAX_DIAS = 120;
  // Caminho de página do site: pastas "abc-1/" (a home é ""). Nada de "//", "..", "__proto__" ou "javascript:".
  var CAMINHO = /^(?:[A-Za-z0-9][\w-]*\/)*$/;
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

  function texto(x) {
    return typeof x === "string";
  }

  function todos(obj, ok) {
    return objeto(obj) && Object.keys(obj).every(function (k) { return ok(obj[k]); });
  }

  // Confere cada campo: o dado vem do localStorage ou de um arquivo importado.
  function valido(d) {
    if (!objeto(d) || d.versao !== VERSAO || !objeto(d.paginas) || !Array.isArray(d.dias)) return false;
    if (!d.dias.every(function (x) { return texto(x) && DIA.test(x); })) return false;
    var u = d.ultima;
    if (u != null && !(objeto(u) && texto(u.pagina) && CAMINHO.test(u.pagina) &&
        [u.titulo, u.tema, u.quando].every(function (x) { return x === undefined || texto(x); }))) return false;
    return Object.keys(d.paginas).every(function (k) {
      var p = d.paginas[k];
      return CAMINHO.test(k) && objeto(p) &&
        (p.concluida === undefined || p.concluida === false || (texto(p.concluida) && DIA.test(p.concluida))) &&
        (p.acertos === undefined || todos(p.acertos, texto)) &&
        (p.erros === undefined || todos(p.erros, function (e) { return objeto(e) && texto(e.rotulo) && texto(e.ancora); }));
    });
  }

  // Só caminhos válidos são gravados; outro caminho recebe um objeto descartável.
  function pagina(d, caminho) {
    if (!CAMINHO.test(caminho)) return { acertos: {}, erros: {} };
    var p = Object.prototype.hasOwnProperty.call(d.paginas, caminho) ? d.paginas[caminho] : (d.paginas[caminho] = {});
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

  // Desmarcar grava false: "não concluída" por decisão do aluno (o corretor não marca de novo sozinho).
  function concluir(d, caminho, sim, hoje) {
    var p = pagina(d, caminho);
    if (!sim) p.concluida = false;
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
    if (CAMINHO.test(ultima.pagina)) d.ultima = ultima;
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
      // Uma data ganha de false (recusa); entre duas datas, fica a mais antiga.
      if (de.concluida && (!para.concluida || de.concluida < para.concluida)) para.concluida = de.concluida;
      else if (de.concluida === false && para.concluida === undefined) para.concluida = false;
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

  // Endereço de uma página, só se ficar dentro do site; senão, a raiz.
  function endereco(caminho, raiz) {
    var u = new URL(caminho, raiz), r = new URL(raiz);
    return u.origin === r.origin && u.pathname.indexOf(r.pathname) === 0 ? u.href : r.href;
  }

  function copia(d) {
    return JSON.parse(JSON.stringify(d));
  }

  // O localStorage (ou nenhum). Se não der para gravar (bloqueado, cheio, ou dado de uma versão mais
  // nova do site), o progresso fica só na memória e disponivel() avisa. Nada salvo é apagado sem cópia.
  function armazem(storage) {
    var memoria = vazio(), soMemoria = !storage;
    try {
      storage.setItem(CHAVE + ":teste", "1");
      storage.removeItem(CHAVE + ":teste");
    } catch (e) {
      soMemoria = true;
    }
    if (!soMemoria) {
      var bruto = storage.getItem(CHAVE), d = null;
      try {
        d = JSON.parse(bruto);
      } catch (e) { /* inválido: vai para a chave de recuperação */ }
      if (valido(d)) memoria = d;
      else if (objeto(d) && typeof d.versao === "number" && d.versao > VERSAO) soMemoria = true;
      else if (bruto !== null && storage.getItem(CHAVE_RECUPERAR) === null) {
        try {
          storage.setItem(CHAVE_RECUPERAR, bruto);
        } catch (e) {
          soMemoria = true;
        }
      }
    }

    function carregar() {
      if (!soMemoria) {
        try {
          var d = JSON.parse(storage.getItem(CHAVE));
          if (valido(d)) memoria = d; // outra aba pode ter mudado
        } catch (e) { /* fica a memória */ }
      }
      return copia(memoria);
    }

    function salvar(d) {
      memoria = copia(d);
      if (soMemoria) return false;
      try {
        storage.setItem(CHAVE, JSON.stringify(d));
        return true;
      } catch (e) {
        soMemoria = true; // cheio
        return false;
      }
    }

    return {
      disponivel: function () { return !soMemoria; },
      carregar: carregar,
      salvar: salvar,
      // Converte as chaves antigas do corretor; só apaga se conseguiu salvar.
      migrar: function (raiz) {
        if (soMemoria) return;
        var pares = [];
        for (var i = 0; i < storage.length; i++) {
          var k = storage.key(i);
          if (k && k.indexOf(CHAVE_ANTIGA) === 0) pares.push([k, storage.getItem(k)]);
        }
        if (!pares.length) return;
        var d = carregar(), apagar = migrar(d, pares, raiz);
        if (salvar(d)) apagar.forEach(function (k) { storage.removeItem(k); });
      },
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      vazio: vazio, dia: dia, valido: valido, conferiu: conferiu, concluir: concluir, recomecar: recomecar,
      visitou: visitou, sequencia: sequencia, juntar: juntar, lerArquivo: lerArquivo, migrar: migrar,
      endereco: endereco, armazem: armazem, CHAVE_ANTIGA: CHAVE_ANTIGA,
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

  var armazenamento = null;
  try {
    armazenamento = window.localStorage;
  } catch (e) { /* bloqueado: só memória */ }
  var A = armazem(armazenamento);

  // Devolve se conseguiu salvar no navegador.
  function mudar(fn) {
    var d = A.carregar();
    fn(d);
    var salvo = A.salvar(d);
    document.dispatchEvent(new CustomEvent("school-cc:progresso"));
    return salvo;
  }

  function caminho(url) {
    var p = new URL(url || location.href, location.href).pathname.replace(/index\.html$/, "");
    return p.indexOf(raiz.pathname) === 0 ? p.slice(raiz.pathname.length) : p.replace(/^\//, "");
  }

  A.migrar(raiz.pathname);

  window.SchoolCC = window.SchoolCC || {};
  window.SchoolCC.progresso = {
    disponivel: A.disponivel,
    url: function (c) { return endereco(c, raiz.href); },
    ler: A.carregar,
    // concluida: a data, false (desmarcada pelo aluno) ou null (nunca decidido).
    pagina: function (c) {
      var d = A.carregar(), k = c || caminho();
      var p = Object.prototype.hasOwnProperty.call(d.paginas, k) ? d.paginas[k] : {};
      return { concluida: p.concluida === undefined ? null : p.concluida, acertos: p.acertos || {}, erros: p.erros || {} };
    },
    conferiu: function (id, certo, info) { mudar(function (d) { conferiu(d, caminho(), id, certo, info, dia()); }); },
    concluir: function (c, sim) { mudar(function (d) { concluir(d, c || caminho(), sim, dia()); }); },
    recomecar: function (c) { mudar(function (d) { recomecar(d, c || caminho()); }); },
    visitou: function (info) {
      mudar(function (d) {
        visitou(d, { pagina: caminho(), titulo: info.titulo, tema: info.tema, quando: new Date().toISOString() });
      });
    },
    sequencia: function () { return sequencia(A.carregar().dias, dia()); },
    exportar: function () { return JSON.stringify(A.carregar(), null, 2); },
    // Devolve se conseguiu salvar no navegador (senão, vale só nesta aba).
    importar: function (texto) {
      var b = lerArquivo(texto);
      return mudar(function (d) {
        var r = juntar(d, b);
        d.paginas = r.paginas;
        d.dias = r.dias;
        d.ultima = r.ultima;
      });
    },
    apagar: function () {
      return mudar(function (d) {
        d.paginas = {};
        d.dias = [];
        d.ultima = null;
      });
    },
  };
})();
