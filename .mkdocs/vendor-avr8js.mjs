// Copia o avr8js (de node_modules) para laboratorio/vendor/avr8js, pronto para o navegador.
// O dist/esm dele importa "./cpu/cpu" sem ".js": sem bundler, o navegador não acha o arquivo.
// Aqui os imports relativos ganham ".js". O assembler (utils/) fica de fora: o site não usa.
//
// Rode com:  npm run vendor --prefix .mkdocs
// A CI roda de novo e confere com git diff, como faz com o site.css.

import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const PACOTE = join(AQUI, "node_modules", "avr8js");
const ESM = join(PACOTE, "dist", "esm");
const DESTINO = join(AQUI, "laboratorio", "vendor", "avr8js");
// from './x', import './x', import('./x'): só caminhos relativos, sem extensão.
const IMPORT = /(\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]+?)(\.js)?\2/g;

function copiar(pasta) {
  for (const nome of readdirSync(pasta).sort()) {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) {
      if (nome !== "utils") copiar(caminho);
      continue;
    }
    if (!nome.endsWith(".js")) continue;
    const texto = readFileSync(caminho, "utf8")
      .replace(/\r\n/g, "\n")
      .replace(IMPORT, (_, antes, aspas, alvo) => `${antes}${aspas}${alvo}.js${aspas}`)
      .replace(/^\/\/# sourceMappingURL=.*$/gm, "");
    const saida = join(DESTINO, relative(ESM, caminho));
    mkdirSync(dirname(saida), { recursive: true });
    writeFileSync(saida, texto);
  }
}

const versao = JSON.parse(readFileSync(join(PACOTE, "package.json"), "utf8")).version;
rmSync(DESTINO, { recursive: true, force: true });
copiar(ESM);
writeFileSync(join(DESTINO, "LICENSE"), readFileSync(join(PACOTE, "LICENSE"), "utf8").replace(/\r\n/g, "\n"));
writeFileSync(join(DESTINO, "VERSAO.txt"), `avr8js ${versao} (licença MIT, em LICENSE), copiado de node_modules por vendor-avr8js.mjs.\n`);
console.log(`avr8js ${versao} copiado para ${relative(AQUI, DESTINO)}`);
