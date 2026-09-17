1 - Introdução

Na aula passada, fechamos o fluxo básico do Git: `init`, `status`,
`add`, `commit`, `log`, `checkout` e o par `reset --soft`/`--hard`.
Vimos que o Git organiza o histórico de um projeto como uma linha do
tempo de commits, cada um uma fotografia completa daquele momento, e
que `HEAD` é o ponteiro que marca "estou aqui agora" nessa linha do
tempo. Mas ficou uma frase pendurada no fim daquela aula, que vale
reler com atenção: "todo esse histórico de commits vive apenas na
máquina de cada um, dentro da pasta `.git`". Nenhuma cópia em outro
lugar, nenhuma forma de compartilhar esse projeto com mais ninguém.

É exatamente esse ponto em aberto que esta aula resolve — mas, antes de
sair conectando o computador de vocês à internet, vale a pena abrir essa
pasta `.git` que já vem sendo citada desde a aula passada e enxergar,
de verdade, o que existe lá dentro. Porque, no fim das contas, tudo o
que o GitHub vai fazer por vocês — guardar, sincronizar, compartilhar —
é só mexer nesses mesmos arquivos simples que já estão aí, dentro da
pasta do projeto, desde o primeiro `git init`.

2 - Por dentro da pasta `.git`

Todo repositório Git tem, na raiz do projeto, uma pasta oculta chamada
`.git` — é ela que o comando `git init` cria. "Oculta" aqui é literal:
por convenção, tanto no Linux quanto no Windows, arquivos e pastas cujo
nome começa com ponto (`.`) não aparecem por padrão num `ls` comum nem
no explorador de arquivos, precisamente pra não poluir a visão do que
importa no dia a dia — o próprio VS Code segue essa convenção e esconde
o `.git` do painel de arquivos, mesmo que ele exista ali.

Dentro dela, existem vários arquivos e pastas com funções bem
específicas — `objects`, `refs`, `hooks`, `info`, entre outros. Esta
aula não vai abrir todos: o foco recai sobre dois deles, `HEAD` e
`config`, porque são os mais simples de ler e os que mais ajudam a
entender o que vem a seguir.

2.1 - `HEAD`: o mesmo ponteiro, visto por dentro

Na aula passada, `HEAD` foi apresentado como o marcador que aponta para
o commit atual. O que não foi dito é que `HEAD` não é um conceito
abstrato — é, literalmente, um arquivo de texto dentro de `.git`, e dá
pra lê-lo com qualquer comando que exiba texto:

```bash
# "cat" imprime o conteudo de um arquivo de texto na tela.
# Aqui, olhamos o conteudo bruto do arquivo HEAD, dentro da
# pasta oculta .git do projeto.
cat .git/HEAD
```

O resultado costuma ser algo como:

```
ref: refs/heads/main
```

Ou seja: `HEAD` não guarda o hash de um commit diretamente — ele guarda
uma referência a **outro arquivo**, `refs/heads/main`, que é quem de
fato guarda o hash do commit mais recente daquela linha do tempo. Dá
pra confirmar isso na prática:

```bash
# Mostra o conteudo do arquivo que representa a branch atual (main).
# Deve ser um unico hash de commit, o mesmo que aparece no topo do
# "git log".
cat .git/refs/heads/main
```

O valor que aparece é exatamente o mesmo hash que aparece no topo do
`git log` — o commit mais recente. `HEAD` aponta pra esse arquivo, e
esse arquivo aponta pro commit. É por isso que, quando vocês fazem um
novo commit, é só esse arquivo (`refs/heads/main`) que muda: ele passa
a apontar pro hash do commit novo, e `HEAD`, que só aponta pra ele,
"anda junto" automaticamente.

2.2 - `config`: onde mora a configuração do repositório

Outro arquivo simples de ler é o `config`, também dentro de `.git` —
ele guarda as configurações daquele repositório especificamente
(diferente das configurações globais do Git na máquina, como nome e
e-mail do autor dos commits):

```bash
# Mostra as configuracoes atuais deste repositorio especifico.
cat .git/config
```

Num projeto recém-criado, o conteúdo costuma ser bem enxuto, só com uma
seção `[core]` de configuração básica. Vale guardar esse arquivo na
memória, porque ele vai ganhar uma seção nova já na próxima parte desta
aula, assim que conectarmos o projeto a um repositório remoto.

2.3 - O que é, afinal, um repositório

