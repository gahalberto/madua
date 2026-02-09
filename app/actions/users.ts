'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateUser(userId: string, data: {
  name?: string;
  email?: string;
  phone?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  role?: string;
  subscriptionStatus?: string;
}) {
  try {
    const updateData: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      subscriptionStatus: data.subscriptionStatus,
    };

    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    } else if (data.birthDate === null) {
      updateData.birthDate = null;
    }

    if (data.gender) {
      updateData.gender = data.gender;
    } else if (data.gender === null) {
      updateData.gender = null;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return { success: false, error: 'Erro ao atualizar usuário' };
  }
}
