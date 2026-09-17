# Briefing — Aula 05: Git e GitHub na prática

Resumo executivo do conteúdo. Detalhamento passo a passo está em
`demo/roteiro-aula-05.md`.

## Pré-requisitos (já dados em aulas anteriores)
Versionamento, git como grafo, o que é um commit, stage, `.`/`..` no
terminal Linux, WSL.

## Objetivo da aula
Sair da teoria e colocar a mão no git de verdade: criar um repositório do
zero, entender o que existe fisicamente dentro do `.git`, e conectar esse
repositório a um remote (GitHub) via SSH.

## Base prática
Um site fake, mínimo (`index.html`, `css/style.css`, `sobre/sobre.html`),
com 4 commits reais e mensagens descritivas. Os alunos **não recebem
esses arquivos** — recebem só a pasta `.git`, e reconstroem tudo com
`git restore .` ou `git reset --hard main`. Exceção proposital: um
`.gitignore` que nunca foi commitado, e por isso não volta.

## Tópicos, em ordem

1. **Recap** — reforça grafo/commit da aula anterior (rápido).
2. **A mágica do `.git`** — abertura da aula. Passo a passo literal:
   cmd → `wsl` → achar o path certo da Área de Trabalho (varia por PC,
   `ls /mnt/c/Users/`) → `mkdir es-aula-05` → colocar o `.git` fornecido
   ali dentro → `git status` (mostra tudo "deletado") → `git restore .`
   ou `git reset --hard main` (tudo reaparece, com histórico e tudo).
   Fecha com a exceção do `.gitignore` (nunca foi commitado, não volta).
3. **O que apareceu** — só depois da mágica é que a turma olha o
   `git log --oneline` e a estrutura de pastas que "surgiu".
4. **Dentro do `.git`** — abre a pasta e olha 3 arquivos-chave:
   - `HEAD` → ponteiro pra branch atual (`ref: refs/heads/main`)
   - `refs/heads/main` → a branch em si: só um arquivo texto com o hash
     do commit mais recente
   - `config` → configuração do repositório (e onde o remote vai aparecer)
5. **Remote** — `git remote add origin <url>`, mostrando ao vivo que isso
   só escreve uma seção `[remote "origin"]` no `config`; depois
   `git push -u origin main` / `git pull`.
6. *(a definir)* Chave SSH para autenticar com o GitHub.
7. *(a definir)* Troubleshooting: mostrar `.git` escondido no VSCode.
8. *(reservado)* Fechamento/resenha — guardado à parte, não escrever
   ainda no roteiro.

## Linha pedagógica
Começa pelo efeito ("olha, os arquivos voltaram sozinhos") antes da
causa — só depois do choque é que a explicação técnica (`HEAD`, `refs`,
`config`) faz sentido pra turma. Cada conceito é mostrado abrindo um
arquivo real e comparando com a saída de um comando git (`git rev-parse`,
`git remote -v`) — nada dentro do `.git` deve parecer "mágico" depois de
explicado: é tudo arquivo texto simples, legível com `cat`.

## Pendência de preparação
Falta gerar, a partir de `demo/`, o pacote que vai pro aluno: uma cópia
só com a pasta `.git` (sem `index.html`/`css/`/`sobre/`/`.gitignore`),
zipada, pronta pra distribuir antes da aula.
