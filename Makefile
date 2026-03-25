.PHONY: help install dev build test clean docker-build docker-run lint format

# ================================
# PMP - Makefile de Desenvolvimento
# ================================
# Usage: make <target>
# Exemplo: make help

help:
	@echo "📦 PMP - Plataforma Médica Paciente"
	@echo ""
	@echo "Targets disponíveis:"
	@echo ""
	@echo "  make install          - Instala todas as dependências (backend + frontend)"
	@echo "  make dev              - Inicia ambiente de desenvolvimento"
	@echo "  make dev-backend      - Inicia apenas o backend"
	@echo "  make dev-frontend     - Inicia apenas o frontend"
	@echo "  make build            - Compila o projeto (backend + frontend)"
	@echo "  make build-backend    - Compila apenas o backend"
	@echo "  make build-frontend   - Compila apenas o frontend"
	@echo "  make test             - Executa todos os testes"
	@echo "  make test-backend     - Executa testes do backend"
	@echo "  make test-frontend    - Executa testes do frontend"
	@echo "  make clean            - Remove arquivos compilados"
	@echo "  make lint             - Verifica qualidade do código"
	@echo "  make format           - Formata o código"
	@echo "  make docker-build     - Constrói imagem Docker"
	@echo "  make docker-run       - Executa aplicação em Docker"
	@echo "  make db-setup         - Configura banco de dados"
	@echo "  make env-setup        - Cria arquivos .env"
	@echo ""

# ================================
# Instalação
# ================================

install: env-setup
	@echo "📦 Instalando dependências..."
	cd backend && mvn clean install
	cd ../frontend && npm install
	@echo "✅ Dependências instaladas!"

env-setup:
	@echo "🔧 Configurando variáveis de ambiente..."
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "  ✅ Criado backend/.env (edite com suas credenciais)"; \
	else \
		echo "  ℹ️ backend/.env já existe"; \
	fi
	@if [ ! -f frontend/.env ]; then \
		cp frontend/.env.example frontend/.env; \
		echo "  ✅ Criado frontend/.env"; \
	else \
		echo "  ℹ️ frontend/.env já existe"; \
	fi

# ================================
# Desenvolvimento
# ================================

dev: dev-backend dev-frontend

dev-backend:
	@echo "🚀 Iniciando Backend (Spring Boot)..."
	@echo "   URL: http://localhost:8080/api"
	cd backend && mvn spring-boot:run

dev-frontend:
	@echo "🎨 Iniciando Frontend (React)..."
	@echo "   URL: http://localhost:5173"
	cd frontend && npm run dev

# ================================
# Build / Compilação
# ================================

build: build-backend build-frontend
	@echo "✅ Build completo!"

build-backend:
	@echo "🔨 Compilando Backend..."
	cd backend && mvn clean package -DskipTests
	@echo "✅ Backend compilado!"

build-frontend:
	@echo "🔨 Compilando Frontend..."
	cd frontend && npm run build
	@echo "✅ Frontend compilado!"

# ================================
# Testes
# ================================

test: test-backend test-frontend
	@echo "✅ Todos os testes rodaram!"

test-backend:
	@echo "🧪 Testando Backend..."
	cd backend && mvn test
	@echo "✅ Testes do backend concluídos!"

test-frontend:
	@echo "🧪 Testando Frontend..."
	cd frontend && npm test
	@echo "✅ Testes do frontend concluídos!"

# ================================
# Qualidade de Código
# ================================

lint:
	@echo "📋 Verificando qualidade do código..."
	cd backend && mvn spotless:check || true
	cd ../frontend && npm run lint || true
	@echo "✅ Verificação concluída!"

format:
	@echo "🎨 Formatando código..."
	cd backend && mvn spotless:apply || true
	cd ../frontend && npx prettier --write . || true
	@echo "✅ Código formatado!"

# ================================
# Docker
# ================================

docker-build: build-backend
	@echo "🐳 Construindo imagem Docker..."
	cd backend && docker build -t pmp-backend:latest .
	@echo "✅ Imagem construída!"

docker-run: docker-build
	@echo "🚀 Executando em Docker..."
	docker run -p 8080:8080 --env-file backend/.env pmp-backend:latest
	@echo "✅ Docker rodando em http://localhost:8080"

docker-compose:
	@echo "🐳 Iniciando Docker Compose..."
	docker-compose up --build
	@echo "✅ Docker Compose rodando!"

# ================================
# Banco de Dados
# ================================

db-setup:
	@echo "🗄️ Configurando banco de dados..."
	@echo "Certifique-se de ter PostgreSQL instalado e rodando!"
	@echo ""
	@echo "Execute os seguintes comandos no psql:"
	@echo ""
	@echo "  psql -U postgres"
	@echo "  CREATE DATABASE pmp_db;"
	@echo "  CREATE USER pmp_user WITH PASSWORD 'sua_senha_aqui';"
	@echo "  ALTER ROLE pmp_user SET client_encoding TO 'utf8';"
	@echo "  ALTER ROLE pmp_user SET default_transaction_isolation TO 'read committed';"
	@echo "  GRANT ALL PRIVILEGES ON DATABASE pmp_db TO pmp_user;"
	@echo ""

