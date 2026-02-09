import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface KiwifyWebhookPayload {
  order_status: string;
  subscription_id?: string;
  Customer: {
    email: string;
    full_name: string;
  };
  Product?: {
    product_name: string;
  };
}

function validateSignature(payload: string, signature: string): boolean {
  const secret = process.env.KIWIFY_SECRET;
  if (!secret) {
    console.error('❌ KIWIFY_SECRET não configurado no .env');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha1', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}

function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-12);
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    
    // CORREÇÃO: Procura a assinatura no Header OU na Query String (URL)
    const url = new URL(request.url);
    const signature = request.headers.get('x-kiwify-signature') || url.searchParams.get('signature');

    console.log('📬 Webhook Kiwify recebido');
    
    if (!signature) {
      console.error('❌ Assinatura ausente (não encontrada no header nem na URL)');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Validar a assinatura
    if (!validateSignature(rawBody, signature)) {
      console.error('❌ Assinatura inválida - Falha de segurança');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: KiwifyWebhookPayload = JSON.parse(rawBody);
    const { order_status, Customer } = payload;

    console.log(`✅ Evento validado: ${order_status} para ${Customer.email}`);

    switch (order_status) {
      case 'paid': {
        const user = await prisma.user.findUnique({ where: { email: Customer.email } });

        if (user) {
          await prisma.user.update({
            where: { email: Customer.email },
            data: { subscriptionStatus: 'ACTIVE', name: Customer.full_name },
          });
          console.log(`✅ Acesso renovado: ${Customer.email}`);
        } else {
          const temporaryPassword = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

          await prisma.user.create({
            data: {
              email: Customer.email,
              name: Customer.full_name,
              password: hashedPassword,
              role: 'USER',
              subscriptionStatus: 'ACTIVE',
            },
          });
          console.log(`🆕 Novo usuário criado: ${Customer.email} | Senha: ${temporaryPassword}`);
        }
        break;
      }

      case 'refunded':
      case 'canceled': {
        await prisma.user.updateMany({
          where: { email: Customer.email },
          data: { subscriptionStatus: 'INACTIVE' },
        });
        console.log(`🚫 Acesso removido: ${Customer.email}`);
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    // Retornamos 200 para a Kiwify parar de tentar, mas logamos o erro interno
    return NextResponse.json({ received: true, error: 'Internal logic error' }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Kiwify Webhook Ativo' }, { status: 200 });
}