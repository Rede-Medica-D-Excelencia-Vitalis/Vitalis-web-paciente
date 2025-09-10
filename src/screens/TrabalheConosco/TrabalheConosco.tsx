import React, { useState } from 'react';

const TrabalheConosco: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    vaga: '',
    experiencia: '',
    linkedin: '',
    portfolio: '',
    mensagem: ''
  });

  const vagas = [
    {
      id: 1,
      titulo: "Desenvolvedor Full Stack",
      departamento: "Tecnologia",
      tipo: "CLT",
      localizacao: "Remoto",
      nivel: "Pleno/Sênior",
      descricao: "Desenvolver e manter aplicações web e mobile para a plataforma Vitalis",
      responsabilidades: [
        "Desenvolvimento de features frontend e backend",
        "Manutenção e otimização de código",
        "Colaboração com equipe de produto",
        "Code review e mentoria"
      ],
      requisitos: [
        "React/React Native",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "3+ anos de experiência"
      ],
      beneficios: ["Plano de saúde", "Vale refeição", "Home office", "Horário flexível"]
    },
    {
      id: 2,
      titulo: "UX/UI Designer",
      departamento: "Design",
      tipo: "CLT",
      localizacao: "Remoto",
      nivel: "Pleno",
      descricao: "Criar experiências de usuário excepcionais para nossa plataforma de saúde",
      responsabilidades: [
        "Design de interfaces e protótipos",
        "Pesquisa de usuários",
        "Testes de usabilidade",
        "Colaboração com equipe de produto"
      ],
      requisitos: [
        "Figma",
        "Design System",
        "User Research",
        "Prototipagem",
        "2+ anos de experiência"
      ],
      beneficios: ["Plano de saúde", "Vale refeição", "Home office", "Horário flexível"]
    },
    {
      id: 3,
      titulo: "Analista de Marketing Digital",
      departamento: "Marketing",
      tipo: "CLT",
      localizacao: "Remoto",
      nivel: "Júnior/Pleno",
      descricao: "Desenvolver estratégias de marketing digital para crescimento da marca",
      responsabilidades: [
        "Gestão de redes sociais",
        "Campanhas de marketing digital",
        "Análise de métricas",
        "Criação de conteúdo"
      ],
      requisitos: [
        "Google Analytics",
        "Redes Sociais",
        "Copywriting",
        "Analytics",
        "1+ anos de experiência"
      ],
      beneficios: ["Plano de saúde", "Vale refeição", "Home office", "Horário flexível"]
    },
    {
      id: 4,
      titulo: "Analista de Suporte",
      departamento: "Suporte",
      tipo: "CLT",
      localizacao: "Remoto",
      nivel: "Júnior",
      descricao: "Fornecer suporte técnico e atendimento aos usuários da plataforma",
      responsabilidades: [
        "Atendimento ao cliente",
        "Resolução de problemas técnicos",
        "Documentação de processos",
        "Feedback para equipe de produto"
      ],
      requisitos: [
        "Excelente comunicação",
        "Conhecimento técnico básico",
        "Paciente e empático",
        "Disponibilidade para plantões"
      ],
      beneficios: ["Plano de saúde", "Vale refeição", "Home office", "Horário flexível"]
    }
  ];

  const beneficios = [
    {
      categoria: "Saúde e Bem-estar",
      items: [
        "Plano de saúde completo",
        "Plano odontológico",
        "Gympass",
        "Acompanhamento psicológico"
      ],
      icon: "🏥"
    },
    {
      categoria: "Flexibilidade",
      items: [
        "Trabalho remoto",
        "Horário flexível",
        "Férias flexíveis",
        "Pausas para descanso"
      ],
      icon: "⏰"
    },
    {
      categoria: "Desenvolvimento",
      items: [
        "Cursos e certificações",
        "Mentoria",
        "Conferências",
        "Biblioteca de conhecimento"
      ],
      icon: "📚"
    },
    {
      categoria: "Reconhecimento",
      items: [
        "Salário competitivo",
        "PLR",
        "Participação nos lucros",
        "Reconhecimento público"
      ],
      icon: "🏆"
    }
  ];

  const cultura = [
    {
      titulo: "Inovação Constante",
      descricao: "Sempre buscamos novas formas de melhorar e inovar",
      icon: "💡"
    },
    {
      titulo: "Colaboração",
      descricao: "Trabalhamos juntos para alcançar objetivos comuns",
      icon: "🤝"
    },
    {
      titulo: "Transparência",
      descricao: "Comunicação clara e honesta em todos os níveis",
      icon: "🔍"
    },
    {
      titulo: "Crescimento",
      descricao: "Investimos no desenvolvimento pessoal e profissional",
      icon: "📈"
    }
  ];

  const processoSeletivo = [
    {
      etapa: 1,
      titulo: "Candidatura",
      descricao: "Envie seu currículo e portfólio",
      duracao: "1-2 dias"
    },
    {
      etapa: 2,
      titulo: "Triagem",
      descricao: "Análise inicial do perfil",
      duracao: "3-5 dias"
    },
    {
      etapa: 3,
      titulo: "Entrevista RH",
      descricao: "Conversa sobre expectativas e cultura",
      duracao: "1 semana"
    },
    {
      etapa: 4,
      titulo: "Teste Técnico",
      descricao: "Avaliação prática das habilidades",
      duracao: "1 semana"
    },
    {
      etapa: 5,
      titulo: "Entrevista Final",
      descricao: "Conversa com gestor e equipe",
      duracao: "1 semana"
    },
    {
      etapa: 6,
      titulo: "Proposta",
      descricao: "Apresentação da proposta de contratação",
      duracao: "2-3 dias"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica de envio do formulário
    console.log('Dados do formulário:', formData);
    alert('Candidatura enviada com sucesso! Entraremos em contato em breve.');
  };

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
              <a href="/" className="text-white hover:text-blue-200 font-medium">
                ← Voltar para Home
              </a>
              <h1 className="text-2xl font-bold text-white">Trabalhe Conosco</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Junte-se à Nossa Equipe
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Faça parte de uma empresa que está transformando a saúde no Brasil. 
              Buscamos pessoas apaixonadas por inovação e impacto social.
            </p>
            
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">4</div>
                <div className="text-blue-200 text-sm">Vagas Abertas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-blue-200 text-sm">Remoto</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">15+</div>
                <div className="text-blue-200 text-sm">Benefícios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-200 text-sm">Suporte</div>
              </div>
            </div>
          </div>
        </section>

        {/* Vagas Abertas */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Vagas Abertas</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Encontre a oportunidade perfeita para sua carreira
              </p>
            </div>

            <div className="space-y-8">
              {vagas.map((vaga) => (
                <div key={vaga.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{vaga.titulo}</h3>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <span className="bg-blue-600/50 text-blue-100 px-3 py-1 rounded-full text-sm">
                          {vaga.departamento}
                        </span>
                        <span className="bg-green-600/50 text-green-100 px-3 py-1 rounded-full text-sm">
                          {vaga.tipo}
                        </span>
                        <span className="bg-purple-600/50 text-purple-100 px-3 py-1 rounded-full text-sm">
                          {vaga.localizacao}
                        </span>
                        <span className="bg-yellow-600/50 text-yellow-100 px-3 py-1 rounded-full text-sm">
                          {vaga.nivel}
                        </span>
                      </div>
                      <p className="text-blue-100 leading-relaxed">{vaga.descricao}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Responsabilidades:</h4>
                      <ul className="space-y-2">
                        {vaga.responsabilidades.map((resp, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-blue-100 text-sm">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Requisitos:</h4>
                      <ul className="space-y-2">
                        {vaga.requisitos.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-blue-100 text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h4 className="text-lg font-bold text-white mb-3">Benefícios:</h4>
                    <div className="flex flex-wrap gap-2">
                      {vaga.beneficios.map((beneficio, index) => (
                        <span key={index} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                          {beneficio}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossos Benefícios</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Cuidamos do seu bem-estar e desenvolvimento profissional
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {beneficios.map((beneficio, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <div className="text-4xl mb-4">{beneficio.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{beneficio.categoria}</h3>
                  <ul className="space-y-2">
                    {beneficio.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-blue-100 text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cultura da Empresa */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nossa Cultura</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Os valores que guiam nossa forma de trabalhar
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cultura.map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.titulo}</h3>
                  <p className="text-blue-100 leading-relaxed">{item.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Processo Seletivo */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Processo Seletivo</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Como funciona nossa seleção de candidatos
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processoSeletivo.map((etapa) => (
                <div key={etapa.etapa} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                      {etapa.etapa}
                    </div>
                    <h3 className="text-xl font-bold text-white">{etapa.titulo}</h3>
                  </div>
                  <p className="text-blue-100 mb-3">{etapa.descricao}</p>
                  <span className="text-blue-200 text-sm font-medium">Duração: {etapa.duracao}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulário de Candidatura */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Candidatura Espontânea</h2>
              <p className="text-xl text-blue-100">
                Não encontrou a vaga ideal? Envie sua candidatura espontânea!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">E-mail *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Telefone</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Vaga de Interesse</label>
                    <select
                      name="vaga"
                      value={formData.vaga}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="">Selecione uma vaga</option>
                      {vagas.map((vaga) => (
                        <option key={vaga.id} value={vaga.titulo}>{vaga.titulo}</option>
                      ))}
                      <option value="outra">Outra</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Anos de Experiência</label>
                  <select
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Selecione</option>
                    <option value="estagiario">Estagiário</option>
                    <option value="junior">Júnior (0-2 anos)</option>
                    <option value="pleno">Pleno (2-5 anos)</option>
                    <option value="senior">Sênior (5+ anos)</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
                      placeholder="https://linkedin.com/in/seu-perfil"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Portfólio/GitHub</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
                      placeholder="https://github.com/seu-usuario"
                    />
                  </div>
                </div>

    <div>
                  <label className="block text-white font-medium mb-2">Mensagem</label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
                    placeholder="Conte-nos um pouco sobre você e por que gostaria de trabalhar na Vitalis..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Enviar Candidatura
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrabalheConosco;