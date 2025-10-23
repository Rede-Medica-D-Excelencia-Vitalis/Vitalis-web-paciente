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
      
      // Verificar se existe token no localStorage (pode não estar no store ainda)
      const storedToken = localStorage.getItem('token');
      
      if ((token || storedToken) && isAuthenticated) {
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
        } catch (error: any) {
          console.error('❌ Erro ao verificar token:', error);
          // Se o token for inválido ou houver erro de conexão, fazer logout apenas se for erro de autenticação
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('🚪 Token inválido, fazendo logout...');
            useAuthStore.getState().logout();
          } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.log('🌐 Erro de conexão, mantendo estado atual e tentando novamente em 5s...');
            // Tentar novamente após 5 segundos em caso de erro de rede
            setTimeout(() => {
              initializedRef.current = false;
              initializeAuth();
            }, 5000);
          }
        } finally {
          setLoading(false);
        }
      } else {
        console.log('⏭️ AuthInitializer: Token não encontrado ou usuário não autenticado');
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token, isAuthenticated, setUser, setLoading]);

  return <>{children}</>;
}; 