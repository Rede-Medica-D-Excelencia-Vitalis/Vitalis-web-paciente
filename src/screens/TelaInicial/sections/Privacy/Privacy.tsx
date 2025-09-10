import React, { useState } from "react";
import PrivacyIntroducao from "./PrivacyIntroducao";
import PrivacyColeta from "./PrivacyColeta";
import PrivacyUso from "./PrivacyUso";
import PrivacyCompartilhamento from "./PrivacyCompartilhamento";
import PrivacySeguranca from "./PrivacySeguranca";
import PrivacyDireitos from "./PrivacyDireitos";
import PrivacyCookies from "./PrivacyCookies";
import PrivacyMenores from "./PrivacyMenores";
import PrivacyAlteracoes from "./PrivacyAlteracoes";
import PrivacyContato from "./PrivacyContato";

const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("introducao");

  const sections = [
    { id: "introducao", title: "1. Introdução", component: PrivacyIntroducao },
    { id: "coleta", title: "2. Coleta de Dados", component: PrivacyColeta },
    { id: "uso", title: "3. Uso dos Dados", component: PrivacyUso },
    { id: "compartilhamento", title: "4. Compartilhamento", component: PrivacyCompartilhamento },
    { id: "seguranca", title: "5. Segurança", component: PrivacySeguranca },
    { id: "direitos", title: "6. Seus Direitos", component: PrivacyDireitos },
    { id: "cookies", title: "7. Cookies", component: PrivacyCookies },
    { id: "menores", title: "8. Menores de Idade", component: PrivacyMenores },
    { id: "alteracoes", title: "9. Alterações", component: PrivacyAlteracoes },
    { id: "contato", title: "10. Contato", component: PrivacyContato },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Política de Privacidade
          </h1>
          <p className="text-blue-200 text-center max-w-3xl mx-auto">
            A Vitalis está comprometida em proteger sua privacidade e dados pessoais. 
            Esta política detalha como coletamos, usamos e protegemos suas informações.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navegação Lateral */}
          <div className="lg:w-1/4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Navegação</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-blue-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
              
              {/* Informações Adicionais */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-2">Informações Importantes</h3>
                  <ul className="text-blue-100 text-sm space-y-1">
                    <li>• Última atualização: Dezembro 2024</li>
                    <li>• Versão: 1.0</li>
                    <li>• Conforme LGPD</li>
                  </ul>
                </div>
                
                <div className="mt-4 bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-2">Contato Rápido</h3>
                  <p className="text-blue-100 text-sm mb-2">
                    Dúvidas sobre privacidade?
                  </p>
                  <button
                    onClick={() => scrollToSection("contato")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Fale Conosco
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:w-3/4">
            <div className="space-y-8">
              {sections.map((section) => {
                const SectionComponent = section.component;
                return <SectionComponent key={section.id} />;
              })}
            </div>
            
            {/* Footer da Política */}
            <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Compromisso com a Privacidade
                </h3>
                <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
                  A Vitalis está comprometida em proteger sua privacidade e garantir 
                  que seus dados pessoais sejam tratados com a máxima segurança e 
                  transparência. Nossa equipe trabalha continuamente para manter 
                  os mais altos padrões de proteção de dados.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Transparência</h4>
                    <p className="text-blue-100 text-sm">
                      Informações claras sobre como tratamos seus dados
                    </p>
                  </div>
                  
                  <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Segurança</h4>
                    <p className="text-blue-100 text-sm">
                      Proteção avançada para manter seus dados seguros
                    </p>
                  </div>
                  
                  <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Controle</h4>
                    <p className="text-blue-100 text-sm">
                      Você tem controle total sobre seus dados pessoais
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-blue-200 text-sm">
                    <strong>Última atualização:</strong> Dezembro 2024 | 
                    <strong> Versão:</strong> 1.0 | 
                    <strong> Conforme:</strong> Lei Geral de Proteção de Dados (LGPD)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 