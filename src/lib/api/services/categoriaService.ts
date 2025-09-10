import { api } from '../config';

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
      return null;
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
