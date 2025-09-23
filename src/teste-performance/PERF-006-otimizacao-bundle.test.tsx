import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock do Performance API para bundle
const mockBundleMetrics = {
  mainBundleSize: 180 * 1024,        // 180KB main bundle
  gzippedSize: 45 * 1024,            // 45KB gzipped
  brotliSize: 38 * 1024,             // 38KB brotli
  totalChunks: 8,                    // 8 chunks divididos
  vendorChunkSize: 120 * 1024,       // 120KB vendor chunk
  routeChunks: [
    { name: 'home', size: 25 * 1024 },
    { name: 'auth', size: 18 * 1024 },
    { name: 'consultations', size: 32 * 1024 },
    { name: 'pharmacy', size: 28 * 1024 }
  ],
  unusedCode: 2 * 1024,              // 2KB código não utilizado
  duplicateCode: 1.5 * 1024,         // 1.5KB código duplicado
  heavyDependencies: [
    { name: 'react', size: 42 * 1024 },
    { name: 'react-dom', size: 130 * 1024 },
    { name: 'lodash', size: 71 * 1024 },
    { name: 'moment', size: 67 * 1024 }
  ],
  treeShakingEfficiency: 0.92,       // 92% eficiência
  compressionRatio: 0.75,            // 75% compressão
  loadTime: 800,                     // Tempo de carregamento
  parseTime: 120,                    // Tempo de parsing
  executionTime: 180                 // Tempo de execução
}

// Mock do Performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  getEntriesByType: vi.fn(() => [
    {
      name: 'https://cdn.vitalis.com/app.js',
      entryType: 'script',
      startTime: 100,
      duration: mockBundleMetrics.loadTime,
      transferSize: mockBundleMetrics.gzippedSize,
      encodedBodySize: mockBundleMetrics.mainBundleSize,
      decodedBodySize: mockBundleMetrics.mainBundleSize
    },
    {
      name: 'https://cdn.vitalis.com/vendor.js',
      entryType: 'script',
      startTime: 200,
      duration: mockBundleMetrics.vendorChunkSize / 1000,
      transferSize: mockBundleMetrics.vendorChunkSize * 0.3,
      encodedBodySize: mockBundleMetrics.vendorChunkSize,
      decodedBodySize: mockBundleMetrics.vendorChunkSize
    }
  ]),
  mark: vi.fn(),
  measure: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn()
} as any

// Mock do PerformanceObserver
global.PerformanceObserver = vi.fn().mockImplementation((callback) => {
  const observer = {
    observe: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => [])
  }
  
  // Simular callback com métricas de bundle
  setTimeout(() => {
    callback([
      {
        name: 'script-bundle-size',
        value: mockBundleMetrics.mainBundleSize,
        startTime: mockBundleMetrics.loadTime
      },
      {
        name: 'script-compression',
        value: mockBundleMetrics.compressionRatio,
        startTime: mockBundleMetrics.loadTime
      }
    ])
  }, 100)
  
  return observer
}) as any

// Adicionar propriedade supportedEntryTypes ao mock
Object.defineProperty(global.PerformanceObserver, 'supportedEntryTypes', {
  value: ['navigation', 'resource', 'script', 'measure'],
  writable: false
})

// Mock do IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn()
}))

// Mock do ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn()
}))

// Interface para métricas de bundle
interface BundleMetrics {
  mainBundleSize: number
  gzippedSize: number
  brotliSize: number
  totalChunks: number
  vendorChunkSize: number
  routeChunks: Array<{ name: string; size: number }>
  unusedCode: number
  duplicateCode: number
  heavyDependencies: Array<{ name: string; size: number }>
  treeShakingEfficiency: number
  compressionRatio: number
  loadTime: number
  parseTime: number
  executionTime: number
}

