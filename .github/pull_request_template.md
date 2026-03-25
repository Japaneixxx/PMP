---
name: "Pull Request"
description: "Submeta uma alteração ao projeto"

body:
  - type: markdown
    attributes:
      value: |
        ## Obrigado por contribuir! 🎉
        
        Preencha os detalhes abaixo para descrever sua alteração.

  - type: textarea
    id: description
    attributes:
      label: "Descrição do PR"
      description: "Descreva as mudanças que você fez e por quê"
      placeholder: "Explique o que foi alterado e qual a razão"
    validations:
      required: true

  - type: input
    id: issue
    attributes:
      label: "Relacionado a Issue (opcional)"
      description: "Digite #número da issue (ex: Fixes #123)"
      placeholder: "ex: Fixes #123"

  - type: dropdown
    id: type
    attributes:
      label: "Tipo de Mudança"
      options:
        - "🐛 Bug fix"
        - "✨ Novas features"
        - "📚 Documentação"
        - "♻️ Refatoração"
        - "🚀 Performance"
        - "🧪 Testes"
        - "🎨 Estilo"
    validations:
      required: true

  - type: textarea
    id: testing
    attributes:
      label: "Como Testar?"
      description: "Descreva como testar as mudanças"
      placeholder: |
        1. Faça...
        2. Execute...
        3. Verifique que...
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: "Screenshots/Evidências (opcional)"
      description: "Se aplicável, adicione capturas de tela"
      placeholder: "Cole imagens aqui (Ctrl+V)"

  - type: textarea
    id: notes
    attributes:
      label: "Notas Adicionais (opcional)"
      description: "Qualquer informação adicional"
      placeholder: "Detalhes de implementação, breaking changes, etc"

  - type: checkboxes
    id: checklist
    attributes:
      label: "Checklist"
      options:
        - label: "Testei localmente e tudo funciona"
          required: true
        - label: "Meu código segue os estilos do projeto"
          required: true
        - label: "Atualizei a documentação quando necessário"
          required: false
        - label: "Não adicionei dependências desnecessárias"
          required: true
        - label: "Meus commits são claros e descritivos"
          required: true
