import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FullscreenContextType {
  isVideoCallFullscreen: boolean;
  setVideoCallFullscreen: (value: boolean) => void;
  isSidebarVisible: boolean;
  setSidebarVisible: (value: boolean) => void;
  toggleSidebar: () => void;
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
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <FullscreenContext.Provider value={{ 
      isVideoCallFullscreen, 
      setVideoCallFullscreen,
      isSidebarVisible,
      setSidebarVisible,
      toggleSidebar
    }}>
      {children}
    </FullscreenContext.Provider>
  );
};
