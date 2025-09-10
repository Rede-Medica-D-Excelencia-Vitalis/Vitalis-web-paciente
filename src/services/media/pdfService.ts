import { api } from '../../lib/api';

export interface PerguntaResposta {
  pergunta: string;
  resposta: string;
}

export interface TriagemPDFData {
  paciente_nome: string;
  data_triagem?: string;
  nivel_risco: string;
  sintomas: string[];
  especialidades_recomendadas: string[];
  observacoes?: string;
  perguntas_respostas?: PerguntaResposta[];
}

export interface PDFResponse {
  success: boolean;
  message: string;
  data?: {
    fileName: string;
    downloadUrl: string;
    filePath: string;
  };
}

/**
 * Serviço para geração de relatórios PDF da triagem
 */
export class PDFService {
  /**
   * Gera PDF da triagem e retorna URL para download
   * @param triagemData - Dados da triagem
   * @returns Promise com resposta da API
   */
  static async generateTriagemPDF(triagemData: TriagemPDFData): Promise<PDFResponse> {
    try {
      const response = await api.post('/pdf/generate-url', { triagemData });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error(error.response?.data?.message || 'Erro ao gerar PDF');
    }
  }

  /**
   * Gera PDF da triagem e faz download direto
   * @param triagemData - Dados da triagem
   * @returns Promise com blob do PDF
   */
  static async generateAndDownloadPDF(triagemData: TriagemPDFData): Promise<Blob> {
    try {
      const response = await api.post('/pdf/generate', { triagemData }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao gerar e baixar PDF:', error);
      throw new Error('Erro ao gerar PDF para download');
    }
  }

  /**
   * Faz download de um PDF específico
   * @param fileName - Nome do arquivo PDF
   * @returns Promise com blob do PDF
   */
  static async downloadPDF(fileName: string): Promise<Blob> {
    try {
      const response = await api.get(`/pdf/download/${fileName}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao baixar PDF:', error);
      throw new Error('Erro ao baixar PDF');
    }
  }

  /**
   * Lista todos os PDFs gerados
   * @returns Promise com lista de PDFs
   */
  static async listPDFs(): Promise<any[]> {
    try {
      const response = await api.get('/pdf/list');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao listar PDFs:', error);
      throw new Error('Erro ao listar PDFs');
    }
  }

  /**
   * Remove um PDF específico
   * @param fileName - Nome do arquivo PDF
   * @returns Promise com resposta da API
   */
  static async deletePDF(fileName: string): Promise<PDFResponse> {
    try {
      const response = await api.delete(`/pdf/delete/${fileName}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao deletar PDF:', error);
      throw new Error(error.response?.data?.message || 'Erro ao deletar PDF');
    }
  }

  /**
   * Salva um blob como arquivo no navegador
   * @param blob - Blob do PDF
   * @param fileName - Nome do arquivo
   */
  static saveBlobAsFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Gera PDF da triagem e salva automaticamente
   * @param triagemData - Dados da triagem
   * @param customFileName - Nome personalizado do arquivo (opcional)
   */
  static async generateAndSavePDF(triagemData: TriagemPDFData, customFileName?: string): Promise<void> {
    try {
      // Gerar PDF e obter URL
      const response = await this.generateTriagemPDF(triagemData);
      
      if (response.success && response.data) {
        // Fazer download do PDF
        const blob = await this.downloadPDF(response.data.fileName);
        
        // Salvar arquivo
        const fileName = customFileName || response.data.fileName;
        this.saveBlobAsFile(blob, fileName);
        
        console.log('PDF gerado e salvo com sucesso:', fileName);
      } else {
        throw new Error(response.message || 'Erro ao gerar PDF');
      }
    } catch (error) {
      console.error('Erro ao gerar e salvar PDF:', error);
      throw error;
    }
  }
}

export default PDFService; 