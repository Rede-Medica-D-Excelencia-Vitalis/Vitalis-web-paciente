# Testes de Performance - Vitalis Web Paciente

Este diretório contém os testes de performance implementados para garantir que a aplicação atenda aos critérios de performance e Core Web Vitals.

## 📋 Testes Implementados

### PERF-001 - Carregamento Inicial da Página
**Prioridade:** Crítica | **Status:** ✅ 14/14 testes passando

**Objetivo:** Verificar tempo de carregamento da página inicial

#### Métricas Core Web Vitals Testadas (5 testes)
- ✅ **First Contentful Paint (FCP)** < 1.5s
- ✅ **Largest Contentful Paint (LCP)** < 2.5s  
- ✅ **Time to Interactive (TTI)** < 3.0s
- ✅ **Cumulative Layout Shift (CLS)** < 0.1
- ✅ **First Input Delay (FID)** < 100ms

#### Métricas de Carregamento Testadas (4 testes)
- ✅ **Time to First Byte (TTFB)** < 200ms
- ✅ **Tempo total de carregamento** < 3.0s
- ✅ **Número de recursos** < 50
- ✅ **Tamanho total de recursos** < 5MB

#### Validação Completa (1 teste)
- ✅ **Validação de todas as métricas** - Verifica se todas as métricas estão dentro dos limites

#### Monitor de Performance (1 teste)
- ✅ **Exibição de métricas** - Verifica se o monitor exibe as métricas corretamente

#### Cenários de Performance Degradada (3 testes)
- ✅ **Detecção de FCP acima do limite** - Identifica quando FCP > 1.5s
- ✅ **Detecção de LCP acima do limite** - Identifica quando LCP > 2.5s
- ✅ **Detecção de CLS acima do limite** - Identifica quando CLS > 0.1

### PERF-002 - Carregamento do Dashboard
**Prioridade:** Crítica | **Status:** ✅ 16/16 testes passando

**Objetivo:** Verificar tempo de carregamento do dashboard autenticado

#### Métricas de Carregamento do Dashboard Testadas (5 testes)
- ✅ **Dashboard carregado** < 2.0s
- ✅ **Dados de consultas** < 1.0s
- ✅ **Cálculos de estatísticas** < 0.5s
- ✅ **Interface interativa** < 2.5s
- ✅ **Memória utilizada** < 50MB

#### Performance de APIs Testadas (3 testes)
- ✅ **Número adequado de requisições** < 15
- ✅ **Número adequado de componentes** < 20
- ✅ **Número adequado de itens em listas** < 50

#### Funcionalidade do Dashboard Testadas (3 testes)
- ✅ **Exibição de estatísticas** - Verifica se estatísticas são exibidas corretamente
- ✅ **Lista de consultas** - Verifica se consultas são renderizadas
- ✅ **Botões de ação funcionais** - Verifica se botões estão habilitados

#### Validação Completa (1 teste)
- ✅ **Validação de todas as métricas** - Verifica se todas as métricas estão dentro dos limites

#### Monitor de Performance do Dashboard (1 teste)
- ✅ **Exibição de métricas** - Verifica se o monitor exibe as métricas do dashboard

#### Cenários de Performance Degradada (3 testes)
- ✅ **Detecção de carregamento acima do limite** - Identifica quando dashboard > 2.0s
- ✅ **Detecção de dados acima do limite** - Identifica quando dados > 1.0s
- ✅ **Detecção de memória acima do limite** - Identifica quando memória > 50MB

### PERF-003 - Carregamento Otimizado de Imagens
**Prioridade:** Alta | **Status:** ✅ 20/20 testes passando

**Objetivo:** Verificar carregamento otimizado de imagens

#### Otimização de Formato Testadas (3 testes)
- ✅ **WebP quando suportado** - Usa formato WebP para melhor compressão
- ✅ **Fallback JPEG/PNG** - Fallback para navegadores antigos
- ✅ **Detecção de suporte** - Detecta quando WebP não é suportado

