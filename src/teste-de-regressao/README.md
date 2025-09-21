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

### REG-002 - Fluxo Completo de Teleconsulta
**Prioridade:** Crítica | **Status:** ✅ 17/17 testes passando

### REG-003 - Fluxo Completo de Triagem Online
**Prioridade:** Crítica | **Status:** ✅ 11/11 testes passando

**Cenários Testados:**

#### Fluxo Normal de Triagem (2 testes)
- Completa o fluxo completo de triagem com sucesso
- Navega corretamente pelo questionário

#### Validação de Dados (2 testes)
- Valida perguntas obrigatórias
- Valida dados pessoais obrigatórios

#### Tratamento de Erros (4 testes)
- Trata erro ao carregar questionário
- Trata erro ao salvar dados pessoais
- Trata erro na análise da triagem
- Trata erro na geração de PDF

#### Cenários Especiais (2 testes)
- Lida com timeout na análise
- Valida diferentes tipos de pergunta

#### Integração com APIs (1 teste)
- Chama todas as APIs necessárias no fluxo completo

**Funcionalidades Testadas:**
- **Questionário sequencial:** Navegação entre perguntas
- **Validação de respostas:** Verificação de campos obrigatórios
- **Sistema de análise:** Processamento das respostas
- **Geração de PDF:** Criação automática do relatório
- **Download de relatório:** Baixar PDF da triagem
- **Tratamento de erros:** Falhas em cada etapa

#### Fluxo Normal de Teleconsulta (2 testes)
- Completa o fluxo completo de teleconsulta com sucesso
- Navega corretamente pelos controles de mídia

#### Funcionalidade de Chat (2 testes)
- Envia e recebe mensagens no chat
- Exibe status de conexão do chat

#### Tratamento de Erros (5 testes)
- Trata erro ao carregar dados da consulta
- Trata erro ao iniciar consulta sem permissões
- Trata erro ao conectar WebSocket
- Trata erro ao enviar mensagem no chat
- Trata erro ao finalizar consulta

#### Cenários Especiais (4 testes)
- Lida com problemas de rede durante a consulta
- Lida com câmera indisponível
- Lida com microfone indisponível
- Valida controle de gravação

#### Integração com APIs (2 testes)
- Chama todas as APIs necessárias no fluxo completo
- Trata timeout das APIs

#### Validação de Estados (2 testes)
- Gerencia corretamente os estados da interface
- Valida estados de mídia

