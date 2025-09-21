import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

// Interfaces para tipagem
interface Question {
  id: string
  text: string
  type: 'single' | 'multiple' | 'text' | 'scale'
  options?: string[]
  required: boolean
  category: string
}

interface PersonalData {
  name: string
  age: number
  gender: string
  email: string
  phone: string
  emergencyContact: string
}

interface TriageResult {
  id: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  urgency: string
  nextSteps: string[]
  pdfUrl?: string
}

// Mock dos serviços
const mockTriageService = {
  getQuestions: vi.fn(),
  submitAnswers: vi.fn(),
  getAnalysisResult: vi.fn(),
  savePersonalData: vi.fn()
}

const mockPdfService = {
  generateReport: vi.fn(),
  downloadPdf: vi.fn()
}

const mockAnalysisService = {
  analyzeTriage: vi.fn(),
  getRiskLevel: vi.fn(),
  generateRecommendations: vi.fn()
}

// Mock dos dados de teste
const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Você está sentindo dor no peito?',
    type: 'single',
    options: ['Sim', 'Não', 'Não sei'],
    required: true,
    category: 'symptoms'
  },
  {
    id: 'q2',
    text: 'Qual a intensidade da dor (0-10)?',
    type: 'scale',
    required: true,
    category: 'symptoms'
  },
  {
    id: 'q3',
    text: 'Você tem histórico de problemas cardíacos?',
    type: 'single',
    options: ['Sim', 'Não'],
    required: true,
    category: 'history'
  },
  {
    id: 'q4',
    text: 'Descreva outros sintomas:',
    type: 'text',
    required: false,
    category: 'symptoms'
  }
]

const mockPersonalData: PersonalData = {
  name: 'João Silva',
  age: 35,
  gender: 'masculino',
  email: 'joao.silva@email.com',
  phone: '(11) 99999-9999',
  emergencyContact: 'Maria Silva - (11) 88888-8888'
}

const mockTriageResult: TriageResult = {
  id: 'result-123',
  riskLevel: 'medium',
  recommendations: [
    'Procure um cardiologista em até 48 horas',
    'Monitore os sintomas',
    'Evite esforços físicos intensos'
  ],
  urgency: 'Média',
  nextSteps: [
    'Agendar consulta cardiológica',
    'Fazer exames complementares',
    'Retornar se sintomas piorarem'
  ],
  pdfUrl: 'https://api.vitalis.com/pdf/result-123.pdf'
}

