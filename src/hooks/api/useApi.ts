import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      console.log('🚀 Executando API com argumentos:', args);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await apiFunction(...args);
        console.log('✅ API executada com sucesso:', result);
        setState(prev => ({ ...prev, data: result, loading: false }));
        return result;
      } catch (error: any) {
        console.error('❌ Erro na API:', error);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.response?.data?.erro ||
                           error.message || 
                           'Erro inesperado';
        console.error('❌ Mensagem de erro:', errorMessage);
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        return null;
      }
    },
    [apiFunction]
  );

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return {
    ...state,
    execute,
    setData,
    setError,
    setLoading,
    reset,
  };
} 