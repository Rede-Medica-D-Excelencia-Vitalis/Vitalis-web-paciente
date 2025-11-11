import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

// Interfaces para tipagem
interface Doctor {
  id: string
  name: string
  specialty: string
  avatar: string
  rating: number
  availableSlots: string[]
}

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: string
}

interface AppointmentData {
  reason: string
  notes: string
  urgency: string
}

// Mock dos serviços de API
const mockAppointmentService = {
  getAvailableDates: vi.fn(),
  getAvailableDoctors: vi.fn(),
  getAvailableTimeSlots: vi.fn(),
  createAppointment: vi.fn(),
  confirmAppointment: vi.fn(),
  getPatientAppointments: vi.fn()
}

const mockNotificationService = {
  sendConfirmation: vi.fn(),
  sendReminder: vi.fn()
}

// Mock do contexto de autenticação
const mockAuthContext = {
  user: {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999'
  },
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn()
}

// Mock dos dados de teste
const mockData = {
  availableDates: [
    '2024-01-15',
    '2024-01-16',
    '2024-01-17',
    '2024-01-18',
    '2024-01-19'
  ],
  doctors: [
    {
      id: '1',
      name: 'Dr. Maria Santos',
      specialty: 'Cardiologia',
      avatar: '/avatars/dr-maria.jpg',
      rating: 4.8,
      availableSlots: ['09:00', '10:00', '14:00', '15:00']
    },
    {
      id: '2',
      name: 'Dr. João Oliveira',
      specialty: 'Dermatologia',
      avatar: '/avatars/dr-joao.jpg',
      rating: 4.6,
      availableSlots: ['08:00', '09:00', '16:00', '17:00']
    }
  ] as Doctor[],
  timeSlots: [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ]
}

