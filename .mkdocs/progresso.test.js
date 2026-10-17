// Testes do progresso. Rodar: node --test .mkdocs/progresso.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const p = require("./progresso.js");

const HOJE = "2026-10-17";

test("conferiu: erro só entra se a pergunta ainda não foi acertada, e sai quando acerta", () => {
  const d = p.vazio();
  p.conferiu(d, "conteudo/x/", "0:5", false, { rotulo: "Exercício 01 · a)", ancora: "exercicio-01" }, HOJE);
  assert.deepEqual(d.paginas["conteudo/x/"].erros["0:5"], { rotulo: "Exercício 01 · a)", ancora: "exercicio-01" });
  p.conferiu(d, "conteudo/x/", "0:5", true, { valor: "5" }, HOJE);
  assert.equal(d.paginas["conteudo/x/"].acertos["0:5"], "5");
  assert.equal(d.paginas["conteudo/x/"].erros["0:5"], undefined);
  p.conferiu(d, "conteudo/x/", "0:5", false, { rotulo: "r", ancora: "a" }, HOJE);
  assert.equal(d.paginas["conteudo/x/"].erros["0:5"], undefined);
  assert.deepEqual(d.dias, [HOJE]);
});

test("concluir guarda a primeira data; desmarcar apaga", () => {
  const d = p.vazio();
  p.concluir(d, "a/", true, "2026-10-01");
  p.concluir(d, "a/", true, HOJE);
  assert.equal(d.paginas["a/"].concluida, "2026-10-01");
  p.concluir(d, "a/", false, HOJE);
  assert.equal(d.paginas["a/"].concluida, undefined);
});

test("recomecar limpa acertos e erros, mas não a conclusão", () => {
  const d = p.vazio();
  p.conferiu(d, "a/", "0:1", true, { valor: "1" }, HOJE);
  p.concluir(d, "a/", true, HOJE);
  p.recomecar(d, "a/");
  assert.deepEqual(d.paginas["a/"].acertos, {});
  assert.equal(d.paginas["a/"].concluida, HOJE);
});

test("sequencia de dias: conta até hoje, ou até ontem se hoje ainda não estudou, e atravessa o mês", () => {
  const dias = ["2026-09-30", "2026-10-01", "2026-10-02"];
  assert.equal(p.sequencia(dias, "2026-10-02"), 3);
  assert.equal(p.sequencia(dias, "2026-10-03"), 3);
  assert.equal(p.sequencia(dias, "2026-10-04"), 0);
  assert.equal(p.sequencia([], HOJE), 0);
});

test("guarda só os últimos 120 dias", () => {
  const d = p.vazio();
  for (let i = 0; i < 130; i++) p.concluir(d, "p" + i + "/", true, p.dia(new Date(2026, 0, 1 + i)));
  assert.equal(d.dias.length, 120);
  assert.equal(d.dias[0], p.dia(new Date(2026, 0, 11)));
});

test("juntar (importar) une sem apagar nada", () => {
  const a = p.vazio(), b = p.vazio();
  p.concluir(a, "x/", true, "2026-10-10");
  p.concluir(b, "x/", true, "2026-10-05");
  p.conferiu(a, "x/", "1:2", false, { rotulo: "r", ancora: "a" }, "2026-10-10");
  p.conferiu(b, "x/", "1:2", true, { valor: "2" }, "2026-10-05");
  p.conferiu(b, "y/", "0:3", true, { valor: "3" }, "2026-10-06");
  p.visitou(a, { pagina: "x/", titulo: "X", tema: "t", quando: "2026-10-10T10:00:00Z" });
  p.visitou(b, { pagina: "y/", titulo: "Y", tema: "t", quando: "2026-10-12T10:00:00Z" });
  const r = p.juntar(a, b);
  assert.equal(r.paginas["x/"].concluida, "2026-10-05");
  assert.equal(r.paginas["x/"].acertos["1:2"], "2");
  assert.equal(r.paginas["x/"].erros["1:2"], undefined);
  assert.equal(r.paginas["y/"].acertos["0:3"], "3");
  assert.deepEqual(r.dias, ["2026-10-05", "2026-10-06", "2026-10-10"]);
  assert.equal(r.ultima.pagina, "y/");
  assert.equal(a.paginas["y/"], undefined, "não muda o original");
});

test("lerArquivo recusa JSON inválido, outra versão e caminhos perigosos", () => {
  assert.throws(() => p.lerArquivo("{"), /JSON inválido/);
  assert.throws(() => p.lerArquivo(JSON.stringify({ versao: 2, paginas: {}, dias: [] })), /outra versão/);
  const hostil = { versao: 1, paginas: { "javascript:alert(1)": { acertos: {}, erros: {} } }, dias: [], ultima: null };
  assert.throws(() => p.lerArquivo(JSON.stringify(hostil)));
  const ultimaHostil = { versao: 1, paginas: {}, dias: [], ultima: { pagina: "https://mal.example/", titulo: "x" } };
  assert.throws(() => p.lerArquivo(JSON.stringify(ultimaHostil)));
  assert.throws(() => p.lerArquivo(JSON.stringify({ versao: 1, paginas: {}, dias: ["ontem"] })));
  const ok = p.vazio();
  p.conferiu(ok, "conteudo/a/", "0:1", false, { rotulo: "<script>alert(1)</script>", ancora: "x" }, HOJE);
  assert.deepEqual(p.lerArquivo(JSON.stringify(ok)), ok); // o rótulo é só texto: a página usa textContent
});

test("migrar converte as chaves antigas do corretor e devolve o que apagar", () => {
  const d = p.vazio();
  const apagar = p.migrar(d, [
    [p.CHAVE_ANTIGA + "/school-cc/conteudo/calculo/exercicios/04-derivada/facil/", '{"0:9":"9","1:5,2":"5,2"}'],
    [p.CHAVE_ANTIGA + "/school-cc/quebrado/", "{"],
    ["outra-coisa", "1"],
  ], "/school-cc/");
  assert.deepEqual(d.paginas["conteudo/calculo/exercicios/04-derivada/facil/"].acertos, { "0:9": "9", "1:5,2": "5,2" });
  assert.deepEqual(apagar, [p.CHAVE_ANTIGA + "/school-cc/conteudo/calculo/exercicios/04-derivada/facil/", p.CHAVE_ANTIGA + "/school-cc/quebrado/"]);
});
