import React, { useState, useEffect } from 'react';
import { Calendar } from '../../components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircleIcon, ClockIcon, CalendarIcon, UserIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react';
import { agendamentoService, Doctor, AvailableSlot } from '../../services/consultation/agendamentoService';
import { useAuthStore } from '../../store/auth';

export const Agendamento = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  // Carregar médicos disponíveis
  useEffect(() => {
    const loadDoctors = async () => {
      setLoadingDoctors(true);
      setError(null);
      try {
        const doctorsData = await agendamentoService.getDoctors();
        setDoctors(doctorsData);
      } catch (error: any) {
        setError(error.message);
        console.error('Erro ao carregar médicos:', error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []);

  // Carregar horários disponíveis quando médico e data são selecionados
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      setError(null);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const slots = await agendamentoService.getAvailableSlots(selectedDoctor.id, formattedDate);
        setAvailableSlots(slots);
      } catch (error: any) {
        setError(error.message);
        console.error('Erro ao carregar horários:', error);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, [selectedDoctor, selectedDate]);

  const handleConfirmAppointment = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      setError('Dados incompletos para agendamento');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const appointmentData = {
        paciente_id: parseInt(user.id),
        medico_id: selectedDoctor.id,
        data: format(selectedDate, 'yyyy-MM-dd'),
        hora: selectedTime,
        tipo: 'consulta' as const,
        observacoes: ''
      };

      await agendamentoService.createAppointment(appointmentData);
      setIsConfirmed(true);
    } catch (error: any) {
      setError(error.message);
      console.error('Erro ao confirmar agendamento:', error);
    } finally {
      setLoading(false);
    }
  };

  // Resetar seleções quando data muda
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedDoctor(null);
    setSelectedTime(null);
  };

  // Resetar horário quando médico muda
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedTime(null);
  };

  const tips = [
    {
      icon: <ClockIcon className="w-5 h-5 text-blue-600" />,
      title: "Chegue com Antecedência",
      description: "Para consultas presenciais, chegue 15 minutos antes do horário marcado"
    },
    {
      icon: <CalendarIcon className="w-5 h-5 text-blue-600" />,
      title: "Reagendamento",
      description: "Caso precise remarcar, faça com pelo menos 24 horas de antecedência"
    },
    {
      icon: <UserIcon className="w-5 h-5 text-blue-600" />,
      title: "Documentos Necessários",
      description: "Traga documento com foto e cartão do convênio (se aplicável)"
    },
    {
      icon: <AlertCircleIcon className="w-5 h-5 text-blue-600" />,
      title: "Preparo",
      description: "Anote suas dúvidas e traga exames anteriores relevantes"
    }
  ];

  // Etapas do fluxo
  const currentStep = !selectedDate ? 1 : !selectedDoctor ? 2 : !selectedTime ? 3 : 4;
  const steps = [
    { icon: <CalendarIcon className="w-5 h-5" />, label: "Data" },
    { icon: <UserIcon className="w-5 h-5" />, label: "Médico" },
    { icon: <ClockIcon className="w-5 h-5" />, label: "Horário" },
    { icon: <CheckCircleIcon className="w-5 h-5" />, label: "Confirmação" },
  ];

  if (isConfirmed) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-blue-50">
        <Card className="w-full max-w-lg p-8 shadow-2xl border-2 border-blue-200 bg-white animate-fade-in">
          <CardContent className="flex flex-col items-center text-center gap-6">
            <div className="relative flex items-center justify-center mb-2 animate-drop-in mt-8">
              <span className="absolute flex h-20 w-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-20 w-20 bg-green-500 items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-green-600 flex items-center gap-2 mt-16">
              Agendamento Confirmado!
            </h2>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex flex-col items-center gap-2 bg-blue-100 rounded-xl p-6 shadow w-full">
                <p className="font-semibold text-blue-900 text-lg flex items-center gap-2 justify-center">
                  <CalendarIcon className="w-6 h-6 text-blue-700" />
                  Data: <span className="ml-1">{selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </p>
                <p className="font-semibold text-blue-900 text-lg flex items-center gap-2 justify-center">
                  <ClockIcon className="w-6 h-6 text-blue-700" />
                  Horário: <span className="ml-1">{selectedTime}</span>
                </p>
                <div className="flex flex-col items-center gap-2 mt-2">
                  <img
                    src={selectedDoctor?.image || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"}
                    alt={selectedDoctor?.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow"
                  />
                  <span className="text-blue-900 font-semibold text-lg">{selectedDoctor?.name}</span>
                  <span className="text-blue-700 text-base font-medium">{selectedDoctor?.specialty}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => setIsConfirmed(false)} className="mt-4 px-8 py-3 text-lg font-bold bg-blue-700 hover:bg-blue-800 transition-all">
              Fazer novo agendamento
            </Button>
          </CardContent>
          <style>{`
            .animate-fade-in {
              opacity: 0;
              animation: fadeIn 0.8s forwards;
            }
            @keyframes fadeIn {
              to { opacity: 1; }
            }
            .animate-drop-in {
              animation: dropIn 0.7s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes dropIn {
              0% { opacity: 0; transform: translateY(-80px) scale(0.7); }
              60% { opacity: 1; transform: translateY(10px) scale(1.1); }
              80% { transform: translateY(-4px) scale(0.98); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Agendamento de Consulta</h1>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Etapas do fluxo */}
      <div className="flex items-center justify-center gap-4 mb-8 relative">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className={`flex flex-col items-center z-10 transition-all duration-300 ${currentStep === idx + 1 ? 'text-blue-700 font-bold scale-110' : 'text-gray-400 scale-100'}`}>
              <div className={`rounded-full p-3 mb-1 flex items-center justify-center transition-all duration-300
                ${currentStep === idx + 1 ? 'bg-blue-100 shadow-lg ring-2 ring-blue-300 animate-pulse-step' : 'bg-gray-100'}
              `}>
                <span className={`transition-transform duration-300 ${currentStep === idx + 1 ? 'scale-125 animate-pop-step' : ''}`}>{step.icon}</span>
              </div>
              <span className="text-xs transition-colors duration-300">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 relative">
                <div className={`absolute top-1/2 left-0 right-0 h-1 rounded-full transition-all duration-300
                  ${currentStep > idx + 1 ? 'bg-blue-400' : 'bg-gray-200'}
                `} style={{ transform: 'translateY(-50%)' }} />
                {currentStep === idx + 2 && (
                  <div className="absolute top-1/2 left-0 h-1 rounded-full bg-blue-300 animate-progress-step" style={{ width: '100%', transform: 'translateY(-50%)' }} />
                )}
              </div>
            )}
          </React.Fragment>
        ))}
        <style>{`
          @keyframes pulse-step {
            0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
            70% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
            100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
          }
          .animate-pulse-step {
            animation: pulse-step 1.2s infinite;
          }
          @keyframes pop-step {
            0% { transform: scale(1); }
            50% { transform: scale(1.25); }
            100% { transform: scale(1); }
          }
          .animate-pop-step {
            animation: pop-step 0.4s;
          }
          @keyframes progress-step {
            0% { width: 0; }
            100% { width: 100%; }
          }
          .animate-progress-step {
            animation: progress-step 0.7s cubic-bezier(0.4,0,0.2,1);
          }
        `}</style>
      </div>
      
      <div className={`grid ${!selectedDate ? 'grid-cols-1 place-items-center' : 'grid-cols-1 md:grid-cols-2'} gap-8`}>
        <Card className={!selectedDate ? 'w-full max-w-md' : ''}>
          <CardHeader>
            <CardTitle>Selecione a Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-2xl border-2 border-blue-200 shadow-lg p-4 bg-white calendar-vitalis"
                locale={ptBR}
                disabled={(date) => {
                  const today = new Date();
                  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  
                  return dateOnly < todayOnly ||
                    date > new Date(new Date().setDate(new Date().getDate() + 60));
                }}
              />
            </div>
            <style>{`
              .calendar-vitalis {
                font-size: 1.15rem;
                min-width: 370px;
                max-width: 420px;
              }
              .calendar-vitalis .rdp-day_selected,
              .calendar-vitalis .rdp-day_selected:focus {
                background: #1d4ed8 !important;
                color: #fff !important;
                border-radius: 0.75rem !important;
                box-shadow: 0 2px 8px 0 rgba(30,64,175,0.10);
              }
              .calendar-vitalis .rdp-day_today:not(.rdp-day_selected) {
                background: #dbeafe !important;
                color: #1d4ed8 !important;
                border-radius: 0.75rem !important;
              }
              .calendar-vitalis .rdp-day:not(.rdp-day_selected):not(.rdp-day_disabled):hover {
                background: #60a5fa !important;
                color: #fff !important;
                border-radius: 0.75rem !important;
                transition: background 0.2s;
              }
              .calendar-vitalis .rdp-caption_label {
                color: #1e40af !important;
                font-weight: 700;
                font-size: 1.2rem;
              }
              .calendar-vitalis .rdp-nav_button {
                background: #e0e7ff !important;
                color: #1d4ed8 !important;
                border-radius: 0.5rem !important;
                font-size: 1.2rem;
                margin: 0 0.2rem;
                transition: background 0.2s;
              }
              .calendar-vitalis .rdp-nav_button:hover {
                background: #1d4ed8 !important;
                color: #fff !important;
              }
              .calendar-vitalis .rdp-head_cell {
                color: #2563eb !important;
                font-weight: 600;
                font-size: 1rem;
              }
              .calendar-vitalis .rdp-day_disabled {
                color: #cbd5e1 !important;
                background: transparent !important;
                cursor: not-allowed !important;
              }
            `}</style>
          </CardContent>
        </Card>

        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle>Médicos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingDoctors ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2Icon className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Carregando médicos...</span>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum médico disponível para esta data
                </div>
              ) : (
                doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={doctor.image || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500">CRM: {doctor.crm}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {selectedDoctor && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Horários Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2Icon className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Carregando horários...</span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum horário disponível para este médico nesta data
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {availableSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={selectedTime === slot ? "default" : "outline"}
                        onClick={() => setSelectedTime(slot)}
                        className="w-full"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>

                  {selectedTime && (
                    <Button
                      onClick={handleConfirmAppointment}
                      disabled={loading}
                      className="w-full mt-8"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2Icon className="w-4 h-4 animate-spin" />
                          Confirmando...
                        </div>
                      ) : (
                        'Confirmar Agendamento'
                      )}
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
              Dicas para sua Consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};