// Solucionador de corrente contínua por análise nodal.
//
// Cada elemento vira condutância (1/R) e, se tiver tensão própria, uma fonte de corrente equivalente
// (Norton): resistor; fonte com resistência interna (pilha, bateria, 5V do Uno); LED, que é aberto
// abaixo da tensão dele e, acima, uma reta de dois trechos: Vf com uma resistência pequena até a
// corrente do joelho (as contas das aulas) e, passando dele, uma resistência maior (LED sem resistor
// puxa centenas de mA, não dezenas de ampères). Os LEDs mudam de estado até tudo ficar coerente.
// Um nó solto não trava a conta: cada nó tem uma condutância minúscula (1 nS) para a referência.

const GMIN = 1e-9;
const MAX_ITERACOES = 60;

// Resolve A·x = b por eliminação de Gauss com pivô parcial. A é n×n (array de Float64Array).
function gauss(A, b) {
  const n = b.length;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let l = c + 1; l < n; l++) if (Math.abs(A[l][c]) > Math.abs(A[p][c])) p = l;
    if (Math.abs(A[p][c]) < 1e-30) return null;
    if (p !== c) {
      [A[p], A[c]] = [A[c], A[p]];
      [b[p], b[c]] = [b[c], b[p]];
    }
    const piv = A[c][c];
    for (let l = c + 1; l < n; l++) {
      const f = A[l][c] / piv;
      if (f === 0) continue;
      const linha = A[l];
      const base = A[c];
      for (let k = c; k < n; k++) linha[k] -= f * base[k];
      b[l] -= f * b[c];
    }
  }
  const x = new Float64Array(n);
  for (let l = n - 1; l >= 0; l--) {
    let s = b[l];
    for (let k = l + 1; k < n; k++) s -= A[l][k] * x[k];
    x[l] = s / A[l][l];
  }
  return x;
}

// Trecho s do LED aceso (1: até o joelho; 2: acima dele): V = v0 + i/g. Os dois se encontram no joelho.
function trecho(led, s) {
  if (s === 1) return { g: 1 / led.rs, v0: led.vf };
  return { g: 1 / led.rs2, v0: led.vf + led.rs * led.joelho - led.rs2 * led.joelho };
}

// Monta e resolve o sistema com os LEDs num estado fixo. Os nós vão de 0 a nos - 1; o nó `terra` vale 0 V.
function resolverUmaVez(nos, terra, resistores, fontes, leds, estados) {
  const indice = new Int32Array(nos).fill(-1);
  let n = 0;
  for (let i = 0; i < nos; i++) if (i !== terra) indice[i] = n++;
  const A = Array.from({ length: n }, () => new Float64Array(n));
  const b = new Float64Array(n);
  const condutancia = (a, k, g) => {
    const ia = indice[a];
    const ik = indice[k];
    if (ia >= 0) A[ia][ia] += g;
    if (ik >= 0) A[ik][ik] += g;
    if (ia >= 0 && ik >= 0) {
      A[ia][ik] -= g;
      A[ik][ia] -= g;
    }
  };
  // Elemento com tensão própria v entre p e n (corrente sai por p): injeta g·v em p e tira de n.
  const injecao = (p, k, g, v) => {
    if (indice[p] >= 0) b[indice[p]] += g * v;
    if (indice[k] >= 0) b[indice[k]] -= g * v;
  };
  for (let i = 0; i < n; i++) A[i][i] += GMIN;
  for (const r of resistores) condutancia(r.a, r.b, 1 / r.r);
  for (const f of fontes) {
    condutancia(f.p, f.n, 1 / f.rint);
    injecao(f.p, f.n, 1 / f.rint, f.v);
  }
  // LED aceso: Va − Vk = Vf + i·Rs, com i entrando pelo ânodo. É a mesma conta de uma pilha de Vf
  // com o + no ânodo (ela segura a corrente que vem do ânodo).
  leds.forEach((led, i) => {
    if (!estados[i]) return;
    const { g, v0 } = trecho(led, estados[i]);
    condutancia(led.a, led.k, g);
    injecao(led.a, led.k, g, v0);
  });
  const x = n ? gauss(A, b) : new Float64Array(0);
  if (!x) return null;
  const v = new Float64Array(nos);
  for (let i = 0; i < nos; i++) v[i] = indice[i] >= 0 ? x[indice[i]] : 0;
  return v;
}

// entrada: { nos, terra, resistores: [{a, b, r}], fontes: [{p, n, v, rint}], leds: [{a, k, vf, rs, joelho, rs2}] }
// saída: { tensoes, resistores: [i], fontes: [i que sai pelo +], leds: [{ ligado, i, v }], convergiu, iteracoes }
export function resolver({ nos, terra = 0, resistores = [], fontes = [], leds = [] }) {
  leds = leds.map((led) => ({ joelho: Infinity, rs2: 10, ...led }));
  const estados = leds.map(() => 0); // 0 apagado, 1 aceso, 2 aceso acima do joelho
  const corrente = (v, led, s) => {
    if (!s) return 0;
    const { g, v0 } = trecho(led, s);
    return (v[led.a] - v[led.k] - v0) * g;
  };
  let v = null;
  let iteracoes = 0;
  let convergiu = false;
  // A cada volta: corrige os LEDs acesos que saíram do trecho deles (corrente negativa apaga; passou
  // do joelho sobe de trecho; abaixo dele desce). Sem correção, acende só o apagado com mais tensão
  // sobrando: um de cada vez, a conta não fica pulando entre dois estados.
  while (iteracoes < MAX_ITERACOES) {
    iteracoes++;
    v = resolverUmaVez(nos, terra, resistores, fontes, leds, estados);
    if (!v) break;
    let corrigiu = false;
    leds.forEach((led, i) => {
      const s = estados[i];
      const i0 = corrente(v, led, s);
      if (s === 1 && i0 < -1e-12) estados[i] = 0;
      else if (s === 1 && i0 > led.joelho) estados[i] = 2;
      else if (s === 2 && i0 < led.joelho) estados[i] = 1;
      corrigiu = corrigiu || estados[i] !== s;
    });
    if (corrigiu) continue;
    let melhor = -1;
    let folga = 1e-9;
    leds.forEach((led, i) => {
      const sobra = v[led.a] - v[led.k] - led.vf;
      if (!estados[i] && sobra > folga) {
        folga = sobra;
        melhor = i;
      }
    });
    if (melhor < 0) {
      convergiu = true;
      break;
    }
    estados[melhor] = 1;
  }
  if (!v) v = new Float64Array(nos);
  return {
    tensoes: v,
    resistores: resistores.map((r) => (v[r.a] - v[r.b]) / r.r),
    fontes: fontes.map((f) => (f.v - (v[f.p] - v[f.n])) / f.rint),
    leds: leds.map((led, i) => ({ ligado: estados[i] > 0, i: Math.max(0, corrente(v, led, estados[i])), v: v[led.a] - v[led.k] })),
    convergiu,
    iteracoes,
  };
}
