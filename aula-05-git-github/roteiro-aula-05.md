# Roteiro — Aula 05: Git e GitHub na prática

Engenharia de Software · Bimestre 01 · Unifaat
Pré-requisito já dado (Aula 04): versionamento, git como grafo linear
(sem branch — fica pra outra disciplina), commit, `git add`/`status`/
`log`/`checkout`/`diff`, `HEAD`, `reset --soft`/`--hard`, `.` e `..` no
terminal Linux, WSL.

**A pegadinha da aula:** os alunos recebem **só a pasta `.git`** (nada de
`index.html`, `css/`, `sobre/`). O projeto inteiro — todos os arquivos,
todo o histórico de commits — vai "aparecer" a partir dela.

---

## 0. Recap prático (aula 04)

Antes de entrar no assunto novo, reproduzam rapidinho o fluxo básico
visto na aula passada — mãos no teclado, não só relembrar de cabeça.
Use uma pasta descartável, fora da pasta da demo de hoje.

```bash
mkdir recap-aula-04
cd recap-aula-04
git init
```

Abram o VS Code (`code .`) e criem um arquivo `anotacoes.txt` com uma
primeira linha de texto (do jeito que já fizeram na aula 04 — sem
atalho de terminal pra criar arquivo, só editando mesmo).

```bash
git add .
git commit -m "Cria anotacoes.txt com a primeira anotacao"
```

Voltem no arquivo, acrescentem uma segunda linha, salvem, e commitem de
novo:

```bash
git add .
git commit -m "Adiciona segunda linha em anotacoes.txt"
git log --oneline
```

Feche com o hard delete, só pra reativar a memória (vai reaparecer daqui
a pouco, na mágica do `.git`):

```bash
git reset --hard HEAD~1
git log --oneline
```

Pergunte antes de rodar: "isso vai deixar 1 ou 2 commits no log?"
(resposta: 1 — o `reset --hard` descarta o commit mais recente por
completo, sem deixar rastro).

Pode apagar a pasta `recap-aula-04` depois — ela só existiu pra
reaquecer os dedos.

---

## 1. A mágica do `.git`

Antes de explicar qualquer coisa, faça a turma reproduzir os passos.
Ninguém ainda sabe o que tem dentro da pasta que vai receber.

### 1.1 Preparar o terminal

1. Abrir o **Prompt de Comando** (cmd) do Windows.
2. Digitar `wsl` e apertar Enter — isso entra no ambiente Linux.

```bash
wsl
```

### 1.2 Chegar até a Área de Trabalho

⚠️ **Atenção:** o caminho da Área de Trabalho muda de PC pra PC, porque
depende do nome de usuário do Windows naquela máquina — e esse nome
**não** é necessariamente igual ao usuário do WSL (então `whoami` dentro
do WSL não ajuda aqui). Primeiro descubra o nome certo:

```bash
ls /mnt/c/Users/
```

Vai aparecer uma lista de pastas — uma delas é o nome do usuário do
Windows daquele computador. Use esse nome no próximo comando:

```bash
cd /mnt/c/Users/NOME_QUE_APARECEU/Desktop
```

### 1.3 Criar a pasta da aula

```bash
mkdir es-aula-05
cd es-aula-05
```

### 1.4 Colocar o `.git` fornecido dentro dessa pasta

Distribua o material (zip, pendrive, AVA — o que for combinado) contendo
**apenas** a pasta `.git`. Oriente os alunos a extrair/copiar de forma
que o resultado seja `es-aula-05/.git` (e não
`es-aula-05/alguma-coisa/.git`).

```bash
ls -la
```

Só deve aparecer `.git`. Nenhum arquivo do projeto.

### 1.5 O suspense

```bash
git status
```

O git vai dizer que `index.html`, `style.css` e `sobre.html` foram
**deletados**. Pergunte: "cadê os arquivos? isso aqui nem chegou a
existir pra vocês."

### 1.6 A mágica

```bash
git restore .
```

ou

```bash
git reset --hard main
```

```bash
ls -la
git log --oneline
```

Os arquivos reaparecem, com toda a estrutura de pastas — e o histórico
inteiro de commits junto, com as mensagens originais. Ninguém digitou
nada disso.

### 1.7 A exceção: `.gitignore`

Se o projeto tiver um `.gitignore`, ele **não volta**. Deixe a pergunta
no ar até alguém notar, ou aponte direto: por quê?

**Resposta:** porque o `.gitignore` nunca foi commitado — ele só existia
solto na pasta de trabalho, nunca entrou no índice nem virou objeto
dentro do `.git`. Isso fecha a lição principal do dia: **só o que foi
commitado mora dentro do `.git`. O resto é só arquivo solto no disco.**

---

## 2. O que apareceu

Agora que o projeto "surgiu", explore o que veio junto:

