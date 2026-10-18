// Diagnósticos: o que está errado ou estranho no circuito, em português, do mais grave ao mais leve.
// Cada item: { nivel: "erro" | "aviso" | "dica", codigo, mensagem, ids: [componentes envolvidos] }.

import { rotulo, TIPOS } from "./catalogo.js";
import { formatar } from "./circuito.js";
import { BARRAMENTOS, ehProtoboard, MODELOS } from "./protoboard.js";
import { separarTerminal } from "./projeto.js";

const LED_RECOMENDADO = 0.02;
const LED_MAXIMO = 0.03;
const PINO_RECOMENDADO = 0.02;
const PINO_MAXIMO = 0.04;
const DUAS_PERNAS = ["resistor", "led", "ldr", "interruptor"];
const NIVEIS = { erro: 0, aviso: 1, dica: 2 };

function nomeDoTerminal(comp, id) {
  const t = TIPOS[comp.type].terminais.find((x) => x.id === id);
  return t ? t.nome : id;
}

// contexto.pinos: estado dos pinos do Uno quando um programa está rodando (o emulador preenche).
export function diagnosticar(projeto, analise, contexto = {}) {
  const itens = [];
  const add = (nivel, codigo, mensagem, ids) => itens.push({ nivel, codigo, mensagem, ids });
  const porId = new Map(projeto.components.map((c) => [c.id, c]));
  const { redes } = analise;

  if (!analise.convergiu) {
    add("erro", "nao-convergiu", "O simulador não conseguiu fechar a conta deste circuito. Desfaça a última mudança ou simplifique a montagem.", []);
  }

  // Curto-circuito: uma fonte entregando corrente demais.
  const amperimetrosEmCurto = projeto.components.filter((c) => {
    const r = analise.componentes[c.id];
    return c.type === "multimetro" && c.props.modo === "A" && r && Math.abs(r.leitura || 0) > 1;
  });
  for (const c of projeto.components) {
    const r = analise.componentes[c.id];
    if (!r) continue;
    const fontes = c.type === "arduino-uno-r3" ? Object.entries(r.pinos || {}).filter(([, f]) => !f.saida) : (c.type === "pilhas" || c.type === "bateria-9v") ? [["", r]] : [];
    for (const [pino, f] of fontes) {
      if (!f.curto) continue;
      const quem = pino ? `o ${pino} do Arduino está` : c.type === "pilhas" ? `as ${rotulo(c)} estão` : `a ${rotulo(c)} está`;
      if (amperimetrosEmCurto.length) {
        add("erro", "amperimetro-em-paralelo",
          "Curto-circuito: o multímetro está medindo corrente (A) e foi ligado em paralelo, direto na fonte. Para medir corrente, abra o circuito e ponha o multímetro em série.",
          [c.id, ...amperimetrosEmCurto.map((m) => m.id)]);
      } else {
        add("erro", "curto",
          `Curto-circuito: ${quem} fornecendo ${formatar(Math.abs(f.corrente), "A")}. Algum fio ou tira liga o + direto no − (ou no GND), sem passar por um componente.`,
          [c.id]);
      }
    }
  }

  // LEDs: corrente demais, polaridade.
  for (const c of projeto.components) {
    if (c.type !== "led") continue;
    const r = analise.componentes[c.id];
    if (r.ligado && r.corrente > LED_MAXIMO) {
      add("erro", "led-sem-resistor",
        `${rotulo(c)} recebe ${formatar(r.corrente, "A")}: ele queimaria (o normal é até 20 mA). Falta um resistor em série, ou ele é pequeno demais.`, [c.id]);
    } else if (r.ligado && r.corrente > LED_RECOMENDADO) {
      add("aviso", "led-corrente-alta",
        `${rotulo(c)} recebe ${formatar(r.corrente, "A")}, acima dos 20 mA recomendados. Use um resistor maior.`, [c.id]);
    }
    if (r.tensao !== null && r.tensao < -1) {
      add("aviso", "led-invertido",
        `${rotulo(c)} está invertido: a perna longa (ânodo, +) tem que ficar do lado positivo. Virado assim, ele bloqueia a corrente e não acende.`, [c.id]);
    }
  }

  // Pinos do Uno: tensão fora de 0 a 5 V e corrente demais num pino de saída.
  for (const c of projeto.components) {
    if (c.type !== "arduino-uno-r3") continue;
    const r = analise.componentes[c.id];
    for (const t of TIPOS[c.type].terminais) {
      if (!/^(D\d+|A\d)$/.test(t.id)) continue;
      const v = r.tensoes[t.id];
      if (v !== null && (v > 5.5 || v < -0.5)) {
        add("erro", "tensao-no-pino",
          `O ${t.nome} do Arduino está com ${formatar(v, "V")}: os pinos aguentam de 0 a 5 V. Uma fonte maior (como a bateria de 9 V) estraga o pino.`, [c.id]);
      }
      const saida = (r.pinos || {})[t.id];
      if (saida && saida.saida) {
        const i = Math.abs(saida.corrente);
        if (i > PINO_MAXIMO) {
          add("erro", "corrente-no-pino",
            `O ${t.nome} está fornecendo ${formatar(i, "A")}: passa dos 40 mA que o pino aguenta. Falta um resistor ou o pino está em curto.`, [c.id]);
        } else if (i > PINO_RECOMENDADO) {
          add("aviso", "corrente-no-pino-alta", `O ${t.nome} está fornecendo ${formatar(i, "A")}, acima dos 20 mA recomendados.`, [c.id]);
        }
      }
    }
  }

  // Componente de duas pernas com as duas na mesma tira: fica em curto e não faz nada.
  for (const c of projeto.components) {
    if (!DUAS_PERNAS.includes(c.type) || (c.type === "interruptor" && c.props.fechado)) continue;
    const [t1, t2] = TIPOS[c.type].terminais.map((t) => `${c.id}:${t.id}`);
    if (redes.mesmaRede(t1, t2) && c.mount) {
      add("aviso", "mesma-tira",
        `As duas pernas de ${rotulo(c)} estão na mesma tira da protoboard (ou ligadas por um fio): a corrente passa pela tira, e não por ele.`, [c.id]);
    }
  }

  // Barramento dividido: uma metade tem a fonte e a outra só tem componentes.
  for (const placa of projeto.components) {
    if (!ehProtoboard(placa.type) || !MODELOS[placa.type].dividido) continue;
    const meio = MODELOS[placa.type].furosNoBarramento / 2;
    for (const b of BARRAMENTOS) {
      const metades = [`${placa.id}:${b}1`, `${placa.id}:${b}${meio + 1}`];
      if (redes.mesmaRede(...metades)) continue;
      const temFonte = metades.map((m) => redes.redes[redes.rede(m)].some((ref) => ehTerminalDeFonte(porId, ref)));
      const temParte = metades.map((m) => redes.redes[redes.rede(m)].some((ref) => ehTerminalDeParte(porId, ref)));
      if (temFonte[0] !== temFonte[1] && temParte[temFonte[0] ? 1 : 0]) {
        const lado = b.startsWith("cima") ? "de cima" : "de baixo";
        add("dica", "barramento-dividido",
          `O barramento ${b.endsWith("+") ? "+" : "−"} ${lado} desta protoboard é dividido no meio: a metade ${temFonte[0] ? "direita" : "esquerda"} não recebe a alimentação. Ligue as duas metades com um fio.`,
          [placa.id]);
      }
    }
  }

  // O LED que o projeto espera (metadata.esperado) está fora do circuito, ou o programa usa outro pino.
  const esperado = (projeto.metadata && projeto.metadata.esperado) || {};
  const ledEsperado = esperado.led && porId.get(esperado.led);
  if (ledEsperado) {
    const soltos = TIPOS[ledEsperado.type].terminais.every((t) =>
      redes.redes[redes.rede(`${ledEsperado.id}:${t.id}`)].every((ref) => ref.split(":")[0] === ledEsperado.id || !ehTerminalDeParte(porId, ref)));
    if (soltos) {
      add("aviso", "fora-do-circuito", `${rotulo(ledEsperado)} está fora do circuito: encaixe as pernas dele na protoboard.`, [ledEsperado.id]);
    }
  }
  const saidas = Object.entries(contexto.pinos || {}).filter(([, p]) => p.modo === "saida").map(([nome]) => nome);
  if (esperado.pino && saidas.length && !saidas.includes(esperado.pino)) {
    const nomes = saidas.map((p) => p.replace(/^D/, "")).join(", ");
    const uno = projeto.components.find((c) => c.type === "arduino-uno-r3");
    add("aviso", "pino-errado",
      `O programa liga e desliga o pino ${nomes}, mas o ${ledEsperado ? rotulo(ledEsperado) : "LED"} está ligado ao pino ${esperado.pino.replace(/^D/, "")}. Confira o número do pino no código.`,
      [uno ? uno.id : null, ledEsperado ? ledEsperado.id : null].filter(Boolean));
  }

  // Perna solta: o componente está ligado ao circuito, mas uma das pernas não encosta em nada.
  for (const c of projeto.components) {
    const t = TIPOS[c.type];
    if (t.placa || c.type === "arduino-uno-r3") continue;
    const soltos = [];
    // O cursor do potenciômetro é a saída: solto, ele só não está sendo usado ainda.
    const lados = c.type === "botao" ? [["1a", "1b"], ["2a", "2b"]] : t.terminais.filter((x) => x.id !== "cursor").map((x) => [x.id]);
    for (const lado of lados) {
      const ligado = lado.some((id) => redes.redes[redes.rede(`${c.id}:${id}`)].some((ref) => ref.split(":")[0] !== c.id && ehTerminalDeParte(porId, ref)));
      if (!ligado) soltos.push(lado[0]);
    }
    if (soltos.length && soltos.length < lados.length) {
      for (const id of soltos) {
        const nome = nomeDoTerminal(c, id);
        const volta = c.type === "led" && id === "catodo" ? ": falta o caminho de volta até o − (ou o GND)" : "";
        add("dica", "perna-solta", `${capitalizar(nome)} de ${rotulo(c)} não chega a nenhum componente${volta}.`, [c.id]);
      }
    }
  }

  return itens.sort((a, b) => NIVEIS[a.nivel] - NIVEIS[b.nivel]);
}

function ehTerminalDeParte(porId, ref) {
  const [id] = separarTerminal(ref);
  const comp = porId.get(id);
  return Boolean(comp) && !ehProtoboard(comp.type);
}

function ehTerminalDeFonte(porId, ref) {
  const [id, pino] = separarTerminal(ref);
  const comp = porId.get(id);
  if (!comp) return false;
  if (comp.type === "pilhas" || comp.type === "bateria-9v") return true;
  return comp.type === "arduino-uno-r3" && /^(5V|3\.3V|GND\.\d|D\d+|A\d)$/.test(pino);
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
