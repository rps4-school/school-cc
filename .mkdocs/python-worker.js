/*
 * Worker do editor dos simulados: roda o Python (Pyodide) fora da página,
 * para um laço infinito não travar o site (o editor.js encerra o worker).
 *
 * Como o GitHub Pages não deixa o input() esperar o teclado de verdade
 * (precisaria de SharedArrayBuffer), cada execução recebe a lista de entradas
 * já digitadas. Quando ela acaba, o programa para e o terminal pede a próxima;
 * com a nova entrada, o código roda de novo do começo. Funciona porque as
 * provas não usam import: o mesmo código com as mesmas entradas dá a mesma saída.
 */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js");

const PYTHON = `
import builtins, io, json, linecache, sys, traceback

LIMITE = 200_000  # caracteres de saída: protege de print dentro de laço infinito


class _PrecisaDeEntrada(BaseException):
    pass


class _SaidaGrande(BaseException):
    pass


class _Saida(io.StringIO):
    def __init__(self, ao_estourar):
        super().__init__()
        self.ao_estourar = ao_estourar

    def write(self, texto):
        if self.tell() + len(texto) > LIMITE:
            self.ao_estourar()
        return super().write(texto)


def _erro(e, arquivo):
    """Traceback só com as linhas do arquivo do aluno (sem as do editor)."""
    if isinstance(e, SyntaxError) and e.filename == arquivo:
        return "".join(traceback.format_exception_only(e)), e.lineno
    quadros = [q for q in traceback.extract_tb(e.__traceback__) if q.filename == arquivo]
    texto = "Traceback (most recent call last):\\n" + "".join(traceback.format_list(quadros))
    texto += "".join(traceback.format_exception_only(e))
    return texto, quadros[-1].lineno if quadros else None


def _executar(codigo, entradas, arquivo, avisar):
    fila = json.loads(entradas)
    parada = []  # por que o editor interrompeu o programa

    def interromper(motivo, excecao):
        """Para o programa e já manda o resultado para a página.

        O aviso sai antes de a exceção subir: mesmo que o aluno tenha um except:
        que pegue tudo (até BaseException), a página já recebeu "aguardando" com
        a saída até aqui. Se o programa insistir em continuar, o editor.js
        encerra o worker logo depois.
        """
        if not parada:
            parada.append(motivo)
            avisar(json.dumps({"estado": motivo, "saida": saida.getvalue()}))
        raise excecao()

    saida = _Saida(lambda: interromper("saida-grande", _SaidaGrande))
    # Assim o traceback mostra o texto da linha com erro, como no terminal.
    linecache.cache[arquivo] = (len(codigo), None, codigo.splitlines(True), arquivo)

    def entrada(prompt=""):
        saida.write(str(prompt))
        if not fila:
            interromper("aguardando", _PrecisaDeEntrada)
        valor = fila.pop(0)
        saida.write(valor + "\\n")  # eco do que foi digitado, como no terminal
        return valor

    embutidas = dict(vars(builtins), input=entrada)
    ambiente = {"__name__": "__main__", "__builtins__": embutidas}
    resultado = {"estado": "fim"}
    sys.stdout = sys.stderr = saida
    try:
        exec(compile(codigo, arquivo, "exec"), ambiente)
    except (_PrecisaDeEntrada, _SaidaGrande, SystemExit):
        pass
    except BaseException as e:
        texto, linha = _erro(e, arquivo)
        resultado = {"estado": "erro", "erro": texto, "linha": linha}
    finally:
        sys.stdout, sys.stderr = sys.__stdout__, sys.__stderr__
    if parada:
        resultado = {"estado": parada[0]}  # a página já recebeu o resultado pelo avisar()
    resultado["saida"] = saida.getvalue()
    return json.dumps(resultado)
`;

const pronto = loadPyodide().then((pyodide) => {
  pyodide.runPython(PYTHON);
  return pyodide.globals.get("_executar");
});

pronto.then(
  () => postMessage({ pronto: true }),
  (e) => postMessage({ falhou: String(e) })
);

onmessage = async ({ data }) => {
  const executar = await pronto;
  // "adiantado": o resultado saiu no meio da execução (veja interromper no Python).
  const avisar = (texto) => postMessage({ id: data.id, adiantado: true, ...JSON.parse(texto) });
  const resultado = executar(data.codigo, JSON.stringify(data.entradas), data.arquivo, avisar);
  postMessage({ id: data.id, ...JSON.parse(resultado) });
};
