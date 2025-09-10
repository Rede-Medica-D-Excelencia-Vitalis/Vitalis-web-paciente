import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StethoscopeIcon, HistoryIcon, FileTextIcon, UserIcon, CalendarIcon, ClockIcon, VideoIcon, HeartIcon, PillIcon, AlertTriangleIcon, PhoneIcon, MessageCircleIcon, XCircleIcon } from "lucide-react";
import { useApi } from "../../hooks/api/useApi";
import { getProfile } from "../../services/data/pacienteService";
import { getMinhasConsultas } from "../../services/consultation/consultationService";
import { Paciente, Consultation } from "../../types/api";

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

const cards = [
  {
    to: "/triagem-online",
    icon: <StethoscopeIcon className="w-8 h-8 text-blue-600" />,
    title: "Triagem Online",
    desc: "Avalie seus sintomas e receba orientações médicas."
  },
  {
    to: "/agendamento",
    icon: <CalendarIcon className="w-8 h-8 text-blue-600" />,
    title: "Agendar Consulta",
    desc: "Marque sua consulta com nossos especialistas."
  },
  {
    to: "/teleconsulta",
    icon: <VideoIcon className="w-8 h-8 text-blue-600" />,
    title: "Teleconsulta",
    desc: "Acesse suas consultas online e videochamadas."
  },
  {
    to: "/consultas-anteriores",
    icon: <HistoryIcon className="w-8 h-8 text-blue-600" />,
    title: "Histórico Médico",
    desc: "Acesse todas as suas consultas e exames."
  },
  {
    to: "/prescricoes",
    icon: <FileTextIcon className="w-8 h-8 text-blue-600" />,
    title: "Prescrições",
    desc: "Suas receitas e prescrições médicas digitais."
  },
  {
    to: "/farmacia",
    icon: <PillIcon className="w-8 h-8 text-blue-600" />,
    title: "Farmácia Online",
    desc: "Compre seus medicamentos com entrega rápida."
  },
  {
    to: "/central-ajuda",
    icon: <MessageCircleIcon className="w-8 h-8 text-blue-600" />,
    title: "Suporte 24/7",
    desc: "Fale com nosso time de suporte a qualquer hora."
  },
];

function isConsultaDisponivel(data: string, hora: string) {
  const agora = new Date();
  const dataHoraConsulta = new Date(`${data}T${hora}`);
  const toleranciaMinutos = 15;
  
  // Adicionar tolerância de 15 minutos após o horário da consulta
  const dataHoraLimite = new Date(dataHoraConsulta.getTime() + (toleranciaMinutos * 60 * 1000));
  
  // Consulta está disponível se:
  // 1. É hoje E está no horário da consulta OU
  // 2. É hoje E está dentro da tolerância de 15 minutos OU
  // 3. É uma data futura
  return (
    (agora.toISOString().slice(0, 10) === data && agora >= dataHoraConsulta) ||
    (agora.toISOString().slice(0, 10) === data && agora <= dataHoraLimite) ||
    agora < dataHoraConsulta
  );
}

function isConsultaPassada(data: string, hora: string) {
  const agora = new Date();
  const dataHoraConsulta = new Date(`${data}T${hora}`);
  const toleranciaMinutos = 15;
  
  // Adicionar tolerância de 15 minutos após o horário da consulta
  const dataHoraLimite = new Date(dataHoraConsulta.getTime() + (toleranciaMinutos * 60 * 1000));
  
  // Consulta é passada se já passou da tolerância
  return agora > dataHoraLimite;
}

