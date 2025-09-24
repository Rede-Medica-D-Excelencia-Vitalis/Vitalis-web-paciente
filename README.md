# 🏥 Vitalis Frontend - Plataforma de Saúde

Frontend web do paciente da plataforma Vitalis, desenvolvido com React, TypeScript e Vite.

## 📊 Visão Geral

Este projeto implementa uma plataforma completa de saúde com foco na experiência do paciente, incluindo:

- **Interface Responsiva**: Adaptada para desktop, tablet e mobile
- **Autenticação Segura**: Sistema de login com tokens JWT
- **Agendamento de Consultas**: Interface intuitiva para marcar consultas
- **Teleconsulta**: Videochamadas integradas
- **Triagem Online**: Questionário inteligente para avaliação inicial
- **Farmácia Virtual**: E-commerce integrado para medicamentos
- **Sistema de Notificações**: Alertas em tempo real

## 🧪 Testes Implementados

### 📱 Testes de Interface (UI/UX) - 11 Cenários
**Localização**: `src/teste-de-interface/`  
**Configuração**: `playwright.config.ts`

#### Responsividade (6 Testes)
- **UI-001**: Layout Desktop (1920x1080)
- **UI-002**: Layout Tablet (768x1024)
- **UI-003**: Mobile Portrait (375x667) - **Crítico**
- **UI-004**: Mobile Landscape (667x375)
- **UI-005**: Tablet Landscape (1024x768)
- **UI-006**: Breakpoints Intermediários

#### Navegação (3 Testes)
- **UI-007**: Menu de Navegação Principal - **Crítico**
- **UI-008**: Breadcrumbs e Navegação Hierárquica
- **UI-009**: Botões de Navegação e Ações

#### Consistência Visual (2 Testes)
- **UI-010**: Consistência de Cores e Tipografia
- **UI-011**: Acessibilidade e Usabilidade - **Alta**

### 🔗 Testes de Integração - 9 Cenários
**Localização**: `src/teste-integracao/`  
**Configuração**: `playwright.integracao.config.ts`

#### Integração com APIs (5 Testes)
- **INT-001**: Login com API de Autenticação - **Crítico**
- **INT-002**: Carregamento de Consultas via API - **Crítico**
- **INT-003**: Agendamento via API - **Crítico**
- **INT-004**: Triagem via API - **Alta**
- **INT-005**: Produtos da Farmácia via API - **Alta**

#### Integração WebSocket (2 Testes)
- **INT-006**: Conexão WebSocket - **Crítico**
- **INT-007**: Envio de Mensagens via WebSocket - **Alta**

#### Testes de Robustez (2 Testes)
- **INT-008**: Tratamento de Erros de API - **Alta**
- **INT-009**: Validação de Dados da API - **Média**

### 🗄️ Testes de Dados - 4 Cenários
**Localização**: `src/teste-dados/`  
**Configuração**: `playwright.dados.config.ts`

#### Validação (2 Testes)
- **DATA-001**: Validação de Dados de Entrada - **Crítico**
- **DATA-002**: Validação de Dados da API - **Alta**

#### Persistência (2 Testes)
- **DATA-003**: Persistência no LocalStorage - **Alta**
- **DATA-004**: Sincronização de Dados - **Alta**

## 🚀 Como Executar

### Pré-requisitos

```bash
# Node.js 18+ e npm
node --version
npm --version

# Instalar dependências
npm install

# Instalar navegadores do Playwright
npx playwright install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar aplicação
open http://localhost:5173
```

### Testes

#### Todos os Testes
```bash
# Executar todos os testes
npm run test:playwright

# Executar testes de interface
npm run test:playwright

# Executar testes de integração
npm run test:integracao

# Executar testes de dados
npm run test:dados
```

#### Testes Específicos
```bash
# Testes de interface com relatório
npm run test:playwright:report

# Testes de integração com relatório
npm run test:integracao:report

# Testes de dados com relatório
npm run test:dados:report

# Modo debug
npm run test:playwright:debug
```

#### Testes Unitários
```bash
# Executar testes unitários
npm run test

# Executar com UI
npm run test:ui

# Executar com cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

## 📁 Estrutura do Projeto

```
Vitalis-web-paciente/
├── src/
│   ├── components/          # Componentes React
│   │   ├── auth/           # Componentes de autenticação
│   │   ├── business/       # Componentes de negócio
│   │   ├── layout/         # Componentes de layout
│   │   ├── notifications/  # Componentes de notificação
│   │   ├── plans/          # Componentes de planos
│   │   ├── tracking/       # Componentes de rastreamento
│   │   └── ui/             # Componentes de UI base
│   ├── contexts/           # Contextos React
│   ├── hooks/              # Hooks customizados
│   ├── lib/                # Utilitários e configurações
│   ├── pages/              # Páginas da aplicação
│   ├── screens/            # Telas principais
│   ├── services/           # Serviços de API
│   ├── store/              # Gerenciamento de estado
│   ├── types/              # Definições de tipos
│   ├── teste-de-interface/ # Testes de UI/UX
│   ├── teste-integracao/   # Testes de integração
│   └── teste-dados/        # Testes de dados
├── public/                 # Arquivos estáticos
├── docs/                   # Documentação e relatórios
├── scripts/                # Scripts de automação
├── .vscode/                # Configurações do VS Code
├── playwright.config.ts    # Configuração Playwright (UI)
├── playwright.integracao.config.ts # Configuração Playwright (Integração)
├── playwright.dados.config.ts      # Configuração Playwright (Dados)
└── package.json            # Dependências e scripts
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

