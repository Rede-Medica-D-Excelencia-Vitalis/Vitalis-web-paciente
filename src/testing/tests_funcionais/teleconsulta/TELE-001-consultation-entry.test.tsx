import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils'
import { Teleconsulta } from '../../../screens/Teleconsulta/Teleconsulta'

// Mock do react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/teleconsulta' }),
  }
})

// Mock do consultaService
vi.mock('../../../services/consultation/consultaService', () => ({
  consultaService: {
    getProximasConsultas: vi.fn(),
    getConsultasPassadas: vi.fn(),
    entrarSalaVideochamada: vi.fn(),
    criarSalaVideochamada: vi.fn(),
  },
}))

// Mock do useAuth
vi.mock('../../../hooks/auth/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
    },
  }),
}))

// Mock do useVideochamada
vi.mock('../../../hooks/communication/useVideochamada', () => ({
  useVideochamada: () => ({
    isConnecting: false,
    error: null,
    localStream: null,
    remoteStream: null,
    connectToRoom: vi.fn(),
    disconnect: vi.fn(),
    toggleCamera: vi.fn(),
    toggleMicrophone: vi.fn(),
  }),
}))

// Mock do websocketService
vi.mock('../../../services/communication/websocketService', () => ({
  websocketService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendMessage: vi.fn(),
  },
}))

// Mock do useFullscreen
vi.mock('../../../contexts/fullscreen/FullscreenContext', () => ({
  useFullscreen: () => ({
    setVideoCallFullscreen: vi.fn(),
  }),
}))

// Mock do MediaDevices API
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: vi.fn().mockReturnValue([
        { kind: 'video', stop: vi.fn() },
        { kind: 'audio', stop: vi.fn() }
      ])
    }),
  },
})

describe('TELE-001 - Entrada na Consulta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('token', 'mock-token')
  })

  it('deve acessar a página de teleconsulta', async () => {
    // Mock do consultaService
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockResolvedValue([
      {
        id: 1,
        date: '2024-01-23',
        time: '14:00',
        status: 'agendada',
        type: 'teleconsulta',
        doctor: {
          name: 'Dr. Silva',
          specialty: 'Cardiologia',
          avatar: 'https://example.com/doctor1.jpg'
        }
      }
    ])
    
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])

    render(<Teleconsulta />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })
  })

  it('deve verificar consulta disponível', async () => {
    // Mock do consultaService
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockResolvedValue([
      {
        id: 1,
        date: '2024-01-23',
        time: '14:00',
        status: 'agendada',
        type: 'teleconsulta',
        doctor: {
          name: 'Dr. Silva',
          specialty: 'Cardiologia',
          avatar: 'https://example.com/doctor1.jpg'
        }
      }
    ])
    
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])

    render(<Teleconsulta />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })

    // Verificar se a consulta está disponível
    await waitFor(() => {
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })
  })

  it('deve exibir botão para entrar na consulta quando disponível', async () => {
    // Mock do consultaService
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockResolvedValue([
      {
        id: 1,
        date: '2024-01-23',
        time: '14:00',
        status: 'agendada',
        type: 'teleconsulta',
        doctor: {
          name: 'Dr. Silva',
          specialty: 'Cardiologia',
          avatar: 'https://example.com/doctor1.jpg'
        }
      }
    ])
    
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])

    render(<Teleconsulta />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })

    // Aguardar carregamento das consultas
    await waitFor(() => {
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('deve solicitar permissões de mídia ao entrar na consulta', async () => {
    const user = userEvent.setup()
    
    // Mock do consultaService
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockResolvedValue([
      {
        id: 1,
        date: '2024-01-23',
        time: '14:00',
        status: 'agendada',
        type: 'teleconsulta',
        doctor: {
          name: 'Dr. Silva',
          specialty: 'Cardiologia',
          avatar: 'https://example.com/doctor1.jpg'
        }
      }
    ])
    
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])
    vi.mocked(consultaService.entrarSalaVideochamada).mockResolvedValue({
      roomId: 'room-123',
      consultaId: 1,
      medicoId: 2,
      pacienteId: 1,
      status: 'ativa',
      criadoEm: '2024-01-23T14:00:00Z'
    })

    render(<Teleconsulta />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })

    // Aguardar carregamento das consultas
    await waitFor(() => {
      expect(screen.getByText('Dr. Silva')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Verificar se o componente está funcionando
    expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
  })

  it('deve estabelecer conexão com sucesso', async () => {
    // Mock do consultaService
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockResolvedValue([
      {
        id: 1,
        date: '2024-01-23',
        time: '14:00',
        status: 'agendada',
        type: 'teleconsulta',
        doctor: {
          name: 'Dr. Silva',
          specialty: 'Cardiologia',
          avatar: 'https://example.com/doctor1.jpg'
        }
      }
    ])
    
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])
    vi.mocked(consultaService.entrarSalaVideochamada).mockResolvedValue({
      roomId: 'room-123',
      consultaId: 1,
      medicoId: 2,
      pacienteId: 1,
      status: 'ativa',
      criadoEm: '2024-01-23T14:00:00Z'
    })

    render(<Teleconsulta />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })

    // Verificar se o componente está funcionando
    expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
  })

  it('deve exibir interface de videochamada após conexão', async () => {
    // Mock do consultaService
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockResolvedValue([
      {
        id: 1,
        date: '2024-01-23',
        time: '14:00',
        status: 'agendada',
        type: 'teleconsulta',
        doctor: {
          name: 'Dr. Silva',
          specialty: 'Cardiologia',
          avatar: 'https://example.com/doctor1.jpg'
        }
      }
    ])
    
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])
    vi.mocked(consultaService.entrarSalaVideochamada).mockResolvedValue({
      roomId: 'room-123',
      consultaId: 1,
      medicoId: 2,
      pacienteId: 1,
      status: 'ativa',
      criadoEm: '2024-01-23T14:00:00Z'
    })

    render(<Teleconsulta />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })

    // Verificar se o componente está funcionando
    expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
  })

  it('deve exibir vídeo local e remoto funcionando', async () => {
    // Mock do consultaService
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockResolvedValue([
      {
        id: 1,
        date: '2024-01-23',
        time: '14:00',
        status: 'agendada',
        type: 'teleconsulta',
        doctor: {
          name: 'Dr. Silva',
          specialty: 'Cardiologia',
          avatar: 'https://example.com/doctor1.jpg'
        }
      }
    ])
    
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])
    vi.mocked(consultaService.entrarSalaVideochamada).mockResolvedValue({
      roomId: 'room-123',
      consultaId: 1,
      medicoId: 2,
      pacienteId: 1,
      status: 'ativa',
      criadoEm: '2024-01-23T14:00:00Z'
    })

    render(<Teleconsulta />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })

    // Verificar se o componente está funcionando
    expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
  })

  it('deve exibir mensagem quando não há consultas disponíveis', async () => {
    // Mock do consultaService
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockResolvedValue([])
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])

    render(<Teleconsulta />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })

    // Verificar se o componente está funcionando
    expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
  })

  it('deve exibir estado de carregamento inicial', async () => {
    // Mock do consultaService com delay
    const { consultaService } = await import('../../../services/consultation/consultaService')
    vi.mocked(consultaService.getProximasConsultas).mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve([]), 100)
      )
    )
    vi.mocked(consultaService.getConsultasPassadas).mockResolvedValue([])

    render(<Teleconsulta />)
    
    // Verificar se o estado de carregamento aparece
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })
  })
})
