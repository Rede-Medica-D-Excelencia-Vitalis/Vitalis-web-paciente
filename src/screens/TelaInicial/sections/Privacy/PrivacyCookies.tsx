import React from "react";

const PrivacyCookies: React.FC = () => {
  return (
    <div id="cookies" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">7. Cookies e Tecnologias Similares</h2>
      <div className="space-y-8">
        
        <p className="text-blue-100 leading-relaxed">
          Utilizamos cookies e tecnologias similares para melhorar sua experiência em nossa 
          plataforma, personalizar conteúdo, analisar tráfego e fornecer funcionalidades 
          essenciais. Esta seção explica como utilizamos essas tecnologias e como você pode 
          controlá-las.
        </p>
        
        {/* 7.1 O que são Cookies */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">7.1 O que são Cookies</h3>
          
          <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Definição e Funcionamento</h4>
            <p className="text-blue-200 mb-4">
              Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você 
              visita um site. Eles permitem que o site "lembre" de suas ações e preferências 
              ao longo do tempo, proporcionando uma experiência mais personalizada e eficiente.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Como Funcionam</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Armazenados no navegador</li>
                  <li>• Enviados automaticamente</li>
                  <li>• Identificam seu dispositivo</li>
                  <li>• Mantêm preferências</li>
                  <li>• Melhoram performance</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Tipos de Informações</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Preferências de idioma</li>
                  <li>• Itens no carrinho</li>
                  <li>• Dados de login</li>
                  <li>• Histórico de navegação</li>
                  <li>• Configurações de privacidade</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 7.2 Tipos de Cookies */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">7.2 Tipos de Cookies que Utilizamos</h3>
          
          <div className="space-y-6">
            {/* Cookies Essenciais */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">7.2.1 Cookies Essenciais (Necessários)</h4>
              <p className="text-blue-200 mb-4">
                Esses cookies são fundamentais para o funcionamento básico da plataforma e 
                não podem ser desativados:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Funcionalidades</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Autenticação e segurança</li>
                    <li>• Sessão do usuário</li>
                    <li>• Prevenção de fraudes</li>
                    <li>• Carregamento de páginas</li>
                    <li>• Funcionalidades básicas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Exemplos Específicos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Manutenção do login</li>
                    <li>• Proteção CSRF</li>
                    <li>• Balanceamento de carga</li>
                    <li>• Cache de recursos</li>
                    <li>• Configurações essenciais</li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-600/30 border border-green-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Importante:</strong> Estes cookies são essenciais para a segurança 
                  e funcionamento da plataforma. Desativá-los pode comprometer a experiência.
                </p>
              </div>
            </div>
            
            {/* Cookies de Performance */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">7.2.2 Cookies de Performance e Análise</h4>
              <p className="text-blue-200 mb-4">
                Coletam informações sobre como você utiliza nossa plataforma para melhorar 
                a experiência e identificar problemas:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Dados Coletados</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Páginas visitadas</li>
                    <li>• Tempo de permanência</li>
                    <li>• Erros encontrados</li>
                    <li>• Performance da página</li>
                    <li>• Fluxo de navegação</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Ferramentas Utilizadas</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Google Analytics</li>
                    <li>• Hotjar (análise de comportamento)</li>
                    <li>• Sentry (monitoramento de erros)</li>
                    <li>• Ferramentas internas</li>
                    <li>• Métricas de performance</li>
                  </ul>
                </div>
              </div>
              <div className="bg-yellow-600/30 border border-yellow-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Benefício:</strong> Esses dados nos ajudam a identificar problemas, 
                  melhorar a usabilidade e otimizar a performance da plataforma.
                </p>
              </div>
            </div>
            
            {/* Cookies de Funcionalidade */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">7.2.3 Cookies de Funcionalidade</h4>
              <p className="text-blue-200 mb-4">
                Permitem que a plataforma lembre de escolhas que você fez e forneça 
                funcionalidades aprimoradas:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Preferências Salvas</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Idioma preferido</li>
                    <li>• Região/país</li>
                    <li>• Tema (claro/escuro)</li>
                    <li>• Configurações de notificação</li>
                    <li>• Filtros de busca</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Funcionalidades</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Carrinho de compras</li>
                    <li>• Lista de favoritos</li>
                    <li>• Histórico de consultas</li>
                    <li>• Configurações de privacidade</li>
                    <li>• Preferências de comunicação</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Cookies de Marketing */}
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">7.2.4 Cookies de Marketing e Publicidade</h4>
              <p className="text-blue-200 mb-4">
                Utilizados para fornecer conteúdo relevante e medir a eficácia de campanhas 
                publicitárias:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Finalidades</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Anúncios personalizados</li>
                    <li>• Remarketing</li>
                    <li>• Análise de campanhas</li>
                    <li>• Segmentação de audiência</li>
                    <li>• Otimização de conversão</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Tecnologias</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Google Ads</li>
                    <li>• Facebook Pixel</li>
                    <li>• LinkedIn Insight</li>
                    <li>• Redes de anúncios</li>
                    <li>• Ferramentas de analytics</li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-600/30 border border-red-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Controle:</strong> Você pode desativar estes cookies através das 
                  configurações de privacidade ou ferramentas de terceiros.
                </p>
              </div>
            </div>
            
            {/* Cookies de Terceiros */}
            <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">7.2.5 Cookies de Terceiros</h4>
              <p className="text-blue-200 mb-4">
                Cookies definidos por parceiros e provedores de serviços que nos auxiliam 
                na operação da plataforma:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Provedores de Serviços</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Stripe (pagamentos)</li>
                    <li>• SendGrid (e-mails)</li>
                    <li>• Intercom (suporte)</li>
                    <li>• Cloudflare (segurança)</li>
                    <li>• AWS (infraestrutura)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Funcionalidades</h5>
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
        </div>
        
        {/* 7.3 Controle de Cookies */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">7.3 Como Controlar os Cookies</h3>
          
          <div className="space-y-6">
            {/* Configurações do Navegador */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">7.3.1 Configurações do Navegador</h4>
              <p className="text-blue-200 mb-4">
                A maioria dos navegadores permite controlar cookies através de configurações 
                de privacidade:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Navegadores Populares</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Chrome:</strong> Configurações &gt; Privacidade e segurança</li>
                    <li>• <strong>Firefox:</strong> Opções &gt; Privacidade e Segurança</li>
                    <li>• <strong>Safari:</strong> Preferências &gt; Privacidade</li>
                    <li>• <strong>Edge:</strong> Configurações &gt; Cookies e permissões</li>
                    <li>• <strong>Opera:</strong> Configurações &gt; Privacidade e segurança</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Opções Disponíveis</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Aceitar todos os cookies</li>
                    <li>• Bloquear cookies de terceiros</li>
                    <li>• Bloquear todos os cookies</li>
                    <li>• Excluir cookies ao fechar</li>
                    <li>• Configurações personalizadas</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Configurações da Plataforma */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">7.3.2 Configurações da Plataforma Vitalis</h4>
              <p className="text-blue-200 mb-4">
                Oferecemos controles granulares para gerenciar suas preferências de cookies:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Painel de Controle</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Configurações de privacidade</li>
                    <li>• Gerenciador de cookies</li>
                    <li>• Preferências de marketing</li>
                    <li>• Configurações de análise</li>
                    <li>• Controles de personalização</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Funcionalidades</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Ativar/desativar por categoria</li>
                    <li>• Configurações granulares</li>
                    <li>• Histórico de consentimento</li>
                    <li>• Alterações em tempo real</li>
                    <li>• Backup de preferências</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Ferramentas de Terceiros */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">7.3.3 Ferramentas de Terceiros</h4>
              <p className="text-blue-200 mb-4">
                Existem ferramentas especializadas para gerenciar cookies e privacidade:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Extensões de Navegador</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Privacy Badger</li>
                    <li>• uBlock Origin</li>
                    <li>• Ghostery</li>
                    <li>• Cookie AutoDelete</li>
                    <li>• I Don't Care About Cookies</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Sites de Opt-out</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• YourAdChoices (DAA)</li>
                    <li>• Network Advertising Initiative</li>
                    <li>• European Interactive Digital Advertising Alliance</li>
                    <li>• Google Ads Settings</li>
                    <li>• Facebook Ad Preferences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 7.4 Impacto da Desativação */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">7.4 Impacto da Desativação de Cookies</h3>
          
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Consequências da Desativação</h4>
            <p className="text-blue-200 mb-4">
              Desativar cookies pode afetar significativamente sua experiência na plataforma:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Funcionalidades Afetadas</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Necessidade de login repetido</li>
                  <li>• Perda de preferências salvas</li>
                  <li>• Carrinho de compras não salvo</li>
                  <li>• Configurações resetadas</li>
                  <li>• Funcionalidades limitadas</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Experiência do Usuário</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Navegação menos fluida</li>
                  <li>• Conteúdo não personalizado</li>
                  <li>• Anúncios irrelevantes</li>
                  <li>• Performance reduzida</li>
                  <li>• Menos funcionalidades</li>
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
        
        {/* 7.5 Atualizações e Mudanças */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">7.5 Atualizações e Mudanças</h3>
          
          <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Política de Cookies Dinâmica</h4>
            <p className="text-blue-200 mb-4">
              Nossa política de cookies pode ser atualizada conforme evoluem as tecnologias 
              e regulamentações:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Quando Atualizamos</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Novas funcionalidades</li>
                  <li>• Mudanças na legislação</li>
                  <li>• Novos provedores de serviços</li>
                  <li>• Melhorias de segurança</li>
                  <li>• Feedback dos usuários</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Como Notificamos</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Banner de notificação</li>
                  <li>• E-mail informativo</li>
                  <li>• Atualização da política</li>
                  <li>• Notificação no app</li>
                  <li>• Comunicação por chat</li>
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
        
        {/* 7.6 Contato e Suporte */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">7.6 Dúvidas sobre Cookies</h3>
          
          <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Suporte Especializado</h4>
            <p className="text-blue-200 mb-4">
              Nossa equipe está disponível para esclarecer dúvidas sobre cookies e privacidade:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Canais de Atendimento</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>E-mail:</strong> redemedicadexecelenciavitalis@gmail.com</li>
                  <li>• <strong>Chat:</strong> Suporte em tempo real</li>
                  <li>• <strong>Telefone:</strong> (11) 99999-9999</li>
                  <li>• <strong>WhatsApp:</strong> (11) 99999-9999</li>
                  <li>• <strong>FAQ:</strong> Perguntas frequentes</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Recursos Disponíveis</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Guia de configuração</li>
                  <li>• Tutoriais em vídeo</li>
                  <li>• Documentação técnica</li>
                  <li>• Base de conhecimento</li>
                  <li>• Comunidade de usuários</li>
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
    </div>
  );
};

export default PrivacyCookies; 