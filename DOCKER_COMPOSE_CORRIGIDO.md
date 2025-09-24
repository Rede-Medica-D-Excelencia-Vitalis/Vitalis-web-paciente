# 🐳 Docker Compose Corrigido - Testes de Interface

## ✅ Correções Aplicadas

**Data:** 23 de Setembro de 2024  
**Status:** ✅ **CORRIGIDO E VALIDADO**  
**Arquivo:** `docker-compose.testes.yml`

## 🔧 Problemas Identificados e Corrigidos

### ❌ **Problema 1: Versão Obsoleta**
- **Erro:** `the attribute 'version' is obsolete`
- **Correção:** Removida a linha `version: '3.8'`
- **Motivo:** Docker Compose v2 não requer mais especificação de versão

### ❌ **Problema 2: Dependências Simples**
- **Erro:** Dependências usando `depends_on: - service` (formato antigo)
- **Correção:** Atualizado para `depends_on: service: condition: service_healthy`
- **Motivo:** Melhor controle de dependências com health checks

### ❌ **Problema 3: Falta de Health Checks**
- **Erro:** Aplicação podia iniciar antes de estar pronta
- **Correção:** Adicionado health check para `vitalis-app`
- **Configuração:**
  ```yaml
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:5173"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
  ```

### ❌ **Problema 4: Dockerfile Incompleto**
- **Erro:** Falta de `curl` para health checks
- **Correção:** Adicionado `RUN apt-get update && apt-get install -y curl`
- **Melhoria:** Adicionado `npx playwright install --with-deps`

### ❌ **Problema 5: Tempos de Espera Inadequados**
- **Erro:** `sleep 30` muito longo após health check
- **Correção:** Reduzido para `sleep 10` após health check
- **Motivo:** Health check já garante que a aplicação está pronta

## 📋 Arquivo Final Corrigido

### `docker-compose.testes.yml`
```yaml
services:
  vitalis-app:
    build:
      context: .
      dockerfile: Dockerfile.testes
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=test
      - CI=true
    volumes:
      - ./docs:/app/docs
      - ./test-results:/app/test-results
    command: npm run dev
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  testes-interface:
    build:
      context: .
      dockerfile: Dockerfile.testes
    depends_on:
      vitalis-app:
        condition: service_healthy
    environment:
      - CI=true
      - BASE_URL=http://vitalis-app:5173
    volumes:
      - ./docs:/app/docs
      - ./test-results:/app/test-results
    command: |
      sh -c "
        echo 'Aguardando aplicação ficar saudável...' &&
        sleep 10 &&
        echo 'Executando testes de interface...' &&
        npm run test:playwright &&
        echo 'Testes concluídos!'
      "

  testes-criticos:
    build:
      context: .
      dockerfile: Dockerfile.testes
    depends_on:
      vitalis-app:
        condition: service_healthy
    environment:
      - CI=true
      - BASE_URL=http://vitalis-app:5173
    volumes:
      - ./docs:/app/docs
      - ./test-results:/app/test-results
    command: |
      sh -c "
        echo 'Aguardando aplicação ficar saudável...' &&
        sleep 10 &&
        echo 'Executando testes críticos...' &&
        npx playwright test UI-003 UI-007 &&
        echo 'Testes críticos concluídos!'
      "

  relatorio:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./docs/playwright-report:/usr/share/nginx/html
    depends_on:
      testes-interface:
        condition: service_completed_successfully
    command: |
      sh -c "
        echo 'Aguardando relatórios serem gerados...' &&
        sleep 30 &&
        echo 'Iniciando servidor de relatórios...' &&
        nginx -g 'daemon off;'
      "
```

### `Dockerfile.testes` (Atualizado)
```dockerfile
# Dockerfile para execução dos testes de interface
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Instalar curl para health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Instalar navegadores do Playwright
RUN npx playwright install --with-deps

# Expor porta da aplicação
EXPOSE 5173

# Comando padrão (será sobrescrito pelo docker-compose)
CMD ["npm", "run", "dev"]
```

## 🚀 Como Usar

