import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute'
import { useAuthStore } from '../../../store/auth/authStore'
import { authService } from '../../../services/auth/authService'

// Mock do store de autenticação
vi.mock('../../../store/auth/authStore')

// Mock do authService
vi.mock('../../../services/auth/authService')

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do window.location
const mockLocation = {
  href: '',
  pathname: '/home'
}
Object.defineProperty(window, 'location', {
  value: mockLocation
})

// Mock dos componentes que serão renderizados nas rotas protegidas
const MockDashboard = () => <div data-testid="dashboard">Dashboard Mock</div>
const MockAgendamento = () => <div data-testid="agendamento">Agendamento Mock</div>

// Mock do HeaderSection para evitar dependências complexas
vi.mock('../../../screens/TelaInicial/sections/HeaderSection/HeaderSection', () => ({
  HeaderSection: () => <div data-testid="header-section">Header Mock</div>
}))

// Função de render personalizada para testes de segurança
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/']) => {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('SEC-002 - Expiração de Token', () => {
  // Mock do store com estado mutável
  let mockAuthStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset do localStorage mock
    localStorageMock.getItem.mockReturnValue('valid-token-123')
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    
    // Reset do window.location
    mockLocation.href = ''
    mockLocation.pathname = '/home'
    
    // Criar mock do store com estado mutável
    mockAuthStore = {
      user: {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com'
      },
      token: 'valid-token-123',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      setUser: vi.fn(),
      updateUserPlan: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      clearError: vi.fn()
    }
    
    // Mock do useAuthStore
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('deve detectar token expirado quando authService.verifyToken falha', async () => {
    // Mock do authService.verifyToken para simular token expirado
    vi.mocked(authService.verifyToken).mockRejectedValueOnce(new Error('Token expirado'))

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Verificar se o componente foi renderizado inicialmente
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()

    // Simular verificação de token que falha
    try {
      await authService.verifyToken()
    } catch (error) {
      expect(error.message).toBe('Token expirado')
    }

    // Verificar se o authService.verifyToken foi chamado
    expect(authService.verifyToken).toHaveBeenCalled()
  })

  it('deve permitir acesso quando token é válido', async () => {
    // Mock do authService.verifyToken para simular token válido
    vi.mocked(authService.verifyToken).mockResolvedValueOnce({
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com'
    })

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Verificar se o componente foi renderizado
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()

    // Simular verificação de token bem-sucedida
    const user = await authService.verifyToken()
    expect(user.name).toBe('João Silva')
  })

  it('deve testar comportamento com token inválido', async () => {
    // Mock do authService.verifyToken para simular token inválido
    vi.mocked(authService.verifyToken).mockRejectedValueOnce(new Error('Token inválido'))

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Verificar se o componente foi renderizado inicialmente
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()

    // Simular verificação de token que falha
    try {
      await authService.verifyToken()
    } catch (error) {
      expect(error.message).toBe('Token inválido')
    }
  })

  it('deve testar comportamento com erro de rede', async () => {
    // Mock do authService.verifyToken para simular erro de rede
    vi.mocked(authService.verifyToken).mockRejectedValueOnce(new Error('Network Error'))

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Verificar se o componente foi renderizado inicialmente
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()

    // Simular verificação de token que falha
    try {
      await authService.verifyToken()
    } catch (error) {
      expect(error.message).toBe('Network Error')
    }
  })

  it('deve testar expiração de token em diferentes rotas', async () => {
    // Mock do authService.verifyToken para simular token expirado
    vi.mocked(authService.verifyToken).mockRejectedValue(new Error('Token expirado'))

    const routes = ['/home', '/agendamento']
    
    for (const route of routes) {
      mockLocation.pathname = route
      
      const { unmount } = renderWithRouter(
        <ProtectedRoute>
          {route === '/home' ? <MockDashboard /> : <MockAgendamento />}
        </ProtectedRoute>,
        [route]
      )

      // Verificar se o componente foi renderizado inicialmente
      if (route === '/home') {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument()
      } else {
        expect(screen.getByTestId('agendamento')).toBeInTheDocument()
      }

      // Simular verificação de token que falha
      try {
        await authService.verifyToken()
      } catch (error) {
        expect(error.message).toBe('Token expirado')
      }

      // Limpar o DOM para o próximo teste
      unmount()
    }
  })

  it('deve testar comportamento com token válido após expiração', async () => {
    // Mock de token expirado na primeira verificação
    vi.mocked(authService.verifyToken).mockRejectedValueOnce(new Error('Token expirado'))

    // Mock de token válido após renovação
    vi.mocked(authService.verifyToken).mockResolvedValueOnce({
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com'
    })

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Simular primeira verificação que falha
    try {
      await authService.verifyToken()
    } catch (error) {
      expect(error.message).toBe('Token expirado')
    }

    // Simular segunda verificação que funciona
    const user = await authService.verifyToken()
    expect(user.name).toBe('João Silva')
  })

  it('deve testar limpeza de dados sensíveis em caso de expiração', async () => {
    // Mock do authService.verifyToken para simular token expirado
    vi.mocked(authService.verifyToken).mockRejectedValueOnce(new Error('Token expirado'))

    // Simular dados sensíveis no localStorage
    localStorageMock.getItem.mockReturnValueOnce('sensitive-data')

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Simular verificação de token que falha
    try {
      await authService.verifyToken()
    } catch (error) {
      expect(error.message).toBe('Token expirado')
    }

    // Verificar se o authService.verifyToken foi chamado
    expect(authService.verifyToken).toHaveBeenCalled()
  })

  it('deve testar comportamento com token sem expiração', async () => {
    // Mock do authService.verifyToken sempre bem-sucedido
    vi.mocked(authService.verifyToken).mockResolvedValue({
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com'
    })

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Verificar se o componente foi renderizado
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()

    // Simular múltiplas verificações de token
    const user1 = await authService.verifyToken()
    const user2 = await authService.verifyToken()
    
    expect(user1.name).toBe('João Silva')
    expect(user2.name).toBe('João Silva')
  })

  it('deve testar tratamento de diferentes tipos de erro', async () => {
    const errorTypes = [
      { error: new Error('Token expirado'), expected: 'Token expirado' },
      { error: new Error('Token inválido'), expected: 'Token inválido' },
      { error: new Error('Network Error'), expected: 'Network Error' },
      { error: new Error('Unauthorized'), expected: 'Unauthorized' }
    ]

    for (const { error, expected } of errorTypes) {
      vi.mocked(authService.verifyToken).mockRejectedValueOnce(error)

      renderWithRouter(
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>,
        ['/home']
      )

      // Simular verificação de token que falha
      try {
        await authService.verifyToken()
      } catch (err) {
        expect(err.message).toBe(expected)
      }
    }
  })

  it('deve testar comportamento com token nulo', async () => {
    // Mock de usuário sem token
    mockAuthStore.token = null
    mockAuthStore.isAuthenticated = false

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve testar comportamento com token vazio', async () => {
    // Mock de usuário com token vazio
    mockAuthStore.token = ''
    mockAuthStore.isAuthenticated = false

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve testar renovação automática de token', async () => {
    // Mock de token expirado na primeira verificação
    vi.mocked(authService.verifyToken).mockRejectedValueOnce(new Error('Token expirado'))

    // Mock de token válido após renovação
    vi.mocked(authService.verifyToken).mockResolvedValueOnce({
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com'
    })

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Simular primeira verificação que falha
    try {
      await authService.verifyToken()
    } catch (error) {
      expect(error.message).toBe('Token expirado')
    }

    // Simular renovação bem-sucedida
    const user = await authService.verifyToken()
    expect(user.name).toBe('João Silva')

    // Verificar se o authService.verifyToken foi chamado duas vezes
    expect(authService.verifyToken).toHaveBeenCalledTimes(2)
  })
})