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

test("concluir guarda a primeira data", () => {
  const d = p.vazio();
  p.concluir(d, "a/", true, "2026-10-01");
  p.concluir(d, "a/", true, HOJE);
  assert.equal(d.paginas["a/"].concluida, "2026-10-01");
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

// ---------- Revisão: arquivo hostil, dados inválidos, armazenamento cheio ou bloqueado ----------

const RAIZ = "https://rps4-school.github.io/school-cc/";

// localStorage de mentira: falharDepois = quantas gravações dão certo antes de "encher".
function armazenamento(inicial = {}, { falharDepois = Infinity } = {}) {
  const dados = { ...inicial };
  let gravacoes = 0;
  return {
    dados,
    get length() { return Object.keys(dados).length; },
    key: (i) => Object.keys(dados)[i] ?? null,
    getItem: (k) => (Object.prototype.hasOwnProperty.call(dados, k) ? dados[k] : null),
    setItem: (k, v) => {
      if (++gravacoes > falharDepois) throw new Error("QuotaExceededError");
      dados[k] = String(v);
    },
    removeItem: (k) => { delete dados[k]; },
  };
}

test("lerArquivo recusa caminhos que saem do site ou mexem no protótipo", () => {
  for (const caminho of ["//evil.example/x/", "../outro-repo/", "conteudo/../x/", "a//b/", "__proto__/"]) {
    const arquivo = `{"versao":1,"paginas":{${JSON.stringify(caminho)}:{"acertos":{},"erros":{}}},"dias":[],"ultima":null}`;
    assert.throws(() => p.lerArquivo(arquivo), undefined, caminho);
  }
  assert.throws(() => p.lerArquivo('{"versao":1,"paginas":{"__proto__":{"concluida":"2020-01-01"}},"dias":[]}'));
  assert.throws(() => p.lerArquivo(JSON.stringify({ versao: 1, paginas: {}, dias: [], ultima: { pagina: "//evil.example/", titulo: "x" } })));
  assert.equal(({}).concluida, undefined);
});

test("pagina() não grava fora de um caminho válido (nem no protótipo)", () => {
  const d = p.vazio();
  p.concluir(d, "__proto__", true, HOJE);
  p.conferiu(d, "//evil.example/", "0:1", true, { valor: "1" }, HOJE);
  assert.equal(({}).concluida, undefined);
  assert.deepEqual(Object.keys(d.paginas), []);
});

test("endereco só devolve endereços do próprio site", () => {
  assert.equal(p.endereco("conteudo/calculo/", RAIZ), RAIZ + "conteudo/calculo/");
  assert.equal(p.endereco("//evil.example/x/", RAIZ), RAIZ);
  assert.equal(p.endereco("../outro-repo/", RAIZ), RAIZ);
  assert.equal(p.endereco("https://evil.example/", RAIZ), RAIZ);
});

test("valido confere o tipo de cada campo", () => {
  const base = () => ({ versao: 1, paginas: { "a/": { acertos: {}, erros: {} } }, dias: [], ultima: null });
  const ruins = [
    (d) => { d.paginas["a/"].erros["0:1"] = null; },
    (d) => { d.paginas["a/"].erros["0:1"] = { rotulo: 5, ancora: "x" }; },
    (d) => { d.paginas["a/"].acertos["0:1"] = 7; },
    (d) => { d.paginas["a/"].concluida = 20261017; },
    (d) => { d.ultima = { pagina: "a/", titulo: 3, tema: "t" }; },
  ];
  for (const estragar of ruins) {
    const d = base();
    estragar(d);
    assert.throws(() => p.lerArquivo(JSON.stringify(d)), undefined, JSON.stringify(d));
  }
  assert.doesNotThrow(() => p.lerArquivo(JSON.stringify(base())));
});

test("desmarcar grava a recusa (false); concluir de novo grava a data; importar prefere a data", () => {
  const d = p.vazio();
  p.concluir(d, "a/", true, "2026-10-01");
  p.concluir(d, "a/", false, HOJE);
  assert.equal(d.paginas["a/"].concluida, false);
  assert.doesNotThrow(() => p.lerArquivo(JSON.stringify(d)));
  const outro = p.vazio();
  p.concluir(outro, "a/", true, "2026-10-05");
  assert.equal(p.juntar(d, outro).paginas["a/"].concluida, "2026-10-05");
  assert.equal(p.juntar(outro, d).paginas["a/"].concluida, "2026-10-05");
  p.concluir(d, "a/", true, HOJE);
  assert.equal(d.paginas["a/"].concluida, HOJE);
});

test("armazenamento cheio: a mudança fica na memória e o armazém avisa", () => {
  const a = p.armazem(armazenamento({}, { falharDepois: 2 })); // 1ª gravação é o teste de disponibilidade
  const d = a.carregar();
  p.concluir(d, "a/", true, HOJE);
  assert.equal(a.salvar(d), true);
  const d2 = a.carregar();
  p.concluir(d2, "b/", true, HOJE);
  assert.equal(a.salvar(d2), false);
  assert.equal(a.disponivel(), false);
  assert.equal(a.carregar().paginas["b/"].concluida, HOJE, "não perdeu a mudança");
});

test("migração só apaga as chaves antigas se conseguiu salvar", () => {
  const antiga = p.CHAVE_ANTIGA + "/school-cc/conteudo/a/";
  const cheio = armazenamento({ [antiga]: '{"0:1":"1"}' }, { falharDepois: 1 });
  p.armazem(cheio).migrar("/school-cc/");
  assert.equal(cheio.dados[antiga], '{"0:1":"1"}');
  const ok = armazenamento({ [antiga]: '{"0:1":"1"}' });
  const a = p.armazem(ok);
  a.migrar("/school-cc/");
  assert.equal(ok.dados[antiga], undefined);
  assert.equal(a.carregar().paginas["conteudo/a/"].acertos["0:1"], "1");
});

test("dado salvo inválido vai para a chave de recuperação e não se perde", () => {
  const s = armazenamento({ "school-cc:progresso": "{quebrado" });
  const a = p.armazem(s);
  assert.equal(s.dados["school-cc:progresso:recuperar"], "{quebrado");
  const d = a.carregar();
  assert.deepEqual(d.paginas, {});
  p.concluir(d, "a/", true, HOJE);
  assert.equal(a.salvar(d), true);
  assert.equal(s.dados["school-cc:progresso:recuperar"], "{quebrado");
  assert.equal(JSON.parse(s.dados["school-cc:progresso"]).paginas["a/"].concluida, HOJE);
});

test("dado de uma versão mais nova do site não é sobrescrito", () => {
  const novo = JSON.stringify({ versao: 2, coisas: [1, 2] });
  const s = armazenamento({ "school-cc:progresso": novo });
  const a = p.armazem(s);
  assert.equal(a.disponivel(), false);
  assert.equal(a.salvar(a.carregar()), false);
  assert.equal(s.dados["school-cc:progresso"], novo);
});

test("sem localStorage: funciona só na memória", () => {
  const a = p.armazem(null);
  assert.equal(a.disponivel(), false);
  const d = a.carregar();
  p.concluir(d, "a/", true, HOJE);
  assert.equal(a.salvar(d), false);
  assert.equal(a.carregar().paginas["a/"].concluida, HOJE);
});
