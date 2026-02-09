import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Interface para tipar o payload da Kiwify
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

// Função para validar a assinatura HMAC SHA1
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

// Função para gerar senha aleatória temporária
function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
}

export async function POST(request: NextRequest) {
  try {
    // 1. Extrair o corpo e a assinatura
    const rawBody = await request.text();
    const signature = request.headers.get('x-kiwify-signature');

    console.log('📬 Webhook Kiwify recebido');
    console.log('🔐 Assinatura:', signature);

    if (!signature) {
      console.error('❌ Assinatura ausente no header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 2. Validar a assinatura
    if (!validateSignature(rawBody, signature)) {
      console.error('❌ Assinatura inválida - possível tentativa de fraude');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('✅ Assinatura válida');

    // 3. Parsear o payload
    const payload: KiwifyWebhookPayload = JSON.parse(rawBody);
    const { order_status, Customer, subscription_id, Product } = payload;

    console.log('📦 Status do pedido:', order_status);
    console.log('👤 Cliente:', Customer.email, '-', Customer.full_name);
    console.log('🆔 Subscription ID:', subscription_id);
    console.log('🎁 Produto:', Product?.product_name || 'N/A');

    // 4. Processar evento baseado no status
    switch (order_status) {
      case 'paid': {
        console.log('💰 Processando pagamento aprovado...');

        // Buscar usuário existente
        let user = await prisma.user.findUnique({
          where: { email: Customer.email },
        });

        if (user) {
          // Atualizar usuário existente
          user = await prisma.user.update({
            where: { email: Customer.email },
            data: {
              subscriptionStatus: 'ACTIVE',
              name: Customer.full_name, // Atualiza nome se mudou
            },
          });
          console.log(`✅ Usuário atualizado: ${user.email} → ACTIVE`);
        } else {
          // Criar novo usuário
          const temporaryPassword = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

          user = await prisma.user.create({
            data: {
              email: Customer.email,
              name: Customer.full_name,
              password: hashedPassword,
              role: 'USER',
              subscriptionStatus: 'ACTIVE',
            },
          });

          console.log(`🆕 Novo usuário criado: ${user.email}`);
          console.log(`🔑 Senha temporária gerada: ${temporaryPassword}`);
          
          // TODO: Enviar email de boas-vindas com senha temporária
          // Implementar serviço de email aqui (ex: Resend, SendGrid)
        }

        break;
      }

      case 'refunded':
      case 'canceled': {
        console.log(`🚫 Processando ${order_status}...`);

        // Buscar usuário
        const user = await prisma.user.findUnique({
          where: { email: Customer.email },
        });

        if (user) {
          await prisma.user.update({
            where: { email: Customer.email },
            data: {
              subscriptionStatus: 'INACTIVE',
            },
          });
          console.log(`✅ Assinatura cancelada: ${user.email} → INACTIVE`);
        } else {
          console.warn(`⚠️ Usuário não encontrado para cancelamento: ${Customer.email}`);
        }

        break;
      }

      default:
        console.log(`ℹ️ Status não processado: ${order_status}`);
    }

    // 5. Sempre retornar 200 OK para a Kiwify
    console.log('✅ Webhook processado com sucesso\n');
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('❌ Erro ao processar webhook Kiwify:', error);
    
    // Mesmo com erro, retornar 200 para evitar retentativas da Kiwify
    // Os erros serão visíveis nos logs do PM2
    return NextResponse.json({ received: true, error: 'Internal error' }, { status: 200 });
  }
}

// Endpoint apenas aceita POST
export async function GET() {
  return NextResponse.json(
    { message: 'Kiwify Webhook - Use POST method' },
    { status: 405 }
  );
}
