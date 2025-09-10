import { api, ApiResponse } from "../../lib/api";

export interface Artigo {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: {
    id: number;
    nome: string;
  };
  visualizacoes: number;
  comentarios: number;
  favoritos: number;
  criado_em: string;
  destaque: boolean;
  ativo: boolean;
}

export interface Comentario {
  id: number;
  usuario: {
    id: number;
    nome: string;
    imagem_perfil?: string;
  };
  comentario: string;
  criado_em: string;
  curtidas: number;
  respostas?: Comentario[];
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

class ArtigosService {
  // Buscar todos os artigos
  async getArtigos(filtros?: {
    categoria?: number;
    busca?: string;
    ordenacao?: 'recentes' | 'populares' | 'avaliacao';
  }): Promise<Artigo[]> {
    const params = new URLSearchParams();
    if (filtros?.categoria) params.append('categoria', filtros.categoria.toString());
    if (filtros?.busca) params.append('busca', filtros.busca);
    if (filtros?.ordenacao) params.append('ordenacao', filtros.ordenacao);

    const response = await api.get(`/ajuda?${params.toString()}`);
    return response.data;
  }

  // Buscar artigo detalhado
  async getArtigoDetalhado(id: number): Promise<Artigo> {
    const response = await api.get(`/ajuda/${id}`);
    return response.data;
  }

  // Buscar categorias
  async getCategorias(): Promise<Categoria[]> {
    const response = await api.get('/ajuda/categorias');
    return response.data;
  }

  // Buscar artigos em destaque
  async getArtigosDestaque(): Promise<Artigo[]> {
    const response = await api.get('/ajuda/destaque');
    return response.data;
  }

  // Buscar artigos favoritos do usuário
  async getArtigosFavoritos(): Promise<Artigo[]> {
    const response = await api.get('/ajuda/usuario/favoritos');
    return response.data;
  }

  // Buscar comentários de um artigo
  async getComentariosArtigo(artigoId: number): Promise<Comentario[]> {
    const response = await api.get(`/ajuda/${artigoId}/comentarios`);
    return response.data;
  }

  // Curtir artigo
  async curtirArtigo(artigoId: number, tipo: 'like' | 'love' | 'helpful' | 'bookmark'): Promise<void> {
    await api.post(`/ajuda/${artigoId}/curtir`, { tipo });
  }

  // Favoritar artigo
  async favoritarArtigo(artigoId: number): Promise<void> {
    await api.post(`/ajuda/${artigoId}/favorito`);
  }

  // Comentar artigo
  async comentarArtigo(artigoId: number, comentario: string): Promise<void> {
    await api.post(`/ajuda/${artigoId}/comentarios`, { comentario });
  }

  // Registrar visualização
  async registrarVisualizacao(artigoId: number): Promise<void> {
    await api.post(`/ajuda/${artigoId}/visualizar`);
  }

  // Buscar artigos relacionados
  async getArtigosRelacionados(artigoId: number): Promise<Artigo[]> {
    const response = await api.get(`/ajuda/${artigoId}/relacionados`);
    return response.data;
  }

  // Buscar artigos por tag
  async getArtigosPorTag(tag: string): Promise<Artigo[]> {
    const response = await api.get(`/ajuda/tag/${tag}`);
    return response.data;
  }

  // Buscar estatísticas do artigo
  async getEstatisticasArtigo(artigoId: number): Promise<{
    visualizacoes: number;
    curtidas: number;
    comentarios: number;
    favoritos: number;
    avaliacao_media: number;
  }> {
    const response = await api.get(`/ajuda/${artigoId}/estatisticas`);
    return response.data;
  }

  // Avaliar artigo
  async avaliarArtigo(artigoId: number, avaliacao: number): Promise<void> {
    await api.post(`/ajuda/${artigoId}/avaliar`, { avaliacao });
  }

  // Buscar interações do usuário
  async getInteracoesUsuario(artigoId: number): Promise<{
    curtido: boolean;
    favoritado: boolean;
    tipo_curtida?: string;
    avaliacao?: number;
  }> {
    const response = await api.get(`/ajuda/${artigoId}/interacoes`);
    return response.data;
  }
}

export const artigosService = new ArtigosService(); 