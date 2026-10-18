"""Compila os sketches (.ino) do laboratório para o Arduino Uno e grava o firmware em FIRMWARE_DIR.

Cada conteudo/**/laboratorio/**/nome.ino vira <saída>/<mesmo caminho>/nome.hex, mais nome.compilacao.json
com o relatório de tamanho. O visual.py publica esses arquivos ao lado do .ino, e o laboratório roda o
.hex no ATmega328P emulado. Uso (precisa do arduino-cli com o core arduino:avr):

    python .mkdocs/laboratorio/compilar.py --saida /tmp/firmware [--arduino-cli arduino-cli]
"""

import argparse
import json
import pathlib
import shutil
import subprocess
import sys
import tempfile

RAIZ = pathlib.Path(__file__).resolve().parents[2]
FQBN = "arduino:avr:uno"


def sketches(raiz=RAIZ):
    return sorted(p for p in (raiz / "conteudo").rglob("*.ino") if "laboratorio" in p.relative_to(raiz).parts)


def versoes(cli):
    cli_versao = subprocess.run([cli, "version", "--json"], capture_output=True, text=True, check=True).stdout
    cores = subprocess.run([cli, "core", "list", "--json"], capture_output=True, text=True, check=True).stdout
    plataformas = json.loads(cores).get("platforms", [])
    avr = next((p for p in plataformas if p.get("id") == "arduino:avr"), {})
    return json.loads(cli_versao).get("VersionString", "?"), avr.get("installed_version", "?")


def compilar(cli, ino, saida, temp, versao_cli, versao_core):
    """O arduino-cli exige pasta/pasta.ino: copia o .ino para uma pasta com o nome dele e compila lá."""
    nome = ino.stem
    pasta = temp / nome / nome
    pasta.mkdir(parents=True)
    shutil.copy(ino, pasta / f"{nome}.ino")
    build = temp / nome / "build"
    r = subprocess.run([cli, "compile", "--fqbn", FQBN, "--build-path", str(build), str(pasta)], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"Não compilou: {ino.relative_to(RAIZ)}\n{r.stdout}\n{r.stderr}")
    destino = saida / ino.relative_to(RAIZ).with_suffix(".hex")
    destino.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(build / f"{nome}.ino.hex", destino)
    relatorio = [linha.strip() for linha in r.stdout.splitlines() if linha.startswith(("Sketch uses", "Global variables"))]
    info = {"sketch": ino.name, "placa": FQBN, "arduinoCli": versao_cli, "coreAvr": versao_core, "relatorio": relatorio}
    destino.with_suffix(".compilacao.json").write_text(json.dumps(info, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return destino


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--saida", required=True, type=pathlib.Path, help="pasta do firmware (FIRMWARE_DIR)")
    parser.add_argument("--arduino-cli", default="arduino-cli", help="caminho do arduino-cli")
    args = parser.parse_args()
    cli = shutil.which(args.arduino_cli) or args.arduino_cli
    versao_cli, versao_core = versoes(cli)
    lista = sketches()
    with tempfile.TemporaryDirectory(prefix="school-cc-") as t:
        for ino in lista:
            destino = compilar(cli, ino, args.saida, pathlib.Path(t), versao_cli, versao_core)
            print(f"ok {destino.relative_to(args.saida)}")
    print(f"{len(lista)} sketch(es) compilado(s) com arduino-cli {versao_cli} e arduino:avr {versao_core}.")


if __name__ == "__main__":
    main()
