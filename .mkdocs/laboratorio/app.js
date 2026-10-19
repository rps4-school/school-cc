// Laboratório Arduino: a sobreposição de tela cheia com o circuito e o painel.
// O bootstrap (laboratorio.js) importa este módulo só quando o aluno clica em "Abrir".

import * as armazenamento from "./armazenamento.js";
import { descricao, propsPadrao, rotulo, TIPOS } from "./catalogo.js";
import { analisar } from "./circuito.js";
import { definicoes } from "./desenhos.js";
import { diagnosticar } from "./diagnostico.js";
import { ligarEdicao } from "./edicao.js";
import { caixa, encaixarPelaPegada, porId, posicaoDoTerminal, primeiroEncaixeLivre } from "./geometria.js";
import { montarPainel } from "./painel.js";
import { criarPrograma } from "./programa.js";
import { conferirDesafio } from "./desafios.js";
import { copiar, novoId, projetoVazio, separarTerminal, serializar, validar } from "./projeto.js";
import { ehProtoboard } from "./protoboard.js";
import { desenharMarcas, desenharMundo, nomeDoTerminal } from "./vista.js";

const MAX_HISTORICO = 100;
let atual = null;

export function abrir(opcoes = {}) {
  if (atual) atual.fechar();
  atual = criar(opcoes);
  return atual;
}

export function fechar() {
  if (atual) atual.fechar();
}

