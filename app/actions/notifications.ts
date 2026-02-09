'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function getUserNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function getUnreadNotificationsCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  try {
    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });

    return count;
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    return 0;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  try {
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false };
  }
}

export async function markAllNotificationsAsRead() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false };
  }
}

export async function createNotificationForAllUsers(data: {
  title: string;
  message: string;
  type: string;
  link?: string;
}) {
  try {
    // Buscar todos os usuários
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    // Criar notificação para cada usuário
    await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link,
      })),
    });

    return { success: true, count: users.length };
  } catch (error) {
    console.error('Error creating notifications:', error);
    return { success: false, count: 0 };
  }
}

export async function createNotificationForUser(
  userId: string,
  data: {
    title: string;
    message: string;
    type: string;
    link?: string;
  }
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false };
  }
}

export async function deleteNotification(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false };
  }
}
