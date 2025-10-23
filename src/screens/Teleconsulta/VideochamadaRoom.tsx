import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVideochamada } from '../../hooks/communication/useVideochamada';
import { Button } from '../../components/ui/button';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Maximize2, Minimize2 } from 'lucide-react';

export const VideochamadaRoom: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('roomId');
  const consultaId = searchParams.get('consultaId');
  const doctorName = searchParams.get('doctorName') || 'Médico';
  
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isConnected,
    isConnecting,
    localStream,
    remoteStream,
    error,
    disconnectFromRoom,
    toggleCamera,
    toggleMicrophone
  } = useVideochamada({ roomId: roomId || undefined });

  // Conectar streams aos vídeos
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Timer da chamada
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnected]);

  // Prevenir fechamento acidental
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isConnected || isConnecting) {
        e.preventDefault();
        e.returnValue = 'Você está em uma videochamada. Tem certeza que deseja sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isConnected, isConnecting]);

  // Log de debug
  useEffect(() => {
    console.log('📊 Estado da videochamada:', {
      isConnected,
      isConnecting,
      hasLocalStream: !!localStream,
      hasRemoteStream: !!remoteStream,
      error
    });
  }, [isConnected, isConnecting, localStream, remoteStream, error]);

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleEndCall = async () => {
    if (window.confirm('Deseja realmente encerrar a chamada?')) {
      await disconnectFromRoom();
      window.close(); // Tenta fechar a janela
      // Se não conseguir fechar (algumas restrições do navegador), redireciona
      setTimeout(() => {
        navigate('/teleconsulta');
      }, 500);
    }
  };

  const handleToggleCamera = () => {
    toggleCamera();
    setIsCameraOn(!isCameraOn);
  };

  const handleToggleMic = () => {
    toggleMicrophone();
    setIsMicOn(!isMicOn);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!roomId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">❌ Sala não encontrada</h1>
          <Button onClick={() => navigate('/teleconsulta')}>
            Voltar para Teleconsultas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-white">
            <h1 className="text-lg font-semibold">Consulta com {doctorName}</h1>
            <p className="text-sm text-gray-400">
              {isConnected ? (
                <span className="text-green-400">
                  Conectado • {formatDuration(callDuration)}
                </span>
              ) : isConnecting ? (
                <span className="text-yellow-400">Conectando...</span>
              ) : (
                <span className="text-red-400">Aguardando conexão...</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </Button>
        </div>
      </div>

      {/* Área de Vídeos */}
      <div className="flex-1 relative bg-black">
        {/* Vídeo Remoto (Médico) - Tela Principal */}
        <div className="w-full h-full flex items-center justify-center">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Camera size={48} className="text-gray-400" />
              </div>
              <p className="text-lg">Aguardando {doctorName}...</p>
            </div>
          )}
        </div>

        {/* Vídeo Local (Você) - Picture-in-Picture */}
        <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
          />
          <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
            Você
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <p className="font-semibold">❌ {error}</p>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-center gap-4">
        <Button
          onClick={handleToggleMic}
          size="lg"
          className={`rounded-full w-14 h-14 ${
            isMicOn 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
        </Button>

        <Button
          onClick={handleToggleCamera}
          size="lg"
          className={`rounded-full w-14 h-14 ${
            isCameraOn 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {isCameraOn ? <Camera size={24} /> : <CameraOff size={24} />}
        </Button>

        <Button
          onClick={handleEndCall}
          size="lg"
          className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 text-white"
        >
          <PhoneOff size={24} />
        </Button>
      </div>

      {/* CSS para espelhar o vídeo local */}
      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default VideochamadaRoom;

