import React from "react";

const PrivacyCompartilhamento: React.FC = () => {
  return (
    <div id="compartilhamento" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">4. Compartilhamento de Dados</h2>
      <div className="space-y-8">
        
        <p className="text-blue-100 leading-relaxed">
          A Vitalis está comprometida em proteger sua privacidade e não comercializa, 
          aluga ou vende suas informações pessoais. O compartilhamento de dados é 
          realizado apenas em situações específicas, sempre com base legal adequada 
          e medidas de proteção apropriadas.
        </p>
        
        {/* 4.1 Princípios de Compartilhamento */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">4.1 Princípios Fundamentais</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Minimização</h4>
              <p className="text-blue-200 mb-4">
                Compartilhamos apenas os dados estritamente necessários para cada finalidade específica.
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Apenas dados essenciais</li>
                <li>• Finalidade específica</li>
                <li>• Tempo limitado de acesso</li>
                <li>• Controle de permissões</li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Segurança</h4>
              <p className="text-blue-200 mb-4">
                Todos os compartilhamentos seguem rigorosos padrões de segurança e proteção.
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Criptografia de dados</li>
                <li>• Canais seguros</li>
                <li>• Contratos de confidencialidade</li>
                <li>• Auditorias regulares</li>
              </ul>
            </div>
            
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Transparência</h4>
              <p className="text-blue-200 mb-4">
                Informamos claramente sobre todos os compartilhamentos realizados.
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Base legal informada</li>
                <li>• Finalidade explicada</li>
                <li>• Direitos preservados</li>
                <li>• Controle mantido</li>
              </ul>
            </div>
            
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Responsabilidade</h4>
              <p className="text-blue-200 mb-4">
                Mantemos controle e responsabilidade sobre os dados compartilhados.
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Contratos de processamento</li>
                <li>• Supervisão contínua</li>
                <li>• Direito de revogação</li>
                <li>• Responsabilidade solidária</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 4.2 Cenários de Compartilhamento */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">4.2 Cenários de Compartilhamento</h3>
          
          <div className="space-y-6">
            {/* Com Consentimento */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">4.2.1 Com Seu Consentimento Explícito</h4>
              <p className="text-blue-200 mb-4">
                Compartilhamento realizado apenas quando você autoriza expressamente:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Parceiros Comerciais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Empresas de seguros de saúde</li>
                    <li>• Programas de benefícios corporativos</li>
                    <li>• Parceiros de marketing (com consentimento específico)</li>
                    <li>• Empresas de pesquisa de mercado</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Serviços Adicionais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Aplicativos de terceiros integrados</li>
                    <li>• Serviços de análise avançada</li>
                    <li>• Ferramentas de produtividade</li>
                    <li>• Plataformas de comunicação</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-600/30 border border-blue-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Importante:</strong> O consentimento pode ser revogado a qualquer momento 
                  através de nossa plataforma ou contato direto.
                </p>
              </div>
            </div>
            
            {/* Prestadores de Serviços */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">4.2.2 Prestadores de Serviços Essenciais</h4>
              <p className="text-blue-200 mb-4">
                Compartilhamento necessário para prestação dos serviços de telemedicina:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Serviços Médicos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Laboratórios de análises clínicas</li>
                    <li>• Centros de diagnóstico por imagem</li>
                    <li>• Farmácias credenciadas</li>
                    <li>• Clínicas especializadas</li>
                    <li>• Hospitais para internação</li>
                    <li>• Serviços de emergência</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Serviços Técnicos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Provedores de infraestrutura cloud</li>
                    <li>• Serviços de processamento de pagamentos</li>
                    <li>• Sistemas de videoconferência</li>
                    <li>• Ferramentas de análise de dados</li>
                    <li>• Serviços de backup e segurança</li>
                    <li>• Plataformas de comunicação</li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-600/30 border border-green-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Contratos:</strong> Todos os prestadores de serviços assinam contratos 
                  de processamento de dados (DPA) com obrigações rigorosas de proteção.
                </p>
              </div>
            </div>
            
            {/* Obrigação Legal */}
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">4.2.3 Obrigação Legal ou Regulatória</h4>
              <p className="text-blue-200 mb-4">
                Compartilhamento exigido por lei, regulamento ou autoridade competente:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Autoridades Sanitárias</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Ministério da Saúde</li>
                    <li>• Agência Nacional de Vigilância Sanitária (ANVISA)</li>
                    <li>• Secretarias Estaduais e Municipais de Saúde</li>
                    <li>• Conselhos Regionais de Medicina</li>
                    <li>• Sistema de Notificação de Eventos Adversos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Autoridades Judiciais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Tribunais de Justiça</li>
                    <li>• Ministério Público</li>
                    <li>• Polícia Federal</li>
                    <li>• Receita Federal</li>
                    <li>• Procon e órgãos de defesa do consumidor</li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-600/30 border border-red-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Procedimento:</strong> Sempre que possível, notificamos sobre 
                  solicitações legais, exceto quando proibido por lei ou ordem judicial.
                </p>
              </div>
            </div>
            
            {/* Proteção de Direitos */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">4.2.4 Proteção de Direitos e Segurança</h4>
              <p className="text-blue-200 mb-4">
                Compartilhamento para proteger direitos, propriedade ou segurança:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Prevenção de Fraudes</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Detecção de atividades suspeitas</li>
                    <li>• Prevenção de uso indevido da plataforma</li>
                    <li>• Investigação de tentativas de fraude</li>
                    <li>• Proteção contra ataques cibernéticos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Proteção de Direitos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Defesa em processos judiciais</li>
                    <li>• Cumprimento de contratos</li>
                    <li>• Proteção de propriedade intelectual</li>
                    <li>• Resolução de disputas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 4.3 Medidas de Proteção */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">4.3 Medidas de Proteção no Compartilhamento</h3>
          
          <div className="space-y-6">
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Contratos de Processamento de Dados (DPA)</h4>
              <p className="text-blue-200 mb-4">
                Todos os terceiros que processam dados em nosso nome assinam contratos rigorosos:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Obrigações de confidencialidade</strong> - Compromisso de não divulgar dados
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Medidas de segurança</strong> - Implementação de proteções técnicas adequadas
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Limitação de uso</strong> - Restrição ao processamento apenas para finalidades autorizadas
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Responsabilidade solidária</strong> - Compromisso conjunto de proteção
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Auditorias e monitoramento</strong> - Verificação regular de conformidade
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Criptografia e Segurança Técnica</h4>
              <p className="text-blue-200 mb-4">
                Proteções técnicas implementadas em todos os compartilhamentos:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Transmissão Segura</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Criptografia TLS 1.3</li>
                    <li>• Certificados SSL válidos</li>
                    <li>• Canais seguros dedicados</li>
                    <li>• Validação de integridade</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Armazenamento Protegido</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Criptografia em repouso</li>
                    <li>• Controle de acesso rigoroso</li>
                    <li>• Backup criptografado</li>
                    <li>• Isolamento de dados</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Controle e Monitoramento</h4>
              <p className="text-blue-200 mb-4">
                Sistemas de controle e supervisão contínua:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Logs de acesso</strong> - Registro detalhado de todos os acessos aos dados
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Alertas de segurança</strong> - Notificações automáticas de atividades suspeitas
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Auditorias regulares</strong> - Verificação periódica de conformidade
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Direito de revogação</strong> - Possibilidade de cancelar compartilhamentos
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 4.4 Seus Direitos */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">4.4 Seus Direitos Relacionados ao Compartilhamento</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Controle de Consentimento</h4>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Revogação</strong> - Cancelar consentimentos a qualquer momento
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Modificação</strong> - Alterar preferências de compartilhamento
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Granularidade</strong> - Consentir apenas para finalidades específicas
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Transparência e Informação</h4>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Solicitação de informações</strong> - Obter detalhes sobre compartilhamentos
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Lista de terceiros</strong> - Conhecer todos os parceiros
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Base legal</strong> - Entender fundamentos de cada compartilhamento
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6 mt-6">
            <h4 className="text-lg font-bold text-white mb-4">Como Exercer Seus Direitos</h4>
            <p className="text-blue-200 mb-4">
              Para exercer qualquer um desses direitos relacionados ao compartilhamento:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-2">Através da Plataforma</h5>
                <ul className="space-y-1 text-blue-100 text-sm">
                  <li>• Configurações de privacidade</li>
                  <li>• Painel de controle de dados</li>
                  <li>• Formulários de solicitação</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-2">Contato Direto</h5>
                <ul className="space-y-1 text-blue-100 text-sm">
                  <li>• E-mail: redemedicadexecelenciavitalis@gmail.com</li>
                  <li>• Chat de suporte</li>
                  <li>• Telefone de atendimento</li>
                </ul>
              </div>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              <strong>Prazo de resposta:</strong> Até 15 dias úteis, conforme exigido pela LGPD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyCompartilhamento; 