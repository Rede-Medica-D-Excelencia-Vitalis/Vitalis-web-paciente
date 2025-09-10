import React, { useState } from "react";

const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("introducao");

  const sections = [
    { id: "introducao", title: "1. Introdução" },
    { id: "aceite", title: "2. Aceite dos Termos" },
    { id: "cadastro", title: "3. Cadastro e Conta" },
    { id: "uso", title: "4. Uso da Plataforma" },
    { id: "responsabilidades", title: "5. Responsabilidades do Usuário" },
    { id: "direitos", title: "6. Direitos da Vitalis" },
    { id: "alteracoes", title: "7. Alterações dos Termos" },
    { id: "contato", title: "8. Contato" },
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
            Termos de Uso
          </h1>
          <p className="text-blue-200 text-center max-w-3xl mx-auto">
            Leia atentamente os Termos de Uso da Vitalis. Ao utilizar nossos serviços, você concorda com todas as condições aqui estabelecidas.
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
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-2">Informações Importantes</h3>
                  <ul className="text-blue-100 text-sm space-y-1">
                    <li>• Última atualização: Dezembro 2024</li>
                    <li>• Versão: 1.0</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:w-3/4">
            <div className="space-y-8">
              {/* 1. Introdução */}
              <div id="introducao" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">1. Introdução</h2>
                <p className="text-blue-100 leading-relaxed">
                  Estes Termos de Uso regulam o acesso e a utilização da plataforma Vitalis, incluindo todos os serviços, funcionalidades e conteúdos oferecidos. Ao acessar ou utilizar a plataforma, você concorda integralmente com estes termos.
                </p>
              </div>

              {/* 2. Aceite dos Termos */}
              <div id="aceite" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">2. Aceite dos Termos</h2>
                <p className="text-blue-100 leading-relaxed">
                  O uso da plataforma está condicionado à aceitação plena destes Termos de Uso. Caso não concorde com qualquer condição, recomendamos que não utilize nossos serviços.
                </p>
              </div>

              {/* 3. Cadastro e Conta */}
              <div id="cadastro" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">3. Cadastro e Conta</h2>
                <ul className="list-disc pl-6 text-blue-100 space-y-2">
                  <li>O usuário deve fornecer informações verdadeiras, completas e atualizadas no momento do cadastro.</li>
                  <li>O acesso à plataforma é pessoal e intransferível.</li>
                  <li>O usuário é responsável por manter a confidencialidade de suas credenciais de acesso.</li>
                  <li>Em caso de uso não autorizado da conta, o usuário deve notificar imediatamente a Vitalis.</li>
                </ul>
              </div>

              {/* 4. Uso da Plataforma */}
              <div id="uso" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">4. Uso da Plataforma</h2>
                <ul className="list-disc pl-6 text-blue-100 space-y-2">
                  <li>O usuário compromete-se a utilizar a plataforma de forma ética, responsável e em conformidade com a legislação vigente.</li>
                  <li>É proibido utilizar a plataforma para fins ilícitos, fraudulentos ou que possam prejudicar terceiros.</li>
                  <li>Não é permitido tentar acessar áreas restritas, sistemas ou dados de outros usuários sem autorização.</li>
                  <li>A Vitalis pode suspender ou cancelar o acesso em caso de descumprimento dos termos.</li>
                </ul>
              </div>

              {/* 5. Responsabilidades do Usuário */}
              <div id="responsabilidades" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">5. Responsabilidades do Usuário</h2>
                <ul className="list-disc pl-6 text-blue-100 space-y-2">
                  <li>Manter seus dados cadastrais atualizados.</li>
                  <li>Responder civil e criminalmente pelo uso indevido da plataforma.</li>
                  <li>Respeitar a privacidade e os direitos de outros usuários.</li>
                  <li>Não compartilhar informações confidenciais de terceiros sem consentimento.</li>
                </ul>
              </div>

              {/* 6. Direitos da Vitalis */}
              <div id="direitos" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">6. Direitos da Vitalis</h2>
                <ul className="list-disc pl-6 text-blue-100 space-y-2">
                  <li>Alterar, suspender ou descontinuar qualquer funcionalidade da plataforma a qualquer momento.</li>
                  <li>Atualizar estes Termos de Uso sempre que necessário.</li>
                  <li>Adotar medidas para garantir a segurança e integridade dos dados.</li>
                  <li>Remover conteúdos que violem estes termos ou a legislação.</li>
                </ul>
              </div>

              {/* 7. Alterações dos Termos */}
              <div id="alteracoes" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">7. Alterações dos Termos</h2>
                <p className="text-blue-100 leading-relaxed">
                  A Vitalis pode modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. Recomendamos que o usuário revise periodicamente os termos.
                </p>
              </div>

              {/* 8. Contato */}
              <div id="contato" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">8. Contato</h2>
                <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Canais de Atendimento</h3>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>E-mail:</strong> redemedicadexecelenciavitalis@gmail.com</li>
                    <li>• <strong>Chat:</strong> Suporte em tempo real</li>
                    <li>• <strong>Telefone:</strong> (11) 99999-9999</li>
    </ul>
                </div>
              </div>
            </div>

            {/* Footer dos Termos */}
            <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Compromisso com a Transparência
                </h3>
                <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
                  A Vitalis está comprometida em garantir a clareza, segurança e respeito aos direitos dos usuários. Em caso de dúvidas, entre em contato com nossa equipe.
                </p>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-blue-200 text-sm">
                    <strong>Última atualização:</strong> Dezembro 2024 | 
                    <strong> Versão:</strong> 1.0
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

export default Terms; 