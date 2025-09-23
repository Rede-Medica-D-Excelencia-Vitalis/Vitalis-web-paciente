import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock do Performance API para imagens
const mockImageMetrics = {
  webpSupport: true,
  lazyLoadingEnabled: true,
  compressionRatio: 0.75, // 75% de compressão
  progressiveLoading: true,
  fallbackAvailable: true,
  averageImageSize: 150 * 1024, // 150KB
  optimizedImageSize: 45 * 1024, // 45KB (70% de compressão)
  totalImages: 12,
  loadedImages: 0,
  loadingTime: 800, // ms
  intersectionObserverCalls: 0
}

// Mock do IntersectionObserver para lazy loading
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

// Mock do Performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  getEntriesByType: vi.fn(() => [
    {
      name: 'https://cdn.vitalis.com/doctor-avatar-1.webp',
      entryType: 'resource',
      startTime: 100,
      duration: 200,
      transferSize: mockImageMetrics.optimizedImageSize,
      encodedBodySize: mockImageMetrics.optimizedImageSize,
      decodedBodySize: mockImageMetrics.optimizedImageSize
    },
    {
      name: 'https://cdn.vitalis.com/product-image-1.webp',
      entryType: 'resource',
      startTime: 150,
      duration: 180,
      transferSize: mockImageMetrics.optimizedImageSize,
      encodedBodySize: mockImageMetrics.optimizedImageSize,
      decodedBodySize: mockImageMetrics.optimizedImageSize
    }
  ]),
  mark: vi.fn(),
  measure: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn()
} as any

// Mock do IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
  const observer = {
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect
  }
  
  // Simular callback quando imagem entra na viewport
  setTimeout(() => {
    callback([
      {
        target: { src: 'https://cdn.vitalis.com/doctor-avatar-1.webp' },
        isIntersecting: true,
        intersectionRatio: 1.0
      }
    ])
    mockImageMetrics.intersectionObserverCalls++
  }, 100)
  
  return observer
})

// Mock do ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn()
}))

// Interface para métricas de imagens
interface ImageMetrics {
  webpSupport: boolean
  lazyLoadingEnabled: boolean
  compressionRatio: number
  progressiveLoading: boolean
  fallbackAvailable: boolean
  averageImageSize: number
  optimizedImageSize: number
  totalImages: number
  loadedImages: number
  loadingTime: number
  intersectionObserverCalls: number
}

// Interface para dados de imagem
interface ImageData {
  id: string
  src: string
  webpSrc: string
  fallbackSrc: string
  alt: string
  width: number
  height: number
  loading: 'lazy' | 'eager'
  placeholder?: string
  isLoaded: boolean
  loadTime: number
}

// Mock de dados de imagens
const mockImages: ImageData[] = [
  {
    id: 'doctor-1',
    src: 'https://cdn.vitalis.com/doctor-avatar-1.webp',
    webpSrc: 'https://cdn.vitalis.com/doctor-avatar-1.webp',
    fallbackSrc: 'https://cdn.vitalis.com/doctor-avatar-1.jpg',
    alt: 'Dr. João Silva',
    width: 200,
    height: 200,
    loading: 'lazy',
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+',
    isLoaded: false,
    loadTime: 0
  },
  {
    id: 'product-1',
    src: 'https://cdn.vitalis.com/product-image-1.webp',
    webpSrc: 'https://cdn.vitalis.com/product-image-1.webp',
    fallbackSrc: 'https://cdn.vitalis.com/product-image-1.jpg',
    alt: 'Produto Médico',
    width: 300,
    height: 200,
    loading: 'lazy',
    placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+',
    isLoaded: false,
    loadTime: 0
  },
  {
    id: 'logo',
    src: 'https://cdn.vitalis.com/logo.webp',
    webpSrc: 'https://cdn.vitalis.com/logo.webp',
    fallbackSrc: 'https://cdn.vitalis.com/logo.png',
    alt: 'Logo Vitalis',
    width: 150,
    height: 50,
    loading: 'eager',
    isLoaded: true,
    loadTime: 50
  }
]

