'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ContentType } from '@prisma/client';

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
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

    return courses;
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    return [];
  }
}

/**
 * Busca todos os cursos (admin)
 */
export async function getAllCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: {
            modules: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses;
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    return [];
  }
}

export async function getCourseWithModules(courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            _count: {
              select: {
                lessons: true,
              },
            },
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    return course;
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    return null;
  }
}

/**
 * Criar novo curso
 */
export async function createCourse(data: {
  title: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  type?: string;
  isPublished?: boolean;
  isPremium?: boolean;
  isInClub?: boolean;
  isStandalone?: boolean;
  price?: number | null;
}) {
  try {
    await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        thumbnail: data.thumbnail,
        type: (data.type as ContentType) || 'COURSE',
        isPublished: data.isPublished ?? false,
        isPremium: data.isPremium ?? true,
        isInClub: data.isInClub ?? true,
        isStandalone: data.isStandalone ?? false,
        price: data.price,
      },
    });

    revalidatePath('/admin/courses');
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    return { success: false, error: 'Erro ao criar curso' };
  }
}

/**
 * Atualizar curso
 */
export async function updateCourse(
  courseId: string,
  data: {
    title: string;
    description?: string;
    category?: string;
    thumbnail?: string;
    type?: string;
    isPublished?: boolean;
    isPremium?: boolean;
    isInClub?: boolean;
    isStandalone?: boolean;
    price?: number | null;
  }
) {
  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        thumbnail: data.thumbnail,
        type: (data.type as ContentType) || 'COURSE',
        isPublished: data.isPublished,
        isPremium: data.isPremium,
        isInClub: data.isInClub,
        isStandalone: data.isStandalone,
        price: data.price,
      },
    });

    revalidatePath('/admin/courses');
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    return { success: false, error: 'Erro ao atualizar curso' };
  }
}

/**
 * Excluir curso
 */
export async function deleteCourse(courseId: string) {
  try {
    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidatePath('/admin/courses');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir curso:', error);
    return { success: false, error: 'Erro ao excluir curso' };
  }
}

/**
 * Criar módulo
 */
export async function createModule(data: {
  title: string;
  description?: string;
  courseId: string;
}) {
  try {
    // Buscar o próximo order
    const lastModule = await prisma.module.findFirst({
      where: { courseId: data.courseId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = lastModule ? lastModule.order + 1 : 1;

    await prisma.module.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
        order: nextOrder,
      },
    });

    revalidatePath(`/admin/courses/${data.courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar módulo:', error);
    return { success: false, error: 'Erro ao criar módulo' };
  }
}

/**
 * Atualizar módulo
 */
export async function updateModule(
  moduleId: string,
  data: {
    title: string;
    description?: string;
  }
) {
  try {
    await prisma.module.update({
      where: { id: moduleId },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    const courseModule = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { courseId: true },
    });

    if (courseModule) {
      revalidatePath(`/admin/courses/${courseModule.courseId}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar módulo:', error);
    return { success: false, error: 'Erro ao atualizar módulo' };
  }
}

/**
 * Excluir módulo
 */
export async function deleteModule(moduleId: string) {
  try {
    const courseModule = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { courseId: true, order: true },
    });

    if (!courseModule) {
      return { success: false, error: 'Módulo não encontrado' };
    }

    // Excluir módulo
    await prisma.module.delete({
      where: { id: moduleId },
    });

    // Reordenar módulos restantes
    await prisma.module.updateMany({
      where: {
        courseId: courseModule.courseId,
        order: { gt: courseModule.order },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    revalidatePath(`/admin/courses/${courseModule.courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir módulo:', error);
    return { success: false, error: 'Erro ao excluir módulo' };
  }
}

/**
 * Reordenar módulos
 */
export async function reorderModules(courseId: string, moduleIds: string[]) {
  try {
    // Atualizar ordem de cada módulo
    await Promise.all(
      moduleIds.map((id, index) =>
        prisma.module.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao reordenar módulos:', error);
    return { success: false, error: 'Erro ao reordenar módulos' };
  }
}

export async function getLesson(lessonId: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    return lesson;
  } catch (error) {
    console.error('Erro ao buscar lição:', error);
    return null;
  }
}
