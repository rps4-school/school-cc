/*
 * Mostra o progresso do aluno (progresso.js) no HTML que o build gerou (data-* do _componentes.py):
 * barras dos temas, "Continue de onde parou", trilha, botões de exercício e "Marcar como concluída".
 * Só escreve com textContent e atributos: nada que venha do navegador ou de arquivo importado vira HTML.
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

  // Total de perguntas de uma página, se ela aparece aqui com data-perguntas (trilha, simulados).
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

  // Guarda o texto do build na primeira vez, para poder voltar a ele.
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

    // Temas: % de páginas concluídas (home, Conteúdo e cabeçalho do tema).
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

    // "Marcar como concluída".
    todos("button[data-concluir]").forEach(function (b) {
      var feita = !!(d.paginas[b.dataset.concluir] || {}).concluida;
      b.setAttribute("aria-pressed", feita);
      texto(b.querySelector("[data-concluir-texto]"), feita ? b.dataset.feito : null);
    });
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button[data-concluir]");
    if (b) P.concluir(b.dataset.concluir, b.getAttribute("aria-pressed") !== "true");
  });
  // O campo de busca do hero é um <label>: Enter e espaço também abrem a busca.
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
