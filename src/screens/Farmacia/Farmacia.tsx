import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { 
  StarIcon, 
  PlusIcon,
  MinusIcon,
  TagIcon,
  TrendingUpIcon,
  PercentIcon,
  TruckIcon,
  ShieldIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  AwardIcon,
  HeartIcon,
  ShoppingBagIcon,
  ZapIcon,
  GiftIcon,
  InfoIcon,
  AlertCircleIcon
} from 'lucide-react';
import { useCartStore } from '../../store/business';
import { pharmacyService } from '../../services/pharmacy/pharmacyService';
import { useApi } from '../../hooks/api/useApi';
import { Loading } from '../../components/ui/loading';
import { Product } from '../../types/api';
import { categoriaService, Categoria } from '../../lib/api';

export const Farmacia = () => {
  const navigate = useNavigate();
  const { items, addItem, removeItem, updateQuantity } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  // Hook para buscar farmácias parceiras
  const { 
    data: partnerPharmacies, 
    loading: partnerPharmaciesLoading, 
    error: partnerPharmaciesError, 
    execute: fetchPartnerPharmacies 
  } = useApi(pharmacyService.getPartnerPharmacies);

  // Hook para buscar categorias
  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError, 
    execute: fetchCategories 
  } = useApi(() => {
    // Usar o ID da primeira farmácia parceira ou ID padrão
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

  // Carregar categorias quando as farmácias parceiras forem carregadas
  useEffect(() => {
    if (partnerPharmacies && partnerPharmacies.length > 0) {
      fetchCategories();
    }
  }, [partnerPharmacies]);

  // Buscar produtos quando categoria ou busca mudar
  useEffect(() => {
    if (selectedCategory !== 'all' || searchTerm) {
      fetchProducts(selectedCategory === 'all' ? undefined : selectedCategory, searchTerm);
    }
  }, [selectedCategory, searchTerm]);

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
    // Verificar se o produto tem dados válidos
    if (!product || !product.name || typeof product.price === 'undefined') {
      console.warn('Produto inválido:', product);
      return null;
    }

    return (
      <Card 
        key={product.id} 
        className="w-full max-w-xs cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
        onClick={() => navigate(`/farmacia/produto/${product.id}`)}
        data-testid="product-card"
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
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <HeartIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="space-y-2">
            {product.originalPrice && (
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500 font-semibold">
                  Oferta Especial
                </span>
              </div>
            )}
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" />
              {product.farmacia_nome || 'Farmácia'}
            </div>
            <div className="flex items-baseline gap-2">
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  R$ {(Number(product.originalPrice) || 0).toFixed(2)}
                </span>
              )}
              <span className="text-lg font-bold text-blue-600">
                R$ {(Number(product.price) || 0).toFixed(2)}
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
        {products.filter(product => product && product.name && typeof product.price !== 'undefined').map(renderProductCard)}
      </div>
    );
  };

  return (
    <div className="ml-[80px] h-screen overflow-y-auto bg-gray-50">
      {/* Banner de Boas-vindas */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="w-full p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                🏥 Farmácia Vitalis
              </h1>
              <p className="text-blue-100 text-lg">
                Medicamentos e produtos de saúde com entrega rápida e segura
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{items.length}</div>
                <div className="text-sm text-blue-100">Itens no carrinho</div>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/cart')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <ShoppingBagIcon className="w-4 h-4 mr-2" />
                Ver Carrinho
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-6 space-y-8">
        {/* Farmácias Parceiras */}
        <section className="rounded-xl shadow-lg p-8 mb-10 bg-gradient-to-br from-blue-50 to-white border-t-4 border-blue-400">
          <div className="flex items-center gap-3 mb-6">
            <AwardIcon className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Farmácias Parceiras</h2>
          </div>
          {partnerPharmaciesLoading ? (
            <Loading text="Carregando farmácias parceiras..." />
          ) : partnerPharmaciesError ? (
            <div className="flex flex-col items-center py-8">
              <AlertCircleIcon className="w-12 h-12 text-red-500 mb-2" />
              <p className="text-lg text-gray-500 font-medium">Erro ao carregar farmácias parceiras.</p>
              <Button onClick={fetchPartnerPharmacies} className="mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : partnerPharmacies && partnerPharmacies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partnerPharmacies.map((pharmacy) => (
                <Card 
                  key={pharmacy.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                  onClick={() => navigate(`/farmacia/parceira/${pharmacy.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={pharmacy.logo}
                        alt={pharmacy.name}
                        className="w-16 h-16 rounded-lg bg-gray-100 p-2"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {pharmacy.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{pharmacy.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>{pharmacy.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TagIcon className="w-4 h-4" />
                        <span>Mín: {pharmacy.minOrder}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {pharmacy.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
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
            <div className="flex flex-col items-center py-8">
              <InfoIcon className="w-12 h-12 text-blue-200 mb-2" />
              <p className="text-lg text-gray-500 font-medium">Nenhuma farmácia parceira disponível no momento.</p>
            </div>
          )}
        </section>

        {/* TESTE - Seção de Produtos em Destaque */}
        <section className="rounded-xl shadow-lg p-8 mb-10 bg-gradient-to-br from-yellow-50 to-white border-t-4 border-yellow-400">
          <div className="flex items-center gap-3 mb-6">
            <ZapIcon className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Produtos em Destaque</h2>
          </div>
          <div className="flex flex-col items-center py-8">
            <ZapIcon className="w-12 h-12 text-yellow-300 mb-2" />
            <p className="text-lg text-gray-500 font-medium">Nenhum produto em destaque no momento.</p>
          </div>
        </section>

        {/* TESTE - Ofertas Especiais */}
        <section className="rounded-xl shadow-lg p-8 mb-10 bg-gradient-to-br from-green-50 to-white border-t-4 border-green-400">
          <div className="flex items-center gap-3 mb-6">
            <PercentIcon className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ofertas Especiais</h2>
          </div>
          <div className="flex flex-col items-center py-8">
            <PercentIcon className="w-12 h-12 text-green-200 mb-2" />
            <p className="text-lg text-gray-500 font-medium">Nenhuma oferta especial no momento.</p>
          </div>
        </section>

        {/* Produtos em Destaque */}
        <section className="rounded-xl shadow-lg p-8 mb-10 bg-gradient-to-br from-yellow-50 to-white border-t-4 border-yellow-400">
          <div className="flex items-center gap-3 mb-6">
            <ZapIcon className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Produtos em Destaque</h2>
          </div>
          {productsLoading ? (
            <Loading text="Carregando produtos..." />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {products.filter(product => product && product.name && typeof product.price !== 'undefined').slice(0, 8).map(renderProductCard)}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <ZapIcon className="w-12 h-12 text-yellow-300 mb-2" />
              <p className="text-lg text-gray-500 font-medium">Nenhum produto em destaque no momento.</p>
            </div>
          )}
        </section>

        {/* Separador */}
        <div className="w-full flex justify-center my-6">
          <div className="h-1 w-1/2 bg-gradient-to-r from-yellow-400 via-green-400 to-purple-400 rounded-full opacity-40"></div>
        </div>

        {/* Ofertas Especiais */}
        <section className="rounded-xl shadow-lg p-8 mb-10 bg-gradient-to-br from-green-50 to-white border-t-4 border-green-400">
          <div className="flex items-center gap-3 mb-6">
            <PercentIcon className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ofertas Especiais</h2>
          </div>
          {promoLoading ? (
            <Loading text="Carregando ofertas..." />
          ) : promotionalProducts && promotionalProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {promotionalProducts.filter(product => product && product.name && typeof product.price !== 'undefined').slice(0, 8).map(renderProductCard)}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <PercentIcon className="w-12 h-12 text-green-200 mb-2" />
              <p className="text-lg text-gray-500 font-medium">Nenhuma oferta especial no momento.</p>
            </div>
          )}
        </section>

        {/* Separador */}
        <div className="w-full flex justify-center my-6">
          <div className="h-1 w-1/2 bg-gradient-to-r from-green-400 via-purple-400 to-yellow-400 rounded-full opacity-40"></div>
        </div>

        {/* Mais Vendidos */}
        <section className="rounded-xl shadow-lg p-8 mb-10 bg-gradient-to-br from-purple-50 to-white border-t-4 border-purple-400">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUpIcon className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mais Vendidos</h2>
          </div>
          {bestSellersLoading ? (
            <Loading text="Carregando mais vendidos..." />
          ) : bestSellers && bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {bestSellers.filter(product => product && product.name && typeof product.price !== 'undefined').slice(0, 8).map(renderProductCard)}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <TrendingUpIcon className="w-12 h-12 text-purple-200 mb-2" />
              <p className="text-lg text-gray-500 font-medium">Nenhum produto mais vendido no momento.</p>
            </div>
          )}
        </section>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar medicamentos, vitaminas, produtos de beleza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias em Destaque</h2>
          <ScrollArea className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className="h-20 flex-col gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                onClick={() => setSelectedCategory('all')}
              >
                <span className="text-2xl">🏥</span>
                <span className="text-xs">Todos</span>
              </Button>
              {categoriesLoading ? (
                // Loading state para categorias
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-20 bg-gray-100 rounded-lg animate-pulse flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-12 h-3 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                    className={`h-20 flex-col gap-2 ${selectedCategory === category.id.toString() ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedCategory(category.id.toString())}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-xs text-center">{category.name}</span>
                    {category.productCount > 0 && (
                      <span className="text-xs text-gray-500">({category.productCount})</span>
                    )}
                  </Button>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
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
        </div>

        {/* Vantagens */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TruckIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
            <p className="text-sm text-gray-600">Entrega em até 1 hora</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <ShieldIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Produtos Originais</h3>
            <p className="text-sm text-gray-600">100% garantidos</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <ClockIcon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Atendimento 24h</h3>
            <p className="text-sm text-gray-600">Sempre disponível</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <PercentIcon className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Melhores Preços</h3>
            <p className="text-sm text-gray-600">Garantimos o menor preço</p>
          </div>
        </div>

        {/* Product Sections */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Tabs defaultValue="popular" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4" />
                Mais Vendidos
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <StarIcon className="w-4 h-4" />
                Mais Procurados
              </TabsTrigger>
              <TabsTrigger value="offers" className="flex items-center gap-2">
                <PercentIcon className="w-4 h-4" />
                Ofertas Especiais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
              {renderProductGrid(bestSellers, bestSellersLoading, null)}
            </TabsContent>

            <TabsContent value="trending" className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Produtos em Alta</h3>
              {renderProductGrid(products || null, productsLoading, productsError)}
            </TabsContent>

            <TabsContent value="offers" className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ofertas Imperdíveis</h3>
              {renderProductGrid(promotionalProducts, promoLoading, null)}
            </TabsContent>
          </Tabs>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Fique por dentro das novidades!</h3>
          <p className="text-blue-100 mb-6">Receba ofertas exclusivas e novidades em primeira mão</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <ZapIcon className="w-4 h-4 mr-2" />
              Inscrever
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Farmacia;
