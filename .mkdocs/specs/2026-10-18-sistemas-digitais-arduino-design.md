# Sistemas Digitais: eletrônica, Arduino e Laboratório Arduino

- **Data:** 2026-10-18
- **Branches:** `feat/sd-eletronica-fundamentos` e as seguintes, uma por fase (seção 10)
- **Estado:** em implementação, fase a fase

## 1. Objetivo

Levar Sistemas Digitais do papel para a bancada: depois das 9 aulas de lógica digital, o aluno aprende eletrônica básica e Arduino e pratica num **Laboratório Arduino** que roda no navegador, sem conta e sem instalar nada.

**Critérios de sucesso:**

- As 9 aulas, os 81 exercícios e os simulados 01 a 04 continuam iguais e funcionando.
- **Aulas 10 a 23** com exercícios (9 por aula) e os **simulados 05 a 08**.
- O corretor aceita respostas com unidade (`20 mA`, `4,7 kΩ`).
- O laboratório monta circuitos com fios e protoboard e mostra o que acontece de verdade dentro dos limites declarados. O **Blink** passa nos 9 casos de teste da seção 7.6.
- Páginas sem laboratório não carregam nada dele além de um script de ~2 KB.

## 2. Decisões tomadas

| Decisão | Escolha |
| ------- | ------- |
| Onde | Dentro do tema `sistemas-digitais` (aulas 10 a 23 na mesma trilha) e em `conteudo/sistemas-digitais/laboratorio/` |
| Código editado pelo aluno | **Não compila no site.** Os sketches do repositório são compilados na CI (arduino-cli) e rodam num ATmega328P emulado (avr8js). O editor avisa quando o código não é um dos compilados |
| Emulador | **avr8js 0.21.1** (MIT), copiado para o repositório (seção 7.4) |
| Desenho dos componentes | **SVG próprio**, sem o wokwi-elements (446 KB minificado) |
| Elétrica | Solucionador de corrente contínua próprio, **simplificado** (seção 7.3) |
| JavaScript | Sem framework e sem bundler, como o resto do site: módulos ES carregados com `import()` só quando o laboratório abre |
| Progresso e projetos | No navegador (localStorage), como o progresso do portal |

## 3. Fora do escopo

- Compilar o código que o aluno escreve. A seção 8 desenha um serviço para isso, que depende de hospedagem.
- Transitórios e componentes não lineares além do LED: capacitor carregando, motor, transistor, ponte H, servo. Eles entram como **"só montagem"** ou como atividade num simulador externo, e isso aparece na interface.
- Bibliotecas e protocolos (I2C, SPI, displays). Viram texto complementar nas aulas.
- Login, servidor e sincronizar entre aparelhos.

## 4. Diagnóstico do repositório (main em 2026-10-18)

**Preservar:** os tipos do corretor e o teste "todo gabarito passa no próprio corretor"; o editor de Python (Monaco 0.52.2 do jsDelivr com SRI + Pyodide num worker); o cronômetro da folha de prova; o progresso no localStorage; a navegação instantânea (`document$` + `data-montado`); o build `--strict`; a checagem do `site.css` na CI.

**Reaproveitar:**

| Peça | Onde | Uso aqui |
| ---- | ---- | -------- |
| Leitura de números, `perto`, `arredondouCerto` | `corretor.js` | Base do tipo `Grandeza` |
| `RESPOSTA` / `TIPOS_DE_RESPOSTA` | `_catalogo.py` | Reconhecer o tipo novo |
| `ARQUIVOS_DO_SITE` + `on_files` | `visual.py` | Publicar os módulos e o firmware |
| `carregarMonaco()` | `editor.js` | Editor de C++ do laboratório (mesma versão e SRI) |
| Fila e encerramento do worker | `editor.js` | Padrão do worker de simulação |
| `window.SchoolCC.progresso` | `progresso.js` | Desafios do laboratório contam no progresso |
| `TITULOS` | `hooks.py` | Nomes com acento das pastas novas |
| Tabelas-índice que viram cartões | `visual.py` | Lista de projetos do laboratório |

**Riscos encontrados:**

- `test_catalogo.py` fixa a primeira frase do README do tema: ela fica igual, e o texto novo entra depois dela.
- O `dist/esm` do avr8js importa `./cpu/cpu` sem `.js`: o navegador não carrega isso sem bundler (seção 7.4).
- `_mais_do_tema` (`visual.py`) poria cada projeto do laboratório no grupo "Mais" do menu (seção 7.8).
- A CI fica mais lenta com o core do Arduino (resolvido com cache).

## 5. A trilha nova

