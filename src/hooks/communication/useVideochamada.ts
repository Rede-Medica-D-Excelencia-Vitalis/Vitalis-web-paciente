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
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

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
  const initializePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: getIceServers()
    });

    // Adicionar stream local
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Eventos do peer connection
    pc.ontrack = (event) => {
      console.log('🎥 Stream remoto recebido:', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && roomId) {
        console.log('🧊 Enviando candidato ICE:', event.candidate);
        consultaService.processarSinalizacao(roomId, 'ice_candidate', {
          candidate: event.candidate
        }).catch(err => console.error('Erro ao enviar candidato ICE:', err));
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
  }, [localStream, roomId, getIceServers]);

  // Conectar à sala
  const connectToRoom = useCallback(async (targetRoomId: string) => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // 1. Obter stream local
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);

      // 2. Entrar na sala
      const salaInfo = await consultaService.entrarSalaVideochamada(targetRoomId);
      setRoomInfo(salaInfo);

      // 3. Inicializar peer connection
      const pc = initializePeerConnection();

      // 4. Conectar ao WebSocket para sinalização
      const token = localStorage.getItem('token');
      const wsUrl = `ws://localhost:3000?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('🔌 WebSocket conectado');
        // Primeiro autenticar
        ws.send(JSON.stringify({
          tipo: 'autenticacao',
          token: token
        }));
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Mensagem recebida:', message);

          switch (message.tipo) {
            case 'autenticacao':
              if (message.sucesso) {
                console.log('✅ WebSocket autenticado');
                // Após autenticação, entrar na sala
                ws.send(JSON.stringify({
                  tipo: 'videochamada_entrar',
                  roomId: targetRoomId
                }));
              } else {
                console.error('❌ Falha na autenticação WebSocket:', message.erro);
                setError('Erro na autenticação da videochamada');
              }
              break;

            case 'videochamada_offer':
              if (pc && !salaInfo.isHost) {
                await pc.setRemoteDescription(new RTCSessionDescription(message.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                
                ws.send(JSON.stringify({
                  tipo: 'videochamada_answer',
                  roomId: targetRoomId,
                  answer: answer
                }));
              }
              break;

            case 'videochamada_answer':
              if (pc && salaInfo.isHost) {
                await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
              }
              break;

            case 'videochamada_ice_candidate':
              if (pc && message.candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
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
        console.error('❌ Erro no WebSocket:', error);
        setError('Erro na conexão de sinalização');
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
      setError(err instanceof Error ? err.message : 'Erro ao conectar à sala');
    } finally {
      setIsConnecting(false);
    }
  }, [user, initializePeerConnection, onParticipantJoined, onParticipantLeft]);

  // Desconectar da sala
  const disconnectFromRoom = useCallback(async () => {
    try {
      // Só tentar sair da sala se ainda estivermos conectados
      if (roomId && isConnected) {
        try {
          await consultaService.sairSalaVideochamada(roomId);
        } catch (err) {
          // Se der erro ao sair (sala não existe), não é problema
          console.log('Sala já foi removida ou não existe mais');
        }
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }

      setRemoteStream(null);
      setIsConnected(false);
      setRoomInfo(null);
      setError(null);

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

  // Flag para controlar se o componente está desmontando
  const isUnmountingRef = useRef(false);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
      disconnectFromRoom();
    };
  }, [disconnectFromRoom]);

  // Conectar automaticamente se roomId for fornecido
  useEffect(() => {
    // Não conectar se o componente está desmontando
    if (isUnmountingRef.current) {
      return;
    }
    
    if (roomId && !isConnected && !isConnecting) {
      connectToRoom(roomId);
    }
  }, [roomId, isConnected, isConnecting, connectToRoom]);

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