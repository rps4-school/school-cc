// Desafios do laboratório: a montagem do aluno é conferida pelo COMPORTAMENTO, e não pela posição das
// peças. Cada critério roda a análise elétrica (com os pinos do Uno num estado escolhido) ou o próprio
// programa do projeto no ATmega328P emulado, e diz se passou, com uma dica quando não passou.
//
// No circuito.json: "desafio": { "id": "...", "criterios": [ { "tipo": ..., "texto"?, "dica"? }, ... ] }
//   { tipo: "sem-erros", pinos?: { D8: 1 } }    nenhum diagnóstico de nível "erro" (curto, LED sem resistor,
//                                                corrente demais no pino), com esses pinos de saída no nível dado
//   { tipo: "led-pelo-pino", pino: "D8", min, max, cor? }
//                                                com o pino em HIGH, um LED (da cor pedida, se houver) acende
//                                                com corrente de min a max (A); com o pino em LOW, esse LED apaga
//   { tipo: "corrente-do-led", min, max }       algum LED aceso com corrente de min a max, sem programa
//   { tipo: "programa", passos: [{ botoes: true|false, esperar: s, led: true|false }, ...] }
//                                                roda o firmware do projeto; em cada passo, aperta (ou solta)
//                                                todos os botões, espera e confere se algum LED está aceso

import { analisar, formatar } from "./circuito.js";
import { diagnosticar } from "./diagnostico.js";
import { criarSimulacao } from "./simulacao.js";

const leds = (projeto) => projeto.components.filter((c) => c.type === "led");
const temUno = (projeto) => projeto.components.some((c) => c.type === "arduino-uno-r3");
const corrente = (a) => formatar(a, "A").replace(/,0+ /, " ");
const numeroDoPino = (pino) => pino.replace(/^D/, "");
const saidas = (pinos = {}) => Object.fromEntries(Object.entries(pinos).map(([p, n]) => [p, { modo: "saida", nivel: n ? 1 : 0 }]));

function semErros(projeto, c) {
  const analise = analisar(projeto, { pinos: saidas(c.pinos) });
  const erros = diagnosticar(projeto, analise).filter((d) => d.nivel === "erro");
  return {
    texto: c.texto || "Montagem sem erros: nada de curto, LED sem resistor ou corrente demais num pino",
    ok: erros.length === 0,
    dica: erros.length ? erros[0].mensagem : "",
  };
}

function ledPeloPino(projeto, c) {
  const n = numeroDoPino(c.pino);
  const qual = c.cor ? `o LED ${c.cor}` : "um LED";
  const texto = c.texto || `Com o pino ${n} em HIGH, ${qual} acende com ${corrente(c.min)} a ${corrente(c.max)}; com o pino em LOW, ele apaga`;
  if (!temUno(projeto)) return { texto, ok: false, dica: "Falta o Arduino Uno no circuito." };
  const alto = analisar(projeto, { pinos: saidas({ [c.pino]: 1 }) });
  const baixo = analisar(projeto, { pinos: saidas({ [c.pino]: 0 }) });
  const todos = leds(projeto).filter((l) => alto.componentes[l.id] && alto.componentes[l.id].ligado);
  // Com cor pedida, só conta o LED dessa cor (os outros podem estar acesos por outros pinos).
  const acesos = c.cor ? todos.filter((l) => (l.props || {}).cor === c.cor) : todos;
  if (!acesos.length) {
    const outro = todos.find((l) => !(baixo.componentes[l.id] && baixo.componentes[l.id].ligado));
    if (c.cor && outro) return { texto, ok: false, dica: `Com o pino ${n} em HIGH, quem acendeu foi o LED ${(outro.props || {}).cor}, e não o ${c.cor}. Confira qual fio vai em qual LED.` };
    return { texto, ok: false, dica: c.dica || `Com o pino ${n} em HIGH, ${c.cor ? `o LED ${c.cor} não acendeu` : "nenhum LED acendeu"}. Siga o caminho: pino ${n} → resistor → perna longa (ânodo) do LED → perna curta (cátodo) → GND.` };
  }
  const naFaixa = acesos.filter((l) => alto.componentes[l.id].corrente >= c.min && alto.componentes[l.id].corrente <= c.max);
  if (!naFaixa.length) {
    const i = alto.componentes[acesos[0].id].corrente;
    return { texto, ok: false, dica: `O LED acende com ${formatar(i, "A")}, fora da faixa de ${corrente(c.min)} a ${corrente(c.max)}. Confira o valor do resistor.` };
  }
  const apagam = naFaixa.filter((l) => !(baixo.componentes[l.id] && baixo.componentes[l.id].ligado));
  if (!apagam.length) {
    return { texto, ok: false, dica: `O LED acende, mas não apaga com o pino ${n} em LOW: ele está recebendo tensão de outro lugar (o 5V, por exemplo), e não do pino ${n}.` };
  }
  return { texto, ok: true, dica: "" };
}

