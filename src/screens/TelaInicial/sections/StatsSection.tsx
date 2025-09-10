import { Users2Icon, HeartPulseIcon, StarIcon, BuildingIcon as BuildingHospitalIcon } from "lucide-react";
import React from "react";

export const StatsSection = () => {
  const stats = [
    {
      icon: <Users2Icon className="h-6 w-6 text-blue-600" />,
      value: "+50.000",
      label: "Pacientes Atendidos",
    },
    {
      icon: <HeartPulseIcon className="h-6 w-6 text-blue-600" />,
      value: "98%",
      label: "Taxa de Satisfação",
    },
    {
      icon: <StarIcon className="h-6 w-6 text-blue-600" />,
      value: "+1.000",
      label: "Médicos Especialistas",
    },
    {
      icon: <BuildingHospitalIcon className="h-6 w-6 text-blue-600" />,
      value: "24/7",
      label: "Atendimento",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};