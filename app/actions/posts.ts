'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { createNotificationForAllUsers } from './notifications';

// Criar um novo post
export async function createPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  categoryId?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  isPremium?: boolean;
  // Dados de receita (opcional)
  recipe?: {
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: string;
    ingredients: string; // JSON string
    instructions: string; // JSON string
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Criar post com receita se fornecida
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        categoryId: data.categoryId,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished ?? false,
        isPremium: data.isPremium ?? false,
        ...(data.recipe && {
          recipe: {
            create: {
              prepTime: data.recipe.prepTime,
              cookTime: data.recipe.cookTime,
              servings: data.recipe.servings,
              difficulty: data.recipe.difficulty,
              ingredients: data.recipe.ingredients,
              instructions: data.recipe.instructions,
              calories: data.recipe.calories,
              protein: data.recipe.protein,
              carbs: data.recipe.carbs,
              fats: data.recipe.fats,
            },
          },
        }),
      },
      include: {
        recipe: true,
      },
    });

    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidatePath('/receitas');

    // Criar notificação se o post foi publicado
    if (data.isPublished) {
      const isRecipe = !!data.recipe;
      await createNotificationForAllUsers({
        title: isRecipe ? '🍳 Nova Receita!' : '📝 Novo Post no Blog!',
        message: `${data.title} foi publicado${isRecipe ? '' : ' no blog'}. Confira agora!`,
        type: isRecipe ? 'RECIPE' : 'POST',
        link: isRecipe ? `/receitas/${data.slug}` : `/blog/${data.slug}`,
      });
    }

    return { success: true, post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Erro ao criar post' };
  }
}

// Atualizar post existente
export async function updatePost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    categoryId?: string;
    metaTitle?: string;
    metaDescription?: string;
    isPublished?: boolean;
    isPremium?: boolean;
    recipe?: {
      prepTime?: number;
      cookTime?: number;
      servings?: number;
      difficulty?: string;
      ingredients: string;
      instructions: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fats?: number;
    };
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    // Verificar se existe receita atual
    const currentPost = await prisma.post.findUnique({
      where: { id },
      include: { recipe: true },
    });

    if (!currentPost) {
      return { success: false, error: 'Post não encontrado' };
    }

    // Atualizar post
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        categoryId: data.categoryId,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished,
        isPremium: data.isPremium,
      },
      include: {
        recipe: true,
      },
    });

    // Atualizar ou criar receita se fornecida
    if (data.recipe) {
      if (currentPost.recipe) {
        await prisma.recipe.update({
          where: { postId: id },
          data: data.recipe,
        });
      } else {
        await prisma.recipe.create({
          data: {
            postId: id,
            ...data.recipe,
          },
        });
      }
    } else if (currentPost.recipe) {
      // Remover receita se não fornecida
      await prisma.recipe.delete({
        where: { postId: id },
      });
    }

    revalidatePath('/admin/posts');
    revalidatePath('/blog');
    revalidatePath('/receitas');
    revalidatePath(`/blog/${post.slug}`);

    return { success: true, post };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: 'Erro ao atualizar post' };
  }
}

// Deletar post (por slug ou id)
export async function deletePost(identifier: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    // Tentar deletar por slug primeiro, se falhar tenta por id
    try {
      await prisma.post.delete({
        where: { slug: identifier },
      });
    } catch {
      await prisma.post.delete({
        where: { id: identifier },
      });
    }

    revalidatePath('/admin/posts');
    revalidatePath('/admin/receitas');
    revalidatePath('/blog');
    revalidatePath('/receitas');
    revalidatePath('/nutricao');

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Erro ao deletar post' };
  }
}

// Buscar todos os posts (admin)
export async function getAllPosts() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const posts = await prisma.post.findMany({
      include: {
        recipe: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Buscar posts publicados (público)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPublishedPosts(category?: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
      },
      include: {
        recipe: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }
}

// Buscar post por slug
export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        recipe: true,
        category: true,
      },
    });

    return { success: true, post };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { success: false, post: null, error: 'Erro ao buscar post' };
  }
}
