import assert from "node:assert/strict";
import test from "node:test";

import { baudPadrao, normalizarCodigo } from "../programa.js";

test("o código que o aluno não mexeu é reconhecido, mesmo com fim de linha e espaços diferentes", () => {
  const original = "void setup() {\n  pinMode(8, OUTPUT);\n}\n";
  assert.equal(normalizarCodigo(original), normalizarCodigo("void setup() {  \r\n  pinMode(8, OUTPUT);\r\n}\r\n\r\n"));
  assert.notEqual(normalizarCodigo(original), normalizarCodigo(original.replace("8", "7")), "trocar o pino é código editado");
});

test("a velocidade da serial aparece como a do Serial.begin", () => {
  assert.equal(baudPadrao(16e6 / (8 * 208)), 9600); // 9615,4 baud de verdade
  assert.equal(baudPadrao(16e6 / (8 * 17)), 115200); // 117 647 baud, a 2,1 %
  assert.equal(baudPadrao(0), 0);
});
