// Lê um arquivo Intel HEX (o firmware que o arduino-cli gera) para a memória flash.

export const FLASH = 0x8000; // 32 KB do ATmega328P

export function lerIntelHex(texto, tamanho = FLASH) {
  const memoria = new Uint8Array(tamanho);
  let base = 0;
  let fim = false;
  const linhas = String(texto).split(/\r?\n/);
  for (let n = 0; n < linhas.length && !fim; n++) {
    const linha = linhas[n].trim();
    if (!linha) continue;
    const onde = `linha ${n + 1} do firmware`;
    if (linha[0] !== ":" || linha.length % 2 === 0 || !/^:[0-9A-Fa-f]+$/.test(linha)) throw new Error(`${onde}: formato Intel HEX inválido.`);
    const bytes = linha.slice(1).match(/../g).map((h) => parseInt(h, 16));
    const [qtd, alto, baixo, tipo] = bytes;
    if (bytes.length !== qtd + 5) throw new Error(`${onde}: o tamanho não bate.`);
    if (bytes.reduce((s, b) => (s + b) & 0xff, 0) !== 0) throw new Error(`${onde}: soma de verificação errada.`);
    const dados = bytes.slice(4, 4 + qtd);
    switch (tipo) {
      case 0: {
        const endereco = base + ((alto << 8) | baixo);
        if (endereco + qtd > tamanho) throw new Error(`${onde}: o programa passa dos ${tamanho} bytes da flash.`);
        memoria.set(dados, endereco);
        break;
      }
      case 1:
        fim = true;
        break;
      case 2:
        base = ((dados[0] << 8) | dados[1]) << 4;
        break;
      case 4:
        base = ((dados[0] << 8) | dados[1]) << 16;
        break;
      default: // 3 e 5: endereço de início, que o ATmega328P não usa
    }
  }
  return memoria;
}
