import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from '../../store/business';
import { useApi } from "../../hooks/api/useApi";
import { pharmacyService } from "../../services/pharmacy/pharmacyService";
import { Product } from "../../types/api";
import { Loading, Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "../../components";
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

// Tipos explícitos para produto
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  description: string;
  pharmacy: {
    name: string;
    rating: number;
  };
  category: string;
  stock?: number;
  requiresPrescription?: boolean;
  manufacturer?: string;
  barcode?: string;
  expiryDate?: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const { data: product, loading, error, execute: fetchProduct } = useApi<Product>(
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

  const handleAddToCart = (product: Product) => {
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

  const handleBuyNow = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      pharmacy: product.pharmacy
    });
    showNotification(`${product.name} foi adicionado ao carrinho! 🛒`);
    setTimeout(() => {
      navigate("/cart");
    }, 1000);
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

  const discount = calculateDiscount();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading text="Carregando detalhes do produto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Produto não encontrado</h2>
        <p className="text-gray-600 text-center mb-4">
          Não foi possível carregar os detalhes deste produto.
        </p>
        <p className="text-sm text-gray-500 mb-6">Erro: {error}</p>
        <Button onClick={() => navigate('/farmacia')} variant="outline">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Voltar para a Farmácia
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500">
                {product.pharmacy.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`${isFavorite ? 'text-red-500' : 'text-gray-600'}`}
              >
                <HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
              >
                <Share2Icon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Imagem do Produto */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </div>
              )}
              {product.requiresPrescription && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Receita Obrigatória
                </div>
              )}
            </div>
            
            {/* Informações da Farmácia */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.pharmacy.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{product.pharmacy.rating}</span>
                      <span>• Entrega em 30-45 min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="flex items-baseline gap-4 mb-4">
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    R$ {Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
                <span className="text-4xl font-bold text-blue-600">
                  R$ {Number(product.price).toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                    Economia de R$ {((product.originalPrice || 0) - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Estoque */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <PackageIcon className="w-4 h-4" />
                <span>
                  {product.stock && product.stock > 0 
                    ? `${product.stock} unidades em estoque`
                    : 'Produto indisponível'
                  }
                </span>
              </div>
            </div>

            {/* Quantidade */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantidade:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= (product.stock || 10)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.stock || product.stock <= 0}
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                  onClick={() => handleBuyNow(product)}
                  disabled={!product.stock || product.stock <= 0}
                >
                  Comprar Agora
                </Button>
              </div>
            </div>

            {/* Vantagens */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TruckIcon className="w-4 h-4 text-green-600" />
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldIcon className="w-4 h-4 text-blue-600" />
                <span>Produto Original</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClockIcon className="w-4 h-4 text-orange-600" />
                <span>Atendimento 24h</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                <span>Garantia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Detalhes */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Descrição</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="shipping">Entrega</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Descrição do Produto</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Informações Importantes:</h4>
                  <ul className="text-blue-800 space-y-1 text-sm">
                    <li>• Consulte sempre um profissional de saúde antes do uso</li>
                    <li>• Mantenha o produto em local seco e arejado</li>
                    <li>• Mantenha fora do alcance de crianças</li>
                    <li>• Leia atentamente a bula antes do uso</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Detalhes Técnicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoria:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fabricante:</span>
                      <span className="font-medium">{product.manufacturer || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Código de Barras:</span>
                      <span className="font-medium">{product.barcode || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Receita Obrigatória:</span>
                      <span className="font-medium">
                        {product.requiresPrescription ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço Original:</span>
                      <span className="font-medium">
                        {product.originalPrice ? `R$ ${Number(product.originalPrice).toFixed(2)}` : 'Não aplicável'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preço Atual:</span>
                      <span className="font-medium text-blue-600">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desconto:</span>
                      <span className="font-medium text-green-600">
                        {discount > 0 ? `${discount}%` : 'Não aplicável'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estoque:</span>
                      <span className="font-medium">
                        {product.stock && product.stock > 0 ? `${product.stock} unidades` : 'Indisponível'}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Informações de Entrega</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TruckIcon className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">Entrega Rápida</h4>
                        <p className="text-green-800 text-sm">Entrega em 30-45 minutos na sua região</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShieldIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Produto Original</h4>
                        <p className="text-blue-800 text-sm">Garantimos que todos os produtos são originais</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-6 h-6 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-orange-900">Atendimento 24h</h4>
                        <p className="text-orange-800 text-sm">Suporte disponível a qualquer momento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Notificação */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-800' 
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircleIcon className={`w-5 h-5 ${
              notification.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`} />
            <span className="font-medium">{notification.message}</span>
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