function correnteDoLed(projeto, c) {
  const texto = c.texto || `O LED acende com corrente entre ${corrente(c.min)} e ${corrente(c.max)}`;
  const analise = analisar(projeto);
  const acesos = leds(projeto).filter((l) => analise.componentes[l.id] && analise.componentes[l.id].ligado);
  if (!acesos.length) return { texto, ok: false, dica: c.dica || "Nenhum LED acendeu. Confira se o circuito está fechado e se o LED não está invertido." };
  const i = analise.componentes[acesos[0].id].corrente;
  const ok = acesos.some((l) => analise.componentes[l.id].corrente >= c.min && analise.componentes[l.id].corrente <= c.max);
  return {
    texto,
    ok,
    dica: ok ? "" : `O LED está com ${formatar(i, "A")}. ${i > c.max ? "Corrente demais: o resistor precisa ser maior." : "Corrente de menos: o resistor precisa ser menor."}`,
  };
}

// Cópia do projeto com todos os botões apertados (ou soltos).
function comBotoes(projeto, apertado) {
  return {
    ...projeto,
    components: projeto.components.map((c) => (c.type === "botao" ? { ...c, props: { ...(c.props || {}), apertado } } : c)),
  };
}

function rodarPrograma(projeto, c, hex) {
  const texto = c.texto || "Rodando o programa, o LED responde ao botão como pedido";
  if (!hex) return { texto, ok: false, dica: "O firmware deste programa não está neste build do site: não dá para conferir o comportamento aqui." };
  if (!temUno(projeto)) return { texto, ok: false, dica: "Falta o Arduino Uno no circuito." };
  const sim = criarSimulacao({ projeto: comBotoes(projeto, false), hex });
  for (const passo of c.passos) {
    sim.mudarProjeto(comBotoes(projeto, Boolean(passo.botoes)));
    sim.avancar(passo.esperar);
    const aceso = leds(projeto).some((l) => sim.analise.componentes[l.id] && sim.analise.componentes[l.id].ligado);
    if (aceso !== Boolean(passo.led)) {
      const quando = passo.botoes ? "Com o botão apertado" : "Com o botão solto";
      return { texto, ok: false, dica: `${quando}, o LED ficou ${aceso ? "aceso" : "apagado"}. ${c.dica || ""}`.trim() };
    }
  }
  return { texto, ok: true, dica: "" };
}

const CRITERIOS = {
  "sem-erros": (projeto, c) => semErros(projeto, c),
  "led-pelo-pino": (projeto, c) => ledPeloPino(projeto, c),
  "corrente-do-led": (projeto, c) => correnteDoLed(projeto, c),
  programa: (projeto, c, opcoes) => rodarPrograma(projeto, c, opcoes.hex),
};

// Confere todos os critérios (mesmo depois de uma falha, para o aluno ver a lista inteira).
// opcoes.hex: o firmware do sketch do projeto, para os critérios do tipo "programa".
export function conferirDesafio(projeto, desafio, opcoes = {}) {
  const itens = (desafio.criterios || []).map((c) => {
    const f = CRITERIOS[c.tipo];
    if (!f) return { texto: `Critério desconhecido: ${c.tipo}`, ok: false, dica: "" };
    try {
      return f(projeto, c, opcoes);
    } catch (e) {
      return { texto: c.texto || c.tipo, ok: false, dica: "O simulador não conseguiu conferir este item. Desfaça a última mudança e tente de novo." };
    }
  });
  return { ok: itens.length > 0 && itens.every((i) => i.ok), itens };
}

// Os tipos de critério que existem (os testes conferem que todo desafio usa só estes).
export const TIPOS_DE_CRITERIO = Object.keys(CRITERIOS);
