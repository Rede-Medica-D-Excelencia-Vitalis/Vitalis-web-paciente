import React from "react";

const PrivacyUso: React.FC = () => {
  return (
    <div id="uso" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">3. Uso dos Dados</h2>
      <div className="space-y-8">
        
        <p className="text-blue-100 leading-relaxed">
          A Vitalis utiliza suas informações pessoais exclusivamente para finalidades 
          legítimas, específicas e transparentes. Cada categoria de dados possui propósitos 
          bem definidos, sempre em conformidade com a LGPD e demais legislações aplicáveis.
        </p>
        
        {/* 3.1 Finalidades Principais */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">3.1 Finalidades Principais</h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">Prestação de Serviços de Telemedicina</h4>
              <p className="text-blue-200 mb-4">
                Utilização de dados para fornecer serviços médicos de qualidade:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Agendamento de consultas</strong> - Organização de horários, 
                    confirmações e lembretes de compromissos médicos
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Realização de teleconsultas</strong> - Conectividade, 
                    qualidade de vídeo e áudio, e registro da consulta
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Prescrição de medicamentos</strong> - Emissão de receitas 
                    digitais e controle de medicamentos prescritos
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Acompanhamento médico</strong> - Monitoramento de evolução 
                    clínica e histórico de tratamentos
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Emissão de documentos</strong> - Atestados, declarações 
                    e relatórios médicos
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">Gestão da Conta e Segurança</h4>
              <p className="text-blue-200 mb-4">
                Administração da conta do usuário e proteção da plataforma:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Autenticação e autorização</strong> - Verificação de identidade 
                    e controle de acesso à plataforma
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Prevenção de fraudes</strong> - Detecção de atividades 
                    suspeitas e proteção contra uso indevido
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Recuperação de conta</strong> - Processos de reset de senha 
                    e verificação de identidade
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Monitoramento de segurança</strong> - Análise de logs e 
                    detecção de tentativas de invasão
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Backup e recuperação</strong> - Preservação de dados 
                    e restauração em caso de incidentes
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 3.2 Finalidades Secundárias */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">3.2 Finalidades Secundárias</h3>
          
          <div className="space-y-6">
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Melhoria de Serviços e Experiência do Usuário</h4>
              <p className="text-blue-200 mb-4">
                Análise de dados para otimização da plataforma e personalização de serviços:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Análise de Uso</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Identificação de funcionalidades mais utilizadas</li>
                    <li>• Análise de padrões de navegação</li>
                    <li>• Detecção de pontos de dificuldade</li>
                    <li>• Otimização de performance</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Personalização</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Recomendações personalizadas</li>
                    <li>• Interface adaptada ao perfil</li>
                    <li>• Conteúdo relevante</li>
                    <li>• Lembretes inteligentes</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Comunicação e Suporte</h4>
              <p className="text-blue-200 mb-4">
                Interação com usuários para suporte e informações importantes:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Comunicações Essenciais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Confirmações de consultas</li>
                    <li>• Lembretes de medicamentos</li>
                    <li>• Atualizações de segurança</li>
                    <li>• Notificações de manutenção</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Suporte ao Cliente</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Atendimento técnico</li>
                    <li>• Resolução de problemas</li>
                    <li>• Orientações de uso</li>
                    <li>• Feedback e melhorias</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Pesquisa e Desenvolvimento</h4>
              <p className="text-blue-200 mb-4">
                Utilização de dados anonimizados para pesquisas científicas e desenvolvimento:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Pesquisas Médicas</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Estudos epidemiológicos</li>
                    <li>• Análise de eficácia de tratamentos</li>
                    <li>• Identificação de tendências de saúde</li>
                    <li>• Publicações científicas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Desenvolvimento Tecnológico</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Melhoria de algoritmos</li>
                    <li>• Desenvolvimento de novas funcionalidades</li>
                    <li>• Otimização de processos</li>
                    <li>• Inovação em telemedicina</li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4 mt-4">
                <p className="text-blue-200 text-sm">
                  <strong>Importante:</strong> Para pesquisas e desenvolvimento, utilizamos 
                  apenas dados anonimizados ou pseudonimizados, garantindo que não seja 
                  possível identificar indivíduos específicos.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 3.3 Finalidades Legais */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">3.3 Finalidades Legais e Regulatórias</h3>
          
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Cumprimento de Obrigações Legais</h4>
            <p className="text-blue-200 mb-4">
              Utilização de dados para atender requisitos legais e regulatórios:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Regulamentações Sanitárias</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Registros médicos obrigatórios</li>
                  <li>• Relatórios para ANVISA</li>
                  <li>• Notificações de eventos adversos</li>
                  <li>• Auditorias sanitárias</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Obrigações Fiscais e Contábeis</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Emissão de notas fiscais</li>
                  <li>• Relatórios contábeis</li>
                  <li>• Declarações fiscais</li>
                  <li>• Auditorias financeiras</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 3.4 Limitações de Uso */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">3.4 Limitações e Restrições de Uso</h3>
          
          <div className="space-y-4">
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Princípio da Finalidade</h4>
              <p className="text-blue-200">
                Os dados coletados são utilizados exclusivamente para as finalidades 
                informadas nesta Política. Não realizamos tratamento para finalidades 
                incompatíveis ou não autorizadas.
              </p>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Princípio da Minimização</h4>
              <p className="text-blue-200">
                Coletamos e utilizamos apenas os dados estritamente necessários para 
                cada finalidade específica, evitando excesso de informações.
              </p>
            </div>
            
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Proteção de Dados Sensíveis</h4>
              <p className="text-blue-200">
                Dados de saúde recebem proteção especial e são utilizados apenas para 
                finalidades médicas legítimas, com acesso restrito a profissionais autorizados.
              </p>
            </div>
          </div>
        </div>
        
        {/* 3.5 Retenção de Dados */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">3.5 Período de Retenção</h3>
          
          <p className="text-blue-100 leading-relaxed mb-6">
            Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as 
            finalidades descritas nesta Política, respeitando prazos legais e regulatórios.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Dados de Conta</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• <strong>Conta ativa:</strong> Durante todo o período de uso</li>
                <li>• <strong>Conta inativa:</strong> 5 anos após último acesso</li>
                <li>• <strong>Exclusão solicitada:</strong> 30 dias após confirmação</li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Dados Médicos</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• <strong>Prontuário eletrônico:</strong> 20 anos (obrigatório)</li>
                <li>• <strong>Prescrições:</strong> 5 anos</li>
                <li>• <strong>Exames:</strong> 10 anos</li>
                <li>• <strong>Atestados:</strong> 5 anos</li>
              </ul>
            </div>
            
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Dados de Transação</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• <strong>Pagamentos:</strong> 10 anos (fiscal)</li>
                <li>• <strong>Faturas:</strong> 5 anos</li>
                <li>• <strong>Reembolsos:</strong> 5 anos</li>
              </ul>
            </div>
            
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Dados Técnicos</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• <strong>Logs de acesso:</strong> 2 anos</li>
                <li>• <strong>Cookies:</strong> Conforme política de cookies</li>
                <li>• <strong>Métricas:</strong> 3 anos (anonimizadas)</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6 mt-6">
            <h4 className="text-lg font-bold text-white mb-4">Exceções à Exclusão</h4>
            <p className="text-blue-200 mb-4">
              Em determinadas situações, podemos reter dados por períodos adicionais:
            </p>
            <ul className="space-y-2 text-blue-100">
              <li>• <strong>Obrigação legal:</strong> Quando exigido por lei ou regulamento</li>
              <li>• <strong>Investigção:</strong> Durante processos investigativos</li>
              <li>• <strong>Litígio:</strong> Enquanto houver disputas judiciais</li>
              <li>• <strong>Segurança:</strong> Para proteção contra fraudes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyUso; 