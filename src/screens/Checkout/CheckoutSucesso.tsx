import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  CheckCircleIcon, 
  CrownIcon, 
  ArrowRightIcon,
  HomeIcon
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
}

export const CheckoutSucesso = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan as Plan;

  useEffect(() => {
    if (!plan) {
      navigate('/meu-perfil');
    }
  }, [plan, navigate]);

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="text-center shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Ícone de Sucesso */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Assinatura Confirmada!
            </h1>

            {/* Plano */}
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CrownIcon className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-blue-900">
                  {plan.name}
                </h2>
              </div>
              <p className="text-blue-700">
                R$ {plan.price.toFixed(2)}/{plan.period}
              </p>
            </div>

            {/* Mensagem */}
            <p className="text-gray-600 mb-8 text-lg">
              Parabéns! Sua assinatura foi processada com sucesso. 
              Agora você tem acesso completo a todas as funcionalidades do Vitalis.
            </p>

            {/* Benefícios */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                O que você pode fazer agora:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximos Passos */}
            <div className="space-y-4">
              <Button 
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/home')}
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Ir para o Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/agendamento')}
              >
                <ArrowRightIcon className="w-4 h-4 mr-2" />
                Agendar Primeira Consulta
              </Button>
            </div>

            {/* Informações Adicionais */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Um email de confirmação foi enviado para sua caixa de entrada. 
                Sua próxima cobrança será em 30 dias.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 