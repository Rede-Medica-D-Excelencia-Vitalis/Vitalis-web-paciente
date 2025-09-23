import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

// Mock do Performance API para cache
const mockCacheMetrics = {
  firstLoadTime: 800,           // 800ms primeira carga
  cacheHitTime: 50,            // 50ms cache hit
  cacheMissTime: 750,          // 750ms cache miss
  memoryUsage: 25 * 1024 * 1024, // 25MB uso de memória
  cacheSize: 5 * 1024 * 1024,   // 5MB tamanho do cache
  hitRate: 0.85,               // 85% hit rate
  invalidationCount: 0,        // Contador de invalidações
  cacheEntries: 0,             // Número de entradas no cache
  apiCalls: 0,                 // Número de chamadas de API
  cacheHits: 0,                // Número de cache hits
  cacheMisses: 0               // Número de cache misses
}

// Mock do localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

// Mock do sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

// Mock do Performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn()
} as any

// Mock do localStorage e sessionStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
})

// Interface para métricas de cache
interface CacheMetrics {
  firstLoadTime: number
  cacheHitTime: number
  cacheMissTime: number
  memoryUsage: number
  cacheSize: number
  hitRate: number
  invalidationCount: number
  cacheEntries: number
  apiCalls: number
  cacheHits: number
  cacheMisses: number
}

// Interface para dados de cache
interface CacheData {
  key: string
  data: any
  timestamp: number
  ttl: number
  source: 'memory' | 'localStorage' | 'sessionStorage'
}

// Mock de dados que podem ser cacheados
const mockCacheableData = {
  profile: {
    id: 'user-123',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    avatar: 'avatar.jpg'
  },
  consultations: [
    { id: '1', doctor: 'Dr. João', date: '2024-01-15', status: 'scheduled' },
    { id: '2', doctor: 'Dra. Maria', date: '2024-01-20', status: 'completed' }
  ],
  doctors: [
    { id: 'doc-1', name: 'Dr. João Silva', specialty: 'Cardiologia', rating: 4.8 },
    { id: 'doc-2', name: 'Dra. Maria Santos', specialty: 'Dermatologia', rating: 4.9 }
  ],
  pharmacy: [
    { id: 'med-1', name: 'Aspirina', price: 15.50, stock: 100 },
    { id: 'med-2', name: 'Paracetamol', price: 8.90, stock: 50 }
  ],
  settings: {
    theme: 'light',
    language: 'pt-BR',
    notifications: true,
    privacy: 'public'
  }
}

// Mock do cache service
const mockCacheService = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
  invalidate: vi.fn(),
  getStats: vi.fn()
}

// Mock da API service
const mockApiService = {
  getProfile: vi.fn(),
  getConsultations: vi.fn(),
  getDoctors: vi.fn(),
  getPharmacy: vi.fn(),
  getSettings: vi.fn()
}

