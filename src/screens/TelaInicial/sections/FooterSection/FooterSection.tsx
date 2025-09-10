import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
} from "lucide-react";
import React from "react";
import { Separator } from "../../../../components/ui/separator";
import { useFullscreen } from "../../../../contexts/fullscreen/FullscreenContext";

export const FooterSection = (): JSX.Element => {
  const { isVideoCallFullscreen } = useFullscreen();
  
  // Debug: Log do estado de tela cheia
  // Não renderizar o footer se estiver em videochamada em tela cheia
  if (isVideoCallFullscreen) {
    return null;
  }
  
  const footerLinks = {
    servicos: {
      title: "Serviços",
      links: [
        { label: "Consultas Médicas", href: "/agendamento" },
        { label: "Teleconsulta", href: "/teleconsulta" },
        { label: "Prescrições", href: "/prescricoes" },
        { label: "Farmácia", href: "/farmacia" },
      ],
    },
    pacientes: {
      title: "Pacientes",
      links: [
        { label: "Área do Paciente", href: "/meu-perfil" },
        { label: "Histórico Consulta", href: "/historico" },
        { label: "Área de Consultas", href: "/Consultas" },
        { label: "Dicas & Artigos", href: "/dicas-artigos" },
      ],
    },
    institucional: {
      title: "Institucional",
      links: [
        { label: "Sobre Nós", href: "/sobre" },
        { label: "Nossa Equipe", href: "/equipe" },
        { label: "Trabalhe Conosco", href: "/trabalhe-conosco" },
        { label: "Política de Privacidade", href: "/privacidade" },
      ],
    },
  };

  const contatos = [
    {
      icon: <PhoneIcon className="h-5 w-5" />,
      info: "(11) 99450-4683",
    },
    {
      icon: <MailIcon className="h-5 w-5" />,
      info: "redemedicadexecelenciavitalis@gmail.com",
    },
    {
      icon: <MapPinIcon className="h-5 w-5" />,
      info: "Rua Conceição, 321 - São Caetano do Sul, SP",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <img
                  src="/logo-small-1-1.png"
                  alt="Vitalis Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Vitalis</h2>
                <p className="text-sm font-semibold text-blue-200">
                  REDE MÉDICA D'EXCELÊNCIA
                </p>
              </div>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Há mais nova empresa de telemedicina no Brasil, a Vitalis oferece serviços médicos de excelência,
              combinando tecnologia avançada com atendimento humanizado para
              garantir o melhor cuidado com sua saúde.
            </p>
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              {contatos.map((contato, index) => (
                <div key={index} className="flex items-center gap-2 text-blue-200 whitespace-nowrap">
                  {contato.icon}
                  <span className="text-sm">{contato.info}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-blue-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <a
              href="/termos-de-uso"
              className="text-blue-200 hover:text-white transition-colors"
            >
              Termos de Uso
            </a>
            <a
              href="/privacidade"
              className="text-blue-200 hover:text-white transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="/cookies"
              className="text-blue-200 hover:text-white transition-colors"
            >
              Política de Cookies
            </a>
            <a
              href="/sobre"
              className="text-blue-200 hover:text-white transition-colors"
            >
              Sobre Nós
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-blue-200 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>

          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} Vitalis. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};