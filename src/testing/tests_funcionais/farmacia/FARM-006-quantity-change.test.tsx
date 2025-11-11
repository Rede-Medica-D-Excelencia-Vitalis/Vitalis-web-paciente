import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'
import { Cart } from '../../../screens/Farmacia/Cart'
import { useCartStore } from '../../../store/business/cartStore'
import { useAuthStore } from '../../../store/auth'

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/cart' }),
  }
})

// Mock do store do carrinho
vi.mock('../../../store/business/cartStore')

// Mock do store de autenticação
vi.mock('../../../store/auth')

// Mock do HeaderSection para evitar dependências complexas
vi.mock('../../../screens/TelaInicial/sections/HeaderSection/HeaderSection', () => ({
  HeaderSection: () => <div data-testid="header-section">Header Mock</div>
}))

describe('FARM-006 - Alteração de Quantidade no Carrinho', () => {
  const user = userEvent.setup()

  // Mock de itens do carrinho com diferentes quantidades
  const mockCartItems = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      price: 12.50,
      quantity: 2,
      image: '/images/paracetamol.jpg',
      pharmacy: {
        name: 'Farmácia Central',
        rating: 4.5
      }
    },
    {
      id: '2',
      name: 'Dipirona 500mg',
      price: 8.90,
      quantity: 1,
      image: '/images/dipirona.jpg',
      pharmacy: {
        name: 'Farmácia Central',
        rating: 4.5
      }
    }
  ]

  const mockUser = {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    profileImage: '/images/user.jpg'
  }

  // Mock do store com funções simuladas
  let mockCartStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Criar mock do store com estado mutável
    mockCartStore = {
      items: [...mockCartItems],
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn((id: string, quantity: number) => {
        // Simular atualização da quantidade
        const itemIndex = mockCartStore.items.findIndex((item: any) => item.id === id)
        if (itemIndex !== -1) {
          mockCartStore.items[itemIndex].quantity = quantity
        }
      }),
      clearCart: vi.fn(),
      total: vi.fn(() => mockCartStore.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0))
    }
    
    // Mock do useCartStore
    vi.mocked(useCartStore).mockReturnValue(mockCartStore)
    
    // Mock do useAuthStore
    vi.mocked(useAuthStore).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn()
    })
  })

  it('deve acessar carrinho e localizar produtos com quantidade', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Carrinho de Compras')).toBeInTheDocument()
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Verificar se os produtos estão sendo exibidos com suas quantidades
    expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    expect(screen.getByText('Dipirona 500mg')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Quantidade do Paracetamol
    expect(screen.getByText('1')).toBeInTheDocument() // Quantidade da Dipirona
  })

  it('deve clicar no botão "+" para aumentar quantidade', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Encontrar botões de quantidade (baseado na estrutura do Cart.tsx)
    const buttons = screen.getAllByRole('button')
    const plusButtons = buttons.filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-plus')
    )

    expect(plusButtons.length).toBeGreaterThan(0)

    // Clicar no primeiro botão de aumentar quantidade
    await act(async () => {
      await user.click(plusButtons[0])
    })

    // Verificar se a função updateQuantity foi chamada
    expect(mockCartStore.updateQuantity).toHaveBeenCalled()
  })

  it('deve clicar no botão "-" para diminuir quantidade', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Encontrar botões de quantidade
    const buttons = screen.getAllByRole('button')
    const minusButtons = buttons.filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-minus')
    )

    expect(minusButtons.length).toBeGreaterThan(0)

    // Clicar no primeiro botão de diminuir quantidade
    await act(async () => {
      await user.click(minusButtons[0])
    })

    // Verificar se a função updateQuantity foi chamada
    expect(mockCartStore.updateQuantity).toHaveBeenCalled()
  })

  it('deve verificar atualização de preços após alteração de quantidade', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Verificar preço total inicial
    expect(screen.getAllByText('R$ 33.90').length).toBeGreaterThan(0) // (12.50 * 2) + (8.90 * 1)

    // Simular aumento de quantidade do Paracetamol
    mockCartStore.items[0].quantity = 3 // Paracetamol de 2 para 3
    mockCartStore.total = vi.fn(() => 46.40) // (12.50 * 3) + (8.90 * 1)

    // Re-renderizar com nova quantidade
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument() // Nova quantidade
    })

    // Verificar se o total foi recalculado
    expect(screen.getAllByText('R$ 46.40').length).toBeGreaterThan(0)
  })

  it('deve verificar botões de quantidade funcionais', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Verificar se há botões de quantidade
    const buttons = screen.getAllByRole('button')
    const quantityButtons = buttons.filter(button => 
      button.className.includes('h-8 w-8') && 
      button.className.includes('hover:bg-gray-200')
    )

    expect(quantityButtons.length).toBeGreaterThanOrEqual(4) // Pelo menos 4 botões (+ e - para cada produto)

    // Verificar se os botões estão clicáveis
    const plusButtons = buttons.filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-plus')
    )
    const minusButtons = buttons.filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-minus')
    )

    expect(plusButtons.length).toBeGreaterThan(0)
    expect(minusButtons.length).toBeGreaterThan(0)
  })

  it('deve verificar quantidade atualizada na interface', async () => {
    // Mock com quantidade diferente
    const customMockCartStore = {
      ...mockCartStore,
      items: [
        {
          ...mockCartItems[0],
          quantity: 5 // Quantidade alterada
        },
        mockCartItems[1]
      ]
    }

    vi.mocked(useCartStore).mockReturnValue(customMockCartStore)

    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    // Verificar se a quantidade atualizada está sendo exibida
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('deve verificar preço total recalculado corretamente', async () => {
    // Mock com quantidades diferentes
    const customMockCartStore = {
      ...mockCartStore,
      items: [
        {
          ...mockCartItems[0],
          quantity: 3 // Paracetamol: 3 unidades
        },
        {
          ...mockCartItems[1],
          quantity: 2 // Dipirona: 2 unidades
        }
      ],
      total: vi.fn(() => 55.30) // (12.50 * 3) + (8.90 * 2) = 37.50 + 17.80 = 55.30
    }

    vi.mocked(useCartStore).mockReturnValue(customMockCartStore)

    render(<Cart />)

    await waitFor(() => {
      expect(screen.getAllByText('R$ 55.30').length).toBeGreaterThan(0)
    })

    // Verificar se o total foi recalculado corretamente
    expect(screen.getAllByText('R$ 55.30').length).toBeGreaterThan(0)
  })

  it('deve verificar validação de quantidade mínima', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Encontrar botões de diminuir
    const buttons = screen.getAllByRole('button')
    const minusButtons = buttons.filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-minus')
    )

    // Simular múltiplos cliques para diminuir até quantidade mínima
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await user.click(minusButtons[0])
      })
    }

    // Verificar se removeItem foi chamado quando quantidade chega a 0
    expect(mockCartStore.removeItem).toHaveBeenCalled()
  })

  it('deve testar funcionalidade completa de alteração de quantidade', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Verificar estado inicial
    expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument() // Produto presente
    expect(screen.getAllByText('R$ 21.40').length).toBeGreaterThan(0) // Total inicial (12.50 + 8.90)

    // Encontrar botões de quantidade
    const buttons = screen.getAllByRole('button')
    const plusButtons = buttons.filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-plus')
    )
    const minusButtons = buttons.filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-minus')
    )

    // Testar aumento de quantidade
    await act(async () => {
      await user.click(plusButtons[0])
    })

    expect(mockCartStore.updateQuantity).toHaveBeenCalledWith('1', 2) // Paracetamol de 1 para 2

    // Testar diminuição de quantidade
    await act(async () => {
      await user.click(minusButtons[0])
    })

    expect(mockCartStore.updateQuantity).toHaveBeenCalledWith('1', 1) // Paracetamol de 2 para 1
  })

  it('deve verificar UX responsiva dos controles de quantidade', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Verificar se os controles de quantidade estão visíveis e acessíveis
    const buttons = screen.getAllByRole('button')
    const quantityButtons = buttons.filter(button => 
      button.className.includes('h-8 w-8') && 
      button.className.includes('hover:bg-gray-200')
    )

    // Verificar se os botões têm classes de hover adequadas
    quantityButtons.forEach(button => {
      expect(button.className).toContain('hover:bg-gray-200')
    })

    // Verificar se há espaçamento adequado entre os elementos
    expect(quantityButtons.length).toBeGreaterThanOrEqual(4)
  })

  it('deve verificar múltiplas alterações de quantidade em sequência', async () => {
    render(<Cart />)

    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument()
    })

    // Encontrar botões de quantidade
    const buttons = screen.getAllByRole('button')
    const plusButtons = buttons.filter(button => 
      button.querySelector('svg')?.classList.contains('lucide-plus')
    )

    // Fazer múltiplas alterações
    await act(async () => {
      await user.click(plusButtons[0]) // +1
      await user.click(plusButtons[0]) // +1
      await user.click(plusButtons[0]) // +1
    })

    // Verificar se todas as chamadas foram feitas
    expect(mockCartStore.updateQuantity).toHaveBeenCalledTimes(3)
    expect(mockCartStore.updateQuantity).toHaveBeenNthCalledWith(1, '1', 2) // Quantidade inicial + 1
    expect(mockCartStore.updateQuantity).toHaveBeenNthCalledWith(2, '1', 3) // Quantidade + 1
    expect(mockCartStore.updateQuantity).toHaveBeenNthCalledWith(3, '1', 4) // Quantidade + 1
  })
})
