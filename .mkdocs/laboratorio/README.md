# Laboratório Arduino: código

Simulador de circuitos de corrente contínua que roda no navegador, sem framework e sem bundler. Este README é para quem mexe no código; o conteúdo para o aluno fica em `conteudo/sistemas-digitais/laboratorio/`. O desenho completo (decisões, formato do projeto, fases) está no spec `.mkdocs/specs/2026-10-18-sistemas-digitais-arduino-design.md`.

## Como chega ao aluno

1. Uma página tem `<div class="laboratorio" data-projeto="circuito.json"></div>` (ou `data-exemplos="exemplos.json"`).
2. `.mkdocs/laboratorio.js` (bootstrap pequeno, `defer`, em todas as páginas) troca o `<div>` por um cartão com o botão **Abrir no laboratório**.
3. No clique, ele faz `import()` de `laboratorio/app.js`, e só aí os módulos são baixados.
4. O `visual.py` publica os `.js` e `.json` desta pasta em `assets/javascripts/laboratorio/`, menos `testes/` e o `package.json` (que só diz ao Node que os `.js` são módulos).

## Módulos

| Módulo | O que faz | Toca no DOM? |
| ------ | --------- | ------------ |
| `protoboard.js` | Furos, tiras ligadas por dentro e posição de cada furo (400 e 830 furos; a de 830 tem os barramentos divididos no meio) | Não |
| `catalogo.js` | Componentes: terminais, pegada na protoboard, propriedades, ligações internas e nomes | Não |
| `projeto.js` | Formato do projeto (schema 1): validar, migrar, serializar e criar ids | Não |
| `netlist.js` | Redes por union-find: fios, pernas encaixadas, tiras e ligações internas | Não |
| `solucionador.js` | Análise nodal em corrente contínua, com o LED em dois trechos | Não |
| `circuito.js` | Projeto → elementos elétricos → resultado por componente; `formatar()` dos números | Não |
| `diagnostico.js` | Avisos em português: curto, LED sem resistor ou invertido, pernas na mesma tira, barramento dividido, perna solta, tensão demais num pino do Uno | Não |
| `geometria.js` | Posição de terminais, encaixe pela pegada, primeiro lugar livre e caixa de cada componente | Não |
| `desenhos.js` | SVG de cada componente (desenhos próprios do repositório) | Só gera texto |
| `vista.js` | Monta o SVG do circuito e das marcas (seleção, furos ligados, prévia, avisos) | Só gera texto |
| `edicao.js` | Mouse, toque e teclado na área do circuito | Sim |
| `painel.js` | As abas do painel: Adicionar, Selecionado, Conexões, Medidas, Projeto e Instruções | Sim |
| `armazenamento.js` | localStorage (rascunho automático e projetos salvos) e arquivos JSON | Sim |
| `app.js` | A sobreposição: estado, histórico de desfazer, carga do projeto e fechamento na troca de página | Sim |
| `intelhex.js` | Lê o firmware (Intel HEX) para os 32 KB da flash | Não |
| `uno.js` | Pino do Uno → porta e bit do ATmega328P, pinos PWM, canais do ADC e limiares de entrada | Não |
| `emulador.js` | ATmega328P a 16 MHz (avr8js): CPU, timers 0 a 2, portas B, C e D, USART0 e ADC | Não |
| `simulacao.js` | Programa + circuito no mesmo tempo simulado; brilho dos LEDs pela corrente média | Não |
| `simulacao-worker.js` | Worker (`type: "module"`) que roda a simulação no ritmo do relógio e manda quadros | Só mensagens |
| `programa.js` | Abas Código (Monaco em C++) e Serial, e o controle do worker: Executar, Parar e Reiniciar | Sim |
| `vendor/avr8js/` | Cópia do avr8js 0.21.1 (MIT) com os imports em `.js`, gerada por `npm run vendor --prefix .mkdocs` | — |
| `compilar.py` e `instalar-arduino-cli.sh` | Compilação dos sketches na CI (arduino-cli e core em versões fixas) | — |

A regra é a do spec: o que é lógica pura não toca o DOM e tem teste no Node.

## Modelo elétrico

- **Redes:** cada furo e cada terminal é um nó; fios, pernas encaixadas, tiras e ligações internas juntam nós (`netlist.js`).
- **Elementos** (`circuito.js`):
  - resistor, potenciômetro (dois resistores) e LDR (1 MΩ no escuro a 1 kΩ com luz, em escala logarítmica);
  - fontes com resistência interna pequena: pilhas (1,5 V cada), bateria de 9 V, 5V e 3.3V do Uno;
  - multímetro: 10 MΩ entre as pontas em **V** e 0,05 Ω em **A**;
  - LED: aberto abaixo da tensão dele; até 30 mA, a tensão da cor com 0,05 Ω em série (bate com as contas das aulas); acima de 30 mA, 10 Ω, para que um LED sem resistor dê centenas de mA e não um curto de dezenas de ampères.
