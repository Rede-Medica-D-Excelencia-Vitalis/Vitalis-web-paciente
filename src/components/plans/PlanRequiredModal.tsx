import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockIcon, XIcon, CrownIcon, CheckCircleIcon, StarIcon } from 'lucide-react';

interface PlanRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const planos = [
  {
    id: '1',
    nome: "Essencial Vitalis",
    valor: 39.90,
    popular: false,
    beneficios: [
      "Consultas ilimitadas",
      "Descontos em medicamentos",
      "Acesso ao app Vitalis",
      "Triagem online básica"
    ]
  },
  {
    id: '2',
    nome: "Vitalis Plus",
    valor: 59.90,
    popular: true,
    beneficios: [
      "Tudo do Essencial",
      "Teleconsultas com especialistas",
      "Check-up anual gratuito",
      "Prioridade no agendamento"
    ]
  },
  {
    id: '3',
    nome: "Vitalis Premium",
    valor: 89.90,
    popular: false,
    beneficios: [
      "Tudo do Plus",
      "Atendimento prioritário",
      "Suporte 24h",
      "Exames com desconto especial"
    ]
  }
];

export const PlanRequiredModal: React.FC<PlanRequiredModalProps> = ({
  isOpen,
  onClose,
  featureName
}) => {
  const navigate = useNavigate();

  const handlePlanSelect = (plano: any) => {
    onClose();
    navigate('/meu-perfil?tab=assinaturas');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <LockIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Plano Necessário
              </h2>
              <p className="text-gray-600">
                Para acessar {featureName}, você precisa de um plano Vitalis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CrownIcon className="w-16 h-16 text-yellow-500" />
              <StarIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Desbloqueie {featureName}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Com um plano Vitalis, você tem acesso completo a consultas médicas, 
              telemedicina, prescrições e muito mais. Escolha o plano ideal para você!
            </p>
          </div>

          {/* Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {planos.map((plano, index) => (
              <div
                key={plano.id}
                className={`relative rounded-xl border-2 p-6 transition-all duration-200 hover:scale-105 cursor-pointer ${
                  plano.popular 
                    ? 'border-blue-600 bg-gradient-to-b from-blue-50 to-white shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                {plano.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CrownIcon className="w-3 h-3" />
                      MAIS POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {plano.popular ? (
                      <CrownIcon className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <StarIcon className="w-5 h-5 text-blue-500" />
                    )}
                    <h4 className="text-xl font-bold text-gray-900">
                      {plano.nome}
                    </h4>
                  </div>
                  
                  <div className="text-4xl font-extrabold text-blue-600 mb-4">
                    R$ {plano.valor.toFixed(2)}
                    <span className="text-lg font-normal text-gray-500">/mês</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plano.beneficios.map((beneficio, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handlePlanSelect(plano)}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                      plano.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plano.popular ? (
                      <span className="flex items-center justify-center gap-2">
                        <CrownIcon className="w-4 h-4" />
                        Saiba Mais
                      </span>
                    ) : (
                      'Saiba Mais'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center border-t border-gray-200 pt-6">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 