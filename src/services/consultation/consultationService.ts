import { api, ApiResponse, PaginatedResponse } from '../../lib/api';
import { Consultation, CreateConsultationRequest, Doctor } from '../../types/api';

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
    const response = await api.get<Consultation[]>('/consultas/me');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as consultas do paciente:", error);
    throw error;
  }
} 