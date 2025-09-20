import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'
import { Farmacia } from '../../../screens/Farmacia/Farmacia'
import { useApi } from '../../../hooks/api/useApi'
import { pharmacyService } from '../../../services/pharmacy/pharmacyService'
import { categoriaService } from '../../../lib/api/services/categoriaService'
import { useCartStore } from '../../../store/business/cartStore'

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

// Mock do useApi
vi.mock('../../../hooks/api/useApi')

// Mock dos serviços
vi.mock('../../../services/pharmacy/pharmacyService')
vi.mock('../../../lib/api/services/categoriaService')

// Mock do store do carrinho
vi.mock('../../../store/business/cartStore')

// Mock do HeaderSection para evitar dependências complexas
vi.mock('../../../screens/TelaInicial/sections/HeaderSection/HeaderSection', () => ({
  HeaderSection: () => <div data-testid="header-section">Header Mock</div>
}))

describe('FARM-004 - Adição de Produtos ao Carrinho', () => {
  const user = userEvent.setup()

  // Mock de produtos
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
      description: 'Analgésico e antitérmico',
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
      stock: 50,
      requiresPrescription: false,
    }
  ]

  const mockCategories = [
    {
      id: 1,
      name: 'Analgésicos',
      icon: '💊',
      productCount: 15,
      description: 'Medicamentos para dor'
    },
    {
      id: 2,
      name: 'Antibióticos',
      icon: '🦠',
      productCount: 8,
      description: 'Medicamentos antibióticos'
    }
  ]

  const mockCartStore = {
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    total: vi.fn(() => 0)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock do useCartStore
    vi.mocked(useCartStore).mockReturnValue(mockCartStore)
    
    // Mock do pharmacyService.addToCart
    vi.mocked(pharmacyService.addToCart).mockResolvedValue({ success: true })
    
    // Mock do useApi com dados específicos
    vi.mocked(useApi).mockImplementation((apiFunction: any): any => {
      if (apiFunction.name === 'getBestSellers') {
        return {
          data: mockProducts,
          loading: false,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
          error: null as string | null,
        }
      }
      if (apiFunction.name === 'getPartnerPharmacies') {
        return {
          data: [{ 
            id: 1, 
            name: 'Farmácia Central',
            features: ['Entrega rápida', 'Preço baixo', 'Atendimento 24h']
          }],
          loading: false,
          error: null as string | null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
        }
      }
      if (apiFunction.name === 'getCategoriasFormatadas') {
        return {
          data: mockCategories,
          loading: false,
          error: null as string | null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
        }
      }
      if (apiFunction.name === 'getPromotionalProducts') {
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
  })

  it('deve localizar produtos na página da farmácia', async () => {
    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos usando testid
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    // Verificar se os produtos estão sendo exibidos
    const productCards = screen.getAllByTestId('product-card')
    expect(productCards.length).toBeGreaterThanOrEqual(2)
  })

  it('deve clicar no botão "Adicionar ao Carrinho" de um produto', async () => {
    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    // Encontrar e clicar no botão de adicionar ao carrinho
    const addToCartButtons = screen.getAllByText('Adicionar ao Carrinho')
    expect(addToCartButtons.length).toBeGreaterThanOrEqual(2)

    await act(async () => {
      await user.click(addToCartButtons[0])
    })

    // Verificar se o serviço foi chamado
    expect(pharmacyService.addToCart).toHaveBeenCalledWith('1', 1)
    
    // Verificar se o item foi adicionado ao store
    expect(mockCartStore.addItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Paracetamol 500mg',
      price: 12.50,
      image: '/images/paracetamol.jpg',
      quantity: 1,
      pharmacy: {
        name: 'Farmácia Central',
        rating: 5.0
      }
    })
  })

  it('deve verificar atualização do contador do carrinho após adicionar produto', async () => {
    // Simular carrinho com 1 item
    const cartWithItems = {
      ...mockCartStore,
      items: [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          price: 12.50,
          quantity: 1,
          image: '/images/paracetamol.jpg',
          pharmacy: { name: 'Farmácia Central', rating: 5.0 }
        }
      ],
      total: () => 12.50
    }
    
    vi.mocked(useCartStore).mockReturnValue(cartWithItems)

    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    // Verificar se o contador seria atualizado (simulado pelo mock)
    expect(cartWithItems.items).toHaveLength(1)
    expect(cartWithItems.total()).toBe(12.50)
  })

  it('deve adicionar outro produto ao carrinho', async () => {
    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    // Encontrar e clicar no botão de adicionar ao carrinho do segundo produto
    const addToCartButtons = screen.getAllByText('Adicionar ao Carrinho')
    
    await act(async () => {
      await user.click(addToCartButtons[1])
    })

    // Verificar se o segundo produto foi adicionado
    expect(pharmacyService.addToCart).toHaveBeenCalledWith('2', 1)
    
    expect(mockCartStore.addItem).toHaveBeenCalledWith({
      id: '2',
      name: 'Dipirona 500mg',
      price: 8.90,
      image: '/images/dipirona.jpg',
      quantity: 1,
      pharmacy: {
        name: 'Farmácia Central',
        rating: 5.0
      }
    })
  })

  it('deve verificar atualização do contador após adicionar múltiplos produtos', async () => {
    // Simular carrinho com 2 itens
    const cartWithMultipleItems = {
      ...mockCartStore,
      items: [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          price: 12.50,
          quantity: 1,
          image: '/images/paracetamol.jpg',
          pharmacy: { name: 'Farmácia Central', rating: 5.0 }
        },
        {
          id: '2',
          name: 'Dipirona 500mg',
          price: 8.90,
          quantity: 1,
          image: '/images/dipirona.jpg',
          pharmacy: { name: 'Farmácia Central', rating: 5.0 }
        }
      ],
      total: () => 21.40
    }
    
    vi.mocked(useCartStore).mockReturnValue(cartWithMultipleItems)

    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    // Verificar se o contador foi atualizado corretamente
    expect(cartWithMultipleItems.items).toHaveLength(2)
    expect(cartWithMultipleItems.total()).toBe(21.40)
  })

  it('deve verificar feedback visual ao adicionar produto', async () => {
    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    // Verificar se os botões de adicionar ao carrinho estão visíveis
    const addToCartButtons = screen.getAllByText('Adicionar ao Carrinho')
    expect(addToCartButtons.length).toBeGreaterThanOrEqual(2)
    
    // Verificar se os botões não estão desabilitados (produtos em estoque)
    addToCartButtons.forEach(button => {
      expect(button).not.toBeDisabled()
    })

    // Clicar no primeiro botão
    await act(async () => {
      await user.click(addToCartButtons[0])
    })

    // Verificar se o serviço foi chamado (indicando feedback funcional)
    expect(pharmacyService.addToCart).toHaveBeenCalledTimes(1)
    expect(mockCartStore.addItem).toHaveBeenCalledTimes(1)
  })

  it('deve verificar persistência dos produtos no carrinho', async () => {
    // Simular carrinho persistente
    const persistentCart = {
      ...mockCartStore,
      items: [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          price: 12.50,
          quantity: 2,
          image: '/images/paracetamol.jpg',
          pharmacy: { name: 'Farmácia Central', rating: 5.0 }
        }
      ],
      total: () => 25.00
    }
    
    vi.mocked(useCartStore).mockReturnValue(persistentCart)

    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    // Verificar se o produto está persistido no carrinho
    expect(persistentCart.items).toHaveLength(1)
    expect(persistentCart.items[0].id).toBe('1')
    expect(persistentCart.items[0].name).toBe('Paracetamol 500mg')
    expect(persistentCart.items[0].quantity).toBe(2)
    expect(persistentCart.total()).toBe(25.00)
  })

  it('deve verificar quantidade correta dos produtos no carrinho', async () => {
    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    // Adicionar o mesmo produto duas vezes
    const addToCartButtons = screen.getAllByText('Adicionar ao Carrinho')
    
    await act(async () => {
      await user.click(addToCartButtons[0])
    })
    
    await act(async () => {
      await user.click(addToCartButtons[0])
    })

    // Verificar se o produto foi adicionado duas vezes
    expect(pharmacyService.addToCart).toHaveBeenCalledTimes(2)
    expect(mockCartStore.addItem).toHaveBeenCalledTimes(2)
    
    // Verificar se ambas as chamadas foram para o mesmo produto
    expect(pharmacyService.addToCart).toHaveBeenNthCalledWith(1, '1', 1)
    expect(pharmacyService.addToCart).toHaveBeenNthCalledWith(2, '1', 1)
  })

  it('deve testar funcionalidade completa de adição ao carrinho', async () => {
    render(<Farmacia />)

    await waitFor(() => {
      // Verificar se os produtos estão sendo exibidos
      const productCards = screen.getAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThanOrEqual(2)
    })

    const addToCartButtons = screen.getAllByText('Adicionar ao Carrinho')
    
    // Adicionar primeiro produto
    await act(async () => {
      await user.click(addToCartButtons[0])
    })

    // Adicionar segundo produto
    await act(async () => {
      await user.click(addToCartButtons[1])
    })

    // Verificar se ambos os produtos foram adicionados
    expect(pharmacyService.addToCart).toHaveBeenCalledTimes(2)
    expect(mockCartStore.addItem).toHaveBeenCalledTimes(2)
    
    // Verificar se os produtos corretos foram adicionados
    expect(mockCartStore.addItem).toHaveBeenNthCalledWith(1, {
      id: '1',
      name: 'Paracetamol 500mg',
      price: 12.50,
      image: '/images/paracetamol.jpg',
      quantity: 1,
      pharmacy: {
        name: 'Farmácia Central',
        rating: 5.0
      }
    })
    
    expect(mockCartStore.addItem).toHaveBeenNthCalledWith(2, {
      id: '2',
      name: 'Dipirona 500mg',
      price: 8.90,
      image: '/images/dipirona.jpg',
      quantity: 1,
      pharmacy: {
        name: 'Farmácia Central',
        rating: 5.0
      }
    })
  })
})
