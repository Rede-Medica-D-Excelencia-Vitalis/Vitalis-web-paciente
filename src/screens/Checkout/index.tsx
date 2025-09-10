import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { 
  ArrowLeftIcon, 
  CreditCardIcon, 
  CrownIcon, 
  CheckCircleIcon,
  LockIcon,
  ShieldIcon
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
}

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  holderCpf: string;
}

export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserPlan } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    holderCpf: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<PaymentFormData>>({});

  // Pegar o plano selecionado da URL ou state
  const selectedPlan = location.state?.plan as Plan;

  useEffect(() => {
    if (!selectedPlan) {
      navigate('/meu-perfil');
    }
  }, [selectedPlan, navigate]);

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setPaymentFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors: Partial<PaymentFormData> = {};
    
    if (!paymentFormData.cardNumber || paymentFormData.cardNumber.length < 16) {
      errors.cardNumber = 'Número do cartão inválido';
    }
    if (!paymentFormData.cardName) {
      errors.cardName = 'Nome é obrigatório';
    }
    if (!paymentFormData.cardExpiry || !/^\d{2}\/\d{2}$/.test(paymentFormData.cardExpiry)) {
      errors.cardExpiry = 'Data de validade inválida';
    }
    if (!paymentFormData.cardCvv || paymentFormData.cardCvv.length < 3) {
      errors.cardCvv = 'CVV inválido';
    }
    if (!paymentFormData.holderCpf || paymentFormData.holderCpf.length < 11) {
      errors.holderCpf = 'CPF inválido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (validateForm() && selectedPlan) {
      setLoading(true);
      try {
        // Aqui você faria a chamada para o backend para processar o pagamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Atualizar o plano do usuário no store
        updateUserPlan({
          id: selectedPlan.id,
          name: selectedPlan.name,
          price: selectedPlan.price,
          period: selectedPlan.period as 'month' | 'year'
        });
        
        // Redirecionar para sucesso
        navigate('/checkout-sucesso', { 
          state: { 
            plan: selectedPlan,
            paymentData: paymentFormData 
          } 
        });
      } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        setLoading(false);
      }
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/meu-perfil')}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete sua assinatura</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumo do Plano */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CrownIcon className="w-5 h-5 text-yellow-500" />
                  Resumo do Plano
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-blue-900 mb-2">
                    {selectedPlan.name}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    R$ {selectedPlan.price.toFixed(2)}
                    <span className="text-lg font-normal text-gray-500">/{selectedPlan.period}</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Cobrança recorrente mensal
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Benefícios incluídos:</h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {selectedPlan.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de processamento</span>
                    <span>Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {selectedPlan.price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5" />
                  Informações de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número do Cartão</label>
                    <Input 
                      placeholder="0000 0000 0000 0000"
                      value={paymentFormData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      className={formErrors.cardNumber ? 'border-red-500' : ''}
                      maxLength={19}
                    />
                    {formErrors.cardNumber && (
                      <p className="text-sm text-red-500">{formErrors.cardNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome no Cartão</label>
                    <Input 
                      placeholder="Nome completo"
                      value={paymentFormData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      className={formErrors.cardName ? 'border-red-500' : ''}
                    />
                    {formErrors.cardName && (
                      <p className="text-sm text-red-500">{formErrors.cardName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF do Titular</label>
                    <Input 
                      placeholder="000.000.000-00"
                      value={paymentFormData.holderCpf}
                      onChange={(e) => handleInputChange('holderCpf', e.target.value)}
                      className={formErrors.holderCpf ? 'border-red-500' : ''}
                    />
                    {formErrors.holderCpf && (
                      <p className="text-sm text-red-500">{formErrors.holderCpf}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data de Validade</label>
                      <Input 
                        placeholder="MM/AA"
                        value={paymentFormData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', formatExpiry(e.target.value))}
                        className={formErrors.cardExpiry ? 'border-red-500' : ''}
                        maxLength={5}
                      />
                      {formErrors.cardExpiry && (
                        <p className="text-sm text-red-500">{formErrors.cardExpiry}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVV</label>
                      <Input 
                        placeholder="123"
                        value={paymentFormData.cardCvv}
                        onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                        className={formErrors.cardCvv ? 'border-red-500' : ''}
                        maxLength={4}
                      />
                      {formErrors.cardCvv && (
                        <p className="text-sm text-red-500">{formErrors.cardCvv}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Pagamento Seguro</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Suas informações de pagamento são criptografadas e protegidas. 
                      Nunca compartilhamos seus dados com terceiros.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button 
                      className="w-full h-12 text-lg font-semibold" 
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LockIcon className="w-5 h-5" />
                          Finalizar Assinatura - R$ {selectedPlan.price.toFixed(2)}
                        </div>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/meu-perfil')}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}; 