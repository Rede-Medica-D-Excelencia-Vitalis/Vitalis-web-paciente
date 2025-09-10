import React, { useState, useEffect } from 'react';
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
  MessageCircleIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon
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
        className="w-full max-w-xs cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
        onClick={() => navigate(`/farmacia/produto/${product.id}`)}
      >
        <CardContent className="p-4">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4 group-hover:brightness-110 transition-all"
            />
            {product.originalPrice && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </div>
            )}
          </div>
          <div className="space-y-2">
            {product.originalPrice && (
              <div className="flex items-center gap-2">
                <PercentIcon className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500 font-semibold">
                  Oferta Especial
                </span>
              </div>
            )}
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  R$ {Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              <span className="text-lg font-bold text-blue-600">
                R$ {Number(product.price).toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={e => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              <ShoppingBagIcon className="w-4 h-4 mr-2" />
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

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum produto encontrado</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(renderProductCard)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-end">
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-4">
                  <img
                    src={displayPharmacyData.logo}
                    alt={displayPharmacyData.name}
                    className="w-16 h-16 rounded-lg bg-white p-2"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">{displayPharmacyData.name}</h1>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>{displayPharmacyData.rating}</span>
                        <span className="text-gray-300">({displayPharmacyData.totalReviews})</span>
                      </div>
                      <div className={`flex items-center gap-1 ${currentStatus.color}`}>
                        <div className={`w-2 h-2 rounded-full ${currentStatus.color.replace('text-', 'bg-')}`}></div>
                        <span>{currentStatus.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`text-white hover:bg-white/20 ${isFavorite ? 'text-red-400' : ''}`}
                >
                  <HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-red-400' : ''}`} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/cart')}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <ShoppingBagIcon className="w-4 h-4 mr-2" />
                  Carrinho ({items.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TruckIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Entrega</h3>
                  <p className="text-sm text-gray-600">{displayPharmacyData.deliveryTime}</p>
                  <p className="text-xs text-gray-500">
                    {displayPharmacyData.deliveryFee} • Grátis acima de {displayPharmacyData.freeDeliveryThreshold}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ClockIcon className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Funcionamento</h3>
                  <p className="text-sm text-gray-600">Seg-Dom: 08:00-22:00</p>
                  <p className="text-xs text-gray-500">Atendimento 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Endereço</h3>
                  <p className="text-sm text-gray-600">
                    {displayPharmacyData.endereco || 'Endereço não disponível'}
                  </p>
                  <p className="text-xs text-gray-500">Centro, São Paulo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Diferenciais</h2>
            <div className="flex flex-wrap gap-2">
              {displayPharmacyData.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  {feature}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar produtos nesta farmácia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Categorias</h2>
            <ScrollArea className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="h-20 flex-col gap-2"
                  onClick={() => setSelectedCategory('all')}
                >
                  <span className="text-2xl">🏥</span>
                  <span className="text-xs">Todos</span>
                </Button>
                {categoriesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                ) : categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setSelectedCategory(category.id.toString())}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {category.productCount}
                      </span>
                    </Button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <InfoIcon className="w-8 h-8 mx-auto mb-2" />
                    <p>Nenhuma categoria disponível</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            {categoriesError && (
              <div className="mt-4 text-center text-sm text-red-600">
                Erro ao carregar categorias.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Sections */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="popular" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="popular" className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4" />
                  Mais Vendidos
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <TrendingUpIcon className="w-4 h-4" />
                  Em Alta
                </TabsTrigger>
                <TabsTrigger value="offers" className="flex items-center gap-2">
                  <PercentIcon className="w-4 h-4" />
                  Ofertas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
                {renderProductGrid(products, productsLoading, productsError)}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Produtos em Alta</h3>
                {renderProductGrid(products, productsLoading, productsError)}
              </TabsContent>

              <TabsContent value="offers" className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ofertas Especiais</h3>
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