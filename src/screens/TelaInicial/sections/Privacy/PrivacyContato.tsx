import React from "react";

const PrivacyContato: React.FC = () => {
  return (
    <div id="contato" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">10. Contato e Suporte</h2>
      <div className="space-y-8">
        
        <p className="text-blue-100 leading-relaxed">
          A Vitalis está comprometida em fornecer suporte excepcional para todas as suas 
          dúvidas relacionadas à privacidade e proteção de dados. Esta seção apresenta 
          todos os canais de contato disponíveis e informações sobre nossa equipe 
          especializada em proteção de dados.
        </p>
        
        {/* 10.1 Encarregado de Proteção de Dados (DPO) */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">10.1 Encarregado de Proteção de Dados (DPO)</h3>
          
          <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Informações do DPO</h4>
            <p className="text-blue-200 mb-4">
              Nossa empresa possui um Encarregado de Proteção de Dados (DPO) designado 
              conforme exigido pela LGPD:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Dados do DPO</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>Nome:</strong> [Nome do DPO]</li>
                  <li>• <strong>Cargo:</strong> Encarregado de Proteção de Dados</li>
                  <li>• <strong>E-mail:</strong> dpo@vitalis.com.br</li>
                  <li>• <strong>Telefone:</strong> (11) 99999-9999</li>
                  <li>• <strong>WhatsApp:</strong> (11) 99999-9999</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Atribuições do DPO</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Orientar funcionários sobre práticas de proteção</li>
                  <li>• Receber comunicações de titulares de dados</li>
                  <li>• Orientar sobre medidas de segurança</li>
                  <li>• Interagir com a ANPD</li>
                  <li>• Realizar auditorias de compliance</li>
                </ul>
              </div>
            </div>
            <div className="bg-blue-600/30 border border-blue-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Importante:</strong> O DPO é independente e reporta diretamente 
                à alta administração da empresa, garantindo autonomia para exercer suas funções.
              </p>
            </div>
          </div>
        </div>
        
        {/* 10.2 Canais de Atendimento */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">10.2 Canais de Atendimento</h3>
          
          <div className="space-y-6">
            {/* Canais Digitais */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">10.2.1 Canais Digitais</h4>
              <p className="text-blue-200 mb-4">
                Disponibilizamos múltiplos canais digitais para facilitar o contato:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">E-mail e Chat</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>E-mail geral:</strong> redemedicadexecelenciavitalis@gmail.com</li>
                    <li>• <strong>E-mail DPO:</strong> dpo@vitalis.com.br</li>
                    <li>• <strong>Chat em tempo real:</strong> Disponível na plataforma</li>
                    <li>• <strong>Formulário online:</strong> Solicitações estruturadas</li>
                    <li>• <strong>Ticket de suporte:</strong> Acompanhamento de casos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Redes Sociais</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>WhatsApp:</strong> (11) 99999-9999</li>
                    <li>• <strong>Instagram:</strong> @vitalis_saude</li>
                    <li>• <strong>Facebook:</strong> /vitalissaude</li>
                    <li>• <strong>LinkedIn:</strong> /company/vitalis</li>
                    <li>• <strong>YouTube:</strong> /vitalissaude</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Canais Tradicionais */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">10.2.2 Canais Tradicionais</h4>
              <p className="text-blue-200 mb-4">
                Para casos que requerem atendimento mais personalizado:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Telefone e Presencial</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Telefone:</strong> (11) 99999-9999</li>
                    <li>• <strong>WhatsApp:</strong> (11) 99999-9999</li>
                    <li>• <strong>Endereço:</strong> [Endereço da empresa]</li>
                    <li>• <strong>Horário:</strong> Seg-Sex, 8h às 18h</li>
                    <li>• <strong>Agendamento:</strong> Visitas pré-agendadas</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Correio e Documentos</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Correio:</strong> [Endereço postal]</li>
                    <li>• <strong>Fax:</strong> (11) 99999-9999</li>
                    <li>• <strong>Documentos:</strong> Formulários físicos</li>
                    <li>• <strong>Protocolo:</strong> Sistema de rastreamento</li>
                    <li>• <strong>Confirmação:</strong> Recebimento documentado</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Canais Especializados */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">10.2.3 Canais Especializados</h4>
              <p className="text-blue-200 mb-4">
                Canais específicos para diferentes tipos de solicitações:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Suporte Técnico</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>E-mail técnico:</strong> suporte@vitalis.com.br</li>
                    <li>• <strong>Telefone técnico:</strong> (11) 99999-9999</li>
                    <li>• <strong>Chat técnico:</strong> Suporte especializado</li>
                    <li>• <strong>Base de conhecimento:</strong> FAQ e tutoriais</li>
                    <li>• <strong>Vídeos tutoriais:</strong> Canal no YouTube</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Ouvidoria</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>E-mail:</strong> ouvidoria@vitalis.com.br</li>
                    <li>• <strong>Telefone:</strong> (11) 99999-9999</li>
                    <li>• <strong>Formulário:</strong> Denúncias e reclamações</li>
                    <li>• <strong>Confidencialidade:</strong> Canal independente</li>
                    <li>• <strong>Prazo de resposta:</strong> Até 5 dias úteis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 10.3 Tipos de Solicitações */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">10.3 Tipos de Solicitações e Prazos</h3>
          
          <div className="space-y-6">
            {/* Solicitações de Direitos */}
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">10.3.1 Solicitações de Direitos LGPD</h4>
              <p className="text-blue-200 mb-4">
                Solicitações relacionadas aos direitos garantidos pela LGPD:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Tipos de Solicitações</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Acesso aos dados pessoais</li>
                    <li>• Correção de dados</li>
                    <li>• Anonimização ou eliminação</li>
                    <li>• Portabilidade de dados</li>
                    <li>• Revogação de consentimento</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Prazos de Resposta</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Resposta inicial:</strong> Até 15 dias úteis</li>
                    <li>• <strong>Prorrogação:</strong> Até 15 dias adicionais</li>
                    <li>• <strong>Urgência:</strong> Casos de saúde</li>
                    <li>• <strong>Complexidade:</strong> Análise técnica necessária</li>
                    <li>• <strong>Volume:</strong> Grandes quantidades de dados</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Dúvidas e Esclarecimentos */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">10.3.2 Dúvidas e Esclarecimentos</h4>
              <p className="text-blue-200 mb-4">
                Para esclarecimentos sobre nossa política de privacidade:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Tipos de Dúvidas</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Interpretação da política</li>
                    <li>• Como exercer direitos</li>
                    <li>• Medidas de segurança</li>
                    <li>• Compartilhamento de dados</li>
                    <li>• Cookies e tecnologias</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Prazos de Resposta</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Simples:</strong> Até 3 dias úteis</li>
                    <li>• <strong>Médias:</strong> Até 7 dias úteis</li>
                    <li>• <strong>Complexas:</strong> Até 15 dias úteis</li>
                    <li>• <strong>Urgentes:</strong> Até 24 horas</li>
                    <li>• <strong>Chat:</strong> Tempo real</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Denúncias e Violações */}
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">10.3.3 Denúncias e Violações</h4>
              <p className="text-blue-200 mb-4">
                Para reportar violações ou suspeitas de violação de privacidade:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Tipos de Denúncias</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Vazamento de dados</li>
                    <li>• Acesso não autorizado</li>
                    <li>• Uso inadequado de dados</li>
                    <li>• Falhas de segurança</li>
                    <li>• Violação de direitos</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Processo de Investigação</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• <strong>Recebimento:</strong> Imediato</li>
                    <li>• <strong>Análise inicial:</strong> Até 24 horas</li>
                    <li>• <strong>Investigação:</strong> Até 72 horas</li>
                    <li>• <strong>Resposta:</strong> Até 7 dias</li>
                    <li>• <strong>Medidas corretivas:</strong> Conforme necessário</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 10.4 Horários de Atendimento */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">10.4 Horários de Atendimento</h3>
          
          <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Disponibilidade dos Canais</h4>
            <p className="text-blue-200 mb-4">
              Nossos canais de atendimento possuem diferentes horários de disponibilidade:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Atendimento Regular</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>Segunda a Sexta:</strong> 8h às 18h</li>
                  <li>• <strong>Sábados:</strong> 8h às 12h</li>
                  <li>• <strong>Domingos:</strong> Fechado</li>
                  <li>• <strong>Feriados:</strong> Fechado</li>
                  <li>• <strong>Fuso horário:</strong> Brasília (GMT-3)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Atendimento 24/7</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>Chat automatizado:</strong> Sempre disponível</li>
                  <li>• <strong>E-mail:</strong> Resposta em até 24h</li>
                  <li>• <strong>Formulários:</strong> Envio a qualquer hora</li>
                  <li>• <strong>Urgências médicas:</strong> Plantão 24h</li>
                  <li>• <strong>Incidentes críticos:</strong> Resposta imediata</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-600/30 border border-green-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Observação:</strong> Em casos de urgência médica ou incidentes 
                críticos de segurança, o atendimento está disponível 24 horas por dia.
              </p>
            </div>
          </div>
        </div>
        
        {/* 10.5 Equipe de Suporte */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">10.5 Nossa Equipe de Suporte</h3>
          
          <div className="space-y-6">
            {/* Perfil da Equipe */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">10.5.1 Perfil da Equipe</h4>
              <p className="text-blue-200 mb-4">
                Nossa equipe de suporte é especializada em proteção de dados e privacidade:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-white mb-3">Qualificações</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Especialistas em LGPD</li>
                    <li>• Certificações em segurança</li>
                    <li>• Experiência em saúde digital</li>
                    <li>• Treinamento contínuo</li>
                    <li>• Conhecimento técnico</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-3">Atribuições</h5>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• Atendimento ao usuário</li>
                    <li>• Análise de solicitações</li>
                    <li>• Investigação de incidentes</li>
                    <li>• Implementação de melhorias</li>
                    <li>• Treinamento interno</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Processo de Atendimento */}
            <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">10.5.2 Processo de Atendimento</h4>
              <p className="text-blue-200 mb-4">
                Processo estruturado para garantir atendimento eficiente e de qualidade:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Recebimento</h5>
                    <p className="text-blue-100 text-sm">
                      Recebimento e registro da solicitação com número de protocolo
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Classificação</h5>
                    <p className="text-blue-100 text-sm">
                      Análise e classificação da solicitação por tipo e urgência
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Atendimento</h5>
                    <p className="text-blue-100 text-sm">
                      Atendimento especializado por equipe qualificada
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Resolução</h5>
                    <p className="text-blue-100 text-sm">
                      Implementação da solução e comunicação ao usuário
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2">Acompanhamento</h5>
                    <p className="text-blue-100 text-sm">
                      Acompanhamento e feedback para garantir satisfação
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 10.6 Recursos Adicionais */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">10.6 Recursos e Materiais de Apoio</h3>
          
          <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Materiais Disponíveis</h4>
            <p className="text-blue-200 mb-4">
              Disponibilizamos diversos recursos para facilitar o entendimento sobre privacidade:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Documentação</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>FAQ:</strong> Perguntas frequentes</li>
                  <li>• <strong>Guias:</strong> Passo a passo</li>
                  <li>• <strong>Manuais:</strong> Documentação técnica</li>
                  <li>• <strong>Políticas:</strong> Documentos oficiais</li>
                  <li>• <strong>Relatórios:</strong> Transparência</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Conteúdo Multimídia</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>Vídeos:</strong> Explicativos e tutoriais</li>
                  <li>• <strong>Webinars:</strong> Palestras online</li>
                  <li>• <strong>Podcasts:</strong> Conversas sobre privacidade</li>
                  <li>• <strong>Infográficos:</strong> Informações visuais</li>
                  <li>• <strong>E-books:</strong> Materiais educativos</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-600/30 border border-yellow-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Acesso:</strong> Todos os materiais estão disponíveis gratuitamente 
                em nossa plataforma e podem ser acessados a qualquer momento.
              </p>
            </div>
          </div>
        </div>
        
        {/* 10.7 Compromisso de Qualidade */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">10.7 Compromisso de Qualidade</h3>
          
          <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-white mb-4">Nossa Promessa</h4>
            <p className="text-blue-200 mb-4">
              Comprometemo-nos a fornecer o melhor atendimento possível:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Padrões de Qualidade</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Resposta rápida e eficiente</li>
                  <li>• Linguagem clara e acessível</li>
                  <li>• Soluções personalizadas</li>
                  <li>• Acompanhamento completo</li>
                  <li>• Melhoria contínua</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Indicadores</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• <strong>Tempo de resposta:</strong> &lt; 24h</li>
                  <li>• <strong>Satisfação:</strong> &gt; 95%</li>
                  <li>• <strong>Resolução:</strong> &gt; 90%</li>
                  <li>• <strong>Disponibilidade:</strong> 99.9%</li>
                  <li>• <strong>Qualificação:</strong> 100% treinados</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-600/30 border border-green-400/50 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Feedback:</strong> Valorizamos seu feedback para continuar 
                melhorando nossos serviços e atendimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyContato; 