# Testes de Segurança - Vitalis Web Paciente

Este diretório contém os testes funcionais de segurança implementados para o sistema Vitalis Web Paciente.

## 📋 Testes Implementados

### SEC-003 - Logout Seguro do Sistema
**Prioridade:** Crítica | **Status:** ✅ 13/13 testes passando

**Cenários Testados:**
- Logout completo e limpeza de token de autenticação
- Limpeza de dados do localStorage e sessionStorage
- Notificação ao backend sobre logout
- Reset do estado da aplicação após logout
- Bloqueio de acesso a páginas protegidas após logout
- Limpeza de cache e preferências do usuário
- Limpeza completa de cookies durante logout
- Logout automático após expiração de token

### SEC-004 - Sanitização de Inputs
**Prioridade:** Crítica | **Status:** ✅ 15/15 testes passando

**Cenários Testados:**
- Sanitização de scripts maliciosos em campos de texto
- Prevenção de SQL injection em campos de busca
- Bloqueio de XSS via atributos onerror, onclick e javascript:
- Sanitização automática de dados maliciosos
- Preservação de dados legítimos após sanitização
- Validação de mensagens maliciosas no chat
- Teste abrangente de 12 payloads maliciosos diferentes

**Payloads Testados:**
- `<script>alert('XSS')</script>`
- `'; DROP TABLE users; --`
- `<img src=x onerror=alert('XSS')>`
- `javascript:alert('XSS')`
- E outros 8 payloads maliciosos

### SEC-005 - Validação de Upload de Arquivos
**Prioridade:** Alta | **Status:** ✅ 27/27 testes passando

**Cenários Testados:**
- Aceita arquivos válidos: PDF, JPG, PNG, DOC, DOCX
- Bloqueia arquivos perigosos: EXE, BAT, CMD, VBS, SCR
- Validação de tamanho de arquivo (limite configurável)
- Validação de MIME type
- Verificação de extensão vs MIME type
- Detecção de arquivos com extensão falsa
- Validação de conteúdo malicioso em arquivos
- Casos extremos: nomes longos, arquivos vazios, caracteres especiais

**Validações Implementadas:**
- Verificação de MIME type
- Validação de extensão
- Limite de tamanho (configurável)
- Detecção de extensão falsa
- Scan de conteúdo malicioso

## 🛠️ Tecnologias Utilizadas

- **Vitest** - Framework de testes
- **React Testing Library** - Testes de componentes React
- **TypeScript** - Tipagem estática
- **JSDOM** - Ambiente de teste do DOM

## 🚀 Como Executar os Testes

```bash
# Todos os testes de segurança
npm test -- src/testing/tests_funcionais/seguranca/

# Teste específico
npm test -- src/testing/tests_funcionais/seguranca/SEC-003-secure-logout.test.tsx
npm test -- src/testing/tests_funcionais/seguranca/SEC-004-input-sanitization.test.tsx
npm test -- src/testing/tests_funcionais/seguranca/SEC-005-file-upload-validation.test.tsx
```

## 📊 Resumo de Cobertura

| Teste | Cenários | Status | Prioridade |
|-------|----------|--------|------------|
| SEC-003 | 13 | ✅ Passando | Crítica |
| SEC-004 | 15 | ✅ Passando | Crítica |
| SEC-005 | 27 | ✅ Passando | Alta |
| **Total** | **55** | **✅ 100%** | - |

## 🔒 Aspectos de Segurança Cobertos

- ✅ Autenticação e logout seguro
- ✅ Prevenção de XSS (Cross-Site Scripting)
- ✅ Prevenção de SQL Injection
- ✅ Validação de upload de arquivos
- ✅ Sanitização de inputs
- ✅ Bloqueio de arquivos maliciosos
- ✅ Detecção de extensão falsa
- ✅ Validação de MIME types

## 📝 Convenções

- **Nomenclatura:** SEC-XXX seguido de descrição clara
- **Prioridades:** Crítica, Alta, Média, Baixa
- **Assertions:** Uso de `expect()` para validações
- **Mocks:** Uso de `vi.mock()` para dependências externas
- **Cleanup:** `afterEach()` para limpeza de mocks

---

**Última Atualização:** Dezembro 2024  
**Versão:** 1.0.0