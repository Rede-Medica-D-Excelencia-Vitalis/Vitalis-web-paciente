// Arquivo principal que exporta todos os contexts organizados
// Este arquivo permite imports limpos como: import { useTheme, useModal } from './contexts'

// Provider principal que combina todos os contexts
export { Providers } from './Providers';

// Context de tema (claro/escuro)
export { ThemeProvider, useTheme } from './theme';

// Context de modais
export { ModalProvider, useModal } from './modal';

// Context de notificações
export { NotificationProvider, useNotification } from './notification';
export type { Notification, NotificationType } from './notification';

// Context principal da aplicação
export { AppProvider, useApp } from './app';

// Context de fullscreen (videochamadas)
export { FullscreenProvider, useFullscreen } from './fullscreen';
