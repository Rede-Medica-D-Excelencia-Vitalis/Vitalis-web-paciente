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

describe('TRIA-006 - Análise e Resultado', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve responder última pergunta e iniciar análise', async () => {
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

    // Mock da análise da IA
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'moderado',
      riskPercentage: 65,
      urgency: 'moderado',
      estimatedWaitTime: '2-4 horas',
      symptoms: ['Dor de cabeça', 'Náusea', 'Tontura'],
      recommendedSpecialties: ['Neurologia', 'Clínica Geral'],
      recommendations: [
        'Evite esforços físicos',
        'Mantenha-se hidratado',
        'Procure atendimento médico'
      ],
      nextSteps: [
        'Agende consulta com neurologista',
        'Monitore sintomas',
        'Retorne se piorar'
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

    // Responder primeira pergunta
    await waitFor(() => {
      expect(screen.getByText('Como você está se sentindo hoje?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'Estou com dor de cabeça forte')
    await user.click(screen.getByText('Continuar'))

    // Responder segunda pergunta (última)
    await waitFor(() => {
      expect(screen.getByText('Qual a intensidade da dor?')).toBeInTheDocument()
    })

    await user.type(screen.getByRole('textbox'), 'A dor é muito forte e constante')
    await user.click(screen.getByText('Continuar'))

    // Verificar se a análise foi chamada
    await waitFor(() => {
      expect(triagemService.analyzeTriagem).toHaveBeenCalled()
    })
  })

  it('deve aguardar análise da IA e mostrar loading', async () => {
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

    // Mock da análise da IA com delay
    let resolveAnalysis: (value: any) => void
    const analysisPromise = new Promise<any>((resolve) => {
      resolveAnalysis = resolve
    })
    vi.mocked(triagemService.analyzeTriagem).mockReturnValue(analysisPromise as any)

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

    // Verificar se está em loading
    await waitFor(() => {
      expect(screen.getByText('Analisando o que você contou...')).toBeInTheDocument()
    })

    // Resolver a análise
    resolveAnalysis!({
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

    // Verificar se saiu do loading
    await waitFor(() => {
      expect(screen.queryByText('Analisando suas respostas...')).not.toBeInTheDocument()
    })
  })

  it('deve verificar tela de resultado após análise', async () => {
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
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
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

    expect(screen.getByText('Sua triagem foi analisada com sucesso pela nossa IA')).toBeInTheDocument()
    expect(screen.getByText('Resultado da Triagem')).toBeInTheDocument()
  })

  it('deve analisar informações exibidas no resultado', async () => {
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
      symptoms: ['Dor de cabeça', 'Náusea', 'Tontura'],
      recommendedSpecialties: ['Neurologia', 'Clínica Geral'],
      recommendations: [
        'Evite esforços físicos',
        'Mantenha-se hidratado',
        'Procure atendimento médico'
      ],
      nextSteps: [
        'Agende consulta com neurologista',
        'Monitore sintomas',
        'Retorne se piorar'
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

    // Verificar informações exibidas
    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    // Verificar seções principais
    expect(screen.getByText('Resultado da Triagem')).toBeInTheDocument()
    expect(screen.getByText('Sintomas Detectados')).toBeInTheDocument()
    expect(screen.getByText('Especialidades Recomendadas')).toBeInTheDocument()
    expect(screen.getByText('Recomendações')).toBeInTheDocument()
    expect(screen.getByText('Próximos Passos')).toBeInTheDocument()
  })

  it('deve verificar nível de risco exibido', async () => {
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
      symptoms: ['Dor de cabeça'],
      recommendedSpecialties: ['Neurologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
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

    // Verificar nível de risco
    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    expect(screen.getByText('65%')).toBeInTheDocument()
    expect(screen.getByText('Nível de Risco')).toBeInTheDocument()
    expect(screen.getByText('MODERADO')).toBeInTheDocument()
  })

  it('deve verificar sintomas detectados', async () => {
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
      symptoms: ['Dor de cabeça', 'Náusea', 'Tontura'],
      recommendedSpecialties: ['Neurologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
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

    // Verificar sintomas detectados
    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    expect(screen.getByText('Sintomas Detectados')).toBeInTheDocument()
    expect(screen.getByText('Dor de cabeça')).toBeInTheDocument()
    expect(screen.getByText('Náusea')).toBeInTheDocument()
    expect(screen.getByText('Tontura')).toBeInTheDocument()
  })

  it('deve verificar especialidades recomendadas', async () => {
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
      symptoms: ['Dor de cabeça'],
      recommendedSpecialties: ['Neurologia', 'Clínica Geral', 'Oftalmologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
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

    // Verificar especialidades recomendadas
    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    expect(screen.getByText('Especialidades Recomendadas')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // Contador de especialidades
    expect(screen.getByText('Neurologia')).toBeInTheDocument()
    expect(screen.getByText('Clínica Geral')).toBeInTheDocument()
    expect(screen.getByText('Oftalmologia')).toBeInTheDocument()
  })

  it('deve verificar botões de ação disponíveis', async () => {
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
      symptoms: ['Dor de cabeça'],
      recommendedSpecialties: ['Neurologia'],
      recommendations: ['Procure atendimento médico'],
      nextSteps: ['Agende consulta'],
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

    // Verificar botões de ação
    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    expect(screen.getByText('Baixar Relatório Completo')).toBeInTheDocument()
    expect(screen.getByText('Agendar Consulta')).toBeInTheDocument()
    
    // Testar clique no botão de agendar consulta
    const agendarButton = screen.getByText('Agendar Consulta')
    await user.click(agendarButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/agendamento')
  })

  it('deve exibir alerta de emergência para casos graves', async () => {
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

    // Mock da análise da IA com caso grave
    vi.mocked(triagemService.analyzeTriagem).mockResolvedValue({
      riskLevel: 'muito_grave',
      riskPercentage: 95,
      urgency: 'muito_grave',
      estimatedWaitTime: 'IMEDIATO',
      symptoms: ['Dor no peito', 'Falta de ar', 'Suor frio'],
      recommendedSpecialties: ['Cardiologia', 'Emergência'],
      recommendations: ['Procure atendimento imediato'],
      nextSteps: ['Vá ao hospital mais próximo'],
      shouldSeekImmediateCare: true,
      alertMessage: 'Sintomas podem indicar infarto. Procure atendimento imediato!'
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

    await user.type(screen.getByRole('textbox'), 'Dor no peito e falta de ar')
    await user.click(screen.getByText('Continuar'))

    // Verificar alerta de emergência
    await waitFor(() => {
      expect(screen.getByText('Análise Completa')).toBeInTheDocument()
    })

    expect(screen.getByText('ALERTA IMPORTANTE')).toBeInTheDocument()
    expect(screen.getByText('Sintomas podem indicar infarto. Procure atendimento imediato!')).toBeInTheDocument()
    expect(screen.getByText('🚑 CHAME 192 IMEDIATAMENTE OU DIRIJA-SE AO HOSPITAL MAIS PRÓXIMO')).toBeInTheDocument()
    expect(screen.getByText('MUITO GRAVE')).toBeInTheDocument()
    expect(screen.getByText('EMERGÊNCIA')).toBeInTheDocument()
  })
})