#### Lazy Loading Testadas (3 testes)
- ✅ **Implementação correta** - Lazy loading implementado adequadamente
- ✅ **Carregamento sob demanda** - Imagens carregadas quando necessárias
- ✅ **Carregamento eager** - Imagens críticas carregadas imediatamente

#### Compressão e Tamanho Testadas (3 testes)
- ✅ **Compressão adequada** - 60-80% de redução no tamanho
- ✅ **Tamanho otimizado** - Imagens < 100KB
- ✅ **Tamanho médio adequado** - Tamanho médio < 200KB

#### Carregamento Progressivo Testadas (3 testes)
- ✅ **Implementação progressiva** - Carregamento progressivo ativo
- ✅ **Placeholder durante carregamento** - Placeholder exibido
- ✅ **Transição suave** - Transição entre placeholder e imagem

#### Performance de Carregamento Testadas (3 testes)
- ✅ **Tempo adequado** - Carregamento < 1.0s
- ✅ **Número adequado** - Carregamento de múltiplas imagens
- ✅ **IntersectionObserver** - Uso correto para lazy loading

#### Validação Completa (1 teste)
- ✅ **Validação de todas as métricas** - Verifica se todas as métricas estão dentro dos limites

#### Monitor de Performance de Imagens (1 teste)
- ✅ **Exibição de métricas** - Verifica se o monitor exibe as métricas de imagens

#### Cenários de Performance Degradada (3 testes)
- ✅ **Detecção de compressão inadequada** - Identifica compressão < 60%
- ✅ **Detecção de tamanho excessivo** - Identifica imagens > 100KB
- ✅ **Detecção de carregamento lento** - Identifica carregamento > 1.0s

## 🎯 Critérios de Aprovação

### Core Web Vitals (PERF-001)
- ✅ **FCP < 1.5s** - Primeiro conteúdo visível
- ✅ **LCP < 2.5s** - Maior elemento de conteúdo
- ✅ **TTI < 3.0s** - Tempo até interatividade
- ✅ **CLS < 0.1** - Estabilidade visual
- ✅ **FID < 100ms** - Responsividade da interface

### Métricas de Carregamento (PERF-001)
- ✅ **TTFB < 200ms** - Tempo até primeiro byte
- ✅ **Load Time < 3.0s** - Tempo total de carregamento
- ✅ **Resources < 50** - Número de recursos
- ✅ **Size < 5MB** - Tamanho total dos recursos

### Performance do Dashboard (PERF-002)
- ✅ **Dashboard < 2.0s** - Carregamento completo do dashboard
- ✅ **Dados < 1.0s** - Carregamento de dados de consultas
- ✅ **Cálculos < 0.5s** - Processamento de estatísticas
- ✅ **Interface < 2.5s** - Tempo até interface interativa
- ✅ **Memória < 50MB** - Uso de memória do dashboard
- ✅ **APIs < 15** - Número de requisições de API
- ✅ **Componentes < 20** - Número de componentes renderizados
- ✅ **Listas < 50** - Número de itens em listas

### Otimização de Imagens (PERF-003)
- ✅ **WebP suportado** - Formato WebP quando disponível
- ✅ **Fallback disponível** - JPEG/PNG para navegadores antigos
- ✅ **Lazy loading** - Carregamento sob demanda
- ✅ **Compressão 60-80%** - Redução significativa no tamanho
- ✅ **Tamanho < 100KB** - Imagens otimizadas
- ✅ **Tamanho médio < 200KB** - Tamanho médio adequado
- ✅ **Carregamento < 1.0s** - Tempo de carregamento rápido
- ✅ **Progressivo** - Carregamento progressivo ativo

## 🛠️ Tecnologias Utilizadas

- **Vitest** - Framework de testes
- **React Testing Library** - Testes de componentes React
- **Performance API** - Coleta de métricas de performance
- **PerformanceObserver** - Observação de métricas em tempo real
- **TypeScript** - Tipagem estática

## 🚀 Como Executar os Testes