- **Fontes e LEDs quase ideais:** as leituras saem iguais às contas do papel. O laboratório diz isso ao aluno.
- **Pinos do Uno:** `analisar(projeto, { pinos: { D8: { modo: "saida", nivel: 1 } } })` transforma um pino em fonte de 5 V ou 0 V atrás de 25 Ω, ou liga o pull-up de 35 kΩ. Sem `pinos`, os pinos ficam soltos. É por aí que o emulador entra (`simulacao.js`).

## Programa do Arduino

O site **não compila C++**. Cada sketch do laboratório (`conteudo/**/laboratorio/**/*.ino`) é compilado na CI:

1. `instalar-arduino-cli.sh` instala o arduino-cli 1.5.1 (com o SHA-256 conferido) e o core `arduino:avr` 1.8.8.
2. `compilar.py` copia cada `.ino` para uma pasta com o nome dele (o arduino-cli exige), compila para `arduino:avr:uno` e grava em `FIRMWARE_DIR` o `.hex` e o `.compilacao.json` (o relatório de tamanho), no mesmo caminho do `.ino`.
3. O build recebe `FIRMWARE_DIR`, e o `visual.py` publica esses arquivos ao lado do `.ino`.

No laboratório, o `circuito.json` do projeto diz qual é o sketch (`sketch`) e as variantes (`variantes`). O `programa.js` busca o texto e o firmware de cada um. **Executar** roda o firmware do sketch cujo texto é igual ao do editor (sem contar espaços no fim das linhas). Com o texto editado, ele avisa que o site não compila e não roda nada. Para ligar um compilador de verdade no futuro (spec, seção 8), é só a função `compilar()` do `programa.js` que muda.

O emulador roda num worker, em fatias de 2 ms de tempo simulado, segurado pelo relógio. A cada uns 33 ms ele manda um quadro:

- `tempo` e `velocidade` (% do tempo real);
- `pinos`: modo e nível de cada pino;
- `leds`: corrente média de cada LED desde o quadro anterior, o que já dá o brilho do PWM;
- `serial`: o texto novo da USART.

Quando o programa muda um pino, `simulacao.js` resolve o circuito de novo, com os pinos de saída como fontes de 5 V ou 0 V atrás de 25 Ω. Os resultados ficam num cache por estado dos pinos, então um PWM não refaz a conta a cada borda. Os pinos de entrada recebem o nível da rede deles (LOW abaixo de 1,5 V, HIGH acima de 3 V), e A0 a A5, a tensão.

### Rodar os testes com firmware no seu computador

Precisa do arduino-cli com o core `arduino:avr`. No Windows, use uma pasta de dados com caminho curto: o avr-gcc não acha os próprios arquivos com caminhos de mais de 260 caracteres.

```bash
python .mkdocs/laboratorio/compilar.py --saida /tmp/firmware          # --arduino-cli <caminho>, se não estiver no PATH
FIRMWARE_DIR=/tmp/firmware node --test ".mkdocs/laboratorio/testes/*.test.js"
FIRMWARE_DIR=/tmp/firmware SITE_DIR=/tmp/school-cc-site mkdocs build --strict -f .mkdocs/mkdocs.yml
```

Sem `FIRMWARE_DIR`, os testes que rodam programa ficam *skip*, com o motivo. Na CI, `EXIGIR_FIRMWARE=1` transforma a falta do firmware em falha. Num build sem firmware, o laboratório avisa que o programa não foi compilado.

## Formato do projeto

O JSON do projeto (schema 1) está descrito no spec, seção 7.2. Em resumo: `components` com `id`, `type`, `x`, `y`, `rot`, `props` e `mount` (pino → `"protoboard:furo"`), e `connections` com `from`, `to` e `color`. A elétrica não usa coordenadas.

## Como acrescentar um componente

1. Em `catalogo.js`, acrescente o tipo em `TIPOS`: nome, categoria, prefixo do id, terminais e, se encaixa na protoboard, a `pegada` (colunas e linhas de cada perna a partir da primeira). Componente solto (`livre: true`) leva largura, altura e a posição de cada terminal.
2. Se ele liga terminais por dentro (como o botão), responda em `ligacoesInternas()`.
3. Em `circuito.js`, transforme o componente em resistores, fontes ou LEDs, e devolva o resultado dele.
4. Em `desenhos.js` e `vista.js`, desenhe. Em `painel.js`, ponha os controles das propriedades.
5. Teste em `testes/`: pelo menos um circuito com o número esperado e um diagnóstico, se houver.

## Testes

```bash
node --test ".mkdocs/laboratorio/testes/*.test.js"
```

- `exemplos.test.js` valida todo `circuito.json` do conteúdo e confere as leituras citadas nos roteiros dos experimentos.
- `blink.test.js` é o marco de aceite do spec (seção 7.6): o Blink do enunciado nos 9 casos, em tempo simulado. Ele precisa do firmware (veja acima).
- `emulador.test.js` cobre o Intel HEX e o semáforo rodando no ATmega328P emulado.

## Limites conhecidos

- Só corrente contínua: sem capacitor, indutor, transitórios, transistor, motor ou não linearidade além do LED.
- Código editado não compila no site: só rodam os sketches compilados na CI.
- O LED não queima de verdade: acima de 30 mA, ele só mostra o erro.