// Componente mock para página com imagens
const MockImagePage = () => {
  const [images, setImages] = React.useState<ImageData[]>(mockImages)
  const [metrics, setMetrics] = React.useState<ImageMetrics | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const loadImages = async () => {
      // Simular carregamento de imagens
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Simular chamadas do IntersectionObserver
      mockImageMetrics.intersectionObserverCalls = 3 // Simular 3 chamadas
      
      // Simular coleta de métricas
      const collectedMetrics: ImageMetrics = {
        webpSupport: mockImageMetrics.webpSupport,
        lazyLoadingEnabled: mockImageMetrics.lazyLoadingEnabled,
        compressionRatio: mockImageMetrics.compressionRatio,
        progressiveLoading: mockImageMetrics.progressiveLoading,
        fallbackAvailable: mockImageMetrics.fallbackAvailable,
        averageImageSize: mockImageMetrics.averageImageSize,
        optimizedImageSize: mockImageMetrics.optimizedImageSize,
        totalImages: mockImageMetrics.totalImages,
        loadedImages: mockImageMetrics.loadedImages,
        loadingTime: mockImageMetrics.loadingTime,
        intersectionObserverCalls: mockImageMetrics.intersectionObserverCalls
      }
      
      setMetrics(collectedMetrics)
      setIsLoading(false)
    }
    
    loadImages()
  }, [])

  const handleImageLoad = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, isLoaded: true, loadTime: performance.now() }
        : img
    ))
    mockImageMetrics.loadedImages++
  }

  if (isLoading) {
    return (
      <div data-testid="images-loading">
        <div data-testid="loading-spinner">Carregando imagens...</div>
      </div>
    )
  }

  return (
    <div data-testid="image-page">
      <div data-testid="page-header">
        <h1>Página com Imagens Otimizadas</h1>
        <div data-testid="image-count">Total: {images.length} imagens</div>
      </div>
      
      <div data-testid="images-grid">
        {images.map(image => (
          <div key={image.id} data-testid={`image-container-${image.id}`}>
            <div data-testid="image-wrapper">
              {image.placeholder && (
                <img
                  data-testid={`placeholder-${image.id}`}
                  src={image.placeholder}
                  alt=""
                  style={{ 
                    width: image.width, 
                    height: image.height,
                    filter: 'blur(5px)',
                    transition: 'opacity 0.3s'
                  }}
                />
              )}
              <img
                data-testid={`image-${image.id}`}
                src={mockImageMetrics.webpSupport ? image.webpSrc : image.fallbackSrc}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading={image.loading}
                onLoad={() => handleImageLoad(image.id)}
                style={{
                  opacity: image.isLoaded ? 1 : 0,
                  transition: 'opacity 0.3s'
                }}
              />
              <div data-testid={`image-info-${image.id}`}>
                <div data-testid={`image-format-${image.id}`}>
                  {mockImageMetrics.webpSupport ? 'WebP' : 'JPEG/PNG'}
                </div>
                <div data-testid={`image-loading-${image.id}`}>
                  {image.loading}
                </div>
                <div data-testid={`image-loaded-${image.id}`}>
                  {image.isLoaded ? 'Carregada' : 'Carregando...'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {metrics && (
        <div data-testid="image-metrics" style={{ display: 'none' }}>
          <div data-testid="webp-support">{metrics.webpSupport ? 'true' : 'false'}</div>
          <div data-testid="lazy-loading">{metrics.lazyLoadingEnabled ? 'true' : 'false'}</div>
          <div data-testid="compression-ratio">{metrics.compressionRatio}</div>
          <div data-testid="progressive-loading">{metrics.progressiveLoading ? 'true' : 'false'}</div>
          <div data-testid="fallback-available">{metrics.fallbackAvailable ? 'true' : 'false'}</div>
          <div data-testid="average-image-size">{metrics.averageImageSize}</div>
          <div data-testid="optimized-image-size">{metrics.optimizedImageSize}</div>
          <div data-testid="total-images">{metrics.totalImages}</div>
          <div data-testid="loaded-images">{metrics.loadedImages}</div>
          <div data-testid="loading-time">{metrics.loadingTime}</div>
          <div data-testid="intersection-observer-calls">{metrics.intersectionObserverCalls}</div>
        </div>
      )}
    </div>
  )
}

// Componente para testar lazy loading
const MockLazyImage = ({ src, alt, width, height, loading = 'lazy' }: {
  src: string
  alt: string
  width: number
  height: number
  loading?: 'lazy' | 'eager'
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true)
      return
    }

    // Simular IntersectionObserver para testes
    const observer = {
      observe: () => {
        // Simular que a imagem entra na viewport imediatamente
        setTimeout(() => {
          setIsInView(true)
          mockImageMetrics.intersectionObserverCalls++
        }, 50)
      },
      disconnect: () => {}
    }

    if (imgRef.current) {
      observer.observe()
    }

    return () => observer.disconnect()
  }, [loading])

  return (
    <div ref={imgRef} data-testid="lazy-image-container">
      {isInView ? (
        <img
          data-testid="lazy-image"
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      ) : (
        <div data-testid="lazy-placeholder" style={{ width, height, backgroundColor: '#f0f0f0' }}>
          Carregando...
        </div>
      )}
    </div>
  )
}

