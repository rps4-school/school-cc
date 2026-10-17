/*
 * Diagramas ```mermaid (o GitHub também desenha). O Mermaid tem quase 1 MB: só é baixado (do jsDelivr,
 * versão fixa e com SRI) quando um diagrama chega perto da tela, para não atrasar a abertura da página.
 * Troca de tema claro/escuro desenha de novo. Sem internet, fica o texto do diagrama.
 */
(function () {
  "use strict";

  var MERMAID = "https://cdn.jsdelivr.net/npm/mermaid@11.12.1/dist/mermaid.min.js";
  // Ao trocar a versão, atualize o hash (openssl dgst -sha384 -binary arquivo | openssl base64 -A).
  var MERMAID_SRI = "sha384-LlKSgo4Eo5GuF/ZrstLti44dE+GC5XAJ7TSu0Nw9Q3vIZF2QMnkRcK7BUoLabYLF";

  var carregando = null;
  var numero = 0;
  var observador = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        observador.unobserve(e.target);
        desenhar(e.target);
      });
    }, { rootMargin: "600px 0px" })
    : null;

  function carregar() {
    if (!carregando) {
      carregando = new Promise(function (ok, falha) {
        var js = document.createElement("script");
        js.src = MERMAID;
        js.integrity = MERMAID_SRI;
        js.crossOrigin = "anonymous";
        js.onload = ok;
        js.onerror = falha;
        document.head.appendChild(js);
      });
    }
    return carregando;
  }

  function tema() {
    return document.body.getAttribute("data-md-color-scheme") === "slate" ? "dark" : "default";
  }

  function desenhar(caixa) {
    var agora = tema();
    carregar().then(function () {
      window.mermaid.initialize({ startOnLoad: false, theme: agora, securityLevel: "strict" });
      return window.mermaid.render("diagrama-" + ++numero, caixa.dataset.codigo);
    }).then(function (r) {
      caixa.innerHTML = r.svg; // SVG do Mermaid (securityLevel "strict"), feito do Markdown do repositório
      caixa.dataset.desenhado = agora;
    }, function () {
      caixa.dataset.falhou = "";
    });
  }

  function iniciar() {
    // O superfences gera <pre class="diagrama"><code>…</code></pre>; vira uma caixa com o código guardado.
    document.querySelectorAll("pre.diagrama").forEach(function (pre) {
      var caixa = document.createElement("div");
      caixa.className = "diagrama";
      caixa.dataset.codigo = pre.textContent;
      caixa.textContent = pre.textContent;
      pre.replaceWith(caixa);
      if (observador) observador.observe(caixa);
      else desenhar(caixa);
    });
  }

  // Tema claro/escuro trocado: desenha de novo os que já estavam desenhados.
  new MutationObserver(function () {
    document.querySelectorAll(".diagrama[data-desenhado]").forEach(function (caixa) {
      if (caixa.dataset.desenhado !== tema()) desenhar(caixa);
    });
  }).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });

  if (window.document$) window.document$.subscribe(iniciar);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
