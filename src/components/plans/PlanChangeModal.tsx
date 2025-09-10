import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Separator } from '../ui';
import { 
  XIcon, 
  CheckCircleIcon, 
  CrownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCwIcon
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features?: string[];
}

interface PlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: Plan;
  selectedPlan: Plan;
  onConfirm: (tipoTroca: 'troca' | 'upgrade' | 'downgrade') => void;
  loading?: boolean;
}

export const PlanChangeModal: React.FC<PlanChangeModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  selectedPlan,
  onConfirm,
  loading = false
}) => {
  if (!isOpen) return null;

  const isUpgrade = currentPlan && typeof currentPlan.price === 'number' && typeof selectedPlan.price === 'number' && selectedPlan.price > currentPlan.price;
  const isDowngrade = currentPlan && typeof currentPlan.price === 'number' && typeof selectedPlan.price === 'number' && selectedPlan.price < currentPlan.price;
  const isSamePrice = currentPlan && typeof currentPlan.price === 'number' && typeof selectedPlan.price === 'number' && selectedPlan.price === currentPlan.price;

  const getTipoTroca = (): 'troca' | 'upgrade' | 'downgrade' => {
    if (isUpgrade) return 'upgrade';
    if (isDowngrade) return 'downgrade';
    return 'troca';
  };

  const getTipoTrocaInfo = () => {
    if (isUpgrade) {
      return {
        title: 'Upgrade de Plano',
        description: 'Melhore seu plano mantendo o período atual',
        icon: <ArrowUpIcon className="w-5 h-5 text-green-600" />,
        benefits: [
          'Mantém o período atual',
          'Acesso imediato aos novos benefícios',
          'Cobrança proporcional na próxima fatura'
        ]
      };
    }
    if (isDowngrade) {
      return {
        title: 'Downgrade de Plano',
        description: 'Reduza seu plano mantendo o período atual',
        icon: <ArrowDownIcon className="w-5 h-5 text-orange-600" />,
        benefits: [
          'Mantém o período atual',
          'Economia na próxima fatura',
          'Alguns benefícios podem ser removidos'
        ]
      };
    }
    return {
      title: 'Troca de Plano',
      description: 'Troque para um plano diferente',
      icon: <RefreshCwIcon className="w-5 h-5 text-blue-600" />,
      benefits: [
        'Reinicia o período de assinatura',
        'Nova data de cobrança',
        'Acesso completo aos novos benefícios'
      ]
    };
  };

  const info = getTipoTrocaInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {info.icon}
            {info.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Descrição */}
          <p className="text-gray-600">{info.description}</p>

          {/* Comparação de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlan && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Plano Atual</h4>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {currentPlan.name}
                </div>
                <div className="text-lg text-gray-600 mb-2">
                  R$ {typeof currentPlan.price === 'number' ? currentPlan.price.toFixed(2) : '0,00'}/{currentPlan.period}
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {(currentPlan.features || []).slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="w-3 h-3 text-gray-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">Novo Plano</h4>
              <div className="text-2xl font-bold text-blue-900 mb-1">
                {selectedPlan.name}
              </div>
              <div className="text-lg text-blue-600 mb-2">
                R$ {selectedPlan.price.toFixed(2)}/{selectedPlan.period}
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                {(selectedPlan.features || []).slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="w-3 h-3 text-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator />

          {/* Benefícios da Operação */}
          <div>
            <h4 className="font-semibold mb-3">O que acontece:</h4>
            <ul className="space-y-2">
              {info.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diferencial de Preço */}
          {currentPlan && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Diferença de Preço</h4>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">De R$ {typeof currentPlan.price === 'number' ? currentPlan.price.toFixed(2) : '0,00'}</span>
                <span className="text-gray-400">→</span>
                <span className="text-gray-600">Para R$ {selectedPlan.price.toFixed(2)}</span>
                <span className={`font-semibold ${isUpgrade ? 'text-green-600' : isDowngrade ? 'text-orange-600' : 'text-blue-600'}`}>
                  ({isUpgrade ? '+' : isDowngrade ? '-' : ''}R$ {Math.abs(selectedPlan.price - (typeof currentPlan.price === 'number' ? currentPlan.price : 0)).toFixed(2)})
                </span>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => onConfirm(getTipoTroca())}
              disabled={loading}
              className={`flex-1 ${
                isUpgrade ? 'bg-green-600 hover:bg-green-700' :
                isDowngrade ? 'bg-orange-600 hover:bg-orange-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CrownIcon className="w-4 h-4" />
                  Confirmar {info.title}
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 