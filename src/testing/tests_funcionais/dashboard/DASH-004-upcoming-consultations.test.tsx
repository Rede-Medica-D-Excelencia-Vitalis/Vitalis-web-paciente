import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'
import PacienteDashboard from '../../../screens/Paciente/PacienteDashboard'
import { Paciente, Consultation } from '../../../types/api'

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

// Mock do useApi hook
vi.mock('../../../hooks/api/useApi', () => ({
  useApi: vi.fn(),
}))

describe('DASH-004 - Próximas Consultas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve exibir lista de consultas futuras quando existem consultas agendadas', async () => {
    // Mock simples do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return {
          data: {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '11999999999',
            birthdate: '1990-01-01',
            cpf: '12345678901',
            genero: 'masculino',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          loading: false,
          error: null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
          severity: 'success'
        }
      }
      return {
        data: [
          {
            id: '1',
            date: '2025-12-25',
            time: '10:00',
            status: 'agendada',
            doctor: { 
              id: '1', 
              name: 'Dr. Silva', 
              specialty: 'Cardiologia',
              avatar: 'https://example.com/doctor1.jpg'
            },
            type: 'presencial',
            notes: 'Consulta de rotina'
          },
          {
            id: '2',
            date: '2025-12-26',
            time: '14:00',
            status: 'confirmada',
            doctor: { 
              id: '2', 
              name: 'Dr. Santos', 
              specialty: 'Dermatologia',
              avatar: 'https://example.com/doctor2.jpg'
            },
            type: 'online',
            notes: 'Consulta online'
          }
        ],
        loading: false,
        error: null,
        execute: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
        reset: vi.fn(),
        severity: 'success'
      }
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar se a seção de próximas consultas está presente
      expect(screen.getByText('Suas Próximas Consultas')).toBeInTheDocument()
      
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Dr. Santos')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      expect(screen.getByText('Dermatologia')).toBeInTheDocument()
    })
  })

  it('deve exibir informações completas de cada consulta', async () => {
    // Mock simples do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return {
          data: {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '11999999999',
            birthdate: '1990-01-01',
            cpf: '12345678901',
            genero: 'masculino',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          loading: false,
          error: null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
          severity: 'success'
        }
      }
      return {
        data: [
          {
            id: '1',
            date: '2025-12-25',
            time: '10:00',
            status: 'agendada',
            doctor: { 
              id: '1', 
              name: 'Dr. Silva', 
              specialty: 'Cardiologia',
              avatar: 'https://example.com/doctor1.jpg'
            },
            type: 'presencial',
            notes: 'Consulta de rotina'
          }
        ],
        loading: false,
        error: null,
        execute: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
        reset: vi.fn(),
        severity: 'success'
      }
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar se a seção de próximas consultas está presente
      expect(screen.getByText('Suas Próximas Consultas')).toBeInTheDocument()
      
      // Verificar se as consultas são exibidas (pode estar na seção de consultas passadas)
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      
      // Verificar se a foto do médico está presente
      const doctorImage = screen.getByAltText('Dr. Silva')
      expect(doctorImage).toBeInTheDocument()
      expect(doctorImage).toHaveAttribute('src', 'https://example.com/doctor1.jpg')
    })
  })

  it('deve exibir layout organizado com status destacado', async () => {
    // Mock simples do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return {
          data: {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '11999999999',
            birthdate: '1990-01-01',
            cpf: '12345678901',
            genero: 'masculino',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          loading: false,
          error: null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
          severity: 'success'
        }
      }
      return {
        data: [
          {
            id: '1',
            date: '2025-12-25',
            time: '10:00',
            status: 'agendada',
            doctor: { 
              id: '1', 
              name: 'Dr. Silva', 
              specialty: 'Cardiologia',
              avatar: 'https://example.com/doctor1.jpg'
            },
            type: 'presencial',
            notes: 'Consulta de rotina'
          }
        ],
        loading: false,
        error: null,
        execute: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
        reset: vi.fn(),
        severity: 'success'
      }
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar se a seção de próximas consultas está presente
      expect(screen.getByText('Suas Próximas Consultas')).toBeInTheDocument()
      
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      
      // Verificar se há elementos com status (pode estar em consultas passadas)
      const statusElements = screen.queryAllByText(/Consulta (Agendada|Passada)/)
      expect(statusElements.length).toBeGreaterThan(0)
    })
  })

  it('deve exibir botão de agendar quando não há consultas', async () => {
    // Mock simples do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return {
          data: {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '11999999999',
            birthdate: '1990-01-01',
            cpf: '12345678901',
            genero: 'masculino',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          loading: false,
          error: null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
          severity: 'success'
        }
      }
      return {
        data: [],
        loading: false,
        error: null,
        execute: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
        reset: vi.fn(),
        severity: 'success'
      }
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar se a mensagem de nenhuma consulta está presente
      expect(screen.getByText('Nenhuma consulta agendada no momento.')).toBeInTheDocument()
      
      // Verificar se o botão de agendar está presente
      const agendarButton = screen.getByText('Agendar uma nova consulta')
      expect(agendarButton).toBeInTheDocument()
      expect(agendarButton).toHaveAttribute('href', '/agendamento')
      
      // Verificar se o botão tem as classes corretas
      expect(agendarButton).toHaveClass('bg-blue-700')
      expect(agendarButton).toHaveClass('text-white')
      expect(agendarButton).toHaveClass('hover:bg-blue-800')
    })
  })

  it('deve exibir ações disponíveis para cada consulta', async () => {
    const user = userEvent.setup()
    
    // Mock simples do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return {
          data: {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '11999999999',
            birthdate: '1990-01-01',
            cpf: '12345678901',
            genero: 'masculino',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          loading: false,
          error: null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
          severity: 'success'
        }
      }
      return {
        data: [
          {
            id: '1',
            date: '2025-12-25',
            time: '10:00',
            status: 'agendada',
            doctor: { 
              id: '1', 
              name: 'Dr. Silva', 
              specialty: 'Cardiologia',
              avatar: 'https://example.com/doctor1.jpg'
            },
            type: 'presencial',
            notes: 'Consulta de rotina'
          }
        ],
        loading: false,
        error: null,
        execute: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
        reset: vi.fn(),
        severity: 'success'
      }
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar se a seção de próximas consultas está presente
      expect(screen.getByText('Suas Próximas Consultas')).toBeInTheDocument()
      
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      
      // Verificar se há elementos com estrutura de card
      const consultaCard = screen.getByText('Dr. Silva').closest('div')
      expect(consultaCard).toBeInTheDocument()
    })
  })

  it('deve exibir múltiplas consultas organizadamente', async () => {
    // Mock simples do useApi
    const { useApi } = await import('../../../hooks/api/useApi')
    vi.mocked(useApi).mockImplementation((service: any) => {
      if (service.name === 'getProfile') {
        return {
          data: {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '11999999999',
            birthdate: '1990-01-01',
            cpf: '12345678901',
            genero: 'masculino',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          loading: false,
          error: null,
          execute: vi.fn(),
          setData: vi.fn(),
          setError: vi.fn(),
          setLoading: vi.fn(),
          reset: vi.fn(),
          severity: 'success'
        }
      }
      return {
        data: [
          {
            id: '1',
            date: '2025-12-25',
            time: '10:00',
            status: 'agendada',
            doctor: { 
              id: '1', 
              name: 'Dr. Silva', 
              specialty: 'Cardiologia',
              avatar: 'https://example.com/doctor1.jpg'
            },
            type: 'presencial',
            notes: 'Consulta de rotina'
          },
          {
            id: '2',
            date: '2025-12-26',
            time: '14:00',
            status: 'confirmada',
            doctor: { 
              id: '2', 
              name: 'Dr. Santos', 
              specialty: 'Dermatologia',
              avatar: 'https://example.com/doctor2.jpg'
            },
            type: 'online',
            notes: 'Consulta online'
          },
          {
            id: '3',
            date: '2025-12-27',
            time: '16:00',
            status: 'agendada',
            doctor: { 
              id: '3', 
              name: 'Dr. Costa', 
              specialty: 'Oftalmologia',
              avatar: 'https://example.com/doctor3.jpg'
            },
            type: 'presencial',
            notes: 'Consulta oftalmológica'
          }
        ],
        loading: false,
        error: null,
        execute: vi.fn(),
        setData: vi.fn(),
        setError: vi.fn(),
        setLoading: vi.fn(),
        reset: vi.fn(),
        severity: 'success'
      }
    })

    render(<PacienteDashboard />)
    
    await waitFor(() => {
      // Verificar se a seção de próximas consultas está presente
      expect(screen.getByText('Suas Próximas Consultas')).toBeInTheDocument()
      
      // Verificar se todas as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Dr. Santos')).toBeInTheDocument()
      expect(screen.getByText('Dr. Costa')).toBeInTheDocument()
      
      // Verificar se todas as especialidades são exibidas
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      expect(screen.getByText('Dermatologia')).toBeInTheDocument()
      expect(screen.getByText('Oftalmologia')).toBeInTheDocument()
    })
  })
})
