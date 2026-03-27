# 🔧 Troubleshooting

Guia para resolver problemas comuns no desenvolvimento do PMP.

## Índice

- [Backend](#backend)
- [Frontend](#frontend)
- [Banco de Dados](#banco-de-dados)
- [Docker](#docker)
- [Geral](#geral)

---

## 🔴 Backend

### Erro: "Port 8080 is already in use"

**Problema:** A porta 8080 já está sendo usada por outro processo.

**Solução 1 - Mude a porta:**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

**Solução 2 - Encontre e mate o processo:**
```bash
# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

### Erro: "Could not create connection to database server"

**Problema:** Backend não consegue conectar ao PostgreSQL.

**Verificações:**
```bash
# 1. Verifique se PostgreSQL está rodando
pg_isready -h localhost -p 5432

# 2. Verifique as credenciais em application.properties
cat backend/src/main/resources/application.properties

# 3. Verifique se o banco de dados existe
psql -U postgres -l | grep pmp_db

# 4. Inicie PostgreSQL (se parado)
sudo service postgresql start  # Linux
brew services start postgresql # Mac
```

**Solução:**
```bash
# 1. Crie o banco de dados
psql -U postgres
CREATE DATABASE pmp_db;
CREATE USER pmp_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE pmp_db TO pmp_user;
\q

# 2. Atualize application.properties com credenciais corretas
# 3. Reinicie o backend
mvn spring-boot:run
```

---

### Erro: "JWT token expired"

**Problema:** Token JWT expirou durante uso.

**Solução:**
- Faça login novamente para obter novo token
- Ou aumente o tempo de expiração em `application.properties`:
```properties
jwt.expiration=259200000  # 3 dias em ms
```

---

### Erro: "CORS policy blocked request"

**Problema:** Frontend recebe erro CORS do backend.

**Solução:**
Verifique `SecurityConfig.java`:
```java
@Configuration
public class SecurityConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",  // Frontend
            "http://localhost:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

### Erro: "NullPointerException ao acessar banco"

**Problema:** Erro ao tentar acessar dados nulos.

**Solução:**
1. Adicione validação:
```java
Optional<Usuario> user = usuarioRepository.findById(id);
if (user.isEmpty()) {
    throw new NotFoundException("Usuário não encontrado");
}
```

2. Use `@NotNull` annotations:
```java
@NotNull(message = "Email é obrigatório")
private String email;
```

---

## 🔵 Frontend

### Erro: "VITE_API_URL is undefined"

**Problema:** Variável de ambiente não foi carregada.

**Solução:**
```bash
# 1. Crie o arquivo .env
cp frontend/.env.example frontend/.env

# 2. Verifique o conteúdo
cat frontend/.env

# 3. Reinicie o servidor
cd frontend
npm run dev
```

---

### Erro: "npm ERR! ERESOLVE unable to resolve dependency tree"

**Problema:** Conflito de versão de dependências.

**Solução 1 - Force a instalação:**
```bash
cd frontend
npm install --legacy-peer-deps
```

**Solução 2 - Limpe e reinstale:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Solução 3 - Use yarn:**
```bash
yarn install
```

---

### Erro: "localhost:5173 refused to connect"

**Problema:** Frontend servidor não está rodando.

**Solução:**
```bash
# 1. Navegue até frontend
cd frontend

# 2. Instale dependências
npm install

# 3. Inicie o servidor
npm run dev

# 4. Verifique a saída no terminal para a URL correta
```

---

### Erro: "White screen ou página em branco"

**Problema:** Erro JavaScript não catching no console.

**Solução:**
1. **Abra o DevTools:**
   - F12 ou Ctrl+Shift+I
   - Vá para "Console"
   - Procure por erros vermelhos

2. **Erros comuns:**
   ```javascript
   // Erro: undefined state
   // Solução: Inicialize o store
   const { user } = useAuthStore();
   if (!user) return <LoadingScreen />;
   
   // Erro: Network request failed
   // Solução: Verifique se API está rodando
   // Backend: http://localhost:8080/api
   ```

3. **Debugar com React DevTools:**
   - Instale a extensão do Chrome
   - Inspecione componentes e props

---

### Erro: "Cannot find module 'React'"

**Problema:** React não foi instalado.

**Solução:**
```bash
cd frontend
npm install react react-dom
npm install  # Instale todas as dependências
```

---

### QR Code não funciona

**Problema:** Câmera não está funcionando ou QR não é lido.

**Solução:**
```javascript
// Verifique permissões de câmera no navegador
// 1. Dados do site → Permissões → Câmera
// 2. Ou reinicie o navegador

// Código para debug
console.log('Câmera acessível:', navigator.mediaDevices);
```

---

## 🗄️ Banco de Dados

### Erro: "FATAL: Ident authentication failed"

**Problema:** PostgreSQL recusa conexão.

**Solução:**
```bash
# Use opção -U para especificar usuário
psql -U pmp_user -d pmp_db -W
# Enter password: sua_senha
```

---

### Erro: "permission denied for schema public"

**Problema:** Usuário não tem permissões corretas.

**Solução:**
```sql
-- Como superuser (postgres)
psql -U postgres

GRANT ALL PRIVILEGES ON DATABASE pmp_db TO pmp_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO pmp_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pmp_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pmp_user;

-- Desconecte o banco e conecte novamente
\q
```

---

### Erro: "relation does not exist"

**Problema:** Tabela não foi criada pelo Hibernate.

**Solução:**
1. **Habilite ddl-auto temporariamente:**
```properties
spring.jpa.hibernate.ddl-auto=create
```

2. **Reinicie a aplicação** para criar as tabelas

3. **Revert para update:**
```properties
spring.jpa.hibernate.ddl-auto=update
```

---

### Banco crescendo muito

**Problema:** Arquivo .db ou banco ficando muito grande.

**Solução:**
```bash
# Limpe logs antigos
VACUUM FULL;

# Verifique tamanho
SELECT pg_size_pretty(pg_database_size('pmp_db'));

# Exporte dados e recrie se necessário
pg_dump pmp_db > backup.sql
dropdb pmp_db
createdb pmp_db
psql pmp_db < backup.sql
```

---

## 🐳 Docker

### Erro: "Docker daemon is not running"

**Solução:**

```bash
# Mac
open /Applications/Docker.app

# Linux
sudo systemctl start docker

# Windows
# Inicie Docker Desktop manualmente
```

---

### Erro: "Port 5432 already in use (PostgreSQL)"

**Solução:**
```bash
# Altere a porta no docker-compose.yml
ports:
  - "5433:5432"  # Host:Container

# Ou mata o container existente
docker ps
docker stop <container_id>
```

---

### Container parou sem erro

**Solução:**
```bash
# Veja os logs
docker logs <container_id>

# Rode interativo para debug
docker run -it -p 8080:8080 pmp-backend:latest /bin/bash
```

---

## 🔧 Geral

### Erro: "Git conflicts"

**Solução:**
```bash
# Veja o status
git status

# Resolva manualmente os conflitos
# Ou use ferramentas
git mergetool

# Depois commit
git add .
git commit -m "Resolve merge conflicts"
```

---

### "node-gyp ERR! configure error"

**Problema:** Erro ao compilar módulos nativos.

**Solução:**
```bash
# Instale build tools
# Mac
xcode-select --install

# Linux
sudo apt-get install build-essential

# Windows
npm install --global --production windows-build-tools

# Então
npm install
```

---

### Performance Lenta

**Checklist:**
- [ ] Backend tem índices no banco de dados
- [ ] Frontend está em modo de produção: `npm run build`
- [ ] Não há vazamento de memória (DevTools → Memory)
- [ ] Querys SQL estão otimizadas
- [ ] Cache está habilitado
- [ ] Network requests não são duplicadas

---

### Relatório de Bug Não Resolvido

Se nenhuma solução funcionar:

1. **Colete informações:**
   ```bash
   # Versões
   java -version
   mvn --version
   node --version
   npm --version
   
   # Banco
   psql --version
   
   # Sistema
   uname -a  # Mac/Linux
   ```

2. **Salve logs:**
   ```bash
   # Backend
   mvn spring-boot:run 2>&1 | tee backend.log
   
   # Frontend (DevTools Console)
   # Copy/paste no GitHub Issue
   ```

3. **Abra uma issue:**
   - [GitHub Issues](https://github.com/japaneixxx/pmp/issues/new)
   - Inclua: erro exato, passos para reproduzir, versões
   - Anexe logs e screenshots

---

## 📚 Recursos Úteis

- [Spring Boot Troubleshooting](https://spring.io/projects/spring-boot)
- [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Última atualização:** 25 de Março de 2026

💡 **Dica:** Use `make check-system` para verificar se todas as dependências estão instaladas!
