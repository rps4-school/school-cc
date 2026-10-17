/*
 * Desenha o progresso (progresso.js) no HTML do build (data-* do _componentes.py) e monta "Meu progresso".
 * Só usa textContent e atributos: nada do navegador ou de arquivo importado vira HTML.
 */
(function () {
  "use strict";

  var P = window.SchoolCC && window.SchoolCC.progresso;
  if (!P) return;

  function todos(seletor, raiz) {
    return Array.prototype.slice.call((raiz || document).querySelectorAll(seletor));
  }

  function com(atributo, valor) {
    return "[" + atributo + '="' + CSS.escape(valor) + '"]';
  }

  // Total de perguntas, se a página aparece aqui com data-perguntas.
  function perguntas(chave) {
    var el = document.querySelector(com("data-pagina", chave) + "[data-perguntas]");
    return el ? +el.dataset.perguntas : 0;
  }

  function acertos(d, chave) {
    var p = d.paginas[chave];
    return p ? Object.keys(p.acertos || {}).length : 0;
  }

  function concluida(d, chave, n) {
    var p = d.paginas[chave];
    return !!p && (!!p.concluida || (n > 0 && acertos(d, chave) >= n));
  }

  function barra(el, pct) {
    var b = el.querySelector("[role=progressbar]");
    if (!b) return;
    b.setAttribute("aria-valuenow", pct);
    b.firstChild.style.width = pct + "%";
  }

  // Guarda o texto do build para poder voltar a ele.
  function texto(el, novo) {
    if (el.dataset.original === undefined) el.dataset.original = el.textContent;
    el.textContent = novo === null ? el.dataset.original : novo;
  }

  function desenhar() {
    var d = P.ler();

    // Páginas da trilha, botões de exercício e simulados.
    todos("[data-pagina]").forEach(function (el) {
      var chave = el.dataset.pagina, n = +el.dataset.perguntas || 0, feita = concluida(d, chave, n);
      el.toggleAttribute("data-concluida", feita);
      var sr = el.querySelector("[data-estado-texto]");
      if (sr) sr.textContent = feita ? " (concluída)" : "";
      var placar = el.hasAttribute("data-perguntas") && el.querySelector("[data-acertos]");
      if (!placar) return;
      var x = acertos(d, chave), certas = n && x ? x + " de " + n : "";
      if (el.classList.contains("simulado")) {
        certas = certas && certas + " certas";
        certas = feita ? "Feito" + (certas && " · " + certas) : certas;
      }
      placar.textContent = certas;
    });

    // Temas: % de páginas concluídas.
    todos("[data-progresso-tema]").forEach(function (el) {
      var paginas = (el.dataset.paginas || "").split(" ").filter(Boolean);
      var feitas = paginas.filter(function (c) { return concluida(d, c, perguntas(c)); }).length;
      var pct = paginas.length ? Math.round((100 * feitas) / paginas.length) : 0;
      barra(el, pct);
      var t = el.querySelector("[data-progresso-texto]");
      if (t) t.textContent = pct + "%" + (el.classList.contains("curso") ? " concluído" : "");
      el.toggleAttribute("data-com-progresso", feitas > 0);
    });

    // Botão do curso: a primeira etapa com algo por fazer.
    todos("a[data-proxima]").forEach(function (a) {
      if (!a.closest("[data-com-progresso]")) return texto(a, null);
      var etapa = todos("[data-unidade]").filter(function (li) {
        return !li.hasAttribute("data-concluida") ||
          todos("a[data-pagina]", li).some(function (x) { return !x.hasAttribute("data-concluida"); });
      })[0];
      texto(a, etapa ? "Continuar: " + etapa.dataset.titulo : "Revisar a trilha");
      if (etapa) a.href = etapa.querySelector(".etapa__titulo").href;
    });

    // "Continue de onde parou".
    todos("[data-continuar]").forEach(function (el) {
      var u = d.ultima;
      el.querySelector('[data-estado="vazio"]').hidden = !!u;
      el.querySelector('[data-estado="progresso"]').hidden = !u;
      if (!u) return;
      var tema = document.querySelector(com("data-progresso-tema", u.tema || "") + " .cartao-tema__titulo");
      el.querySelector("[data-continuar-titulo]").textContent = u.titulo || "";
      el.querySelector("[data-continuar-tema]").textContent = tema ? tema.textContent : "";
      el.querySelector("[data-continuar-link]").href = P.url(u.pagina);
    });

    meuProgresso(d);

    // "Marcar como concluída".
    todos("button[data-concluir]").forEach(function (b) {
      var feita = !!(d.paginas[b.dataset.concluir] || {}).concluida;
      b.setAttribute("aria-pressed", feita);
      texto(b.querySelector("[data-concluir-texto]"), feita ? b.dataset.feito : null);
    });
  }

  // ---------- Página "Meu progresso" ----------

  function dia(atras) {
    var d = new Date();
    d.setDate(d.getDate() - atras);
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  function criar(tag, texto, pai) {
    var el = document.createElement(tag);
    if (texto !== undefined) el.textContent = texto;
    if (pai) pai.appendChild(el);
    return el;
  }

  function link(chave, texto, pai) {
    var a = criar("a", texto, pai);
    a.href = P.url(chave);
    return a;
  }

  function meuProgresso(d) {
    var dias = document.querySelector("[data-dias]");
    if (!dias) return;
    var titulos = JSON.parse(document.querySelector("[data-titulos]").dataset.titulos);
    var chaves = Object.keys(d.paginas), estudou = {};
    document.querySelector("[data-sem-armazenamento]").hidden = P.disponivel;
    document.querySelector("[data-sequencia]").textContent = P.sequencia();
    document.querySelector("[data-total-concluidas]").textContent = chaves.filter(function (c) { return d.paginas[c].concluida; }).length;
    document.querySelector("[data-total-certas]").textContent = chaves.reduce(function (n, c) { return n + acertos(d, c); }, 0);

    // As últimas 8 semanas, até hoje.
    d.dias.forEach(function (x) { estudou[x] = true; });
    dias.textContent = "";
    for (var i = 55; i >= 0; i--) {
      var celula = criar("span", undefined, dias);
      celula.dataset.dia = dia(i);
      celula.title = celula.dataset.dia.split("-").reverse().join("/");
      celula.toggleAttribute("data-estudou", !!estudou[celula.dataset.dia]);
    }
    dias.setAttribute("aria-label", dias.querySelectorAll("[data-estudou]").length + " dias estudados nas últimas 8 semanas");

    todos("[data-proximo-passo]").forEach(function (p) {
      var bloco = p.closest("[data-paginas]");
      var proxima = bloco.dataset.paginas.split(" ").filter(function (c) { return c && !concluida(d, c, 0); })[0];
      p.textContent = proxima ? (bloco.hasAttribute("data-com-progresso") ? "Próximo: " : "Comece por: ") : "Trilha completa!";
      if (proxima) link(proxima, titulos[proxima] || proxima, p);
    });

    // Revisar: erradas e ainda não acertadas, por tema.
    var lista = document.querySelector("[data-revisar-lista]"), grupos = {};
    lista.textContent = "";
    chaves.forEach(function (c) {
      var erros = d.paginas[c].erros || {}, tema = c.split("/")[1] || "";
      Object.keys(erros).forEach(function (id) { (grupos[tema] = grupos[tema] || []).push([c, erros[id]]); });
    });
    Object.keys(grupos).forEach(function (tema) {
      var nome = document.querySelector(com("data-progresso-tema", tema) + " .progresso-tema__titulo");
      criar("h3", nome ? nome.textContent : tema, lista);
      var ul = criar("ul", undefined, lista);
      grupos[tema].forEach(function (par) {
        var li = criar("li", undefined, ul);
        link(par[0], String(par[1].rotulo || "Pergunta"), li).hash = encodeURIComponent(String(par[1].ancora || ""));
        criar("span", titulos[par[0]] || par[0], li);
      });
    });
    document.querySelector("[data-revisar-vazio]").hidden = !!lista.firstChild;
  }

  function mensagem(texto) {
    document.querySelector("[data-mensagem]").textContent = texto;
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button[data-concluir], [data-exportar], [data-importar], [data-apagar]");
    if (!b) return;
    if (b.hasAttribute("data-concluir")) return P.concluir(b.dataset.concluir, b.getAttribute("aria-pressed") !== "true");
    if (b.hasAttribute("data-importar")) return document.querySelector("[data-arquivo]").click();
    if (b.hasAttribute("data-apagar")) {
      if (!window.confirm("Apagar todo o progresso deste navegador? Não dá para desfazer.")) return;
      P.apagar();
      return mensagem("Progresso apagado.");
    }
    var a = document.createElement("a"); // fora da página: o navigation.instant não intercepta
    a.href = URL.createObjectURL(new Blob([P.exportar()], { type: "application/json" }));
    a.download = "school-cc-progresso-" + dia(0) + ".json";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    mensagem("Arquivo baixado. No outro navegador, abra esta página e clique em Importar.");
  });

  document.addEventListener("change", function (e) {
    if (!e.target.matches || !e.target.matches("[data-arquivo]") || !e.target.files[0]) return;
    var leitor = new FileReader();
    leitor.onload = function () {
      try {
        P.importar(leitor.result);
        mensagem("Progresso importado e juntado ao que já estava aqui.");
      } catch (erro) {
        mensagem(erro.message);
      }
    };
    leitor.readAsText(e.target.files[0]);
    e.target.value = "";
  });
  // A busca do hero é um <label>: Enter e espaço também abrem.
  document.addEventListener("keydown", function (e) {
    var l = (e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest(".heroi__busca");
    if (l) {
      e.preventDefault();
      l.click();
    }
  });
  document.addEventListener("school-cc:progresso", desenhar);
  window.addEventListener("storage", function (e) {
    if (e.key === "school-cc:progresso") desenhar();
  });

  function iniciar() {
    var visita = document.querySelector("[data-visita]:not([data-montado])");
    if (!visita) return desenhar();
    visita.dataset.montado = "1";
    P.visitou({ titulo: visita.dataset.titulo, tema: visita.dataset.tema }); // dispara o desenho
  }

  if (window.document$) window.document$.subscribe(iniciar);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
