/*
 * Fórmulas em LaTeX ($x^2$ e $$...$$), escritas igual ao GitHub.
 * O pymdownx.arithmatex marca cada fórmula com a classe "arithmatex"; aqui o KaTeX desenha.
 * O KaTeX só é baixado (do jsDelivr, versão fixa e com SRI) nas páginas que têm fórmula.
 */
(function () {
  "use strict";

  var BASE = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/";
  // Ao trocar a versão, atualize os dois hashes (openssl dgst -sha384 -binary arquivo | openssl base64 -A).
  var KATEX_JS_SRI = "sha384-cMkvdD8LoxVzGF/RPUKAcvmm49FQ0oxwDF3BGKtDXcEc+T1b2N+teh/OJfpU0jr6";
  var KATEX_CSS_SRI = "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP";

  var carregando = null;

  function carregarKatex() {
    if (window.katex) return Promise.resolve();
    if (carregando) return carregando;
    carregando = new Promise(function (ok, falha) {
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = BASE + "katex.min.css";
      css.integrity = KATEX_CSS_SRI;
      css.crossOrigin = "anonymous";
      document.head.appendChild(css);

      var js = document.createElement("script");
      js.src = BASE + "katex.min.js";
      js.integrity = KATEX_JS_SRI;
      js.crossOrigin = "anonymous";
      js.onload = ok;
      js.onerror = falha;
      document.head.appendChild(js);
    });
    return carregando;
  }

  function desenhar() {
    var formulas = document.querySelectorAll(".arithmatex:not([data-katex])");
    if (!formulas.length) return;
    carregarKatex().then(function () {
      formulas.forEach(function (el) {
        if (el.hasAttribute("data-katex")) return; // já desenhada por uma chamada anterior
        // O arithmatex entrega "\(...\)" (no meio do texto) ou "\[...\]" (em bloco).
        var tex = el.textContent.trim().replace(/^\\[([]/, "").replace(/\\[)\]]$/, "");
        el.setAttribute("data-katex", "");
        window.katex.render(tex, el, { displayMode: el.tagName === "DIV", throwOnError: false });
      });
    }, function () {
      // Sem internet: a fórmula continua legível em LaTeX.
    });
  }

  if (window.document$ && window.document$.subscribe) window.document$.subscribe(desenhar);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", desenhar);
  else desenhar();
})();
