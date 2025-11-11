import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BellIcon, CheckIcon, TrashIcon, X } from 'lucide-react';
import { notificationService, Notification } from '../../services/notification/notificationService';
import { useAuthStore } from '../../store/auth';

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  // Atualizar contador
  const updateUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao atualizar contador:', error);
    }
  }, [user]);

  // Carregar notificações
  const loadNotifications = useCallback(async (showLoading: boolean = false) => {
    if (!user) return;
    try {
      if (showLoading) setLoading(true);
      const response = await notificationService.getNotifications(20);
      setNotifications(response.notificacoes);
      setUnreadCount(response.naoLidas);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user]);

  // Marcar como lida
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, lida: true, data_leitura: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  // Marcar todas como lidas
  const handleMarkAllAsRead = async () => {
    try {
      setRefreshing(true);
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, lida: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Deletar notificação
  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.lida) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // Carregar notificações quando abrir
  useEffect(() => {
    if (isOpen && user) {
      loadNotifications(true);
    }
  }, [isOpen, user, loadNotifications]);

  // Atualizar contador periodicamente
  useEffect(() => {
    if (!user) return;

    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user, updateUnreadCount]);

  // Ouvir eventos globais de refresh
  useEffect(() => {
    const handleRefresh = () => {
      loadNotifications(false);
      updateUnreadCount();
    };

    window.addEventListener('notification:refresh', handleRefresh);

    return () => {
      window.removeEventListener('notification:refresh', handleRefresh);
    };
  }, [loadNotifications, updateUnreadCount]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do sininho */}
      <button
        onClick={onToggle}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        title="Notificações"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center notification-badge ${
            unreadCount > 99 ? 'w-5 h-5 text-[10px]' : ''
          }`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl w-80 max-h-96 overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={refreshing}
                  className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 font-medium"
                >
                  {refreshing ? (
                    <div className="flex items-center space-x-1">
                      <div className="spinner w-3 h-3"></div>
                      <span>Marcando...</span>
                    </div>
                  ) : (
                    'Marcar todas'
                  )}
                </button>
              )}
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de notificações */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar bg-white">
            {loading ? (
              <div className="p-8 text-center text-gray-500 bg-white">
                <div className="spinner w-8 h-8 mx-auto mb-3"></div>
                <p className="text-sm font-medium">Carregando notificações...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white">
                <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">Nenhuma notificação</p>
                <p className="text-xs text-gray-400 mt-1">
                  Você está em dia com tudo!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 bg-white">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-all duration-200 notification-item bg-white ${
                      !notification.lida ? 'notification-unread bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Ícone */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${
                        notificationService.getNotificationColor(notification.categoria)
                      }`}>
                        {notificationService.getNotificationIcon(notification.categoria)}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className={`text-sm font-semibold line-clamp-1 ${
                            !notification.lida ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.titulo}
                          </p>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.lida && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-50"
                                title="Marcar como lida"
                              >
                                <CheckIcon className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                              title="Deletar"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                          {notification.mensagem}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 font-medium">
                          {notificationService.formatNotificationDate(notification.data_criacao)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <button
                onClick={() => {
                  // Aqui você pode implementar navegação para página de todas as notificações
                  console.log('Ver todas as notificações');
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 