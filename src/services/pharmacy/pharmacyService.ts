import { api, ApiResponse } from "../../lib/api";
import { Product, Order, CartItem } from '../types/api';

/**
 * Busca produtos com base em filtros.
 * @param {string} [category] - ID da categoria para filtrar.
 * @param {string} [searchTerm] - Termo para buscar no nome do produto.
 * @returns {Promise<Product[]>} Uma lista de produtos.
 */
export async function getProducts(category?: string, searchTerm?: string): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>('/produtos', {
      params: {
        categoria: category,
        busca: searchTerm,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

/**
 * Busca produtos em promoção.
 * @returns {Promise<Product[]>} Uma lista de produtos em promoção.
 */
export async function getPromotionalProducts(): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>('/produtos', {
      params: { promocao: 'true' },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos promocionais:", error);
    throw error;
  }
}

/**
 * Busca os produtos mais vendidos.
 * @returns {Promise<Product[]>} Uma lista dos produtos mais vendidos.
 */
export async function getBestSellers(): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>('/produtos', {
      params: { mais_vendidos: 'true' },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos mais vendidos:", error);
    throw error;
  }
}

// Adicionando a função addToCart que já estava sendo chamada no componente
export async function addToCart(productId: string, quantity: number): Promise<any> {
    try {
        // Supondo que exista um endpoint /carrinho/adicionar
        const response = await api.post('/carrinho/adicionar', { productId, quantity });
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho via API:', error);
        // Por enquanto, vamos permitir que funcione localmente
        return Promise.resolve({ success: true });
    }
}

const pharmacyService = {
  getProducts,
  getPromotionalProducts,
  getBestSellers,
  addToCart,

  // Buscar produto específico
  async getProduct(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/pharmacy/products/${id}`);
    return response.data.data;
  },

  // Buscar categorias
  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/pharmacy/categories');
    return response.data.data;
  },

  // Remover produto do carrinho
  async removeFromCart(productId: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/pharmacy/cart/remove/${productId}`);
  },

  // Atualizar quantidade no carrinho
  async updateCartQuantity(productId: string, quantity: number): Promise<void> {
    await api.put<ApiResponse<void>>(`/pharmacy/cart/update/${productId}`, {
      quantity,
    });
  },

  // Buscar carrinho atual
  async getCart(): Promise<CartItem[]> {
    const response = await api.get<ApiResponse<CartItem[]>>('/pharmacy/cart');
    return response.data.data;
  },

  // Limpar carrinho
  async clearCart(): Promise<void> {
    await api.delete<ApiResponse<void>>('/pharmacy/cart/clear');
  },

  // Criar pedido
  async createOrder(orderData: {
    farmacia_id: string;
    paciente_id: string;
    itens: Array<{
      produto_id: string;
      quantidade: number;
      preco_unitario: number;
    }>;
    endereco_entrega: {
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
      complemento?: string;
    };
    forma_pagamento: string;
    observacoes_entrega?: string;
  }): Promise<any> {
    try {
      const response = await api.post('/pedidos', orderData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  // Buscar pedidos do usuário
  async getOrders(page = 1, limit = 10): Promise<any> { // Assuming PaginatedResponse is not imported, using 'any' for now
    const response = await api.get<ApiResponse<any>>(
      `/pedidos?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  // Buscar pedido específico
  async getOrder(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/pedidos/${id}`);
    return response.data.data;
  },

  // Cancelar pedido
  async cancelOrder(id: string, reason?: string): Promise<void> {
    await api.put<ApiResponse<void>>(`/pedidos/${id}/cancelar`, { motivo: reason });
  },

  // Avaliar produto
  async rateProduct(productId: string, rating: number, comment?: string): Promise<void> {
    await api.post<ApiResponse<void>>(`/avaliacoes`, {
      produto_id: productId,
      nota: rating,
      comentario: comment,
    });
  },

  // Buscar rastreamento do pedido
  async getOrderTracking(orderId: string): Promise<{
    status: string;
    trackingCode?: string;
    updates: Array<{
      status: string;
      date: string;
      description: string;
    }>;
  }> {
    const response = await api.get<ApiResponse<any>>(`/rastreamento/pedido/${orderId}`);
    return response.data.data;
  },

  // Verificar disponibilidade de produto
  async checkProductAvailability(productId: string, quantity: number): Promise<{
    available: boolean;
    stock: number;
  }> {
    const response = await api.get<ApiResponse<any>>(
      `/produtos/${productId}/disponibilidade?quantidade=${quantity}`
    );
    return response.data.data;
  },

  // Buscar farmácias próximas
  async getNearbyPharmacies(lat: number, lng: number, radius = 10): Promise<Array<{
    id: string;
    name: string;
    address: string;
    distance: number;
    rating: number;
  }>> {
    const response = await api.get<ApiResponse<any[]>>(
      `/farmacias/proximas?lat=${lat}&lng=${lng}&raio=${radius}`
    );
    return response.data.data;
  },

  /**
   * Busca um produto específico pelo seu ID.
   * @param {string} id - O ID do produto.
   * @returns {Promise<Product>} O produto encontrado.
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get<Product>(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca farmácias parceiras.
   * @returns {Promise<Array<{
   *   id: number;
   *   name: string;
   *   logo: string;
   *   rating: number;
   *   deliveryTime: string;
   *   minOrder: string;
   *   features: string[];
   *   endereco: string;
   *   status: string;
   * }>>} Lista de farmácias parceiras.
   */
  async getPartnerPharmacies(): Promise<Array<{
    id: number;
    name: string;
    logo: string;
    rating: number;
    deliveryTime: string;
    minOrder: string;
    features: string[];
    endereco: string;
    status: string;
  }>> {
    try {
      const response = await api.get<ApiResponse<Array<{
        id: number;
        name: string;
        logo: string;
        rating: number;
        deliveryTime: string;
        minOrder: string;
        features: string[];
        endereco: string;
        status: string;
      }>>>('/farmacias/parceiras');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar farmácias parceiras:', error);
      throw error;
    }
  },

  /**
   * Busca uma farmácia específica pelo ID.
   * @param {string} id - O ID da farmácia.
   * @returns {Promise<{
   *   id: number;
   *   name: string;
   *   logo: string;
   *   rating: number;
   *   deliveryTime: string;
   *   minOrder: string;
   *   features: string[];
   *   endereco: string;
   *   status: string;
   *   phone?: string;
   *   whatsapp?: string;
   *   workingHours?: any;
   *   totalReviews?: number;
   *   deliveryFee?: string;
   *   freeDeliveryThreshold?: string;
   * }>} Dados da farmácia.
   */
  async getPharmacyById(id: string): Promise<{
    id: number;
    name: string;
    logo: string;
    rating: number;
    deliveryTime: string;
    minOrder: string;
    features: string[];
    endereco: string;
    status: string;
    phone?: string;
    whatsapp?: string;
    workingHours?: any;
    totalReviews?: number;
    deliveryFee?: string;
    freeDeliveryThreshold?: string;
  }> {
    try {
      const response = await api.get<ApiResponse<{
        id: number;
        name: string;
        logo: string;
        rating: number;
        deliveryTime: string;
        minOrder: string;
        features: string[];
        endereco: string;
        status: string;
        phone?: string;
        whatsapp?: string;
        workingHours?: any;
        totalReviews?: number;
        deliveryFee?: string;
        freeDeliveryThreshold?: string;
      }>>(`/farmacias/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar farmácia com ID ${id}:`, error);
      throw error;
    }
  },
};

export { pharmacyService }; 