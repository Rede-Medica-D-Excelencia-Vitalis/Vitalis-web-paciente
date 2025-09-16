import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '../utils'

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

// Mock do serviço de consultas
vi.mock('../../../services/consultation/consultationService', () => ({
  getMinhasConsultas: vi.fn(),
}))

// Mock do useApi hook
vi.mock('../../../hooks/api/useApi', () => ({
  useApi: vi.fn(),
}))

import PacienteDashboard from '../../../screens/Paciente/PacienteDashboard'
import { useApi } from '../../../hooks/api/useApi'
import { Paciente, Consultation } from '../../../types/api'

const mockUseApi = vi.mocked(useApi)

// Função helper para criar mock completo do useApi
const createUseApiMock = (data: any, loading: boolean, error: string | null) => ({
  data,
  loading,
  error,
  execute: vi.fn(),
  setData: vi.fn(),
  setError: vi.fn(),
  setLoading: vi.fn(),
  reset: vi.fn(),
})

describe('DASH-001 - Carregamento de Dados do Perfil', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Simular usuário autenticado
    localStorage.setItem('token', 'mock-token')
  })

  it('deve renderizar o componente PacienteDashboard em estado de carregamento', () => {
    // Mock para estado de carregamento
    mockUseApi.mockImplementation(() => createUseApiMock(null, true, null))

    render(<PacienteDashboard />)
    
    expect(screen.getByText(/carregando sua área do paciente/i)).toBeInTheDocument()
  })

  it('deve exibir mensagem de boas-vindas quando não há perfil', async () => {
    // Mock para simular erro de perfil não encontrado
    mockUseApi.mockImplementation(() => createUseApiMock(null, false, 'Nenhum perfil de paciente encontrado'))

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Bem-vindo ao Vitalis!')).toBeInTheDocument()
      expect(screen.getByText(/para começar a usar todos os recursos/i)).toBeInTheDocument()
      expect(screen.getByText('Completar Cadastro (2 min)')).toBeInTheDocument()
    })
  })

  it('deve exibir dados pessoais quando perfil está carregado', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: 'O+',
      alergias: 'Pólen, Amendoim',
      doencas_cronicas: 'Diabetes tipo 2',
      medicamentos_uso_continuo: 'Metformina 500mg',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = []

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar se o nome do paciente aparece no cabeçalho
      expect(screen.getByText('Olá, João Silva! 👋')).toBeInTheDocument()
      
      // Verificar seção "Suas Informações"
      expect(screen.getByText('Suas Informações')).toBeInTheDocument()
      
      // Verificar dados pessoais
      expect(screen.getByText('Dados Pessoais')).toBeInTheDocument()
      expect(screen.getByText('Nome:')).toBeInTheDocument()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('Data de Nascimento:')).toBeInTheDocument()
      expect(screen.getByText('15/05/1990')).toBeInTheDocument()
      expect(screen.getByText('Telefone:')).toBeInTheDocument()
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument()
      expect(screen.getByText('Endereço:')).toBeInTheDocument()
      expect(screen.getByText('Rua das Flores, 123 - Centro, São Paulo/SP')).toBeInTheDocument()
    })
  })

  it('deve exibir dados de saúde quando perfil está carregado', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: 'O+',
      alergias: 'Pólen, Amendoim',
      doencas_cronicas: 'Diabetes tipo 2',
      medicamentos_uso_continuo: 'Metformina 500mg',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = []

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar seção de saúde
      expect(screen.getByText('Saúde')).toBeInTheDocument()
      expect(screen.getByText('Tipo Sanguíneo:')).toBeInTheDocument()
      expect(screen.getByText('O+')).toBeInTheDocument()
      expect(screen.getByText('Alergias:')).toBeInTheDocument()
      expect(screen.getByText('Pólen, Amendoim')).toBeInTheDocument()
      expect(screen.getByText('Medicamentos em uso:')).toBeInTheDocument()
      expect(screen.getByText('Metformina 500mg')).toBeInTheDocument()
      expect(screen.getByText('Condições médicas:')).toBeInTheDocument()
      expect(screen.getByText('Diabetes tipo 2')).toBeInTheDocument()
    })
  })

  it('deve exibir valores padrão quando dados de saúde não estão preenchidos', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: undefined,
      alergias: undefined,
      doencas_cronicas: undefined,
      medicamentos_uso_continuo: undefined,
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = []

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar valores padrão
      expect(screen.getByText('Não informado')).toBeInTheDocument()
      expect(screen.getByText('Nenhuma alergia registrada')).toBeInTheDocument()
      expect(screen.getByText('Nenhum medicamento registrado')).toBeInTheDocument()
      expect(screen.getByText('Nenhuma condição registrada')).toBeInTheDocument()
    })
  })

  it('deve exibir botões de edição para dados pessoais e saúde', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: 'O+',
      alergias: 'Pólen',
      doencas_cronicas: 'Diabetes',
      medicamentos_uso_continuo: 'Metformina',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = []

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar botões de edição
      expect(screen.getByText('Editar Dados')).toBeInTheDocument()
      expect(screen.getByText('Atualizar Saúde')).toBeInTheDocument()
    })
  })

  it('deve exibir funcionalidades principais do dashboard', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: 'O+',
      alergias: 'Pólen',
      doencas_cronicas: 'Diabetes',
      medicamentos_uso_continuo: 'Metformina',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = []

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar funcionalidades principais
      expect(screen.getByText('Triagem Online')).toBeInTheDocument()
      expect(screen.getByText('Agendar Consulta')).toBeInTheDocument()
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
      expect(screen.getByText('Histórico Médico')).toBeInTheDocument()
      expect(screen.getByText('Prescrições')).toBeInTheDocument()
      expect(screen.getByText('Farmácia Online')).toBeInTheDocument()
      expect(screen.getByText('Suporte 24/7')).toBeInTheDocument()
    })
  })

  it('deve exibir seção de ações rápidas', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: 'O+',
      alergias: 'Pólen',
      doencas_cronicas: 'Diabetes',
      medicamentos_uso_continuo: 'Metformina',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = []

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar ações rápidas
      expect(screen.getByText('Ações Rápidas')).toBeInTheDocument()
      expect(screen.getByText('Triagem Médica')).toBeInTheDocument()
      expect(screen.getByText('Nova Consulta')).toBeInTheDocument()
      expect(screen.getByText('Central de Ajuda')).toBeInTheDocument()
    })
  })

  it('deve exibir seção de dicas e informações úteis', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: 'O+',
      alergias: 'Pólen',
      doencas_cronicas: 'Diabetes',
      medicamentos_uso_continuo: 'Metformina',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = []

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar dicas e informações úteis
      expect(screen.getByText('Dicas e Informações Úteis')).toBeInTheDocument()
      expect(screen.getByText('Suporte 24/7')).toBeInTheDocument() // Aparece nas dicas
    })
  })

  it('deve exibir seção de notificações e lembretes', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: 'O+',
      alergias: 'Pólen',
      doencas_cronicas: 'Diabetes',
      medicamentos_uso_continuo: 'Metformina',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = []

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar notificações e lembretes
      expect(screen.getByText('Notificações e Lembretes')).toBeInTheDocument()
      expect(screen.getByText('Medicamentos em Uso')).toBeInTheDocument()
      expect(screen.getAllByText('Exames Pendentes')).toHaveLength(2) // Aparece nas estatísticas e nas notificações
      expect(screen.getByText('Triagem Online Disponível')).toBeInTheDocument()
      expect(screen.getAllByText('Prescrições Ativas')).toHaveLength(2) // Aparece nas estatísticas e nas notificações
    })
  })

  it('deve exibir estatísticas rápidas quando consultas estão carregadas', async () => {
    const mockPerfil: Paciente = {
      id: '1',
      usuario_id: '1',
      nome: 'João Silva',
      data_nascimento: '1990-05-15',
      telefone: '(11) 99999-9999',
      tipo_sanguineo: 'O+',
      alergias: 'Pólen',
      doencas_cronicas: 'Diabetes',
      medicamentos_uso_continuo: 'Metformina',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567'
      },
      genero: 'masculino',
      email: 'joao@email.com',
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      birthdate: '1990-05-15',
      name: 'João Silva',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    const mockConsultas: Consultation[] = [
      {
        id: '1',
        patientId: '1',
        doctorId: '1',
        doctor: {
          id: '1',
          name: 'Dr. Silva',
          specialty: 'Cardiologia',
          crm: '123456',
          avatar: 'avatar.jpg'
        },
        specialty: 'Cardiologia',
        date: '2024-12-20',
        time: '14:00',
        type: 'presencial' as const,
        status: 'agendada' as const,
        symptoms: 'Dor no peito',
        diagnosis: '',
        prescription: '',
        notes: '',
        rating: undefined,
        feedback: '',
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z'
      },
      {
        id: '2',
        patientId: '1',
        doctorId: '2',
        doctor: {
          id: '2',
          name: 'Dr. Santos',
          specialty: 'Dermatologia',
          crm: '789012',
          avatar: 'avatar2.jpg'
        },
        specialty: 'Dermatologia',
        date: '2024-11-15',
        time: '10:00',
        type: 'teleconsulta' as const,
        status: 'concluída' as const,
        symptoms: 'Manchas na pele',
        diagnosis: 'Dermatite',
        prescription: 'Creme hidratante',
        notes: 'Consulta realizada com sucesso',
        rating: 5,
        feedback: 'Excelente atendimento',
        createdAt: '2024-11-01T10:00:00Z',
        updatedAt: '2024-11-15T10:00:00Z'
      }
    ]

    // Mock para simular dados carregados
    mockUseApi.mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return createUseApiMock(mockPerfil, false, null)
      }
      return createUseApiMock(mockConsultas, false, null)
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar estatísticas rápidas
      expect(screen.getByText('Consultas Futuras')).toBeInTheDocument()
      expect(screen.getByText('Consultas Realizadas')).toBeInTheDocument()
      expect(screen.getAllByText('Prescrições Ativas')).toHaveLength(2) // Aparece nas estatísticas e nas notificações
      expect(screen.getAllByText('Exames Pendentes')).toHaveLength(2) // Aparece nas estatísticas e nas notificações
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(2) // Aparece nas estatísticas e na seção de consultas passadas
    })
  })
})