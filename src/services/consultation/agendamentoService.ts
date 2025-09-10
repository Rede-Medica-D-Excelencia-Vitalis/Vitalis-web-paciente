import { api } from "../../lib/api";

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  crm: string;
  image?: string;
}

export interface AvailableSlot {
  id: number;
  hora_inicio: string;
  hora_fim: string;
  disponivel: boolean;
}

export interface AppointmentData {
  paciente_id: number;
  medico_id: number;
  data: string;
  hora: string;
  tipo: 'presencial' | 'teleconsulta';
  observacoes?: string;
}

export interface Appointment {
  id: number;
  paciente_id: number;
  medico_id: number;
  data: string;
  hora: string;
  status: 'agendada' | 'confirmada' | 'cancelada' | 'realizada';
  tipo: 'presencial' | 'teleconsulta';
  observacoes?: string;
  medico: Doctor;
}

class AgendamentoService {
  // Buscar médicos disponíveis
  async getDoctors(): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      throw new Error('Erro ao buscar médicos disponíveis');
    }
  }

  // Buscar horários disponíveis de um médico em uma data específica
  async getAvailableSlots(medicoId: number, data: string): Promise<AvailableSlot[]> {
    try {
      const response = await api.get(`/doctors/${medicoId}/slots`, {
        params: { date: data }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      throw new Error('Erro ao buscar horários disponíveis');
    }
  }

  // Criar agendamento de consulta
  async createAppointment(appointmentData: AppointmentData): Promise<Appointment> {
    try {
      const response = await api.post('/consultas', appointmentData);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      const errorMessage = error.response?.data?.erro || 'Erro ao criar agendamento';
      throw new Error(errorMessage);
    }
  }

  // Buscar consultas do paciente
  async getPatientAppointments(pacienteId: number): Promise<Appointment[]> {
    try {
      const response = await api.get(`/consultas/paciente/${pacienteId}`);
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      throw new Error('Erro ao buscar consultas');
    }
  }

  // Cancelar consulta
  async cancelAppointment(appointmentId: number): Promise<void> {
    try {
      await api.put(`/consultas/${appointmentId}`, {
        status: 'cancelada'
      });
    } catch (error: any) {
      console.error('Erro ao cancelar consulta:', error);
      const errorMessage = error.response?.data?.erro || 'Erro ao cancelar consulta';
      throw new Error(errorMessage);
    }
  }

  // Buscar especialidades médicas
  async getSpecialties(): Promise<string[]> {
    try {
      const response = await api.get('/specialties');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
      throw new Error('Erro ao buscar especialidades');
    }
  }

  // Buscar médicos por especialidade
  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors', {
        params: { specialty }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar médicos por especialidade:', error);
      throw new Error('Erro ao buscar médicos por especialidade');
    }
  }
}

export const agendamentoService = new AgendamentoService(); 