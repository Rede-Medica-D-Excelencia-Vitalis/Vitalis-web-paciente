import React from 'react';
import {
  CheckCircleIcon,
  XIcon,
  CalendarIcon,
  AlertTriangleIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from '../types/api';

interface PlanInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onCancelPlan: () => Promise<void>;
  isCancelling: boolean;
}

export const PlanInfoModal: React.FC<PlanInfoModalProps> = ({
  isOpen,
  onClose,
  user,
  onCancelPlan,
  isCancelling
}) => {
  const navigate = useNavigate();

  console.log('🔍 PlanInfoModal:', { isOpen, userPlan: user?.plan });

  if (!isOpen) {
    console.log('❌ PlanInfoModal: Não está aberto');
    return null;
  }

  if (!user?.plan) {
    console.log('❌ PlanInfoModal: Usuário não tem plano');
    return null;
  }

  console.log('✅ PlanInfoModal: Renderizando modal');
  console.log('🔍 PlanInfoModal: Dados do plano:', {
    price: user.plan.price,
    priceType: typeof user.plan.price,
    name: user.plan.name,
    period: user.plan.period,
    nextBilling: user.plan.nextBilling
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não informada';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Erro ao formatar';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Informações do Plano
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Plano Ativo</span>
            </div>
            <p className="text-green-700 text-sm">
              Você tem acesso completo a todas as funcionalidades do Vitalis!
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plano:</span>
              <span className="font-semibold text-gray-900">{user.plan.name || 'Não informado'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor:</span>
              <span className="font-semibold text-green-600">
                R$ {typeof user.plan.price === 'number' ? user.plan.price.toFixed(2) : '0,00'}/{user.plan.period === 'month' ? 'mês' : 'ano'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Próxima renovação:</span>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-900">
                  {formatDate(user.plan.nextBilling || '')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                navigate('/meu-perfil');
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Gerenciar Plano
            </button>
            
            <button
              onClick={onCancelPlan}
              disabled={isCancelling}
              className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 flex items-center justify-center gap-2"
            >
              {isCancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  Cancelando...
                </>
              ) : (
                <>
                  <AlertTriangleIcon className="w-4 h-4" />
                  Cancelar Assinatura
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 