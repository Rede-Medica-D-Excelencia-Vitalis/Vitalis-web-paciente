import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Button } from '../../components/ui/button';
import { CalendarIcon, ClockIcon, UserIcon, StarIcon, FileTextIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/api/useApi';
import { getMinhasConsultas } from '../../services/consultation/consultationService';
import { Consultation } from '../../types/api';

// Função utilitária para formatar data corretamente
const formatarData = (dataString: string): string => {
  // Se a data já está no formato YYYY-MM-DD, usar diretamente
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  
  // Se for uma data ISO, converter considerando fuso horário local
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
};

export const ConsultasAnteriores = () => {
  const navigate = useNavigate();
  const { data, loading, error, execute: fetchConsultas } = useApi<Consultation[]>(getMinhasConsultas);

  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  const consultations = data?.filter(
    c => c.status === 'concluída' || c.status === 'cancelada'
  ) || [];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
        <p className="text-red-600">Erro ao carregar o histórico de consultas.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Histórico de Consultas</h1>
        <Button onClick={() => navigate('/agendamento')}>
          <CalendarIcon className="w-4 h-4 mr-2" />
          Agendar Nova Consulta
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 gap-6">
          {consultations.length > 0 ? (
            consultations.map((consultation) => (
            <Card key={consultation.id} className={`bg-white ${consultation.status === 'cancelada' ? 'opacity-75' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                      <CardTitle className="text-xl">{consultation.doctor.name}</CardTitle>
                      <p className="text-sm text-gray-500">{consultation.doctor.specialty}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  consultation.status === 'concluída' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatarData(consultation.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{consultation.time}</span>
                  </div>

                </div>

                {consultation.status === 'concluída' && (
                  <>
                      {consultation.rating && (
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                            {renderStars(consultation.rating)}
                      </div>
                      {consultation.feedback && (
                        <p className="text-gray-600 italic">"{consultation.feedback}"</p>
                      )}
                    </div>
                      )}

                      {consultation.prescription && (
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                            onClick={() => navigate(`/prescricoes/${consultation.id}`)}
                        >
                          <FileTextIcon className="w-4 h-4 mr-2" />
                          Ver Prescrição
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Nenhuma consulta foi encontrada no seu histórico.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};