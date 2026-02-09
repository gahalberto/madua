'use client';

import { Bell, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/app/actions/notifications';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    const [notifs, count] = await Promise.all([
      getUserNotifications(),
      getUnreadNotificationsCount(),
    ]);
    setNotifications(notifs as Notification[]);
    setUnreadCount(count);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
    // Recarregar notificações a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    const deleted = notifications.find((n) => n.id === id);
    setNotifications(notifications.filter((n) => n.id !== id));
    if (deleted && !deleted.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'RECIPE':
        return '🍳';
      case 'LESSON':
        return '🎓';
      case 'POST':
        return '📝';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-[#1F1F1F] hover:text-gray-900 dark:hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-96 max-h-[600px] rounded-xl border border-zinc-200 dark:border-[#1F1F1F] bg-white dark:bg-[#121212] shadow-2xl z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-[#1F1F1F] flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 dark:text-white">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#D4AF37] hover:underline font-medium"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                  Carregando...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-[#1F1F1F]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-zinc-50 dark:hover:bg-[#1F1F1F] transition-colors ${
                        !notification.isRead ? 'bg-[#D4AF37]/5 dark:bg-[#D4AF37]/5' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-zinc-500 dark:text-zinc-500">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  Marcar como lida
                                </button>
                              )}
                              {notification.link && (
                                <Link
                                  href={notification.link}
                                  onClick={() => {
                                    if (!notification.isRead) {
                                      handleMarkAsRead(notification.id);
                                    }
                                    setIsOpen(false);
                                  }}
                                  className="text-xs text-[#D4AF37] hover:underline font-medium"
                                >
                                  Ver →
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
