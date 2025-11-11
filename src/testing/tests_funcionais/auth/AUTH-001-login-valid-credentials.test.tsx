import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'

// Mock do authService
vi.mock('../../../services/auth/authService', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({
      token: 'mock-jwt-token-123456789',
      user: {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        birthdate: '1990-01-01',
        address: {
          cep: '01234-567',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP'
        },
        plan: {
          id: '1',
          name: 'Plano Básico',
          price: 99.90,
          period: 'month',
          nextBilling: '2024-02-01'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    })
  }
}))

// Mock do useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock do useAuthStore
const mockLogin = vi.fn()
const mockSetError = vi.fn()
const mockClearError = vi.fn()

vi.mock('../../../store/auth/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    login: mockLogin,
    setError: mockSetError,
    clearError: mockClearError,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }))
}))

// Import após os mocks
import Login from '../../../screens/Auth/Login'

describe('AUTH-001 - Login com Credenciais Válidas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve realizar login com sucesso e redirecionar para /home', async () => {
    const user = userEvent.setup()
    
    render(<Login />)

    // Verificar se a página de login foi carregada corretamente
    expect(screen.getByText('Bem-vindo de volta! Faça login para continuar.')).toBeInTheDocument()
    
    // Buscar inputs por placeholder ou tipo
    const emailInput = screen.getByPlaceholderText('joao@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()

    // Preencher campos de login com credenciais válidas
    await user.type(emailInput, 'joao@email.com')
    await user.type(passwordInput, 'senha123')

    // Verificar se os campos foram preenchidos corretamente
    expect(screen.getByDisplayValue('joao@email.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('senha123')).toBeInTheDocument()

    // Clicar no botão de login
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    // Aguardar um pouco para o processo de login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    }, { timeout: 3000 })

    // Verificar se não há mensagens de erro
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument()
  })

  it('deve validar que todos os campos obrigatórios estão preenchidos', async () => {
    render(<Login />)

    // Verificar se os campos são obrigatórios
    const emailInput = screen.getByPlaceholderText('joao@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('deve permitir alternar visibilidade da senha', async () => {
    const user = userEvent.setup()
    
    render(<Login />)

    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    // Buscar o botão de toggle por aria-label ou por posição
    const toggleButton = screen.getByRole('button', { name: /mostrar senha|ocultar senha/i })

    // Senha deve estar oculta por padrão
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Clicar para mostrar senha
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    // Clicar para ocultar senha novamente
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('deve exibir loading durante o processo de login', async () => {
    const user = userEvent.setup()
    
    // Mock com delay para testar loading
    const authService = await import('../../../services/auth/authService')
    authService.authService.login.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        token: 'mock-token',
        user: { id: '1', name: 'Test' }
      }), 100))
    )
    
    render(<Login />)

    const emailInput = screen.getByPlaceholderText('joao@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    await user.type(emailInput, 'joao@email.com')
    await user.type(passwordInput, 'senha123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    // Verificar se o botão está desabilitado durante o loading
    const loginButton = screen.getByRole('button', { name: /entrar/i })
    expect(loginButton).toBeDisabled()
  })
})