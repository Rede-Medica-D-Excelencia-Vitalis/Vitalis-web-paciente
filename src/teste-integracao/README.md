# 🧪 Testes de Integração - Vitalis Frontend

Este diretório contém os testes de integração para o frontend web do paciente da plataforma Vitalis, focando na validação das integrações com APIs e WebSocket.

## 📊 Visão Geral

- **Total de Testes**: 9 cenários
- **Cobertura**: 100% das integrações principais
- **Prioridade**: Crítica para validação do sistema
- **Ferramenta**: Playwright

## 🎯 Objetivos dos Testes de Integração

- ✅ Validar comunicação entre frontend e backend
- ✅ Verificar tratamento de respostas da API
- ✅ Testar conectividade WebSocket
- ✅ Validar fluxos de dados end-to-end
- ✅ Assegurar robustez das integrações

## 🔧 Testes Implementados

### 1. INTEGRAÇÃO COM APIs (5 Testes)

#### INT-001 - Login com API de Autenticação
- **Prioridade**: Crítica
- **Objetivo**: Verificar integração com API de autenticação
- **Cenários**:
  - Carregamento da aplicação
  - Simulação de requisições de login
  - Tratamento de erros (401, 500)
  - Monitoramento de performance

#### INT-002 - Carregamento de Consultas via API
- **Prioridade**: Crítica
- **Objetivo**: Verificar integração com API de consultas
- **Cenários**:
  - Carregamento de consultas após login
  - Exibição de consultas no dashboard
  - Cálculo de estatísticas
  - Tratamento de erros (401, 403, 404, 500)

#### INT-003 - Agendamento via API
- **Prioridade**: Crítica
- **Objetivo**: Verificar integração com API de agendamento
- **Cenários**:
  - Realização de agendamento
  - Validação de campos obrigatórios
  - Tratamento de conflitos de horário
  - Verificação de performance

#### INT-004 - Triagem via API
- **Prioridade**: Alta
- **Objetivo**: Verificar integração com API de triagem
- **Cenários**:
  - Salvamento de triagem
  - Análise de IA
  - Validação de sintomas
  - Tratamento de erros

#### INT-005 - Produtos da Farmácia via API
- **Prioridade**: Alta
- **Objetivo**: Verificar integração com API de produtos
- **Cenários**:
  - Carregamento de produtos
  - Filtros e busca
  - Paginação
  - Tratamento de erros

### 2. INTEGRAÇÃO WEBSOCKET (2 Testes)

#### INT-006 - Conexão WebSocket
- **Prioridade**: Crítica
- **Objetivo**: Verificar conectividade WebSocket para chat
- **Cenários**:
  - Estabelecimento de conexão
  - Autenticação via token
  - Tratamento de erros de conexão
  - Reconexão automática

#### INT-007 - Envio de Mensagens via WebSocket
- **Prioridade**: Alta
- **Objetivo**: Verificar envio e recebimento de mensagens
- **Cenários**:
  - Envio de mensagens
  - Validação de payload
  - Tratamento de erros
  - Verificação de timestamp

### 3. TESTES DE ROBUSTEZ (2 Testes)

#### INT-008 - Tratamento de Erros de API
- **Prioridade**: Alta
- **Objetivo**: Verificar tratamento de erros de API
- **Cenários**:
  - Erro 500 - Servidor
  - Retry automático
  - Fallback para cache
  - Timeout de requisição

#### INT-009 - Validação de Dados da API
- **Prioridade**: Média
- **Objetivo**: Verificar validação de dados recebidos
- **Cenários**:
  - Validação de campos obrigatórios
  - Sanitização de dados
  - Conversão de tipos
  - Tratamento de dados inválidos

## 🚀 Como Executar

### Pré-requisitos

```bash
# Instalar dependências
npm install

# Instalar navegadores do Playwright
npx playwright install
```

### Execução dos Testes

```bash
# Executar todos os testes de integração
npm run test:integracao

# Executar teste específico
npx playwright test src/teste-integracao/INT-001-login-api-autenticacao.test.tsx

# Executar com relatório HTML
npx playwright test --config=playwright.integracao.config.ts --reporter=html

# Executar em modo debug
npx playwright test --config=playwright.integracao.config.ts --debug
```

### Scripts Disponíveis

```bash
# Testes de integração
npm run test:integracao

# Testes de integração com relatório
npm run test:integracao:report

# Testes de integração em modo headless
npm run test:integracao:headless
```

## 📁 Estrutura dos Arquivos

