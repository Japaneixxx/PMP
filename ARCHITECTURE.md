# 🏗️ Arquitetura do Projeto PMP

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura em Camadas](#arquitetura-em-camadas)
- [Backend](#backend)
- [Frontend](#frontend)
- [Banco de Dados](#banco-de-dados)
- [Fluxo de Dados](#fluxo-de-dados)
- [Decisões Arquiteturais](#decisões-arquiteturais)

---

## 🎯 Visão Geral

O PMP segue uma arquitetura **client-server** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│            Progressive Web App + Offline Support            │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot + Java 17)                 │
│         API REST | Autenticação | Lógica de Negócio         │
└─────────────────────────────────────────────────────────────┘
                              ↓ JDBC
┌─────────────────────────────────────────────────────────────┐
│            BANCO DE DADOS (PostgreSQL)                       │
│         Persistência de Dados | Integridade                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏢 Arquitetura em Camadas

### Backend - Padrão MVC + Repository

```
┌───────────────────────────────────────────────┐
│         Controller (REST Endpoints)            │
│    Recebe requisições HTTP e valida entrada   │
└─────────────────┬─────────────────────────────┘
                  ↓
┌───────────────────────────────────────────────┐
│    Service (Lógica de Negócio)                 │
│  Regras, validações e orquestração de dados   │
└─────────────────┬─────────────────────────────┘
                  ↓
┌───────────────────────────────────────────────┐
│    Repository (Acesso a Dados)                 │
│  Operações CRUD, queries customizadas         │
└─────────────────┬─────────────────────────────┘
                  ↓
┌───────────────────────────────────────────────┐
│    Entity/Model (Representação)                │
│  Mapeamento para tabelas do banco              │
└───────────────────────────────────────────────┘
```

### Frontend - Componentes + Estado Global

```
┌───────────────────────────────────────────────┐
│         Pages (Telas da Aplicação)             │
│     Componem a interface do usuário            │
└─────────────────┬─────────────────────────────┘
                  ↓
┌───────────────────────────────────────────────┐
│    Components (Componentes Reutilizáveis)     │
│  Lógica de UI, renderização condicional      │
└─────────────────┬─────────────────────────────┘
                  ↓
┌───────────────────────────────────────────────┐
│    Services (Lógica de Negócio)                │
│  Chamadas de API, manipulação de dados        │
└─────────────────┬─────────────────────────────┘
                  ↓
┌───────────────────────────────────────────────┐
│    Store (Zustand - Estado Global)             │
│  Gerenciamento centralizado de estado         │
└───────────────────────────────────────────────┘
```

---

## 🔧 Backend

### Stack

| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| **Framework** | Spring Boot | 3.2.0 |
| **Linguagem** | Java | 17 |
| **ORM** | Spring Data JPA / Hibernate | Latest |
| **Autenticação** | JWT + Spring Security | JJWT |
| **Banco** | PostgreSQL | 13+ |
| **Build** | Maven | 3.6+ |

### Estrutura de Pacotes

```
com.japaneixxx.pmp/
├── PmpApplication.java              # Classe Principal
├── config/                           # Configurações
│   ├── SecurityConfig.java          # JWT, CORS, Segurança
│   └── ...
├── controller/                       # API REST (10-15 endpoints)
│   ├── AuthController.java
│   ├── ConsultaController.java
│   ├── ExameController.java
│   ├── PrescricaoController.java
│   ├── UsuarioController.java
│   └── ...
├── service/                          # Lógica de Negócio
│   ├── UsuarioService.java
│   ├── ConsultaService.java
│   ├── ExameService.java
│   ├── PrescricaoService.java
│   └── ...
├── repository/                       # Acesso a Dados
│   ├── UsuarioRepository.java
│   ├── ConsultaRepository.java
│   └── ...
├── model/                            # Entidades JPA
│   ├── Usuario.java
│   ├── Consulta.java
│   ├── Exame.java
│   ├── Prescricao.java
│   └── ...
├── security/                         # Autenticação
│   ├── JwtService.java
│   ├── JwtFilter.java
│   └── ...
└── storage/                          # Armazenamento Externo
    └── SupabaseStorageService.java
```

### Fluxo de Requisição Backend

```
HTTP Request
    ↓
JwtFilter (Valida Token)
    ↓
Controller (Mapeia rota, valida params)
    ↓
Service (Regras de negócio)
    ↓
Repository (Query ao banco)
    ↓
Database
    ↓
Response (JSON)
```

---

## 🎨 Frontend

### Stack

| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| **Framework** | React | 18.3.0 |
| **Builder** | Vite | 5.4.0 |
| **Roteamento** | React Router | 6.26.0 |
| **Estado** | Zustand | 4.5.0 |
| **HTTP Client** | Axios | 1.7.0 |
| **QR Code** | qrcode.react + html5-qrcode | 3.1.0 + 2.3.8 |
| **Datas** | date-fns | 3.6.0 |

### Estrutura de Arquivos

```
frontend/
├── src/
│   ├── App.jsx                      # Componente Raiz
│   ├── main.jsx                     # Entry Point
│   ├── components/                  # Componentes Reutilizáveis
│   │   └── layout/
│   │       ├── Layout.jsx
│   │       └── Layout.css
│   ├── pages/                       # Telas Principais
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── CadastroPage.jsx
│   │   ├── medico/
│   │   │   ├── MeusPacientesPage.jsx
│   │   │   ├── NovaConsultaPage.jsx
│   │   │   └── HistoricoPacientePage.jsx
│   │   ├── paciente/
│   │   │   ├── QrCodePacientePage.jsx
│   │   │   └── QrScannerPage.jsx
│   │   └── shared/
│   │       ├── ConsultasPage.jsx
│   │       ├── ExamesPage.jsx
│   │       ├── PrescricoesPage.jsx
│   │       ├── PerfilPage.jsx
│   │       └── HomePage.jsx
│   ├── services/                    # Lógica (API, DB)
│   │   ├── api.js                  # Axios config + interceptors
│   │   └── offlineDB.js            # IndexedDB para offline
│   ├── store/                       # Zustand Store
│   │   └── authStore.js            # Auth state management
│   └── styles/
│       └── global.css              # Estilos globais
└── vite.config.js
```

### Fluxo de Dados Frontend

```
User Interaction
    ↓
Component Event
    ↓
Service Call (API)
    ↓
Zustand Store (State Update)
    ↓
Component Re-render
    ↓
UI Update
```

---

## 🗄️ Banco de Dados

### Diagrama de Entidades

```
┌──────────────────┐
│     Usuario      │
├──────────────────┤
│ id (PK)          │
│ nome             │
│ email (UNIQUE)   │
│ password (hash)  │
│ tipo (enum)      │
│ crm (nullable)   │
└──────────────────┘
    ↓ 1:N
    
┌──────────────────────┐      ┌──────────────────┐
│     Consulta         │ ←N:1→│  PacienteInfo    │
├──────────────────────┤      ├──────────────────┤
│ id (PK)              │      │ id (PK)          │
│ paciente_id (FK)     │      │ usuario_id (FK)  │
│ medico_id (FK)       │      │ cpf              │
│ data_consulta        │      │ data_nascimento  │
│ motivo              │      │ telefone         │
│ observacoes         │      │ endereco         │
│ status              │      └──────────────────┘
└──────────────────────┘

┌──────────────────────┐
│      Exame           │
├──────────────────────┤
│ id (PK)              │
│ paciente_id (FK)     │
│ medico_id (FK)       │
│ tipo                 │
│ data_realizacao      │
│ resultado            │
│ arquivo_url          │
└──────────────────────┘

┌──────────────────────┐
│    Prescricao        │
├──────────────────────┤
│ id (PK)              │
│ paciente_id (FK)     │
│ medico_id (FK)       │
│ medicamentos (JSON)  │
│ data_prescricao      │
│ data_validade        │
│ status               │
└──────────────────────┘

┌──────────────────────┐
│  MedicoPaciente      │
├──────────────────────┤
│ id (PK)              │
│ medico_id (FK)       │
│ paciente_id (FK)     │
│ data_vinculacao      │
│ especialidade        │
└──────────────────────┘

┌──────────────────────┐
│   Compartilhamento   │
├──────────────────────┤
│ id (PK)              │
│ paciente_id (FK)     │
│ usuario_id (FK)      │
│ tipo_dados           │
│ data_expiracao       │
│ data_criacao         │
└──────────────────────┘
```

### Índices

```sql
-- Melhorando performance
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_consulta_paciente ON consulta(paciente_id);
CREATE INDEX idx_consulta_medico ON consulta(medico_id);
CREATE INDEX idx_exame_paciente ON exame(paciente_id);
CREATE INDEX idx_prescricao_paciente ON prescricao(paciente_id);
```

---

## 🔄 Fluxo de Dados Completo

### Exemplo: Criar Consulta

```
FRONTEND
  1. Usuário clica em "Nova Consulta"
  2. Form é preenchido com dados
  3. onClick → ConsultaService.createConsulta()
  4. Axios POST para /api/consultas
     ↓
BACKEND
  5. POST /consultas → ConsultaController.create()
  6. JwtFilter valida token
  7. Controller valida dados (DTO)
  8. Service.criarConsulta() aplica regras
     - Verifica se médico e paciente existem
     - Verifica disponibilidade
     - Calcula duração
  9. Repository.save() persiste no banco
     ↓
DATABASE
  10. INSERT INTO consulta (...)
  11. Gera ID automático
      ↓
BACKEND (Response)
  12. Retorna Consulta com ID (201 Created)
      ↓
FRONTEND
  13. Recebe resposta (axios promise resolvida)
  14. Atualiza Zustand store
  15. Redireciona para lista de consultas
  16. Re-render com nova consulta
```

---

## 🎯 Decisões Arquiteturais

### ✅ Por que JWT?

- Stateless (não precisa de session no servidor)
- Escalável (funciona bem em microsserviços)
- Seguro (assinado digitalmente)
- Independent (front-end pode validar timing)

### ✅ Por que Zustand?

- Simples e minimalista
- Sem boilerplate (menos código que Redux)
- Performance otimizada
- Bom para pequenos a médios projetos

### ✅ Por que Spring Boot?

- Convenção sobre configuração
- Ecossistema maduro
- SpringSecurity integrado
- Excelente documentação
- Comunidade grande

### ✅ Por que React + Vite?

- React: Componentes, comunidade, ecosistema
- Vite: Plugin HMR super rápido, bundle otimizado
- PWA: Funciona offline com service workers

### ✅ Por que PostgreSQL?

- ACID compliant
- Relacionamentos complexos
- Full-text search
- JSON support (para flexibilidade)
- Open source e confiável

---

## 🔒 Segurança

### Autenticação

```
1. Login: POST /auth/login (email, password)
2. Backend: Valida hash de senha com bcrypt
3. JWT: Gera token com claims (id, email, tipo)
4. Frontend: Armazena em localStorage
5. Requisições: Adiciona Authorization header
6. JwtFilter: Valida token em cada request
7. Expiração: 24h, refresh token (bonus)
```

### Autorização

```
@RestController
public class ConsultaController {
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MEDICO') or @securityService.isOwner(#id)")
    public Consulta get(@PathVariable Long id) {
        // Apenas médico ou dono conseguem acessar
    }
}
```

---

## 📊 Performance

### Estratégias Aplicadas

| Estratégia | Impacto | Onde |
|-----------|--------|------|
| **Índices no BD** | Queries 10-100x faster | PostgreSQL |
| **Lazy Loading** | Menos dados em memória | JPA |
| **Pagination** | Menos dados por request | API |
| **Caching** | Reutiliza resultados | Frontend (redis bonus) |
| **Code Splitting** | Chunks menores | Vite |
| **Offline DB** | Funciona sem Internet | IndexedDB Frontend |

---

## 🚀 Escalabilidade

### Horizontal

- API stateless (fácil replicar)
- BD separado (polyglot persistence)
- Load balancer na frente

### Vertical

- Indices otimizados
- Cache (Redis)
- Querys otimizadas
- CDN para assets

---

## 📚 Referências

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [REST API Design Best Practices](https://restfulapi.net/)

---

<div align="center">

**Arquitetura limpa, escalável e profissional! 🏗️**

</div>