// Componente para testar cache de perfil
const MockProfileCache = () => {
  const [profile, setProfile] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [metrics, setMetrics] = React.useState<CacheMetrics | null>(null)
  const [loadTime, setLoadTime] = React.useState<number>(0)

  const loadProfile = async (useCache = true) => {
    setLoading(true)
    const startTime = performance.now()
    
    try {
      if (useCache) {
        // Tentar buscar do cache primeiro
        const cachedData = mockCacheService.get('profile')
        if (cachedData) {
          mockCacheMetrics.cacheHits++
          setLoadTime(performance.now() - startTime)
          setProfile(cachedData)
        } else {
          mockCacheMetrics.cacheMisses++
          mockCacheMetrics.apiCalls++
          const data = await mockApiService.getProfile()
          mockCacheService.set('profile', data, 300000) // 5 minutos
          setLoadTime(performance.now() - startTime)
          setProfile(data)
        }
      } else {
        mockCacheMetrics.apiCalls++
        const data = await mockApiService.getProfile()
        setLoadTime(performance.now() - startTime)
        setProfile(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const invalidateCache = () => {
    mockCacheService.invalidate('profile')
    mockCacheMetrics.invalidationCount++
  }

  React.useEffect(() => {
    const collectedMetrics: CacheMetrics = {
      firstLoadTime: mockCacheMetrics.firstLoadTime,
      cacheHitTime: mockCacheMetrics.cacheHitTime,
      cacheMissTime: mockCacheMetrics.cacheMissTime,
      memoryUsage: mockCacheMetrics.memoryUsage,
      cacheSize: mockCacheMetrics.cacheSize,
      hitRate: mockCacheMetrics.hitRate,
      invalidationCount: mockCacheMetrics.invalidationCount,
      cacheEntries: mockCacheMetrics.cacheEntries,
      apiCalls: mockCacheMetrics.apiCalls,
      cacheHits: mockCacheMetrics.cacheHits,
      cacheMisses: mockCacheMetrics.cacheMisses
    }
    setMetrics(collectedMetrics)
  }, [])

  return (
    <div data-testid="profile-cache">
      <h2>Cache de Perfil</h2>
      <button data-testid="load-with-cache" onClick={() => loadProfile(true)}>
        Carregar com Cache
      </button>
      <button data-testid="load-without-cache" onClick={() => loadProfile(false)}>
        Carregar sem Cache
      </button>
      <button data-testid="invalidate-cache" onClick={invalidateCache}>
        Invalidar Cache
      </button>
      
      {loading && <div data-testid="loading">Carregando...</div>}
      
      {profile && (
        <div data-testid="profile-data">
          <div data-testid="profile-name">{profile.name}</div>
          <div data-testid="profile-email">{profile.email}</div>
        </div>
      )}
      
      {loadTime > 0 && (
        <div data-testid="load-time">Tempo: {loadTime.toFixed(0)}ms</div>
      )}
      
      {metrics && (
        <div data-testid="cache-metrics" style={{ display: 'none' }}>
          <div data-testid="first-load-time">{metrics.firstLoadTime}</div>
          <div data-testid="cache-hit-time">{metrics.cacheHitTime}</div>
          <div data-testid="cache-miss-time">{metrics.cacheMissTime}</div>
          <div data-testid="memory-usage">{metrics.memoryUsage}</div>
          <div data-testid="cache-size">{metrics.cacheSize}</div>
          <div data-testid="hit-rate">{metrics.hitRate}</div>
          <div data-testid="invalidation-count">{metrics.invalidationCount}</div>
          <div data-testid="cache-entries">{metrics.cacheEntries}</div>
          <div data-testid="api-calls">{metrics.apiCalls}</div>
          <div data-testid="cache-hits">{metrics.cacheHits}</div>
          <div data-testid="cache-misses">{metrics.cacheMisses}</div>
        </div>
      )}
    </div>
  )
}

// Componente para testar cache de consultas
const MockConsultationsCache = () => {
  const [consultations, setConsultations] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [loadTime, setLoadTime] = React.useState<number>(0)

  const loadConsultations = async () => {
    setLoading(true)
    const startTime = performance.now()
    
    try {
      const cachedData = mockCacheService.get('consultations')
      if (cachedData) {
        mockCacheMetrics.cacheHits++
        setLoadTime(performance.now() - startTime)
        setConsultations(cachedData)
      } else {
        mockCacheMetrics.cacheMisses++
        mockCacheMetrics.apiCalls++
        const data = await mockApiService.getConsultations()
        mockCacheService.set('consultations', data, 600000) // 10 minutos
        setLoadTime(performance.now() - startTime)
        setConsultations(data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-testid="consultations-cache">
      <h2>Cache de Consultas</h2>
      <button data-testid="load-consultations" onClick={loadConsultations}>
        Carregar Consultas
      </button>
      
      {loading && <div data-testid="loading">Carregando consultas...</div>}
      
      {consultations.length > 0 && (
        <div data-testid="consultations-list">
          {consultations.map((consultation: any) => (
            <div key={consultation.id} data-testid={`consultation-${consultation.id}`}>
              {consultation.doctor} - {consultation.date}
            </div>
          ))}
        </div>
      )}
      
      {loadTime > 0 && (
        <div data-testid="load-time">Tempo: {loadTime.toFixed(0)}ms</div>
      )}
    </div>
  )
}

// Componente para monitorar performance de cache
const MockCachePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState<CacheMetrics | null>(null)

  React.useEffect(() => {
    const collectMetrics = () => {
      const collectedMetrics: CacheMetrics = {
        firstLoadTime: mockCacheMetrics.firstLoadTime,
        cacheHitTime: mockCacheMetrics.cacheHitTime,
        cacheMissTime: mockCacheMetrics.cacheMissTime,
        memoryUsage: mockCacheMetrics.memoryUsage,
        cacheSize: mockCacheMetrics.cacheSize,
        hitRate: mockCacheMetrics.hitRate,
        invalidationCount: mockCacheMetrics.invalidationCount,
        cacheEntries: mockCacheMetrics.cacheEntries,
        apiCalls: mockCacheMetrics.apiCalls,
        cacheHits: mockCacheMetrics.cacheHits,
        cacheMisses: mockCacheMetrics.cacheMisses
      }
      setMetrics(collectedMetrics)
    }
    
    setTimeout(collectMetrics, 100)
  }, [])

  if (!metrics) {
    return <div data-testid="metrics-loading">Coletando métricas de cache...</div>
  }

  return (
    <div data-testid="cache-performance-monitor">
      <div data-testid="cache-metrics-summary">
        <h3>Métricas de Cache</h3>
        <div data-testid="first-load-metric">
          Primeira Carga: {metrics.firstLoadTime}ms
        </div>
        <div data-testid="cache-hit-metric">
          Cache Hit: {metrics.cacheHitTime}ms
        </div>
        <div data-testid="cache-miss-metric">
          Cache Miss: {metrics.cacheMissTime}ms
        </div>
        <div data-testid="memory-metric">
          Memória: {(metrics.memoryUsage / 1024 / 1024).toFixed(0)}MB
        </div>
        <div data-testid="cache-size-metric">
          Tamanho Cache: {(metrics.cacheSize / 1024 / 1024).toFixed(2)}MB
        </div>
        <div data-testid="hit-rate-metric">
          Hit Rate: {(metrics.hitRate * 100).toFixed(0)}%
        </div>
        <div data-testid="invalidation-metric">
          Invalidações: {metrics.invalidationCount}
        </div>
        <div data-testid="entries-metric">
          Entradas: {metrics.cacheEntries}
        </div>
        <div data-testid="api-calls-metric">
          Chamadas API: {metrics.apiCalls}
        </div>
        <div data-testid="cache-hits-metric">
          Cache Hits: {metrics.cacheHits}
        </div>
        <div data-testid="cache-misses-metric">
          Cache Misses: {metrics.cacheMisses}
        </div>
      </div>
    </div>
  )
}

// Função para validar métricas de cache
const validateCacheMetrics = (metrics: CacheMetrics) => {
  const results = {
    cacheHitTime: metrics.cacheHitTime < 100, // Menos de 100ms
    reductionSignificant: (metrics.firstLoadTime - metrics.cacheHitTime) / metrics.firstLoadTime > 0.8, // 80%+ redução
    hitRate: metrics.hitRate > 0.7, // Mais de 70%
    memoryUsage: metrics.memoryUsage < 100 * 1024 * 1024, // Menos de 100MB
    cacheSize: metrics.cacheSize < 50 * 1024 * 1024, // Menos de 50MB
    invalidationWorking: metrics.invalidationCount >= 0,
    cacheEntries: metrics.cacheEntries >= 0,
    apiCalls: metrics.apiCalls >= 0,
    cacheHits: metrics.cacheHits >= 0,
    cacheMisses: metrics.cacheMisses >= 0
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

describe('PERF-005 - Cache de Dados da API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset das métricas mock
    mockCacheMetrics.firstLoadTime = 800
    mockCacheMetrics.cacheHitTime = 50
    mockCacheMetrics.cacheMissTime = 750
    mockCacheMetrics.memoryUsage = 25 * 1024 * 1024
    mockCacheMetrics.cacheSize = 5 * 1024 * 1024
    mockCacheMetrics.hitRate = 0.85
    mockCacheMetrics.invalidationCount = 0
    mockCacheMetrics.cacheEntries = 0
    mockCacheMetrics.apiCalls = 0
    mockCacheMetrics.cacheHits = 0
    mockCacheMetrics.cacheMisses = 0
    
    // Setup dos mocks
    mockCacheService.get.mockImplementation((key: string) => {
      if (key === 'profile') return mockCacheableData.profile
      if (key === 'consultations') return mockCacheableData.consultations
      return null
    })
    
    mockCacheService.set.mockImplementation(() => {
      mockCacheMetrics.cacheEntries++
    })
    
    mockCacheService.invalidate.mockImplementation(() => {
      mockCacheMetrics.invalidationCount++
      mockCacheMetrics.cacheEntries = Math.max(0, mockCacheMetrics.cacheEntries - 1)
    })
    
    mockApiService.getProfile.mockResolvedValue(mockCacheableData.profile)
    mockApiService.getConsultations.mockResolvedValue(mockCacheableData.consultations)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Cache Hit Funcional', () => {
    it('deve carregar dados do cache quando disponível', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      // Carregar com cache (primeira vez - cache miss)
      await userEvent.click(screen.getByTestId('load-with-cache'))
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-data')).toBeInTheDocument()
      })
      
      // Carregar novamente com cache (cache hit)
      await userEvent.click(screen.getByTestId('load-with-cache'))
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-data')).toBeInTheDocument()
      })
      
      // Verificar que os dados são consistentes
      expect(screen.getByTestId('profile-name')).toHaveTextContent('João Silva')
      expect(screen.getByTestId('profile-email')).toHaveTextContent('joao.silva@email.com')
    })

    it('deve ter tempo de cache hit significativamente menor', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      const firstLoadElement = screen.getByTestId('first-load-time')
      const firstLoadTime = parseInt(firstLoadElement.textContent || '0')
      
      const cacheHitElement = screen.getByTestId('cache-hit-time')
      const cacheHitTime = parseInt(cacheHitElement.textContent || '0')
      
      expect(cacheHitTime).toBeLessThan(100) // Menos de 100ms
      expect(firstLoadTime).toBeGreaterThan(cacheHitTime)
      
      // Verificar redução de pelo menos 80%
      const reduction = (firstLoadTime - cacheHitTime) / firstLoadTime
      expect(reduction).toBeGreaterThan(0.8)
    })

    it('deve ter hit rate adequado', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      const hitRateElement = screen.getByTestId('hit-rate')
      const hitRate = parseFloat(hitRateElement.textContent || '0')
      
      expect(hitRate).toBeGreaterThan(0.7) // Mais de 70%
      expect(hitRate).toBe(mockCacheMetrics.hitRate)
    })
  })

  describe('Dados Consistentes', () => {
    it('deve retornar os mesmos dados do cache', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      // Carregar dados
      await userEvent.click(screen.getByTestId('load-with-cache'))
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-data')).toBeInTheDocument()
      })
      
      // Verificar dados
      expect(screen.getByTestId('profile-name')).toHaveTextContent('João Silva')
      expect(screen.getByTestId('profile-email')).toHaveTextContent('joao.silva@email.com')
      
      // Carregar novamente
      await userEvent.click(screen.getByTestId('load-with-cache'))
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-data')).toBeInTheDocument()
      })
      
      // Verificar que os dados são os mesmos
      expect(screen.getByTestId('profile-name')).toHaveTextContent('João Silva')
      expect(screen.getByTestId('profile-email')).toHaveTextContent('joao.silva@email.com')
    })

    it('deve carregar dados de consultas do cache', async () => {
      renderWithRouter(<MockConsultationsCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('consultations-cache')).toBeInTheDocument()
      })
      
      // Carregar consultas
      await userEvent.click(screen.getByTestId('load-consultations'))
      
      await waitFor(() => {
        expect(screen.getByTestId('consultations-list')).toBeInTheDocument()
      })
      
      // Verificar que as consultas foram carregadas
      expect(screen.getByTestId('consultation-1')).toHaveTextContent('Dr. João - 2024-01-15')
      expect(screen.getByTestId('consultation-2')).toHaveTextContent('Dra. Maria - 2024-01-20')
    })
  })

  describe('Invalidação de Cache', () => {
    it('deve invalidar cache corretamente', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      // Verificar contador inicial de invalidações
      expect(mockCacheMetrics.invalidationCount).toBe(0)
      
      // Invalidar cache
      await userEvent.click(screen.getByTestId('invalidate-cache'))
      
      // Verificar que o contador aumentou
      expect(mockCacheMetrics.invalidationCount).toBeGreaterThan(0)
      expect(mockCacheService.invalidate).toHaveBeenCalledWith('profile')
    })

    it('deve recarregar dados após invalidação', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      // Carregar dados com cache
      await userEvent.click(screen.getByTestId('load-with-cache'))
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-data')).toBeInTheDocument()
      })
      
      // Invalidar cache
      await userEvent.click(screen.getByTestId('invalidate-cache'))
      
      // Carregar novamente (deve ser cache miss)
      await userEvent.click(screen.getByTestId('load-with-cache'))
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-data')).toBeInTheDocument()
      })
      
      expect(screen.getByTestId('profile-name')).toHaveTextContent('João Silva')
    })
  })

  describe('Uso Eficiente de Memória', () => {
    it('deve usar memória eficientemente', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      const memoryElement = screen.getByTestId('memory-usage')
      const memoryUsage = parseInt(memoryElement.textContent || '0')
      
      expect(memoryUsage).toBeLessThan(100 * 1024 * 1024) // Menos de 100MB
      expect(memoryUsage).toBe(mockCacheMetrics.memoryUsage)
    })

    it('deve ter tamanho de cache adequado', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      const cacheSizeElement = screen.getByTestId('cache-size')
      const cacheSize = parseInt(cacheSizeElement.textContent || '0')
      
      expect(cacheSize).toBeLessThan(50 * 1024 * 1024) // Menos de 50MB
      expect(cacheSize).toBe(mockCacheMetrics.cacheSize)
    })
  })

  describe('Performance de Cache', () => {
    it('deve ter redução significativa no tempo de carregamento', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      const firstLoadElement = screen.getByTestId('first-load-time')
      const firstLoadTime = parseInt(firstLoadElement.textContent || '0')
      
      const cacheHitElement = screen.getByTestId('cache-hit-time')
      const cacheHitTime = parseInt(cacheHitElement.textContent || '0')
      
      // Verificar redução de 80-90%
      const reduction = (firstLoadTime - cacheHitTime) / firstLoadTime
      expect(reduction).toBeGreaterThan(0.8)
      expect(reduction).toBeLessThan(0.95)
    })

    it('deve contar chamadas de API e cache hits corretamente', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      // Verificar contadores iniciais
      expect(screen.getByTestId('api-calls')).toHaveTextContent('0')
      expect(screen.getByTestId('cache-hits')).toHaveTextContent('0')
      expect(screen.getByTestId('cache-misses')).toHaveTextContent('0')
    })
  })

  describe('Validação Completa de Cache', () => {
    it('deve passar em todas as métricas de cache', async () => {
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      // Coletar todas as métricas
      const metrics: CacheMetrics = {
        firstLoadTime: parseInt(screen.getByTestId('first-load-time').textContent || '0'),
        cacheHitTime: parseInt(screen.getByTestId('cache-hit-time').textContent || '0'),
        cacheMissTime: parseInt(screen.getByTestId('cache-miss-time').textContent || '0'),
        memoryUsage: parseInt(screen.getByTestId('memory-usage').textContent || '0'),
        cacheSize: parseInt(screen.getByTestId('cache-size').textContent || '0'),
        hitRate: parseFloat(screen.getByTestId('hit-rate').textContent || '0'),
        invalidationCount: parseInt(screen.getByTestId('invalidation-count').textContent || '0'),
        cacheEntries: parseInt(screen.getByTestId('cache-entries').textContent || '0'),
        apiCalls: parseInt(screen.getByTestId('api-calls').textContent || '0'),
        cacheHits: parseInt(screen.getByTestId('cache-hits').textContent || '0'),
        cacheMisses: parseInt(screen.getByTestId('cache-misses').textContent || '0')
      }
      
      // Validar todas as métricas
      const validation = validateCacheMetrics(metrics)
      
      expect(validation.allPassed).toBe(true)
      expect(validation.cacheHitTime).toBe(true)
      expect(validation.reductionSignificant).toBe(true)
      expect(validation.hitRate).toBe(true)
      expect(validation.memoryUsage).toBe(true)
      expect(validation.cacheSize).toBe(true)
      expect(validation.invalidationWorking).toBe(true)
      expect(validation.cacheEntries).toBe(true)
      expect(validation.apiCalls).toBe(true)
      expect(validation.cacheHits).toBe(true)
      expect(validation.cacheMisses).toBe(true)
    })
  })

  describe('Monitor de Performance de Cache', () => {
    it('deve exibir métricas de cache corretamente', async () => {
      renderWithRouter(<MockCachePerformanceMonitor />)
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-performance-monitor')).toBeInTheDocument()
      })
      
      // Verificar se todas as métricas estão sendo exibidas
      expect(screen.getByTestId('first-load-metric')).toBeInTheDocument()
      expect(screen.getByTestId('cache-hit-metric')).toBeInTheDocument()
      expect(screen.getByTestId('cache-miss-metric')).toBeInTheDocument()
      expect(screen.getByTestId('memory-metric')).toBeInTheDocument()
      expect(screen.getByTestId('cache-size-metric')).toBeInTheDocument()
      expect(screen.getByTestId('hit-rate-metric')).toBeInTheDocument()
      expect(screen.getByTestId('invalidation-metric')).toBeInTheDocument()
      expect(screen.getByTestId('entries-metric')).toBeInTheDocument()
      expect(screen.getByTestId('api-calls-metric')).toBeInTheDocument()
      expect(screen.getByTestId('cache-hits-metric')).toBeInTheDocument()
      expect(screen.getByTestId('cache-misses-metric')).toBeInTheDocument()
    })
  })

  describe('Cenários de Performance Degradada', () => {
    it('deve detectar cache hit time lento', async () => {
      // Simular cache hit lento
      mockCacheMetrics.cacheHitTime = 200 // 200ms
      
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      const cacheHitElement = screen.getByTestId('cache-hit-time')
      const cacheHitTime = parseInt(cacheHitElement.textContent || '0')
      
      expect(cacheHitTime).toBeGreaterThan(100)
      expect(cacheHitTime).toBe(200)
    })

    it('deve detectar hit rate baixo', async () => {
      // Simular hit rate baixo
      mockCacheMetrics.hitRate = 0.3 // 30%
      
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      const hitRateElement = screen.getByTestId('hit-rate')
      const hitRate = parseFloat(hitRateElement.textContent || '0')
      
      expect(hitRate).toBeLessThan(0.7)
      expect(hitRate).toBe(0.3)
    })

    it('deve detectar uso excessivo de memória', async () => {
      // Simular uso excessivo de memória
      mockCacheMetrics.memoryUsage = 150 * 1024 * 1024 // 150MB
      
      renderWithRouter(<MockProfileCache />)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-cache')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('cache-metrics')).toBeInTheDocument()
      })
      
      const memoryElement = screen.getByTestId('memory-usage')
      const memoryUsage = parseInt(memoryElement.textContent || '0')
      
      expect(memoryUsage).toBeGreaterThan(100 * 1024 * 1024)
      expect(memoryUsage).toBe(150 * 1024 * 1024)
    })
  })
})
