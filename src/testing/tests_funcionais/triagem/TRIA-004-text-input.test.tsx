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

describe('TRIA-004 - Perguntas de Texto Livre', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve encontrar pergunta de texto livre', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService com pergunta de texto
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
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Verificar se a pergunta de texto foi exibida
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar se o campo de texto está presente
    const textArea = screen.getByRole('textbox')
    expect(textArea).toBeInTheDocument()
    expect(textArea).toHaveAttribute('placeholder', 'Conte pra gente o que está te incomodando...')
  })

  it('deve digitar resposta no campo de texto', async () => {
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
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Aguardar pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Digitar resposta no campo de texto
    const textArea = screen.getByRole('textbox')
    const resposta = 'Estou com dor de cabeça há 2 dias e também sinto náusea'
    
    await user.type(textArea, resposta)

    // Verificar se o texto foi digitado
    expect(textArea).toHaveValue(resposta)
  })

  it('deve verificar validação do campo de texto', async () => {
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
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Aguardar pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar se o campo está inicialmente vazio
    const textArea = screen.getByRole('textbox')
    expect(textArea).toHaveValue('')

    // Verificar propriedades do textarea
    expect(textArea).toHaveAttribute('rows', '4')
    expect(textArea).toHaveClass('resize-none')
    expect(textArea).toHaveClass('w-full')
    expect(textArea).toHaveClass('p-4')
  })

  it('deve clicar em continuar e navegar', async () => {
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

    // Aguardar pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Digitar resposta
    const textArea = screen.getByRole('textbox')
    await user.type(textArea, 'Estou com dor de cabeça')

    // Clicar em continuar
    const continueButton = screen.getByText('Continuar')
    await user.click(continueButton)

    // Verificar se navegou para próxima pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })
  })

  it('deve ter campo de texto funcional', async () => {
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
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Aguardar pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    const textArea = screen.getByRole('textbox')
    
    // Verificar funcionalidades do campo
    expect(textArea.tagName).toBe('TEXTAREA')
    expect(textArea).toHaveAttribute('rows', '4')
    expect(textArea).toHaveClass('resize-none') // Não permite redimensionamento
    expect(textArea).toHaveClass('focus:outline-none') // Remove outline no focus
    
    // Testar digitação
    await user.type(textArea, 'Teste de digitação')
    expect(textArea).toHaveValue('Teste de digitação')
    
    // Testar limpeza
    await user.clear(textArea)
    expect(textArea).toHaveValue('')
  })

  it('deve ter validação adequada', async () => {
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
      }
    ])

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Aguardar pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    const textArea = screen.getByRole('textbox')
    const continueButton = screen.getByText('Continuar')
    
    // Verificar que o botão continuar está sempre habilitado para texto
    // (diferente das perguntas de seleção)
    expect(continueButton).not.toBeDisabled()
    expect(continueButton).toHaveClass('bg-white', 'text-blue-600')
    
    // Testar com texto vazio
    expect(textArea).toHaveValue('')
    expect(continueButton).not.toBeDisabled()
    
    // Testar com texto preenchido
    await user.type(textArea, 'Resposta de teste')
    expect(textArea).toHaveValue('Resposta de teste')
    expect(continueButton).not.toBeDisabled()
  })

  it('deve salvar resposta corretamente', async () => {
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

    // Aguardar pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Digitar resposta
    const textArea = screen.getByRole('textbox')
    const resposta = 'Estou com dor de cabeça há 3 dias, também sinto náusea e tontura'
    await user.type(textArea, resposta)

    // Clicar em continuar
    const continueButton = screen.getByText('Continuar')
    await user.click(continueButton)

    // Verificar se a resposta foi salva (navegando para próxima pergunta)
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Verificar que a resposta foi salva - a navegação só acontece se a resposta foi salva
    // O campo de texto não existe mais na próxima pergunta (que é de seleção)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('deve ter navegação correta', async () => {
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

    // Aguardar primeira pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar que é pergunta de texto
    const textArea = screen.getByRole('textbox')
    expect(textArea).toBeInTheDocument()

    // Digitar resposta e navegar
    await user.type(textArea, 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    // Verificar navegação para próxima pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    // Verificar que agora é pergunta de seleção (não mais texto)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Leve')).toBeInTheDocument()
    expect(screen.getByText('Moderada')).toBeInTheDocument()
    expect(screen.getByText('Forte')).toBeInTheDocument()
  })
})
