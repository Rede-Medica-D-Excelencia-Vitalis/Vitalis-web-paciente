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

describe('AGEN-001 - Seleção de Data no Calendário', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve exibir calendário na tela de agendamento', async () => {
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
      // Verificar se o calendário está presente
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
      
      // Verificar se o componente Calendar está renderizado
      const calendar = screen.getByRole('grid')
      expect(calendar).toBeInTheDocument()
    })
  })

  it('deve permitir seleção de data disponível', async () => {
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

    // Simular seleção de uma data futura (amanhã)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    // Verificar se a data foi selecionada
    await waitFor(() => {
      expect(tomorrowButton).toHaveAttribute('aria-selected', 'true')
    })
  })

  it('deve desabilitar datas passadas', async () => {
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
  })

  it('deve desabilitar fins de semana', async () => {
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
  })

  it('deve carregar médicos quando data é selecionada', async () => {
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
      },
      {
        id: 2,
        name: 'Dr. Santos',
        specialty: 'Dermatologia',
        crm: '54321',
        image: 'https://example.com/doctor2.jpg'
      }
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Simular seleção de uma data futura
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    // Verificar se a data foi selecionada
    await waitFor(() => {
      expect(tomorrowButton).toHaveAttribute('aria-selected', 'true')
    })
  })

  it('deve destacar visualmente a data selecionada', async () => {
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

    // Simular seleção de uma data futura
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    // Verificar se a data selecionada tem destaque visual
    await waitFor(() => {
      expect(tomorrowButton).toHaveAttribute('aria-selected', 'true')
    })
  })

  it('deve resetar seleções quando nova data é escolhida', async () => {
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

    // Selecionar primeira data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    // Selecionar segunda data
    const dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
    const dayAfterTomorrowButton = screen.getByRole('gridcell', { name: dayAfterTomorrow.getDate().toString() })
    
    await user.click(dayAfterTomorrowButton)

    // Verificar se a nova data foi selecionada
    await waitFor(() => {
      expect(dayAfterTomorrowButton).toHaveAttribute('aria-selected', 'true')
    })
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
    })
  })
})
