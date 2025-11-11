import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { 
  UserIcon, 
  LockIcon, 
  ShieldIcon,
  AlertCircleIcon,
  CameraIcon,
  PackageIcon,
  CrownIcon,
  CalendarIcon,
  CheckCircleIcon,
  XIcon,
  AlertTriangleIcon,
  StethoscopeIcon,
  Loader2
} from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Avatar } from '../../components/ui/avatar';
import { OrderTrackingMap } from '../../components/tracking/OrderTrackingMap';
import { OrderTrackingEstimate } from '../../components/tracking/OrderTrackingEstimate';
import { OrderTrackingSteps } from '../../components/tracking/OrderTrackingSteps';
import { OrderReviewCard } from '../../components/tracking/OrderReviewCard';
import { useAuthStore } from '../../store/auth';
import { authService } from '../../services/auth/authService';
import { PlanRequiredModal, PlanChangeModal, PlanSelectionModal } from '../../components';
import { TriagemHistory } from './TriagemHistory';
import { OrderChat } from './OrderChat';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '../../hooks/api/useApi';
import { getProfile, updateProfile } from '../../services/data/pacienteService';
import { Paciente } from '../../types/api';
import { integrationService } from '../../services/integration/integrationService';
import { useNotification } from '../../contexts/notification';

interface ProfileFormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthdate: string;
  // Adicione outros campos do perfil do paciente que podem ser editados
  genero?: string;
  tipo_sanguineo?: string;
  alergias?: string;
  doencas_cronicas?: string;
  medicamentos_uso_continuo?: string;
}

interface Order {
  id: number;
  numero_pedido?: string;
  total: number; // Sempre será um número
  status?: string;
  criado_em?: string;
  data_criacao?: string;
  createdAt?: string;
  date?: string;
  items?: any[];
  itemCount?: number; // Contador de itens
  farmacia_nome?: string;
  paciente_nome?: string;
  avaliacao?: {
    id: number;
    nota: number;
    comentario: string;
    criado_em: string;
  } | null;
  ja_avaliado?: boolean;
  codigo_confirmacao?: string | null;
}

