// Projetos guardados no navegador (localStorage) e arquivos JSON para baixar e abrir.
// O localStorage pode não existir ou estar cheio: tudo aqui falha em silêncio e o laboratório
// continua funcionando, só sem guardar.

const PREFIXO = "school-cc:laboratorio:";
const SALVOS = `${PREFIXO}salvos`;

function ler(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (e) {
    return null;
  }
}

function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
    return true;
  } catch (e) {
    return false;
  }
}

function apagar(chave) {
  try {
    localStorage.removeItem(chave);
  } catch (e) { /* sem localStorage */ }
}

function lerJson(chave, padrao) {
  const texto = ler(chave);
  if (!texto) return padrao;
  try {
    return JSON.parse(texto);
  } catch (e) {
    return padrao;
  }
}

// Rascunho automático: o circuito do aluno em cada página (origem = endereço da página + projeto).
export function lerRascunho(origem) {
  return lerJson(`${PREFIXO}rascunho:${origem}`, null);
}

export function salvarRascunho(origem, projeto) {
  return gravar(`${PREFIXO}rascunho:${origem}`, JSON.stringify(projeto));
}

export function apagarRascunho(origem) {
  apagar(`${PREFIXO}rascunho:${origem}`);
}

// Projetos salvos com nome.
export function listarSalvos() {
  const lista = lerJson(SALVOS, []);
  return Array.isArray(lista) ? lista.map(({ id, nome, salvoEm }) => ({ id, nome, salvoEm })).sort((a, b) => b.salvoEm - a.salvoEm) : [];
}

export function salvarComo(nome, projeto) {
  const lista = lerJson(SALVOS, []);
  const existente = lista.find((x) => x.nome === nome);
  const item = { id: existente ? existente.id : `p${Date.now().toString(36)}`, nome, salvoEm: Date.now(), projeto };
  const nova = lista.filter((x) => x.id !== item.id).concat(item);
  return gravar(SALVOS, JSON.stringify(nova)) ? item.id : null;
}

export function abrirSalvo(id) {
  const item = lerJson(SALVOS, []).find((x) => x.id === id);
  return item ? item.projeto : null;
}

export function apagarSalvo(id) {
  gravar(SALVOS, JSON.stringify(lerJson(SALVOS, []).filter((x) => x.id !== id)));
}

export function baixar(nomeDoArquivo, texto, tipo = "application/json") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([texto], { type: tipo }));
  link.download = nomeDoArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function lerArquivo(arquivo) {
  return new Promise((ok, falha) => {
    if (arquivo.size > 512 * 1024) {
      falha(new Error("O arquivo é grande demais para um projeto do laboratório (máximo de 512 KB)."));
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => ok(String(leitor.result));
    leitor.onerror = () => falha(new Error("Não deu para ler o arquivo."));
    leitor.readAsText(arquivo);
  });
}