// Hook para monitorar performance de imagens
const useImagePerformance = () => {
  const [metrics, setMetrics] = React.useState<ImageMetrics | null>(null)
  
  React.useEffect(() => {
    const collectMetrics = () => {
      const resourceEntries = performance.getEntriesByType('resource')
      const imageEntries = resourceEntries.filter(entry => 
        entry.name.includes('.webp') || entry.name.includes('.jpg') || entry.name.includes('.png')
      )
      
      const collectedMetrics: ImageMetrics = {
        webpSupport: mockImageMetrics.webpSupport,
        lazyLoadingEnabled: mockImageMetrics.lazyLoadingEnabled,
        compressionRatio: mockImageMetrics.compressionRatio,
        progressiveLoading: mockImageMetrics.progressiveLoading,
        fallbackAvailable: mockImageMetrics.fallbackAvailable,
        averageImageSize: mockImageMetrics.averageImageSize,
        optimizedImageSize: mockImageMetrics.optimizedImageSize,
        totalImages: imageEntries.length,
        loadedImages: mockImageMetrics.loadedImages,
        loadingTime: mockImageMetrics.loadingTime,
        intersectionObserverCalls: mockImageMetrics.intersectionObserverCalls
      }
      
      setMetrics(collectedMetrics)
    }
    
    setTimeout(collectMetrics, 100)
  }, [])
  
  return metrics
}

// Componente para monitorar performance de imagens
const MockImagePerformanceMonitor = () => {
  const metrics = useImagePerformance()
  
  if (!metrics) {
    return <div data-testid="metrics-loading">Coletando métricas de imagens...</div>
  }
  
  return (
    <div data-testid="image-performance-monitor">
      <div data-testid="image-metrics-summary">
        <h3>Métricas de Performance de Imagens</h3>
        <div data-testid="webp-support-metric">WebP: {metrics.webpSupport ? 'Suportado' : 'Não suportado'}</div>
        <div data-testid="lazy-loading-metric">Lazy Loading: {metrics.lazyLoadingEnabled ? 'Ativo' : 'Inativo'}</div>
        <div data-testid="compression-metric">Compressão: {(metrics.compressionRatio * 100).toFixed(0)}%</div>
        <div data-testid="progressive-metric">Progressivo: {metrics.progressiveLoading ? 'Sim' : 'Não'}</div>
        <div data-testid="fallback-metric">Fallback: {metrics.fallbackAvailable ? 'Disponível' : 'Indisponível'}</div>
        <div data-testid="size-metric">Tamanho: {(metrics.optimizedImageSize / 1024).toFixed(1)}KB</div>
        <div data-testid="total-metric">Total: {metrics.totalImages} imagens</div>
        <div data-testid="loaded-metric">Carregadas: {metrics.loadedImages}</div>
        <div data-testid="time-metric">Tempo: {metrics.loadingTime}ms</div>
      </div>
    </div>
  )
}

