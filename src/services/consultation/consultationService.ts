import { api, ApiResponse, PaginatedResponse } from '../../lib/api';
import { Consultation, CreateConsultationRequest, Doctor } from '../../types/api';

const isConsultaLike = (value: any): value is Consultation =>
  value && typeof value === 'object' && 'id' in value && 'status' in value;

const normalizeConsultasResponse = (raw: any): Consultation[] | null => {
  if (!raw) return null;

  if (Array.isArray(raw)) {
    const flattened: Consultation[] = [];

    for (const item of raw) {
      if (isConsultaLike(item)) {
        flattened.push(item);
        continue;
      }

      if (Array.isArray(item)) {
        const nested = normalizeConsultasResponse(item);
        if (nested && nested.length > 0) {
          flattened.push(...nested);
        }
        continue;
      }

      if (item && typeof item === 'object') {
        const nested = normalizeConsultasResponse(item);
        if (nested && nested.length > 0) {
          flattened.push(...nested);
        }
        continue;
      }
    }

    if (flattened.length > 0) {
      return flattened;
    }

    return null;
  }

  if (Array.isArray(raw?.consultas)) {
    return raw.consultas;
  }

  if (Array.isArray(raw?.dados?.consultas)) {
    return raw.dados.consultas;
  }

  if (Array.isArray(raw?.dados)) {
    return raw.dados;
  }

  // Verificar formato do backend: { sucesso: true, data: [...] }
  if (Array.isArray(raw?.data)) {
    return raw.data;
  }

  if (typeof raw === 'object') {
    const numericKeys = Object.keys(raw).filter((key) => /^\d+$/.test(key));
    if (numericKeys.length > 0) {
      const items = numericKeys
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => (raw as Record<string, any>)[key]);

      const filteredItems = items.filter(isConsultaLike);
      if (filteredItems.length > 0) {
        return filteredItems;
      }

      if (items.every(item => item && typeof item === 'object')) {
        return items as Consultation[];
      }
    }

    const values = Object.values(raw).filter((item) => item && typeof item === 'object');
    const consultasLike = values.filter(isConsultaLike);
    if (consultasLike.length > 0) {
      return consultasLike;
    }

    if (values.length > 0) {
      return values as Consultation[];
    }
  }

  return null;
};

export const consultationService = {
  // Buscar consultas do usuário
  async getConsultations(page = 1, limit = 10): Promise<PaginatedResponse<Consultation>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Consultation>>>(
      `/consultations?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  // Buscar consulta específica
  async getConsultation(id: string): Promise<Consultation> {
    const response = await api.get<ApiResponse<Consultation>>(`/consultations/${id}`);
    return response.data.data;
  },

  // Criar nova consulta
  async createConsultation(data: CreateConsultationRequest): Promise<Consultation> {
    const response = await api.post<ApiResponse<Consultation>>('/consultations', {
      doctorId: data.doctorId,
      specialty: data.specialty,
      date: data.date,
      time: data.time,
      type: data.type,
      symptoms: data.symptoms
    });
    return response.data.data;
  },

  // Cancelar consulta
  async cancelConsultation(id: string, reason?: string): Promise<void> {
    await api.put<ApiResponse<void>>(`/consultations/${id}/cancel`, { reason });
  },

  // Avaliar consulta
  async rateConsultation(id: string, rating: number, feedback?: string): Promise<void> {
    await api.post<ApiResponse<void>>(`/consultations/${id}/rate`, {
      rating,
      feedback,
    });
  },

  // Buscar médicos disponíveis
  async getDoctors(specialty?: string, date?: string): Promise<Doctor[]> {
    const params = new URLSearchParams();
    if (specialty) params.append('specialty', specialty);
    if (date) params.append('date', date);

    const response = await api.get<ApiResponse<Doctor[]>>(`/doctors?${params.toString()}`);
    return response.data.data;
  },

  // Buscar médico específico
  async getDoctor(id: string): Promise<Doctor> {
    const response = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return response.data.data;
  },

  // Buscar horários disponíveis de um médico
  async getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>(
      `/doctors/${doctorId}/slots?date=${date}`
    );
    return response.data.data;
  },

  // Buscar especialidades disponíveis
  async getSpecialties(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/specialties');
    return response.data.data;
  },

  // Buscar consultas anteriores
  async getPastConsultations(page = 1, limit = 10): Promise<PaginatedResponse<Consultation>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Consultation>>>(
      `/consultations/past?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  // Buscar próximas consultas
  async getUpcomingConsultations(): Promise<Consultation[]> {
    const response = await api.get<ApiResponse<Consultation[]>>('/consultations/upcoming');
    return response.data.data;
  },

  // Iniciar teleconsulta
  async startTeleconsultation(id: string): Promise<{ roomUrl: string; token: string }> {
    const response = await api.post<ApiResponse<{ roomUrl: string; token: string }>>(
      `/videochamada/iniciar/${id}`
    );
    return response.data.data;
  },

  // Finalizar teleconsulta
  async endTeleconsultation(id: string): Promise<void> {
    await api.post<ApiResponse<void>>(`/videochamada/finalizar/${id}`);
  },
};

/**
 * Busca as consultas do paciente logado.
 * @returns {Promise<Consultation[]>} Uma lista de consultas.
 */
export async function getMinhasConsultas(): Promise<Consultation[]> {
  try {
    const response = await api.get('/consultas/me');
    const data = response.data;

    console.log('🔍 Resposta bruta da API:', data);
    console.log('🔍 Tipo da resposta:', typeof data);
    console.log('🔍 É array?', Array.isArray(data));
    console.log('🔍 Tem campo data?', 'data' in (data || {}));

    const asArray = normalizeConsultasResponse(data);
    if (asArray) {
      console.log('🔍 getMinhasConsultas normalizado:', {
        total: asArray.length,
        ids: asArray.map(c => c?.id).slice(0, 10),
        primeiraConsulta: asArray[0],
        status: asArray.map(c => c?.status).slice(0, 5)
      });
      return asArray;
    }

    console.warn('⚠️ Formato inesperado da resposta em getMinhasConsultas:', data);
    return [];
  } catch (error) {
    console.error("❌ Erro ao buscar as consultas do paciente:", error);
    throw error;
  }
} 