As aulas 10 a 23 seguem o formato das aulas 1 a 9 e ganham duas seções: **🔬 Mão na massa** e **🧾 Resumo**. Seções que vão além do que a disciplina costuma cobrar levam **(ampliação)** no título.

| # | Aula | Nível | Base | O que é ampliação |
| - | ---- | ----- | ---- | ----------------- |
| 10 | Introdução à eletrônica | 🟢 | Slides (eletricidade, condutor, circuito, curto, símbolos) | Prefixos e conversões |
| 11 | Tensão, corrente, resistência e Lei de Ohm | 🟢 | Slides (Lei de Ohm, resistor do LED) | Potência; série E12 |
| 12 | Circuitos em série e paralelo | 🟡 | Slides (fórmulas e exercícios) | Divisor de tensão; circuito misto |
| 13 | Protoboard, polaridade e medição | 🟢 | Slides (protoboard, multímetro no simulador) | Barramento dividido; segurança |
| 14 | Componentes eletrônicos | 🟡 | Slides (resistor, LED, botão, potenciômetro, LDR, transistor, ponte H) | Capacitor e diodo; 5 faixas |
| 15 | Arduino Uno | 🟢 | Slides (plataforma, placas, IDE) | Limites de corrente da placa |
| 16 | Programação Arduino em C/C++ | 🟢 | Slides (`setup`/`loop`) | Tipos, `int` de 16 bits, Python × C++ |
| 17 | Saídas digitais, LED e Blink | 🟢 | Slides (Blink, dois LEDs, desafio) | PORTB em binário |
| 18 | Monitor serial | 🟢 | Roteiro da disciplina (comunicação serial) | Quadro da serial |
| 19 | Entradas digitais e botões | 🟡 | Roteiro (entradas digitais, botão) | Debounce |
| 20 | Temporização com `delay()` e `millis()` | 🟡 | Slides (Blink sem delay) | Overflow; máquina de estados |
| 21 | Leitura analógica | 🟡 | Roteiro (entradas analógicas, potenciômetro, LDR) | Resolução do ADC |
| 22 | PWM | 🟡 | Roteiro (saídas analógicas) | Frequência do PWM |
| 23 | Sensores e atuadores | 🔴 | Slides e roteiro (PIR, HC-SR04, sensores) | Relé; motor via transistor |

**Direitos:** nada dos slides é copiado. Texto, exemplos e figuras são originais; os exercícios dos slides só entram adaptados, com história e valores novos. Não se cita a instituição nem os professores.

## 6. Corretor: o tipo `Grandeza`

`` **Grandeza:** `20 mA` `` aceita `20 mA`, `20mA`, `0,02 A`, `20 miliamperes` e o número sozinho, lido na unidade do gabarito (`20`) **ou** na do SI (`0,02`).

- **Unidades:** V, A, Ω (`Ω` grego, `Ω` do sinal de ohm, `ohm`, `ohms`), W, Hz, s e F.
- **Prefixos:** p, n, µ (`u`), m, k (`K`), M e G. Maiúscula importa: `mA` é mili, `MA` é mega.
- **Código de resistor:** `4k7`, `2R2`, `1M5` e `220R`.
- **Comparação:** relativa, então 100 nF e 200 nF são diferentes. Um valor que não fecha (1/3 A) vale arredondado ou truncado com **3 algarismos significativos** ou mais. Um valor exato com 3 algarismos (215 Ω) tem que vir exato: 220 Ω é o valor comercial, outra resposta.
- **Dicas:** grandeza errada ("a resposta é uma corrente (A)"); número certo em outra escala ("escreva a unidade" ou "confira o prefixo"); perto, a menos de 5 %. Nenhuma dica mostra o valor certo.
- **Tolerância:** `` `215 Ω ± 5 Ω` ``. Sem unidade depois do `±`, vale a unidade do gabarito.
- **Regra para quem escreve:** pergunta de *conversão* usa `Número`, senão o `0,02` passaria em "converta 0,02 A para mA". O teste do corretor recusa gabarito de `Grandeza` sem unidade no fim.

## 7. Laboratório Arduino

### 7.1 Arquitetura

