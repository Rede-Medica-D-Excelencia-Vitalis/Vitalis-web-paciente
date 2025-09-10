import React from "react";

const PrivacyColeta: React.FC = () => {
  return (
    <div id="coleta" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">2. Coleta de Dados</h2>
      <div className="space-y-8">
        
        {/* 2.1 Dados que Coletamos */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">2.1 Dados que Coletamos</h3>
          <p className="text-blue-100 leading-relaxed mb-6">
            A Vitalis coleta diferentes categorias de dados pessoais, sempre observando o 
            princípio da minimização e a necessidade específica para cada finalidade. 
            A coleta é realizada de forma transparente, com base legal adequada e 
            consentimento quando necessário.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Dados Pessoais */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">Dados Pessoais Identificadores</h4>
              <p className="text-blue-200 mb-4">
                Informações que permitem sua identificação direta ou indireta:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Nome completo</strong> - Nome civil completo conforme documentos oficiais
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Documentos de identificação</strong> - CPF, RG, CNH, passaporte ou outros documentos válidos
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Data de nascimento</strong> - Para verificação de idade e cálculos médicos
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Gênero</strong> - Para personalização de atendimento e análises epidemiológicas
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Nacionalidade</strong> - Para conformidade com requisitos legais
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Dados de Contato */}
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-xl font-bold text-white mb-4">Dados de Contato e Localização</h4>
              <p className="text-blue-200 mb-4">
                Informações necessárias para comunicação e prestação de serviços:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Endereço de e-mail</strong> - Para comunicações oficiais e recuperação de conta
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Número de telefone</strong> - Para contatos de emergência e confirmações
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Endereço residencial</strong> - Para emissão de documentos e conformidade legal
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>CEP e cidade</strong> - Para análises geográficas e disponibilidade de serviços
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Coordenadas geográficas</strong> - Apenas quando necessário para serviços de emergência
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Dados de Saúde */}
          <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6 mt-6">
            <h4 className="text-xl font-bold text-white mb-4">Dados Sensíveis - Informações de Saúde</h4>
            <p className="text-blue-200 mb-4">
              <strong>ATENÇÃO:</strong> Estes dados são considerados sensíveis pela LGPD e recebem proteção especial:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-white mb-3">Histórico Médico</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Doenças prévias e condições crônicas</li>
                  <li>• Cirurgias realizadas e datas</li>
                  <li>• Alergias e intolerâncias</li>
                  <li>• Medicamentos em uso contínuo</li>
                  <li>• Histórico familiar de doenças</li>
                  <li>• Resultados de exames laboratoriais</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-3">Dados de Consultas</h5>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Sintomas relatados</li>
                  <li>• Diagnósticos médicos</li>
                  <li>• Prescrições e tratamentos</li>
                  <li>• Evolução clínica</li>
                  <li>• Imagens médicas (quando aplicável)</li>
                  <li>• Notas e observações médicas</li>
                </ul>
              </div>
            </div>
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4 mt-4">
              <p className="text-blue-200 text-sm">
                <strong>Proteção Especial:</strong> Todos os dados de saúde são criptografados, 
                armazenados em ambientes seguros e acessíveis apenas por profissionais autorizados 
                e com necessidade específica de acesso.
              </p>
            </div>
          </div>
          
          {/* Dados Técnicos */}
          <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6 mt-6">
            <h4 className="text-xl font-bold text-white mb-4">Dados Técnicos e de Uso</h4>
            <p className="text-blue-200 mb-4">
              Informações coletadas automaticamente durante o uso da plataforma:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-bold text-white mb-2">Identificadores de Dispositivo</h5>
                <ul className="space-y-1 text-blue-100 text-sm">
                  <li>• Endereço IP</li>
                  <li>• User Agent</li>
                  <li>• Identificadores únicos</li>
                  <li>• Tipo de dispositivo</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-2">Dados de Navegação</h5>
                <ul className="space-y-1 text-blue-100 text-sm">
                  <li>• Páginas visitadas</li>
                  <li>• Tempo de permanência</li>
                  <li>• Clicks e interações</li>
                  <li>• Fluxo de navegação</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-white mb-2">Dados de Performance</h5>
                <ul className="space-y-1 text-blue-100 text-sm">
                  <li>• Logs de erro</li>
                  <li>• Métricas de performance</li>
                  <li>• Dados de conectividade</li>
                  <li>• Informações de sessão</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 2.2 Como Coletamos */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">2.2 Métodos de Coleta</h3>
          <p className="text-blue-100 leading-relaxed mb-6">
            A coleta de dados é realizada através de diferentes métodos, sempre de forma 
            transparente e com base legal adequada. Cada método possui finalidades específicas 
            e medidas de segurança apropriadas.
          </p>
          
          <div className="space-y-6">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Coleta Direta (Fornecimento Voluntário)</h4>
              <p className="text-blue-200 mb-4">
                Dados fornecidos diretamente por você durante o uso da plataforma:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Cadastro na plataforma</strong> - Durante o processo de criação de conta, 
                    solicitamos informações essenciais para identificação e contato
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Preenchimento de formulários</strong> - Questionários médicos, 
                    triagem online e formulários de avaliação
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Comunicação direta</strong> - Mensagens, e-mails e conversas 
                    com nossa equipe de suporte
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Upload de documentos</strong> - Envio de exames, prescrições 
                    e outros documentos médicos
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Coleta Automática (Tecnologias Passivas)</h4>
              <p className="text-blue-200 mb-4">
                Dados coletados automaticamente através de tecnologias e sistemas:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Cookies e tecnologias similares</strong> - Para melhorar a experiência, 
                    analisar o uso e personalizar conteúdo
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Logs de sistema</strong> - Registros automáticos de acesso, 
                    erros e atividades na plataforma
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Dados de localização</strong> - Apenas quando necessário para 
                    serviços de emergência ou com consentimento explícito
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Métricas de uso</strong> - Análise de comportamento e 
                    otimização da plataforma
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Coleta de Terceiros (Fontes Externas)</h4>
              <p className="text-blue-200 mb-4">
                Dados obtidos de fontes externas, sempre com base legal adequada:
              </p>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Parceiros de saúde</strong> - Hospitais, laboratórios e 
                    clínicas credenciadas (com seu consentimento)
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Provedores de serviços</strong> - Empresas de pagamento, 
                    análise de crédito e verificação de identidade
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Autoridades públicas</strong> - Quando exigido por lei ou 
                    ordem judicial
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Redes sociais</strong> - Apenas quando você opta por 
                    fazer login através dessas plataformas
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 2.3 Base Legal */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">2.3 Base Legal para Coleta</h3>
          <p className="text-blue-100 leading-relaxed mb-6">
            Toda coleta de dados pessoais possui fundamentação legal específica, conforme 
            estabelecido pela LGPD. A base legal varia conforme a categoria de dados e 
            finalidade do tratamento.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Consentimento</h4>
              <p className="text-blue-200 text-sm mb-3">
                Autorização livre, informada e inequívoca para o tratamento de dados:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Marketing e comunicações promocionais</li>
                <li>• Compartilhamento com parceiros comerciais</li>
                <li>• Uso de cookies não essenciais</li>
                <li>• Pesquisas e estudos (quando não anonimizados)</li>
              </ul>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Execução de Contrato</h4>
              <p className="text-blue-200 text-sm mb-3">
                Dados necessários para cumprimento de obrigações contratuais:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Prestação de serviços de telemedicina</li>
                <li>• Processamento de pagamentos</li>
                <li>• Emissão de documentos médicos</li>
                <li>• Cumprimento de obrigações legais</li>
              </ul>
            </div>
            
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Interesse Legítimo</h4>
              <p className="text-blue-200 text-sm mb-3">
                Tratamento necessário para interesses legítimos da Vitalis:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Melhoria da plataforma e serviços</li>
                <li>• Prevenção de fraudes e segurança</li>
                <li>• Análise de uso e performance</li>
                <li>• Comunicações de serviço essenciais</li>
              </ul>
            </div>
            
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Obrigação Legal</h4>
              <p className="text-blue-200 text-sm mb-3">
                Dados exigidos por legislação aplicável:
              </p>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>• Registros médicos obrigatórios</li>
                <li>• Relatórios para autoridades sanitárias</li>
                <li>• Cumprimento de ordens judiciais</li>
                <li>• Prevenção de crimes e investigações</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyColeta; 