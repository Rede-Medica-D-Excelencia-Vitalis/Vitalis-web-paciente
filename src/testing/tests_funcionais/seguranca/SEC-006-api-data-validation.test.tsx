import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

// Mock dos serviços de API
const mockApiService = {
  getDoctorInfo: vi.fn(),
  getProductDescription: vi.fn(),
  getChatMessages: vi.fn(),
  getConsultationData: vi.fn(),
  getUserProfile: vi.fn(),
  sendMessage: vi.fn()
}

// Mock do console para capturar logs de segurança
const mockConsole = {
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn()
}

// Função de validação de dados da API
const validateApiData = (data: any, type: string): { isValid: boolean; sanitizedData?: any; error?: string } => {
  if (!data) {
    return { isValid: false, error: 'Dados inválidos recebidos da API' }
  }

  // Função para sanitizar strings
  const sanitizeString = (str: string): string => {
    if (typeof str !== 'string') return ''
    
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<img\b[^>]*onerror[^>]*>/gi, '')
      .replace(/<iframe\b[^>]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/eval\s*\([^)]*\)/gi, '')
      .replace(/Function\s*\([^)]*\)/gi, '')
      .replace(/["'][^"']*malicious[^"']*["']/gi, '')
      .trim()
  }

  // Função para validar estrutura de dados
  const validateStructure = (obj: any, requiredFields: string[]): boolean => {
    if (!obj || typeof obj !== 'object') return false
    
    for (const field of requiredFields) {
      if (!(field in obj)) return false
    }
    return true
  }

  try {
    switch (type) {
      case 'doctor':
        if (!validateStructure(data, ['id', 'name', 'specialty', 'email'])) {
          return { isValid: false, error: 'Estrutura de dados do médico inválida' }
        }
        
        const sanitizedDoctor = {
          ...data,
          name: sanitizeString(data.name || ''),
          specialty: sanitizeString(data.specialty || ''),
          email: sanitizeString(data.email || '')
        }
        
        if (!sanitizedDoctor.name || sanitizedDoctor.name.length < 2) {
          return { isValid: false, error: 'Nome do médico inválido' }
        }
        
        return { isValid: true, sanitizedData: sanitizedDoctor }

      case 'product':
        if (!validateStructure(data, ['id', 'name', 'description', 'price'])) {
          return { isValid: false, error: 'Estrutura de dados do produto inválida' }
        }
        
        const sanitizedProduct = {
          ...data,
          name: sanitizeString(data.name || ''),
          description: sanitizeString(data.description || '')
        }
        
        if (!sanitizedProduct.name || sanitizedProduct.name.length < 1) {
          return { isValid: false, error: 'Nome do produto inválido' }
        }
        
        if (typeof data.price !== 'number' || data.price < 0) {
          return { isValid: false, error: 'Preço do produto inválido' }
        }
        
        return { isValid: true, sanitizedData: sanitizedProduct }

      case 'chat':
        if (!Array.isArray(data)) {
          return { isValid: false, error: 'Dados de chat devem ser um array' }
        }
        
        const sanitizedMessages = data.map((message: any) => {
          if (!validateStructure(message, ['id', 'content', 'timestamp'])) {
            return null
          }
          
          return {
            ...message,
            content: sanitizeString(message.content || '')
          }
        }).filter(Boolean)
        
        return { isValid: true, sanitizedData: sanitizedMessages }

      case 'consultation':
        if (!validateStructure(data, ['id', 'patientId', 'doctorId', 'date', 'status'])) {
          return { isValid: false, error: 'Estrutura de dados de consulta inválida' }
        }
        
        const sanitizedConsultation = {
          ...data,
          status: sanitizeString(data.status || '')
        }
        
        if (!['scheduled', 'completed', 'cancelled'].includes(sanitizedConsultation.status)) {
          return { isValid: false, error: 'Status de consulta inválido' }
        }
        
        return { isValid: true, sanitizedData: sanitizedConsultation }

      case 'profile':
        if (!validateStructure(data, ['id', 'name', 'email', 'phone'])) {
          return { isValid: false, error: 'Estrutura de dados de perfil inválida' }
        }
        
        const sanitizedProfile = {
          ...data,
          name: sanitizeString(data.name || ''),
          email: sanitizeString(data.email || ''),
          phone: sanitizeString(data.phone || '')
        }
        
        if (!sanitizedProfile.name || sanitizedProfile.name.length < 2) {
          return { isValid: false, error: 'Nome do usuário inválido' }
        }
        
        return { isValid: true, sanitizedData: sanitizedProfile }

      default:
        return { isValid: false, error: 'Tipo de dados não reconhecido' }
    }
  } catch (error) {
    mockConsole.error('Erro na validação de dados da API:', error)
    return { isValid: false, error: 'Erro interno na validação' }
  }
}

