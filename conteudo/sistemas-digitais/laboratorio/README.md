# 🔬 Laboratório Arduino

> [← voltar para Sistemas Digitais](../README.md)

**Nível:** 🟢 Iniciante

Projetos guiados de Arduino, do primeiro LED à cancela automática com sensor e servo, experimentos de eletrônica e desafios com conferência automática, num laboratório que roda aqui no site: ele monta o circuito, calcula as correntes e roda o programa do Arduino. Cada atividade traz a montagem, os casos de teste e dicas para destravar.

> 📖 **Antes, leia:** [Arduino Uno](../aulas/15-arduino-uno.md) e [Saídas digitais, LED e Blink](../aulas/17-saidas-digitais.md). Para o projeto 01, também o [Monitor serial](../aulas/18-monitor-serial.md).

## 🔋 Simulador de circuitos

Monte com protoboard, fios, pilhas, bateria, resistores, LEDs, interruptor, botão, potenciômetro, LDR e multímetro, e, com o Arduino, LED RGB, buzzer, sensor PIR, ultrassom e servo. O simulador calcula as tensões e as correntes, acende os LEDs e avisa quando algo está errado: curto-circuito, LED sem resistor ou invertido, amperímetro em paralelo, pernas na mesma tira.

<div class="laboratorio" data-exemplos="exemplos.json" data-titulo="Laboratório livre" data-descricao="Comece do zero ou abra um dos exemplos na aba Projeto. O que você montar fica salvo neste navegador."></div>

> 💡 O simulador abre só no site. No GitHub, os circuitos dos experimentos estão nos arquivos `circuito.json` de cada pasta.

| Experimento | O que você faz |
| ----------- | -------------- |
| [**01 · LED com resistor**](experimentos/01-led-com-resistor/README.md) | Mede a corrente do LED e vê o que acontece com o resistor errado, sem resistor e com o LED virado |
| [**02 · Série e paralelo**](experimentos/02-serie-e-paralelo/README.md) | Mede tensões e correntes de dois resistores em série e em paralelo |
| [**03 · Divisor de tensão**](experimentos/03-divisor-de-tensao/README.md) | Compara a fórmula com o divisor fixo, o potenciômetro e o LDR |

## 🧭 Como fazer cada projeto de Arduino