```
conteudo/sistemas-digitais/laboratorio/         páginas (GitHub e site)
  README.md, exemplos.json
  experimentos/NN-nome/{README.md, circuito.json}        eletrônica sem Arduino
  projetos/NN-nome/{README.md, nome.ino, variantes.ino, circuito.json}
          │
          ▼  CI: compilar.py + arduino-cli  →  FIRMWARE_DIR/<mesmo caminho>.hex  →  visual.py publica
.mkdocs/laboratorio.js     bootstrap (~2 KB, defer, todas as páginas): cartão "Abrir laboratório"
.mkdocs/laboratorio/       módulos ES, carregados com import() ao abrir
  catalogo.js · protoboard.js · projeto.js · netlist.js · solucionador.js · circuito.js · diagnostico.js · geometria.js
  uno.js · intelhex.js · emulador.js · simulacao.js · simulacao-worker.js
  desenhos.js · vista.js · edicao.js · painel.js · programa.js · armazenamento.js · desafios.js · app.js
  README.md (para quem desenvolve) · vendor/avr8js/ · compilar.py · instalar-arduino-cli.sh · testes/
```

O que é lógica pura (protoboard, projeto, netlist, solucionador, diagnóstico, uno, intelhex, emulador, simulação, desafios) não toca o DOM e tem testes no Node. A interface (vista, edição, painel, app) só desenha e chama a lógica.

### 7.2 Formato do projeto (schema 1)

```json
{
  "schemaVersion": 1,
  "id": "blink-led-d8",
  "title": "Meu primeiro Blink",
  "level": "iniciante",
  "board": "arduino-uno-r3",
  "components": [
    { "id": "uno", "type": "arduino-uno-r3", "x": 40, "y": 40 },
    { "id": "pb", "type": "protoboard-400", "x": 420, "y": 60 },
    { "id": "r1", "type": "resistor", "props": { "ohms": 220 }, "mount": { "1": "pb:c10", "2": "pb:c14" } },
    { "id": "led1", "type": "led", "props": { "cor": "vermelho" }, "mount": { "anodo": "pb:e14", "catodo": "pb:e15" } }
  ],
  "connections": [
    { "id": "w1", "from": "uno:D8", "to": "pb:a10", "color": "verde" },
    { "id": "w2", "from": "uno:GND.1", "to": "pb:a15", "color": "preto" }
  ],
  "sketch": "blink.ino",
  "variantes": [
    { "arquivo": "blink-pino-7.ino", "rotulo": "Com defeito: pino 7" },
    { "arquivo": "blink-500ms.ino", "rotulo": "Intervalo de 500 ms" }
  ],
  "capabilities": ["gpio", "serial"],
  "metadata": { "instrucoes": "…", "esperado": { "led": "led1", "pino": "D8" } }
}
```

- **Terminal** é `componente:pino`. Protoboard: `a1`…`j30` e barramentos `+1`…`+25` / `-1`…`-25`, com as duas faixas de cada lado.
- **A elétrica não usa coordenadas.** Ela vem de `connections` (fios) e de `mount` (pino → furo). O `x`/`y` só desenha.
- **Validação:** tipo e pino existem, id único, terminal não repetido em dois `mount`, fio sem ponta solta, `schemaVersion` conhecido. Erros em português, com o caminho do campo.
- **Ao importar, um schema mais novo** é recusado com aviso. Um mais velho passa por `migrar()`.

### 7.3 Modelo elétrico

- **Redes:** union-find sobre os terminais. Entram fios, `mount`, as tiras da protoboard e as ligações internas (os GND do Uno; os pares do botão de 4 pinos).
- **Protoboards:**
  - `protoboard-400`: 30 colunas; a–e e f–j separadas pelo canal; barramentos contínuos.
  - `protoboard-830`: 63 colunas; **barramentos divididos ao meio**, como em muitos modelos grandes, para ensinar a pegadinha.
- **Solucionador:** análise nodal modificada, em corrente contínua.
  - Resistor linear; chave aberta ou fechada; fonte ideal com resistência interna (pilhas, 9 V, 5 V e 3,3 V do Uno).
  - Pino de saída como fonte de 5 V ou 0 V atrás de ~25 Ω. Pino de entrada em alta impedância, ou com pull-up de ~35 kΩ (`INPUT_PULLUP`).
  - LED linear por partes: aberto abaixo de Vf; até 30 mA, Vf + 0,05 Ω (as leituras batem com as contas das aulas); acima de 30 mA, uma reta de 10 Ω, para um LED sem resistor dar centenas de mA, e não um curto de dezenas de ampères. Os estados dos LEDs são iterados até ficarem consistentes.
  - Voltímetro lê a diferença entre redes; amperímetro é um ramo de 0 Ω com a corrente.
- **Diagnósticos:** pino usado e desconectado; LED invertido; LED sem resistor (corrente acima do máximo); sem retorno ao GND; pino errado (pelo `metadata.esperado`); curto entre alimentação e GND; corrente acima de 20 mA (recomendado) ou 40 mA (máximo) num pino; tensão acima de 5,5 V num pino.
- **O que não faz:** capacitor, indutor, transitórios, transistor e não linearidade além do LED. A página do laboratório diz isso na tabela de capacidades.

