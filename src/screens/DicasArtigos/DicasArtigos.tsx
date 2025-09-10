import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Search, 
  Heart, 
  MessageCircle,
  Eye,
  Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { artigosService, Artigo, Categoria } from '../../services/data/artigosService';
import { useAuth } from '../../hooks/auth/useAuth';

const DicasArtigos: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [artigosDestaque, setArtigosDestaque] = useState<Artigo[]>([]);
  const [artigosFavoritos, setArtigosFavoritos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [ordenacao, setOrdenacao] = useState<'recentes' | 'populares' | 'avaliacao'>('recentes');

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (user) {
      carregarFavoritos();
    }
  }, [user]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [artigosData, categoriasData, destaqueData] = await Promise.all([
        artigosService.getArtigos(),
        artigosService.getCategorias(),
        artigosService.getArtigosDestaque()
      ]);
      
      setArtigos(artigosData);
      setCategorias(categoriasData);
      setArtigosDestaque(destaqueData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarFavoritos = async () => {
    try {
      const favoritos = await artigosService.getArtigosFavoritos();
      setArtigosFavoritos(favoritos);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const filtrarArtigos = async () => {
    try {
      setLoading(true);
      const filtros = {
        categoria: categoriaSelecionada || undefined,
        busca: busca || undefined,
        ordenacao
      };
      const artigosFiltrados = await artigosService.getArtigos(filtros);
      setArtigos(artigosFiltrados);
    } catch (error) {
      console.error('Erro ao filtrar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    filtrarArtigos();
  };

  const handleLimparFiltros = () => {
    setBusca('');
    setCategoriaSelecionada(null);
    setOrdenacao('recentes');
    carregarDados();
  };

  const handleArtigoClick = (artigoId: number) => {
    navigate(`/artigo/${artigoId}`);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderArtigoCard = (artigo: Artigo) => (
    <Card 
      key={artigo.id} 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => handleArtigoClick(artigo.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {artigo.categoria.nome}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {artigo.titulo}
            </h3>
            
            <p className="text-gray-600 text-sm line-clamp-3">
              {artigo.conteudo.substring(0, 150)}...
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Meta informações */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{artigo.visualizacoes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={12} />
              <span>{artigo.comentarios}</span>
            </div>
          </div>
          
          <span>{formatarData(artigo.criado_em)}</span>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bookmark size={14} />
              <span>{artigo.favoritos}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            Ler mais →
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dicas & Artigos 📚
          </h1>
          <p className="text-gray-600">
            Descubra dicas valiosas e artigos informativos para cuidar melhor da sua saúde
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros e Busca */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Busca */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Buscar artigos..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <select
                  value={categoriaSelecionada || ''}
                  onChange={(e) => setCategoriaSelecionada(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação */}
              <div>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recentes">Mais recentes</option>
                  <option value="populares">Mais populares</option>
                  <option value="avaliacao">Melhor avaliados</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button onClick={handleBuscar} className="flex items-center gap-2">
                <Search size={16} />
                Buscar
              </Button>
              
              <Button variant="outline" onClick={handleLimparFiltros}>
                Limpar filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Principal */}
        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos">Todos os Artigos</TabsTrigger>
            <TabsTrigger value="destaque">Em Destaque</TabsTrigger>
            {user && <TabsTrigger value="favoritos">Meus Favoritos</TabsTrigger>}
            <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artigos.map(renderArtigoCard)}
            </div>
            
            {artigos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum artigo encontrado.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="destaque" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artigosDestaque.map(renderArtigoCard)}
            </div>
            
            {artigosDestaque.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum artigo em destaque no momento.</p>
              </div>
            )}
          </TabsContent>

          {user && (
            <TabsContent value="favoritos" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artigosFavoritos.map(renderArtigoCard)}
              </div>
              
              {artigosFavoritos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Você ainda não tem artigos favoritos.</p>
                  <Button 
                    onClick={() => navigate('/dicas-artigos')} 
                    className="mt-4"
                  >
                    Explorar artigos
                  </Button>
                </div>
              )}
            </TabsContent>
          )}

          <TabsContent value="categorias" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorias.map((categoria) => (
                <Card 
                  key={categoria.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => {
                    setCategoriaSelecionada(categoria.id);
                    setOrdenacao('recentes');
                    filtrarArtigos();
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">{categoria.nome}</h3>
                    {categoria.descricao && (
                      <p className="text-gray-600 text-sm">{categoria.descricao}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DicasArtigos; 