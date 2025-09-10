import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FullscreenContextType {
  isVideoCallFullscreen: boolean;
  setVideoCallFullscreen: (value: boolean) => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  
  return context;
};

interface FullscreenProviderProps {
  children: ReactNode;
}

export const FullscreenProvider: React.FC<FullscreenProviderProps> = ({ children }) => {
  const [isVideoCallFullscreen, setVideoCallFullscreen] = useState(false);

  return (
    <FullscreenContext.Provider value={{ isVideoCallFullscreen, setVideoCallFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
};
