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
  MinimizeIcon
} from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { consultaService, Consulta } from '../../services/consultation/consultaService';
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
  console.log('🔍 Renderizando Teleconsulta - versão completa');
  
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tempoRestante, setTempoRestante] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);
  
  // Estados do chat
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [novaMensagem, setNovaMensagem] = useState<string>('');
  const [showChat, setShowChat] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  
  // Refs para vídeos
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  // useEffect básico com tratamento de erro
  useEffect(() => {
    console.log('🔍 useEffect iniciado');
    
    const fetchConsultas = async () => {
      try {
        console.log('🔍 Iniciando busca de consultas');
        setIsLoading(true);
        setError(null);
        
        const consultas = await consultaService.getProximasConsultas();
        console.log('🔍 Consultas recebidas:', consultas);
        
        // Separar consultas por status temporal com tolerância de 10 minutos
        const consultasAgendadas = consultas.filter(c => c.status === 'agendada');
        
        // Tolerância de 10 minutos para o paciente entrar na consulta
        const TOLERANCIA_MINUTOS = 10;
        
        const consultasFuturas = consultasAgendadas.filter(c => {
          const agora = new Date();
          const dataHoraConsulta = new Date(`${c.date}T${c.time}`);
          const tolerancia = new Date(dataHoraConsulta.getTime() + (TOLERANCIA_MINUTOS * 60 * 1000));
          return tolerancia >= agora;
        });
        
        const consultasPassadasTemp = consultasAgendadas.filter(c => {
          const agora = new Date();
          const dataHoraConsulta = new Date(`${c.date}T${c.time}`);
          const tolerancia = new Date(dataHoraConsulta.getTime() + (TOLERANCIA_MINUTOS * 60 * 1000));
          return tolerancia < agora;
        });
        
        setProximasConsultas(consultasFuturas);
        setConsultasPassadas(consultasPassadasTemp);
        setConsultaAtual(consultasFuturas[0] || null);
        
        // Se há consulta atual, verificar se há sala ativa
        if (consultasFuturas[0]) {
          await verificarSalaAtiva(consultasFuturas[0].id);
        }
        
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

  // Verificar se o usuário já está em uma videochamada ativa
  useEffect(() => {
    if (!user || !consultaAtual || !salaAtiva) return;

    const verificarUsuarioNaSala = async () => {
      try {
        console.log('🔍 Verificando se usuário já está na sala ativa...');
        const infoSala = await consultaService.getInfoSala(salaAtiva.roomId);
        
        // Verificar se o usuário já está na lista de participantes
        const usuarioJaParticipando = infoSala.participantes?.some(
          (p: any) => p.userId === user.id && p.userType === 'paciente'
        );
        
        if (usuarioJaParticipando) {
          console.log('🔍 Usuário já está na sala, redirecionando para videochamada...');
          setCurrentRoomId(salaAtiva.roomId);
          setIsInCall(true);
        }
      } catch (error) {
        console.log('🔍 Não foi possível verificar se usuário está na sala:', error);
      }
    };

    // Verificar após um pequeno delay para garantir que tudo foi carregado
    const timeoutId = setTimeout(verificarUsuarioNaSala, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [user, consultaAtual, salaAtiva]);

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

  // Conectar WebSocket quando entrar na consulta
  useEffect(() => {
    if (isInCall && consultaAtual && user) {
      conectarWebSocket();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [isInCall, consultaAtual, user]);

  // Auto-scroll do chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens]);

  const conectarWebSocket = () => {
    if (!consultaAtual || !user) return;

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
        }
      }
    );
  };

  const verificarSalaAtiva = async (consultaId: number) => {
    try {
      console.log('🔍 Verificando sala ativa para consulta:', consultaId);
      setVerificandoSala(true);
      const sala = await consultaService.verificarSalaAtiva(consultaId);
      console.log('🔍 Sala encontrada:', sala);
      setSalaAtiva(sala);
    } catch (error) {
      console.error('Erro ao verificar sala ativa:', error);
    } finally {
      setVerificandoSala(false);
    }
  };

  const handleEntrarConsulta = async () => {
    if (!consultaAtual) {
      setError('Nenhuma consulta encontrada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsConnecting(true);
      setVideochamadaError(null);
      setIsRequestingPermissions(true);

      // 1. Solicitar permissões de câmera e microfone
      console.log('🔍 Solicitando permissões de mídia...');
      
      let mediaStream: MediaStream | null = null;
      
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
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
        
      } catch (permissionError) {
        console.error('🔍 Erro ao solicitar permissões:', permissionError);
        
        if (permissionError instanceof DOMException) {
          if (permissionError.name === 'NotAllowedError') {
            setVideochamadaError('Permissões de câmera e microfone negadas. Por favor, permita o acesso e tente novamente.');
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
        
        setIsRequestingPermissions(false);
        setIsConnecting(false);
        setIsLoading(false);
        return;
      }

      setIsRequestingPermissions(false);

      // 2. Verificar se o usuário já está na sala
      if (salaAtiva) {
        try {
          console.log('🔍 Verificando se usuário já está na sala:', salaAtiva.roomId);
          
          // Tentar obter informações da sala para verificar se já está participando
          try {
            const infoSala = await consultaService.getInfoSala(salaAtiva.roomId);
            console.log('🔍 Informações da sala:', infoSala);
            
            // Verificar se o usuário já está na lista de participantes
            const usuarioJaParticipando = infoSala.participantes?.some(
              (p: any) => p.userId === user?.id && p.userType === 'paciente'
            );
            
            if (usuarioJaParticipando) {
              console.log('🔍 Usuário já está na sala, redirecionando para videochamada...');
              setCurrentRoomId(salaAtiva.roomId);
              setIsInCall(true);
              setVideochamadaError(null);
              return;
            }
          } catch (infoError) {
            console.log('🔍 Não foi possível obter informações da sala, tentando entrar normalmente...');
          }
          
          // 3. Tentar entrar na sala
          console.log('🔍 Tentando entrar na sala:', salaAtiva.roomId);
          console.log('🔍 Detalhes da sala:', {
            roomId: salaAtiva.roomId,
            consultaId: salaAtiva.consultaId,
            status: salaAtiva.status
          });
          
          const infoSala = await consultaService.entrarSalaVideochamada(salaAtiva.roomId);
          console.log('🔍 Informações da sala:', infoSala);
          
          setCurrentRoomId(salaAtiva.roomId);
          setIsInCall(true);
          setVideochamadaError(null);
          
        } catch (salaError: any) {
          console.error('🔍 Erro ao entrar na sala:', salaError);
          
          // Tratamento especial para "Usuário já está na sala"
          if (salaError.message?.includes('Usuário já está na sala')) {
            console.log('🔍 Usuário já está na sala, redirecionando para videochamada...');
            setCurrentRoomId(salaAtiva.roomId);
            setIsInCall(true);
            setVideochamadaError(null);
            return;
          }
          
          // Mensagens de erro mais específicas
          let errorMessage = 'Erro ao conectar com a sala de videochamada.';
          
          if (salaError.statusCode === 400) {
            errorMessage = salaError.message || 'Erro na requisição. Verifique os dados da sala.';
          } else if (salaError.statusCode === 401) {
            errorMessage = 'Sessão expirada. Faça login novamente.';
          } else if (salaError.statusCode === 403) {
            errorMessage = 'Acesso negado. Você não tem permissão para esta sala.';
          } else if (salaError.statusCode === 404) {
            errorMessage = 'Sala não encontrada. Pode ter sido removida.';
          } else if (salaError.statusCode === 500) {
            errorMessage = 'Erro no servidor. Tente novamente em alguns instantes.';
          }
          
          setVideochamadaError(errorMessage);
          
          // Se for erro 400, tentar verificar a sala novamente
          if (salaError.statusCode === 400) {
            console.log('🔍 Tentando verificar sala novamente devido ao erro 400...');
            setTimeout(() => {
              verificarSalaAtiva(consultaAtual.id);
            }, 2000);
          }
        }
      } else {
        setVideochamadaError('Sala de videochamada não encontrada. Aguarde o médico iniciar a consulta.');
      }

    } catch (error) {
      console.error('🔍 Erro geral ao entrar na consulta:', error);
      setVideochamadaError('Erro inesperado ao entrar na consulta.');
    } finally {
      setIsLoading(false);
      setIsConnecting(false);
    }
  };

  const handleEndCall = () => {
    // Parar streams de mídia
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Sair da sala
    if (currentRoomId) {
      consultaService.sairSalaVideochamada(currentRoomId).catch(console.error);
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
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMicrophone = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicrophoneOn(audioTrack.enabled);
      }
    }
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

  // Tela de videochamada
  if (isInCall) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header - Oculto em tela cheia */}
        {!isFullscreen && (
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <span className="font-medium">
                    {consultaAtual ? formatarData(consultaAtual.date) : ''}
                  </span>
                  <ClockIcon className="h-5 w-5 text-blue-400 ml-4" />
                  <span className="font-medium">{consultaAtual?.time}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Status da conexão WebSocket */}
                <div className="flex items-center space-x-2 text-white">
                  <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">{wsConnected ? 'Conectado' : 'Desconectado'}</span>
                </div>
                
                {/* Botão fechar */}
                <button
                  onClick={() => navigate('/')}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Informações do médico */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {consultaAtual?.doctor?.name?.charAt(0) || 'M'}
                  </span>
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">{consultaAtual?.doctor?.name}</h2>
                  <p className="text-gray-400 text-sm">{consultaAtual?.doctor?.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  {consultaAtual?.type === 'consulta' ? 'Consulta' : consultaAtual?.type}
                </span>
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  Em Andamento
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Área principal da videochamada */}
        <div className={`flex flex-1 ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-140px)]'}`}>
          {/* Área de vídeo */}
          <div className={`flex-1 relative ${showChat && !isFullscreen ? 'mr-80' : ''}`}>
            {/* Vídeo principal */}
            <div className="relative w-full h-full bg-gray-800">
              {/* Vídeo do médico (principal) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <CameraIcon className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">{consultaAtual?.doctor?.name}</p>
                  <p className="text-sm">Aguardando médico...</p>
                </div>
              </div>
              
              {/* Vídeo do paciente (picture-in-picture) */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <CameraIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Indicadores de status */}
              {!isCameraOn && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-sm rounded-full flex items-center space-x-1">
                  <CameraIcon className="h-4 w-4" />
                  <span>Câmera Desligada</span>
                </div>
              )}
              
              {!isMicrophoneOn && (
                <div className="absolute top-12 left-4 px-3 py-1 bg-red-600 text-white text-sm rounded-full flex items-center space-x-1">
                  <MicIcon className="h-4 w-4" />
                  <span>Microfone Desligado</span>
                </div>
              )}
            </div>
            
            {/* Controles da videochamada - Simplificados */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-full px-6 py-3">
                <button
                  onClick={toggleMicrophone}
                  className={`p-3 rounded-full transition-colors ${
                    isMicrophoneOn 
                      ? 'bg-gray-600 text-white hover:bg-gray-500' 
                      : 'bg-red-600 text-white hover:bg-red-500'
                  }`}
                  title={isMicrophoneOn ? 'Desligar Microfone' : 'Ligar Microfone'}
                >
                  {isMicrophoneOn ? <MicIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
                </button>
                
                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-full transition-colors ${
                    isCameraOn 
                      ? 'bg-gray-600 text-white hover:bg-gray-500' 
                      : 'bg-red-600 text-white hover:bg-red-500'
                  }`}
                  title={isCameraOn ? 'Desligar Câmera' : 'Ligar Câmera'}
                >
                  {isCameraOn ? <CameraIcon className="h-5 w-5" /> : <CameraIcon className="h-5 w-5" />}
                </button>
                
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`p-3 rounded-full transition-colors ${
                    showChat 
                      ? 'bg-blue-600 text-white hover:bg-blue-500' 
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                  title="Chat"
                >
                  <MessageSquareIcon className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => {
                    const newFullscreenState = !isFullscreen;
                    console.log('🔍 Teleconsulta - Alternando tela cheia:', newFullscreenState);
                    setIsFullscreen(newFullscreenState);
                    setVideoCallFullscreen(newFullscreenState);
                    console.log('🔍 Teleconsulta - Contexto atualizado para:', newFullscreenState);
                  }}
                  className={`p-3 rounded-full transition-colors ${
                    isFullscreen 
                      ? 'bg-orange-600 text-white hover:bg-orange-500' 
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                  title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
                >
                  {isFullscreen ? <MinimizeIcon className="h-5 w-5" /> : <MaximizeIcon className="h-5 w-5" />}
                </button>
                
                <button
                  onClick={handleEndCall}
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors"
                  title="Sair da Consulta"
                >
                  <PhoneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat lateral - Oculto em tela cheia */}
          {showChat && !isFullscreen && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              {/* Header do chat */}
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <MessageSquareIcon className="h-5 w-5" />
                  <span>Chat com {consultaAtual?.doctor?.name}</span>
                </h3>
              </div>
              
              {/* Mensagens */}
              <div 
                ref={chatRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {mensagens.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma mensagem ainda</p>
                    <p className="text-sm">Inicie a conversa enviando uma mensagem</p>
                  </div>
                ) : (
                  mensagens.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={`flex ${mensagem.senderType === 'paciente' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          mensagem.senderType === 'paciente'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p className="text-sm">{mensagem.content}</p>
                        <p className="text-xs opacity-70 mt-1">
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
              
              {/* Input de mensagem */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    disabled={!wsConnected}
                  />
                  <button
                    onClick={enviarMensagem}
                    disabled={!novaMensagem.trim() || !wsConnected}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendIcon className="h-4 w-4" />
                  </button>
                </div>
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
                
                  <Button
                    onClick={handleEntrarConsulta}
                    className={`w-full ${
                      salaAtiva
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                    disabled={isLoading || !salaAtiva}
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
                    ) : verificandoSala ? (
                      <>
                        <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                        Verificando...
                      </>
                    ) : salaAtiva ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Entrar na Consulta
                      </>
                    ) : (
                      <>
                        <AlertCircleIcon className="w-4 h-4 mr-2" />
                        Aguardando Médico
                      </>
                    )}
                  </Button>
                  
                  {/* Botão de retry quando há erro */}
                  {videochamadaError && (
                    <Button
                      onClick={() => {
                        setVideochamadaError(null);
                        if (consultaAtual) {
                          verificarSalaAtiva(consultaAtual.id);
                        }
                      }}
                      className="w-full mt-2 bg-orange-600 text-white hover:bg-orange-700"
                      disabled={isLoading}
                    >
                      <LoaderIcon className="w-4 h-4 mr-2" />
                      Tentar Novamente
                    </Button>
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
                <CardTitle>
                  {consultasPassadas.length > 0 ? 'Nenhuma Consulta Futura' : 'Nenhuma Consulta Agendada'}
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                  {consultasPassadas.length > 0 
                    ? 'Você não tem consultas futuras agendadas no momento.'
                    : 'Você não tem consultas agendadas no momento.'
                  }
                </p>
                {consultasPassadas.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      Você tem {consultasPassadas.length} consulta(s) passada(s). 
                      Role para baixo para visualizá-las.
                    </p>
                  </div>
                )}
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

          {/* Consultas Passadas */}
          {consultasPassadas.length > 0 && (
            <div className="lg:col-span-3 mt-8">
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                    Consultas Passadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {consultasPassadas.map((consulta) => (
                      <div key={consulta.id} className="bg-white rounded-lg p-4 border border-red-200 relative">
                        {/* Ícone de consulta passada */}
                        <div className="absolute top-3 right-3">
                          <XCircleIcon className="w-5 h-5 text-red-500" />
          </div>
          
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={consulta.doctor?.avatar || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"}
                            alt="Doctor profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-red-200"
                          />
                          <div>
                            <h3 className="font-semibold text-red-900">{consulta.doctor?.name}</h3>
                            <p className="text-red-600 text-sm">{consulta.doctor?.specialty}</p>
        </div>
      </div>

                        <div className="space-y-2 text-red-800 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-red-600" />
                            {formatarData(consulta.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-red-600" />
                            {consulta.time}
                          </div>
                        </div>
                        
                        <div className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm bg-red-100 text-red-700 border border-red-300">
                          <XCircleIcon className="w-4 h-4" />
                          Consulta Passada
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};