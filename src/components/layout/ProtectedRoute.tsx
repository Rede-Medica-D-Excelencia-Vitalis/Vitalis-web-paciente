import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();

  if (!isAuthenticated || !token) {
    // Redireciona para o login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 