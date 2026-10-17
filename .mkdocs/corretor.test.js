// Testes do corretor (corretor.js). Rode com: node --test .mkdocs/corretor.test.js
"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { conferirPorTipo } = require("./corretor.js");

const RAIZ = path.join(__dirname, "..");
// Igual ao RESPOSTA do visual.py.
const RESPOSTA = /^\*\*(Resposta|Expressão|Expressão mínima|Número|Função|Primitiva):\*\* `([^`]+)`/gm;
const TIPOS = {
  Resposta: "valor", Expressão: "expressao", "Expressão mínima": "minima",
  Número: "numero", Função: "funcao", Primitiva: "primitiva",
};

function arquivosMd(pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = path.join(pasta, item.name);
    if (item.isDirectory()) return item.name.startsWith(".") || item.name === "node_modules" ? [] : arquivosMd(caminho);
    return item.name.endsWith(".md") ? [caminho] : [];
  });
}

function confere(tipo, gabarito, digitado) {
  return conferirPorTipo(tipo, gabarito, digitado).certo;
}

test("todo gabarito passa no próprio corretor", () => {
  const falhas = [];
  let total = 0;
  for (const arquivo of arquivosMd(RAIZ)) {
    for (const m of fs.readFileSync(arquivo, "utf8").matchAll(RESPOSTA)) {
      const tipo = TIPOS[m[1]];
      // Cada alternativa ("a | b") tem que passar sozinha; no Número, sem a tolerância.
      const alternativas = tipo === "valor" || tipo === "numero" ? m[2].split(" | ") : [m[2]];
      for (const alternativa of alternativas) {
        total++;
        const digitado = alternativa.replace(/\s*±.*$/, "");
        let certo;
        try { certo = confere(tipo, m[2], digitado); } catch (e) { certo = false; }
        if (!certo) falhas.push(`${path.relative(RAIZ, arquivo)}: ${m[1]} \`${m[2]}\` recusa "${digitado}"`);
      }
    }
  }
  assert.ok(total > 0, "nenhum gabarito encontrado");
  assert.deepStrictEqual(falhas, []);
});

test("número: arredondado ou truncado, com casas e algarismos suficientes", () => {
  assert.ok(confere("numero", "1/3", "0,33"));
  assert.ok(confere("numero", "1/3", "0,3333"));
  assert.ok(confere("numero", "2/3", "0,67"));
  assert.ok(confere("numero", "2/3", "0,66"));
  assert.ok(confere("numero", "-1/16", "-0,063"));
  assert.ok(confere("numero", "1/1024", "0,000977"));
  assert.ok(confere("numero", "1/1024", "0,00098"));
  assert.ok(!confere("numero", "1/3", "0,34"));
  assert.ok(!confere("numero", "1/3", "0,3"));
  assert.ok(!confere("numero", "1/1024", "0,00"));
  assert.ok(!confere("numero", "4", "4,01"));
  assert.ok(!confere("numero", "4", "3,99"));
  assert.ok(!confere("numero", "0", "0,01"));
  assert.ok(confere("numero", "4", "4,00"));
});

test("número: tolerância explícita vale sozinha", () => {
  assert.ok(confere("numero", "√5 ± 0,0001", "2,2361"));
  assert.ok(!confere("numero", "√5 ± 0,0001", "2,24"));
});

test("número: separador de milhar", () => {
  assert.ok(confere("numero", "2000", "2.000"));
  assert.ok(confere("numero", "2000", "2 000"));
  assert.ok(confere("numero", "2937,5", "2.937,5"));
  assert.ok(confere("numero", "2937,5", "2 937,5"));
  assert.ok(confere("numero", "16777216", "16.777.216"));
  assert.ok(confere("numero", "2", "2.000"));
  assert.ok(confere("numero", "0,375", "0.375"));
});

test("primitiva: ln sem módulo é recusado", () => {
  assert.ok(confere("primitiva", "ln|x| + C", "ln|x| + C"));
  assert.ok(!confere("primitiva", "ln|x| + C", "ln(x) + C"));
  assert.ok(confere("primitiva", "-ln|cos(x)| + C", "ln|sec x| + C"));
});

test("função: sen^n, sec e argumento sem parênteses", () => {
  assert.ok(confere("primitiva", "sen(x)^5/5 + C", "sen^5(x)/5 + C"));
  assert.ok(confere("funcao", "1/(x ln(2x))", "1/(x ln 2x)"));
  assert.ok(confere("funcao", "sen(x) cos(x)", "sen x cos x"));
  assert.ok(confere("funcao", "ln(x) + 1", "ln x + 1"));
  assert.ok(confere("funcao", "1/(x ln 3)", "1/(x*ln(3))"));
});
