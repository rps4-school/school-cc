#!/usr/bin/env bash
# Instala o arduino-cli e o core arduino:avr em versões fixas, para compilar os sketches do laboratório
# na CI (Linux x86-64). Use com "source", no mesmo passo em que compila:
#
#   source .mkdocs/laboratorio/instalar-arduino-cli.sh "$RUNNER_TEMP/arduino"
#   python .mkdocs/laboratorio/compilar.py --arduino-cli "$ARDUINO_CLI" --saida "$RUNNER_TEMP/firmware"
#
# Para atualizar: troque as versões e o SHA-256 (do arquivo <versão>-checksums.txt da release) juntos,
# compile e rode os testes do laboratório com o firmware novo.

VERSAO_CLI="1.5.1"
SHA256_CLI="28a8e119c498a25607821c36cb2dc49e8463941b261a0d99091baa7bc692dd2b" # arduino-cli_1.5.1_Linux_64bit.tar.gz
CORE="arduino:avr@1.8.8"
BIBLIOTECAS=("Servo@1.3.0") # usadas pelos sketches do laboratório (a Servo não vem no core)

PASTA="${1:?informe a pasta onde instalar}"
mkdir -p "$PASTA/bin"
export ARDUINO_DIRECTORIES_DATA="$PASTA/data"
export ARDUINO_DIRECTORIES_DOWNLOADS="$PASTA/downloads"
export ARDUINO_DIRECTORIES_USER="$PASTA/user"
export ARDUINO_METRICS_ENABLED=false
export ARDUINO_UPDATER_ENABLE_NOTIFICATION=false
export ARDUINO_CLI="$PASTA/bin/arduino-cli"

if ! "$ARDUINO_CLI" version 2>/dev/null | grep -q "Version: $VERSAO_CLI "; then
  pacote="$PASTA/arduino-cli.tar.gz"
  curl -fsSL -o "$pacote" "https://github.com/arduino/arduino-cli/releases/download/v${VERSAO_CLI}/arduino-cli_${VERSAO_CLI}_Linux_64bit.tar.gz"
  echo "${SHA256_CLI}  ${pacote}" | sha256sum -c - || { echo "::error::SHA-256 do arduino-cli não confere"; return 1 2>/dev/null || exit 1; }
  tar -xzf "$pacote" -C "$PASTA/bin" arduino-cli
  rm -f "$pacote"
fi
"$ARDUINO_CLI" core update-index
"$ARDUINO_CLI" core install "$CORE"
"$ARDUINO_CLI" lib update-index
"$ARDUINO_CLI" lib install "${BIBLIOTECAS[@]}"
