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

describe('AGEN-003 - Seleção de Horário', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve exibir lista de horários quando médico é selecionado', async () => {
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
    
    vi.mocked(agendamentoService.getAvailableSlots).mockResolvedValue([
      '08:00',
      '09:00',
      '10:00',
      '14:00',
      '15:00',
      '16:00'
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um médico
    const doctorCard = screen.getByText('Dr. Silva').closest('div')
    await user.click(doctorCard!)

    // Verificar se a lista de horários aparece
    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
      expect(screen.getByText('08:00')).toBeInTheDocument()
      expect(screen.getByText('09:00')).toBeInTheDocument()
      expect(screen.getByText('10:00')).toBeInTheDocument()
      expect(screen.getByText('14:00')).toBeInTheDocument()
      expect(screen.getByText('15:00')).toBeInTheDocument()
      expect(screen.getByText('16:00')).toBeInTheDocument()
    })
  })

  it('deve permitir seleção de horário disponível', async () => {
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
    
    vi.mocked(agendamentoService.getAvailableSlots).mockResolvedValue([
      '08:00',
      '09:00',
      '10:00'
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um médico
    const doctorCard = screen.getByText('Dr. Silva').closest('div')
    await user.click(doctorCard!)

    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um horário
    const timeButton = screen.getByText('09:00')
    await user.click(timeButton)

    // Verificar se o horário foi selecionado
    await waitFor(() => {
      expect(timeButton).toHaveClass('bg-primary')
    })
  })

  it('deve destacar visualmente o horário selecionado', async () => {
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
    
    vi.mocked(agendamentoService.getAvailableSlots).mockResolvedValue([
      '08:00',
      '09:00',
      '10:00'
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um médico
    const doctorCard = screen.getByText('Dr. Silva').closest('div')
    await user.click(doctorCard!)

    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um horário
    const timeButton = screen.getByText('09:00')
    await user.click(timeButton)

    // Verificar se o horário selecionado tem destaque visual
    await waitFor(() => {
      expect(timeButton).toHaveClass('bg-primary')
      expect(timeButton).toHaveClass('text-primary-foreground')
    })
  })

  it('deve exibir horários em grid organizado', async () => {
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
    
    vi.mocked(agendamentoService.getAvailableSlots).mockResolvedValue([
      '08:00',
      '09:00',
      '10:00',
      '14:00',
      '15:00',
      '16:00'
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um médico
    const doctorCard = screen.getByText('Dr. Silva').closest('div')
    await user.click(doctorCard!)

    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
    })

    // Verificar se os horários estão organizados em grid
    const timeGrid = screen.getByText('08:00').closest('div')
    expect(timeGrid).toHaveClass('grid')
    expect(timeGrid).toHaveClass('grid-cols-2')
    expect(timeGrid).toHaveClass('md:grid-cols-4')
    expect(timeGrid).toHaveClass('gap-4')
  })

  it('deve exibir mensagem quando não há horários disponíveis', async () => {
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
    
    vi.mocked(agendamentoService.getAvailableSlots).mockResolvedValue([])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um médico
    const doctorCard = screen.getByText('Dr. Silva').closest('div')
    await user.click(doctorCard!)

    // Verificar se a mensagem de nenhum horário aparece
    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
      expect(screen.getByText('Nenhum horário disponível para este médico nesta data')).toBeInTheDocument()
    })
  })

  it('deve habilitar botão de confirmação quando horário é selecionado', async () => {
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
    
    vi.mocked(agendamentoService.getAvailableSlots).mockResolvedValue([
      '08:00',
      '09:00',
      '10:00'
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um médico
    const doctorCard = screen.getByText('Dr. Silva').closest('div')
    await user.click(doctorCard!)

    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um horário
    const timeButton = screen.getByText('09:00')
    await user.click(timeButton)

    // Verificar se o botão de confirmação aparece
    await waitFor(() => {
      expect(screen.getByText('Confirmar Agendamento')).toBeInTheDocument()
    })
  })

  it('deve exibir estado de carregamento ao buscar horários', async () => {
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
    
    vi.mocked(agendamentoService.getAvailableSlots).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve(['08:00', '09:00']), 100)
      )
    )

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um médico
    const doctorCard = screen.getByText('Dr. Silva').closest('div')
    await user.click(doctorCard!)

    // Verificar se o estado de carregamento aparece
    await waitFor(() => {
      expect(screen.getByText('Carregando horários...')).toBeInTheDocument()
    })

    // Aguardar carregamento completo
    await waitFor(() => {
      expect(screen.getByText('08:00')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('deve permitir troca de horário selecionado', async () => {
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
    
    vi.mocked(agendamentoService.getAvailableSlots).mockResolvedValue([
      '08:00',
      '09:00',
      '10:00'
    ])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um médico
    const doctorCard = screen.getByText('Dr. Silva').closest('div')
    await user.click(doctorCard!)

    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
    })

    // Selecionar primeiro horário
    const firstTimeButton = screen.getByText('08:00')
    await user.click(firstTimeButton)

    await waitFor(() => {
      expect(firstTimeButton).toHaveClass('bg-primary')
    })

    // Selecionar segundo horário
    const secondTimeButton = screen.getByText('10:00')
    await user.click(secondTimeButton)

    // Verificar se o segundo horário foi selecionado
    await waitFor(() => {
      expect(secondTimeButton).toHaveClass('bg-primary')
    })
  })
})