export const MeuPerfil = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders' | 'subscription' | 'triagem'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);
  const [showPlanSelectionModal, setShowPlanSelectionModal] = useState(false);
  const [selectedPlanForChange, setSelectedPlanForChange] = useState<any>(null);
  const [changingPlan, setChangingPlan] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<Order | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotification();

  const cardClassName =
    "rounded-3xl border border-blue-100/80 bg-white/95 backdrop-blur-sm shadow-[0_35px_70px_-45px_rgba(37,99,235,0.45)] overflow-hidden";
  const cardHeaderClassName =
    "space-y-1.5 p-6 pb-4 border-b border-blue-50/70 bg-gradient-to-r from-blue-50/80 via-white/70 to-transparent";
  const cardTitleClassName = "flex items-center gap-2 text-lg font-semibold text-blue-700";
  const tabButtonBaseClasses =
    "flex-1 min-w-[120px] px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200";
  const baseInputClasses =
    "border-blue-100/80 text-blue-900 placeholder:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:border-blue-400 shadow-sm disabled:bg-blue-50/70 disabled:text-blue-900 disabled:opacity-100";

  const statusHistoryRef = useRef<Record<number, string>>({});
  const hasInitializedStatusesRef = useRef(false);
  const selectedOrderRef = useRef<Order | null>(null);

  useEffect(() => {
    selectedOrderRef.current = selectedOrder;
  }, [selectedOrder]);

  const normalizeStatus = useCallback((status?: string) => {
    if (!status) return '';
    return status
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '_');
  }, []);

  const formatStatusLabel = useCallback(
    (status?: string) => {
      const normalized = normalizeStatus(status);

      switch (normalized) {
        case '':
        case 'pendente':
          return 'Pendente';
        case 'confirmado':
        case 'confirmada':
          return 'Confirmado';
        case 'em_preparo':
        case 'em_preparacao':
        case 'preparando':
          return 'Em Preparação';
        case 'pronto':
        case 'pronto_entrega':
          return 'Pronto para Entrega';
        case 'indo_buscar':
          return 'Indo Buscar';
        case 'coletado':
          return 'Pedido Coletado';
        case 'a_caminho':
          return 'A Caminho';
        case 'em_entrega':
        case 'em_transito':
        case 'em_entrega':
        case 'enviado':
        case 'em_rota':
          return 'Em Entrega';
        case 'retornando_farmacia':
          return 'Retornando à Farmácia';
        case 'entregue':
        case 'entrega_confirmada':
        case 'concluida':
        case 'concluida_':
        case 'concluido':
          return 'Concluído';
        case 'devolvido':
        case 'devolvida':
        case 'devolucao':
          return 'Devolvido';
        case 'cancelado':
        case 'cancelada':
          return 'Cancelado';
        case 'recusado':
        case 'rejeitado':
          return 'Recusado';
        default: {
          if (!status) return 'Pendente';
          const beautified = status
            .toString()
            .replace(/_/g, ' ')
            .trim()
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return beautified || 'Pendente';
        }
      }
    },
    [normalizeStatus]
  );

  const statusMessageMap = useRef<Record<string, { type: 'success' | 'error' | 'warning' | 'info'; message: string }>>({
    pendente: { type: 'info', message: 'Estamos confirmando seu pedido.' },
    aguardando_pagamento: { type: 'info', message: 'Aguardando confirmação do pagamento.' },
    pagamento_confirmado: { type: 'success', message: 'Pagamento confirmado! Seu pedido será preparado.' },
    em_preparo: { type: 'info', message: 'Seu pedido está sendo preparado pela farmácia.' },
    em_preparacao: { type: 'info', message: 'Seu pedido está sendo preparado pela farmácia.' },
    preparado: { type: 'info', message: 'Pedido pronto! Estamos organizando a coleta.' },
    em_transito: { type: 'info', message: 'O motoboy saiu para a entrega.' },
    enviado: { type: 'info', message: 'O motoboy saiu para a entrega.' },
    em_entrega: { type: 'info', message: 'O motoboy está chegando até você.' },
    entregue: { type: 'success', message: 'Pedido entregue! Aproveite seus produtos.' },
    concluido: { type: 'success', message: 'Pedido finalizado com sucesso.' },
    concluida: { type: 'success', message: 'Pedido finalizado com sucesso.' },
    cancelado: { type: 'warning', message: 'O pedido foi cancelado.' },
    recusado: { type: 'warning', message: 'O pedido foi recusado pela farmácia.' },
    devolvido: { type: 'warning', message: 'Pedido devolvido à farmácia. Nossa equipe entrará em contato com você.' },
    devolvida: { type: 'warning', message: 'Pedido devolvido à farmácia. Nossa equipe entrará em contato com você.' },
    devolucao: { type: 'warning', message: 'Pedido devolvido à farmácia. Nossa equipe entrará em contato com você.' }
  });

  const handleStatusUpdates = useCallback((latestOrders: Order[]) => {
    if (!latestOrders || latestOrders.length === 0) {
      return;
    }

    const changes: Array<{ order: Order; previous: string; current: string }> = [];

    latestOrders.forEach((order) => {
      const normalized = normalizeStatus(order.status);
      const previous = statusHistoryRef.current[order.id];
      if (previous && previous !== normalized) {
        changes.push({ order, previous, current: normalized });
      }
      statusHistoryRef.current[order.id] = normalized;
    });

    if (!hasInitializedStatusesRef.current) {
      hasInitializedStatusesRef.current = true;
      return;
    }

    if (changes.length > 0) {
      changes.forEach(({ order, current }) => {
        const config = statusMessageMap.current[current] || {
          type: 'info' as 'success' | 'error' | 'warning' | 'info',
          message: `Status do pedido atualizado: ${order.status}`,
        };

        addNotification({
          type: config.type,
          title: `Pedido #${order.numero_pedido || order.id}`,
          message: config.message,
          duration: 6000,
        });
      });

      window.dispatchEvent(new CustomEvent('notification:refresh'));
    }

    const selected = selectedOrderRef.current;
    if (selected) {
      const updated = latestOrders.find((order) => order.id === selected.id);
      if (updated) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: updated.status } : prev));
      }
    }
  }, [addNotification, normalizeStatus, setSelectedOrder]);

  useEffect(() => {
    statusHistoryRef.current = {};
    hasInitializedStatusesRef.current = false;
  }, [user?.id]);

  // Hooks da API
  const { data: profileData, loading: loadingProfile, error: errorProfile, execute: fetchProfile } = useApi<Paciente>(getProfile);
  const { loading: updatingProfile, error: errorUpdate, execute:executeUpdateProfile } = useApi(updateProfile);

  console.log('🔍 Estado da API:', { profileData, loadingProfile, errorProfile });
  console.log('🔍 fetchProfile function:', fetchProfile);
  console.log('🔍 profileData mudou:', profileData);
  console.log('🔍 user disponível:', user);
  console.log('🔍 user?.name disponível:', user?.name);
  console.log('🔍 user completo:', JSON.stringify(user, null, 2));

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthdate: '',
    genero: '',
    tipo_sanguineo: '',
    alergias: '',
    doencas_cronicas: '',
    medicamentos_uso_continuo: ''
  });

  console.log('🔍 Estado inicial do formData:', formData);

  useEffect(() => {
    console.log('🎨 Componente renderizado com formData:', formData);
  });

  useEffect(() => {
    console.log('🔐 Verificando token de autenticação...');
    const token = localStorage.getItem('token');
    console.log('🔐 Token presente:', !!token);
    if (token) {
      console.log('🔐 Token:', token.substring(0, 20) + '...');
    }
    console.log('🚀 Chamando fetchProfile...');
    console.log('🚀 fetchProfile function:', fetchProfile);
    console.log('🚀 fetchProfile será executada agora');
    console.log('🚀 user?.name disponível:', user?.name);
    console.log('🚀 user completo disponível:', user);
    fetchProfile();
  }, [fetchProfile]);

  // Verificar parâmetros da URL para navegação direta
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    
    if (tab === 'assinaturas') {
      setActiveTab('subscription');
    }
  }, [location.search]);

  useEffect(() => {
    console.log('🔍 useEffect executado, profileData:', profileData);
    console.log('🔍 useEffect executado, profileData é truthy:', !!profileData);
    console.log('🔍 useEffect executado, user?.name:', user?.name);
    console.log('🔍 useEffect executado, user disponível:', user);
    if (profileData) {
      console.log('🔍 Dados do perfil recebidos:', profileData);
      console.log('🔍 Tipo do profileData:', typeof profileData);
      console.log('🔍 Chaves do profileData:', Object.keys(profileData));
      const novosDados = {
        name: profileData.nome || profileData.name || user?.name || '',
        email: profileData.email || '',
        cpf: profileData.cpf || '',
        phone: profileData.telefone || profileData.phone || '',
        birthdate: profileData.data_nascimento ? profileData.data_nascimento.split('T')[0] : 
                  (profileData.birthdate ? profileData.birthdate.split('T')[0] : ''), // Formato YYYY-MM-DD
        genero: profileData.genero || '',
        tipo_sanguineo: profileData.tipo_sanguineo || '',
        alergias: profileData.alergias || '',
        doencas_cronicas: profileData.doencas_cronicas || '',
        medicamentos_uso_continuo: profileData.medicamentos_uso_continuo || '',
      };
      console.log('🔄 Novos dados do formulário:', novosDados);
      console.log('🔍 Campo nome específico:', { 
        profileDataNome: profileData.nome, 
        profileDataName: profileData.name, 
        userName: user?.name,
        resultado: novosDados.name 
      });
      setFormData(novosDados);
      if (profileData.profileImage) {
        setProfileImage(profileData.profileImage);
      }
    } else {
      console.log('⚠️ profileData é null ou undefined');
    }
  }, [profileData]);

  // Função para buscar pedidos do paciente
  const fetchOrders = useCallback(async (showLoading: boolean = true) => {
    if (!user?.id) return;
    
    try {
      if (showLoading) setLoadingOrders(true);
      console.log('🔍 Buscando pedidos para usuário:', user.id);
      console.log('🔍 Tipo do user.id:', typeof user.id);
      console.log('🔍 user.id convertido para número:', parseInt(user.id.toString()));
      
      const response = await integrationService.getPatientOrders(parseInt(user.id.toString()));
      console.log('🔍 Resposta da API:', response);
      console.log('🔍 Estrutura da resposta:', {
        hasResponse: !!response,
        hasData: !!response?.data,
        dataType: typeof response?.data,
        isArray: Array.isArray(response?.data),
        dataLength: response?.data?.length || 0
      });
      
      if (response?.data && Array.isArray(response.data)) {
        console.log('🔍 Primeiro pedido da resposta:', response.data[0]);
      }
      
      // Verificar se a resposta tem a estrutura esperada
      if (!response || !response.data) {
        console.warn('⚠️ Resposta da API não tem estrutura esperada:', response);
        setOrders([]);
        return;
      }
      
      // Mapear os dados do OrderResponse para a interface Order local
      const mappedOrders: Order[] = (response.data || []).map((orderResponse: any) => {
        console.log('🔍 Processando pedido original:', orderResponse);
        
        // Verificar se há itens e contar corretamente
        const itemCount = Array.isArray(orderResponse.itens) ? orderResponse.itens.length : 0;
        
        // Formatar data corretamente
        let formattedDate = 'Data não informada';
        console.log('🔍 Debug - Campos de data disponíveis:', {
          criado_em: orderResponse.criado_em,
          data_criacao: orderResponse.data_criacao,
          createdAt: orderResponse.createdAt
        });
        
        // Tentar diferentes campos de data
        const dataParaFormatar = orderResponse.criado_em || orderResponse.data_criacao || orderResponse.createdAt;
        
        if (dataParaFormatar) {
          try {
            const date = new Date(dataParaFormatar);
            if (!isNaN(date.getTime())) {
              formattedDate = date.toLocaleDateString('pt-BR');
              console.log('✅ Data formatada com sucesso:', formattedDate);
            } else {
              console.log('⚠️ Data inválida:', dataParaFormatar);
            }
          } catch (e) {
            console.log('⚠️ Erro ao formatar data:', e);
          }
        } else {
          console.log('⚠️ Nenhum campo de data encontrado');
        }
        
        const mappedOrder = {
          id: orderResponse.id,
          numero_pedido: orderResponse.numero_pedido || `PED${orderResponse.id}`,
          total: typeof orderResponse.total === 'string' ? parseFloat(orderResponse.total) || 0 : (orderResponse.total || 0),
          status: orderResponse.status || 'pendente',
          criado_em: formattedDate,
          data_criacao: formattedDate,
          createdAt: formattedDate,
          date: formattedDate,
          items: orderResponse.itens || [],
          itemCount: itemCount,
          farmacia_nome: orderResponse.farmacia_nome || 'Farmácia não informada',
          paciente_nome: orderResponse.paciente_nome || 'Cliente',
          avaliacao: orderResponse.avaliacao || null,
          ja_avaliado: orderResponse.ja_avaliado || false,
          codigo_confirmacao: orderResponse.codigo_confirmacao || null
        };
        
        console.log('🔍 Pedido mapeado:', mappedOrder);
        return mappedOrder;
      });
      
      console.log('🔍 Total de pedidos mapeados:', mappedOrders.length);
      handleStatusUpdates(mappedOrders);
      setOrders(mappedOrders);
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error);
      setOrders([]);
    } finally {
      if (showLoading) setLoadingOrders(false);
    }
  }, [user?.id, handleStatusUpdates]);

  // Buscar pedidos quando a aba de pedidos for ativada
  useEffect(() => {
    if (activeTab === 'orders' && user?.id) {
      console.log('🔄 Aba de pedidos ativada, buscando pedidos...');
      fetchOrders();
    }
  }, [activeTab, user?.id, fetchOrders]);

  // Recarregar pedidos quando o modal de rastreamento for aberto
  useEffect(() => {
    if (showTrackingModal && user?.id) {
      fetchOrders(false);
    }
  }, [showTrackingModal, user?.id, fetchOrders]);

  // Polling enquanto o modal estiver aberto ou a aba de pedidos ativa
  useEffect(() => {
    if (!user?.id) return;
    if (!(showTrackingModal || activeTab === 'orders')) return;

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 20000);

    return () => clearInterval(interval);
  }, [user?.id, showTrackingModal, activeTab, fetchOrders]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('✏️ handleInputChange chamado:', { name, value });
    console.log('✏️ Estado anterior do formData:', formData);
    setFormData(prev => {
      const novoEstado = { ...prev, [name]: value };
      console.log('🔄 Novo estado do formData:', novoEstado);
      return novoEstado;
    });
  };

  const handleSaveProfile = async () => {
    console.log('💾 Salvando perfil com dados:', formData);
    
    // Mapear os dados para o formato esperado pelo backend
    const dadosParaBackend = {
      nome: formData.name,
      email: formData.email,
      telefone: formData.phone,
      data_nascimento: formData.birthdate,
      genero: formData.genero,
      tipo_sanguineo: formData.tipo_sanguineo,
      alergias: formData.alergias,
      doencas_cronicas: formData.doencas_cronicas,
      medicamentos_uso_continuo: formData.medicamentos_uso_continuo,
    };
    
    console.log('🔄 Dados mapeados para backend:', dadosParaBackend);
    
    const result = await executeUpdateProfile(dadosParaBackend);
    if (result) {
      console.log('✅ Perfil atualizado com sucesso:', result);
      // Atualiza o Zustand store com os novos dados
      setUser(result.paciente);
      setIsEditing(false);
      // Opcional: mostrar uma notificação de sucesso
      alert('Perfil atualizado com sucesso!');
    } else {
      console.error('❌ Erro ao atualizar perfil:', errorUpdate);
      // Opcional: mostrar notificação de erro
      alert(`Erro ao atualizar perfil: ${errorUpdate}`);
    }
  };

  const handleCancelEdit = () => {
    console.log('❌ Cancelando edição, resetando dados...');
    setIsEditing(false);
    // Reseta o formulário para os dados originais
    if (profileData) {
      console.log('🔄 Dados originais do perfil:', profileData);
      const dadosResetados = {
        name: profileData.nome || profileData.name || user?.name || '',
        email: profileData.email || '',
        cpf: profileData.cpf || '',
        phone: profileData.telefone || profileData.phone || '',
        birthdate: profileData.data_nascimento ? profileData.data_nascimento.split('T')[0] : 
                  (profileData.birthdate ? profileData.birthdate.split('T')[0] : ''),
        genero: profileData.genero || '',
        tipo_sanguineo: profileData.tipo_sanguineo || '',
        alergias: profileData.alergias || '',
        doencas_cronicas: profileData.doencas_cronicas || '',
        medicamentos_uso_continuo: profileData.medicamentos_uso_continuo || '',
      };
      console.log('🔄 Dados resetados:', dadosResetados);
      setFormData(dadosResetados);
      console.log('🔍 Campo nome específico (reset):', { 
        profileDataNome: profileData.nome, 
        profileDataName: profileData.name, 
        userName: user?.name,
        resultado: dadosResetados.name 
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não informada';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Erro ao formatar';
    }
  };

  const handleCancelPlan = async () => {
    if (!user?.plan) {
      alert('Nenhuma assinatura ativa para cancelar.');
      return;
    }

    const confirmacao = window.confirm(
      'Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita.'
    );

    if (!confirmacao) {
      return;
    }

    setIsCancelling(true);

    try {
      const resultado = await authService.cancelSubscription();
      
      if (resultado.sucesso) {
        alert('Assinatura cancelada com sucesso!');
        
        // Limpar cache e forçar atualização do usuário
        try {
          console.log('🔄 Atualizando usuário após cancelamento...');
          const userAtualizado = await authService.clearCacheAndRefresh();
          
          // Atualizar o estado do usuário no store
          setUser(userAtualizado);
          
          console.log('✅ Usuário atualizado após cancelamento:', userAtualizado);
        } catch (updateError) {
          console.error('❌ Erro ao atualizar usuário:', updateError);
        }
        
        // Recarregar a página para atualizar todas as permissões
        console.log('🔄 Recarregando página para atualizar permissões...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert(`Erro ao cancelar assinatura: ${resultado.mensagem}`);
      }
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      alert('Erro interno ao cancelar assinatura. Tente novamente.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleChangePlan = (plan: any) => {
    setSelectedPlanForChange(plan);
    setShowPlanChangeModal(true);
  };

  const handleConfirmPlanChange = async (tipoTroca: 'troca' | 'upgrade' | 'downgrade') => {
    if (!selectedPlanForChange) return;

    setChangingPlan(true);
    try {
      console.log('🔄 Iniciando troca de plano:', selectedPlanForChange.id, 'tipo:', tipoTroca);
      
      // Usar o endpoint unificado
      const result = await authService.processarAssinatura(
        selectedPlanForChange.id,
        tipoTroca
      );

      if (result.sucesso) {
        console.log('✅ Plano alterado com sucesso:', result);
        
        // Atualizar o usuário no store
        try {
          if (result.data?.plan) {
            const currentUser = await authService.verifyToken();
            const updatedUser = {
              ...currentUser,
              plan: result.data.plan
            };
            setUser(updatedUser);
          } else {
            const user = await authService.verifyToken();
            setUser(user);
          }
        } catch (userError) {
          console.log('⚠️ Erro ao atualizar usuário:', userError);
        }

        alert('Plano alterado com sucesso!');
        setShowPlanChangeModal(false);
        setSelectedPlanForChange(null);
      } else {
        console.error('❌ Erro ao alterar plano:', result.mensagem);
        alert(`Erro ao alterar plano: ${result.mensagem}`);
      }
    } catch (error: any) {
      console.error('❌ Erro ao processar troca de plano:', error);
      alert('Erro interno ao processar troca de plano. Tente novamente.');
    } finally {
      setChangingPlan(false);
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!selectedOrder) return;
    
    // Obter token do localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Erro de autenticação. Faça login novamente.');
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pedido_id: selectedOrder.id,
          nota: rating,
          comentario: comment
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Atualizar o status do pedido localmente para "concluído" e marcar como avaliado
        if (selectedOrder) {
          console.log('🔄 Atualizando selectedOrder para concluido e avaliado');
          const updatedSelectedOrder = { 
            ...selectedOrder, 
            status: 'concluido',
            ja_avaliado: true,
            avaliacao: {
              id: responseData.data?.id || 0,
              nota: rating,
              comentario: comment,
              criado_em: new Date().toISOString()
            }
          };
          setSelectedOrder(updatedSelectedOrder);
          console.log('✅ selectedOrder atualizado:', updatedSelectedOrder);
        }
        
        // Atualizar a lista de pedidos também
        const updatedOrders = orders.map(order => 
          order.id === selectedOrder?.id 
            ? { 
                ...order, 
                status: 'concluido',
                ja_avaliado: true,
                avaliacao: {
                  id: responseData.data?.id || 0,
                  nota: rating,
                  comentario: comment,
                  criado_em: new Date().toISOString()
                }
              }
            : order
        );
        setOrders(updatedOrders);
        console.log('✅ Lista de pedidos atualizada:', updatedOrders);
        
        alert('Avaliação enviada com sucesso! Pedido marcado como concluído.');
        setShowReviewModal(false);
        
        // Forçar re-render do modal de tracking
        setTimeout(() => {
          console.log('🔄 Forçando re-render do modal de tracking');
        }, 100);
        
        // Não recarregar os pedidos para manter o status atualizado localmente
        // fetchOrders();
      } else {
        const errorData = await response.json();
        alert(errorData.erro || 'Erro ao enviar avaliação');
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação');
    }
  };

  // Verificar se está carregando
  if (loadingProfile) {
    console.log('⏳ Carregando perfil...');
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Carregando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se há erro
  if (errorProfile) {
    console.log('❌ Erro no perfil:', errorProfile);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar perfil</h2>
            <p className="text-blue-900/70 mb-4">{errorProfile}</p>
            <Button onClick={() => fetchProfile()}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-2rem)] bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-[-4rem] h-80 w-80 rounded-full bg-indigo-200/25 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-700 backdrop-blur">
            <UserIcon className="w-4 h-4" />
            Seu espaço Vitalis
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-blue-800">Meu Perfil</h1>
          <p className="mt-2 text-base text-blue-900/70">
            Gerencie seus dados pessoais, planos e acompanhamentos com a experiência Vitalis.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-white/70 border border-blue-100/70 rounded-2xl p-2 shadow-sm backdrop-blur mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${tabButtonBaseClasses} ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/60'
                : 'text-blue-700/80 hover:text-blue-800 hover:bg-white/80'
            }`}
          >
            <UserIcon className="w-4 h-4 inline mr-2" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`${tabButtonBaseClasses} ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/60'
                : 'text-blue-700/80 hover:text-blue-800 hover:bg-white/80'
            }`}
          >
            <ShieldIcon className="w-4 h-4 inline mr-2" />
            Segurança
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${tabButtonBaseClasses} ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/60'
                : 'text-blue-700/80 hover:text-blue-800 hover:bg-white/80'
            }`}
          >
            <PackageIcon className="w-4 h-4 inline mr-2" />
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`${tabButtonBaseClasses} ${
              activeTab === 'subscription'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/60'
                : 'text-blue-700/80 hover:text-blue-800 hover:bg-white/80'
            }`}
          >
            <CrownIcon className="w-4 h-4 inline mr-2" />
            Assinatura
          </button>
          <button
            onClick={() => setActiveTab('triagem')}
            className={`${tabButtonBaseClasses} ${
              activeTab === 'triagem'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/60'
                : 'text-blue-700/80 hover:text-blue-800 hover:bg-white/80'
            }`}
          >
            <StethoscopeIcon className="w-4 h-4 inline mr-2" />
            Triagens
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className={cardClassName}>
              <CardHeader className={cardHeaderClassName}>
                <CardTitle className={cardTitleClassName}>
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24 ring-4 ring-blue-100 shadow-xl bg-blue-50">
                      <img
                        src={profileImage || `https://ui-avatars.com/api/?name=${formData.name}&background=random`}
                        alt={formData.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </Avatar>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-blue-200 text-blue-600 hover:bg-blue-100/80"
                    >
                      <CameraIcon className="w-4 h-4 mr-2" />
                      Alterar Foto
                    </Button>
                  </div>

                  {/* Form */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                          Nome Completo
                        </label>
                        <Input 
                          name="name"
                          value={formData.name}
                          onChange={(e) => {
                            console.log('✏️ Campo name alterado:', e.target.value);
                            handleInputChange(e);
                          }}
                          disabled={!isEditing}
                          className={`${baseInputClasses} ${!isEditing ? 'bg-blue-50/60' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                          Email
                        </label>
                        <Input 
                          name="email"
                          value={formData.email}
                          onChange={(e) => {
                            console.log('✏️ Campo email alterado:', e.target.value);
                            handleInputChange(e);
                          }}
                          disabled={!isEditing}
                          className={`${baseInputClasses} ${!isEditing ? 'bg-blue-50/60' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                          CPF
                        </label>
                        <Input 
                          name="cpf"
                          value={formData.cpf}
                          onChange={(e) => {
                            console.log('✏️ Campo cpf alterado:', e.target.value);
                            handleInputChange(e);
                          }}
                          disabled={!isEditing}
                          className={`${baseInputClasses} ${!isEditing ? 'bg-blue-50/60' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                          Telefone
                        </label>
                        <Input 
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            console.log('✏️ Campo phone alterado:', e.target.value);
                            handleInputChange(e);
                          }}
                          disabled={!isEditing}
                          className={`${baseInputClasses} ${!isEditing ? 'bg-blue-50/60' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">
                          Data de Nascimento
                        </label>
                        <Input 
                          name="birthdate"
                          type="date"
                          value={formData.birthdate}
                          onChange={(e) => {
                            console.log('✏️ Campo birthdate alterado:', e.target.value);
                            handleInputChange(e);
                          }}
                          disabled={!isEditing}
                          className={`${baseInputClasses} ${!isEditing ? 'bg-blue-50/60' : 'bg-white'}`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                          <UserIcon className="w-4 h-4 mr-2" />
                          Editar Perfil
                        </Button>
                      ) : (
                        <>
                          <Button onClick={handleSaveProfile} disabled={updatingProfile}>
                            {updatingProfile ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Salvando...
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Salvar
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={() => {
                            console.log('❌ Botão cancelar clicado');
                            handleCancelEdit();
                          }}>
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card className={cardClassName}>
              <CardHeader className={cardHeaderClassName}>
                <CardTitle className={cardTitleClassName}>
                  <LockIcon className="w-5 h-5 text-blue-600" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-blue-100/70 bg-blue-50/70">
                    <div>
                      <h3 className="font-semibold text-blue-900">Senha</h3>
                      <p className="text-sm text-blue-900/70">Última alteração há 30 dias</p>
                    </div>
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-100/80">
                      <LockIcon className="w-4 h-4 mr-2" />
                      Alterar Senha
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <Card className={cardClassName}>
              <CardHeader className={cardHeaderClassName}>
                <CardTitle className={cardTitleClassName}>
                  <PackageIcon className="w-5 h-5 text-blue-600" />
                  Meus Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loadingOrders ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-blue-900/70">Carregando pedidos...</span>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-blue-100/80 bg-white/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                        onClick={() => {
                          console.log('🔍 Abrindo modal para pedido:', order);
                          setSelectedOrder(order);
                          setShowTrackingModal(true);
                        }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-blue-900">
                              Pedido #{order.numero_pedido || order.id}
                            </h3>
                            <p className="text-sm text-blue-900/70">
                              {order.itemCount || order.items?.length || 0} item(s) • {order.criado_em || order.data_criacao || formatDate(order.criado_em || order.createdAt || order.date || '')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold text-blue-900">
                                R$ {order.total.toFixed(2)}
                              </p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                (() => {
                                  const normalizedStatus = normalizeStatus(order.status);
                                  if (['entregue', 'entrega_confirmada', 'concluida', 'concluida_', 'concluido'].includes(normalizedStatus)) {
                                    return 'bg-green-100 text-green-800';
                                  }
                                  if (['em_preparo', 'em_preparacao', 'preparando'].includes(normalizedStatus)) {
                                    return 'bg-blue-100 text-blue-800';
                                  }
                                  if (['em_transito', 'em_entrega', 'enviado', 'em_rota', 'a_caminho'].includes(normalizedStatus)) {
                                    return 'bg-orange-100 text-orange-800';
                                  }
                                  if (['recusado', 'rejeitado', 'cancelado', 'cancelada'].includes(normalizedStatus)) {
                                    return 'bg-red-100 text-red-800';
                                  }
                                  if (['devolvido', 'devolvida', 'devolucao'].includes(normalizedStatus)) {
                                    return 'bg-purple-100 text-purple-800';
                                  }
                                  return 'bg-yellow-100 text-yellow-800';
                                })()
                              }`}>
                                {formatStatusLabel(order.status)}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderForChat(order);
                                setShowChatModal(true);
                              }}
                              className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-100/80"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Chat
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 border border-blue-100/70 rounded-2xl bg-white/80">
                    <PackageIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-blue-900/70 mb-4">
                      Você ainda não fez nenhum pedido no Vitalis.
                    </p>
                    <Button onClick={() => navigate('/farmacias')} className="bg-blue-600 hover:bg-blue-700">
                      Ver Farmácias
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <Card className={cardClassName}>
              <CardHeader className={cardHeaderClassName}>
                <CardTitle className={cardTitleClassName}>
                  <CrownIcon className="w-5 h-5 text-blue-600" />
                  Informações da Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {user?.plan ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-green-200 bg-green-50/80 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Plano Ativo</span>
                      </div>
                      <p className="text-green-700 text-sm">
                        Você tem acesso completo a todas as funcionalidades do Vitalis!
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-900/70">Plano:</span>
                        <span className="font-semibold text-blue-900">{user.plan.name || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-900/70">Valor:</span>
                        <span className="font-semibold text-green-600">
                          {user.plan.price ?
                            (typeof user.plan.price === 'number'
                              ? `R$ ${user.plan.price.toFixed(2)}`
                              : `R$ ${parseFloat(user.plan.price).toFixed(2)}`)
                            : 'R$ 0,00'}
                          /{user.plan.period === 'month' ? 'mês' : 'ano'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-900/70">Próxima renovação:</span>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-blue-900">
                            {formatDate(user.plan.nextBilling || '')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          // Mock de planos disponíveis - em produção viria da API
                          const planosDisponiveis = [
                            {
                              id: '1',
                              name: 'Plano Básico',
                              price: 29.90,
                              period: 'month',
                              features: ['Consultas online', 'Suporte básico']
                            },
                            {
                              id: '2',
                              name: 'Plano Premium',
                              price: 49.90,
                              period: 'month',
                              features: ['Consultas online', 'Suporte prioritário', 'Exames incluídos']
                            },
                            {
                              id: '3',
                              name: 'Plano VIP',
                              price: 99.90,
                              period: 'month',
                              features: ['Consultas online', 'Suporte VIP', 'Exames incluídos', 'Medicamentos']
                            }
                          ];
                          // Encontrar um plano diferente do atual
                          const planoDiferente = planosDisponiveis.find(p => p.id !== user.plan?.id);
                          if (planoDiferente) {
                            handleChangePlan(planoDiferente);
                          }
                        }}
                        className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-xl hover:bg-blue-100 transition-colors font-medium border border-blue-200 flex items-center justify-center gap-2"
                      >
                        <CrownIcon className="w-4 h-4" />
                        Trocar de Plano
                      </Button>
                      <button
                        onClick={handleCancelPlan}
                        disabled={isCancelling}
                        className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-200 flex items-center justify-center gap-2"
                      >
                        {isCancelling ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            Cancelando...
                          </>
                        ) : (
                          <>
                            <AlertTriangleIcon className="w-4 h-4" />
                            Cancelar Assinatura
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 border border-blue-100/70 rounded-2xl bg-white/80">
                    <CrownIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Nenhuma assinatura ativa</h3>
                    <p className="text-blue-900/70 mb-4">
                      Você ainda não possui uma assinatura ativa no Vitalis.
                    </p>
                    <Button 
                      onClick={() => setShowPlanSelectionModal(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Ver Planos Disponíveis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Triagem Tab */}
        {activeTab === 'triagem' && (
          <div className="space-y-6">
            <Card className={cardClassName}>
              <CardHeader className={cardHeaderClassName}>
                <CardTitle className={cardTitleClassName}>
                  <StethoscopeIcon className="w-5 h-5 text-blue-600" />
                  Histórico de Triagens Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {user?.id ? (
                  <TriagemHistory pacienteId={parseInt(user.id.toString())} />
                ) : (
                  <div className="text-center py-8 px-4 border border-blue-100/70 rounded-2xl bg-white/80">
                    <StethoscopeIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Usuário não identificado
                    </h3>
                    <p className="text-blue-900/70 mb-4">
                      Faça login para visualizar seu histórico de triagens.
                    </p>
                    <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
                      Fazer Login
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Order Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  Rastreamento do Pedido #{selectedOrder.numero_pedido || selectedOrder.id}
                </h2>
                <button
                  onClick={() => {
                    setShowTrackingModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mapa de entrega - só mostra se o pedido não estiver concluído */}
                {(() => {
                  const normalizedStatus = normalizeStatus(selectedOrder?.status);
                  const isDelivered = ['concluido', 'concluida', 'concluida_', 'entregue', 'entrega_confirmada'].includes(normalizedStatus);
                  const isReturned = ['devolvido', 'devolvida', 'devolucao'].includes(normalizedStatus);

                  if (!isDelivered && !isReturned) {
                    return (
                      <OrderTrackingMap 
                        deliveryPosition={[-23.5505, -46.6333]} 
                        destination={[-23.5489, -46.6388]} 
                        height={300} 
                      />
                    );
                  }

                  if (isReturned) {
                    return (
                      <div className="bg-purple-50 rounded-lg border border-purple-200 p-6 flex flex-col items-center justify-center h-[300px]">
                        <div className="text-center">
                          <AlertTriangleIcon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-purple-800 mb-2">Pedido Devolvido</h3>
                          <p className="text-purple-700">
                            Seu pedido foi devolvido à farmácia. Nossa equipe entrará em contato para orientar os próximos passos.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-green-50 rounded-lg border border-green-200 p-6 flex flex-col items-center justify-center h-[300px]">
                      <div className="text-center">
                        <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-800 mb-2">Pedido Entregue!</h3>
                        <p className="text-green-700 mb-4">
                          Seu pedido chegou ao destino com sucesso.
                        </p>
                        {normalizedStatus === 'concluido' ? (
                          <div className="bg-green-100 p-3 rounded-lg">
                            <span className="text-sm font-medium text-green-800">
                              ✅ Avaliação enviada - Pedido finalizado
                            </span>
                          </div>
                        ) : (
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <span className="text-sm font-medium text-blue-800">
                              ⭐ Pedido entregue - Avalie o serviço
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                <div className="space-y-6">
                  {/* Status atual do pedido */}
                  <div className="rounded-2xl border border-blue-100/70 bg-blue-50/70 p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Status Atual</h3>
                    <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                      (() => {
                        const normalizedStatus = normalizeStatus(selectedOrder?.status);
                        if (['entregue', 'entrega_confirmada', 'concluida', 'concluida_', 'concluido'].includes(normalizedStatus)) {
                          return 'bg-green-100 text-green-800';
                        }
                        if (['em_preparo', 'em_preparacao', 'preparando'].includes(normalizedStatus)) {
                          return 'bg-blue-100 text-blue-800';
                        }
                        if (['em_transito', 'em_entrega', 'enviado', 'em_rota', 'a_caminho'].includes(normalizedStatus)) {
                          return 'bg-orange-100 text-orange-800';
                        }
                        if (['recusado', 'rejeitado', 'cancelado', 'cancelada'].includes(normalizedStatus)) {
                          return 'bg-red-100 text-red-800';
                        }
                        if (['devolvido', 'devolvida', 'devolucao'].includes(normalizedStatus)) {
                          return 'bg-purple-100 text-purple-800';
                        }
                        return 'bg-yellow-100 text-yellow-800';
                      })()
                    }`}>
                      {formatStatusLabel(selectedOrder?.status)}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-blue-100/70 bg-white p-4 shadow-sm">
                    <h3 className="font-semibold text-blue-900 mb-2">Código de Confirmação</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black tracking-[0.3em] text-blue-700">
                        {selectedOrder?.codigo_confirmacao ?? '— — — —'}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800/70 mt-2">
                      Informe este código ao motoboy para confirmar a entrega com segurança.
                    </p>
                    {!selectedOrder?.codigo_confirmacao && (
                      <p className="text-xs text-amber-600 mt-3">
                        Código ainda não gerado. Assim que a farmácia encaminhar a entrega, ele aparecerá aqui.
                      </p>
                    )}
                  </div>
                  
                  {/* Previsão de entrega ou status final */}
                  {(() => {
                    const normalizedStatus = normalizeStatus(selectedOrder?.status);
                    const isDelivered = ['concluido', 'concluida', 'concluida_', 'entregue', 'entrega_confirmada'].includes(normalizedStatus);
                    const isReturned = ['devolvido', 'devolvida', 'devolucao'].includes(normalizedStatus);

                    if (!isDelivered && !isReturned) {
                      return (
                        <OrderTrackingEstimate 
                          deliveryPosition={[-23.5505, -46.6333]} 
                          destination={[-23.5489, -46.6388]} 
                        />
                      );
                    }

                    if (isReturned) {
                      return (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-center mb-2">
                            <AlertTriangleIcon className="w-6 h-6 text-purple-600 mr-2" />
                            <span className="text-lg font-semibold text-purple-800">Pedido devolvido</span>
                          </div>
                          <p className="text-center text-purple-700">
                            O pedido retornou à farmácia. Nossa equipe entrará em contato para alinhar os próximos passos.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-center mb-2">
                          <CheckCircleIcon className="w-6 h-6 text-green-600 mr-2" />
                          <span className="text-lg font-semibold text-green-800">Entrega Concluída</span>
                        </div>
                        <p className="text-center text-green-700">
                          Seu pedido foi entregue com sucesso!{normalizedStatus === 'concluido' ? ' Obrigado pela avaliação!' : ' Agora você pode avaliar o serviço.'}
                        </p>
                      </div>
                    );
                  })()}
                  <OrderTrackingSteps 
                    currentStep={
                      (() => {
                        const normalizedStatus = normalizeStatus(selectedOrder?.status);
                        const step =
                          ['em_preparo', 'em_preparacao', 'preparando'].includes(normalizedStatus) ? 1 :
                          ['em_transito', 'em_entrega', 'enviado', 'em_rota', 'a_caminho'].includes(normalizedStatus) ? 2 :
                          ['entregue', 'entrega_confirmada', 'concluida', 'concluida_', 'concluido'].includes(normalizedStatus) ? 4 :
                          ['devolvido', 'devolvida', 'devolucao'].includes(normalizedStatus) ? 4 :
                          ['recusado', 'rejeitado', 'cancelado', 'cancelada'].includes(normalizedStatus) ? 0 :
                          0;

                        return step;
                      })()
                    } 
                  />
                  {/* Botão de avaliação - aparece para pedidos entregues, fica cinza se já avaliado */}
                  {selectedOrder && (
                    (() => {
                      const normalizedStatus = normalizeStatus(selectedOrder.status);

                      if (selectedOrder.ja_avaliado || normalizedStatus === 'concluido') {
                        return (
                          <div className="text-center">
                            <Button 
                              disabled
                              className="w-full bg-gray-400 cursor-not-allowed"
                            >
                              ✅ Já Avaliado
                            </Button>
                          </div>
                        );
                      }

                      if (['entregue', 'entrega_confirmada', 'concluida', 'concluida_'].includes(normalizedStatus)) {
                        return (
                          <div className="text-center">
                            <Button 
                              onClick={() => setShowReviewModal(true)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              ⭐ Avaliar Pedido
                            </Button>
                          </div>
                        );
                      }

                      if (['em_preparo', 'em_preparacao', 'preparando'].includes(normalizedStatus)) {
                        return (
                          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-center mb-2">
                              <PackageIcon className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-blue-800">Pedido em Preparação</span>
                            </div>
                            <p className="text-sm text-blue-600">
                              Seu pedido está sendo preparado pela farmácia.
                            </p>
                          </div>
                        );
                      }

                      if (['em_transito', 'em_entrega', 'enviado', 'em_rota', 'a_caminho'].includes(normalizedStatus)) {
                        return (
                          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center justify-center mb-2">
                              <PackageIcon className="w-5 h-5 text-orange-600 mr-2" />
                              <span className="text-sm font-medium text-orange-800">Pedido em Entrega</span>
                            </div>
                            <p className="text-sm text-orange-600">
                              Seu pedido está a caminho. Aguarde a entrega.
                            </p>
                          </div>
                        );
                      }

                      if (['devolvido', 'devolvida', 'devolucao'].includes(normalizedStatus)) {
                        return (
                          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-center mb-2">
                              <AlertTriangleIcon className="w-5 h-5 text-purple-600 mr-2" />
                              <span className="text-sm font-medium text-purple-800">Pedido devolvido à farmácia</span>
                            </div>
                            <p className="text-sm text-purple-600">
                              Nossa equipe entrará em contato para ajudar com a devolução.
                            </p>
                          </div>
                        );
                      }

                      const isCancelled = ['recusado', 'rejeitado', 'cancelado', 'cancelada'].includes(normalizedStatus);

                      return (
                        <div className="text-center p-4 border border-blue-100/70 rounded-2xl bg-white/80">
                          <p className="text-sm text-blue-900/70">
                            {isCancelled
                              ? 'Pedido cancelado/recusado - não é possível avaliar'
                              : 'Avaliação disponível após entrega do pedido'}
                          </p>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Required Modal */}
      <PlanRequiredModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        featureName="todas as funcionalidades do Vitalis"
      />

      {/* Plan Change Modal */}
      <PlanChangeModal
        isOpen={showPlanChangeModal}
        onClose={() => setShowPlanChangeModal(false)}
        currentPlan={user?.plan}
        selectedPlan={selectedPlanForChange}
        onConfirm={handleConfirmPlanChange}
        loading={changingPlan}
      />

      {/* Plan Selection Modal */}
      <PlanSelectionModal
        isOpen={showPlanSelectionModal}
        onClose={() => setShowPlanSelectionModal(false)}
      />

      {/* Order Review Modal */}
      {showReviewModal && selectedOrder && (
        <OrderReviewCard
          orderId={selectedOrder.id}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}

      {/* Modal de Chat do Pedido */}
      {selectedOrderForChat && (
        <OrderChat
          order={selectedOrderForChat}
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedOrderForChat(null);
          }}
        />
      )}
    </div>
  );
};