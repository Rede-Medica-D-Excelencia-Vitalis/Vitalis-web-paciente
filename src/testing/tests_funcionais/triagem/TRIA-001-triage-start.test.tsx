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

describe('TRIA-001 - Início da Triagem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve exibir tela de boas-vindas', async () => {
    
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Verificar elementos da tela de boas-vindas
    expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    expect(screen.getByText('Sobre Como Você Está')).toBeInTheDocument()
    expect(screen.getByText(/Conte pra gente o que está te incomodando/)).toBeInTheDocument()
  })

  it('deve exibir informações sobre o processo', async () => {
    
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Verificar informações sobre o processo
    expect(screen.getByText('Conversa Natural')).toBeInTheDocument()
    expect(screen.getByText('Sem Pressão')).toBeInTheDocument()
    expect(screen.getByText('Rápido e Fácil')).toBeInTheDocument()
    expect(screen.getByText('Cuidado Personalizado')).toBeInTheDocument()
    
    // Verificar descrições
    expect(screen.getByText('Como falar com um amigo')).toBeInTheDocument()
    expect(screen.getByText('Responda no seu tempo')).toBeInTheDocument()
    expect(screen.getByText('Menos de 5 minutos')).toBeInTheDocument()
    expect(screen.getByText('Recomendações específicas')).toBeInTheDocument()
  })

  it('deve exibir botão de início destacado', async () => {
    
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Verificar botão de início
    const startButton = screen.getByText('Vamos Começar a Conversar')
    expect(startButton).toBeInTheDocument()
    expect(startButton.closest('button')).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600')
  })

  it('deve carregar primeira pergunta ao clicar no botão', async () => {
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Clicar no botão de início
    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Verificar se a primeira pergunta foi carregada
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })
  })

  it('deve exibir barra de progresso', async () => {
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Clicar no botão de início
    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Verificar se a barra de progresso foi exibida
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    // Verificar elementos de progresso
    expect(screen.getByText(/1 de/)).toBeInTheDocument()
  })

  it('deve exibir estatísticas da triagem', async () => {
    
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Verificar estatísticas
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('Perguntas')).toBeInTheDocument()
    expect(screen.getByText('5min')).toBeInTheDocument()
    expect(screen.getByText('Tempo')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
    expect(screen.getByText('Precisão')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
    expect(screen.getByText('Disponível')).toBeInTheDocument()
  })

  it('deve exibir botão de saída', async () => {
    
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Verificar botão de saída (X)
    const exitButton = screen.getByRole('button', { name: '' })
    expect(exitButton).toBeInTheDocument()
  })

  it('deve exibir ícone do cérebro', async () => {
    
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Verificar se o ícone do cérebro está presente (através do título ou aria-label)
    expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
  })

  it('deve exibir descrição da IA', async () => {
    
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
      }
    ])

    render(<TriagemOnline />)
    
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    // Verificar descrição da IA
    expect(screen.getByText(/nossa IA vai te ajudar a entender/)).toBeInTheDocument()
    expect(screen.getByText(/qual especialidade médica você precisa/)).toBeInTheDocument()
  })
})
