import {
  PhoneIcon,
  SearchIcon,
  ShoppingCartIcon,
  CrownIcon,
  MenuIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar } from "../../../../components/ui/avatar";
import { Input } from "../../../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../../store/business";
import { usePlanPermissions } from "../../../../hooks/auth/usePlanPermissions";
import { PlanRequiredModal, PlanInfoModal, NotificationDropdown } from "../../../../components";
import { useAuthStore } from "../../../../store/auth";
import { useFullscreen } from "../../../../contexts/fullscreen/FullscreenContext";

export const HeaderSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPlanInfo, setShowPlanInfo] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { items } = useCartStore();
  const { hasPlan } = usePlanPermissions();
  const { user } = useAuthStore();
  const { isVideoCallFullscreen, toggleSidebar } = useFullscreen();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);



  const handlePhoneClick = () => {
    setShowEmergencyPopup(true);
    setTimeout(() => {
      setShowEmergencyPopup(false);
    }, 300000); // 5 minutes
  };

  const handlePlanClick = () => {
    setShowPlanModal(true);
  };

  const handleCancelPlan = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsCancelling(true);
    try {
      // Aqui você faria a chamada para a API de cancelamento
      // await api.put('/assinaturas/cancelar');
      
      // Por enquanto, apenas simular o cancelamento
      alert('Assinatura cancelada com sucesso!');
      setShowPlanInfo(false);
      // Recarregar dados do usuário
      window.location.reload();
    } catch (error) {
      alert('Erro ao cancelar assinatura. Tente novamente.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Não renderizar o header se estiver em videochamada em tela cheia
  if (isVideoCallFullscreen) {
    return null;
  }

  return (
    <>
      <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Botão Menu e Logo */}
          <div className="flex items-center gap-4">
            {/* Botão Hambúrguer */}
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <MenuIcon className="w-6 h-6 text-white" />
            </button>
            
            <img
              src="/logo-ext.png"
                alt="Vitalis"
                className="h-16 w-auto"
            />
          </div>

          {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
                  type="text"
                  placeholder="Buscar médicos, especialidades..."
                  className="pl-10 bg-white/90 border-white/20 focus:bg-white text-gray-900"
            />
          </div>
            </div>
            
            {/* Navigation Icons */}
            <div className="flex items-center space-x-4">
              {/* Emergency Phone */}
              <button
                onClick={handlePhoneClick}
                className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                title="Emergência"
              >
                <PhoneIcon className="w-5 h-5" />
                {showEmergencyPopup && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 z-50">
                    <div className="text-center">
                      <div className="text-red-600 font-bold mb-2">EMERGÊNCIA</div>
                      <div className="text-2xl font-bold text-red-600 mb-2">192</div>
                      <div className="text-sm text-gray-600 mb-3">
                        SAMU - Serviço de Atendimento Móvel de Urgência
                      </div>
                      <button
                        onClick={() => window.open('tel:192')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors w-full"
                      >
                        LIGAR AGORA
                      </button>
                    </div>
                  </div>
                )}
              </button>

              {/* Plan Status */}
              <button
                onClick={handlePlanClick}
                className={`relative p-2 rounded-full transition-colors ${
                  hasPlan
                    ? "text-yellow-300 hover:bg-white/10"
                    : "text-yellow-300 hover:bg-white/10"
                }`}
                title={hasPlan ? "Plano Ativo" : "Ver Planos"}
              >
                <CrownIcon className="w-5 h-5" />
              </button>

              {/* Notifications Dropdown */}
              <NotificationDropdown 
                isOpen={notificationsOpen}
                onToggle={() => setNotificationsOpen(!notificationsOpen)}
              />

              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              <button
                onClick={() => navigate('/meu-perfil')}
                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Avatar className="w-8 h-8 border-2 border-white/20">
                  <img
                    src={user?.profileImage || "/group.png"}
                    alt={user?.name || "Usuário"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </Avatar>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Plan Required Modal */}
      <PlanRequiredModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        featureName="Recursos Premium"
      />

      {/* Plan Info Modal */}
      <PlanInfoModal
        isOpen={showPlanInfo}
        onClose={() => setShowPlanInfo(false)}
        user={user}
        onCancelPlan={handleCancelPlan}
        isCancelling={isCancelling}
      />
    </>
  );
};