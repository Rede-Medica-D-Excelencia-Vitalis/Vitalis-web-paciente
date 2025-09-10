import { api } from "../../lib/api";

interface ChatMessage {
  id: string;
  consultaId: number;
  senderId: number;
  senderType: 'medico' | 'paciente';
  content: string;
  timestamp: string;
  type: 'texto' | 'imagem' | 'arquivo';
}

interface VideoCallSignal {
  type: 'offer' | 'answer' | 'ice-candidate' | 'user-joined' | 'user-left';
  consultaId: number;
  senderId: number;
  senderType: 'medico' | 'paciente';
  data?: any;
}

interface WebSocketCallbacks {
  onMessage?: (message: ChatMessage) => void;
  onVideoSignal?: (signal: VideoCallSignal) => void;
  onUserJoined?: (userId: number, userType: 'medico' | 'paciente') => void;
  onUserLeft?: (userId: number, userType: 'medico' | 'paciente') => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private callbacks: WebSocketCallbacks = {};
  private consultaId: number | null = null;
  private userId: number | null = null;
  private userType: 'medico' | 'paciente' | null = null;
  private token: string | null = null;

  constructor() {
    this.handleMessage = this.handleMessage.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  private getToken(): string | null {
    if (this.token) return this.token;
    
    // Tentar pegar do localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      return token;
    }
    
    return null;
  }

  connect(consultaId: number, userId: number, userType: 'medico' | 'paciente', callbacks: WebSocketCallbacks = {}) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket já está conectado');
      return;
    }

    if (this.isConnecting) {
      console.log('WebSocket já está tentando conectar');
      return;
    }

    const token = this.getToken();
    if (!token) {
      console.error('Token não encontrado para autenticação WebSocket');
      callbacks.onError?.('Token de autenticação não encontrado');
      return;
    }

    this.consultaId = consultaId;
    this.userId = userId;
    this.userType = userType;
    this.callbacks = callbacks;
    this.isConnecting = true;

    try {
      // Usar a mesma base URL da API, mas com WebSocket
      const baseUrl = api.defaults.baseURL || 'http://localhost:3001';
      const wsUrl = baseUrl.replace('http', 'ws');
      this.ws = new WebSocket(`${wsUrl}?token=${token}`);

      this.ws.onopen = () => {
        console.log('WebSocket conectado');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.callbacks.onConnectionChange?.(true);
        
        // Entrar na sala da consulta
        this.entrarSalaConsulta();
      };

      this.ws.onmessage = this.handleMessage;
      this.ws.onerror = this.handleError;
      this.ws.onclose = this.handleClose;
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
      this.isConnecting = false;
      this.callbacks.onError?.('Erro ao conectar WebSocket');
    }
  }

  private entrarSalaConsulta() {
    if (!this.ws || !this.consultaId || !this.userType) return;

    this.ws.send(JSON.stringify({
      tipo: 'consulta_entrar',
      consultaId: this.consultaId,
      userType: this.userType
    }));
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket mensagem recebida:', data);

      switch (data.tipo) {
        case 'autenticacao':
          if (data.sucesso) {
            console.log('WebSocket autenticado com sucesso');
          } else {
            console.error('Falha na autenticação WebSocket:', data.erro);
            this.callbacks.onError?.('Falha na autenticação WebSocket');
          }
          break;

        case 'consulta_entrou':
          console.log('Entrou na sala da consulta:', data.consultaId);
          break;

        case 'consulta_saiu':
          console.log('Saiu da sala da consulta:', data.consultaId);
          break;

        case 'chat_message':
          this.callbacks.onMessage?.(data.message);
          break;

        case 'video_signal':
          this.callbacks.onVideoSignal?.(data.signal);
          break;

        case 'user_joined':
          this.callbacks.onUserJoined?.(data.userId, data.userType);
          break;

        case 'user_left':
          this.callbacks.onUserLeft?.(data.userId, data.userType);
          break;

        case 'erro':
          console.error('Erro WebSocket:', data.mensagem);
          this.callbacks.onError?.(data.mensagem);
          break;

        default:
          console.log('Tipo de mensagem desconhecido:', data.tipo);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem WebSocket:', error);
    }
  }

  private handleError(event: Event) {
    console.error('WebSocket error:', event);
    this.callbacks.onError?.('Erro na conexão WebSocket');
  }

  private handleClose(event: CloseEvent) {
    console.log('WebSocket desconectado:', event.code, event.reason);
    this.isConnecting = false;
    this.callbacks.onConnectionChange?.(false);

    // Tentar reconectar se não foi fechado intencionalmente
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        if (this.consultaId && this.userId && this.userType) {
          this.connect(this.consultaId, this.userId, this.userType, this.callbacks);
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  sendChatMessage(content: string, type: 'texto' | 'imagem' | 'arquivo' = 'texto') {
    if (this.ws?.readyState === WebSocket.OPEN && this.consultaId) {
      this.ws.send(JSON.stringify({
        tipo: 'chat_message',
        consultaId: this.consultaId,
        content,
        type
      }));
    } else {
      console.error('WebSocket não está conectado');
      this.callbacks.onError?.('WebSocket não está conectado');
    }
  }

  sendVideoSignal(signal: VideoCallSignal) {
    if (this.ws?.readyState === WebSocket.OPEN && this.consultaId) {
      this.ws.send(JSON.stringify({
        tipo: 'video_signal',
        consultaId: this.consultaId,
        type: signal.type,
        data: signal.data
      }));
    } else {
      console.error('WebSocket não está conectado');
      this.callbacks.onError?.('WebSocket não está conectado');
    }
  }

  disconnect() {
    if (this.ws) {
      // Sair da sala da consulta antes de desconectar
      if (this.consultaId) {
        this.ws.send(JSON.stringify({
          tipo: 'consulta_sair',
          consultaId: this.consultaId
        }));
      }
      
      this.ws.close(1000, 'Desconexão intencional');
      this.ws = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.consultaId = null;
    this.userId = null;
    this.userType = null;
    this.callbacks = {};
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
export type { ChatMessage, VideoCallSignal, WebSocketCallbacks }; 