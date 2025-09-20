import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '../utils'
import { Farmacia } from '../../../screens/Farmacia/Farmacia'

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/farmacia' }),
  }
})

// Mock do useApi hook
vi.mock('../../../hooks/api/useApi', () => ({
  useApi: vi.fn()
}))

// Mock do pharmacyService
vi.mock('../../../services/pharmacy/pharmacyService', () => ({
  pharmacyService: {
    getProducts: vi.fn(),
    getPromotionalProducts: vi.fn(),
    getBestSellers: vi.fn(),
    getPartnerPharmacies: vi.fn(),
    addToCart: vi.fn(),
  },
}))

// Mock do categoriaService
vi.mock('../../../lib/api', async () => {
  const actual = await vi.importActual('../../../lib/api')
  return {
    ...actual,
    categoriaService: {
      getCategoriasFormatadas: vi.fn(),
    },
  }
})

// Mock do useCartStore
vi.mock('../../../store/business', () => ({
  useCartStore: () => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
  }),
}))

describe('FARM-001 - Visualização de Produtos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve acessar farmácia e carregar a página inicial', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Verificar se a página carregou
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar se o título e descrição estão presentes
    expect(screen.getByText('Medicamentos e produtos de saúde com entrega rápida e segura')).toBeInTheDocument()
    
    // Verificar se o contador do carrinho está presente
    expect(screen.getByText('Itens no carrinho')).toBeInTheDocument()
    
    // Verificar se o botão "Ver Carrinho" está presente
    expect(screen.getByText('Ver Carrinho')).toBeInTheDocument()
  })

  it('deve verificar estrutura da página da farmácia', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Verificar se a página carregou
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar se as seções principais estão presentes
    expect(screen.getByText('Farmácias Parceiras')).toBeInTheDocument()
    
    // Verificar se as abas estão presentes (usando getAllByText para evitar conflitos)
    expect(screen.getAllByText('Mais Vendidos')).toHaveLength(2) // Título e botão
    expect(screen.getByText('Mais Procurados')).toBeInTheDocument()
    expect(screen.getAllByText('Ofertas Especiais')).toHaveLength(3) // 2 títulos e 1 botão
  })

  it('deve verificar layout responsivo da página', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Verificar se a página carregou
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar se o layout está estruturado corretamente
    const header = screen.getByText('🏥 Farmácia Vitalis').closest('div')
    expect(header).toBeInTheDocument()
    
    // Verificar se o botão do carrinho está presente
    const cartButton = screen.getByText('Ver Carrinho')
    expect(cartButton).toBeInTheDocument()
    expect(cartButton).toBeEnabled()
  })

  it('deve verificar funcionalidade do carrinho', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Verificar se a página carregou
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar contador do carrinho
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Itens no carrinho')).toBeInTheDocument()
    
    // Verificar botão do carrinho
    const cartButton = screen.getByText('Ver Carrinho')
    expect(cartButton).toBeInTheDocument()
    expect(cartButton).toBeEnabled()
  })

  it('deve verificar navegação da página', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Verificar se a página carregou
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar se o botão de navegação está funcionando
    const cartButton = screen.getByText('Ver Carrinho')
    expect(cartButton).toBeInTheDocument()
    
    // Simular clique no botão (isso deve chamar o mockNavigate)
    cartButton.click()
    
    // Verificar se o mockNavigate foi chamado
    expect(mockNavigate).toHaveBeenCalledWith('/cart')
  })

  it('deve verificar estrutura de abas de produtos', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Verificar se a página carregou
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar se as abas estão presentes e funcionais (usando getAllByText para evitar conflitos)
    expect(screen.getAllByText('Mais Vendidos')).toHaveLength(2) // Título e botão
    expect(screen.getByText('Mais Procurados')).toBeInTheDocument()
    expect(screen.getAllByText('Ofertas Especiais')).toHaveLength(3) // 2 títulos e 1 botão
    
    // Verificar se as abas são clicáveis
    const tabMaisVendidos = screen.getAllByText('Mais Vendidos')[1] // Pegar o botão (segundo elemento)
    const tabMaisProcurados = screen.getByText('Mais Procurados')
    const tabOfertas = screen.getAllByText('Ofertas Especiais')[2] // Pegar o botão (terceiro elemento)
    
    expect(tabMaisVendidos).toBeEnabled()
    expect(tabMaisProcurados).toBeEnabled()
    expect(tabOfertas).toBeEnabled()
  })

  it('deve verificar seção de farmácias parceiras', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Verificar se a página carregou
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar seção de farmácias parceiras
    expect(screen.getByText('Farmácias Parceiras')).toBeInTheDocument()
    
    // Verificar mensagem quando não há farmácias parceiras
    expect(screen.getByText('Nenhuma farmácia parceira disponível no momento.')).toBeInTheDocument()
  })

  it('deve verificar newsletter da farmácia', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: vi.fn(),
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Verificar se a página carregou
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar seção de newsletter
    expect(screen.getByText('Fique por dentro das novidades!')).toBeInTheDocument()
    expect(screen.getByText('Receba ofertas exclusivas e novidades em primeira mão')).toBeInTheDocument()
    
    // Verificar campo de email
    const emailInput = screen.getByPlaceholderText('Seu melhor e-mail')
    expect(emailInput).toBeInTheDocument()
    
    // Verificar botão de inscrição
    const subscribeButton = screen.getByText('Inscrever')
    expect(subscribeButton).toBeInTheDocument()
    expect(subscribeButton).toBeEnabled()
  })
})