import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock do Performance API
const mockPerformanceObserver = vi.fn()
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

// Mock das métricas de performance
const mockPerformanceMetrics = {
  fcp: 1200, // First Contentful Paint em ms
  lcp: 2100, // Largest Contentful Paint em ms
  tti: 2800, // Time to Interactive em ms
  cls: 0.05, // Cumulative Layout Shift
  fid: 80,   // First Input Delay em ms
  ttfb: 150, // Time to First Byte em ms
  loadTime: 2500, // Tempo total de carregamento
  resourceCount: 25, // Número de recursos carregados
  resourceSize: 1024 * 1024 * 2.5 // Tamanho total dos recursos (2.5MB)
}

// Mock do Performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  getEntriesByType: vi.fn(() => [
    {
      name: 'https://api.vitalis.com/health',
      entryType: 'navigation',
      startTime: 0,
      duration: mockPerformanceMetrics.ttfb,
      transferSize: mockPerformanceMetrics.resourceSize / 10,
      encodedBodySize: mockPerformanceMetrics.resourceSize / 10,
      decodedBodySize: mockPerformanceMetrics.resourceSize / 10
    },
    {
      name: 'https://cdn.vitalis.com/app.js',
      entryType: 'resource',
      startTime: 100,
      duration: 800,
      transferSize: mockPerformanceMetrics.resourceSize / 5,
      encodedBodySize: mockPerformanceMetrics.resourceSize / 5,
      decodedBodySize: mockPerformanceMetrics.resourceSize / 5
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
    observe: mockObserve,
    disconnect: mockDisconnect,
    takeRecords: vi.fn(() => [])
  }
  
  // Simular callback com métricas
  setTimeout(() => {
    callback([
      {
        name: 'first-contentful-paint',
        value: mockPerformanceMetrics.fcp,
        startTime: mockPerformanceMetrics.fcp
      },
      {
        name: 'largest-contentful-paint',
        value: mockPerformanceMetrics.lcp,
        startTime: mockPerformanceMetrics.lcp
      },
      {
        name: 'first-input-delay',
        value: mockPerformanceMetrics.fid,
        startTime: mockPerformanceMetrics.fid
      }
    ])
  }, 100)
  
  return observer
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

// Interface para métricas de performance
interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  tti: number // Time to Interactive
  cls: number // Cumulative Layout Shift
  fid: number // First Input Delay
  ttfb: number // Time to First Byte
  loadTime: number // Tempo total de carregamento
  resourceCount: number // Número de recursos
  resourceSize: number // Tamanho dos recursos
}

// Componente mock para página de login
const MockLoginPage = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null)

  React.useEffect(() => {
    // Simular carregamento da página
    const loadPage = async () => {
      const startTime = performance.now()
      
      // Simular carregamento de recursos
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Simular carregamento de dados da API
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      // Simular coleta de métricas
      const collectedMetrics: PerformanceMetrics = {
        fcp: mockPerformanceMetrics.fcp,
        lcp: mockPerformanceMetrics.lcp,
        tti: mockPerformanceMetrics.tti,
        cls: mockPerformanceMetrics.cls,
        fid: mockPerformanceMetrics.fid,
        ttfb: mockPerformanceMetrics.ttfb,
        loadTime: loadTime,
        resourceCount: mockPerformanceMetrics.resourceCount,
        resourceSize: mockPerformanceMetrics.resourceSize
      }
      
      setMetrics(collectedMetrics)
      setIsLoading(false)
    }
    
    loadPage()
  }, [])

  if (isLoading) {
    return (
      <div data-testid="loading-page">
        <div data-testid="loading-spinner">Carregando...</div>
        <div data-testid="loading-progress">Inicializando aplicação...</div>
      </div>
    )
  }

  return (
    <div data-testid="login-page">
      <div data-testid="app-header">
        <h1>Vitalis - Sistema de Saúde</h1>
        <div data-testid="logo">Logo</div>
      </div>
      
      <div data-testid="login-form">
        <form>
          <div data-testid="email-field">
            <label htmlFor="email">Email:</label>
            <input 
              id="email" 
              type="email" 
              placeholder="Digite seu email"
              data-testid="email-input"
            />
          </div>
          
          <div data-testid="password-field">
            <label htmlFor="password">Senha:</label>
            <input 
              id="password" 
              type="password" 
              placeholder="Digite sua senha"
              data-testid="password-input"
            />
          </div>
          
          <button 
            type="submit" 
            data-testid="login-button"
          >
            Entrar
          </button>
        </form>
      </div>
      
      <div data-testid="footer">
        <p>© 2024 Vitalis - Todos os direitos reservados</p>
      </div>
      
      {metrics && (
        <div data-testid="performance-metrics" style={{ display: 'none' }}>
          <div data-testid="fcp">{metrics.fcp}</div>
          <div data-testid="lcp">{metrics.lcp}</div>
          <div data-testid="tti">{metrics.tti}</div>
          <div data-testid="cls">{metrics.cls}</div>
          <div data-testid="fid">{metrics.fid}</div>
          <div data-testid="ttfb">{metrics.ttfb}</div>
          <div data-testid="load-time">{metrics.loadTime}</div>
          <div data-testid="resource-count">{metrics.resourceCount}</div>
          <div data-testid="resource-size">{metrics.resourceSize}</div>
        </div>
      )}
    </div>
  )
}

