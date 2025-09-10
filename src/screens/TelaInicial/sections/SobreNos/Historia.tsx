import React, { useState, useEffect } from "react";

const Historia: React.FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timelinePeriods = [
    {
      id: "2023-1",
      period: "1º Semestre 2023",
      title: "O Sonho Começa",
      subtitle: "Agosto - Dezembro 2023",
      description: "A Vitalis nasce da visão de quatro empreendedores apaixonados por tecnologia e saúde. Em agosto de 2023, Thiago, Kelvin, Rodrigo e Pedro decidiram unir suas experiências para revolucionar o acesso à saúde no Brasil.",
      story: [
        "Em uma tarde de agosto, os quatro fundadores se reuniram em um café em São Paulo. A conversa começou sobre os desafios do sistema de saúde brasileiro e rapidamente evoluiu para uma visão compartilhada de transformação.",
        "Durante os primeiros meses, dedicamos incontáveis horas a pesquisas de mercado, entrevistas com médicos e pacientes, e validação da nossa proposta de valor. Cada reunião confirmava que estávamos no caminho certo.",
        "O primeiro escritório foi uma sala pequena em um coworking, onde passamos noites inteiras desenvolvendo o conceito da plataforma. A energia era contagiante - sabíamos que estávamos criando algo especial."
      ],
      achievements: [
        "Time fundador formado",
        "Missão e valores definidos", 
        "Validação inicial do mercado",
        "Primeiro plano de negócios"
      ],
      image: "/images/historia/2023-1-fundacao.jpg",
      icon: "💡",
      color: "blue",
      heartbeat: "normal"
    },
    {
      id: "2023-2", 
      period: "2º Semestre 2023",
      title: "Primeiro MVP",
      subtitle: "Janeiro - Junho 2023",
      description: "Após 6 meses de desenvolvimento intenso, a primeira versão da plataforma Vitalis foi criada. O MVP focou em conectar pacientes e médicos de forma simples e segura.",
      story: [
        "O desenvolvimento do MVP foi um período de muito aprendizado. Trabalhamos com uma equipe pequena mas dedicada, enfrentando desafios técnicos e de design que nos fizeram crescer como profissionais.",
        "Nossos primeiros testes com médicos foram emocionantes. Ver a reação deles ao usar a plataforma pela primeira vez confirmou que estávamos no caminho certo. Os feedbacks foram fundamentais para as melhorias.",
        "O lançamento beta foi um momento de muita ansiedade e expectativa. Quando os primeiros pacientes começaram a usar a plataforma, sentimos que todo o esforço havia valido a pena."
      ],
      achievements: [
        "MVP desenvolvido e testado",
        "Primeiros 50 médicos cadastrados",
        "Plataforma beta no ar",
        "Primeiros 100 pacientes atendidos"
      ],
      image: "/images/historia/2023-2-mvp.jpg",
      icon: "🛠️",
      color: "green",
      heartbeat: "accelerated"
    },
    {
      id: "2024-1",
      period: "1º Semestre 2024", 
      title: "Crescimento Inicial",
      subtitle: "Julho - Dezembro 2024",
      description: "A plataforma começou a ganhar reconhecimento no mercado. Novos médicos e pacientes descobriram a Vitalis, validando nossa proposta de valor.",
      story: [
        "O primeiro semestre de 2024 foi marcado pelo crescimento orgânico. Médicos começaram a recomendar a plataforma para seus colegas, e pacientes compartilhavam suas experiências positivas.",
        "Implementamos o sistema de pagamentos, que foi um marco importante. Ver as primeiras transações sendo processadas nos deu a confiança de que o modelo de negócio estava funcionando.",
        "As parcerias com clínicas e hospitais começaram a se concretizar. Cada nova parceria representava não apenas crescimento, mas também validação da nossa proposta no mercado."
      ],
      achievements: [
        "10 especialidades médicas",
        "500+ médicos cadastrados",
        "5.000+ pacientes atendidos",
        "Sistema de pagamentos implementado"
      ],
      image: "/images/historia/2024-1-crescimento.jpg",
      icon: "📈",
      color: "purple",
      heartbeat: "strong"
    },
    {
      id: "2024-2",
      period: "2º Semestre 2024",
      title: "Expansão Nacional", 
      subtitle: "Janeiro - Junho 2024",
      description: "A Vitalis experimentou um crescimento exponencial, expandindo para novos estados e adicionando funcionalidades inovadoras à plataforma.",
      story: [
        "A expansão nacional foi um desafio logístico e cultural. Cada estado tinha suas particularidades e regulamentações. Aprendemos a adaptar nossa solução para diferentes realidades.",
        "O lançamento do app mobile foi um momento de grande celebração. Ver a plataforma funcionando perfeitamente em dispositivos móveis nos mostrou o potencial de alcance da nossa solução.",
        "A integração com planos de saúde foi um marco importante. Representou a validação do mercado tradicional e abriu portas para parcerias estratégicas."
      ],
      achievements: [
        "25 estados brasileiros",
        "App mobile lançado",
        "Integração com planos de saúde",
        "10.000+ pacientes atendidos"
      ],
      image: "/images/historia/2024-2-expansao.jpg",
      icon: "🚀",
      color: "orange",
      heartbeat: "rapid"
    },
    {
      id: "2025-1",
      period: "1º Semestre 2025",
      title: "Inovação Tecnológica",
      subtitle: "Julho - Dezembro 2025", 
      description: "A Vitalis investiu pesado em tecnologia, implementando inteligência artificial para triagem inteligente e automação de processos.",
      story: [
        "A implementação de IA foi um projeto ambicioso que exigiu meses de desenvolvimento e testes. Ver a máquina aprendendo e melhorando com o tempo foi fascinante.",
        "O sistema de agendamento inteligente revolucionou a experiência dos usuários. A combinação de IA com dados históricos permitiu otimizações que antes pareciam impossíveis.",
        "A automação de prescrições foi um marco na eficiência. Médicos puderam focar mais no paciente e menos em tarefas administrativas."
      ],
      achievements: [
        "IA implementada com sucesso",
        "Triagem inteligente ativa",
        "Automação de prescrições",
        "Dashboard analítico para médicos"
      ],
      image: "/images/historia/2025-1-ia.jpg",
      icon: "🤖",
      color: "cyan",
      heartbeat: "futuristic"
    },
    {
      id: "2025-2",
      period: "2º Semestre 2025",
      title: "Referência Nacional",
      subtitle: "Janeiro - Junho 2025",
      description: "A Vitalis se consolidou como uma das principais plataformas de telemedicina do Brasil, sendo reconhecida pela qualidade e inovação.",
      story: [
        "Ser reconhecida como líder do mercado foi uma conquista que superou nossas expectativas iniciais. Representou a validação de anos de trabalho e dedicação.",
        "As parcerias estratégicas com grandes operadoras abriram novas possibilidades de crescimento e impacto. Cada parceria representava a confiança do mercado em nossa solução.",
        "O planejamento da expansão internacional nos mostrou o potencial global da nossa tecnologia. Estamos preparados para levar a Vitalis para além das fronteiras do Brasil."
      ],
      achievements: [
        "Líder do mercado de telemedicina",
        "Parcerias estratégicas firmadas",
        "Expansão internacional planejada",
        "50.000+ pacientes atendidos"
      ],
      image: "/images/historia/2025-2-lideranca.jpg",
      icon: "🏆",
      color: "yellow",
      heartbeat: "champion"
    }
  ];

  const nextPeriod = () => {
    if (currentPeriod < timelinePeriods.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPeriod(currentPeriod + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevPeriod = () => {
    if (currentPeriod > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPeriod(currentPeriod - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const getHeartbeatClass = (heartbeat: string) => {
    const classes = {
      normal: "",
      accelerated: "",
      strong: "",
      rapid: "",
      futuristic: "",
      champion: ""
    };
    return classes[heartbeat as keyof typeof classes] || classes.normal;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-500 border-blue-600",
      green: "bg-green-500 border-green-600", 
      purple: "bg-purple-500 border-purple-600",
      orange: "bg-orange-500 border-orange-600",
      cyan: "bg-cyan-500 border-cyan-600",
      yellow: "bg-yellow-500 border-yellow-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 relative overflow-hidden">
      {/* Estilos CSS inline para as animações */}
      <style>
        {`
          @keyframes ecg-move-right {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes ecg-draw-realistic {
            0% { stroke-dashoffset: 1000; }
            10% { stroke-dashoffset: 900; } /* Linha reta */
            15% { stroke-dashoffset: 850; } /* Início pico */
            20% { stroke-dashoffset: 750; } /* Pico máximo */
            25% { stroke-dashoffset: 700; } /* Fim pico */
            35% { stroke-dashoffset: 500; } /* Linha reta */
            40% { stroke-dashoffset: 450; } /* Início pico */
            45% { stroke-dashoffset: 350; } /* Pico máximo */
            50% { stroke-dashoffset: 300; } /* Fim pico */
            60% { stroke-dashoffset: 100; } /* Linha reta */
            65% { stroke-dashoffset: 50; } /* Início pico */
            70% { stroke-dashoffset: 0; } /* Pico máximo */
            75% { stroke-dashoffset: 0; } /* Fim pico */
            100% { stroke-dashoffset: 0; } /* Linha reta final */
          }
        `}
      </style>

      {/* Background animado com monitor cardíaco */}
      <div className="fixed inset-0 z-0 opacity-30">
        {/* Monitor cardíaco centralizado */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 overflow-hidden">
          <div className="w-full h-full relative">
            {/* Linha que se move da esquerda para direita */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-blue-400"
              style={{
                animation: 'ecg-move-right 15s linear infinite'
              }}
            />
            {/* Picos ECG que se movem junto */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-full h-1"
              style={{
                animation: 'ecg-move-right 15s linear infinite',
                animationDelay: '0.5s'
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <path
                  d="M0,50 L50,50 L100,45 L120,55 L140,50 L160,50 L180,30 L200,70 L220,50 L300,50 L350,50 L400,45 L420,55 L440,50 L460,50 L480,30 L500,70 L520,50 L600,50 L650,50 L700,45 L720,55 L740,50 L760,50 L780,30 L800,70 L820,50 L900,50 L950,50 L1000,50"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  style={{
                    animation: 'ecg-draw-realistic 15s linear infinite'
                  }}
                />
                {/* Picos ECG realistas com ondas P, QRS e T */}
                <path
                  d="M0,50 L50,50 L100,45 L120,55 L140,50 L160,50 L180,30 L200,70 L220,50 L300,50 L350,50 L400,45 L420,55 L440,50 L460,50 L480,30 L500,70 L520,50 L600,50 L650,50 L700,45 L720,55 L740,50 L760,50 L780,30 L800,70 L820,50 L900,50 L950,50 L1000,50"
                  stroke="#60A5FA"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  style={{
                    animation: 'ecg-draw-realistic 15s linear infinite',
                    animationDelay: '0.5s'
                  }}
                />
                {/* Linha sutil de fundo */}
                <path
                  d="M0,50 L50,50 L100,45 L120,55 L140,50 L160,50 L180,30 L200,70 L220,50 L300,50 L350,50 L400,45 L420,55 L440,50 L460,50 L480,30 L500,70 L520,50 L600,50 L650,50 L700,45 L720,55 L740,50 L760,50 L780,30 L800,70 L820,50 L900,50 L950,50 L1000,50"
                  stroke="#60A5FA"
                  strokeWidth="0.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  style={{
                    animation: 'ecg-draw-realistic 15s linear infinite',
                    animationDelay: '1s'
                  }}
                />
                {/* Picos ECG realistas com ondas P, QRS e T */}
                <path
                  d="M0,50 L50,50 L100,45 L120,55 L140,50 L160,50 L180,30 L200,70 L220,50 L300,50 L350,50 L400,45 L420,55 L440,50 L460,50 L480,30 L500,70 L520,50 L600,50 L650,50 L700,45 L720,55 L740,50 L760,50 L780,30 L800,70 L820,50 L900,50 L950,50 L1000,50"
                  stroke="#60A5FA"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  style={{
                    animation: 'ecg-draw-realistic 15s linear infinite',
                    animationDelay: '1.5s'
                  }}
                />
              </svg>
            </div>
          </div>
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
              <h1 className="text-2xl font-bold text-white">Nossa História</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Nossa Jornada
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Uma história de inovação, dedicação e transformação da saúde no Brasil. 
              Conheça os marcos que fizeram da Vitalis uma referência em telemedicina.
            </p>
          </div>
        </section>

        {/* Timeline Navigation */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-8">
              {/* Seta Esquerda */}
              <button
                onClick={prevPeriod}
                disabled={currentPeriod === 0}
                className={`p-4 rounded-full transition-all duration-300 hover-lift ${
                  currentPeriod === 0
                    ? "bg-white/10 text-white/50 cursor-not-allowed"
                    : "bg-white/20 text-white hover:bg-white/30 animate-float"
                }`}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Indicador de Progresso */}
              <div className="flex items-center gap-4">
                <div className="text-white font-bold text-lg animate-fade-in-up">
                  {currentPeriod + 1} / {timelinePeriods.length}
                </div>
                <div className="flex gap-2">
                  {timelinePeriods.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 hover-lift ${
                        index === currentPeriod
                          ? "bg-blue-500 scale-125 animate-pulse-glow"
                          : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Seta Direita */}
              <button
                onClick={nextPeriod}
                disabled={currentPeriod === timelinePeriods.length - 1}
                className={`p-4 rounded-full transition-all duration-300 hover-lift ${
                  currentPeriod === timelinePeriods.length - 1
                    ? "bg-white/10 text-white/50 cursor-not-allowed"
                    : "bg-white/20 text-white hover:bg-white/30 animate-float"
                }`}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Timeline Content */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                {/* Header com ícone animado */}
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl border-4 ${getColorClasses(timelinePeriods[currentPeriod].color)} ${getHeartbeatClass(timelinePeriods[currentPeriod].heartbeat)} hover-lift`}>
                    {timelinePeriods[currentPeriod].icon}
                  </div>
                  <div className="animate-fade-in-up">
                    <h2 className="text-4xl font-bold text-white mb-2">{timelinePeriods[currentPeriod].title}</h2>
                    <p className="text-blue-200 text-xl">{timelinePeriods[currentPeriod].subtitle}</p>
                    <p className="text-blue-100 text-lg mt-2">{timelinePeriods[currentPeriod].period}</p>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column - Story */}
                  <div className="animate-slide-in-left">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="mr-3 animate-float">📖</span>
                      A História
                    </h3>
                    <div className="space-y-6">
                      {timelinePeriods[currentPeriod].story.map((paragraph, storyIndex) => (
                        <div key={storyIndex} className="bg-white/5 rounded-lg p-4 border border-white/10 hover-lift">
                          <p className="text-blue-100 leading-relaxed text-lg">
                            {paragraph}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Image and Achievements */}
                  <div className="space-y-6 animate-slide-in-right">
                    {/* Image */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/20 hover-lift">
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                        <img
                          src={timelinePeriods[currentPeriod].image}
                          alt={`História da Vitalis - ${timelinePeriods[currentPeriod].period}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        {/* Placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-green-400/20 flex items-center justify-center hidden">
                          <img
                            src="/images/historia/placeholder.svg"
                            alt="Placeholder"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="mr-3 animate-float">🏆</span>
                        Principais Conquistas
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {timelinePeriods[currentPeriod].achievements.map((achievement, achievementIndex) => (
                          <div
                            key={achievementIndex}
                            className="bg-green-600/20 text-green-200 px-4 py-3 rounded-lg border border-green-400/30 text-sm hover-lift"
                          >
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Números que Contam Nossa História</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Resultados que mostram o impacto da nossa jornada
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "2+", label: "Anos de Experiência", icon: "📅" },
                { number: "50k+", label: "Atendimentos Realizados", icon: "🏥" },
                { number: "30+", label: "Especialidades Médicas", icon: "👨‍⚕️" },
                { number: "98%", label: "Satisfação dos Usuários", icon: "⭐" }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-2 animate-bounce">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Faça Parte da Nossa História</h2>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se à Vitalis e ajude-nos a continuar transformando a saúde no Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/cadastro"
                className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 hover:scale-105"
              >
                Criar Conta
              </a>
              <a
                href="/sobre"
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300 hover:scale-105"
              >
                Voltar para Sobre Nós
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Historia; 