import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { InfoIcon, HistoryIcon, VideoIcon, CalendarPlusIcon, ArrowRightIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { useApi } from "../../hooks/api/useApi";
import { getMinhasConsultas } from "../../services/consultation/consultationService";
import { Consultation } from "../../types/api";

const dicas = [
  "Prepare seus documentos e exames recentes.",
  "Esteja em um local silencioso e com boa conexão à internet.",
  "Tenha papel e caneta para anotações.",
  "Se possível, acesse a consulta com 5 minutos de antecedência."
];

const cards = [
  {
    to: "/agendamento",
    icon: <CalendarPlusIcon className="w-8 h-8 text-blue-600" />,
    title: "Marcar Consulta",
    desc: "Agende uma nova consulta médica de forma rápida e fácil.",
    step: 1
  },
  {
    to: "/teleconsulta",
    icon: <VideoIcon className="w-8 h-8 text-blue-600" />,
    title: "Acessar Teleconsulta",
    desc: "Entre na sala virtual da sua consulta online.",
    step: 2
  },
  {
    to: "/consultas-anteriores",
    icon: <HistoryIcon className="w-8 h-8 text-blue-600" />,
    title: "Histórico de Consultas",
    desc: "Veja todas as consultas já realizadas na Vitalis.",
    step: 3
  },
];

const ConsultasDashboard: React.FC = () => {
  const { data: consultations, execute: fetchConsultas } = useApi<Consultation[]>(getMinhasConsultas);

  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);


  const consultasAgendadas = useMemo(() => {
    if (!consultations) return [];
    return consultations.filter(c => c.status === 'agendada' || c.status === 'confirmada');
  }, [consultations]);

  const consultasRealizadas = useMemo(() => {
    if (!consultations) return [];
    return consultations.filter(c => c.status === 'concluída' || c.status === 'realizada');
  }, [consultations]);

  
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-2 text-blue-900 animate-fade-in">Área de Consultas</h1>
      <p className="mb-8 text-blue-800 text-lg animate-fade-in delay-100">Gerencie suas consultas médicas de forma simples e eficiente.</p>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{consultasAgendadas.length}</div>
          <div className="text-sm text-blue-600">Consultas Agendadas</div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{consultasRealizadas.length}</div>
          <div className="text-sm text-green-600">Consultas Realizadas</div>
        </div>
      </div>

      {/* Dicas para a Consulta */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow-lg p-7 border border-blue-200 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <InfoIcon className="w-7 h-7 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">Dicas para sua Consulta</h2>
          </div>
          <ul className="list-disc pl-5 text-blue-800 text-sm space-y-2">
            {dicas.map((dica, idx) => (
              <li key={idx}>{dica}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cards de Ação - Fluxo do Usuário */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 animate-fade-in delay-200">O que você deseja fazer?</h2>
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {cards.map((card, idx) => (
            <React.Fragment key={card.title}>
              <Link
                to={card.to}
                className="group flex-1 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow-lg p-7 border border-blue-200 flex flex-col items-center justify-center transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl text-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {card.icon}
                  </span>
                </div>
                <span className="text-xs text-blue-500 font-bold mb-1">Passo {card.step}</span>
                <h3 className="text-lg font-bold mb-1 text-blue-900 group-hover:text-blue-700 transition-colors">{card.title}</h3>
                <p className="text-blue-800 text-sm">{card.desc}</p>
              </Link>
              {idx < cards.length - 1 && (
                <div className="hidden md:flex flex-col justify-center items-center">
                  <ArrowRightIcon className="w-6 h-6 text-blue-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Lista de consultas agendadas */}
      {consultasAgendadas.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Suas Consultas Agendadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultasAgendadas.map((consulta) => (
              <div key={consulta.id} className="bg-white rounded-xl shadow p-5 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={consulta.doctor.avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"} 
                    alt={consulta.doctor.name} 
                    className="w-10 h-10 rounded-full object-cover border border-blue-200" 
                  />
                  <div>
                    <div className="font-semibold text-blue-900 text-sm">{consulta.doctor.name}</div>
                    <div className="text-blue-600 text-xs">{consulta.doctor.specialty}</div>
                  </div>
                </div>
                <div className="space-y-1 text-blue-800 text-xs mb-3">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3 text-blue-600" />
                    <span>{consulta.date.split('-').reverse().join('/')} às {consulta.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3 text-blue-600" />
                    <span>{consulta.type === 'teleconsulta' ? 'Online' : 'Presencial'}</span>
                  </div>
                </div>
                {consulta.type === 'teleconsulta' && (
                  <Link
                    to={`/teleconsulta/${consulta.id}`}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <VideoIcon className="w-3 h-3" />
                    Entrar
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.8s forwards;
        }
        .animate-fade-in.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ConsultasDashboard; 