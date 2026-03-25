# 🏥 PMP - Plataforma Médica Paciente

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.0-blue.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791.svg)](https://www.postgresql.org/)

### 🚀 Deployments
[![Vercel Frontend](https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel&style=flat)](https://pmp-frontend.vercel.app)
[![Koyeb Backend](https://img.shields.io/badge/Koyeb-Backend-FF6C37?logo=koyeb&style=flat)](https://pmp-backend.koyeb.app)

**Uma plataforma completa para gerenciamento de consultas, exames e prescrições médicas**

[🌐 Visite o Site](https://pmp.japaneixxx.xyz) • [📖 Documentação](https://pmp.japaneixxx.xyz) • [🤝 Contribua](#contribuindo)

</div>

---

## 📋 Sobre o Projeto

PMP é uma aplicação web moderna que conecta médicos e pacientes, facilitando o gerenciamento de:

- 👨‍⚕️ **Consultas Médicas** - Agendamento e histórico de atendimentos
- 🧪 **Exames** - Registro e acompanhamento de resultados
- 💊 **Prescrições** - Geração e compartilhamento de receitas digitais
- 🔐 **Segurança** - Autenticação JWT e controle de acesso
- 📱 **PWA** - Funciona offline com sincronização automática
- 🔲 **QR Code** - Integração para facilitar compartilhamento de dados

---

## 🌍 Ambiente Online

A aplicação está em produção e disponível para acesso:

| Componente | Acesso | Status |
|-----------|--------|--------|
| **Frontend** | [pmp-frontend.vercel.app](https://pmp-frontend.vercel.app) | [![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel&style=flat-square)](https://pmp-frontend.vercel.app) |
| **API Backend** | [pmp-backend.koyeb.app](https://pmp-backend.koyeb.app) | [![Koyeb](https://img.shields.io/badge/Koyeb-Backend-FF6C37?logo=koyeb&style=flat-square)](https://pmp-backend.koyeb.app) |

**Nota:** Status dos deployments atualizado a cada 6 horas. Para mais detalhes, veja [Deployment Badges](./docs/DEPLOYMENT_BADGES.md).

---

## ✨ Features Principais

- ✅ Autenticação segura com JWT
- ✅ Gerenciamento de pacientes por médico
- ✅ Compartilhamento seguro de documentos
- ✅ Geração e leitura de QR Codes
- ✅ Suporte offline com IndexedDB
- ✅ Interface responsiva e intuitiva
- ✅ Funciona como Progressive Web App (PWA)
- ✅ Integração com Supabase Storage para documentos

---

## 🛠️ Stack Tecnológico

### Backend
- **Java 17** com Spring Boot 3.2.0
- **Spring Security** para autenticação
- **Spring Data JPA** para persistência
- **PostgreSQL** como banco de dados
- **JWT** para tokens seguros
- **Supabase Storage** para armazenamento de arquivos

### Frontend  
- **React 18.3.0** com Vite
- **React Router** para navegação
- **Zustand** para gerenciamento de estado
- **Axios** para requisições HTTP
- **QRCode React + HTML5 QRCode** para QR
- **Date-fns** para manipulação de datas
- **IndexedDB** para sincronização offline
- **Vite PWA Plugin** para Progressive Web App

---

## 🚀 Quick Start

### Pré-requisitos

- **Java 17+**
- **Node.js 16+** e npm/yarn
- **PostgreSQL 13+**
- **Maven 3.6+**

### Instalação e Execução

#### 1️⃣ Clone o repositório
```bash
git clone https://github.com/Japaneixxx/pmp.git
cd pmp
```

#### 2️⃣ Configure o Backend

```bash
cd backend

# Configure as variáveis de ambiente
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edite o arquivo com suas credenciais do banco de dados
# Instale as dependências e execute
mvn clean install
mvn spring-boot:run
```

O backend rodará em `http://localhost:8080`

#### 3️⃣ Configure o Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend rodará em `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
pmp/
├── backend/
│   ├── src/main/java/com/japaneixxx/pmp/
│   │   ├── controller/          # API REST endpoints
│   │   ├── service/             # Lógica de negócio
│   │   ├── model/               # Entidades JPA
│   │   ├── repository/          # Acesso a dados
│   │   ├── security/            # JWT e autenticação
│   │   └── config/              # Configurações
│   └── pom.xml                  # Dependências Maven
│
└── frontend/
    ├── src/
    │   ├── components/          # Componentes React
    │   ├── pages/               # Páginas da aplicação
    │   ├── services/            # Serviços (API, DB)
    │   ├── store/               # Zustand store
    │   └── styles/              # CSS global
    └── package.json             # Dependências npm
```

---

## 🔐 Autenticação

O projeto utiliza **JWT (JSON Web Tokens)** para autenticação segura:

1. Usuário faz login com email e senha
2. Backend gera um token JWT válido por um período
3. Token é armazenado e enviado em cada requisição
4. Frontend intercepta requisições e adiciona o token automaticamente

**Fluxo de Segurança:**
```
Login → JWT Token → LocalStorage → Axios Interceptor → Requisição Segura
```

---

## 📱 Funcionalidades Offline

A aplicação funciona completamente offline através de **IndexedDB** e é instalável como PWA:

- 📥 Instale como aplicativo no seu dispositivo
- 📡 Sincroniza automaticamente quando conectado
- 💾 Dados persistidos localmente
- ⚡ Carregamento rápido

---

## 🗄️ Modelos de Dados

### Principais Entidades

| Entidade | Descrição |
|----------|-----------|
| **Usuario** | Usuários do sistema (pacientes e médicos) |
| **Consulta** | Registro de atendimentos médicos |
| **Exame** | Resultados de exames laboratoriais |
| **Prescricao** | Receitas digitais |
| **PacienteInfo** | Informações específicas do paciente |
| **MedicoPaciente** | Relacionamento entre médicos e pacientes |

---

## 🔌 API REST

### Principais Endpoints

```
POST   /auth/login              - Autenticação
POST   /auth/register           - Registro de usuário
GET    /consultas               - Listar consultas
POST   /consultas               - Criar consulta
GET    /exames                  - Listar exames
POST   /exames                  - Registrar exame
GET    /prescricoes             - Listar prescrições
POST   /prescricoes             - Criar prescrição
GET    /usuarios/:id            - Dados do usuário
```

---

## 🚢 Deployment

### Docker

```bash
# Compile o backend
cd backend
mvn clean package -DskipTests

# Construa a imagem Docker
docker build -t pmp-backend .

# Execute o container
docker run -p 8080:8080 --env-file .env pmp-backend
```

---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE) - veja o arquivo LICENSE para detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. **Fork** o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Guidelines de Contribuição

- ✅ Código limpo e bem comentado
- ✅ Testes unitários quando aplicável
- ✅ Siga as convenções de nomenclatura do projeto
- ✅ Atualize a documentação se necessário

---

## ⚙️ Facilidades para Desenvolvimento

### Makefile

Use o `Makefile` para facilitar o desenvolvimento:

```bash
make help                 # Mostra todos os comandos disponíveis
make install             # Instala dependências
make dev                 # Inicia backend e frontend
make build               # Compila o projeto
make test                # Executa testes
make lint                # Verifica qualidade do código
make docker-build        # Constrói imagem Docker
make check-system        # Verifica dependências
```

### Variáveis de Ambiente

Copie os arquivos de exemplo:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edite os arquivos com suas credenciais.

---

## 📧 Contato & Suporte

- 📧 **Email**: [Japaneix@gmail.com](mailto:japaneix@gmail.com)
- 💬 **Issues**: [GitHub Issues](https://github.com/Japaneixxx/pmp/issues)
- 🐦 **Twitter**: [@Japaneixxx](https://twitter.com/japaneixxx)

---

## 📚 Documentação Adicional

- [Guia de Instalação Detalhado](./docs/INSTALACAO.md)
- [API Documentation](./docs/API.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Contributing Guide](./CONTRIBUTING.md)

---

<div align="center">

### Feito com ❤️ por Japaneixxx

⭐ Se este projeto foi útil para você, deixe uma estrela! ⭐

</div>
