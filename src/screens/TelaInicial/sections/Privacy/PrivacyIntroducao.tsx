import React from "react";

const PrivacyIntroducao: React.FC = () => {
  return (
    <div id="introducao" className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">1. Introdução</h2>
      <div className="space-y-6 text-blue-100 leading-relaxed">
        <p>
          A Vitalis ("nós", "nossa", "nos", "nossos"), pessoa jurídica de direito privado, 
          inscrita no CNPJ sob o número [CNPJ], com sede na [ENDEREÇO COMPLETO], está 
          comprometida em proteger sua privacidade e garantir a segurança de suas informações 
          pessoais. Esta Política de Privacidade ("Política") estabelece as diretrizes e 
          procedimentos adotados pela Vitalis para coleta, uso, armazenamento, processamento, 
          compartilhamento e proteção de dados pessoais quando você utiliza nossos serviços 
          de telemedicina, plataforma digital e demais soluções oferecidas.
        </p>
        
        <p>
          Esta Política está em total conformidade com a Lei Geral de Proteção de Dados 
          (LGPD - Lei nº 13.709/2018), regulamentada pelo Decreto nº 10.474/2020, bem como 
          com o Marco Civil da Internet (Lei nº 12.965/2014), o Código de Defesa do 
          Consumidor (Lei nº 8.078/1990) e demais legislações aplicáveis de proteção de 
          dados e direitos digitais vigentes no Brasil.
        </p>
        
        <p>
          A Vitalis atua como Controladora dos dados pessoais coletados através de sua 
          plataforma, sendo responsável por todas as decisões referentes ao tratamento 
          dessas informações. Nos casos em que atuamos como Operadora, processando dados 
          em nome de terceiros, aplicamos rigorosos padrões de segurança e confidencialidade.
        </p>
        
        <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-bold text-white mb-4">Escopo de Aplicação</h4>
          <p className="text-blue-200 mb-4">
            Esta Política se aplica a todos os usuários da plataforma Vitalis, incluindo:
          </p>
          <ul className="space-y-2 text-blue-200">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Pacientes cadastrados na plataforma</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Profissionais de saúde credenciados</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Visitantes e usuários não cadastrados</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Representantes legais de menores de idade</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Funcionários e colaboradores da Vitalis</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-4">Princípios Fundamentais</h4>
          <p className="text-blue-200 mb-4">
            Nossa atuação é pautada pelos seguintes princípios fundamentais:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-bold text-white mb-2">Legalidade</h5>
              <p className="text-blue-200 text-sm">Tratamento baseado em fundamentos legais válidos</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Finalidade</h5>
              <p className="text-blue-200 text-sm">Coleta para propósitos específicos e legítimos</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Adequação</h5>
              <p className="text-blue-200 text-sm">Compatibilidade com as finalidades informadas</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Necessidade</h5>
              <p className="text-blue-200 text-sm">Limitação aos dados estritamente necessários</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Livre Acesso</h5>
              <p className="text-blue-200 text-sm">Facilidade na consulta sobre o tratamento</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Qualidade</h5>
              <p className="text-blue-200 text-sm">Garantia de exatidão e atualização dos dados</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Transparência</h5>
              <p className="text-blue-200 text-sm">Informações claras sobre o tratamento</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Segurança</h5>
              <p className="text-blue-200 text-sm">Proteção contra acessos não autorizados</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Não Discriminação</h5>
              <p className="text-blue-200 text-sm">Uso não discriminatório dos dados</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-2">Responsabilização</h5>
              <p className="text-blue-200 text-sm">Demonstração de conformidade com a LGPD</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-4 mt-6">
          <p className="text-blue-200 font-medium">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>
          <p className="text-blue-200 text-sm mt-2">
            <strong>Versão:</strong> 2.0 | <strong>Data de vigência:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyIntroducao; 