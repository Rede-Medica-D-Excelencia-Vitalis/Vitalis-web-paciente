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

## 🎯 Critérios de Aprovação

### Core Web Vitals
- ✅ **FCP < 1.5s** - Primeiro conteúdo visível
- ✅ **LCP < 2.5s** - Maior elemento de conteúdo
- ✅ **TTI < 3.0s** - Tempo até interatividade
- ✅ **CLS < 0.1** - Estabilidade visual
- ✅ **FID < 100ms** - Responsividade da interface

### Métricas de Carregamento
- ✅ **TTFB < 200ms** - Tempo até primeiro byte
- ✅ **Load Time < 3.0s** - Tempo total de carregamento
- ✅ **Resources < 50** - Número de recursos
- ✅ **Size < 5MB** - Tamanho total dos recursos

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

# Teste específico
npm test -- src/teste-performance/PERF-001-carregamento-inicial.test.tsx
```

## 📊 Métricas Monitoradas

### Core Web Vitals
- **FCP (First Contentful Paint):** Tempo até o primeiro conteúdo ser renderizado
- **LCP (Largest Contentful Paint):** Tempo até o maior elemento de conteúdo ser renderizado
- **TTI (Time to Interactive):** Tempo até a página estar totalmente interativa
- **CLS (Cumulative Layout Shift):** Medida de estabilidade visual
- **FID (First Input Delay):** Tempo de resposta à primeira interação do usuário

### Métricas de Carregamento
- **TTFB (Time to First Byte):** Tempo até o primeiro byte do servidor
- **Load Time:** Tempo total de carregamento da página
- **Resource Count:** Número total de recursos carregados
- **Resource Size:** Tamanho total dos recursos em bytes

## 🔧 Funcionalidades Testadas

- **Coleta de métricas de performance** - Uso da Performance API
- **Monitoramento em tempo real** - PerformanceObserver
- **Validação de limites** - Verificação de critérios de performance
- **Detecção de degradação** - Identificação de performance ruim
- **Exibição de métricas** - Interface para monitoramento

## 📈 Cenários de Teste

### Cenários Normais
- Carregamento com performance adequada
- Métricas dentro dos limites estabelecidos
- Monitoramento funcionando corretamente

### Cenários de Performance Degradada
- FCP acima de 1.5s
- LCP acima de 2.5s
- CLS acima de 0.1
- TTI acima de 3.0s
- FID acima de 100ms

## 🎨 Interface de Monitoramento

O teste inclui um componente de monitoramento que exibe:
- Métricas de Core Web Vitals
- Métricas de carregamento
- Status de cada métrica (dentro/fora do limite)
- Resumo de performance

## 📝 Convenções

- **Nomenclatura:** PERF-XXX seguido de descrição clara
- **Prioridades:** Crítica, Alta, Média, Baixa
- **Limites:** Baseados em Core Web Vitals e melhores práticas
- **Mocks:** Simulação realista de métricas de performance
- **Validação:** Verificação automática de todos os critérios

## 🔍 Estrutura dos Testes

### Organização por Categorias:
- **Core Web Vitals** - Métricas essenciais do Google
- **Métricas de Carregamento** - Tempos e recursos
- **Validação Completa** - Verificação geral
- **Monitor de Performance** - Interface de monitoramento
- **Cenários de Degradação** - Detecção de problemas

### Padrões de Teste:
- **Arrange** - Configuração de mocks e métricas
- **Act** - Execução do carregamento da página
- **Assert** - Verificação das métricas coletadas

---

**Última Atualização:** Dezembro 2024  
**Versão:** 1.0.0
