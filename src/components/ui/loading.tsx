import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  color = 'blue', 
  text,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-200 border-t-blue-600',
    white: 'border-white/20 border-t-white',
    gray: 'border-gray-200 border-t-gray-600'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && <p className="text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {spinner}
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

// Componente de loading inline
export const LoadingInline: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`} />
  );
};

// Componente de loading para botões
export const ButtonLoading: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    <span>Carregando...</span>
  </div>
); 