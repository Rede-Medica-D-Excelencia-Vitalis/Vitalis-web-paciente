import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render as rtlRender, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

// Interfaces para tipagem
interface TeleconsultationData {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  specialty: string
  scheduledTime: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  roomId: string
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
  type: 'text' | 'system'
}

interface MediaDevice {
  deviceId: string
  label: string
  kind: 'audioinput' | 'videoinput'
}

// Mock dos serviços
const mockWebRTCService = {
  initializeCall: vi.fn(),
  startVideo: vi.fn(),
  startAudio: vi.fn(),
  stopVideo: vi.fn(),
  stopAudio: vi.fn(),
  endCall: vi.fn(),
  getMediaDevices: vi.fn(),
  checkMediaPermissions: vi.fn()
}

const mockWebSocketService = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  sendMessage: vi.fn(),
  onMessage: vi.fn(),
  onConnectionChange: vi.fn()
}

const mockConsultationService = {
  getConsultationData: vi.fn(),
  startConsultation: vi.fn(),
  endConsultation: vi.fn(),
  saveConsultationNotes: vi.fn(),
  recordConsultation: vi.fn()
}

const mockNotificationService = {
  sendNotification: vi.fn(),
  showToast: vi.fn()
}

// Mock dos dados de teste
const mockConsultationData: TeleconsultationData = {
  id: 'consultation-123',
  patientId: 'patient-1',
  doctorId: 'doctor-1',
  doctorName: 'Dr. Maria Santos',
  specialty: 'Cardiologia',
  scheduledTime: '2024-01-15T10:00:00Z',
  status: 'scheduled',
  roomId: 'room-abc123'
}

const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'doctor-1',
    senderName: 'Dr. Maria Santos',
    message: 'Olá! Como você está se sentindo hoje?',
    timestamp: '2024-01-15T10:00:00Z',
    type: 'text'
  },
  {
    id: 'msg-2',
    senderId: 'system',
    senderName: 'Sistema',
    message: 'Consulta iniciada',
    timestamp: '2024-01-15T10:00:05Z',
    type: 'system'
  }
]

const mockMediaDevices: MediaDevice[] = [
  {
    deviceId: 'camera-1',
    label: 'Câmera USB',
    kind: 'videoinput'
  },
  {
    deviceId: 'microphone-1',
    label: 'Microfone USB',
    kind: 'audioinput'
  }
]