const PacienteDashboard: React.FC = () => {
  const { data: perfil, loading: loadingPerfil, error: errorPerfil, execute: fetchProfile } = useApi<Paciente>(getProfile);
  const { data: consultas, loading: loadingConsultas, error: errorConsultas, execute: fetchConsultas } = useApi<Consultation[]>(getMinhasConsultas);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchConsultas();
  }, [fetchProfile, fetchConsultas]);

  const nomeUsuario = perfil?.nome || "Paciente";
  const isLoading = loadingPerfil || loadingConsultas;

  // Estatísticas rápidas
  const consultasAgendadas = consultas?.filter(c => c.status === 'agendada' || c.status === 'confirmada') || [];
  const consultasRealizadas = consultas?.filter(c => c.status === 'concluída') || [];
  const consultasCanceladas = consultas?.filter(c => c.status === 'cancelada') || [];
  
  // Separar consultas por status temporal
  const consultasFuturas = consultasAgendadas.filter(c => !isConsultaPassada(c.date, c.time));
  const consultasPassadas = consultasAgendadas.filter(c => isConsultaPassada(c.date, c.time));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-blue-800">Carregando sua área do paciente...</div>
      </div>
    );
  }

  // Se não tem perfil, mostrar modal para completar rapidamente
  if (errorPerfil && (errorPerfil.includes('Nenhum perfil de paciente encontrado') || errorPerfil.includes('Perfil de paciente não encontrado'))) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">👋</div>
            <h1 className="text-3xl font-bold text-blue-900 mb-4">Bem-vindo ao Vitalis!</h1>
            <p className="text-blue-800 mb-6 text-lg">
              Para começar a usar todos os recursos, precisamos de algumas informações básicas.
            </p>
            <button
              onClick={() => setShowProfileModal(true)}
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Completar Cadastro (2 min)
            </button>
          </div>
        </div>

        {/* Mostrar funcionalidades disponíveis mesmo sem perfil completo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.slice(0, 3).map((card, idx) => (
            <Link
              to={card.to}
              key={card.title}
              className="group block bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow-lg p-6 transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl border border-blue-200"
            >
              <div className="flex items-center justify-center mb-4">
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {React.cloneElement(card.icon, { className: 'w-10 h-10 text-blue-600' })}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-blue-900 group-hover:text-blue-700 transition-colors">{card.title}</h2>
              <p className="text-blue-800 text-sm">{card.desc}</p>
            </Link>
          ))}
        </div>

        {/* Modal de perfil rápido */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Completar Cadastro</h3>
              <p className="text-gray-600 mb-4">
                Preencha rapidamente suas informações básicas para começar a usar o Vitalis.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome Completo</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Seu nome completo"
                    defaultValue={nomeUsuario}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <Link
                  to="/meu-perfil"
                  className="flex-1 bg-blue-700 text-white px-4 py-2 rounded-lg text-center"
                >
                  Completar
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard completo para usuários com perfil
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-2 text-blue-900 animate-fade-in">Olá, {nomeUsuario}! 👋</h1>
      <p className="mb-8 text-blue-800 text-lg animate-fade-in delay-100">Bem-vindo à sua área do paciente. Aqui você tem acesso a todos os recursos do Vitalis.</p>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{consultasFuturas.length}</div>
          <div className="text-sm text-blue-600">Consultas Futuras</div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{consultasRealizadas.length}</div>
          <div className="text-sm text-green-600">Consultas Realizadas</div>
        </div>
        <div className="bg-purple-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">0</div>
          <div className="text-sm text-purple-600">Prescrições Ativas</div>
        </div>
        <div className="bg-orange-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">0</div>
          <div className="text-sm text-orange-600">Exames Pendentes</div>
        </div>
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{consultasPassadas.length}</div>
          <div className="text-sm text-red-600">Consultas Passadas</div>
        </div>
      </div>

      {/* Funcionalidades principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map((card, idx) => (
          <Link
            to={card.to}
            key={card.title}
            className="group block bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow-lg p-6 transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl border border-blue-200"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="transition-transform duration-200 group-hover:scale-110">
                {React.cloneElement(card.icon, { className: 'w-10 h-10 text-blue-600' })}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-blue-900 group-hover:text-blue-700 transition-colors">{card.title}</h2>
            <p className="text-blue-800 text-sm">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/triagem-online"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 border border-teal-200"
          >
            <AlertTriangleIcon className="w-6 h-6 text-teal-600" />
            <div>
              <div className="font-semibold text-teal-800">Triagem Médica</div>
              <div className="text-sm text-teal-700">Avaliar sintomas</div>
            </div>
          </Link>
          <Link
            to="/agendamento"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-sky-50 to-sky-100 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 border border-sky-200"
          >
            <CalendarIcon className="w-6 h-6 text-sky-600" />
            <div>
              <div className="font-semibold text-sky-800">Nova Consulta</div>
              <div className="text-sm text-sky-700">Agendar horário</div>
            </div>
          </Link>
          <Link
            to="/central-ajuda"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 border border-indigo-200"
          >
            <PhoneIcon className="w-6 h-6 text-indigo-600" />
            <div>
              <div className="font-semibold text-indigo-800">Central de Ajuda</div>
              <div className="text-sm text-indigo-700">Suporte técnico</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Próximas consultas */}
      <section className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Suas Próximas Consultas</h2>
        <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto custom-scrollbar">
          {consultasFuturas.length > 0 ? (
            consultasFuturas.map((consulta) => {
              return (
                <div key={consulta.id} className="bg-white rounded-xl shadow p-5 border border-blue-100 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <img src={consulta.doctor.avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"} alt={consulta.doctor.name} className="w-12 h-12 rounded-full object-cover border border-blue-100" />
                    <div>
                      <div className="text-blue-900 font-semibold">{consulta.doctor.name}</div>
                      <div className="text-blue-500 text-xs">{consulta.doctor.specialty}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-900 text-sm mt-2">
                    <CalendarIcon className="w-4 h-4 text-blue-700" />
                    {formatarData(consulta.date)}
                    <ClockIcon className="w-4 h-4 text-blue-700 ml-2" />
                    {consulta.time}
                  </div>
                  <div className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm bg-blue-100 text-blue-700 border border-blue-300">
                    <CalendarIcon className="w-4 h-4" />
                    Consulta Agendada
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-blue-800 bg-blue-50 rounded-lg">
              <p>Nenhuma consulta agendada no momento.</p>
              <Link to="/agendamento" className="mt-4 inline-block bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Agendar uma nova consulta
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Consultas passadas */}
      {consultasPassadas.length > 0 && (
        <section className="w-full max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4 text-red-900 flex items-center gap-2">
            <XCircleIcon className="w-6 h-6 text-red-600" />
            Consultas Passadas
          </h2>
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">
            {consultasPassadas.map((consulta) => (
              <div key={consulta.id} className="bg-red-50 rounded-xl shadow p-5 border border-red-200 flex flex-col gap-2 relative">
                {/* Ícone de consulta passada */}
                <div className="absolute top-3 right-3">
                  <XCircleIcon className="w-6 h-6 text-red-500" />
                </div>
                
                <div className="flex items-center gap-3">
                  <img src={consulta.doctor.avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"} alt={consulta.doctor.name} className="w-12 h-12 rounded-full object-cover border border-red-200" />
                  <div>
                    <div className="text-red-900 font-semibold">{consulta.doctor.name}</div>
                    <div className="text-red-600 text-xs">{consulta.doctor.specialty}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-red-800 text-sm mt-2">
                  <CalendarIcon className="w-4 h-4 text-red-600" />
                  {formatarData(consulta.date)}
                  <ClockIcon className="w-4 h-4 text-red-600 ml-2" />
                  {consulta.time}
                </div>
                <div className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm bg-red-100 text-red-700 border border-red-300">
                  <XCircleIcon className="w-4 h-4" />
                  Consulta Passada
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Informações do paciente */}
      {perfil && (
        <section className="w-full max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Suas Informações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Dados Pessoais
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-blue-600">Nome:</span>
                  <p className="font-medium text-blue-900">{perfil.nome}</p>
                </div>
                {perfil.data_nascimento && (
                  <div>
                    <span className="text-sm text-blue-600">Data de Nascimento:</span>
                    <p className="font-medium text-blue-900">
                      {formatarData(perfil.data_nascimento)}
                    </p>
                  </div>
                )}
                {perfil.telefone && (
                  <div>
                    <span className="text-sm text-blue-600">Telefone:</span>
                    <p className="font-medium text-blue-900">{perfil.telefone}</p>
                  </div>
                )}
                {perfil.address && (
                  <div>
                    <span className="text-sm text-blue-600">Endereço:</span>
                    <p className="font-medium text-blue-900">{`${perfil.address.street}, ${perfil.address.number} - ${perfil.address.neighborhood}, ${perfil.address.city}/${perfil.address.state}`}</p>
                  </div>
                )}
              </div>
              <Link
                to="/meu-perfil"
                className="mt-4 inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-sm"
              >
                Editar Dados
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <HeartIcon className="w-5 h-5" />
                Saúde
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-blue-600">Tipo Sanguíneo:</span>
                  <p className="font-medium text-blue-900">{perfil.tipo_sanguineo || "Não informado"}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-600">Alergias:</span>
                  <p className="font-medium text-blue-900">{perfil.alergias || "Nenhuma alergia registrada"}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-600">Medicamentos em uso:</span>
                  <p className="font-medium text-blue-900">{perfil.medicamentos_uso_continuo || "Nenhum medicamento registrado"}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-600">Condições médicas:</span>
                  <p className="font-medium text-blue-900">{perfil.doencas_cronicas || "Nenhuma condição registrada"}</p>
                </div>
              </div>
              <Link
                to="/meu-perfil"
                className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition-colors text-sm"
              >
                Atualizar Saúde
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Dicas e informações úteis */}
      <section className="w-full max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Dicas e Informações Úteis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-700 font-semibold mb-2">📞 Suporte 24/7</div>
            <p className="text-blue-800 text-sm">Nossa equipe está sempre disponível para ajudar você.</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="text-green-700 font-semibold mb-2">⚡ Consultas Rápidas</div>
            <p className="text-green-800 text-sm">Agende consultas em até 24h com nossos especialistas.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="text-purple-700 font-semibold mb-2">🏥 Histórico Completo</div>
            <p className="text-purple-800 text-sm">Acesse todo seu histórico médico em um só lugar.</p>
          </div>
        </div>
      </section>

      {/* Notificações e lembretes */}
      <section className="w-full max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Notificações e Lembretes</h2>
        <div className="space-y-4">
          {/* Lembretes de consultas próximas */}
          {consultasFuturas.filter(c => {
            const dataConsulta = new Date(`${c.date}T${c.time}`);
            const agora = new Date();
            const diffHoras = (dataConsulta.getTime() - agora.getTime()) / (1000 * 60 * 60);
            return diffHoras > 0 && diffHoras <= 24; // Próximas 24h
          }).map(consulta => (
            <div key={consulta.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-yellow-600">⏰</div>
                <div>
                  <div className="font-semibold text-yellow-800">Lembrete de Consulta</div>
                  <div className="text-yellow-700 text-sm">
                    Sua consulta com Dr. {consulta.doctor.name} está agendada para amanhã às {consulta.time}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Lembretes de medicamentos */}
          {perfil?.medicamentos_uso_continuo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-600">💊</div>
                <div>
                  <div className="font-semibold text-blue-800">Medicamentos em Uso</div>
                  <div className="text-blue-700 text-sm">
                    Lembre-se de tomar seus medicamentos conforme prescrito pelo médico
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lembretes de exames */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-purple-600">🔬</div>
              <div>
                <div className="font-semibold text-purple-800">Exames Pendentes</div>
                <div className="text-purple-700 text-sm">
                  Verifique se há exames pendentes na sua área de resultados.
                </div>
              </div>
            </div>
          </div>

          {/* Dica de triagem */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-green-600">🏥</div>
              <div>
                <div className="font-semibold text-green-800">Triagem Online Disponível</div>
                <div className="text-green-700 text-sm">
                  Use nossa triagem online para avaliar sintomas e receber orientações médicas rápidas
                </div>
              </div>
            </div>
          </div>

          {/* Informação sobre prescrições */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-orange-600">📋</div>
              <div>
                <div className="font-semibold text-orange-800">Prescrições Ativas</div>
                <div className="text-orange-700 text-sm">
                  Acesse sua área de prescrições para renovar quando necessário.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default PacienteDashboard; 