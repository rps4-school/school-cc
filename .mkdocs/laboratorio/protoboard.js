// Protoboards: furos, tiras ligadas por dentro e posição de cada furo no desenho.
//
// Nomes dos furos: "a1" a "j30" na área central (linha + coluna) e "cima+1", "cima-1", "baixo-1",
// "baixo+1"... nos barramentos. Na área central, a–e de uma coluna formam uma tira, e f–j outra:
// o canal do meio separa as duas. Cada barramento é uma tira só, ou duas, na protoboard grande,
// em que eles são divididos no meio (a pegadinha da aula 13).

export const PASSO = 16; // distância entre furos no desenho (2,54 mm na vida real)
export const LINHAS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
export const BARRAMENTOS = ["cima+", "cima-", "baixo-", "baixo+"];

export const MODELOS = {
  "protoboard-400": { nome: "Protoboard de 400 furos", colunas: 30, furosNoBarramento: 25, dividido: false, inicioBarramento: 1 },
  "protoboard-830": { nome: "Protoboard de 830 furos", colunas: 63, furosNoBarramento: 50, dividido: true, inicioBarramento: 2 },
};

// Altura de cada fileira de furos, em passos: barramentos de cima, números, a–e, canal, f–j, números, barramentos de baixo.
const Y_BARRAMENTO = { "cima+": 1, "cima-": 2, "baixo-": 16, "baixo+": 17 };
const Y_LINHA = { a: 4, b: 5, c: 6, d: 7, e: 8, f: 10, g: 11, h: 12, i: 13, j: 14 };
const FURO = /^([a-j])(\d+)$|^(cima[+-]|baixo[+-])(\d+)$/;

const cache = new Map();

function modelo(tipo) {
  const m = MODELOS[tipo];
  if (!m) throw new Error(`protoboard desconhecida: ${tipo}`);
  return m;
}

export function ehProtoboard(tipo) {
  return Object.prototype.hasOwnProperty.call(MODELOS, tipo);
}

// Coluna do furo k (1, 2, ...) de um barramento: grupos de 5 furos com um espaço entre eles.
function colunaDoBarramento(m, k) {
  const grupo = Math.floor((k - 1) / 5);
  return m.inicioBarramento + grupo * 6 + ((k - 1) % 5);
}

export function xDaColuna(coluna) {
  return (coluna + 1) * PASSO; // coluna 1 em 2 passos: sobra espaço para a letra da linha
}

export function dimensoes(tipo) {
  const m = modelo(tipo);
  return { largura: (m.colunas + 3) * PASSO, altura: 18 * PASSO };
}

// Tudo o que não muda numa protoboard, calculado uma vez por modelo.
function dados(tipo) {
  if (cache.has(tipo)) return cache.get(tipo);
  const m = modelo(tipo);
  const furos = [];
  const posicao = new Map();
  const tiras = [];
  for (let c = 1; c <= m.colunas; c++) {
    for (const metade of [LINHAS.slice(0, 5), LINHAS.slice(5)]) {
      const tira = metade.map((l) => `${l}${c}`);
      tiras.push(tira);
      for (const id of tira) {
        const p = { id, x: xDaColuna(c), y: Y_LINHA[id[0]] * PASSO };
        furos.push(p);
        posicao.set(id, p);
      }
    }
  }
  for (const b of BARRAMENTOS) {
    const ks = Array.from({ length: m.furosNoBarramento }, (_, i) => i + 1);
    const metades = m.dividido ? [ks.slice(0, ks.length / 2), ks.slice(ks.length / 2)] : [ks];
    for (const metade of metades) {
      const tira = metade.map((k) => `${b}${k}`);
      tiras.push(tira);
      for (const k of metade) {
        const id = `${b}${k}`;
        const p = { id, x: xDaColuna(colunaDoBarramento(m, k)), y: Y_BARRAMENTO[b] * PASSO };
        furos.push(p);
        posicao.set(id, p);
      }
    }
  }
  const d = { modelo: m, furos, posicao, tiras };
  cache.set(tipo, d);
  return d;
}

export function furos(tipo) {
  return dados(tipo).furos;
}

export function tiras(tipo) {
  return dados(tipo).tiras;
}

export function existeFuro(tipo, id) {
  return dados(tipo).posicao.has(id);
}

export function posicaoDoFuro(tipo, id) {
  const p = dados(tipo).posicao.get(id);
  return p ? { x: p.x, y: p.y } : null;
}

// "a12" → { linha: "a", coluna: 12 }; "cima+3" → { barramento: "cima+", furo: 3 }.
export function lerFuro(id) {
  const m = FURO.exec(id);
  if (!m) return null;
  return m[1] ? { linha: m[1], coluna: Number(m[2]) } : { barramento: m[3], furo: Number(m[4]) };
}

export function nomeDoFuro(id) {
  const f = lerFuro(id);
  if (!f) return id;
  if (f.linha) return `coluna ${f.coluna}, linha ${f.linha}`;
  const [lado, sinal] = [f.barramento.slice(0, -1), f.barramento.slice(-1)];
  return `barramento ${sinal === "+" ? "+" : "−"} de ${lado}, furo ${f.furo}`;
}

// Furo a dc colunas e dl linhas de distância (só na área central). Fora da placa: null.
export function deslocar(tipo, id, dc, dl) {
  const f = lerFuro(id);
  if (!f || !f.linha) return null;
  const linha = LINHAS.indexOf(f.linha) + dl;
  const coluna = f.coluna + dc;
  if (linha < 0 || linha >= LINHAS.length || coluna < 1 || coluna > modelo(tipo).colunas) return null;
  return `${LINHAS[linha]}${coluna}`;
}

// O furo mais perto de (x, y), em coordenadas da placa, até `raio` de distância.
export function furoMaisPerto(tipo, x, y, raio = PASSO * 0.75) {
  let melhor = null;
  let menor = raio * raio;
  for (const f of dados(tipo).furos) {
    const d = (f.x - x) ** 2 + (f.y - y) ** 2;
    if (d <= menor) {
      menor = d;
      melhor = f.id;
    }
  }
  return melhor;
}

// Rótulos que o desenho escreve: letras das linhas, números das colunas e as faixas dos barramentos.
export function marcas(tipo) {
  const m = modelo(tipo);
  const { largura } = dimensoes(tipo);
  const linhas = LINHAS.map((l) => ({ texto: l, y: Y_LINHA[l] * PASSO }));
  const numeros = [];
  for (let c = 1; c <= m.colunas; c++) {
    if (c === 1 || c % 5 === 0) numeros.push({ texto: String(c), x: xDaColuna(c) });
  }
  const faixas = [];
  for (const b of BARRAMENTOS) {
    const ks = Array.from({ length: m.furosNoBarramento }, (_, i) => i + 1);
    const metades = m.dividido ? [ks.slice(0, ks.length / 2), ks.slice(ks.length / 2)] : [ks];
    const acima = b.startsWith("cima") ? b === "cima+" : b === "baixo-";
    for (const metade of metades) {
      faixas.push({
        sinal: b.slice(-1),
        x1: xDaColuna(colunaDoBarramento(m, metade[0])) - PASSO / 2,
        x2: xDaColuna(colunaDoBarramento(m, metade[metade.length - 1])) + PASSO / 2,
        y: (Y_BARRAMENTO[b] + (acima ? -0.55 : 0.55)) * PASSO,
      });
    }
  }
  return { linhas, numeros, faixas, yNumeros: [3 * PASSO, 15 * PASSO], yCanal: 9 * PASSO, largura };
}
