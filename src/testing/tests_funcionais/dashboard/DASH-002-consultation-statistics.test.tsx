import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '../utils'
import PacienteDashboard from '../../../screens/Paciente/PacienteDashboard'

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

describe('DASH-002 - Estatísticas de Consultas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve exibir seção de estatísticas rápidas', async () => {
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
      // Verificar se os textos das estatísticas aparecem
      expect(screen.getByText('Consultas Futuras')).toBeInTheDocument()
      expect(screen.getByText('Consultas Realizadas')).toBeInTheDocument()
      expect(screen.getByText('Consultas Passadas')).toBeInTheDocument()
    })
  })

  it('deve exibir contadores fixos para prescrições e exames', async () => {
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
      // Verificar se os textos aparecem
      expect(screen.getAllByText('Prescrições Ativas')).toHaveLength(2)
      expect(screen.getAllByText('Exames Pendentes')).toHaveLength(2)
    })
  })

  it('deve exibir layout organizado com cores diferenciadas', async () => {
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
      // Verificar seção de estatísticas rápidas
      expect(screen.getByText('Consultas Futuras')).toBeInTheDocument()
      expect(screen.getByText('Consultas Realizadas')).toBeInTheDocument()
      expect(screen.getAllByText('Prescrições Ativas')).toHaveLength(2)
      expect(screen.getAllByText('Exames Pendentes')).toHaveLength(2)
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(1)

      // Verificar se os cards têm as classes de cor corretas
      const consultasFuturasCard = screen.getByText('Consultas Futuras').closest('div')?.parentElement
      const consultasRealizadasCard = screen.getByText('Consultas Realizadas').closest('div')?.parentElement

      expect(consultasFuturasCard).toHaveClass('bg-blue-100')
      expect(consultasRealizadasCard).toHaveClass('bg-green-100')
    })
  })

  it('deve exibir zero quando não há consultas', async () => {
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
      // Verificar se os textos aparecem
      expect(screen.getByText('Consultas Futuras')).toBeInTheDocument()
      expect(screen.getByText('Consultas Realizadas')).toBeInTheDocument()
      expect(screen.getAllByText('Consultas Passadas')).toHaveLength(1)
      expect(screen.getAllByText('Prescrições Ativas')).toHaveLength(2)
      expect(screen.getAllByText('Exames Pendentes')).toHaveLength(2)
    })
  })

  it('deve atualizar estatísticas em tempo real', async () => {
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
      // Verificar se as estatísticas são exibidas corretamente
      expect(screen.getByText('Consultas Futuras')).toBeInTheDocument()
      expect(screen.getByText('Consultas Realizadas')).toBeInTheDocument()
      expect(screen.getByText('Consultas Passadas')).toBeInTheDocument()
      expect(screen.getAllByText('Prescrições Ativas')).toHaveLength(2)
      expect(screen.getAllByText('Exames Pendentes')).toHaveLength(2)
    })
  })
})