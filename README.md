# Saúde Recife - Backend API

API RESTful para a plataforma e aplicativo móvel **Saúde Recife**, projetada para integração de serviços de saúde municipal, autenticação de usuários e serviços inteligentes com Google Gemini.

## Pré-requisitos

Antes de iniciar, certifique-se de possuir instalado em seu ambiente:

- [Node.js](https://nodejs.org/) (versão 20 LTS ou superior recomendada)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes incluso no Node.js)
- [MongoDB](https://www.mongodb.com/) (instância local em execução ou cluster MongoDB Atlas)

## Tecnologias Principais

- **Node.js** com suporte nativo a ES Modules (`"type": "module"`)
- **Express 4** - Framework web minimalista e performático
- **Mongoose 8** - Modelagem de dados orientada a objetos para MongoDB
- **JSON Web Token (JWT)** & **Bcrypt.js** - Autenticação segura e hashing de credenciais
- **@google/genai** - Integração oficial com modelos de IA do Google Gemini
- **ESLint 9** - Padronização de código com Flat Config moderno
- **Nodemon** - Hot reload para ambiente de desenvolvimento

## Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/saude-recife-backend.git
cd saude-recife-backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo `.env.example` para `.env`:

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Edite o arquivo `.env` preenchendo as variáveis conforme seu ambiente:

| Variável | Descrição | Exemplo Padrão |
| :--- | :--- | :--- |
| `PORT` | Porta na qual o servidor HTTP será executado | `5000` |
| `MONGO_URI` | URI de conexão com o banco de dados MongoDB | `mongodb://localhost:27017/saude_recife` |
| `JWT_SECRET` | Chave secreta para assinatura dos tokens JWT | `sua_chave_secreta_segura` |
| `GEMINI_API_KEY` | Chave de API para integração com o Google Gemini | `sua_gemini_api_key` |

## Execução

### Modo de Desenvolvimento (com hot-reload)

```bash
npm run dev
```

### Modo de Produção

```bash
npm start
```

### Análise Estática de Código (Linting)

```bash
npm run lint
```

## Estrutura do Projeto

```
saude-recife-backend/
├── .env                  # Variáveis de ambiente locais (ignorado no git)
├── .env.example          # Modelo das variáveis de ambiente necessárias
├── .gitignore            # Arquivos e diretórios desconsiderados pelo git
├── eslint.config.js      # Configuração do linter ESLint (flat config)
├── package.json          # Metadados, scripts e dependências do projeto
├── README.md             # Documentação do repositório
└── src/
    ├── server.js         # Ponto de entrada da aplicação Express
    ├── config/           # Configurações de serviços externos e banco
    │   └── db.js         # Conexão com MongoDB via Mongoose
    ├── controllers/      # Regras de negócio e manipuladores de rotas
    ├── middlewares/      # Middlewares do Express (autenticação, erros, validação)
    │   └── errorHandler.js
    ├── models/           # Schemas e modelos do Mongoose
    └── routes/           # Definição e agrupamento de endpoints da API
        ├── index.js      # Roteador central (/api)
        └── healthRoutes.js # Rota de integridade (/api/health)
```

## Endpoints Disponíveis Inicialmente

- **GET** `/api/health` - Verifica a integridade e disponibilidade do serviço.
  - **Resposta de Exemplo**:
    ```json
    {
      "status": "ok",
      "service": "saude-recife-backend",
      "uptime": 12.34,
      "timestamp": "2026-09-16T10:40:00.000Z"
    }
    ```

