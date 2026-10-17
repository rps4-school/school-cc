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

  function acertos(d, chave) {
    var p = d.paginas[chave];
    return p ? Object.keys(p.acertos || {}).length : 0;
  }

  // Uma regra só, em todo o site: concluída é a marcada (pelo aluno ou pelo corretor, ao acertar tudo).
  function concluida(d, chave) {
    return !!(Object.prototype.hasOwnProperty.call(d.paginas, chave) && d.paginas[chave].concluida);
  }

  // Barra (largura) ou anel (--pct, desenhado pelo CSS).
  function barra(el, pct) {
    var b = el.querySelector("[role=progressbar]");
    if (!b) return;
    b.setAttribute("aria-valuenow", pct);
    if (b.classList.contains("anel")) b.style.setProperty("--pct", pct);
    else b.firstChild.style.width = pct + "%";
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
      var chave = el.dataset.pagina, n = +el.dataset.perguntas || 0, feita = concluida(d, chave);
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
      var feitas = paginas.filter(function (c) { return concluida(d, c); }).length;
      var pct = paginas.length ? Math.round((100 * feitas) / paginas.length) : 0;
      barra(el, pct);
      var t = el.querySelector("[data-progresso-texto]");
      // Cartões e etiquetas de tema: o % só aparece quando há progresso.
      var soComProgresso = el.classList.contains("area__tema") || el.classList.contains("cartao-tema");
      if (t) t.textContent = soComProgresso && !feitas ? "" : pct + "%" + (el.classList.contains("curso") ? " concluído" : "");
      el.toggleAttribute("data-com-progresso", feitas > 0);
    });

    // Menu da trilha: "N de M concluídas" e a barra (as unidades vêm em data-paginas).
    todos("[data-progresso-menu]").forEach(function (el) {
      var paginas = (el.dataset.paginas || "").split(" ").filter(Boolean);
      var feitas = paginas.filter(function (c) { return concluida(d, c); }).length;
      var b = el.querySelector("[role=progressbar]");
      b.setAttribute("aria-valuenow", feitas);
      b.firstChild.style.width = (paginas.length ? Math.round((100 * feitas) / paginas.length) : 0) + "%";
      el.querySelector("[data-feitas]").textContent = feitas;
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
      // O nome do tema vem do cartão ou da etiqueta do tema que estiver na página (na home, a etiqueta).
      var tema = document.querySelector(com("data-progresso-tema", u.tema || ""));
      el.querySelector("[data-continuar-titulo]").textContent = u.titulo || "";
      el.querySelector("[data-continuar-tema]").textContent = tema ? (tema.querySelector(".cartao-tema__titulo") || tema).firstChild.textContent : "";
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
    document.querySelector("[data-sem-armazenamento]").hidden = P.disponivel();
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
      var proxima = bloco.dataset.paginas.split(" ").filter(function (c) { return c && !concluida(d, c); })[0];
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

  // ---------- Filtros (catálogo e "Por nível"): facetas e busca ----------
  // Cada [data-item] tem data-area, data-nivel, data-tipo...; cada botão [data-faceta][data-valor] escolhe
  // um valor. A contagem de um botão é quantos itens ele deixaria; botão sem item fica desativado.

  function semAcento(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function filtrar() {
    var caixa = document.querySelector("[data-filtros]");
    if (!caixa) return;
    var escolhas = {}, campo = caixa.querySelector("[data-filtro-texto]");
    todos('[data-faceta][aria-pressed="true"]', caixa).forEach(function (b) { escolhas[b.dataset.faceta] = b.dataset.valor; });
    var termo = campo ? semAcento(campo.value.trim()) : "";
    var itens = todos("[data-item]");
    // O termo casa com o começo das palavras ("git" acha Git, não "digitais").
    function passa(item, ignorar) {
      return Object.keys(escolhas).every(function (f) { return f === ignorar || !escolhas[f] || item.dataset[f] === escolhas[f]; }) &&
        (!termo || (" " + item.dataset.busca).indexOf(" " + termo) >= 0);
    }
    var total = 0;
    itens.forEach(function (i) {
      i.hidden = !passa(i);
      if (!i.hidden) total++;
    });
    todos("[data-grupo]").forEach(function (g) { g.hidden = !g.querySelector("[data-item]:not([hidden])"); });
    todos("[data-faceta]", caixa).forEach(function (b) {
      var f = b.dataset.faceta, v = b.dataset.valor;
      var n = itens.filter(function (i) { return passa(i, f) && (!v || i.dataset[f] === v); }).length;
      b.querySelector("[data-contagem]").textContent = n;
      b.disabled = !n && b.getAttribute("aria-pressed") !== "true";
    });
    caixa.querySelector("[data-limpar]").hidden = !termo && !Object.keys(escolhas).some(function (f) { return escolhas[f]; });
    caixa.querySelector("[data-filtro-resultado]").textContent = total
      ? total + " " + caixa.dataset[total === 1 ? "singular" : "plural"]
      : "Nenhum " + caixa.dataset.singular + " encontrado.";
  }

  function escolher(faceta, valor) {
    var botoes = todos('[data-faceta="' + faceta + '"]');
    if (!botoes.some(function (b) { return b.dataset.valor === valor; })) return;
    botoes.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.valor === valor); });
    filtrar();
  }

  function limpar() {
    todos("[data-faceta]").forEach(function (b) { b.setAttribute("aria-pressed", !b.dataset.valor); });
    var campo = document.querySelector("[data-filtro-texto]");
    if (campo) campo.value = "";
    filtrar();
  }

  function mensagem(texto) {
    document.querySelector("[data-mensagem]").textContent = texto;
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button[data-concluir], [data-exportar], [data-importar], [data-apagar], [data-faceta], [data-limpar]");
    if (!b) return;
    if (b.hasAttribute("data-faceta")) return escolher(b.dataset.faceta, b.dataset.valor);
    if (b.hasAttribute("data-limpar")) return limpar();
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

  // A âncora já abre filtrado: "Ver no catálogo" (#area-programacao) e a etiqueta de nível de uma
  // página, que leva a "Por nível" (#tag:intermediário).
  function filtroDaAncora() {
    var h = decodeURIComponent(location.hash), area = /^#area-([\w-]+)$/.exec(h), nivel = /^#tag:(.+)$/.exec(h);
    if (area) escolher("area", area[1]);
    if (nivel) escolher("nivel", semAcento(nivel[1]));
  }
  window.addEventListener("hashchange", filtroDaAncora);

  document.addEventListener("input", function (e) {
    if (e.target.matches && e.target.matches("[data-filtro-texto]")) filtrar();
  });

  document.addEventListener("change", function (e) {
    if (!e.target.matches || !e.target.matches("[data-arquivo]") || !e.target.files[0]) return;
    var leitor = new FileReader();
    leitor.onload = function () {
      try {
        mensagem(P.importar(leitor.result)
          ? "Progresso importado e juntado ao que já estava aqui."
          : "Progresso importado só nesta aba: este navegador não está salvando.");
      } catch (erro) {
        mensagem(erro.message);
      }
    };
    leitor.readAsText(e.target.files[0]);
    e.target.value = "";
  });
  // Nomes acessíveis que faltam no Material (busca e barra de carregamento da navegação instantânea).
  [[".md-search", "Busca"], [".md-progress", "Carregando a página"]].forEach(function (par) {
    var el = document.querySelector(par[0]);
    if (el) el.setAttribute("aria-label", par[1]);
  });
  document.addEventListener("school-cc:progresso", desenhar);
  window.addEventListener("storage", function (e) {
    if (e.key === "school-cc:progresso") desenhar();
  });

  // Menu da trilha: a seta abre e fecha os níveis de uma aula sem sair da página.
  document.addEventListener("click", function (e) {
    var seta = e.target.closest && e.target.closest(".trilha-lateral__abrir");
    if (!seta) return;
    var aberta = seta.getAttribute("aria-expanded") === "true";
    seta.setAttribute("aria-expanded", String(!aberta));
    document.getElementById(seta.getAttribute("aria-controls")).hidden = aberta;
  });

  // No computador, o menu rola sozinho até a página atual (em temas longos, ela pode estar lá embaixo).
  function mostrarAtual() {
    var atual = document.querySelector('.trilha-lateral [aria-current="page"]');
    var caixa = atual && atual.closest(".md-sidebar__scrollwrap");
    if (!caixa || !window.matchMedia("(min-width: 76.25em)").matches) return;
    var r = atual.getBoundingClientRect(), c = caixa.getBoundingClientRect();
    if (r.top < c.top || r.bottom > c.bottom) caixa.scrollTop += r.top - c.top - c.height / 3;
  }

  function iniciar() {
    mostrarAtual();
    filtroDaAncora();
    filtrar();
    var visita = document.querySelector("[data-visita]:not([data-montado])");
    if (!visita) return desenhar();
    visita.dataset.montado = "1";
    P.visitou({ titulo: visita.dataset.titulo, tema: visita.dataset.tema }); // dispara o desenho
  }

  if (window.document$) window.document$.subscribe(iniciar);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
