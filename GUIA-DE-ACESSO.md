# 🔑 Guia de Acesso

> [← voltar para o início](README.md)

Passo a passo para sair do zero até conseguir enviar commits **assinados** e abrir um **Pull Request** neste repositório.

- [1. Instalar o Git](#1-instalar-o-git)
- [2. Criar a conta no GitHub](#2-criar-a-conta-no-github)
- [3. Criar a chave SSH](#3-criar-a-chave-ssh)
- [4. Cadastrar a chave no GitHub](#4-cadastrar-a-chave-no-github)
- [5. Configurar o `~/.ssh/config`](#5-configurar-o-sshconfig)
- [6. Clonar o repositório](#6-clonar-o-repositório)
- [7. Configurar nome e e-mail](#7-configurar-nome-e-e-mail)
- [8. Assinar commits](#8-assinar-commits)
- [9. Fluxo do dia a dia](#9-fluxo-do-dia-a-dia)
- [10. Abrir um Pull Request](#10-abrir-um-pull-request)
- [Problemas comuns](#-problemas-comuns)

---

## 1. Instalar o Git

| Sistema | Como instalar |
| ------- | ------------- |
| macOS | `xcode-select --install` ou `brew install git` |
| Linux (Debian/Ubuntu) | `sudo apt install git` |
| Windows | Baixe em <https://git-scm.com/download/win> e use o **Git Bash** para os comandos deste guia |

Confira:

```bash
git --version
```

## 2. Criar a conta no GitHub

1. Crie a conta em <https://github.com/signup>. Se quiser separar do seu GitHub pessoal, use o e-mail da faculdade.
2. Em **Settings → Emails**, confirme que o e-mail está **verificado**. Sem isso, seus commits não aparecem ligados à sua conta.
3. Peça ao dono do repositório para te adicionar como colaborador. Você vai receber um convite por e-mail ou em <https://github.com/notifications>.

## 3. Criar a chave SSH

A chave SSH é o que te autentica no GitHub sem precisar digitar senha. Crie uma chave **só para a faculdade**:

```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com" -f ~/.ssh/school
```

- Pode definir uma senha (*passphrase*) para a chave. É recomendado.
- Isso gera dois arquivos: `~/.ssh/school` (**privada**, nunca compartilhe) e `~/.ssh/school.pub` (**pública**, vai para o GitHub).

## 4. Cadastrar a chave no GitHub

Copie a chave **pública**:

```bash
# macOS
pbcopy < ~/.ssh/school.pub
# Linux
cat ~/.ssh/school.pub
# Windows (Git Bash)
clip < ~/.ssh/school.pub
```

No GitHub, vá em **Settings → SSH and GPG keys → New SSH key** e cadastre a mesma chave **duas vezes**:

| Title | Key type | Para quê |
| ----- | -------- | -------- |
| `school (auth)` | **Authentication Key** | Fazer clone, pull e push |
| `school (signing)` | **Signing Key** | Assinar commits (passo 8) |

## 5. Configurar o `~/.ssh/config`

Se você tem mais de uma conta no GitHub (pessoal, trabalho, faculdade), crie um **alias** para cada uma. Adicione ao `~/.ssh/config` (crie o arquivo se não existir):

```ssh-config
Host github.com-school
    HostName github.com
    User git
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/school
    IdentitiesOnly yes
```

> ⚠️ **Não esqueça o `IdentitiesOnly yes`.** Sem ele, o `ssh-agent` pode oferecer primeiro a chave de **outra** conta. O GitHub aceita essa chave, te autentica com o usuário errado, e o clone falha com `ERROR: Repository not found`.

Teste a conexão:

```bash
ssh -T git@github.com-school
# Esperado: Hi <seu-usuario>! You've successfully authenticated...
```

Se aparecer o usuário errado, veja [Problemas comuns](#-problemas-comuns).

## 6. Clonar o repositório

Use o **alias** (`github.com-school`) no lugar de `github.com`:

```bash
git clone git@github.com-school:rps4-school/school-cc.git
cd school-cc
```

Para garantir que este repo **sempre** use a chave da faculdade, mesmo se o remote for alterado:

```bash
git config core.sshCommand "ssh -i ~/.ssh/school -o IdentitiesOnly=yes"
```

## 7. Configurar nome e e-mail

Configure **só neste repositório** (sem `--global`), para não misturar com suas outras contas:

```bash
git config user.name  "seu-usuario-github"
git config user.email "seu-email@exemplo.com"
```

O e-mail precisa ser um dos e-mails **verificados** na sua conta do GitHub.

Confira:

```bash
git var GIT_COMMITTER_IDENT
```

## 8. Assinar commits

Commits assinados ganham o selo **Verified** no GitHub, que prova que foi você mesmo quem fez o commit. Dá para usar a própria chave SSH:

```bash
git config gpg.format ssh
git config user.signingkey ~/.ssh/school.pub
git config commit.gpgsign true
git config tag.gpgsign true
```

Para conseguir verificar assinaturas localmente (opcional):

```bash
echo "seu-email@exemplo.com $(cat ~/.ssh/school.pub)" >> ~/.ssh/allowed_signers
git config gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
```

Teste:

```bash
git commit --allow-empty -m "teste de assinatura"
git log --show-signature -1   # deve mostrar: Good "git" signature
```

Depois do push, o commit deve aparecer como **Verified** no GitHub. Se aparecer **Unverified**, confira se a chave foi cadastrada como **Signing Key** (passo 4) e se o `user.email` é um e-mail verificado da conta.

## 9. Fluxo do dia a dia

> ⚠️ **Nunca faça commit direto na `main`.** Toda mudança entra por uma **branch** e um **Pull Request** (passo 10).

```bash
git switch main
git pull                                      # atualiza a main
git switch -c resumo/python-condicionais   # cria uma branch
# ... edita os arquivos ...
git add conteudo/python/
git commit -m "docs(python): resumo de estruturas condicionais"
git push -u origin HEAD                       # envia a branch
```

Os padrões de nome de branch, commit e arquivo estão no [Guia de Contribuição](CONTRIBUTING.md). Quer entender melhor cada comando? Veja o [material de Git](conteudo/git/README.md).

## 10. Abrir um Pull Request

Um **Pull Request (PR)** é um pedido para juntar a sua branch na `main`. Ele permite que outra pessoa revise o que você fez antes de entrar no repositório.

### Pelo site do GitHub

1. Depois do `git push`, abra <https://github.com/rps4-school/school-cc>.
2. Vai aparecer um aviso amarelo com o nome da sua branch. Clique em **Compare & pull request**.
   Se o aviso não aparecer, vá em **Pull requests → New pull request** e escolha `base: main` ← `compare: sua-branch`.
3. Preencha:
   - **Título:** o mesmo padrão do commit, por exemplo `docs(python): resumo de estruturas condicionais`.
   - **Descrição:** o que você adicionou ou mudou e por quê.
4. Em **Reviewers**, à direita, escolha quem vai revisar.
5. Clique em **Create pull request**.

### Pelo terminal (opcional)

Com o [GitHub CLI](https://cli.github.com/) instalado e logado (`gh auth login`):

```bash
gh pr create --base main --title "docs(python): resumo de estruturas condicionais" --body "Adiciona resumo de if/else e switch."
```

### Depois de abrir

| Situação | O que fazer |
| -------- | ----------- |
| Pediram ajustes | Corrija na **mesma branch**, faça commit e `git push`. O PR atualiza sozinho. |
| PR aprovado | Clique em **Merge pull request** (ou peça para quem revisou fazer o merge). |
| Depois do merge | Volte para a `main` e apague a branch local (comandos abaixo). |

```bash
git switch main
git pull                                        # traz o seu merge
git branch -d resumo/python-condicionais  # apaga a branch local
```

📖 Referência: [GitHub Docs: Criar um pull request](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

---

## 🩺 Problemas comuns

<details>
<summary><code>ERROR: Repository not found</code> ou autenticou com o usuário errado</summary>

Rode `ssh -v -T git@github.com-school 2>&1 | grep -E "Offering|accepts"` para ver qual chave foi aceita. Se não for a `~/.ssh/school`:

- adicione `IdentitiesOnly yes` no bloco do `~/.ssh/config` (passo 5);
- confira se o remote usa o alias: `git remote -v` deve mostrar `git@github.com-school:...`. Para corrigir:
  `git remote set-url origin git@github.com-school:rps4-school/school-cc.git`;
- confira se você já aceitou o convite de colaborador.
</details>

<details>
<summary><code>Permission denied (publickey)</code></summary>

- A chave pública foi cadastrada como **Authentication Key**?
- As permissões estão corretas? Rode `chmod 600 ~/.ssh/school` e `chmod 644 ~/.ssh/school.pub`.
- O caminho em `IdentityFile` está certo?
</details>

<details>
<summary>Commit aparece como <strong>Unverified</strong></summary>

- A chave foi cadastrada também como **Signing Key**?
- O `git config user.email` é um e-mail **verificado** na sua conta?
- O `git log --show-signature -1` mostra a assinatura? Se não mostrar, reveja o passo 8.
</details>

<details>
<summary>O Git pede a passphrase toda hora</summary>

No macOS, adicione ao bloco do `~/.ssh/config`:

```ssh-config
    AddKeysToAgent yes
    UseKeychain yes
```

Depois rode `ssh-add --apple-use-keychain ~/.ssh/school` uma vez.
</details>
