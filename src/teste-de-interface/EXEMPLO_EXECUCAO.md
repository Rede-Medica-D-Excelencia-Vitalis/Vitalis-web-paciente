# 🚀 Exemplo de Execução dos Testes de Interface

## 📋 Pré-requisitos

1. **Node.js** versão 18 ou superior
2. **npm** ou **yarn** instalado
3. **Aplicação Vitalis** rodando em `http://localhost:5173`

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Instalar navegadores do Playwright
npm run test:playwright:install
```

## 🎯 Execução dos Testes

### 1. Executar Todos os Testes
```bash
# Executar todos os 11 testes de interface
npm run test:playwright
```

**Resultado esperado:**
```
Running 11 tests using 5 workers

✓ UI-001 - Layout Desktop (1920x1080) (2.1s)
✓ UI-002 - Layout Tablet (768x1024) (1.8s)
✓ UI-003 - Layout Mobile Portrait (375x667) (1.9s)
✓ UI-004 - Layout Mobile Landscape (667x375) (1.7s)
✓ UI-005 - Layout Tablet Landscape (1024x768) (1.8s)
✓ UI-006 - Breakpoints Intermediários (3.2s)
✓ UI-007 - Menu de Navegação Principal (2.1s)
✓ UI-008 - Breadcrumbs e Navegação Hierárquica (1.9s)
✓ UI-009 - Botões de Navegação e Ações (2.0s)
✓ UI-010 - Consistência de Cores e Tipografia (1.8s)
✓ UI-011 - Acessibilidade e Usabilidade (2.3s)

