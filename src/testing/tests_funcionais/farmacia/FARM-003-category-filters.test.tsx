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

describe('FARM-003 - Filtros de Categoria', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve visualizar seção de categorias na página', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((apiFunction: any): any => {
      if (apiFunction.name === 'getBestSellers') {
        return {
          data: [
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
          ],
          loading: false,
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
          error: null as string | null,
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

    // Verificar se a seção de categorias está presente
    expect(screen.getByText('Categorias em Destaque')).toBeInTheDocument()
    
    // Verificar se o botão "Todos" está presente
    expect(screen.getByText('Todos')).toBeInTheDocument()
  })

  it('deve clicar no botão "Todos" para limpar filtro', async () => {
    const user = userEvent.setup()
    
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((apiFunction: any): any => {
      if (apiFunction.name === 'getBestSellers') {
        return {
          data: [
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
          ],
          loading: false,
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
          error: null as string | null,
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

    // Clicar no botão "Todos"
    const todosButton = screen.getByText('Todos')
    await user.click(todosButton)
    
    // Verificar se o botão "Todos" está selecionado
    await waitFor(() => {
      expect(todosButton.closest('button')).toHaveClass('bg-gradient-to-br')
    })
  })

  it('deve verificar estrutura da seção de categorias', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((apiFunction: any): any => {
      if (apiFunction.name === 'getBestSellers') {
        return {
          data: [
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
          ],
          loading: false,
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
          error: null as string | null,
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

    // Verificar se a seção de categorias está presente
    expect(screen.getByText('Categorias em Destaque')).toBeInTheDocument()
    
    // Verificar se o botão "Todos" está presente e funcional
    const todosButton = screen.getByText('Todos')
    expect(todosButton).toBeInTheDocument()
    expect(todosButton.closest('button')).toBeInTheDocument()
  })

  it('deve verificar funcionalidade básica dos filtros de categoria', async () => {
    const user = userEvent.setup()
    
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((apiFunction: any): any => {
      if (apiFunction.name === 'getBestSellers') {
        return {
          data: [
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
          ],
          loading: false,
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
          error: null as string | null,
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

    // Verificar se a seção de categorias está presente
    expect(screen.getByText('Categorias em Destaque')).toBeInTheDocument()
    
    // Verificar se o botão "Todos" está presente e clicável
    const todosButton = screen.getByText('Todos')
    expect(todosButton).toBeInTheDocument()
    
    // Clicar no botão "Todos"
    await user.click(todosButton)
    
    // Verificar se o botão está selecionado
    await waitFor(() => {
      expect(todosButton.closest('button')).toHaveClass('bg-gradient-to-br')
    })
  })

  it('deve verificar interface de categorias', async () => {
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((apiFunction: any): any => {
      if (apiFunction.name === 'getBestSellers') {
        return {
          data: [
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
          ],
          loading: false,
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
          error: null as string | null,
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

    // Verificar se a seção de categorias está presente
    expect(screen.getByText('Categorias em Destaque')).toBeInTheDocument()
    
    // Verificar se o botão "Todos" está presente com ícone
    const todosButton = screen.getByText('Todos')
    expect(todosButton).toBeInTheDocument()
    
    // Verificar se o ícone do hospital está presente
    expect(screen.getByText('🏥')).toBeInTheDocument()
  })

  it('deve testar interação com filtros de categoria', async () => {
    const user = userEvent.setup()
    
    // Mock do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((apiFunction: any): any => {
      if (apiFunction.name === 'getBestSellers') {
        return {
          data: [
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
          ],
          loading: false,
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
          error: null as string | null,
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

    // Verificar se a seção de categorias está presente
    expect(screen.getByText('Categorias em Destaque')).toBeInTheDocument()
    
    // Testar múltiplos cliques no botão "Todos"
    const todosButton = screen.getByText('Todos')
    
    // Primeiro clique
    await user.click(todosButton)
    await waitFor(() => {
      expect(todosButton.closest('button')).toHaveClass('bg-gradient-to-br')
    })
    
    // Segundo clique
    await user.click(todosButton)
    await waitFor(() => {
      expect(todosButton.closest('button')).toHaveClass('bg-gradient-to-br')
    })
  })
})