Depois de abrir a pasta `.git` e ver que `HEAD`, `refs/heads/main` e
`config` são só arquivos de texto comuns, dá pra responder com precisão
uma pergunta que ficou implícita desde a aula passada: o que é um
repositório? No sentido amplo da palavra, repositório é só isso: um
lugar onde algo fica guardado, armazenado. Não é um conceito exclusivo
do Git — existe repositório de arquivos, de dados, de peças, de
documentos; a ideia central é sempre a mesma, um lugar de guarda.

No universo do Git, o que se guarda dentro desse lugar é justamente o
`.git` — o histórico completo de versões de um projeto, com seus
`objects`, `refs` e `HEAD`. Os arquivos que vocês editam no dia a dia (o
código, as páginas, tudo o que aparece fora da pasta oculta) não são o
conteúdo guardado em si — são só o "retrato" de um ponto daquele
histórico, extraído pra tela pelo próprio Git. Quem fica guardado de
forma permanente, dentro do repositório, é o `.git`.

E, como qualquer coisa guardada num lugar, esse `.git` dá pra trafegar
de um lugar pro outro: copiar, transferir, sincronizar entre máquinas
diferentes — sem perder nada do que está lá dentro, porque ele é só um
conjunto de arquivos de texto e binários comuns. Até este ponto da aula,
porém, o único "lugar" onde esse `.git` está guardado é uma única
máquina. E é exatamente aí que mora o problema citado na introdução:
trocar de computador, formatar o HD, ou simplesmente querer usar o
projeto em outro lugar significa não ter mais acesso a esse histórico,
porque ele nunca esteve guardado em nenhum outro lugar.

A solução não exige nenhum conceito novo de versionamento — só um outro
lugar pra guardar uma cópia inteira desse mesmo `.git`, de preferência
acessível pela internet. Esse outro lugar é o que o Git chama de
repositório remoto, e é justamente o que o GitHub oferece: um servidor
que funciona como esse "lugar de guarda" na internet, hospedando o mesmo
`.git`. A razão de o GitHub conseguir fazer isso é simples — ele entende
o mesmo formato de arquivos que qualquer `.git` local usa (os mesmos
`objects`, `refs`, hashes de commit). Por "falar a mesma língua" do Git,
comandos como `git clone`, `git push` e `git pull` trafegam o conteúdo
do `.git` com o GitHub do mesmo jeito que trafegariam com o `.git` de
qualquer outra máquina — só que agora esse lugar de guarda fica
disponível o tempo todo, de qualquer lugar, e pode ser acessado de um
computador diferente sem perder nada do histórico.

3 - GitHub e o conceito de remote

GitHub é, antes de tudo, um serviço de hospedagem de repositórios Git na
internet — não é "o" Git, nem uma versão diferente dele. É perfeitamente
possível usar Git a vida inteira sem nunca abrir uma conta no GitHub;
o que o GitHub resolve é o problema que ficou em aberto no fim da aula
passada: ter uma cópia do histórico do projeto fora da própria máquina,
acessível de qualquer lugar, e compartilhável com outras pessoas.

Na linguagem do Git, esse endereço externo — seja o GitHub, seja
qualquer outro serviço parecido, como GitLab ou Bitbucket — é chamado
de remote (remoto). Um repositório pode ter nenhum, um ou vários
remotes cadastrados; o mais comum, quando existe só um, é chamá-lo de
`origin` — mas isso é só uma convenção de nome, não uma regra do Git.

3.1 - Cadastrando um remote

Depois de criar um repositório vazio no site do GitHub (sem README, pra
não gerar conflito com o histórico que já existe localmente), o passo
seguinte é avisar o Git local de que aquele endereço existe:

```bash
# "git remote add" cadastra um novo remote no repositorio local.
# "origin" e o apelido escolhido para esse remote (poderia ser
# qualquer outro nome).
# O endereco depois do apelido e a URL do repositorio no GitHub.
git remote add origin git@github.com:usuario/repo.git

# "git remote -v" lista os remotes cadastrados, mostrando o apelido
# e a URL de cada um -- "-v" e de "verbose" (detalhado).
git remote -v
```

Vale reler agora o arquivo `config`, de novo:

```bash
cat .git/config
```

Uma seção nova apareceu, parecida com isto:

