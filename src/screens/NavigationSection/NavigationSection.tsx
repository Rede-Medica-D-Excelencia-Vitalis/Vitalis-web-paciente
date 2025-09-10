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
  LockIcon
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea, Separator, Tooltip } from "../../components";
import { useFullscreen } from "../../contexts/fullscreen/FullscreenContext";

interface NavigationProps {
  hasActiveSubscription: boolean;
}

export const NavigationSection = ({ hasActiveSubscription }: NavigationProps) => {
  const location = useLocation();
  const { isVideoCallFullscreen } = useFullscreen();
  
  // Não renderizar a navegação se estiver em videochamada em tela cheia
  if (isVideoCallFullscreen) {
    return null;
  }
  
  const navigationSections = [
    {
      title: "Menu Principal",
      items: [
        { 
          icon: <HomeIcon className="w-5 h-5" />,
          label: "Início",
          path: "/",
          requiresSubscription: false
        },
        { 
          icon: <PillIcon className="w-5 h-5" />,
          label: "Farmácia",
          path: "/farmacia",
          requiresSubscription: false
        },
        { 
          icon: <CalendarIcon className="w-5 h-5" />,
          label: "Agendamento",
          path: "/agendamento",
          requiresSubscription: true
        },
        { 
          icon: <VideoIcon className="w-5 h-5" />,
          label: "Teleconsulta",
          path: "/teleconsulta",
          requiresSubscription: true
        },
        {
          icon: <MessageSquareIcon className="w-5 h-5" />,
          label: "Triagem Online",
          path: "/triagem-online",
          requiresSubscription: true
        },
      ],
    },
    {
      title: "Área do Paciente",
      items: [
        {
          icon: <FileTextIcon className="w-5 h-5" />,
          label: "Prescrições",
          path: "/prescricoes",
          requiresSubscription: true
        },
        {
          icon: <MessageSquareIcon className="w-5 h-5" />,
          label: "Triagem Online",
          path: "/triagem-online",
          requiresSubscription: true
        },
        {
          icon: <CalendarIcon className="w-5 h-5" />,
          label: "Histórico de Consultas",
          path: "/consultas-anteriores",
          requiresSubscription: true
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
          requiresSubscription: false
        },
        {
          icon: <HelpCircleIcon className="w-5 h-5" />,
          label: "Central de Ajuda",
          path: "/central-ajuda",
          requiresSubscription: false
        },
      ],
    },
  ];

  const renderNavigationItem = (item: any) => {
    const isLocked = item.requiresSubscription && !hasActiveSubscription;
    const content = (
      <div
        className={`
          flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
          ${location.pathname === item.path
            ? 'bg-blue-800 text-white'
            : 'text-blue-100 hover:bg-blue-800/50'
          }
          ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          {React.cloneElement(item.icon, {
            className: `${item.icon.props.className} ${
              location.pathname === item.path
                ? 'text-white'
                : 'text-blue-100'
            }`
          })}
          <span>{item.label}</span>
        </div>
        {isLocked ? (
          <LockIcon className="w-4 h-4 opacity-50" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 opacity-50" />
        )}
      </div>
    );

    if (isLocked) {
      return (
        <Tooltip
          key={item.path}
          content="Assine um plano para acessar este recurso"
          side="right"
        >
          <div>{content}</div>
        </Tooltip>
      );
    }

    return (
      <Link key={item.path} to={item.path}>
        {content}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-[220px] h-screen bg-gradient-to-b from-blue-900 to-blue-700 shadow-xl z-30">
      <ScrollArea className="h-full">
        <div className="p-4">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="px-4 text-sm font-semibold text-blue-100 uppercase tracking-wider mb-2">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map(renderNavigationItem)}
              </div>

              {sectionIndex < navigationSections.length - 1 && (
                <Separator className="my-4 bg-blue-800" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </nav>
  );
};