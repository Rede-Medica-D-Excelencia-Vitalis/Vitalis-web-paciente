import { api } from "../../lib/api";

export interface Consulta {
  id: number;
  date: string;
  time: string;
  status: string;
  type: string;
  doctor: {
    name: string;
    specialty: string;
    avatar?: string;
  };
}

export interface VideochamadaSala {
  roomId: string;
  consultaId: number;
  medicoId: number;
  pacienteId: number;
  status: string;
  criadoEm: string;
}

export interface VideochamadaParticipante {
  userId: number;
  userType: 'medico' | 'paciente';
  isHost: boolean;
  joinedAt: string;
  status: string;
}

export interface VideochamadaInfo {
  roomId: string;
  iceServers: any[];
  participantes: VideochamadaParticipante[];
  isHost: boolean;
}

export const consultaService = {
  // Buscar próximas consultas do paciente
  async getProximasConsultas(): Promise<Consulta[]> {
    try {
      const response = await api.get('/consultas/me', {
        params: {
          _t: Date.now() // Cache-busting
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar próximas consultas:', error);
      throw error;
    }
  },

  // Buscar consulta específica
  async getConsulta(consultaId: number): Promise<Consulta> {
    try {
      const response = await api.get(`/consultas/${consultaId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar consulta:', error);
      throw error;
    }
  },

  // Criar sala de videochamada (apenas médicos)
  async criarSalaVideochamada(consultaId: number, metadata?: any): Promise<VideochamadaSala> {
    try {
      const response = await api.post('/videochamada/sala/criar', {
        consultaId,
        metadata
      });
      
      if (response.data.sucesso) {
        return response.data.sala;
      } else {
        throw new Error(response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao criar sala de videochamada:', error);
      throw error;
    }
  },

  // Entrar em sala de videochamada
  async entrarSalaVideochamada(roomId: string): Promise<VideochamadaInfo> {
    try {
      console.log('🔍 Tentando entrar na sala:', roomId);
      const response = await api.post(`/videochamada/sala/${roomId}/entrar`);
      
      console.log('🔍 Resposta da API:', response.data);
      console.log('🔍 Status da resposta:', response.status);
      
      if (response.data.sucesso) {
        return response.data.dados;
      } else {
        throw new Error(response.data.erro || 'Erro desconhecido da API');
      }
    } catch (error: any) {
      console.error('🔍 Erro detalhado ao entrar na sala de videochamada:');
      console.error('🔍 Tipo do erro:', error.constructor.name);
      console.error('🔍 Mensagem:', error.message);
      console.error('🔍 Código:', error.code);
      console.error('🔍 Status:', error.response?.status);
      console.error('🔍 Dados da resposta:', error.response?.data);
      console.error('🔍 Headers da resposta:', error.response?.headers);
      console.error('🔍 Config da requisição:', error.config);
      
      // Criar mensagem de erro mais informativa
      let errorMessage = 'Erro ao entrar na sala de videochamada';
      
      if (error.response?.status === 400) {
        errorMessage = `Erro 400 - Bad Request: ${error.response.data?.erro || error.response.data?.message || 'Requisição inválida'}`;
      } else if (error.response?.status === 401) {
        errorMessage = 'Erro 401 - Não autorizado. Verifique se você está logado.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Erro 403 - Acesso negado. Você não tem permissão para esta sala.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Erro 404 - Sala não encontrada.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro 500 - Erro interno do servidor.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).statusCode = error.response?.status;
      (enhancedError as any).responseData = error.response?.data;
      
      throw enhancedError;
    }
  },

  // Sair da sala de videochamada
  async sairSalaVideochamada(roomId: string): Promise<void> {
    try {
      const response = await api.post(`/videochamada/sala/${roomId}/sair`);
      
      if (!response.data.sucesso) {
        throw new Error(response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao sair da sala de videochamada:', error);
      throw error;
    }
  },

  // Finalizar sala de videochamada (apenas médicos)
  async finalizarSalaVideochamada(roomId: string): Promise<void> {
    try {
      const response = await api.post(`/videochamada/sala/${roomId}/finalizar`);
      
      if (!response.data.sucesso) {
        throw new Error(response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao finalizar sala de videochamada:', error);
      throw error;
    }
  },

  // Obter informações da sala
  async getInfoSala(roomId: string): Promise<any> {
    try {
      const response = await api.get(`/videochamada/sala/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações da sala:', error);
      throw error;
    }
  },

  // Verificar se há sala ativa para uma consulta
  async verificarSalaAtiva(consultaId: number): Promise<VideochamadaSala | null> {
    try {
      console.log('🔍 Verificando sala ativa para consulta:', consultaId);
      const response = await api.get('/videochamada/salas');
      console.log('🔍 Resposta da API:', response.data);
      console.log('🔍 URL da requisição:', response.config.url);
      console.log('🔍 Status da resposta:', response.status);
      
      if (response.data.sucesso && response.data.salas) {
        console.log('🔍 Todas as salas:', response.data.salas);
        console.log('🔍 Procurando por consultaId:', consultaId, 'tipo:', typeof consultaId);
        
        const salaAtiva = response.data.salas.find((sala: VideochamadaSala) => {
          console.log(`🔍 Verificando sala ${sala.roomId}: consultaId=${sala.consultaId}, status=${sala.status}`);
          console.log(`🔍 Tipos: sala.consultaId=${typeof sala.consultaId}, consultaId=${typeof consultaId}`);
          
          // Comparar como números
          const salaId = Number(sala.consultaId);
          const consultaIdNum = Number(consultaId);
          const match = salaId === consultaIdNum && (sala.status === 'ativa' || sala.status === 'criada');
          
          console.log(`🔍 Comparação: ${salaId} === ${consultaIdNum} = ${salaId === consultaIdNum}`);
          console.log(`🔍 Status válido: ${sala.status === 'ativa' || sala.status === 'criada'}`);
          console.log(`🔍 Match final: ${match}`);
          
          return match;
        });
        console.log('🔍 Sala ativa encontrada:', salaAtiva);
        if (salaAtiva) {
          console.log('🔍 Detalhes da sala:', {
            roomId: salaAtiva.roomId,
            consultaId: salaAtiva.consultaId,
            status: salaAtiva.status
          });
        } else {
          console.log('🔍 Nenhuma sala ativa encontrada para consulta:', consultaId);
        }
        return salaAtiva || null;
      }
      console.log('🔍 Nenhuma sala encontrada');
      return null;
    } catch (error) {
      console.error('Erro ao verificar sala ativa:', error);
      return null;
    }
  },

  // Processar sinalização WebRTC
  async processarSinalizacao(roomId: string, tipo: string, dados: any): Promise<void> {
    try {
      const response = await api.post('/videochamada/sinalizacao', {
        roomId,
        tipo,
        dados
      });
      
      if (!response.data.sucesso) {
        throw new Error(response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao processar sinalização:', error);
      throw error;
    }
  },

  // Verificar tolerância de uma consulta
  async verificarToleranciaConsulta(consultaId: number): Promise<{
    dentroDaTolerancia: boolean;
    minutosRestantes: number;
    consultaFutura?: boolean;
    consulta: any;
  }> {
    try {
      const response = await api.get(`/consultas/${consultaId}/tolerancia`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar tolerância da consulta:', error);
      throw error;
    }
  },

  // Verificar ausência do paciente (para ser chamado periodicamente)
  async verificarAusenciaPaciente(): Promise<{
    sucesso: boolean;
    mensagem: string;
    consultas: any[];
  }> {
    try {
      const response = await api.post('/consultas/verificar-ausencia');
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar ausência do paciente:', error);
      throw error;
    }
  }
}; 