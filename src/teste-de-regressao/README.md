# Testes de Regressão - Vitalis Web Paciente

Este diretório contém os testes de regressão implementados para garantir que as funcionalidades principais do sistema continuem funcionando corretamente após mudanças no código.

## 📋 Testes Implementados

### REG-001 - Fluxo Completo de Agendamento
**Prioridade:** Crítica | **Status:** ✅ 15/15 testes passando

**Cenários Testados:**

#### Fluxo Normal de Agendamento (2 testes)
- Completa o fluxo completo de agendamento com sucesso
- Navega corretamente entre os passos do agendamento

#### Validação de Dados (2 testes)
- Valida dados obrigatórios antes de confirmar agendamento
- Valida formato de dados do formulário

#### Tratamento de Erros (4 testes)
- Trata erro ao carregar médicos disponíveis
- Trata erro ao carregar horários disponíveis
- Trata erro ao criar agendamento
- Trata erro de rede ao criar agendamento

#### Dashboard e Verificação (2 testes)
- Exibe agendamento no dashboard após confirmação
- Envia notificação de confirmação

#### Cenários Especiais (3 testes)
- Lida com médico indisponível
- Lida com horário indisponível
- Valida dados com caracteres especiais

#### Integração com APIs (2 testes)
- Chama todas as APIs necessárias no fluxo completo
- Trata timeout das APIs

## 🛠️ Tecnologias Utilizadas

- **Vitest** - Framework de testes
- **React Testing Library** - Testes de componentes React
- **TypeScript** - Tipagem estática
- **JSDOM** - Ambiente de teste do DOM
- **MemoryRouter** - Roteamento isolado para testes

## 🚀 Como Executar os Testes

```bash
# Todos os testes de regressão
npm test -- src/teste-de-regressao/

# Teste específico
npm test -- src/teste-de-regressao/REG-001-fluxo-agendamento.test.tsx
```

## 📊 Resumo de Cobertura

| Teste | Cenários | Status | Prioridade |
|-------|----------|--------|------------|
| REG-001 | 15 | ✅ Passando | Crítica |
| **Total** | **15** | **✅ 100%** | - |

## 🔄 Fluxo de Agendamento Testado

### Passos do Fluxo:
1. **Selecionar Data** - Escolher data disponível
2. **Escolher Médico** - Selecionar especialista
3. **Selecionar Horário** - Escolher horário disponível
4. **Dados da Consulta** - Preencher motivo, observações e urgência
5. **Confirmação** - Confirmar agendamento e receber confirmação

### Componentes Testados:
- Página de agendamento
- Calendário de datas
- Lista de médicos
- Seleção de horários
- Formulário de dados
- Confirmação de agendamento
- Dashboard do paciente

### Integrações Testadas:
- API de agendamento
- API de médicos
- API de horários
- API de confirmação
- API de dashboard
- Serviço de notificações

## 🎯 Critérios de Aprovação

✅ **Fluxo completo funcional** - Todos os passos funcionam corretamente
✅ **Validação adequada** - Dados são validados antes do envio
✅ **Confirmação correta** - Agendamento é confirmado adequadamente
✅ **Dashboard atualizado** - Agendamento aparece no dashboard
✅ **Notificação enviada** - Confirmação é enviada ao paciente

## 🚨 Cenários de Teste Cobertos

### Cenários Normais:
- Agendamento com dados válidos
- Navegação entre passos
- Validação de formulários
- Confirmação de agendamento

### Cenários de Erro:
- Médicos indisponíveis
- Horários indisponíveis
- Erros de rede
- Timeout de APIs
- Dados inválidos

### Cenários Especiais:
- Caracteres especiais nos dados
- Dados com acentos e símbolos
- Validação de campos obrigatórios
- Tratamento de exceções

## 📝 Convenções

- **Nomenclatura:** REG-XXX seguido de descrição clara
- **Prioridades:** Crítica, Alta, Média, Baixa
- **Assertions:** Uso de `expect()` para validações
- **Mocks:** Uso de `vi.mock()` para dependências externas
- **Cleanup:** `afterEach()` para limpeza de mocks
- **Async/Await:** Uso de `waitFor()` para operações assíncronas

## 🔍 Estrutura dos Testes

### Organização por Categorias:
- **Fluxo Normal** - Testes do caminho feliz
- **Validação** - Testes de validação de dados
- **Tratamento de Erros** - Testes de cenários de erro
- **Dashboard** - Testes de verificação pós-agendamento
- **Cenários Especiais** - Testes de casos especiais
- **Integração** - Testes de integração com APIs

### Padrões de Teste:
- **Arrange** - Configuração inicial e mocks
- **Act** - Execução da ação sendo testada
- **Assert** - Verificação dos resultados esperados

---

**Última Atualização:** Dezembro 2024  
**Versão:** 1.0.0
