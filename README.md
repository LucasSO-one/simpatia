# SIMPATIA - Módulo de Correção de Questões Descritivas

Este repositório contém o módulo de correção de questões da plataforma SIMPATIA, um sistema desenvolvido para a UNIFENAS. 

A aplicação permite que professores enviem o enunciado, o gabarito e as respostas dos alunos (em formato de texto ou através do upload de imagens de provas físicas). Os dados são enviados ao servidor, que processa a requisição e utiliza Inteligência Artificial para gerar uma avaliação precisa, objetiva e construtiva. O sistema conta também com um assistente virtual integrado (Chatbot) para auxiliar os docentes no uso da ferramenta.

## Arquitetura e Tecnologias Utilizadas

O projeto adota uma arquitetura separada entre cliente (Frontend) e servidor (Backend), facilitando a integração e escalabilidade.

**Frontend (Raiz do projeto)**
* React.js
* Vite
* React Router DOM
* CSS3

**Backend (Pasta /api)**
* Node.js
* Express
* Multer (para processamento de upload de arquivos/imagens)
* Integração com LLM via API

**Infraestrutura e Deploy**
* Frontend hospedado na Vercel
* Backend hospedado no Render
* CI/CD automatizado via GitHub Actions

---

## Configuração de Ambiente (Variáveis)

Por questões de segurança, chaves de API e URLs sensíveis não são versionadas. O repositório contém arquivos de exemplo (.env.example). Você deve criar os arquivos .env correspondentes.

### 1. Variáveis do Frontend
Crie um arquivo chamado .env na raiz do projeto com a URL do servidor backend:

```env
# Para rodar localmente
VITE_API_URL=http://localhost:3000

# Para produção (Vercel), esta variável é configurada no painel da plataforma.
```

### 2. Variáveis do Backend
Crie um arquivo chamado .env dentro da pasta /api com a chave de autenticação da IA:

```env
# Chave de acesso à API de Inteligência Artificial
OPENROUTER_API_KEY=sua_chave_aqui
```
(Nota: O arquivo .gitignore já está configurado para bloquear o envio de qualquer arquivo .env para o repositório remoto).

---

## Instalação e Execução Local

### Pré-requisitos
* Node.js (versão 20 ou superior recomendada)
* NPM ou Yarn

### Passo a Passo

1. Clone o repositório:
```bash
git clone [https://github.com/LucasSO-one/simpatia.git](https://github.com/LucasSO-one/simpatia.git)
cd simpatia
```

2. Inicie o Servidor (Backend):
Abra um terminal, acesse a pasta da API, instale as dependências e inicie o serviço.
```bash
cd api
npm install
node server.js
```
O servidor estará rodando em http://localhost:3000.

3. Inicie a Interface (Frontend):
Abra um novo terminal na raiz do projeto (fora da pasta api), instale as dependências do React e inicie o servidor de desenvolvimento do Vite.
```bash
npm install
npm run dev
```
A interface estará disponível na porta indicada pelo Vite (geralmente http://localhost:5173).

---

## Documentação da API (Para Integração de Equipes)

Para a equipe responsável por integrar este módulo ao restante da plataforma SIMPATIA, abaixo estão os endpoints expostos pelo nosso backend.

### Rota de Correção de Questão
* URL: /corrigir
* Método: POST
* Headers: Content-Type: application/json
* Body:
```json
{
  "pergunta": "Texto do enunciado da questão.",
  "resposta": "Texto da resposta do aluno (incluindo o gabarito anexado pela regra de negócio do front)."
}
```
* Retorno de Sucesso (200 OK):
```json
{
  "correction": "Texto formatado com a avaliação gerada pela Inteligência Artificial."
}
```

### Rota do Chatbot de Suporte
* URL: /chat-suporte
* Método: POST
* Headers: Content-Type: application/json
* Body:
```json
{
  "mensagemUsuario": "Como anexo um gabarito?",
  "historico": [
    { "role": "model", "parts": [{ "text": "Ola! Sou o assistente..." }] },
    { "role": "user", "parts": [{ "text": "Mensagem anterior" }] }
  ]
}
```
* Retorno de Sucesso (200 OK):
```json
{
  "resposta": "Texto da resposta gerada pelo assistente."
}
```