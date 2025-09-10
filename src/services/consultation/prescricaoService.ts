import { api } from "../../lib/api";
import { Prescription } from "../../types/api";

/**
 * Busca os documentos médicos do paciente logado.
 * @returns {Promise<Prescription[]>} Uma lista de documentos médicos.
 */
export async function getMinhasPrescricoes(): Promise<Prescription[]> {
  try {
    const response = await api.get('/documentos-medicos/paciente/meus-documentos');
    
    console.log('=== DEBUG PRESCRICAO SERVICE ===');
    console.log('Response data:', response.data);
    
    // Retornar os dados diretamente do backend, que já estão no formato correto
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os documentos médicos do paciente:", error);
    throw error;
  }
} 