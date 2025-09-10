import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { 
  ArrowLeftIcon, 
  CreditCardIcon, 
  CrownIcon, 
  LockIcon, 
  ShieldIcon,
  CheckCircleIcon
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { authService } from '../../services/auth/authService';

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

interface FormErrors {
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  holderCpf?: string;
}

// Função para validar CPF (real)
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[\D]/g, '');
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

// Função para formatar CPF
function formatarCPF(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
}

export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  
  const selectedPlan = location.state?.plan as Plan;
  
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    holderCpf: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPlan) {
      navigate('/meu-perfil');
    }
  }, [selectedPlan, navigate]);

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    console.log(`🔍 Checkout: handleInputChange - ${field}:`, value);
    
    let processedValue = value;
    
    // Formatação específica para cada campo
    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (field === 'cardExpiry') {
      processedValue = formatExpiry(value);
    } else if (field === 'holderCpf') {
      processedValue = formatarCPF(value);
    }
    
    setPaymentFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!paymentFormData.cardNumber.replace(/\s/g, '')) {
      errors.cardNumber = 'Número do cartão é obrigatório';
    } else if (paymentFormData.cardNumber.replace(/\s/g, '').length < 13) {
      errors.cardNumber = 'Número do cartão inválido';
    }
    
    if (!paymentFormData.cardName.trim()) {
      errors.cardName = 'Nome no cartão é obrigatório';
    }
    
    if (!paymentFormData.cardExpiry) {
      errors.cardExpiry = 'Data de validade é obrigatória';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentFormData.cardExpiry)) {
      errors.cardExpiry = 'Data de validade inválida';
    }
    
    if (!paymentFormData.cardCvv) {
      errors.cardCvv = 'CVV é obrigatório';
    } else if (paymentFormData.cardCvv.length < 3) {
      errors.cardCvv = 'CVV inválido';
    }
    
    if (!paymentFormData.holderCpf.replace(/\D/g, '')) {
      errors.holderCpf = 'CPF é obrigatório';
    } else if (paymentFormData.holderCpf.replace(/\D/g, '').length !== 11) {
      errors.holderCpf = 'CPF deve ter 11 dígitos';
    } else if (!validarCPF(paymentFormData.holderCpf)) {
      errors.holderCpf = 'CPF inválido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    setError(null);
    
    // Validação dos campos
    if (!selectedPlan) {
      setError('Plano não selecionado');
      return;
    }
    
    if (!validateForm()) {
      setError('Por favor, preencha todos os campos corretamente');
      return;
    }
    
    setLoading(true);
    
    try {
      const dadosPagamento = {
        numero_cartao: paymentFormData.cardNumber.replace(/\s/g, ''),
        nome_cartao: paymentFormData.cardName,
        validade: paymentFormData.cardExpiry,
        cvv: paymentFormData.cardCvv,
        cpf_titular: paymentFormData.holderCpf.replace(/\D/g, '')
      };
      
      console.log('💳 Dados de pagamento:', dadosPagamento);
      
      const result = await authService.processarAssinatura(
        selectedPlan.id,
        'troca',
        dadosPagamento
      );
      
      if (result.sucesso) {
        // Atualizar o estado do usuário imediatamente
        try {
          console.log('🔄 Atualizando usuário no store...');
          const userAtualizado = await authService.verifyToken();
          setUser(userAtualizado);
          console.log('✅ Usuário atualizado no store:', userAtualizado);
        } catch (updateError) {
          console.error('❌ Erro ao atualizar usuário:', updateError);
        }
        
        // Redireciona para sucesso
        navigate('/checkout-sucesso', {
          state: {
            plan: selectedPlan,
            paymentData: paymentFormData
          }
        });
      } else {
        setError(result.mensagem || 'Erro ao processar assinatura');
      }
    } catch (error: any) {
      console.error('❌ Erro ao processar pagamento:', error);
      setError(error.message || 'Erro interno ao processar pagamento');
    } finally {
      setLoading(false);
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
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  handlePayment();
                }}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número do Cartão</label>
                    <Input 
                      placeholder="0000 0000 0000 0000"
                      value={paymentFormData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
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
                      maxLength={14}
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
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
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

                  {/* Mensagem de erro */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-4">
                    <Button 
                      type="submit"
                      className="w-full h-12 text-lg font-semibold" 
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