import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('🔧 Configuração da API:', { API_BASE_URL, env: import.meta.env.VITE_API_URL });

// Instância do Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para controlar tentativas de renovação de token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se for erro 401 (não autorizado) e temos um token
    if (error.response?.status === 401 && localStorage.getItem('token') && !originalRequest._retry) {
      
      // Se já estamos tentando renovar o token, adicionar à fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tentar renovar o token
        const refreshResponse = await api.post('/auth/refresh');
        
        if (refreshResponse.data.sucesso) {
          const newToken = refreshResponse.data.token;
          localStorage.setItem('token', newToken);
          
          // Atualizar o token no store se estiver disponível
          const { useAuthStore } = await import('../store/auth');
          const currentState = useAuthStore.getState();
          if (currentState.user) {
            useAuthStore.getState().login(newToken, currentState.user);
          }
          
          // Processar fila de requisições pendentes
          processQueue(null, newToken);
          
          // Retry da requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          throw new Error('Falha ao renovar token');
        }
      } catch (refreshError) {
        // Se falhar ao renovar, limpar dados e redirecionar
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Limpar store de autenticação
        const { useAuthStore } = await import('../store/auth');
        useAuthStore.getState().logout();
        
        // Redirecionar para login apenas se não estivermos já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para categorias
export interface Categoria {
  id: number;
  name: string;
  icon: string;
  productCount: number;
  description: string;
}

// Serviços de categorias
export const categoriaService = {
  // Buscar categorias formatadas para o frontend
  async getCategoriasFormatadas(farmacia_id?: number): Promise<Categoria[]> {
    try {
      const params = farmacia_id ? `?farmacia_id=${farmacia_id}` : '';
      const response = await api.get(`/categorias-produtos/formatadas${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  // Buscar todas as categorias (requer autenticação)
  async getCategorias(): Promise<Categoria[]> {
    try {
      const response = await api.get('/categorias-produtos');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  // Buscar categoria por ID
  async getCategoriaPorId(id: number): Promise<Categoria | null> {
    try {
      const response = await api.get(`/categorias-produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      return null;
    }
  }
}; 