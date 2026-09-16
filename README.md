# Saúde Recife — Backend API

API RESTful da plataforma municipal **Saúde Recife**, desenvolvida em Node.js com Express e MongoDB. A aplicação é responsável por gerenciar dados de saúde pública, autenticação segura de usuários e integração com modelos de inteligência artificial via Google Gemini para assistência e triagem inteligente.

---

## 📋 Pré-requisitos

Certifique-se de que os seguintes softwares e serviços estejam instalados e configurados em sua máquina antes de prosseguir:

- **Node.js**: Versão `18.0.0` ou superior (recomendado `20.x LTS`). Verifique com:
  ```bash
  node -v
  ```
- **Git**: Sistema de controle de versão. Verifique com:
  ```bash
  git --version
  ```
- **Conta no MongoDB Atlas**: Acesso a um cluster no MongoDB Atlas com usuário e senha devidamente configurados e IP liberado em *Network Access* (ou `0.0.0.0/0` para ambiente de desenvolvimento).
- **Google AI Studio API Key**: Chave de acesso à API do Google Gemini.

---

## 🚀 Passo a Passo de Setup (Checklist de Onboarding)

Siga este checklist em sequência para inicializar o ambiente de desenvolvimento do zero:

- [ ] **1. Clonar o repositório**
  ```bash
  git clone https://github.com/seu-usuario/saude-recife-backend.git
  cd saude-recife-backend
  ```

- [ ] **2. Instalar dependências**
  ```bash
  npm install
  ```

- [ ] **3. Configurar variáveis de ambiente**
  Copie o modelo de variáveis de ambiente para criar o seu arquivo `.env`:
  - **Linux / macOS:**
    ```bash
    cp .env.example .env
    ```
  - **Windows (PowerShell):**
    ```powershell
    Copy-Item .env.example .env
    ```
  Abra o arquivo `.env` e substitua os valores padrão com suas credenciais reais (detalhes na tabela abaixo).

- [ ] **4. Iniciar o servidor em modo de desenvolvimento**
  ```bash
  npm run dev
  ```
  O console exibirá a mensagem de conexão bem-sucedida com o MongoDB e a confirmação da porta ativa (padrão: `5000`):
  ```text
  MongoDB Connected: cluster.mongodb.net
  Server running on port 5000
  ```

- [ ] **5. Validar a execução**
  Em outro terminal, execute uma requisição para a rota de health check:
  ```bash
  curl http://localhost:5000/api/health
  ```
  Resposta esperada:
  ```json
  {
    "status": "ok",
    "service": "saude-recife-backend",
    "uptime": 1.25,
    "timestamp": "2026-09-16T14:30:00.000Z"
  }
  ```

---

## 🔐 Variáveis de Ambiente

O arquivo `.env` centraliza as configurações sensíveis e de conexão do projeto. Veja o detalhamento de cada variável:

| Variável | Tipo | Obrigatória | Descrição | Exemplo de Valor |
| :--- | :--- | :---: | :--- | :--- |
| `PORT` | Number | Não | Porta TCP na qual o servidor HTTP Express escuta requisições. Se omitida, assume `5000`. | `5000` |
| `MONGO_URI` | String | Sim | String de conexão completa com o cluster MongoDB Atlas (incluindo protocolo `mongodb+srv://`, credenciais e nome do banco de dados). | `mongodb+srv://usuario:senha@cluster.mongodb.net/saude_recife` |
| `JWT_SECRET` | String | Sim | Chave criptográfica privada utilizada para assinar e validar tokens JSON Web Token (JWT) nas rotas protegidas. | `seu_jwt_secret_aqui` |
| `GEMINI_API_KEY` | String | Sim | Chave de autenticação fornecida pelo Google AI Studio para comunicação com a SDK `@google/genai`. | `sua_chave_gemini_aqui` |

---

## 🛠️ Scripts Disponíveis

No arquivo `package.json`, estão configurados os seguintes scripts operacionais:

| Script | Comando | Descrição |
| :--- | :--- | :--- |
| `npm run dev` | `nodemon src/server.js` | Inicializa o servidor com hot reload através do Nodemon, reiniciando automaticamente o processo a cada alteração em arquivos de código. |
| `npm start` | `node src/server.js` | Executa o servidor Node.js em modo direto (produção), sem overhead de observadores de arquivos. |
| `npm run lint` | `eslint .` | Executa o linter ESLint em todo o código-fonte seguindo o padrão Flat Config (`eslint.config.js`), validando conformidade e boas práticas. |

---

## 📂 Estrutura de Pastas

```text
saude-recife-backend/
├── .env.example          # Modelo das variáveis de ambiente necessárias
├── eslint.config.js      # Configuração do ESLint 9 (Flat Config)
├── package.json          # Manifesto do projeto, dependências e scripts
├── README.md             # Esta documentação
└── src/
    ├── server.js         # Ponto de entrada da aplicação e inicialização do Express
    ├── config/           # Configurações de conexões externas (ex: db.js para MongoDB)
    ├── controllers/      # Controladores de regras de negócio e retorno HTTP
    ├── middlewares/      # Interceptadores de requisições (autenticação, errorHandler)
    ├── models/           # Schemas e modelos do Mongoose
    └── routes/           # Mapeamento e exportação de rotas da API REST
```

---

## 🌿 Convenções do Git & Workflow

Para garantir a qualidade e rastreabilidade do código, todos os membros da equipe devem seguir rigorosamente este fluxo de trabalho:

### 1. Estrutura de Branches
- **`main`**: Branch de produção. Contém apenas código testado, validado e pronto para deploy. Protegida contra commits diretos.
- **`dev`**: Branch de integração contínua. Todos os novos desenvolvimentos convergem para ela após aprovação.
- **`feat/nome-da-feature`**: Branches de trabalho criadas **a partir da `dev`** para novas funcionalidades (ex: `feat/triagem-gemini`, `feat/auth-jwt`).
- **`fix/nome-do-bug`**: Branches de correção criadas a partir da `dev` (ou de `main` em casos emergenciais de hotfix).

### 2. Padrão de Commits (Conventional Commits)
As mensagens de commit devem ser escritas no padrão [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Inclusão de nova funcionalidade. Exemplo: `feat: adicionar rota de autenticacao de usuarios`
- `fix:` Correção de defeito/bug. Exemplo: `fix: tratar erro de conexao com mongodb atlas`
- `docs:` Alteração exclusiva em documentação. Exemplo: `docs: atualizar instrucoes de configuracao do atlas`
- `chore:` Tarefas de manutenção, atualização de dependências ou ajustes de build. Exemplo: `chore: atualizar dependencia @google/genai`
- `refactor:` Refatoração de código que não altera o comportamento funcional. Exemplo: `refactor: modularizar conexao com banco`

### 3. Política de Pull Requests (PR)
- Toda alteração deve ser submetida via Pull Request direcionada para a branch **`dev`**.
- **Revisão Obrigatória:** É **mandatório** obter a aprovação de pelo menos **1 colega de equipe (peer review)** antes de realizar o merge.
- **Checks de CI:** O PR só poderá sofrer merge se a validação estática de código passar sem erros (`npm run lint`).
- Nunca force commits (`git push --force`) nas branches `dev` ou `main`.