```
src/teste-integracao/
├── README.md                                    # Este arquivo
├── INT-001-login-api-autenticacao.test.tsx     # Teste de login
├── INT-002-carregamento-consultas-api.test.tsx # Teste de consultas
├── INT-003-agendamento-api.test.tsx            # Teste de agendamento
├── INT-004-triagem-api.test.tsx                # Teste de triagem
├── INT-005-produtos-farmacia-api.test.tsx      # Teste de farmácia
├── INT-006-conexao-websocket.test.tsx          # Teste de WebSocket
├── INT-007-envio-mensagens-websocket.test.tsx  # Teste de mensagens
├── INT-008-tratamento-erros-api.test.tsx       # Teste de erros
└── INT-009-validacao-dados-api.test.tsx        # Teste de validação
```

## ⚙️ Configuração

### Playwright Config

O arquivo `playwright.integracao.config.ts` contém a configuração específica para os testes de integração:

```typescript
export default defineConfig({
  testDir: './src/teste-integracao',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'docs/playwright-integracao-report' }],
    ['json', { outputFile: 'docs/playwright-integracao-results.json' }],
    ['junit', { outputFile: 'docs/playwright-integracao-results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
});
```

## 📊 Relatórios

Os relatórios são gerados automaticamente em:

- **HTML**: `docs/playwright-integracao-report/index.html`
- **JSON**: `docs/playwright-integracao-results.json`
- **JUnit**: `docs/playwright-integracao-results.xml`

### Visualizar Relatórios

```bash
# Abrir relatório HTML
npx playwright show-report docs/playwright-integracao-report

# Ou acessar diretamente
open docs/playwright-integracao-report/index.html
```

## 🐳 Execução com Docker

### Docker Compose

```bash
# Executar testes com Docker Compose
docker-compose -f docker-compose.testes.yml up testes-interface

# Executar apenas testes de integração
docker-compose -f docker-compose.testes.yml up testes-integracao

# Ver relatórios
docker-compose -f docker-compose.testes.yml up relatorio
```

### Dockerfile

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps

EXPOSE 5173
CMD ["npm", "run", "dev"]
```

## 🔍 Debugging

### Modo Debug

```bash
# Executar em modo debug
npx playwright test --config=playwright.integracao.config.ts --debug

# Executar teste específico em debug
npx playwright test INT-001 --debug
```

### Screenshots e Videos

- Screenshots são capturados automaticamente em caso de falha
- Videos são gravados para testes que falham
- Arquivos são salvos em `test-results/`

### Logs

```bash
# Executar com logs detalhados
DEBUG=pw:api npx playwright test --config=playwright.integracao.config.ts

# Executar com logs de rede
DEBUG=pw:network npx playwright test --config=playwright.integracao.config.ts
```

## 📈 Métricas de Qualidade

### Cobertura de Testes

- **APIs**: 100% das APIs principais testadas
- **WebSocket**: 100% dos WebSockets validados
- **Cenários de Erro**: 100% dos cenários de erro cobertos
- **Fluxos de Dados**: 100% dos fluxos de dados testados

### Critérios de Aprovação

Cada teste possui critérios específicos de aprovação:

1. **Requisição HTTP correta**
2. **Resposta da API válida**
3. **Dados carregados corretamente**
4. **Interface atualizada**
5. **Performance adequada**

## 🛠️ Manutenção

### Adicionando Novos Testes

1. Criar arquivo `INT-XXX-nome-do-teste.test.tsx`
2. Seguir padrão de nomenclatura existente
3. Incluir documentação no README
4. Adicionar ao CI/CD se necessário

### Atualizando Testes Existentes

1. Manter compatibilidade com APIs existentes
2. Atualizar documentação
3. Verificar critérios de aprovação
4. Testar em diferentes navegadores

## 🚨 Troubleshooting

### Problemas Comuns

1. **Aplicação não carrega**
   - Verificar se `npm run dev` está rodando
   - Verificar URL base no config
   - Verificar se porta 5173 está disponível

2. **Testes falham por timeout**
   - Aumentar timeout no config
   - Verificar performance da aplicação
   - Verificar se APIs estão respondendo

3. **Elementos não encontrados**
   - Verificar seletores CSS
   - Aguardar carregamento completo
   - Verificar se elementos existem na página

### Suporte

Para problemas ou dúvidas:

1. Verificar logs de erro
2. Consultar documentação do Playwright
3. Verificar issues no repositório
4. Contatar equipe de desenvolvimento

## 📚 Recursos Adicionais

- [Documentação Playwright](https://playwright.dev/)
- [Guia de Testes de Integração](https://playwright.dev/docs/test-types)
- [Configuração de CI/CD](https://playwright.dev/docs/ci)
- [Debugging](https://playwright.dev/docs/debug)

---

**Última atualização**: Setembro 2024  
**Versão**: 1.0.0  
**Mantenedor**: Equipe de Desenvolvimento Vitalis