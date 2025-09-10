import axios from 'axios';

// Configuração base da API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('🔧 Configuração da API:', { API_BASE_URL, env: import.meta.env.VITE_API_URL });

// Instância do Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurações adicionais
export const API_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;
