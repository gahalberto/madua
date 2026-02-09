'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * Verifica se o usuário tem acesso a um curso específico
 */
export async function checkCourseAccess(courseId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        hasAccess: false,
        reason: 'not_authenticated',
        redirectTo: '/login',
      };
    }

    // Buscar curso
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        isPremium: true,
        isInClub: true,
        price: true,
      },
    });

    if (!course) {
      return {
        hasAccess: false,
        reason: 'course_not_found',
        redirectTo: '/cursos',
      };
    }

    // Se o curso não é premium, todos têm acesso
    if (!course.isPremium) {
      return {
        hasAccess: true,
        reason: 'free_course',
      };
    }

    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionStatus: true,
        purchases: {
          where: {
            courseId: courseId,
            status: 'completed',
          },
        },
      },
    });

    if (!user) {
      return {
        hasAccess: false,
        reason: 'user_not_found',
        redirectTo: '/login',
      };
    }

    // Verificar compra individual
    if (user.purchases.length > 0) {
      return {
        hasAccess: true,
        reason: 'individual_purchase',
      };
    }

    // Verificar acesso via clube
    if (course.isInClub && user.subscriptionStatus === 'ACTIVE') {
      return {
        hasAccess: true,
        reason: 'club_member',
      };
    }

    // Sem acesso - redirecionar para página de vendas
    return {
      hasAccess: false,
      reason: course.isInClub ? 'needs_club_or_purchase' : 'needs_purchase',
      redirectTo: `/cursos/${courseId}/comprar`,
      course: {
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
        isInClub: course.isInClub,
      },
    };
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return {
      hasAccess: false,
      reason: 'error',
      redirectTo: '/cursos',
    };
  }
}

/**
 * Registra uma compra de curso
 */
export async function createPurchase(data: {
  userId: string;
  courseId: string;
  amount: number;
  currency?: string;
}) {
  try {
    const purchase = await prisma.purchase.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        amount: data.amount,
        currency: data.currency || 'EUR',
        status: 'completed',
      },
    });

    return { success: true, purchase };
  } catch (error) {
    console.error('Erro ao criar compra:', error);
    return { success: false, error: 'Erro ao registrar compra' };
  }
}

/**
 * Verifica se usuário já comprou um curso
 */
export async function hasPurchasedCourse(userId: string, courseId: string) {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return !!purchase;
  } catch (error) {
    console.error('Erro ao verificar compra:', error);
    return false;
  }
}
