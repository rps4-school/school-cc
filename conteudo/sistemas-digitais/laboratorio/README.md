# 🔬 Laboratório Arduino

> [← voltar para Sistemas Digitais](../README.md)

**Nível:** 🟢 Iniciante

Projetos guiados de Arduino, do primeiro LED ao semáforo, com a montagem, o código, os casos de teste e dicas para destravar. Faça num simulador on-line ou com a placa de verdade.

> 📖 **Antes, leia:** [Arduino Uno](../aulas/15-arduino-uno.md) e [Saídas digitais, LED e Blink](../aulas/17-saidas-digitais.md). Para o projeto 01, também o [Monitor serial](../aulas/18-monitor-serial.md).

## 🧭 Como fazer cada projeto

1. **Escolha onde montar:** no [Tinkercad Circuits](https://www.tinkercad.com/circuits) ou no [Wokwi](https://wokwi.com/) (grátis, no navegador), ou com a placa, a protoboard e os componentes.
2. **Monte** pela figura e pela tabela de ligações. Confira cada fio antes de ligar.
3. **Programe** a partir do código inicial. Travou? Abra **uma** dica de cada vez.
4. **Rode os casos de teste** do projeto: eles mostram o que acontece com a montagem certa e com cada defeito comum.
5. **Confira os critérios** de conclusão e só então compare com a solução.

## 🧪 Projetos

| Projeto | O que você faz |
| ------- | -------------- |
| [**01 · Blink**](projetos/01-blink/README.md) | Pisca um LED no pino 8 e acompanha cada troca no monitor serial |
| [**02 · Dois LEDs alternados**](projetos/02-dois-leds-alternados/README.md) | Dois LEDs que se revezam, e as variações síncrona e ritmada |
| [**03 · Semáforo**](projetos/03-semaforo/README.md) | Três LEDs em sequência, cada um com o seu tempo |

## ✅ O que este laboratório tem

| Recurso | Situação |
| ------- | -------- |
| Montagem (figura e tabela de ligações), código inicial, dicas e solução | ✅ Em todos os projetos |
| Casos de teste e critérios de conclusão | ✅ Em todos os projetos, para conferir no simulador ou na placa |
| Código das soluções | ✅ Compila para o Arduino Uno (o arquivo `.ino` de cada pasta) |
| Montar e simular dentro deste site | ❌ Ainda não: use o Tinkercad ou o Wokwi |

> ⚠️ **Segurança:** monte e mude as ligações com a placa **desligada** do USB. LED sempre com resistor, e nunca ligue um pino direto no GND ou no 5V.

## 📚 Referências

- MCROBERTS, Michael. *Arduino básico*. 2. ed. São Paulo: Novatec, 2015. Projetos 1 a 3.
- BANZI, Massimo; SHILOH, Michael. *Primeiros passos com o Arduino*. 2. ed. São Paulo: Novatec, 2015.
- [Tutoriais oficiais do Arduino](https://docs.arduino.cc/built-in-examples/) (em inglês): os exemplos Blink e afins, com montagem e código.