11 passed (22.8s)
```

### 2. Executar com Interface Gráfica
```bash
# Abrir interface gráfica do Playwright
npm run test:playwright:ui
```

**Funcionalidades:**
- ✅ Visualizar testes em tempo real
- ✅ Debug interativo
- ✅ Screenshots e vídeos
- ✅ Relatórios detalhados

### 3. Executar em Modo Headed
```bash
# Executar com navegador visível
npm run test:playwright:headed
```

**Útil para:**
- ✅ Debug visual
- ✅ Verificar comportamento
- ✅ Desenvolvimento

### 4. Executar em Modo Debug
```bash
# Executar com debug interativo
npm run test:playwright:debug
```

**Funcionalidades:**
- ✅ Pausar em breakpoints
- ✅ Inspecionar elementos
- ✅ Executar passo a passo

## 📊 Execução por Categoria

### Testes de Responsividade
```bash
# Executar apenas testes de responsividade
npx playwright test UI-001 UI-002 UI-003 UI-004 UI-005 UI-006
```

**Testes incluídos:**
- UI-001: Layout Desktop (1920x1080)
- UI-002: Layout Tablet (768x1024)
- UI-003: Layout Mobile Portrait (375x667)
- UI-004: Layout Mobile Landscape (667x375)
- UI-005: Layout Tablet Landscape (1024x768)
- UI-006: Breakpoints Intermediários

### Testes de Navegação
```bash
# Executar apenas testes de navegação
npx playwright test UI-007 UI-008 UI-009
```

**Testes incluídos:**
- UI-007: Menu de Navegação Principal
- UI-008: Breadcrumbs e Navegação Hierárquica
- UI-009: Botões de Navegação e Ações

### Testes de Consistência Visual
```bash
# Executar apenas testes de consistência
npx playwright test UI-010 UI-011
```

**Testes incluídos:**
- UI-010: Consistência de Cores e Tipografia
- UI-011: Acessibilidade e Usabilidade

## 🎯 Execução por Prioridade

### Testes Críticos
```bash
# Executar testes críticos
npx playwright test UI-003 UI-007
```

**Testes incluídos:**
- UI-003: Layout Mobile Portrait (375x667) - Crítico
- UI-007: Menu de Navegação Principal - Crítico

### Testes de Alta Prioridade
```bash
# Executar testes de alta prioridade
npx playwright test UI-001 UI-002 UI-009 UI-011
```

**Testes incluídos:**
- UI-001: Layout Desktop (1920x1080) - Alta
- UI-002: Layout Tablet (768x1024) - Alta
- UI-009: Botões de Navegação e Ações - Alta
- UI-011: Acessibilidade e Usabilidade - Alta

### Testes de Média Prioridade
```bash
# Executar testes de média prioridade
npx playwright test UI-004 UI-005 UI-006 UI-008 UI-010
```

**Testes incluídos:**
- UI-004: Layout Mobile Landscape (667x375) - Média
- UI-005: Layout Tablet Landscape (1024x768) - Média
- UI-006: Breakpoints Intermediários - Média
- UI-008: Breadcrumbs e Navegação Hierárquica - Média
- UI-010: Consistência de Cores e Tipografia - Média

## 🔍 Execução por Dispositivo

### Desktop
```bash
# Executar testes para desktop
npx playwright test UI-001 UI-005 UI-006
```

### Tablet
```bash
# Executar testes para tablet
npx playwright test UI-002 UI-005
```

### Mobile
```bash
# Executar testes para mobile
npx playwright test UI-003 UI-004
```

## 📱 Execução por Navegador

### Chrome
```bash
# Executar apenas no Chrome
npx playwright test --project=chromium
```

### Firefox
```bash
# Executar apenas no Firefox
npx playwright test --project=firefox
```

### Safari
```bash
# Executar apenas no Safari
npx playwright test --project=webkit
```

### Mobile Chrome
```bash
# Executar apenas no Mobile Chrome
npx playwright test --project="Mobile Chrome"
```

### Mobile Safari
```bash
# Executar apenas no Mobile Safari
npx playwright test --project="Mobile Safari"
```

## 📊 Visualizar Relatórios

### Relatório HTML
```bash
# Ver relatório HTML
npm run test:playwright:report
```

**Localização:** `docs/playwright-report/index.html`

**Funcionalidades:**
- ✅ Relatório interativo
- ✅ Screenshots de falhas
- ✅ Vídeos de falhas
- ✅ Traces detalhados
- ✅ Métricas de performance

### Relatório JSON
```bash
# Ver relatório JSON
cat docs/playwright-results.json
```

**Localização:** `docs/playwright-results.json`

### Relatório JUnit
```bash
# Ver relatório JUnit
cat docs/playwright-results.xml
```

**Localização:** `docs/playwright-results.xml`

## 🐛 Debug de Problemas

### Teste Específico
```bash
# Executar teste específico
npx playwright test UI-001
```

### Teste com Debug
```bash
# Executar teste específico com debug
npx playwright test UI-001 --debug
```

### Teste com Logs Detalhados
```bash
# Executar com logs detalhados
DEBUG=pw:api npx playwright test UI-001
```

### Teste com Screenshots
```bash
# Executar com screenshots em todas as etapas
npx playwright test UI-001 --screenshot=on
```

### Teste com Vídeo
```bash
# Executar com vídeo
npx playwright test UI-001 --video=on
```

## 📈 Exemplo de Saída Detalhada

### Execução Bem-sucedida
```bash
$ npm run test:playwright

> project@0.0.0 test:playwright
> playwright test

Running 11 tests using 5 workers

✓ UI-001 - Layout Desktop (1920x1080) (2.1s)
  ✓ deve verificar viewport desktop 1920x1080 (245ms)
  ✓ deve verificar layout responsivo para desktop (189ms)
  ✓ deve verificar header com logo e menu (156ms)
  ✓ deve verificar sidebar de navegação visível (134ms)
  ✓ deve verificar itens de navegação na sidebar (167ms)
  ✓ deve verificar cards de estatísticas em 5 colunas (145ms)
  ✓ deve verificar distribuição adequada dos elementos (123ms)
  ✓ deve verificar lista de consultas bem estruturada (134ms)
  ✓ deve verificar formulário de agendamento com layout adequado (178ms)
  ✓ deve verificar funcionalidade dos formulários (156ms)
  ✓ deve verificar botões e controles acessíveis (167ms)
  ✓ deve verificar calendário de agendamento (145ms)
  ✓ deve verificar interação com calendário (134ms)
  ✓ deve verificar interface de videochamada (156ms)
  ✓ deve verificar controles de videochamada (123ms)
  ✓ deve verificar navegação fluida entre seções (167ms)
  ✓ deve verificar acessibilidade da navegação (145ms)
  ✓ deve verificar texto legível sem zoom (134ms)
  ✓ deve verificar contraste e visibilidade dos elementos (156ms)
  ✓ deve verificar performance adequada para desktop (178ms)
  ✓ deve verificar responsividade em diferentes tamanhos (189ms)
  ✓ deve verificar todos os critérios de aprovação (167ms)
  ✓ deve verificar monitorar métricas de interface desktop (145ms)
  ✓ deve verificar cenários de interface degradada (134ms)