db-reset:
	@echo "⚠️  Limpando banco de dados..."
	@read -p "Has certeza? (s/n) " confirm; \
	if [ "$$confirm" = "s" ]; then \
		cd backend && mvn clean install && mvn spring-boot:run; \
	fi

# ================================
# Limpeza
# ================================

clean:
	@echo "🧹 Limpando arquivos compilados..."
	cd backend && mvn clean
	cd ../frontend && npm cache clean --force && rm -rf node_modules dist
	@echo "✅ Limpeza concluída!"

clean-all: clean
	@echo "🧹 Removendo também os .env..."
	rm -f backend/.env frontend/.env
	@echo "✅ Limpeza total concluída!"

# ================================
# Monitoramento
# ================================

logs-backend:
	@echo "📊 Vendo logs do Backend..."
	docker logs -f pmp-backend

monitor:
	@echo "📊 Monitores do Projeto"
	@echo ""
	@echo "Backend (Spring Boot Actuator):"
	@echo "  Health: http://localhost:8080/api/actuator/health"
	@echo "  Metrics: http://localhost:8080/api/actuator/metrics"
	@echo ""
	@echo "Frontend (React):"
	@echo "  Dev Server: http://localhost:5173"
	@echo ""

# ================================
# Git Helpers
# ================================

git-setup:
	@echo "🔧 Configurando Git..."
	git config core.hooksPath .githooks
	chmod +x .githooks/* 2>/dev/null || true
	@echo "✅ Git hooks configurados!"

status:
	@echo "📊 Status do Projeto"
	@echo ""
	@echo "Backend:"
	@echo "  Pasta: backend/"
	@echo "  Build: mvn clean package"
	@echo ""
	@echo "Frontend:"
	@echo "  Pasta: frontend/"
	@echo "  Build: npm run build"
	@echo ""
	@echo "Banco de Dados:"
	@echo "  Type: PostgreSQL"
	@echo "  Status: $(shell pg_isready -h localhost -p 5432 2>/dev/null && echo "✅ Online" || echo "❌ Offline")"
	@echo ""

# ================================
# Documentação
# ================================

docs:
	@echo "📚 Documentação disponível em:"
	@echo ""
	@echo "Guias:"
	@echo "  - README.md                - Visão geral"
	@echo "  - CONTRIBUTING.md          - Como contribuir"
	@echo "  - SECURITY.md              - Política de segurança"
	@echo "  - CODE_OF_CONDUCT.md       - Código de conduta"
	@echo "  - ARCHITECTURE.md          - Arquitetura"
	@echo ""
	@echo "Documentação Técnica:"
	@echo "  - docs/INSTALACAO.md       - Guia detalhado de instalação"
	@echo "  - docs/API.md              - Documentação da API REST"
	@echo ""
	@echo "Arquivos de Referência:"
	@echo "  - .env.example             - Variáveis de ambiente"
	@echo "  - .editorconfig            - Configuração do editor"
	@echo "  - .github/workflows/ci.yml - CI/CD pipeline"
	@echo ""

# ================================
# Utilidades
# ================================

version:
	@echo "PMP - Versão: 1.0.0"
	@echo ""
	@echo "Backend:"
	cd backend && mvn --version | head -n 1
	@echo ""
	@echo "Frontend:"
	cd frontend && npm --version
	@echo ""

check-system:
	@echo "🔍 Verificando dependências do sistema..."
	@echo ""
	@echo "Java:"
	@which java > /dev/null && echo "✅ Instalado" || echo "❌ Não encontrado"
	@echo ""
	@echo "Maven:"
	@which mvn > /dev/null && echo "✅ Instalado" || echo "❌ Não encontrado"
	@echo ""
	@echo "Node.js:"
	@which node > /dev/null && echo "✅ Instalado" || echo "❌ Não encontrado"
	@echo ""
	@echo "PostgreSQL:"
	@which psql > /dev/null && echo "✅ Instalado" || echo "❌ Não encontrado"
	@echo ""
	@echo "Git:"
	@which git > /dev/null && echo "✅ Instalado" || echo "❌ Não encontrado"
	@echo ""
	@echo "Docker:"
	@which docker > /dev/null && echo "✅ Instalado" || echo "❌ Não encontrado"
	@echo ""

# ================================
# Atalhos Comuns
# ================================

sync:
	@echo "📝 Sincronizando com upstream..."
	git fetch upstream
	git rebase upstream/master

update:
	@echo "🔄 Atualizando dependências..."
	cd backend && mvn versions:update-properties
	cd ../frontend && npm update
	@echo "✅ Dependências atualizadas!"

reset-hard:
	@echo "⚠️  Revertendo todas as mudanças..."
	@read -p "Tem certeza? (s/n) " confirm; \
	if [ "$$confirm" = "s" ]; then \
		git reset --hard HEAD; \
		git clean -fd; \
	fi

.DEFAULT_GOAL := help
