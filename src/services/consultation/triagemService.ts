import { api } from "../../lib/api";

export interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: number;
  specialties: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface TriagemQuestion {
  id: number;
  text: string;
  type: 'yesno' | 'select' | 'multiselect' | 'scale' | 'text';
  options?: string[];
  description?: string;
  symptoms: string[];
  weight: number;
  category: string;
  dependsOn?: { questionId: number; answer: any };
  followUp?: TriagemQuestion[];
}

export interface TriagemResult {
  riskLevel: 'leve' | 'moderado' | 'grave' | 'muito_grave';
  riskPercentage: number;
  recommendedSpecialties: string[];
  urgency: 'leve' | 'moderado' | 'grave' | 'muito_grave';
  recommendations: string[];
  symptoms: string[];
  shouldSeekImmediateCare: boolean;
  estimatedWaitTime: string;
  nextSteps: string[];
  alertMessage?: string;
}

export interface TriagemData {
  paciente_id: number;
  sintomas: string[];
  nivel_risco: string;
  especialidades_recomendadas: string[];
  observacoes: string;
  data_triagem: string;
  perguntas_respostas?: Array<{
    pergunta_id: number;
    pergunta: string;
    resposta: string;
  }>;
  perguntas_respondidas?: number[];
}

class TriagemService {
  private symptoms: Symptom[] = [
    // Sintomas Críticos
    { id: 'dor_peito_intensa', name: 'Dor no peito intensa e súbita', category: 'cardiovascular', severity: 5, specialties: ['cardiologia', 'emergência'], urgency: 'critical' },
    { id: 'falta_ar_grave', name: 'Falta de ar grave', category: 'respiratório', severity: 5, specialties: ['pneumologia', 'emergência'], urgency: 'critical' },
    { id: 'desmaio', name: 'Desmaio ou perda de consciência', category: 'neurológico', severity: 5, specialties: ['neurologia', 'emergência'], urgency: 'critical' },
    { id: 'convulsao', name: 'Convulsão', category: 'neurológico', severity: 5, specialties: ['neurologia', 'emergência'], urgency: 'critical' },
    { id: 'sangramento_intenso', name: 'Sangramento intenso', category: 'cirúrgico', severity: 5, specialties: ['cirurgia', 'emergência'], urgency: 'critical' },
    { id: 'trauma_cabeca', name: 'Trauma na cabeça', category: 'neurológico', severity: 5, specialties: ['neurologia', 'emergência'], urgency: 'critical' },
    
    // Sintomas de Alto Risco
    { id: 'febre_alta', name: 'Febre alta (>39°C)', category: 'infeccioso', severity: 4, specialties: ['clínico geral', 'infectologia'], urgency: 'high' },
    { id: 'dor_cabeca_intensa', name: 'Dor de cabeça intensa e súbita', category: 'neurológico', severity: 4, specialties: ['neurologia', 'clínico geral'], urgency: 'high' },
    { id: 'vomito_persistente', name: 'Vômito persistente', category: 'gastrointestinal', severity: 4, specialties: ['gastroenterologia', 'clínico geral'], urgency: 'high' },
    { id: 'tontura_severa', name: 'Tontura severa com náusea', category: 'neurológico', severity: 4, specialties: ['neurologia', 'otorrinolaringologia'], urgency: 'high' },
    { id: 'dor_abdominal_intensa', name: 'Dor abdominal intensa', category: 'gastrointestinal', severity: 4, specialties: ['gastroenterologia', 'cirurgia'], urgency: 'high' },
    { id: 'paralisia', name: 'Paralisia ou fraqueza súbita', category: 'neurológico', severity: 4, specialties: ['neurologia', 'emergência'], urgency: 'high' },
    { id: 'dificuldade_falar', name: 'Dificuldade para falar', category: 'neurológico', severity: 4, specialties: ['neurologia', 'emergência'], urgency: 'high' },
    { id: 'alteracao_visao', name: 'Alteração súbita na visão', category: 'oftalmológico', severity: 4, specialties: ['oftalmologia', 'neurologia'], urgency: 'high' },
    
    // Sintomas de Risco Moderado
    { id: 'febre_moderada', name: 'Febre moderada (37.5-39°C)', category: 'infeccioso', severity: 3, specialties: ['clínico geral', 'pediatria'], urgency: 'medium' },
    { id: 'dor_abdominal', name: 'Dor abdominal moderada', category: 'gastrointestinal', severity: 3, specialties: ['gastroenterologia', 'clínico geral'], urgency: 'medium' },
    { id: 'tosse_persistente', name: 'Tosse persistente', category: 'respiratório', severity: 3, specialties: ['pneumologia', 'clínico geral'], urgency: 'medium' },
    { id: 'fadiga_extrema', name: 'Fadiga extrema', category: 'geral', severity: 3, specialties: ['clínico geral', 'endocrinologia'], urgency: 'medium' },
    { id: 'ansiedade_severa', name: 'Ansiedade severa', category: 'psicológico', severity: 3, specialties: ['psicologia', 'psiquiatria'], urgency: 'medium' },
    { id: 'insonia_cronica', name: 'Insônia crônica', category: 'psicológico', severity: 3, specialties: ['psicologia', 'psiquiatria'], urgency: 'medium' },
    { id: 'dor_costas', name: 'Dor nas costas intensa', category: 'ortopédico', severity: 3, specialties: ['ortopedia', 'fisioterapia'], urgency: 'medium' },
    { id: 'infeccao_urinaria', name: 'Sintomas de infecção urinária', category: 'urológico', severity: 3, specialties: ['urologia', 'clínico geral'], urgency: 'medium' },
    
    // Sintomas Leves
    { id: 'dor_cabeca_leve', name: 'Dor de cabeça leve', category: 'geral', severity: 2, specialties: ['clínico geral'], urgency: 'low' },
    { id: 'nausea', name: 'Náusea leve', category: 'gastrointestinal', severity: 2, specialties: ['clínico geral', 'gastroenterologia'], urgency: 'low' },
    { id: 'tosse_leve', name: 'Tosse leve', category: 'respiratório', severity: 2, specialties: ['clínico geral', 'pneumologia'], urgency: 'low' },
    { id: 'insonia_leve', name: 'Insônia leve', category: 'psicológico', severity: 2, specialties: ['psicologia', 'clínico geral'], urgency: 'low' },
    { id: 'estresse', name: 'Estresse', category: 'psicológico', severity: 1, specialties: ['psicologia'], urgency: 'low' },
    { id: 'dor_muscular', name: 'Dor muscular', category: 'ortopédico', severity: 2, specialties: ['ortopedia', 'fisioterapia'], urgency: 'low' },
    { id: 'alergia', name: 'Sintomas alérgicos', category: 'alergológico', severity: 2, specialties: ['alergologia', 'clínico geral'], urgency: 'low' }
  ];

