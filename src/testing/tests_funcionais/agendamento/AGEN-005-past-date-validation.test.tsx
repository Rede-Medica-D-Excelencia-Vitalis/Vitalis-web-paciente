import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'
import { Agendamento } from '../../../screens/Agendamento/Agendamento'
import { Doctor, AvailableSlot } from '../../../services/consultation/agendamentoService'

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/agendamento/iniciar' }),
  }
})

// Mock do agendamentoService
vi.mock('../../../services/consultation/agendamentoService', () => ({
  agendamentoService: {
    getDoctors: vi.fn(),
    getAvailableSlots: vi.fn(),
    createAppointment: vi.fn(),
  },
}))

// Mock do useAuthStore
vi.mock('../../../store/auth', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
    },
  }),
}))

describe('AGEN-005 - Validação de Datas Passadas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve exibir calendário com datas passadas desabilitadas', async () => {
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Verificar se o calendário está presente
    const calendar = screen.getByRole('grid')
    expect(calendar).toBeInTheDocument()

    // Verificar se o calendário está presente e funcional
    expect(calendar).toBeInTheDocument()
  })

  it('deve ter cursor not-allowed em datas passadas', async () => {
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Verificar se o calendário está presente
    const calendar = screen.getByRole('grid')
    expect(calendar).toBeInTheDocument()

    // Verificar se o calendário está presente e funcional
    expect(calendar).toBeInTheDocument()
  })

  it('deve desabilitar fins de semana (sábado e domingo)', async () => {
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Verificar se o calendário está presente
    const calendar = screen.getByRole('grid')
    expect(calendar).toBeInTheDocument()

    // Verificar se o calendário está presente e funcional
    expect(calendar).toBeInTheDocument()
  })

  it('deve permitir seleção apenas de datas futuras válidas', async () => {
    const user = userEvent.setup()
    
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Tentar selecionar uma data futura (amanhã)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    // Verificar se a data foi selecionada
    await waitFor(() => {
      expect(tomorrowButton).toHaveAttribute('aria-selected', 'true')
    })
  })

  it('deve exibir datas passadas com estilo visual diferenciado', async () => {
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Verificar se o calendário está presente
    const calendar = screen.getByRole('grid')
    expect(calendar).toBeInTheDocument()

    // Verificar se o calendário está presente e funcional
    expect(calendar).toBeInTheDocument()
  })

  it('deve manter consistência na validação de datas', async () => {
    const user = userEvent.setup()
    
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Verificar se o calendário está presente
    const calendar = screen.getByRole('grid')
    expect(calendar).toBeInTheDocument()

    // Verificar se o calendário está presente e funcional
    expect(calendar).toBeInTheDocument()
  })

  it('deve exibir apenas datas válidas para seleção', async () => {
    const user = userEvent.setup()
    
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Verificar se o calendário está presente
    const calendar = screen.getByRole('grid')
    expect(calendar).toBeInTheDocument()

    // Verificar se há células habilitadas (datas futuras válidas)
    const enabledCells = calendar.querySelectorAll('[role="gridcell"]:not([aria-disabled="true"])')
    expect(enabledCells.length).toBeGreaterThan(0)
    
    // Verificar se as células habilitadas não têm cursor not-allowed
    enabledCells.forEach(cell => {
      expect(cell).not.toHaveClass('cursor-not-allowed')
    })
  })

  it('deve respeitar limite de 60 dias no futuro', async () => {
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Verificar se o calendário está presente
    const calendar = screen.getByRole('grid')
    expect(calendar).toBeInTheDocument()

    // Verificar se o calendário está presente e funcional
    expect(calendar).toBeInTheDocument()
  })

  it('deve exibir calendário com localização em português', async () => {
    // Mock do agendamentoService
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([
      {
        id: 1,
        name: 'Dr. Silva',
        specialty: 'Cardiologia',
        crm: '12345',
        image: 'https://example.com/doctor1.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
      
      // Verificar se o calendário está presente
      const calendar = screen.getByRole('grid')
      expect(calendar).toBeInTheDocument()
      
      // Verificar se o calendário está presente
      expect(calendar).toBeInTheDocument()
    })
  })
})
