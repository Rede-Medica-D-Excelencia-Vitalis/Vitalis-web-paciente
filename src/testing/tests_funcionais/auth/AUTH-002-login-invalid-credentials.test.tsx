import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'

// Mock do authService
vi.mock('../../../services/auth/authService', () => ({
  authService: {
    login: vi.fn().mockRejectedValue({
      response: {
        data: {
          message: 'Credenciais inválidas'
        }
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

describe('AUTH-002 - Login com Credenciais Inválidas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve exibir mensagem de erro para credenciais inválidas', async () => {
    const user = userEvent.setup()
    
    render(<Login />)

    // Verificar se a página de login foi carregada corretamente
    expect(screen.getByText('Bem-vindo de volta! Faça login para continuar.')).toBeInTheDocument()
    
    // Buscar inputs por placeholder
    const emailInput = screen.getByPlaceholderText('joao@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()

    // Preencher campos com credenciais inválidas
    await user.type(emailInput, 'usuario@invalido.com')
    await user.type(passwordInput, 'senhaerrada')

    // Verificar se os campos foram preenchidos
    expect(screen.getByDisplayValue('usuario@invalido.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('senhaerrada')).toBeInTheDocument()

    // Clicar no botão de login
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /entrar/i }))
    })

    // Verificar se a mensagem de erro é exibida
    await waitFor(() => {
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verificar se não houve redirecionamento
    expect(mockNavigate).not.toHaveBeenCalled()

    // Verificar se o usuário não foi logado
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('deve exibir erro específico do backend quando disponível', async () => {
    const user = userEvent.setup()
    
   
    
    render(<Login />)

    const emailInput = screen.getByPlaceholderText('joao@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    await act(async () => {
      await user.type(emailInput, 'email@naoexiste.com')
      await user.type(passwordInput, 'senha123')
      await user.click(screen.getByRole('button', { name: /entrar/i }))
    })

    // Verificar se a mensagem específica do backend é exibida
    await waitFor(() => {
      expect(screen.getByText('Usuário não encontrado')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verificar se não houve redirecionamento
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('deve manter valores nos campos após erro', async () => {
    const user = userEvent.setup()
    
    render(<Login />)

    const emailInput = screen.getByPlaceholderText('joao@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    // Preencher campos
    await act(async () => {
      await user.type(emailInput, 'usuario@invalido.com')
      await user.type(passwordInput, 'senhaerrada')
      await user.click(screen.getByRole('button', { name: /entrar/i }))
    })

    // Aguardar erro aparecer
    await waitFor(() => {
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verificar se os campos mantêm os valores
    expect(screen.getByDisplayValue('usuario@invalido.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('senhaerrada')).toBeInTheDocument()
  })

  it('deve exibir mensagem de erro genérica quando não há resposta do backend', async () => {
    const user = userEvent.setup()
    
    // Mock com erro genérico (sem response)
    const authService = await import('../../../services/auth/authService')
    vi.mocked(authService.authService.login).mockRejectedValueOnce(new Error('Network error'))
    
    render(<Login />)

    const emailInput = screen.getByPlaceholderText('joao@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    await act(async () => {
      await user.type(emailInput, 'usuario@invalido.com')
      await user.type(passwordInput, 'senhaerrada')
      await user.click(screen.getByRole('button', { name: /entrar/i }))
    })

    // Verificar se a mensagem de erro genérica é exibida
    await waitFor(() => {
      expect(screen.getByText(/Erro ao fazer login/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('deve limpar erro anterior antes de nova tentativa', async () => {
    const user = userEvent.setup()
    
    render(<Login />)

    const emailInput = screen.getByPlaceholderText('joao@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    // Primeira tentativa com erro
    await act(async () => {
      await user.type(emailInput, 'usuario@invalido.com')
      await user.type(passwordInput, 'senhaerrada')
      await user.click(screen.getByRole('button', { name: /entrar/i }))
    })

    // Aguardar erro aparecer
    await waitFor(() => {
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    // Limpar campos e tentar novamente
    await act(async () => {
      await user.clear(emailInput)
      await user.clear(passwordInput)
      await user.type(emailInput, 'novo@email.com')
      await user.type(passwordInput, 'novasenha')
      await user.click(screen.getByRole('button', { name: /entrar/i }))
    })

    // Verificar se clearError foi chamado
    await waitFor(() => {
      expect(mockClearError).toHaveBeenCalled()
    })
  })
})
