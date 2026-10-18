// Apoio dos testes: monta um projeto válido a partir de componentes e fios curtos de escrever.

import { validar, VERSAO } from "../projeto.js";

// fios: [["bat:+", "pb:cima+1"], ...] ou objetos { from, to, color }.
export function montar(componentes, fios = []) {
  const dados = {
    schemaVersion: VERSAO,
    id: "teste",
    title: "Teste",
    components: componentes,
    connections: fios.map((f, i) => (Array.isArray(f) ? { id: `w${i + 1}`, from: f[0], to: f[1] } : { id: `w${i + 1}`, ...f })),
  };
  const r = validar(dados);
  if (!r.ok) throw new Error(`projeto inválido no teste:\n${r.erros.join("\n")}`);
  return r.projeto;
}

// Bateria de 9 V solta, protoboard de 400 furos e um fio de cada polo para os barramentos de cima.
export function bancada(extras = [], fios = []) {
  return montar(
    [{ id: "pb", type: "protoboard-400", x: 0, y: 0 }, { id: "bat", type: "bateria-9v", x: -120, y: 40 }, ...extras],
    [["bat:+", "pb:cima+1"], ["bat:-", "pb:cima-1"], ...fios],
  );
}

export function perto(real, esperado, tolerancia = 1e-3) {
  return Math.abs(real - esperado) <= Math.abs(esperado) * tolerancia + 1e-12;
}
