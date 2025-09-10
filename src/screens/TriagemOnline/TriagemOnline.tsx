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
          
          // Montar array de perguntas e respostas
          const perguntas_respostas = relevantQuestions.map((question) => {
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
              pergunta_id: question.id,
              pergunta: question.text,
              resposta: resposta
            };
          });
          
          console.log('📋 Perguntas e respostas montadas:', perguntas_respostas);
          
          // IDs das perguntas respondidas
          const perguntas_respondidas = relevantQuestions.map(q => q.id);
          
          console.log('🔢 IDs das perguntas respondidas:', perguntas_respondidas);
          
          await triagemService.saveTriagem({
            paciente_id: Number(user.id),
            sintomas: analysisResult.symptoms,
            nivel_risco: analysisResult.riskLevel,
            especialidades_recomendadas: analysisResult.recommendedSpecialties,
            observacoes: analysisResult.recommendations.join('; '),
            data_triagem: new Date().toISOString(),
            perguntas_respostas: perguntas_respostas,
            perguntas_respondidas: perguntas_respondidas
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
      case 'muito_grave': return 'text-red-600 bg-red-100 border-red-300';
      case 'grave': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'moderado': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'leve': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
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
                <p className="text-gray-400 text-xs">Menos de 5 minutos</p>
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
                  <div className="text-2xl font-black text-white mb-1">15</div>
                  <div className="text-gray-400 text-xs font-medium">Perguntas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white mb-1">5min</div>
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

  if (showResult && result) {
    return (
      <div className="fixed inset-0 bg-blue-600 overflow-y-auto">
        <ExitButton />

        <div className="min-h-screen p-3">
          <div className="max-w-3xl mx-auto">
            <div className="text-center text-white mb-6">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-white">
                Análise Completa
              </h1>
              <p className="text-base text-white/90">
                Sua triagem foi analisada com sucesso pela nossa IA
              </p>
            </div>

            <div className="space-y-4">
              {/* Alerta de Emergência */}
              {result.alertMessage && (
                <div className="bg-red-500/20 border-2 border-red-500/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangleIcon className="w-6 h-6 text-red-400" />
                    <h4 className="text-lg font-bold text-red-200">ALERTA IMPORTANTE</h4>
                  </div>
                  <p className="text-red-100 text-base leading-relaxed font-medium">
                    {result.alertMessage}
                  </p>
                  {result.urgency === 'muito_grave' && (
                    <div className="mt-3 p-3 bg-red-600/30 rounded-lg">
                      <p className="text-red-100 text-sm font-bold">
                        🚑 CHAME 192 IMEDIATAMENTE OU DIRIJA-SE AO HOSPITAL MAIS PRÓXIMO
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Resultado Principal */}
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">Resultado da Triagem</h3>
                  {getUrgencyIcon(result.urgency)}
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">{result.riskPercentage}%</div>
                    <div className="text-white/80 mb-1 text-xs">Nível de Risco</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(result.riskLevel)}`}>
                      {getRiskLevelText(result.riskLevel)}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-xl font-bold text-white mb-1">{getUrgencyText(result.urgency)}</div>
                    <div className="text-white/80 mb-1 text-xs">Urgência</div>
                    <div className="text-xs text-white/80">{result.estimatedWaitTime}</div>
                  </div>
                  <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-xl font-bold text-white mb-1">{result.recommendedSpecialties.length}</div>
                    <div className="text-white/80 mb-1 text-xs">Especialidades</div>
                    <div className="text-xs text-white/80">Recomendadas</div>
                  </div>
                </div>
              </div>

              {/* Especialidades Recomendadas */}
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <StarIcon className="w-4 h-4 text-white" />
                  Especialidades Recomendadas
                </h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {result.recommendedSpecialties.map((specialty, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-300">
                      {getSpecialtyIcon(specialty)}
                      <div>
                        <div className="font-semibold text-white capitalize text-sm">{specialty}</div>
                        <div className="text-white/80 text-xs">Especialidade {index + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sintomas Detectados */}
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-white" />
                  Sintomas Detectados
                </h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {result.symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-red-500/20 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      <span className="text-white text-xs">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendações */}
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldIcon className="w-4 h-4 text-white" />
                  Recomendações
                </h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-500/20 rounded-lg">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-white text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <ZapIcon className="w-4 h-4 text-white" />
                  Próximos Passos
                </h3>
                <div className="space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-500/20 rounded-lg">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-white text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aviso Importante */}
              <div className="bg-yellow-500/20 border-2 border-yellow-500/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-base font-semibold text-yellow-200">Aviso Importante</h4>
                </div>
                <p className="text-yellow-100 text-sm leading-relaxed">
                  Esta triagem não substitui uma consulta médica. É uma ferramenta de avaliação inicial 
                  baseada em inteligência artificial. Sempre consulte um profissional de saúde para 
                  diagnóstico e tratamento adequados.
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={generatePDF}
                  variant="outline"
                  className="w-full py-3 text-base font-semibold border-2 border-white/30 hover:border-white/50 hover:bg-white/10 transition-all duration-300 bg-white/10 text-white"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Baixar Relatório Completo
                </Button>

                <Button
                  className="bg-white text-blue-600 hover:bg-gray-100 py-3 text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigate('/agendamento')}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </Button>
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
              <span className="text-white text-sm">{Math.max(1, Math.ceil((relevantQuestions.length - currentRelevantIndex - 1) * 0.3))} min restantes</span>
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
                        value={answers[question.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                        placeholder={question.description || "Conte pra gente..."}
                        className="w-full p-4 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all duration-300 resize-none text-sm"
                        rows={4}
                      />
                    </div>
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