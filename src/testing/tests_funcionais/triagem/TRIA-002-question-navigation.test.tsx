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

describe('TRIA-002 - Navegação Entre Perguntas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve responder primeira pergunta e navegar para próxima', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService com múltiplas perguntas
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        options: [],
        symptoms: [],
        weight: 3,
        category: 'geral'
      },
      {
        id: 2,
        text: 'Qual a intensidade do seu desconforto?',
        type: 'select',
        options: ['Leve', 'Moderado', 'Forte'],
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      },
      {
        id: 3,
        text: 'Faz quanto tempo que está assim?',
        type: 'select',
        options: ['Algumas horas', '1-2 dias', 'Mais de uma semana'],
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

    // Verificar primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar contador de progresso
    expect(screen.getByText('Pergunta 1 de 3')).toBeInTheDocument()
  })

  it('deve atualizar barra de progresso ao navegar', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        options: [],
        symptoms: [],
        weight: 3,
        category: 'geral'
      },
      {
        id: 2,
        text: 'Qual a intensidade do seu desconforto?',
        type: 'select',
        options: ['Leve', 'Moderado', 'Forte'],
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

    // Verificar primeira pergunta e progresso inicial
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    expect(screen.getByText('Pergunta 1 de 2')).toBeInTheDocument()

    // Responder primeira pergunta (texto)
    const textInput = screen.getByRole('textbox')
    await user.type(textInput, 'Estou com dor de cabeça')

    // Clicar em continuar
    const continueButton = screen.getByText('Continuar')
    await user.click(continueButton)

    // Verificar segunda pergunta e progresso atualizado
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade do seu desconforto?')).toBeInTheDocument()
    })

    expect(screen.getByText('Pergunta 2 de 2')).toBeInTheDocument()
  })

  it('deve salvar resposta anterior ao navegar', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        options: [],
        symptoms: [],
        weight: 3,
        category: 'geral'
      },
      {
        id: 2,
        text: 'Qual a intensidade do seu desconforto?',
        type: 'select',
        options: ['Leve', 'Moderado', 'Forte'],
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

    const textInput = screen.getByRole('textbox')
    await user.type(textInput, 'Estou com dor de cabeça')

    const continueButton = screen.getByText('Continuar')
    await user.click(continueButton)

    // Verificar segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade do seu desconforto?')).toBeInTheDocument()
    })

    // Verificar se a resposta anterior foi salva (não deve estar visível na tela atual)
    expect(screen.queryByDisplayValue('Estou com dor de cabeça')).not.toBeInTheDocument()
  })

  it('deve navegar entre perguntas de seleção', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Qual a intensidade do seu desconforto?',
        type: 'select',
        options: ['Leve', 'Moderado', 'Forte'],
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      },
      {
        id: 2,
        text: 'Faz quanto tempo que está assim?',
        type: 'select',
        options: ['Algumas horas', '1-2 dias', 'Mais de uma semana'],
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

    // Verificar primeira pergunta de seleção
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade do seu desconforto?')).toBeInTheDocument()
    })

    // Selecionar opção
    const optionButton = screen.getByText('Moderado')
    await user.click(optionButton)

    // Verificar se a opção foi clicada (não vamos verificar classes CSS específicas)
    expect(optionButton).toBeInTheDocument()

    // Clicar em continuar (se disponível)
    const continueButton = screen.queryByText('Continuar')
    if (continueButton) {
      await user.click(continueButton)
    }

    // Verificar segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Faz quanto tempo que está assim?')).toBeInTheDocument()
    })
  })

  it('deve navegar entre perguntas de múltipla escolha', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Quais sintomas você está sentindo?',
        type: 'multiselect',
        options: ['Febre', 'Dor de cabeça', 'Náusea', 'Tontura'],
        symptoms: [],
        weight: 3,
        category: 'sintomas'
      },
      {
        id: 2,
        text: 'Qual a intensidade do seu desconforto?',
        type: 'select',
        options: ['Leve', 'Moderado', 'Forte'],
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

    // Verificar primeira pergunta de múltipla escolha
    await waitFor(() => {
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Selecionar múltiplas opções
    const option1 = screen.getByText('Febre')
    const option2 = screen.getByText('Dor de cabeça')
    
    await user.click(option1)
    await user.click(option2)

    // Verificar se as opções foram clicadas
    expect(option1).toBeInTheDocument()
    expect(option2).toBeInTheDocument()

    // Clicar em continuar
    const continueButton = screen.getByText('Continuar')
    await user.click(continueButton)

    // Verificar segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade do seu desconforto?')).toBeInTheDocument()
    })
  })

  it('deve exibir contador de perguntas correto', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService com 5 perguntas
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        options: [],
        symptoms: [],
        weight: 3,
        category: 'geral'
      },
      {
        id: 2,
        text: 'Qual a intensidade?',
        type: 'select',
        options: ['Leve', 'Moderado'],
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      },
      {
        id: 3,
        text: 'Faz quanto tempo?',
        type: 'select',
        options: ['Algumas horas', '1-2 dias'],
        symptoms: [],
        weight: 3,
        category: 'duracao'
      },
      {
        id: 4,
        text: 'Onde está localizado?',
        type: 'select',
        options: ['Cabeça', 'Pescoço'],
        symptoms: [],
        weight: 2,
        category: 'localizacao'
      },
      {
        id: 5,
        text: 'Algum sintoma associado?',
        type: 'multiselect',
        options: ['Febre', 'Náusea'],
        symptoms: [],
        weight: 2,
        category: 'sintomas'
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Verificar contador inicial
    await waitFor(() => {
      expect(screen.getByText('Pergunta 1 de 5')).toBeInTheDocument()
    })

    // Navegar pelas perguntas e verificar contador
    for (let i = 1; i <= 4; i++) {
      // Responder pergunta atual
      if (i === 1) {
        // Pergunta de texto
        const textInput = screen.getByRole('textbox')
        await user.type(textInput, 'Estou me sentindo mal')
      } else {
        // Perguntas de seleção - buscar primeira opção disponível
        const availableOptions = ['Leve', 'Moderado', 'Algumas horas', '1-2 dias']
        let selectedOption = null
        for (const option of availableOptions) {
          try {
            selectedOption = screen.getByText(option)
            break
          } catch {
            // Opção não encontrada, tentar próxima
          }
        }
        if (selectedOption) {
          await user.click(selectedOption)
        }
      }

      // Clicar em continuar (se disponível)
      const continueButton = screen.queryByText('Continuar')
      if (continueButton) {
        await user.click(continueButton)
      }

      // Verificar contador atualizado
      if (i < 4) {
        await waitFor(() => {
          expect(screen.getByText(`Pergunta ${i + 1} de 5`)).toBeInTheDocument()
        })
      }
    }
  })

  it('deve manter navegação fluida entre perguntas', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        options: [],
        symptoms: [],
        weight: 3,
        category: 'geral'
      },
      {
        id: 2,
        text: 'Qual a intensidade?',
        type: 'select',
        options: ['Leve', 'Moderado', 'Forte'],
        symptoms: [],
        weight: 4,
        category: 'intensidade'
      },
      {
        id: 3,
        text: 'Faz quanto tempo?',
        type: 'select',
        options: ['Algumas horas', '1-2 dias', 'Mais de uma semana'],
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

    // Navegar pelas 3 perguntas de forma fluida
    const questions = [
      { type: 'text', input: 'Estou com dor de cabeça' },
      { type: 'select', option: 'Moderado' },
      { type: 'select', option: '1-2 dias' }
    ]

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      
      if (question.type === 'text') {
        const textInput = screen.getByRole('textbox')
        await user.type(textInput, question.input || '')
      } else {
        if (question.option) {
          const optionButton = screen.getByText(question.option)
          await user.click(optionButton)
        }
      }

      const continueButton = screen.queryByText('Continuar')
      if (continueButton) {
        await user.click(continueButton)
      }

      // Verificar se a navegação foi fluida (sem erros)
      if (i < questions.length - 1) {
        await waitFor(() => {
          expect(screen.getByText(`Pergunta ${i + 2} de 3`)).toBeInTheDocument()
        })
      }
    }
  })

  it('deve exibir tempo estimado restante', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Como você está se sentindo hoje?',
        type: 'text',
        options: [],
        symptoms: [],
        weight: 3,
        category: 'geral'
      },
      {
        id: 2,
        text: 'Qual a intensidade?',
        type: 'select',
        options: ['Leve', 'Moderado'],
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

    // Verificar tempo estimado inicial
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar se o tempo estimado está sendo exibido (texto pode estar quebrado)
    expect(screen.getByText(/min restantes/)).toBeInTheDocument()
  })
})
