import { useAuthStore } from "../../store/auth/authStore";

export interface PlanPermissions {
  hasPlan: boolean;
  canAccessTelemedicine: boolean;
  canAccessConsultations: boolean;
  canAccessTriagem: boolean;
  canAccessPrescriptions: boolean;
  canAccessPatientArea: boolean;
  canAccessAgendamento: boolean;
  canAccessTeleconsulta: boolean;
  canAccessConsultasAnteriores: boolean;
  canAccessFarmacia: boolean; // Sempre true
}

export const usePlanPermissions = (): PlanPermissions => {
  const { user } = useAuthStore();
  
  // Verifica se o usuário tem um plano ativo
  const hasPlan = Boolean(user?.plan?.id);
  
  // Log para debug
  console.log('�� usePlanPermissions: RECALCULADO!', { 
    userId: user?.id, 
    userName: user?.name, 
    userPlan: user?.plan, 
    hasPlan,
    userPlanId: user?.plan?.id,
    userPlanName: user?.plan?.name,
    timestamp: new Date().toISOString()
  });
  
  // Permissões baseadas no plano
  const canAccessTelemedicine = hasPlan;
  const canAccessConsultations = hasPlan;
  const canAccessTriagem = hasPlan;
  const canAccessPrescriptions = hasPlan;
  const canAccessPatientArea = hasPlan;
  const canAccessAgendamento = hasPlan;
  const canAccessTeleconsulta = hasPlan;
  const canAccessConsultasAnteriores = hasPlan;
  const canAccessFarmacia = true; // Sempre permitido

  return {
    hasPlan,
    canAccessTelemedicine,
    canAccessConsultations,
    canAccessTriagem,
    canAccessPrescriptions,
    canAccessPatientArea,
    canAccessAgendamento,
    canAccessTeleconsulta,
    canAccessConsultasAnteriores,
    canAccessFarmacia,
  };
}; 