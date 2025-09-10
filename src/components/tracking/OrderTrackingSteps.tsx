import React from 'react';

interface OrderTrackingStepsProps {
  currentStep: number; // 0 a 4
}

const steps = [
  'Farmácia aceitou pedido.',
  'Pedido em separação',
  'O entregador está a caminho',
  'Pedido em trânsito',
  'Pedido concluído com sucesso',
];

import {
  CheckCircleIcon,
  PackageCheckIcon,
  BikeIcon,
  TruckIcon,
  ShoppingBagIcon
} from 'lucide-react';

const stepIcons = [
  <PackageCheckIcon className="w-6 h-6" />, // Aceito
  <ShoppingBagIcon className="w-6 h-6" />,  // Separação
  <BikeIcon className="w-6 h-6" />,         // Entregador a caminho
  <TruckIcon className="w-6 h-6" />,        // Em trânsito
  <CheckCircleIcon className="w-6 h-6" />   // Concluído
];

export const OrderTrackingSteps: React.FC<OrderTrackingStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex flex-col items-center my-6 w-full">
      <div className="flex flex-row items-end justify-between w-full max-w-[800px] mx-auto gap-8 relative">
        {/* Linha de conexão entre todos os steps */}
        <div className="absolute top-1/2 left-0 right-0 z-0 flex items-center" style={{ height: '0', transform: 'translateY(-50%)' }}>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-blue-500"
              style={{ width: `${(currentStep >= steps.length - 1 ? 100 : (currentStep / (steps.length - 1)) * 100)}%` }}
            />
          </div>
        </div>
        {steps.map((label, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 min-w-0 z-10">
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full border-4 text-base font-bold shadow-md transition-all duration-300 bg-white
              ${idx < currentStep ? 'border-blue-500 text-blue-500 shadow-blue-100' : 
                idx === currentStep ? 'border-blue-700 text-blue-700 shadow-lg scale-110 ring-2 ring-blue-200 animate-pulse' : 
                'border-gray-300 text-gray-300'}`}
              style={{ zIndex: 2 }}
            >
              {stepIcons[idx]}
            </div>
            <span className={`text-xs mt-2 w-24 text-center font-medium leading-tight ${idx <= currentStep ? 'text-blue-700' : 'text-gray-400'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
