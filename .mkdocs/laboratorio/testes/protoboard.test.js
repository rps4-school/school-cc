import assert from "node:assert/strict";
import test from "node:test";

import { deslocar, existeFuro, furoMaisPerto, furos, lerFuro, nomeDoFuro, posicaoDoFuro, tiras } from "../protoboard.js";

function tiraDe(tipo, id) {
  return tiras(tipo).find((t) => t.includes(id));
}

test("as protoboards têm 400 e 830 furos", () => {
  assert.equal(furos("protoboard-400").length, 400);
  assert.equal(furos("protoboard-830").length, 830);
  assert.equal(new Set(furos("protoboard-830").map((f) => f.id)).size, 830);
});

test("a–e de uma coluna são uma tira, separada de f–j pelo canal", () => {
  const tipo = "protoboard-400";
  assert.deepEqual(tiraDe(tipo, "c7"), ["a7", "b7", "c7", "d7", "e7"]);
  assert.deepEqual(tiraDe(tipo, "h7"), ["f7", "g7", "h7", "i7", "j7"]);
  assert.ok(!tiraDe(tipo, "a7").includes("a8"), "colunas vizinhas não se ligam");
});

test("barramento inteiro na de 400 e dividido no meio na de 830", () => {
  assert.equal(tiraDe("protoboard-400", "cima+1").length, 25);
  assert.ok(tiraDe("protoboard-400", "cima+1").includes("cima+25"));
  assert.ok(!tiraDe("protoboard-400", "cima+1").includes("cima-1"), "+ e − são tiras diferentes");
  assert.equal(tiraDe("protoboard-830", "baixo-1").length, 25);
  assert.ok(!tiraDe("protoboard-830", "baixo-25").includes("baixo-26"), "as metades não se ligam");
  assert.ok(tiraDe("protoboard-830", "baixo-26").includes("baixo-50"));
});

test("nomes, deslocamento e furo mais perto", () => {
  assert.deepEqual(lerFuro("j30"), { linha: "j", coluna: 30 });
  assert.deepEqual(lerFuro("cima-3"), { barramento: "cima-", furo: 3 });
  assert.equal(lerFuro("k1"), null);
  assert.equal(nomeDoFuro("e12"), "coluna 12, linha e");
  assert.equal(nomeDoFuro("cima-3"), "barramento − de cima, furo 3");
  assert.equal(deslocar("protoboard-400", "e5", 0, 1), "f5", "atravessa o canal");
  assert.equal(deslocar("protoboard-400", "a28", 4, 0), null, "passa da coluna 30");
  assert.equal(deslocar("protoboard-400", "cima+1", 1, 0), null, "barramento não desloca");
  assert.ok(existeFuro("protoboard-830", "j63"));
  assert.ok(!existeFuro("protoboard-400", "j31"));
  const p = posicaoDoFuro("protoboard-400", "f9");
  assert.equal(furoMaisPerto("protoboard-400", p.x + 3, p.y - 4), "f9");
  assert.equal(furoMaisPerto("protoboard-400", -100, -100), null);
});
