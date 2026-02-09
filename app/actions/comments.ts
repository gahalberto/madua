'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CommentWithUser {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
    subscriptionStatus: string;
  };
}

/**
 * Busca comentários de uma aula específica
 */
export async function getCommentsByLessonId(
  lessonId: string
): Promise<CommentWithUser[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            subscriptionStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return comments;
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return [];
  }
}

/**
 * Cria um novo comentário
 */
export async function createComment(lessonId: string, content: string) {
  const session = await auth();

  console.log('Session em createComment:', JSON.stringify(session, null, 2));

  if (!session?.user?.id) {
    throw new Error('Você precisa estar autenticado para comentar');
  }

  console.log('UserId que será usado:', session.user.id);

  // Verificar se o usuário existe
  const userExists = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  console.log('Usuário existe?', !!userExists);

  if (!userExists) {
    throw new Error('Usuário não encontrado no banco de dados');
  }

  console.log('LessonId que será usado:', lessonId);

  // Verificar se a lição existe
  const lessonExists = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  console.log('Lição existe?', !!lessonExists);

  if (!lessonExists) {
    throw new Error('Lição não encontrada no banco de dados');
  }

  if (!content || content.trim().length === 0) {
    throw new Error('O comentário não pode estar vazio');
  }

  if (content.length > 1000) {
    throw new Error('O comentário não pode ter mais de 1000 caracteres');
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        lessonId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            subscriptionStatus: true,
          },
        },
      },
    });

    // Revalidar a página da aula para mostrar o novo comentário
    revalidatePath(`/courses/[courseId]/lessons/${lessonId}`);

    return { success: true, comment };
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    // Re-throw com a mensagem original do erro para debug
    if (error instanceof Error) {
      throw new Error(`Erro ao criar comentário: ${error.message}`);
    }
    throw new Error('Erro ao criar comentário. Tente novamente.');
  }
}

/**
 * Deleta um comentário (apenas o autor ou admin)
 */
export async function deleteComment(commentId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Você precisa estar autenticado');
  }

  try {
    // Buscar o comentário para verificar permissões
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, lessonId: true },
    });

    if (!comment) {
      throw new Error('Comentário não encontrado');
    }

    // Verificar se é o autor ou admin
    const isAuthor = comment.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      throw new Error('Você não tem permissão para deletar este comentário');
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Revalidar a página
    revalidatePath(`/courses/[courseId]/lessons/${comment.lessonId}`);

    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    throw new Error('Erro ao deletar comentário. Tente novamente.');
  }
}

/**
 * Conta total de comentários de uma aula
 */
export async function getCommentsCount(lessonId: string): Promise<number> {
  try {
    const count = await prisma.comment.count({
      where: { lessonId },
    });
    return count;
  } catch (error) {
    console.error('Erro ao contar comentários:', error);
    return 0;
  }
}
