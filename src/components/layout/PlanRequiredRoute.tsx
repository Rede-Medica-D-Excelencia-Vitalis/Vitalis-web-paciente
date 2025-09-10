import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { usePlanPermissions } from '../../hooks';
import { PlanRequiredModal } from '../plans/PlanRequiredModal';

interface PlanRequiredRouteProps {
  children: React.ReactNode;
  featureName: string;
  fallbackPath?: string;
}

export const PlanRequiredRoute: React.FC<PlanRequiredRouteProps> = ({
  children,
  featureName,
  fallbackPath = '/meu-perfil'
}) => {
  const { hasPlan } = usePlanPermissions();
  const [showModal, setShowModal] = useState(false);

  if (!hasPlan) {
    // Se não tem plano, mostra o modal e depois redireciona
    if (!showModal) {
      setShowModal(true);
    }
    
    return (
      <>
        <PlanRequiredModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          featureName={featureName}
        />
        <Navigate to={fallbackPath} replace />
      </>
    );
  }

  return <>{children}</>;
}; 