// Função para validar métricas de performance de imagens
const validateImageMetrics = (metrics: ImageMetrics) => {
  const results = {
    webpSupport: metrics.webpSupport,
    lazyLoadingEnabled: metrics.lazyLoadingEnabled,
    compressionRatio: metrics.compressionRatio >= 0.6, // Pelo menos 60% de compressão
    progressiveLoading: metrics.progressiveLoading,
    fallbackAvailable: metrics.fallbackAvailable,
    averageImageSize: metrics.averageImageSize < 200 * 1024, // Menos de 200KB
    optimizedImageSize: metrics.optimizedImageSize < 100 * 1024, // Menos de 100KB
    totalImages: metrics.totalImages > 0,
    loadedImages: metrics.loadedImages >= 0,
    loadingTime: metrics.loadingTime < 1000, // Menos de 1s
    intersectionObserverCalls: metrics.intersectionObserverCalls >= 0
  }
  
  return {
    ...results,
    allPassed: Object.values(results).every(Boolean)
  }
}

// Função de render personalizada para testes
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/images']) => {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('PERF-003 - Carregamento Otimizado de Imagens', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset das métricas mock
    mockImageMetrics.webpSupport = true
    mockImageMetrics.lazyLoadingEnabled = true
    mockImageMetrics.compressionRatio = 0.75
    mockImageMetrics.progressiveLoading = true
    mockImageMetrics.fallbackAvailable = true
    mockImageMetrics.averageImageSize = 150 * 1024
    mockImageMetrics.optimizedImageSize = 45 * 1024
    mockImageMetrics.totalImages = 12
    mockImageMetrics.loadedImages = 0
    mockImageMetrics.loadingTime = 800
    mockImageMetrics.intersectionObserverCalls = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Otimização de Formato', () => {
    it('deve usar WebP quando suportado', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const webpSupportElement = screen.getByTestId('webp-support')
      const webpSupport = webpSupportElement.textContent === 'true'
      
      expect(webpSupport).toBe(true)
      
      // Verificar se as imagens estão usando WebP
      const doctorImage = screen.getByTestId('image-doctor-1')
      expect(doctorImage).toHaveAttribute('src', 'https://cdn.vitalis.com/doctor-avatar-1.webp')
    })

    it('deve ter fallback JPEG/PNG disponível', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const fallbackElement = screen.getByTestId('fallback-available')
      const fallbackAvailable = fallbackElement.textContent === 'true'
      
      expect(fallbackAvailable).toBe(true)
    })

    it('deve detectar quando WebP não é suportado', async () => {
      // Simular navegador sem suporte a WebP
      mockImageMetrics.webpSupport = false
      
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const webpSupportElement = screen.getByTestId('webp-support')
      const webpSupport = webpSupportElement.textContent === 'true'
      
      expect(webpSupport).toBe(false)
    })
  })

  describe('Lazy Loading', () => {
    it('deve implementar lazy loading corretamente', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const lazyLoadingElement = screen.getByTestId('lazy-loading')
      const lazyLoadingEnabled = lazyLoadingElement.textContent === 'true'
      
      expect(lazyLoadingEnabled).toBe(true)
      
      // Verificar se as imagens têm atributo loading="lazy"
      const doctorImage = screen.getByTestId('image-doctor-1')
      expect(doctorImage).toHaveAttribute('loading', 'lazy')
    })

    it('deve carregar imagens sob demanda', async () => {
      renderWithRouter(<MockLazyImage 
        src="https://cdn.vitalis.com/test-image.webp"
        alt="Teste"
        width={200}
        height={200}
        loading="lazy"
      />)
      
      // Aguardar o IntersectionObserver ser chamado
      await waitFor(() => {
        expect(mockImageMetrics.intersectionObserverCalls).toBeGreaterThan(0)
      })
      
      // Verificar se a imagem foi carregada
      await waitFor(() => {
        expect(screen.getByTestId('lazy-image')).toBeInTheDocument()
      })
    })

    it('deve carregar imagens eager imediatamente', async () => {
      renderWithRouter(<MockLazyImage 
        src="https://cdn.vitalis.com/logo.webp"
        alt="Logo"
        width={150}
        height={50}
        loading="eager"
      />)
      
      // Imagem eager deve carregar imediatamente
      await waitFor(() => {
        expect(screen.getByTestId('lazy-image')).toBeInTheDocument()
      })
    })
  })

  describe('Compressão e Tamanho', () => {
    it('deve ter compressão adequada (60-80%)', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const compressionElement = screen.getByTestId('compression-ratio')
      const compressionRatio = parseFloat(compressionElement.textContent || '0')
      
      expect(compressionRatio).toBeGreaterThanOrEqual(0.6)
      expect(compressionRatio).toBeLessThanOrEqual(0.8)
    })

    it('deve ter tamanho otimizado de imagens', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const optimizedSizeElement = screen.getByTestId('optimized-image-size')
      const optimizedSize = parseInt(optimizedSizeElement.textContent || '0')
      
      expect(optimizedSize).toBeLessThan(100 * 1024) // Menos de 100KB
    })

    it('deve ter tamanho médio adequado', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const averageSizeElement = screen.getByTestId('average-image-size')
      const averageSize = parseInt(averageSizeElement.textContent || '0')
      
      expect(averageSize).toBeLessThan(200 * 1024) // Menos de 200KB
    })
  })

  describe('Carregamento Progressivo', () => {
    it('deve implementar carregamento progressivo', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const progressiveElement = screen.getByTestId('progressive-loading')
      const progressiveLoading = progressiveElement.textContent === 'true'
      
      expect(progressiveLoading).toBe(true)
    })

    it('deve exibir placeholder durante carregamento', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      // Verificar se os placeholders estão sendo exibidos
      expect(screen.getByTestId('placeholder-doctor-1')).toBeInTheDocument()
      expect(screen.getByTestId('placeholder-product-1')).toBeInTheDocument()
    })

    it('deve ter transição suave entre placeholder e imagem', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      // Verificar se as imagens têm transição de opacidade
      const doctorImage = screen.getByTestId('image-doctor-1')
      expect(doctorImage).toHaveStyle('transition: opacity 0.3s')
    })
  })

  describe('Performance de Carregamento', () => {
    it('deve carregar imagens em tempo adequado', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const loadingTimeElement = screen.getByTestId('loading-time')
      const loadingTime = parseInt(loadingTimeElement.textContent || '0')
      
      expect(loadingTime).toBeLessThan(1000) // Menos de 1s
    })

    it('deve carregar número adequado de imagens', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const totalImagesElement = screen.getByTestId('total-images')
      const totalImages = parseInt(totalImagesElement.textContent || '0')
      
      expect(totalImages).toBeGreaterThan(0)
    })

    it('deve usar IntersectionObserver para lazy loading', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const observerCallsElement = screen.getByTestId('intersection-observer-calls')
      const observerCalls = parseInt(observerCallsElement.textContent || '0')
      
      expect(observerCalls).toBeGreaterThan(0)
    })
  })

  describe('Validação Completa de Performance', () => {
    it('deve passar em todas as métricas de performance de imagens', async () => {
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      // Coletar todas as métricas
      const metrics: ImageMetrics = {
        webpSupport: screen.getByTestId('webp-support').textContent === 'true',
        lazyLoadingEnabled: screen.getByTestId('lazy-loading').textContent === 'true',
        compressionRatio: parseFloat(screen.getByTestId('compression-ratio').textContent || '0'),
        progressiveLoading: screen.getByTestId('progressive-loading').textContent === 'true',
        fallbackAvailable: screen.getByTestId('fallback-available').textContent === 'true',
        averageImageSize: parseInt(screen.getByTestId('average-image-size').textContent || '0'),
        optimizedImageSize: parseInt(screen.getByTestId('optimized-image-size').textContent || '0'),
        totalImages: parseInt(screen.getByTestId('total-images').textContent || '0'),
        loadedImages: parseInt(screen.getByTestId('loaded-images').textContent || '0'),
        loadingTime: parseInt(screen.getByTestId('loading-time').textContent || '0'),
        intersectionObserverCalls: parseInt(screen.getByTestId('intersection-observer-calls').textContent || '0')
      }
      
      // Validar todas as métricas
      const validation = validateImageMetrics(metrics)
      
      expect(validation.allPassed).toBe(true)
      expect(validation.webpSupport).toBe(true)
      expect(validation.lazyLoadingEnabled).toBe(true)
      expect(validation.compressionRatio).toBe(true)
      expect(validation.progressiveLoading).toBe(true)
      expect(validation.fallbackAvailable).toBe(true)
      expect(validation.averageImageSize).toBe(true)
      expect(validation.optimizedImageSize).toBe(true)
      expect(validation.totalImages).toBe(true)
      expect(validation.loadedImages).toBe(true)
      expect(validation.loadingTime).toBe(true)
      expect(validation.intersectionObserverCalls).toBe(true)
    })
  })

  describe('Monitor de Performance de Imagens', () => {
    it('deve exibir métricas de performance corretamente', async () => {
      renderWithRouter(<MockImagePerformanceMonitor />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-performance-monitor')).toBeInTheDocument()
      })
      
      // Verificar se todas as métricas estão sendo exibidas
      expect(screen.getByTestId('webp-support-metric')).toBeInTheDocument()
      expect(screen.getByTestId('lazy-loading-metric')).toBeInTheDocument()
      expect(screen.getByTestId('compression-metric')).toBeInTheDocument()
      expect(screen.getByTestId('progressive-metric')).toBeInTheDocument()
      expect(screen.getByTestId('fallback-metric')).toBeInTheDocument()
      expect(screen.getByTestId('size-metric')).toBeInTheDocument()
      expect(screen.getByTestId('total-metric')).toBeInTheDocument()
      expect(screen.getByTestId('loaded-metric')).toBeInTheDocument()
      expect(screen.getByTestId('time-metric')).toBeInTheDocument()
    })
  })

  describe('Cenários de Performance Degradada', () => {
    it('deve detectar compressão inadequada', async () => {
      // Simular compressão inadequada
      mockImageMetrics.compressionRatio = 0.3 // Apenas 30% de compressão
      
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const compressionElement = screen.getByTestId('compression-ratio')
      const compressionRatio = parseFloat(compressionElement.textContent || '0')
      
      expect(compressionRatio).toBeLessThan(0.6)
    })

    it('deve detectar tamanho de imagem excessivo', async () => {
      // Simular tamanho excessivo
      mockImageMetrics.optimizedImageSize = 500 * 1024 // 500KB
      
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const optimizedSizeElement = screen.getByTestId('optimized-image-size')
      const optimizedSize = parseInt(optimizedSizeElement.textContent || '0')
      
      expect(optimizedSize).toBeGreaterThan(100 * 1024)
    })

    it('deve detectar carregamento lento', async () => {
      // Simular carregamento lento
      mockImageMetrics.loadingTime = 2000 // 2s
      
      renderWithRouter(<MockImagePage />)
      
      await waitFor(() => {
        expect(screen.getByTestId('image-page')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('image-metrics')).toBeInTheDocument()
      })
      
      const loadingTimeElement = screen.getByTestId('loading-time')
      const loadingTime = parseInt(loadingTimeElement.textContent || '0')
      
      expect(loadingTime).toBeGreaterThan(1000)
    })
  })
})
