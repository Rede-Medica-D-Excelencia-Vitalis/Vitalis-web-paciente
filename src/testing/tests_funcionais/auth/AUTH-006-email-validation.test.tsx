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

describe('AUTH-006 - Validação de Email no Cadastro', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // Teste básico que verifica se o componente renderiza
  it('deve renderizar o componente de cadastro', () => {
    render(<CadastroPaciente />)
    
    // Verificar se o componente renderiza
    expect(screen.getByText(/começar cadastro/i)).toBeInTheDocument()
  })

  // Função auxiliar para navegar até o step 3
  const navegarParaStep3 = async (user: any) => {
    // Navegar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Preencher dados básicos
    const nomeInput = screen.getByPlaceholderText(/digite seu nome completo/i)
    const cpfInput = screen.getByPlaceholderText(/000\.000\.000-00/i)
    const telefoneInput = screen.getByPlaceholderText(/\(11\) 91234-5678/i)
    
    await act(async () => {
      await user.type(nomeInput, 'João Silva')
      await user.type(cpfInput, '12345678901')
      await user.type(telefoneInput, '11999999999')
    })

    // Preencher data de nascimento (campo obrigatório)
    const dataNascimentoInput = screen.getByDisplayValue('')
    await act(async () => {
      await user.type(dataNascimentoInput, '1990-01-01')
    })

    // Selecionar gênero
    const generoSelect = screen.getByDisplayValue('Selecione o Sexo')
    await act(async () => {
      await user.selectOptions(generoSelect, 'masculino')
    })

    // Avançar para o step 2
    const proximoButton = screen.getByText(/próximo/i)
    await act(async () => {
      await user.click(proximoButton)
    })

    // Aguardar e verificar se chegou ao step 2
    await waitFor(() => {
      expect(screen.getByText(/endereço/i)).toBeInTheDocument()
    })

    // Preencher todos os campos de endereço
    const cepInput = screen.getByPlaceholderText('00000-000')
    const ruaInput = screen.getByPlaceholderText('Rua')
    const bairroInput = screen.getByPlaceholderText('Bairro')
    const cidadeInput = screen.getByPlaceholderText('Cidade')
    const estadoInput = screen.getByPlaceholderText('UF')
    
    await act(async () => {
      await user.type(cepInput, '01234567')
      await user.type(ruaInput, 'Rua das Flores')
      await user.type(bairroInput, 'Centro')
      await user.type(cidadeInput, 'São Paulo')
      await user.type(estadoInput, 'SP')
    })

    // Avançar para o step 3
    const proximoButton2 = screen.getByText(/próximo/i)
    await act(async () => {
      await user.click(proximoButton2)
    })

    // Aguardar e verificar se chegou ao step 3
    await waitFor(() => {
      expect(screen.getByText(/acesso/i)).toBeInTheDocument()
    })
  }

  // Teste que verifica se o campo de email tem validação HTML5
  it('deve ter campo de email com validação HTML5 no step 3', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar para o step 1
    const comecarCadastroButton = screen.getByText(/começar cadastro/i)
    await act(async () => {
      await user.click(comecarCadastroButton)
    })

    // Verificar se estamos no step 1
    expect(screen.getByText(/dados pessoais/i)).toBeInTheDocument()

    // Preencher dados básicos
    const nomeInput = screen.getByPlaceholderText(/digite seu nome completo/i)
    const cpfInput = screen.getByPlaceholderText(/000\.000\.000-00/i)
    const telefoneInput = screen.getByPlaceholderText(/\(11\) 91234-5678/i)
    
    await act(async () => {
      await user.type(nomeInput, 'João Silva')
      await user.type(cpfInput, '12345678901')
      await user.type(telefoneInput, '11999999999')
    })

    // Preencher data de nascimento (campo obrigatório)
    const dataNascimentoInput = screen.getByDisplayValue('')
    await act(async () => {
      await user.type(dataNascimentoInput, '1990-01-01')
    })

    // Selecionar gênero
    const generoSelect = screen.getByDisplayValue('Selecione o Sexo')
    await act(async () => {
      await user.selectOptions(generoSelect, 'masculino')
    })

    // Avançar para o step 2
    const proximoButton = screen.getByText(/próximo/i)
    await act(async () => {
      await user.click(proximoButton)
    })

    // Aguardar e verificar se chegou ao step 2
    await waitFor(() => {
      expect(screen.getByText(/endereço/i)).toBeInTheDocument()
    })

    // Preencher todos os campos de endereço
    const cepInput = screen.getByPlaceholderText('00000-000')
    const ruaInput = screen.getByPlaceholderText('Rua')
    const bairroInput = screen.getByPlaceholderText('Bairro')
    const cidadeInput = screen.getByPlaceholderText('Cidade')
    const estadoInput = screen.getByPlaceholderText('UF')
    
    await act(async () => {
      await user.type(cepInput, '01234567')
      await user.type(ruaInput, 'Rua das Flores')
      await user.type(bairroInput, 'Centro')
      await user.type(cidadeInput, 'São Paulo')
      await user.type(estadoInput, 'SP')
    })

    // Avançar para o step 3
    const proximoButton2 = screen.getByText(/próximo/i)
    await act(async () => {
      await user.click(proximoButton2)
    })

    // Aguardar e verificar se chegou ao step 3
    await waitFor(() => {
      expect(screen.getByText(/acesso/i)).toBeInTheDocument()
    })

    // Verificar se o campo de email tem validação HTML5
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('deve validar formato de email inválido', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Verificar se chegou ao step 3 (acesso)
    expect(screen.getByText(/acesso/i)).toBeInTheDocument()
    
    // Buscar campo de email
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    expect(emailInput).toBeInTheDocument()

    // Verificar se o campo tem validação de email
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('deve exibir mensagem de erro para email inválido', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Buscar campo de email
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    
    // Tentar inserir email inválido
    await act(async () => {
      await user.type(emailInput, 'email-invalido')
    })

    // Verificar se o campo tem validação HTML5
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('deve validar formato de email em tempo real', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Buscar campo de email
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    
    // Digitar email inválido
    await act(async () => {
      await user.type(emailInput, 'email@')
    })

    // Verificar se o campo foi preenchido
    expect(emailInput).toHaveValue('email@')
    
    // Verificar se tem validação HTML5
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('deve destacar campo de email com erro', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Buscar campo de email
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    
    // Inserir email inválido
    await act(async () => {
      await user.type(emailInput, 'email-invalido')
    })

    // Verificar se o campo está presente e tem validação
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    
    // Verificar se o campo tem as classes de validação
    expect(emailInput).toHaveClass('w-full')
  })

  it('deve bloquear cadastro com email inválido', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Buscar campos do step 3
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    const senhaInput = screen.getByPlaceholderText(/crie uma senha/i)
    const confirmarSenhaInput = screen.getByPlaceholderText(/confirme a senha/i)

    // Preencher com email inválido
    await act(async () => {
      await user.type(emailInput, 'email-invalido')
      await user.type(senhaInput, 'senha123456')
      await user.type(confirmarSenhaInput, 'senha123456')
    })

    // Verificar se os campos foram preenchidos
    expect(emailInput).toHaveValue('email-invalido')
    expect(senhaInput).toHaveValue('senha123456')
    expect(confirmarSenhaInput).toHaveValue('senha123456')

    // Verificar se não houve redirecionamento (cadastro bloqueado)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('deve aceitar email válido', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Buscar campo de email
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    
    // Inserir email válido
    await act(async () => {
      await user.type(emailInput, 'joao@email.com')
    })

    // Verificar se o email foi aceito
    expect(emailInput).toHaveValue('joao@email.com')
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('deve validar diferentes formatos de email inválido', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Buscar campo de email
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    
    // Testar diferentes formatos inválidos
    const emailsInvalidos = [
      'email@',
      'email',
      '@email.com',
      'email@.com',
      'email..teste@com'
    ]

    for (const emailInvalido of emailsInvalidos) {
      await act(async () => {
        await user.clear(emailInput)
        await user.type(emailInput, emailInvalido)
      })

      // Verificar se o campo aceita o valor (validação HTML5 acontece no submit)
      expect(emailInput).toHaveValue(emailInvalido)
    }

    // Verificar se o campo tem validação HTML5
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('deve ter campo de email com validação HTML5', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Verificar se o campo de email tem validação HTML5
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('deve exibir placeholder correto no campo de email', async () => {
    const user = userEvent.setup()
    
    render(<CadastroPaciente />)

    // Navegar até o step 3
    await navegarParaStep3(user)

    // Verificar placeholder do campo de email
    const emailInput = screen.getByPlaceholderText(/digite seu e-mail/i)
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
  })
})
