import { api } from "../../lib/api";

export interface Notification {
  id: string;
  tipo: string;
  categoria: string;
  titulo: string;
  mensagem: string;
  dados: any;
  lida: boolean;
  data_criacao: string;
  data_leitura?: string;
}

export interface NotificationResponse {
  sucesso: boolean;
  notificacoes: Notification[];
  naoLidas: number;
  total: number;
}

export const notificationService = {
  // Buscar notificações do usuário
  async getNotifications(limite: number = 50): Promise<NotificationResponse> {
    const response = await api.get(`/notificacoes/listar?limite=${limite}`);
    return response.data;
  },

  // Contar notificações não lidas
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notificacoes/nao-lidas');
    return response.data.naoLidas;
  },

  // Marcar notificação como lida
  async markAsRead(notificationId: string): Promise<void> {
    await api.put(`/notificacoes/${notificationId}/marcar-lida`);
  },

  // Marcar todas como lidas
  async markAllAsRead(): Promise<void> {
    await api.put('/notificacoes/marcar-todas-lidas');
  },

  // Deletar notificação
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notificacoes/${notificationId}`);
  },

  // Formatar data da notificação
  formatNotificationDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d atrás`;
    }
  },

  // Obter ícone baseado no tipo de notificação
  getNotificationIcon(tipo: string): string {
    switch (tipo) {
      case 'consulta':
        return '🏥';
      case 'pedido':
        return '📦';
      case 'entrega':
        return '🚚';
      case 'sistema':
        return '⚙️';
      case 'promocao':
        return '🎉';
      case 'pagamento':
        return '💳';
      case 'seguranca':
        return '🔒';
      case 'documento_medico':
        return '📋';
      case 'ticket_resolvido':
        return '✅';
      default:
        return '🔔';
    }
  },

  // Obter cor baseada no tipo de notificação
  getNotificationColor(tipo: string): string {
    switch (tipo) {
      case 'consulta':
        return 'text-blue-600 bg-blue-50';
      case 'pedido':
        return 'text-green-600 bg-green-50';
      case 'entrega':
        return 'text-purple-600 bg-purple-50';
      case 'sistema':
        return 'text-gray-600 bg-gray-50';
      case 'promocao':
        return 'text-yellow-600 bg-yellow-50';
      case 'pagamento':
        return 'text-emerald-600 bg-emerald-50';
      case 'seguranca':
        return 'text-red-600 bg-red-50';
      case 'documento_medico':
        return 'text-indigo-600 bg-indigo-50';
      case 'ticket_resolvido':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }
}; 