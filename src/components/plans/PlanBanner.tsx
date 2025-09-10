import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CrownIcon, XIcon, ArrowRightIcon, CheckCircleIcon, StarIcon } from 'lucide-react';
import { usePlanPermissions } from '../../hooks';

export const PlanBanner: React.FC = () => {
  const { hasPlan } = usePlanPermissions();
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (hasPlan || !isVisible) {
    return null;
  }

  const beneficios = [
    "Consultas médicas ilimitadas",
    "Teleconsultas com especialistas",
    "Prescrições digitais",
    "Triagem online 24/7",
    "Descontos em medicamentos"
  ];

  const handleViewPlans = () => {
    navigate('/meu-perfil', { state: { activeTab: 'subscriptions' } });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
      >
        <XIcon className="w-5 h-5" />
      </button>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <CrownIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Desbloqueie o Vitalis Premium</h3>
            <p className="text-blue-100 text-sm">Acesso completo a todas as funcionalidades</p>
          </div>
        </div>
        
        <button
          onClick={handleViewPlans}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          Ver Planos
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        {beneficios.map((beneficio, index) => (
          <div key={index} className="flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3 text-green-300 flex-shrink-0" />
            <span className="text-blue-100">{beneficio}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 