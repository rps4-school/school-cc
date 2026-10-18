// Testes do corretor (corretor.js). Rode com: node --test .mkdocs/corretor.test.js
"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { conferirPorTipo } = require("./corretor.js");

const RAIZ = path.join(__dirname, "..");
// Igual ao RESPOSTA do visual.py.
const RESPOSTA = /^\*\*(Resposta|Expressão|Expressão mínima|Número|Grandeza|Função|Primitiva):\*\* `([^`]+)`/gm;
const TIPOS = {
  Resposta: "valor", Expressão: "expressao", "Expressão mínima": "minima",
  Número: "numero", Grandeza: "grandeza", Função: "funcao", Primitiva: "primitiva",
};
// Gabarito de Grandeza termina na unidade: "20 mA", "4,7 kΩ", "215 Ω ± 5 Ω".
const UNIDADE_NO_FIM = /(Ω|V|A|W|Hz|s|F)$/;

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
      // Cada alternativa ("a | b") tem que passar sozinha; no Número e na Grandeza, sem a tolerância.
      const alternativas = ["valor", "numero", "grandeza"].includes(tipo) ? m[2].split(" | ") : [m[2]];
      for (const alternativa of alternativas) {
        total++;
        const digitado = alternativa.replace(/\s*±.*$/, "");
        if (tipo === "grandeza" && !UNIDADE_NO_FIM.test(digitado.trim())) {
          falhas.push(`${path.relative(RAIZ, arquivo)}: Grandeza \`${m[2]}\` sem unidade no gabarito`);
        }
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

test("grandeza: unidade, prefixo e número sem unidade", () => {
  // Resistência: Ω (ômega grego), Ω (sinal de ohm), ohm, prefixo e código de resistor.
  for (const digitado of ["220", "220 Ω", "220Ω", "220 Ω", "220 ohms", "220 Ohm", "0,22 kΩ", "0.22k", "220R", "R = 220 Ω"]) {
    assert.ok(confere("grandeza", "220 Ω", digitado), digitado);
  }
  for (const digitado of ["4k7", "4K7", "4,7k", "4.7 kohm", "4700 Ω", "4700", "4,7"]) {
    assert.ok(confere("grandeza", "4,7 kΩ", digitado), digitado);
  }
  assert.ok(confere("grandeza", "2,2 Ω", "2R2"));
  assert.ok(confere("grandeza", "1,5 MΩ", "1M5"));
  // Corrente: o número sem unidade vale na unidade do gabarito (20) ou na do SI (0,02).
  for (const digitado of ["20", "0,02", "20 mA", "20mA", "20 ma", "0,02 A", "0.020A", "20 miliamperes", "i = 20 mA", "20000 µA", "20000 uA"]) {
    assert.ok(confere("grandeza", "20 mA", digitado), digitado);
  }
  for (const digitado of ["20 A", "20 MA", "2 mA", "200 mA", "0,2"]) {
    assert.ok(!confere("grandeza", "20 mA", digitado), digitado);
  }
  // Tensão, potência, tempo, frequência e capacitância.
  assert.ok(confere("grandeza", "2,5 V", "2.5 volts"));
  assert.ok(confere("grandeza", "2,5 V", "2500 mV"));
  assert.ok(confere("grandeza", "1/4 W", "0,25 W"));
  assert.ok(confere("grandeza", "1/4 W", "250 mW"));
  assert.ok(confere("grandeza", "500 ms", "0,5 s"));
  assert.ok(confere("grandeza", "500 ms", "0,5 segundo"));
  assert.ok(confere("grandeza", "490 Hz", "0,49 kHz"));
  assert.ok(confere("grandeza", "100 µF", "100 uF"));
  assert.ok(confere("grandeza", "100 µF", "100 μF"));
  assert.ok(!confere("grandeza", "100 nF", "200 nF")); // valores pequenos não passam por tolerância absoluta
  assert.ok(confere("grandeza", "0 A", "0"));
});

test("grandeza: dicas de unidade, de escala e de leitura", () => {
  const unidade = conferirPorTipo("grandeza", "20 mA", "20 V");
  assert.ok(!unidade.certo && /corrente \(A\)/.test(unidade.dica), unidade.dica);
  const semUnidade = conferirPorTipo("grandeza", "0,02 A", "20");
  assert.ok(!semUnidade.certo && /escreva a unidade/.test(semUnidade.dica), semUnidade.dica);
  assert.ok(!/0,02/.test(semUnidade.dica), "a dica não pode entregar a resposta");
  const prefixo = conferirPorTipo("grandeza", "20 mA", "20 µA");
  assert.ok(!prefixo.certo && /prefixo/.test(prefixo.dica), prefixo.dica);
  const naoEntendeu = conferirPorTipo("grandeza", "20 mA", "vinte");
  assert.ok(!naoEntendeu.certo && /Não entendi/.test(naoEntendeu.dica), naoEntendeu.dica);
  const perto = conferirPorTipo("grandeza", "215 Ω", "212 Ω");
  assert.ok(!perto.certo && /Perto/.test(perto.dica), perto.dica);
});

test("grandeza: tolerância e algarismos significativos", () => {
  assert.ok(confere("grandeza", "215 Ω ± 5 Ω", "220 Ω"));
  assert.ok(!confere("grandeza", "215 Ω ± 5 Ω", "230 Ω"));
  assert.ok(confere("grandeza", "215 Ω ± 5", "0,21 kΩ")); // tolerância sem unidade: na unidade do gabarito
  // Valor que não fecha: vale arredondar ou truncar com 3 algarismos significativos ou mais.
  assert.ok(confere("grandeza", "1/3 A", "0,333 A"));
  assert.ok(confere("grandeza", "1/3 A", "333 mA"));
  assert.ok(confere("grandeza", "1/3 A", "333,3 mA"));
  assert.ok(!confere("grandeza", "1/3 A", "0,33 A"));
  assert.ok(!confere("grandeza", "1/3 A", "0,3 A"));
  assert.ok(confere("grandeza", "9/470 A", "19,1 mA"));
  // Valor exato com 3 algarismos (215 Ω) não aceita arredondar para outro: 220 Ω é o valor comercial, não o calculado.
  assert.ok(!confere("grandeza", "215 Ω", "220 Ω"));
  assert.ok(!confere("grandeza", "215 Ω", "0,22 kΩ"));
});
