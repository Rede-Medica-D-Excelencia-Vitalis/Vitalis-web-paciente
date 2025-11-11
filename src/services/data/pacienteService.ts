import { api, ApiResponse } from "../../lib/api";
import { Paciente } from "../../types/api";

/**
 * Busca o perfil do paciente logado.
 * @returns {Promise<Paciente>} Os dados do perfil do paciente.
 */
export async function getProfile(): Promise<Paciente> {
  try {
    console.log('🔍 Chamando API /pacientes/me...');
    const response = await api.get<Paciente>('/pacientes/me');
    console.log('✅ Resposta da API:', response.data);
    const payload = response.data as any;
    const paciente: Paciente | undefined = payload?.data ?? payload;

    if (!paciente) {
      throw new Error('Perfil de paciente não encontrado na resposta da API.');
    }

    return paciente;
  } catch (error: any) {
    console.error("❌ Erro ao buscar perfil do paciente:", error);
    console.error("❌ Status da resposta:", error.response?.status);
    console.error("❌ Dados da resposta:", error.response?.data);
    
    // Se o erro for 404 (perfil não encontrado), tentar criar automaticamente
    if (error.response?.status === 404) {
      console.log("⚠️ Perfil não encontrado, tentando criar automaticamente...");
      try {
        // Tentar criar um perfil básico usando a rota /me
        const createResponse = await api.post<Paciente>('/pacientes/me', {
          // Dados básicos vazios - o backend deve preencher com dados do usuário
        });
        console.log("✅ Perfil criado automaticamente:", createResponse.data);
        const createdPayload = createResponse.data as any;
        const pacienteCriado: Paciente | undefined = createdPayload?.data ?? createdPayload;

        if (!pacienteCriado) {
          throw new Error("Perfil criado automaticamente, mas dados não retornados.");
        }

        return pacienteCriado;
      } catch (createError) {
        console.error("❌ Erro ao criar perfil automaticamente:", createError);
        throw new Error("Não foi possível criar o perfil automaticamente. Por favor, complete seu cadastro.");
      }
    }
    
    throw error;
  }
}

/**
 * Atualiza o perfil do paciente logado.
 * @param {Partial<Paciente>} profileData - Os dados do perfil a serem atualizados.
 * @returns {Promise<{mensagem: string, paciente: Paciente}>} A mensagem de sucesso e os dados atualizados.
 */
export async function updateProfile(profileData: Partial<Paciente>): Promise<{mensagem: string, paciente: Paciente}> {
  try {
    console.log('💾 Atualizando perfil com dados:', profileData);
    const response = await api.put<{mensagem: string, paciente: Paciente}>('/pacientes/me', profileData);
    console.log('✅ Perfil atualizado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao atualizar perfil do paciente:", error);
    console.error("❌ Status da resposta:", error.response?.status);
    console.error("❌ Dados da resposta:", error.response?.data);
    throw error;
  }
}

/**
 * Cria um novo perfil de paciente.
 * @param {Partial<Paciente>} profileData - Os dados do perfil a serem criados.
 * @returns {Promise<Paciente>} Os dados do perfil criado.
 */
export async function createProfile(profileData: Partial<Paciente>): Promise<Paciente> {
  try {
    const response = await api.post<Paciente>('/pacientes', profileData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar perfil do paciente:", error);
    throw error;
  }
} 