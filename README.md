# Saúde Recife — Backend API

API RESTful da plataforma municipal **Saúde Recife**, desenvolvida em Node.js com Express e MongoDB. A aplicação gerencia autenticação de pacientes, agendamentos, listagem de profissionais e triagem inteligente com IA via Google Gemini.

---

## 📋 Pré-requisitos

- Node.js 18+ 
- npm
- MongoDB Atlas com cluster ativo
- Chave da Google AI Studio (`GEMINI_API_KEY`)

---

## 🚀 Setup rápido

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` local com base no exemplo:
   ```bash
   Copy-Item .env.example .env
   ```
4. Preencha as variáveis reais do ambiente
5. Rode o backend:
   ```bash
   npm run dev
   ```
6. Popule o banco inicial:
   ```bash
   npm run seed
   ```

---

## 🔐 Variáveis de ambiente

Arquivo `.env` (não versionado):

```env
PORT=5000
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/saude_recife
JWT_SECRET=seu_jwt_secret_aqui
GEMINI_API_KEY=sua_chave_gemini_aqui
```

> O arquivo `.env.example` deve servir como modelo para a equipe, mas nunca deve conter segredos reais.

---

## 🧩 Scripts disponíveis

```bash
npm run dev
npm start
npm run seed
npm run lint
```

---

## 📚 Endpoints da API

### Health
- `GET /api/health`

### Autenticação
- `POST /api/auth/cadastro`
  Payload:
  ```json
  {
    "nome": "Maria da Silva",
    "cpf": "52998224725",
    "email": "maria@email.com",
    "senha": "123456",
    "dataNascimento": "1965-08-27",
    "telefone": "81999999999"
  }
  ```

- `POST /api/auth/login`
  Payload:
  ```json
  {
    "email": "maria@email.com",
    "senha": "123456"
  }
  ```

- `GET /api/auth/perfil` (requer token JWT)
- `PUT /api/auth/perfil` (requer token JWT)

### Médicos
- `GET /api/medicos?especialidade=Cardiologia`
- `GET /api/medicos/:id`
- `GET /api/especialidades`

### Agendamentos
- `POST /api/agendamentos` (requer token JWT)
  Payload:
  ```json
  {
    "profissionalId": "ID_DO_PROFISSIONAL",
    "clinicaId": "ID_DA_CLINICA",
    "dataHora": "2026-09-30T14:00:00.000Z",
    "tipo": "Presencial",
    "instrucoes": "Chegar com 10 minutos de antecedência."
  }
  ```

- `GET /api/agendamentos/meus-agendamentos?filtro=proximos`
- `GET /api/agendamentos/meus-agendamentos?filtro=historico`
- `PUT /api/agendamentos/:id/reagendar`
  Payload:
  ```json
  {
    "dataHora": "2026-10-02T16:00:00.000Z",
    "tipo": "Telemedicina",
    "instrucoes": "Manter o celular próximo."
  }
  ```
- `PUT /api/agendamentos/:id/cancelar`

### IA / Triagem
- `POST /api/ia/triagem`
  Payload:
  ```json
  {
    "queixa": "dor na junta, dificuldade para caminhar e sensação de rigidez"
  }
  ```

  Resposta esperada:
  ```json
  {
    "sintomasIdentificados": ["dor na junta", "rigidez", "dificuldade para caminhar"],
    "especialidadeRecomendada": "Ortopedia",
    "observacoes": "A queixa pode estar relacionada a articulações e mobilidade. Avaliação médica é recomendada.",
    "alertaEmergencia": false
  }
  ```

---

## 🧪 Validação básica

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/auth/cadastro -H "Content-Type: application/json" -d '{"nome":"Maria","cpf":"52998224725","email":"maria@email.com","senha":"123456"}'
curl "http://localhost:5000/api/medicos?especialidade=Cardiologia"
```

---

## 📁 Estrutura principal

```text
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── scripts/
├── server.js
```

---

## 🌿 Workflow do grupo

- Branch `main` para versão estável
- Branches `feat/...` para novas funcionalidades
- PR obrigatório para merge
- Sempre rodar `npm run lint` antes de subir código

---

## ✅ Status

O backend está pronto para transição para o Frontend com a base funcional completa de autenticação, médicos, agendamentos e inteligência artificial.
