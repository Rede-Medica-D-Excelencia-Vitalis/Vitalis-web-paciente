import React from 'react';
import { useFullscreen } from '../../contexts';

export const FullscreenDebug: React.FC = () => {
  const { isVideoCallFullscreen, setVideoCallFullscreen } = useFullscreen();

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg z-[9999] text-xs">
      <div className="font-bold mb-2">🔍 Debug Fullscreen</div>
      <div>Estado: {isVideoCallFullscreen ? '🟢 TELA CHEIA' : '🔴 NORMAL'}</div>
      <div className="mt-2 space-y-1">
        <button
          onClick={() => setVideoCallFullscreen(true)}
          className="bg-green-600 px-2 py-1 rounded text-xs mr-1"
        >
          Ativar Tela Cheia
        </button>
        <button
          onClick={() => setVideoCallFullscreen(false)}
          className="bg-red-600 px-2 py-1 rounded text-xs"
        >
          Desativar Tela Cheia
        </button>
      </div>
    </div>
  );
};
