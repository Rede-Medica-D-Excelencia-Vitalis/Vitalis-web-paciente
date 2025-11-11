import { useState, useRef, useEffect, useCallback } from 'react';
import { consultaService, VideochamadaInfo } from '../../services/consultation/consultaService';
import { useAuth } from '../auth/useAuth';

interface UseVideochamadaProps {
  roomId?: string;
  onParticipantJoined?: (participant: any) => void;
  onParticipantLeft?: (participantId: number) => void;
  onError?: (error: string) => void;
}

export const useVideochamada = ({ 
  roomId, 
  onParticipantJoined, 
  onParticipantLeft, 
  onError 
}: UseVideochamadaProps = {}) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [roomInfo, setRoomInfo] = useState<VideochamadaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const hasConnectedRef = useRef<string | null>(null); // Track para evitar reconexões

  // Configuração ICE servers
  const getIceServers = useCallback(() => {
    return [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302'
        ]
      }
    ];
  }, []);

  // Inicializar WebRTC
  const initializePeerConnection = useCallback((stream: MediaStream | null) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: getIceServers()
    });

    // Adicionar stream local (recebido como parâmetro, não do state!)
    if (stream) {
      console.log('🎵 Adicionando tracks ao PeerConnection:', {
        video: stream.getVideoTracks().length,
        audio: stream.getAudioTracks().length
      });
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
        console.log(`  ✅ Track adicionado: ${track.kind} (${track.label})`);
      });
    } else {
      console.warn('⚠️ Stream não fornecido ao initializePeerConnection');
    }

    // Eventos do peer connection
    pc.ontrack = (event) => {
      console.log('🎥 Track remoto recebido:', {
        kind: event.track.kind,
        label: event.track.label,
        streams: event.streams?.length,
        trackReadyState: event.track.readyState
      });

      // Criar (ou reaproveitar) um MediaStream para agregar todos os tracks remotos
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
        setRemoteStream(remoteStreamRef.current);
      }

      const remoteMediaStream = remoteStreamRef.current;

      // Alguns navegadores enviam stream completo em event.streams[0]
      if (event.streams && event.streams[0]) {
        console.log('🎥 Atualizando stream remoto a partir de event.streams[0]');
        remoteStreamRef.current = event.streams[0];
        setRemoteStream(event.streams[0]);
        return;
      }

      // Em outros casos, precisamos adicionar manualmente o track
      if (remoteMediaStream && !remoteMediaStream.getTracks().some(t => t.id === event.track.id)) {
        remoteMediaStream.addTrack(event.track);
        setRemoteStream(remoteMediaStream);
        console.log('🎥 Track remoto adicionado manualmente ao MediaStream');
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && roomId) {
        console.log('🧊 Enviando candidato ICE:', event.candidate);
        // Enviar candidato ICE via WebSocket usando protocolo padronizado
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            tipo: 'videochamada_ice_candidate',
            roomId: roomId,
            candidate: event.candidate
          }));
        }
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('🧊 Estado da conexão ICE:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected') {
        setIsConnected(true);
      } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setIsConnected(false);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [roomId, getIceServers]);

  // Conectar à sala
  const connectToRoom = useCallback(async (targetRoomId: string) => {
    console.log('🚀 connectToRoom INICIADO:', {
      targetRoomId,
      user: user ? `${user.nome} (${user.tipo})` : 'null',
      localStream: localStream ? 'já existe' : 'null',
      peerConnection: peerConnectionRef.current ? 'já existe' : 'null',
      wsRef: wsRef.current ? 'já existe' : 'null',
      wsState: wsRef.current?.readyState,
      hasConnected: hasConnectedRef.current
    });
    
    if (!user) {
      console.error('❌ Usuário não autenticado');
      setError('Usuário não autenticado');
      return;
    }

    // Evitar múltiplas conexões simultâneas
    if (isConnecting) {
      console.warn('⚠️ Já está conectando, ignorando nova tentativa');
      return;
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.warn('⚠️ WebSocket já está aberto, ignorando nova tentativa');
      return;
    }

    console.log('✅ Usuário autenticado, definindo isConnecting=true');
    setIsConnecting(true);
    setError(null);

    try {
      // 1. Obter stream local
      console.log('🎥 Solicitando permissões de mídia...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('✅ Permissões concedidas:', {
        video: stream.getVideoTracks().length > 0,
        audio: stream.getAudioTracks().length > 0,
        videoTrack: stream.getVideoTracks()[0]?.label,
        audioTrack: stream.getAudioTracks()[0]?.label
      });
      
      setLocalStream(stream);

      // 2. Entrar na sala
      const salaInfo = await consultaService.entrarSalaVideochamada(targetRoomId);
      setRoomInfo(salaInfo);

      // 3. Inicializar peer connection (passando stream como parâmetro!)
      const pc = initializePeerConnection(stream);

      // 4. Conectar ao WebSocket para sinalização
      const token = localStorage.getItem('token');
      const wsUrl = `ws://localhost:3001?token=${token}`;
      console.log('🔌 Conectando WebSocket para videochamada:', wsUrl);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('🔌 WebSocket conectado para videochamada');
        console.log('⏳ Aguardando autenticação automática do backend...');
        // Não enviar nenhuma mensagem aqui - aguardar autenticação do backend
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Mensagem recebida:', message);

          switch (message.tipo) {
            case 'autenticacao':
              if (message.sucesso) {
                console.log('✅ WebSocket autenticado:', message.usuario);
                
                // Após autenticação bem-sucedida, entrar na sala de videochamada
                console.log('📤 Enviando mensagem videochamada_entrar...');
                ws.send(JSON.stringify({
                  tipo: 'videochamada_entrar',
                  roomId: targetRoomId,
                  consultaId: roomInfo?.consultaId || salaInfo?.consultaId
                }));
              } else {
                console.error('❌ Falha na autenticação WebSocket:', message.erro);
                setError('Erro na autenticação da videochamada');
                setIsConnecting(false);
                setIsConnected(false);
              }
              break;

            case 'videochamada_entrou':
              console.log('✅ Entrou na sala de videochamada com sucesso');
              // Agora sim, marcar como conectado após entrar na sala
              setIsConnecting(false);
              setIsConnected(true);
              break;

            case 'videochamada_erro':
              console.error('❌ Erro ao entrar na videochamada:', message.mensagem);
              setError(message.mensagem);
              break;

            case 'videochamada_offer':
              console.log('📥 Paciente recebeu mensagem de offer');
              console.log('📍 RoomId da mensagem:', message.roomId);
              console.log('📍 RoomId esperado (targetRoomId):', targetRoomId);
              
              // IMPORTANTE: Só processar offer se for para a sala correta
              if (message.roomId !== targetRoomId) {
                console.log('⏭️ Offer de sala diferente, ignorando');
                break;
              }
              
              // Receber offer do host (médico)
              if (pc && !salaInfo.isHost) {
                console.log('📥 Paciente processando offer do médico');
                console.log('📋 Offer:', {
                  type: message.offer?.type,
                  sdp: message.offer?.sdp?.substring(0, 100) + '...'
                });
                
                await pc.setRemoteDescription(new RTCSessionDescription(message.offer));
                console.log('✅ Remote description definido');
                
                const answer = await pc.createAnswer();
                console.log('✅ Answer criado:', {
                  type: answer.type,
                  sdp: answer.sdp?.substring(0, 100) + '...'
                });
                await pc.setLocalDescription(answer);
                console.log('✅ Local description definido');
                
                console.log('📤 Enviando answer para o médico...');
                console.log('📤 RoomId do answer:', targetRoomId);
                ws.send(JSON.stringify({
                  tipo: 'videochamada_answer',
                  roomId: targetRoomId,
                  answer: answer
                }));
                console.log('✅ Answer enviado com sucesso');
              } else {
                console.log('⏭️ Paciente ignorando offer (é o host ou pc não existe):', {
                  temPc: !!pc,
                  isHost: salaInfo.isHost
                });
              }
              break;

            case 'videochamada_answer':
              console.log('📥 Recebeu mensagem de answer');
              console.log('📍 RoomId da mensagem:', message.roomId);
              console.log('📍 RoomId esperado (targetRoomId):', targetRoomId);
              
              // IMPORTANTE: Só processar answer se for para a sala correta
              if (message.roomId !== targetRoomId) {
                console.log('⏭️ Answer de sala diferente, ignorando');
                break;
              }
              
              if (pc && salaInfo.isHost) {
                console.log('📥 Host processando answer');
                await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
                console.log('✅ Answer processado com sucesso');
              }
              break;

            case 'videochamada_ice_candidate':
              console.log('📥 Recebeu candidato ICE');
              console.log('📍 RoomId da mensagem:', message.roomId);
              console.log('📍 RoomId esperado (targetRoomId):', targetRoomId);
              
              // IMPORTANTE: Só processar candidato ICE se for para a sala correta
              if (message.roomId !== targetRoomId) {
                console.log('⏭️ Candidato ICE de sala diferente, ignorando');
                break;
              }
              
              if (pc && message.candidate) {
                console.log('📥 Processando candidato ICE:', {
                  candidate: message.candidate.candidate?.substring(0, 50) + '...',
                  sdpMLineIndex: message.candidate.sdpMLineIndex
                });
                await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
                console.log('✅ Candidato ICE adicionado');
              }
              break;

            case 'participante_entrou':
              onParticipantJoined?.(message.participante);
              break;

            case 'participante_saiu':
              onParticipantLeft?.(message.userId);
              break;

            case 'erro':
              console.error('❌ Erro WebSocket:', message.mensagem);
              setError(message.mensagem);
              break;
          }
        } catch (err) {
          console.error('Erro ao processar mensagem WebSocket:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Erro WebSocket videochamada:', error);
        console.log('💡 Dica: Verifique se o backend está rodando na porta 3001');
        console.log('💡 URL tentativa:', wsUrl);
        console.log('💡 Estado da conexão:', ws.readyState);
        
        setError('Erro ao conectar com a sala de videochamada. Verifique se o servidor está disponível.');
        setIsConnecting(false);
        setIsConnected(false);
        
        // Limpar WebSocket
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
        
        // Chamar callback de erro se fornecido
        onError?.('Erro ao conectar com a sala de videochamada');
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket fechado:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        
        // Se não foi uma desconexão intencional (código 1000), tratar como erro
        if (event.code !== 1000 && event.code !== 1005) {
          console.warn('⚠️ WebSocket fechou inesperadamente');
          setError('Conexão com a videochamada foi perdida');
        }
        
        // Limpar estado
        setIsConnecting(false);
        setIsConnected(false);
        
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
      };

      wsRef.current = ws;

      // 5. Se for o host, criar offer
      if (salaInfo.isHost) {
        setTimeout(async () => {
          if (pc) {
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              
              ws.send(JSON.stringify({
                tipo: 'videochamada_offer',
                roomId: targetRoomId,
                offer: offer
              }));
            } catch (err) {
              console.error('Erro ao criar offer:', err);
              setError('Erro ao iniciar videochamada');
            }
          }
        }, 1000);
      }

    } catch (err) {
      console.error('❌ Erro ao conectar à sala:', err);
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Permissões de câmera e microfone negadas. Por favor, permita o acesso nas configurações do navegador.');
        } else if (err.name === 'NotFoundError') {
          setError('Câmera ou microfone não encontrados. Verifique se os dispositivos estão conectados.');
        } else if (err.name === 'NotReadableError') {
          setError('Câmera ou microfone estão sendo usados por outro aplicativo. Feche outros programas e tente novamente.');
        } else {
          setError(`Erro de permissão: ${err.message}`);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Erro ao conectar à sala');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [user, initializePeerConnection, onParticipantJoined, onParticipantLeft]);

  // Desconectar da sala
  const disconnectFromRoom = useCallback(async () => {
    try {
      console.log('🧹 Iniciando desconexão da sala...');
      
      // Marcar como desconectando para evitar novas tentativas
      hasConnectedRef.current = null;
      
      // Só tentar sair da sala se ainda estivermos conectados
      if (roomId && isConnected) {
        try {
          await consultaService.sairSalaVideochamada(roomId);
        } catch (err) {
          // Se der erro ao sair (sala não existe), não é problema
          console.log('Sala já foi removida ou não existe mais');
        }
      }

      // Fechar WebSocket primeiro
      if (wsRef.current) {
        console.log('🔌 Fechando WebSocket...');
        wsRef.current.close(1000, 'Desconexão intencional');
        wsRef.current = null;
      }

      // Depois fechar PeerConnection
      if (peerConnectionRef.current) {
        console.log('📞 Fechando PeerConnection...');
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // Por último, parar streams
      if (localStream) {
        console.log('🎥 Parando stream local...');
        localStream.getTracks().forEach(track => {
          track.stop();
          console.log(`  ✅ Track parado: ${track.kind}`);
        });
        setLocalStream(null);
      }

      // Limpar estados
      setRemoteStream(null);
      setIsConnected(false);
      setIsConnecting(false);
      setRoomInfo(null);
      setError(null);
      
      console.log('✅ Desconexão completa');

    } catch (err) {
      console.error('Erro ao desconectar da sala:', err);
    }
  }, [roomId, localStream, isConnected]);

  // Alternar câmera
  const toggleCamera = useCallback(async () => {
    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    }
  }, [localStream]);

  // Alternar microfone
  const toggleMicrophone = useCallback(async () => {
    if (!localStream) return;

    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  }, [localStream]);

  // Compartilhar tela
  const toggleScreenShare = useCallback(async () => {
    if (!peerConnectionRef.current) return;

    try {
      if (!localStream) return;

      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        if (videoTrack.getSettings().displaySurface) {
          // Parar compartilhamento de tela
          videoTrack.stop();
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          setLocalStream(newStream);
          
          // Substituir track no peer connection
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(sender => sender.track?.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(newStream.getVideoTracks()[0]);
          }
        } else {
          // Iniciar compartilhamento de tela
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
          });
          
          // Substituir track no peer connection
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(sender => sender.track?.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        }
      }
    } catch (err) {
      console.error('Erro ao alternar compartilhamento de tela:', err);
      setError('Erro ao compartilhar tela');
    }
  }, [localStream]);

  // Conectar automaticamente se roomId for fornecido (UMA VEZ APENAS)
  useEffect(() => {
    console.log('🔍 useVideochamada - useEffect de conexão automática:', {
      roomId,
      isConnected,
      isConnecting,
      hasConnected: hasConnectedRef.current
    });
    
    // Só conectar se:
    // 1. Tem roomId
    // 2. Não está conectado
    // 3. Não está conectando
    // 4. NUNCA tentou conectar a esta sala específica antes
    if (roomId && !isConnected && !isConnecting && hasConnectedRef.current !== roomId) {
      console.log('✅ Condições atendidas, conectando automaticamente...');
      hasConnectedRef.current = roomId; // Marcar como tentado
      connectToRoom(roomId);
    } else {
      console.log('❌ Condições NÃO atendidas:', {
        temRoomId: !!roomId,
        naoEstaConectado: !isConnected,
        naoEstaConectando: !isConnecting,
        jaTentouConectar: hasConnectedRef.current === roomId
      });
    }
    // Remover connectToRoom das dependências para evitar loop infinito
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, isConnected, isConnecting]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      console.log('🧹 Hook desmontando, limpando recursos...');
      // Limpar recursos diretamente sem depender de disconnectFromRoom
      if (wsRef.current) {
        wsRef.current.close(1000, 'Desconexão intencional');
        wsRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Array vazio para executar apenas no unmount

  return {
    // Estado
    isConnected,
    isConnecting,
    localStream,
    remoteStream,
    roomInfo,
    error,
    
    // Refs para vídeo
    localVideoRef,
    remoteVideoRef,
    
    // Métodos
    connectToRoom,
    disconnectFromRoom,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
    
    // Utilitários
    isHost: roomInfo?.isHost || false
  };
}; 