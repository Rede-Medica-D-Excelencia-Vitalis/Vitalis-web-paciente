import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  CameraIcon, 
  MicIcon, 
  PhoneIcon, 
  MessageSquareIcon,
  SendIcon,
  XIcon,
  HomeIcon,
  CalendarIcon,
  CheckCircleIcon,
  WifiIcon,
  VolumeIcon,
  LightbulbIcon,
  AlertCircleIcon,
  LoaderIcon,
  XCircleIcon,
  ClockIcon,
  MaximizeIcon,
  MinimizeIcon,
  VideoIcon,
  UserIcon
} from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { consultaService, Consulta } from '../../services/consultation/consultaService';
import { getMinhasConsultas } from '../../services/consultation/consultationService';
import { useVideochamada } from '../../hooks/communication/useVideochamada';
import { useAuth } from '../../hooks/auth/useAuth';
import { websocketService, ChatMessage } from '../../services/communication/websocketService';
import { useFullscreen } from '../../contexts/fullscreen/FullscreenContext';

// Função utilitária para formatar data corretamente
const formatarData = (dataString: string): string => {
  // Se a data já está no formato YYYY-MM-DD, usar diretamente
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  
  // Se for uma data ISO, converter considerando fuso horário local
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
};

// Função para calcular tempo restante da tolerância
const calcularTempoRestante = (data: string, hora: string): string => {
  const agora = new Date();
  const dataHoraConsulta = new Date(`${data}T${hora}`);
  const tolerancia = new Date(dataHoraConsulta.getTime() + (10 * 60 * 1000)); // 10 minutos
  
  if (agora > tolerancia) {
    return 'Tolerância expirada';
  }
  
  const tempoRestante = tolerancia.getTime() - agora.getTime();
  const minutos = Math.floor(tempoRestante / (1000 * 60));
  const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);
  
  if (minutos > 0) {
    return `${minutos}m ${segundos}s restantes`;
  } else {
    return `${segundos}s restantes`;
  }
};

interface Message {
  id: string;
  sender: 'user' | 'doctor';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'image' | 'file';
    name: string;
    url: string;
  }>;
}

