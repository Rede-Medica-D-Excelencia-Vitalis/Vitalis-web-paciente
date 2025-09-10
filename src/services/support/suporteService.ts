import { api } from "../../lib/api";

export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  categoria_id: number;
  categoria_nome: string;
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  criado_por: number;
  criado_por_nome: string;
  data_criacao: string;
  data_atualizacao: string;
  data_fechamento?: string;
  total_mensagens?: number;
  ultima_mensagem?: string;
}

export interface Mensagem {
  id: number;
  ticket_id: number;
  usuario_id: number;
  usuario_nome: string;
  tipo_usuario: string;
  comentario: string;
  criado_em: string;
}

export interface Artigo {
  id: number;
  titulo: string;
  conteudo: string;
  categoria_id: number;
  categoria_nome: string;
  tags: string[];
  autor_id: number;
  autor_nome: string;
  status: 'ativo' | 'inativo' | 'rascunho';
  visualizacoes: number;
  data_criacao: string;
  data_atualizacao: string;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  total_artigos: number;
}

export interface CriarTicketData {
  titulo: string;
  descricao: string;
  categoria_id: number;
  prioridade?: 'baixa' | 'normal' | 'alta' | 'urgente';
}

export interface EnviarMensagemData {
  conteudo: string;
}

class SuporteService {
  // ===== TICKETS =====
  
  async listarTickets(status?: string, categoria?: number): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (categoria) params.append('categoria', categoria.toString());
    
    const response = await api.get(`/suporte/tickets/meus?${params.toString()}`);
    return response.data;
  }

  async buscarTicket(id: number): Promise<Ticket> {
    const response = await api.get(`/suporte/tickets/${id}`);
    return response.data;
  }

  async criarTicket(data: CriarTicketData): Promise<Ticket> {
    const response = await api.post('/suporte/tickets', data);
    return response.data;
  }

  async atualizarTicket(id: number, data: Partial<CriarTicketData> & { status?: string }): Promise<void> {
    await api.put(`/suporte/tickets/${id}`, data);
  }

  async deletarTicket(id: number): Promise<void> {
    await api.delete(`/suporte/tickets/${id}`);
  }

  // ===== MENSAGENS =====
  
  async listarMensagens(ticketId: number): Promise<Mensagem[]> {
    // Os comentários já vêm com o ticket, então buscamos o ticket completo
    const response = await api.get(`/suporte/tickets/${ticketId}`);
    return response.data.comentarios || [];
  }

  async enviarMensagem(ticketId: number, data: EnviarMensagemData): Promise<Mensagem> {
    const response = await api.post(`/suporte/tickets/${ticketId}/comentarios`, {
      comentario: data.conteudo
    });
    return response.data.comentario;
  }

  // ===== ARTIGOS =====
  
  async listarArtigos(categoria_id?: number, limit = 20, offset = 0): Promise<Artigo[]> {
    const params = new URLSearchParams();
    if (categoria_id) params.append('categoria', categoria_id.toString());
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await api.get(`/ajuda?${params.toString()}`);
    return response.data;
  }

  async buscarArtigo(id: number): Promise<Artigo> {
    const response = await api.get(`/ajuda/${id}`);
    return response.data;
  }

  async criarArtigo(data: {
    titulo: string;
    conteudo: string;
    categoria_id: number;
    tags?: string[];
  }): Promise<Artigo> {
    const response = await api.post('/suporte/artigos', data);
    return response.data;
  }

  async atualizarArtigo(id: number, data: {
    titulo?: string;
    conteudo?: string;
    categoria_id?: number;
    tags?: string[];
    status?: string;
  }): Promise<void> {
    await api.put(`/suporte/artigos/${id}`, data);
  }

  async deletarArtigo(id: number): Promise<void> {
    await api.delete(`/suporte/artigos/${id}`);
  }

  // ===== CATEGORIAS =====
  
  async listarCategorias(): Promise<Categoria[]> {
    const response = await api.get('/ajuda/categorias');
    return response.data;
  }

  async criarCategoria(data: {
    nome: string;
    descricao: string;
    icone: string;
  }): Promise<Categoria> {
    const response = await api.post('/suporte/categorias', data);
    return response.data;
  }

  async atualizarCategoria(id: number, data: {
    nome?: string;
    descricao?: string;
    icone?: string;
  }): Promise<void> {
    await api.put(`/suporte/categorias/${id}`, data);
  }

  async deletarCategoria(id: number): Promise<void> {
    await api.delete(`/suporte/categorias/${id}`);
  }

  async artigosPorCategoria(categoriaId: number, limit = 20, offset = 0): Promise<Artigo[]> {
    const params = new URLSearchParams();
    params.append('categoria', categoriaId.toString());
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await api.get(`/ajuda?${params.toString()}`);
    return response.data;
  }

  // ===== PESQUISA =====
  
  async pesquisarArtigos(termo: string, limit = 20, offset = 0): Promise<Artigo[]> {
    const params = new URLSearchParams();
    params.append('busca', termo);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await api.get(`/ajuda?${params.toString()}`);
    return response.data;
  }
}

export const suporteService = new SuporteService(); 