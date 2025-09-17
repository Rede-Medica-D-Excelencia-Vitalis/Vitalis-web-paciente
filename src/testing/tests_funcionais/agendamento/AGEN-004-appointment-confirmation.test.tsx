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

describe('AGEN-004 - Confirmação de Agendamento', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve permitir seleção completa de dados para agendamento', async () => {
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

  it('deve exibir loading durante processamento do agendamento', async () => {
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

    // Mock com delay para simular processamento
    vi.mocked(agendamentoService.createAppointment).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ id: 1, success: true }), 100)
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

    await waitFor(() => {
      expect(screen.getByText('Horários Disponíveis')).toBeInTheDocument()
    })

    // Selecionar um horário
    const timeButton = screen.getByText('09:00')
    await user.click(timeButton)

    await waitFor(() => {
      expect(screen.getByText('Confirmar Agendamento')).toBeInTheDocument()
    })

    // Clicar no botão de confirmação
    const confirmButton = screen.getByText('Confirmar Agendamento')
    await user.click(confirmButton)

    // Verificar se o loading aparece
    await waitFor(() => {
      expect(screen.getByText('Confirmando...')).toBeInTheDocument()
    })
  })

  it('deve exibir tela de confirmação após processamento', async () => {
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

    vi.mocked(agendamentoService.createAppointment).mockResolvedValue({ id: 1, success: true })

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

    await waitFor(() => {
      expect(screen.getByText('Confirmar Agendamento')).toBeInTheDocument()
    })

    // Clicar no botão de confirmação
    const confirmButton = screen.getByText('Confirmar Agendamento')
    await user.click(confirmButton)

    // Verificar se a tela de confirmação aparece
    await waitFor(() => {
      expect(screen.getByText('Agendamento Confirmado!')).toBeInTheDocument()
    })
  })

  it('deve exibir detalhes corretos do agendamento na confirmação', async () => {
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

    vi.mocked(agendamentoService.createAppointment).mockResolvedValue({ id: 1, success: true })

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

    await waitFor(() => {
      expect(screen.getByText('Confirmar Agendamento')).toBeInTheDocument()
    })

    // Clicar no botão de confirmação
    const confirmButton = screen.getByText('Confirmar Agendamento')
    await user.click(confirmButton)

    // Verificar se os detalhes do agendamento são exibidos
    await waitFor(() => {
      expect(screen.getByText('Agendamento Confirmado!')).toBeInTheDocument()
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      expect(screen.getByText('09:00')).toBeInTheDocument()
    })
  })

  it('deve exibir botão para fazer novo agendamento', async () => {
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

    vi.mocked(agendamentoService.createAppointment).mockResolvedValue({ id: 1, success: true })

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

    await waitFor(() => {
      expect(screen.getByText('Confirmar Agendamento')).toBeInTheDocument()
    })

    // Clicar no botão de confirmação
    const confirmButton = screen.getByText('Confirmar Agendamento')
    await user.click(confirmButton)

    // Verificar se o botão de novo agendamento aparece
    await waitFor(() => {
      expect(screen.getByText('Fazer novo agendamento')).toBeInTheDocument()
    })
  })

  it('deve chamar o serviço de criação de agendamento com dados corretos', async () => {
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

    vi.mocked(agendamentoService.createAppointment).mockResolvedValue({ id: 1, success: true })

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

    await waitFor(() => {
      expect(screen.getByText('Confirmar Agendamento')).toBeInTheDocument()
    })

    // Clicar no botão de confirmação
    const confirmButton = screen.getByText('Confirmar Agendamento')
    await user.click(confirmButton)

    // Verificar se o serviço foi chamado
    await waitFor(() => {
      expect(agendamentoService.createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          paciente_id: 1,
          medico_id: 1,
          hora: '09:00',
          tipo: 'consulta',
          observacoes: ''
        })
      )
    })
  })

  it('deve exibir erro quando falha ao criar agendamento', async () => {
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

    // Mock com erro
    vi.mocked(agendamentoService.createAppointment).mockRejectedValue(new Error('Erro ao criar agendamento'))

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

    await waitFor(() => {
      expect(screen.getByText('Confirmar Agendamento')).toBeInTheDocument()
    })

    // Clicar no botão de confirmação
    const confirmButton = screen.getByText('Confirmar Agendamento')
    await user.click(confirmButton)

    // Verificar se o erro é exibido
    await waitFor(() => {
      expect(screen.getByText('Erro ao criar agendamento')).toBeInTheDocument()
    })
  })

  it('deve permitir voltar ao formulário após confirmação', async () => {
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

    vi.mocked(agendamentoService.createAppointment).mockResolvedValue({ id: 1, success: true })

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

    await waitFor(() => {
      expect(screen.getByText('Confirmar Agendamento')).toBeInTheDocument()
    })

    // Clicar no botão de confirmação
    const confirmButton = screen.getByText('Confirmar Agendamento')
    await user.click(confirmButton)

    // Verificar se a tela de confirmação aparece
    await waitFor(() => {
      expect(screen.getByText('Agendamento Confirmado!')).toBeInTheDocument()
    })

    // Clicar no botão de novo agendamento
    const newAppointmentButton = screen.getByText('Fazer novo agendamento')
    await user.click(newAppointmentButton)

    // Verificar se volta ao formulário
    await waitFor(() => {
      expect(screen.getByText('Selecione a Data')).toBeInTheDocument()
    })
  })
})