// Componente mock para página de agendamento
const MockAppointmentPage = () => {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [selectedDate, setSelectedDate] = React.useState('')
  const [selectedDoctor, setSelectedDoctor] = React.useState<Doctor | null>(null)
  const [selectedTime, setSelectedTime] = React.useState('')
  const [appointmentData, setAppointmentData] = React.useState<AppointmentData>({
    reason: '',
    notes: '',
    urgency: 'normal'
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [availableDoctors, setAvailableDoctors] = React.useState<Doctor[]>([])
  const [availableTimes, setAvailableTimes] = React.useState<string[]>([])

  const steps = [
    { id: 1, title: 'Selecionar Data', component: 'date-selection' },
    { id: 2, title: 'Escolher Médico', component: 'doctor-selection' },
    { id: 3, title: 'Selecionar Horário', component: 'time-selection' },
    { id: 4, title: 'Dados da Consulta', component: 'appointment-data' },
    { id: 5, title: 'Confirmação', component: 'confirmation' }
  ]

  const handleDateSelection = async (date: string) => {
    setSelectedDate(date)
    setIsLoading(true)
    try {
      const doctors = await mockAppointmentService.getAvailableDoctors(date)
      setAvailableDoctors(doctors)
      setCurrentStep(2)
    } catch (err) {
      setError('Erro ao carregar médicos disponíveis')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorSelection = async (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setIsLoading(true)
    try {
      const times = await mockAppointmentService.getAvailableTimeSlots(selectedDate, doctor.id)
      setAvailableTimes(times)
      setCurrentStep(3)
    } catch (err) {
      setError('Erro ao carregar horários disponíveis')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time)
    setCurrentStep(4)
  }

  const handleAppointmentDataChange = (field: keyof AppointmentData, value: string) => {
    setAppointmentData(prev => ({ ...prev, [field]: value }))
  }

  const handleConfirmAppointment = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      if (!selectedDoctor) {
        setError('Médico não selecionado')
        return
      }

      const appointment = {
        date: selectedDate,
        doctorId: selectedDoctor.id,
        time: selectedTime,
        patientId: mockAuthContext.user.id,
        reason: appointmentData.reason,
        notes: appointmentData.notes,
        urgency: appointmentData.urgency
      }
      
      const result = await mockAppointmentService.createAppointment(appointment)
      
      if (result.success) {
        await mockAppointmentService.confirmAppointment(result.appointmentId)
        await mockNotificationService.sendConfirmation({
          appointmentId: result.appointmentId,
          patientEmail: mockAuthContext.user.email,
          doctorName: selectedDoctor!.name,
          date: selectedDate,
          time: selectedTime
        })
        
        setCurrentStep(5)
      } else {
        setError(result.message || 'Erro ao criar agendamento')
      }
    } catch (err) {
      setError('Erro ao processar agendamento')
    } finally {
      setIsLoading(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div data-testid="date-selection">
            <h3>Selecionar Data</h3>
            <div data-testid="available-dates">
              {mockData.availableDates.map(date => (
                <button
                  key={date}
                  data-testid={`date-${date}`}
                  onClick={() => handleDateSelection(date)}
                  disabled={isLoading}
                >
                  {new Date(date).toLocaleDateString('pt-BR')}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 2:
        return (
          <div data-testid="doctor-selection">
            <h3>Escolher Médico</h3>
            <div data-testid="available-doctors">
              {availableDoctors.map(doctor => (
                <div key={doctor.id} data-testid={`doctor-${doctor.id}`}>
                  <h4>{doctor.name}</h4>
                  <p>{doctor.specialty}</p>
                  <p>⭐ {doctor.rating}</p>
                  <button
                    data-testid={`select-doctor-${doctor.id}`}
                    onClick={() => handleDoctorSelection(doctor)}
                    disabled={isLoading}
                  >
                    Selecionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 3:
        return (
          <div data-testid="time-selection">
            <h3>Selecionar Horário</h3>
            <div data-testid="available-times">
              {availableTimes.map(time => (
                <button
                  key={time}
                  data-testid={`time-${time}`}
                  onClick={() => handleTimeSelection(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 4:
        return (
          <div data-testid="appointment-data">
            <h3>Dados da Consulta</h3>
            <form data-testid="appointment-form">
              <div>
                <label htmlFor="reason">Motivo da consulta:</label>
                <input
                  id="reason"
                  data-testid="reason-input"
                  type="text"
                  value={appointmentData.reason}
                  onChange={(e) => handleAppointmentDataChange('reason', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="notes">Observações:</label>
                <textarea
                  id="notes"
                  data-testid="notes-input"
                  value={appointmentData.notes}
                  onChange={(e) => handleAppointmentDataChange('notes', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="urgency">Urgência:</label>
                <select
                  id="urgency"
                  data-testid="urgency-select"
                  value={appointmentData.urgency}
                  onChange={(e) => handleAppointmentDataChange('urgency', e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgente</option>
                  <option value="emergency">Emergência</option>
                </select>
              </div>
              <button
                type="button"
                data-testid="confirm-appointment"
                onClick={handleConfirmAppointment}
                disabled={isLoading || !appointmentData.reason}
              >
                {isLoading ? 'Processando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          </div>
        )
      
      case 5:
        return (
          <div data-testid="confirmation">
            <h3>Agendamento Confirmado!</h3>
            <div data-testid="appointment-summary">
              <p><strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Horário:</strong> {selectedTime}</p>
              <p><strong>Médico:</strong> {selectedDoctor?.name}</p>
              <p><strong>Especialidade:</strong> {selectedDoctor?.specialty}</p>
              <p><strong>Motivo:</strong> {appointmentData.reason}</p>
            </div>
            <div data-testid="confirmation-notification">
              ✅ Confirmação enviada para {mockAuthContext.user.email}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div data-testid="appointment-page">
      <div data-testid="appointment-steps">
        {steps.map(step => (
          <div
            key={step.id}
            data-testid={`step-${step.id}`}
            className={currentStep >= step.id ? 'active' : 'inactive'}
          >
            {step.id}. {step.title}
          </div>
        ))}
      </div>
      
      {error && (
        <div data-testid="error-message" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      
      {renderCurrentStep()}
    </div>
  )
}

// Componente mock para dashboard
const MockDashboard = () => {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await mockAppointmentService.getPatientAppointments(mockAuthContext.user.id)
      setAppointments(data)
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div data-testid="dashboard-loading">Carregando agendamentos...</div>
  }

  return (
    <div data-testid="patient-dashboard">
      <h2>Meus Agendamentos</h2>
      <div data-testid="appointments-list">
        {appointments.map(appointment => (
          <div key={appointment.id} data-testid={`appointment-${appointment.id}`}>
            <h4>{appointment.doctorName}</h4>
            <p>{appointment.specialty}</p>
            <p>{new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}</p>
            <p>Status: {appointment.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Função de render personalizada para testes
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/']) => {
  return rtlRender(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  )
}

describe('REG-001 - Fluxo Completo de Agendamento', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock das APIs
    mockAppointmentService.getAvailableDates.mockResolvedValue(mockData.availableDates)
    mockAppointmentService.getAvailableDoctors.mockResolvedValue(mockData.doctors)
    mockAppointmentService.getAvailableTimeSlots.mockResolvedValue(mockData.timeSlots)
    mockAppointmentService.createAppointment.mockResolvedValue({
      success: true,
      appointmentId: 'appt-123',
      message: 'Agendamento criado com sucesso'
    })
    mockAppointmentService.confirmAppointment.mockResolvedValue({
      success: true,
      message: 'Agendamento confirmado'
    })
    mockAppointmentService.getPatientAppointments.mockResolvedValue([
      {
        id: 'appt-123',
        doctorName: 'Dr. Maria Santos',
        specialty: 'Cardiologia',
        date: '2024-01-15',
        time: '09:00',
        status: 'confirmed'
      }
    ])
    mockNotificationService.sendConfirmation.mockResolvedValue({
      success: true,
      message: 'Confirmação enviada'
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Fluxo Normal de Agendamento', () => {
    it('deve completar o fluxo completo de agendamento com sucesso', async () => {
      renderWithRouter(<MockAppointmentPage />)
      
      // Passo 1: Selecionar data
      expect(screen.getByTestId('date-selection')).toBeInTheDocument()
      const dateButton = screen.getByTestId('date-2024-01-15')
      await userEvent.click(dateButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-selection')).toBeInTheDocument()
      })
      
      // Passo 2: Escolher médico
      const doctorButton = screen.getByTestId('select-doctor-1')
      await userEvent.click(doctorButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('time-selection')).toBeInTheDocument()
      })
      
      // Passo 3: Selecionar horário
      const timeButton = screen.getByTestId('time-09:00')
      await userEvent.click(timeButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('appointment-data')).toBeInTheDocument()
      })
      
      // Passo 4: Preencher dados da consulta
      const reasonInput = screen.getByTestId('reason-input')
      const notesInput = screen.getByTestId('notes-input')
      const urgencySelect = screen.getByTestId('urgency-select')
      
      await userEvent.type(reasonInput, 'Dor no peito')
      await userEvent.type(notesInput, 'Sintomas começaram ontem')
      await userEvent.selectOptions(urgencySelect, 'urgent')
      
      // Confirmar agendamento
      const confirmButton = screen.getByTestId('confirm-appointment')
      await userEvent.click(confirmButton)
      
      // Passo 5: Verificar confirmação
      await waitFor(() => {
        expect(screen.getByTestId('confirmation')).toBeInTheDocument()
      })
      
      expect(screen.getByTestId('appointment-summary')).toBeInTheDocument()
      expect(screen.getByText('Dr. Maria Santos')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      expect(screen.getByText('Dor no peito')).toBeInTheDocument()
      expect(screen.getByTestId('confirmation-notification')).toBeInTheDocument()
      
      // Verificar se as APIs foram chamadas
      expect(mockAppointmentService.createAppointment).toHaveBeenCalledWith({
        date: '2024-01-15',
        doctorId: '1',
        time: '09:00',
        patientId: '1',
        reason: 'Dor no peito',
        notes: 'Sintomas começaram ontem',
        urgency: 'urgent'
      })
      expect(mockAppointmentService.confirmAppointment).toHaveBeenCalledWith('appt-123')
      expect(mockNotificationService.sendConfirmation).toHaveBeenCalled()
    })

    it('deve navegar corretamente entre os passos do agendamento', async () => {
      renderWithRouter(<MockAppointmentPage />)
      
      // Verificar passo inicial
      expect(screen.getByTestId('step-1')).toHaveClass('active')
      expect(screen.getByTestId('date-selection')).toBeInTheDocument()
      
      // Avançar para passo 2
      const dateButton = screen.getByTestId('date-2024-01-16')
      await userEvent.click(dateButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-selection')).toBeInTheDocument()
      })
      
      // Avançar para passo 3
      const doctorButton = screen.getByTestId('select-doctor-2')
      await userEvent.click(doctorButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('time-selection')).toBeInTheDocument()
      })
      
      // Avançar para passo 4
      const timeButton = screen.getByTestId('time-08:00')
      await userEvent.click(timeButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('appointment-data')).toBeInTheDocument()
      })
    })
  })

  describe('Validação de Dados', () => {
    it('deve validar dados obrigatórios antes de confirmar agendamento', async () => {
      renderWithRouter(<MockAppointmentPage />)
      
      // Navegar até o formulário
      await userEvent.click(screen.getByTestId('date-2024-01-17'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-1'))
      await waitFor(() => screen.getByTestId('time-selection'))
      await userEvent.click(screen.getByTestId('time-10:00'))
      await waitFor(() => screen.getByTestId('appointment-data'))
      
      // Tentar confirmar sem preencher motivo
      const confirmButton = screen.getByTestId('confirm-appointment')
      expect(confirmButton).toBeDisabled()
      
      // Preencher motivo e tentar novamente
      await userEvent.type(screen.getByTestId('reason-input'), 'Consulta de rotina')
      expect(confirmButton).not.toBeDisabled()
    })

    it('deve validar formato de dados do formulário', async () => {
      renderWithRouter(<MockAppointmentPage />)
      
      // Navegar até o formulário
      await userEvent.click(screen.getByTestId('date-2024-01-18'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-2'))
      await waitFor(() => screen.getByTestId('time-selection'))
      await userEvent.click(screen.getByTestId('time-16:00'))
      await waitFor(() => screen.getByTestId('appointment-data'))
      
      // Preencher dados válidos
      await userEvent.type(screen.getByTestId('reason-input'), 'Exame de rotina')
      await userEvent.type(screen.getByTestId('notes-input'), 'Primeira consulta')
      await userEvent.selectOptions(screen.getByTestId('urgency-select'), 'normal')
      
      const confirmButton = screen.getByTestId('confirm-appointment')
      await userEvent.click(confirmButton)
      
      // Verificar se os dados foram validados corretamente
      expect(mockAppointmentService.createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'Exame de rotina',
          notes: 'Primeira consulta',
          urgency: 'normal'
        })
      )
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve tratar erro ao carregar médicos disponíveis', async () => {
      mockAppointmentService.getAvailableDoctors.mockRejectedValue(new Error('Erro de rede'))
      
      renderWithRouter(<MockAppointmentPage />)
      
      await userEvent.click(screen.getByTestId('date-2024-01-19'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao carregar médicos disponíveis')).toBeInTheDocument()
    })

    it('deve tratar erro ao carregar horários disponíveis', async () => {
      mockAppointmentService.getAvailableTimeSlots.mockRejectedValue(new Error('Erro de API'))
      
      renderWithRouter(<MockAppointmentPage />)
      
      await userEvent.click(screen.getByTestId('date-2024-01-15'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-1'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao carregar horários disponíveis')).toBeInTheDocument()
    })

    it('deve tratar erro ao criar agendamento', async () => {
      mockAppointmentService.createAppointment.mockResolvedValue({
        success: false,
        message: 'Horário não disponível'
      })
      
      renderWithRouter(<MockAppointmentPage />)
      
      // Navegar até o formulário
      await userEvent.click(screen.getByTestId('date-2024-01-16'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-2'))
      await waitFor(() => screen.getByTestId('time-selection'))
      await userEvent.click(screen.getByTestId('time-16:00'))
      await waitFor(() => screen.getByTestId('appointment-data'))
      
      await userEvent.type(screen.getByTestId('reason-input'), 'Consulta urgente')
      await userEvent.click(screen.getByTestId('confirm-appointment'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Horário não disponível')).toBeInTheDocument()
    })

    it('deve tratar erro de rede ao criar agendamento', async () => {
      mockAppointmentService.createAppointment.mockRejectedValue(new Error('Network Error'))
      
      renderWithRouter(<MockAppointmentPage />)
      
      // Navegar até o formulário
      await userEvent.click(screen.getByTestId('date-2024-01-17'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-1'))
      await waitFor(() => screen.getByTestId('time-selection'))
      await userEvent.click(screen.getByTestId('time-15:00'))
      await waitFor(() => screen.getByTestId('appointment-data'))
      
      await userEvent.type(screen.getByTestId('reason-input'), 'Consulta de emergência')
      await userEvent.click(screen.getByTestId('confirm-appointment'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao processar agendamento')).toBeInTheDocument()
    })
  })

  describe('Dashboard e Verificação', () => {
    it('deve exibir agendamento no dashboard após confirmação', async () => {
      renderWithRouter(<MockDashboard />)
      
      await waitFor(() => {
        expect(screen.getByTestId('patient-dashboard')).toBeInTheDocument()
      })
      
      expect(screen.getByTestId('appointments-list')).toBeInTheDocument()
      expect(screen.getByTestId('appointment-appt-123')).toBeInTheDocument()
      expect(screen.getByText('Dr. Maria Santos')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      expect(screen.getByText('Status: confirmed')).toBeInTheDocument()
    })

    it('deve enviar notificação de confirmação', async () => {
      renderWithRouter(<MockAppointmentPage />)
      
      // Completar fluxo de agendamento
      await userEvent.click(screen.getByTestId('date-2024-01-15'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-1'))
      await waitFor(() => screen.getByTestId('time-selection'))
      await userEvent.click(screen.getByTestId('time-09:00'))
      await waitFor(() => screen.getByTestId('appointment-data'))
      
      await userEvent.type(screen.getByTestId('reason-input'), 'Consulta de rotina')
      await userEvent.click(screen.getByTestId('confirm-appointment'))
      
      await waitFor(() => {
        expect(screen.getByTestId('confirmation')).toBeInTheDocument()
      })
      
      expect(mockNotificationService.sendConfirmation).toHaveBeenCalledWith({
        appointmentId: 'appt-123',
        patientEmail: 'joao.silva@email.com',
        doctorName: 'Dr. Maria Santos',
        date: '2024-01-15',
        time: '09:00'
      })
      
      expect(screen.getByTestId('confirmation-notification')).toBeInTheDocument()
    })
  })

  describe('Cenários Especiais', () => {
    it('deve lidar com médico indisponível', async () => {
      // Mock específico para este teste
      mockAppointmentService.getAvailableDoctors.mockResolvedValueOnce([])
      
      renderWithRouter(<MockAppointmentPage />)
      
      await userEvent.click(screen.getByTestId('date-2024-01-15'))
      
      await waitFor(() => {
        expect(screen.getByTestId('doctor-selection')).toBeInTheDocument()
      })
      
      // Verificar que não há médicos disponíveis
      expect(screen.queryByTestId('doctor-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('doctor-2')).not.toBeInTheDocument()
    })

    it('deve lidar com horário indisponível', async () => {
      // Mock específico para este teste
      mockAppointmentService.getAvailableTimeSlots.mockResolvedValueOnce([])
      
      renderWithRouter(<MockAppointmentPage />)
      
      await userEvent.click(screen.getByTestId('date-2024-01-16'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-1'))
      
      await waitFor(() => {
        expect(screen.getByTestId('time-selection')).toBeInTheDocument()
      })
      
      // Verificar que não há horários disponíveis
      expect(screen.queryByTestId('time-09:00')).not.toBeInTheDocument()
      expect(screen.queryByTestId('time-10:00')).not.toBeInTheDocument()
    })

    it('deve validar dados com caracteres especiais', async () => {
      renderWithRouter(<MockAppointmentPage />)
      
      // Navegar até o formulário
      await userEvent.click(screen.getByTestId('date-2024-01-17'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-2'))
      await waitFor(() => screen.getByTestId('time-selection'))
      await userEvent.click(screen.getByTestId('time-17:00'))
      await waitFor(() => screen.getByTestId('appointment-data'))
      
      // Preencher com dados com caracteres especiais
      await userEvent.type(screen.getByTestId('reason-input'), 'Consulta com Dr. João - urgente!')
      await userEvent.type(screen.getByTestId('notes-input'), 'Sintomas: dor + náusea')
      await userEvent.selectOptions(screen.getByTestId('urgency-select'), 'urgent')
      
      const confirmButton = screen.getByTestId('confirm-appointment')
      await userEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('confirmation')).toBeInTheDocument()
      })
      
      expect(mockAppointmentService.createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'Consulta com Dr. João - urgente!',
          notes: 'Sintomas: dor + náusea'
        })
      )
    })
  })

  describe('Integração com APIs', () => {
    it('deve chamar todas as APIs necessárias no fluxo completo', async () => {
      renderWithRouter(<MockAppointmentPage />)
      
      // Executar fluxo completo
      await userEvent.click(screen.getByTestId('date-2024-01-15'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-1'))
      await waitFor(() => screen.getByTestId('time-selection'))
      await userEvent.click(screen.getByTestId('time-09:00'))
      await waitFor(() => screen.getByTestId('appointment-data'))
      
      await userEvent.type(screen.getByTestId('reason-input'), 'Consulta completa')
      await userEvent.click(screen.getByTestId('confirm-appointment'))
      
      await waitFor(() => {
        expect(screen.getByTestId('confirmation')).toBeInTheDocument()
      })
      
      // Verificar chamadas das APIs
      expect(mockAppointmentService.getAvailableDoctors).toHaveBeenCalledWith('2024-01-15')
      expect(mockAppointmentService.getAvailableTimeSlots).toHaveBeenCalledWith('2024-01-15', '1')
      expect(mockAppointmentService.createAppointment).toHaveBeenCalled()
      expect(mockAppointmentService.confirmAppointment).toHaveBeenCalledWith('appt-123')
      expect(mockNotificationService.sendConfirmation).toHaveBeenCalled()
    })

    it('deve tratar timeout das APIs', async () => {
      mockAppointmentService.createAppointment.mockImplementation(() => 
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      )
      
      renderWithRouter(<MockAppointmentPage />)
      
      // Navegar até o formulário
      await userEvent.click(screen.getByTestId('date-2024-01-18'))
      await waitFor(() => screen.getByTestId('doctor-selection'))
      await userEvent.click(screen.getByTestId('select-doctor-1'))
      await waitFor(() => screen.getByTestId('time-selection'))
      await userEvent.click(screen.getByTestId('time-14:00'))
      await waitFor(() => screen.getByTestId('appointment-data'))
      
      await userEvent.type(screen.getByTestId('reason-input'), 'Consulta com timeout')
      await userEvent.click(screen.getByTestId('confirm-appointment'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao processar agendamento')).toBeInTheDocument()
    })
  })
})
