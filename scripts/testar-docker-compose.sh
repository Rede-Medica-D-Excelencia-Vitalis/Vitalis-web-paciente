#!/bin/bash

# Script para testar o docker-compose.testes.yml
# Autor: Assistente IA
# Data: 23 de Setembro de 2024

set -e

echo "🐳 Testando Docker Compose para Testes de Interface"
echo "=================================================="

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

# Verificar se Docker está rodando
log "Verificando se Docker está rodando..."
if ! docker info > /dev/null 2>&1; then
    error "Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi
success "Docker está rodando"

# Verificar se docker-compose está disponível
log "Verificando docker-compose..."
if ! command -v docker-compose > /dev/null 2>&1; then
    error "docker-compose não está instalado ou não está no PATH"
    exit 1
fi
success "docker-compose disponível"

# Navegar para o diretório do projeto
cd "$(dirname "$0")/.."

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
    docker-compose -f docker-compose.testes.yml config
    exit 1
fi

# Verificar se as pastas de volume existem
log "Criando pastas de volume necessárias..."
mkdir -p docs/playwright-report
mkdir -p test-results
success "Pastas de volume criadas"

# Testar build da imagem (sem executar)
log "Testando build da imagem Docker..."
if docker-compose -f docker-compose.testes.yml build --no-cache vitalis-app > /dev/null 2>&1; then
    success "Build da imagem bem-sucedido"
else
    error "Falha no build da imagem"
    docker-compose -f docker-compose.testes.yml build vitalis-app
    exit 1
fi

# Limpar imagens temporárias
log "Limpando imagens temporárias..."
docker-compose -f docker-compose.testes.yml down --rmi all > /dev/null 2>&1 || true
success "Limpeza concluída"

# Mostrar resumo dos serviços
log "Resumo dos serviços configurados:"
echo ""
echo "📦 Serviços disponíveis:"
echo "  • vitalis-app: Aplicação principal (porta 5173)"
echo "  • testes-interface: Execução de todos os testes"
echo "  • testes-criticos: Execução de testes críticos apenas"
echo "  • relatorio: Servidor de relatórios (porta 8080)"
echo ""

# Mostrar comandos úteis
echo "🚀 Comandos úteis:"
echo ""
echo "  # Executar todos os testes:"
echo "  docker-compose -f docker-compose.testes.yml up testes-interface"
echo ""
echo "  # Executar apenas testes críticos:"
echo "  docker-compose -f docker-compose.testes.yml up testes-criticos"
echo ""
echo "  # Executar com relatórios:"
echo "  docker-compose -f docker-compose.testes.yml up"
echo ""
echo "  # Ver logs:"
echo "  docker-compose -f docker-compose.testes.yml logs -f"
echo ""
echo "  # Parar todos os serviços:"
echo "  docker-compose -f docker-compose.testes.yml down"
echo ""

success "Teste do Docker Compose concluído com sucesso!"
echo ""
echo "✅ O arquivo docker-compose.testes.yml está funcionando corretamente"
echo "✅ Todos os serviços estão configurados adequadamente"
echo "✅ Pronto para execução dos testes de interface"