### 7.4 Emulação

- **Carga do avr8js:** o avr8js 0.21.1 entra como devDependency. `npm run vendor --prefix .mkdocs` copia `dist/esm` para `.mkdocs/laboratorio/vendor/avr8js/` (sem `utils/`), reescreve os imports relativos para terminar em `.js` e copia a LICENSE. A CI roda de novo e confere com `git diff`, como no `site.css`.
- **Periféricos (`emulador.js`):** CPU, timers 0/1/2, portas B/C/D, USART0 e ADC do ATmega328P a 16 MHz. `uno.js` mapeia D0–D13 e A0–A5 para as portas e os canais do ADC.
- **Acoplamento (`simulacao.js`):** mudança em pino de saída → solucionador → nível dos pinos de entrada e tensão dos canais do ADC, no mesmo instante do tempo simulado. O brilho do LED é a corrente média no tempo ligado, o que já cobre o PWM.
- **Execução (`simulacao-worker.js`):** um module worker roda fatias de ~10 ms simuladas e segura o ritmo pelo relógio real. Ele manda quadros de estado (~30 por segundo), os bytes da serial e a velocidade (%). Parar encerra o worker; Reiniciar recria tudo a partir do `.hex`.
- **Tempo nos testes:** é sempre o simulado (ciclos ÷ 16 MHz), nunca o relógio.

### 7.5 Compilação

- `compilar.py` acha os `.ino` em `conteudo/**/laboratorio/` e copia cada um para uma pasta temporária com o nome do sketch (o arduino-cli exige). Depois compila com `--fqbn arduino:avr:uno` e grava em `FIRMWARE_DIR`, no mesmo caminho relativo, o `.hex` e o relatório de tamanho.
- **CI:** `pages.yml` instala o arduino-cli e o core `arduino:avr` em versões fixas (por `instalar-arduino-cli.sh`, que confere o SHA-256), com cache, compila e passa `FIRMWARE_DIR` ao build; ele também confere se a cópia do avr8js está em dia. `testes.yml` ganha o job "Laboratório com firmware", que compila e roda os testes do laboratório com `EXIGIR_FIRMWARE=1`.
- **Serial:** o avr8js dá a taxa real do hardware (9 615 baud para `Serial.begin(9600)` a 16 MHz); o monitor mostra a taxa padrão mais perto.
- **Build local sem arduino-cli:** o laboratório avisa "firmware não compilado neste build", e os testes que precisam de firmware ficam *skip* com mensagem.
- **Editor:** ▶ Executar roda o `.hex` do sketch cujo texto (normalizado) é igual ao do editor. Com texto diferente, aparece: "Este site não compila código editado". O aluno pode restaurar, escolher uma variante ou baixar o `.ino` para a IDE do Arduino.
- **Ponto de extensão:** `compilar(texto)` em `app.js` hoje só procura entre os sketches compilados; um serviço (seção 8) entra aí.

### 7.6 Marco de aceite: Blink

Sketch do enunciado: LED no **D8**, `Serial` a 9600, 1 s ligado e 1 s desligado. Variantes: `blink-pino-7.ino` e `blink-500ms.ino`. Testes no Node, em tempo simulado:

1. Circuito e código corretos: o LED alterna a cada 1 s (±1 %).
2. Código no pino 7: o LED externo nunca acende.
3. LED desconectado: não acende, e o diagnóstico aponta.
4. Sem o fio do GND: não acende ("sem retorno ao GND").
5. LED invertido: não acende, e aparece o aviso de polaridade.
6. A variante de 500 ms pisca no dobro da frequência. Código editado não compila no site, e isso fica declarado.
7. Reiniciar volta pinos, ciclos e serial ao estado inicial.
8. Parar congela os ciclos.
9. Com o LED desconectado, a serial ainda imprime "Ligado". O validador olha o LED, nunca a serial.

### 7.7 Interface

- **Layout:** sobreposição de tela cheia com circuito e código lado a lado no desktop. No celular, abas Circuito, Código, Serial e Instruções.
- **Circuito:** paleta de componentes; arrastar e encaixar na protoboard (o `mount` é calculado do furo mais perto); fio de terminal a terminal, com cor; selecionar, girar e apagar; zoom e pan.
- **Barra:** Executar, Parar e Reiniciar; exemplos prontos (`exemplos.json`); salvar, abrir e duplicar (localStorage); importar e exportar JSON; restaurar o circuito inicial.
- **Acessibilidade:**
  - painel de conexões em lista (terminal A, terminal B → Conectar) como alternativa ao arrastar;
  - foco visível; setas movem o componente selecionado; Delete apaga;
  - mensagens num `aria-live`; contraste nos dois temas.
