'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Busca todos os vlogs (cursos do tipo VLOG)
 */
export async function getAllVlogs() {
  try {
    const vlogs = await prisma.course.findMany({
      where: {
        type: 'VLOG',
      },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return vlogs;
  } catch (error) {
    console.error('Erro ao buscar vlogs:', error);
    return [];
  }
}

/**
 * Busca um vlog específico
 */
export async function getVlog(vlogId: string) {
  try {
    const vlog = await prisma.course.findUnique({
      where: { 
        id: vlogId,
        type: 'VLOG',
      },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    return vlog;
  } catch (error) {
    console.error('Erro ao buscar vlog:', error);
    return null;
  }
}

/**
 * Criar novo vlog
 */
export async function createVlog(data: {
  title: string;
  description?: string;
  videoUrl: string;
  publishedAt?: Date;
  thumbnail?: string;
  isPublished?: boolean;
  isPremium?: boolean;
}) {
  try {
    // Criar o curso como VLOG
    const vlog = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        type: 'VLOG',
        isPublished: data.isPublished ?? false,
        isPremium: data.isPremium ?? true,
        // Para vlogs, criamos um módulo padrão com uma aula
        modules: {
          create: {
            title: 'Vídeo',
            order: 1,
            lessons: {
              create: {
                title: data.title,
                description: data.description,
                videoUrl: data.videoUrl,
                order: 1,
                isFree: data.isPremium === false,
              },
            },
          },
        },
      },
    });

    revalidatePath('/admin/vlogs');
    return { success: true, vlogId: vlog.id };
  } catch (error) {
    console.error('Erro ao criar vlog:', error);
    return { success: false, error: 'Erro ao criar vlog' };
  }
}

/**
 * Atualizar vlog
 */
export async function updateVlog(
  vlogId: string,
  data: {
    title: string;
    description?: string;
    videoUrl?: string;
    thumbnail?: string;
    isPublished?: boolean;
    isPremium?: boolean;
  }
) {
  try {
    // Atualizar o curso
    await prisma.course.update({
      where: { id: vlogId },
      data: {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        isPublished: data.isPublished,
        isPremium: data.isPremium,
      },
    });

    // Se houver videoUrl, atualizar a lesson também
    if (data.videoUrl) {
      const vlogModule = await prisma.module.findFirst({
        where: { courseId: vlogId },
        include: { lessons: true },
      });

      if (vlogModule && vlogModule.lessons[0]) {
        await prisma.lesson.update({
          where: { id: vlogModule.lessons[0].id },
          data: {
            title: data.title,
            description: data.description,
            videoUrl: data.videoUrl,
            isFree: data.isPremium === false,
          },
        });
      }
    }

    revalidatePath('/admin/vlogs');
    revalidatePath(`/admin/vlogs/${vlogId}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar vlog:', error);
    return { success: false, error: 'Erro ao atualizar vlog' };
  }
}

/**
 * Excluir vlog
 */
export async function deleteVlog(vlogId: string) {
  try {
    await prisma.course.delete({
      where: { id: vlogId },
    });

    revalidatePath('/admin/vlogs');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir vlog:', error);
    return { success: false, error: 'Erro ao excluir vlog' };
  }
}
