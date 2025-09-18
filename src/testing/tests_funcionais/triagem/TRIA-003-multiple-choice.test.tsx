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

describe('TRIA-003 - Perguntas de Múltipla Escolha', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve encontrar pergunta de múltipla escolha', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService com pergunta de múltipla escolha
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Quais sintomas você está sentindo?',
        type: 'multiselect',
        options: ['Febre', 'Dor de cabeça', 'Náusea', 'Tontura', 'Fadiga'],
        symptoms: [],
        weight: 3,
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

    // Verificar se a pergunta de múltipla escolha foi exibida
    await waitFor(() => {
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Verificar se as opções estão disponíveis
    expect(screen.getByText('Febre')).toBeInTheDocument()
    expect(screen.getByText('Dor de cabeça')).toBeInTheDocument()
    expect(screen.getByText('Náusea')).toBeInTheDocument()
    expect(screen.getByText('Tontura')).toBeInTheDocument()
    expect(screen.getByText('Fadiga')).toBeInTheDocument()
  })

  it('deve selecionar primeira opção', async () => {
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
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Selecionar primeira opção
    const firstOption = screen.getByText('Febre')
    await user.click(firstOption)

    // Verificar se a opção foi selecionada (verificar classes visuais)
    const button = firstOption.closest('button')
    expect(button).toHaveClass('bg-white/30', 'border-white')
  })

  it('deve selecionar múltiplas opções', async () => {
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
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Selecionar múltiplas opções
    const option1 = screen.getByText('Febre')
    const option2 = screen.getByText('Dor de cabeça')
    const option3 = screen.getByText('Náusea')

    await user.click(option1)
    await user.click(option2)
    await user.click(option3)

    // Verificar se todas as opções foram selecionadas
    expect(option1.closest('button')).toHaveClass('bg-white/30', 'border-white')
    expect(option2.closest('button')).toHaveClass('bg-white/30', 'border-white')
    expect(option3.closest('button')).toHaveClass('bg-white/30', 'border-white')

    // Verificar que as opções foram selecionadas (não há contador visível neste layout)
    expect(option1.closest('button')).toHaveClass('bg-white/30', 'border-white')
    expect(option2.closest('button')).toHaveClass('bg-white/30', 'border-white')
    expect(option3.closest('button')).toHaveClass('bg-white/30', 'border-white')
  })

  it('deve desmarcar uma opção selecionada', async () => {
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
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Selecionar duas opções
    const option1 = screen.getByText('Febre')
    const option2 = screen.getByText('Dor de cabeça')

    await user.click(option1)
    await user.click(option2)

    // Verificar se ambas foram selecionadas
    expect(option1.closest('button')).toHaveClass('bg-white/30', 'border-white')
    expect(option2.closest('button')).toHaveClass('bg-white/30', 'border-white')

    // Desmarcar uma opção
    await user.click(option1)

    // Verificar se a opção foi desmarcada
    expect(option1.closest('button')).toHaveClass('bg-white/10', 'border-white/20')
    expect(option2.closest('button')).toHaveClass('bg-white/30', 'border-white')
  })

  it('deve habilitar botão continuar apenas com seleções', async () => {
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
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Verificar se o botão continuar está desabilitado inicialmente
    const continueButton = screen.getByText('Continuar')
    expect(continueButton).toBeDisabled()
    expect(continueButton).toHaveClass('opacity-50', 'cursor-not-allowed')

    // Selecionar uma opção
    const option = screen.getByText('Febre')
    await user.click(option)

    // Verificar se o botão continuar foi habilitado
    expect(continueButton).not.toBeDisabled()
    expect(continueButton).toHaveClass('bg-white', 'text-blue-600')
  })

  it('deve exibir layout correto para múltipla escolha', async () => {
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
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Verificar layout específico de múltipla escolha
    expect(screen.getByText('Marque o que se aplica:')).toBeInTheDocument()
    
    // Verificar se as opções têm checkboxes visuais
    const options = ['Febre', 'Dor de cabeça', 'Náusea', 'Tontura']
    options.forEach(option => {
      const optionButton = screen.getByText(option)
      expect(optionButton.closest('button')).toBeInTheDocument()
      // Verificar se tem o elemento visual do checkbox
      expect(optionButton.closest('button')?.querySelector('.w-4.h-4')).toBeInTheDocument()
    })
  })

  it('deve permitir seleção e desseleção de opções', async () => {
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
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Selecionar múltiplas opções
    const option1 = screen.getByText('Febre')
    const option2 = screen.getByText('Dor de cabeça')
    
    await user.click(option1)
    await user.click(option2)

    // Verificar seleções
    expect(option1.closest('button')).toHaveClass('bg-white/30', 'border-white')
    expect(option2.closest('button')).toHaveClass('bg-white/30', 'border-white')
    
    // Desselecionar uma opção
    await user.click(option1)
    
    // Verificar desseleção
    expect(option1.closest('button')).toHaveClass('bg-white/10', 'border-white/20')
    expect(option2.closest('button')).toHaveClass('bg-white/30', 'border-white')
  })

  it('deve ter interface clara e intuitiva', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    vi.mocked(triagemService.getQuestions).mockResolvedValue([
      {
        id: 1,
        text: 'Quais sintomas você está sentindo?',
        type: 'multiselect',
        options: ['Febre', 'Dor de cabeça', 'Náusea', 'Tontura', 'Fadiga'],
        symptoms: [],
        weight: 3,
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

    // Aguardar pergunta carregar
    await waitFor(() => {
      expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    })

    // Verificar elementos da interface
    expect(screen.getByText('Quais sintomas você está sentindo?')).toBeInTheDocument()
    expect(screen.getByText('Marque o que se aplica:')).toBeInTheDocument()
    expect(screen.getByText('Continuar')).toBeInTheDocument()

    // Verificar se todas as opções são clicáveis
    const options = ['Febre', 'Dor de cabeça', 'Náusea', 'Tontura', 'Fadiga']
    options.forEach(option => {
      const optionButton = screen.getByText(option)
      expect(optionButton).toBeInTheDocument()
      expect(optionButton.closest('button')).toBeInTheDocument()
    })

    // Verificar hover states (classes CSS)
    const firstOption = screen.getByText('Febre').closest('button')
    expect(firstOption).toHaveClass('hover:bg-white/20')
  })
})
