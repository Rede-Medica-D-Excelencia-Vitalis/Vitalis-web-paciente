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

// Mock do window.alert
const mockAlert = vi.fn()
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true
})

describe('TRIA-007 - Geração de PDF', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve completar triagem e exibir botão de download', async () => {
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'moderado',
      riskPercentage: 65,
      urgency: 'moderado',
      estimatedWaitTime: '2-4 horas',
      symptoms: ['Dor de cabeça', 'Náusea'],
      recommendedSpecialties: ['Neurologia', 'Clínica Geral'],
      recommendations: [
        'Evite esforços físicos',
        'Procure atendimento médico'
      ],
      nextSteps: [
        'Agende consulta com neurologista',
        'Monitore sintomas'
      ],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    render(<TriagemOnline />)
    
    // Iniciar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Responder pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    // Verificar tela de resultado
    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Verificar botão de download
    expect(screen.getByText('Baixar Relatório Completo')).toBeInTheDocument()
  })

  it('deve clicar em baixar relatório e chamar PDFService', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    const { PDFService } = await import('../../../services/media/pdfService')
    
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'moderado',
      riskPercentage: 65,
      urgency: 'moderado',
      estimatedWaitTime: '2-4 horas',
      symptoms: ['Dor de cabeça'],
      recommendedSpecialties: ['Neurologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    // Mock do PDFService
    vi.mocked(PDFService.generateAndSavePDF).mockResolvedValue(undefined)

    render(<TriagemOnline />)
    
    // Completar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Clicar no botão de download
    const downloadButton = screen.getByText('Baixar Relatório Completo')
    await user.click(downloadButton)

    // Verificar se PDFService foi chamado
    await waitFor(() => {
      expect(PDFService.generateAndSavePDF).toHaveBeenCalled()
    })
  })

  it('deve aguardar geração do PDF e verificar dados passados', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    const { PDFService } = await import('../../../services/media/pdfService')
    
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'moderado',
      riskPercentage: 65,
      urgency: 'moderado',
      estimatedWaitTime: '2-4 horas',
      symptoms: ['Dor de cabeça', 'Náusea'],
      recommendedSpecialties: ['Neurologia', 'Clínica Geral'],
      recommendations: ['Procure atendimento médico', 'Evite esforços'],
      nextSteps: ['Agende consulta', 'Monitore sintomas'],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    // Mock do PDFService
    vi.mocked(PDFService.generateAndSavePDF).mockResolvedValue(undefined)

    render(<TriagemOnline />)
    
    // Completar triagem com múltiplas perguntas
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Responder primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Estou com dor de cabeça forte')
    await user.click(screen.getByText('Continuar'))

    // Responder segunda pergunta
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'A dor é muito intensa')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Clicar no botão de download
    const downloadButton = screen.getByText('Baixar Relatório Completo')
    await user.click(downloadButton)

    // Verificar se PDFService foi chamado com os dados corretos
    await waitFor(() => {
      expect(PDFService.generateAndSavePDF).toHaveBeenCalledWith({
        paciente_nome: 'João Silva',
        data_triagem: expect.any(String),
        nivel_risco: 'moderado',
        sintomas: ['Dor de cabeça', 'Náusea'],
        especialidades_recomendadas: ['Neurologia', 'Clínica Geral'],
        observacoes: 'Procure atendimento médico; Evite esforços',
        perguntas_respostas: [
          {
            pergunta: 'Como você está se sentindo hoje?',
            resposta: 'Estou com dor de cabeça forte'
          },
          {
            pergunta: 'Qual a intensidade da dor?',
            resposta: 'A dor é muito intensa'
          }
        ]
      })
    })
  })

  it('deve verificar download e resposta do PDFService', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    const { PDFService } = await import('../../../services/media/pdfService')
    
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'moderado',
      riskPercentage: 65,
      urgency: 'moderado',
      estimatedWaitTime: '2-4 horas',
      symptoms: ['Dor de cabeça'],
      recommendedSpecialties: ['Neurologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    // Mock do PDFService com resposta de sucesso
    vi.mocked(PDFService.generateAndSavePDF).mockResolvedValue(undefined)

    render(<TriagemOnline />)
    
    // Completar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Clicar no botão de download
    const downloadButton = screen.getByText('Baixar Relatório Completo')
    await user.click(downloadButton)

    // Verificar se PDFService foi chamado
    await waitFor(() => {
      expect(PDFService.generateAndSavePDF).toHaveBeenCalled()
    })

    // Verificar se não houve erro (alert não foi chamado)
    expect(mockAlert).not.toHaveBeenCalled()
  })

  it('deve verificar conteúdo do PDF gerado', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    const { PDFService } = await import('../../../services/media/pdfService')
    
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'grave',
      riskPercentage: 85,
      urgency: 'grave',
      estimatedWaitTime: '1-2 horas',
      symptoms: ['Dor de cabeça severa', 'Náusea', 'Vômito'],
      recommendedSpecialties: ['Neurologia', 'Emergência'],
      recommendations: ['Procure atendimento imediato', 'Evite dirigir'],
      nextSteps: ['Vá ao hospital', 'Ligue para emergência'],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    // Mock do PDFService
    vi.mocked(PDFService.generateAndSavePDF).mockResolvedValue(undefined)

    render(<TriagemOnline />)
    
    // Completar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Dor de cabeça severa com náusea')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Clicar no botão de download
    const downloadButton = screen.getByText('Baixar Relatório Completo')
    await user.click(downloadButton)

    // Verificar se PDFService foi chamado com dados completos
    await waitFor(() => {
      expect(PDFService.generateAndSavePDF).toHaveBeenCalledWith(
        expect.objectContaining({
          paciente_nome: 'João Silva',
          nivel_risco: 'grave',
          sintomas: ['Dor de cabeça severa', 'Náusea', 'Vômito'],
          especialidades_recomendadas: ['Neurologia', 'Emergência'],
          observacoes: 'Procure atendimento imediato; Evite dirigir',
          perguntas_respostas: expect.arrayContaining([
            expect.objectContaining({
              pergunta: 'Como você está se sentindo hoje?',
              resposta: 'Dor de cabeça severa com náusea'
            })
          ])
        })
      )
    })
  })

  it('deve verificar dados do paciente no PDF', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    const { PDFService } = await import('../../../services/media/pdfService')
    
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'moderado',
      riskPercentage: 65,
      urgency: 'moderado',
      estimatedWaitTime: '2-4 horas',
      symptoms: ['Dor de cabeça'],
      recommendedSpecialties: ['Neurologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    // Mock do PDFService
    vi.mocked(PDFService.generateAndSavePDF).mockResolvedValue(undefined)

    render(<TriagemOnline />)
    
    // Completar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Clicar no botão de download
    const downloadButton = screen.getByText('Baixar Relatório Completo')
    await user.click(downloadButton)

    // Verificar dados do paciente
    await waitFor(() => {
      expect(PDFService.generateAndSavePDF).toHaveBeenCalledWith(
        expect.objectContaining({
          paciente_nome: 'João Silva',
          data_triagem: expect.any(String)
        })
      )
    })
  })

  it('deve verificar perguntas e respostas no PDF', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    const { PDFService } = await import('../../../services/media/pdfService')
    
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'moderado',
      riskPercentage: 65,
      urgency: 'moderado',
      estimatedWaitTime: '2-4 horas',
      symptoms: ['Dor de cabeça'],
      recommendedSpecialties: ['Neurologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    // Mock do PDFService
    vi.mocked(PDFService.generateAndSavePDF).mockResolvedValue(undefined)

    render(<TriagemOnline />)
    
    // Completar triagem com múltiplas perguntas
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    // Responder todas as perguntas
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Dor de cabeça constante')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Dor moderada a forte')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Faz quanto tempo que está assim?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Há 3 dias')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Clicar no botão de download
    const downloadButton = screen.getByText('Baixar Relatório Completo')
    await user.click(downloadButton)

    // Verificar perguntas e respostas
    await waitFor(() => {
      expect(PDFService.generateAndSavePDF).toHaveBeenCalledWith(
        expect.objectContaining({
          perguntas_respostas: [
            {
              pergunta: 'Como você está se sentindo hoje?',
              resposta: 'Dor de cabeça constante'
            },
            {
              pergunta: 'Qual a intensidade da dor?',
              resposta: 'Dor moderada a forte'
            },
            {
              pergunta: 'Faz quanto tempo que está assim?',
              resposta: 'Há 3 dias'
            }
          ]
        })
      )
    })
  })

  it('deve verificar resultado da análise no PDF', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    const { PDFService } = await import('../../../services/media/pdfService')
    
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'grave',
      riskPercentage: 85,
      urgency: 'grave',
      estimatedWaitTime: '1-2 horas',
      symptoms: ['Dor de cabeça severa', 'Náusea', 'Vômito', 'Tontura'],
      recommendedSpecialties: ['Neurologia', 'Emergência', 'Clínica Geral'],
      recommendations: [
        'Procure atendimento imediato',
        'Evite dirigir',
        'Mantenha-se hidratado'
      ],
      nextSteps: [
        'Vá ao hospital mais próximo',
        'Ligue para emergência se necessário',
        'Monitore sintomas'
      ],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    // Mock do PDFService
    vi.mocked(PDFService.generateAndSavePDF).mockResolvedValue(undefined)

    render(<TriagemOnline />)
    
    // Completar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Dor de cabeça severa com náusea e vômito')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Clicar no botão de download
    const downloadButton = screen.getByText('Baixar Relatório Completo')
    await user.click(downloadButton)

    // Verificar resultado da análise
    await waitFor(() => {
      expect(PDFService.generateAndSavePDF).toHaveBeenCalledWith(
        expect.objectContaining({
          nivel_risco: 'grave',
          sintomas: ['Dor de cabeça severa', 'Náusea', 'Vômito', 'Tontura'],
          especialidades_recomendadas: ['Neurologia', 'Emergência', 'Clínica Geral'],
          observacoes: 'Procure atendimento imediato; Evite dirigir; Mantenha-se hidratado'
        })
      )
    })
  })

  it('deve tratar erro na geração do PDF', async () => {
    const user = userEvent.setup()
    
    // Mock do triagemService
    const { triagemService } = await import('../../../services/consultation/triagemService')
    const { PDFService } = await import('../../../services/media/pdfService')
    
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'moderado',
      riskPercentage: 65,
      urgency: 'moderado',
      estimatedWaitTime: '2-4 horas',
      symptoms: ['Dor de cabeça'],
      recommendedSpecialties: ['Neurologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
      shouldSeekImmediateCare: false,
      alertMessage: undefined
    })

    // Mock do PDFService com erro
    vi.mocked(PDFService.generateAndSavePDF).mockRejectedValue(new Error('Erro ao gerar PDF'))

    render(<TriagemOnline />)
    
    // Completar triagem
    await waitFor(() => {
      expect(screen.getByText('Vamos Conversar')).toBeInTheDocument()
    })

    const startButton = screen.getByText('Vamos Começar a Conversar')
    await user.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Estou com dor de cabeça')
    await user.click(screen.getByText('Continuar'))

    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Clicar no botão de download
    const downloadButton = screen.getByText('Baixar Relatório Completo')
    await user.click(downloadButton)

    // Verificar se alert foi chamado com erro
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Erro ao gerar PDF. Tente novamente.')
    })
  })
})
