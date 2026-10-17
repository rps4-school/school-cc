/*
 * Cronômetro da folha de prova (<div data-cronometro="minutos"> do visual.py). A cada página
 * nova (document$ do Material), os relógios da anterior param.
 */
(function () {
  "use strict";

  var relogios = [];

  function montar(caixa) {
    var total = +caixa.dataset.cronometro * 60, resto = total, relogio = null;
    var visor = caixa.querySelector(".visor"), iniciar = caixa.querySelector(".iniciar"), zerar = caixa.querySelector(".zerar");
    function mostrar() {
      var h = Math.floor(resto / 3600), m = Math.floor(resto % 3600 / 60), s = resto % 60;
      visor.textContent = h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
      visor.classList.toggle("text-rose-600", resto <= 300);
    }
    function parar() { clearInterval(relogio); relogio = null; }
    iniciar.onclick = function () {
      if (relogio) { parar(); iniciar.textContent = "Continuar"; return; }
      iniciar.textContent = "Pausar";
      relogio = setInterval(function () {
        if (resto > 0) { resto--; mostrar(); return; }
        parar();
        visor.textContent = "Tempo esgotado!";
        iniciar.disabled = true;
      }, 1000);
    };
    zerar.onclick = function () { parar(); resto = total; iniciar.textContent = "Iniciar"; iniciar.disabled = false; mostrar(); };
    relogios.push(parar);
    mostrar();
  }

  function iniciar() {
    relogios.splice(0).forEach(function (parar) { parar(); });
    document.querySelectorAll("[data-cronometro]:not([data-montado])").forEach(function (caixa) {
      caixa.dataset.montado = "1";
      montar(caixa);
    });
  }

  if (window.document$) window.document$.subscribe(iniciar);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
