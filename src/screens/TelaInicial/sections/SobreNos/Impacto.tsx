import React from "react";

const Impacto: React.FC = () => {
  const metricas = [
    { valor: "50k+", label: "Atendimentos Realizados", desc: "Consultas médicas realizadas com sucesso" },
    { valor: "30+", label: "Especialidades Médicas", desc: "Áreas de especialização disponíveis" },
    { valor: "98%", label: "Satisfação dos Usuários", desc: "Avaliação média dos pacientes" },
    { valor: "10k+", label: "Profissionais Cadastrados", desc: "Médicos e especialistas ativos" },
    { valor: "95%", label: "Redução no Tempo de Espera", desc: "Comparado ao sistema tradicional" },
    { valor: "24/7", label: "Disponibilidade", desc: "Atendimento ininterrupto" }
  ];

  const areasImpacto = [
    {
      titulo: "Acesso à Saúde",
      desc: "Democratizando o acesso à saúde de qualidade para todos os brasileiros",
      icon: "🏥",
      beneficios: [
        "Consultas acessíveis em qualquer lugar",
        "Redução de barreiras geográficas",
        "Atendimento para populações rurais",
        "Cuidado preventivo facilitado"
      ]
    },
    {
      titulo: "Sustentabilidade",
      desc: "Reduzindo deslocamentos e promovendo práticas sustentáveis",
      icon: "🌍",
      beneficios: [
        "Menos emissões de CO2",
        "Redução do tráfego urbano",
        "Economia de recursos",
        "Práticas eco-friendly"
      ]
    },
    {
      titulo: "Inovação Tecnológica",
      desc: "Desenvolvendo tecnologias que revolucionam o cuidado médico",
      icon: "💡",
      beneficios: [
        "Inteligência artificial aplicada",
        "Telemedicina avançada",
        "Análise preditiva de saúde",
        "Integração de dados segura"
      ]
    }
  ];

  const historiasSucesso = [
    {
      nome: "Maria Silva",
      local: "Interior de São Paulo",
      historia: "Conseguiu atendimento especializado sem precisar viajar 3 horas até a capital",
      resultado: "Diagnóstico precoce e tratamento eficaz"
    },
    {
      nome: "João Santos",
      local: "Zona Rural - Minas Gerais",
      historia: "Acesso a cardiologista pela primeira vez em 5 anos",
      resultado: "Controle adequado da pressão arterial"
    },
    {
      nome: "Ana Costa",
      local: "Periferia de Brasília",
      historia: "Consulta pediátrica para seu filho em horário flexível",
      resultado: "Acompanhamento contínuo e desenvolvimento saudável"
    }
  ];

  const compromissos = [
    {
      titulo: "Inclusão Digital",
      desc: "Trabalhamos para reduzir a exclusão digital e tornar a tecnologia acessível a todos",
      icon: "📱"
    },
    {
      titulo: "Qualidade de Vida",
      desc: "Melhoramos a qualidade de vida das pessoas através de cuidados preventivos",
      icon: "❤️"
    },
    {
      titulo: "Educação em Saúde",
      desc: "Promovemos educação e conscientização sobre saúde e bem-estar",
      icon: "📚"
    }
  ];

  const linhaTempo = [
    { ano: "2023", evento: "Lançamento da plataforma Vitalis e primeiros atendimentos online." },
    { ano: "2024", evento: "Expansão para 15 estados, integração com wearables e início de projetos sociais." },
    { ano: "2025", evento: "Meta de 100k atendimentos mensais, cobertura nacional e prêmios de inovação." },
  ];

  const projetosSociais = [
    { titulo: "Campanha Saúde para Todos", desc: "Mutirões de atendimento gratuito em comunidades carentes.", icon: "🤝" },
    { titulo: "Educação em Saúde Digital", desc: "Workshops e lives sobre prevenção e autocuidado.", icon: "🎓" },
    { titulo: "Conexão Rural", desc: "Telemedicina para áreas remotas e populações indígenas.", icon: "🌱" },
  ];

  const indicadoresAmbientais = [
    { valor: "+1.2M kg", label: "CO₂ evitado", desc: "Redução de emissões por teleatendimento" },
    { valor: "+500k", label: "Deslocamentos evitados", desc: "Viagens poupadas por consultas online" },
    { valor: "+2.5M L", label: "Água economizada", desc: "Uso eficiente de recursos em operações" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 relative overflow-hidden">
      {/* Background animado */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute bottom-40 left-0 w-full h-32">
          <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 T900,50 T1000,50 T1100,50 T1200,50"
              stroke="#10B981"
              strokeWidth="2.5"
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
              <h1 className="text-2xl font-bold text-white">Nosso Impacto</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Transformando Vidas
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Através da tecnologia e inovação, estamos criando um impacto real e 
              mensurável na saúde dos brasileiros.
            </p>
          </div>
        </section>

        {/* Métricas Principais */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossos Números</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Resultados que demonstram nosso compromisso com a transformação da saúde
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {metricas.map((metrica, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{metrica.valor}</div>
                  <div className="text-blue-200 font-medium mb-2">{metrica.label}</div>
                  <div className="text-blue-100 text-sm">{metrica.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Áreas de Impacto */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Áreas de Impacto</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Como estamos transformando diferentes aspectos da saúde no Brasil
              </p>
            </div>

            <div className="space-y-12">
              {areasImpacto.map((area, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-start space-x-6">
                    <div className="text-4xl">{area.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">{area.titulo}</h3>
                      <p className="text-blue-100 mb-6 leading-relaxed">{area.desc}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {area.beneficios.map((beneficio, benIndex) => (
                          <div key={benIndex} className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                            <span className="text-blue-100">{beneficio}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Histórias de Sucesso */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Histórias de Sucesso</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Pessoas reais que tiveram suas vidas transformadas pela Vitalis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {historiasSucesso.map((historia, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{historia.nome}</h3>
                    <p className="text-blue-200 text-sm">{historia.local}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">Desafio:</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">{historia.historia}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Resultado:</h4>
                    <p className="text-green-300 text-sm font-medium">{historia.resultado}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compromissos Sociais */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Compromissos Sociais</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Nossa responsabilidade vai além da tecnologia
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {compromissos.map((compromisso, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <div className="text-4xl mb-4">{compromisso.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{compromisso.titulo}</h3>
                  <p className="text-blue-100 leading-relaxed">{compromisso.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Próximos Passos */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Próximos Passos</h2>
                <p className="text-xl text-blue-100">
                  Nossa visão para o futuro da saúde no Brasil
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Metas para 2025</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">100k atendimentos mensais</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">Cobertura em todos os estados</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">50+ especialidades médicas</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Inovações Planejadas</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">IA para diagnóstico precoce</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">Integração com wearables</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100">Telemedicina em realidade virtual</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Linha do Tempo do Impacto */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-800/60 to-green-700/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Linha do Tempo do Impacto</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Nossa jornada de transformação e crescimento
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {linhaTempo.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center flex-1 min-w-[220px]">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{item.ano}</div>
                  <div className="text-blue-100">{item.evento}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projetos Sociais */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-l from-green-700/60 to-blue-800/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Projetos Sociais</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Iniciativas que ampliam nosso impacto social
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {projetosSociais.map((proj, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <div className="text-4xl mb-4">{proj.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{proj.titulo}</h3>
                  <p className="text-blue-100 leading-relaxed">{proj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Indicadores Ambientais */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-800/60 to-green-700/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Impacto Ambiental</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Sustentabilidade também faz parte da nossa missão
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {indicadoresAmbientais.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-green-300 mb-2">{item.valor}</div>
                  <div className="text-blue-200 font-medium mb-2">{item.label}</div>
                  <div className="text-blue-100 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Impacto; 