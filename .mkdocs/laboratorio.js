/*
 * Laboratório Arduino (só no site: no GitHub, o <div> fica vazio).
 *
 * Uma página com <div class="laboratorio" data-projeto="circuito.json"></div> (ou
 * data-exemplos="exemplos.json") ganha aqui o cartão "Abrir no laboratório". Este arquivo é
 * pequeno e vai em todas as páginas; o laboratório de verdade (os módulos de laboratorio/) só é
 * baixado no clique.
 */
(function () {
  "use strict";

  var BASE = new URL("laboratorio/", document.currentScript.src).href;
  var modulo = null;

  function carregar() {
    if (!modulo) {
      modulo = import(BASE + "app.js");
      modulo.catch(function () {
        modulo = null; // deixa tentar de novo
      });
    }
    return modulo;
  }

  function montar(caixa) {
    var projeto = caixa.dataset.projeto;
    var exemplos = caixa.dataset.exemplos;
    caixa.className = "laboratorio lab-cartao";
    caixa.innerHTML =
      '<div class="lab-cartao-texto"><div class="lab-cartao-rotulo">Laboratório Arduino</div>' +
      '<div class="lab-cartao-titulo"></div><p></p></div>' +
      '<button type="button" class="md-button md-button--primary">Abrir no laboratório</button>' +
      '<p class="lab-cartao-falha" hidden></p>';
    caixa.querySelector(".lab-cartao-titulo").textContent =
      caixa.dataset.titulo || (projeto ? "Monte e meça este circuito" : "Monte o seu circuito");
    caixa.querySelector(".lab-cartao-texto p").textContent = caixa.dataset.descricao ||
      "Protoboard, fios, LEDs, resistores e multímetro, direto no navegador. O que você montar fica salvo neste navegador.";
    var botao = caixa.querySelector("button");
    botao.onclick = function () {
      var texto = botao.textContent;
      botao.disabled = true;
      botao.textContent = "Carregando…";
      carregar().then(function (m) {
        botao.disabled = false;
        botao.textContent = texto;
        m.abrir({
          projetoUrl: projeto ? new URL(projeto, location.href).href : null,
          exemplosUrl: exemplos ? new URL(exemplos, location.href).href : null,
          retorno: botao,
        });
      }, function () {
        botao.disabled = false;
        botao.textContent = "Tentar de novo";
        var falha = caixa.querySelector(".lab-cartao-falha");
        falha.hidden = false;
        falha.textContent = "Não deu para carregar o laboratório. Confira a internet e tente de novo.";
      });
    };
  }

  function iniciar() {
    document.querySelectorAll(".laboratorio:not([data-montado])").forEach(function (caixa) {
      caixa.dataset.montado = "1";
      montar(caixa);
    });
  }

  // O Material avisa por document$ a cada página mostrada (inclusive na navegação instantânea).
  if (window.document$) window.document$.subscribe(iniciar);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
