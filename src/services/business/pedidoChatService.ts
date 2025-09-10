import { api } from "../../lib/api";

export interface Message {
  id: number;
  chat_id: number;
  autor_id: number;
  conteudo: string;
  tipo: string;
  criado_em: string;
  autor_nome?: string;
  tipo_usuario?: string;
}

export interface Chat {
  id: number;
  pedido_id: number;
  tipo_problema: string;
  descricao: string;
  prioridade: string;
  status: 'aberto' | 'em_andamento' | 'fechado';
  criado_em: string;
  farmacia_nome: string;
  paciente_nome: string;
}

export const pedidoChatService = {
  // Listar chats de um pedido
  async listarChats(pedidoId: number): Promise<{ chats: Chat[] }> {
    const response = await api.get(`/pedido-chat/listar?pedido_id=${pedidoId}`);
    return response.data;
  },

  // Criar novo chat
  async criarChat(data: {
    pedido_id: number;
    tipo_problema: string;
    descricao: string;
    prioridade: string;
  }): Promise<{ chat: Chat }> {
    const response = await api.post('/pedido-chat/criar', data);
    return response.data;
  },

  // Buscar chat específico
  async buscarChat(chatId: number): Promise<{ chat: Chat; mensagens: Message[] }> {
    const response = await api.get(`/pedido-chat/${chatId}`);
    return response.data;
  },

  // Enviar mensagem
  async enviarMensagem(chatId: number, data: {
    conteudo: string;
    tipo: string;
  }): Promise<{ dados: Message }> {
    const response = await api.post(`/pedido-chat/${chatId}/mensagem`, data);
    return response.data;
  },

  // Atualizar status do chat
  async atualizarStatus(chatId: number, status: string): Promise<void> {
    await api.put(`/pedido-chat/${chatId}/status`, { status });
  }
};
