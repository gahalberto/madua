# Sistema de Acesso aos Cursos - Instruções de Implementação

## ✅ Backend Completo

O sistema de acesso dual já está implementado no backend:

### Modelos do Prisma
- **Course**: Adicionados campos `isInClub` e `price`
- **Purchase**: Novo modelo para compras individuais

### Server Actions
- `checkCourseAccess()` em `/app/actions/access.ts` - Valida acesso ao curso
- `createPurchase()` - Registra compra individual
- `hasPurchasedCourse()` - Verifica se usuário já comprou

### Componente de Proteção
- `CourseAccessGuard` em `/components/course-access-guard.tsx` - Guard para páginas de curso

## 🔧 Como Usar nas Páginas de Curso

### Exemplo de Página Protegida

```tsx
// app/cursos/[id]/page.tsx

import { CourseAccessGuard } from '@/components/course-access-guard';
import { getCourseWithModules } from '@/app/actions/courses';

export default async function CursoPage({ params }: { params: { id: string } }) {
  const course = await getCourseWithModules(params.id);
  
  if (!course) {
    return <div>Curso não encontrado</div>;
  }

  return (
    <CourseAccessGuard courseId={params.id}>
      {/* Conteúdo do curso - só aparece se o usuário tiver acesso */}
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-zinc-400 mb-8">{course.description}</p>
        
        {/* Módulos e lições do curso */}
        {course.modules.map((module) => (
          <div key={module.id}>
            <h2>{module.title}</h2>
            {/* ... */}
          </div>
        ))}
      </div>
    </CourseAccessGuard>
  );
}
```

### Lógica de Acesso

O `CourseAccessGuard` verifica automaticamente:

1. **Cursos Gratuitos** (`isPremium = false`): Acesso liberado para todos
2. **Compra Individual**: Verifica se existe registro na tabela `Purchase`
3. **Membro do Clube**: Verifica `subscriptionStatus === 'ACTIVE'` + `course.isInClub === true`

### Redirecionamentos Automáticos

- Usuário não autenticado → `/auth/login?callbackUrl=/cursos/[id]`
- Sem acesso → Mostra página de upgrade com as opções disponíveis

## 📋 Próximos Passos

### 1. Atualizar Formulários Admin (✅ Concluído)
- [x] Adicionar campo `isInClub` (checkbox)
- [x] Adicionar campo `price` (número)
- [x] Atualizar `createCourse()` e `updateCourse()`

### 2. Criar Páginas de Compra

#### /cursos/[id]/comprar
```tsx
import { checkCourseAccess } from '@/app/actions/access';
import { redirect } from 'next/navigation';

export default async function ComprarCursoPage({ params }: { params: { id: string } }) {
  // Verificar se já tem acesso
  const access = await checkCourseAccess(params.id);
  if (access.hasAccess) {
    redirect(`/cursos/${params.id}`);
  }

  const { course } = access;

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Comprar: {course?.title}</h1>
      <p className="text-2xl font-bold text-[#D4AF37] mb-8">€{course?.price}</p>
      
      {/* Formulário de pagamento Stripe aqui */}
      <StripeCheckoutForm courseId={params.id} amount={course?.price} />
    </div>
  );
}
```

#### /upgrade (Clube Madua)
```tsx
export default function UpgradePage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Junte-se ao Clube Madua</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Acesso ilimitado a todos os cursos e conteúdos exclusivos
      </p>

      {/* Planos de assinatura */}
      <div className="grid md:grid-cols-2 gap-6">
        <PlanCard 
          name="Mensal" 
          price="€29/mês" 
          priceId="price_monthly_xxx"
        />
        <PlanCard 
          name="Anual" 
          price="€290/ano" 
          priceId="price_yearly_xxx"
          badge="2 meses grátis"
        />
      </div>
    </div>
  );
}
```

### 3. Integração Stripe

```tsx
// app/actions/payment.ts
'use server';

import Stripe from 'stripe';
import { createPurchase } from './access';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(courseId: string) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: course.title,
          },
          unit_amount: course.price * 100, // em centavos
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/cursos/${courseId}?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cursos/${courseId}/comprar?payment=canceled`,
    metadata: {
      courseId,
      userId,
    },
  });

  return { sessionId: session.id };
}

// Webhook para confirmar pagamento
export async function handleStripeWebhook(event: Stripe.Event) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { courseId, userId } = session.metadata;
    
    // Registrar compra no banco
    await createPurchase({
      userId,
      courseId,
      amount: session.amount_total / 100,
      currency: 'EUR',
    });
  }
}
```

## 💡 Configurações de Acesso

### Curso Exclusivo do Clube
```
isInClub: true
price: null
isPremium: true
```
→ Só membros do Clube têm acesso

### Curso Apenas Venda Individual
```
isInClub: false
price: 97.00
isPremium: true
```
→ Só quem comprar individualmente tem acesso

### Curso Dual (Clube + Venda)
```
isInClub: true
price: 97.00
isPremium: true
```
→ Membros do Clube OU quem comprar individualmente tem acesso

### Curso Gratuito
```
isPremium: false
```
→ Todos têm acesso (isInClub e price são ignorados)

## 🎨 UI de Upgrade

O `CourseAccessGuard` já mostra automaticamente:
- **Duas opções** quando `isInClub = true` e `price` definido
- **Só Clube** quando `isInClub = true` e sem preço
- **Só Compra** quando `isInClub = false` e com preço

## 🔐 Segurança

- ✅ Validação no servidor (Server Component)
- ✅ Proteção contra acesso direto via URL
- ✅ Unique constraint em `Purchase` (userId + courseId)
- ✅ Revalidação automática após compra

## 📝 Teste de Acesso

Para testar os diferentes cenários:

```typescript
// Usuário sem acesso
checkCourseAccess('course-id') 
// → { hasAccess: false, reason: 'needs_club_or_purchase' }

// Usuário com assinatura ativa
checkCourseAccess('course-id') 
// → { hasAccess: true, reason: 'club_member' }

// Usuário que comprou o curso
checkCourseAccess('course-id') 
// → { hasAccess: true, reason: 'individual_purchase' }
```
