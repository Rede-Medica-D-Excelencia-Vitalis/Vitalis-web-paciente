import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  StethoscopeIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  DownloadIcon,
  BrainIcon,
  HeartIcon,
  ActivityIcon,
  ClockIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  StarIcon,
  XIcon,
  HomeIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { triagemService, TriagemQuestion, TriagemResult } from '../../services/consultation/triagemService';
import { PDFService, TriagemPDFData } from '../../services/media/pdfService';
import { useAuthStore } from "../../store/auth/authStore";

export const TriagemOnline = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<TriagemQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriagemResult | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutos em segundos
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    loadQuestions();
    
    // Garantir que a triagem ocupe toda a tela sem interferências
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    
    // Cleanup ao sair do componente
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Temporizador de 7 minutos
  useEffect(() => {
    if (!started || showResult || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, showResult, loading]);

  // Formatar tempo para exibição (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const loadQuestions = async () => {
    try {
      const questionsData = await triagemService.getQuestions();
      setQuestions(questionsData);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    }
  };

  const getRelevantQuestions = () => {
    return questions.filter(question => {
      if (!question.dependsOn) return true;
      
      const dependentAnswer = answers[question.dependsOn.questionId];
      return dependentAnswer === question.dependsOn.answer;
    });
  };

  const handleAnswer = async (answer: string | string[]) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer
    };
    setAnswers(newAnswers);

    const relevantQuestions = getRelevantQuestions();
    const currentQuestionIndex = relevantQuestions.findIndex(q => q.id === questions[currentQuestion].id);

    if (currentQuestionIndex < relevantQuestions.length - 1) {
      // Encontrar a próxima pergunta relevante
      const nextRelevantQuestion = relevantQuestions[currentQuestionIndex + 1];
      const nextQuestionIndex = questions.findIndex(q => q.id === nextRelevantQuestion.id);
      setCurrentQuestion(nextQuestionIndex);
    } else {
      await analyzeTriagem(newAnswers);
    }
  };

  const analyzeTriagem = async (finalAnswers: Record<number, string | string[]>) => {
    setLoading(true);
    try {
      console.log('🔍 Iniciando análise da triagem...');
      const analysisResult = await triagemService.analyzeTriagem(finalAnswers);
      setResult(analysisResult);
      setShowResult(true);

      // Salvar triagem no backend
      if (user?.id) {
        console.log('💾 Salvando triagem para usuário:', user.id);
        try {
          // Obter perguntas relevantes que foram respondidas
          const relevantQuestions = getRelevantQuestions();
          
          console.log('🔍 Perguntas relevantes encontradas:', relevantQuestions);
          console.log('🔍 Respostas atuais:', answers);
          
          await triagemService.saveTriagem({
            paciente_id: Number(user.id),
            sintomas: analysisResult.symptoms,
            nivel_risco: analysisResult.riskLevel,
            especialidades_recomendadas: analysisResult.recommendedSpecialties,
            observacoes: analysisResult.recommendations.join('; '),
            data_triagem: new Date().toISOString()
          });
          console.log('✅ Triagem salva com sucesso no backend!');
        } catch (saveError) {
          console.error('❌ Erro ao salvar triagem no backend:', saveError);
          // Mostrar alerta para o usuário
          alert('A triagem foi analisada com sucesso, mas houve um problema ao salvar no sistema. Tente novamente mais tarde.');
        }
      } else {
        console.warn('⚠️ Usuário não identificado, não foi possível salvar a triagem');
      }
    } catch (error) {
      console.error('❌ Erro ao analisar triagem:', error);
      alert('Erro ao analisar a triagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    const relevantQuestions = getRelevantQuestions();
    const currentRelevantIndex = relevantQuestions.findIndex(q => q.id === questions[currentQuestion].id);
    
    if (currentRelevantIndex > 0) {
      const previousRelevantQuestion = relevantQuestions[currentRelevantIndex - 1];
      const previousQuestionIndex = questions.findIndex(q => q.id === previousRelevantQuestion.id);
      setCurrentQuestion(previousQuestionIndex);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'muito_grave': return 'text-red-700 bg-red-50 border border-red-200';
      case 'grave': return 'text-orange-700 bg-orange-50 border border-orange-200';
      case 'moderado': return 'text-yellow-700 bg-yellow-50 border border-yellow-200';
      case 'leve': return 'text-green-700 bg-green-50 border border-green-200';
      default: return 'text-gray-700 bg-gray-50 border border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'muito_grave': return <AlertTriangleIcon className="w-6 h-6 text-red-600" />;
      case 'grave': return <ActivityIcon className="w-6 h-6 text-orange-600" />;
      case 'moderado': return <ClockIcon className="w-6 h-6 text-yellow-600" />;
      case 'leve': return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      default: return <StethoscopeIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'muito_grave': return 'MUITO GRAVE';
      case 'grave': return 'GRAVE';
      case 'moderado': return 'MODERADO';
      case 'leve': return 'LEVE';
      default: return 'NÃO DEFINIDO';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'muito_grave': return 'EMERGÊNCIA';
      case 'grave': return 'URGENTE';
      case 'moderado': return 'ATENÇÃO';
      case 'leve': return 'ROTINA';
      default: return 'NÃO DEFINIDO';
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'cardiologia': return <HeartIcon className="w-4 h-4" />;
      case 'neurologia': return <BrainIcon className="w-4 h-4" />;
      case 'psicologia': return <BrainIcon className="w-4 h-4" />;
      default: return <StethoscopeIcon className="w-4 h-4" />;
    }
  };

  const generatePDF = async () => {
    if (!result || !user) return;

    try {
      // Obter perguntas relevantes que foram respondidas
      const relevantQuestions = getRelevantQuestions();
      
      // Montar array de perguntas e respostas
      const perguntas_respostas = relevantQuestions.map((question, index) => {
        const answer = answers[question.id];
        let resposta = '';
        
        if (Array.isArray(answer)) {
          resposta = answer.join(', ');
        } else if (typeof answer === 'string') {
          resposta = answer;
        } else {
          resposta = 'Não respondido';
        }
        
        return {
          pergunta: question.text,
          resposta: resposta
        };
      });

      // Preparar dados para o PDF
      const triagemData: TriagemPDFData = {
        paciente_nome: user.name || 'Paciente',
        data_triagem: new Date().toISOString(),
        nivel_risco: result.riskLevel,
        sintomas: result.symptoms,
        especialidades_recomendadas: result.recommendedSpecialties,
        observacoes: result.recommendations.join('; '),
        perguntas_respostas: perguntas_respostas
      };

      // Gerar e salvar PDF
      await PDFService.generateAndSavePDF(triagemData);
      
      console.log('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  // Botão de saída flutuante
  const ExitButton = () => (
    <button
      onClick={() => navigate('/home')}
      className="fixed top-6 left-6 z-50 w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 shadow-lg"
    >
      <XIcon className="w-6 h-6" />
    </button>
  );

  if (!started) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <ExitButton />

        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-30"></div>
        </div>

        <div className="relative h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mb-4 shadow-lg">
                <BrainIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
                Vamos Conversar
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Sobre Como Você Está
                </span>
              </h1>
              <p className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
                Conte pra gente o que está te incomodando e nossa IA vai te ajudar a entender 
                <span className="text-blue-400 font-semibold"> qual especialidade médica você precisa</span>
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center mb-2">
                  <SparklesIcon className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Conversa Natural</h3>
                <p className="text-gray-400 text-xs">Como falar com um amigo</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
                  <ShieldIcon className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Sem Pressão</h3>
                <p className="text-gray-400 text-xs">Responda no seu tempo</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-2">
                  <ZapIcon className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Rápido e Fácil</h3>
                <p className="text-gray-400 text-xs">Apenas 7 minutos</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mb-2">
                  <HeartIcon className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Cuidado Personalizado</h3>
                <p className="text-gray-400 text-xs">Recomendações específicas</p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-white mb-1">10</div>
                  <div className="text-gray-400 text-xs font-medium">Perguntas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white mb-1">7min</div>
                  <div className="text-gray-400 text-xs font-medium">Tempo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white mb-1">95%</div>
                  <div className="text-gray-400 text-xs font-medium">Precisão</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white mb-1">24/7</div>
                  <div className="text-gray-400 text-xs font-medium">Disponível</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => setStarted(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-base font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Vamos Começar a Conversar
              </Button>
              <p className="text-gray-400 mt-3 text-xs">
                💬 Conversa Natural • ⚡ Rápido • 🔒 Seguro
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detectar scroll para esconder a seta
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollTop > 100) {
      setShowScrollIndicator(false);
    } else {
      setShowScrollIndicator(true);
    }
  };

  if (showResult && result) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 overflow-hidden">
        <ExitButton />

        {/* Seta Indicadora de Scroll */}
        {showScrollIndicator && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/30">
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        )}

        {/* Ícones Médicos Animados no Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 animate-float-slow opacity-10">
            <HeartIcon className="w-24 h-24 text-white" />
          </div>
          <div className="absolute top-40 right-20 animate-float-medium opacity-10">
            <StethoscopeIcon className="w-20 h-20 text-white" />
          </div>
          <div className="absolute bottom-32 left-16 animate-float-fast opacity-10">
            <ActivityIcon className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-1/3 right-10 animate-float-slow opacity-10">
            <BrainIcon className="w-28 h-28 text-white" />
          </div>
          <div className="absolute bottom-20 right-32 animate-float-medium opacity-10">
            <HeartIcon className="w-20 h-20 text-white" />
          </div>
          <div className="absolute top-1/4 left-1/4 animate-float-fast opacity-10">
            <SparklesIcon className="w-16 h-16 text-white" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-slow opacity-10">
            <ShieldIcon className="w-24 h-24 text-white" />
          </div>
          <div className="absolute top-2/3 right-1/4 animate-float-medium opacity-10">
            <StarIcon className="w-18 h-18 text-white" />
          </div>
        </div>

        <div 
          className="relative w-full h-full overflow-y-auto triagem-scrollbar z-20"
          onScroll={handleScroll}
        >
          <div className="min-h-screen p-6 py-8">
            <div className="max-w-5xl mx-auto">
            
            {/* Header Profissional com Fundo Azul */}
            <div className="text-center mb-8 pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              </div>
              
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full mb-4 text-sm font-semibold border border-white/30">
                ✓ Triagem Concluída
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                Resultado da Análise
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Sua triagem foi analisada com sucesso pelo sistema Vitalis
              </p>
              
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <ClockIcon className="w-4 h-4 text-white/80" />
                <span className="text-white text-sm font-medium">Tempo: {formatTime(420 - timeLeft)}</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Alerta de Emergência */}
              {result.alertMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-red-900 mb-2">Alerta Importante</h4>
                      <p className="text-red-800 leading-relaxed">
                        {result.alertMessage}
                      </p>
                      {result.urgency === 'muito_grave' && (
                        <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-300">
                          <p className="text-red-900 font-bold text-center">
                            🚑 CHAME 192 IMEDIATAMENTE OU DIRIJA-SE AO HOSPITAL MAIS PRÓXIMO
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Resultado Principal */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ActivityIcon className="w-6 h-6 text-blue-600" />
                    Resumo da Triagem
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{result.riskPercentage}%</div>
                    <div className="text-gray-600 mb-2 text-sm font-medium">Nível de Risco</div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getRiskLevelColor(result.riskLevel)}`}>
                      {getRiskLevelText(result.riskLevel)}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600 mb-2">{getUrgencyText(result.urgency)}</div>
                    <div className="text-gray-600 mb-2 text-sm font-medium">Urgência</div>
                    <div className="text-sm text-gray-700 font-medium">{result.estimatedWaitTime}</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">{result.recommendedSpecialties.length}</div>
                    <div className="text-gray-600 mb-2 text-sm font-medium">Especialidades</div>
                    <div className="text-sm text-gray-700 font-medium">Recomendadas</div>
                  </div>
                </div>
              </div>

              {/* Especialidades Recomendadas */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <StethoscopeIcon className="w-5 h-5 text-indigo-600" />
                  Especialidades Recomendadas
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.recommendedSpecialties.map((specialty, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <StethoscopeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 capitalize">{specialty}</div>
                        <div className="text-indigo-600 text-xs">Especialidade Indicada</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sintomas Detectados */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ActivityIcon className="w-5 h-5 text-red-600" />
                  Sintomas Identificados
                </h3>
                {result.symptoms && result.symptoms.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-2">
                    {result.symptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{symptom}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Nenhum sintoma específico foi identificado nesta triagem.</span>
                  </div>
                )}
              </div>

              {/* Recomendações */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldIcon className="w-5 h-5 text-blue-600" />
                  Recomendações Médicas
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ZapIcon className="w-5 h-5 text-green-600" />
                  Próximos Passos
                </h3>
                <div className="space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aviso Importante */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">Aviso Importante</h4>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      Esta triagem <span className="font-bold">não substitui uma consulta médica</span>. É uma ferramenta de avaliação inicial. 
                      Sempre consulte um profissional de saúde para diagnóstico e tratamento adequados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-3 pt-4 pb-8">
                <Button
                  onClick={generatePDF}
                  variant="outline"
                  className="w-full py-4 text-base font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Baixar Relatório em PDF
                </Button>

                <Button
                  className="w-full py-4 text-base font-bold rounded-lg shadow-md hover:shadow-lg transition-all bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/agendamento')}
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Agendar Consulta
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-blue-600 flex items-center justify-center">
        <ExitButton />

        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold mb-4">
            Analisando o que você contou...
          </h3>
          <p className="text-lg text-white/80 leading-relaxed max-w-md mx-auto">
            Nossa IA está processando todas as informações para te dar a melhor recomendação.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-blue-600 flex items-center justify-center">
        <ExitButton />

        <div className="text-center text-white">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-48 mx-auto mb-3"></div>
            <div className="h-4 bg-white/20 rounded w-32 mx-auto"></div>
          </div>
          <p className="text-white/80 mt-6 text-sm">Preparando nossa conversa...</p>
        </div>
      </div>
    );
  }

  const relevantQuestions = getRelevantQuestions();
  const currentRelevantIndex = relevantQuestions.findIndex(q => q.id === questions[currentQuestion].id);
  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-y-auto">
      <ExitButton />

      <div className="min-h-screen flex flex-col">
        {/* Header com Progresso */}
        <div className="p-4 pt-16">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-medium">Pergunta {currentRelevantIndex + 1} de {relevantQuestions.length}</span>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-white" />
                <span className={`text-sm font-bold ${timeLeft < 60 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentRelevantIndex + 1) / relevantQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            {/* Pergunta Principal */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                <span className="text-white font-bold text-lg">{currentRelevantIndex + 1}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 leading-tight">
                {question.text}
              </h2>
              {question.description && (
                <p className="text-white/80 text-sm leading-relaxed">
                  {question.description}
                </p>
              )}
            </div>

            {/* Área de Resposta */}
            <div className="space-y-4">
              {question.type === 'text' ? (
                // Resposta de Texto - Layout Conversacional
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="space-y-4">
                    <div className="text-center">
                      <textarea
                        value={answers[question.id] === 'Não se aplica' ? '' : (answers[question.id] || '')}
                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                        placeholder={question.description || "Conte pra gente..."}
                        className="w-full p-4 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all duration-300 resize-none text-sm"
                        rows={4}
                        disabled={answers[question.id] === 'Não se aplica'}
                      />
                    </div>
                    
                    {/* Checkbox "Não se aplica" se a pergunta tiver options */}
                    {question.options && question.options.includes('Não se aplica') && (
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="checkbox"
                          id={`nao-se-aplica-${question.id}`}
                          checked={answers[question.id] === 'Não se aplica'}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAnswers({ ...answers, [question.id]: 'Não se aplica' });
                            } else {
                              setAnswers({ ...answers, [question.id]: '' });
                            }
                          }}
                          className="w-4 h-4 rounded border-2 border-white/40 bg-white/10 checked:bg-white checked:border-white"
                        />
                        <label 
                          htmlFor={`nao-se-aplica-${question.id}`}
                          className="text-white text-sm cursor-pointer"
                        >
                          Não se aplica
                        </label>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => {
                        const relevantQuestions = getRelevantQuestions();
                        const currentQuestionIndex = relevantQuestions.findIndex(q => q.id === questions[currentQuestion].id);
                        
                        if (currentQuestionIndex < relevantQuestions.length - 1) {
                          const nextRelevantQuestion = relevantQuestions[currentQuestionIndex + 1];
                          const nextQuestionIndex = questions.findIndex(q => q.id === nextRelevantQuestion.id);
                          setCurrentQuestion(nextQuestionIndex);
                        } else {
                          analyzeTriagem(answers);
                        }
                      }}
                      className="w-full py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300"
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              ) : question.type === 'multiselect' ? (
                // Layout Conversacional - Cards Simples
                <div className="space-y-4">
                  {/* Sintomas Selecionados - Barra Fixa */}
                  {(answers[question.id] as string[] || []).length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm">Você selecionou: {selectedOptions.length}</span>
                        <button
                          onClick={() => {
                            setAnswers({ ...answers, [question.id]: [] });
                            setSelectedOptions([]);
                          }}
                          className="text-white/70 text-xs hover:text-white"
                        >
                          Limpar
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(answers[question.id] as string[] || []).slice(0, 3).map((symptom, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full text-xs"
                          >
                            <span>{symptom}</span>
                            <button
                              onClick={() => {
                                const currentAnswers = answers[question.id] as string[] || [];
                                const newAnswers = currentAnswers.filter((_, i) => i !== index);
                                setAnswers({ ...answers, [question.id]: newAnswers });
                                setSelectedOptions(newAnswers);
                              }}
                              className="w-3 h-3 bg-white/30 rounded-full flex items-center justify-center hover:bg-white/50"
                            >
                              <span className="text-xs">×</span>
                            </button>
                          </div>
                        ))}
                        {(answers[question.id] as string[] || []).length > 3 && (
                          <div className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                            +{(answers[question.id] as string[] || []).length - 3} mais
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cards de Opções - Layout Horizontal com Emojis */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-4 text-sm text-center">Marque o que se aplica:</h4>
                    
                    {/* Layout Horizontal para Sintomas Associados */}
                    {question.id === 4 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {question.options?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const currentAnswers = answers[question.id] as string[] || [];
                              const newAnswers = currentAnswers.includes(option)
                                ? currentAnswers.filter(a => a !== option)
                                : [...currentAnswers, option];
                              setAnswers({ ...answers, [question.id]: newAnswers });
                              setSelectedOptions(newAnswers);
                            }}
                            className={`p-4 rounded-xl transition-all duration-300 text-center ${
                              (answers[question.id] as string[] || []).includes(option)
                                ? 'bg-white/30 text-white border-2 border-white'
                                : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                            }`}
                          >
                            <div className="text-2xl mb-2">
                              {option === 'Febre ou calafrios' && '🌡️'}
                              {option === 'Náusea ou vômito' && '🤢'}
                              {option === 'Tontura' && '💫'}
                              {option === 'Falta de ar' && '🫁'}
                              {option === 'Fadiga extrema' && '😴'}
                              {option === 'Ansiedade' && '😰'}
                              {option === 'Problemas para dormir' && '😵‍💫'}
                              {option === 'Perda de apetite' && '🍽️'}
                              {option === 'Suor excessivo' && '💦'}
                              {option === 'Tremores' && '🫨'}
                              {option === 'Nada mais' && '✅'}
                            </div>
                            <div className="text-xs font-medium">{option}</div>
                          </button>
                        ))}
                      </div>
                    ) : question.id === 5 ? (
                      /* Layout Horizontal para Localização */
                      <div className="grid grid-cols-3 gap-3">
                        {question.options?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const currentAnswers = answers[question.id] as string[] || [];
                              const newAnswers = currentAnswers.includes(option)
                                ? currentAnswers.filter(a => a !== option)
                                : [...currentAnswers, option];
                              setAnswers({ ...answers, [question.id]: newAnswers });
                              setSelectedOptions(newAnswers);
                            }}
                            className={`p-3 rounded-xl transition-all duration-300 text-center ${
                              (answers[question.id] as string[] || []).includes(option)
                                ? 'bg-white/30 text-white border-2 border-white'
                                : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                            }`}
                          >
                            <div className="text-xl mb-1">
                              {option === 'Cabeça' && '🧠'}
                              {option === 'Pescoço' && '👤'}
                              {option === 'Peito' && '💙'}
                              {option === 'Costas' && '🦴'}
                              {option === 'Barriga' && '🤰'}
                              {option === 'Braços' && '💪'}
                              {option === 'Pernas' && '🦵'}
                              {option === 'Todo o corpo' && '👤'}
                              {option === 'Não sei ao certo' && '❓'}
                            </div>
                            <div className="text-xs font-medium">{option}</div>
                          </button>
                        ))}
                      </div>
                    ) : question.id === 9 ? (
                      /* Layout Horizontal para Impacto */
                      <div className="grid grid-cols-2 gap-3">
                        {question.options?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const currentAnswers = answers[question.id] as string[] || [];
                              const newAnswers = currentAnswers.includes(option)
                                ? currentAnswers.filter(a => a !== option)
                                : [...currentAnswers, option];
                              setAnswers({ ...answers, [question.id]: newAnswers });
                              setSelectedOptions(newAnswers);
                            }}
                            className={`p-3 rounded-xl transition-all duration-300 text-center ${
                              (answers[question.id] as string[] || []).includes(option)
                                ? 'bg-white/30 text-white border-2 border-white'
                                : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                            }`}
                          >
                            <div className="text-xl mb-1">
                              {option === 'Trabalhar' && '💼'}
                              {option === 'Dormir' && '😴'}
                              {option === 'Comer normalmente' && '🍽️'}
                              {option === 'Fazer exercícios' && '🏃'}
                              {option === 'Sair de casa' && '🏠'}
                              {option === 'Concentrar' && '🧠'}
                              {option === 'Nada, consigo fazer tudo normal' && '✅'}
                            </div>
                            <div className="text-xs font-medium">{option}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* Layout Vertical para outras perguntas multiselect */
                      <div className="space-y-2">
                        {question.options?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const currentAnswers = answers[question.id] as string[] || [];
                              const newAnswers = currentAnswers.includes(option)
                                ? currentAnswers.filter(a => a !== option)
                                : [...currentAnswers, option];
                              setAnswers({ ...answers, [question.id]: newAnswers });
                              setSelectedOptions(newAnswers);
                            }}
                            className={`w-full p-3 rounded-lg transition-all duration-300 text-left ${
                              (answers[question.id] as string[] || []).includes(option)
                                ? 'bg-white/30 text-white border-2 border-white'
                                : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                (answers[question.id] as string[] || []).includes(option)
                                  ? 'bg-white border-white'
                                  : 'border-white/40'
                              }`}>
                                {(answers[question.id] as string[] || []).includes(option) && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                              <span className="text-sm">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botão Continuar */}
                  <Button
                    onClick={() => handleAnswer(selectedOptions)}
                    disabled={selectedOptions.length === 0}
                    className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                      selectedOptions.length === 0
                        ? 'opacity-50 cursor-not-allowed bg-gray-500'
                        : 'bg-white text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    Continuar
                  </Button>
                </div>
              ) : (
                // Escolha Única - Layout Conversacional
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        answers[question.id] === option
                          ? 'bg-white/20 border-white text-white'
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          answers[question.id] === option
                            ? 'bg-white border-white'
                            : 'border-white/40'
                        }`}>
                          {answers[question.id] === option && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium text-sm">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navegação */}
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentRelevantIndex === 0}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentRelevantIndex === 0
                    ? 'opacity-50 cursor-not-allowed bg-white/10 text-white/50'
                    : 'bg-red-500/20 text-white hover:bg-red-500/30'
                }`}
              >
                ← Voltar
              </Button>

              <div className="text-center text-white/70">
                <div className="text-sm">Tempo estimado</div>
                <div className="text-xs">
                  {Math.max(1, Math.ceil((relevantQuestions.length - currentRelevantIndex - 1) * 0.3))} min
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex items-center justify-center gap-4 text-white/60 text-xs">
              <div className="flex items-center gap-1">
                <ShieldIcon className="w-3 h-3" />
                <span>Dados Seguros</span>
              </div>
              <div className="flex items-center gap-1">
                <BrainIcon className="w-3 h-3" />
                <span>Conversa Natural</span>
              </div>
              <div className="flex items-center gap-1">
                <ZapIcon className="w-3 h-3" />
                <span>Rápido e Fácil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};