- **Navegação instantânea:** ao trocar de página, o worker é encerrado e a sobreposição fecha.

### 7.8 Integração com o site

- **Publicação:** o `visual.py` publica `.mkdocs/laboratorio/` (sem `testes/` nem `package.json`) em `assets/javascripts/laboratorio/`. Os `.hex` de `FIRMWARE_DIR` vão ao lado dos `.ino`.
- **Página com laboratório:** um `<div class="laboratorio" data-projeto="circuito.json">` no Markdown. No GitHub ele não aparece, e a página diz que o laboratório roda só no site.
- **Menu:** `_mais_do_tema` deixa de listar páginas dentro de subpastas que têm README próprio, e só "Laboratório Arduino" entra em "Mais".
- **CSS:** os estilos do laboratório entram no `tailwind.css` como CSS próprio (classes `lab-*`), sem utilitários do Tailwind nos módulos; por isso não precisam de `@source`.

## 8. Compilador futuro (serviço, não implementado)

| Item | Proposta |
| ---- | -------- |
| Arquitetura | `POST /compilar {sketch}` → `{hex, saida, erros}`; imagem com arduino-cli e core `arduino:avr` em versões fixas, já instalados na imagem |
| Hospedagem | Cloud Run (gVisor, escala a zero) ou Fly.io; custo provável de zero a poucos dólares por mês no volume de uma turma |
| Isolamento | Usuário sem privilégios, sistema de arquivos só leitura (menos `/tmp`), compilação sem rede, uma pasta temporária por pedido, apagada no fim |
| Limites | 20 s de CPU, 512 MB, sketch até 64 KB, um `.ino` sem `#include` de arquivos locais, saída cortada em 64 KB |
| Validação | Só texto UTF-8, sem caminhos absolutos, sem bibliotecas fora de uma lista fixa |
| Rate limiting | 10 compilações por minuto por IP; CORS só para o domínio do site |
| Segurança | Nada guardado depois da resposta; registros sem o código do aluno |
| Manutenção | Atualizar arduino-cli e core juntos com os do `pages.yml`, rodando os testes do Blink contra o serviço |

No laboratório, só a função `compilar(texto)` muda. O aviso "este site não compila" passa a aparecer só quando o serviço está fora do ar.

## 9. Testes

| Arquivo | O que cobre |
| ------- | ----------- |
| `corretor.test.js` | Gabaritos (inclusive `Grandeza` com unidade) e casos do tipo novo |
| `test_catalogo.py` | `perguntas()` reconhece `Grandeza` |
| `test_visual.py` | Publicação do laboratório e o grupo "Mais" do menu |
| `laboratorio/testes/*.test.js` | Topologia das protoboards; redes; schema e ida e volta do JSON; solucionador (série, paralelo, divisor, LED, curto); diagnósticos; Intel HEX; emulador; Blink (7.6); desafios |

## 10. Fases

| Fase | Branch | Entrega |
| ---- | ------ | ------- |
| 1a | `feat/sd-eletronica-fundamentos` | Tipo `Grandeza`, este documento e aulas 10 a 12 com 27 exercícios |
| 1b | `feat/sd-eletronica-componentes` | Aulas 13 e 14 com 18 exercícios e o simulado 05 |
| 2 | `feat/sd-arduino-fundamentos` | Aulas 15 a 18 com 36 exercícios e a seção do laboratório com os projetos 01 a 03 guiados |
| 3 | `feat/laboratorio-circuitos` | Editor de circuitos, modelo elétrico e experimentos de eletrônica |
| 4 | `feat/laboratorio-simulacao-arduino` | avr8js, firmware da CI, editor de C++, serial e Blink (7.6) |
| 5 | `feat/sd-arduino-entradas-e-sensores` | Aulas 19 a 23 com 45 exercícios, entradas e sensores no simulador, projetos e desafios |
| 6 | `feat/sd-simulados-arduino` | Simulados 06 a 08 |

## 11. Licenças e créditos

- **avr8js:** MIT, © Uri Shaked e colaboradores. A LICENSE vai junto da cópia em `vendor/`.
- **Monaco Editor:** MIT. Já é usado pelo editor de Python, carregado do jsDelivr com SRI.
- **arduino-cli e core `arduino:avr`:** usados só na CI, para gerar o firmware. Não são distribuídos com o site.
- **Componentes e figuras do laboratório:** originais deste repositório (Apache 2.0).
