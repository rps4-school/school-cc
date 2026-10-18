// Firmware dos testes: os .hex que o compilar.py gravou em FIRMWARE_DIR.
// Sem FIRMWARE_DIR, os testes que rodam programa ficam "skip", com a mensagem abaixo; com
// EXIGIR_FIRMWARE=1 (na CI), a falta do firmware vira falha.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

export const PASTA = process.env.FIRMWARE_DIR || "";
export const EXIGIR = process.env.EXIGIR_FIRMWARE === "1";
export const MOTIVO = "sem firmware: rode .mkdocs/laboratorio/compilar.py --saida <pasta> e defina FIRMWARE_DIR=<pasta>";

export function firmware(caminho) {
  const arquivo = PASTA && join(PASTA, caminho);
  return arquivo && existsSync(arquivo) ? readFileSync(arquivo, "utf8") : null;
}

// Opções do test(): pula sem firmware; na CI, registra uma falha no lugar.
export function precisaDe(...caminhos) {
  const faltam = caminhos.filter((c) => !firmware(c));
  if (faltam.length && EXIGIR) {
    test(`firmware compilado: ${faltam.join(", ")}`, () => {
      throw new Error(`FIRMWARE_DIR não tem ${faltam.join(", ")}`);
    });
  }
  return { skip: faltam.length ? MOTIVO : false };
}
