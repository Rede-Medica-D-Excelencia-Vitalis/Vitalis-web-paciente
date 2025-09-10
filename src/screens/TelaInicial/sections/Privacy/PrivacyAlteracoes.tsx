import React from "react";

const PrivacyAlteracoes: React.FC = () => {
  return (
    <div id="alteracoes" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">9. Alterações na Política de Privacidade</h2>
      <div className="space-y-8">
        
        <p className="text-blue-100 leading-relaxed">
          A Vitalis pode atualizar esta Política de Privacidade periodicamente para refletir 
          mudanças em nossas práticas, tecnologias, obrigações legais ou para melhorar a 
          transparência. Esta seção explica como gerenciamos essas alterações e como você 
          será notificado sobre elas.
        </p>
        
        {/* 9.1 Processo de Revisão */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">9.1 Processo de Revisão e Atualização</h3>
          
          <div className="space-y-6">
            {/* Revisão Periódica */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.1.1 Revisão Periódica Obrigatória</h4>
              <p className="text-blue-200 mb-4">
                Implementamos um processo estruturado de revisão para garantir que nossa 
                política permaneça atualizada e em conformidade:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Ciclos de Revisão</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Revisão trimestral:</strong> Análise de mudanças operacionais</li>
                    <li>• <strong>Revisão semestral:</strong> Avaliação de compliance</li>
                    <li>• <strong>Revisão anual:</strong> Análise completa da política</li>
                    <li>• <strong>Revisão extraordinária:</strong> Mudanças legais ou incidentes</li>
                    <li>• <strong>Revisão contínua:</strong> Monitoramento de tendências</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Critérios de Avaliação</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Mudanças na legislação</li>
                    <li>• Novas tecnologias implementadas</li>
                    <li>• Feedback dos usuários</li>
                    <li>• Incidentes de segurança</li>
                    <li>• Evolução das práticas do setor</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Equipe Responsável */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.1.2 Equipe Multidisciplinar</h4>
              <p className="text-blue-200 mb-4">
                A revisão e atualização da política envolve uma equipe especializada:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Participantes Internos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>DPO:</strong> Encarregado de Proteção de Dados</li>
                    <li>• <strong>Jurídico:</strong> Compliance e legislação</li>
                    <li>• <strong>TI:</strong> Aspectos técnicos e segurança</li>
                    <li>• <strong>Produto:</strong> Funcionalidades e UX</li>
                    <li>• <strong>Comunicação:</strong> Transparência e clareza</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Consultores Externos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Advogados especializados:</strong> LGPD e regulamentações</li>
                    <li>• <strong>Consultores de segurança:</strong> Proteção de dados</li>
                    <li>• <strong>Auditores independentes:</strong> Validação de compliance</li>
                    <li>• <strong>Especialistas em UX:</strong> Clareza e acessibilidade</li>
                    <li>• <strong>Representantes de usuários:</strong> Feedback e necessidades</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Processo de Aprovação */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.1.3 Processo de Aprovação</h4>
              <p className="text-blue-200 mb-4">
                Mudanças na política seguem um processo rigoroso de aprovação:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Proposta de Mudança</h5>
                    <p className="text-blue-100 text-sm">
                      Identificação da necessidade e elaboração da proposta inicial
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Análise de Impacto</h5>
                    <p className="text-blue-100 text-sm">
                      Avaliação dos riscos e benefícios para usuários e empresa
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Revisão Legal</h5>
                    <p className="text-blue-100 text-sm">
                      Validação de conformidade com legislação aplicável
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Aprovação Executiva</h5>
                    <p className="text-blue-100 text-sm">
                      Decisão final pela alta administração da empresa
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Implementação</h5>
                    <p className="text-blue-100 text-sm">
                      Publicação e comunicação das mudanças aos usuários
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 9.2 Tipos de Alterações */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">9.2 Tipos de Alterações</h3>
          
          <div className="space-y-6">
            {/* Alterações Administrativas */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.2.1 Alterações Administrativas</h4>
              <p className="text-blue-200 mb-4">
                Mudanças que não afetam substancialmente o tratamento de dados:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Exemplos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Correções de erros de digitação</li>
                    <li>• Atualização de informações de contato</li>
                    <li>• Melhorias na formatação</li>
                    <li>• Adição de links quebrados</li>
                    <li>• Atualização de nomes de cargos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Notificação</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Atualização silenciosa</li>
                    <li>• Registro no histórico</li>
                    <li>• Sem notificação obrigatória</li>
                    <li>• Disponibilidade imediata</li>
                    <li>• Data de alteração documentada</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Alterações Operacionais */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.2.2 Alterações Operacionais</h4>
              <p className="text-blue-200 mb-4">
                Mudanças que afetam como processamos ou protegemos dados:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Exemplos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Novos provedores de serviços</li>
                    <li>• Mudanças em medidas de segurança</li>
                    <li>• Atualização de tecnologias</li>
                    <li>• Modificação de prazos de retenção</li>
                    <li>• Alteração de processos internos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Notificação</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Banner na plataforma</li>
                    <li>• E-mail informativo</li>
                    <li>• Notificação no app</li>
                    <li>• Prazo de 30 dias</li>
                    <li>• Destaque das principais mudanças</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Alterações Substanciais */}
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.2.3 Alterações Substanciais</h4>
              <p className="text-blue-200 mb-4">
                Mudanças significativas que afetam direitos ou obrigações dos usuários:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Exemplos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Mudança na base legal</li>
                    <li>• Novas finalidades de tratamento</li>
                    <li>• Compartilhamento com novos terceiros</li>
                    <li>• Alteração de direitos do usuário</li>
                    <li>• Mudança de controlador</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Notificação</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Comunicação proativa</li>
                    <li>• Múltiplos canais</li>
                    <li>• Prazo de 60 dias</li>
                    <li>• Possibilidade de objeção</li>
                    <li>• Direito de retirada</li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-600/30 border border-red-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Importante:</strong> Alterações substanciais podem requerer novo 
                  consentimento ou justificativa legal específica.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 9.3 Notificação de Mudanças */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">9.3 Processo de Notificação</h3>
          
          <div className="space-y-6">
            {/* Canais de Notificação */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.3.1 Canais de Notificação</h4>
              <p className="text-blue-200 mb-4">
                Utilizamos múltiplos canais para garantir que você seja informado sobre mudanças:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Canais Digitais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Banner na plataforma:</strong> Destaque visual</li>
                    <li>• <strong>E-mail:</strong> Comunicação direta</li>
                    <li>• <strong>Notificação push:</strong> App mobile</li>
                    <li>• <strong>Chat de suporte:</strong> Mensagem automática</li>
                    <li>• <strong>Redes sociais:</strong> Posts informativos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Canais Tradicionais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>SMS:</strong> Para mudanças críticas</li>
                    <li>• <strong>Telefone:</strong> Usuários premium</li>
                    <li>• <strong>Correio:</strong> Casos especiais</li>
                    <li>• <strong>Comunicado oficial:</strong> Documento formal</li>
                    <li>• <strong>Press release:</strong> Mudanças significativas</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Conteúdo da Notificação */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.3.2 Conteúdo da Notificação</h4>
              <p className="text-blue-200 mb-4">
                Nossas notificações incluem informações essenciais para sua compreensão:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Informações Obrigatórias</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Data da alteração</li>
                    <li>• Resumo das mudanças</li>
                    <li>• Motivo da alteração</li>
                    <li>• Impacto nos usuários</li>
                    <li>• Data de vigência</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Informações Adicionais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Comparação lado a lado</li>
                    <li>• FAQ sobre mudanças</li>
                    <li>• Contato para dúvidas</li>
                    <li>• Direitos do usuário</li>
                    <li>• Links para versão completa</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Prazos e Timing */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.3.3 Prazos e Timing</h4>
              <p className="text-blue-200 mb-4">
                Respeitamos prazos adequados para notificação conforme o tipo de alteração:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Prazos por Tipo</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Administrativas:</strong> Sem prazo mínimo</li>
                    <li>• <strong>Operacionais:</strong> 30 dias de antecedência</li>
                    <li>• <strong>Substanciais:</strong> 60 dias de antecedência</li>
                    <li>• <strong>Críticas:</strong> 90 dias de antecedência</li>
                    <li>• <strong>Emergenciais:</strong> Imediata + justificativa</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Estratégia de Comunicação</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Notificação inicial</li>
                    <li>• Lembretes periódicos</li>
                    <li>• Notificação final</li>
                    <li>• Confirmação de vigência</li>
                    <li>• Follow-up pós-implementação</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 9.4 Direitos do Usuário */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">9.4 Seus Direitos Durante Mudanças</h3>
          
          <div className="space-y-6">
            {/* Direito de Objeção */}
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.4.1 Direito de Objeção</h4>
              <p className="text-blue-200 mb-4">
                Você tem o direito de se opor a mudanças que afetem seus direitos:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Como Objetar</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Formulário online</li>
                    <li>• E-mail direto</li>
                    <li>• Chat de suporte</li>
                    <li>• Telefone de atendimento</li>
                    <li>• Carta formal</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Processo de Análise</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Recebimento da objeção</li>
                    <li>• Análise técnica e legal</li>
                    <li>• Resposta em até 15 dias</li>
                    <li>• Possibilidade de negociação</li>
                    <li>• Resolução consensual</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Direito de Retirada */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.4.2 Direito de Retirada</h4>
              <p className="text-blue-200 mb-4">
                Em caso de mudanças substanciais, você pode optar por retirar seu consentimento:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Opções Disponíveis</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Cancelamento da conta</li>
                    <li>• Exclusão de dados</li>
                    <li>• Limitação de funcionalidades</li>
                    <li>• Migração para outro serviço</li>
                    <li>• Suspensão temporária</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Processo de Retirada</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Solicitação formal</li>
                    <li>• Confirmação de identidade</li>
                    <li>• Processamento em até 30 dias</li>
                    <li>• Confirmação por e-mail</li>
                    <li>• Certificado de exclusão</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Compensações */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">9.4.3 Compensações e Alternativas</h4>
              <p className="text-blue-200 mb-4">
                Oferecemos alternativas para minimizar o impacto das mudanças:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Compensações Disponíveis</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Período de transição</li>
                    <li>• Configurações personalizadas</li>
                    <li>• Suporte especializado</li>
                    <li>• Treinamento sobre mudanças</li>
                    <li>• Descontos ou benefícios</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Alternativas</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Versão anterior da política</li>
                    <li>• Configurações específicas</li>
                    <li>• Contratos personalizados</li>
                    <li>• Serviços alternativos</li>
                    <li>• Migração assistida</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 9.5 Histórico e Versionamento */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">9.5 Histórico e Versionamento</h3>
          
          <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Controle de Versões</h4>
            <p className="text-blue-200 mb-4">
              Mantemos um histórico completo de todas as alterações na política:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Informações Documentadas</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Data e hora da alteração</li>
                  <li>• Versão da política</li>
                  <li>• Responsável pela mudança</li>
                  <li>• Motivo da alteração</li>
                  <li>• Impacto nos usuários</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Acesso ao Histórico</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Página dedicada no site</li>
                  <li>• Comparação de versões</li>
                  <li>• Download de versões anteriores</li>
                  <li>• Timeline interativa</li>
                  <li>• Busca por período</li>
                </ul>
              </div>
            </div>
            <div className="bg-purple-600/30 border border-purple-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Transparência:</strong> Todo o histórico está disponível para 
                consulta, garantindo total transparência sobre as mudanças realizadas.
              </p>
            </div>
          </div>
        </div>
        
        {/* 9.6 Contato e Dúvidas */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">9.6 Dúvidas sobre Alterações</h3>
          
          <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Suporte Especializado</h4>
            <p className="text-blue-200 mb-4">
            Nossa equipe está disponível para esclarecer dúvidas sobre mudanças na política:
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
                  <li>• Guia de mudanças</li>
                  <li>• Vídeos explicativos</li>
                  <li>• Webinars informativos</li>
                  <li>• Documentação técnica</li>
                  <li>• Comunidade de usuários</li>
                </ul>
              </div>
            </div>
            <div className="bg-indigo-600/30 border border-indigo-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Compromisso:</strong> Estamos comprometidos em fornecer informações 
                claras e suporte adequado durante todo o processo de mudanças.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAlteracoes; 