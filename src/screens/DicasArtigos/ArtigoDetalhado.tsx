import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, Eye, ThumbsUp, Clock, User, Calendar, Tag, ArrowLeft, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { artigosService } from '../../services/data/artigosService';
import { useAuth } from '../../hooks/auth/useAuth';

interface Artigo {
  id: number;
  titulo: string;
  descricao?: string;
  conteudo: string;
  categoria: {
    id: number;
    nome: string;
  };
  tags?: string[];
  visualizacoes: number;
  curtidas?: number;
  comentarios: number;
  favoritos: number;
  data_criacao?: string;
  autor?: string;
  tempo_leitura?: number;
  avaliacao?: number;
}

interface Comentario {
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

const ArtigoDetalhado: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInteractions, setUserInteractions] = useState({
    curtido: false,
    favoritado: false,
    tipoCurtida: 'like' as 'like' | 'love' | 'helpful' | 'bookmark'
  });

  useEffect(() => {
    if (id) {
      carregarArtigo();
      carregarComentarios();
      registrarVisualizacao();
    }
  }, [id]);

  const carregarArtigo = async () => {
    try {
      setLoading(true);
      const data = await artigosService.getArtigoDetalhado(parseInt(id!));
      setArtigo(data);
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarComentarios = async () => {
    try {
      const data = await artigosService.getComentariosArtigo(parseInt(id!));
      setComentarios(data);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const registrarVisualizacao = async () => {
    try {
      await artigosService.registrarVisualizacao(parseInt(id!));
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  const handleCurtir = async (tipo: 'like' | 'love' | 'helpful' | 'bookmark') => {
    if (!user) return;
    
    try {
      await artigosService.curtirArtigo(parseInt(id!), tipo);
      setUserInteractions(prev => ({
        ...prev,
        curtido: true,
        tipoCurtida: tipo
      }));
      carregarArtigo(); // Recarregar para atualizar contadores
    } catch (error) {
      console.error('Erro ao curtir artigo:', error);
    }
  };

  const handleFavoritar = async () => {
    if (!user) return;
    
    try {
      await artigosService.favoritarArtigo(parseInt(id!));
      setUserInteractions(prev => ({
        ...prev,
        favoritado: !prev.favoritado
      }));
      carregarArtigo();
    } catch (error) {
      console.error('Erro ao favoritar artigo:', error);
    }
  };

  const handleComentar = async () => {
    if (!user || !novoComentario.trim()) return;
    
    try {
      await artigosService.comentarArtigo(parseInt(id!), novoComentario);
      setNovoComentario('');
      carregarComentarios();
      carregarArtigo();
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  };

  const handleCompartilhar = () => {
    if (navigator.share) {
      navigator.share({
        title: artigo?.titulo,
        text: artigo?.descricao,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarTempoLeitura = (minutos: number) => {
    if (minutos < 1) return 'Menos de 1 min';
    if (minutos === 1) return '1 minuto';
    return `${minutos} minutos`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Artigo não encontrado</h2>
          <Button onClick={() => navigate('/dicas-artigos')}>
            Voltar para Dicas & Artigos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dicas-artigos')}
            className="mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Dicas & Artigos
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cabeçalho do Artigo */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{artigo.categoria.nome}</Badge>
              {artigo.avaliacao && (
                <div className="flex items-center gap-1">
                  {renderStars(artigo.avaliacao)}
                  <span className="text-sm text-gray-600 ml-1">
                    ({(Number(artigo.avaliacao) || 0).toFixed(1)})
                  </span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {artigo.titulo}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {artigo.descricao}
            </p>

            {/* Meta informações */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{artigo.autor || 'Equipe Vitalis'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{artigo.data_criacao ? formatarData(artigo.data_criacao) : 'Data não informada'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{formatarTempoLeitura(artigo.tempo_leitura || 5)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{artigo.visualizacoes.toLocaleString()} visualizações</span>
              </div>
            </div>

            {/* Tags */}
            {artigo.tags && artigo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {artigo.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Conteúdo do Artigo */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
                />
              </CardContent>
            </Card>

            {/* Comentários */}
            <Card className="mt-8">
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <MessageCircle size={20} />
                  Comentários ({comentarios.length})
                </h3>
              </CardHeader>
              <CardContent>
                {/* Novo comentário */}
                {user && (
                  <div className="mb-6">
                    <textarea
                      value={novoComentario}
                      onChange={(e) => setNovoComentario(e.target.value)}
                      placeholder="Compartilhe sua opinião sobre este artigo..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button onClick={handleComentar} disabled={!novoComentario.trim()}>
                        Comentar
                      </Button>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Lista de comentários */}
                <div className="space-y-4">
                  {comentarios.map((comentario) => (
                    <div key={comentario.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {comentario.usuario.nome}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatarData(comentario.criado_em)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{comentario.comentario}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                              <ThumbsUp size={14} />
                              {comentario.curtidas}
                            </button>
                            <button className="text-gray-500 hover:text-blue-600">
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Ações do usuário */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-4">Interagir</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant={userInteractions.curtido ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCurtir('like')}
                        className="flex-1"
                      >
                        <ThumbsUp size={16} className="mr-2" />
                        Curtir ({artigo.curtidas})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCurtir('love')}
                      >
                        <Heart size={16} />
                      </Button>
                    </div>
                    
                    <Button
                      variant={userInteractions.favoritado ? "default" : "outline"}
                      size="sm"
                      onClick={handleFavoritar}
                      className="w-full"
                    >
                      <Bookmark size={16} className="mr-2" />
                      {userInteractions.favoritado ? 'Favoritado' : 'Favoritar'} ({artigo.favoritos})
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCompartilhar}
                      className="w-full"
                    >
                      <Share2 size={16} className="mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-4">Estatísticas</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visualizações</span>
                      <span className="font-semibold">{artigo.visualizacoes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Curtidas</span>
                      <span className="font-semibold">{artigo.curtidas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Comentários</span>
                      <span className="font-semibold">{artigo.comentarios}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Favoritos</span>
                      <span className="font-semibold">{artigo.favoritos}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Artigos relacionados */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-4">Artigos Relacionados</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Como Manter uma Vida Saudável</h5>
                      <p className="text-xs text-gray-600">Dicas práticas para uma vida mais equilibrada...</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Telemedicina: O Futuro da Saúde</h5>
                      <p className="text-xs text-gray-600">Entenda como a tecnologia está revolucionando...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtigoDetalhado; 