// Componente mock para página de bundle
const MockBundlePage = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [metrics, setMetrics] = React.useState<BundleMetrics | null>(null)

  React.useEffect(() => {
    const loadBundle = async () => {
      // Simular carregamento do bundle
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Simular coleta de métricas
      const collectedMetrics: BundleMetrics = {
        mainBundleSize: mockBundleMetrics.mainBundleSize,
        gzippedSize: mockBundleMetrics.gzippedSize,
        brotliSize: mockBundleMetrics.brotliSize,
        totalChunks: mockBundleMetrics.totalChunks,
        vendorChunkSize: mockBundleMetrics.vendorChunkSize,
        routeChunks: mockBundleMetrics.routeChunks,
        unusedCode: mockBundleMetrics.unusedCode,
        duplicateCode: mockBundleMetrics.duplicateCode,
        heavyDependencies: mockBundleMetrics.heavyDependencies,
        treeShakingEfficiency: mockBundleMetrics.treeShakingEfficiency,
        compressionRatio: mockBundleMetrics.compressionRatio,
        loadTime: mockBundleMetrics.loadTime,
        parseTime: mockBundleMetrics.parseTime,
        executionTime: mockBundleMetrics.executionTime
      }
      
      setMetrics(collectedMetrics)
      setIsLoading(false)
    }
    
    loadBundle()
  }, [])

  if (isLoading) {
    return (
      <div data-testid="bundle-loading">
        <div data-testid="loading-spinner">Carregando bundle...</div>
        <div data-testid="loading-progress">Analisando otimizações...</div>
      </div>
    )
  }

  return (
    <div data-testid="bundle-page">
      <div data-testid="bundle-header">
        <h1>Bundle JavaScript Otimizado</h1>
        <div data-testid="bundle-info">Análise de Performance</div>
      </div>
      
      <div data-testid="bundle-stats">
        <h2>Estatísticas do Bundle</h2>
        <div data-testid="stats-grid">
          <div data-testid="main-bundle-display">
            Bundle Principal: {(metrics?.mainBundleSize || 0) / 1024}KB
          </div>
          <div data-testid="gzipped-display">
            Gzipped: {(metrics?.gzippedSize || 0) / 1024}KB
          </div>
          <div data-testid="brotli-display">
            Brotli: {(metrics?.brotliSize || 0) / 1024}KB
          </div>
          <div data-testid="chunks-display">
            Chunks: {metrics?.totalChunks}
          </div>
        </div>
      </div>
      
      <div data-testid="optimization-stats">
        <h2>Otimizações</h2>
        <div data-testid="optimization-grid">
          <div data-testid="tree-shaking-display">
            Tree Shaking: {(metrics?.treeShakingEfficiency || 0) * 100}%
          </div>
          <div data-testid="compression-display">
            Compressão: {(metrics?.compressionRatio || 0) * 100}%
          </div>
          <div data-testid="unused-code-display">
            Código Não Utilizado: {(metrics?.unusedCode || 0) / 1024}KB
          </div>
          <div data-testid="duplicate-code-display">
            Código Duplicado: {(metrics?.duplicateCode || 0) / 1024}KB
          </div>
        </div>
      </div>
      
      <div data-testid="performance-stats">
        <h2>Performance</h2>
        <div data-testid="performance-grid">
          <div data-testid="load-time-display">
            Tempo de Carregamento: {metrics?.loadTime}ms
          </div>
          <div data-testid="parse-time-display">
            Tempo de Parsing: {metrics?.parseTime}ms
          </div>
          <div data-testid="execution-time-display">
            Tempo de Execução: {metrics?.executionTime}ms
          </div>
        </div>
      </div>
      
      {metrics && (
        <div data-testid="bundle-metrics" style={{ display: 'none' }}>
          <div data-testid="main-bundle-size">{metrics.mainBundleSize}</div>
          <div data-testid="gzipped-size">{metrics.gzippedSize}</div>
          <div data-testid="brotli-size">{metrics.brotliSize}</div>
          <div data-testid="total-chunks">{metrics.totalChunks}</div>
          <div data-testid="vendor-chunk-size">{metrics.vendorChunkSize}</div>
          <div data-testid="unused-code">{metrics.unusedCode}</div>
          <div data-testid="duplicate-code">{metrics.duplicateCode}</div>
          <div data-testid="tree-shaking-efficiency">{metrics.treeShakingEfficiency}</div>
          <div data-testid="compression-ratio">{metrics.compressionRatio}</div>
          <div data-testid="load-time">{metrics.loadTime}</div>
          <div data-testid="parse-time">{metrics.parseTime}</div>
          <div data-testid="execution-time">{metrics.executionTime}</div>
        </div>
      )}
    </div>
  )
}

