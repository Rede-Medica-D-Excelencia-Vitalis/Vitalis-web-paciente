# 🗄️ Testes de Dados - Vitalis Frontend

Este diretório contém os testes de dados para o frontend web do paciente da plataforma Vitalis, focando na validação e persistência de dados.

## 📊 Visão Geral

- **Total de Testes**: 4 cenários
- **Cobertura**: 100% das operações de dados
- **Prioridade**: Alta para integridade de dados
- **Ferramenta**: Playwright

## 🎯 Objetivos dos Testes de Dados

- ✅ Validar integridade dos dados
- ✅ Verificar persistência de informações
- ✅ Testar validação de dados de entrada
- ✅ Validar sincronização de dados
- ✅ Assegurar consistência de dados

## 📊 Testes Implementados

### 1. TESTES DE VALIDAÇÃO (2 Testes)

#### DATA-001 - Validação de Dados de Entrada
- **Prioridade**: Crítica
- **Objetivo**: Verificar validação de dados de entrada em formulários
- **Cenários**:
  - Validação de campos obrigatórios
  - Validação de formato de email
  - Validação de formato de CPF
  - Validação de tamanho de dados
  - Validação de caracteres especiais
  - Mensagens de erro claras

#### DATA-002 - Validação de Dados da API
- **Prioridade**: Alta
- **Objetivo**: Verificar validação de dados recebidos da API
- **Cenários**:
  - Validação de estrutura de dados
  - Tratamento de dados inválidos
  - Sanitização de dados
  - Fallback para dados corrompidos
  - Validação de tipos de dados

### 2. TESTES DE PERSISTÊNCIA (2 Testes)

#### DATA-003 - Persistência no LocalStorage
- **Prioridade**: Alta
- **Objetivo**: Verificar persistência de dados no localStorage
- **Cenários**:
  - Salvamento de dados no localStorage
  - Recuperação de dados após reload
  - Tratamento de dados grandes
  - Limpeza de dados
  - Sincronização entre abas
  - Verificação de integridade

#### DATA-004 - Sincronização de Dados
- **Prioridade**: Alta
- **Objetivo**: Verificar sincronização de dados entre frontend e backend
- **Cenários**:
  - Sincronização online
  - Sincronização offline
  - Resolução de conflitos
  - Sincronização em lote
  - Recuperação de falhas

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
# Executar todos os testes de dados
npm run test:dados

# Executar teste específico
npx playwright test src/teste-dados/DATA-001-validacao-dados-entrada.test.tsx

# Executar com relatório HTML
npx playwright test --config=playwright.dados.config.ts --reporter=html

# Executar em modo debug
npx playwright test --config=playwright.dados.config.ts --debug
```

### Scripts Disponíveis

```bash
# Testes de dados
npm run test:dados

# Testes de dados com relatório
npm run test:dados:report

# Testes de dados em modo headless
npm run test:dados:headless
```

## 📁 Estrutura dos Arquivos

```
src/teste-dados/
├── README.md                                    # Este arquivo
├── DATA-001-validacao-dados-entrada.test.tsx   # Teste de validação de entrada
├── DATA-002-validacao-dados-api.test.tsx       # Teste de validação de API
├── DATA-003-persistencia-localstorage.test.tsx # Teste de persistência
└── DATA-004-sincronizacao-dados.test.tsx       # Teste de sincronização
```

## ⚙️ Configuração

### Playwright Config

O arquivo `playwright.dados.config.ts` contém a configuração específica para os testes de dados:

```typescript
export default defineConfig({
  testDir: './src/teste-dados',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'docs/playwright-dados-report' }],
    ['json', { outputFile: 'docs/playwright-dados-results.json' }],
    ['junit', { outputFile: 'docs/playwright-dados-results.xml' }]
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

- **HTML**: `docs/playwright-dados-report/index.html`
- **JSON**: `docs/playwright-dados-results.json`
- **JUnit**: `docs/playwright-dados-results.xml`

### Visualizar Relatórios

```bash
# Abrir relatório HTML
npx playwright show-report docs/playwright-dados-report

# Ou acessar diretamente
open docs/playwright-dados-report/index.html
```

## 🗄️ Tipos de Dados Testados

### Validação de Entrada
- **Nome completo**: Validação de caracteres e tamanho
- **Email**: Formato e validação HTML5
- **Telefone**: Formato e máscara
- **CPF**: Validação de dígitos verificadores
- **Data de nascimento**: Formato e validação
- **Endereço**: Campos obrigatórios
- **Observações**: Limite de caracteres

### Validação de API
- **Perfil do usuário**: Estrutura e tipos
- **Lista de consultas**: Array e objetos
- **Dados de médicos**: Relacionamentos
- **Produtos da farmácia**: Validação de preços
- **Resultados de triagem**: Dados complexos
- **Mensagens de chat**: Sanitização

### Persistência LocalStorage
- **Token de autenticação**: Segurança
- **Dados do usuário**: Informações pessoais
- **Preferências de interface**: Configurações
- **Cache de consultas**: Performance
- **Dados do carrinho**: E-commerce
- **Configurações de notificação**: Preferências

### Sincronização
- **Perfil do usuário**: Dados pessoais
- **Consultas agendadas**: Agendamentos
- **Dados de triagem**: Questionários
- **Carrinho de compras**: E-commerce
- **Preferências**: Configurações
- **Histórico de atividades**: Logs

## 🔍 Debugging

### Modo Debug

```bash
# Executar em modo debug
npx playwright test --config=playwright.dados.config.ts --debug

# Executar teste específico em debug
npx playwright test DATA-001 --debug
```

### Screenshots e Videos

- Screenshots são capturados automaticamente em caso de falha
- Videos são gravados para testes que falham
- Arquivos são salvos em `test-results/`

### Logs

```bash
# Executar com logs detalhados
DEBUG=pw:api npx playwright test --config=playwright.dados.config.ts

# Executar com logs de rede
DEBUG=pw:network npx playwright test --config=playwright.dados.config.ts
```

## 📈 Métricas de Qualidade

### Cobertura de Testes

- **Validação**: 100% dos campos de entrada testados
- **API**: 100% dos endpoints de dados validados
- **Persistência**: 100% das operações de localStorage testadas
- **Sincronização**: 100% dos cenários de sync cobertos

### Critérios de Aprovação

Cada teste possui critérios específicos de aprovação:

1. **Dados válidos aceitos**
2. **Dados inválidos rejeitados**
3. **Mensagens claras**
4. **Campos obrigatórios validados**
5. **Formato validado**
6. **Tamanho validado**
7. **Caracteres validados**

## 🛠️ Manutenção

### Adicionando Novos Testes

1. Criar arquivo `DATA-XXX-nome-do-teste.test.tsx`
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

3. **Dados não persistem**
   - Verificar se localStorage está habilitado
   - Verificar se dados não excedem limite
   - Verificar se não há limpeza automática

4. **Sincronização falha**
   - Verificar conectividade de rede
   - Verificar se APIs estão funcionando
   - Verificar se dados estão no formato correto

### Suporte

Para problemas ou dúvidas:

1. Verificar logs de erro
2. Consultar documentação do Playwright
3. Verificar issues no repositório
4. Contatar equipe de desenvolvimento

## 📚 Recursos Adicionais

- [Documentação Playwright](https://playwright.dev/)
- [Guia de Testes de Dados](https://playwright.dev/docs/test-types)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Validação de Dados](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)

---

**Última atualização**: Setembro 2024  
**Versão**: 1.0.0  
**Mantenedor**: Equipe de Desenvolvimento Vitalis
