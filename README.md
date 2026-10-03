# 🎓 school-cc

Bem-vindo(a)! Este repositório é uma **fonte de estudo para quem cursa Ciência da Computação**, feita de aluno para aluno. Aqui ficam resumos, exercícios, roadmaps, dicas e materiais de apoio, organizados por tema.

> 🌐 **Leia no site:** <https://rps4-school.github.io/school-cc/>. Tem busca, menu lateral e modo escuro, e não precisa de conta no GitHub.

## 🚀 Primeiros passos

1. **Nunca usou Git/GitHub ou ainda não tem acesso?** Comece pelo [**Guia de Acesso**](GUIA-DE-ACESSO.md): criar conta, configurar a chave SSH, clonar o repo e assinar commits.
2. **Quer adicionar ou corrigir material?** Leia o [**Guia de Contribuição**](CONTRIBUTING.md).
3. **Quer só estudar?** Escolha um tema abaixo.

## 📚 Conteúdo

Todo o material fica em [**conteudo/**](conteudo/README.md), com uma pasta por tema:

| Tema | O que tem |
| ---- | --------- |
| [**Python**](conteudo/python/README.md) | Resumos (condicionais, listas, matrizes) e 27 exercícios com resposta comentada, em 3 níveis |
| [**Sistemas Digitais**](conteudo/sistemas-digitais/README.md) | 9 aulas completas, do binário ao Mapa de Karnaugh, e 81 exercícios com correção automática no site |
| [**Git**](conteudo/git/README.md) | O que é o Git, comandos do dia a dia, branches e como desfazer erros |

## 📝 Simulados

Provas de treino com tempo, pontuação e regras de prova de verdade, para testar o que você aprendeu. Veja [**simulados/**](simulados/README.md).

## 🗂️ Como o repositório está organizado

```
school-cc/
├── README.md               ← você está aqui
├── GUIA-DE-ACESSO.md       ← setup de Git, SSH e assinatura de commits
├── CONTRIBUTING.md         ← como adicionar material
├── .mkdocs/                ← configuração do site (GitHub Pages)
├── simulados/              ← provas de treino (enunciado + respostas)
└── conteudo/
    ├── README.md           ← índice dos temas
    └── <tema>/             ← python, git, sistemas-digitais...
        ├── README.md       ← sobre o tema, roteiro de estudo e links
        ├── resumos/        ← um resumo por assunto
        ├── aulas/          ← aulas completas (quando o tema precisa de mais que um resumo)
        ├── exercicios/     ← enunciados e respostas
        └── materiais/      ← slides, PDFs e afins
```

## 📄 Licença

Distribuído sob a [Apache License 2.0](LICENSE).