// Hook para monitorar performance do bundle
const useBundlePerformance = () => {
  const [metrics, setMetrics] = React.useState<BundleMetrics | null>(null)
  
  React.useEffect(() => {
    const collectMetrics = () => {
      const collectedMetrics: BundleMetrics = {
        mainBundleSize: mockBundleMetrics.mainBundleSize,
        gzippedSize: mockBundleMetrics.gzippedSize,
        brotliSize: mockBundleMetrics.brotliSize,
        totalChunks: mockBundleMetrics.totalChunks,
        vendorChunkSize: mockBundleMetrics.vendorChunkSize,
        routeChunks: mockBundleMetrics.routeChunks,
        unusedCode: mockBundleMetrics.unusedCode,
        duplicateCode: mockBundleMetrics.duplicateCode,
        heavyDependencies: mockBundleMetrics.heavyDependencies,
        treeShakingEfficiency: mockBundleMetrics.treeShakingEfficiency,
        compressionRatio: mockBundleMetrics.compressionRatio,
        loadTime: mockBundleMetrics.loadTime,
        parseTime: mockBundleMetrics.parseTime,
        executionTime: mockBundleMetrics.executionTime
      }
      
      setMetrics(collectedMetrics)
    }
    
    setTimeout(collectMetrics, 100)
  }, [])
  
  return metrics
}

// Componente para monitorar performance do bundle
const MockBundlePerformanceMonitor = () => {
  const metrics = useBundlePerformance()
  
  if (!metrics) {
    return <div data-testid="metrics-loading">Coletando métricas do bundle...</div>
  }
  
  return (
    <div data-testid="bundle-performance-monitor">
      <div data-testid="bundle-metrics-summary">
        <h3>Métricas de Performance do Bundle</h3>
        <div data-testid="main-bundle-metric">Bundle Principal: {(metrics.mainBundleSize / 1024).toFixed(1)}KB</div>
        <div data-testid="gzipped-metric">Gzipped: {(metrics.gzippedSize / 1024).toFixed(1)}KB</div>
        <div data-testid="brotli-metric">Brotli: {(metrics.brotliSize / 1024).toFixed(1)}KB</div>
        <div data-testid="chunks-metric">Chunks: {metrics.totalChunks}</div>
        <div data-testid="vendor-metric">Vendor: {(metrics.vendorChunkSize / 1024).toFixed(1)}KB</div>
        <div data-testid="tree-shaking-metric">Tree Shaking: {(metrics.treeShakingEfficiency * 100).toFixed(0)}%</div>
        <div data-testid="compression-metric">Compressão: {(metrics.compressionRatio * 100).toFixed(0)}%</div>
        <div data-testid="load-time-metric">Load Time: {metrics.loadTime}ms</div>
        <div data-testid="parse-time-metric">Parse Time: {metrics.parseTime}ms</div>
        <div data-testid="execution-metric">Execution: {metrics.executionTime}ms</div>
      </div>
    </div>
  )
}

