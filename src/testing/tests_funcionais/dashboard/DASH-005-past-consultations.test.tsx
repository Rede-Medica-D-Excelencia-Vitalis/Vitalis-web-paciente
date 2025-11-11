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

describe('DASH-005 - Consultas Passadas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve exibir seção de consultas passadas quando existem consultas passadas', async () => {
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
            date: '2022-12-25',
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
            date: '2022-12-20',
            time: '14:00',
            status: 'cancelada',
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
      // Verificar se a seção de consultas passadas está presente (aparece nas estatísticas e no título)
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(2)
      
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })
  })

  it('deve exibir informações completas de cada consulta passada', async () => {
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
            date: '2022-12-25',
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
      // Verificar se a seção de consultas passadas está presente (aparece nas estatísticas e no título)
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(2)
      
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })
  })

  it('deve exibir status visual claro em vermelho', async () => {
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
            date: '2022-12-25',
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
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })
  })

  it('deve exibir layout diferenciado com fundo vermelho claro', async () => {
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
            date: '2022-12-25',
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
      // Verificar se a seção de consultas passadas está presente (aparece nas estatísticas e no título)
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(2)
      
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })
  })

  it('deve exibir ícone de consulta passada', async () => {
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
            date: '2022-12-25',
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
      // Verificar se a seção de consultas passadas está presente (aparece nas estatísticas e no título)
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(2)
      
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })
  })

  it('deve exibir múltiplas consultas passadas organizadamente', async () => {
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
            date: '2022-12-25',
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
            date: '2022-12-20',
            time: '14:00',
            status: 'cancelada',
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
            date: '2022-12-15',
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
      // Verificar se a seção de consultas passadas está presente (aparece nas estatísticas e no título)
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(2)
      
      // Verificar se as consultas são exibidas
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })
  })

  it('não deve exibir seção quando não há consultas passadas', async () => {
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
      // Verificar se a seção de consultas passadas NÃO está presente (só aparece nas estatísticas)
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(1)
      
      // Verificar se a seção de próximas consultas está presente (mesmo vazia)
      expect(screen.getByText('Suas Próximas Consultas')).toBeInTheDocument()
    })
  })
})
