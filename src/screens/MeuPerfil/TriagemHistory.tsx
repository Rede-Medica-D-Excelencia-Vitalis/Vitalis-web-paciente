import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  ActivityIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  DownloadIcon,
  CalendarIcon,
  BrainIcon,
  HeartIcon,
  StethoscopeIcon
} from 'lucide-react';
import { triagemService } from "../../services/consultation/triagemService";
import { useAuthStore } from '../../store/auth';

interface TriagemHistoryProps {
  pacienteId: number;
}

export const TriagemHistory: React.FC<TriagemHistoryProps> = ({ pacienteId }) => {
  const [triagens, setTriagens] = useState<TriagemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTriagemHistory();
  }, [pacienteId]);

  const loadTriagemHistory = async () => {
    try {
      setLoading(true);
      const history = await triagemService.getTriagemHistory(pacienteId);
      setTriagens(history);
    } catch (error) {
      console.error('Erro ao carregar histórico de triagem:', error);
      setError('Erro ao carregar histórico de triagem');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'muito_grave': return 'text-red-600 bg-red-100 border-red-200';
      case 'grave': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'moderado': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'leve': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'muito_grave': return <AlertTriangleIcon className="w-5 h-5" />;
      case 'grave': return <ActivityIcon className="w-5 h-5" />;
      case 'moderado': return <ClockIcon className="w-5 h-5" />;
      case 'leve': return <CheckCircleIcon className="w-5 h-5" />;
      default: return <StethoscopeIcon className="w-5 h-5" />;
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'cardiologia': return <HeartIcon className="w-4 h-4" />;
      case 'neurologia': return <BrainIcon className="w-4 h-4" />;
      case 'psicologia': return <BrainIcon className="w-4 h-4" />;
      default: return <StethoscopeIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadTriagem = async (triagem: TriagemData) => {
    try {
      console.log('📥 Iniciando download do PDF da triagem:', triagem.id);
      
      // Fazer requisição para o backend gerar o PDF
      const response = await fetch(`http://localhost:3001/api/triagem/${triagem.id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar PDF: ${response.status}`);
      }

      // Obter o blob do PDF
      const blob = await response.blob();
      
      // Criar URL para download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `triagem-vitalis-${triagem.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ PDF baixado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao baixar PDF:', error);
      alert('Erro ao baixar o PDF. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico de triagens...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadTriagemHistory} variant="outline">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (triagens.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <StethoscopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma triagem encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Você ainda não realizou nenhuma triagem inteligente.
          </p>
          <Button onClick={() => window.location.href = '/triagem-online'}>
            Fazer Primeira Triagem
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Histórico de Triagens ({triagens.length})
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/triagem-online'}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Nova Triagem
        </Button>
      </div>

      <div className="space-y-4">
        {triagens.map((triagem, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRiskLevelIcon(triagem.nivel_risco)}
                  <div>
                    <CardTitle className="text-lg">
                      Triagem #{index + 1}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {formatDate(triagem.data_triagem)}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(triagem.nivel_risco)}`}>
                  {triagem.nivel_risco.toUpperCase()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sintomas */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Sintomas Detectados:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {triagem.sintomas.map((symptom, symptomIndex) => (
                    <div key={symptomIndex} className="p-2 bg-blue-50 rounded text-blue-800 text-sm">
                      • {symptom}
                    </div>
                  ))}
                </div>
              </div>

              {/* Especialidades Recomendadas */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Especialidades Recomendadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {triagem.especialidades_recomendadas.map((specialty, specialtyIndex) => (
                    <div key={specialtyIndex} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {getSpecialtyIcon(specialty)}
                      <span className="capitalize">{specialty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observações */}
              {triagem.observacoes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Observações:</h4>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                    {triagem.observacoes}
                  </p>
                </div>
              )}

              {/* Ações */}
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTriagem(triagem)}
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Baixar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 