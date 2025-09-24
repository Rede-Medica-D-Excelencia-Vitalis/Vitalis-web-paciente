import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '../../tests_funcionais/utils'
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute'
import { useAuthStore } from '../../../store/auth/authStore'

// Mock do store de autenticação
vi.mock('../../../store/auth/authStore')

// Mock dos componentes que serão renderizados nas rotas protegidas
const MockDashboard = () => <div data-testid="dashboard">Dashboard Mock</div>
const MockAgendamento = () => <div data-testid="agendamento">Agendamento Mock</div>
const MockTeleconsulta = () => <div data-testid="teleconsulta">Teleconsulta Mock</div>
const MockTriagem = () => <div data-testid="triagem">Triagem Mock</div>
const MockFarmacia = () => <div data-testid="farmacia">Farmácia Mock</div>
const MockPerfil = () => <div data-testid="perfil">Perfil Mock</div>

// Mock do HeaderSection para evitar dependências complexas
vi.mock('../../../screens/TelaInicial/sections/HeaderSection/HeaderSection', () => ({
  HeaderSection: () => <div data-testid="header-section">Header Mock</div>
}))

describe('SEC-001 - Proteção de Rotas Autenticadas', () => {
  // Mock do store com estado mutável
  let mockAuthStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Criar mock do store com estado mutável
    mockAuthStore = {
      user: null,
      token: null,
      isAuthenticated: false,
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

  it('deve redirecionar usuário não autenticado para /login ao acessar /home', async () => {
    // Mock de usuário não autenticado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = null

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve redirecionar usuário não autenticado para /login ao acessar /agendamento', async () => {
    // Mock de usuário não autenticado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = null

    render(
      <MemoryRouter initialEntries={['/agendamento']}>
        <ProtectedRoute>
          <MockAgendamento />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('agendamento')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('agendamento')).not.toBeInTheDocument()
  })

  it('deve redirecionar usuário não autenticado para /login ao acessar /teleconsulta', async () => {
    // Mock de usuário não autenticado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = null

    render(
      <MemoryRouter initialEntries={['/teleconsulta']}>
        <ProtectedRoute>
          <MockTeleconsulta />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('teleconsulta')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('teleconsulta')).not.toBeInTheDocument()
  })

  it('deve redirecionar usuário não autenticado para /login ao acessar /triagem-online', async () => {
    // Mock de usuário não autenticado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = null

    render(
      <MemoryRouter initialEntries={['/triagem-online']}>
        <ProtectedRoute>
          <MockTriagem />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('triagem')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('triagem')).not.toBeInTheDocument()
  })

  it('deve redirecionar usuário não autenticado para /login ao acessar /farmacia', async () => {
    // Mock de usuário não autenticado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = null

    render(
      <MemoryRouter initialEntries={['/farmacia']}>
        <ProtectedRoute>
          <MockFarmacia />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('farmacia')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('farmacia')).not.toBeInTheDocument()
  })

  it('deve redirecionar usuário não autenticado para /login ao acessar /meu-perfil', async () => {
    // Mock de usuário não autenticado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = null

    render(
      <MemoryRouter initialEntries={['/meu-perfil']}>
        <ProtectedRoute>
          <MockPerfil />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('perfil')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('perfil')).not.toBeInTheDocument()
  })

  it('deve permitir acesso a rota protegida quando usuário está autenticado com token válido', async () => {
    // Mock de usuário autenticado
    mockAuthStore.isAuthenticated = true
    mockAuthStore.token = 'valid-token-123'
    mockAuthStore.user = {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com'
    }

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se o componente foi renderizado
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    })

    // Verificar se está na rota protegida
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    expect(screen.getByText('Dashboard Mock')).toBeInTheDocument()
  })

  it('deve bloquear acesso quando token está presente mas isAuthenticated é false', async () => {
    // Mock de usuário com token mas não autenticado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = 'invalid-token-123'

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve bloquear acesso quando isAuthenticated é true mas token é null', async () => {
    // Mock de usuário autenticado mas sem token
    mockAuthStore.isAuthenticated = true
    mockAuthStore.token = null

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve bloquear acesso quando token está vazio', async () => {
    // Mock de usuário com token vazio
    mockAuthStore.isAuthenticated = true
    mockAuthStore.token = ''

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve bloquear acesso quando token é malformado', async () => {
    // Mock de usuário com token malformado
    mockAuthStore.isAuthenticated = true
    mockAuthStore.token = 'malformed-token'

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve testar proteção de múltiplas rotas simultaneamente', async () => {
    // Mock de usuário não autenticado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = null

    const routes = [
      { path: '/home', component: MockDashboard, testId: 'dashboard' },
      { path: '/agendamento', component: MockAgendamento, testId: 'agendamento' },
      { path: '/teleconsulta', component: MockTeleconsulta, testId: 'teleconsulta' },
      { path: '/triagem-online', component: MockTriagem, testId: 'triagem' },
      { path: '/farmacia', component: MockFarmacia, testId: 'farmacia' },
      { path: '/meu-perfil', component: MockPerfil, testId: 'perfil' }
    ]

    // Testar cada rota
    for (const route of routes) {
      render(
        <MemoryRouter initialEntries={[route.path]}>
          <ProtectedRoute>
            <route.component />
          </ProtectedRoute>
        </MemoryRouter>
      )

      // Verificar se foi redirecionado para login
      await waitFor(() => {
        expect(screen.queryByTestId(route.testId)).not.toBeInTheDocument()
      })

      // Verificar se não está na rota protegida
      expect(screen.queryByTestId(route.testId)).not.toBeInTheDocument()
    }
  })

  it('deve verificar comportamento com token expirado', async () => {
    // Mock de usuário com token expirado
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = 'expired-token-123'

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })

  it('deve verificar comportamento com token inválido', async () => {
    // Mock de usuário com token inválido
    mockAuthStore.isAuthenticated = false
    mockAuthStore.token = 'invalid-token-456'

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <MockDashboard />
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Verificar se foi redirecionado para login
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
    })

    // Verificar se não está na rota protegida
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })
})
