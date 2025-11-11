import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  StarIcon, 
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
  ShieldIcon,
  AwardIcon,
  HeartIcon,
  ShoppingBagIcon,
  PercentIcon,
  ArrowLeftIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  SparklesIcon
} from 'lucide-react';
import { useCartStore } from '../../store/business';
import { pharmacyService } from "../../services/pharmacy/pharmacyService";
import { categoriaService } from '../../lib/api';
import { useApi } from '../../hooks/api/useApi';
import { Loading } from '../../components/ui/loading';
import { Product } from '../../types/api';

const getCurrentStatus = (workingHours: any) => {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const today = workingHours?.[day];
  
  if (!today || !today.isOpen) return { status: 'Fechado', color: 'text-red-600' };
  
  const isOpen = time >= today.open && time <= today.close;
  return {
    status: isOpen ? 'Aberto' : 'Fechado',
    color: isOpen ? 'text-green-600' : 'text-red-600'
  };
};

export const PharmacyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { items, addItem } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Hook para buscar dados da farmácia
  const { 
    data: pharmacyData, 
    loading, 
    error, 
    execute: fetchPharmacy 
  } = useApi(() => pharmacyService.getPharmacyById(id!));

  // Hook para buscar categorias da farmácia
  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError, 
    execute: fetchCategories 
  } = useApi(() => {
    const farmaciaId = pharmacyData?.id || (id ? parseInt(id) : undefined);
    return categoriaService.getCategoriasFormatadas(farmaciaId);
  });

  const selectedCategoryName = useMemo(() => {
    if (selectedCategory === 'all' || !categories) return '';
    const found = categories.find((category) => category.id.toString() === selectedCategory);
    return found?.name?.toLowerCase() ?? '';
  }, [selectedCategory, categories]);

  const normalizedSearchTerm = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);

  // Hooks para buscar dados da API
  const { 
    data: products, 
    loading: productsLoading, 
    error: productsError, 
    execute: fetchProducts 
  } = useApi(pharmacyService.getProducts);

  const { 
    data: promotionalProducts, 
    loading: promoLoading, 
    execute: fetchPromotional 
  } = useApi(pharmacyService.getPromotionalProducts);

  // Carregar dados na inicialização
  useEffect(() => {
    if (id) {
      fetchPharmacy();
    }
    fetchProducts();
    fetchPromotional();
  }, [id]);

  // Carregar categorias quando os dados da farmácia forem carregados
  useEffect(() => {
    if (pharmacyData?.id) {
      fetchCategories();
    }
  }, [pharmacyData]);

  // Usar dados reais da farmácia
  const displayPharmacyData = pharmacyData;
  const currentStatus = getCurrentStatus(displayPharmacyData?.workingHours);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !displayPharmacyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Erro ao carregar farmácia
        </h2>
        <p className="text-gray-600 text-center mb-4">
          {error || 'Não foi possível carregar os dados da farmácia.'}
        </p>
        <Button onClick={() => navigate('/farmacia')} variant="outline">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Voltar para farmácias
        </Button>
      </div>
    );
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await pharmacyService.addToCart(product.id, 1);
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        pharmacy: product.pharmacy
      });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const renderProductCard = (product: Product) => {
    return (
      <Card 
        key={product.id} 
        className="group cursor-pointer overflow-hidden border border-blue-100/60 shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 bg-white/90 backdrop-blur-sm rounded-2xl"
        onClick={() => navigate(`/farmacia/produto/${product.id}`)}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {product.originalPrice && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </div>
            )}
            <button 
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <HeartIcon className="w-5 h-5 text-teal-600 hover:fill-teal-600 transition-all" />
            </button>
          </div>
          <div className="p-5 space-y-3">
            {product.originalPrice && (
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wide">
                  Oferta Especial
                </span>
              </div>
            )}
            <h3 className="font-bold text-blue-900 text-base group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[44px]">
              {product.name}
            </h3>
            <div className="text-sm text-blue-700/70 flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-teal-500" />
              <span className="truncate">{product.farmacia_nome || displayPharmacyData.name}</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              {product.originalPrice && (
                <span className="text-sm text-blue-400/70 line-through font-medium">
                  R$ {(Number(product.originalPrice) || 0).toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                R$ {(Number(product.price) || 0).toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              onClick={e => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProductGrid = (products: Product[] | null, loading: boolean, error: string | null) => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Loading text="Carregando produtos..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar produtos: {error}</p>
          <Button onClick={() => fetchProducts()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      );
    }

    const filteredProducts = (products || []).filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category?.toLowerCase() === selectedCategoryName ||
        product.category === selectedCategory;

      const matchesSearch =
        normalizedSearchTerm === '' ||
        product.name?.toLowerCase().includes(normalizedSearchTerm);

      return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-14 bg-blue-50/70 border border-blue-100 rounded-2xl text-blue-800">
          <p className="font-semibold">Nenhum produto encontrado</p>
          <p className="text-sm mt-1">Ajuste a categoria ou refine sua busca para ver outros itens.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(renderProductCard)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-10">
      {/* Header com Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-3xl overflow-hidden shadow-[0_25px_60px_-20px_rgba(37,99,235,0.45)] mx-4 mt-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-blue-900/40"></div>

        <div className="relative w-full px-6 sm:px-8 lg:px-10 py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/15 h-10 w-10 rounded-xl border border-white/30"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>

              <div className="flex items-start gap-5">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center overflow-hidden">
                  <img
                    src={displayPharmacyData.logo}
                    alt={displayPharmacyData.name}
                    className="w-full h-full object-contain p-3"
                  />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold">
                    <TrendingUpIcon className="w-4 h-4" />
                    Farmácia Parceira Vitalis
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black leading-tight flex flex-col md:flex-row md:items-center gap-2">
                    {displayPharmacyData.name}
                    <span className="text-yellow-300 text-base md:text-lg font-semibold">{displayPharmacyData.category || 'Saúde & Bem-estar'}</span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                      <StarIcon className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                      <span className="font-semibold">{displayPharmacyData.rating}</span>
                      <span className="text-blue-100/80">({displayPharmacyData.totalReviews} avaliações)</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ${currentStatus.color}`}>
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      <span className="text-xs uppercase tracking-wide">{currentStatus.status}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                      <TruckIcon className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm font-semibold text-white">{displayPharmacyData.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`h-11 px-5 rounded-xl border border-white/30 text-white hover:bg-white/15 ${isFavorite ? 'bg-white/20' : ''}`}
              >
                <HeartIcon className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
                {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/cart')}
                className="h-11 px-6 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                <ShoppingBagIcon className="w-4 h-4 mr-2" />
                Carrinho ({items.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 pt-8 space-y-8">
        {/* Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                <TruckIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-1">Entrega</h3>
                <p className="text-sm text-blue-800 font-semibold">{displayPharmacyData.deliveryTime}</p>
                <p className="text-xs text-blue-700/70 mt-1">
                  {displayPharmacyData.deliveryFee} • Grátis acima de {displayPharmacyData.freeDeliveryThreshold}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shadow-inner">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-1">Funcionamento</h3>
                <p className="text-sm text-blue-800 font-semibold">Seg-Dom: 08:00-22:00</p>
                <p className="text-xs text-blue-700/70 mt-1">Atendimento 24h</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-100 text-red-500 flex items-center justify-center shadow-inner">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-1">Endereço</h3>
                <p className="text-sm text-blue-800 font-semibold">
                  {displayPharmacyData.endereco || 'Endereço não disponível'}
                </p>
                <p className="text-xs text-blue-700/70 mt-1">Centro, São Paulo</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AwardIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">Diferenciais</h2>
            </div>
            {displayPharmacyData.features && displayPharmacyData.features.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayPharmacyData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1.5 rounded-full flex items-center gap-1"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {feature}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-blue-700/70">Esta farmácia parceira ainda não cadastrou diferenciais.</p>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar produtos nesta farmácia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <PercentIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">Categorias</h2>
            </div>
            <ScrollArea className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className={`h-24 flex-col gap-2 rounded-2xl transition-all duration-300 border-2 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 text-white shadow-lg border-transparent'
                      : 'border-transparent bg-blue-50 hover:bg-blue-100 text-blue-700'
                  }`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <span className="text-2xl">🏥</span>
                  <span className="text-xs font-semibold">Todos</span>
                </Button>
                {categoriesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                ) : categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                      className={`h-24 flex-col gap-2 rounded-2xl transition-all duration-300 border-2 ${
                        selectedCategory === category.id.toString()
                          ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 text-white shadow-lg border-transparent'
                          : 'border-transparent bg-blue-50 hover:bg-blue-100 text-blue-700'
                      }`}
                      onClick={() => setSelectedCategory(category.id.toString())}
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-xs font-semibold text-center leading-tight px-2 whitespace-normal break-words">
                        {category.name}
                      </span>
                      {category.productCount > 0 && (
                        <span className="text-[11px] opacity-80">({category.productCount})</span>
                      )}
                    </Button>
                  ))
                ) : null}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Product Sections */}
        <Card className="bg-white/85 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="popular" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-blue-50/60 rounded-xl p-1">
                <TabsTrigger value="popular" className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow">
                  <StarIcon className="w-4 h-4" />
                  Mais Vendidos
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow">
                  <TrendingUpIcon className="w-4 h-4" />
                  Em Alta
                </TabsTrigger>
                <TabsTrigger value="offers" className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow">
                  <PercentIcon className="w-4 h-4" />
                  Ofertas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="space-y-6">
                <h3 className="text-xl font-bold text-blue-900 mb-1">Produtos Mais Vendidos</h3>
                <p className="text-sm text-blue-700/70">Seleção dos produtos mais pedidos nesta farmácia parceira.</p>
                {renderProductGrid(products, productsLoading, productsError)}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <h3 className="text-xl font-bold text-blue-900 mb-1">Produtos em Alta</h3>
                <p className="text-sm text-blue-700/70">Itens que estão chamando a atenção dos pacientes esta semana.</p>
                {renderProductGrid(products, productsLoading, productsError)}
              </TabsContent>

              <TabsContent value="offers" className="space-y-6">
                <h3 className="text-xl font-bold text-blue-900 mb-1">Ofertas Especiais</h3>
                <p className="text-sm text-blue-700/70">Aproveite promoções exclusivas para pacientes Vitalis.</p>
                {renderProductGrid(promotionalProducts, promoLoading, null)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyDetails; 