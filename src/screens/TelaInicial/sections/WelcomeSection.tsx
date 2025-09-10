import { CalendarIcon, ClockIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../components";
import { useNavigate } from "react-router-dom";

export const WelcomeSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo à Vitalis</h1>
        <p className="text-lg text-blue-100 mb-6 max-w-2xl">
          Cuidando da sua saúde com excelência e tecnologia. Agende sua consulta,
          acesse exames e mantenha-se saudável com nossa equipe especializada.
        </p>
        <div className="flex gap-4">
          <Button
            className="bg-white text-blue-600 hover:bg-blue-50"
            size="lg"
            onClick={() => navigate('/agendamento')}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            Agendar Consulta
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/10"
            size="lg"
            onClick={() => navigate('/consultas-anteriores')}
          >
            <ClockIcon className="mr-2 h-5 w-5" />
            Consultas Anteriores
          </Button>
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent" />
    </div>
  );
};