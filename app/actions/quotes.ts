'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Busca uma frase aleatória de sabedoria ancestral
 */
export async function getRandomQuote() {
  try {
    // Contar total de frases
    const count = await prisma.stoicQuote.count();
    
    if (count === 0) {
      return null;
    }

    // Gerar índice aleatório
    const randomIndex = Math.floor(Math.random() * count);

    // Buscar frase no índice aleatório com contagem de likes
    const quote = await prisma.stoicQuote.findMany({
      take: 1,
      skip: randomIndex,
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return quote[0] || null;
  } catch (error) {
    console.error('Erro ao buscar frase:', error);
    return null;
  }
}

/**
 * Busca todas as quotes
 */
export async function getAllQuotes() {
  try {
    const quotes = await prisma.stoicQuote.findMany({
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return quotes;
  } catch (error) {
    console.error('Erro ao buscar quotes:', error);
    return [];
  }
}

/**
 * Criar nova quote
 */
export async function createQuote(text: string) {
  try {
    if (!text.trim()) {
      return { success: false, error: 'O texto não pode estar vazio' };
    }

    // Verificar se a quote já existe
    const existing = await prisma.stoicQuote.findUnique({
      where: { text: text.trim() },
    });

    if (existing) {
      return { success: false, error: 'Esta frase já está cadastrada' };
    }

    await prisma.stoicQuote.create({
      data: { text: text.trim() },
    });

    revalidatePath('/admin/quotes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar quote:', error);
    return { success: false, error: 'Erro ao criar frase' };
  }
}

/**
 * Excluir quote
 */
export async function deleteQuote(quoteId: string) {
  try {
    await prisma.stoicQuote.delete({
      where: { id: quoteId },
    });

    revalidatePath('/admin/quotes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir quote:', error);
    return { success: false, error: 'Erro ao excluir frase' };
  }
}

/**
 * Toggle like em uma quote
 */
export async function toggleQuoteLike(quoteId: string, userId: string) {
  try {
    // Verificar se já deu like
    const existingLike = await prisma.quoteLike.findUnique({
      where: {
        userId_quoteId: {
          userId,
          quoteId,
        },
      },
    });

    if (existingLike) {
      // Remover like
      await prisma.quoteLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Adicionar like
      await prisma.quoteLike.create({
        data: {
          userId,
          quoteId,
        },
      });
    }

    revalidatePath('/admin/quotes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao dar like:', error);
    return { success: false, error: 'Erro ao processar like' };
  }
}

/**
 * Verificar se usuário deu like em uma quote
 */
export async function hasUserLikedQuote(quoteId: string, userId: string) {
  try {
    const like = await prisma.quoteLike.findUnique({
      where: {
        userId_quoteId: {
          userId,
          quoteId,
        },
      },
    });

    return !!like;
  } catch (error) {
    console.error('Erro ao verificar like:', error);
    return false;
  }
}
