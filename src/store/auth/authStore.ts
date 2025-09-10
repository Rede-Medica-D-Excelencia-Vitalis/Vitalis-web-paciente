import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  updateUserPlan: (plan: { id: string; name: string; price: number; period: 'month' | 'year'; nextBilling?: string } | undefined) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Log inicial para debug
      console.log('🔄 authStore: Inicializando...');
      
      return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (token: string, user: User) => {
          console.log('🔍 authStore.login:', { userId: user.id, hasPlan: Boolean(user.plan?.id) });
        localStorage.setItem('token', token);
        set({
          token,
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User) => {
          console.log('🔍 authStore.setUser: CHAMADO!', { 
            id: user.id, 
            name: user.name, 
            hasPlan: Boolean(user.plan?.id),
            plan: user.plan,
            planId: user.plan?.id,
            planName: user.plan?.name
          });
        set({ user });
        console.log('✅ authStore.setUser: Estado atualizado!');
      },

      updateUserPlan: (plan) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              plan
            }
          });
        }
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 