'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * Verifica se o usuário logado é admin
 */
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

/**
 * Busca estatísticas gerais da plataforma
 */
export async function getAdminStats() {
  try {
    const [
      totalUsers,
      activeSubscribers,
      totalLessons,
      totalCourses,
      totalComments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { subscriptionStatus: 'ACTIVE' },
      }),
      prisma.lesson.count(),
      prisma.course.count(),
      prisma.comment.count(),
    ]);

    // Faturamento estimado mockado (€29.99 por assinante ativo)
    const estimatedRevenue = activeSubscribers * 29.99;

    return {
      totalUsers,
      activeSubscribers,
      totalLessons,
      totalCourses,
      totalComments,
      estimatedRevenue,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      totalUsers: 0,
      activeSubscribers: 0,
      totalLessons: 0,
      totalCourses: 0,
      totalComments: 0,
      estimatedRevenue: 0,
    };
  }
}

/**
 * Busca lista de todos os usuários
 */
export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthDate: true,
        gender: true,
        role: true,
        subscriptionStatus: true,
        createdAt: true,
        _count: {
          select: {
            progress: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}