```bash
# Todos os testes de performance
npm test -- src/teste-performance/

# Teste específico - Carregamento inicial
npm test -- src/teste-performance/PERF-001-carregamento-inicial.test.tsx

# Teste específico - Dashboard
npm test -- src/teste-performance/PERF-002-carregamento-dashboard.test.tsx

# Teste específico - Imagens
npm test -- src/teste-performance/PERF-003-carregamento-imagens.test.tsx
```

## 📊 Métricas Monitoradas

### Core Web Vitals (PERF-001)
- **FCP (First Contentful Paint):** Tempo até o primeiro conteúdo ser renderizado
- **LCP (Largest Contentful Paint):** Tempo até o maior elemento de conteúdo ser renderizado
- **TTI (Time to Interactive):** Tempo até a página estar totalmente interativa
- **CLS (Cumulative Layout Shift):** Medida de estabilidade visual
- **FID (First Input Delay):** Tempo de resposta à primeira interação do usuário

### Métricas de Carregamento (PERF-001)
- **TTFB (Time to First Byte):** Tempo até o primeiro byte do servidor
- **Load Time:** Tempo total de carregamento da página
- **Resource Count:** Número total de recursos carregados
- **Resource Size:** Tamanho total dos recursos em bytes

### Métricas do Dashboard (PERF-002)
- **Dashboard Load Time:** Tempo de carregamento completo do dashboard
- **Data Load Time:** Tempo de carregamento de dados de consultas
- **Calculations Time:** Tempo de processamento de estatísticas
- **Interface Time:** Tempo até interface estar totalmente interativa
- **Memory Usage:** Uso de memória do dashboard em bytes
- **API Requests:** Número de requisições de API realizadas
- **Component Count:** Número de componentes React renderizados
- **List Items:** Número de itens em listas dinâmicas

### Métricas de Imagens (PERF-003)
- **WebP Support:** Suporte ao formato WebP no navegador
- **Lazy Loading:** Status do lazy loading de imagens
- **Compression Ratio:** Taxa de compressão das imagens (60-80%)
- **Progressive Loading:** Status do carregamento progressivo
- **Fallback Available:** Disponibilidade de fallback JPEG/PNG
- **Average Image Size:** Tamanho médio das imagens em bytes
- **Optimized Image Size:** Tamanho otimizado das imagens em bytes
- **Total Images:** Número total de imagens na página
- **Loaded Images:** Número de imagens carregadas
- **Loading Time:** Tempo de carregamento das imagens
- **Intersection Observer Calls:** Número de chamadas do IntersectionObserver

## 🔧 Funcionalidades Testadas

### Performance Geral
- **Coleta de métricas de performance** - Uso da Performance API
- **Monitoramento em tempo real** - PerformanceObserver
- **Validação de limites** - Verificação de critérios de performance
- **Detecção de degradação** - Identificação de performance ruim
- **Exibição de métricas** - Interface para monitoramento

### Dashboard Específico
- **Carregamento de dashboard** - Tempo de renderização completa
- **Carregamento de dados** - Performance de APIs de consultas
- **Processamento de estatísticas** - Cálculos em tempo real
- **Interface interativa** - Responsividade dos componentes
- **Gerenciamento de memória** - Uso eficiente de recursos
- **Renderização de listas** - Performance com dados dinâmicos
- **Componentes React** - Otimização de renderização

### Otimização de Imagens
- **Formato WebP** - Suporte e detecção de formato otimizado
- **Fallback JPEG/PNG** - Compatibilidade com navegadores antigos
- **Lazy loading** - Carregamento sob demanda com IntersectionObserver
- **Compressão de imagens** - Redução de 60-80% no tamanho
- **Carregamento progressivo** - Placeholder e transições suaves
- **Otimização de tamanho** - Controle de tamanho de imagens
- **Performance de carregamento** - Tempo de carregamento otimizado

## 📈 Cenários de Teste

### Cenários Normais (PERF-001)
- Carregamento com performance adequada
- Métricas dentro dos limites estabelecidos
- Monitoramento funcionando corretamente

### Cenários de Performance Degradada (PERF-001)
- FCP acima de 1.5s
- LCP acima de 2.5s
- CLS acima de 0.1
- TTI acima de 3.0s
- FID acima de 100ms