✓ UI-002 - Layout Tablet (768x1024) (1.8s)
  ✓ deve verificar viewport tablet 768x1024 (234ms)
  ✓ deve verificar layout adaptado para tablet (167ms)
  ✓ deve verificar sidebar colapsível ou em overlay (145ms)
  ✓ deve verificar menu hambúrguer se aplicável (123ms)
  ✓ deve verificar cards reorganizados em 2-3 colunas (134ms)
  ✓ deve verificar botões com tamanho adequado para touch (156ms)
  ✓ deve verificar formulários responsivos (145ms)
  ✓ deve verificar navegação touch-friendly (167ms)
  ✓ deve verificar lista de consultas scrollável (134ms)
  ✓ deve verificar calendário adaptado (123ms)
  ✓ deve verificar botões de ação acessíveis (156ms)
  ✓ deve verificar formulários de login/cadastro (145ms)
  ✓ deve verificar performance mantida (167ms)
  ✓ deve verificar todos os critérios de aprovação (134ms)
  ✓ deve verificar monitorar métricas de interface tablet (123ms)
  ✓ deve verificar cenários de interface degradada (156ms)

[... outros testes ...]

11 passed (22.8s)

To open last HTML report run:
  npx playwright show-report
```

### Execução com Falhas
```bash
$ npm run test:playwright

> project@0.0.0 test:playwright
> playwright test

Running 11 tests using 5 workers

✓ UI-001 - Layout Desktop (1920x1080) (2.1s)
✗ UI-002 - Layout Tablet (768x1024) (1.8s)
  ✗ deve verificar viewport tablet 768x1024 (234ms)
    Error: expect(received).toBe(expected)
    
    Expected: 768
    Received: 1024
    
    at UI-002 - Layout Tablet (768x1024) (UI-002-layout-tablet.test.tsx:15:5)

[... outros testes ...]

10 passed, 1 failed (22.8s)

To open last HTML report run:
  npx playwright show-report
```

## 🎯 Dicas de Execução

### 1. Execução Rápida
```bash
# Executar apenas testes críticos
npx playwright test UI-003 UI-007
```

### 2. Execução Completa
```bash
# Executar todos os testes com relatório
npm run test:playwright && npm run test:playwright:report
```

### 3. Execução em CI/CD
```bash
# Executar em ambiente de CI
npx playwright test --reporter=github
```

### 4. Execução com Retry
```bash
# Executar com retry automático
npx playwright test --retries=3
```

### 5. Execução Paralela
```bash
# Executar com mais workers
npx playwright test --workers=10
```

## 📋 Checklist de Execução

### Antes de Executar
- [ ] Aplicação rodando em `http://localhost:5173`
- [ ] Dependências instaladas (`npm install`)
- [ ] Navegadores instalados (`npm run test:playwright:install`)
- [ ] Ambiente configurado

### Durante a Execução
- [ ] Monitorar logs de erro
- [ ] Verificar screenshots de falhas
- [ ] Analisar métricas de performance
- [ ] Validar acessibilidade

### Após a Execução
- [ ] Verificar relatório HTML
- [ ] Analisar falhas encontradas
- [ ] Corrigir problemas identificados
- [ ] Documentar melhorias necessárias

---

**Desenvolvido com ❤️ para a plataforma Vitalis**
