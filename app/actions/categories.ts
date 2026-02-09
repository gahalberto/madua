'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// Criar categoria
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  order?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color,
        icon: data.icon,
        order: data.order ?? 0,
      },
    });

    revalidatePath('/admin/categorias');
    revalidatePath('/admin/receitas');

    return { success: true, category };
  } catch (error: unknown) {
    console.error('Error creating category:', error);
    if (error instanceof Object && 'code' in error && error.code === 'P2002') {
      return { success: false, error: 'Categoria com este nome ou slug já existe' };
    }
    return { success: false, error: 'Erro ao criar categoria' };
  }
}

// Atualizar categoria
export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
    icon?: string;
    order?: number;
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/categorias');
    revalidatePath('/admin/receitas');

    return { success: true, category };
  } catch (error: unknown) {
    console.error('Error updating category:', error);
    if (error instanceof Object && 'code' in error && error.code === 'P2002') {
      return { success: false, error: 'Categoria com este nome ou slug já existe' };
    }
    return { success: false, error: 'Erro ao atualizar categoria' };
  }
}

// Deletar categoria
export async function deleteCategory(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/admin/categorias');
    revalidatePath('/admin/receitas');

    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Erro ao deletar categoria' };
  }
}

// Buscar todas as categorias
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, categories: [], error: 'Erro ao buscar categorias' };
  }
}

// Buscar categoria por ID
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return { success: true, category };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { success: false, category: null, error: 'Erro ao buscar categoria' };
  }
}