export const Teleconsulta = () => {
  // Componente renderiza normalmente
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setVideoCallFullscreen } = useFullscreen();
  
  // Estados básicos
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proximasConsultas, setProximasConsultas] = useState<Consulta[]>([]);
  const [consultaAtual, setConsultaAtual] = useState<Consulta | null>(null);
  const [consultasPassadas, setConsultasPassadas] = useState<Consulta[]>([]);
  const [salaAtiva, setSalaAtiva] = useState<any>(null);
  const [verificandoSala, setVerificandoSala] = useState(false);
  
  // Estados da videochamada
  const [isInCall, setIsInCall] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [videochamadaError, setVideochamadaError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const [mediaPermissionsStatus, setMediaPermissionsStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tempoRestante, setTempoRestante] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);

  // Hook de videochamada - usar currentRoomId ao invés de salaAtiva
  const {
    isConnected,
    isConnecting: isWebRTCConnecting,
    localStream: webRTCLocalStream,
    remoteStream,
    error: webRTCError,
    connectToRoom,
    disconnectFromRoom,
    toggleCamera,
    toggleMicrophone
  } = useVideochamada({
    roomId: currentRoomId || undefined,
    onParticipantJoined: (participant) => {
      console.log('Participante entrou:', participant);
      if (participant.userType === 'medico') {
        setIsInCall(true);
      }
    },
    onParticipantLeft: (participantId) => {
      console.log('Participante saiu:', participantId);
      setIsInCall(false);
    },
    onError: (error) => {
      console.error('Erro na videochamada:', error);
      setVideochamadaError(error);
    }
  });
  
  // Estados do chat
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [novaMensagem, setNovaMensagem] = useState<string>('');
  const [showChat, setShowChat] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  
  // Refs para vídeos
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  // Monitorar mudanças em currentRoomId
  useEffect(() => {
    console.log('🔍 useEffect - currentRoomId mudou:', currentRoomId);
  }, [currentRoomId]);
  
  // Conectar streams aos vídeos quando disponíveis
  useEffect(() => {
    if (localVideoRef.current && webRTCLocalStream) {
      console.log('🎥 Conectando webRTCLocalStream ao vídeo local');
      localVideoRef.current.srcObject = webRTCLocalStream;
    }
  }, [webRTCLocalStream]);
  
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log('🎥 Conectando remoteStream ao vídeo remoto');
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  
  // useEffect básico com tratamento de erro
  useEffect(() => {
    console.log('🔍 useEffect iniciado');
    
    // Limpar qualquer roomId residual de sessões anteriores
    // IMPORTANTE: Só carregar a sala quando o usuário clicar em "Entrar"
    setCurrentRoomId(null);
    setIsInCall(false);
    console.log('✅ Estados de videochamada limpos ao iniciar');
    
    // Verificar permissões de mídia ao carregar
    verificarPermissoesMidia();
    
    const fetchConsultas = async () => {
      try {
        console.log('🔍 Iniciando busca de consultas');
        setIsLoading(true);
        setError(null);
        
        const rawConsultas = await consultaService.getProximasConsultas();
        console.log('🔍 Consultas recebidas (raw):', rawConsultas);

        const flattenConsultas = (input: any): Consulta[] => {
          if (!Array.isArray(input)) {
            return [];
          }

          const result: Consulta[] = [];

          const walk = (nodes: any[]): void => {
            for (const node of nodes) {
              if (!node) continue;

              if (Array.isArray(node)) {
                walk(node);
                continue;
              }

              if (typeof node === 'object' && 'id' in node && 'status' in node) {
                result.push(node as Consulta);
                continue;
              }

              if (typeof node === 'object') {
                const values = Object.values(node).filter(Boolean);
                if (values.length > 0) {
                  walk(values);
                }
              }
            }
          };

          walk(input);
          return result;
        };

        const consultas = flattenConsultas(rawConsultas);
        console.log('🔍 Consultas normalizadas:', {
          total: consultas.length,
          ids: consultas.map(c => c.id)
        });
        
        // Filtrar apenas consultas agendadas que estão dentro do horário permitido
        const consultasAgendadas = consultas.filter(c => c.status === 'agendada');
        
        // Tolerância de 10 minutos para o paciente entrar na consulta
        const TOLERANCIA_MINUTOS = 10;
        const agora = new Date();
        
        // Consultas que podem ser acessadas (dentro da tolerância) ou que ainda vão acontecer
        const consultasDisponiveis = consultasAgendadas.filter(c => {
          const dataHoraConsulta = new Date(`${c.date}T${c.time}`);
          const tolerancia = new Date(dataHoraConsulta.getTime() + (TOLERANCIA_MINUTOS * 60 * 1000));
          
          // Só mostrar consultas que:
          // 1. Ainda estão dentro da tolerância OU
          // 2. São futuras (a qualquer momento)
          const umaHoraAntes = new Date(dataHoraConsulta.getTime() - (60 * 60 * 1000));
          const dentroTolerancia = (tolerancia >= agora) || (agora >= umaHoraAntes && agora <= dataHoraConsulta);
          const futura = dataHoraConsulta > agora;
          
          console.log(`🔍 Consulta ${c.id} - ${c.time}:`, {
            horarioConsulta: dataHoraConsulta.toLocaleTimeString(),
            agora: agora.toLocaleTimeString(),
            tolerancia: tolerancia.toLocaleTimeString(),
            dentroTolerancia,
            futura
          });
          
          return dentroTolerancia || futura;
        });
        
        // Verificar quais consultas têm sala ativa (médico já iniciou)
        const salasPorConsulta: Record<number, any> = {};
        
        for (const consulta of consultasDisponiveis) {
          try {
            const sala = await consultaService.verificarSalaAtiva(consulta.id);
            if (sala) {
              salasPorConsulta[consulta.id] = sala;
            }
          } catch (error) {
            console.log(`Consulta ${consulta.id} não tem sala ativa`);
          }
        }

        setProximasConsultas(consultasDisponiveis);
        
        // Buscar consultas concluídas/realizadas para o histórico
        try {
          const todasConsultas = await getMinhasConsultas();
          const consultasConcluidas = todasConsultas.filter(
            c => c.status === 'concluída' || c.status === 'realizada' || c.status === 'finalizada'
          );
          
          // Ordenar do mais recente para o mais antigo
          const consultasOrdenadas = consultasConcluidas.sort((a, b) => {
            try {
              // Criar objetos Date para comparação
              const dataHoraA = new Date(`${a.data}T${a.hora}`);
              const dataHoraB = new Date(`${b.data}T${b.hora}`);
              
              // Ordenar do mais recente para o mais antigo (decrescente)
              return dataHoraB.getTime() - dataHoraA.getTime();
            } catch (error) {
              console.warn('Erro ao ordenar consultas:', error);
              return 0;
            }
          });
          
          setConsultasPassadas(consultasOrdenadas);
          console.log('📋 Consultas concluídas carregadas e ordenadas:', consultasOrdenadas.length);
          if (consultasOrdenadas.length > 0) {
            console.log('📅 Primeira consulta (mais recente):', consultasOrdenadas[0]?.data, consultasOrdenadas[0]?.hora);
            console.log('📅 Última consulta (mais antiga):', consultasOrdenadas[consultasOrdenadas.length - 1]?.data, consultasOrdenadas[consultasOrdenadas.length - 1]?.hora);
          }
        } catch (error) {
          console.error('Erro ao buscar consultas concluídas:', error);
          setConsultasPassadas([]);
        }

        // Garantir que sempre exista uma consulta atual selecionada
        let consultaSelecionada: Consulta | null = null;

        // 1. Priorizar a já selecionada, se ainda estiver disponível
        if (consultaAtual && consultasDisponiveis.some(c => c.id === consultaAtual.id)) {
          consultaSelecionada = consultasDisponiveis.find(c => c.id === consultaAtual.id) || null;
        }

        // 2. Senão, priorizar alguma com sala ativa
        if (!consultaSelecionada) {
          consultaSelecionada = consultasDisponiveis.find(c => salasPorConsulta[c.id]) || null;
        }

        // 3. Senão, pegar a primeira disponível
        if (!consultaSelecionada && consultasDisponiveis.length > 0) {
          consultaSelecionada = consultasDisponiveis[0];
        }

        setConsultaAtual(consultaSelecionada || null);
        setSalaAtiva(consultaSelecionada ? salasPorConsulta[consultaSelecionada.id] || null : null);
        
      } catch (err) {
        console.error('🔍 Erro ao buscar consultas:', err);
        setError('Erro ao carregar consultas');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchConsultas();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Quando sala ativa for detectada, NÃO entrar automaticamente
  // O usuário deve clicar no botão "Entrar na Consulta"
  useEffect(() => {
    if (salaAtiva && !currentRoomId) {
      console.log('🔍 Sala ativa detectada:', salaAtiva.roomId);
      console.log('⏳ Aguardando usuário clicar em "Entrar na Consulta"');
    }
  }, [salaAtiva, currentRoomId]);

  // Verificar sala ativa periodicamente
  useEffect(() => {
    if (!consultaAtual) return;

    const verificarSala = async () => {
      await verificarSalaAtiva(consultaAtual.id);
    };

    // Verificar imediatamente
    verificarSala();

    // Verificar a cada 30 segundos
    const interval = setInterval(verificarSala, 30000);

    return () => clearInterval(interval);
  }, [consultaAtual]);

  // Verificar se a consulta atual ainda está dentro da tolerância
  useEffect(() => {
    if (!consultaAtual) return;

    const verificarTolerancia = () => {
      const agora = new Date();
      const dataHoraConsulta = new Date(`${consultaAtual.date}T${consultaAtual.time}`);
      const tolerancia = new Date(dataHoraConsulta.getTime() + (10 * 60 * 1000)); // 10 minutos
      
      if (agora > tolerancia) {
        // Consulta passou da tolerância, recarregar consultas
        window.location.reload();
      }
    };

    const atualizarTempoRestante = () => {
      if (consultaAtual) {
        setTempoRestante(calcularTempoRestante(consultaAtual.date, consultaAtual.time));
      }
    };

    // Verificar tolerância a cada minuto
    const intervalTolerancia = setInterval(verificarTolerancia, 60000);
    
    // Atualizar tempo restante a cada segundo
    const intervalTempo = setInterval(atualizarTempoRestante, 1000);
    
    // Verificar imediatamente
    verificarTolerancia();
    atualizarTempoRestante();

    return () => {
      clearInterval(intervalTolerancia);
      clearInterval(intervalTempo);
    };
  }, [consultaAtual]);

  // NÃO conectar websocketService quando em videochamada
  // O hook useVideochamada já cuida do WebSocket
  // websocketService é apenas para chat fora da videochamada
  useEffect(() => {
    // Comentado: websocketService conflita com useVideochamada
    // if (isInCall && consultaAtual && user) {
    //   conectarWebSocket();
    // }
    
    // return () => {
    //   websocketService.disconnect();
    // };
  }, [isInCall, consultaAtual, user]);

  // Auto-scroll do chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens]);

  const conectarWebSocket = () => {
    if (!consultaAtual || !user) {
      console.log('🔍 WebSocket - Dados faltando:', { consultaAtual: !!consultaAtual, user: !!user });
      return;
    }

    console.log('🔍 WebSocket - Conectando com dados:', {
      consultaId: consultaAtual.id,
      userId: user.id,
      userType: 'paciente'
    });

    websocketService.connect(
      consultaAtual.id,
      Number(user.id),
      'paciente',
      {
        onMessage: (message: ChatMessage) => {
          console.log('Mensagem recebida:', message);
          setMensagens(prev => [...prev, message]);
        },
        onUserJoined: (userId, userType) => {
          console.log(`${userType} ${userId} entrou na consulta`);
        },
        onUserLeft: (userId, userType) => {
          console.log(`${userType} ${userId} saiu da consulta`);
          if (userType === 'medico') {
            setIsInCall(false);
          }
        },
        onConnectionChange: (connected) => {
          setWsConnected(connected);
          console.log('WebSocket conectado:', connected);
        },
        onError: (error) => {
          console.error('Erro WebSocket:', error);
          setWsConnected(false);
        }
      }
    );
  };

  const verificarSalaAtiva = async (consultaId: number) => {
    try {
      setVerificandoSala(true);
      const sala = await consultaService.verificarSalaAtiva(consultaId);
      setSalaAtiva(sala);
    } catch (error) {
      console.error('Erro ao verificar sala ativa:', error);
    } finally {
      setVerificandoSala(false);
    }
  };

  // Verificar status das permissões de mídia
  const verificarPermissoesMidia = async () => {
    try {
      if (navigator.permissions) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        
        // Se qualquer uma das permissões foi negada, marcar como negada
        if (cameraPermission.state === 'denied' || microphonePermission.state === 'denied') {
          setMediaPermissionsStatus('denied');
        } else if (cameraPermission.state === 'granted' && microphonePermission.state === 'granted') {
          setMediaPermissionsStatus('granted');
        } else {
          setMediaPermissionsStatus('prompt');
        }
      } else {
        // Fallback para navegadores que não suportam navigator.permissions
        setMediaPermissionsStatus('unknown');
      }
    } catch (error) {
      console.log('🔍 Não foi possível verificar permissões:', error);
      setMediaPermissionsStatus('unknown');
    }
  };

  const handleEntrarConsulta = async () => {
    if (!consultaAtual || !salaAtiva) {
      setError('Nenhuma consulta ou sala encontrada');
      return;
    }

    try {
      console.log('🚀 Paciente: Abrindo sala de videochamada em nova janela');
      console.log('🔍 Sala ativa:', salaAtiva);
      console.log('🔍 Consulta atual:', consultaAtual);
      
      // Abrir videochamada em nova janela/guia
      const params = new URLSearchParams({
        roomId: salaAtiva.roomId,
        consultaId: consultaAtual.id.toString(),
        doctorName: consultaAtual.doctor?.name || 'Médico'
      });
      
      const url = `/videochamada-room?${params.toString()}`;
      
      // Abrir em nova janela com tamanho adequado
      const width = 1280;
      const height = 720;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`;
      
      const videochamadaWindow = window.open(url, 'VideochamadaVitalis', windowFeatures);
      
      if (!videochamadaWindow) {
        setVideochamadaError('Pop-up bloqueado! Por favor, permita pop-ups para este site.');
      } else {
        console.log('✅ Janela de videochamada aberta com sucesso');
        videochamadaWindow.focus();
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao abrir videochamada:', error);
      setVideochamadaError('Erro ao abrir janela de videochamada.');
    }
  };

  const handleEndCall = async () => {
    try {
      // Desconectar do WebRTC
      await disconnectFromRoom();
      
      // Parar streams de mídia local
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }

      // Sair da sala
      if (currentRoomId) {
        await consultaService.sairSalaVideochamada(currentRoomId).catch(console.error);
      }

      // Desconectar WebSocket
      websocketService.disconnect();

      // Resetar estados
      setIsInCall(false);
      setCurrentRoomId(null);
      setVideochamadaError(null);
      setIsCameraOn(true);
      setIsMicrophoneOn(true);
      setShowChat(false);
      setMensagens([]);
      setNovaMensagem('');
      setIsFullscreen(false);
      setVideoCallFullscreen(false);
    } catch (error) {
      console.error('Erro ao encerrar chamada:', error);
    }
  };
  
  // Sincronizar controles de câmera e microfone com o estado
  const handleToggleCamera = () => {
    toggleCamera();
    setIsCameraOn(!isCameraOn);
  };
  
  const handleToggleMicrophone = () => {
    toggleMicrophone();
    setIsMicrophoneOn(!isMicrophoneOn);
  };


  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !consultaAtual) return;
    
    try {
      // Enviar via WebSocket
      websocketService.sendChatMessage(novaMensagem);
      
      // Adicionar mensagem localmente
      const novaMsg: ChatMessage = {
        id: Date.now().toString(),
        consultaId: consultaAtual.id,
        senderId: Number(user?.id) || 0,
        senderType: 'paciente',
        content: novaMensagem,
        timestamp: new Date().toISOString(),
        type: 'texto'
      };
      
      setMensagens(prev => [...prev, novaMsg]);
      setNovaMensagem('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Preparação para consulta
  const preparationSteps = [
    {
      icon: <WifiIcon className="w-5 h-5 text-blue-600" />,
      title: "Conexão Estável",
      description: "Certifique-se de ter uma conexão de internet estável"
    },
    {
      icon: <VolumeIcon className="w-5 h-5 text-blue-600" />,
      title: "Ambiente Silencioso",
      description: "Escolha um local tranquilo para a consulta"
    },
    {
      icon: <CameraIcon className="w-5 h-5 text-blue-600" />,
      title: "Boa Iluminação",
      description: "Posicione-se em um local bem iluminado"
    },
    {
      icon: <LightbulbIcon className="w-5 h-5 text-blue-600" />,
      title: "Prepare suas Dúvidas",
      description: "Anote suas perguntas e sintomas"
    }
  ];

  const guidelines = [
    "Teste sua câmera e microfone antes da consulta",
    "Tenha seus documentos médicos em mãos",
    "Mantenha-se disponível 10 minutos antes do horário",
    "Em caso de problemas técnicos, tente recarregar a página"
  ];

  // Tela de videochamada - Design moderno igual ao profissional
  if (isInCall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        {/* Header da consulta - Oculto em tela cheia */}
        {!isFullscreen && (
          <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Informações da consulta */}
                <div className="flex items-center space-x-2 text-white">
                  <CalendarIcon className="h-5 w-5 text-blue-300" />
                  <span className="font-medium">
                    {consultaAtual ? formatarData(consultaAtual.date) : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <ClockIcon className="h-5 w-5 text-blue-300" />
                  <span className="font-medium">{consultaAtual?.time}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Status da conexão WebRTC */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-black/30 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : isWebRTCConnecting ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                  <span className="text-white text-sm font-medium">
                    {isWebRTCConnecting ? 'Conectando...' : isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                
                {/* Botão voltar */}
                <button
                  onClick={() => navigate('/')}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <HomeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Informações do médico */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <UserIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{consultaAtual?.doctor?.name}</h2>
                  <p className="text-blue-200 text-sm">{consultaAtual?.doctor?.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20 font-medium">
                  {consultaAtual?.type === 'consulta' ? 'Consulta' : consultaAtual?.type}
                </span>
                <span className={`px-4 py-1.5 text-white text-sm rounded-full font-medium ${
                  isConnected ? 'bg-green-600' : isWebRTCConnecting ? 'bg-yellow-600' : 'bg-gray-600'
                }`}>
                  {isWebRTCConnecting ? 'Conectando...' : isConnected ? 'Em Andamento' : 'Aguardando'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Área principal da videochamada */}
        <div className={`flex ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-160px)]'}`}>
          {/* Área de vídeo */}
          <div className={`flex-1 relative ${showChat && !isFullscreen ? 'mr-80' : ''}`}>
            {/* Vídeo principal - Fundo com gradiente */}
            <div className="relative w-full h-full bg-black/20">
              {/* Vídeo do médico (principal) */}
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedMetadata={(e) => {
                    console.log('🎥 Vídeo remoto carregado');
                    (e.target as HTMLVideoElement).play();
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 rounded-full bg-blue-500/20 border-4 border-blue-400 flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <UserIcon className="h-16 w-16 text-blue-300" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{consultaAtual?.doctor?.name}</h2>
                    <p className="text-blue-200 text-lg mb-4">{consultaAtual?.doctor?.specialty}</p>
                    <div className="flex items-center justify-center gap-2 text-blue-300">
                      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : isWebRTCConnecting ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`}></div>
                      <span className="text-sm font-medium">
                        {isWebRTCConnecting ? 'Conectando...' : isConnected ? 'Aguardando vídeo...' : 'Aguardando médico...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Vídeo do paciente (picture-in-picture) - Estilo profissional */}
              <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-800 rounded-xl border-2 border-blue-400 overflow-hidden shadow-2xl">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
                />
                {!isCameraOn && (
                  <div className="w-full h-full flex items-center justify-center text-blue-400">
                    <UserIcon className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  Você
                </div>
              </div>
              
              {/* Indicadores de status - Design moderno */}
              <div className="absolute top-6 left-6 flex items-center gap-3">
                {!isFullscreen && (
                  <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-white text-sm font-medium">
                      {isConnected ? 'Ao vivo' : 'Aguardando'}
                    </span>
                  </div>
                )}
                
                {!isCameraOn && (
                  <div className="px-4 py-2 bg-red-600/90 backdrop-blur-sm text-white text-sm rounded-full flex items-center space-x-2 shadow-lg">
                    <VideoIcon className="h-4 w-4" />
                    <span className="font-medium">Câmera Desligada</span>
                  </div>
                )}
                
                {!isMicrophoneOn && (
                  <div className="px-4 py-2 bg-red-600/90 backdrop-blur-sm text-white text-sm rounded-full flex items-center space-x-2 shadow-lg">
                    <MicIcon className="h-4 w-4" />
                    <span className="font-medium">Microfone Desligado</span>
                  </div>
                )}
              </div>

              {/* Informações essenciais em tela cheia */}
              {isFullscreen && (
                <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{consultaAtual?.doctor?.name}</h3>
                      <p className="text-xs text-blue-200">
                        {consultaAtual ? formatarData(consultaAtual.date) : ''} às {consultaAtual?.time}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Controles da videochamada - Design profissional moderno */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md rounded-full px-6 py-4 shadow-2xl border border-white/10">
                {/* Controle de microfone */}
                <button
                  onClick={handleToggleMicrophone}
                  className={`p-4 rounded-full transition-all shadow-lg transform hover:scale-110 ${
                    isMicrophoneOn 
                      ? 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30' 
                      : 'bg-red-600 text-white hover:bg-red-700 border-2 border-red-500'
                  }`}
                  title={isMicrophoneOn ? 'Desligar Microfone' : 'Ligar Microfone'}
                >
                  {isMicrophoneOn ? <MicIcon className="h-6 w-6" /> : <MicIcon className="h-6 w-6" />}
                </button>
                
                {/* Controle de câmera */}
                <button
                  onClick={handleToggleCamera}
                  className={`p-4 rounded-full transition-all shadow-lg transform hover:scale-110 ${
                    isCameraOn 
                      ? 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30' 
                      : 'bg-red-600 text-white hover:bg-red-700 border-2 border-red-500'
                  }`}
                  title={isCameraOn ? 'Desligar Câmera' : 'Ligar Câmera'}
                >
                  {isCameraOn ? <CameraIcon className="h-6 w-6" /> : <CameraIcon className="h-6 w-6" />}
                </button>
                
                {/* Chat */}
                {!isFullscreen && (
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`p-4 rounded-full transition-all shadow-lg transform hover:scale-110 ${
                      showChat 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-500' 
                        : 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30'
                    }`}
                    title={showChat ? 'Fechar Chat' : 'Abrir Chat'}
                  >
                    <MessageSquareIcon className="h-6 w-6" />
                  </button>
                )}
                
                {/* Tela cheia */}
                <button
                  onClick={() => {
                    const newFullscreenState = !isFullscreen;
                    setIsFullscreen(newFullscreenState);
                    setVideoCallFullscreen(newFullscreenState);
                  }}
                  className="p-4 rounded-full bg-white/20 text-white hover:bg-white/30 border-2 border-white/30 transition-all shadow-lg transform hover:scale-110"
                  title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
                >
                  {isFullscreen ? <MinimizeIcon className="h-6 w-6" /> : <MaximizeIcon className="h-6 w-6" />}
                </button>
                
                {/* Botão de encerrar - Destaque */}
                <div className="w-px h-8 bg-white/20 mx-2"></div>
                <button
                  onClick={handleEndCall}
                  className="p-4 px-6 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg transform hover:scale-110 border-2 border-red-500 flex items-center gap-2"
                  title="Encerrar Consulta"
                >
                  <PhoneIcon className="h-6 w-6 rotate-[135deg]" />
                  <span className="font-semibold">Encerrar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat lateral - Design moderno */}
          {showChat && !isFullscreen && (
            <div className="w-80 bg-gray-900/90 backdrop-blur-sm border-l border-white/10 flex flex-col">
              {/* Header do chat */}
              <div className="p-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold flex items-center space-x-2">
                    <MessageSquareIcon className="h-5 w-5 text-blue-400" />
                    <span>Chat</span>
                  </h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <XIcon className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-blue-200 text-xs mt-1">{consultaAtual?.doctor?.name}</p>
              </div>
              
              {/* Mensagens - Scroll customizado */}
              <div 
                ref={chatRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(59, 130, 246, 0.5) transparent'
                }}
              >
                {mensagens.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <MessageSquareIcon className="h-14 w-14 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Nenhuma mensagem</p>
                    <p className="text-sm opacity-70 mt-1">Comece a conversa</p>
                  </div>
                ) : (
                  mensagens.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={`flex ${mensagem.senderType === 'paciente' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-lg ${
                          mensagem.senderType === 'paciente'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-800 text-white border border-white/10 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{mensagem.content}</p>
                        <p className="text-xs opacity-60 mt-1.5">
                          {new Date(mensagem.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Input de mensagem - Design moderno */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && enviarMensagem()}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                    disabled={!wsConnected}
                  />
                  <button
                    onClick={enviarMensagem}
                    disabled={!novaMensagem.trim() || !wsConnected}
                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg disabled:hover:bg-blue-600"
                    title="Enviar mensagem"
                  >
                    <SendIcon className="h-5 w-5" />
                  </button>
                </div>
                {!wsConnected && (
                  <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                    <AlertCircleIcon className="h-3 w-3" />
                    Chat desconectado
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Retorno completo da tela principal
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Teleconsulta</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoaderIcon className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando consultas...</span>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircleIcon className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Erro ao carregar consultas</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Próxima Consulta */}
            {consultaAtual ? (
              <Card className="lg:col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle>Próxima Consulta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                    src={consultaAtual?.doctor?.avatar || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"}
                      alt="Doctor profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                    <h3 className="font-semibold">{consultaAtual?.doctor?.name}</h3>
                    <p className="text-blue-100">{consultaAtual?.doctor?.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-blue-100">Data</p>
                      <p className="font-semibold">
                        {formatarData(consultaAtual.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-100">Horário</p>
                      <p className="font-semibold">{consultaAtual.time}</p>
                    </div>
                  </div>
                  
                  {/* Tempo restante da tolerância */}
                  {tempoRestante && (
                    <div className="text-center">
                      <p className="text-sm text-blue-100">Tempo Restante</p>
                      <p className={`font-semibold text-lg ${
                        tempoRestante.includes('Tolerância expirada') 
                          ? 'text-red-200' 
                          : 'text-yellow-200'
                      }`}>
                        {tempoRestante}
                      </p>
                    </div>
                  )}
                
                  {/* Aviso de permissões negadas */}
                  {mediaPermissionsStatus === 'denied' && (
                    <div className="mb-3 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircleIcon className="w-5 h-5 text-red-300" />
                        <span className="text-red-200 font-medium">Permissões Negadas</span>
                      </div>
                      <p className="text-red-100 text-sm mb-2">
                        As permissões de câmera e microfone foram negadas. Para participar da consulta, você precisa permitir o acesso.
                      </p>
                      <Button
                        onClick={verificarPermissoesMidia}
                        className="w-full bg-red-600 text-white hover:bg-red-700 text-sm"
                      >
                        <CameraIcon className="w-4 h-4 mr-2" />
                        Verificar Permissões
                      </Button>
                    </div>
                  )}

                  {salaAtiva ? (
                    <Button
                      onClick={handleEntrarConsulta}
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                      disabled={isLoading || mediaPermissionsStatus === 'denied'}
                    >
                      {isLoading ? (
                        <>
                          <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                          Conectando...
                        </>
                      ) : isRequestingPermissions ? (
                        <>
                          <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                          Solicitando Permissões...
                        </>
                      ) : mediaPermissionsStatus === 'denied' ? (
                        <>
                          <XCircleIcon className="w-4 h-4 mr-2" />
                          Permissões Necessárias
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Entrar na Consulta
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-600 px-4 py-3 rounded-lg text-center border border-gray-200">
                      <div className="flex items-center justify-center gap-2">
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                        <span>Aguardando médico iniciar...</span>
                      </div>
                      <p className="text-xs mt-1 opacity-70">
                        A consulta aparecerá quando o médico estiver online
                      </p>
                    </div>
                  )}
                  
                  {/* Botão de retry quando há erro */}
                  {videochamadaError && (
                    <div className="mt-2 space-y-2">
                      <Button
                        onClick={() => {
                          setVideochamadaError(null);
                          if (consultaAtual) {
                            verificarSalaAtiva(consultaAtual.id);
                          }
                        }}
                        className="w-full bg-orange-600 text-white hover:bg-orange-700"
                        disabled={isLoading}
                      >
                        <LoaderIcon className="w-4 h-4 mr-2" />
                        Tentar Novamente
                      </Button>
                      
                      {/* Botão específico para solicitar permissões de câmera */}
                      {videochamadaError.includes('permissão') && (
                        <Button
                          onClick={async () => {
                            setVideochamadaError(null);
                            setIsRequestingPermissions(true);
                            
                            try {
                              // Solicitar permissões novamente
                              const mediaStream = await navigator.mediaDevices.getUserMedia({
                                video: true,
                                audio: true
                              });
                              
                              console.log('🔍 Permissões concedidas:', {
                                video: mediaStream.getVideoTracks().length > 0,
                                audio: mediaStream.getAudioTracks().length > 0
                              });
                              
                              // Conectar os streams aos elementos de vídeo
                              if (localVideoRef.current && mediaStream) {
                                localVideoRef.current.srcObject = mediaStream;
                                setLocalStream(mediaStream);
                              }
                              
                              // Tentar entrar na consulta novamente
                              if (consultaAtual) {
                                await handleEntrarConsulta();
                              }
                              
                            } catch (permissionError) {
                              console.error('🔍 Erro ao solicitar permissões:', permissionError);
                              
                              if (permissionError instanceof DOMException) {
                                if (permissionError.name === 'NotAllowedError') {
                                  setVideochamadaError('Permissões de câmera e microfone negadas. Por favor, permita o acesso nas configurações do navegador e tente novamente.');
                                } else if (permissionError.name === 'NotFoundError') {
                                  setVideochamadaError('Câmera ou microfone não encontrados. Verifique se os dispositivos estão conectados.');
                                } else if (permissionError.name === 'NotReadableError') {
                                  setVideochamadaError('Câmera ou microfone estão sendo usados por outro aplicativo. Feche outros programas e tente novamente.');
                                } else {
                                  setVideochamadaError(`Erro de permissão: ${permissionError.message}`);
                                }
                              } else {
                                setVideochamadaError('Erro inesperado ao solicitar permissões de mídia.');
                              }
                            } finally {
                              setIsRequestingPermissions(false);
                            }
                          }}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700"
                          disabled={isLoading || isRequestingPermissions}
                        >
                          <CameraIcon className="w-4 h-4 mr-2" />
                          {isRequestingPermissions ? 'Solicitando Permissões...' : 'Permitir Câmera e Microfone'}
                        </Button>
                      )}
                    </div>
                  )}
                
                                  {/* Status da sala */}
                  {salaAtiva ? (
                    <div className="text-center text-green-100 text-sm">
                      ✅ Médico já iniciou a consulta
                    </div>
                  ) : (
                    <div className="text-center text-blue-100 text-sm">
                      ⏳ Aguardando o médico iniciar a consulta
                      <br />
                      <span className="text-xs opacity-80">
                        Você tem 10 minutos de tolerância após o horário
                      </span>
                    </div>
                  )}
                  
                  {/* Área de debug para erros */}
                  {videochamadaError && (
                    <div className={`mt-3 p-3 rounded-lg border ${
                      videochamadaError.includes('Usuário já está na sala') 
                        ? 'bg-blue-900 bg-opacity-50 border-blue-700' 
                        : 'bg-red-900 bg-opacity-50 border-red-700'
                    }`}>
                      <div className={`text-sm font-medium mb-2 ${
                        videochamadaError.includes('Usuário já está na sala') 
                          ? 'text-blue-200' 
                          : 'text-red-200'
                      }`}>
                        {videochamadaError.includes('Usuário já está na sala') 
                          ? 'ℹ️ Informação' 
                          : '⚠️ Erro de Conexão'
                        }
                      </div>
                      <div className={`text-xs mb-2 ${
                        videochamadaError.includes('Usuário já está na sala') 
                          ? 'text-blue-100' 
                          : 'text-red-100'
                      }`}>
                        {videochamadaError}
                      </div>
                      
                      {videochamadaError.includes('Usuário já está na sala') ? (
                        <div className="text-blue-200 text-xs opacity-80">
                          <strong>O que isso significa:</strong>
                          <br />• Você já está conectado à sala de videochamada
                          <br />• A consulta deve aparecer automaticamente
                          <br />• Se não aparecer, tente recarregar a página
                          <br />• Este não é um erro, apenas uma informação
                        </div>
                      ) : videochamadaError.includes('permissão') ? (
                        <div className="text-red-200 text-xs opacity-80">
                          <strong>Como resolver problemas de permissão:</strong>
                          <br />• <strong>Chrome/Edge:</strong> Clique no ícone de câmera na barra de endereços → Permitir
                          <br />• <strong>Firefox:</strong> Clique no ícone de câmera na barra de endereços → Permitir
                          <br />• <strong>Safari:</strong> Safari → Preferências → Sites → Câmera → Permitir
                          <br />• <strong>Geral:</strong> Certifique-se de que nenhum outro programa está usando a câmera
                          <br />• Clique no botão "Permitir Câmera e Microfone" acima para tentar novamente
                        </div>
                      ) : (
                        <div className="text-red-200 text-xs opacity-80">
                          <strong>Dicas:</strong>
                          <br />• Verifique sua conexão com a internet
                          <br />• Tente recarregar a página
                          <br />• Aguarde alguns instantes e tente novamente
                          <br />• Se o problema persistir, entre em contato com o suporte
                        </div>
                      )}
                      
                      {/* Botão para mostrar debug técnico */}
                      <button
                        onClick={() => setShowDebug(!showDebug)}
                        className="mt-2 text-xs text-blue-300 hover:text-blue-200 underline"
                      >
                        {showDebug ? 'Ocultar' : 'Mostrar'} informações técnicas
                      </button>
                      
                      {/* Informações técnicas de debug */}
                      {showDebug && (
                        <div className="mt-3 p-2 bg-black bg-opacity-30 rounded border border-gray-600">
                          <div className="text-gray-300 text-xs">
                            <strong>Debug Técnico:</strong>
                            <br />• Sala ID: {salaAtiva?.roomId || 'N/A'}
                            <br />• Consulta ID: {consultaAtual?.id || 'N/A'}
                            <br />• Status da Sala: {salaAtiva?.status || 'N/A'}
                            <br />• Usuário ID: {user?.id || 'N/A'}
                            <br />• Timestamp: {new Date().toISOString()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="lg:col-span-1 bg-gray-50">
                <CardHeader>
                  <CardTitle>Nenhuma Consulta Disponível</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Você não tem consultas disponíveis para teleconsulta no momento.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm">
                      <strong>Para acessar uma teleconsulta:</strong>
                      <br />• Agende uma consulta primeiro
                      <br />• Aguarde o médico iniciar a sala
                      <br />• A consulta aparecerá aqui quando disponível
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/agendamento')}
                    className="w-full"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Preparação */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Prepare-se para sua Consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preparationSteps.map((step, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        {step.icon}
                        <h3 className="font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Recomendações Importantes</h3>
                  <ul className="space-y-2">
                    {guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

        </div>
      )}
    </div>
  );
};