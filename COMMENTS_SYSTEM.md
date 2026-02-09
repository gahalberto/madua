# Sistema de Comentários - Documentação

## 🎯 Visão Geral

Sistema completo de comentários para lições da plataforma MADUA, com visual Dark Slate, badges de status (Admin/Premium/Membro) e integração total com Server Actions do Next.js 14.

## 🗄️ Estrutura de Dados

### Model Comment (Prisma)

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  userId    String
  lessonId  String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson    Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([lessonId])
  @@index([userId])
  @@index([createdAt])
}
```

**Campos:**
- `id`: Identificador único (cuid)
- `content`: Texto do comentário (máx. 1000 caracteres)
- `userId`: Referência ao autor
- `lessonId`: Referência à aula
- `createdAt`: Data de criação (ordenação)
- `updatedAt`: Data de atualização

**Relações:**
- User → Comment (1:N) - Um usuário pode ter vários comentários
- Lesson → Comment (1:N) - Uma aula pode ter vários comentários
- `onDelete: Cascade` - Deleta comentários quando usuário/aula é deletado

**Indexes:**
- `lessonId`: Query rápida por aula
- `userId`: Query rápida por autor
- `createdAt`: Ordenação cronológica

## 🔧 Server Actions

### Arquivo: `app/actions/comments.ts`

#### 1. `getCommentsByLessonId(lessonId: string)`

Busca todos os comentários de uma aula específica.

**Retorno:**
```typescript
interface CommentWithUser {
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
```

**Características:**
- ✅ Include user data para exibir nome, foto e badges
- ✅ Ordenação DESC por createdAt (mais recentes primeiro)
- ✅ Error handling com fallback para array vazio

**Uso:**
```typescript
const comments = await getCommentsByLessonId('lesson-id-123');
```

#### 2. `createComment(lessonId: string, content: string)`

Cria um novo comentário na aula.

**Validações:**
- ✅ Requer autenticação (session.user.id)
- ✅ Content não pode estar vazio
- ✅ Máximo 1000 caracteres
- ✅ Trim automático (remove espaços)

**Retorno:**
```typescript
{ success: true, comment: CommentWithUser }
```

**Revalidation:**
```typescript
revalidatePath(`/courses/[courseId]/lessons/${lessonId}`);
```
Atualiza automaticamente a página após criar comentário.

**Uso:**
```typescript
try {
  const result = await createComment('lesson-id', 'Ótima aula!');
  console.log('Comentário criado:', result.comment);
} catch (error) {
  console.error(error.message);
}
```

#### 3. `deleteComment(commentId: string)`

Deleta um comentário (apenas autor ou admin).

**Permissões:**
- ✅ Autor do comentário
- ✅ Usuários com role === 'ADMIN'

**Validações:**
- Comentário existe?
- Usuário tem permissão?

**Uso:**
```typescript
await deleteComment('comment-id-123');
```

#### 4. `getCommentsCount(lessonId: string)`

Retorna total de comentários de uma aula.

**Uso:**
```typescript
const total = await getCommentsCount('lesson-id-123');
console.log(`${total} comentários`);
```

## 🎨 Componente React

### `<CommentsList />`

Componente client-side para exibir e gerenciar comentários.

**Props:**
```typescript
interface CommentsListProps {
  lessonId: string;
  initialComments: CommentWithUser[];
}
```

**Uso:**
```tsx
import { CommentsList } from '@/components/comments-list';

<CommentsList 
  lessonId={params.lessonId}
  initialComments={comments}
/>
```

### Estrutura do Componente

#### 1. **UserAvatar**
Exibe foto do usuário ou iniciais em círculo dourado.

```tsx
// Com imagem
<Image src={user.image} width={40} height={40} />

// Sem imagem (fallback)
<div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#F4D03F]">
  <span>GA</span> {/* Iniciais */}
</div>
```

#### 2. **UserBadge**
Exibe badge de status baseado em role e subscriptionStatus.

**Admin:**
```tsx
<span className="bg-red-500/20 text-red-400">
  <Shield /> Admin
</span>
```

**Premium (subscriptionStatus === 'ACTIVE'):**
```tsx
<span className="bg-[#D4AF37]/20 text-[#D4AF37]">
  <Crown /> Membro Premium
</span>
```

**Membro (padrão):**
```tsx
<span className="bg-gray-700/50 text-gray-400">
  Membro
</span>
```

#### 3. **CommentItem**
Card individual de comentário.

**Elementos:**
- Avatar + Nome + Badge + Timestamp
- Conteúdo do comentário (whitespace-pre-wrap)
- Botão de deletar (apenas autor)

**Cores Dark Slate:**
- Background: `#1A1F2E`
- Border: `#2A3441`
- Hover border: `#374151`
- Texto: `#D1D5DB` (gray-300)

#### 4. **Form de Novo Comentário**

**Estados:**
- `newComment`: Texto do comentário
- `isPending`: Loading state (useTransition)

**Validações client-side:**
- Desabilita submit se vazio
- Contador 0/1000 caracteres
- Textarea com maxLength={1000}

**Feedback visual:**
- Loading spinner durante submit
- Desabilita textarea durante submit
- Border dourado no focus

**Não autenticado:**
```tsx
<div className="bg-[#1A1F2E] p-6 text-center">
  <p>Faça login para comentar</p>
  <a href="/login">Fazer Login</a>
</div>
```

### Funcionalidades

#### Timestamp Relativo
```typescript
const timeAgo = (date: Date) => {
  // 2 anos atrás
  // 3 meses atrás
  // 5 dias atrás
  // 2 horas atrás
  // 15 minutos atrás
  // agora mesmo
}
```

#### Estado Otimista
Ao criar comentário:
```typescript
const result = await createComment(lessonId, newComment);
if (result.success) {
  setComments([result.comment, ...comments]); // Adiciona no topo
  setNewComment(''); // Limpa form
}
```

Ao deletar:
```typescript
await deleteComment(commentId);
setComments(comments.filter(c => c.id !== commentId)); // Remove da lista
```

## 🎨 Design System - Dark Slate

### Paleta de Cores

```css
/* Backgrounds */
--bg-dark: #0F1419;      /* Input background */
--bg-card: #1A1F2E;      /* Comment card */
--bg-main: #0A0A0A;      /* Page background */

/* Borders */
--border-default: #2A3441;
--border-hover: #374151;
--border-focus: #D4AF37;  /* Dourado */

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #D1D5DB;  /* gray-300 */
--text-muted: #9CA3AF;      /* gray-400 */
--text-subtle: #6B7280;     /* gray-500 */

/* Accent */
--accent-gold: #D4AF37;
--accent-gold-light: #C19B2F;
```

### Componentes

**Comment Card:**
```tsx
className="bg-[#1A1F2E] rounded-lg p-4 border border-[#2A3441] hover:border-[#374151]"
```

**Input/Textarea:**
```tsx
className="bg-[#0F1419] border-[#2A3441] focus:border-[#D4AF37]"
```

**Button Primary:**
```tsx
className="bg-[#D4AF37] hover:bg-[#C19B2F] text-black"
```

**Badge Admin:**
```tsx
className="bg-red-500/20 text-red-400"
```

**Badge Premium:**
```tsx
className="bg-[#D4AF37]/20 text-[#D4AF37]"
```

## 📱 Responsividade

O componente é totalmente responsivo:

```tsx
// Mobile
<div className="flex flex-col gap-2">

// Desktop
<div className="flex items-center gap-2">

// Wrap em badges
<div className="flex items-center gap-2 flex-wrap">
```

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔐 Segurança

### Server-side
✅ Validação de autenticação em todas as actions  
✅ Verificação de permissões (delete apenas autor/admin)  
✅ Sanitização de input (trim, maxLength)  
✅ onDelete: Cascade no Prisma (integridade referencial)

### Client-side
✅ Desabilita botões durante loading  
✅ Validação de campos vazios  
✅ MaxLength enforcement  
✅ Confirmação antes de deletar

## 🚀 Integração na Página de Aula

### 1. Importar dependencies

```typescript
import { CommentsList } from '@/components/comments-list';
import { getCommentsByLessonId, type CommentWithUser } from '@/app/actions/comments';
```

### 2. Criar estado e buscar dados

```typescript
const [comments, setComments] = useState<CommentWithUser[]>([]);
const [isLoadingComments, setIsLoadingComments] = useState(true);

useEffect(() => {
  async function loadComments() {
    setIsLoadingComments(true);
    const data = await getCommentsByLessonId(params.lessonId);
    setComments(data);
    setIsLoadingComments(false);
  }
  loadComments();
}, [params.lessonId]);
```

### 3. Renderizar na tab "comments"

```tsx
{activeTab === "comments" && (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">
      Comentários {!isLoadingComments && `(${comments.length})`}
    </h2>
    
    {isLoadingComments ? (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    ) : (
      <CommentsList lessonId={params.lessonId} initialComments={comments} />
    )}
  </div>
)}
```

## 📊 Dados de Exemplo (Seed)

### Comentários criados no seed:

```typescript
// Dieta da Selva - Aula 1
- Demo User: "Excelente aula! Os conceitos..."
- Admin: "Conteúdo de altíssima qualidade..."
- Free User: "Muito didático! Ficou claro..."

// Neantropia - Aula 1
- Demo User: "Treino sensacional! Consegui..."
- Admin: "Como personal trainer, aprovo..."
```

**Timestamps:**
- 2 dias atrás
- 1 dia atrás
- 12 horas atrás
- Recentes

## 🧪 Testing

### Cenários de Teste

**1. Criar Comentário**
```
1. Fazer login (demo@madua.com)
2. Ir para /courses/[id]/lessons/[id]
3. Clicar na tab "Comentários"
4. Escrever comentário
5. Clicar "Comentar"
6. Verificar: aparece no topo da lista
```

**2. Deletar Comentário (Autor)**
```
1. Login como autor do comentário
2. Clicar no ícone de lixeira
3. Confirmar
4. Verificar: comentário removido
```

**3. Deletar Comentário (Admin)**
```
1. Login como admin@madua.com
2. Pode deletar qualquer comentário
```

**4. Badges de Status**
```
Admin: Shield vermelho "Admin"
Premium Active: Crown dourado "Membro Premium"
Outros: Badge cinza "Membro"
```

**5. Não Autenticado**
```
1. Logout
2. Ir para página de aula
3. Tab comentários mostra: "Faça login para comentar"
```

## 🎯 Melhorias Futuras

### Funcionalidades
- [ ] Editar comentário (apenas autor)
- [ ] Responder comentário (threading)
- [ ] Reações (like, heart, fire)
- [ ] Menções (@username)
- [ ] Notificações de respostas
- [ ] Ordenação (recentes, populares, antigos)
- [ ] Paginação/Infinite scroll
- [ ] Moderação (report/flag)

### UX
- [ ] Markdown support
- [ ] Upload de imagens
- [ ] Preview antes de enviar
- [ ] Arrastar para reordenar
- [ ] Keyboard shortcuts
- [ ] Rich text editor

### Performance
- [ ] Virtual scrolling (muitos comentários)
- [ ] Lazy loading de avatares
- [ ] Debounce em live typing
- [ ] Cache com SWR/React Query

## 📈 Métricas

Eventos úteis para analytics:
- `comment_created` - Novo comentário
- `comment_deleted` - Comentário deletado
- `comments_viewed` - Visualização da tab
- `comment_time_spent` - Tempo lendo comentários

Exemplo com Vercel Analytics:
```typescript
import { track } from '@vercel/analytics';

await createComment(lessonId, content);
track('comment_created', { lessonId, length: content.length });
```

---

**Desenvolvido para MADUA** - Sistema de comentários com visual Dark Slate e badges de status.
