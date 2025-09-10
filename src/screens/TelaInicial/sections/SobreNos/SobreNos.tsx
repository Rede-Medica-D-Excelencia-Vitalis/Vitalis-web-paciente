import React from "react";

const SobreNos: React.FC = () => {
  const secoes = [
    {
      id: "missao",
      titulo: "Missão & Valores",
      descricao: "Conheça nossa missão, visão e os valores que guiam nossa jornada",
      icon: "🎯",
      href: "/missao-valores",
      cor: "from-blue-600 to-blue-700"
    },
    {
      id: "historia",
      titulo: "História",
      descricao: "Descubra nossa jornada desde a fundação até os dias de hoje",
      icon: "📚",
      href: "/historia",
      cor: "from-green-600 to-green-700"
    },
    {
      id: "equipe",
      titulo: "Equipe",
      descricao: "Conheça os fundadores que estão transformando a saúde no Brasil",
      icon: "👥",
      href: "/equipe",
      cor: "from-purple-600 to-purple-700"
    },
    {
      id: "impacto",
      titulo: "Impacto",
      descricao: "Veja como estamos transformando vidas através da tecnologia",
      icon: "💝",
      href: "/impacto",
      cor: "from-red-600 to-red-700"
    },
    {
      id: "premios",
      titulo: "Prêmios",
      descricao: "Reconhecimentos e certificações que validam nosso trabalho",
      icon: "🏆",
      href: "/premios",
      cor: "from-yellow-600 to-yellow-700"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-green-700">
      {/* Background animado com batimentos cardíacos */}
      <div className="fixed inset-0 z-0 opacity-30">
        {/* Linhas de batimentos cardíacos */}
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

      {/* Conteúdo principal */}
      <div className="relative z-10">
      {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <img src="/logo-ext.png" alt="Vitalis" className="mx-auto h-20 mb-8 drop-shadow-2xl" />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Sobre a Vitalis
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Somos uma empresa inovadora que conecta pessoas e profissionais de saúde 
                através de tecnologia de ponta, promovendo cuidado humanizado e acessível.
              </p>
        </div>
          </div>
      </section>

        {/* Seções */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Conheça Nossa História</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Explore as diferentes facetas da Vitalis e descubra como estamos 
                transformando a saúde no Brasil
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {secoes.map((secao) => (
                <a
                  key={secao.id}
                  href={secao.href}
                  className="group block"
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className={`w-16 h-16 bg-gradient-to-r ${secao.cor} rounded-full flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {secao.icon}
        </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{secao.titulo}</h3>
                    <p className="text-blue-100 leading-relaxed mb-6">{secao.descricao}</p>
                    <div className="flex items-center text-blue-300 group-hover:text-blue-100 font-medium">
                      <span>Saiba mais</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
        </div>
            </div>
                </a>
              ))}
            </div>
        </div>
      </section>

        {/* Resumo Rápido */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Resumo Rápido</h2>
                <p className="text-xl text-blue-100">
                  A Vitalis em números
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">50k+</div>
                  <div className="text-blue-200">Atendimentos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">30+</div>
                  <div className="text-blue-200">Especialidades</div>
        </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
                  <div className="text-blue-200">Satisfação</div>
            </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">4</div>
                  <div className="text-blue-200">Fundadores</div>
        </div>
              </div>
            </div>
        </div>
      </section>
      </div>
  </div>
);
};

export default SobreNos; 