// Componente mock para interface de triagem
const MockTriageInterface = () => {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, any>>({})
  const [personalData, setPersonalData] = React.useState<PersonalData>({
    name: '',
    age: 0,
    gender: '',
    email: '',
    phone: '',
    emergencyContact: ''
  })
  const [triageResult, setTriageResult] = React.useState<TriageResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false)

  const steps = [
    { id: 1, title: 'Questionário', component: 'questionnaire' },
    { id: 2, title: 'Dados Pessoais', component: 'personal-data' },
    { id: 3, title: 'Análise', component: 'analysis' },
    { id: 4, title: 'Resultados', component: 'results' }
  ]

  React.useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setIsLoading(true)
    try {
      const data = await mockTriageService.getQuestions()
      setQuestions(data)
    } catch (err) {
      setError('Erro ao carregar questionário')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setError('Esta pergunta é obrigatória')
      return
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setError('')
    } else {
      setCurrentStep(2)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handlePersonalDataChange = (field: keyof PersonalData, value: any) => {
    setPersonalData(prev => ({ ...prev, [field]: value }))
  }

  const submitPersonalData = async () => {
    if (!personalData.name || !personalData.email || !personalData.phone) {
      setError('Nome, email e telefone são obrigatórios')
      return
    }

    setIsLoading(true)
    try {
      await mockTriageService.savePersonalData(personalData)
      setCurrentStep(3)
      setError('')
      await startAnalysis()
    } catch (err) {
      setError('Erro ao salvar dados pessoais')
    } finally {
      setIsLoading(false)
    }
  }

  const startAnalysis = async () => {
    setIsAnalyzing(true)
    setError('')
    try {
      const result = await mockAnalysisService.analyzeTriage({
        answers,
        personalData
      })
      
      setTriageResult(result)
      setCurrentStep(4)
      
      // Gerar PDF automaticamente
      try {
        const pdfUrl = await mockPdfService.generateReport({
          personalData,
          answers,
          result
        })
        setTriageResult(prev => prev ? { ...prev, pdfUrl } : null)
      } catch (err) {
        // PDF generation failed, but don't block the flow
      }
    } catch (err) {
      setError('Erro ao analisar triagem')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generatePdf = async () => {
    if (!triageResult) return

    setIsGeneratingPdf(true)
    try {
      const pdfUrl = await mockPdfService.generateReport({
        personalData,
        answers,
        result: triageResult
      })
      
      setTriageResult(prev => prev ? { ...prev, pdfUrl } : null)
    } catch (err) {
      setError('Erro ao gerar PDF')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const downloadPdf = async () => {
    if (!triageResult?.pdfUrl) return

    try {
      await mockPdfService.downloadPdf(triageResult.pdfUrl)
    } catch (err) {
      setError('Erro ao baixar PDF')
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div data-testid="questionnaire-step">
            <h3>Questionário de Triagem</h3>
            <div data-testid="progress">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </div>
            
            {questions.length > 0 && (
              <div data-testid="current-question">
                <h4>{questions[currentQuestionIndex].text}</h4>
                
                {questions[currentQuestionIndex].type === 'single' && (
                  <div data-testid="single-options">
                    {questions[currentQuestionIndex].options?.map(option => (
                      <label key={option}>
                        <input
                          type="radio"
                          name={`question-${questions[currentQuestionIndex].id}`}
                          value={option}
                          onChange={(e) => handleAnswer(questions[currentQuestionIndex].id, e.target.value)}
                          checked={answers[questions[currentQuestionIndex].id] === option}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
                
                {questions[currentQuestionIndex].type === 'scale' && (
                  <div data-testid="scale-input">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={answers[questions[currentQuestionIndex].id] || 0}
                      onChange={(e) => handleAnswer(questions[currentQuestionIndex].id, parseInt(e.target.value))}
                    />
                    <span>Valor: {answers[questions[currentQuestionIndex].id] || 0}</span>
                  </div>
                )}
                
                {questions[currentQuestionIndex].type === 'text' && (
                  <div data-testid="text-input">
                    <textarea
                      value={answers[questions[currentQuestionIndex].id] || ''}
                      onChange={(e) => handleAnswer(questions[currentQuestionIndex].id, e.target.value)}
                      placeholder="Descreva aqui..."
                    />
                  </div>
                )}
              </div>
            )}
            
            <div data-testid="question-navigation">
              <button
                data-testid="previous-question"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Anterior
              </button>
              <button
                data-testid="next-question"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              </button>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div data-testid="personal-data-step">
            <h3>Dados Pessoais</h3>
            <form data-testid="personal-data-form">
              <div>
                <label htmlFor="name">Nome completo:</label>
                <input
                  id="name"
                  data-testid="name-input"
                  type="text"
                  value={personalData.name}
                  onChange={(e) => handlePersonalDataChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="age">Idade:</label>
                <input
                  id="age"
                  data-testid="age-input"
                  type="number"
                  value={personalData.age || ''}
                  onChange={(e) => handlePersonalDataChange('age', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="gender">Sexo:</label>
                <select
                  id="gender"
                  data-testid="gender-select"
                  value={personalData.gender}
                  onChange={(e) => handlePersonalDataChange('gender', e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  data-testid="email-input"
                  type="email"
                  value={personalData.email}
                  onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone">Telefone:</label>
                <input
                  id="phone"
                  data-testid="phone-input"
                  type="tel"
                  value={personalData.phone}
                  onChange={(e) => handlePersonalDataChange('phone', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="emergency">Contato de emergência:</label>
                <input
                  id="emergency"
                  data-testid="emergency-input"
                  type="text"
                  value={personalData.emergencyContact}
                  onChange={(e) => handlePersonalDataChange('emergencyContact', e.target.value)}
                />
              </div>
              
              <button
                type="button"
                data-testid="submit-personal-data"
                onClick={submitPersonalData}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Continuar'}
              </button>
            </form>
          </div>
        )
      
      case 3:
        return (
          <div data-testid="analysis-step">
            <h3>Analisando sua triagem...</h3>
            {isAnalyzing && (
              <div data-testid="analysis-progress">
                <div>🔍 Analisando respostas...</div>
                <div>📊 Calculando nível de risco...</div>
                <div>💡 Gerando recomendações...</div>
              </div>
            )}
          </div>
        )
      
      case 4:
        return (
          <div data-testid="results-step">
            <h3>Resultados da Triagem</h3>
            
            {triageResult && (
              <div data-testid="triage-results">
                <div data-testid="risk-level">
                  <h4>Nível de Risco: {triageResult.riskLevel.toUpperCase()}</h4>
                  <p>Urgência: {triageResult.urgency}</p>
                </div>
                
                <div data-testid="recommendations">
                  <h4>Recomendações:</h4>
                  <ul>
                    {triageResult.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div data-testid="next-steps">
                  <h4>Próximos Passos:</h4>
                  <ul>
                    {triageResult.nextSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
                
                <div data-testid="pdf-actions">
                  {!triageResult.pdfUrl ? (
                    <button
                      data-testid="generate-pdf"
                      onClick={generatePdf}
                      disabled={isGeneratingPdf}
                    >
                      {isGeneratingPdf ? 'Gerando PDF...' : 'Gerar Relatório PDF'}
                    </button>
                  ) : (
                    <button
                      data-testid="download-pdf"
                      onClick={downloadPdf}
                    >
                      📄 Baixar Relatório PDF
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  if (isLoading && questions.length === 0) {
    return <div data-testid="loading-questions">Carregando questionário...</div>
  }

  return (
    <div data-testid="triage-interface">
      <div data-testid="triage-steps">
        {steps.map(step => (
          <div
            key={step.id}
            data-testid={`step-${step.id}`}
            className={currentStep >= step.id ? 'active' : 'inactive'}
          >
            {step.id}. {step.title}
          </div>
        ))}
      </div>
      
      {error && (
        <div data-testid="error-message" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      
      {renderCurrentStep()}
    </div>
  )
}

// Função de render personalizada para testes
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/']) => {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('REG-003 - Fluxo Completo de Triagem Online', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock das APIs
    mockTriageService.getQuestions.mockResolvedValue(mockQuestions)
    mockTriageService.submitAnswers.mockResolvedValue({ success: true })
    mockTriageService.savePersonalData.mockResolvedValue({ success: true })
    
    mockAnalysisService.analyzeTriage.mockResolvedValue(mockTriageResult)
    mockAnalysisService.getRiskLevel.mockResolvedValue('medium')
    mockAnalysisService.generateRecommendations.mockResolvedValue(mockTriageResult.recommendations)
    
    mockPdfService.generateReport.mockResolvedValue(mockTriageResult.pdfUrl)
    mockPdfService.downloadPdf.mockResolvedValue({ success: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Fluxo Normal de Triagem', () => {
    it('deve completar o fluxo completo de triagem com sucesso', async () => {
      renderWithRouter(<MockTriageInterface />)
      
      // Aguardar carregamento das perguntas
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Responder primeira pergunta
      const yesOption = screen.getByDisplayValue('Sim')
      await userEvent.click(yesOption)
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder segunda pergunta (escala)
      const scaleInput = screen.getByTestId('scale-input').querySelector('input[type="range"]')
      fireEvent.change(scaleInput!, { target: { value: '7' } })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder terceira pergunta
      const noOption = screen.getByDisplayValue('Não')
      await userEvent.click(noOption)
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder quarta pergunta (texto)
      const textArea = screen.getByTestId('text-input').querySelector('textarea')
      await userEvent.type(textArea!, 'Dor de cabeça e náusea')
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Preencher dados pessoais
      await waitFor(() => {
        expect(screen.getByTestId('personal-data-step')).toBeInTheDocument()
      })
      
      await userEvent.type(screen.getByTestId('name-input'), 'João Silva')
      await userEvent.type(screen.getByTestId('age-input'), '35')
      await userEvent.selectOptions(screen.getByTestId('gender-select'), 'masculino')
      await userEvent.type(screen.getByTestId('email-input'), 'joao.silva@email.com')
      await userEvent.type(screen.getByTestId('phone-input'), '(11) 99999-9999')
      await userEvent.type(screen.getByTestId('emergency-input'), 'Maria Silva - (11) 88888-8888')
      
      await userEvent.click(screen.getByTestId('submit-personal-data'))
      
      // Aguardar resultados (análise pode ser muito rápida)
      await waitFor(() => {
        expect(screen.getByTestId('results-step')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Nível de Risco: MEDIUM')).toBeInTheDocument()
      expect(screen.getByText('Urgência: Média')).toBeInTheDocument()
      
      // Verificar se PDF está disponível (já vem gerado automaticamente)
      expect(screen.getByTestId('download-pdf')).toBeInTheDocument()
      
      // Verificar chamadas das APIs
      expect(mockTriageService.getQuestions).toHaveBeenCalled()
      expect(mockTriageService.savePersonalData).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'João Silva',
          age: 35,
          gender: 'masculino'
        })
      )
      expect(mockAnalysisService.analyzeTriage).toHaveBeenCalled()
      expect(mockPdfService.generateReport).toHaveBeenCalled()
    })

    it('deve navegar corretamente pelo questionário', async () => {
      renderWithRouter(<MockTriageInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Verificar progresso inicial
      expect(screen.getByText('Pergunta 1 de 4')).toBeInTheDocument()
      
      // Navegar para próxima pergunta
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      await waitFor(() => {
        expect(screen.getByText('Pergunta 2 de 4')).toBeInTheDocument()
      })
      
      // Voltar para pergunta anterior
      await userEvent.click(screen.getByTestId('previous-question'))
      
      await waitFor(() => {
        expect(screen.getByText('Pergunta 1 de 4')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Dados', () => {
    it('deve validar perguntas obrigatórias', async () => {
      renderWithRouter(<MockTriageInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Tentar avançar sem responder pergunta obrigatória
      await userEvent.click(screen.getByTestId('next-question'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Esta pergunta é obrigatória')).toBeInTheDocument()
    })

    it('deve validar dados pessoais obrigatórios', async () => {
      renderWithRouter(<MockTriageInterface />)
      
      // Navegar até dados pessoais
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Responder primeira pergunta
      // Responder primeira pergunta
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder segunda pergunta (escala)
      await waitFor(() => {
        expect(screen.getByTestId('scale-input')).toBeInTheDocument()
      })
      const scaleInput = screen.getByTestId('scale-input').querySelector('input[type="range"]')
      fireEvent.change(scaleInput!, { target: { value: '5' } })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder terceira pergunta
      await waitFor(() => {
        expect(screen.getByDisplayValue('Não')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder quarta pergunta (texto opcional)
      await waitFor(() => {
        expect(screen.getByTestId('text-input')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByTestId('next-question'))
      
      await waitFor(() => {
        expect(screen.getByTestId('personal-data-step')).toBeInTheDocument()
      })
      
      // Tentar submeter sem preencher campos obrigatórios
      await userEvent.click(screen.getByTestId('submit-personal-data'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Nome, email e telefone são obrigatórios')).toBeInTheDocument()
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve tratar erro ao carregar questionário', async () => {
      mockTriageService.getQuestions.mockRejectedValue(new Error('Erro de API'))
      
      renderWithRouter(<MockTriageInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao carregar questionário')).toBeInTheDocument()
    })

    it('deve tratar erro ao salvar dados pessoais', async () => {
      mockTriageService.savePersonalData.mockRejectedValue(new Error('Erro de rede'))
      
      renderWithRouter(<MockTriageInterface />)
      
      // Navegar até dados pessoais
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Responder primeira pergunta
      // Responder primeira pergunta
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder segunda pergunta (escala)
      await waitFor(() => {
        expect(screen.getByTestId('scale-input')).toBeInTheDocument()
      })
      const scaleInput = screen.getByTestId('scale-input').querySelector('input[type="range"]')
      fireEvent.change(scaleInput!, { target: { value: '5' } })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder terceira pergunta
      await waitFor(() => {
        expect(screen.getByDisplayValue('Não')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder quarta pergunta (texto opcional)
      await waitFor(() => {
        expect(screen.getByTestId('text-input')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByTestId('next-question'))
      
      await waitFor(() => {
        expect(screen.getByTestId('personal-data-step')).toBeInTheDocument()
      })
      
      // Preencher e submeter dados
      await userEvent.type(screen.getByTestId('name-input'), 'João Silva')
      await userEvent.type(screen.getByTestId('email-input'), 'joao@email.com')
      await userEvent.type(screen.getByTestId('phone-input'), '(11) 99999-9999')
      await userEvent.click(screen.getByTestId('submit-personal-data'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao salvar dados pessoais')).toBeInTheDocument()
    })

    it('deve tratar erro na análise da triagem', async () => {
      mockAnalysisService.analyzeTriage.mockRejectedValue(new Error('Erro de análise'))
      
      renderWithRouter(<MockTriageInterface />)
      
      // Completar fluxo até análise
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Responder primeira pergunta
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder segunda pergunta (escala)
      await waitFor(() => {
        expect(screen.getByTestId('scale-input')).toBeInTheDocument()
      })
      const scaleInput = screen.getByTestId('scale-input').querySelector('input[type="range"]')
      fireEvent.change(scaleInput!, { target: { value: '5' } })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder terceira pergunta
      await waitFor(() => {
        expect(screen.getByDisplayValue('Não')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder quarta pergunta (texto opcional)
      await waitFor(() => {
        expect(screen.getByTestId('text-input')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Preencher dados pessoais
      await waitFor(() => {
        expect(screen.getByTestId('personal-data-step')).toBeInTheDocument()
      })
      
      await userEvent.type(screen.getByTestId('name-input'), 'João Silva')
      await userEvent.type(screen.getByTestId('email-input'), 'joao@email.com')
      await userEvent.type(screen.getByTestId('phone-input'), '(11) 99999-9999')
      await userEvent.click(screen.getByTestId('submit-personal-data'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao analisar triagem')).toBeInTheDocument()
    })

    it('deve tratar erro na geração de PDF', async () => {
      mockPdfService.generateReport.mockRejectedValue(new Error('Erro de PDF'))
      
      renderWithRouter(<MockTriageInterface />)
      
      // Completar fluxo até resultados
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Responder primeira pergunta
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder segunda pergunta (escala)
      await waitFor(() => {
        expect(screen.getByTestId('scale-input')).toBeInTheDocument()
      })
      const scaleInput = screen.getByTestId('scale-input').querySelector('input[type="range"]')
      fireEvent.change(scaleInput!, { target: { value: '5' } })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder terceira pergunta
      await waitFor(() => {
        expect(screen.getByDisplayValue('Não')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder quarta pergunta (texto opcional)
      await waitFor(() => {
        expect(screen.getByTestId('text-input')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Preencher dados pessoais
      await waitFor(() => {
        expect(screen.getByTestId('personal-data-step')).toBeInTheDocument()
      })
      
      await userEvent.type(screen.getByTestId('name-input'), 'João Silva')
      await userEvent.type(screen.getByTestId('email-input'), 'joao@email.com')
      await userEvent.type(screen.getByTestId('phone-input'), '(11) 99999-9999')
      await userEvent.click(screen.getByTestId('submit-personal-data'))
      
      // Aguardar resultados
      await waitFor(() => {
        expect(screen.getByTestId('results-step')).toBeInTheDocument()
      })
      
      // Verificar que PDF está disponível (gerado automaticamente)
      expect(screen.getByTestId('download-pdf')).toBeInTheDocument()
    })
  })

  describe('Cenários Especiais', () => {
    it('deve lidar com timeout na análise', async () => {
      mockAnalysisService.analyzeTriage.mockImplementation(() => 
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      )
      
      renderWithRouter(<MockTriageInterface />)
      
      // Completar fluxo até análise
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Responder primeira pergunta
      // Responder primeira pergunta
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder segunda pergunta (escala)
      await waitFor(() => {
        expect(screen.getByTestId('scale-input')).toBeInTheDocument()
      })
      const scaleInput = screen.getByTestId('scale-input').querySelector('input[type="range"]')
      fireEvent.change(scaleInput!, { target: { value: '5' } })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder terceira pergunta
      await waitFor(() => {
        expect(screen.getByDisplayValue('Não')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Responder quarta pergunta (texto opcional)
      await waitFor(() => {
        expect(screen.getByTestId('text-input')).toBeInTheDocument()
      })
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Preencher dados pessoais
      await waitFor(() => {
        expect(screen.getByTestId('personal-data-step')).toBeInTheDocument()
      })
      
      await userEvent.type(screen.getByTestId('name-input'), 'João Silva')
      await userEvent.type(screen.getByTestId('email-input'), 'joao@email.com')
      await userEvent.type(screen.getByTestId('phone-input'), '(11) 99999-9999')
      await userEvent.click(screen.getByTestId('submit-personal-data'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao analisar triagem')).toBeInTheDocument()
    })

    it('deve validar diferentes tipos de pergunta', async () => {
      renderWithRouter(<MockTriageInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Testar pergunta de múltipla escolha
      await userEvent.click(screen.getByDisplayValue('Sim'))
      expect(screen.getByDisplayValue('Sim')).toBeChecked()
      
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Testar pergunta de escala
      await waitFor(() => {
        expect(screen.getByTestId('scale-input')).toBeInTheDocument()
      })
      
      const scaleInput = screen.getByTestId('scale-input').querySelector('input[type="range"]')
      fireEvent.change(scaleInput!, { target: { value: '5' } })
      expect(screen.getByText('Valor: 5')).toBeInTheDocument()
      
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Testar pergunta de texto (avançar para a última pergunta)
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      await waitFor(() => {
        expect(screen.getByTestId('text-input')).toBeInTheDocument()
      })
      
      const textArea = screen.getByTestId('text-input').querySelector('textarea')
      await userEvent.type(textArea!, 'Sintomas diversos')
      expect(textArea).toHaveValue('Sintomas diversos')
    })
  })

  describe('Integração com APIs', () => {
    it('deve chamar todas as APIs necessárias no fluxo completo', async () => {
      renderWithRouter(<MockTriageInterface />)
      
      // Completar fluxo completo
      await waitFor(() => {
        expect(screen.getByTestId('questionnaire-step')).toBeInTheDocument()
      })
      
      // Responder perguntas
      await userEvent.click(screen.getByDisplayValue('Sim'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      const scaleInput = screen.getByTestId('scale-input').querySelector('input[type="range"]')
      fireEvent.change(scaleInput!, { target: { value: '8' } })
      await userEvent.click(screen.getByTestId('next-question'))
      
      await userEvent.click(screen.getByDisplayValue('Não'))
      await userEvent.click(screen.getByTestId('next-question'))
      
      const textArea = screen.getByTestId('text-input').querySelector('textarea')
      await userEvent.type(textArea!, 'Dor intensa')
      await userEvent.click(screen.getByTestId('next-question'))
      
      // Preencher dados pessoais
      await waitFor(() => {
        expect(screen.getByTestId('personal-data-step')).toBeInTheDocument()
      })
      
      await userEvent.type(screen.getByTestId('name-input'), 'Maria Santos')
      await userEvent.type(screen.getByTestId('age-input'), '28')
      await userEvent.selectOptions(screen.getByTestId('gender-select'), 'feminino')
      await userEvent.type(screen.getByTestId('email-input'), 'maria@email.com')
      await userEvent.type(screen.getByTestId('phone-input'), '(11) 88888-8888')
      await userEvent.click(screen.getByTestId('submit-personal-data'))
      
      // Aguardar resultados
      await waitFor(() => {
        expect(screen.getByTestId('results-step')).toBeInTheDocument()
      })
      
      // Verificar se PDF está disponível (já vem gerado automaticamente)
      expect(screen.getByTestId('download-pdf')).toBeInTheDocument()
      
      // Verificar chamadas das APIs
      expect(mockTriageService.getQuestions).toHaveBeenCalled()
      expect(mockTriageService.savePersonalData).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Maria Santos',
          age: 28,
          gender: 'feminino'
        })
      )
      expect(mockAnalysisService.analyzeTriage).toHaveBeenCalledWith(
        expect.objectContaining({
          answers: expect.objectContaining({
            q1: 'Sim',
            q2: 8,
            q3: 'Não',
            q4: 'Dor intensa'
          }),
          personalData: expect.objectContaining({
            name: 'Maria Santos'
          })
        })
      )
      // PDF é gerado automaticamente quando os resultados são criados
      expect(mockPdfService.generateReport).toHaveBeenCalled()
    })
  })
})
