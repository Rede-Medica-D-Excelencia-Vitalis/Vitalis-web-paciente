import React from "react";

const PrivacySeguranca: React.FC = () => {
  return (
    <div id="seguranca" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">5. Segurança dos Dados</h2>
      <div className="space-y-8">
        
        <p className="text-blue-100 leading-relaxed">
          A Vitalis implementa um conjunto abrangente de medidas técnicas e organizacionais 
          para proteger suas informações pessoais contra acesso não autorizado, alteração, 
          divulgação ou destruição. Nossa abordagem de segurança é baseada em padrões 
          internacionais e melhores práticas da indústria.
        </p>
        
        {/* 5.1 Estratégia de Segurança */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">5.1 Estratégia de Segurança em Camadas</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Prevenção</h4>
              <p className="text-blue-200 mb-4">
                Medidas proativas para evitar incidentes de segurança:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Firewalls de nova geração</li>
                <li>• Sistemas de detecção de intrusão</li>
                <li>• Antivírus e antimalware</li>
                <li>• Controle de acesso rigoroso</li>
                <li>• Criptografia em todas as camadas</li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Detecção</h4>
              <p className="text-blue-200 mb-4">
                Sistemas de monitoramento contínuo:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Monitoramento 24/7</li>
                <li>• Análise de logs em tempo real</li>
                <li>• Alertas automáticos</li>
                <li>• Análise comportamental</li>
                <li>• Inteligência de ameaças</li>
              </ul>
            </div>
            
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Resposta</h4>
              <p className="text-blue-200 mb-4">
                Capacidade de resposta rápida a incidentes:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Equipe de resposta a incidentes</li>
                <li>• Procedimentos de contenção</li>
                <li>• Plano de recuperação</li>
                <li>• Comunicação de emergência</li>
                <li>• Análise pós-incidente</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 5.2 Medidas Técnicas */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">5.2 Medidas Técnicas de Segurança</h3>
          
          <div className="space-y-6">
            {/* Criptografia */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">5.2.1 Criptografia de Dados</h4>
              <p className="text-blue-200 mb-4">
                Implementamos criptografia robusta em todas as camadas de dados:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Criptografia em Trânsito</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• TLS 1.3 para todas as comunicações</li>
                    <li>• Certificados SSL/TLS válidos</li>
                    <li>• Criptografia de ponta a ponta</li>
                    <li>• Validação de integridade</li>
                    <li>• Perfect Forward Secrecy (PFS)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Criptografia em Repouso</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• AES-256 para dados sensíveis</li>
                    <li>• Criptografia de banco de dados</li>
                    <li>• Criptografia de backups</li>
                    <li>• Gerenciamento seguro de chaves</li>
                    <li>• Hardware Security Modules (HSM)</li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-600/30 border border-purple-400/50 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Padrões:</strong> Utilizamos algoritmos criptográficos aprovados 
                  pelo NIST e outras autoridades de segurança reconhecidas.
                </p>
              </div>
            </div>
            
            {/* Controle de Acesso */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">5.2.2 Controle de Acesso e Autenticação</h4>
              <p className="text-blue-200 mb-4">
                Sistema robusto de controle de acesso baseado em múltiplos fatores:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Autenticação Multifator</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Senha forte obrigatória</li>
                    <li>• Autenticação em dois fatores (2FA)</li>
                    <li>• Biometria (quando disponível)</li>
                    <li>• Tokens de segurança</li>
                    <li>• Verificação por SMS/e-mail</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Controle de Permissões</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Princípio do menor privilégio</li>
                    <li>• Controle de acesso baseado em função (RBAC)</li>
                    <li>• Revisão periódica de permissões</li>
                    <li>• Separação de funções</li>
                    <li>• Controle de sessão</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Infraestrutura */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">5.2.3 Segurança da Infraestrutura</h4>
              <p className="text-blue-200 mb-4">
                Proteção da infraestrutura física e virtual:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Data Centers</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Data centers certificados (ISO 27001)</li>
                    <li>• Controle de acesso físico</li>
                    <li>• Monitoramento 24/7</li>
                    <li>• Redundância de energia</li>
                    <li>• Controle ambiental</li>
                    <li>• Proteção contra desastres</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Redes e Sistemas</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Segmentação de redes</li>
                    <li>• Firewalls de aplicação</li>
                    <li>• Sistemas de detecção de intrusão</li>
                    <li>• Proteção DDoS</li>
                    <li>• Monitoramento de tráfego</li>
                    <li>• Backup automático</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 5.3 Medidas Organizacionais */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">5.3 Medidas Organizacionais</h3>
          
          <div className="space-y-6">
            {/* Políticas e Procedimentos */}
            <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">5.3.1 Políticas e Procedimentos de Segurança</h4>
              <p className="text-blue-200 mb-4">
                Estrutura organizacional para garantir a segurança dos dados:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Política de Segurança da Informação</strong> - Documento formal que estabelece diretrizes
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Procedimentos Operacionais</strong> - Instruções detalhadas para operações seguras
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Controles de Acesso</strong> - Procedimentos para concessão e revogação de acessos
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Gestão de Incidentes</strong> - Processo estruturado para resposta a incidentes
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Continuidade de Negócios</strong> - Planos para manutenção dos serviços
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Treinamento e Conscientização */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">5.3.2 Treinamento e Conscientização</h4>
              <p className="text-blue-200 mb-4">
                Programa contínuo de capacitação da equipe:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Treinamentos Obrigatórios</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Segurança da informação básica</li>
                    <li>• Proteção de dados pessoais (LGPD)</li>
                    <li>• Prevenção de phishing</li>
                    <li>• Uso seguro de dispositivos</li>
                    <li>• Procedimentos de emergência</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Atividades de Conscientização</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Campanhas mensais de segurança</li>
                    <li>• Simulações de phishing</li>
                    <li>• Workshops especializados</li>
                    <li>• Comunicação regular</li>
                    <li>• Feedback e melhorias</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 5.4 Proteção Especial para Dados de Saúde */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">5.4 Proteção Especial para Dados de Saúde</h3>
          
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Medidas Adicionais para Dados Sensíveis</h4>
            <p className="text-blue-200 mb-4">
              Dados de saúde recebem proteção especial devido à sua natureza sensível:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Controles de Acesso Específicos</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Acesso baseado em função médica</li>
                  <li>• Autenticação biométrica obrigatória</li>
                  <li>• Logs detalhados de acesso</li>
                  <li>• Tempo limite de sessão reduzido</li>
                  <li>• Bloqueio automático por inatividade</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Criptografia Avançada</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Criptografia AES-256 para dados médicos</li>
                  <li>• Chaves de criptografia separadas</li>
                  <li>• Rotação automática de chaves</li>
                  <li>• Criptografia homomórfica (quando aplicável)</li>
                  <li>• Proteção contra ataques quânticos</li>
                </ul>
              </div>
            </div>
            <div className="bg-red-600/30 border border-red-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Conformidade:</strong> Todas as medidas seguem os padrões da 
                ANSI/ISO 27799 para segurança da informação em saúde e demais regulamentações aplicáveis.
              </p>
            </div>
          </div>
        </div>
        
        {/* 5.5 Monitoramento e Resposta */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">5.5 Monitoramento e Resposta a Incidentes</h3>
          
          <div className="space-y-6">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Sistema de Monitoramento 24/7</h4>
              <p className="text-blue-200 mb-4">
                Monitoramento contínuo de toda a infraestrutura:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Monitoramento de rede</strong> - Análise contínua do tráfego e comportamento
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Análise de logs</strong> - Processamento de logs de segurança em tempo real
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Detecção de anomalias</strong> - Identificação de comportamentos suspeitos
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Alertas automáticos</strong> - Notificações imediatas de eventos críticos
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Equipe de Resposta a Incidentes</h4>
              <p className="text-blue-200 mb-4">
                Equipe especializada para resposta rápida e eficaz:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Composição da Equipe</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Analistas de segurança</li>
                    <li>• Engenheiros de sistemas</li>
                    <li>• Especialistas em forense</li>
                    <li>• Advogados especializados</li>
                    <li>• Comunicação corporativa</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Capacidades</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Resposta em menos de 1 hora</li>
                    <li>• Análise forense completa</li>
                    <li>• Contenção de ameaças</li>
                    <li>• Recuperação de sistemas</li>
                    <li>• Comunicação com autoridades</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Notificação e Comunicação</h4>
              <p className="text-blue-200 mb-4">
                Processo transparente de comunicação sobre incidentes:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Notificação obrigatória</strong> - Comunicação à ANPD em até 72 horas
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Comunicação aos usuários</strong> - Informação clara sobre incidentes relevantes
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Relatório detalhado</strong> - Documentação completa do incidente
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Medidas corretivas</strong> - Implementação de melhorias baseadas em lições aprendidas
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 5.6 Compromisso Contínuo */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">5.6 Compromisso com a Segurança Contínua</h3>
          
          <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Melhoria Contínua</h4>
            <p className="text-blue-200 mb-4">
              Nosso compromisso com a segurança é dinâmico e evolutivo:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Atualizações Regulares</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Revisão trimestral de controles</li>
                  <li>• Atualização de políticas</li>
                  <li>• Implementação de novas tecnologias</li>
                  <li>• Treinamento contínuo da equipe</li>
                  <li>• Análise de tendências de ameaças</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Inovação em Segurança</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Adoção de tecnologias emergentes</li>
                  <li>• Inteligência artificial para detecção</li>
                  <li>• Automação de processos de segurança</li>
                  <li>• Colaboração com a comunidade de segurança</li>
                  <li>• Participação em conferências e eventos</li>
                </ul>
              </div>
            </div>
            <div className="bg-purple-600/30 border border-purple-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Transparência:</strong> Publicamos relatórios anuais de segurança 
                e mantemos canais abertos para feedback e sugestões de melhoria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySeguranca; 