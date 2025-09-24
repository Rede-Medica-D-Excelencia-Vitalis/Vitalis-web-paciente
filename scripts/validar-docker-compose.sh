#!/bin/bash

# Script para validar docker-compose.testes.yml sem executar Docker
# Autor: Assistente IA
# Data: 23 de Setembro de 2024

set -e

echo "🔍 Validando Docker Compose (Sem Execução)"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCESSO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

# Navegar para o diretório do projeto
cd "$(dirname "$0")/.."

# Verificar se docker-compose está disponível
log "Verificando docker-compose..."
if ! command -v docker-compose > /dev/null 2>&1; then
    error "docker-compose não está instalado ou não está no PATH"
    exit 1
fi
success "docker-compose disponível"

# Verificar se os arquivos necessários existem
log "Verificando arquivos necessários..."
required_files=(
    "docker-compose.testes.yml"
    "Dockerfile.testes"
    "package.json"
    "playwright.config.ts"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        error "Arquivo necessário não encontrado: $file"
        exit 1
    fi
    success "Arquivo encontrado: $file"
done

# Validar sintaxe do docker-compose
log "Validando sintaxe do docker-compose.testes.yml..."
if docker-compose -f docker-compose.testes.yml config > /dev/null 2>&1; then
    success "Sintaxe do docker-compose válida"
else
    error "Sintaxe do docker-compose inválida"
    echo ""
    echo "Detalhes do erro:"
    docker-compose -f docker-compose.testes.yml config
    exit 1
fi

# Verificar se as pastas de volume existem
log "Verificando pastas de volume..."
mkdir -p docs/playwright-report
mkdir -p test-results
success "Pastas de volume verificadas/criadas"

# Validar estrutura do docker-compose
log "Validando estrutura dos serviços..."

# Verificar se todos os serviços têm as configurações necessárias
services=("vitalis-app" "testes-interface" "testes-criticos" "relatorio")

for service in "${services[@]}"; do
    if docker-compose -f docker-compose.testes.yml config | grep -q "$service:"; then
        success "Serviço '$service' configurado"
    else
        error "Serviço '$service' não encontrado"
        exit 1
    fi
done

# Verificar health checks
log "Verificando health checks..."
if docker-compose -f docker-compose.testes.yml config | grep -q "healthcheck:"; then
    success "Health checks configurados"
else
    warning "Health checks não encontrados"
fi

# Verificar dependências
log "Verificando dependências..."
if docker-compose -f docker-compose.testes.yml config | grep -q "condition: service_healthy"; then
    success "Dependências com health checks configuradas"
else
    warning "Dependências simples (sem health checks)"
fi

# Mostrar resumo da configuração
log "Resumo da configuração:"
echo ""
docker-compose -f docker-compose.testes.yml config --services | while read service; do
    echo "  📦 $service"
done

echo ""
log "Configuração validada com sucesso!"
echo ""
echo "✅ Sintaxe válida"
echo "✅ Arquivos necessários presentes"
echo "✅ Serviços configurados"
echo "✅ Pastas de volume criadas"
echo ""
echo "🚀 Pronto para execução quando Docker estiver disponível"
echo ""
echo "Para executar os testes:"
echo "  docker-compose -f docker-compose.testes.yml up testes-interface"
