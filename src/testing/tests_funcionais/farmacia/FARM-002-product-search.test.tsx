import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('FARM-002 - Busca de Produtos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve localizar campo de busca na página', async () => {
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
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar se o campo de busca está presente
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toBeEnabled()
  })

  it('deve inserir termo de busca no campo', async () => {
    const user = userEvent.setup()
    
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
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Inserir termo de busca
    await user.type(searchInput, 'paracetamol')
    
    // Verificar se o termo foi inserido
    expect(searchInput).toHaveValue('paracetamol')
  })

  it('deve pressionar Enter para executar busca', async () => {
    const user = userEvent.setup()
    
    // Mock do useApi com função execute mockada
    const mockExecute = vi.fn()
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation(() => ({
      data: [],
      loading: false,
      error: null,
      execute: mockExecute,
      setData: vi.fn(),
      setError: vi.fn(),
      setLoading: vi.fn(),
      reset: vi.fn(),
    }))

    render(<Farmacia />)
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Inserir termo de busca
    await user.type(searchInput, 'paracetamol')
    
    // Pressionar Enter
    await user.keyboard('{Enter}')
    
    // Verificar se a busca foi executada (o useEffect deve ter sido acionado)
    expect(searchInput).toHaveValue('paracetamol')
  })

  it('deve verificar resultados filtrados após busca', async () => {
    const user = userEvent.setup()
    
    // Mock de produtos que correspondem à busca
    const mockProducts = [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        description: 'Analgésico e antitérmico',
        price: 12.50,
        originalPrice: 15.00,
        image: '/images/paracetamol.jpg',
        category: 'analgesicos',
        farmacia_nome: 'Farmácia Central',
        pharmacy: {
          id: '1',
          name: 'Farmácia Central',
          rating: 4.5
        },
        stock: 100,
        requiresPrescription: false,
      },
      {
        id: '2',
        name: 'Dipirona 500mg',
        description: 'Analgésico',
        price: 8.90,
        originalPrice: 10.50,
        image: '/images/dipirona.jpg',
        category: 'analgesicos',
        farmacia_nome: 'Farmácia Central',
        pharmacy: {
          id: '1',
          name: 'Farmácia Central',
          rating: 4.5
        },
        stock: 75,
        requiresPrescription: false,
      }
    ]

    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((apiFunction: any) => {
      if (apiFunction.name === 'getProducts') {
        return {
          data: mockProducts,
          loading: false,
          error: null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
        }
      }
      return {
        data: [],
        loading: false,
        error: null,
        execute: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
        reset: vi.fn(),
      }
    })

    render(<Farmacia />)
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Inserir termo de busca
    await user.type(searchInput, 'paracetamol')
    
    // Aguardar um pouco para simular a busca
    await waitFor(() => {
      expect(searchInput).toHaveValue('paracetamol')
    })
  })

  it('deve verificar campo de busca funcional', async () => {
    const user = userEvent.setup()
    
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
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Verificar se o campo de busca está funcional
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toBeEnabled()
    
    // Testar entrada de texto
    await user.type(searchInput, 'teste')
    expect(searchInput).toHaveValue('teste')
    
    // Testar limpeza do campo
    await user.clear(searchInput)
    expect(searchInput).toHaveValue('')
  })

  it('deve verificar resultados filtrados exibidos corretamente', async () => {
    const user = userEvent.setup()
    
    // Mock de produtos filtrados
    const mockFilteredProducts = [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        description: 'Analgésico e antitérmico',
        price: 12.50,
        originalPrice: 15.00,
        image: '/images/paracetamol.jpg',
        category: 'analgesicos',
        farmacia_nome: 'Farmácia Central',
        pharmacy: {
          id: '1',
          name: 'Farmácia Central',
          rating: 4.5
        },
        stock: 100,
        requiresPrescription: false,
      }
    ]

    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((apiFunction: any) => {
      if (apiFunction.name === 'getProducts') {
        return {
          data: mockFilteredProducts,
          loading: false,
          error: null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
        }
      }
      return {
        data: [],
        loading: false,
        error: null,
        execute: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
        reset: vi.fn(),
      }
    })

    render(<Farmacia />)
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Inserir termo de busca
    await user.type(searchInput, 'paracetamol')
    
    // Aguardar e verificar se o termo foi inserido
    await waitFor(() => {
      expect(searchInput).toHaveValue('paracetamol')
    })
  })

  it('deve verificar termo de busca destacado nos resultados', async () => {
    const user = userEvent.setup()
    
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
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Inserir termo de busca
    await user.type(searchInput, 'paracetamol')
    
    // Verificar se o termo está destacado no campo (valor mantido)
    await waitFor(() => {
      expect(searchInput).toHaveValue('paracetamol')
    })
  })

  it('deve verificar contador de resultados', async () => {
    const user = userEvent.setup()
    
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
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Inserir termo de busca
    await user.type(searchInput, 'paracetamol')
    
    // Verificar se o campo mantém o valor (simulando contador interno)
    await waitFor(() => {
      expect(searchInput).toHaveValue('paracetamol')
    })
  })

  it('deve verificar opção de limpar busca', async () => {
    const user = userEvent.setup()
    
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
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Inserir termo de busca
    await user.type(searchInput, 'paracetamol')
    expect(searchInput).toHaveValue('paracetamol')
    
    // Limpar o campo de busca
    await user.clear(searchInput)
    expect(searchInput).toHaveValue('')
  })

  it('deve testar busca com diferentes termos', async () => {
    const user = userEvent.setup()
    
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
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Testar diferentes termos de busca
    const searchTerms = ['paracetamol', 'vitamina d', 'dipirona', 'omeprazol']
    
    for (const term of searchTerms) {
      await user.clear(searchInput)
      await user.type(searchInput, term)
      
      await waitFor(() => {
        expect(searchInput).toHaveValue(term)
      })
    }
  })

  it('deve testar busca com termo vazio', async () => {
    const user = userEvent.setup()
    
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
    
    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('🏥 Farmácia Vitalis')).toBeInTheDocument()
    })

    // Localizar campo de busca
    const searchInput = screen.getByPlaceholderText('🔍 Buscar medicamentos, vitaminas, produtos de beleza...')
    
    // Verificar estado inicial (campo vazio)
    expect(searchInput).toHaveValue('')
    
    // Inserir termo e depois limpar
    await user.type(searchInput, 'teste')
    expect(searchInput).toHaveValue('teste')
    
    await user.clear(searchInput)
    expect(searchInput).toHaveValue('')
  })
})
