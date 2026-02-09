'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotificationForAllUsers } from './notifications';

/**
 * Criar nova lesson
 */
export async function createLesson(data: {
  title: string;
  description?: string;
  videoUrl: string;
  isFree?: boolean;
  moduleId: string;
}) {
  try {
    // Buscar a última ordem do módulo
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId: data.moduleId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        isFree: data.isFree ?? false,
        moduleId: data.moduleId,
        order: nextOrder,
      },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    revalidatePath('/admin/courses');

    // Criar notificação para todos os usuários
    await createNotificationForAllUsers({
      title: '🎓 Nova Aula Disponível!',
      message: `${lesson.title} foi adicionada ao curso ${lesson.module.course.title}. Confira agora!`,
      type: 'LESSON',
      link: `/aulas`,
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar lesson:', error);
    return { success: false, error: 'Erro ao criar aula' };
  }
}

/**
 * Atualizar lesson
 */
export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    description?: string;
    videoUrl?: string;
    isFree?: boolean;
  }
) {
  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        isFree: data.isFree,
      },
    });

    revalidatePath('/admin/courses');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar lesson:', error);
    return { success: false, error: 'Erro ao atualizar aula' };
  }
}

/**
 * Excluir lesson e reordenar as restantes
 */
export async function deleteLesson(lessonId: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return { success: false, error: 'Aula não encontrada' };
    }

    // Excluir a lesson
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    // Reordenar as lessons restantes do módulo
    await prisma.lesson.updateMany({
      where: {
        moduleId: lesson.moduleId,
        order: { gt: lesson.order },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    revalidatePath('/admin/courses');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir lesson:', error);
    return { success: false, error: 'Erro ao excluir aula' };
  }
}

/**
 * Reordenar lessons
 */
export async function reorderLessons(moduleId: string, lessonIds: string[]) {
  try {
    // Atualizar ordem de cada lesson
    await Promise.all(
      lessonIds.map((id, index) =>
        prisma.lesson.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath('/admin/courses');
    return { success: true };
  } catch (error) {
    console.error('Erro ao reordenar lessons:', error);
    return { success: false, error: 'Erro ao reordenar aulas' };
  }
}
