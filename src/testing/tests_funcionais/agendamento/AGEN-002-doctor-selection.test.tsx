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

describe('AGEN-002 - Seleção de Médico', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve exibir lista de médicos quando data é selecionada', async () => {
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

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    // Verificar se a lista de médicos aparece
    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Dr. Santos')).toBeInTheDocument()
    })
  })

  it('deve permitir seleção de médico da lista', async () => {
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

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Verificar se os médicos estão presentes
    expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
    expect(screen.getByText('Dr. Santos')).toBeInTheDocument()
  })

  it('deve destacar visualmente o médico selecionado', async () => {
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

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Verificar se os médicos estão presentes
    expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
    expect(screen.getByText('Dr. Santos')).toBeInTheDocument()
  })

  it('deve exibir informações completas do médico selecionado', async () => {
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

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
    })

    // Verificar informações do médico
    expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
    expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    expect(screen.getByText('CRM: 12345')).toBeInTheDocument()
    
    // Verificar se a imagem está presente
    const doctorImage = screen.getByAltText('Dr. Silva')
    expect(doctorImage).toBeInTheDocument()
    expect(doctorImage).toHaveAttribute('src', 'https://example.com/doctor1.jpg')
  })

  it('deve carregar horários disponíveis quando médico é selecionado', async () => {
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
      '15:00'
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

    // Verificar se os horários são carregados
    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
      expect(screen.getByText('08:00')).toBeInTheDocument()
      expect(screen.getByText('09:00')).toBeInTheDocument()
      expect(screen.getByText('10:00')).toBeInTheDocument()
      expect(screen.getByText('14:00')).toBeInTheDocument()
      expect(screen.getByText('15:00')).toBeInTheDocument()
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

  it('deve exibir estado de carregamento ao buscar médicos', async () => {
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

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    // Verificar se os médicos são carregados
    await waitFor(() => {
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem quando não há médicos disponíveis', async () => {
    const user = userEvent.setup()
    
    // Mock do agendamentoService retornando lista vazia
    const { agendamentoService } = await import('../../../services/consultation/agendamentoService')
    vi.mocked(agendamentoService.getDoctors).mockResolvedValue([])

    render(<Agendamento />)
    
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })

    // Selecionar uma data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowButton = screen.getByRole('gridcell', { name: tomorrow.getDate().toString() })
    
    await user.click(tomorrowButton)

    // Verificar se a mensagem de nenhum médico aparece
    await waitFor(() => {
      expect(screen.getByText('Médicos Disponíveis')).toBeInTheDocument()
      expect(screen.getByText('Nenhum médico disponível para esta data')).toBeInTheDocument()
    })
  })
})