1. **Escolha onde montar:** no laboratório do site (o botão **Abrir no laboratório** de cada projeto), com o circuito pronto e o programa rodando num Arduino Uno simulado. Para rodar um código escrito por você, use o [Tinkercad Circuits](https://www.tinkercad.com/circuits) ou o [Wokwi](https://wokwi.com/) (grátis, no navegador), ou a placa de verdade.
2. **Monte** pela figura e pela tabela de ligações. Confira cada fio antes de ligar.
3. **Programe** a partir do código inicial. Travou? Abra **uma** dica de cada vez.
4. **Rode os casos de teste** do projeto: eles mostram o que acontece com a montagem certa e com cada defeito comum.
5. **Confira os critérios** de conclusão e só então compare com a solução.

## 🤖 Projetos de Arduino

| Projeto | O que você faz |
| ------- | -------------- |
| [**01 · Blink**](projetos/01-blink/README.md) | Pisca um LED no pino 8 e acompanha cada troca no monitor serial |
| [**02 · Dois LEDs alternados**](projetos/02-dois-leds-alternados/README.md) | Dois LEDs que se revezam, e as variações síncrona e ritmada |
| [**03 · Semáforo**](projetos/03-semaforo/README.md) | Três LEDs em sequência, cada um com o seu tempo |
| [**04 · Botão e LED**](projetos/04-botao-e-led/README.md) | Lê um botão com o pull-up interno e vê o que faz um pino solto |
| [**05 · Pisca sem delay**](projetos/05-pisca-sem-delay/README.md) | Dois LEDs em ritmos diferentes com `millis()`, e o que dá errado com `delay()` |
| [**06 · Potenciômetro e monitor serial**](projetos/06-potenciometro-e-serial/README.md) | Lê o A0 e mostra a leitura, a tensão e a posição |
| [**07 · Dimmer com PWM**](projetos/07-dimmer-pwm/README.md) | O potenciômetro controla o brilho do LED com `analogWrite()` |
| [**08 · Luz automática**](projetos/08-luz-automatica/README.md) | Um LDR num divisor de tensão acende o LED quando escurece |
| [**09 · Campainha**](projetos/09-campainha/README.md) | O botão toca duas notas no buzzer com `tone()` |
| [**10 · LED RGB**](projetos/10-led-rgb/README.md) | Mistura vermelho, verde e azul com três pinos PWM |
| [**11 · Alarme de movimento**](projetos/11-alarme-de-movimento/README.md) | Sensor PIR, buzzer e detecção de borda |
| [**12 · Cancela automática**](projetos/12-cancela-automatica/README.md) | Ultrassom mede a distância e o servo levanta a cancela |

## 🧩 Desafios com conferência

Nos desafios, você monta e o laboratório **confere**: ele mede o que o circuito faz (a corrente do LED com o pino em HIGH e em LOW, os erros de montagem) e, quando há programa, roda o firmware e aperta os botões sozinho. Não importa onde você pôs cada peça: qualquer montagem que funcione passa. Quando tudo passa, a página fica marcada no seu progresso.

| Desafio | O que você faz |
| ------- | -------------- |
| [**01 · Monte o Blink**](desafios/01-monte-o-blink/README.md) | Monta do zero o LED com resistor no pino 8 |
| [**02 · O resistor certo**](desafios/02-resistor-certo/README.md) | Escolhe o resistor para o LED ficar entre 10 mA e 15 mA |
| [**03 · O botão acende o LED**](desafios/03-botao-acende-o-led/README.md) | Liga os fios para o programa do botão funcionar |

## ✅ O que este laboratório tem

| Recurso | Situação |
| ------- | -------- |
| Montagem (figura e tabela de ligações), código inicial, dicas e solução | ✅ Em todos os projetos |
| Casos de teste e critérios de conclusão | ✅ Em todos os projetos, para conferir no simulador ou na placa |
| Conferência automática da montagem | ✅ Nos desafios: critérios elétricos (corrente do LED, pino em HIGH e em LOW, erros) e de comportamento (o firmware rodando, com o botão apertado e solto). Nos projetos, a conferência é sua, pelos casos de teste |
| Código das soluções | ✅ Compila para o Arduino Uno (o arquivo `.ino` de cada pasta) |
| Montar e medir circuitos de eletrônica no site | ✅ Em corrente contínua: pilhas, bateria, 5V e 3.3V do Arduino, resistor, LED, interruptor, botão, potenciômetro, LDR e multímetro (V e A) |
| Rodar os programas dos projetos no site | ✅ Num ATmega328P emulado (avr8js), com o firmware compilado no build do site: Executar, Parar, Reiniciar, monitor serial e as variantes com defeito |
| Entradas e sensores com o programa rodando | ✅ Botão (com o pull-up interno), potenciômetro e LDR no ADC, sensor PIR (botão de movimento) e ultrassom HC-SR04 (distância ajustável, com o eco no tempo certo) |
| Saídas além do LED | ✅ Brilho por PWM, LED RGB, buzzer (frequência medida no pino e, se quiser, o som no computador) e servo (ângulo pela largura do pulso) |
| Rodar um código escrito ou mudado por você | ❌ O site não compila C++. Baixe o `.ino` e use a IDE do Arduino ou o Wokwi |
| Capacitor, transistor, motor, relé e outros | ❌ Fora do simulador: ele não calcula transitórios nem componentes não lineares além do LED. O servo e os sensores são modelos de comportamento, não de circuito |
| Pino de entrada solto | ⚠️ No simulador, lê sempre `LOW` (ou 0 no ADC). Na placa, lê valores que mudam sozinhos |

> ⚠️ **Segurança:** monte e mude as ligações com a placa **desligada** do USB. LED sempre com resistor, e nunca ligue um pino direto no GND ou no 5V.

## 📚 Referências

- MCROBERTS, Michael. *Arduino básico*. 2. ed. São Paulo: Novatec, 2015.
- MONK, Simon. *Programação com Arduino: começando com sketches*. 2. ed. Porto Alegre: Bookman, 2017.
- BANZI, Massimo; SHILOH, Michael. *Primeiros passos com o Arduino*. 2. ed. São Paulo: Novatec, 2015.
- [Tutoriais oficiais do Arduino](https://docs.arduino.cc/built-in-examples/) (em inglês): os exemplos Blink e afins, com montagem e código.
