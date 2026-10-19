// Os circuitos publicados (experimentos e exemplos) são válidos e dão as leituras que os roteiros citam.

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { analisar, formatar } from "../circuito.js";
import { diagnosticar } from "../diagnostico.js";
import { validar } from "../projeto.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const LABORATORIOS = join(RAIZ, "conteudo");

function circuitos(pasta) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) return circuitos(caminho);
    return nome === "circuito.json" ? [caminho] : [];
  });
}

function abrir(caminho) {
  const r = validar(JSON.parse(readFileSync(caminho, "utf8")));
  assert.ok(r.ok, `${relative(RAIZ, caminho)}:\n${r.erros.join("\n")}`);
  return r.projeto;
}

test("todo circuito.json do conteúdo é válido e começa sem erro nem aviso (os desafios começam errados de propósito)", () => {
  const todos = circuitos(LABORATORIOS);
  assert.ok(todos.length >= 3, "nenhum circuito encontrado");
  for (const caminho of todos) {
    const p = abrir(caminho);
    const a = analisar(p);
    assert.ok(a.convergiu, `${relative(RAIZ, caminho)}: a conta não fechou`);
    if (p.desafio) continue; // o que o aluno precisa consertar; desafios.test.js confere que o início não passa
    const ruins = diagnosticar(p, a).filter((d) => d.nivel !== "dica");
    assert.deepEqual(ruins.map((d) => d.mensagem), [], relative(RAIZ, caminho));
  }
});

test("exemplos.json aponta para circuitos que existem", () => {
  const base = join(LABORATORIOS, "sistemas-digitais", "laboratorio");
  const lista = JSON.parse(readFileSync(join(base, "exemplos.json"), "utf8")).exemplos;
  assert.ok(lista.length >= 3);
  for (const ex of lista) {
    assert.ok(ex.titulo && ex.arquivo, JSON.stringify(ex));
    assert.ok(existsSync(join(base, ex.arquivo)), `${ex.arquivo} não existe`);
  }
});

test("as leituras citadas nos roteiros dos experimentos", () => {
  const exp = (nome) => abrir(join(LABORATORIOS, "sistemas-digitais", "laboratorio", "experimentos", nome, "circuito.json"));
  const mm = (p) => analisar(p).componentes.mm1.texto;
  const muda = (p, fn) => {
    const q = JSON.parse(JSON.stringify(p));
    fn(q);
    const r = validar(q);
    assert.ok(r.ok, r.erros.join("\n"));
    return r.projeto;
  };
  const comp = (p, id) => p.components.find((c) => c.id === id);
  const fio = (p, id) => p.connections.find((f) => f.id === id);

  const p1 = exp("01-led-com-resistor");
  assert.equal(mm(p1), "17,9 mA");
  assert.equal(mm(muda(p1, (q) => { comp(q, "r1").props.ohms = 270; })), "25,9 mA");
  assert.equal(mm(muda(p1, (q) => { comp(q, "r1").props.ohms = 100; })), "66,3 mA");

  const p2 = exp("02-serie-e-paralelo");
  assert.equal(mm(p2), "6,19 V");
  assert.equal(mm(muda(p2, (q) => { fio(q, "w5").to = "pb1:d3"; fio(q, "w6").to = "pb1:c7"; })), "2,81 V");
  assert.equal(formatar(analisar(p2).componentes.r1.corrente, "A"), "2,81 mA");

  const p3 = exp("03-divisor-de-tensao");
  assert.equal(mm(p3), "4,50 V");
  assert.equal(mm(muda(p3, (q) => { comp(q, "r2").props.ohms = 22000; })), "6,18 V");
  const cursor = (pos) => mm(muda(p3, (q) => { comp(q, "pot1").props.posicao = pos; fio(q, "w5").to = "pb1:i19"; }));
  assert.deepEqual([0, 25, 50, 75, 100].map(cursor), ["450 µV", "2,25 V", "4,50 V", "6,75 V", "9,00 V"]);
  const luz = (l) => mm(muda(p3, (q) => { comp(q, "ldr1").props.luz = l; fio(q, "w5").to = "pb1:e26"; }));
  assert.deepEqual([luz(0), luz(100)], ["89,0 mV", "8,18 V"]);
});
