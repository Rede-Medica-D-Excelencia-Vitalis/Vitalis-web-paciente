import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AppState {
  isLoading: boolean;
  isOnline: boolean;
  currentRoute: string;
  sidebarOpen: boolean;
  searchQuery: string;
}

interface AppContextType {
  appState: AppState;
  setLoading: (loading: boolean) => void;
  setCurrentRoute: (route: string) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  resetAppState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>({
    isLoading: false,
    isOnline: navigator.onLine,
    currentRoute: '/',
    sidebarOpen: false,
    searchQuery: '',
  });

  // Monitorar status online/offline
  useEffect(() => {
    const handleOnline = () => setAppState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setAppState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setLoading = (loading: boolean) => {
    setAppState(prev => ({ ...prev, isLoading: loading }));
  };

  const setCurrentRoute = (route: string) => {
    setAppState(prev => ({ ...prev, currentRoute: route }));
  };

  const toggleSidebar = () => {
    setAppState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  };

  const setSearchQuery = (query: string) => {
    setAppState(prev => ({ ...prev, searchQuery: query }));
  };

  const resetAppState = () => {
    setAppState({
      isLoading: false,
      isOnline: navigator.onLine,
      currentRoute: '/',
      sidebarOpen: false,
      searchQuery: '',
    });
  };

  const value = {
    appState,
    setLoading,
    setCurrentRoute,
    toggleSidebar,
    setSearchQuery,
    resetAppState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
