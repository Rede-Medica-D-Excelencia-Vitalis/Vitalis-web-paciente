import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/business';
import { PlusIcon, MinusIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon, ShoppingCartIcon, X, CreditCard, QrCode } from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { pharmacyService } from '../../services/pharmacy/pharmacyService';
import { useAuthStore } from '../../store/auth';
import { Loading } from '../../components/ui/loading';
import { api } from '../../lib/api';

// Hooks personalizados para máscaras
const useMaskedInput = (mask: string) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const applyMask = useCallback((value: string, mask: string) => {
    let result = '';
    let valueIndex = 0;
    
    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      if (mask[i] === '9') {
        if (/\d/.test(value[valueIndex])) {
          result += value[valueIndex];
          valueIndex++;
        }
      } else {
        result += mask[i];
        if (value[valueIndex] === mask[i]) {
          valueIndex++;
        }
      }
    }
    
    return result;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const maskedValue = applyMask(rawValue, mask);
    onChange(maskedValue);
  }, [mask, applyMask]);

  return { inputRef, handleChange };
};

interface CheckoutFormData {
  nome: string;
  telefone: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
}

interface PaymentData {
  numero_cartao: string;
  nome_cartao: string;
  validade: string;
  cvv: string;
  email: string;
  pedido_id: string;
}

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>({
    nome: user?.name || '',
    telefone: user?.phone || '',
    email: user?.email || '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    numero_cartao: '',
    nome_cartao: '',
    validade: '',
    cvv: '',
    email: '',
    pedido_id: ''
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderValue, setOrderValue] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [buscandoCEP, setBuscandoCEP] = useState(false);

  // Hooks para máscaras
  const telefoneMask = useMaskedInput('(99) 99999-9999');
  const cepMask = useMaskedInput('99999-999');
  const cartaoMask = useMaskedInput('9999 9999 9999 9999');
  const validadeMask = useMaskedInput('99/99');

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeItem(id);
    }
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para buscar CEP na API ViaCEP
  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return;
    }

    setBuscandoCEP(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        console.error('CEP não encontrado');
        return;
      }

      // Preencher os campos automaticamente
      setFormData(prev => ({
        ...prev,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        complemento: data.complemento || prev.complemento
      }));
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setBuscandoCEP(false);
    }
  };

  // Handler para mudança do CEP
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    cepMask.handleChange(e, (maskedValue) => {
      handleInputChange('cep', maskedValue);
      
      // Buscar CEP quando tiver 9 caracteres (formato: 99999-999)
      if (maskedValue.replace(/\D/g, '').length === 8) {
        buscarCEP(maskedValue);
      }
    });
  };

  const handlePaymentDataChange = (field: keyof PaymentData, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearCartConfirm(false);
  };

  const processPayment = async (pedidoId: string, pedidoValor: number) => {
    setPaymentStatus('processing');
    
    try {
      console.log('Debug - Valor do pedido:', pedidoValor, 'Tipo:', typeof pedidoValor);
      
      const paymentPayload = {
        pedido_id: pedidoId,
        valor: Number(pedidoValor),
        forma_pagamento: paymentMethod === 'credit' ? 'cartao_credito' : 'pix',
        dados_pagamento: {
          ...paymentData,
          pedido_id: pedidoId,
          email: formData.email
        }
      };

      console.log('Debug - Payload do pagamento:', paymentPayload);

      const response = await api.post('/pagamentos', paymentPayload);
      console.log('Debug - Resposta completa da API:', response.data);
      
      if (response.data.pagamento.status === 'aprovado') {
        setPaymentStatus('success');
        return { success: true, pagamento: response.data.pagamento };
      } else if (response.data.pagamento.status === 'pendente' && paymentMethod === 'credit') {
        // Para cartões de crédito, status pendente é normal (aguardando confirmação)
        setPaymentStatus('success');
        return { success: true, pagamento: response.data.pagamento };
      } else if (paymentMethod === 'pix' && response.data.stripe_data?.pix_qr_code) {
        setPixData({
          qr_code: response.data.stripe_data.pix_qr_code,
          code: response.data.stripe_data.pix_code,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
        });
        setPaymentStatus('pending');
        return { success: true, pagamento: response.data.pagamento, pixData: response.data.stripe_data };
      } else {
        setPaymentStatus('error');
        const errorMessage = response.data.pagamento?.gateway_response?.mensagem || 
                           response.data.erro || 
                           'Erro no processamento do pagamento';
        console.error('Debug - Status do pagamento:', response.data.pagamento?.status);
        console.error('Debug - Gateway response:', response.data.pagamento?.gateway_response);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      setPaymentStatus('error');
      console.error('Erro completo ao processar pagamento:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      const errorMessage = error.response?.data?.erro || 
                          error.response?.data?.detalhes || 
                          error.message || 
                          'Erro ao processar pagamento';
      throw new Error(errorMessage);
    }
  };

  const handleCreateOrder = async () => {
    if (!user) {
      setOrderError('Usuário não autenticado');
      return;
    }

    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      // 1. Criar pedido
      const orderData = {
        farmacia_id: '1', // ID fixo da farmácia por enquanto
        paciente_id: user.id,
        itens: items.map(item => ({
          produto_id: item.id,
          quantidade: item.quantity,
          preco_unitario: item.price
        })),
        endereco_entrega: {
          rua: formData.rua,
          numero: formData.numero,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
          complemento: formData.complemento
        },
        forma_pagamento: paymentMethod === 'credit' ? 'cartao_credito' : 'pix',
        observacoes_entrega: `Pedido criado via aplicativo. Cliente: ${formData.nome}`
      };

      const orderResponse = await pharmacyService.createOrder(orderData);
      console.log('Debug - Resposta do pedido criado:', orderResponse);
      const pedidoId = orderResponse.pedido.id;
      
      // 2. Processar pagamento
      const paymentResult = await processPayment(pedidoId, Number(orderResponse.pedido.total));
      
      if (paymentResult.success) {
        setOrderId(orderResponse.pedido.numero_pedido || orderResponse.pedido.id);
        setOrderValue(Number(orderResponse.pedido.total));
        setOrderComplete(true);
        clearCart();
      }
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      setOrderError(error.message || 'Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const copyPixCode = async () => {
    if (pixData?.code) {
      try {
        await navigator.clipboard.writeText(pixData.code);
        // Aqui você pode adicionar uma notificação de sucesso
      } catch (error) {
        console.error('Erro ao copiar código PIX:', error);
      }
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto p-6 max-w-2xl">
          <Card className="shadow-xl">
            <CardContent className="pt-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-600 mb-2">Pedido Confirmado!</h2>
                <p className="text-gray-600 text-lg">Seu pedido #{orderId} foi realizado com sucesso.</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-lg mb-4 text-blue-900">Informações do Pedido</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-lg">R$ {orderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pagamento:</span>
                    <span className="font-medium">{paymentMethod === 'credit' ? 'Cartão de Crédito' : 'PIX'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entrega:</span>
                    <span className="font-medium">{formData.rua}, {formData.numero}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Button onClick={() => navigate('/meu-perfil')} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                  Acompanhar Pedido
                </Button>
                <Button variant="outline" onClick={() => navigate('/farmacia')} className="w-full text-lg py-3">
                  Voltar para a Farmácia
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto p-6 max-w-md">
          <Card className="shadow-xl">
            <CardContent className="pt-8 text-center space-y-6">
              <div className="text-gray-400">
                <ShoppingCartIcon className="w-20 h-20 mx-auto" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
                <p className="text-gray-600">Adicione produtos para continuar suas compras</p>
              </div>
              <Button 
                onClick={() => navigate('/farmacia')} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
              >
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <ShoppingCartIcon className="w-6 h-6" />
                Carrinho de Compras
              </CardTitle>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step === currentStep
                        ? 'bg-white'
                        : step < currentStep
                        ? 'bg-green-300'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-blue-100">
              {currentStep === 1 && 'Revise seu Carrinho'}
              {currentStep === 2 && 'Informações de Entrega'}
              {currentStep === 3 && 'Pagamento'}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Header do carrinho com ações */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      R$ {total().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowClearCartConfirm(true)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Limpar Carrinho
                    </Button>
                  </div>
                </div>

                {/* Lista de itens */}
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.pharmacy.name}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="h-8 w-8 p-0 hover:bg-gray-200"
                                >
                                  <MinusIcon className="w-3 h-3" />
                                </Button>
                                <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0 hover:bg-gray-200"
                                >
                                  <PlusIcon className="w-3 h-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-blue-600">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              R$ {item.price.toFixed(2)} cada
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {/* Resumo e ações */}
                <div className="border-t pt-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center text-xl font-bold text-blue-900">
                      <span>Total do Pedido</span>
                      <span>R$ {total().toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Frete e taxas calculados no próximo passo
                    </p>
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/farmacia')}
                      className="flex-1 bg-white hover:bg-gray-50 text-lg py-3"
                    >
                      <ArrowLeftIcon className="w-5 h-5 mr-2" />
                      Continuar Comprando
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                    >
                      Finalizar Compra
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">Dados Pessoais</h3>
                    <div className="space-y-3">
                      <Input
                        placeholder="Nome Completo"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        className="h-12"
                      />
                      <Input
                        ref={telefoneMask.inputRef}
                        placeholder="Telefone"
                        value={formData.telefone}
                        onChange={(e) => telefoneMask.handleChange(e, (value) => handleInputChange('telefone', value))}
                        className="h-12"
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">Endereço de Entrega</h3>
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          placeholder="CEP"
                          value={formData.cep}
                          onChange={handleCEPChange}
                          className="h-12"
                          maxLength={9}
                        />
                        {buscandoCEP && (
                          <div className="absolute right-3 top-3.5">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                      {formData.cep && formData.cep.replace(/\D/g, '').length === 8 && !buscandoCEP && formData.rua && (
                        <p className="text-xs text-green-600 mt-1">✓ Endereço preenchido automaticamente</p>
                      )}
                      <Input
                        placeholder="Rua"
                        value={formData.rua}
                        onChange={(e) => handleInputChange('rua', e.target.value)}
                        className="h-12"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Número"
                          value={formData.numero}
                          onChange={(e) => handleInputChange('numero', e.target.value)}
                          className="h-12"
                        />
                        <Input
                          placeholder="Complemento"
                          value={formData.complemento}
                          onChange={(e) => handleInputChange('complemento', e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <Input
                        placeholder="Bairro"
                        value={formData.bairro}
                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                        className="h-12"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Cidade"
                          value={formData.cidade}
                          onChange={(e) => handleInputChange('cidade', e.target.value)}
                          className="h-12"
                        />
                        <Input
                          placeholder="Estado"
                          maxLength={2}
                          value={formData.estado}
                          onChange={(e) => handleInputChange('estado', e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-white hover:bg-gray-50 text-lg py-3"
                  >
                    Voltar ao Carrinho
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  >
                    Continuar para Pagamento
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {orderError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{orderError}</p>
                  </div>
                )}

                <Tabs value={paymentMethod} onValueChange={(value: string) => setPaymentMethod(value as 'credit' | 'pix')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="credit" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Cartão de Crédito
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      PIX
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit" className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-blue-700">
                        <strong>Cartões de teste:</strong><br/>
                        • Aprovado: 4242 4242 4242 4242<br/>
                        • Recusado: 4000 0000 0000 0002
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Input
                        ref={cartaoMask.inputRef}
                        placeholder="Número do Cartão"
                        value={paymentData.numero_cartao}
                        onChange={(e) => cartaoMask.handleChange(e, (value) => handlePaymentDataChange('numero_cartao', value.replace(/\s/g, '')))}
                        className="h-12"
                      />
                      <Input
                        placeholder="Nome no Cartão"
                        value={paymentData.nome_cartao}
                        onChange={(e) => handlePaymentDataChange('nome_cartao', e.target.value)}
                        className="h-12"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          ref={validadeMask.inputRef}
                          placeholder="Validade (MM/AA)"
                          value={paymentData.validade}
                          onChange={(e) => validadeMask.handleChange(e, (value) => handlePaymentDataChange('validade', value))}
                          className="h-12"
                        />
                        <Input
                          placeholder="CVV"
                          maxLength={3}
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentDataChange('cvv', e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pix" className="space-y-4">
                    {pixData ? (
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <div className="w-48 h-48 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          {pixData.qr_code ? (
                            <img src={pixData.qr_code} alt="QR Code PIX" className="w-full h-full object-contain" />
                          ) : (
                            <QrCode className="w-24 h-24 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Escaneie o código QR ou copie a chave PIX abaixo
                        </p>
                        {pixData.code && (
                          <div className="bg-white p-3 rounded border mb-3">
                            <p className="text-xs text-gray-500 mb-1">Chave PIX:</p>
                            <p className="font-mono text-sm break-all">{pixData.code}</p>
                          </div>
                        )}
                        <Button variant="outline" onClick={copyPixCode} className="mb-3">
                          Copiar Chave PIX
                        </Button>
                        <p className="text-xs text-gray-500">
                          O pagamento expira em 30 minutos
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600">
                          O código PIX será gerado após confirmar o pedido
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-xl font-bold text-blue-900">
                    <span>Total Final</span>
                    <span>R$ {total().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(2)} 
                    disabled={isCreatingOrder}
                    className="flex-1 bg-white hover:bg-gray-50 text-lg py-3"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleCreateOrder} 
                    disabled={isCreatingOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3 min-w-[180px]"
                  >
                    {isCreatingOrder ? (
                      <>
                        <Loading size="sm" />
                        <span className="ml-2">
                          {paymentStatus === 'processing' ? 'Processando...' : 'Finalizando...'}
                        </span>
                      </>
                    ) : (
                      'Finalizar Compra'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de confirmação para limpar carrinho */}
        {showClearCartConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Limpar Carrinho</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover todos os itens do carrinho? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowClearCartConfirm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleClearCart}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Limpar Carrinho
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};