### Cenários do Dashboard (PERF-002)
- Carregamento normal do dashboard
- Exibição correta de estatísticas
- Renderização de listas de consultas
- Funcionamento de botões de ação
- Monitoramento de métricas específicas

### Cenários de Performance Degradada do Dashboard (PERF-002)
- Carregamento de dashboard acima de 2.0s
- Carregamento de dados acima de 1.0s
- Uso de memória acima de 50MB
- Número excessivo de requisições de API
- Renderização lenta de componentes

### Cenários de Imagens (PERF-003)
- Carregamento normal de imagens otimizadas
- Uso de WebP com fallback adequado
- Lazy loading funcionando corretamente
- Compressão adequada de imagens
- Carregamento progressivo ativo

### Cenários de Performance Degradada de Imagens (PERF-003)
- Compressão inadequada (< 60%)
- Tamanho de imagens excessivo (> 100KB)
- Carregamento lento de imagens (> 1.0s)
- Falta de suporte a WebP
- Lazy loading não funcionando

## 🎨 Interface de Monitoramento

### Monitor Geral (PERF-001)
O teste inclui um componente de monitoramento que exibe:
- Métricas de Core Web Vitals
- Métricas de carregamento
- Status de cada métrica (dentro/fora do limite)
- Resumo de performance

### Monitor do Dashboard (PERF-002)
O teste inclui um componente específico para dashboard que exibe:
- Métricas de carregamento do dashboard
- Tempo de carregamento de dados
- Tempo de cálculos de estatísticas
- Uso de memória
- Número de requisições de API
- Número de componentes renderizados
- Número de itens em listas
- Status de cada métrica (dentro/fora do limite)

### Monitor de Imagens (PERF-003)
O teste inclui um componente específico para imagens que exibe:
- Suporte ao formato WebP
- Status do lazy loading
- Taxa de compressão das imagens
- Status do carregamento progressivo
- Disponibilidade de fallback
- Tamanho das imagens otimizadas
- Número total de imagens
- Número de imagens carregadas
- Tempo de carregamento
- Status de cada métrica (dentro/fora do limite)

## 📝 Convenções

- **Nomenclatura:** PERF-XXX seguido de descrição clara
- **Prioridades:** Crítica, Alta, Média, Baixa
- **Limites:** Baseados em Core Web Vitals e melhores práticas
- **Mocks:** Simulação realista de métricas de performance
- **Validação:** Verificação automática de todos os critérios

## 🔍 Estrutura dos Testes

### Organização por Categorias:

#### PERF-001 - Carregamento Inicial
- **Core Web Vitals** - Métricas essenciais do Google
- **Métricas de Carregamento** - Tempos e recursos
- **Validação Completa** - Verificação geral
- **Monitor de Performance** - Interface de monitoramento
- **Cenários de Degradação** - Detecção de problemas

#### PERF-002 - Dashboard
- **Métricas de Carregamento do Dashboard** - Tempos específicos
- **Performance de APIs** - Requisições e componentes
- **Funcionalidade do Dashboard** - Interface e dados
- **Validação Completa** - Verificação geral
- **Monitor de Performance do Dashboard** - Interface específica
- **Cenários de Degradação** - Detecção de problemas

#### PERF-003 - Imagens
- **Otimização de Formato** - WebP e fallback
- **Lazy Loading** - Carregamento sob demanda
- **Compressão e Tamanho** - Otimização de imagens
- **Carregamento Progressivo** - Placeholder e transições
- **Performance de Carregamento** - Tempos e IntersectionObserver
- **Validação Completa** - Verificação geral
- **Monitor de Performance de Imagens** - Interface específica
- **Cenários de Degradação** - Detecção de problemas

### Padrões de Teste:
- **Arrange** - Configuração de mocks e métricas
- **Act** - Execução do carregamento da página/dashboard
- **Assert** - Verificação das métricas coletadas

---

**Última Atualização:** Dezembro 2024  
**Versão:** 1.0.0
