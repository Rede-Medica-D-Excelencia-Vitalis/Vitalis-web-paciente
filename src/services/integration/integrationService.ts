import { api } from "../../lib/api";

export interface Pharmacy {
  id: number;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: string;
  rating: number;
  photo?: string;
  totalProducts: number;
  activeProducts: number;
  deliveryTime: string;
  minOrder: string;
}

export interface IntegratedProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category?: string;
  pharmacy: {
    id: number;
    name: string;
  };
  stock: number;
  requiresPrescription: boolean;
}

export interface OrderItem {
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}

export interface IntegratedOrder {
  farmacia_id: number;
  paciente_id: number;
  items: OrderItem[];
  endereco_entrega: string;
  forma_pagamento: string;
  observacoes_entrega?: string;
  total: number;
  subtotal: number;
  taxa_entrega: number;
  desconto: number;
}

export interface OrderResponse {
  id: number;
  numero_pedido: string;
  farmacia_id: number;
  paciente_id: number;
  total: number;
  subtotal: number;
  taxa_entrega: number;
  desconto: number;
  status: string;
  endereco_entrega: string;
  forma_pagamento: string;
  observacoes_entrega?: string;
  data_criacao?: string;
  criado_em?: string;
  data_atualizacao?: string;
  atualizado_em?: string;
  farmacia_nome?: string;
  paciente_nome?: string;
  itens?: OrderItemDetail[];
  itemCount?: number;
  avaliacao?: {
    id: number;
    nota: number;
    comentario: string;
    criado_em: string;
  } | null;
  ja_avaliado?: boolean;
}

export interface OrderItemDetail {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  produto_nome?: string;
  produto_imagem?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const integrationService = {
  // Buscar farmácias disponíveis
  getPharmacies: async (): Promise<Pharmacy[]> => {
    try {
      const response = await api.get('/integration/pharmacies');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar farmácias:', error);
      throw error;
    }
  },

  // Buscar produtos de uma farmácia específica
  getPharmacyProducts: async (
    pharmacyId: number, 
    category?: string, 
    search?: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{
    data: IntegratedProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/integration/pharmacies/${pharmacyId}/products?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar produtos da farmácia:', error);
      throw error;
    }
  },

  // Criar pedido integrado
  createOrder: async (orderData: IntegratedOrder): Promise<OrderResponse> => {
    try {
      const response = await api.post('/integration/orders', orderData);
      return response.data.data.pedido;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  // Buscar pedido específico
  getOrder: async (orderId: number): Promise<OrderResponse> => {
    try {
      const response = await api.get(`/integration/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    }
  },

  // Atualizar status do pedido
  updateOrderStatus: async (orderId: number, status: string, observacoes?: string): Promise<void> => {
    try {
      await api.put(`/integration/orders/${orderId}/status`, { status, observacoes });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  },

  // Listar pedidos do paciente
  getPatientOrders: async (
    patientId: number, 
    status?: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    data: OrderResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'todos') params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/integration/orders/patient/${patientId}?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao listar pedidos do paciente:', error);
      throw error;
    }
  },

  // Listar pedidos da farmácia
  getPharmacyOrders: async (
    pharmacyId: number, 
    status?: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    data: OrderResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'todos') params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/integration/orders/pharmacy/${pharmacyId}?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao listar pedidos da farmácia:', error);
      throw error;
    }
  }
}; 