# 📦 Guia de Instalação Detalhado

## Índice
- [Pré-requisitos](#pré-requisitos)
- [Instalação do Backend](#instalação-do-backend)
- [Instalação do Frontend](#instalação-do-frontend)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Requisitos Minimos

| Ferramenta | Versão | Download |
|-----------|--------|----------|
| **Java JDK** | 17+ | [oracle.com](https://www.oracle.com/java/technologies/downloads/) |
| **Maven** | 3.6+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| **Node.js** | 16+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 8+ | (Incluído no Node.js) |
| **PostgreSQL** | 13+ | [postgresql.org](https://www.postgresql.org/download/) |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com/) |

### Ferramentas Opcionais

- **Docker** - Para containerizar a aplicação
- **Postman** - Para testar endpoints da API
- **DBeaver** - Para gerenciar o PostgreSQL
- **Visual Studio Code** - Editor recomendado

---

## 📥 Clone o Repositório

```bash
# Clone o repositório
git clone https://github.com/japaneixxx/pmp.git
cd pmp

# (Opcional) Crie uma branch para desenvolvimento
git checkout -b develop
```

---

## ⚙️ Instalação do Backend

### Passo 1: Navegue até o diretório backend

```bash
cd backend
```

### Passo 2: Configure o Banco de Dados

Antes de iniciar, você precisa criar o banco de dados PostgreSQL:

```sql
-- Acesse o PostgreSQL
psql -U postgres

-- Crie o banco de dados
CREATE DATABASE pmp_db;

-- Crie um usuário (opcional)
CREATE USER pmp_user WITH PASSWORD 'sua_senha_segura';
ALTER ROLE pmp_user SET client_encoding TO 'utf8';
ALTER ROLE pmp_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE pmp_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE pmp_db TO pmp_user;

-- Conectar ao banco
\c pmp_db

-- Aplicar permissões
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pmp_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pmp_user;
```

### Passo 3: Configure application.properties

```bash
# Copie o arquivo de exemplo
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

**Edite o arquivo `application.properties`:**

```properties
# Servidor
server.port=8080
server.servlet.context-path=/api

# Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/pmp_db
spring.datasource.username=pmp_user
spring.datasource.password=sua_senha_segura
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=sua_chave_secreta_super_segura_aqui_32_caracteres_ou_mais
jwt.expiration=86400000

# Supabase (para armazenamento de arquivos)
supabase.url=https://seu-projeto.supabase.co
supabase.key=sua_chave_api_supabase
supabase.bucket=seu-bucket-name

# CORS
server.cors.allowed-origins=http://localhost:5173,http://localhost:3000

# Logging
logging.level.root=INFO
logging.level.com.japaneixxx.pmp=DEBUG
```

### Passo 4: Instale as Dependências

```bash
# Baixe todas as dependências Maven
mvn clean install

# Isso pode levar alguns minutos na primeira execução
```

### Passo 5: Compile o Projeto

```bash
mvn compile
```

Se tudo correr bem, você verá:
```
[INFO] BUILD SUCCESS
```

### Passo 6: Execute a Aplicação

**Opção A - Com Maven:**
```bash
mvn spring-boot:run
```

**Opção B - Executar o JAR compilado:**
```bash
mvn clean package -DskipTests
java -jar target/pmp-backend-1.0.0.jar
```

Você verá algo como:
```
2026-03-25 10:30:45.123  INFO 12345 --- [main] c.j.p.PmpApplication : Started PmpApplication in 3.456 seconds
```

✅ **Backend rodando em:** `http://localhost:8080/api`

---

## 🎨 Instalação do Frontend

### Passo 1: Navegue até o diretório frontend

```bash
cd ../frontend
```

### Passo 2: Configure as Variáveis de Ambiente

```bash
# Crie o arquivo .env
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=PMP - Plataforma Médica Paciente
EOF
```

Arquivo `.env`:
```env
# API
VITE_API_URL=http://localhost:8080/api

# App Info
VITE_APP_NAME=PMP - Plataforma Médica Paciente
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE=true
```

### Passo 3: Instale as Dependências

```bash
# Instale todas as dependências npm
npm install

# Ou com yarn
yarn install
```

### Passo 4: Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

Você verá algo como:
```
VITE v5.4.0 ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ **Frontend disponível em:** `http://localhost:5173`

---

## 📱 Executando a Aplicação Completa

### Terminal 1 - Backend
```bash
cd backend
mvn spring-boot:run
# Escuta em: http://localhost:8080/api
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Escuta em: http://localhost:5173
```

### Terminal 3 - Banco de Dados (se necessário)
```bash
# Se estiver usando Docker para PostgreSQL
docker run --name postgres-pmp -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

---

## 🐳 Instalação com Docker

### Build da Imagem Backend

```bash
cd backend

# Compile o projeto
mvn clean package -DskipTests

# Construa a imagem Docker
docker build -t pmp-backend:1.0.0 .

# Execute o container
docker run -d \
  --name pmp-backend \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/pmp_db \
  -e SPRING_DATASOURCE_USERNAME=pmp_user \
  -e SPRING_DATASOURCE_PASSWORD=sua_senha \
  --link postgres:postgres \
  pmp-backend:1.0.0
```

### Docker Compose (Completo)

Crie um arquivo `docker-compose.yml` na raiz:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pmp_db
      POSTGRES_USER: pmp_user
      POSTGRES_PASSWORD: sua_senha_segura
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/pmp_db
      SPRING_DATASOURCE_USERNAME: pmp_user
      SPRING_DATASOURCE_PASSWORD: sua_senha_segura
      JWT_SECRET: sua_chave_secreta_super_segura
    depends_on:
      - postgres

  # Frontend pode ser servido por um servidor web
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Execute com:
```bash
docker-compose up -d
```

---

## 🔐 Variáveis de Ambiente

### Backend - application.properties

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| SERVER_PORT | 8080 | Porta do servidor |
| SPRING_DATASOURCE_URL | localhost:5432 | URL do PostgreSQL |
| SPRING_DATASOURCE_USERNAME | pmp_user | Usuário do banco |
| SPRING_DATASOURCE_PASSWORD | - | Senha do banco |
| JWT_SECRET | - | Chave secreta JWT (mínimo 32 caracteres) |
| JWT_EXPIRATION | 86400000 | Expiração do token em ms (24h) |

### Frontend - .env

| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| VITE_API_URL | http://localhost:8080/api | URL da API backend |
| VITE_APP_NAME | PMP | Nome da aplicação |
| VITE_ENABLE_PWA | true | Ativar Progressive Web App |

---

## ✅ Verificando a Instalação

### Backend
```bash
# Teste um endpoint
curl http://localhost:8080/api/health
```

Response esperado:
```json
{
  "status": "UP",
  "timestamp": "2026-03-25T10:30:45.123Z"
}
```

### Frontend
Acesse `http://localhost:5173` no navegador e você deve ver a página de login.

### Banco de Dados
```bash
# Conectar ao PostgreSQL
psql -U pmp_user -d pmp_db -h localhost

# Ver as tabelas criadas
\dt

# Sair
\q
```

---

## 🐛 Troubleshooting

### Erro: "Port 8080 is already in use"
```bash
# Encontre o processo usando a porta
lsof -i :8080

# Mate o processo
kill -9 <PID>

# Ou use uma porta diferente
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

### Erro: "Could not create connection to database server"
```bash
# Verifique se o PostgreSQL está rodando
sudo service postgresql status

# Inicie o PostgreSQL (Linux)
sudo service postgresql start

# Ou verifique as credenciais em application.properties
```

### Erro: "npm ERR! ERESOLVE unable to resolve dependency tree"
```bash
# Force a instalação
npm install --legacy-peer-deps

# Ou limpeza completa
rm -rf node_modules package-lock.json
npm install
```

### Erro: "VITE_API_URL is undefined"
```bash
# Certifique-se que o arquivo .env existe
cat .env

# Reinicie o servidor frontend
npm run dev
```

### Erro: "JWT token expired"
- O token JWT expirou, faça login novamente
- Aumente o tempo de expiração em `application.properties`

---

## 📚 Próximos Passos

1. ✅ [Leia sobre a API](./API.md)
2. ✅ [Contribuir ao projeto](../CONTRIBUTING.md)
3. ✅ [Testar com Postman](./API.md#postman)

---

## 💬 Precisa de Ajuda?

- 📧 Email: [Japaneix@gmail.com](mailto:Japaneix@gmail.com)
- 🐛 [Issues no GitHub](https://github.com/japaneixxx/pmp/issues)
- 💬 [Discussões](https://github.com/japaneixxx/pmp/discussions)