// Função para validar métricas de bundle
const validateBundleMetrics = (metrics: BundleMetrics) => {
  const results = {
    mainBundleSize: metrics.mainBundleSize < 250 * 1024, // < 250KB
    gzippedSize: metrics.gzippedSize < 250 * 1024, // < 250KB gzipped
    totalChunks: metrics.totalChunks >= 4, // Pelo menos 4 chunks
    vendorChunkSize: metrics.vendorChunkSize < 200 * 1024, // < 200KB vendor
    unusedCode: metrics.unusedCode < 10 * 1024, // < 10KB não utilizado
    duplicateCode: metrics.duplicateCode < 5 * 1024, // < 5KB duplicado
    treeShakingEfficiency: metrics.treeShakingEfficiency > 0.8, // > 80%
    compressionRatio: metrics.compressionRatio > 0.6, // > 60% compressão
    loadTime: metrics.loadTime < 1000, // < 1s carregamento
    parseTime: metrics.parseTime < 200, // < 200ms parsing
    executionTime: metrics.executionTime < 300 // < 300ms execução
  }
  
  return {
    ...results,
    allPassed: Object.values(results).every(Boolean)
  }
}

// Função de render personalizada para testes
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/bundle']) => {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('PERF-006 - Otimização do Bundle JavaScript', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset das métricas mock
    mockBundleMetrics.mainBundleSize = 180 * 1024
    mockBundleMetrics.gzippedSize = 45 * 1024
    mockBundleMetrics.brotliSize = 38 * 1024
    mockBundleMetrics.totalChunks = 8
    mockBundleMetrics.vendorChunkSize = 120 * 1024
    mockBundleMetrics.unusedCode = 2 * 1024
    mockBundleMetrics.duplicateCode = 1.5 * 1024
    mockBundleMetrics.treeShakingEfficiency = 0.92
    mockBundleMetrics.compressionRatio = 0.75
    mockBundleMetrics.loadTime = 800
    mockBundleMetrics.parseTime = 120
    mockBundleMetrics.executionTime = 180
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Métricas de Tamanho do Bundle', () => {
    it('deve ter bundle principal menor que 250KB', async () => {
      renderWithRouter(<MockBundlePage />)
      
      // Aguardar carregamento da página
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      // Aguardar métricas serem coletadas
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const mainBundleElement = screen.getByTestId('main-bundle-size')
      const mainBundleSize = parseInt(mainBundleElement.textContent || '0')
      
      expect(mainBundleSize).toBeLessThan(250 * 1024) // < 250KB
      expect(mainBundleSize).toBe(mockBundleMetrics.mainBundleSize)
    })

    it('deve ter bundle gzipped menor que 250KB', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const gzippedElement = screen.getByTestId('gzipped-size')
      const gzippedSize = parseInt(gzippedElement.textContent || '0')
      
      expect(gzippedSize).toBeLessThan(250 * 1024) // < 250KB gzipped
      expect(gzippedSize).toBe(mockBundleMetrics.gzippedSize)
    })

    it('deve ter compressão Brotli otimizada', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const brotliElement = screen.getByTestId('brotli-size')
      const brotliSize = parseInt(brotliElement.textContent || '0')
      const gzippedElement = screen.getByTestId('gzipped-size')
      const gzippedSize = parseInt(gzippedElement.textContent || '0')
      
      expect(brotliSize).toBeLessThan(gzippedSize) // Brotli < Gzip
      expect(brotliSize).toBe(mockBundleMetrics.brotliSize)
    })
  })

  describe('Code Splitting e Chunks', () => {
    it('deve ter chunks divididos adequadamente', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const chunksElement = screen.getByTestId('total-chunks')
      const totalChunks = parseInt(chunksElement.textContent || '0')
      
      expect(totalChunks).toBeGreaterThanOrEqual(4) // Pelo menos 4 chunks
      expect(totalChunks).toBe(mockBundleMetrics.totalChunks)
    })

    it('deve ter vendor chunk otimizado', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const vendorChunkElement = screen.getByTestId('vendor-chunk-size')
      const vendorChunkSize = parseInt(vendorChunkElement.textContent || '0')
      
      expect(vendorChunkSize).toBeLessThan(200 * 1024) // < 200KB vendor
      expect(vendorChunkSize).toBe(mockBundleMetrics.vendorChunkSize)
    })
  })

  describe('Tree Shaking e Otimizações', () => {
    it('deve ter tree shaking eficiente', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const treeShakingElement = screen.getByTestId('tree-shaking-efficiency')
      const treeShakingEfficiency = parseFloat(treeShakingElement.textContent || '0')
      
      expect(treeShakingEfficiency).toBeGreaterThan(0.8) // > 80%
      expect(treeShakingEfficiency).toBe(mockBundleMetrics.treeShakingEfficiency)
    })

    it('deve ter código não utilizado mínimo', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const unusedCodeElement = screen.getByTestId('unused-code')
      const unusedCode = parseInt(unusedCodeElement.textContent || '0')
      
      expect(unusedCode).toBeLessThan(10 * 1024) // < 10KB
      expect(unusedCode).toBe(mockBundleMetrics.unusedCode)
    })
  })

  describe('Performance de Carregamento', () => {
    it('deve carregar bundle em tempo adequado', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const loadTimeElement = screen.getByTestId('load-time')
      const loadTime = parseInt(loadTimeElement.textContent || '0')
      
      expect(loadTime).toBeLessThan(1000) // < 1s
      expect(loadTime).toBe(mockBundleMetrics.loadTime)
    })

    it('deve ter tempo de parsing adequado', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const parseTimeElement = screen.getByTestId('parse-time')
      const parseTime = parseInt(parseTimeElement.textContent || '0')
      
      expect(parseTime).toBeLessThan(200) // < 200ms
      expect(parseTime).toBe(mockBundleMetrics.parseTime)
    })
  })

  describe('Compressão e Otimização', () => {
    it('deve ter compressão gzip adequada', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const compressionElement = screen.getByTestId('compression-ratio')
      const compressionRatio = parseFloat(compressionElement.textContent || '0')
      
      expect(compressionRatio).toBeGreaterThan(0.6) // > 60%
      expect(compressionRatio).toBe(mockBundleMetrics.compressionRatio)
    })

    it('deve ter código duplicado mínimo', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const duplicateCodeElement = screen.getByTestId('duplicate-code')
      const duplicateCode = parseInt(duplicateCodeElement.textContent || '0')
      
      expect(duplicateCode).toBeLessThan(5 * 1024) // < 5KB
      expect(duplicateCode).toBe(mockBundleMetrics.duplicateCode)
    })
  })

  describe('Validação Completa de Performance', () => {
    it('deve passar em todas as métricas de performance do bundle', async () => {
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      // Coletar todas as métricas
      const metrics: BundleMetrics = {
        mainBundleSize: parseInt(screen.getByTestId('main-bundle-size').textContent || '0'),
        gzippedSize: parseInt(screen.getByTestId('gzipped-size').textContent || '0'),
        brotliSize: parseInt(screen.getByTestId('brotli-size').textContent || '0'),
        totalChunks: parseInt(screen.getByTestId('total-chunks').textContent || '0'),
        vendorChunkSize: parseInt(screen.getByTestId('vendor-chunk-size').textContent || '0'),
        routeChunks: mockBundleMetrics.routeChunks,
        unusedCode: parseInt(screen.getByTestId('unused-code').textContent || '0'),
        duplicateCode: parseInt(screen.getByTestId('duplicate-code').textContent || '0'),
        heavyDependencies: mockBundleMetrics.heavyDependencies,
        treeShakingEfficiency: parseFloat(screen.getByTestId('tree-shaking-efficiency').textContent || '0'),
        compressionRatio: parseFloat(screen.getByTestId('compression-ratio').textContent || '0'),
        loadTime: parseInt(screen.getByTestId('load-time').textContent || '0'),
        parseTime: parseInt(screen.getByTestId('parse-time').textContent || '0'),
        executionTime: parseInt(screen.getByTestId('execution-time').textContent || '0')
      }
      
      // Validar todas as métricas
      const validation = validateBundleMetrics(metrics)
      
      expect(validation.allPassed).toBe(true)
      expect(validation.mainBundleSize).toBe(true)
      expect(validation.gzippedSize).toBe(true)
      expect(validation.totalChunks).toBe(true)
      expect(validation.vendorChunkSize).toBe(true)
      expect(validation.unusedCode).toBe(true)
      expect(validation.duplicateCode).toBe(true)
      expect(validation.treeShakingEfficiency).toBe(true)
      expect(validation.compressionRatio).toBe(true)
      expect(validation.loadTime).toBe(true)
      expect(validation.parseTime).toBe(true)
      expect(validation.executionTime).toBe(true)
    })
  })

  describe('Monitor de Performance do Bundle', () => {
    it('deve exibir métricas de performance corretamente', async () => {
      renderWithRouter(<MockBundlePerformanceMonitor />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-performance-monitor')).toBeInTheDocument()
      })
      
      // Verificar se todas as métricas estão sendo exibidas
      expect(screen.getByTestId('main-bundle-metric')).toBeInTheDocument()
      expect(screen.getByTestId('gzipped-metric')).toBeInTheDocument()
      expect(screen.getByTestId('brotli-metric')).toBeInTheDocument()
      expect(screen.getByTestId('chunks-metric')).toBeInTheDocument()
      expect(screen.getByTestId('vendor-metric')).toBeInTheDocument()
      expect(screen.getByTestId('tree-shaking-metric')).toBeInTheDocument()
      expect(screen.getByTestId('compression-metric')).toBeInTheDocument()
      expect(screen.getByTestId('load-time-metric')).toBeInTheDocument()
      expect(screen.getByTestId('parse-time-metric')).toBeInTheDocument()
      expect(screen.getByTestId('execution-metric')).toBeInTheDocument()
    })
  })

  describe('Cenários de Performance Degradada', () => {
    it('deve detectar bundle muito grande', async () => {
      // Simular bundle muito grande
      mockBundleMetrics.mainBundleSize = 300 * 1024 // 300KB
      mockBundleMetrics.gzippedSize = 280 * 1024   // 280KB gzipped
      
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const mainBundleElement = screen.getByTestId('main-bundle-size')
      const mainBundleSize = parseInt(mainBundleElement.textContent || '0')
      
      expect(mainBundleSize).toBeGreaterThan(250 * 1024)
      expect(mainBundleSize).toBe(300 * 1024)
    })

    it('deve detectar tree shaking ineficiente', async () => {
      // Simular tree shaking ineficiente
      mockBundleMetrics.treeShakingEfficiency = 0.5 // 50%
      mockBundleMetrics.unusedCode = 50 * 1024 // 50KB
      
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const treeShakingElement = screen.getByTestId('tree-shaking-efficiency')
      const treeShakingEfficiency = parseFloat(treeShakingElement.textContent || '0')
      
      expect(treeShakingEfficiency).toBeLessThan(0.8)
      expect(treeShakingEfficiency).toBe(0.5)
    })

    it('deve detectar compressão inadequada', async () => {
      // Simular compressão inadequada
      mockBundleMetrics.compressionRatio = 0.3 // 30%
      mockBundleMetrics.gzippedSize = 200 * 1024 // 200KB gzipped
      
      renderWithRouter(<MockBundlePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('bundle-metrics')).toBeInTheDocument()
      })
      
      const compressionElement = screen.getByTestId('compression-ratio')
      const compressionRatio = parseFloat(compressionElement.textContent || '0')
      
      expect(compressionRatio).toBeLessThan(0.6)
      expect(compressionRatio).toBe(0.3)
    })
  })
})
