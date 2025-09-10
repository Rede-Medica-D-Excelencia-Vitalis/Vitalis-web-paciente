import React from "react";

const PrivacyDireitos: React.FC = () => {
  return (
    <div id="direitos" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">6. Seus Direitos</h2>
      <div className="space-y-8">
        
        <p className="text-blue-100 leading-relaxed">
          A Lei Geral de Proteção de Dados (LGPD) garante uma série de direitos fundamentais 
          aos titulares de dados pessoais. A Vitalis está comprometida em facilitar o exercício 
          desses direitos de forma transparente, acessível e eficiente.
        </p>
        
        {/* 6.1 Direitos Fundamentais */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">6.1 Direitos Fundamentais Garantidos pela LGPD</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Direito de Acesso</h4>
              <p className="text-blue-200 mb-4">
                Conhecer quais dados pessoais temos sobre você e como são tratados:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Quais dados coletamos</li>
                <li>• Como utilizamos</li>
                <li>• Com quem compartilhamos</li>
                <li>• Por quanto tempo mantemos</li>
                <li>• Base legal para o tratamento</li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Direito de Correção</h4>
              <p className="text-blue-200 mb-4">
                Solicitar correção de dados incompletos, inexatos ou desatualizados:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Atualização de informações pessoais</li>
                <li>• Correção de dados médicos</li>
                <li>• Ajuste de informações de contato</li>
                <li>• Complementação de dados faltantes</li>
                <li>• Retificação de documentos</li>
              </ul>
            </div>
            
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Direito de Anonimização</h4>
              <p className="text-blue-200 mb-4">
                Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Eliminação de dados excessivos</li>
                <li>• Bloqueio de dados desnecessários</li>
                <li>• Anonimização para pesquisas</li>
                <li>• Remoção de dados obsoletos</li>
                <li>• Limpeza de dados duplicados</li>
              </ul>
            </div>
            
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Direito de Portabilidade</h4>
              <p className="text-blue-200 mb-4">
                Receber seus dados em formato estruturado e interoperável:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Exportação em formato legível</li>
                <li>• Dados estruturados</li>
                <li>• Compatibilidade com outros sistemas</li>
                <li>• Transferência para outros serviços</li>
                <li>• Backup pessoal dos dados</li>
              </ul>
            </div>
            
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Direito de Eliminação</h4>
              <p className="text-blue-200 mb-4">
                Solicitar a exclusão definitiva de seus dados pessoais:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Exclusão de dados pessoais</li>
                <li>• Remoção de dados sensíveis</li>
                <li>• Eliminação de histórico</li>
                <li>• Cancelamento de conta</li>
                <li>• Apagamento definitivo</li>
              </ul>
            </div>
            
            <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Direito de Informação</h4>
              <p className="text-blue-200 mb-4">
                Obter informações claras sobre o tratamento de seus dados:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Finalidades do tratamento</li>
                <li>• Base legal utilizada</li>
                <li>• Prazo de retenção</li>
                <li>• Medidas de segurança</li>
                <li>• Direitos disponíveis</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 6.2 Exercício dos Direitos */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">6.2 Como Exercer Seus Direitos</h3>
          
          <div className="space-y-6">
            {/* Canais de Atendimento */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">6.2.1 Canais de Atendimento</h4>
              <p className="text-blue-200 mb-4">
                Disponibilizamos múltiplos canais para facilitar o exercício de seus direitos:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Canais Digitais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>E-mail:</strong> redemedicadexecelenciavitalis@gmail.com</li>
                    <li>• <strong>Chat:</strong> Suporte em tempo real na plataforma</li>
                    <li>• <strong>Formulário:</strong> Solicitações estruturadas</li>
                    <li>• <strong>App/Web:</strong> Configurações de privacidade</li>
                    <li>• <strong>Portal:</strong> Área do usuário dedicada</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Canais Tradicionais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Telefone:</strong> (11) 99999-9999</li>
                    <li>• <strong>WhatsApp:</strong> (11) 99999-9999</li>
                    <li>• <strong>Correio:</strong> Endereço físico da empresa</li>
                    <li>• <strong>Presencial:</strong> Agendamento prévio</li>
                    <li>• <strong>Ouvidoria:</strong> Canal independente</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Processo de Solicitação */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">6.2.2 Processo de Solicitação</h4>
              <p className="text-blue-200 mb-4">
                Processo estruturado para garantir atendimento eficiente e seguro:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Identificação</h5>
                    <p className="text-blue-100 text-sm">
                      Verificação de identidade para proteger seus dados
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Análise</h5>
                    <p className="text-blue-100 text-sm">
                      Avaliação da solicitação e verificação de viabilidade
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Execução</h5>
                    <p className="text-blue-100 text-sm">
                      Implementação da solicitação ou justificativa detalhada
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Confirmação</h5>
                    <p className="text-blue-100 text-sm">
                      Comunicação do resultado e fornecimento dos dados
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prazos e Respostas */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">6.2.3 Prazos e Formato das Respostas</h4>
              <p className="text-blue-200 mb-4">
                Compromisso com prazos estabelecidos pela LGPD e formato acessível:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Prazos de Resposta</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Resposta inicial:</strong> Até 15 dias úteis</li>
                    <li>• <strong>Prorrogação:</strong> Até 15 dias adicionais</li>
                    <li>• <strong>Urgência:</strong> Casos de saúde ou segurança</li>
                    <li>• <strong>Complexidade:</strong> Análise técnica necessária</li>
                    <li>• <strong>Volume:</strong> Grandes quantidades de dados</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Formato das Respostas</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Linguagem clara:</strong> Sem termos técnicos</li>
                    <li>• <strong>Formato acessível:</strong> PDF, CSV, JSON</li>
                    <li>• <strong>Estrutura organizada:</strong> Dados categorizados</li>
                    <li>• <strong>Informações completas:</strong> Todos os dados</li>
                    <li>• <strong>Justificativas:</strong> Em caso de recusa</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 6.3 Limitações e Exceções */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">6.3 Limitações e Exceções</h3>
          
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Situações que Podem Limitar o Exercício de Direitos</h4>
            <p className="text-blue-200 mb-4">
              Em determinadas situações, podemos limitar ou recusar o exercício de direitos, 
              sempre com fundamentação legal adequada:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Obrigações Legais</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Registros médicos obrigatórios</li>
                  <li>• Relatórios para autoridades</li>
                  <li>• Cumprimento de ordens judiciais</li>
                  <li>• Investigações criminais</li>
                  <li>• Auditorias regulatórias</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Interesses Legítimos</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Prevenção de fraudes</li>
                  <li>• Segurança da plataforma</li>
                  <li>• Defesa em processos judiciais</li>
                  <li>• Proteção de direitos de terceiros</li>
                  <li>• Continuidade dos serviços</li>
                </ul>
              </div>
            </div>
            <div className="bg-red-600/30 border border-red-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Transparência:</strong> Sempre informamos sobre limitações e fornecemos 
                justificativa detalhada, incluindo possibilidade de recurso.
              </p>
            </div>
          </div>
        </div>
        
        {/* 6.4 Recursos e Reclamações */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">6.4 Recursos e Reclamações</h3>
          
          <div className="space-y-6">
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Recursos Internos</h4>
              <p className="text-blue-200 mb-4">
                Caso não concorde com nossa resposta, você pode:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Solicitar revisão</strong> - Nova análise por equipe especializada
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Contatar a Ouvidoria</strong> - Canal independente para mediação
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Escalar para DPO</strong> - Encarregado de Proteção de Dados
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Negociação direta</strong> - Busca de solução consensual
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Reclamações Externas</h4>
              <p className="text-blue-200 mb-4">
                Direito de apresentar reclamação perante autoridades competentes:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Autoridade Nacional de Proteção de Dados (ANPD)</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Canal oficial: gov.br/anpd</li>
                    <li>• Formulário online disponível</li>
                    <li>• Análise técnica especializada</li>
                    <li>• Poder de fiscalização</li>
                    <li>• Aplicação de sanções</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Outros Canais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Procon (defesa do consumidor)</li>
                    <li>• Ministério Público</li>
                    <li>• Poder Judiciário</li>
                    <li>• Conselhos profissionais</li>
                    <li>• Organizações de defesa</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 6.5 Compromisso da Vitalis */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">6.5 Compromisso da Vitalis</h3>
          
          <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Nosso Compromisso com Seus Direitos</h4>
            <p className="text-blue-200 mb-4">
              A Vitalis se compromete a facilitar e respeitar o exercício de todos os seus direitos:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Facilitação</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Múltiplos canais de atendimento</li>
                  <li>• Processos simplificados</li>
                  <li>• Linguagem acessível</li>
                  <li>• Suporte especializado</li>
                  <li>• Documentação clara</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Transparência</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Informações claras</li>
                  <li>• Justificativas detalhadas</li>
                  <li>• Prazos respeitados</li>
                  <li>• Comunicação proativa</li>
                  <li>• Feedback contínuo</li>
                </ul>
              </div>
            </div>
            <div className="bg-purple-600/30 border border-purple-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Melhoria Contínua:</strong> Regularmente revisamos e aprimoramos nossos 
                processos para garantir o melhor atendimento possível aos seus direitos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDireitos; 