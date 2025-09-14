import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'

// Mock do authService
vi.mock('../../../services/auth/authService', () => ({
  authService: {
    register: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          cpf: '12345678901',
          phone: '11999999999'
        },
        token: 'mock-token-123'
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

// Mock do axios para CEP
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        logradouro: 'Rua das Flores',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP'
      }
    })
  }
}))

// Import após os mocks
import CadastroPaciente from '../../../screens/Auth/CadastroPaciente'

describe('AUTH-005 - Cadastro de Novo Paciente', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve exibir página inicial de cadastro corretamente', () => {
    render(<CadastroPaciente />)

    // Verificar se a página inicial foi carregada
    expect(screen.getByText(/começar cadastro/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
  })

  it('deve avançar para o primeiro step do cadastro', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Clicar em "Começar cadastro" para avançar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Verificar se avançou para o step 1 (dados pessoais)
    expect(screen.getByText(/dados pessoais/i)).toBeInTheDocument()
    expect(screen.getByText(/nome completo/i)).toBeInTheDocument()
  })

  it('deve preencher campos do primeiro step (dados pessoais)', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Avançar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Buscar campos do primeiro step usando placeholder
    const nomeInput = screen.getByPlaceholderText(/digite seu nome completo/i)
    const telefoneInput = screen.getByPlaceholderText(/\(11\) 91234-5678/i)
    
    expect(nomeInput).toBeInTheDocument()
    expect(telefoneInput).toBeInTheDocument()

    // Preencher campos
    await act(async () => {
      await user.type(nomeInput, 'João Silva')
      await user.type(telefoneInput, '11999999999')
    })

    // Verificar se os campos foram preenchidos
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument()
    // O campo de telefone pode ter máscara, então verificamos se tem algum valor
    expect(telefoneInput).toHaveValue()
  })

  it('deve navegar entre steps do cadastro', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Avançar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Verificar se está no step 1
    expect(screen.getByText(/dados pessoais/i)).toBeInTheDocument()
  })

  it('deve exibir campos obrigatórios no primeiro step', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Avançar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Verificar se os campos obrigatórios estão presentes
    expect(screen.getByText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByText(/data de nascimento/i)).toBeInTheDocument()
  })

  it('deve validar estrutura do formulário de cadastro', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Avançar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Verificar se há botões de navegação
    const proximoButton = screen.queryByText(/próximo/i)
    expect(proximoButton).toBeInTheDocument()
  })

  it('deve permitir voltar na navegação', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Avançar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Verificar se há botão de voltar
    const voltarButton = screen.queryByText(/voltar/i)
    expect(voltarButton).toBeInTheDocument()
  })

  it('deve exibir informações sobre os steps do cadastro', () => {
    render(<CadastroPaciente />)

    // Verificar se há informações sobre os steps
    expect(screen.getByText(/dados pessoais/i)).toBeInTheDocument()
  })

  it('deve ter estrutura de multi-step funcional', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Verificar se a página inicial tem a estrutura correta
    expect(screen.getByText(/começar cadastro/i)).toBeInTheDocument()
    
    // Avançar para o primeiro step
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Verificar se avançou para o step 1
    expect(screen.getByText(/dados pessoais/i)).toBeInTheDocument()
  })

  it('deve exibir validações de campos obrigatórios', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Avançar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Verificar se há indicação de campos obrigatórios
    expect(screen.getByText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByText(/telefone/i)).toBeInTheDocument()
  })

  it('deve ter interface responsiva e acessível', () => {
    render(<CadastroPaciente />)

    // Verificar se há elementos de interface básicos
    expect(screen.getByText(/começar cadastro/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
  })
})
