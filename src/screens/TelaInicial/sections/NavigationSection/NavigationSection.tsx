import {
  HomeIcon,
  PillIcon,
  CalendarIcon,
  VideoIcon,
  FileTextIcon,
  MessageSquareIcon,
  UserIcon,
  HelpCircleIcon,
  ChevronRightIcon,
  HistoryIcon,
  LockIcon,
  LogOutIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Separator } from "../../../../components/ui/separator";
import { usePlanPermissions } from "../../../../hooks/auth/usePlanPermissions";
import { PlanRequiredModal } from "../../../../components/plans/PlanRequiredModal";
import { useAuthStore } from "../../../../store/auth";

export const NavigationSection = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const permissions = usePlanPermissions();
  const { logout, user } = useAuthStore();
  
  // Log temporário para debug
  console.log('🔍 NavigationSection:', { 
    hasPlan: permissions.hasPlan, 
    userPlan: user?.plan,
    userId: user?.id 
  });
  
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    featureName: string;
  }>({ isOpen: false, featureName: "" });

  const handleRestrictedClick = (featureName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setModalConfig({ isOpen: true, featureName });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, featureName: "" });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navigationSections = [
    {
      title: "Menu Principal",
      items: [
        { 
          icon: <HomeIcon className="w-5 h-5" />,
          label: "Início",
          path: "/home",
          requiresPlan: false
        },
        { 
          icon: <PillIcon className="w-5 h-5" />,
          label: "Farmácia",
          path: "/farmacia",
          requiresPlan: false
        },
        { 
          icon: <CalendarIcon className="w-5 h-5" />,
          label: "Agendamento",
          path: "/agendamento",
          requiresPlan: true,
          featureName: "Agendamento de Consultas"
        },
        {
          icon: <MessageSquareIcon className="w-5 h-5" />,
          label: "Triagem Online",
          path: "/triagem-online",
          requiresPlan: true,
          featureName: "Triagem Online",
          onClick: () => navigate('/triagem-online'),
        },
      ],
    },
    {
      title: "Área do Paciente",
      items: [
        {
          icon: <UserIcon className="w-5 h-5" />,
          label: "Área do Paciente",
          path: "/paciente",
          requiresPlan: true,
          featureName: "Área do Paciente"
        },
        {
          icon: <FileTextIcon className="w-5 h-5" />,
          label: "Prescrições",
          path: "/prescricoes",
          requiresPlan: true,
          featureName: "Prescrições Médicas"
        },
        {
          icon: <MessageSquareIcon className="w-5 h-5" />,
          label: "Triagem Online",
          path: "/triagem-online",
          requiresPlan: true,
          featureName: "Triagem Online",
          onClick: () => navigate('/triagem-online'),
        },
      ],
    },
    {
      title: "Área de Consultas",
      items: [
        {
          icon: <CalendarIcon className="w-5 h-5" />,
          label: "Área de Consultas",
          path: "/consultas",
          requiresPlan: true,
          featureName: "Área de Consultas"
        },
        {
          icon: <HistoryIcon className="w-5 h-5" />,
          label: "Histórico de Consultas",
          path: "/consultas-anteriores",
          requiresPlan: true,
          featureName: "Histórico de Consultas"
        },
        {
          icon: <VideoIcon className="w-5 h-5" />,
          label: "Teleconsulta",
          path: "/teleconsulta",
          requiresPlan: true,
          featureName: "Teleconsulta"
        },
      ],
    },
    {
      title: "Ajuda e Suporte",
      items: [
        {
          icon: <UserIcon className="w-5 h-5" />,
          label: "Meu Perfil",
          path: "/meu-perfil",
          requiresPlan: false
        },
        {
          icon: <HelpCircleIcon className="w-5 h-5" />,
          label: "Central de Ajuda",
          path: "/central-ajuda",
          requiresPlan: false
        },
      ],
    },
    {
      title: "Conta",
      items: [
        {
          icon: <LogOutIcon className="w-5 h-5" />,
          label: "Sair",
          path: "#",
          requiresPlan: false,
          onClick: handleLogout,
        },
      ],
    },
  ];

  return (
    <>
      <nav className="w-[280px] bg-gradient-to-b from-blue-900 to-blue-700 shadow-xl h-full overflow-y-auto nav-scrollbar">
        <div className="p-4 pb-6">
            {navigationSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                <h3 className="px-4 text-sm font-semibold text-blue-100 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>

                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const isRestricted = item.requiresPlan && !permissions.hasPlan;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <div key={itemIndex} className="relative">
                        <Link
                          to={isRestricted ? "#" : item.path}
                          onClick={isRestricted ? (e) => handleRestrictedClick(item.featureName || item.label, e) : item.onClick}
                          className={`
                            flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                            ${isActive && !isRestricted
                              ? 'bg-blue-800 text-white'
                              : isRestricted
                              ? 'text-blue-300 cursor-not-allowed opacity-60'
                              : item.label === "Sair"
                              ? 'text-red-300 hover:bg-red-800/50'
                              : 'text-blue-100 hover:bg-blue-800/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            {React.cloneElement(item.icon, {
                              className: `${item.icon.props.className} ${
                                isActive && !isRestricted
                                  ? 'text-white'
                                  : isRestricted
                                  ? 'text-blue-300'
                                  : item.label === "Sair"
                                  ? 'text-red-300'
                                  : 'text-blue-100'
                              }`
                            })}
                            <span>{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isRestricted && (
                              <LockIcon className="w-4 h-4 text-blue-300" />
                            )}
                            <ChevronRightIcon className="w-4 h-4 opacity-50" />
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {sectionIndex < navigationSections.length - 1 && (
                  <Separator className="my-4 bg-blue-800" />
                )}
              </div>
            ))}
        </div>
      </nav>

      <PlanRequiredModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        featureName={modalConfig.featureName}
      />
    </>
  );
};