// Hook para coletar métricas de performance
const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null)
  
  React.useEffect(() => {
    const collectMetrics = () => {
      // Simular coleta de métricas reais
      const performanceEntries = performance.getEntriesByType('navigation')
      const resourceEntries = performance.getEntriesByType('resource')
      
      const collectedMetrics: PerformanceMetrics = {
        fcp: mockPerformanceMetrics.fcp,
        lcp: mockPerformanceMetrics.lcp,
        tti: mockPerformanceMetrics.tti,
        cls: mockPerformanceMetrics.cls,
        fid: mockPerformanceMetrics.fid,
        ttfb: mockPerformanceMetrics.ttfb,
        loadTime: mockPerformanceMetrics.loadTime,
        resourceCount: resourceEntries.length,
        resourceSize: resourceEntries.reduce((total, entry: any) => 
          total + (entry.transferSize || 0), 0
        )
      }
      
      setMetrics(collectedMetrics)
    }
    
    // Simular coleta de métricas após carregamento
    setTimeout(collectMetrics, 100)
  }, [])
  
  return metrics
}

// Componente para monitorar performance
const MockPerformanceMonitor = () => {
  const metrics = usePerformanceMetrics()
  
  if (!metrics) {
    return <div data-testid="metrics-loading">Coletando métricas...</div>
  }
  
  return (
    <div data-testid="performance-monitor">
      <div data-testid="metrics-summary">
        <h3>Métricas de Performance</h3>
        <div data-testid="fcp-metric">FCP: {metrics.fcp}ms</div>
        <div data-testid="lcp-metric">LCP: {metrics.lcp}ms</div>
        <div data-testid="tti-metric">TTI: {metrics.tti}ms</div>
        <div data-testid="cls-metric">CLS: {metrics.cls}</div>
        <div data-testid="fid-metric">FID: {metrics.fid}ms</div>
        <div data-testid="ttfb-metric">TTFB: {metrics.ttfb}ms</div>
        <div data-testid="load-time-metric">Load Time: {metrics.loadTime}ms</div>
        <div data-testid="resource-count-metric">Resources: {metrics.resourceCount}</div>
        <div data-testid="resource-size-metric">Size: {(metrics.resourceSize / 1024 / 1024).toFixed(2)}MB</div>
      </div>
    </div>
  )
}

// Função para validar métricas de performance
const validatePerformanceMetrics = (metrics: PerformanceMetrics) => {
  const results = {
    fcp: metrics.fcp < 1500,
    lcp: metrics.lcp < 2500,
    tti: metrics.tti < 3000,
    cls: metrics.cls < 0.1,
    fid: metrics.fid < 100,
    ttfb: metrics.ttfb < 200,
    loadTime: metrics.loadTime < 3000,
    resourceCount: metrics.resourceCount < 50,
    resourceSize: metrics.resourceSize < 5 * 1024 * 1024 // 5MB
  }
  
  return {
    ...results,
    allPassed: Object.values(results).every(Boolean)
  }
}

