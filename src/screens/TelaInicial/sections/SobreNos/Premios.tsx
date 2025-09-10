import React from "react";

const Premios: React.FC = () => {
  const premios = [
    {
      ano: "2º Semestre 2025",
      titulo: "Prêmio Inovação em Saúde",
      organizacao: "Associação Brasileira de Startups",
      desc: "Reconhecimento nacional pela abordagem inovadora em telemedicina e democratização do acesso à saúde",
      categoria: "Inovação",
      icon: "🏆",
      status: "Em Breve",
      detalhes: [
        "Primeira startup de telemedicina premiada",
        "Reconhecimento por impacto social",
        "Validação do modelo de negócio"
      ]
    },
    {
      ano: "2º Semestre 2025",
      titulo: "Top Startup Saúde",
      organizacao: "Revista Exame",
      desc: "Vitalis entre as startups mais promissoras do setor de saúde no Brasil",
      categoria: "Startup",
      icon: "⭐",
      status: "Em Breve",
      detalhes: [
        "Seleção entre 500+ startups",
        "Criteriosa avaliação de especialistas",
        "Reconhecimento de mercado"
      ]
    },
    {
      ano: "2º Semestre 2025",
      titulo: "Selo Excelência",
      organizacao: "Instituto Nacional de Qualidade",
      desc: "Destaque em satisfação dos usuários e qualidade do serviço prestado",
      categoria: "Qualidade",
      icon: "🏅",
      status: "Em Breve",
      detalhes: [
        "98% de satisfação dos usuários",
        "Processos certificados",
        "Qualidade reconhecida"
      ]
    },
    {
      ano: "2º Semestre 2025",
      titulo: "Prêmio Tecnologia Social",
      organizacao: "Fundação Banco do Brasil",
      desc: "Reconhecimento por soluções tecnológicas que promovem inclusão social",
      categoria: "Social",
      icon: "🌱",
      status: "Em Breve",
      detalhes: [
        "Impacto social mensurável",
        "Tecnologia acessível",
        "Inclusão digital"
      ]
    },
    {
      ano: "2º Semestre 2025",
      titulo: "Melhor App de Saúde",
      organizacao: "Google Play Awards",
      desc: "Aplicativo reconhecido como o melhor na categoria saúde e bem-estar",
      categoria: "Tecnologia",
      icon: "📱",
      status: "Em Breve",
      detalhes: [
        "Melhor experiência do usuário",
        "Inovação em interface",
        "Funcionalidades avançadas"
      ]
    },
    {
      ano: "2º Semestre 2025",
      titulo: "Prêmio Sustentabilidade",
      organizacao: "Instituto Ethos",
      desc: "Reconhecimento por práticas sustentáveis e redução de impacto ambiental",
      categoria: "Sustentabilidade",
      icon: "🌍",
      status: "Em Breve",
      detalhes: [
        "Redução de emissões de CO2",
        "Práticas eco-friendly",
        "Responsabilidade ambiental"
      ]
    }
  ];

  const certificacoes = [
    {
      titulo: "ISO 27001",
      desc: "Certificação de Segurança da Informação",
      ano: "2º Semestre 2025",
      status: "Em Processo"
    },
    {
      titulo: "LGPD",
      desc: "Conformidade com Lei Geral de Proteção de Dados",
      ano: "2º Semestre 2025",
      status: "Em Processo"
    },
    {
      titulo: "ANVISA",
      desc: "Registro de Software como Dispositivo Médico",
      ano: "2º Semestre 2025",
      status: "Em Processo"
    },
    {
      titulo: "CFM",
      desc: "Aprovação do Conselho Federal de Medicina",
      ano: "2º Semestre 2025",
      status: "Em Processo"
    }
  ];

  const reconhecimentos = [
    {
      titulo: "Empresa do Ano",
      organizacao: "Câmara de Comércio",
      ano: "2º Semestre 2025",
      desc: "Reconhecimento por crescimento e impacto na comunidade",
      status: "Em Breve"
    },
    {
      titulo: "Líder em Inovação",
      organizacao: "Fórum Econômico Mundial",
      ano: "2º Semestre 2025",
      desc: "Destaque em inovação tecnológica para saúde",
      status: "Em Breve"
    },
    {
      titulo: "Melhor Lugar para Trabalhar",
      organizacao: "Great Place to Work",
      ano: "2º Semestre 2025",
      desc: "Certificação de excelente ambiente de trabalho",
      status: "Em Breve"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 relative overflow-hidden">
      {/* Background animado */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-0 w-full h-32">
          <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 T900,50 T1000,50 T1100,50 T1200,50"
              stroke="#60A5FA"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-blue-300/30 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <a href="/sobre" className="text-white hover:text-blue-200 font-medium">
                ← Voltar para Sobre Nós
              </a>
              <h1 className="text-2xl font-bold text-white">Prêmios e Reconhecimentos</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Prêmios e Reconhecimentos
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Como projeto acadêmico inovador, estamos trabalhando para conquistar 
              reconhecimentos que validem nosso trabalho e impacto na transformação da saúde digital.
            </p>
            
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">6</div>
                <div className="text-blue-200 text-sm">Prêmios Almejados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">4</div>
                <div className="text-blue-200 text-sm">Certificações</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">3</div>
                <div className="text-blue-200 text-sm">Reconhecimentos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">2º/2025</div>
                <div className="text-blue-200 text-sm">Previsão</div>
              </div>
            </div>
          </div>
        </section>

        {/* Prêmios Principais */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Prêmios Almejados</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Reconhecimentos que buscamos conquistar para validar nosso trabalho e impacto
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {premios.map((premio, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-3xl">{premio.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-blue-200">{premio.ano}</span>
                        <span className="bg-yellow-600/50 text-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
                          {premio.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{premio.titulo}</h3>
                      <p className="text-blue-200 text-sm mb-2">{premio.organizacao}</p>
                    </div>
                  </div>
                  
                  <p className="text-blue-100 mb-4 leading-relaxed">{premio.desc}</p>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Objetivos:</h4>
                    <ul className="space-y-1">
                      {premio.detalhes.map((detalhe, detIndex) => (
                        <li key={detIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          <span className="text-blue-100 text-sm">{detalhe}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certificações */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Certificações em Andamento</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Padrões de qualidade e segurança que estamos buscando para garantir a excelência dos nossos serviços
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificacoes.map((cert, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                  <h3 className="text-lg font-bold text-white mb-2">{cert.titulo}</h3>
                  <p className="text-blue-100 text-sm mb-3">{cert.desc}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-200">{cert.ano}</span>
                    <span className="bg-yellow-600/50 text-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
                      {cert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reconhecimentos */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Outros Reconhecimentos</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Destaques adicionais que buscamos para reforçar nossa posição no mercado
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {reconhecimentos.map((reconhecimento, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{reconhecimento.titulo}</h3>
                  <p className="text-blue-200 text-sm mb-3">{reconhecimento.organizacao}</p>
                  <p className="text-blue-100 text-sm mb-4">{reconhecimento.desc}</p>
                  <div className="space-y-2">
                    <span className="text-2xl font-bold text-blue-200">{reconhecimento.ano}</span>
                    <div className="bg-yellow-600/50 text-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
                      {reconhecimento.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projeto Acadêmico */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Projeto Acadêmico Inovador</h2>
                <p className="text-xl text-blue-100">
                  A Vitalis nasceu como um projeto de faculdade com o objetivo de transformar a saúde digital
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Nossa Origem</h3>
                  <p className="text-blue-100 leading-relaxed mb-4">
                    Como projeto acadêmico, desenvolvemos uma solução completa de telemedicina 
                    que demonstra o potencial da tecnologia para democratizar o acesso à saúde.
                  </p>
                  <p className="text-blue-100 leading-relaxed">
                    Nossa abordagem inovadora e foco no impacto social nos posicionam como 
                    candidatos fortes para diversos prêmios e reconhecimentos no setor.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Objetivos do Projeto</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">Demonstrar inovação em saúde digital</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">Buscar reconhecimento acadêmico e de mercado</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">Validar o modelo de negócio</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">Preparar para o mercado real</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Próximos Objetivos */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Próximos Objetivos</h2>
                <p className="text-xl text-blue-100">
                  Reconhecimentos que buscamos conquistar no segundo semestre de 2025
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl mb-3">🌍</div>
                  <h3 className="text-lg font-bold text-white mb-2">Prêmio Internacional</h3>
                  <p className="text-blue-100 text-sm">Reconhecimento global por inovação em saúde</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="text-lg font-bold text-white mb-2">Validação de Mercado</h3>
                  <p className="text-blue-100 text-sm">Comprovação do potencial comercial</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-3">🏛️</div>
                  <h3 className="text-lg font-bold text-white mb-2">Reconhecimento Acadêmico</h3>
                  <p className="text-blue-100 text-sm">Destaque em feiras e congressos</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Premios; 