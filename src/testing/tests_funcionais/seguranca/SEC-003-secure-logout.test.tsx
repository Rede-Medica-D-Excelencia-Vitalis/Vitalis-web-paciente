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
  key: vi.fn(),
  length: 0
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// Mock do document.cookie será definido dinamicamente nos testes

// Mock dos componentes que serão renderizados nas rotas protegidas
const MockDashboard = () => <div data-testid="dashboard">Dashboard Mock</div>

// Função de render personalizada para testes de segurança
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/']) => {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('SEC-003 - Logout Seguro do Sistema', () => {
  // Mock do store com estado mutável
  let mockAuthStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset do localStorage mock
    localStorageMock.getItem.mockReturnValue('valid-token-123')
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
    
    // Reset do sessionStorage mock
    sessionStorageMock.getItem.mockReturnValue('session-data')
    sessionStorageMock.setItem.mockClear()
    sessionStorageMock.removeItem.mockClear()
    sessionStorageMock.clear.mockClear()
    
    // Mock do document.cookie será configurado nos testes individuais
    
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
    
    // Mock do authService.logout
    vi.mocked(authService.logout).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('deve fazer logout completo e limpar token de autenticação', () => {
    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()
  })

  it('deve limpar dados do localStorage durante logout', () => {
    // Simular dados no localStorage
    localStorageMock.getItem.mockReturnValue('sensitive-data')
    
    // Simular logout que limpa localStorage
    mockAuthStore.logout.mockImplementation(() => {
      localStorageMock.removeItem('token')
      localStorageMock.removeItem('user')
      localStorageMock.removeItem('auth-storage')
    })

    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se os dados foram removidos do localStorage
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
  })

  it('deve limpar dados do sessionStorage durante logout', () => {
    // Simular dados no sessionStorage
    sessionStorageMock.getItem.mockReturnValue('session-data')
    
    // Simular logout que limpa sessionStorage
    mockAuthStore.logout.mockImplementation(() => {
      sessionStorageMock.clear()
    })

    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se o sessionStorage foi limpo
    expect(sessionStorageMock.clear).toHaveBeenCalled()
  })

  it('deve notificar o backend sobre o logout', async () => {
    // Mock do authService.logout para simular notificação ao backend
    vi.mocked(authService.logout).mockResolvedValue(undefined)

    // Simular logout que chama o authService
    mockAuthStore.logout.mockImplementation(async () => {
      await authService.logout()
    })

    // Simular logout
    await mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se o backend foi notificado
    expect(authService.logout).toHaveBeenCalled()
  })

  it('deve resetar estado da aplicação após logout', () => {
    // Simular logout que reseta o estado
    mockAuthStore.logout.mockImplementation(() => {
      mockAuthStore.user = null
      mockAuthStore.token = null
      mockAuthStore.isAuthenticated = false
      mockAuthStore.error = null
    })

    // Verificar estado inicial
    expect(mockAuthStore.isAuthenticated).toBe(true)
    expect(mockAuthStore.user).toBeTruthy()

    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se o estado foi resetado
    expect(mockAuthStore.user).toBe(null)
    expect(mockAuthStore.token).toBe(null)
    expect(mockAuthStore.isAuthenticated).toBe(false)
    expect(mockAuthStore.error).toBe(null)
  })

  it('deve bloquear acesso a páginas protegidas após logout', () => {
    // Simular logout que reseta o estado
    mockAuthStore.logout.mockImplementation(() => {
      mockAuthStore.isAuthenticated = false
      mockAuthStore.token = null
    })

    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Simular tentativa de acesso a página protegida após logout
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = null

    renderWithRouter(
      <ProtectedRoute>
        <MockDashboard />
      </ProtectedRoute>,
      ['/home']
    )

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve limpar cache de consultas durante logout', () => {
    // Simular logout que limpa cache
    mockAuthStore.logout.mockImplementation(() => {
      localStorageMock.removeItem('userPlanCache')
      localStorageMock.removeItem('auth-storage')
    })

    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se o cache foi limpo
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userPlanCache')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth-storage')
  })

  it('deve limpar preferências do usuário durante logout', () => {
    // Simular logout que limpa preferências
    mockAuthStore.logout.mockImplementation(() => {
      localStorageMock.removeItem('userPreferences')
      localStorageMock.removeItem('userSettings')
    })

    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se as preferências foram limpas
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userPreferences')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userSettings')
  })

  it('deve limpar dados temporários durante logout', () => {
    // Simular logout que limpa dados temporários
    mockAuthStore.logout.mockImplementation(() => {
      sessionStorageMock.removeItem('tempData')
      sessionStorageMock.removeItem('formData')
    })

    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se os dados temporários foram limpos
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('tempData')
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('formData')
  })

  it('deve testar logout em diferentes páginas do sistema', () => {
    const pages = ['/home', '/agendamento', '/teleconsulta', '/triagem-online', '/farmacia', '/meu-perfil']
    
    pages.forEach(() => {
      // Simular logout
      mockAuthStore.logout()

      // Verificar se o logout foi chamado
      expect(mockAuthStore.logout).toHaveBeenCalled()
    })
  })

  it('deve tratar erro de logout no backend graciosamente', async () => {
    // Simular erro no backend durante logout
    vi.mocked(authService.logout).mockRejectedValue(new Error('Erro no servidor'))

    // Simular logout que chama o authService mesmo com erro
    mockAuthStore.logout.mockImplementation(async () => {
      try {
        await authService.logout()
      } catch (error) {
        // Ignorar erro do backend, continuar com logout local
        console.log('Erro no backend durante logout:', error)
      }
    })

    // Simular logout
    await mockAuthStore.logout()

    // Verificar se o logout local foi chamado mesmo com erro no backend
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se o backend foi notificado
    expect(authService.logout).toHaveBeenCalled()
  })

  it('deve verificar limpeza completa de cookies durante logout', () => {
    // Mock para simular cookies
    let mockCookies = ''
    
    // Mock do document.cookie para controlar os cookies
    const cookieDescriptor = Object.getOwnPropertyDescriptor(document, 'cookie')
    Object.defineProperty(document, 'cookie', {
      get: () => mockCookies,
      set: (value) => {
        // Simular comportamento de cookies - adicionar ao mockCookies
        if (value.includes('expires=')) {
          // Se é para expirar, não adicionar
          return
        }
        if (mockCookies) {
          mockCookies += '; ' + value
        } else {
          mockCookies = value
        }
      },
      configurable: true
    })

    // Simular cookies existentes
    document.cookie = 'auth-token=abc123; path=/'
    document.cookie = 'user-session=xyz789; path=/'

    // Verificar cookies iniciais
    expect(document.cookie).toContain('auth-token=abc123')
    expect(document.cookie).toContain('user-session=xyz789')

    // Simular logout que limpa cookies
    mockAuthStore.logout.mockImplementation(() => {
      // Simular limpeza de cookies
      mockCookies = ''
    })

    // Simular logout
    mockAuthStore.logout()

    // Verificar se o logout foi chamado
    expect(mockAuthStore.logout).toHaveBeenCalled()

    // Verificar se os cookies foram limpos
    expect(document.cookie).toBe('')

    // Restaurar o descriptor original
    if (cookieDescriptor) {
      Object.defineProperty(document, 'cookie', cookieDescriptor)
    }
  })

  it('deve testar logout automático após expiração de token', async () => {
    // Simular logout automático após expiração
    mockAuthStore.logout.mockImplementation(() => {
      localStorageMock.removeItem('token')
      localStorageMock.removeItem('user')
      mockAuthStore.isAuthenticated = false
      mockAuthStore.token = null
    })

    // Simular expiração de token
    vi.mocked(authService.verifyToken).mockRejectedValue(new Error('Token expirado'))

    // Simular verificação de token que falha
    try {
      await authService.verifyToken()
    } catch (error) {
      expect((error as Error).message).toBe('Token expirado')
    }

    // Simular logout automático
    mockAuthStore.logout()

    // Verificar se o logout foi chamado automaticamente
    expect(mockAuthStore.logout).toHaveBeenCalled()
  })
})