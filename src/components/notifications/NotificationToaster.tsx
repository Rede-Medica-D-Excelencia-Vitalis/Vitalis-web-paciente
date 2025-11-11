import React from 'react';
import { X, CheckCircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';
import { useNotification } from '../../contexts/notification';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const typeStyles: Record<ToastType, { icon: React.ReactNode; container: string; accent: string }> = {
  success: {
    icon: <CheckCircleIcon className="w-5 h-5 text-emerald-600" />,
    container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    accent: 'bg-emerald-500',
  },
  error: {
    icon: <AlertTriangleIcon className="w-5 h-5 text-red-600" />,
    container: 'bg-red-50 border-red-200 text-red-900',
    accent: 'bg-red-500',
  },
  warning: {
    icon: <AlertTriangleIcon className="w-5 h-5 text-amber-600" />,
    container: 'bg-amber-50 border-amber-200 text-amber-900',
    accent: 'bg-amber-500',
  },
  info: {
    icon: <InfoIcon className="w-5 h-5 text-blue-600" />,
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    accent: 'bg-blue-500',
  },
};

export const NotificationToaster: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm">
      {notifications.map((notification) => {
        const styles = typeStyles[notification.type];
        return (
          <div
            key={notification.id}
            className={`relative overflow-hidden rounded-2xl border shadow-lg transition-all hover:shadow-xl ${styles.container}`}
          >
            <div className={`absolute inset-y-0 left-0 w-1.5 ${styles.accent}`}></div>
            <div className="p-4 pl-5 pr-5 flex items-start gap-3">
              <div className="mt-0.5">{styles.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-relaxed">{notification.title}</p>
                <p className="text-xs leading-relaxed opacity-80 mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
