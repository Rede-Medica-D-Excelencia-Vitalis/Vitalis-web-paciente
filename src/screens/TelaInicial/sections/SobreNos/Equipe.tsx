import React from "react";

const Equipe: React.FC = () => {
  const fundadores = [
    {
      nome: "Thiago Tertuliano",
      cargo: "CEO & Fundador",
      bio: "Desenvolvedor de software apaixonado por inovação e tecnologia com mais de 8 anos de experiência no setor de saúde digital. Lidera a estratégia geral da empresa e a visão de produto, sempre focando na transformação digital da saúde brasileira.",
      bioExtendida: "Formado em Ciência da Computação, Thiago possui vasta experiência em desenvolvimento de sistemas de saúde, telemedicina e aplicações móveis. Sua visão estratégica e conhecimento técnico profundo permitiram que a Vitalis se tornasse uma referência em inovação na saúde digital. É responsável por definir a direção tecnológica da empresa e garantir que todas as soluções desenvolvidas atendam aos mais altos padrões de qualidade e segurança.",
      especialidades: ["Desenvolvimento de Software", "Estratégia de Produto", "Liderança", "Telemedicina", "Saúde Digital"],
      formacao: "Ciência da Computação",
      experiencia: "8+ anos",
      linkedin: "#",
      foto: "TT",
      conquistas: ["Liderou o desenvolvimento de 15+ aplicações de saúde", "Especialista em compliance LGPD", "Mentor de startups de saúde"]
    },
    {
      nome: "Kelvin",
      cargo: "CTO & Fundador",
      bio: "Analista de Sistemas especialista em arquitetura de software e infraestrutura tecnológica com foco em escalabilidade e segurança. Responsável pela inovação técnica e pela arquitetura de todos os sistemas da Vitalis.",
      bioExtendida: "Com mais de 10 anos de experiência em TI, Kelvin é especialista em arquitetura de sistemas distribuídos, cloud computing e segurança da informação. Sua expertise em infraestrutura escalável permitiu que a Vitalis atendesse milhares de usuários simultaneamente sem comprometer a performance. É responsável por garantir que toda a infraestrutura tecnológica seja robusta, segura e preparada para o crescimento exponencial.",
      especialidades: ["Arquitetura de Sistemas", "Infraestrutura", "Inovação Tecnológica", "Cloud Computing", "Segurança"],
      formacao: "Análise de Sistemas",
      experiencia: "10+ anos",
      linkedin: "#",
      foto: "K",
      conquistas: ["Arquiteto de sistemas para 20+ projetos", "Especialista em AWS e Azure", "Certificado em segurança da informação"]
    },
    {
      nome: "Rodrigo Gesuele",
      cargo: "COO & Fundador",
      bio: "Estrategista de negócios e inovação com vasta experiência em gestão de operações e desenvolvimento de parcerias estratégicas. Gerencia todas as operações da Vitalis e busca constantemente novas oportunidades de crescimento.",
      bioExtendida: "Com background em administração e gestão de projetos, Rodrigo é responsável por transformar a visão estratégica em operações eficientes e escaláveis. Sua experiência em gestão de equipes e processos permitiu que a Vitalis crescesse de forma sustentável, mantendo a qualidade dos serviços. É o responsável por estabelecer parcerias estratégicas com hospitais, clínicas e outros players do setor de saúde.",
      especialidades: ["Estratégia de Negócios", "Operações", "Parcerias", "Gestão de Projetos", "Expansão"],
      formacao: "Administração de Empresas",
      experiencia: "12+ anos",
      linkedin: "#",
      foto: "RG",
      conquistas: ["Gerenciou expansão para 5 estados", "Estabeleceu 50+ parcerias estratégicas", "Especialista em gestão de startups"]
    },
    {
      nome: "Pedro Simioni",
      cargo: "CMO & Fundador",
      bio: "Especialista em marketing digital e análise de dados com foco em crescimento sustentável e relacionamento com clientes. Desenvolve estratégias inovadoras de marketing que conectam a Vitalis com seus usuários.",
      bioExtendida: "Com expertise em marketing digital e análise comportamental, Pedro é responsável por criar estratégias que não apenas atraem usuários, mas os mantêm engajados com a plataforma. Sua abordagem baseada em dados permite que a Vitalis tome decisões estratégicas fundamentadas e otimize constantemente a experiência do usuário. É o responsável por posicionar a Vitalis como líder em inovação na saúde digital.",
      especialidades: ["Marketing Digital", "Análise de Dados", "Crescimento", "UX/UI", "Estratégia de Marca"],
      formacao: "Marketing Digital",
      experiencia: "9+ anos",
      linkedin: "#",
      foto: "PS",
      conquistas: ["Cresceu base de usuários em 300%", "Especialista em growth hacking", "Liderou campanhas premiadas"]
    }
  ];

  const estatisticas = [
    { valor: "4", label: "Fundadores Visionários" },
    { valor: "15+", label: "Anos de Experiência Combinada" },
    { valor: "100%", label: "Comprometimento com a Saúde" },
    { valor: "24/7", label: "Disponibilidade Total" },
    { valor: "50+", label: "Parcerias Estratégicas" },
    { valor: "10k+", label: "Usuários Atendidos" }
  ];

  const valoresEquipe = [
    {
      titulo: "Liderança Colaborativa",
      desc: "Acreditamos no poder da colaboração. Trabalhamos juntos, compartilhando conhecimento e tomando decisões coletivas que beneficiam toda a equipe e nossos usuários.",
      descExtendida: "Nossa cultura de liderança colaborativa permite que cada membro da equipe contribua com suas ideias e expertise. Realizamos reuniões semanais de brainstorming onde todos podem sugerir melhorias e inovações. Acreditamos que as melhores soluções surgem da diversidade de pensamentos e experiências.",
      icon: "🤝",
      beneficios: ["Decisões mais assertivas", "Crescimento pessoal", "Inovação contínua"]
    },
    {
      titulo: "Inovação Constante",
      desc: "A inovação está no nosso DNA. Sempre buscamos novas formas de melhorar nossos serviços e impactar positivamente a vida das pessoas através da tecnologia.",
      descExtendida: "Mantemos um programa contínuo de inovação que inclui hackathons mensais, workshops de design thinking e parcerias com universidades e centros de pesquisa. Investimos 15% do nosso tempo em projetos inovadores e experimentais que podem revolucionar o setor de saúde.",
      icon: "💡",
      beneficios: ["Soluções pioneiras", "Vantagem competitiva", "Impacto social"]
    },
    {
      titulo: "Foco no Cliente",
      desc: "O usuário está no centro de todas as nossas decisões. Desenvolvemos soluções pensando sempre na experiência e bem-estar de quem utiliza nossa plataforma.",
      descExtendida: "Realizamos pesquisas semanais com nossos usuários, testes de usabilidade contínuos e análise de feedback em tempo real. Nossa equipe de suporte trabalha 24/7 para garantir que cada interação seja positiva e resolutiva. A satisfação do cliente é nossa principal métrica de sucesso.",
      icon: "🎯",
      beneficios: ["Alta satisfação", "Retenção de usuários", "Crescimento orgânico"]
    },
    {
      titulo: "Transparência Total",
      desc: "Acreditamos na transparência em todos os aspectos do nosso trabalho, desde o desenvolvimento de produtos até a comunicação com usuários e parceiros.",
      descExtendida: "Mantemos nossos usuários informados sobre todas as atualizações, melhorias e mudanças na plataforma. Compartilhamos métricas de performance, resultados de pesquisas e planos futuros. A transparência constrói confiança e fortalece nossos relacionamentos.",
      icon: "🔍",
      beneficios: ["Confiança dos usuários", "Relacionamentos duradouros", "Credibilidade"]
    }
  ];

  const tecnologias = [
    {
      categoria: "Frontend",
      tecnologias: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      descricao: "Desenvolvemos interfaces modernas e responsivas que proporcionam uma experiência excepcional ao usuário."
    },
    {
      categoria: "Backend",
      tecnologias: ["Node.js", "Express", "PostgreSQL", "Redis"],
      descricao: "Arquitetura robusta e escalável que garante performance e confiabilidade em todos os serviços."
    },
    {
      categoria: "Mobile",
      tecnologias: ["React Native", "Expo", "Push Notifications"],
      descricao: "Aplicações móveis nativas que mantêm os usuários conectados e informados 24/7."
    },
    {
      categoria: "Infraestrutura",
      tecnologias: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      descricao: "Infraestrutura cloud moderna que garante alta disponibilidade e segurança dos dados."
    }
  ];

  const conquistas = [
    {
      ano: "2023",
      titulo: "Fundação da Vitalis",
      descricao: "Nascimento da empresa com a missão de transformar a saúde digital no Brasil",
      impacto: "4 fundadores unidos por uma visão comum"
    },
    {
      ano: "2024",
      titulo: "Primeira Versão da Plataforma",
      descricao: "Lançamento da plataforma inicial com funcionalidades básicas de telemedicina",
      impacto: "1.000+ usuários registrados nos primeiros 3 meses"
    },
    {
      ano: "2024",
      titulo: "Expansão Regional",
      descricao: "Expansão para 5 estados brasileiros com parcerias estratégicas",
      impacto: "50+ clínicas e hospitais parceiros"
    },
    {
      ano: "2025",
      titulo: "Inovação em IA",
      descricao: "Implementação de inteligência artificial para triagem e diagnóstico",
      impacto: "Melhoria de 40% na precisão diagnóstica"
    }
  ];

  const cultura = {
    valores: [
      "Paixão pela inovação e tecnologia",
      "Compromisso com a excelência",
      "Trabalho em equipe e colaboração",
      "Foco no impacto social",
      "Aprendizado contínuo",
      "Transparência e ética"
    ],
    beneficios: [
      "Horário flexível e trabalho remoto",
      "Plano de saúde completo",
      "Programa de desenvolvimento profissional",
      "Participação em projetos inovadores",
      "Ambiente colaborativo e inclusivo",
      "Oportunidades de crescimento"
    ],
    atividades: [
      "Hackathons mensais",
      "Workshops de inovação",
      "Programa de mentoria",
      "Eventos de networking",
      "Voluntariado corporativo",
      "Celebrações de conquistas"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 relative overflow-hidden">
      {/* Background animado */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-40 right-0 w-full h-32">
          <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              d="M0,50 Q50,80 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 T900,50 T1000,50 T1100,50 T1200,50"
              stroke="#34D399"
              strokeWidth="2"
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
              <h1 className="text-2xl font-bold text-white">Nossa Equipe</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Conheça Nossa Equipe
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Os fundadores visionários que estão transformando a saúde no Brasil através de 
              tecnologia, inovação e dedicação inabalável. Conheça as mentes por trás da 
              revolução digital na saúde.
            </p>
            
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-12">
              {estatisticas.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.valor}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fundadores */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Fundadores Visionários</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Conheça os líderes que deram vida à Vitalis e continuam guiando nossa missão 
                de transformar a saúde digital no Brasil
              </p>
            </div>

            <div className="space-y-12">
              {fundadores.map((fundador, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                      <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white mx-auto mb-6">
                        {fundador.foto}
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-1">{fundador.nome}</h3>
                        <p className="text-blue-200 font-medium mb-2">{fundador.cargo}</p>
                        <p className="text-blue-100 text-sm mb-3">{fundador.formacao}</p>
                        <p className="text-blue-300 text-sm font-medium">{fundador.experiencia} de experiência</p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-white mb-3">Biografia</h4>
                        <p className="text-blue-100 leading-relaxed mb-4">{fundador.bio}</p>
                        <p className="text-blue-100 leading-relaxed">{fundador.bioExtendida}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-white mb-3">Especialidades</h4>
                        <div className="flex flex-wrap gap-2">
                          {fundador.especialidades.map((especialidade, espIndex) => (
                            <span key={espIndex} className="bg-blue-600/50 text-blue-100 px-3 py-1 rounded-full text-sm">
                              {especialidade}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-white mb-3">Principais Conquistas</h4>
                        <ul className="space-y-2">
                          {fundador.conquistas.map((conquista, conqIndex) => (
                            <li key={conqIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-blue-100 text-sm">{conquista}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <a
                        href={fundador.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-300 hover:text-blue-100 font-medium"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 0a10 10 0 100 20 10 10 0 000-20zM7.5 15.5h-2v-6h2v6zm-1-7a1 1 0 11-2 0 1 1 0 012 0zm6 7h-2v-2.5c0-.8-.3-1.5-1.5-1.5s-1.5.7-1.5 1.5v2.5h-2v-6h2v1.2c.5-.8 1.2-1.2 2-1.2 1.8 0 3.5 1.7 3.5 3.5v2.5z"/>
                        </svg>
                        Conectar no LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valores da Equipe */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossos Valores e Cultura</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Os princípios que guiam nossa forma de trabalhar, crescer e impactar 
                positivamente a vida das pessoas
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {valoresEquipe.map((valor, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="text-4xl mb-4">{valor.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{valor.titulo}</h3>
                  <p className="text-blue-100 leading-relaxed mb-4">{valor.desc}</p>
                  <p className="text-blue-100 leading-relaxed mb-4">{valor.descExtendida}</p>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">Benefícios:</h4>
                    <ul className="space-y-2">
                      {valor.beneficios.map((beneficio, benIndex) => (
                        <li key={benIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-blue-100 text-sm">{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Cultura da Empresa */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Nossa Cultura Organizacional</h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Valores Fundamentais</h4>
                  <ul className="space-y-3">
                    {cultura.valores.map((valor, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-blue-100 text-sm">{valor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Benefícios para a Equipe</h4>
                  <ul className="space-y-3">
                    {cultura.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-blue-100 text-sm">{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Atividades e Eventos</h4>
                  <ul className="space-y-3">
                    {cultura.atividades.map((atividade, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-blue-100 text-sm">{atividade}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tecnologia e Inovação */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Tecnologia e Inovação</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Utilizamos as tecnologias mais modernas e inovadoras para criar 
                soluções que realmente fazem a diferença na vida das pessoas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tecnologias.map((tech, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <h3 className="text-xl font-bold text-white mb-4">{tech.categoria}</h3>
                  <p className="text-blue-100 text-sm mb-4">{tech.descricao}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tech.tecnologias.map((tecnologia, techIndex) => (
                      <span key={techIndex} className="bg-blue-600/50 text-blue-100 px-2 py-1 rounded text-xs">
                        {tecnologia}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Nossa Abordagem de Inovação</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Pesquisa e Desenvolvimento</h4>
                  <p className="text-blue-100 leading-relaxed mb-4">
                    Investimos 15% do nosso tempo em projetos de P&D, explorando novas 
                    tecnologias como IA, machine learning e blockchain para aplicações em saúde.
                  </p>
                  <p className="text-blue-100 leading-relaxed">
                    Mantemos parcerias com universidades e centros de pesquisa para 
                    desenvolver soluções pioneiras que podem revolucionar o setor.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Metodologia Ágil</h4>
                  <p className="text-blue-100 leading-relaxed mb-4">
                    Utilizamos metodologias ágeis como Scrum e Kanban para entregar 
                    valor rapidamente e iterar baseado no feedback dos usuários.
                  </p>
                  <p className="text-blue-100 leading-relaxed">
                    Realizamos sprints de 2 semanas com demonstrações regulares e 
                    retrospectivas para melhorar continuamente nossos processos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* História e Conquistas */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossa Jornada e Conquistas</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Uma linha do tempo das principais conquistas e marcos que marcaram 
                nossa trajetória de crescimento e inovação
              </p>
            </div>

            <div className="space-y-8">
              {conquistas.map((conquista, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-start space-x-6">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg flex-shrink-0">
                      {conquista.ano}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{conquista.titulo}</h3>
                      <p className="text-blue-100 leading-relaxed mb-3">{conquista.descricao}</p>
                      <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
                        <p className="text-green-200 font-medium">Impacto: {conquista.impacto}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visão do Futuro */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossa Visão do Futuro</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Os próximos passos da nossa jornada para transformar ainda mais 
                o setor de saúde no Brasil e no mundo
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Expansão Nacional</h3>
                <p className="text-blue-100 leading-relaxed mb-4">
                  Nosso objetivo é estar presentes em todos os estados brasileiros até 2026, 
                  levando saúde digital de qualidade para milhões de brasileiros.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-100 text-sm">Cobertura em 27 estados</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-100 text-sm">500+ parceiros estratégicos</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-100 text-sm">1 milhão de usuários ativos</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Inovação Tecnológica</h3>
                <p className="text-blue-100 leading-relaxed mb-4">
                  Continuaremos investindo em tecnologias de ponta como IA, IoT e 
                  realidade aumentada para criar experiências únicas em saúde.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-100 text-sm">IA para diagnóstico avançado</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-100 text-sm">Telemedicina com realidade virtual</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-100 text-sm">Monitoramento IoT em tempo real</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Impacto Social</h3>
              <p className="text-blue-100 leading-relaxed text-center max-w-4xl mx-auto">
                Nossa missão vai além do sucesso empresarial. Queremos democratizar o acesso 
                à saúde de qualidade, reduzir desigualdades e contribuir para um Brasil 
                mais saudável e justo. Acreditamos que a tecnologia pode ser uma ferramenta 
                poderosa para transformar vidas e construir um futuro melhor para todos.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Equipe; 