```
[remote "origin"]
	url = git@github.com:usuario/repo.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

Isso é o ponto mais importante desta seção: `git remote add` não fez
nenhuma mágica de rede nem gerou nenhum arquivo escondido novo — ele só
escreveu essas duas linhas dentro do mesmo `config` que já existia. Um
remote é, fisicamente, só um apelido associado a uma URL, guardado num
arquivo de texto comum.

3.2 - Enviando e recebendo: `push` e `pull`

Com o remote cadastrado, o histórico local pode finalmente ser enviado
para o GitHub:

```bash
# "git push" envia os commits do branch local para o remote.
# "-u origin main" (na primeira vez) liga o branch local "main" ao
# branch "main" do remote "origin" -- depois disso, "git push" e
# "git pull" sozinhos, sem mais argumentos, ja sabem para onde ir.
git push -u origin main
```

Antes de chegar ao `pull`, vale parar num comando que resolve um cenário
diferente: e se o repositório já existe no GitHub, mas ainda não existe
em lugar nenhum na sua máquina? É exatamente pra isso que serve o
`git clone` — ele baixa um repositório remoto inteiro (todo o histórico
de commits, todas as branches, tudo dentro de um `.git` novinho) e já
cria a pasta do projeto localmente, pronta pra uso, sem precisar de
`git init` nem de `git remote add` na mão:

```bash
# "git clone" baixa uma copia completa de um repositorio remoto,
# cria a pasta do projeto e ja configura o remote "origin"
# apontando pra essa URL automaticamente.
git clone git@github.com:usuario/repo.git
```

Depois desse comando, uma pasta chamada `repo` aparece no diretório
atual, já com todos os arquivos, todo o `git log` do projeto, e o
`.git/config` já com a seção `[remote "origin"]` preenchida — como se
vocês tivessem feito `git init` + `git remote add` + `git pull` de uma
vez só.

**Clone x pull, a diferença:** `git clone` é o comando de "primeira
vez" — usado uma única vez por máquina, quando o repositório local
ainda não existe. `git pull`, em contraste, é o comando do dia a dia —
usado repetidas vezes, num repositório que já foi clonado (ou criado)
antes, só para buscar os commits novos que ainda não chegaram aí. Ou
seja: primeiro se clona um repositório, e só depois disso passa a fazer
sentido dar `pull` nele.

O caminho inverso do `push`, para trazer pro computador de vocês
mudanças que estejam no GitHub (feitas por vocês em outra máquina, ou
por outra pessoa colaborando no projeto), é o comando `pull`:

```bash
# "git pull" busca e traz para a maquina local os commits novos
# que existem no remote e ainda nao existem aqui.
git pull
```

4 - Autenticação: a chave SSH

Pra que o GitHub aceite um `git push` vindo do computador de vocês, ele
precisa antes confirmar que quem está mandando aquele comando realmente
tem permissão sobre aquele repositório. Uma das formas mais comuns de
fazer essa confirmação, sem precisar digitar usuário e senha toda hora,
é por meio de um par de chaves SSH.

Uma chave SSH vem sempre em duas partes, geradas juntas: uma chave
privada, que nunca sai da máquina de vocês e nunca deve ser
compartilhada com ninguém, e uma chave pública, feita justamente para
ser entregue a terceiros — nesse caso, ao GitHub. Uma boa forma de
pensar nessa dupla é como um cadeado e sua chave: a chave pública é o
cadeado que vocês entregam para o GitHub guardar; a chave privada é a
única chave que abre aquele cadeado específico, e ela fica só com
vocês. Quando o Git tenta se comunicar com o GitHub, é essa combinação
que prova, sem precisar de senha digitada, que é realmente vocês do
outro lado.

4.1 - Gerando o par de chaves

```bash
# "ssh-keygen" gera um novo par de chaves SSH.
# "-t ed25519" escolhe o algoritmo usado (ed25519 e um dos mais
# modernos e recomendados atualmente).
# "-C" adiciona um comentario a chave, geralmente o proprio e-mail,
# so para identificar de quem e aquela chave mais tarde.
ssh-keygen -t ed25519 -C "email-do-aluno@exemplo.com"
```

O comando vai perguntar onde salvar a chave (pode aceitar o caminho
padrão, apertando Enter) e se quer definir uma senha adicional para ela
(opcional). Ao final, dois arquivos são criados: `id_ed25519` (a chave
privada) e `id_ed25519.pub` (a chave pública).

4.2 - Cadastrando a chave pública no GitHub

```bash
# "cat" imprime o conteudo do arquivo da chave publica na tela,
# para que possa ser copiado.
cat ~/.ssh/id_ed25519.pub
```

O texto que aparece deve ser copiado e colado no GitHub, em
**Settings → SSH and GPG keys → New SSH key**. Depois disso, é possível
testar se a autenticação está funcionando:

```bash
# Tenta autenticar no GitHub usando a chave SSH configurada,
# sem executar nenhuma operacao de fato -- e so um teste de conexao.
ssh -T git@github.com
```

Se tudo estiver certo, o GitHub responde confirmando o nome de usuário
autenticado.

5 - Conclusão

Nesta aula, fechamos o ponto que tinha ficado em aberto desde o fim da
aula passada: como tirar o histórico de um projeto Git de dentro de uma
única máquina. Para chegar lá, primeiro abrimos a pasta `.git` que já
vinha sendo usada desde o `git init`, e vimos que ela não guarda nenhum
segredo complexo — `HEAD` e `refs/heads/main` são simples arquivos de
texto com uma referência dentro, e `config` guarda, também em texto
puro, as configurações do repositório, incluindo qualquer remote
cadastrado.

A partir disso, entendemos o que é um remote, cadastramos o GitHub como
um usando `git remote add`, e vimos os comandos `push` e `pull` que
sincronizam o histórico local com essa cópia remota — tudo isso
autenticado por um par de chaves SSH, gerado uma vez por máquina.

Com o projeto agora versionado localmente e sincronizado com o GitHub,
a base prática desta primeira parte do ano está fechada: sistema
operacional, terminal, WSL e controle de versão. A partir da próxima
etapa do curso, o foco muda para a organização do próprio código —
Python e orientação a objetos.

Questões do TA:

QUESTÃO 1
Segundo o texto, o que o arquivo `HEAD`, dentro da pasta `.git`,
realmente contém?
A) O conteúdo completo de todos os arquivos do projeto.
B) Uma referência para outro arquivo (como `refs/heads/main`), que é
quem de fato guarda o hash do commit mais recente.
C) A senha usada para autenticar no GitHub.
D) Uma cópia compactada de todos os commits já feitos no projeto.
E) O nome de usuário configurado no Git.
Gabarito: B)
Misturar as alternativas? (x ) Sim (  ) Não

QUESTÃO 2
De acordo com o texto, o que acontece, fisicamente, quando se executa
o comando `git remote add origin <url>`?
A) O Git envia imediatamente todo o histórico de commits para o
endereço informado.
B) É criado um novo arquivo oculto, separado do `config`, só para
guardar o endereço do remote.
C) O comando apenas escreve uma nova seção (com o apelido e a URL) no
mesmo arquivo `config` que já existia no repositório.
D) O GitHub gera automaticamente uma chave SSH nova para aquele
repositório.
E) O comando substitui o conteúdo do arquivo `HEAD` pela URL informada.
Gabarito: C)
Misturar as alternativas? (x ) Sim (  ) Não

QUESTÃO 3
Sobre o par de chaves SSH usado para autenticar no GitHub, é correto
afirmar que:
A) A chave pública deve ser mantida em segredo, e a privada é a que
se entrega ao GitHub.
B) As duas chaves são idênticas e intercambiáveis; não há diferença
de uso entre elas.
C) A chave privada nunca deve ser compartilhada e permanece na máquina
do usuário; a chave pública é a parte entregue ao GitHub.
D) Apenas o GitHub consegue gerar esse par de chaves, através do
site oficial.
E) A chave SSH substitui a necessidade de um remote cadastrado no
repositório.
Gabarito: C)
Misturar as alternativas? (x ) Sim (  ) Não

QUESTÃO 4
Qual é a diferença entre os comandos `git push` e `git pull`,
segundo o texto?
A) `git push` traz mudanças do remote para a máquina local, enquanto
`git pull` envia mudanças locais para o remote.
B) Os dois comandos fazem exatamente a mesma coisa, apenas com nomes
diferentes.
C) `git push` envia os commits do branch local para o remote,
enquanto `git pull` busca e traz para a máquina local os commits novos
que existem no remote.
D) `git pull` só funciona antes de um `git remote add`; `git push` só
funciona depois.
E) `git push` apaga o histórico remoto antes de enviar os commits
locais.
Gabarito: C)
Misturar as alternativas? (x ) Sim (  ) Não