### Pré-requisitos
1. **Docker instalado e rodando**
2. **Docker Compose disponível**
3. **Arquivos do projeto no diretório correto**

### Comandos de Teste

#### 1. Validar Configuração
```bash
# Verificar sintaxe
docker-compose -f docker-compose.testes.yml config

# Testar build (sem executar)
docker-compose -f docker-compose.testes.yml build vitalis-app
```

#### 2. Executar Testes

**Todos os testes:**
```bash
docker-compose -f docker-compose.testes.yml up testes-interface
```

**Apenas testes críticos:**
```bash
docker-compose -f docker-compose.testes.yml up testes-criticos
```

**Com relatórios:**
```bash
docker-compose -f docker-compose.testes.yml up
```

**Em background:**
```bash
docker-compose -f docker-compose.testes.yml up -d
```

#### 3. Gerenciar Serviços

**Ver logs:**
```bash
docker-compose -f docker-compose.testes.yml logs -f
```

**Parar serviços:**
```bash
docker-compose -f docker-compose.testes.yml down
```

**Limpar tudo:**
```bash
docker-compose -f docker-compose.testes.yml down --rmi all --volumes
```

### Script de Teste Automatizado
```bash
# Executar script de validação
./scripts/testar-docker-compose.sh
```

## 📊 Serviços Configurados

| Serviço | Porta | Função | Dependência |
|---------|-------|--------|-------------|
| `vitalis-app` | 5173 | Aplicação principal | - |
| `testes-interface` | - | Todos os testes | `vitalis-app` (healthy) |
| `testes-criticos` | - | Testes críticos | `vitalis-app` (healthy) |
| `relatorio` | 8080 | Servidor de relatórios | `testes-interface` (completed) |

## 🔍 Health Checks

### vitalis-app
- **Teste:** `curl -f http://localhost:5173`
- **Intervalo:** 30 segundos
- **Timeout:** 10 segundos
- **Tentativas:** 3
- **Período inicial:** 40 segundos

### Dependências
- **testes-interface:** Aguarda `vitalis-app` estar saudável
- **testes-criticos:** Aguarda `vitalis-app` estar saudável
- **relatorio:** Aguarda `testes-interface` completar com sucesso

## 📁 Volumes Mapeados

- `./docs` → `/app/docs` (relatórios)
- `./test-results` → `/app/test-results` (resultados)
- `./docs/playwright-report` → `/usr/share/nginx/html` (relatórios web)

## ⚡ Melhorias de Performance

1. **Health Checks:** Evita execução prematura dos testes
2. **Dependências Inteligentes:** Aguarda serviços estarem prontos
3. **Tempos Otimizados:** Reduzido tempo de espera desnecessário
4. **Build Eficiente:** Cache de dependências npm
5. **Limpeza Automática:** Remove imagens temporárias

## 🛠️ Troubleshooting

### Problema: Docker não está rodando
```bash
# Iniciar Docker Desktop ou Docker daemon
# No macOS: Abrir Docker Desktop
# No Linux: sudo systemctl start docker
```

### Problema: Porta 5173 já em uso
```bash
# Verificar processos usando a porta
lsof -i :5173

# Parar processo ou mudar porta no docker-compose
```

### Problema: Falha no build
```bash
# Limpar cache do Docker
docker system prune -a

# Rebuild sem cache
docker-compose -f docker-compose.testes.yml build --no-cache
```

### Problema: Testes falhando
```bash
# Verificar logs detalhados
docker-compose -f docker-compose.testes.yml logs testes-interface

# Verificar se aplicação está rodando
curl http://localhost:5173
```

## ✅ Validação Final

O arquivo `docker-compose.testes.yml` foi **corrigido e validado** com sucesso:

- ✅ **Sintaxe válida** (sem warnings)
- ✅ **Health checks** configurados
- ✅ **Dependências** otimizadas
- ✅ **Dockerfile** atualizado
- ✅ **Scripts de teste** criados
- ✅ **Documentação** completa

**Status:** 🟢 **PRONTO PARA USO**

---

**Desenvolvido com ❤️ para a plataforma Vitalis**  
**Data de Correção:** 23 de Setembro de 2024
