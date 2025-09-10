import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../store/auth/authStore';

export interface WebSocketMessage {
  tipo: string;
  dados?: any;
  timestamp?: string;
  sucesso?: boolean;
  erro?: string;
  mensagem?: any;
  mensagens?: any[];
  usuario_id?: number;
  digitando?: boolean;
  ticket_id?: number;
  conteudo?: string;
  token?: string; // Para renovação de token
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
}

export const useWebSocket = (
  token: string | null,
  options: UseWebSocketOptions = {}
) => {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    maxReconnectAttempts = 3
  } = options;

  const { login } = useAuthStore();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const shouldReconnect = useRef(true);
  const isIntentionalClose = useRef(false);
  const lastConnectionTime = useRef(0);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Evitar múltiplas conexões simultâneas
    if (ws.current?.readyState === WebSocket.OPEN || isConnecting) {
      console.log('🔌 WebSocket: Conexão já existe ou em andamento');
      return;
    }

    // Evitar reconexões muito frequentes (mínimo 5 segundos entre tentativas)
    const now = Date.now();
    if (now - lastConnectionTime.current < 5000) {
      console.log('🔌 WebSocket: Aguardando tempo mínimo entre tentativas');
      return;
    }

    if (!token) {
      console.log('🔌 WebSocket: Token não disponível, aguardando...');
      return;
    }

    setIsConnecting(true);
    lastConnectionTime.current = now;
    
    try {
      const wsUrl = `ws://localhost:3001?token=${token}`;
      console.log('🔌 WebSocket: Tentando conectar...');
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('🔌 WebSocket conectado com sucesso');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttempts.current = 0;
        shouldReconnect.current = true;
        options.onConnect?.();
        
        // Iniciar ping periódico para manter conexão ativa
        if (pingInterval.current) {
          clearInterval(pingInterval.current);
        }
        pingInterval.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            console.log('🏓 Enviando ping...');
            ws.current.send(JSON.stringify({ tipo: 'ping' }));
          }
        }, 20000); // Ping a cada 20 segundos
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 WebSocket mensagem recebida:', message.tipo, message);
          
          // Tratar renovação de token
          if (message.tipo === 'token_renovado' && message.token) {
            console.log('🔄 Token renovado automaticamente pelo servidor');
            // Atualizar o token no localStorage e no store
            localStorage.setItem('token', message.token);
            options.onMessage?.(message);
            return;
          }
          
          // Tratar mensagem de autenticação
          if (message.tipo === 'autenticacao') {
            console.log('🔐 Resposta de autenticação recebida:', message);
            if (message.sucesso) {
              console.log('✅ WebSocket autenticado com sucesso');
            } else {
              console.error('❌ Falha na autenticação WebSocket:', message.erro);
            }
          }
          
          options.onMessage?.(message);
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('🔌 WebSocket desconectado:', event.code, event.reason, 'Clean:', event.wasClean);
        setIsConnected(false);
        setIsConnecting(false);
        options.onDisconnect?.();

        // Limpar ping interval
        if (pingInterval.current) {
          clearInterval(pingInterval.current);
          pingInterval.current = null;
        }

        // Só tentar reconectar se não foi fechado intencionalmente e ainda não atingiu o limite
        if (!isIntentionalClose.current && shouldReconnect.current && 
            event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          
          let delay = 3000; // Delay base de 3 segundos
          
          if (event.code === 1006) {
            // Para erro 1006 (anormal), aguardar mais tempo
            delay = 15000;
            console.log('❌ WebSocket fechado anormalmente (código 1006) - Aguardando 15s antes de tentar novamente');
          } else {
            // Delay exponencial para outros códigos
            delay = Math.min(5000 * Math.pow(2, reconnectAttempts.current), 30000);
            console.log(`🔄 Tentando reconectar em ${delay}ms (tentativa ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
          }
          
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.log('❌ Máximo de tentativas de reconexão atingido');
          shouldReconnect.current = false;
        } else if (event.code === 1000) {
          console.log('✅ WebSocket fechado intencionalmente');
        }
      };

      ws.current.onerror = (error) => {
        console.error('❌ Erro WebSocket:', error);
        setIsConnecting(false);
        options.onError?.(error);
      };

    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
      setIsConnecting(false);
    }
  }, [token, options, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    isIntentionalClose.current = true;
    shouldReconnect.current = false;
    
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    if (pingInterval.current) {
      clearInterval(pingInterval.current);
      pingInterval.current = null;
    }
    
    if (ws.current) {
      ws.current.close(1000, 'Desconexão intencional');
      ws.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttempts.current = 0;
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('WebSocket não está conectado');
      return false;
    }
  }, []);

  // Reconectar quando o token mudar
  useEffect(() => {
    if (token) {
      isIntentionalClose.current = false;
      shouldReconnect.current = true;
      reconnectAttempts.current = 0;
      connect();
    } else {
      disconnect();
    }
  }, [token, connect, disconnect]);

  // Cleanup ao desmontar - apenas uma vez
  useEffect(() => {
    return () => {
      console.log('🧹 useWebSocket: Cleanup ao desmontar');
      isIntentionalClose.current = true;
      shouldReconnect.current = false;
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    sendMessage,
    connect,
    disconnect
  };
};

// Hook específico para chat de suporte
export const useChatWebSocket = (ticketId?: number) => {
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [usuariosDigitando, setUsuariosDigitando] = useState<number[]>([]);
  const [usuariosNaSala, setUsuariosNaSala] = useState<number[]>([]);
  const { token } = useAuthStore();
  const lastTicketId = useRef<number | undefined>();
  const isInChat = useRef(false);
  const hasInitialized = useRef(false);
  const typingTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Limpar mensagens quando o ticket mudar
  useEffect(() => {
    if (ticketId !== lastTicketId.current) {
      console.log(`🔄 Mudando ticket de ${lastTicketId.current} para ${ticketId}`);
      setMensagens([]);
      setUsuariosDigitando([]);
      setUsuariosNaSala([]);
      lastTicketId.current = ticketId;
      isInChat.current = false;
      hasInitialized.current = false;
      
      // Limpar timeouts anteriores
      typingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      typingTimeouts.current.clear();
    }
  }, [ticketId]);

  const { sendMessage, isConnected } = useWebSocket(token, {
    maxReconnectAttempts: 5, // Mais tentativas para chat
    onMessage: (message) => {
      console.log('📨 useChatWebSocket: Mensagem recebida:', message.tipo);
      
      switch (message.tipo) {
        case 'chat_mensagem':
          setMensagens(prev => {
            // Verificar se a mensagem já existe para evitar duplicação
            const mensagemExiste = prev.some(m => m.id === message.mensagem.id);
            if (mensagemExiste) {
              return prev;
            }
            return [...prev, message.mensagem];
          });
          break;
        
        case 'chat_mensagens_historicas':
          console.log(`📚 useChatWebSocket: Recebidas ${message.mensagens?.length ?? 0} mensagens históricas`);
          setMensagens(message.mensagens ?? []);
          break;
        
        case 'chat_digite':
          if (typeof message.usuario_id === 'number') {
            const usuarioId = message.usuario_id;
            console.log(`⌨️ useChatWebSocket: Usuário ${usuarioId} ${message.digitando ? 'está digitando' : 'parou de digitar'}`);
            if (message.digitando) {
              setUsuariosDigitando(prev => 
                !prev.includes(usuarioId)
                  ? [...prev, usuarioId]
                  : prev
              );
            } else {
              setUsuariosDigitando(prev => 
                prev.filter(id => id !== usuarioId)
              );
            }
          }
          break;
        
        case 'chat_digite_confirmado':
          console.log(`✅ useChatWebSocket: Confirmação de digitação recebida - digitando: ${message.digitando}`);
          // Não precisamos fazer nada aqui, pois o chat_digite já foi processado
          break;
        
        case 'chat_usuario_entrou':
          if (typeof message.usuario_id === 'number') {
            const usuarioId = message.usuario_id;
          setUsuariosNaSala(prev => 
              !prev.includes(usuarioId)
                ? [...prev, usuarioId]
                : prev
          );
          }
          break;
        
        case 'chat_usuario_saiu':
          if (typeof message.usuario_id === 'number') {
            const usuarioId = message.usuario_id;
          setUsuariosNaSala(prev => 
              prev.filter(id => id !== usuarioId)
          );
          }
          break;
          
        case 'autenticacao':
          console.log('🔐 useChatWebSocket: Autenticação confirmada', message);
          // A entrada no chat será feita pelo useEffect quando ticketId estiver disponível
          break;
      }
    },
    onConnect: () => {
      console.log('🔌 useChatWebSocket: Conectado ao WebSocket');
    },
    onDisconnect: () => {
      console.log('🔌 useChatWebSocket: Desconectado do WebSocket');
      isInChat.current = false;
      hasInitialized.current = false;
    }
  });

  const entrarChat = useCallback(() => {
    console.log(`🚪 useChatWebSocket: Tentando entrar no chat - ticketId: ${ticketId}, isConnected: ${isConnected}, isInChat: ${isInChat.current}, hasInitialized: ${hasInitialized.current}`);
    
    if (ticketId && isConnected && !isInChat.current && !hasInitialized.current) {
      console.log(`🚪 useChatWebSocket: Entrando no chat do ticket ${ticketId}`);
      isInChat.current = true;
      hasInitialized.current = true;
      sendMessage({
        tipo: 'chat_entrar',
        ticket_id: ticketId
      });
    } else {
      console.log(`⚠️ useChatWebSocket: Não pode entrar no chat - ticketId: ${ticketId}, isConnected: ${isConnected}, isInChat: ${isInChat.current}, hasInitialized: ${hasInitialized.current}`);
    }
  }, [ticketId, isConnected, sendMessage]);

  const sairChat = useCallback(() => {
    if (ticketId && isConnected && isInChat.current) {
      console.log(`🚪 useChatWebSocket: Saindo do chat do ticket ${ticketId}`);
      isInChat.current = false;
      hasInitialized.current = false;
      sendMessage({
        tipo: 'chat_sair',
        ticket_id: ticketId
      });
    }
  }, [ticketId, isConnected, sendMessage]);

  const enviarMensagem = useCallback((conteudo: string) => {
    if (ticketId && isConnected) {
      console.log(`📤 useChatWebSocket: Enviando mensagem para ticket ${ticketId}`);
      
      // Limpar timeout de digitação se existir
      if (typingTimeouts.current.has(ticketId)) {
        clearTimeout(typingTimeouts.current.get(ticketId)!);
        typingTimeouts.current.delete(ticketId);
      }
      
      sendMessage({
        tipo: 'chat_mensagem',
        ticket_id: ticketId,
        conteudo
      });
    } else {
      console.warn(`⚠️ useChatWebSocket: Não pode enviar mensagem - ticketId: ${ticketId}, isConnected: ${isConnected}`);
    }
  }, [ticketId, isConnected, sendMessage]);

  const usuarioDigitando = useCallback((digitando: boolean) => {
    if (ticketId && isConnected) {
      // Limpar timeout anterior se existir
      if (typingTimeouts.current.has(ticketId)) {
        clearTimeout(typingTimeouts.current.get(ticketId)!);
      }

      if (digitando) {
        // Enviar sinal de que está digitando
        sendMessage({
          tipo: 'chat_digite',
          ticket_id: ticketId,
          digitando: true
        });

        // Configurar timeout para parar de digitar automaticamente após 3 segundos
        const timeout = setTimeout(() => {
          console.log(`⏰ Timeout de digitação para ticket ${ticketId}`);
          sendMessage({
            tipo: 'chat_digite',
            ticket_id: ticketId,
            digitando: false
          });
          typingTimeouts.current.delete(ticketId);
        }, 3000); // 3 segundos

        typingTimeouts.current.set(ticketId, timeout);
      } else {
        // Usuário parou de digitar manualmente
        sendMessage({
          tipo: 'chat_digite',
          ticket_id: ticketId,
          digitando: false
        });
        
        // Limpar timeout se existir
        if (typingTimeouts.current.has(ticketId)) {
          clearTimeout(typingTimeouts.current.get(ticketId)!);
          typingTimeouts.current.delete(ticketId);
        }
      }
    }
  }, [ticketId, isConnected, sendMessage]);

  // Entrar no chat automaticamente quando conectar ou quando o ticket mudar
  useEffect(() => {
    if (isConnected && ticketId && !hasInitialized.current) {
      console.log(`🚪 useChatWebSocket: Tentando entrar no chat do ticket ${ticketId}`);
      lastTicketId.current = ticketId;
      // Entrar no chat se já estiver autenticado
      entrarChat();
    }
  }, [isConnected, ticketId, entrarChat]);

  // Sair do chat quando o componente for desmontado
  useEffect(() => {
    return () => {
      console.log('🧹 useChatWebSocket: Cleanup ao desmontar');
      if (isInChat.current) {
        sairChat();
      }
    };
  }, [sairChat]);

  return {
    mensagens,
    usuariosDigitando,
    usuariosNaSala,
    enviarMensagem,
    usuarioDigitando,
    sairChat,
    isConnected
  };
}; 