import assert from "node:assert/strict";
import test from "node:test";

import { criarEmulador, FREQUENCIA } from "../emulador.js";
import { lerIntelHex } from "../intelhex.js";
import { firmware, precisaDe } from "./firmware.js";

const SEMAFORO = "conteudo/sistemas-digitais/laboratorio/projetos/03-semaforo/semaforo.hex";

test("Intel HEX: dados, endereço estendido e erros em português", () => {
  // 3 bytes em 0x0010, depois fim.
  const mem = lerIntelHex(":03001000AABBCCBC\n:00000001FF\n");
  assert.deepEqual([...mem.slice(0x10, 0x13)], [0xaa, 0xbb, 0xcc]);
  assert.throws(() => lerIntelHex(":03001000AABBCCBD\n"), /soma de verificação/);
  assert.throws(() => lerIntelHex("03001000AABBCCBC\n"), /formato Intel HEX/);
  assert.throws(() => lerIntelHex(":020010000102EB\n", 0x10), /passa dos 16 bytes/);
});

test("emulador: o semáforo troca os pinos 8, 9 e 10 nos tempos do código", precisaDe(SEMAFORO), () => {
  const emu = criarEmulador(lerIntelHex(firmware(SEMAFORO)));
  const trocas = [];
  let antes = emu.pinos();
  emu.executar(13 * FREQUENCIA, (ciclo) => {
    const agora = emu.pinos();
    for (const p of ["D8", "D9", "D10"]) {
      if (agora[p].nivel !== antes[p].nivel && agora[p].modo === "saida") trocas.push([Math.round((ciclo / FREQUENCIA) * 100) / 100, p, agora[p].nivel]);
    }
    antes = agora;
  });
  const altos = trocas.filter(([, , nivel]) => nivel === 1).map(([t, p]) => [t, p]);
  assert.deepEqual(altos, [[0, "D8"], [5, "D9"], [7, "D10"], [12, "D8"]]);
  let texto = "";
  emu.usart.onByteTransmit = (b) => {
    texto += String.fromCharCode(b);
  };
  emu.executar(18 * FREQUENCIA);
  assert.match(texto, /Amarelo\r\n/);
});
