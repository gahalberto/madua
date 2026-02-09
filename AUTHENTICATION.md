# Sistema de Autenticação e Controle de Acesso Premium

## 🎯 Visão Geral

O sistema implementa um controle de acesso baseado em assinatura que diferencia:
- **Conteúdo Gratuito**: Acessível a todos os usuários autenticados
- **Conteúdo Premium**: Requer `subscriptionStatus === 'ACTIVE'`

## 🔐 Arquitetura

### 1. Middleware de Autenticação (`/middleware.ts`)

O middleware intercepta todas as requisições para rotas `/courses/*` e:

```typescript
1. Verifica se o usuário está autenticado
2. Extrai o courseId da URL
3. Faz uma requisição para `/api/courses/[courseId]/check-access`
4. Valida o acesso baseado em:
   - Se o curso é premium (isPremium)
   - Status da assinatura do usuário (subscriptionStatus)
5. Redireciona para `/upgrade` se não tiver acesso
```

**Fluxo de Decisão:**
```
Usuário acessa /courses/[courseId]
↓
Middleware verifica autenticação
↓
├─ Não autenticado → Redireciona para /login
└─ Autenticado → Verifica acesso ao curso
   ↓
   ├─ Curso gratuito (isPremium: false) → ✅ ACESSO PERMITIDO
   └─ Curso premium (isPremium: true)
      ↓
      ├─ subscriptionStatus: 'ACTIVE' → ✅ ACESSO PERMITIDO
      └─ subscriptionStatus: 'INACTIVE'|'CANCELED'|'PAST_DUE' → ❌ Redireciona para /upgrade
```

### 2. API de Verificação de Acesso

**Endpoint:** `GET /api/courses/[courseId]/check-access`

**Headers requeridos:**
- `x-user-id`: ID do usuário autenticado
- `x-subscription-status`: Status da assinatura

**Resposta (Acesso Permitido):**
```json
{
  "hasAccess": true,
  "courseTitle": "Nome do Curso",
  "isPremium": true,
  "isFree": false,
  "contentType": "COURSE" | "VLOG" | "WORKSHOP"
}
```

**Resposta (Acesso Negado - 403):**
```json
{
  "hasAccess": false,
  "reason": "NO_SUBSCRIPTION" | "UNPUBLISHED",
  "courseTitle": "Nome do Curso",
  "isPremium": true,
  "contentType": "COURSE"
}
```

### 3. Sessão NextAuth com subscriptionStatus

O sistema estende o NextAuth para incluir `subscriptionStatus` na sessão:

**auth.ts:**
```typescript
// Callback JWT - Adiciona subscriptionStatus ao token
async jwt({ token, user }) {
  if (user) {
    token.role = user.role;
    token.subscriptionStatus = user.subscriptionStatus;
  }
  return token;
}

// Callback Session - Passa para a sessão
async session({ session, token }) {
  if (session?.user) {
    session.user.role = token.role;
    session.user.subscriptionStatus = token.subscriptionStatus;
  }
  return session;
}
```

**Tipos TypeScript:**
```typescript
interface Session {
  user: {
    id: string;
    role: string;
    subscriptionStatus: string; // ← NOVO
  } & DefaultSession["user"];
}
```

### 4. Componentes React de Controle

#### `<PremiumBadge />` - Badge visual de status
```tsx
<PremiumBadge isPremium={true} />  // Mostra "Premium" com ícone Crown
<PremiumBadge isPremium={false} /> // Mostra "Gratuito" em verde
```

#### `<ContentTypeBadge />` - Badge de tipo de conteúdo
```tsx
<ContentTypeBadge type="COURSE" />    // Azul
<ContentTypeBadge type="VLOG" />      // Roxo
<ContentTypeBadge type="WORKSHOP" />  // Laranja
```

#### `<AccessGate />` - Componente de bloqueio visual
```tsx
<AccessGate 
  isPremium={course.isPremium}
  courseId={course.id}
  courseName={course.title}
>
  {/* Conteúdo protegido */}
  <VideoPlayer url={lesson.videoUrl} />
</AccessGate>
```

**Comportamento:**
- **Conteúdo gratuito**: Renderiza children normalmente
- **Conteúdo premium sem assinatura**: 
  - Aplica blur no conteúdo
  - Sobrepõe overlay com ícone de cadeado
  - Mostra botão "Fazer Upgrade"

### 5. Página de Upgrade (`/upgrade`)

Landing page de conversão com:
- ✨ Destaque visual (Crown, gradientes dourados)
- 💰 Preço e plano mensal
- ✅ Lista de benefícios
- 📊 Badges de confiança (estatísticas sociais)
- 🔗 Link para conteúdo gratuito

**Query params aceitos:**
- `courseId`: ID do curso bloqueado
- `courseName`: Nome para personalizar mensagem

## 🗄️ Schema Prisma

### Enum SubscriptionStatus
```prisma
enum SubscriptionStatus {
  ACTIVE      // Assinatura ativa - acesso total
  CANCELED    // Cancelada mas ainda dentro do período pago
  PAST_DUE    // Pagamento atrasado - acesso temporariamente bloqueado
  INACTIVE    // Sem assinatura - acesso apenas a conteúdo gratuito
}
```