async function buscarJson(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

function criar({ projetoUrl = null, exemplosUrl = null, retorno = null } = {}) {
  const raiz = document.createElement("div");
  raiz.className = "lab";
  raiz.setAttribute("role", "dialog");
  raiz.setAttribute("aria-modal", "true");
  raiz.setAttribute("aria-label", "Laboratório Arduino");
  raiz.innerHTML = `
    <header class="lab-barra">
      <div class="lab-titulo"><small>Laboratório Arduino</small><b data-titulo>Carregando…</b></div>
      <div class="lab-execucao" data-execucao hidden>
        <button type="button" class="lab-btn lab-executar" data-barra="executar">▶ Executar</button>
        <button type="button" class="lab-btn" data-barra="parar">■ Parar</button>
        <button type="button" class="lab-btn" data-barra="reiniciar">↺ Reiniciar</button>
        <span class="lab-tempo" data-tempo></span>
      </div>
      <div class="lab-barra-acoes">
        <button type="button" class="lab-btn" data-barra="desfazer" title="Desfazer (Ctrl+Z)" aria-label="Desfazer">↶</button>
        <button type="button" class="lab-btn" data-barra="refazer" title="Refazer (Ctrl+Y)" aria-label="Refazer">↷</button>
        <button type="button" class="lab-btn" data-barra="menos" title="Diminuir o zoom (−)" aria-label="Diminuir o zoom">−</button>
        <button type="button" class="lab-btn" data-barra="mais" title="Aumentar o zoom (+)" aria-label="Aumentar o zoom">+</button>
        <button type="button" class="lab-btn" data-barra="ajustar" title="Mostrar tudo (0)">Ajustar</button>
        <button type="button" class="lab-btn lab-fechar" data-barra="fechar">Fechar</button>
      </div>
    </header>
    <div class="lab-corpo">
      <div class="lab-area" tabindex="0" aria-label="Área do circuito. Tab passa pelos componentes e fios; setas movem; R gira; Delete apaga.">
        <svg class="lab-tela" xmlns="http://www.w3.org/2000/svg" aria-hidden="false">
          <defs>${definicoes()}</defs>
          <g class="lab-mundo"><g data-camada="mundo"></g><g data-camada="marcas" pointer-events="none"></g></g>
        </svg>
        <div class="lab-faixa" data-faixa hidden></div>
      </div>
    </div>
    <div class="lab-status" role="status" aria-live="polite"></div>
    <input type="file" accept=".json,application/json" hidden data-arquivo>`;
  const svg = raiz.querySelector("svg");
  const mundo = raiz.querySelector(".lab-mundo");
  const camadaMundo = raiz.querySelector('[data-camada="mundo"]');
  const camadaMarcas = raiz.querySelector('[data-camada="marcas"]');
  const area = raiz.querySelector(".lab-area");
  const faixa = raiz.querySelector("[data-faixa]");
  const status = raiz.querySelector(".lab-status");
  const arquivo = raiz.querySelector("[data-arquivo]");
  const origem = `${location.pathname}|${projetoUrl || "livre"}`;
  const hrefDaAbertura = location.href;

  const estado = {
    projeto: projetoVazio(),
    analise: null,
    diagnosticos: [],
    selecao: null,
    destaque: null,
    previa: null,
    fioEmCurso: null,
    rascunho: null,
    zoom: 1,
    pan: { x: 24, y: 24 },
    corDoFio: "vermelho",
    pinos: null, // estado dos pinos do Uno enquanto um programa está carregado
    placa: {}, // LEDs da placa (L, TX)
    base: projetoUrl, // de onde vêm o sketch e o firmware do projeto
    desafio: null, // { conferindo, resultado, versao }: a última conferência do desafio
  };
  let execucao = { tempo: 0, velocidade: null };
  let chaveDosPinos = "";
  let ultimoDesenho = "";
  const historico = { passado: [], futuro: [] };

  // Som dos buzzers com "Tocar o som" ligado: uma onda quadrada baixinha na frequência medida.
  const som = (() => {
    let audio = null;
    const tocando = new Map();
    function parar() {
      for (const o of tocando.values()) o.stop();
      tocando.clear();
    }
    return {
      atualizar(projeto, sons, rodando) {
        const querem = new Map();
        if (rodando) {
          for (const c of projeto.components) if (c.type === "buzzer" && c.props.som && sons[c.id] > 20) querem.set(c.id, sons[c.id]);
        }
        for (const [id, o] of tocando) {
          if (!querem.has(id)) {
            o.stop();
            tocando.delete(id);
          }
        }
        if (!querem.size) return;
        try {
          audio = audio || new AudioContext();
        } catch (e) {
          return; // navegador sem áudio: só o desenho mostra a frequência
        }
        for (const [id, f] of querem) {
          if (!tocando.has(id)) {
            const osc = audio.createOscillator();
            const ganho = audio.createGain();
            osc.type = "square";
            ganho.gain.value = 0.03;
            osc.connect(ganho).connect(audio.destination);
            osc.start();
            tocando.set(id, { osc, stop: () => { osc.stop(); osc.disconnect(); } });
          }
          tocando.get(id).osc.frequency.setTargetAtTime(f, audio.currentTime, 0.01);
        }
      },
      parar,
      fechar() {
        parar();
        if (audio) audio.close();
        audio = null;
      },
    };
  })();
  let inicial = null;
  let exemplos = [];
  let espera = null;

  // ---------- Desenho ----------

  function aplicarVista() {
    mundo.setAttribute("transform", `translate(${estado.pan.x.toFixed(1)} ${estado.pan.y.toFixed(1)}) scale(${estado.zoom.toFixed(4)})`);
  }

  function redesenharMarcas() {
    camadaMarcas.innerHTML = desenharMarcas({ ...estado, projeto: estado.rascunho || estado.projeto });
  }

  function redesenhar() {
    const focado = document.activeElement && document.activeElement.closest && document.activeElement.closest("[data-comp], [data-fio]");
    const chave = focado && (focado.getAttribute("data-comp") ? `[data-comp="${CSS.escape(focado.getAttribute("data-comp"))}"]` : `[data-fio="${CSS.escape(focado.getAttribute("data-fio"))}"]`);
    camadaMundo.innerHTML = desenharMundo({ ...estado, projeto: estado.rascunho || estado.projeto });
    redesenharMarcas();
    if (chave && raiz.contains(focado) === false) {
      const novo = camadaMundo.querySelector(chave);
      if (novo) novo.focus({ preventScroll: true });
    }
  }

  function mostrarFaixa() {
    const erro = estado.diagnosticos.find((d) => d.nivel === "erro");
    faixa.hidden = !erro;
    if (erro) faixa.textContent = `⛔ ${erro.mensagem}`;
  }

  function avisar(mensagem) {
    if (!mensagem) return;
    status.textContent = "";
    // Troca o texto num quadro seguinte: o leitor de tela anuncia mesmo se a frase repetir.
    requestAnimationFrame(() => {
      status.textContent = mensagem;
    });
  }

  // Só os pinos que o programa configurou (saída ou pull-up): entrada solta é o padrão do circuito.
  function pinosUsados(pinos) {
    return Object.fromEntries(Object.entries(pinos || {}).filter(([, p]) => p.modo !== "entrada"));
  }

  function reanalisar(mensagem, opcoes = {}) {
    estado.analise = analisar(estado.projeto, { pinos: pinosUsados(estado.pinos) });
    chaveDosPinos = JSON.stringify(pinosUsados(estado.pinos));
    const antes = new Set(estado.diagnosticos.map((d) => d.mensagem));
    estado.diagnosticos = diagnosticar(estado.projeto, estado.analise, { pinos: estado.pinos || undefined });
    programa.projetoMudou(estado.projeto);
    const novoErro = estado.diagnosticos.find((d) => d.nivel !== "dica" && !antes.has(d.mensagem));
    raiz.querySelector("[data-titulo]").textContent = estado.projeto.title;
    redesenhar();
    mostrarFaixa();
    painel.atualizar(opcoes);
    avisar([mensagem, novoErro && novoErro.mensagem].filter(Boolean).join(" "));
  }

  function guardarRascunho() {
    clearTimeout(espera);
    espera = setTimeout(() => armazenamento.salvarRascunho(origem, estado.projeto), 400);
  }

  // Aplica uma mudança: fn recebe uma cópia do projeto e muda (ou devolve outro projeto).
  function mudar(fn, mensagem, opcoes = {}) {
    const rascunho = copiar(estado.projeto);
    const novo = fn(rascunho) || rascunho;
    const r = validar(novo);
    estado.rascunho = null;
    if (!r.ok) {
      avisar(`Não deu: ${r.erros[0]}`);
      redesenhar();
      return false;
    }
    if (!opcoes.semHistorico) {
      historico.passado.push(serializar(estado.projeto));
      if (historico.passado.length > MAX_HISTORICO) historico.passado.shift();
      historico.futuro = [];
    }
    estado.projeto = r.projeto;
    if (estado.selecao && !existe(estado.selecao)) estado.selecao = null;
    guardarRascunho();
    reanalisar(mensagem, opcoes);
    return true;
  }

  function existe(sel) {
    return sel.tipo === "fio" ? estado.projeto.connections.some((f) => f.id === sel.id) : Boolean(porId(estado.projeto, sel.id));
  }

  function carregar(projeto, mensagem, { comHistorico = true, base = estado.base } = {}) {
    estado.desafio = null;
    const r = validar(projeto);
    if (!r.ok) {
      avisar(`Este projeto tem problemas: ${r.erros.slice(0, 3).join(" ")}`);
      return false;
    }
    if (comHistorico) {
      historico.passado.push(serializar(estado.projeto));
      historico.futuro = [];
    }
    estado.projeto = r.projeto;
    estado.selecao = null;
    estado.fioEmCurso = null;
    estado.base = base;
    guardarRascunho();
    programa.carregar(estado.projeto, estado.base);
    reanalisar(mensagem);
    ajustar();
    return true;
  }

  // ---------- Programa do Arduino ----------

  const execucaoEl = raiz.querySelector("[data-execucao]");
  const botao = (nome) => execucaoEl.querySelector(`[data-barra="${nome}"]`);

  function atualizarBarra() {
    const temUno = estado.projeto.components.some((c) => c.type === "arduino-uno-r3");
    execucaoEl.hidden = !temUno;
    const st = programa.estado;
    botao("executar").disabled = st === "rodando";
    botao("executar").textContent = st === "parado" ? "▶ Continuar" : "▶ Executar";
    botao("parar").disabled = st !== "rodando";
    botao("reiniciar").disabled = st === "vazio";
    const tempo = execucaoEl.querySelector("[data-tempo]");
    tempo.textContent = st === "vazio" ? "" : `t = ${execucao.tempo.toFixed(1).replace(".", ",")} s${execucao.velocidade ? ` · ${execucao.velocidade} %` : ""}`;
    tempo.title = "Tempo simulado e velocidade em relação ao tempo real";
  }

  // Um quadro do worker (uns 30 por segundo): pinos, brilho médio dos LEDs e texto novo da serial.
  function aoQuadro(q) {
    execucao = { tempo: q.tempo, velocidade: q.velocidade };
    estado.pinos = q.pinos;
    const chave = JSON.stringify(pinosUsados(q.pinos));
    if (chave !== chaveDosPinos) {
      chaveDosPinos = chave;
      estado.analise = analisar(estado.projeto, { pinos: pinosUsados(q.pinos) });
      estado.diagnosticos = diagnosticar(estado.projeto, estado.analise, { pinos: q.pinos });
      mostrarFaixa();
    }
    for (const [chaveDoLed, led] of Object.entries(q.leds)) {
      const [id, canal] = chaveDoLed.split(".");
      const c = estado.analise.componentes[id];
      if (!c) continue;
      if (canal && c.canais && c.canais[canal]) {
        Object.assign(c.canais[canal], led);
        c.ligado = Object.values(c.canais).some((x) => x.ligado);
      } else if (!canal) {
        Object.assign(c, led);
      }
    }
    estado.sons = q.sons || {};
    estado.servos = q.servos || {};
    estado.estados = q.estados || {};
    som.atualizar(estado.projeto, estado.sons, programa.estado === "rodando");
    const d13 = q.pinos.D13;
    estado.placa = { L: Boolean(d13 && d13.modo === "saida" && d13.nivel), TX: Boolean(q.serial) };
    const visual = JSON.stringify([estado.placa, Object.values(q.leds).map((l) => Math.round(l.brilho * 20)), chave,
      Object.values(estado.sons).map(Math.round), Object.values(estado.servos).map(Math.round), estado.estados]);
    if (visual !== ultimoDesenho && !estado.rascunho) {
      ultimoDesenho = visual;
      redesenhar();
    }
    atualizarBarra();
  }

  function aoMudarExecucao() {
    if (programa.estado !== "rodando") som.parar();
    if (programa.estado === "vazio") {
      estado.pinos = null;
      estado.placa = {};
      estado.sons = {};
      estado.servos = {};
      estado.estados = {};
      execucao = { tempo: 0, velocidade: null };
      if (painel) reanalisar(null);
    }
    atualizarBarra();
  }

  // ---------- Vista: zoom e enquadramento ----------

  function zoomEm(fator, cx, cy) {
    const r = svg.getBoundingClientRect();
    const x = cx === undefined ? r.width / 2 : cx;
    const y = cy === undefined ? r.height / 2 : cy;
    const novo = Math.min(4, Math.max(0.25, estado.zoom * fator));
    estado.pan = { x: x - ((x - estado.pan.x) * novo) / estado.zoom, y: y - ((y - estado.pan.y) * novo) / estado.zoom };
    estado.zoom = novo;
    aplicarVista();
  }

  function ajustar() {
    const caixas = estado.projeto.components.map((c) => caixa(estado.projeto, c));
    for (const f of estado.projeto.connections) {
      for (const ref of [f.from, f.to]) {
        const p = posicaoDoTerminal(estado.projeto, ref);
        if (p) caixas.push({ x: p.x - 30, y: p.y - 50, largura: 60, altura: 60 });
      }
    }
    if (!caixas.length) return;
    const x1 = Math.min(...caixas.map((b) => b.x));
    const y1 = Math.min(...caixas.map((b) => b.y));
    const x2 = Math.max(...caixas.map((b) => b.x + b.largura));
    const y2 = Math.max(...caixas.map((b) => b.y + b.altura));
    const r = svg.getBoundingClientRect();
    const margem = 24;
    const zoom = Math.min(2, Math.max(0.25, Math.min((r.width - 2 * margem) / (x2 - x1), (r.height - 2 * margem) / (y2 - y1))));
    estado.zoom = zoom;
    estado.pan = { x: (r.width - (x2 - x1) * zoom) / 2 - x1 * zoom, y: (r.height - (y2 - y1) * zoom) / 2 - y1 * zoom };
    aplicarVista();
  }

  // ---------- Ações ----------

  function selecionar(sel, { semFoco = false } = {}) {
    estado.selecao = sel;
    redesenharMarcas();
    painel.atualizar();
    if (sel) {
      if (!semFoco) {
        const el = camadaMundo.querySelector(sel.tipo === "fio" ? `[data-fio="${CSS.escape(sel.id)}"]` : `[data-comp="${CSS.escape(sel.id)}"]`);
        if (el) el.focus({ preventScroll: true });
      }
      if (["adicionar", "instrucoes"].includes(painelAba())) painel.mostrarAba("selecionado");
    }
  }

  let abaAtual = "adicionar";
  function painelAba() {
    const ativa = raiz.querySelector('[role="tab"][aria-selected="true"]');
    abaAtual = ativa ? ativa.dataset.aba : abaAtual;
    return abaAtual;
  }

  // Lugar para um componente solto novo: à esquerda do que já existe, sem cobrir nada.
  function lugarLivre(projeto, tipo) {
    const t = TIPOS[tipo];
    const caixas = projeto.components.map((c) => caixa(projeto, c));
    if (!caixas.length) return { x: 40, y: 40 };
    const minX = Math.min(...caixas.map((b) => b.x));
    const minY = Math.min(...caixas.map((b) => b.y));
    const maxY = Math.max(...caixas.map((b) => b.y + b.altura));
    if (t.placa) return { x: minX, y: maxY + 40 };
    const largura = t.largura || 60;
    const altura = (t.altura || 60) + 30;
    const x = minX - largura - 70;
    for (let y = minY; y < minY + 2000; y += 20) {
      const livre = !caixas.some((b) => x < b.x + b.largura + 20 && x + largura + 20 > b.x && y < b.y + b.altura + 20 && y + altura > b.y);
      if (livre) return { x, y };
    }
    return { x, y: maxY + 40 };
  }

  function adicionar(tipo) {
    const t = TIPOS[tipo];
    let descricaoDoLugar = "";
    let novoIdComp = null;
    const ok = mudar((p) => {
      const id = novoId(p, t.prefixo);
      novoIdComp = id;
      const comp = { id, type: tipo, ...lugarLivre(p, tipo) };
      const props = propsPadrao(tipo);
      if (Object.keys(props).length) comp.props = props;
      p.components.push(comp);
      if (t.pegada) {
        const mount = primeiroEncaixeLivre(p, comp);
        if (mount) {
          comp.mount = mount;
          descricaoDoLugar = ` Encaixado em ${Object.values(mount).map((f) => separarTerminal(f)[1]).join(", ")}.`;
        } else {
          descricaoDoLugar = " Sem lugar livre na protoboard: ficou solto, ao lado.";
        }
      }
    }, null);
    if (ok) {
      const comp = porId(estado.projeto, novoIdComp);
      selecionar({ tipo: "comp", id: comp.id });
      avisar(`${descricao(comp)} adicionado.${descricaoDoLugar}`);
    }
  }

  function girar(id) {
    const comp = porId(estado.projeto, id);
    if (!comp || ehProtoboard(comp.type)) return;
    mudar((p) => {
      const c = porId(p, id);
      c.rot = ((c.rot || 0) + 90) % 360;
      if (!c.rot) delete c.rot;
      if (c.mount && TIPOS[c.type].pegada) {
        const primeiro = c.mount[TIPOS[c.type].terminais[0].id];
        const r = primeiro ? encaixarPelaPegada(p, c, primeiro) : {};
        if (r.mount) c.mount = r.mount;
        else {
          const pos = posicaoDoTerminal(estado.projeto, `${id}:${TIPOS[c.type].terminais[0].id}`);
          delete c.mount;
          Object.assign(c, { x: pos.x, y: pos.y });
        }
      }
    }, `${rotulo(comp)} girado.`);
  }

  function inverter(id) {
    const comp = porId(estado.projeto, id);
    const pares = { led: ["anodo", "catodo"], resistor: ["1", "2"], ldr: ["1", "2"], interruptor: ["1", "2"], potenciometro: ["1", "3"] };
    const par = comp && pares[comp.type];
    if (!par || !comp.mount || !comp.mount[par[0]] || !comp.mount[par[1]]) {
      return avisar("Inverter troca as pernas de um componente encaixado na protoboard (LED, resistor, LDR, interruptor ou potenciômetro).");
    }
    mudar((p) => {
      const c = porId(p, id);
      [c.mount[par[0]], c.mount[par[1]]] = [c.mount[par[1]], c.mount[par[0]]];
    }, comp.type === "led" ? `${rotulo(comp)} invertido: o ânodo foi para ${separarTerminal(comp.mount.catodo)[1]}.` : `${rotulo(comp)}: pernas trocadas.`);
  }

  function apagarSelecao() {
    const sel = estado.selecao;
    if (!sel) return;
    if (sel.tipo === "fio") return apagarFio(sel.id);
    const comp = porId(estado.projeto, sel.id);
    if (!comp) return;
    mudar((p) => {
      p.components = p.components.filter((c) => c.id !== comp.id);
      p.connections = p.connections.filter((f) => separarTerminal(f.from)[0] !== comp.id && separarTerminal(f.to)[0] !== comp.id);
      if (ehProtoboard(comp.type)) {
        for (const c of p.components) {
          if (!c.mount) continue;
          const fica = Object.entries(c.mount).filter(([, f]) => separarTerminal(f)[0] !== comp.id);
          if (fica.length === Object.keys(c.mount).length) continue;
          const pos = posicaoDoTerminal(estado.projeto, `${c.id}:${TIPOS[c.type].terminais[0].id}`);
          if (fica.length) c.mount = Object.fromEntries(fica);
          else delete c.mount;
          if (pos) Object.assign(c, { x: pos.x, y: pos.y });
        }
      }
    }, `${rotulo(comp)} apagado.`);
    estado.selecao = null;
    area.focus({ preventScroll: true });
  }

  function apagarFio(id) {
    const fio = estado.projeto.connections.find((f) => f.id === id);
    if (!fio) return;
    mudar((p) => {
      p.connections = p.connections.filter((f) => f.id !== id);
    }, `Fio apagado: ${nomeDoTerminal(estado.projeto, fio.from)} → ${nomeDoTerminal(estado.projeto, fio.to)}.`);
  }

  function ligar(de, ate) {
    if (!de || !ate) return avisar("Escolha os dois terminais.");
    if (de === ate) return avisar("Escolha dois terminais diferentes.");
    mudar((p) => {
      p.connections.push({ id: novoId(p, "w"), from: de, to: ate, color: estado.corDoFio });
    }, `Fio ligado: ${nomeDoTerminal(estado.projeto, de)} → ${nomeDoTerminal(estado.projeto, ate)}.`);
  }

  function mudarProp(id, campo, fn, opcoes = {}) {
    if (!porId(estado.projeto, id)) return;
    const ok = mudar((p) => {
      const c = porId(p, id);
      c.props = { ...(c.props || {}) };
      c.props[campo] = fn(c.props[campo]);
    }, null, { origem: "painel", ...opcoes });
    if (ok && !opcoes.semHistorico) avisar(`${descricao(porId(estado.projeto, id))}.`);
  }

  function encaixarPerna(id, pino, furo) {
    const dono = furo && estado.projeto.components.find((x) => x.id !== id && Object.values(x.mount || {}).includes(furo));
    if (dono) {
      avisar(`O furo ${separarTerminal(furo)[1]} já tem a perna de ${rotulo(dono)}.`);
      painel.atualizar();
      return;
    }
    const pos = posicaoDoTerminal(estado.projeto, `${id}:${pino}`);
    mudar((p) => {
      const c = porId(p, id);
      const mount = { ...(c.mount || {}) };
      if (furo) mount[pino] = furo;
      else delete mount[pino];
      if (Object.keys(mount).length) c.mount = mount;
      else {
        delete c.mount;
        if (pos) Object.assign(c, { x: pos.x, y: pos.y });
      }
    }, furo ? `Perna em ${nomeDoTerminal(estado.projeto, furo)}.` : "Perna solta.", { origem: "painel" });
  }

  function salvar() {
    const nome = estado.projeto.title || "Meu circuito";
    const id = armazenamento.salvarComo(nome, estado.projeto);
    avisar(id ? `Salvo neste navegador como "${nome}".` : "Não deu para salvar: o navegador não deixou guardar dados.");
    painel.atualizar();
  }

  function exportar() {
    const nome = (estado.projeto.title || "circuito").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "circuito";
    armazenamento.baixar(`${nome}.json`, serializar(estado.projeto));
    avisar(`Arquivo ${nome}.json baixado.`);
  }

  arquivo.addEventListener("change", async () => {
    const f = arquivo.files && arquivo.files[0];
    arquivo.value = "";
    if (!f) return;
    try {
      const dados = JSON.parse(await armazenamento.lerArquivo(f));
      carregar(dados, `Projeto aberto do arquivo ${f.name}.`);
    } catch (e) {
      avisar(e instanceof SyntaxError ? "O arquivo não é um JSON válido." : e.message);
    }
  });

  function desfazer() {
    if (!historico.passado.length) return avisar("Nada para desfazer.");
    historico.futuro.push(serializar(estado.projeto));
    estado.projeto = validar(JSON.parse(historico.passado.pop())).projeto;
    if (estado.selecao && !existe(estado.selecao)) estado.selecao = null;
    guardarRascunho();
    reanalisar("Desfeito.");
  }

  function refazer() {
    if (!historico.futuro.length) return avisar("Nada para refazer.");
    historico.passado.push(serializar(estado.projeto));
    estado.projeto = validar(JSON.parse(historico.futuro.pop())).projeto;
    guardarRascunho();
    reanalisar("Refeito.");
  }

  const programa = criarPrograma({
    avisar,
    temUno: () => estado.projeto.components.some((c) => c.type === "arduino-uno-r3"),
    projeto: () => estado.projeto,
    aoQuadro,
    aoMudarExecucao: () => aoMudarExecucao(),
    mostrarAba: (aba) => painel.mostrarAba(aba),
    baixar: (nome, texto, tipo) => armazenamento.baixar(nome, texto, tipo),
  });

  const ctx = {
    svg, raiz, area, estado,
    abaExterna: (id) => (id === "codigo" ? programa.elementoCodigo : id === "serial" ? programa.elementoSerial : null),
    aoMostrarAba: (id) => programa.aoMostrarAba(id),
    mudar, reanalisar, avisar, selecionar, aplicarVista, zoomEm, ajustar, redesenharMarcas,
    previsualizar(p) {
      estado.rascunho = p;
      redesenhar();
    },
    novoId,
    corDoFio: () => estado.corDoFio,
    nome: (comp) => rotulo(comp),
    girar, inverter, apagarSelecao, apagarFio, ligar, adicionar, mudarProp, encaixarPerna, desfazer, refazer, salvar, exportar,
    mudarCorDoFio(id, cor) {
      estado.corDoFio = cor;
      mudar((p) => {
        p.connections.find((f) => f.id === id).color = cor;
      }, `Fio ${cor}.`, { origem: "painel" });
    },
    mudarTitulo(titulo) {
      mudar((p) => {
        p.title = titulo.trim() || "Meu circuito";
      }, "Nome do projeto mudado.", { origem: "painel" });
    },
    importar: () => arquivo.click(),
    listarSalvos: armazenamento.listarSalvos,
    abrirSalvo(id) {
      const p = armazenamento.abrirSalvo(id);
      if (p) carregar(p, `Projeto "${p.title}" aberto.`);
    },
    apagarSalvo(id) {
      armazenamento.apagarSalvo(id);
      painel.atualizar();
      avisar("Projeto salvo apagado.");
    },
    exemplos: () => exemplos,
    async abrirExemplo(url) {
      try {
        carregar(await buscarJson(url), "Exemplo aberto.", { base: url });
      } catch (e) {
        avisar("Não deu para abrir o exemplo. Confira a internet e tente de novo.");
      }
    },
    temInicial: () => Boolean(inicial),
    voltarAoInicial() {
      if (inicial && confirm("Trocar o seu circuito pelo inicial desta página? Dá para desfazer depois (Ctrl+Z).")) {
        carregar(inicial, "Circuito inicial de volta.", { base: projetoUrl });
      }
    },
    comecarDoZero() {
      if (!confirm("Começar um circuito vazio? Dá para desfazer depois (Ctrl+Z).")) return;
      const vazio = projetoVazio();
      // Num desafio, o circuito vazio continua sendo o desafio (com o programa e as instruções dele).
      if (inicial && inicial.desafio) {
        for (const k of ["title", "sketch", "variantes", "metadata", "desafio"]) if (inicial[k] !== undefined) vazio[k] = copiar(inicial)[k];
      }
      carregar(vazio, "Circuito vazio.");
    },
    desafio: () => estado.projeto.desafio || null,
    desafioMudou: () => Boolean(estado.desafio && estado.desafio.versao && estado.desafio.versao !== serializar(estado.projeto)),
    async conferirDesafio() {
      const desafio = estado.projeto.desafio;
      if (!desafio || (estado.desafio && estado.desafio.conferindo)) return;
      estado.desafio = { conferindo: true, resultado: null, versao: null };
      painel.atualizar();
      avisar("Conferindo a montagem…");
      await new Promise((r) => setTimeout(r, 30)); // deixa o "Conferindo…" aparecer antes da conta
      const resultado = conferirDesafio(estado.projeto, desafio, { hex: programa.hexPrincipal() });
      estado.desafio = { conferindo: false, resultado, versao: serializar(estado.projeto) };
      painel.atualizar();
      const certos = resultado.itens.filter((i) => i.ok).length;
      if (resultado.ok) {
        const p = window.SchoolCC && window.SchoolCC.progresso;
        if (p) {
          p.conferiu(`desafio:${desafio.id || "laboratorio"}`, true, { valor: "montagem conferida no laboratório" });
          p.concluir(null, true);
        }
        avisar(`Desafio concluído: ${certos} de ${resultado.itens.length} itens certos.${p ? " Ficou marcado no seu progresso." : ""}`);
      } else {
        avisar(`Ainda não: ${certos} de ${resultado.itens.length} itens certos. Veja as dicas na aba Instruções.`);
      }
    },
  };

  const painel = montarPainel(ctx);
  raiz.querySelector(".lab-corpo").appendChild(painel.elemento);
  const edicao = ligarEdicao(ctx);

  raiz.querySelector(".lab-barra").addEventListener("click", (e) => {
    const b = e.target.closest("[data-barra]");
    if (!b) return;
    ({
      desfazer, refazer, menos: () => zoomEm(1 / 1.2), mais: () => zoomEm(1.2), ajustar, fechar: () => instancia.fechar(),
      executar: () => programa.executar(), parar: () => programa.parar(), reiniciar: () => programa.reiniciar(),
    })[b.dataset.barra]();
  });

  // ---------- Abrir e fechar ----------

  document.body.appendChild(raiz);
  document.documentElement.classList.add("lab-aberto");
  const observador = new ResizeObserver(() => aplicarVista());
  observador.observe(svg);
  let inscricao = null;
  if (window.document$ && window.document$.subscribe) {
    // Navegação instantânea: trocou de página, o laboratório fecha (e o rascunho fica salvo).
    inscricao = window.document$.subscribe(() => {
      if (location.href !== hrefDaAbertura) instancia.fechar();
    });
  }

  const instancia = {
    estado,
    fechar() {
      if (!raiz.isConnected) return;
      clearTimeout(espera);
      armazenamento.salvarRascunho(origem, estado.projeto);
      programa.encerrar();
      som.fechar();
      edicao.destruir();
      observador.disconnect();
      if (inscricao && inscricao.unsubscribe) inscricao.unsubscribe();
      raiz.remove();
      document.documentElement.classList.remove("lab-aberto");
      if (atual === instancia) atual = null;
      if (retorno && retorno.isConnected) retorno.focus();
    },
  };

  (async () => {
    let mensagem = "";
    if (exemplosUrl) {
      try {
        const lista = await buscarJson(exemplosUrl);
        exemplos = (lista.exemplos || []).map((ex) => ({ ...ex, url: new URL(ex.arquivo, new URL(exemplosUrl, location.href)).href }));
      } catch (e) {
        exemplos = [];
      }
    }
    if (projetoUrl) {
      try {
        const r = validar(await buscarJson(projetoUrl));
        if (r.ok) inicial = r.projeto;
        else mensagem = `O circuito desta página tem problemas (${r.erros[0]}). Começando com um circuito vazio.`;
      } catch (e) {
        mensagem = "Não deu para carregar o circuito desta página. Começando com um circuito vazio.";
      }
    }
    const rascunho = armazenamento.lerRascunho(origem);
    const doRascunho = rascunho && validar(rascunho);
    if (doRascunho && doRascunho.ok) {
      estado.projeto = doRascunho.projeto;
      mensagem = mensagem || `Continuando o seu circuito salvo neste navegador.${inicial ? " Para recomeçar, use Projeto → Voltar ao circuito inicial." : ""}`;
    } else if (inicial) {
      estado.projeto = copiar(inicial);
    }
    const programas = await programa.carregar(estado.projeto, estado.base);
    reanalisar(mensagem || `${estado.projeto.title}: pronto para ${programas ? "montar e executar" : "montar"}.`);
    ajustar();
    painel.mostrarAba(estado.projeto.metadata && estado.projeto.metadata.instrucoes ? "instrucoes" : "adicionar");
    area.focus({ preventScroll: true });
  })();

  window.SchoolCC = window.SchoolCC || {};
  window.SchoolCC.laboratorio = { abrir, fechar, estado: () => estado };
  return instancia;
}
