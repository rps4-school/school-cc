// Onde cada coisa fica no desenho: terminais, encaixe pela pegada e a caixa de cada componente.
// Coordenadas "do mundo": as mesmas do x/y do projeto, antes do zoom.

import { pegada, posicaoLivre, terminaisDoTipo, TIPOS } from "./catalogo.js";
import { deslocar, dimensoes, ehProtoboard, furoMaisPerto, lerFuro, posicaoDoFuro } from "./protoboard.js";
import { separarTerminal } from "./projeto.js";

export function porId(projeto, id) {
  return projeto.components.find((c) => c.id === id) || null;
}

// Posição de um terminal ("pb:a5", "r1:2", "uno:D8").
export function posicaoDoTerminal(projeto, ref) {
  const [id, pino] = separarTerminal(ref);
  const comp = porId(projeto, id);
  if (!comp) return null;
  if (ehProtoboard(comp.type)) {
    const p = posicaoDoFuro(comp.type, pino);
    return p ? { x: comp.x + p.x, y: comp.y + p.y } : null;
  }
  const furo = comp.mount && comp.mount[pino];
  if (furo) return posicaoDoTerminal(projeto, furo);
  return posicaoLivre(comp, pino);
}

export function posicoesDoComponente(projeto, comp) {
  const saida = {};
  for (const t of terminaisDoTipo(comp.type)) saida[t.id] = posicaoDoTerminal(projeto, `${comp.id}:${t.id}`);
  return saida;
}

// Caixa (x, y, largura, altura) que envolve o desenho do componente.
export function caixa(projeto, comp) {
  const t = TIPOS[comp.type];
  if (ehProtoboard(comp.type)) {
    const d = dimensoes(comp.type);
    return { x: comp.x, y: comp.y, largura: d.largura, altura: d.altura };
  }
  if (t.livre) {
    const rot = (((comp.rot || 0) % 360) + 360) % 360;
    const deitado = rot === 90 || rot === 270;
    const [l, a] = deitado ? [t.altura, t.largura] : [t.largura, t.altura];
    const cantos = [[0, 0], [t.largura, t.altura]].map(([dx, dy]) => {
      const [rx, ry] = rot === 90 ? [-dy, dx] : rot === 180 ? [-dx, -dy] : rot === 270 ? [dy, -dx] : [dx, dy];
      return [comp.x + rx, comp.y + ry];
    });
    return { x: Math.min(cantos[0][0], cantos[1][0]), y: Math.min(cantos[0][1], cantos[1][1]), largura: l, altura: a };
  }
  const pts = Object.values(posicoesDoComponente(projeto, comp)).filter(Boolean);
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const folga = 14;
  return {
    x: Math.min(...xs) - folga,
    y: Math.min(...ys) - folga - 8,
    largura: Math.max(...xs) - Math.min(...xs) + 2 * folga,
    altura: Math.max(...ys) - Math.min(...ys) + 2 * folga + 8,
  };
}

// Furos ocupados por pernas de componentes (menos os do componente `exceto`).
export function furosOcupados(projeto, exceto = null) {
  const ocupados = new Map();
  for (const c of projeto.components) {
    if (c.id === exceto) continue;
    for (const furo of Object.values(c.mount || {})) ocupados.set(furo, c.id);
  }
  return ocupados;
}

// Encaixe de um componente com o primeiro terminal no furo `ref` ("pb:c10"), seguindo a pegada girada.
// Devolve { mount } se todos os furos existem e estão livres, ou { erro } dizendo o que impede.
export function encaixarPelaPegada(projeto, comp, ref) {
  const [placaId, furo] = separarTerminal(ref);
  const placa = porId(projeto, placaId);
  const pg = pegada(comp.type, comp.rot || 0);
  if (!placa || !ehProtoboard(placa.type) || !pg) return { erro: "Este componente não encaixa aí." };
  const ocupados = furosOcupados(projeto, comp.id);
  const mount = {};
  const terminais = terminaisDoTipo(comp.type);
  for (let i = 0; i < terminais.length; i++) {
    const alvo = deslocar(placa.type, furo, pg[i][0], pg[i][1]);
    if (!alvo) return { erro: "As pernas passariam da borda da protoboard ou cairiam num barramento." };
    const r = `${placaId}:${alvo}`;
    if (ocupados.has(r)) return { erro: `O furo ${alvo} já está ocupado.` };
    mount[terminais[i].id] = r;
  }
  return { mount };
}

// O furo de alguma protoboard mais perto do ponto (x, y) do mundo: "pb:c10" ou null.
export function furoNoPonto(projeto, x, y, raio) {
  let melhor = null;
  for (const c of projeto.components) {
    if (!ehProtoboard(c.type)) continue;
    const d = dimensoes(c.type);
    if (x < c.x - 10 || y < c.y - 10 || x > c.x + d.largura + 10 || y > c.y + d.altura + 10) continue;
    const furo = furoMaisPerto(c.type, x - c.x, y - c.y, raio);
    if (furo) melhor = `${c.id}:${furo}`;
  }
  return melhor;
}

// Tira de um furo da área central: "pb:12:ae" (coluna 12, linhas a–e). Barramento: null.
function tiraDoFuro(ref) {
  const [placa, furo] = separarTerminal(ref);
  const f = lerFuro(furo);
  return f && f.linha ? `${placa}:${f.coluna}:${f.linha <= "e" ? "ae" : "fj"}` : null;
}

// Primeiro lugar livre na protoboard para a pegada do componente, sem encostar em tiras que já têm
// pernas (senão o componente novo já nasceria ligado a outro) e com uma coluna de folga para os lados.
// Serve para o "Adicionar" sem arrastar.
export function primeiroEncaixeLivre(projeto, comp) {
  const tirasUsadas = new Set([...furosOcupados(projeto, comp.id).keys()].map(tiraDoFuro));
  const livre = (mount) => {
    const tirasNovas = Object.values(mount).map(tiraDoFuro);
    if (tirasNovas.includes(null)) return false;
    return tirasNovas.every((tira) => {
      const [placa, coluna, metade] = tira.split(":");
      const colunas = tirasNovas.filter((x) => x.endsWith(`:${metade}`)).map((x) => Number(x.split(":")[1]));
      for (let c = Math.min(...colunas) - 1; c <= Math.max(...colunas) + 1; c++) {
        if (tirasUsadas.has(`${placa}:${c}:${metade}`)) return false;
      }
      return Number(coluna) > 0;
    });
  };
  for (const placa of projeto.components) {
    if (!ehProtoboard(placa.type)) continue;
    const colunas = placa.type === "protoboard-830" ? 63 : 30;
    for (let c = 2; c <= colunas; c++) {
      for (const linha of ["c", "h"]) {
        const r = encaixarPelaPegada(projeto, comp, `${placa.id}:${linha}${c}`);
        if (r.mount && livre(r.mount)) return r.mount;
      }
    }
  }
  return null;
}
