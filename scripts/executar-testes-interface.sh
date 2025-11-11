#!/bin/bash

# Script para execução dos testes de interface (UI/UX) - Vitalis
# Desenvolvido para facilitar a execução dos 11 cenários de teste

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}🎨 Script de Execução dos Testes de Interface - Vitalis${NC}"
    echo ""
    echo "Uso: $0 [OPÇÕES]"
    echo ""
    echo "Opções:"
    echo "  -h, --help              Exibir esta ajuda"
    echo "  -a, --all               Executar todos os testes (padrão)"
    echo "  -c, --critical          Executar apenas testes críticos"
    echo "  -r, --responsive        Executar apenas testes de responsividade"
    echo "  -n, --navigation        Executar apenas testes de navegação"
    echo "  -v, --visual            Executar apenas testes de consistência visual"
    echo "  -d, --desktop           Executar apenas testes para desktop"
    echo "  -t, --tablet            Executar apenas testes para tablet"
    echo "  -m, --mobile            Executar apenas testes para mobile"
    echo "  -b, --browser BROWSER   Executar em navegador específico (chromium, firefox, webkit)"
    echo "  -u, --ui                Executar com interface gráfica"
    echo "  -s, --headed            Executar com navegador visível"
    echo "  -g, --debug             Executar em modo debug"
    echo "  -p, --parallel          Executar em paralelo"
    echo "  --report                Abrir relatório após execução"
    echo "  --install               Instalar dependências e navegadores"
    echo "  --clean                 Limpar arquivos de teste"
    echo ""
    echo "Exemplos:"
    echo "  $0                      # Executar todos os testes"
    echo "  $0 -c                   # Executar testes críticos"
    echo "  $0 -r -b chromium       # Executar testes de responsividade no Chrome"
    echo "  $0 -u                   # Executar com interface gráfica"
    echo "  $0 --install            # Instalar dependências"
}

# Função para verificar dependências
check_dependencies() {
    echo -e "${BLUE}🔍 Verificando dependências...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 18+ e tente novamente.${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm não encontrado. Instale npm e tente novamente.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dependências verificadas${NC}"
}

# Função para instalar dependências
install_dependencies() {
    echo -e "${BLUE}📦 Instalando dependências...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json não encontrado. Execute este script no diretório raiz do projeto.${NC}"
        exit 1
    fi
    
    npm install
    npm run test:playwright:install
    
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
}

# Função para limpar arquivos de teste
clean_test_files() {
    echo -e "${BLUE}🧹 Limpando arquivos de teste...${NC}"
    
    rm -rf test-results/
    rm -rf docs/playwright-report/
    rm -rf docs/playwright-results.json
    rm -rf docs/playwright-results.xml
    
    echo -e "${GREEN}✅ Arquivos de teste limpos${NC}"
}

# Função para executar testes
run_tests() {
    local test_command="npx playwright test"
    local test_args=""
    
    # Adicionar argumentos baseados nas opções
    if [ "$BROWSER" != "" ]; then
        test_command="$test_command --project=$BROWSER"
    fi
    
    if [ "$UI" = true ]; then
        test_command="$test_command --ui"
    fi
    
    if [ "$HEADED" = true ]; then
        test_command="$test_command --headed"
    fi
    
    if [ "$DEBUG" = true ]; then
        test_command="$test_command --debug"
    fi
    
    if [ "$PARALLEL" = true ]; then
        test_command="$test_command --workers=4"
    fi
    
    # Adicionar testes específicos
    if [ "$CRITICAL" = true ]; then
        test_args="UI-003 UI-007"
    elif [ "$RESPONSIVE" = true ]; then
        test_args="UI-001 UI-002 UI-003 UI-004 UI-005 UI-006"
    elif [ "$NAVIGATION" = true ]; then
        test_args="UI-007 UI-008 UI-009"
    elif [ "$VISUAL" = true ]; then
        test_args="UI-010 UI-011"
    elif [ "$DESKTOP" = true ]; then
        test_args="UI-001 UI-005 UI-006"
    elif [ "$TABLET" = true ]; then
        test_args="UI-002 UI-005"
    elif [ "$MOBILE" = true ]; then
        test_args="UI-003 UI-004"
    fi
    
    if [ "$test_args" != "" ]; then
        test_command="$test_command $test_args"
    fi
    
    echo -e "${BLUE}🚀 Executando testes...${NC}"
    echo -e "${YELLOW}Comando: $test_command${NC}"
    echo ""
    
    # Executar testes
    if eval $test_command; then
        echo -e "${GREEN}✅ Testes executados com sucesso!${NC}"
        
        if [ "$REPORT" = true ]; then
            echo -e "${BLUE}📊 Abrindo relatório...${NC}"
            npm run test:playwright:report
        fi
    else
        echo -e "${RED}❌ Alguns testes falharam${NC}"
        echo -e "${YELLOW}💡 Execute 'npm run test:playwright:report' para ver o relatório detalhado${NC}"
        exit 1
    fi
}

