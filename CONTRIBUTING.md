# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o PMP! Este documento fornece orientações e instruções para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Começar](#como-começar)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Processo de Pull Request](#processo-de-pull-request)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Testes](#testes)
- [Documentação](#documentação)
- [Perguntas?](#perguntas)

---

## 📜 Código de Conduta

Este projeto adota um Código de Conduta que esperamos que todos os contribuidores seguam:

### Nosso Compromisso

- ✅ Ser respeitoso com diferentes opiniões
- ✅ Aceitar críticas construtivas
- ✅ Focar no que é melhor para a comunidade
- ✅ Mostrar empatia com outros membros

### Comportamento Inaceitável

- ❌ Linguagem ou imagens sexualizadas
- ❌ Ataques pessoais ou comentários depreciativos
- ❌ Trolling ou comentários insultuosos
- ❌ Assédio público ou privado
- ❌ Publicar informações privadas de terceiros

**Violações podem resultar em ações disciplinares, incluindo proibição permanente do projeto.**

---

## 🚀 Como Começar

### 1. Fork o Repositório

Clique no botão "Fork" no topo da página do repositório no GitHub.

### 2. Clone seu Fork

```bash
git clone https://github.com/Japaneixxx/pmp.git
cd pmp
```

### 3. Crie uma Branch para sua Feature

```bash
# Atualize primeiro
git fetch upstream
git checkout -b feature/sua-feature-descritiva

# Exemplos de bons nomes:
# - feature/adicionar-autenticacao-2fa
# - bugfix/corrigir-erro-consultas
# - docs/melhorar-api-docs
# - refactor/otimizar-queries-banco
```

### 4. Faça suas Mudanças

```bash
# Faça alterações, testes, etc.
git add .
git commit -m "Descrição clara do que foi feito"
```

### 5. Envie suas Mudanças

```bash
git push origin feature/sua-feature-descritiva
```

### 6. Abra um Pull Request

Vá para [GitHub PMP](https://github.com/japaneixxx/pmp) e clique em "Create Pull Request".

---

## 📝 Tipos de Contribuição

### 🐛 Reportar Bugs

Encontrou um bug? Abra uma issue com:

- **Título claro** - Descreva brevemente o problema
- **Descrição** - Como reproduzir o bug passo a passo
- **Comportamento esperado** - O que deveria acontecer
- **Comportamento atual** - O que está acontecendo
- **Capturas de tela** - Se aplicável
- **Ambiente** - SO, navegador, versão do Java, etc.

**Template de Bug:**
```markdown
## Descrição do Bug
Uma descrição clara e concisa do que é o bug.

## Para Reproduzir
Passos para reproduzir o comportamento:
1. Faça login com...
2. Clique em...
3. Veja o erro...

## Comportamento Esperado
Uma descrição clara do que você esperava que acontecesse.

## Capturas de Tela
Se aplicável, adicione capturas.

## Ambiente
- SO: [ex: Ubuntu 20.04]
- Navegador: [ex: Chrome 90]
- Versão Java: [ex: 17.0.1]
- Node: [ex: 16.0.0]
```

### ✨ Sugerir Features

Quer uma nova feature? Abra uma issue com:

- **Título claro** - Descrição concisa da feature
- **Descrição detalhada** - Por que essa feature é útil
- **Exemplos** - Como você imagina usando
- **Contexto adicional** - Qualquer outra informação relevante

**Template de Feature:**
```markdown
## Descrição
Uma descrição clara e concisa do que você quer que seja adicionado.

## Por que é necessário?
Explique o problema que isso resolve.

## Solução sugerida
Descreva como você imagina que funcione.

## Alternativas consideradas
Outras soluções pensadas.
```

### 📚 Melhorar Documentação

Documentação é tão importante quanto código:

- Corrigir typos ou erros
- Melhorar clareza de instruções
- Adicionar exemplos
- Atualizar informações desatualizadas

### 🔨 Implementar Features ou Corrigir Bugs

Quer contribuir com código? Ótimo!

---

## 🔄 Processo de Pull Request

### Antes de Começar

- ✅ Verifique se não existe PR similar aberto
- ✅ Leia o código existente para entender padrões
- ✅ Execute os testes localmente
- ✅ Siga os padrões de código do projeto

### Checklist para seu PR

```markdown
## Checklist
- [ ] Meu código segue os estilos do projeto
- [ ] Executei testes locais e tudo passou
- [ ] Adicionei testes para novas features
- [ ] Atualizei a documentação se necessário
- [ ] Meus commits são descritivos
- [ ] Não adicionei dependências desnecessárias
- [ ] Testei em navegadores diferentes
- [ ] Sem console errors ou warnings
```

### Após Enviar o PR

1. ⏳ **Espere por review** - Mantenedores revisarão seu código
2. 🔄 **Responda aos comentários** - Faça ajustes se solicitado
3. ✅ **Aprove o PR** - Após aprovação, será mergeado
4. 🎉 **Celebre!** - Sua contribuição está no projeto

### Revisão de Código

Esperamos que:
- Seu código seja legível e bem comentado
- Testes cubram as novas funcionalidades
- Documentação esteja atualizada
- Não haja conflitos com a branch principal
- Commits sejam atômicos e bem descritivos

---

## 💻 Padrões de Código

### Backend (Java/Spring Boot)

```java
// ✅ BOM - Nomes descritivos, comentários úteis
public class ConsultaService {
    
    /**
     * Cria uma nova consulta médica.
     * 
     * @param consulta os dados da consulta
     * @return a consulta criada
     * @throws ConsultaException se não for possível criar
     */
    public Consulta criarConsulta(Consulta consulta) {
        validarConsulta(consulta);
        return consultaRepository.save(consulta);
    }
    
    private void validarConsulta(Consulta consulta) {
        if (consulta.getDataConsulta() == null) {
            throw new ConsultaException("Data é obrigatória");
        }
    }
}

// ❌ RUIM - Nomes genéricos, sem documentação
public class CS {
    public Consulta cc(Consulta c) {
        return cr.save(c);
    }
}
```

### Convenções Java

- **Classes** - PascalCase: `ConsultaService`
- **Métodos** - camelCase: `criarConsulta()`
- **Constantes** - UPPER_CASE: `MAX_CONSULTAS`
- **Variáveis** - camelCase: `dataConsulta`
- **Packages** - lowercase: `com.japaneixxx.pmp.service`

### Frontend (JavaScript/React)

```javascript
// ✅ BOM - Componentes bem estruturados
const ConsultaCard = ({ consulta, onDelete }) => {
  const handleDelete = () => {
    confirmAndDelete(consulta.id);
  };

  return (
    <div className="consulta-card">
      <h3>{consulta.motivo}</h3>
      <button onClick={handleDelete}>Deletar</button>
    </div>
  );
};

// ❌ RUIM - Lógica complexa no componente
const c = ({ data }) => {
  return <div>{data.m}</div>;
};
```

### Convenções JavaScript

- **Componentes** - PascalCase: `ConsultaCard`
- **Funções** - camelCase: `handleDelete()`
- **Constantes** - UPPER_CASE: `MAX_ITEMS`
- **Variáveis** - camelCase: `userData`
- **CSS** - kebab-case: `consulta-card`

---

## 📝 Commits

### Boas Práticas

1. **Commits Atômicos** - Um commit = uma mudança lógica

```bash
# ✅ BOM
git commit -m "Adicionar validação de email"
git commit -m "Corrigir erro de cálculo de data"

# ❌ RUIM
git commit -m "Muitas mudanças aleatórias"
```

2. **Mensagens Claras**

```
# ✅ BOM - Imperativo, descritivo
Add validation to user email field
Fix null pointer exception in ConsultaService
Update README with new dependencies

# ❌ RUIM - Vago ou passado
fixed stuff
updated code
changes
```

3. **Formato de Mensagem**

```
Tipo: descrição em uma linha (max 50 caracteres)

Descrição opcional mais longa se necessário.
Explique o QUÊ e POR QUÊ, não COMO.

Fixes #123
```

### Tipos de Commit

- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação, sem mudança de código
- `refactor:` - Refatoração sem mudanças funcionais
- `perf:` - Otimização de performance
- `test:` - Adicionando ou atualizando testes
- `chore:` - Dependências, configuração

---

## 🧪 Testes

### Backend - JUnit

```java
@SpringBootTest
public class ConsultaServiceTest {
    
    @Mock
    private ConsultaRepository consultaRepository;
    
    @InjectMocks
    private ConsultaService consultaService;
    
    @Test
    public void testCriarConsulta() {
        // Arrange
        Consulta consulta = new Consulta();
        consulta.setMotivo("Checkup");
        
        // Act
        consultaService.criarConsulta(consulta);
        
        // Assert
        verify(consultaRepository, times(1)).save(consulta);
    }
}
```

### Frontend - Vitest/React Testing Library

```javascript
import { render, screen } from '@testing-library/react';
import ConsultaCard from './ConsultaCard';

describe('ConsultaCard', () => {
  it('deve exibir motivo da consulta', () => {
    const consulta = { id: 1, motivo: 'Checkup' };
    render(<ConsultaCard consulta={consulta} />);
    
    expect(screen.getByText('Checkup')).toBeInTheDocument();
  });
});
```

### Executar Testes

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test
```

**Requisito:** Todo novo código deve ter testes com **mínimo 80% de cobertura**.

---

## 📚 Documentação

### Ao Adicionar uma Feature

1. **Atualize o README** - Se for uma feature importante
2. **Documente a API** - Em `docs/API.md`
3. **Adicione comentários** - Em código complexo
4. **Exemplos de Uso** - Mostre como usar

### JavaDoc (Java)

```java
/**
 * Cria uma nova consulta no sistema.
 * 
 * @param pacienteId o ID do paciente
 * @param medicoId o ID do médico
 * @param dataConsulta data e hora da consulta
 * @return a consulta criada com ID atribuído
 * @throws ConsultaException se a data estiver no passado
 * @throws NotFoundException se paciente ou médico não existir
 */
public Consulta criarConsulta(
    Long pacienteId, 
    Long medicoId, 
    LocalDateTime dataConsulta) {
    // implementação
}
```

### JSDoc (JavaScript)

```javascript
/**
 * Valida se um email é válido.
 * 
 * @param {string} email - O email para validar
 * @returns {boolean} true se válido, false caso contrário
 * 
 * @example
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid'); // false
 */
function isValidEmail(email) {
    // implementação
}
```

---

## 🔍 Revisão Local antes do PR

```bash
# 1. Atualize sua branch com a main
git fetch upstream
git rebase upstream/master

# 2. Execute testes
mvn test          # Backend
npm test          # Frontend

# 3. Verifique formatação
mvn spotless:apply         # Backend (se configurado)
npx prettier --write .     # Frontend

# 4. Verifique sua branch
git log --oneline upstream/master..

# 5. Faça push
git push origin feature/sua-feature
```

---

## 🚀 Desenvolvimento Local

### Setup de Desenvolvimento

```bash
# Clone e setup
git clone https://github.com/Japaneixxx/pmp.git
cd pmp
git remote add upstream https://github.com/japaneixxx/pmp.git

# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

### Debugar

```bash
# Backend - Debug da aplicação
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"

# Frontend - Chrome DevTools
# F12 no navegador
```

---

## 📦 Dependências Novas

### Antes de Adicionar

1. **Necessidade Real** - É absolutamente necessária?
2. **Manutenção** - O projeto é mantido ativamente?
3. **Tamanho** - Quanto vai aumentar o bundle?
4. **Segurança** - Tem vulnerabilidades conhecidas?
5. **Alternativas** - Existe algo mais leve?

### Como Adicionar

```bash
# Backend
cd backend
mvn dependency:tree  # Ver dépendências atuais
mvn install          # Ou atualizar pom.xml manualmente

# Frontend
cd frontend
npm install --save seu-pacote
npm audit            # Verificar vulnerabilidades
```

Mencione no PR por que a dependência é necessária.

---

## 🎯 Diretrizes Específicas por Tipo

### Corrigindo Bugs

- [ ] Inclua um teste que reproduz o bug
- [ ] Corrija apenas o bug, não refatore código não relacionado
- [ ] Referencie a issue no commit: `Fixes #123`

### Novas Features

- [ ] Inclua testes unitários e de integração
- [ ] Atualize documentação e README
- [ ] Adicione exemplos de uso se pertinente
- [ ] Considere backward compatibility

### Refatoração

- [ ] Não mude funcionalidade, apenas implementação
- [ ] Mantenha a API pública igual
- [ ] Inclua testes específicos
- [ ] Justifique a refatoração no PR

---

## ⛔️ O Que NÃO Fazer

- ❌ Não fazer múltiplas features em um PR
- ❌ Não commitr arquivos gerados ou dependências
- ❌ Não ignorar linters ou testes falhando
- ❌ Não remover funcionalidades existentes sem discussão
- ❌ Não adicionar código comentado
- ❌ Não fazer commits gigantes e desorganizados
- ❌ Não ignorar comentários de revisão

---

## 📞 Perguntas?

- 📧 **Email:** [japaneix@gmail.com]
- 💬 **Discussões:** [GitHub Discussions](https://github.com/japaneixxx/pmp/discussions)
- 🐛 **Issues:** [GitHub Issues](https://github.com/japaneixxx/pmp/issues)

---

## 🎓 Recursos Úteis

- [Git Guide](https://git-scm.com/book/en/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Clean Code - Robert C. Martin](https://www.goodreads.com/book/show/3735293-clean-code)

---

<div align="center">

**Obrigado por contribuir! 🙏**

Sua contribuição, não importa o tamanho, ajuda a tornar o PMP melhor para todos.

</div>