```
es-aula-05/
├── index.html
├── css/
│   └── style.css
└── sobre/
    └── sobre.html
```

```bash
git log --oneline
```

```
1878ee0 adiciona roteiro-aula-05.md ao repositorio
f56180f preenche o conteudo da pagina sobre e cria link da home para ela
ae17b87 adiciona texto de boas-vindas na home e define cor de fundo e da fonte
99d7856 cria estrutura inicial da pagina: index.html, css/style.css e sobre/sobre.html
```

Cada commit tem uma mensagem descritiva do que mudou — reforce que
mensagem de commit boa não é "ajustes" ou "fix", é contar o que mudou e
por quê.

---

## 3. Por dentro do `.git`

Continua o mistério: como é que só aquela pasta guardava tudo isso?

### 3.1 Uma primeira espiada

```bash
ls -la .git
```

Vão aparecer coisas como `HEAD`, `config`, `description`, `hooks/`,
`info/`, `objects/`, `refs/`. Não precisa explicar tudo — hoje o foco é
em três arquivos bem simples: `HEAD`, `refs/heads/main` e `config`.

### 3.2 `HEAD` — pra onde eu tô "olhando" agora

```bash
cat .git/HEAD
```

```
ref: refs/heads/main
```

`HEAD` não guarda um commit direto — ele é um ponteiro pra **outro
ponteiro**: a branch atual. É assim que o git sabe em qual branch você
está quando você roda `git status` ou faz um commit novo.

### 3.3 `refs/heads/main` — o que uma branch realmente é

```bash
cat .git/refs/heads/main
```

```
1878ee023677560b204d2427f3a3c900c1c0986b
```

Esse é o mesmo hash que aparece em `git log --oneline` no topo (o commit
mais recente). Compare ao vivo:

```bash
git rev-parse main
```

**A ficha que precisa cair aqui:** a branch `main` não é uma estrutura
complexa nem uma cópia de arquivos — é literalmente **um arquivo de
texto com um hash de commit dentro**. (Não é o momento de abrir a porta
de branches múltiplas — isso fica pra outra disciplina — mas já ajuda a
desmistificar HEAD, que a turma já viu na Aula 04.)

### 3.4 `config` — onde mora a configuração do repositório (e o remote)

```bash
cat .git/config
```

```ini
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
```

Por enquanto só tem a seção `[core]` (configuração básica do repo). Isso
vai mudar na próxima seção, quando adicionarmos um remote — e é exatamente
esse arquivo que vai ganhar uma entrada nova.

---

## 4. Remote

**Conceito central:** GitHub não é "o git" — é só um **remote**: um
repositório git rodando num servidor de terceiros, que o seu git local
sabe sincronizar via `push`/`pull`. Poderia ser GitLab, Bitbucket, ou um
servidor da própria faculdade.

### 4.1 Antes de adicionar

```bash
cat .git/config
```

(mostra só `[core]`, como na seção 3.4 — deixe a turma reparar nisso)

### 4.2 Adicionando o remote

```bash
git remote add origin git@github.com:usuario/repo.git
git remote -v
```

### 4.3 Depois de adicionar — olha o `config` de novo

```bash
cat .git/config
```

```ini
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = git@github.com:usuario/repo.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

**A ficha que precisa cair aqui:** `git remote add` não fez mágica nenhuma
de rede — só **escreveu duas linhas num arquivo texto**. O "remote" é
só isso: um apelido (`origin`) associado a uma URL, guardado no mesmo
`config` que a gente acabou de ler.

### 4.4 Sincronizando de fato

```bash
git push -u origin main
git pull
```

- `-u` (upstream) na primeira vez liga o branch local `main` ao branch
  remoto `main`; depois disso, `git push`/`git pull` funcionam sem
  argumento.
- `origin` é só uma convenção de nome — poderia se chamar qualquer coisa.

---

## 5. Chave SSH

```bash
ssh-keygen -t ed25519 -C "email-do-aluno@exemplo.com"
cat ~/.ssh/id_ed25519.pub
```

No GitHub: **Settings → SSH and GPG keys → New SSH key** → cola a chave
pública. Testar com:

```bash
ssh -T git@github.com
```

**Analogia rápida:** a chave pública é como um cadeado que você entrega
pro GitHub guardar; a chave privada é a única chave que abre esse
cadeado, e fica só com você.

---

## 6. Troubleshooting: mostrar a pasta `.git` no VSCode

Por padrão o VSCode **esconde** `.git` no explorer.

1. `Ctrl + ,` (Settings)
2. Buscar por `files.exclude`
3. Desmarcar/apagar a entrada `**/.git`

```json
{
  "files.exclude": {
    "**/.git": false
  }
}
```

*(fechamento/resenha da aula: guardado à parte, não escrever aqui ainda)*