# Função para exibir resumo
show_summary() {
    echo ""
    echo -e "${BLUE}📋 Resumo dos Testes de Interface${NC}"
    echo ""
    echo -e "${GREEN}✅ Testes Implementados: 11 cenários${NC}"
    echo -e "${GREEN}✅ Responsividade: 6 testes${NC}"
    echo -e "${GREEN}✅ Navegação: 3 testes${NC}"
    echo -e "${GREEN}✅ Consistência Visual: 2 testes${NC}"
    echo ""
    echo -e "${BLUE}📁 Relatórios disponíveis em:${NC}"
    echo -e "   - HTML: docs/playwright-report/index.html"
    echo -e "   - JSON: docs/playwright-results.json"
    echo -e "   - JUnit: docs/playwright-results.xml"
    echo ""
    echo -e "${BLUE}🔧 Comandos úteis:${NC}"
    echo -e "   - Ver relatório: npm run test:playwright:report"
    echo -e "   - Executar com UI: npm run test:playwright:ui"
    echo -e "   - Executar com debug: npm run test:playwright:debug"
    echo -e "   - Limpar arquivos: $0 --clean"
}

# Variáveis padrão
ALL=true
CRITICAL=false
RESPONSIVE=false
NAVIGATION=false
VISUAL=false
DESKTOP=false
TABLET=false
MOBILE=false
BROWSER=""
UI=false
HEADED=false
DEBUG=false
PARALLEL=false
REPORT=false
INSTALL=false
CLEAN=false

# Processar argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -a|--all)
            ALL=true
            shift
            ;;
        -c|--critical)
            CRITICAL=true
            ALL=false
            shift
            ;;
        -r|--responsive)
            RESPONSIVE=true
            ALL=false
            shift
            ;;
        -n|--navigation)
            NAVIGATION=true
            ALL=false
            shift
            ;;
        -v|--visual)
            VISUAL=true
            ALL=false
            shift
            ;;
        -d|--desktop)
            DESKTOP=true
            ALL=false
            shift
            ;;
        -t|--tablet)
            TABLET=true
            ALL=false
            shift
            ;;
        -m|--mobile)
            MOBILE=true
            ALL=false
            shift
            ;;
        -b|--browser)
            BROWSER="$2"
            shift 2
            ;;
        -u|--ui)
            UI=true
            shift
            ;;
        -s|--headed)
            HEADED=true
            shift
            ;;
        -g|--debug)
            DEBUG=true
            shift
            ;;
        -p|--parallel)
            PARALLEL=true
            shift
            ;;
        --report)
            REPORT=true
            shift
            ;;
        --install)
            INSTALL=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        *)
            echo -e "${RED}❌ Opção desconhecida: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Executar ações
if [ "$INSTALL" = true ]; then
    check_dependencies
    install_dependencies
    exit 0
fi

if [ "$CLEAN" = true ]; then
    clean_test_files
    exit 0
fi

# Verificar dependências
check_dependencies

# Executar testes
run_tests

# Exibir resumo
show_summary
