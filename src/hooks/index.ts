// Arquivo principal que exporta todos os hooks organizados por categoria
// Este arquivo permite imports limpos como: import { useAuth, useApi } from './hooks'

// Hooks de autenticação e permissões
export * from './auth';

// Hooks de API e comunicação com backend
export * from './api';

// Hooks de comunicação (WebSocket, videochamadas)
export * from './communication';
