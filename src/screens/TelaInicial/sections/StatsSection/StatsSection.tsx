import { Users2Icon, HeartPulseIcon, StarIcon, BuildingIcon as BuildingHospitalIcon } from "lucide-react";
import React from "react";

export const StatsSection = () => {
  const stats = [
    {
      icon: <Users2Icon className="h-6 w-6 text-blue-600" />,
      value: "+100.000",
      label: "Pacientes Atendidos",
      description: "Confiança de milhares de pacientes"
    },
    {
      icon: <HeartPulseIcon className="h-6 w-6 text-blue-600" />,
      value: "99.8%",
      label: "Taxa de Satisfação",
      description: "Excelência reconhecida pelos pacientes"
    },
    {
      icon: <StarIcon className="h-6 w-6 text-blue-600" />,
      value: "+2.500",
      label: "Médicos Especialistas",
      description: "Profissionais altamente qualificados"
    },
    {
      icon: <BuildingHospitalIcon className="h-6 w-6 text-blue-600" />,
      value: "15 Anos",
      label: "De Experiência",
      description: "Tradição em cuidados médicos"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex flex-col gap-4">
            <div className="bg-blue-50 p-4 rounded-lg w-fit">
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-900 mt-1">{stat.label}</div>
              <div className="text-sm text-gray-600 mt-2">{stat.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};