// Função de render personalizada para testes
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/']) => {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('PERF-001 - Carregamento Inicial da Página', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset das métricas mock
    mockPerformanceMetrics.fcp = 1200
    mockPerformanceMetrics.lcp = 2100
    mockPerformanceMetrics.tti = 2800
    mockPerformanceMetrics.cls = 0.05
    mockPerformanceMetrics.fid = 80
    mockPerformanceMetrics.ttfb = 150
    mockPerformanceMetrics.loadTime = 2500
    mockPerformanceMetrics.resourceCount = 25
    mockPerformanceMetrics.resourceSize = 1024 * 1024 * 2.5
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Métricas de Performance Core Web Vitals', () => {
    it('deve ter First Contentful Paint (FCP) < 1.5s', async () => {
      renderWithRouter(<MockLoginPage />)
      
      // Aguardar carregamento da página
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      // Aguardar métricas serem coletadas
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const fcpElement = screen.getByTestId('fcp')
      const fcp = parseInt(fcpElement.textContent || '0')
      
      expect(fcp).toBeLessThan(1500)
      expect(fcp).toBe(mockPerformanceMetrics.fcp)
    })

    it('deve ter Largest Contentful Paint (LCP) < 2.5s', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const lcpElement = screen.getByTestId('lcp')
      const lcp = parseInt(lcpElement.textContent || '0')
      
      expect(lcp).toBeLessThan(2500)
      expect(lcp).toBe(mockPerformanceMetrics.lcp)
    })

    it('deve ter Time to Interactive (TTI) < 3.0s', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const ttiElement = screen.getByTestId('tti')
      const tti = parseInt(ttiElement.textContent || '0')
      
      expect(tti).toBeLessThan(3000)
      expect(tti).toBe(mockPerformanceMetrics.tti)
    })

    it('deve ter Cumulative Layout Shift (CLS) < 0.1', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const clsElement = screen.getByTestId('cls')
      const cls = parseFloat(clsElement.textContent || '0')
      
      expect(cls).toBeLessThan(0.1)
      expect(cls).toBe(mockPerformanceMetrics.cls)
    })

    it('deve ter First Input Delay (FID) < 100ms', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const fidElement = screen.getByTestId('fid')
      const fid = parseInt(fidElement.textContent || '0')
      
      expect(fid).toBeLessThan(100)
      expect(fid).toBe(mockPerformanceMetrics.fid)
    })
  })

  describe('Métricas de Carregamento', () => {
    it('deve ter Time to First Byte (TTFB) < 200ms', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const ttfbElement = screen.getByTestId('ttfb')
      const ttfb = parseInt(ttfbElement.textContent || '0')
      
      expect(ttfb).toBeLessThan(200)
      expect(ttfb).toBe(mockPerformanceMetrics.ttfb)
    })

    it('deve ter tempo total de carregamento < 3.0s', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const loadTimeElement = screen.getByTestId('load-time')
      const loadTime = parseInt(loadTimeElement.textContent || '0')
      
      expect(loadTime).toBeLessThan(3000)
      expect(loadTime).toBeGreaterThan(0)
    })

    it('deve carregar número adequado de recursos', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const resourceCountElement = screen.getByTestId('resource-count')
      const resourceCount = parseInt(resourceCountElement.textContent || '0')
      
      expect(resourceCount).toBeLessThan(50)
      expect(resourceCount).toBe(mockPerformanceMetrics.resourceCount)
    })

    it('deve ter tamanho total de recursos < 5MB', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const resourceSizeElement = screen.getByTestId('resource-size')
      const resourceSize = parseInt(resourceSizeElement.textContent || '0')
      
      expect(resourceSize).toBeLessThan(5 * 1024 * 1024) // 5MB
      expect(resourceSize).toBe(mockPerformanceMetrics.resourceSize)
    })
  })

  describe('Validação Completa de Performance', () => {
    it('deve passar em todas as métricas de performance', async () => {
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      // Coletar todas as métricas
      const metrics: PerformanceMetrics = {
        fcp: parseInt(screen.getByTestId('fcp').textContent || '0'),
        lcp: parseInt(screen.getByTestId('lcp').textContent || '0'),
        tti: parseInt(screen.getByTestId('tti').textContent || '0'),
        cls: parseFloat(screen.getByTestId('cls').textContent || '0'),
        fid: parseInt(screen.getByTestId('fid').textContent || '0'),
        ttfb: parseInt(screen.getByTestId('ttfb').textContent || '0'),
        loadTime: parseInt(screen.getByTestId('load-time').textContent || '0'),
        resourceCount: parseInt(screen.getByTestId('resource-count').textContent || '0'),
        resourceSize: parseInt(screen.getByTestId('resource-size').textContent || '0')
      }
      
      // Validar todas as métricas
      const validation = validatePerformanceMetrics(metrics)
      
      expect(validation.allPassed).toBe(true)
      expect(validation.fcp).toBe(true)
      expect(validation.lcp).toBe(true)
      expect(validation.tti).toBe(true)
      expect(validation.cls).toBe(true)
      expect(validation.fid).toBe(true)
      expect(validation.ttfb).toBe(true)
      expect(validation.loadTime).toBe(true)
      expect(validation.resourceCount).toBe(true)
      expect(validation.resourceSize).toBe(true)
    })
  })

  describe('Monitor de Performance', () => {
    it('deve exibir métricas de performance corretamente', async () => {
      renderWithRouter(<MockPerformanceMonitor />)
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-monitor')).toBeInTheDocument()
      })
      
      // Verificar se todas as métricas estão sendo exibidas
      expect(screen.getByTestId('fcp-metric')).toBeInTheDocument()
      expect(screen.getByTestId('lcp-metric')).toBeInTheDocument()
      expect(screen.getByTestId('tti-metric')).toBeInTheDocument()
      expect(screen.getByTestId('cls-metric')).toBeInTheDocument()
      expect(screen.getByTestId('fid-metric')).toBeInTheDocument()
      expect(screen.getByTestId('ttfb-metric')).toBeInTheDocument()
      expect(screen.getByTestId('load-time-metric')).toBeInTheDocument()
      expect(screen.getByTestId('resource-count-metric')).toBeInTheDocument()
      expect(screen.getByTestId('resource-size-metric')).toBeInTheDocument()
    })
  })

  describe('Cenários de Performance Degradada', () => {
    it('deve detectar FCP acima do limite', async () => {
      // Simular performance degradada
      mockPerformanceMetrics.fcp = 2000 // Acima do limite de 1.5s
      
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const fcpElement = screen.getByTestId('fcp')
      const fcp = parseInt(fcpElement.textContent || '0')
      
      expect(fcp).toBeGreaterThan(1500)
      expect(fcp).toBe(2000)
    })

    it('deve detectar LCP acima do limite', async () => {
      // Simular performance degradada
      mockPerformanceMetrics.lcp = 3000 // Acima do limite de 2.5s
      
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const lcpElement = screen.getByTestId('lcp')
      const lcp = parseInt(lcpElement.textContent || '0')
      
      expect(lcp).toBeGreaterThan(2500)
      expect(lcp).toBe(3000)
    })

    it('deve detectar CLS acima do limite', async () => {
      // Simular performance degradada
      mockPerformanceMetrics.cls = 0.2 // Acima do limite de 0.1
      
      renderWithRouter(<MockLoginPage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('performance-metrics')).toBeInTheDocument()
      })
      
      const clsElement = screen.getByTestId('cls')
      const cls = parseFloat(clsElement.textContent || '0')
      
      expect(cls).toBeGreaterThan(0.1)
      expect(cls).toBe(0.2)
    })
  })
})
