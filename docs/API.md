# 🔌 Documentação da API REST

## Índice
- [Base URL](#base-url)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Autenticação](#autenticação-1)
  - [Usuários](#usuários)
  - [Consultas](#consultas)
  - [Exames](#exames)
  - [Prescrições](#prescrições)
  - [Compartilhamento](#compartilhamento)
- [Códigos de Resposta](#códigos-de-resposta)
- [Teste com Postman](#teste-com-postman)

---

## 📍 Base URL

```
http://localhost:8080/api
```

Em produção: `https://seu-dominio.com/api`

---

## 🔐 Autenticação

### JWT (JSON Web Token)

A API utiliza **JWT** para autenticação. Após fazer login, você receberá um token que deve ser enviado em todas as requisições.

#### Como usar:

1. **Faça login** para obter o token
2. **Adicione o token no header** de cada requisição:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Exemplo com cURL:

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"senha123"}'

# Resposta:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "usuario": { "id": 1, "nome": "João", "email": "usuario@example.com" }
# }

# 2. Use em requisições subsequentes
curl -X GET http://localhost:8080/api/usuarios/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📋 Endpoints

### 🔑 Autenticação

#### POST /auth/login
Autentica um usuário e retorna um JWT.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "usuario@example.com",
    "tipo": "medico",
    "crm": "123456"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Email ou senha inválidos"
}
```

---

#### POST /auth/register
Registra um novo usuário no sistema.

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "tipo": "paciente"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "tipo": "paciente"
}
```

---

### 👥 Usuários

#### GET /usuarios/:id
Retorna informações de um usuário específico.

**Request:**
```http
GET /usuarios/1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "tipo": "paciente",
  "telefone": "11987654321",
  "dataNascimento": "1990-01-15",
  "cpf": "12345678900"
}
```

---

#### PUT /usuarios/:id
Atualiza informações do usuário.

**Request:**
```http
PUT /usuarios/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "telefone": "11999999999"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nome": "João Silva Atualizado",
  "telefone": "11999999999"
}
```

---

#### DELETE /usuarios/:id
Deleta uma conta de usuário.

**Request:**
```http
DELETE /usuarios/1
Authorization: Bearer {token}
```

**Response (204 No Content):**
```
(Sem corpo)
```

---

### 📅 Consultas

#### GET /consultas
Lista todas as consultas do usuário autenticado.

**Request:**
```http
GET /consultas?status=concluida&mes=2026-03
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` - `agendada`, `concluida`, `cancelada` (opcional)
- `mes` - Filtrar por mês (YYYY-MM) (opcional)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "paciente": {
      "id": 2,
      "nome": "Maria Silva"
    },
    "medico": {
      "id": 3,
      "nome": "Dr. Carlos",
      "crm": "123456"
    },
    "dataConsulta": "2026-03-25T14:00:00Z",
    "motivo": "Dor nas costas",
    "observacoes": "Prescrever anti-inflamatório",
    "status": "concluida"
  }
]
```

---

#### POST /consultas
Cria uma nova consulta.

**Request:**
```http
POST /consultas
Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": 2,
  "medicoId": 3,
  "dataConsulta": "2026-04-10T14:00:00Z",
  "motivo": "Rotina",
  "observacoes": "Paciente relata dores"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "paciente": { "id": 2, "nome": "Maria Silva" },
  "medico": { "id": 3, "nome": "Dr. Carlos" },
  "dataConsulta": "2026-04-10T14:00:00Z",
  "motivo": "Rotina",
  "observacoes": "Paciente relata dores",
  "status": "agendada"
}
```

---

#### GET /consultas/:id
Retorna detalhes de uma consulta específica.

**Request:**
```http
GET /consultas/1
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "paciente": { "id": 2, "nome": "Maria Silva" },
  "medico": { "id": 3, "nome": "Dr. Carlos" },
  "dataConsulta": "2026-04-10T14:00:00Z",
  "motivo": "Rotina",
  "observacoes": "Paciente relata dores",
  "status": "agendada",
  "criadoEm": "2026-03-25T10:30:00Z",
  "atualizadoEm": "2026-03-25T10:30:00Z"
}
```

---

#### PUT /consultas/:id
Atualiza uma consulta.

**Request:**
```http
PUT /consultas/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "concluida",
  "observacoes": "Prescrever medicação"
}
```

---

#### DELETE /consultas/:id
Cancela uma consulta.

**Request:**
```http
DELETE /consultas/1
Authorization: Bearer {token}
```

---

### 🧪 Exames

#### GET /exames
Lista exames do usuário.

**Request:**
```http
GET /exames?status=pendente
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "paciente": { "id": 2, "nome": "Maria Silva" },
    "tipo": "Hemograma",
    "dataRealizacao": "2026-03-20T10:00:00Z",
    "resultado": "Normal",
    "status": "concluido",
    "arquivos": ["url_do_arquivo.pdf"]
  }
]
```

---

#### POST /exames
Registra um novo exame.

**Request:**
```http
POST /exames
Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": 2,
  "tipo": "Hemograma",
  "dataRealizacao": "2026-03-20T10:00:00Z",
  "resultado": "Normal",
  "status": "concluido"
}
```

---

#### GET /exames/:id
Retorna detalhes de um exame.

**Request:**
```http
GET /exames/1
Authorization: Bearer {token}
```

---

#### PUT /exames/:id
Atualiza um exame.

**Request:**
```http
PUT /exames/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "resultado": "Anormal - Verificar com médico",
  "status": "concluido"
}
```

---

### 💊 Prescrições

#### GET /prescricoes
Lista prescrições.

**Request:**
```http
GET /prescricoes
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "paciente": { "id": 2, "nome": "Maria Silva" },
    "medico": { "id": 3, "nome": "Dr. Carlos" },
    "medicamentos": [
      {
        "nome": "Dipirona",
        "dosagem": "500mg",
        "frequencia": "De 6 em 6 horas",
        "duracao": "7 dias"
      }
    ],
    "dataPrescricao": "2026-03-25T14:00:00Z",
    "dataValidadeUntil": "2026-06-25T23:59:59Z"
  }
]
```

---

#### POST /prescricoes
Cria uma nova prescrição.

**Request:**
```http
POST /prescricoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": 2,
  "medicamentos": [
    {
      "nome": "Dipirona",
      "dosagem": "500mg",
      "frequencia": "De 6 em 6 horas",
      "duracao": "7 dias"
    },
    {
      "nome": "Amoxicilina",
      "dosagem": "500mg",
      "frequencia": "De 8 em 8 horas",
      "duracao": "10 dias"
    }
  ],
  "observacoes": "Tomar com alimentos"
}
```

---

#### GET /prescricoes/:id
Retorna detalhes de uma prescrição.

**Request:**
```http
GET /prescricoes/1
Authorization: Bearer {token}
```

---

#### PUT /prescricoes/:id
Atualiza uma prescrição.

**Request:**
```http
PUT /prescricoes/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "entregue"
}
```

---

### 🔄 Compartilhamento

#### POST /compartilhar
Compartilha dados de um paciente com outro usuário.

**Request:**
```http
POST /compartilhar
Authorization: Bearer {token}
Content-Type: application/json

