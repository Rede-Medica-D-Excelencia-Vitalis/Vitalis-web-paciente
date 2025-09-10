import { api, ApiResponse } from '../../lib/api';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../../types/api';

// Cache global para planos do usuário
let planCache: {
  data: { id: string; name: string; price: number; period: 'month' | 'year'; nextBilling?: string } | undefined;
  timestamp: number;
  userId: string;
} | null = null;

const CACHE_DURATION = 600000; // 10 minutos (aumentado)

// Controle de chamadas em andamento
let pendingFetch: Promise<{ id: string; name: string; price: number; period: 'month' | 'year'; nextBilling?: string } | undefined> | null = null;

export const authService = {
  // Login do usuário
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/usuarios/login', {
      email: credentials.email,
      senha: credentials.password
    });
    
    // Adaptar resposta do backend para o formato esperado pelo frontend
    const backendResponse = response.data;
    
    // Limpar cache ao fazer login
    planCache = null;
    
    // Buscar informações do plano do usuário apenas se necessário
    let userPlan: { id: string; name: string; price: number; period: 'month' | 'year'; nextBilling?: string } | undefined = undefined;
    try {
      const planResponse = await api.get('/assinaturas/minha-assinatura', {
        headers: { Authorization: `Bearer ${backendResponse.token}` }
      });
      if (planResponse.data.sucesso && planResponse.data.data) {
        userPlan = {
          id: planResponse.data.data.plano_id.toString(),
          name: planResponse.data.data.plano_nome,
          price: planResponse.data.data.valor,
          period: 'month' as const,
          nextBilling: planResponse.data.data.proxima_cobranca
        };
        
        // Atualizar cache
        planCache = {
          data: userPlan,
          timestamp: Date.now(),
          userId: backendResponse.usuario.id
        };
      }
    } catch (error) {
      console.log('Usuário não possui plano ativo');
    }
    
    return {
      token: backendResponse.token,
      user: {
        id: backendResponse.usuario.id,
        name: backendResponse.usuario.nome,
        email: backendResponse.usuario.email,
        cpf: backendResponse.usuario.cpf || '',
        phone: backendResponse.usuario.telefone || '',
        birthdate: backendResponse.usuario.data_nascimento || '',
        address: {
          cep: '',
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: ''
        },
        plan: userPlan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  },

  // Registro de novo usuário
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/registro', {
      nome: userData.name,
      email: userData.email,
      senha: userData.password,
      telefone: userData.phone,
      tipo_usuario: 'paciente',
      plano_id: userData.planId,
      // Dados específicos para paciente
      cpf: userData.cpf,
      data_nascimento: userData.birthdate,
      genero: userData.genero
    });
    
    // Adaptar resposta do backend para o formato esperado pelo frontend
    const backendResponse = response.data;
    
    // Limpar cache ao fazer registro
    planCache = null;
    
    // Se o usuário escolheu um plano, buscar informações dele
    let userPlan: { id: string; name: string; price: number; period: 'month' | 'year'; nextBilling?: string } | undefined = undefined;
    if (userData.planId) {
      try {
        const planResponse = await api.get('/assinaturas/minha-assinatura', {
          headers: { Authorization: `Bearer ${backendResponse.token}` }
        });
        if (planResponse.data.sucesso && planResponse.data.data) {
          userPlan = {
            id: planResponse.data.data.plano_id.toString(),
            name: planResponse.data.data.plano_nome,
            price: planResponse.data.data.valor,
            period: 'month' as const,
            nextBilling: planResponse.data.data.proxima_cobranca
          };
          
          // Atualizar cache
          planCache = {
            data: userPlan,
            timestamp: Date.now(),
            userId: backendResponse.usuario.id
          };
        }
      } catch (error) {
        console.log('Erro ao buscar informações do plano');
      }
    }
    
    return {
      token: backendResponse.token,
      user: {
        id: backendResponse.usuario.id,
        name: backendResponse.usuario.nome,
        email: backendResponse.usuario.email,
        cpf: userData.cpf,
        phone: backendResponse.usuario.telefone,
        birthdate: userData.birthdate,
        address: userData.address,
        plan: userPlan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  },

  // Verificar token atual - AGORA carrega o plano automaticamente
  async verifyToken(): Promise<User> {
    console.log('🔄 verifyToken: Iniciando verificação...');
    const response = await api.get('/auth/verificar');
    
    // Adaptar resposta do backend
    const backendResponse = response.data;
    console.log('📋 verifyToken: Resposta do backend:', backendResponse);
    
    // Buscar plano do usuário usando o sistema de cache
    let userPlan: { id: string; name: string; price: number; period: 'month' | 'year'; nextBilling?: string } | undefined = undefined;
    try {
      console.log('🔄 verifyToken: Buscando plano do usuário...');
      userPlan = await this.fetchUserPlan(backendResponse.usuario.id);
      console.log('✅ verifyToken: Plano encontrado:', userPlan);
    } catch (error) {
      console.log('❌ verifyToken: Usuário não possui plano ativo ou erro ao buscar plano:', error);
    }
    
    const user = {
      id: backendResponse.usuario.id,
      name: backendResponse.usuario.nome,
      email: backendResponse.usuario.email,
      cpf: '', // Backend não retorna CPF
      phone: backendResponse.usuario.telefone || '',
      birthdate: backendResponse.usuario.data_nascimento || '',
      address: {
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: ''
      },
      plan: userPlan, // Agora carrega o plano automaticamente
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ verifyToken: Usuário final:', { 
      id: user.id, 
      name: user.name, 
      hasPlan: Boolean(user.plan?.id),
      plan: user.plan 
    });
    
    return user;
  },

  // Buscar informações atualizadas do plano do usuário (apenas quando necessário)
  async fetchUserPlan(userId?: string): Promise<{ id: string; name: string; price: number; period: 'month' | 'year'; nextBilling?: string } | undefined> {
    console.log('🔄 fetchUserPlan: Iniciando busca do plano...', { userId, planCache });
    
    // Se já há uma chamada em andamento, aguardar
    if (pendingFetch) {
      console.log('⏳ fetchUserPlan: Aguardando chamada em andamento...');
      return pendingFetch;
    }

    // Verificar cache primeiro
    if (planCache && 
        (Date.now() - planCache.timestamp) < CACHE_DURATION && 
        (!userId || planCache.userId === userId)) {
      console.log('✅ fetchUserPlan: Usando cache:', planCache.data);
      return planCache.data;
    }

    console.log('🔄 fetchUserPlan: Cache expirado ou não encontrado, fazendo nova chamada...');
    
    // Criar nova chamada
    pendingFetch = this._fetchUserPlanInternal(userId);
    
    try {
      const result = await pendingFetch;
      console.log('✅ fetchUserPlan: Resultado da busca:', result);
      return result;
    } catch (error) {
      console.log('❌ fetchUserPlan: Erro na busca, retornando undefined');
      return undefined;
    } finally {
      pendingFetch = null;
    }
  },

  // Método interno para fazer a chamada real
  async _fetchUserPlanInternal(userId?: string): Promise<{ id: string; name: string; price: number; period: 'month' | 'year'; nextBilling?: string } | undefined> {
    console.log('🔄 _fetchUserPlanInternal: Fazendo chamada para API...', { userId });
    try {
      const response = await api.get('/assinaturas/minha-assinatura');
      console.log('📋 _fetchUserPlanInternal: Resposta da API:', response.data);
      
      if (response.data.sucesso && response.data.data) {
        const plan = {
          id: response.data.data.plano_id.toString(),
          name: response.data.data.plano_nome,
          price: response.data.data.valor,
          period: 'month' as const,
          nextBilling: response.data.data.proxima_cobranca
        };
        
        console.log('✅ _fetchUserPlanInternal: Plano processado:', plan);
        
        // Atualizar cache
        planCache = {
          data: plan,
          timestamp: Date.now(),
          userId: userId || 'unknown'
        };
        
        return plan;
      }
      console.log('❌ _fetchUserPlanInternal: Nenhum plano encontrado na resposta');
      
      // Atualizar cache com undefined para evitar chamadas repetidas
      planCache = {
        data: undefined,
        timestamp: Date.now(),
        userId: userId || 'unknown'
      };
      
      return undefined;
    } catch (error) {
      console.log('❌ _fetchUserPlanInternal: Erro ao buscar plano do usuário:', error);
      
      // Em caso de erro, não atualizar o cache para permitir nova tentativa
      return undefined;
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put('/usuarios/perfil', userData);
    return response.data.data;
  },

  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/alterar-senha', {
      senha_atual: currentPassword,
      nova_senha: newPassword,
    });
  },

  // Solicitar redefinição de senha
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/esqueci-senha', { email });
  },

  // Redefinir senha com token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/redefinir-senha', {
      token,
      nova_senha: newPassword,
    });
  },

  // Logout (opcional, para invalidar token no servidor)
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignora erros no logout, pois o token já pode ter expirado
      console.log('Logout error:', error);
    }
  },

  // Refresh token
  async refreshToken(): Promise<LoginResponse> {
    const response = await api.post('/auth/refresh');
    return response.data.data;
  },

  // Limpar cache (útil para logout)
  clearCache() {
    console.log('🧹 authService: Limpando cache...');
    planCache = null;
    pendingFetch = null;
  },

  // Limpar cache completamente e forçar atualização
  async clearCacheAndRefresh() {
    console.log('🧹 authService: Limpando cache e forçando atualização...');
    
    // Limpar cache interno
    planCache = null;
    pendingFetch = null;
    
    // Limpar localStorage
    localStorage.removeItem('userPlanCache');
    localStorage.removeItem('auth-storage');
    
    // Forçar atualização do usuário
    try {
      const user = await this.verifyToken();
      console.log('✅ authService: Usuário atualizado após limpeza:', user);
      return user;
    } catch (error) {
      console.log('❌ authService: Erro ao atualizar usuário após limpeza:', error);
      throw error;
    }
  },

  // Forçar atualização do plano (útil para debug)
  forceRefreshPlan() {
    console.log('🔄 forceRefreshPlan: Limpando cache...');
    planCache = null;
    pendingFetch = null;
  },

  // Cancelar assinatura do usuário
  async cancelSubscription(): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      console.log('🔄 cancelSubscription: Iniciando cancelamento...');
      const response = await api.put('/assinaturas/cancelar');
      
      if (response.data.sucesso) {
        console.log('✅ cancelSubscription: Assinatura cancelada com sucesso');
        
        // Limpar cache completamente e forçar atualização
        console.log('🧹 cancelSubscription: Limpando cache e forçando atualização...');
        await this.clearCacheAndRefresh();
        
        return {
          sucesso: true,
          mensagem: response.data.mensagem || 'Assinatura cancelada com sucesso'
        };
      } else {
        console.log('❌ cancelSubscription: Erro na resposta:', response.data);
        return {
          sucesso: false,
          mensagem: response.data.erro || 'Erro ao cancelar assinatura'
        };
      }
    } catch (error: any) {
      console.error('❌ cancelSubscription: Erro na requisição:', error);
      return {
        sucesso: false,
        mensagem: error.response?.data?.erro || 
                 'Erro interno ao cancelar assinatura'
      };
    }
  },

  // Processar assinatura com pagamento (endpoint unificado)
  async processarAssinatura(
    planoId: string, 
    tipoTroca: 'troca' | 'upgrade' | 'downgrade' = 'troca',
    dadosPagamento?: any
  ): Promise<{ sucesso: boolean; mensagem: string; data?: any }> {
    console.log('🚀 FRONTEND: processarAssinatura chamada!');
    console.log('🚀 FRONTEND: planoId:', planoId);
    console.log('🚀 FRONTEND: tipoTroca:', tipoTroca);
    console.log('🚀 FRONTEND: dadosPagamento:', dadosPagamento);
    console.log('🚀 FRONTEND: Cache atual:', planCache);
    
    try {
      console.log('🔄 FRONTEND: Iniciando processamento...');
      
      const requestData = {
        plano_id: planoId,
        tipo_troca: tipoTroca,
        dados_pagamento: dadosPagamento || {}
      };
      
      console.log('📡 FRONTEND: Fazendo requisição POST para /assinaturas-unificadas/processar...');
      console.log('📡 FRONTEND: Dados da requisição:', requestData);
      console.log('📡 FRONTEND: URL completa:', `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/assinaturas-unificadas/processar`);
      
      const response = await api.post('/assinaturas-unificadas/processar', requestData);
      
      console.log('📋 FRONTEND: Resposta da API recebida!');
      console.log('📋 FRONTEND: Status da resposta:', response.status);
      console.log('📋 FRONTEND: Dados da resposta:', response.data);
      
      if (response.data.sucesso) {
        console.log('✅ FRONTEND: Assinatura processada com sucesso!');
        
        // Limpar cache completamente e forçar atualização
        console.log('🧹 FRONTEND: Limpando cache e forçando atualização...');
        await this.clearCacheAndRefresh();
        
        // Buscar informações atualizadas do plano
        try {
          console.log('🔄 FRONTEND: Buscando plano atualizado...');
          const planResponse = await api.get('/assinaturas/minha-assinatura');
          console.log('📋 FRONTEND: Resposta do plano:', planResponse.data);
          
          if (planResponse.data.sucesso && planResponse.data.data) {
            const userPlan = {
              id: planResponse.data.data.plano_id.toString(),
              name: planResponse.data.data.plano_nome,
              price: planResponse.data.data.valor,
              period: 'month' as const,
              nextBilling: planResponse.data.data.proxima_cobranca
            };
            
            console.log('✅ FRONTEND: Plano atualizado:', userPlan);
            
            // Atualizar cache com o novo plano
            planCache = {
              data: userPlan,
              timestamp: Date.now(),
              userId: response.data.data?.usuario_id || 'unknown'
            };
            
            console.log('💾 FRONTEND: Cache atualizado:', planCache);
            
            return {
              sucesso: true,
              mensagem: response.data.mensagem || 'Assinatura processada com sucesso',
              data: {
                ...response.data.data,
                plan: userPlan
              }
            };
          } else {
            console.log('⚠️ FRONTEND: Nenhum plano encontrado na resposta');
          }
        } catch (planError) {
          console.log('❌ FRONTEND: Erro ao buscar plano atualizado:', planError);
        }
        
        return {
          sucesso: true,
          mensagem: response.data.mensagem || 'Assinatura processada com sucesso',
          data: response.data.data
        };
      } else {
        console.log('❌ FRONTEND: Erro na resposta:', response.data);
        return {
          sucesso: false,
          mensagem: response.data.erro || 'Erro ao processar assinatura'
        };
      }
    } catch (error: any) {
      console.error('❌ FRONTEND: Erro na requisição:', error);
      console.error('❌ FRONTEND: Status do erro:', error.response?.status);
      console.error('❌ FRONTEND: Dados do erro:', error.response?.data);
      console.error('❌ FRONTEND: Mensagem do erro:', error.message);
      return {
        sucesso: false,
        mensagem: error.response?.data?.erro || 
                 'Erro interno ao processar assinatura'
      };
    }
  },

  // Assinar um novo plano (mantido para compatibilidade)
  async subscribeToPlan(planoId: string, tipoTroca: 'troca' | 'upgrade' | 'downgrade' = 'troca'): Promise<{ sucesso: boolean; mensagem: string; data?: any }> {
    console.log('🚀 FRONTEND: subscribeToPlan chamada com planoId:', planoId, 'tipoTroca:', tipoTroca);
    console.log('🚀 FRONTEND: Cache atual:', planCache);
    
    try {
      console.log('🔄 subscribeToPlan: Iniciando assinatura do plano:', planoId);
      console.log('🔄 subscribeToPlan: Cache atual:', planCache);
      
      console.log('📡 FRONTEND: Fazendo requisição POST para /assinaturas/assinar...');
      const response = await api.post('/assinaturas/assinar', {
        plano_id: planoId,
        tipo_troca: tipoTroca
      });
      
      console.log('📋 subscribeToPlan: Resposta da API:', response.data);
      
      if (response.data.sucesso) {
        console.log('✅ subscribeToPlan: Assinatura criada com sucesso');
        
        // Limpar cache completamente e forçar atualização
        console.log('🧹 subscribeToPlan: Limpando cache e forçando atualização...');
        await this.clearCacheAndRefresh();
        
        // Buscar informações atualizadas do plano
        try {
          console.log('🔄 subscribeToPlan: Buscando plano atualizado...');
          const planResponse = await api.get('/assinaturas/minha-assinatura');
          console.log('📋 subscribeToPlan: Resposta do plano:', planResponse.data);
          
          if (planResponse.data.sucesso && planResponse.data.data) {
            const userPlan = {
              id: planResponse.data.data.plano_id.toString(),
              name: planResponse.data.data.plano_nome,
              price: planResponse.data.data.valor,
              period: 'month' as const,
              nextBilling: planResponse.data.data.proxima_cobranca
            };
            
            console.log('✅ subscribeToPlan: Plano atualizado:', userPlan);
            
            // Atualizar cache com o novo plano
            planCache = {
              data: userPlan,
              timestamp: Date.now(),
              userId: response.data.data?.usuario_id || 'unknown'
            };
            
            console.log('💾 subscribeToPlan: Cache atualizado:', planCache);
            
            return {
              sucesso: true,
              mensagem: response.data.mensagem || 'Assinatura criada com sucesso',
              data: {
                ...response.data.data,
                plan: userPlan
              }
            };
          } else {
            console.log('⚠️ subscribeToPlan: Nenhum plano encontrado na resposta');
          }
        } catch (planError) {
          console.log('❌ subscribeToPlan: Erro ao buscar plano atualizado:', planError);
        }
        
        return {
          sucesso: true,
          mensagem: response.data.mensagem || 'Assinatura criada com sucesso',
          data: response.data.data
        };
      } else {
        console.log('❌ subscribeToPlan: Erro na resposta:', response.data);
        return {
          sucesso: false,
          mensagem: response.data.erro || 'Erro ao criar assinatura'
        };
      }
    } catch (error: any) {
      console.error('❌ subscribeToPlan: Erro na requisição:', error);
      console.error('❌ FRONTEND: Detalhes do erro:', error.response?.data);
      return {
        sucesso: false,
        mensagem: error.response?.data?.erro || 
                 'Erro interno ao criar assinatura'
      };
    }
  },

  // Forçar atualização do usuário (limpa cache e busca dados frescos)
  async forceUpdateUser(): Promise<User> {
    console.log('🔄 forceUpdateUser: Forçando atualização do usuário...');
    
    // Limpar cache
    this.clearCache();
    
    // Buscar dados frescos
    const user = await this.verifyToken();
    console.log('✅ forceUpdateUser: Usuário atualizado:', user);
    
    return user;
  }
}; 