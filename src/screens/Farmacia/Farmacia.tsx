import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { 
  StarIcon, 
  TagIcon,
  TrendingUpIcon,
  PercentIcon,
  TruckIcon,
  ShieldIcon,
  ClockIcon,
  MapPinIcon,
  AwardIcon,
  HeartIcon,
  ShoppingBagIcon,
  ZapIcon,
  InfoIcon,
  AlertCircleIcon,
  SparklesIcon,
  PackageIcon,
  BadgeCheckIcon
} from 'lucide-react';
import { useCartStore } from '../../store/business';
import { pharmacyService } from '../../services/pharmacy/pharmacyService';
import { useApi } from '../../hooks/api/useApi';
import { Loading } from '../../components/ui/loading';
import { Product } from '../../types/api';
import { categoriaService, Categoria } from '../../lib/api';

export const Farmacia = () => {
  const navigate = useNavigate();
  const { items, addItem } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const { 
    data: bestSellers, 
    loading: bestSellersLoading, 
    execute: fetchBestSellers 
  } = useApi(pharmacyService.getBestSellers);

  const { 
    data: partnerPharmacies, 
    loading: partnerPharmaciesLoading, 
    error: partnerPharmaciesError, 
    execute: fetchPartnerPharmacies 
  } = useApi(pharmacyService.getPartnerPharmacies);

  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError, 
    execute: fetchCategories 
  } = useApi(() => {
    const farmaciaId = partnerPharmacies?.[0]?.id || 1;
    return categoriaService.getCategoriasFormatadas(farmaciaId);
  });

  // Carregar dados na inicialização
  useEffect(() => {
    fetchProducts();
    fetchPromotional();
    fetchBestSellers();
    fetchPartnerPharmacies();
  }, []);

  useEffect(() => {
    if (partnerPharmacies && partnerPharmacies.length > 0) {
      fetchCategories();
    }
  }, [partnerPharmacies]);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      fetchProducts(selectedCategory === 'all' ? undefined : selectedCategory);
    }
  }, [selectedCategory]);

  const handleAddToCart = async (product: Product) => {
    try {
      await pharmacyService.addToCart(product.id, 1);
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        pharmacy: {
          name: product.farmacia_nome || 'Farmácia',
          rating: 5.0
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const renderProductCard = (product: Product) => {
    if (!product || !product.name || typeof product.price === 'undefined') {
      return null;
    }

    return (
      <Card 
        key={product.id} 
        className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-2xl"
        onClick={() => navigate(`/farmacia/produto/${product.id}`)}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {product.originalPrice && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}
            
            <button 
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
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
            
            <h3 className="font-bold text-gray-900 text-base group-hover:text-teal-600 transition-colors line-clamp-2 min-h-[48px]">
              {product.name}
            </h3>
            
            <div className="text-sm text-gray-500 flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-teal-500" />
              <span className="truncate">{product.farmacia_nome || 'Farmácia'}</span>
            </div>
            
            <div className="flex items-baseline gap-2 pt-2">
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  R$ {(Number(product.originalPrice) || 0).toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                R$ {(Number(product.price) || 0).toFixed(2)}
              </span>
            </div>
            
            <Button
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
        <div className="flex justify-center py-12">
          <Loading text="Carregando produtos..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
          <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-4">Erro ao carregar produtos</p>
          <Button onClick={() => fetchProducts()} className="bg-red-500 hover:bg-red-600">
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <PackageIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhum produto encontrado</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.filter(product => product && product.name && typeof product.price !== 'undefined').map(renderProductCard)}
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Banner - Gradiente Moderno */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-3xl overflow-hidden shadow-[0_25px_60px_-20px_rgba(37,99,235,0.45)] mx-4 mt-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative w-full px-8 py-10 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-2xl">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-4 flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <SparklesIcon className="w-4 h-4" />
                Farmácia Online #1 em Vendas
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight flex items-center gap-3">
                <img src="/logo-small-1.png" alt="Vitalis" className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
                Farmácia <span className="text-yellow-300">Vitalis</span>
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
                Medicamentos e produtos de saúde com <span className="text-yellow-300 font-bold">entrega rápida</span> e <span className="text-yellow-300 font-bold">segura</span>
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <TruckIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-semibold">Entrega em 1h</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <ShieldIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-semibold">100% Original</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <PercentIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-semibold">Melhor Preço</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center">
                <div className="text-5xl font-black text-yellow-300">{items.length}</div>
                <div className="text-sm text-blue-100 mt-1 font-medium">Itens no carrinho</div>
              </div>
              <Button 
                onClick={() => navigate('/cart')}
                className="bg-white text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white font-bold px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                Ver Carrinho
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-0">
        {/* Categorias em Destaque */}
        <section className="bg-white shadow-xl px-8 py-8 border-b border-blue-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TagIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">Categorias em Destaque</h2>
          </div>
          
          <ScrollArea className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 pb-4">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={`h-32 w-full flex-col gap-2 rounded-2xl transition-all duration-300 transform hover:scale-105 p-3 ${
                  selectedCategory === 'all' 
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 text-white shadow-lg' 
                    : 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400'
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                <span className="text-3xl">🏥</span>
                <span className="text-sm font-bold">Todos</span>
              </Button>
              
              {categoriesLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                ))
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                    className={`h-32 w-full flex-col gap-1 rounded-2xl transition-all duration-300 transform hover:scale-105 p-3 ${
                      selectedCategory === category.id.toString() 
                        ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 text-white shadow-lg' 
                        : 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400'
                    }`}
                    onClick={() => setSelectedCategory(category.id.toString())}
                  >
                    <span className="text-3xl">{category.icon}</span>
                    <span className="text-sm font-bold text-center leading-tight px-2 whitespace-normal break-words">
                      {category.name}
                    </span>
                    {category.productCount > 0 && (
                      <span className="text-xs opacity-80">({category.productCount})</span>
                    )}
                  </Button>
                ))
              ) : null}
            </div>
          </ScrollArea>
        </section>

        {/* Farmácias Parceiras */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl px-8 py-8 border-b border-blue-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AwardIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">Farmácias Parceiras</h2>
          </div>
          
          {partnerPharmaciesLoading ? (
            <div className="flex justify-center py-12">
              <Loading text="Carregando farmácias..." />
            </div>
          ) : partnerPharmaciesError ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 font-medium mb-4">Erro ao carregar farmácias</p>
              <Button onClick={fetchPartnerPharmacies} className="bg-blue-500 hover:bg-blue-600">
                Tentar novamente
              </Button>
            </div>
          ) : partnerPharmacies && partnerPharmacies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerPharmacies.map((pharmacy) => (
                <Card 
                  key={pharmacy.id} 
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-2xl border-0 overflow-hidden"
                  onClick={() => navigate(`/farmacia/parceira/${pharmacy.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md flex-shrink-0 overflow-hidden">
                        <img src={pharmacy.logo} alt={pharmacy.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {pharmacy.name}
                          </h3>
                          <BadgeCheckIcon className="w-5 h-5 text-blue-500 fill-blue-100 animate-badge-pulse flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-1.5 text-sm mt-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold text-gray-700">{pharmacy.rating}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-blue-600 text-xs font-semibold">Verificada</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <ClockIcon className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{pharmacy.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <TagIcon className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">Pedido mínimo: {pharmacy.minOrder}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {pharmacy.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <InfoIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma farmácia parceira disponível</p>
            </div>
          )}
        </section>

        {/* Abas de Produtos */}
        <section className="bg-white shadow-xl px-8 py-8 border-b border-gray-100">
          <Tabs defaultValue="bestsellers" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-1.5 rounded-2xl">
              <TabsTrigger 
                value="bestsellers" 
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 font-bold"
              >
                <TrendingUpIcon className="w-4 h-4 mr-2" />
                Mais Vendidos
              </TabsTrigger>
              <TabsTrigger 
                value="featured"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 font-bold"
              >
                <ZapIcon className="w-4 h-4 mr-2" />
                Em Destaque
              </TabsTrigger>
              <TabsTrigger 
                value="offers"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 font-bold"
              >
                <PercentIcon className="w-4 h-4 mr-2" />
                Ofertas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bestsellers" className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900">🏆 Produtos Mais Vendidos</h3>
              {renderProductGrid(bestSellers, bestSellersLoading, null)}
            </TabsContent>

            <TabsContent value="featured" className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900">⚡ Produtos em Destaque</h3>
              {renderProductGrid(products || null, productsLoading, productsError)}
            </TabsContent>

            <TabsContent value="offers" className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900">🔥 Ofertas Imperdíveis</h3>
              {renderProductGrid(promotionalProducts, promoLoading, null)}
            </TabsContent>
          </Tabs>
        </section>

        {/* Vantagens */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          {[
            { icon: TruckIcon, title: 'Entrega Rápida', desc: 'Em até 1 hora', color: 'from-blue-500 to-blue-600' },
            { icon: ShieldIcon, title: 'Produtos Originais', desc: '100% garantidos', color: 'from-indigo-500 to-blue-600' },
            { icon: ClockIcon, title: 'Atendimento 24h', desc: 'Sempre disponível', color: 'from-blue-600 to-indigo-600' },
            { icon: PercentIcon, title: 'Melhores Preços', desc: 'Garantimos o menor', color: 'from-indigo-600 to-blue-700' }
          ].map((item, index) => (
            <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Newsletter */}
        <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 shadow-2xl px-8 py-12 text-white text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="relative z-10">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl md:text-4xl font-black mb-4">Fique por dentro das novidades!</h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Receba ofertas exclusivas, lançamentos e dicas de saúde em primeira mão
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Digite seu melhor e-mail"
                className="flex-1 px-6 py-4 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              />
              <Button className="bg-white text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <ZapIcon className="w-5 h-5 mr-2" />
                Inscrever-se
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Farmacia;