// Componente mock para interface de teleconsulta
const MockTeleconsultationInterface = () => {
  const [consultation, setConsultation] = React.useState<TeleconsultationData | null>(null)
  const [isVideoOn, setIsVideoOn] = React.useState(false)
  const [isAudioOn, setIsAudioOn] = React.useState(false)
  const [isCallActive, setIsCallActive] = React.useState(false)
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = React.useState('')
  const [isRecording, setIsRecording] = React.useState(false)
  const [connectionStatus, setConnectionStatus] = React.useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    loadConsultationData()
    setupWebSocket()
  }, [])

  const loadConsultationData = async () => {
    setIsLoading(true)
    try {
      const data = await mockConsultationService.getConsultationData('consultation-123')
      setConsultation(data)
    } catch (err) {
      setError('Erro ao carregar dados da consulta')
      setConsultation(null) // Garantir que consultation seja null em caso de erro
    } finally {
      setIsLoading(false)
    }
  }

  const setupWebSocket = async () => {
    try {
      await mockWebSocketService.connect()
      setConnectionStatus('connected')
      
      mockWebSocketService.onMessage((message: ChatMessage) => {
        setChatMessages(prev => [...prev, message])
      })
    } catch (err) {
      setConnectionStatus('disconnected')
      setError('Erro ao conectar ao chat')
    }
  }

  const startConsultation = async () => {
    setIsLoading(true)
    try {
      // Verificar permissões de mídia
      const hasPermissions = await mockWebRTCService.checkMediaPermissions()
      if (!hasPermissions) {
        setError('Permissões de câmera e microfone necessárias')
        return
      }

      // Inicializar chamada
      await mockWebRTCService.initializeCall(consultation!.roomId)
      
      // Iniciar vídeo e áudio
      await mockWebRTCService.startVideo()
      await mockWebRTCService.startAudio()
      
      setIsVideoOn(true)
      setIsAudioOn(true)
      setIsCallActive(true)
      
      // Iniciar consulta no backend
      await mockConsultationService.startConsultation(consultation!.id)
      
      // Iniciar gravação
      await mockConsultationService.recordConsultation(consultation!.id)
      setIsRecording(true)
      
      mockNotificationService.showToast('Consulta iniciada com sucesso!')
    } catch (err) {
      setError('Erro ao iniciar consulta')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVideo = async () => {
    try {
      if (isVideoOn) {
        await mockWebRTCService.stopVideo()
        setIsVideoOn(false)
      } else {
        await mockWebRTCService.startVideo()
        setIsVideoOn(true)
      }
    } catch (err) {
      setError('Erro ao controlar câmera')
    }
  }

  const toggleAudio = async () => {
    try {
      if (isAudioOn) {
        await mockWebRTCService.stopAudio()
        setIsAudioOn(false)
      } else {
        await mockWebRTCService.startAudio()
        setIsAudioOn(true)
      }
    } catch (err) {
      setError('Erro ao controlar microfone')
    }
  }

  const sendChatMessage = async () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'patient-1',
      senderName: 'Você',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    try {
      await mockWebSocketService.sendMessage({
        roomId: consultation!.roomId,
        message: message.message,
        senderId: message.senderId
      })
      
      setChatMessages(prev => [...prev, message])
      setNewMessage('')
    } catch (err) {
      setError('Erro ao enviar mensagem')
    }
  }

  const endConsultation = async () => {
    setIsLoading(true)
    try {
      // Parar gravação
      if (isRecording) {
        await mockConsultationService.recordConsultation(consultation!.id)
        setIsRecording(false)
      }
      
      // Finalizar chamada
      await mockWebRTCService.endCall()
      
      // Finalizar consulta no backend
      await mockConsultationService.endConsultation(consultation!.id)
      
      setIsCallActive(false)
      setIsVideoOn(false)
      setIsAudioOn(false)
      
      // Desconectar WebSocket
      await mockWebSocketService.disconnect()
      setConnectionStatus('disconnected')
      
      mockNotificationService.showToast('Consulta finalizada!')
    } catch (err) {
      setError('Erro ao finalizar consulta')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !consultation && !error) {
    return <div data-testid="loading-consultation">Carregando consulta...</div>
  }

  if (!consultation) {
    return (
      <div data-testid="no-consultation">
        {error ? (
          <div data-testid="error-message" style={{ color: 'red' }}>
            {error}
          </div>
        ) : (
          'Nenhuma consulta encontrada'
        )}
      </div>
    )
  }

  return (
    <div data-testid="teleconsultation-interface">
      <div data-testid="consultation-header">
        <h2>Teleconsulta com {consultation.doctorName}</h2>
        <p>Especialidade: {consultation.specialty}</p>
        <p>Status: {consultation.status}</p>
      </div>

      {error && (
        <div data-testid="error-message" style={{ color: 'red' }}>
          {error}
        </div>
      )}

      <div data-testid="video-section">
        <div data-testid="video-container">
          <video 
            data-testid="local-video" 
            style={{ width: '300px', height: '200px', backgroundColor: 'black' }}
          >
            {isVideoOn ? 'Vídeo local ativo' : 'Vídeo local desativado'}
          </video>
          <video 
            data-testid="remote-video" 
            style={{ width: '300px', height: '200px', backgroundColor: 'gray' }}
          >
            {isCallActive ? 'Vídeo do médico' : 'Aguardando conexão'}
          </video>
        </div>

        <div data-testid="media-controls">
          <button
            data-testid="toggle-video"
            onClick={toggleVideo}
            disabled={!isCallActive}
            style={{ backgroundColor: isVideoOn ? 'green' : 'red' }}
          >
            {isVideoOn ? 'Câmera Ligada' : 'Câmera Desligada'}
          </button>
          <button
            data-testid="toggle-audio"
            onClick={toggleAudio}
            disabled={!isCallActive}
            style={{ backgroundColor: isAudioOn ? 'green' : 'red' }}
          >
            {isAudioOn ? 'Microfone Ligado' : 'Microfone Desligado'}
          </button>
          {!isCallActive && (
            <button
              data-testid="start-consultation"
              onClick={startConsultation}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Consulta'}
            </button>
          )}
          {isCallActive && (
            <button
              data-testid="end-consultation"
              onClick={endConsultation}
              disabled={isLoading}
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              {isLoading ? 'Finalizando...' : 'Finalizar Consulta'}
            </button>
          )}
        </div>
      </div>

      <div data-testid="chat-section">
        <h3>Chat com o Médico</h3>
        <div data-testid="connection-status">
          Status: {connectionStatus === 'connected' ? '✅ Conectado' : '❌ Desconectado'}
        </div>
        <div data-testid="recording-status">
          {isRecording ? '🔴 Gravando' : '⏹️ Não gravando'}
        </div>

        <div data-testid="chat-messages">
          {chatMessages.map(message => (
            <div key={message.id} data-testid={`message-${message.id}`}>
              <strong>{message.senderName}:</strong> {message.message}
              <small> ({new Date(message.timestamp).toLocaleTimeString()})</small>
            </div>
          ))}
        </div>

        <div data-testid="chat-input">
          <input
            data-testid="message-input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={connectionStatus !== 'connected'}
          />
          <button
            data-testid="send-message"
            onClick={sendChatMessage}
            disabled={!newMessage.trim() || connectionStatus !== 'connected'}
          >
            Enviar
          </button>
        </div>
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

describe('REG-002 - Fluxo Completo de Teleconsulta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock das APIs
    mockConsultationService.getConsultationData.mockResolvedValue(mockConsultationData)
    mockConsultationService.startConsultation.mockResolvedValue({ success: true })
    mockConsultationService.endConsultation.mockResolvedValue({ success: true })
    mockConsultationService.recordConsultation.mockResolvedValue({ success: true })
    
    mockWebRTCService.initializeCall.mockResolvedValue({ success: true })
    mockWebRTCService.startVideo.mockResolvedValue({ success: true })
    mockWebRTCService.startAudio.mockResolvedValue({ success: true })
    mockWebRTCService.stopVideo.mockResolvedValue({ success: true })
    mockWebRTCService.stopAudio.mockResolvedValue({ success: true })
    mockWebRTCService.endCall.mockResolvedValue({ success: true })
    mockWebRTCService.checkMediaPermissions.mockResolvedValue(true)
    mockWebRTCService.getMediaDevices.mockResolvedValue(mockMediaDevices)
    
    mockWebSocketService.connect.mockResolvedValue({ success: true })
    mockWebSocketService.disconnect.mockResolvedValue({ success: true })
    mockWebSocketService.sendMessage.mockResolvedValue({ success: true })
    
    mockNotificationService.sendNotification.mockResolvedValue({ success: true })
    mockNotificationService.showToast.mockResolvedValue({ success: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Fluxo Normal de Teleconsulta', () => {
    it('deve completar o fluxo completo de teleconsulta com sucesso', async () => {
      renderWithRouter(<MockTeleconsultationInterface />)
      
      // Verificar carregamento inicial
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Teleconsulta com Dr. Maria Santos')).toBeInTheDocument()
      expect(screen.getByText('Especialidade: Cardiologia')).toBeInTheDocument()
      
      // Iniciar consulta
      const startButton = screen.getByTestId('start-consultation')
      await userEvent.click(startButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('toggle-video')).toBeEnabled()
        expect(screen.getByTestId('toggle-audio')).toBeEnabled()
      })
      
      // Verificar controles de mídia ativos
      expect(screen.getByText('Câmera Ligada')).toBeInTheDocument()
      expect(screen.getByText('Microfone Ligado')).toBeInTheDocument()
      
      // Testar chat
      const messageInput = screen.getByTestId('message-input')
      const sendButton = screen.getByTestId('send-message')
      
      await userEvent.type(messageInput, 'Olá doutor, estou me sentindo bem')
      await userEvent.click(sendButton)
      
      await waitFor(() => {
        expect(screen.getByText('Olá doutor, estou me sentindo bem')).toBeInTheDocument()
      })
      
      // Verificar que gravação está ativa
      expect(screen.getByText('🔴 Gravando')).toBeInTheDocument()
      
      // Finalizar consulta
      const endButton = screen.getByTestId('end-consultation')
      await userEvent.click(endButton)
      
      await waitFor(() => {
        expect(screen.getByText('⏹️ Não gravando')).toBeInTheDocument()
      })
      
      // Verificar chamadas das APIs
      expect(mockWebRTCService.initializeCall).toHaveBeenCalledWith('room-abc123')
      expect(mockWebRTCService.startVideo).toHaveBeenCalled()
      expect(mockWebRTCService.startAudio).toHaveBeenCalled()
      expect(mockConsultationService.startConsultation).toHaveBeenCalledWith('consultation-123')
      expect(mockConsultationService.recordConsultation).toHaveBeenCalledWith('consultation-123')
      expect(mockWebSocketService.sendMessage).toHaveBeenCalled()
      expect(mockConsultationService.endConsultation).toHaveBeenCalledWith('consultation-123')
      expect(mockWebRTCService.endCall).toHaveBeenCalled()
    })

    it('deve navegar corretamente pelos controles de mídia', async () => {
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      // Iniciar consulta
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('toggle-video')).toBeEnabled()
      })
      
      // Testar toggle de vídeo
      await userEvent.click(screen.getByTestId('toggle-video'))
      await waitFor(() => {
        expect(screen.getByText('Câmera Desligada')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('toggle-video'))
      await waitFor(() => {
        expect(screen.getByText('Câmera Ligada')).toBeInTheDocument()
      })
      
      // Testar toggle de áudio
      await userEvent.click(screen.getByTestId('toggle-audio'))
      await waitFor(() => {
        expect(screen.getByText('Microfone Desligado')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('toggle-audio'))
      await waitFor(() => {
        expect(screen.getByText('Microfone Ligado')).toBeInTheDocument()
      })
    })
  })

  describe('Funcionalidade de Chat', () => {
    it('deve enviar e receber mensagens no chat', async () => {
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      // Iniciar consulta
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('message-input')).toBeEnabled()
      })
      
      // Enviar mensagem
      const messageInput = screen.getByTestId('message-input')
      await userEvent.type(messageInput, 'Tenho uma dúvida sobre meus sintomas')
      await userEvent.click(screen.getByTestId('send-message'))
      
      await waitFor(() => {
        expect(screen.getByText('Tenho uma dúvida sobre meus sintomas')).toBeInTheDocument()
      })
      
      // Verificar que o input foi limpo
      expect(messageInput).toHaveValue('')
      
      // Simular mensagem recebida
      const receivedMessage: ChatMessage = {
        id: 'msg-received',
        senderId: 'doctor-1',
        senderName: 'Dr. Maria Santos',
        message: 'Pode me contar mais detalhes?',
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      
      // Simular callback do WebSocket
      const onMessageCallback = mockWebSocketService.onMessage.mock.calls[0][0]
      onMessageCallback(receivedMessage)
      
      await waitFor(() => {
        expect(screen.getByText('Pode me contar mais detalhes?')).toBeInTheDocument()
      })
    })

    it('deve exibir status de conexão do chat', async () => {
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toBeInTheDocument()
      })
      
      // Verificar status conectado
      expect(screen.getByText('Status: ✅ Conectado')).toBeInTheDocument()
      
      // Verificar que chat está funcional
      expect(screen.getByTestId('message-input')).toBeEnabled()
      
      // O botão de envio deve estar desabilitado inicialmente (sem mensagem)
      expect(screen.getByTestId('send-message')).toBeDisabled()
      
      // Digitar uma mensagem para habilitar o botão
      await userEvent.type(screen.getByTestId('message-input'), 'Teste')
      expect(screen.getByTestId('send-message')).toBeEnabled()
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve tratar erro ao carregar dados da consulta', async () => {
      mockConsultationService.getConsultationData.mockRejectedValue(new Error('Erro de API'))
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao carregar dados da consulta')).toBeInTheDocument()
    })

    it('deve tratar erro ao iniciar consulta sem permissões', async () => {
      mockWebRTCService.checkMediaPermissions.mockResolvedValue(false)
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Permissões de câmera e microfone necessárias')).toBeInTheDocument()
    })

    it('deve tratar erro ao conectar WebSocket', async () => {
      mockWebSocketService.connect.mockRejectedValue(new Error('Erro de conexão'))
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao conectar ao chat')).toBeInTheDocument()
      expect(screen.getByText('Status: ❌ Desconectado')).toBeInTheDocument()
    })

    it('deve tratar erro ao enviar mensagem no chat', async () => {
      mockWebSocketService.sendMessage.mockRejectedValue(new Error('Erro de envio'))
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('message-input')).toBeEnabled()
      })
      
      await userEvent.type(screen.getByTestId('message-input'), 'Mensagem de teste')
      await userEvent.click(screen.getByTestId('send-message'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao enviar mensagem')).toBeInTheDocument()
    })

    it('deve tratar erro ao finalizar consulta', async () => {
      mockConsultationService.endConsultation.mockRejectedValue(new Error('Erro de finalização'))
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('end-consultation')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('end-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao finalizar consulta')).toBeInTheDocument()
    })
  })

  describe('Cenários Especiais', () => {
    it('deve lidar com problemas de rede durante a consulta', async () => {
      mockWebRTCService.initializeCall.mockRejectedValue(new Error('Network Error'))
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao iniciar consulta')).toBeInTheDocument()
    })

    it('deve lidar com câmera indisponível', async () => {
      mockWebRTCService.startVideo.mockRejectedValue(new Error('Camera not available'))
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao iniciar consulta')).toBeInTheDocument()
    })

    it('deve lidar com microfone indisponível', async () => {
      mockWebRTCService.startAudio.mockRejectedValue(new Error('Microphone not available'))
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao iniciar consulta')).toBeInTheDocument()
    })

    it('deve validar controle de gravação', async () => {
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      // Antes de iniciar, não deve estar gravando
      expect(screen.getByText('⏹️ Não gravando')).toBeInTheDocument()
      
      // Iniciar consulta
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByText('🔴 Gravando')).toBeInTheDocument()
      })
      
      // Finalizar consulta
      await userEvent.click(screen.getByTestId('end-consultation'))
      
      await waitFor(() => {
        expect(screen.getByText('⏹️ Não gravando')).toBeInTheDocument()
      })
    })
  })

  describe('Integração com APIs', () => {
    it('deve chamar todas as APIs necessárias no fluxo completo', async () => {
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      // Iniciar consulta
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('end-consultation')).toBeInTheDocument()
      })
      
      // Enviar mensagem
      await userEvent.type(screen.getByTestId('message-input'), 'Teste de integração')
      await userEvent.click(screen.getByTestId('send-message'))
      
      // Finalizar consulta
      await userEvent.click(screen.getByTestId('end-consultation'))
      
      await waitFor(() => {
        expect(screen.getByText('⏹️ Não gravando')).toBeInTheDocument()
      })
      
      // Verificar todas as chamadas das APIs
      expect(mockConsultationService.getConsultationData).toHaveBeenCalledWith('consultation-123')
      expect(mockWebSocketService.connect).toHaveBeenCalled()
      expect(mockWebRTCService.checkMediaPermissions).toHaveBeenCalled()
      expect(mockWebRTCService.initializeCall).toHaveBeenCalledWith('room-abc123')
      expect(mockWebRTCService.startVideo).toHaveBeenCalled()
      expect(mockWebRTCService.startAudio).toHaveBeenCalled()
      expect(mockConsultationService.startConsultation).toHaveBeenCalledWith('consultation-123')
      expect(mockConsultationService.recordConsultation).toHaveBeenCalledWith('consultation-123')
      expect(mockWebSocketService.sendMessage).toHaveBeenCalled()
      expect(mockConsultationService.recordConsultation).toHaveBeenCalledWith('consultation-123')
      expect(mockConsultationService.endConsultation).toHaveBeenCalledWith('consultation-123')
      expect(mockWebRTCService.endCall).toHaveBeenCalled()
      expect(mockWebSocketService.disconnect).toHaveBeenCalled()
    })

    it('deve tratar timeout das APIs', async () => {
      mockWebRTCService.initializeCall.mockImplementation(() => 
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      )
      
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Erro ao iniciar consulta')).toBeInTheDocument()
    })
  })

  describe('Validação de Estados', () => {
    it('deve gerenciar corretamente os estados da interface', async () => {
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      // Estado inicial
      expect(screen.getByTestId('start-consultation')).toBeInTheDocument()
      expect(screen.getByTestId('toggle-video')).toBeDisabled()
      expect(screen.getByTestId('toggle-audio')).toBeDisabled()
      
      // Após iniciar consulta
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByTestId('toggle-video')).toBeEnabled()
        expect(screen.getByTestId('toggle-audio')).toBeEnabled()
        expect(screen.getByTestId('end-consultation')).toBeInTheDocument()
      })
      
      // Verificar que botão de iniciar não está mais visível
      expect(screen.queryByTestId('start-consultation')).not.toBeInTheDocument()
    })

    it('deve validar estados de mídia', async () => {
      renderWithRouter(<MockTeleconsultationInterface />)
      
      await waitFor(() => {
        expect(screen.getByTestId('teleconsultation-interface')).toBeInTheDocument()
      })
      
      // Iniciar consulta
      await userEvent.click(screen.getByTestId('start-consultation'))
      
      await waitFor(() => {
        expect(screen.getByText('Câmera Ligada')).toBeInTheDocument()
        expect(screen.getByText('Microfone Ligado')).toBeInTheDocument()
      })
      
      // Desativar vídeo
      await userEvent.click(screen.getByTestId('toggle-video'))
      await waitFor(() => {
        expect(screen.getByText('Câmera Desligada')).toBeInTheDocument()
      })
      
      // Reativar vídeo
      await userEvent.click(screen.getByTestId('toggle-video'))
      await waitFor(() => {
        expect(screen.getByText('Câmera Ligada')).toBeInTheDocument()
      })
    })
  })
})
