import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { 
  UserIcon, 
  CreditCardIcon, 
  LockIcon, 
  PhoneIcon, 
  BadgeCheckIcon,
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
import { usePlanPermissions } from '../../hooks/auth/usePlanPermissions';
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
  const { hasPlan } = usePlanPermissions();
  const navigate = useNavigate();
  const location = useLocation();

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
  const fetchOrders = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingOrders(true);
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
          ja_avaliado: orderResponse.ja_avaliado || false
        };
        
        console.log('🔍 Pedido mapeado:', mappedOrder);
        return mappedOrder;
      });
      
      console.log('🔍 Total de pedidos mapeados:', mappedOrders.length);
      setOrders(mappedOrders);
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Buscar pedidos quando a aba de pedidos for ativada
  useEffect(() => {
    if (activeTab === 'orders' && user?.id) {
      console.log('🔄 Aba de pedidos ativada, buscando pedidos...');
      fetchOrders();
    }
  }, [activeTab, user?.id]);

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

  // Função de teste para verificar o cache
  const handleTestCache = async () => {
    console.log('🧪 TESTE: Verificando estado atual do cache...');
    console.log('🧪 TESTE: Usuário atual:', user);
    console.log('🧪 TESTE: Plano atual:', user?.plan);
    
    try {
      // Forçar limpeza do cache
      console.log('🧪 TESTE: Limpando cache...');
      await authService.clearCacheAndRefresh();
      
      // Verificar usuário após limpeza
      const userAtualizado = await authService.verifyToken();
      console.log('🧪 TESTE: Usuário após limpeza:', userAtualizado);
      console.log('🧪 TESTE: Plano após limpeza:', userAtualizado?.plan);
      
      // Atualizar estado
      setUser(userAtualizado);
      
      alert('Teste de cache concluído! Verifique o console para detalhes.');
    } catch (error) {
      console.error('🧪 TESTE: Erro no teste:', error);
      alert('Erro no teste de cache. Verifique o console.');
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
            <p className="text-gray-600 mb-4">{errorProfile}</p>
            <Button onClick={() => fetchProfile()}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserIcon className="w-4 h-4 inline mr-2" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldIcon className="w-4 h-4 inline mr-2" />
            Segurança
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PackageIcon className="w-4 h-4 inline mr-2" />
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'subscription'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CrownIcon className="w-4 h-4 inline mr-2" />
            Assinatura
          </button>
          <button
            onClick={() => setActiveTab('triagem')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'triagem'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <StethoscopeIcon className="w-4 h-4 inline mr-2" />
            Triagens
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24">
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
                    >
                      <CameraIcon className="w-4 h-4 mr-2" />
                      Alterar Foto
                    </Button>
                  </div>

                  {/* Form */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={!isEditing ? 'bg-gray-50' : ''}
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LockIcon className="w-5 h-5 text-red-600" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">Senha</h3>
                      <p className="text-sm text-gray-600">Última alteração há 30 dias</p>
                    </div>
                    <Button variant="outline">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageIcon className="w-5 h-5 text-green-600" />
                  Meus Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Carregando pedidos...</span>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          console.log('🔍 Abrindo modal para pedido:', order);
                          setSelectedOrder(order);
                          setShowTrackingModal(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Pedido #{order.numero_pedido || order.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {order.itemCount || order.items?.length || 0} item(s) • {order.criado_em || order.data_criacao || formatDate(order.criado_em || order.createdAt || order.date || '')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                R$ {order.total.toFixed(2)}
                              </p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                // Status de sucesso/concluído
                                order.status === 'Entregue' || order.status === 'entregue' || order.status === 'concluida' || order.status === 'Concluída' || order.status === 'concluido' ? 'bg-green-100 text-green-800' :
                                // Status de preparação
                                order.status === 'em_preparo' || order.status === 'Em preparação' || order.status === 'preparando' ? 'bg-blue-100 text-blue-800' :
                                // Status de trânsito/entrega
                                order.status === 'Em trânsito' || order.status === 'em_transito' || order.status === 'enviado' || order.status === 'Em entrega' || order.status === 'em_entrega' ? 'bg-orange-100 text-orange-800' :
                                // Status de recusa/cancelamento
                                order.status === 'Recusado' || order.status === 'recusado' || order.status === 'Cancelado' || order.status === 'cancelado' || order.status === 'rejeitado' ? 'bg-red-100 text-red-800' :
                                // Status pendente (padrão)
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {(order.status === 'concluido' || order.status === 'Entregue' || order.status === 'entregue' || order.status === 'concluida' || order.status === 'Concluída') ? 'Concluído' : (order.status || 'Pendente')}
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
                              className="flex items-center gap-2"
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
                  <div className="text-center py-8">
                    <PackageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-gray-600 mb-4">
                      Você ainda não fez nenhum pedido no Vitalis.
                    </p>
                    <Button onClick={() => navigate('/farmacias')}>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CrownIcon className="w-5 h-5 text-blue-600" />
                  Informações da Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.plan ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg">
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
                        <span className="text-gray-600">Plano:</span>
                        <span className="font-semibold text-gray-900">{user.plan.name || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Valor:</span>
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
                        <span className="text-gray-600">Próxima renovação:</span>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-gray-900">
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
                        className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200 flex items-center justify-center gap-2"
                      >
                        <CrownIcon className="w-4 h-4" />
                        Trocar de Plano
                      </Button>
                      <button
                        onClick={handleCancelPlan}
                        disabled={isCancelling}
                        className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 flex items-center justify-center gap-2"
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
                  <div className="text-center py-8">
                    <CrownIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma assinatura ativa</h3>
                    <p className="text-gray-600 mb-4">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StethoscopeIcon className="w-5 h-5 text-blue-600" />
                  Histórico de Triagens Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.id ? (
                  <TriagemHistory pacienteId={parseInt(user.id.toString())} />
                ) : (
                  <div className="text-center py-8">
                    <StethoscopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Usuário não identificado
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Faça login para visualizar seu histórico de triagens.
                    </p>
                    <Button onClick={() => navigate('/login')}>
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Rastreamento do Pedido #{selectedOrder.numero_pedido || selectedOrder.id}
                </h2>
                <button
                  onClick={() => {
                    setShowTrackingModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mapa de entrega - só mostra se o pedido não estiver concluído */}
                {(selectedOrder?.status !== 'concluido' && selectedOrder?.status !== 'Entregue' && selectedOrder?.status !== 'entregue' && selectedOrder?.status !== 'concluida' && selectedOrder?.status !== 'Concluída') ? (
                  <OrderTrackingMap 
                    deliveryPosition={[-23.5505, -46.6333]} 
                    destination={[-23.5489, -46.6388]} 
                    height={300} 
                  />
                ) : (
                  <div className="bg-green-50 rounded-lg border border-green-200 p-6 flex flex-col items-center justify-center h-[300px]">
                    <div className="text-center">
                      <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800 mb-2">Pedido Entregue!</h3>
                      <p className="text-green-700 mb-4">
                        Seu pedido chegou ao destino com sucesso.
                      </p>
                      {selectedOrder?.status === 'concluido' ? (
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
                )}
                <div className="space-y-6">
                  {/* Status atual do pedido */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Status Atual</h3>
                    <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                      // Status de sucesso/concluído
                      selectedOrder?.status === 'Entregue' || selectedOrder?.status === 'entregue' || selectedOrder?.status === 'concluida' || selectedOrder?.status === 'Concluída' || selectedOrder?.status === 'concluido' ? 'bg-green-100 text-green-800' :
                      // Status de preparação
                      selectedOrder?.status === 'em_preparo' || selectedOrder?.status === 'Em preparação' || selectedOrder?.status === 'preparando' ? 'bg-blue-100 text-blue-800' :
                      // Status de trânsito/entrega
                      selectedOrder?.status === 'Em trânsito' || selectedOrder?.status === 'em_transito' || selectedOrder?.status === 'enviado' || selectedOrder?.status === 'Em entrega' || selectedOrder?.status === 'em_entrega' ? 'bg-orange-100 text-orange-800' :
                      // Status de recusa/cancelamento
                      selectedOrder?.status === 'Recusado' || selectedOrder?.status === 'recusado' || selectedOrder?.status === 'Cancelado' || selectedOrder?.status === 'cancelado' || selectedOrder?.status === 'rejeitado' ? 'bg-red-100 text-red-800' :
                      // Status pendente (padrão)
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(selectedOrder?.status === 'concluido' || selectedOrder?.status === 'Entregue' || selectedOrder?.status === 'entregue' || selectedOrder?.status === 'concluida' || selectedOrder?.status === 'Concluída') ? 'Concluído' : (selectedOrder?.status || 'Pendente')}
                    </span>
                  </div>
                  
                  {/* Previsão de entrega - só mostra se o pedido não estiver concluído */}
                  {(selectedOrder?.status !== 'concluido' && selectedOrder?.status !== 'Entregue' && selectedOrder?.status !== 'entregue' && selectedOrder?.status !== 'concluida' && selectedOrder?.status !== 'Concluída') ? (
                    <OrderTrackingEstimate 
                      deliveryPosition={[-23.5505, -46.6333]} 
                      destination={[-23.5489, -46.6388]} 
                    />
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircleIcon className="w-6 h-6 text-green-600 mr-2" />
                        <span className="text-lg font-semibold text-green-800">Entrega Concluída</span>
                      </div>
                      <p className="text-center text-green-700">
                        Seu pedido foi entregue com sucesso! 
                        {selectedOrder?.status === 'concluido' ? ' Obrigado pela avaliação!' : ' Agora você pode avaliar o serviço.'}
                      </p>
                    </div>
                  )}
                  <OrderTrackingSteps 
                    currentStep={
                      // Mapear o status real do pedido para o step correspondente
                      (() => {
                        const step = selectedOrder?.status === 'em_preparo' || selectedOrder?.status === 'Em preparação' || selectedOrder?.status === 'preparando' ? 1 :
                          selectedOrder?.status === 'Em trânsito' || selectedOrder?.status === 'em_transito' || selectedOrder?.status === 'enviado' || selectedOrder?.status === 'Em entrega' || selectedOrder?.status === 'em_entrega' ? 2 :
                          (selectedOrder?.status === 'Entregue' || selectedOrder?.status === 'entregue' || selectedOrder?.status === 'concluida' || selectedOrder?.status === 'Concluída' || selectedOrder?.status === 'concluido') ? 4 :
                          selectedOrder?.status === 'Recusado' || selectedOrder?.status === 'recusado' || selectedOrder?.status === 'Cancelado' || selectedOrder?.status === 'cancelado' || selectedOrder?.status === 'rejeitado' ? 0 :
                          0; // Status pendente ou desconhecido
                        

                        
                        return step;
                      })()
                    } 
                  />
                  {/* Botão de avaliação - aparece para pedidos entregues, fica cinza se já avaliado */}
                  {selectedOrder && (
                    (selectedOrder.status === 'Entregue' || 
                    selectedOrder.status === 'entregue' || 
                    selectedOrder.status === 'concluida' || 
                    selectedOrder.status === 'Concluída') && !selectedOrder.ja_avaliado
                  ) ? (
                    <div className="text-center">
                      <Button 
                        onClick={() => setShowReviewModal(true)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        ⭐ Avaliar Pedido
                      </Button>
                    </div>
                  ) : (selectedOrder?.status === 'concluido' || selectedOrder?.ja_avaliado) ? (
                    <div className="text-center">
                      <Button 
                        disabled
                        className="w-full bg-gray-400 cursor-not-allowed"
                      >
                        ✅ Já Avaliado
                      </Button>
                    </div>
                  ) : (selectedOrder?.status === 'em_preparo' || selectedOrder?.status === 'Em preparação' || selectedOrder?.status === 'preparando') ? (
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-center mb-2">
                        <PackageIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">Pedido em Preparação</span>
                      </div>
                      <p className="text-sm text-blue-600">
                        Seu pedido está sendo preparado pela farmácia.
                      </p>
                    </div>
                  ) : (selectedOrder?.status === 'Em trânsito' || selectedOrder?.status === 'em_transito' || selectedOrder?.status === 'enviado' || selectedOrder?.status === 'Em entrega' || selectedOrder?.status === 'em_entrega') ? (
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-center mb-2">
                        <PackageIcon className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-orange-800">Pedido em Entrega</span>
                      </div>
                      <p className="text-sm text-orange-600">
                        Seu pedido está a caminho. Aguarde a entrega.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {selectedOrder?.status === 'Recusado' || selectedOrder?.status === 'recusado' || selectedOrder?.status === 'Cancelado' || selectedOrder?.status === 'cancelado' || selectedOrder?.status === 'rejeitado'
                          ? 'Pedido cancelado/recusado - não é possível avaliar'
                          : 'Avaliação disponível após entrega do pedido'
                        }
                      </p>
                    </div>
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