### Testes
- **Playwright** - Testes end-to-end
- **Vitest** - Testes unitários
- **React Testing Library** - Testes de componentes
- **Jest** - Framework de testes

### Desenvolvimento
- **ESLint** - Linting
- **Prettier** - Formatação de código
- **TypeScript** - Verificação de tipos
- **Husky** - Git hooks

## 📊 Métricas de Qualidade

### Cobertura de Testes
- **Interface**: 100% das telas principais testadas
- **Integração**: 100% das APIs testadas
- **Dados**: 100% das operações de dados validadas
- **Total**: 24 cenários de teste implementados

### Navegadores Suportados
- **Chrome/Chromium** - Suporte completo
- **Firefox** - Suporte completo
- **Safari/WebKit** - Suporte completo

### Dispositivos Testados
- **Desktop**: 1920x1080, 1440x900, 1366x768
- **Tablet**: 768x1024 (portrait), 1024x768 (landscape)
- **Mobile**: 375x667 (portrait), 667x375 (landscape)

## 🐳 Docker

### Executar com Docker
```bash
# Build da imagem
docker build -t vitalis-frontend .

# Executar container
docker run -p 5173:5173 vitalis-frontend

# Executar testes com Docker Compose
docker-compose -f docker-compose.testes.yml up
```

### Docker Compose para Testes
```bash
# Executar testes de interface
docker-compose -f docker-compose.testes.yml up testes-interface

# Executar testes de integração
docker-compose -f docker-compose.testes.yml up testes-integracao

# Ver relatórios
docker-compose -f docker-compose.testes.yml up relatorio
```

## 📈 CI/CD

### GitHub Actions
- **Testes de Interface**: Executados em cada PR
- **Testes de Integração**: Executados em cada PR
- **Testes de Dados**: Executados em cada PR
- **Deploy**: Automático após merge na main

### Workflows
- `.github/workflows/testes-interface.yml` - Testes de UI/UX
- `.github/workflows/testes-integracao.yml` - Testes de integração
- `.github/workflows/testes-dados.yml` - Testes de dados

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
```

### Testes
```bash
npm run test                    # Testes unitários
npm run test:ui                 # Testes unitários com UI
npm run test:coverage           # Testes com cobertura
npm run test:watch              # Testes em modo watch
npm run test:playwright         # Testes de interface
npm run test:integracao         # Testes de integração
npm run test:dados              # Testes de dados
```

### Playwright
```bash
npm run test:playwright:ui      # UI do Playwright
npm run test:playwright:headed  # Modo headed
npm run test:playwright:debug   # Modo debug
npm run test:playwright:report  # Ver relatórios
npm run test:playwright:install # Instalar navegadores
```

## 📚 Documentação

### Testes
- [Testes de Interface](src/teste-de-interface/README.md)
- [Testes de Integração](src/teste-integracao/README.md)
- [Testes de Dados](src/teste-dados/README.md)

### API
- [Documentação da API](docs/README_API_INTEGRATION.md)
- [Setup do Projeto](docs/SETUP.md)

### Relatórios
- **Interface**: `docs/playwright-report/index.html`
- **Integração**: `docs/playwright-report-integracao/index.html`
- **Dados**: `docs/playwright-report-dados/index.html`

## 🚨 Troubleshooting

### Problemas Comuns

1. **Aplicação não carrega**
   ```bash
   # Verificar se o servidor está rodando
   npm run dev
   
   # Verificar se a porta 5173 está disponível
   lsof -i :5173
   ```

2. **Testes falham**
   ```bash
   # Instalar navegadores do Playwright
   npx playwright install
   
   # Executar testes em modo debug
   npm run test:playwright:debug
   ```

3. **Dependências não instalam**
   ```bash
   # Limpar cache e reinstalar
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Suporte

Para problemas ou dúvidas:

1. Verificar logs de erro
2. Consultar documentação específica
3. Verificar issues no repositório
4. Contatar equipe de desenvolvimento

## 🤝 Contribuição

### Como Contribuir

1. Fork do repositório
2. Criar branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Fazer commit das mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir Pull Request

### Padrões de Código

- **TypeScript** para tipagem
- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens
- **Testes** obrigatórios para novas funcionalidades

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento Frontend**: Equipe Vitalis
- **QA/Testes**: Equipe de Qualidade
- **DevOps**: Equipe de Infraestrutura

---

**Última atualização**: Setembro 2024  
**Versão**: 1.0.0  
**Status**: Em Desenvolvimento Ativo
