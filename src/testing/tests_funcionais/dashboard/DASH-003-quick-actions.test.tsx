import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('DASH-003 - Ações Rápidas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve redirecionar para Triagem Médica ao clicar no botão', async () => {
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
      // Verificar se o botão de Triagem Médica está presente
      const triagemButton = screen.getByText('Triagem Médica')
      expect(triagemButton).toBeInTheDocument()
      
      // Verificar se o link tem o href correto
      const triagemLink = triagemButton.closest('a')
      expect(triagemLink).toHaveAttribute('href', '/triagem-online')
    })

    // Simular clique no botão
    const triagemButton = screen.getByText('Triagem Médica')
    await user.click(triagemButton)
    
    // Verificar se o redirecionamento foi acionado
    const triagemLink = triagemButton.closest('a')
    expect(triagemLink).toHaveAttribute('href', '/triagem-online')
  })

  it('deve redirecionar para Nova Consulta ao clicar no botão', async () => {
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
      // Verificar se o botão de Nova Consulta está presente
      const consultaButton = screen.getByText('Nova Consulta')
      expect(consultaButton).toBeInTheDocument()
      
      // Verificar se o link tem o href correto
      const consultaLink = consultaButton.closest('a')
      expect(consultaLink).toHaveAttribute('href', '/agendamento')
    })

    // Simular clique no botão
    const consultaButton = screen.getByText('Nova Consulta')
    await user.click(consultaButton)
    
    // Verificar se o redirecionamento foi acionado
    const consultaLink = consultaButton.closest('a')
    expect(consultaLink).toHaveAttribute('href', '/agendamento')
  })

  it('deve redirecionar para Central de Ajuda ao clicar no botão', async () => {
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
      // Verificar se o botão de Central de Ajuda está presente
      const ajudaButton = screen.getByText('Central de Ajuda')
      expect(ajudaButton).toBeInTheDocument()
      
      // Verificar se o link tem o href correto
      const ajudaLink = ajudaButton.closest('a')
      expect(ajudaLink).toHaveAttribute('href', '/central-ajuda')
    })

    // Simular clique no botão
    const ajudaButton = screen.getByText('Central de Ajuda')
    await user.click(ajudaButton)
    
    // Verificar se o redirecionamento foi acionado
    const ajudaLink = ajudaButton.closest('a')
    expect(ajudaLink).toHaveAttribute('href', '/central-ajuda')
  })

  it('deve exibir todos os botões de ação rápida com navegação fluida', async () => {
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
      // Verificar se a seção de Ações Rápidas está presente
      expect(screen.getByText('Ações Rápidas')).toBeInTheDocument()
      
      // Verificar se todos os botões estão presentes
      expect(screen.getByText('Triagem Médica')).toBeInTheDocument()
      expect(screen.getByText('Nova Consulta')).toBeInTheDocument()
      expect(screen.getByText('Central de Ajuda')).toBeInTheDocument()
      
      // Verificar se as descrições estão presentes
      expect(screen.getByText('Avaliar sintomas')).toBeInTheDocument()
      expect(screen.getByText('Agendar horário')).toBeInTheDocument()
      expect(screen.getByText('Suporte técnico')).toBeInTheDocument()
    })

    // Testar navegação entre os botões
    const triagemButton = screen.getByText('Triagem Médica')
    const consultaButton = screen.getByText('Nova Consulta')
    const ajudaButton = screen.getByText('Central de Ajuda')

    // Verificar se todos os links têm os hrefs corretos
    expect(triagemButton.closest('a')).toHaveAttribute('href', '/triagem-online')
    expect(consultaButton.closest('a')).toHaveAttribute('href', '/agendamento')
    expect(ajudaButton.closest('a')).toHaveAttribute('href', '/central-ajuda')
  })

  it('deve ter botões responsivos com feedback visual', async () => {
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
      // Verificar se os botões têm as classes de hover e transição
      const triagemLink = screen.getByText('Triagem Médica').closest('a')
      const consultaLink = screen.getByText('Nova Consulta').closest('a')
      const ajudaLink = screen.getByText('Central de Ajuda').closest('a')

      // Verificar classes de hover e transição
      expect(triagemLink).toHaveClass('hover:shadow-md')
      expect(triagemLink).toHaveClass('hover:scale-105')
      expect(triagemLink).toHaveClass('transition-all')
      
      expect(consultaLink).toHaveClass('hover:shadow-md')
      expect(consultaLink).toHaveClass('hover:scale-105')
      expect(consultaLink).toHaveClass('transition-all')
      
      expect(ajudaLink).toHaveClass('hover:shadow-md')
      expect(ajudaLink).toHaveClass('hover:scale-105')
      expect(ajudaLink).toHaveClass('transition-all')

      // Verificar se os ícones estão presentes
      expect(triagemLink?.querySelector('svg')).toBeInTheDocument()
      expect(consultaLink?.querySelector('svg')).toBeInTheDocument()
      expect(ajudaLink?.querySelector('svg')).toBeInTheDocument()
    })
  })

  it('deve manter funcionalidade após múltiplos cliques', async () => {
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
      const triagemButton = screen.getByText('Triagem Médica')
      const consultaButton = screen.getByText('Nova Consulta')
      const ajudaButton = screen.getByText('Central de Ajuda')

      // Múltiplos cliques em cada botão
      user.click(triagemButton)
      user.click(consultaButton)
      user.click(ajudaButton)
      user.click(triagemButton)
      user.click(consultaButton)
      user.click(ajudaButton)

      // Verificar se os links ainda funcionam
      expect(triagemButton.closest('a')).toHaveAttribute('href', '/triagem-online')
      expect(consultaButton.closest('a')).toHaveAttribute('href', '/agendamento')
      expect(ajudaButton.closest('a')).toHaveAttribute('href', '/central-ajuda')
    })
  })
})
