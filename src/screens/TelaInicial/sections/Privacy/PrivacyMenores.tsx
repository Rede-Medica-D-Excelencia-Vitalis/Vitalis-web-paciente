import React from "react";

const PrivacyMenores: React.FC = () => {
  return (
    <div id="menores" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">8. Proteção de Menores de Idade</h2>
      <div className="space-y-8">
        
        <p className="text-blue-100 leading-relaxed">
          A proteção de menores de idade é uma prioridade absoluta para a Vitalis. Esta seção 
          detalha nossas políticas específicas para o tratamento de dados de crianças e 
          adolescentes, incluindo as medidas de proteção implementadas e as responsabilidades 
          legais envolvidas.
        </p>
        
        {/* 8.1 Definições Legais */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">8.1 Definições e Classificações Legais</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Crianças (0-12 anos)</h4>
              <p className="text-blue-200 mb-4">
                Consideradas especialmente vulneráveis, requerem proteção máxima:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Consentimento parental obrigatório</li>
                <li>• Coleta mínima de dados</li>
                <li>• Monitoramento rigoroso</li>
                <li>• Funcionalidades limitadas</li>
                <li>• Supervisão constante</li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Adolescentes (13-17 anos)</h4>
              <p className="text-blue-200 mb-4">
                Maior autonomia, mas ainda requerem proteção especial:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Consentimento próprio + parental</li>
                <li>• Funcionalidades expandidas</li>
                <li>• Controles de privacidade</li>
                <li>• Educação digital</li>
                <li>• Suporte especializado</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 8.2 Princípios de Proteção */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">8.2 Princípios Fundamentais de Proteção</h3>
          
          <div className="space-y-6">
            {/* Interesse Superior */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.2.1 Interesse Superior da Criança</h4>
              <p className="text-blue-200 mb-4">
                Todas as decisões sobre tratamento de dados de menores são baseadas no 
                princípio do interesse superior da criança:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Critérios de Avaliação</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Benefício direto para a criança</li>
                    <li>• Necessidade médica comprovada</li>
                    <li>• Riscos mínimos identificados</li>
                    <li>• Alternativas menos invasivas</li>
                    <li>• Consentimento informado</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Medidas de Proteção</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Análise de impacto prévia</li>
                    <li>• Revisão por comitê ético</li>
                    <li>• Monitoramento contínuo</li>
                    <li>• Direito de retirada</li>
                    <li>• Compensação por danos</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Consentimento Parental */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.2.2 Consentimento Parental Obrigatório</h4>
              <p className="text-blue-200 mb-4">
                Para menores de 18 anos, o consentimento dos pais ou responsáveis legais é 
                obrigatório e deve ser obtido de forma clara e documentada:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Processo de Consentimento</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Identificação dos responsáveis</li>
                    <li>• Explicação clara dos termos</li>
                    <li>• Documentação formal</li>
                    <li>• Confirmação por múltiplos canais</li>
                    <li>• Registro de data e hora</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Validação do Consentimento</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Verificação de identidade</li>
                    <li>• Confirmação de paternidade</li>
                    <li>• Capacidade legal comprovada</li>
                    <li>• Ausência de conflitos</li>
                    <li>• Compreensão dos termos</li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-600/30 border border-green-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Importante:</strong> O consentimento pode ser revogado a qualquer 
                  momento pelos responsáveis legais, sem prejuízo da criança.
                </p>
              </div>
            </div>
            
            {/* Coleta Mínima */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.2.3 Princípio da Coleta Mínima</h4>
              <p className="text-blue-200 mb-4">
                Coletamos apenas os dados estritamente necessários para o serviço solicitado:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Dados Essenciais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Nome completo</li>
                    <li>• Data de nascimento</li>
                    <li>• Informações médicas básicas</li>
                    <li>• Contato dos responsáveis</li>
                    <li>• Histórico de saúde relevante</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Dados Não Coletados</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Dados biométricos</li>
                    <li>• Localização em tempo real</li>
                    <li>• Histórico de navegação</li>
                    <li>• Dados de comportamento</li>
                    <li>• Informações financeiras</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 8.3 Medidas de Proteção Técnica */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">8.3 Medidas de Proteção Técnica</h3>
          
          <div className="space-y-6">
            {/* Controles de Acesso */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.3.1 Controles de Acesso Rigorosos</h4>
              <p className="text-blue-200 mb-4">
                Implementamos controles de acesso específicos para dados de menores:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Autenticação Multi-Fator</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Senha forte obrigatória</li>
                    <li>• Autenticação por SMS</li>
                    <li>• Verificação por e-mail</li>
                    <li>• Biometria (quando disponível)</li>
                    <li>• Tokens de segurança</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Controle de Sessão</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Timeout automático</li>
                    <li>• Logout forçado</li>
                    <li>• Monitoramento de atividades</li>
                    <li>• Detecção de anomalias</li>
                    <li>• Bloqueio preventivo</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Criptografia */}
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.3.2 Criptografia Avançada</h4>
              <p className="text-blue-200 mb-4">
                Todos os dados de menores são protegidos com criptografia de ponta:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Criptografia em Repouso</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• AES-256 para armazenamento</li>
                    <li>• Chaves gerenciadas por HSM</li>
                    <li>• Rotação automática de chaves</li>
                    <li>• Backup criptografado</li>
                    <li>• Redundância geográfica</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Criptografia em Trânsito</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• TLS 1.3 obrigatório</li>
                    <li>• Certificados SSL válidos</li>
                    <li>• Perfect Forward Secrecy</li>
                    <li>• Validação de certificados</li>
                    <li>• Proteção contra ataques</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Monitoramento */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.3.3 Monitoramento e Detecção</h4>
              <p className="text-blue-200 mb-4">
                Sistema avançado de monitoramento para detectar atividades suspeitas:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Detecção de Anomalias</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Análise de padrões de acesso</li>
                    <li>• Detecção de tentativas de invasão</li>
                    <li>• Monitoramento de downloads</li>
                    <li>• Análise de logs em tempo real</li>
                    <li>• Alertas automáticos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Resposta a Incidentes</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Equipe de resposta 24/7</li>
                    <li>• Procedimentos automatizados</li>
                    <li>• Notificação imediata</li>
                    <li>• Isolamento de ameaças</li>
                    <li>• Recuperação rápida</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 8.4 Responsabilidades Legais */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">8.4 Responsabilidades Legais</h3>
          
          <div className="space-y-6">
            {/* Responsabilidade da Vitalis */}
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.4.1 Responsabilidades da Vitalis</h4>
              <p className="text-blue-200 mb-4">
                Como controladora de dados, assumimos responsabilidades específicas:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Obrigações Legais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Cumprimento da LGPD</li>
                    <li>• Proteção de dados sensíveis</li>
                    <li>• Notificação de incidentes</li>
                    <li>• Relatórios regulatórios</li>
                    <li>• Auditorias obrigatórias</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Medidas de Compliance</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Políticas documentadas</li>
                    <li>• Treinamento da equipe</li>
                    <li>• Monitoramento contínuo</li>
                    <li>• Revisão periódica</li>
                    <li>• Melhoria contínua</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Responsabilidade dos Pais */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.4.2 Responsabilidades dos Pais/Responsáveis</h4>
              <p className="text-blue-200 mb-4">
                Os responsáveis legais têm responsabilidades importantes:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Supervisão</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Monitorar o uso da plataforma</li>
                    <li>• Configurar controles parentais</li>
                    <li>• Revisar configurações</li>
                    <li>• Orientar sobre segurança</li>
                    <li>• Manter comunicação</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Atualização</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Manter dados atualizados</li>
                    <li>• Revisar consentimentos</li>
                    <li>• Reportar mudanças</li>
                    <li>• Responder a comunicações</li>
                    <li>• Participar de treinamentos</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Sanções e Penalidades */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">8.4.3 Sanções e Penalidades</h4>
              <p className="text-blue-200 mb-4">
                Violações da proteção de menores podem resultar em penalidades severas:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Penalidades Administrativas</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Multas de até R$ 50 milhões</li>
                    <li>• Suspensão de atividades</li>
                    <li>• Proibição de tratamento</li>
                    <li>• Publicação da infração</li>
                    <li>• Bloqueio de dados</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Penalidades Criminais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Responsabilidade criminal</li>
                    <li>• Processo judicial</li>
                    <li>• Indenizações</li>
                    <li>• Danos morais</li>
                    <li>• Reparação civil</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 8.5 Denúncias e Violações */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">8.5 Denúncias e Violações</h3>
          
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Canais de Denúncia</h4>
            <p className="text-blue-200 mb-4">
              Disponibilizamos canais específicos para denúncias relacionadas a menores:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Canais Internos</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>Ouvidoria:</strong> Canal independente</li>
                  <li>• <strong>E-mail:</strong> redemedicadexecelenciavitalis@gmail.com</li>
                  <li>• <strong>Telefone:</strong> (11) 99999-9999</li>
                  <li>• <strong>Chat:</strong> Suporte especializado</li>
                  <li>• <strong>Formulário:</strong> Denúncia online</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Canais Externos</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>ANPD:</strong> Autoridade Nacional</li>
                  <li>• <strong>Conselho Tutelar:</strong> Proteção local</li>
                  <li>• <strong>Ministério Público:</strong> Promotoria da Infância</li>
                  <li>• <strong>Disque 100:</strong> Direitos Humanos</li>
                  <li>• <strong>SaferNet:</strong> Crimes digitais</li>
                </ul>
              </div>
            </div>
            <div className="bg-red-600/30 border border-red-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Confidencialidade:</strong> Todas as denúncias são tratadas com 
                sigilo e investigadas com prioridade máxima.
              </p>
            </div>
          </div>
        </div>
        
        {/* 8.6 Compromisso Contínuo */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">8.6 Compromisso Contínuo</h3>
          
          <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Melhoria Contínua da Proteção</h4>
            <p className="text-blue-200 mb-4">
              Nosso compromisso com a proteção de menores é contínuo e evolutivo:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Atualizações Regulares</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Revisão de políticas</li>
                  <li>• Atualização de tecnologias</li>
                  <li>• Treinamento da equipe</li>
                  <li>• Auditorias periódicas</li>
                  <li>• Feedback dos usuários</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Inovação e Pesquisa</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Novas tecnologias de proteção</li>
                  <li>• Parcerias com especialistas</li>
                  <li>• Pesquisas em segurança</li>
                  <li>• Desenvolvimento de ferramentas</li>
                  <li>• Colaboração com autoridades</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-600/30 border border-green-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Missão:</strong> Garantir que a tecnologia seja uma ferramenta 
                segura e benéfica para o desenvolvimento saudável de crianças e adolescentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyMenores; 