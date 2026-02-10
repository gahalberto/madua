'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const leadSchema = z.object({
  name: z.string().min(2, 'Nome inválido'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'WhatsApp inválido'),
  destinationUrl: z.string().url('URL inválida'),
  utm: z.record(z.string()).optional(),
});

export type LeadCheckoutInput = z.infer<typeof leadSchema>;

export async function createLeadAndCheckout(input: LeadCheckoutInput) {
  try {
    const data = leadSchema.parse(input);
    const normalizedPhone = data.phone.replace(/\D/g, '');

    await prisma.user.upsert({
      where: { email: data.email },
      update: {
        phone: normalizedPhone,
      },
      create: {
        name: data.name,
        email: data.email,
        phone: normalizedPhone,
        role: 'USER',
        subscriptionStatus: 'INACTIVE',
      },
    });

    const url = new URL(data.destinationUrl);
    url.searchParams.set('name', data.name);
    url.searchParams.set('email', data.email);
    url.searchParams.set('phone', normalizedPhone);

    if (data.utm) {
      Object.entries(data.utm).forEach(([key, value]) => {
        if (!url.searchParams.has(key)) {
          url.searchParams.set(key, value);
        }
      });
    }

    return { success: true, redirectUrl: url.toString() };
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    return { success: false, error: 'Não foi possível continuar. Tente novamente.' };
  }
}
