import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from '../../store/business';
import { useApi } from "../../hooks/api/useApi";
import { pharmacyService } from "../../services/pharmacy/pharmacyService";
import { Product, Review } from "../../types/api";
import { Loading, Button, Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from "../../components";
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  TruckIcon, 
  ShieldIcon, 
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowLeftIcon,
  Share2Icon,
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  PackageIcon,
  CalendarIcon,
  TagIcon,
  PercentIcon,
  XIcon
} from 'lucide-react';

// Tipos estendidos com campos opcionais que podem vir da API
type ProductDetailsType = Product & {
  manufacturer?: string;
  barcode?: string;
  expiryDate?: string;
  requiresPrescription?: boolean;
  images?: string[];
  pharmacy: Product["pharmacy"] & {
    deliveryTime?: string;
    logo?: string;
  };
};

type ProductReview = Review & {
  response?: string;
  resposta?: string;
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const { data: product, loading, error, execute: fetchProduct } = useApi<ProductDetailsType>(
    () => pharmacyService.getProductById(id!)
  );

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddToCart = (product: ProductDetailsType) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      pharmacy: product.pharmacy
    });
    showNotification(`${product.name} foi adicionado ao carrinho! 🛒`);
  };

  const handleBuyNow = (product: ProductDetailsType) => {
    handleAddToCart(product);
    setTimeout(() => {
      navigate("/cart");
    }, 800);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const reviews: ProductReview[] = (product?.reviews as ProductReview[]) || [];

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
    : Number(product?.rating || product?.pharmacy?.rating || 0);

  const formatRating = (value: number) => value.toFixed(1);

  const ratingLabel = (ratingValue: number) => {
    if (ratingValue >= 4.5) return "Excelente";
    if (ratingValue >= 4) return "Muito bom";
    if (ratingValue >= 3) return "Bom";
    if (ratingValue > 0) return "Regular";
    return "Sem avaliações";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Loading text="Carregando detalhes do produto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
        <AlertTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Produto não encontrado</h2>
        <p className="text-blue-800 text-center mb-4">
          Não foi possível carregar os detalhes deste produto.
        </p>
        <p className="text-sm text-blue-600/80 mb-6">Erro: {error}</p>
        <Button onClick={() => navigate('/farmacia')} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Voltar para a Farmácia
        </Button>
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-16">
      {/* Hero */}
      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white shadow-[0_30px_80px_-30px_rgba(30,64,175,0.55)] overflow-hidden">
        <div className="px-6 py-8 lg:px-12 lg:py-12 grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          {/* Informações principais */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="h-10 px-4 rounded-xl border border-white/30 text-white hover:bg-white/15"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <span className="uppercase tracking-[0.2em] text-xs">Detalhes do produto</span>
            </div>

            <span className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold">
              <TagIcon className="w-4 h-4" />
              {product.category}
            </span>

            <h1 className="text-3xl lg:text-5xl font-black leading-tight drop-shadow-md">
              {product.name}
            </h1>

            <p className="text-base lg:text-lg text-white/85 max-w-xl leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap items-end gap-4">
              {product.originalPrice && (
                <span className="text-2xl text-white/60 line-through font-medium">
                  R$ {Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              <span className="text-4xl font-black">R$ {Number(product.price).toFixed(2)}</span>
              {discount > 0 && (
                <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-semibold">
                  Economia de R$ {((product.originalPrice || 0) - product.price).toFixed(2)} ({discount}%)
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <p className="text-sm font-semibold text-white/85 mb-2">Quantidade</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center bg-white text-blue-700 rounded-xl overflow-hidden shadow-inner border border-blue-200/60">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 hover:bg-blue-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-blue-100 font-semibold min-w-[48px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 hover:bg-blue-50 transition-colors"
                      disabled={quantity >= (product.stock || 10)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-white/80 whitespace-nowrap">
                    {product.stock && product.stock > 0 ? `${product.stock} unidades` : 'Indisponível'}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 space-y-2 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <InfoIcon className="w-4 h-4" />
                  <span>Fabricante: <strong>{product.manufacturer || 'Não informado'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PercentIcon className="w-4 h-4" />
                  <span>Código de barras: <strong>{product.barcode || 'Não informado'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Validade: <strong>{product.expiryDate || 'Consultar embalagem'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldIcon className="w-4 h-4" />
                  <span>Receita: <strong>{product.requiresPrescription ? 'Obrigatória' : 'Não obrigatória'}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-white text-blue-700 hover:bg-blue-100 py-3 rounded-xl font-semibold shadow-lg"
                onClick={() => handleAddToCart(product)}
                disabled={!product.stock || product.stock <= 0}
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-yellow-300 to-yellow-400 text-blue-900 font-semibold hover:from-yellow-400 hover:to-yellow-500 py-3 rounded-xl shadow-lg"
                onClick={() => handleBuyNow(product)}
                disabled={!product.stock || product.stock <= 0}
              >
                Comprar Agora
              </Button>
            </div>
          </div>

          {/* Imagem */}
          <div className="bg-white/12 backdrop-blur-md border border-white/20 rounded-3xl p-5 relative">
            {discount > 0 && (
              <div className="absolute top-5 left-5 bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                -{discount}%
              </div>
            )}
            {product.requiresPrescription && (
              <div className="absolute top-5 right-5 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                Receita obrigatória
              </div>
            )}
            <div className="aspect-[4/5] w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-6 lg:px-12 pt-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/85 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">Farmácia parceira</h3>
                <p className="text-sm text-blue-800 font-semibold">{product.pharmacy.name}</p>
                <div className="flex items-center gap-2 text-xs text-blue-700/80 mt-1">
                  <StarIcon className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>{product.pharmacy.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">Suporte Vitalis</h3>
                <p className="text-sm text-blue-800 font-semibold">0800 000 0000</p>
                <p className="text-xs text-blue-700/80 mt-1">Atendimento dedicado aos pacientes Vitalis.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/85 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <ShieldIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">Compra segura</h3>
                <p className="text-sm text-blue-800 font-semibold">Garantia Vitalis</p>
                <p className="text-xs text-blue-700/80 mt-1">Troca ou reembolso em até 7 dias.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-blue-50/70 rounded-xl p-1">
                <TabsTrigger value="description" className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow">
                  <InfoIcon className="w-4 h-4" />
                  Descrição
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow">
                  <PackageIcon className="w-4 h-4" />
                  Detalhes
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow">
                  <TruckIcon className="w-4 h-4" />
                  Entrega
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4 text-blue-800">
                <h3 className="text-xl font-bold text-blue-900">Descrição do Produto</h3>
                <p className="leading-relaxed">{product.description}</p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Informações Importantes</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Consulte sempre um profissional de saúde antes do uso.</li>
                    <li>• Mantenha o produto em local seco e arejado.</li>
                    <li>• Leia atentamente a bula antes do uso.</li>
                    <li>• Mantenha fora do alcance de crianças.</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 text-blue-800">
                <h3 className="text-xl font-bold text-blue-900">Detalhes Técnicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between"><span>Categoria</span><span className="font-semibold">{product.category}</span></div>
                    <div className="flex justify-between"><span>Fabricante</span><span className="font-semibold">{product.manufacturer || 'Não informado'}</span></div>
                    <div className="flex justify-between"><span>Código de Barras</span><span className="font-semibold">{product.barcode || 'Não informado'}</span></div>
                    <div className="flex justify-between"><span>Receita</span><span className="font-semibold">{product.requiresPrescription ? 'Obrigatória' : 'Dispensável'}</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span>Preço Original</span><span className="font-semibold">{product.originalPrice ? `R$ ${Number(product.originalPrice).toFixed(2)}` : 'N/A'}</span></div>
                    <div className="flex justify-between"><span>Preço Atual</span><span className="font-semibold text-blue-600">R$ {Number(product.price).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Desconto</span><span className="font-semibold text-emerald-600">{discount > 0 ? `${discount}%` : 'N/A'}</span></div>
                    <div className="flex justify-between"><span>Estoque</span><span className="font-semibold">{product.stock && product.stock > 0 ? `${product.stock} unidades` : 'Indisponível'}</span></div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4 text-blue-800">
                <h3 className="text-xl font-bold text-blue-900">Informações de Entrega</h3>
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                    <TruckIcon className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="font-semibold text-emerald-900">Entrega rápida</h4>
                      <p className="text-sm text-emerald-800">Entrega em 30-45 minutos na sua região.</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <ShieldIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Produto original</h4>
                      <p className="text-sm text-blue-800">Garantimos que todos os produtos são originais.</p>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
                    <ClockIcon className="w-6 h-6 text-orange-600" />
                    <div>
                      <h4 className="font-semibold text-orange-900">Atendimento 24h</h4>
                      <p className="text-sm text-orange-800">Suporte Vitalis disponível a qualquer momento.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-16">
        <Card className="bg-white/92 backdrop-blur border border-blue-100 rounded-2xl shadow-lg">
          <CardContent className="p-6 lg:p-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 text-white shadow-[0_25px_50px_-15px_rgba(37,99,235,0.55)]">
                  <StarIcon className="w-8 h-8 text-yellow-300 fill-yellow-300 drop-shadow" />
                  <div className="absolute -bottom-3 inset-x-0 mx-auto w-16 h-7 rounded-full bg-white/80 text-center text-sm font-bold text-blue-700 shadow">
                    {formatRating(averageRating)}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2">
                    Avaliações Vitalis
                  </h3>
                  <p className="text-sm text-blue-900/70">
                    {ratingLabel(averageRating)} · {reviews.length > 0 ? `${reviews.length} avaliações reais` : "Seja o primeiro a avaliar este produto"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-900/70">
                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 font-semibold text-blue-700">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  Nota Vitalis {formatRating(averageRating)}
                </div>
                {product?.pharmacy?.rating && (
                  <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 font-semibold text-emerald-700">
                    <ShieldIcon className="w-4 h-4" />
                    Loja {formatRating(Number(product.pharmacy.rating))}
                  </div>
                )}
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.map((review, index) => (
                  <div
                    key={`${review.id}-${index}`}
                    className="relative border border-blue-100/80 bg-blue-50/60 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-white text-blue-700 text-xs font-semibold shadow">
                      {formatRating(review.rating || 0)} ★
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-blue-900">{review.userName || "Paciente Vitalis"}</p>
                        {review.createdAt && (
                          <span className="text-xs text-blue-900/60">
                            {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-700/80 bg-white/70 px-3 py-1 rounded-full border border-blue-100">
                        <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {review.rating || 0}
                      </div>
                    </div>
                    <p className="text-sm text-blue-900/80 leading-relaxed">
                      {review.comment || "Paciente avaliou sem comentário adicional."}
                    </p>
                    {(() => {
                      const responseText = review.response ?? review.resposta;
                      return responseText ? (
                      <div className="mt-4 rounded-xl border border-blue-100 bg-white/90 p-3 text-sm">
                        <span className="block text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                          Resposta da farmácia
                        </span>
                        <p className="text-blue-900/80">{responseText}</p>
                      </div>
                      ) : null;
                    })()}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-blue-100 rounded-2xl bg-blue-50/70 p-8 text-center">
                <StarIcon className="w-10 h-10 mx-auto mb-3 text-blue-500" />
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Ainda não há avaliações para este produto</h4>
                <p className="text-sm text-blue-900/70 mb-4 max-w-md mx-auto">
                  Seja o primeiro a compartilhar sua experiência e ajude outros pacientes Vitalis a escolherem com confiança.
                </p>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl px-6"
                  onClick={() => navigate('/cart')}
                >
                  Comprar e avaliar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {notification.show && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-2xl shadow-xl border-l-4 transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircleIcon className={`w-5 h-5 ${
              notification.type === 'success' ? 'text-emerald-600' : 'text-red-600'
            }`} />
            <span className="font-semibold text-sm">{notification.message}</span>
            <button
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;