### Enum ContentType
```prisma
enum ContentType {
  COURSE      // Treinamento estruturado em módulos
  VLOG        // Conteúdo estilo YouTube
  WORKSHOP    // Gravações de lives/eventos
}
```

### Model User
```prisma
model User {
  // ... outros campos
  subscriptionStatus SubscriptionStatus @default(INACTIVE)
  stripeCustomerId   String?            @unique // Para integração Stripe
  
  @@index([subscriptionStatus]) // Performance em queries
}
```

### Model Course
```prisma
model Course {
  // ... outros campos
  type        ContentType @default(COURSE)
  isPremium   Boolean     @default(true)  // false = conteúdo gratuito
  isPublished Boolean     @default(false) // controle de publicação
  
  @@index([isPremium])
  @@index([type])
}
```

## 🧪 Testes de Acesso

### Usuários de Teste

| Email | Senha | Subscription | Acesso |
|-------|-------|--------------|--------|
| admin@madua.com | demo123 | ACTIVE | ✅ Todo conteúdo |
| demo@madua.com | demo123 | ACTIVE | ✅ Todo conteúdo |
| free@madua.com | demo123 | INACTIVE | 🔒 Apenas gratuito |

### Cenários de Teste

**1. Conteúdo Gratuito (Vlogs)**
```
Login: free@madua.com
Acesso: /courses/{vlog-id}
Resultado: ✅ Acesso permitido
```

**2. Conteúdo Premium com Assinatura**
```
Login: demo@madua.com (ACTIVE)
Acesso: /courses/{premium-course-id}
Resultado: ✅ Acesso permitido
```

**3. Conteúdo Premium sem Assinatura**
```
Login: free@madua.com (INACTIVE)
Acesso: /courses/{premium-course-id}
Resultado: ❌ Redireciona para /upgrade
```

**4. Não Autenticado**
```
Sem login
Acesso: /courses/{any-course-id}
Resultado: ❌ Redireciona para /login
```

## 🚀 Integração com Stripe (Próximos Passos)

### 1. Webhook de Pagamentos
```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(...)
  
  switch (event.type) {
    case 'customer.subscription.created':
      // Atualizar User.subscriptionStatus = 'ACTIVE'
      break;
    case 'customer.subscription.deleted':
      // Atualizar User.subscriptionStatus = 'CANCELED'
      break;
    case 'invoice.payment_failed':
      // Atualizar User.subscriptionStatus = 'PAST_DUE'
      break;
  }
}
```

### 2. Checkout Session
```typescript
// app/api/checkout/route.ts
const session = await stripe.checkout.sessions.create({
  customer: user.stripeCustomerId,
  line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
  mode: 'subscription',
  success_url: `${origin}/dashboard?success=true`,
  cancel_url: `${origin}/upgrade?canceled=true`,
});
```

### 3. Customer Portal
```typescript
// Botão em /configuracoes
const portal = await stripe.billingPortal.sessions.create({
  customer: user.stripeCustomerId,
  return_url: `${origin}/configuracoes`,
});
```

## 🔒 Segurança

### Proteções Implementadas

1. **Middleware Next.js**: Bloqueio no servidor antes do rendering
2. **API de Verificação**: Validação adicional com Prisma
3. **Session JWT**: subscriptionStatus incluído no token (não manipulável)
4. **TypeScript**: Tipos garantem consistência
5. **Indexes no DB**: Performance em queries de autorização

### Limitações do Cliente

⚠️ **Importante:** O componente `<AccessGate />` é apenas visual. Usuários técnicos podem:
- Remover blur via DevTools
- Desabilitar JavaScript
- Manipular o DOM

**Solução:** O middleware garante que a página nunca seja servida se não houver acesso. O `<AccessGate />` é uma camada adicional de UX, não de segurança.

## 📊 Métricas Sugeridas

Implementar tracking para:
- Conversões em `/upgrade`
- Tentativas de acesso bloqueadas
- Cursos mais populares (gratuitos vs premium)
- Taxa de churn por tipo de conteúdo

## 🎨 Personalização

### Alterar Preço do Plano
```tsx
// app/upgrade/page.tsx - linha ~50
<span className="text-5xl font-bold">R$ 97</span>
```

### Modificar Benefícios
```tsx
// app/upgrade/page.tsx - array de benefits
const benefits = [
  'Acesso ilimitado a todos os cursos',
  'Novos workshops toda semana',
  // ... adicionar/remover aqui
];
```

### Customizar Cor Premium
```tsx
// tailwind.config.ts
colors: {
  accent: '#D4AF37', // ← Cor dourada premium
}
```

## ✅ Checklist de Implementação

- [x] Middleware de autenticação
- [x] API de verificação de acesso
- [x] Extensão NextAuth com subscriptionStatus
- [x] Página de upgrade
- [x] Componentes visuais (badges, locks)
- [x] Seed com dados de teste
- [ ] Integração Stripe (checkout)
- [ ] Webhooks Stripe
- [ ] Customer Portal
- [ ] Testes automatizados
- [ ] Métricas e analytics

---

**Desenvolvido para MADUA** - Sistema de controle de acesso premium baseado em assinatura.
