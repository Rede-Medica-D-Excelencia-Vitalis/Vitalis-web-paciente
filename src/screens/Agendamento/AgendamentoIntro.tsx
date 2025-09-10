import React from "react";
import { Link } from "react-router-dom";
import { CalendarPlusIcon, UserIcon, ClockIcon, CheckCircleIcon } from "lucide-react";

const etapas = [
  {
    icon: <UserIcon className="w-8 h-8 text-blue-700" />,
    title: "Escolha o Profissional",
    desc: "Selecione o médico ou especialista ideal para sua necessidade."
  },
  {
    icon: <ClockIcon className="w-8 h-8 text-blue-700" />,
    title: "Defina o Horário",
    desc: "Escolha o melhor dia e horário para sua consulta."
  },
  {
    icon: <CheckCircleIcon className="w-8 h-8 text-blue-700" />,
    title: "Confirme o Agendamento",
    desc: "Revise os dados e finalize seu agendamento de forma rápida e segura."
  },
];

const AgendamentoIntro: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-4 text-blue-900 text-center">Agende sua Consulta</h1>
      <p className="mb-8 text-blue-800 text-lg text-center max-w-2xl">
        Com a Vitalis, você pode agendar sua consulta médica de forma simples, rápida e totalmente online. Siga as etapas abaixo e garanta seu atendimento com nossos profissionais de excelência!
      </p>
      {/* Imagem ilustrativa (pode trocar por uma imagem real se desejar) */}
      <div className="mb-10">
        <img
          src="/calendar-illustration.svg"
          alt="Ilustração de agendamento"
          className="w-64 h-64 object-contain mx-auto drop-shadow-lg animate-fade-in delay-100"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
      </div>
      {/* Etapas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 w-full">
        {etapas.map((etapa, idx) => (
          <div
            key={etapa.title}
            className="bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-2xl shadow-lg p-7 border border-blue-200 flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl animate-fade-in"
            style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
          >
            <div className="mb-3">{etapa.icon}</div>
            <h2 className="text-lg font-bold mb-1 text-blue-900">{etapa.title}</h2>
            <p className="text-blue-800 text-sm">{etapa.desc}</p>
          </div>
        ))}
      </div>
      {/* Botão de iniciar */}
      <Link
        to="/agendamento/iniciar"
        className="mt-4 px-8 py-4 bg-blue-700 text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-800 transition-all duration-200 animate-bounce"
        style={{ animationDelay: '0.5s' }}
      >
        Iniciar Agendamento
      </Link>
      <style>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.8s forwards;
        }
        .animate-fade-in.delay-100 { animation-delay: 0.1s; }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .animate-bounce {
          animation: bounce 1.2s infinite alternate;
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default AgendamentoIntro; 