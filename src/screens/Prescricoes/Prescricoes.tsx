import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FileTextIcon, DownloadIcon, CalendarIcon, Loader2, Pill, FileSignature, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useApi } from '../../hooks/api/useApi';
import { getMinhasPrescricoes } from '../../services/consultation/prescricaoService';

interface DocumentoMedico {
  id: string;
  tipo: 'receita' | 'atestado';
  titulo: string;
  medico?: {
    nome: string;
    especialidade: string;
    crm: string;
  };
  medicamentos?: Array<{
    nome: string;
    principio_ativo?: string;
    dosagem: string;
    apresentacao?: string;
    frequencia: string;
    duracao: string;
    via_administracao?: string;
    horarios?: string;
    observacoes_medicamento?: string;
  }>;
  dias_afastamento?: number;
  motivo?: string;
  diagnostico?: string;
  restricoes?: string;
  retorno?: string;
  observacoes?: string;
  validade: string;
  codigo_documento: string;
  data_criacao: string;
  data_consulta?: string;
  status: string;
}

export const Prescricoes = () => {
  const { data: documentos, loading, error, execute: fetchDocumentos } = useApi<DocumentoMedico[]>(getMinhasPrescricoes);

  // Função para formatar datas de forma segura
  const formatarData = (dataString: string | null | undefined): string => {
    if (!dataString) return 'Data não informada';
    
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) {
        return 'Data inválida';
      }
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para verificar se documento está expirado
  const verificarExpirado = (dataValidade: string | null | undefined): boolean => {
    if (!dataValidade) return true;
    
    try {
      const hoje = new Date();
      const validade = new Date(dataValidade);
      return validade < hoje;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const downloadDocumento = async (documento: DocumentoMedico) => {
    try {
      console.log('=== DEBUG DOWNLOAD DOCUMENTO ===');
      console.log('documento:', documento);
      console.log('documento.tipo:', documento.tipo);
      console.log('typeof documento.tipo:', typeof documento.tipo);
      console.log('documento.id:', documento.id);
      console.log('documento.medico:', documento.medico);
      
      let url = '';
      
      if (documento.tipo === 'receita') {
        url = `/documentos-medicos/${documento.id}/pdf-receita`;
      } else if (documento.tipo === 'atestado') {
        url = `/documentos-medicos/${documento.id}/pdf-atestado`;
      } else {
        throw new Error(`Tipo de documento não suportado: ${documento.tipo}`);
      }

      console.log('URL do download:', url);
      console.log('Token:', localStorage.getItem('token'));
      console.log('URL completa:', `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${url}`);

      // Fazer download do PDF usando a API configurada
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}${url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        throw new Error(`Erro ao gerar PDF: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('Blob criado, tamanho:', blob.size);
      console.log('Blob type:', blob.type);
      
      const url_download = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_download;
      a.download = `${documento.tipo}-${documento.codigo_documento}.pdf`;
      console.log('Nome do arquivo:', a.download);
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url_download);
      
      console.log('Download concluído');
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <p className="text-red-600">Erro ao carregar os documentos médicos.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Meus Documentos Médicos</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 gap-6">
          {documentos && documentos.length > 0 ? (
            documentos.map((documento) => (
            <Card key={documento.id} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    documento.tipo === 'receita' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {documento.tipo === 'receita' ? (
                      <Pill className="w-6 h-6 text-blue-600" />
                    ) : (
                      <FileSignature className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                      <CardTitle className="text-xl">{documento.titulo}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Dr(a). {documento.medico?.nome || 'Médico não informado'} - {documento.medico?.especialidade || 'Especialidade não informada'}
                      </p>
                      <p className="text-xs text-gray-400">CRM: {documento.medico?.crm || 'CRM não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {verificarExpirado(documento.validade) && (
                    <div className="flex items-center gap-1 text-orange-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Expirado</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => downloadDocumento(documento)}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                      <span>{formatarData(documento.data_criacao)}</span>
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Código: {documento.codigo_documento}
                  </div>
                </div>

                {documento.tipo === 'receita' && documento.medicamentos && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medicamentos
                    </h3>
                    <div className="grid gap-4">
                      {documento.medicamentos.map((med, index) => (
                        <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-blue-900">{med.nome}</h4>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {med.dosagem}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            {med.principio_ativo && (
                              <div>
                                <span className="font-medium">Princípio Ativo:</span> {med.principio_ativo}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Frequência:</span> {med.frequencia}
                            </div>
                            <div>
                              <span className="font-medium">Duração:</span> {med.duracao}
                            </div>
                            {med.apresentacao && (
                              <div>
                                <span className="font-medium">Apresentação:</span> {med.apresentacao}
                              </div>
                            )}
                            {med.via_administracao && (
                              <div>
                                <span className="font-medium">Via:</span> {med.via_administracao}
                              </div>
                            )}
                            {med.horarios && (
                              <div>
                                <span className="font-medium">Horários:</span> {med.horarios}
                              </div>
                            )}
                          </div>
                          {med.observacoes_medicamento && (
                            <div className="mt-2 p-2 bg-blue-100 rounded text-sm">
                              <span className="font-medium">Observações:</span> {med.observacoes_medicamento}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {documento.tipo === 'atestado' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileSignature className="w-4 h-4" />
                      Detalhes do Atestado
                    </h3>
                    <div className="grid gap-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-green-800">Diagnóstico:</span>
                            <p className="text-gray-700 mt-1">{documento.diagnostico}</p>
                          </div>
                          <div>
                            <span className="font-medium text-green-800">Motivo:</span>
                            <p className="text-gray-700 mt-1">{documento.motivo}</p>
                          </div>
                          <div>
                            <span className="font-medium text-green-800">Dias de Afastamento:</span>
                            <p className="text-gray-700 mt-1">{documento.dias_afastamento} dias</p>
                          </div>
                          {documento.retorno && (
                            <div>
                              <span className="font-medium text-green-800">Data de Retorno:</span>
                              <p className="text-gray-700 mt-1">{documento.retorno}</p>
                            </div>
                          )}
                        </div>
                        {documento.restricoes && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <span className="font-medium text-yellow-800">Restrições e Orientações:</span>
                            <p className="text-gray-700 mt-1">{documento.restricoes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {documento.observacoes && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Observações Adicionais</h3>
                      <p className="text-gray-600">{documento.observacoes}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Validade:</span> Até {formatarData(documento.validade)}
                  </p>
                  {verificarExpirado(documento.validade) && (
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠️ Este documento expirou em {formatarData(documento.validade)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <FileTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhum documento médico encontrado</p>
              <p className="text-sm">Seus documentos médicos aparecerão aqui quando forem criados pelos médicos.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};