**Funcionalidades Testadas:**
- **WebRTC:** Conexão de vídeo e áudio
- **WebSocket:** Chat em tempo real
- **Gravação:** Gravação da consulta
- **Controles de Mídia:** Câmera e microfone
- **Estados da Interface:** Gerenciamento de estados
- **Tratamento de Erros:** Cenários de falha

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
npm test -- src/teste-de-regressao/REG-002-fluxo-teleconsulta.test.tsx
npm test -- src/teste-de-regressao/REG-003-fluxo-triagem.test.tsx
```

## 📊 Resumo de Cobertura

| Teste | Cenários | Status | Prioridade |
|-------|----------|--------|------------|
| REG-001 | 15 | ✅ Passando | Crítica |
| REG-002 | 17 | ✅ Passando | Crítica |
| REG-003 | 11 | ✅ Passando | Crítica |
| **Total** | **43** | **✅ 100%** | - |

## 🔄 Fluxos Testados

### Fluxo de Agendamento:
1. **Selecionar Data** - Escolher data disponível
2. **Escolher Médico** - Selecionar especialista
3. **Selecionar Horário** - Escolher horário disponível
4. **Dados da Consulta** - Preencher motivo, observações e urgência
5. **Confirmação** - Confirmar agendamento e receber confirmação

### Fluxo de Teleconsulta:
1. **Carregar Consulta** - Verificar consulta agendada
2. **Iniciar Videochamada** - Estabelecer conexão WebRTC
3. **Controles de Mídia** - Gerenciar câmera e microfone
4. **Chat em Tempo Real** - Enviar e receber mensagens
5. **Gravação** - Gravar consulta (se aplicável)
6. **Finalização** - Finalizar consulta e desconectar

### Fluxo de Triagem Online:
1. **Carregar Questionário** - Exibir perguntas de triagem
2. **Responder Perguntas** - Navegar pelo questionário sequencial
3. **Preencher Dados Pessoais** - Inserir informações do paciente
4. **Análise** - Processar respostas e calcular risco
5. **Exibir Resultados** - Mostrar nível de risco e recomendações
6. **Gerar PDF** - Criar relatório da triagem
7. **Download** - Baixar relatório em PDF

### Componentes Testados:
- Página de agendamento
- Calendário de datas
- Lista de médicos
- Seleção de horários
- Formulário de dados
- Confirmação de agendamento
- Dashboard do paciente
- Interface de teleconsulta
- Player de vídeo
- Controles de câmera/microfone
- Chat em tempo real
- Botões de ação
- Modal de finalização
- Interface de triagem
- Questionário sequencial
- Formulário de dados pessoais
- Sistema de análise
- Exibição de resultados
- Geração de PDF
- Download de relatório

### Integrações Testadas:
- API de agendamento
- API de médicos
- API de horários
- API de confirmação
- API de dashboard
- WebRTC para vídeo
- WebSocket para chat
- API de consultas
- API de gravação
- API de finalização
- Serviço de notificações
- API de triagem
- Sistema de análise
- PDF service
- API de resultados

## 🎯 Critérios de Aprovação

### REG-001 - Agendamento:
✅ **Fluxo completo funcional** - Todos os passos funcionam corretamente
✅ **Validação adequada** - Dados são validados antes do envio
✅ **Confirmação correta** - Agendamento é confirmado adequadamente
✅ **Dashboard atualizado** - Agendamento aparece no dashboard
✅ **Notificação enviada** - Confirmação é enviada ao paciente

### REG-002 - Teleconsulta:
✅ **Videochamada funcional** - Conexão WebRTC estabelecida
✅ **Áudio funcionando** - Microfone ativo e funcional
✅ **Chat funcional** - Mensagens enviadas e recebidas
✅ **Finalização correta** - Consulta finalizada adequadamente
✅ **Gravação funcional** - Consulta gravada (se aplicável)

### REG-003 - Triagem Online:
✅ **Questionário funcional** - Navegação entre perguntas
✅ **Validação adequada** - Campos obrigatórios validados
✅ **Análise funcional** - Processamento das respostas
✅ **Resultados exibidos** - Nível de risco e recomendações
✅ **PDF gerado** - Relatório criado automaticamente

## 🚨 Cenários de Teste Cobertos

### Cenários Normais:
- Agendamento com dados válidos
- Navegação entre passos
- Validação de formulários
- Confirmação de agendamento
- Teleconsulta normal
- Chat em tempo real
- Triagem com respostas válidas
- Navegação pelo questionário
- Geração de PDF

### Cenários de Erro:
- Médicos indisponíveis
- Horários indisponíveis
- Erros de rede
- Timeout de APIs
- Dados inválidos
- Problemas de câmera/microfone
- Falhas de WebSocket
- Erros de gravação
- Erro ao carregar questionário
- Erro ao salvar dados pessoais
- Erro na análise da triagem
- Erro na geração de PDF

### Cenários Especiais:
- Caracteres especiais nos dados
- Dados com acentos e símbolos
- Validação de campos obrigatórios
- Tratamento de exceções
- Teleconsulta com problemas de rede
- Teleconsulta com câmera indisponível
- Teleconsulta com microfone indisponível
- Teleconsulta com chat indisponível
- Timeout na análise da triagem
- Diferentes tipos de pergunta (múltipla escolha, escala, texto)
- Perguntas obrigatórias vs opcionais

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
