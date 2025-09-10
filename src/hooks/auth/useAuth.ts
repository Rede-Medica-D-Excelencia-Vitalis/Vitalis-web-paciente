import { useAuthStore } from '../../store/auth';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setUser,
    updateUserPlan,
    setLoading,
    setError,
    clearError
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setUser,
    updateUserPlan,
    setLoading,
    setError,
    clearError
  };
}; 