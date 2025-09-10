import React from "react";

const MissaoValores: React.FC = () => {
  const valores = [
    {
      icon: "❤️",
      title: "Empatia",
      description: "Cuidamos de pessoas, não apenas de sintomas",
      details: [
        "Colocamos o paciente no centro de tudo",
        "Entendemos as necessidades individuais",
        "Criamos experiências humanizadas",
        "Valorizamos a conexão emocional"
      ],
      exemplos: [
        "Atendimento personalizado 24/7",
        "Suporte emocional durante consultas",
        "Acompanhamento contínuo do paciente",
        "Comunicação clara e acolhedora"
      ]
    },
    {
      icon: "🔍",
      title: "Transparência",
      description: "Clareza e honestidade em cada etapa",
      details: [
        "Comunicação clara e objetiva",
        "Processos transparentes",
        "Preços sem surpresas",
        "Informações acessíveis"
      ],
      exemplos: [
        "Preços fixos e sem taxas ocultas",
        "Histórico médico completo",
        "Relatórios detalhados de exames",
        "Política de privacidade clara"
      ]
    },
    {
      icon: "🚀",
      title: "Inovação",
      description: "Tecnologia a serviço da saúde",
      details: [
        "Sempre buscamos novas soluções",
        "Investimos em tecnologia de ponta",
        "Melhoramos continuamente",
        "Antecipamos tendências"
      ],
      exemplos: [
        "IA para diagnóstico auxiliar",
        "Telemedicina com realidade virtual",
        "Monitoramento IoT em tempo real",
        "Blockchain para segurança de dados"
      ]
    },
    {
      icon: "🤝",
      title: "Colaboração",
      description: "Juntos, vamos mais longe",
      details: [
        "Trabalho em equipe",
        "Parcerias estratégicas",
        "Compartilhamento de conhecimento",
        "Construção coletiva"
      ],
      exemplos: [
        "Rede de profissionais credenciados",
        "Parcerias com hospitais e clínicas",
        "Comunidade de pacientes ativa",
        "Colaboração com universidades"
      ]
    },
    {
      icon: "💪",
      title: "Persistência",
      description: "Superamos desafios todos os dias",
      details: [
        "Não desistimos diante das dificuldades",
        "Aprendemos com os erros",
        "Mantemos o foco nos objetivos",
        "Crescemos com os desafios"
      ],
      exemplos: [
        "Superação de barreiras tecnológicas",
        "Adaptação às mudanças regulatórias",
        "Expansão contínua da cobertura",
        "Melhoria constante da plataforma"
      ]
    },
    {
      icon: "🌟",
      title: "Excelência",
      description: "Buscamos a melhor qualidade em tudo",
      details: [
        "Padrões elevados de qualidade",
        "Melhoria contínua",
        "Detalhes fazem a diferença",
        "Superamos expectativas"
      ],
      exemplos: [
        "Certificações internacionais",
        "Processos otimizados",
        "Feedback contínuo dos usuários",
        "Benchmarking com líderes globais"
      ]
    }
  ];

  const principios = [
    {
      title: "Acesso Universal",
      description: "Acreditamos que saúde de qualidade deve estar ao alcance de todos, independentemente de localização ou condição financeira.",
      icon: "🌍",
      impacto: "Democratização da saúde para milhões de brasileiros",
      metricas: ["Cobertura nacional", "Preços acessíveis", "Inclusão digital"]
    },
    {
      title: "Tecnologia Humanizada",
      description: "Utilizamos tecnologia avançada para criar experiências mais humanas e conectadas entre pacientes e profissionais.",
      icon: "🤖",
      impacto: "Experiências digitais que preservam o toque humano",
      metricas: ["IA empática", "Interface intuitiva", "Conectividade"]
    },
    {
      title: "Cuidado Integral",
      description: "Vamos além do tratamento de sintomas, focando na saúde completa e bem-estar das pessoas.",
      icon: "🏥",
      impacto: "Abordagem holística da saúde e bem-estar",
      metricas: ["Prevenção", "Tratamento", "Acompanhamento"]
    }
  ];

  const estatisticas = [
    { valor: "100%", label: "Comprometimento com a Missão" },
    { valor: "24/7", label: "Disponibilidade de Atendimento" },
    { valor: "6", label: "Valores Fundamentais" },
    { valor: "3", label: "Princípios Norteadores" },
    { valor: "50+", label: "Parcerias Estratégicas" },
    { valor: "10k+", label: "Vidas Impactadas" }
  ];

  const diferenciais = [
    {
      titulo: "Tecnologia de Ponta",
      descricao: "Utilizamos as mais avançadas tecnologias para criar experiências únicas",
      recursos: ["IA e Machine Learning", "Realidade Virtual", "IoT e Wearables", "Blockchain"],
      icon: "💻"
    },
    {
      titulo: "Humanização Digital",
      descricao: "Combinamos tecnologia com toque humano para experiências autênticas",
      recursos: ["Atendimento personalizado", "Suporte emocional", "Comunicação clara", "Acompanhamento contínuo"],
      icon: "🤗"
    },
    {
      titulo: "Acessibilidade Total",
      descricao: "Garantimos que nossa plataforma seja acessível para todos",
      recursos: ["Design inclusivo", "Suporte a PCDs", "Múltiplos idiomas", "Interface adaptativa"],
      icon: "♿"
    },
    {
      titulo: "Segurança Máxima",
      descricao: "Protegemos os dados dos usuários com os mais altos padrões",
      recursos: ["Criptografia avançada", "LGPD compliance", "Auditoria contínua", "Backup redundante"],
      icon: "🔒"
    }
  ];

  const impactoSocial = [
    {
      categoria: "Saúde Preventiva",
      descricao: "Promovemos hábitos saudáveis e prevenção de doenças",
      metricas: ["Redução de 30% em consultas de emergência", "Aumento de 50% em exames preventivos"],
      icon: "🩺"
    },
    {
      categoria: "Inclusão Digital",
      descricao: "Democratizamos o acesso à tecnologia em saúde",
      metricas: ["80% dos usuários em áreas remotas", "95% de satisfação com acessibilidade"],
      icon: "📱"
    },
    {
      categoria: "Sustentabilidade",
      descricao: "Reduzimos o impacto ambiental da saúde",
      metricas: ["Redução de 60% em deslocamentos", "Economia de 40% em recursos médicos"],
      icon: "🌱"
    }
  ];

  const compromissos = {
    pacientes: [
      "Atendimento humanizado e acolhedor",
      "Segurança e privacidade dos dados",
      "Qualidade no atendimento médico",
      "Acessibilidade e inclusão",
      "Transparência total nos processos",
      "Suporte emocional contínuo",
      "Personalização do cuidado",
      "Feedback e melhoria contínua"
    ],
    sociedade: [
      "Democratização do acesso à saúde",
      "Inovação responsável",
      "Impacto social positivo",
      "Sustentabilidade ambiental",
      "Educação em saúde",
      "Pesquisa e desenvolvimento",
      "Colaboração com instituições",
      "Transparência corporativa"
    ],
    profissionais: [
      "Ferramentas de trabalho avançadas",
      "Formação e capacitação contínua",
      "Remuneração justa e competitiva",
      "Flexibilidade de horários",
      "Suporte técnico 24/7",
      "Comunidade de profissionais",
      "Reconhecimento e valorização",
      "Oportunidades de crescimento"
    ]
  };

  const jornada = [
    {
      fase: "Fundação",
      descricao: "Nascimento da missão de transformar a saúde digital",
      conquistas: ["Definição dos valores", "Equipe inicial formada", "Primeira versão da plataforma"]
    },
    {
      fase: "Desenvolvimento",
      descricao: "Evolução constante da tecnologia e processos",
      conquistas: ["Implementação de IA", "Expansão da cobertura", "Parcerias estratégicas"]
    },
    {
      fase: "Crescimento",
      descricao: "Ampliação do impacto e alcance",
      conquistas: ["Milhares de usuários atendidos", "Reconhecimento de mercado", "Inovação contínua"]
    },
    {
      fase: "Transformação",
      descricao: "Liderança na revolução da saúde digital",
      conquistas: ["Referência no setor", "Impacto social mensurável", "Visão de futuro"]
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
              <h1 className="text-2xl font-bold text-white">Missão e Valores</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Nossa Missão
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Promover saúde acessível, humana e inovadora, conectando pessoas e 
              profissionais com tecnologia e empatia para transformar o futuro da saúde no Brasil.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Por que existimos?</h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-4">
                Acreditamos que saúde de qualidade deve ser acessível, humana e inovadora. 
                Nossa missão é democratizar o acesso à saúde, tornando o cuidado médico 
                mais acessível, eficiente e humano para todos os brasileiros.
              </p>
              <p className="text-blue-100 text-lg leading-relaxed">
                Combinamos tecnologia de ponta com toque humano para criar experiências 
                que realmente fazem a diferença na vida das pessoas.
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {estatisticas.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.valor}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visão e Propósito */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Visão e Propósito</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Os princípios fundamentais que norteiam nossa jornada e definem nosso impacto
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {principios.map((principio, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">{principio.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-4">{principio.title}</h3>
                    <p className="text-blue-100 leading-relaxed mb-4">{principio.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">Impacto:</h4>
                    <p className="text-blue-200 text-sm">{principio.impacto}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Métricas:</h4>
                    <ul className="space-y-1">
                      {principio.metricas.map((metrica, metIndex) => (
                        <li key={metIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          <span className="text-blue-100 text-sm">{metrica}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossos Valores</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Os princípios que guiam nossa jornada, definem nossa cultura e moldam 
                cada decisão que tomamos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {valores.map((valor, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="text-5xl">{valor.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{valor.title}</h3>
                      <p className="text-blue-200">{valor.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Como praticamos:</h4>
                      <ul className="space-y-2">
                        {valor.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-blue-100 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Exemplos práticos:</h4>
                      <ul className="space-y-2">
                        {valor.exemplos.map((exemplo, exIndex) => (
                          <li key={exIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-blue-100 text-sm">{exemplo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciais Competitivos */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossos Diferenciais</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                O que nos torna únicos e como criamos valor para nossos usuários
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {diferenciais.map((diferencial, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">{diferencial.icon}</div>
                    <h3 className="text-xl font-bold text-white">{diferencial.titulo}</h3>
                  </div>
                  
                  <p className="text-blue-100 mb-4 leading-relaxed">{diferencial.descricao}</p>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">Recursos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {diferencial.recursos.map((recurso, recIndex) => (
                        <span key={recIndex} className="bg-blue-600/50 text-blue-100 px-3 py-1 rounded-full text-sm">
                          {recurso}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impacto Social */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Impacto Social</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Como nossa missão e valores se traduzem em impacto real na sociedade
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {impactoSocial.map((impacto, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <div className="text-4xl mb-4">{impacto.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{impacto.categoria}</h3>
                  <p className="text-blue-100 mb-4 leading-relaxed">{impacto.descricao}</p>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">Resultados:</h4>
                    <ul className="space-y-2">
                      {impacto.metricas.map((metrica, metIndex) => (
                        <li key={metIndex} className="text-blue-200 text-sm">
                          {metrica}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compromissos */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossos Compromissos</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Os compromissos que assumimos com cada grupo de stakeholders
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Com os Pacientes</h3>
                <ul className="space-y-3">
                  {compromissos.pacientes.map((compromisso, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">{compromisso}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Com a Sociedade</h3>
                <ul className="space-y-3">
                  {compromissos.sociedade.map((compromisso, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">{compromisso}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Com os Profissionais</h3>
                <ul className="space-y-3">
                  {compromissos.profissionais.map((compromisso, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">{compromisso}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Jornada da Missão */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossa Jornada</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Como nossa missão evoluiu e continua crescendo ao longo do tempo
              </p>
            </div>

            <div className="space-y-8">
              {jornada.map((etapa, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-start space-x-6">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{etapa.fase}</h3>
                      <p className="text-blue-100 leading-relaxed mb-4">{etapa.descricao}</p>
                      
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">Principais Conquistas:</h4>
                        <ul className="space-y-2">
                          {etapa.conquistas.map((conquista, conqIndex) => (
                            <li key={conqIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-blue-100 text-sm">{conquista}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visão de Futuro */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Nossa Visão de Futuro</h2>
                <p className="text-xl text-blue-100">
                  Como continuaremos vivendo nossa missão e valores nos próximos anos
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Expansão do Impacto</h3>
                  <p className="text-blue-100 leading-relaxed mb-4">
                    Continuaremos expandindo nossa missão para alcançar ainda mais brasileiros, 
                    levando saúde digital de qualidade para todos os cantos do país.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">Cobertura nacional completa</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">Tecnologias ainda mais avançadas</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">Parcerias internacionais</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Inovação Contínua</h3>
                  <p className="text-blue-100 leading-relaxed mb-4">
                    Manteremos nosso compromisso com a inovação, sempre buscando novas 
                    formas de melhorar a experiência e o cuidado com nossos usuários.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">IA mais inteligente e empática</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">Realidade virtual e aumentada</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-100 text-sm">Medicina personalizada</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MissaoValores; 