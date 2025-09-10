import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/auth';
import { authService } from '../../services/auth/authService';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated, setUser, setLoading } = useAuthStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 AuthInitializer: Iniciando...', { token: !!token, isAuthenticated, initialized: initializedRef.current });
      
      // Evitar múltiplas inicializações
      if (initializedRef.current) {
        console.log('⏭️ AuthInitializer: Já inicializado, pulando...');
        return;
      }
      
      if (token && isAuthenticated) {
        try {
          setLoading(true);
          initializedRef.current = true;
          console.log('🔄 AuthInitializer: Verificando token...');
          const user = await authService.verifyToken();
          console.log('✅ AuthInitializer: Usuário carregado:', { 
            id: user.id, 
            name: user.name, 
            hasPlan: Boolean(user.plan?.id),
            plan: user.plan 
          });
          setUser(user);
        } catch (error) {
          console.error('❌ Erro ao verificar token:', error);
          // Se o token for inválido, fazer logout
          useAuthStore.getState().logout();
        } finally {
          setLoading(false);
        }
      } else {
        console.log('⏭️ AuthInitializer: Token não encontrado ou usuário não autenticado');
      }
    };

    initializeAuth();
  }, [token, isAuthenticated, setUser, setLoading]);

  return <>{children}</>;
}; 