{
  "pacienteId": 2,
  "usuarioId": 4,
  "tipo": "consultas",
  "dataExpiracao": "2026-04-25T23:59:59Z"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "paciente": { "id": 2, "nome": "Maria Silva" },
  "usuario": { "id": 4, "nome": "Dr. Pedro" },
  "tipo": "consultas",
  "dataExpiracao": "2026-04-25T23:59:59Z",
  "criadoEm": "2026-03-25T10:30:00Z"
}
```

---

#### GET /compartilhar/comigo
Lista dados compartilhados com você.

**Request:**
```http
GET /compartilhar/comigo
Authorization: Bearer {token}
```

---

#### DELETE /compartilhar/:id
Remove um compartilhamento.

**Request:**
```http
DELETE /compartilhar/1
Authorization: Bearer {token}
```

---

## 📊 Códigos de Resposta HTTP

| Código | Significado | Descrição |
|--------|------------|-----------|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **204** | No Content | Sucesso, sem conteúdo na resposta |
| **400** | Bad Request | Requisição inválida/malformada |
| **401** | Unauthorized | Não autenticado ou token inválido |
| **403** | Forbidden | Acesso negado |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Conflito (ex: email duplicado) |
| **500** | Server Error | Erro interno do servidor |
| **503** | Service Unavailable | Serviço indisponível |

---

## 📮 Teste com Postman

### Importar a Coleção

1. Abra o Postman
2. Clique em **Import**
3. Cole este JSON ou importe o arquivo

### Variáveis de Ambiente

Configure estas variáveis no Postman:

```json
{
  "baseUrl": "http://localhost:8080/api",
  "token": "seu_token_jwt_aqui",
  "userId": 1,
  "pacienteId": 2,
  "medicoId": 3
}
```

### Fluxo de Teste Recomendado

1. **POST /auth/login** - Obtenha o token
2. **GET /usuarios/1** - Teste um endpoint autenticado
3. **GET /consultas** - Liste recursos
4. **POST /consultas** - Crie um recurso
5. **PUT /consultas/1** - Atualize um recurso
6. **DELETE /consultas/1** - Delete um recurso

---

## ⚠️ Tratamento de Erros

Todos os erros retornam um JSON estruturado:

```json
{
  "timestamp": "2026-03-25T10:30:45.123Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Email já cadastrado no sistema",
  "path": "/api/auth/register"
}
```

---

## 🔍 Paginação (quando aplicável)

```http
GET /consultas?page=1&size=10&sort=dataConsulta,desc
```

**Response:**
```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 100,
    "totalPages": 10
  }
}
```

---

## 📚 Exemplo Completo com axios (Frontend)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Adiciona token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

// Listar consultas
export const getConsultas = async () => {
  return api.get('/consultas');
};

// Criar consulta
export const createConsulta = async (consulta) => {
  return api.post('/consultas', consulta);
};
```

---

## 💬 Suporte

- 📧 Email: [japaneix@gmail.com](mailto:japaneix@gmail.com)
- 🐛 [Issues no GitHub](https://github.com/japaneixxx/pmp/issues)
