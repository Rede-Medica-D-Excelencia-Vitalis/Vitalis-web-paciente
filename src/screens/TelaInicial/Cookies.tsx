import React, { useState } from "react";

const Cookies: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("introducao");

  const sections = [
    { id: "introducao", title: "1. Introdução" },
    { id: "tipos", title: "2. Tipos de Cookies" },
    { id: "controle", title: "3. Controle de Cookies" },
    { id: "impacto", title: "4. Impacto da Desativação" },
    { id: "terceiros", title: "5. Cookies de Terceiros" },
    { id: "atualizacoes", title: "6. Atualizações" },
    { id: "contato", title: "7. Contato" },
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
            Política de Cookies
          </h1>
          <p className="text-blue-200 text-center max-w-3xl mx-auto">
            A Vitalis utiliza cookies e tecnologias similares para melhorar sua experiência 
            em nossa plataforma. Esta política explica como utilizamos essas tecnologias 
            e como você pode controlá-las.
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
                  <h3 className="font-bold text-white mb-2">Controle Rápido</h3>
                  <p className="text-blue-100 text-sm mb-2">
                    Gerencie suas preferências de cookies:
                  </p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                    Configurações
                  </button>
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
                <div className="space-y-6">
                  <p className="text-blue-100 leading-relaxed">
                    Os cookies são pequenos arquivos de texto armazenados em seu dispositivo 
                    quando você visita nossa plataforma. Eles nos ajudam a fornecer uma 
                    experiência mais personalizada e eficiente, além de nos permitir entender 
                    como você utiliza nossos serviços.
                  </p>
                  
                  <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Por que Utilizamos Cookies?</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-white mb-3">Funcionalidades Essenciais</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Manter você logado</li>
                          <li>• Lembrar suas preferências</li>
                          <li>• Garantir segurança</li>
                          <li>• Melhorar performance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-3">Experiência Personalizada</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Conteúdo relevante</li>
                          <li>• Recomendações</li>
                          <li>• Interface adaptada</li>
                          <li>• Comunicação direcionada</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Tipos de Cookies */}
              <div id="tipos" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">2. Tipos de Cookies que Utilizamos</h2>
                <div className="space-y-6">
                  
                  {/* Cookies Essenciais */}
                  <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">2.1 Cookies Essenciais (Necessários)</h3>
                    <p className="text-blue-200 mb-4">
                      Esses cookies são fundamentais para o funcionamento básico da plataforma 
                      e não podem ser desativados:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-white mb-3">Funcionalidades</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Autenticação e segurança</li>
                          <li>• Sessão do usuário</li>
                          <li>• Prevenção de fraudes</li>
                          <li>• Carregamento de páginas</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-3">Exemplos</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Manutenção do login</li>
                          <li>• Proteção CSRF</li>
                          <li>• Balanceamento de carga</li>
                          <li>• Cache de recursos</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Cookies de Performance */}
                  <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">2.2 Cookies de Performance e Análise</h3>
                    <p className="text-blue-200 mb-4">
                      Coletam informações sobre como você utiliza nossa plataforma para 
                      melhorar a experiência:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-white mb-3">Dados Coletados</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Páginas visitadas</li>
                          <li>• Tempo de permanência</li>
                          <li>• Erros encontrados</li>
                          <li>• Performance da página</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-3">Ferramentas</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Google Analytics</li>
                          <li>• Hotjar</li>
                          <li>• Sentry</li>
                          <li>• Ferramentas internas</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Cookies de Funcionalidade */}
                  <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">2.3 Cookies de Funcionalidade</h3>
                    <p className="text-blue-200 mb-4">
                      Permitem que a plataforma lembre de suas escolhas e forneça 
                      funcionalidades aprimoradas:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-white mb-3">Preferências</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Idioma preferido</li>
                          <li>• Região/país</li>
                          <li>• Tema (claro/escuro)</li>
                          <li>• Configurações de notificação</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-3">Funcionalidades</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Carrinho de compras</li>
                          <li>• Lista de favoritos</li>
                          <li>• Histórico de consultas</li>
                          <li>• Configurações de privacidade</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Cookies de Marketing */}
                  <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">2.4 Cookies de Marketing</h3>
                    <p className="text-blue-200 mb-4">
                      Utilizados para fornecer conteúdo relevante e medir a eficácia 
                      de campanhas publicitárias:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-white mb-3">Finalidades</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Anúncios personalizados</li>
                          <li>• Remarketing</li>
                          <li>• Análise de campanhas</li>
                          <li>• Segmentação de audiência</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-3">Tecnologias</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Google Ads</li>
                          <li>• Facebook Pixel</li>
                          <li>• LinkedIn Insight</li>
                          <li>• Redes de anúncios</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Controle de Cookies */}
              <div id="controle" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">3. Como Controlar os Cookies</h2>
                <div className="space-y-6">
                  
                  {/* Configurações do Navegador */}
                  <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">3.1 Configurações do Navegador</h3>
                    <p className="text-blue-200 mb-4">
                      A maioria dos navegadores permite controlar cookies através de 
                      configurações de privacidade:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-white mb-3">Navegadores Populares</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• <strong>Chrome:</strong> Configurações &gt; Privacidade e segurança</li>
                          <li>• <strong>Firefox:</strong> Opções &gt; Privacidade e Segurança</li>
                          <li>• <strong>Safari:</strong> Preferências &gt; Privacidade</li>
                          <li>• <strong>Edge:</strong> Configurações &gt; Cookies e permissões</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-3">Opções Disponíveis</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Aceitar todos os cookies</li>
                          <li>• Bloquear cookies de terceiros</li>
                          <li>• Bloquear todos os cookies</li>
                          <li>• Excluir cookies ao fechar</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Configurações da Plataforma */}
                  <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">3.2 Configurações da Plataforma Vitalis</h3>
                    <p className="text-blue-200 mb-4">
                      Oferecemos controles granulares para gerenciar suas preferências de cookies:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-white mb-3">Painel de Controle</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Configurações de privacidade</li>
                          <li>• Gerenciador de cookies</li>
                          <li>• Preferências de marketing</li>
                          <li>• Configurações de análise</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-3">Funcionalidades</h4>
                        <ul className="space-y-2 text-blue-100 text-sm">
                          <li>• Ativar/desativar por categoria</li>
                          <li>• Configurações granulares</li>
                          <li>• Histórico de consentimento</li>
                          <li>• Alterações em tempo real</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Impacto da Desativação */}
              <div id="impacto" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">4. Impacto da Desativação de Cookies</h2>
                <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Consequências da Desativação</h3>
                  <p className="text-blue-200 mb-4">
                    Desativar cookies pode afetar significativamente sua experiência na plataforma:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-white mb-3">Funcionalidades Afetadas</h4>
                      <ul className="space-y-2 text-blue-100 text-sm">
                        <li>• Necessidade de login repetido</li>
                        <li>• Perda de preferências salvas</li>
                        <li>• Carrinho de compras não salvo</li>
                        <li>• Configurações resetadas</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-3">Experiência do Usuário</h4>
                      <ul className="space-y-2 text-blue-100 text-sm">
                        <li>• Navegação menos fluida</li>
                        <li>• Conteúdo não personalizado</li>
                        <li>• Anúncios irrelevantes</li>
                        <li>• Performance reduzida</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-red-600/30 border border-red-400/50 rounded-lg p-4 mt-4">
                    <p className="text-blue-200 text-sm">
                      <strong>Recomendação:</strong> Mantenha os cookies essenciais ativos para 
                      uma experiência completa e segura na plataforma.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. Cookies de Terceiros */}
              <div id="terceiros" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">5. Cookies de Terceiros</h2>
                <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Provedores de Serviços</h3>
                  <p className="text-blue-200 mb-4">
                    Cookies definidos por parceiros e provedores de serviços que nos auxiliam 
                    na operação da plataforma:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-white mb-3">Provedores</h4>
                      <ul className="space-y-2 text-blue-100 text-sm">
                        <li>• Stripe (pagamentos)</li>
                        <li>• SendGrid (e-mails)</li>
                        <li>• Intercom (suporte)</li>
                        <li>• Cloudflare (segurança)</li>
                        <li>• AWS (infraestrutura)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-3">Funcionalidades</h4>
                      <ul className="space-y-2 text-blue-100 text-sm">
                        <li>• Processamento de pagamentos</li>
                        <li>• Comunicação por e-mail</li>
                        <li>• Chat de suporte</li>
                        <li>• Proteção contra ataques</li>
                        <li>• Armazenamento em nuvem</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Atualizações */}
              <div id="atualizacoes" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">6. Atualizações e Mudanças</h2>
                <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Política de Cookies Dinâmica</h3>
                  <p className="text-blue-200 mb-4">
                    Nossa política de cookies pode ser atualizada conforme evoluem as tecnologias 
                    e regulamentações:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-white mb-3">Quando Atualizamos</h4>
                      <ul className="space-y-2 text-blue-100 text-sm">
                        <li>• Novas funcionalidades</li>
                        <li>• Mudanças na legislação</li>
                        <li>• Novos provedores de serviços</li>
                        <li>• Melhorias de segurança</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-3">Como Notificamos</h4>
                      <ul className="space-y-2 text-blue-100 text-sm">
                        <li>• Banner de notificação</li>
                        <li>• E-mail informativo</li>
                        <li>• Atualização da política</li>
                        <li>• Notificação no app</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-purple-600/30 border border-purple-400/50 rounded-lg p-4 mt-4">
                    <p className="text-blue-200 text-sm">
                      <strong>Transparência:</strong> Sempre informamos sobre mudanças significativas 
                      e permitimos que você revise suas preferências.
                    </p>
                  </div>
                </div>
              </div>

              {/* 7. Contato */}
              <div id="contato" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6">7. Dúvidas sobre Cookies</h2>
                <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Suporte Especializado</h3>
                  <p className="text-blue-200 mb-4">
                    Nossa equipe está disponível para esclarecer dúvidas sobre cookies e privacidade:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-white mb-3">Canais de Atendimento</h4>
                      <ul className="space-y-2 text-blue-100 text-sm">
                        <li>• <strong>E-mail:</strong> redemedicadexecelenciavitalis@gmail.com</li>
                        <li>• <strong>Chat:</strong> Suporte em tempo real</li>
                        <li>• <strong>Telefone:</strong> (11) 99999-9999</li>
                        <li>• <strong>WhatsApp:</strong> (11) 99999-9999</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-3">Recursos Disponíveis</h4>
                      <ul className="space-y-2 text-blue-100 text-sm">
                        <li>• Guia de configuração</li>
                        <li>• Tutoriais em vídeo</li>
                        <li>• Documentação técnica</li>
                        <li>• Base de conhecimento</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-indigo-600/30 border border-indigo-400/50 rounded-lg p-4 mt-4">
                    <p className="text-blue-200 text-sm">
                      <strong>Compromisso:</strong> Estamos comprometidos em fornecer informações 
                      claras e suporte adequado para suas dúvidas sobre privacidade e cookies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer da Política */}
            <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Compromisso com a Transparência
                </h3>
                <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
                  A Vitalis está comprometida em fornecer informações claras sobre como 
                  utilizamos cookies e tecnologias similares. Nossa equipe trabalha 
                  continuamente para garantir que você tenha controle total sobre suas 
                  preferências de privacidade.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Transparência</h4>
                    <p className="text-blue-100 text-sm">
                      Informações claras sobre como utilizamos cookies
                    </p>
                  </div>
                  
                  <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Controle</h4>
                    <p className="text-blue-100 text-sm">
                      Você tem controle total sobre suas preferências
                    </p>
                  </div>
                  
                  <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Suporte</h4>
                    <p className="text-blue-100 text-sm">
                      Equipe especializada para suas dúvidas
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

export default Cookies; 