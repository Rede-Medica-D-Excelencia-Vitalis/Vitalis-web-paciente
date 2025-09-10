import React, { ReactNode } from 'react';
import { ThemeProvider } from './theme';
import { ModalProvider } from './modal';
import { NotificationProvider } from './notification';
import { AppProvider } from './app';
import { FullscreenProvider } from './fullscreen';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Componente que combina todos os context providers da aplicação
 * Garante que todos os contexts estejam disponíveis para os componentes filhos
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AppProvider>
      <ThemeProvider>
        <NotificationProvider>
          <ModalProvider>
            <FullscreenProvider>
              {children}
            </FullscreenProvider>
          </ModalProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AppProvider>
  );
};
