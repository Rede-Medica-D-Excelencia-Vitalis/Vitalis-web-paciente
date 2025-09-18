import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'
import { TriagemOnline } from '../../../screens/TriagemOnline/TriagemOnline'

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/triagem-online' }),
  }
})

// Mock do triagemService
vi.mock('../../../services/consultation/triagemService', () => ({
  triagemService: {
    getQuestions: vi.fn(),
    analyzeTriagem: vi.fn(),
    saveTriagem: vi.fn(),
    getTriagemHistory: vi.fn(),
  },
}))

// Mock do PDFService
vi.mock('../../../services/media/pdfService', () => ({
  PDFService: {
    generateAndSavePDF: vi.fn(),
  },
}))

// Mock do useAuthStore
vi.mock('../../../store/auth/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
    },
  }),
}))

describe('TRIA-005 - Navegação para Trás', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve avançar algumas perguntas e verificar botão voltar', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService com múltiplas perguntas
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        description: 'Conte pra gente o que está te incomodando...',
        symptoms: [],
        weight: 3,
        category: 'principal'
      },
      {
        id: 2,
        text: 'Qual a intensidade da dor?',
        type: 'text',
        description: 'Descreva a intensidade...',
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      },
      {
        id: 3,
        text: 'Faz quanto tempo que está assim?',
        type: 'text',
        description: 'Descreva há quanto tempo...',
        symptoms: [],
        weight: 3,
        category: 'duracao'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Aguardar primeira pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar que botão voltar está desabilitado na primeira pergunta
    const backButton = screen.getByText('← Voltar')
    expect(backButton).toBeDisabled()
    expect(backButton).toHaveClass('opacity-50', 'cursor-not-allowed')

    // Responder primeira pergunta (texto)
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    // Aguardar segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Verificar que botão voltar agora está habilitado
    const backButton2 = screen.getByText('← Voltar')
    expect(backButton2).not.toBeDisabled()
    expect(backButton2).toHaveClass('bg-red-500/20', 'text-white')

    // Responder segunda pergunta
    const textArea2 = screen.getByRole('textbox')
    await user.type(textArea2, 'Moderada')
    await user.click(screen.getByText('Continuar'))

    // Aguardar terceira pergunta
    await waitFor(() => {
      expect(screen.getByText('Faz quanto tempo que está assim?')).toBeInTheDocument()
    })

    // Verificar que botão voltar continua habilitado
    const backButton3 = screen.getByText('← Voltar')
    expect(backButton3).not.toBeDisabled()
  })

  it('deve clicar em voltar e navegar para pergunta anterior', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        description: 'Conte pra gente o que está te incomodando...',
        symptoms: [],
        weight: 3,
        category: 'principal'
      },
      {
        id: 2,
        text: 'Qual a intensidade da dor?',
        type: 'select',
        options: ['Leve', 'Moderada', 'Forte'],
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Responder primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    // Aguardar segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Clicar em voltar
    const backButton = screen.getByText('← Voltar')
    await user.click(backButton)

    // Verificar se voltou para primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar que o campo de texto está presente novamente
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('deve verificar pergunta anterior após navegação reversa', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        description: 'Conte pra gente o que está te incomodando...',
        symptoms: [],
        weight: 3,
        category: 'principal'
      },
      {
        id: 2,
        text: 'Qual a intensidade da dor?',
        type: 'select',
        options: ['Leve', 'Moderada', 'Forte'],
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Responder primeira pergunta e avançar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    // Verificar segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Voltar para primeira pergunta
    await user.click(screen.getByText('← Voltar'))

    // Verificar que voltou para primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar que não é mais a segunda pergunta
    expect(screen.queryByText('Qual a intensidade da dor?')).not.toBeInTheDocument()
    expect(screen.queryByText('Leve')).not.toBeInTheDocument()
  })

  it('deve verificar respostas salvas após navegação reversa', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        description: 'Conte pra gente o que está te incomodando...',
        symptoms: [],
        weight: 3,
        category: 'principal'
      },
      {
        id: 2,
        text: 'Qual a intensidade da dor?',
        type: 'select',
        options: ['Leve', 'Moderada', 'Forte'],
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Responder primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    const textArea = screen.getByRole('textbox')
    const resposta = 'Estou com dor de cabeça há 2 dias'
    await user.type(textArea, resposta)
    await user.click(screen.getByText('Continuar'))

    // Avançar para segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Voltar para primeira pergunta
    await user.click(screen.getByText('← Voltar'))

    // Verificar se voltou para primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar se a resposta foi mantida
    const textAreaRetornado = screen.getByRole('textbox')
    expect(textAreaRetornado).toHaveValue(resposta)
  })

  it('deve avançar novamente após navegação reversa', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        description: 'Conte pra gente o que está te incomodando...',
        symptoms: [],
        weight: 3,
        category: 'principal'
      },
      {
        id: 2,
        text: 'Qual a intensidade da dor?',
        type: 'select',
        options: ['Leve', 'Moderada', 'Forte'],
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Responder primeira pergunta e avançar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    // Verificar segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Voltar
    await user.click(screen.getByText('← Voltar'))

    // Verificar que voltou
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Avançar novamente
    await user.click(screen.getByText('Continuar'))

    // Verificar que avançou para segunda pergunta novamente
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    expect(screen.queryByText('Como você está se sentindo hoje?')).not.toBeInTheDocument()
  })

  it('deve ter navegação bidirecional funcional', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        description: 'Conte pra gente o que está te incomodando...',
        symptoms: [],
        weight: 3,
        category: 'principal'
      },
      {
        id: 2,
        text: 'Qual a intensidade da dor?',
        type: 'text',
        description: 'Descreva a intensidade...',
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Navegar através das perguntas
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Primeira pergunta (texto)
    await user.type(screen.getByRole('textbox'), 'Dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    // Segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Voltar para primeira pergunta
    await user.click(screen.getByText('← Voltar'))
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Avançar novamente
    await user.click(screen.getByText('Continuar'))
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })
  })

  it('deve manter respostas durante navegação bidirecional', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        description: 'Conte pra gente o que está te incomodando...',
        symptoms: [],
        weight: 3,
        category: 'principal'
      },
      {
        id: 2,
        text: 'Qual a intensidade da dor?',
        type: 'text',
        description: 'Descreva a intensidade...',
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Responder primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    const resposta1 = 'Estou com dor de cabeça há 2 dias'
    await user.type(screen.getByRole('textbox'), resposta1)
    await user.click(screen.getByText('Continuar'))

    // Responder segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    const resposta2 = 'A dor é moderada'
    await user.type(screen.getByRole('textbox'), resposta2)
    await user.click(screen.getByText('Continuar'))

    // Voltar para primeira pergunta
    await user.click(screen.getByText('← Voltar'))
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar se resposta da primeira pergunta foi mantida
    expect(screen.getByRole('textbox')).toHaveValue(resposta1)

    // Voltar para segunda pergunta
    await user.click(screen.getByText('Continuar'))
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Verificar se resposta da segunda pergunta foi mantida
    expect(screen.getByRole('textbox')).toHaveValue(resposta2)
  })

  it('deve atualizar progresso corretamente durante navegação reversa', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        description: 'Conte pra gente o que está te incomodando...',
        symptoms: [],
        weight: 3,
        category: 'principal'
      },
      {
        id: 2,
        text: 'Qual a intensidade da dor?',
        type: 'text',
        description: 'Descreva a intensidade...',
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      },
      {
        id: 3,
        text: 'Faz quanto tempo que está assim?',
        type: 'text',
        description: 'Descreva há quanto tempo...',
        symptoms: [],
        weight: 3,
        category: 'duracao'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Primeira pergunta - deve mostrar "Pergunta 1 de 3"
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    expect(screen.getByText('Pergunta 1 de 3')).toBeInTheDocument()

    // Avançar para segunda pergunta
    await user.type(screen.getByRole('textbox'), 'Dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Segunda pergunta - deve mostrar "Pergunta 2 de 3"
    expect(screen.getByText('Pergunta 2 de 3')).toBeInTheDocument()

    // Avançar para terceira pergunta
    await user.type(screen.getByRole('textbox'), 'Moderada')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Faz quanto tempo que está assim?')).toBeInTheDocument()
    })

    // Terceira pergunta - deve mostrar "Pergunta 3 de 3"
    expect(screen.getByText('Pergunta 3 de 3')).toBeInTheDocument()

    // Voltar para segunda pergunta
    await user.click(screen.getByText('← Voltar'))
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Deve mostrar "Pergunta 2 de 3" novamente
    expect(screen.getByText('Pergunta 2 de 3')).toBeInTheDocument()

    // Voltar para primeira pergunta
    await user.click(screen.getByText('← Voltar'))
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Deve mostrar "Pergunta 1 de 3" novamente
    expect(screen.getByText('Pergunta 1 de 3')).toBeInTheDocument()
  })
})
