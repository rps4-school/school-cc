// Redes do circuito: grupos de terminais ligados entre si, por union-find.
//
// Entram os fios, as pernas encaixadas na protoboard, as tiras de dentro da protoboard e as ligações
// internas dos componentes (os GND do Uno, os pares do botão, a chave fechada).

import { ligacoesInternas, terminaisDoTipo } from "./catalogo.js";
import { ehProtoboard, furos, tiras } from "./protoboard.js";

class Conjuntos {
  constructor() {
    this.pai = new Map();
  }

  incluir(x) {
    if (!this.pai.has(x)) this.pai.set(x, x);
  }

  achar(x) {
    this.incluir(x);
    let r = x;
    while (this.pai.get(r) !== r) r = this.pai.get(r);
    while (this.pai.get(x) !== r) {
      const proximo = this.pai.get(x);
      this.pai.set(x, r);
      x = proximo;
    }
    return r;
  }

  unir(a, b) {
    const ra = this.achar(a);
    const rb = this.achar(b);
    if (ra !== rb) this.pai.set(rb, ra);
  }
}

export function terminaisDoComponente(comp) {
  if (ehProtoboard(comp.type)) return furos(comp.type).map((f) => f.id);
  return terminaisDoTipo(comp.type).map((t) => t.id);
}

// { rede(ref) → índice, redes: [[refs]], mesmaRede(a, b) }
export function montarRedes(projeto) {
  const u = new Conjuntos();
  for (const comp of projeto.components) {
    for (const t of terminaisDoComponente(comp)) u.incluir(`${comp.id}:${t}`);
    if (ehProtoboard(comp.type)) {
      for (const tira of tiras(comp.type)) {
        for (let i = 1; i < tira.length; i++) u.unir(`${comp.id}:${tira[0]}`, `${comp.id}:${tira[i]}`);
      }
    }
    for (const [a, b] of ligacoesInternas(comp)) u.unir(`${comp.id}:${a}`, `${comp.id}:${b}`);
    for (const [pino, furo] of Object.entries(comp.mount || {})) u.unir(`${comp.id}:${pino}`, furo);
  }
  for (const fio of projeto.connections) u.unir(fio.from, fio.to);

  const indice = new Map();
  const redes = [];
  for (const ref of u.pai.keys()) {
    const raiz = u.achar(ref);
    if (!indice.has(raiz)) {
      indice.set(raiz, redes.length);
      redes.push([]);
    }
    redes[indice.get(raiz)].push(ref);
  }
  const rede = (ref) => {
    if (!u.pai.has(ref)) return -1;
    return indice.get(u.achar(ref));
  };
  return { rede, redes, mesmaRede: (a, b) => rede(a) >= 0 && rede(a) === rede(b) };
}
