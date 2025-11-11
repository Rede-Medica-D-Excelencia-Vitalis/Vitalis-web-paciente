import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVideochamada } from '../../hooks/communication/useVideochamada';
import { Button } from '../../components/ui/button';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Maximize2, Minimize2, AlertTriangle, X } from 'lucide-react';

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
  const [showExitModal, setShowExitModal] = useState(false);
  
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

  const handleEndCall = () => {
    setShowExitModal(true);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleConfirmExit = async () => {
    await disconnectFromRoom();
    setShowExitModal(false);
    window.close(); // Tenta fechar a janela
    // Se não conseguir fechar (algumas restrições do navegador), redireciona
    setTimeout(() => {
      navigate('/teleconsulta');
    }, 500);
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

      {/* Modal de Confirmação de Saída */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sair da Consulta?</h2>
                  <p className="text-white/80 text-sm">Tem certeza que deseja sair?</p>
                </div>
              </div>
              <button
                onClick={handleCancelExit}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">
                      Ao sair da consulta, a videochamada será encerrada.
                    </p>
                    <p className="text-sm text-amber-700 mt-2">
                      O médico será notificado sobre sua saída.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="text-teal-600 text-2xl">👨‍⚕️</div>
                  <div className="flex-1">
                    <p className="text-sm text-teal-800">
                      <strong>Médico:</strong> {doctorName}
                    </p>
                    <p className="text-sm text-teal-800 mt-1">
                      <strong>Duração:</strong> {formatDuration(callDuration)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCancelExit}
                  variant="outline"
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Continuar na Consulta
                </Button>
                <Button
                  onClick={handleConfirmExit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Sim, Sair da Consulta
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS para espelhar o vídeo local e animações */}
      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VideochamadaRoom;