  private questions: TriagemQuestion[] = [
    // 1. Pergunta inicial - Mais conversacional
    {
      id: 1,
      text: "Oi! Como você está se sentindo hoje?",
      type: "text",
      description: "Conte pra gente o que está te incomodando...",
      symptoms: [],
      weight: 3,
      category: "principal"
    },

    // 2. Pergunta sobre intensidade - Mais natural
    {
      id: 2,
      text: "E essa dor/desconforto, como você classificaria?",
      type: "select",
      options: [
        "Leve - incomoda mas não atrapalha muito",
        "Moderada - atrapalha as atividades do dia",
        "Forte - difícil de ignorar",
        "Muito forte - quase insuportável"
      ],
      symptoms: [],
      weight: 4,
      category: "intensidade"
    },

    // 3. Pergunta sobre duração - Conversacional
    {
      id: 3,
      text: "Faz quanto tempo que você está assim?",
      type: "select",
      options: [
        "Algumas horas",
        "1-2 dias",
        "3-7 dias",
        "Mais de uma semana",
        "Vai e volta há tempos"
      ],
      symptoms: [],
      weight: 3,
      category: "duracao"
    },

    // 4. Pergunta sobre sintomas associados - Natural
    {
      id: 4,
      text: "Além disso, você está sentindo mais alguma coisa?",
      type: "multiselect",
      options: [
        "Febre ou calafrios",
        "Náusea ou vômito",
        "Tontura",
        "Falta de ar",
        "Fadiga extrema",
        "Ansiedade",
        "Problemas para dormir",
        "Perda de apetite",
        "Suor excessivo",
        "Tremores",
        "Nada mais"
      ],
      symptoms: ["febre_moderada", "febre_alta", "nausea", "vomito_persistente", "tontura_severa", "falta_ar_grave", "fadiga_extrema", "ansiedade_severa", "insonia_cronica"],
      weight: 3,
      category: "sintomas_associados"
    },

    // 5. Pergunta sobre localização - Conversacional
    {
      id: 5,
      text: "Onde exatamente você está sentindo isso?",
      type: "multiselect",
      options: [
        "Cabeça",
        "Pescoço",
        "Peito",
        "Costas",
        "Barriga",
        "Braços",
        "Pernas",
        "Todo o corpo",
        "Não sei ao certo"
      ],
      symptoms: ["dor_cabeca_intensa", "dor_peito_intensa", "dor_abdominal_intensa", "dor_costas"],
      weight: 3,
      category: "localizacao"
    },

    // 6. Pergunta sobre gatilhos - Natural
    {
      id: 6,
      text: "O que piora ou melhora essa sensação?",
      type: "multiselect",
      options: [
        "Piora com movimento",
        "Piora ao respirar",
        "Piora ao comer",
        "Piora com estresse",
        "Melhora com repouso",
        "Melhora com medicamento",
        "Não muda com nada",
        "Varia muito"
      ],
      symptoms: [],
      weight: 2,
      category: "gatilhos"
    },

    // 7. Pergunta sobre histórico - Conversacional
    {
      id: 7,
      text: "Você já teve algo parecido antes?",
      type: "select",
      options: [
        "Sim, várias vezes",
        "Sim, uma ou duas vezes",
        "Não, é a primeira vez",
        "Não lembro"
      ],
      symptoms: [],
      weight: 2,
      category: "historico"
    },

    // 8. Pergunta sobre medicamentos - Natural
    {
      id: 8,
      text: "Você está tomando algum remédio ou tem alguma condição de saúde?",
      type: "text",
      description: "Pode ser qualquer coisa que você acha importante mencionar...",
      symptoms: [],
      weight: 2,
      category: "medicamentos"
    },

    // 9. Pergunta sobre impacto - Conversacional
    {
      id: 9,
      text: "Isso está te impedindo de fazer alguma coisa?",
      type: "multiselect",
      options: [
        "Trabalhar",
        "Dormir",
        "Comer normalmente",
        "Fazer exercícios",
        "Sair de casa",
        "Concentrar",
        "Nada, consigo fazer tudo normal"
      ],
      symptoms: [],
      weight: 2,
      category: "impacto"
    },

    // 10. Pergunta sobre urgência - Natural
    {
      id: 10,
      text: "Você acha que precisa de ajuda médica agora?",
      type: "select",
      options: [
        "Sim, urgentemente",
        "Sim, mas pode esperar",
        "Não tenho certeza",
        "Não, só quero saber o que pode ser"
      ],
      symptoms: [],
      weight: 4,
      category: "urgencia"
    },

    // 11. Pergunta específica para dor no peito - Conversacional
    {
      id: 11,
      text: "Essa dor no peito, como é?",
      type: "select",
      options: [
        "Como uma pressão ou peso",
        "Como uma pontada",
        "Como uma queimação",
        "Como uma dor que vai pro braço",
        "Não sei descrever"
      ],
      symptoms: ["dor_peito_intensa"],
      weight: 5,
      category: "cardiovascular",
      dependsOn: { questionId: 5, answer: "Peito" }
    },

    // 12. Pergunta específica para dor de cabeça - Natural
    {
      id: 12,
      text: "E essa dor de cabeça, onde é mais forte?",
      type: "select",
      options: [
        "Em toda a cabeça",
        "Só de um lado",
        "Na testa",
        "Atrás dos olhos",
        "Na nuca",
        "Não sei ao certo"
      ],
      symptoms: ["dor_cabeca_intensa"],
      weight: 4,
      category: "neurológico",
      dependsOn: { questionId: 5, answer: "Cabeça" }
    },

    // 13. Pergunta específica para dor abdominal - Conversacional
    {
      id: 13,
      text: "Essa dor na barriga, em que parte é mais forte?",
      type: "select",
      options: [
        "No centro",
        "Do lado direito",
        "Do lado esquerdo",
        "Em cima",
        "Em baixo",
        "Em toda a barriga"
      ],
      symptoms: ["dor_abdominal_intensa"],
      weight: 4,
      category: "gastrointestinal",
      dependsOn: { questionId: 5, answer: "Barriga" }
    },

    // 14. Pergunta sobre sintomas de emergência - Natural
    {
      id: 14,
      text: "Você está sentindo alguma dessas coisas?",
      type: "multiselect",
      options: [
        "Desmaio ou quase desmaio",
        "Dificuldade para falar",
        "Paralisia ou fraqueza súbita",
        "Alteração na visão",
        "Convulsão",
        "Sangramento intenso",
        "Nenhuma dessas"
      ],
      symptoms: ["desmaio", "dificuldade_falar", "paralisia", "alteracao_visao", "convulsao", "sangramento_intenso"],
      weight: 5,
      category: "emergencia"
    },

    // 15. Pergunta final - Conversacional
    {
      id: 15,
      text: "Tem mais alguma coisa que você gostaria de contar?",
      type: "text",
      description: "Qualquer detalhe que você acha importante...",
      symptoms: [],
      weight: 1,
      category: "final"
    }
  ];