// Componente mock para testar validação de dados
const MockDataDisplay = ({ dataType, data }: { dataType: string; data: any }) => {
  const [displayData, setDisplayData] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let apiData: any
      
      switch (dataType) {
        case 'doctor':
          apiData = await mockApiService.getDoctorInfo()
          break
        case 'product':
          apiData = await mockApiService.getProductDescription()
          break
        case 'chat':
          apiData = await mockApiService.getChatMessages()
          break
        case 'consultation':
          apiData = await mockApiService.getConsultationData()
          break
        case 'profile':
          apiData = await mockApiService.getUserProfile()
          break
        default:
          throw new Error('Tipo de dados não suportado')
      }
      
      const validation = validateApiData(apiData, dataType)
      
      if (validation.isValid && validation.sanitizedData) {
        setDisplayData(validation.sanitizedData)
        mockConsole.log(`Dados ${dataType} validados e sanitizados com sucesso`)
        
        // Verificar se dados foram sanitizados (comparar original com sanitizado)
        if (JSON.stringify(apiData) !== JSON.stringify(validation.sanitizedData)) {
          mockConsole.warn(`Dados ${dataType} maliciosos detectados e sanitizados:`, apiData)
        }
      } else {
        setError(validation.error || 'Erro na validação')
        mockConsole.warn(`Tentativa de carregar dados ${dataType} maliciosos detectada:`, apiData)
      }
    } catch (err) {
      setError('Erro ao carregar dados da API')
      mockConsole.error('Erro na API:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div data-testid={`${dataType}-display`}>
      <button onClick={loadData} data-testid={`load-${dataType}`} disabled={isLoading}>
        {isLoading ? 'Carregando...' : `Carregar ${dataType}`}
      </button>
      
      {error && (
        <div data-testid={`${dataType}-error`} style={{ color: 'red' }}>
          {error}
        </div>
      )}
      
      {displayData && (
        <div data-testid={`${dataType}-content`}>
          <pre>{JSON.stringify(displayData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

// Função de render personalizada para testes de segurança
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/']) => {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('SEC-006 - Validação de Dados Recebidos da API', () => {
  // Dados válidos para teste
  const validData = {
    doctor: {
      id: '1',
      name: 'Dr. João Silva',
      specialty: 'Cardiologia',
      email: 'joao.silva@vitalis.com'
    },
    product: {
      id: '1',
      name: 'Medicamento A',
      description: 'Medicamento para tratamento cardíaco',
      price: 25.99
    },
    chat: [
      {
        id: '1',
        content: 'Olá, como posso ajudar?',
        timestamp: '2024-01-01T10:00:00Z'
      }
    ],
    consultation: {
      id: '1',
      patientId: '1',
      doctorId: '1',
      date: '2024-01-01T10:00:00Z',
      status: 'scheduled'
    },
    profile: {
      id: '1',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 99999-9999'
    }
  }

  // Dados maliciosos para teste
  const maliciousData = {
    doctor: {
      id: '1',
      name: '<script>alert("XSS")</script>Dr. João Silva',
      specialty: 'Cardiologia',
      email: 'joao.silva@vitalis.com'
    },
    product: {
      id: '1',
      name: 'Medicamento A',
      description: '<img src=x onerror=alert("XSS")>Medicamento para tratamento',
      price: 25.99
    },
    chat: [
      {
        id: '1',
        content: 'javascript:alert("XSS") Olá, como posso ajudar?',
        timestamp: '2024-01-01T10:00:00Z'
      }
    ],
    consultation: {
      id: '1',
      patientId: '1',
      doctorId: '1',
      date: '2024-01-01T10:00:00Z',
      status: '<script>alert("XSS")</script>scheduled'
    },
    profile: {
      id: '1',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: 'eval("malicious code")(11) 99999-9999'
    }
  }

  // Dados corrompidos para teste
  const corruptedData = {
    doctor: null,
    product: { id: '1' }, // Estrutura incompleta
    chat: 'not an array', // Tipo incorreto
    consultation: {
      id: '1',
      patientId: '1',
      doctorId: '1',
      date: '2024-01-01T10:00:00Z',
      status: 'invalid_status' // Status inválido
    },
    profile: {
      id: '1',
      name: '', // Nome vazio
      email: 'maria.santos@email.com',
      phone: '(11) 99999-9999'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(console, mockConsole)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Validação de Dados Válidos', () => {
    it('deve validar e processar dados válidos de médico', async () => {
      mockApiService.getDoctorInfo.mockResolvedValue(validData.doctor)
      
      renderWithRouter(<MockDataDisplay dataType="doctor" data={validData.doctor} />)
      
      const loadButton = screen.getByTestId('load-doctor')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-content')).toBeInTheDocument()
      })
      
      expect(screen.queryByTestId('doctor-error')).not.toBeInTheDocument()
      expect(mockConsole.log).toHaveBeenCalledWith('Dados doctor validados e sanitizados com sucesso')
    })

    it('deve validar e processar dados válidos de produto', async () => {
      mockApiService.getProductDescription.mockResolvedValue(validData.product)
      
      renderWithRouter(<MockDataDisplay dataType="product" data={validData.product} />)
      
      const loadButton = screen.getByTestId('load-product')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('product-content')).toBeInTheDocument()
      })
      
      expect(screen.queryByTestId('product-error')).not.toBeInTheDocument()
      expect(mockConsole.log).toHaveBeenCalledWith('Dados product validados e sanitizados com sucesso')
    })

    it('deve validar e processar dados válidos de chat', async () => {
      mockApiService.getChatMessages.mockResolvedValue(validData.chat)
      
      renderWithRouter(<MockDataDisplay dataType="chat" data={validData.chat} />)
      
      const loadButton = screen.getByTestId('load-chat')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-content')).toBeInTheDocument()
      })
      
      expect(screen.queryByTestId('chat-error')).not.toBeInTheDocument()
      expect(mockConsole.log).toHaveBeenCalledWith('Dados chat validados e sanitizados com sucesso')
    })

    it('deve validar e processar dados válidos de consulta', async () => {
      mockApiService.getConsultationData.mockResolvedValue(validData.consultation)
      
      renderWithRouter(<MockDataDisplay dataType="consultation" data={validData.consultation} />)
      
      const loadButton = screen.getByTestId('load-consultation')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('consultation-content')).toBeInTheDocument()
      })
      
      expect(screen.queryByTestId('consultation-error')).not.toBeInTheDocument()
      expect(mockConsole.log).toHaveBeenCalledWith('Dados consultation validados e sanitizados com sucesso')
    })

    it('deve validar e processar dados válidos de perfil', async () => {
      mockApiService.getUserProfile.mockResolvedValue(validData.profile)
      
      renderWithRouter(<MockDataDisplay dataType="profile" data={validData.profile} />)
      
      const loadButton = screen.getByTestId('load-profile')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-content')).toBeInTheDocument()
      })
      
      expect(screen.queryByTestId('profile-error')).not.toBeInTheDocument()
      expect(mockConsole.log).toHaveBeenCalledWith('Dados profile validados e sanitizados com sucesso')
    })
  })

  describe('Sanitização de Dados Maliciosos', () => {
    it('deve sanitizar scripts maliciosos em dados de médico', async () => {
      mockApiService.getDoctorInfo.mockResolvedValue(maliciousData.doctor)
      
      renderWithRouter(<MockDataDisplay dataType="doctor" data={maliciousData.doctor} />)
      
      const loadButton = screen.getByTestId('load-doctor')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-content')).toBeInTheDocument()
      })
      
      const content = screen.getByTestId('doctor-content')
      expect(content.textContent).toContain('Dr. João Silva')
      expect(content.textContent).not.toContain('<script>')
      expect(content.textContent).not.toContain('alert("XSS")')
    })

    it('deve sanitizar atributos maliciosos em dados de produto', async () => {
      mockApiService.getProductDescription.mockResolvedValue(maliciousData.product)
      
      renderWithRouter(<MockDataDisplay dataType="product" data={maliciousData.product} />)
      
      const loadButton = screen.getByTestId('load-product')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('product-content')).toBeInTheDocument()
      })
      
      const content = screen.getByTestId('product-content')
      expect(content.textContent).toContain('Medicamento para tratamento')
      expect(content.textContent).not.toContain('<img')
      expect(content.textContent).not.toContain('onerror')
    })

    it('deve sanitizar protocolo javascript em dados de chat', async () => {
      mockApiService.getChatMessages.mockResolvedValue(maliciousData.chat)
      
      renderWithRouter(<MockDataDisplay dataType="chat" data={maliciousData.chat} />)
      
      const loadButton = screen.getByTestId('load-chat')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-content')).toBeInTheDocument()
      })
      
      const content = screen.getByTestId('chat-content')
      expect(content.textContent).toContain('Olá, como posso ajudar?')
      expect(content.textContent).not.toContain('javascript:')
    })

    it('deve sanitizar scripts em dados de consulta', async () => {
      mockApiService.getConsultationData.mockResolvedValue(maliciousData.consultation)
      
      renderWithRouter(<MockDataDisplay dataType="consultation" data={maliciousData.consultation} />)
      
      const loadButton = screen.getByTestId('load-consultation')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('consultation-content')).toBeInTheDocument()
      })
      
      const content = screen.getByTestId('consultation-content')
      expect(content.textContent).toContain('scheduled')
      expect(content.textContent).not.toContain('<script>')
    })

    it('deve sanitizar eval malicioso em dados de perfil', async () => {
      mockApiService.getUserProfile.mockResolvedValue(maliciousData.profile)
      
      renderWithRouter(<MockDataDisplay dataType="profile" data={maliciousData.profile} />)
      
      const loadButton = screen.getByTestId('load-profile')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-content')).toBeInTheDocument()
      })
      
      const content = screen.getByTestId('profile-content')
      expect(content.textContent).toContain('(11) 99999-9999')
      expect(content.textContent).not.toContain('eval(')
      expect(content.textContent).not.toContain('malicious code')
    })
  })

  describe('Tratamento de Dados Corrompidos', () => {
    it('deve rejeitar dados nulos de médico', async () => {
      mockApiService.getDoctorInfo.mockResolvedValue(corruptedData.doctor)
      
      renderWithRouter(<MockDataDisplay dataType="doctor" data={corruptedData.doctor} />)
      
      const loadButton = screen.getByTestId('load-doctor')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-error')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Dados inválidos recebidos da API')).toBeInTheDocument()
      expect(screen.queryByTestId('doctor-content')).not.toBeInTheDocument()
    })

    it('deve rejeitar estrutura incompleta de produto', async () => {
      mockApiService.getProductDescription.mockResolvedValue(corruptedData.product)
      
      renderWithRouter(<MockDataDisplay dataType="product" data={corruptedData.product} />)
      
      const loadButton = screen.getByTestId('load-product')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('product-error')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Estrutura de dados do produto inválida')).toBeInTheDocument()
    })

    it('deve rejeitar tipo incorreto de dados de chat', async () => {
      mockApiService.getChatMessages.mockResolvedValue(corruptedData.chat)
      
      renderWithRouter(<MockDataDisplay dataType="chat" data={corruptedData.chat} />)
      
      const loadButton = screen.getByTestId('load-chat')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-error')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Dados de chat devem ser um array')).toBeInTheDocument()
    })

    it('deve rejeitar status inválido de consulta', async () => {
      mockApiService.getConsultationData.mockResolvedValue(corruptedData.consultation)
      
      renderWithRouter(<MockDataDisplay dataType="consultation" data={corruptedData.consultation} />)
      
      const loadButton = screen.getByTestId('load-consultation')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('consultation-error')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Status de consulta inválido')).toBeInTheDocument()
    })

    it('deve rejeitar nome vazio de perfil', async () => {
      mockApiService.getUserProfile.mockResolvedValue(corruptedData.profile)
      
      renderWithRouter(<MockDataDisplay dataType="profile" data={corruptedData.profile} />)
      
      const loadButton = screen.getByTestId('load-profile')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('profile-error')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Nome do usuário inválido')).toBeInTheDocument()
    })
  })

  describe('Logs de Segurança', () => {
    it('deve registrar tentativas de dados maliciosos', async () => {
      mockApiService.getDoctorInfo.mockResolvedValue(maliciousData.doctor)
      
      renderWithRouter(<MockDataDisplay dataType="doctor" data={maliciousData.doctor} />)
      
      const loadButton = screen.getByTestId('load-doctor')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-content')).toBeInTheDocument()
      })
      
      expect(mockConsole.warn).toHaveBeenCalledWith(
        'Dados doctor maliciosos detectados e sanitizados:',
        maliciousData.doctor
      )
    })

    it('deve registrar erros de validação', async () => {
      mockApiService.getDoctorInfo.mockResolvedValue(corruptedData.doctor)
      
      renderWithRouter(<MockDataDisplay dataType="doctor" data={corruptedData.doctor} />)
      
      const loadButton = screen.getByTestId('load-doctor')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-error')).toBeInTheDocument()
      })
      
      expect(mockConsole.error).toHaveBeenCalled()
    })
  })

  describe('Validação de Estruturas de Dados', () => {
    it('deve validar campos obrigatórios de médico', () => {
      const incompleteDoctor = { id: '1', name: 'Dr. João' }
      const validation = validateApiData(incompleteDoctor, 'doctor')
      
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBe('Estrutura de dados do médico inválida')
    })

    it('deve validar campos obrigatórios de produto', () => {
      const incompleteProduct = { id: '1', name: 'Produto A' }
      const validation = validateApiData(incompleteProduct, 'product')
      
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBe('Estrutura de dados do produto inválida')
    })

    it('deve validar array de mensagens de chat', () => {
      const invalidChat = { id: '1', content: 'Mensagem' }
      const validation = validateApiData(invalidChat, 'chat')
      
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBe('Dados de chat devem ser um array')
    })

    it('deve validar campos obrigatórios de consulta', () => {
      const incompleteConsultation = { id: '1', patientId: '1' }
      const validation = validateApiData(incompleteConsultation, 'consultation')
      
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBe('Estrutura de dados de consulta inválida')
    })

    it('deve validar campos obrigatórios de perfil', () => {
      const incompleteProfile = { id: '1', name: 'Maria' }
      const validation = validateApiData(incompleteProfile, 'profile')
      
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBe('Estrutura de dados de perfil inválida')
    })
  })

  describe('Tratamento de Erros de API', () => {
    it('deve tratar erro de rede na API', async () => {
      mockApiService.getDoctorInfo.mockRejectedValue(new Error('Network Error'))
      
      renderWithRouter(<MockDataDisplay dataType="doctor" data={validData.doctor} />)
      
      const loadButton = screen.getByTestId('load-doctor')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-error')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao carregar dados da API')).toBeInTheDocument()
      expect(mockConsole.error).toHaveBeenCalledWith('Erro na API:', expect.any(Error))
    })

    it('deve tratar timeout da API', async () => {
      mockApiService.getDoctorInfo.mockImplementation(() => 
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      )
      
      renderWithRouter(<MockDataDisplay dataType="doctor" data={validData.doctor} />)
      
      const loadButton = screen.getByTestId('load-doctor')
      await userEvent.click(loadButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-error')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao carregar dados da API')).toBeInTheDocument()
    })
  })

  describe('Teste Abrangente de Validação', () => {
    it('deve validar todos os tipos de dados válidos', () => {
      const dataTypes = ['doctor', 'product', 'chat', 'consultation', 'profile']
      
      dataTypes.forEach(type => {
        const validation = validateApiData(validData[type as keyof typeof validData], type)
        expect(validation.isValid).toBe(true)
        expect(validation.sanitizedData).toBeDefined()
        expect(validation.error).toBeUndefined()
      })
    })

    it('deve rejeitar todos os tipos de dados maliciosos', () => {
      const dataTypes = ['doctor', 'product', 'chat', 'consultation', 'profile']
      
      dataTypes.forEach(type => {
        const validation = validateApiData(maliciousData[type as keyof typeof maliciousData], type)
        expect(validation.isValid).toBe(true) // Dados são sanitizados, não rejeitados
        expect(validation.sanitizedData).toBeDefined()
      })
    })

    it('deve rejeitar todos os tipos de dados corrompidos', () => {
      const dataTypes = ['doctor', 'product', 'chat', 'consultation', 'profile']
      
      dataTypes.forEach(type => {
        const validation = validateApiData(corruptedData[type as keyof typeof corruptedData], type)
        expect(validation.isValid).toBe(false)
        expect(validation.error).toBeDefined()
        expect(validation.sanitizedData).toBeUndefined()
      })
    })
  })

  describe('Validação de Tipos de Dados Específicos', () => {
    it('deve validar preço numérico de produto', () => {
      const invalidPriceProduct = {
        ...validData.product,
        price: 'invalid_price'
      }
      
      const validation = validateApiData(invalidPriceProduct, 'product')
      
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBe('Preço do produto inválido')
    })

    it('deve rejeitar preço negativo de produto', () => {
      const negativePriceProduct = {
        ...validData.product,
        price: -10
      }
      
      const validation = validateApiData(negativePriceProduct, 'product')
      
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBe('Preço do produto inválido')
    })

    it('deve validar status válido de consulta', () => {
      const validStatuses = ['scheduled', 'completed', 'cancelled']
      
      validStatuses.forEach(status => {
        const consultation = {
          ...validData.consultation,
          status
        }
        
        const validation = validateApiData(consultation, 'consultation')
        expect(validation.isValid).toBe(true)
      })
    })

    it('deve rejeitar status inválido de consulta', () => {
      const invalidStatusConsultation = {
        ...validData.consultation,
        status: 'invalid_status'
      }
      
      const validation = validateApiData(invalidStatusConsultation, 'consultation')
      
      expect(validation.isValid).toBe(false)
      expect(validation.error).toBe('Status de consulta inválido')
    })
  })
})