  private analyzeSymptoms(answers: Record<number, any>): TriagemResult {
    let totalScore = 0;
    let maxScore = 0;
    const detectedSymptoms: string[] = [];
    const specialtyScores: Record<string, number> = {};

    // Analisar cada resposta
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = this.questions.find(q => q.id === parseInt(questionId));
      if (!question) return;

      maxScore += question.weight * 5; // Score máximo por pergunta

      if (question.type === 'select' && answer) {
        // Mapeamento específico de sintomas baseado na resposta
        let symptomMapping: Record<string, string[]> = {};
        
        if (question.id === 2) { // Intensidade
          symptomMapping = {
            'Leve - incomoda mas não atrapalha muito': [],
            'Moderada - atrapalha as atividades do dia': [],
            'Forte - difícil de ignorar': [],
            'Muito forte - quase insuportável': []
          };
          // Ajustar score baseado na intensidade
          if (answer === 'Leve - incomoda mas não atrapalha muito') {
            totalScore += question.weight * 1;
          } else if (answer === 'Moderada - atrapalha as atividades do dia') {
            totalScore += question.weight * 2;
          } else if (answer === 'Forte - difícil de ignorar') {
            totalScore += question.weight * 3;
          } else if (answer === 'Muito forte - quase insuportável') {
            totalScore += question.weight * 4;
          }
        } else if (question.id === 3) { // Duração
          symptomMapping = {
            'Algumas horas': [],
            '1-2 dias': [],
            '3-7 dias': [],
            'Mais de uma semana': [],
            'Vai e volta há tempos': []
          };
          // Ajustar score baseado na duração
          if (answer === 'Algumas horas') {
            totalScore += question.weight * 3; // Sintomas súbitos são mais preocupantes
          } else if (answer === '1-2 dias') {
            totalScore += question.weight * 2;
          } else if (answer === '3-7 dias') {
            totalScore += question.weight * 1.5;
          } else if (answer === 'Mais de uma semana') {
            totalScore += question.weight * 1;
          } else if (answer === 'Vai e volta há tempos') {
            totalScore += question.weight * 0.5; // Sintomas crônicos menos urgentes
          }
        } else if (question.id === 4) { // Sintomas associados
          symptomMapping = {
            'Febre ou calafrios': ['febre_moderada', 'febre_alta'],
            'Náusea ou vômito': ['nausea', 'vomito_persistente'],
            'Tontura': ['tontura_severa'],
            'Falta de ar': ['falta_ar_grave'],
            'Fadiga extrema': ['fadiga_extrema'],
            'Ansiedade': ['ansiedade_severa'],
            'Problemas para dormir': ['insonia_cronica'],
            'Perda de apetite': ['nausea'],
            'Suor excessivo': [],
            'Tremores': [],
            'Nada mais': []
          };
        } else if (question.id === 5) { // Localização
          symptomMapping = {
            'Cabeça': ['dor_cabeca_intensa'],
            'Peito': ['dor_peito_intensa'],
            'Barriga': ['dor_abdominal_intensa'],
            'Costas': ['dor_costas']
          };
        } else if (question.id === 6) { // Gatilhos
          symptomMapping = {
            'Piora com movimento': [],
            'Piora ao respirar': [],
            'Piora ao comer': [],
            'Piora com estresse': [],
            'Melhora com repouso': [],
            'Melhora com medicamento': [],
            'Não muda com nada': [],
            'Varia muito': []
          };
        } else if (question.id === 7) { // Histórico
          symptomMapping = {
            'Sim, várias vezes': [],
            'Sim, uma ou duas vezes': [],
            'Não, é a primeira vez': [],
            'Não lembro': []
          };
          // Ajustar score baseado no histórico
          if (answer === 'Não, é a primeira vez') {
            totalScore += question.weight * 2; // Primeira vez pode ser mais preocupante
          } else if (answer === 'Sim, várias vezes') {
            totalScore += question.weight * 0.5; // Recorrente pode ser menos urgente
          }
        } else if (question.id === 8) { // Medicamentos
          symptomMapping = {
            'Sim, estou tomando medicamentos': [],
            'Não, não estou tomando medicamentos': [],
            'Não sei': []
          };
        } else if (question.id === 9) { // Impacto
          symptomMapping = {
            'Trabalhar': [],
            'Dormir': [],
            'Comer normalmente': [],
            'Fazer exercícios': [],
            'Sair de casa': [],
            'Concentrar': [],
            'Nada, consigo fazer tudo normal': []
          };
          // Ajustar score baseado no impacto
          if (answer === 'Nada, consigo fazer tudo normal') {
            totalScore += question.weight * 0.5; // Menos impacto = menos urgente
          } else {
            totalScore += question.weight * 2; // Mais impacto = mais urgente
          }
        } else if (question.id === 10) { // Urgência
          symptomMapping = {
            'Sim, urgentemente': [],
            'Sim, mas pode esperar': [],
            'Não tenho certeza': [],
            'Não, só quero saber o que pode ser': []
          };
          // Ajustar score baseado na percepção de urgência
          if (answer === 'Sim, urgentemente') {
            totalScore += question.weight * 4;
          } else if (answer === 'Sim, mas pode esperar') {
            totalScore += question.weight * 2;
          } else if (answer === 'Não tenho certeza') {
            totalScore += question.weight * 1;
          } else {
            totalScore += question.weight * 0.5;
          }
        }

        // Adicionar sintomas detectados
        if (symptomMapping[answer]) {
          detectedSymptoms.push(...symptomMapping[answer]);
        }

        // Adicionar score baseado no peso da pergunta
        totalScore += question.weight;
      } else if (question.type === 'multiselect' && Array.isArray(answer)) {
        // Para perguntas multiselect, cada opção selecionada adiciona ao score
        answer.forEach(selectedOption => {
          if (question.symptoms.includes(selectedOption)) {
            detectedSymptoms.push(selectedOption);
          }
          totalScore += question.weight * 0.5; // Cada opção selecionada adiciona metade do peso
        });
      } else if (question.type === 'text') {
        // Para perguntas de texto, armazenar a resposta mas não adicionar ao score
        if (answer && typeof answer === 'string' && answer.trim().length > 0) {
          if (question.id === 8) {
            detectedSymptoms.push(`Medicamentos em uso: ${answer}`);
          }
        }
      }
    });

    // Verificar sintomas críticos que podem alterar drasticamente o resultado
    const criticalSymptoms = ['dor_peito_intensa', 'falta_ar_grave', 'desmaio', 'convulsao', 'sangramento_intenso', 'trauma_cabeca'];
    const hasCriticalSymptoms = criticalSymptoms.some(symptomId => 
      detectedSymptoms.some(symptom => 
        this.symptoms.find(s => s.id === symptomId)?.name === symptom
      )
    );

    // Calcular porcentagem baseada no score real vs máximo possível
    const basePercentage = Math.min((totalScore / maxScore) * 100, 100);
    
    // Ajustar porcentagem baseada em fatores específicos
    let adjustedPercentage = basePercentage;
    
    // Se tem sintomas críticos, forçar porcentagem alta
    if (hasCriticalSymptoms) {
      adjustedPercentage = Math.max(adjustedPercentage, 85);
    }
    
    // Ajustar baseado na intensidade reportada
    const intensity = answers[2];
    if (intensity === 'Muito forte - quase insuportável') {
      adjustedPercentage = Math.max(adjustedPercentage, 70);
    } else if (intensity === 'Forte - difícil de ignorar') {
      adjustedPercentage = Math.max(adjustedPercentage, 50);
    }
    
    // Ajustar baseado na urgência percebida
    const perceivedUrgency = answers[10];
    if (perceivedUrgency === 'Sim, urgentemente') {
      adjustedPercentage = Math.max(adjustedPercentage, 75);
    }

    // Determinar nível de risco baseado na porcentagem ajustada
    let riskLevel: 'leve' | 'moderado' | 'grave' | 'muito_grave' = 'leve';
    let urgency: 'leve' | 'moderado' | 'grave' | 'muito_grave' = 'leve';
    let alertMessage: string | undefined;

    if (adjustedPercentage >= 80 || hasCriticalSymptoms) {
      riskLevel = 'muito_grave';
      urgency = 'muito_grave';
      alertMessage = '🚨 ATENÇÃO: Procure atendimento médico IMEDIATAMENTE! Seus sintomas indicam uma situação que pode ser grave.';
    } else if (adjustedPercentage >= 60) {
      riskLevel = 'grave';
      urgency = 'grave';
      alertMessage = '⚠️ ATENÇÃO: Procure atendimento médico nas próximas horas. Seus sintomas merecem atenção urgente.';
    } else if (adjustedPercentage >= 40) {
      riskLevel = 'moderado';
      urgency = 'moderado';
    } else {
      riskLevel = 'leve';
      urgency = 'leve';
    }

    // Determinar especialidades recomendadas
    const sortedSpecialties = Object.entries(specialtyScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([specialty]) => specialty);

    const defaultSpecialties = ['clínico geral'];
    const recommendedSpecialties = sortedSpecialties.length > 0 ? sortedSpecialties : defaultSpecialties;

    const recommendations = this.generateRecommendations(riskLevel, detectedSymptoms);
    const nextSteps = this.generateNextSteps(riskLevel, urgency);
    const estimatedWaitTime = this.getEstimatedWaitTime(urgency);

    return {
      riskLevel,
      riskPercentage: Math.round(adjustedPercentage),
      recommendedSpecialties,
      urgency,
      recommendations,
      symptoms: [...new Set(detectedSymptoms)],
      shouldSeekImmediateCare: urgency === 'muito_grave',
      estimatedWaitTime,
      nextSteps,
      alertMessage
    };
  }

  private generateRecommendations(riskLevel: string, symptoms: string[]): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'muito_grave') {
      recommendations.push(
        'Procure atendimento médico imediatamente',
        'Não dirija - peça ajuda ou chame uma ambulância',
        'Mantenha-se calmo e em posição confortável'
      );
    } else if (riskLevel === 'grave') {
      recommendations.push(
        'Procure atendimento médico nas próximas horas',
        'Evite atividades físicas intensas',
        'Monitore seus sintomas de perto'
      );
    } else if (riskLevel === 'moderado') {
      recommendations.push(
        'Agende uma consulta médica nas próximas 24-48 horas',
        'Evite automedicação',
        'Descanse adequadamente'
      );
    } else {
      recommendations.push(
        'Pode agendar uma consulta de rotina',
        'Mantenha hábitos saudáveis',
        'Monitore se os sintomas piorarem'
      );
    }

    // Recomendações específicas baseadas nos sintomas
    if (symptoms.some(s => s.includes('febre'))) {
      recommendations.push('Mantenha-se hidratado e monitore a temperatura');
    }
    if (symptoms.some(s => s.includes('dor'))) {
      recommendations.push('Evite automedicação para dor sem orientação médica');
    }
    if (symptoms.some(s => s.includes('ansiedade'))) {
      recommendations.push('Considere técnicas de relaxamento e respiração');
    }

    return recommendations;
  }

  private generateNextSteps(riskLevel: string, urgency: string): string[] {
    const steps: string[] = [];

    if (urgency === 'muito_grave') {
      steps.push(
        'Chame emergência (192) imediatamente',
        'Dirija-se ao hospital mais próximo',
        'Não espere - tempo é crucial'
      );
    } else if (urgency === 'grave') {
      steps.push(
        'Procure um pronto-socorro nas próximas horas',
        'Entre em contato com seu médico de confiança',
        'Tenha alguém por perto para acompanhar'
      );
    } else if (urgency === 'moderado') {
      steps.push(
        'Agende consulta médica nas próximas 24-48 horas',
        'Use nossa plataforma para agendar online',
        'Prepare informações sobre seus sintomas'
      );
    } else {
      steps.push(
        'Agende consulta de rotina quando conveniente',
        'Continue monitorando seus sintomas',
        'Mantenha um registro dos sintomas'
      );
    }

    return steps;
  }

  private getEstimatedWaitTime(urgency: string): string {
    switch (urgency) {
      case 'muito_grave': return 'Imediato (emergência)';
      case 'grave': return '2-4 horas';
      case 'moderado': return '24-48 horas';
      case 'leve': return '1-7 dias';
      default: return 'A definir';
    }
  }

  async getQuestions(): Promise<TriagemQuestion[]> {
    return this.questions;
  }

  async analyzeTriagem(answers: Record<number, any>): Promise<TriagemResult> {
    return this.analyzeSymptoms(answers);
  }

  async saveTriagem(triagemData: TriagemData): Promise<void> {
    try {
      console.log('🚀 Salvando triagem no backend...');
      console.log('📋 Dados da triagem:', triagemData);
      
      const response = await api.post('/triagem', triagemData);
      
      console.log('✅ Triagem salva com sucesso!');
      console.log('📊 Resposta do backend:', response.data);
      
    } catch (error: any) {
      console.error('❌ Erro ao salvar triagem:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Re-throw para que o componente possa tratar o erro
      throw error;
    }
  }

  async getTriagemHistory(pacienteId: number): Promise<TriagemData[]> {
    try {
      console.log('🔍 Buscando histórico de triagens para paciente:', pacienteId);
      
      const response = await api.get(`/triagem/paciente/${pacienteId}`);
      
      console.log('✅ Histórico de triagens carregado:', response.data);
      
      // Verificar se a resposta tem a estrutura esperada
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('⚠️ Estrutura de resposta inesperada:', response.data);
        return [];
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar histórico de triagem:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      return [];
    }
  }
}

export const triagemService = new TriagemService(); 