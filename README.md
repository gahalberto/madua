# Madua

Projeto Next.js 14 com App Router, desenvolvido com as melhores práticas e tecnologias modernas.

## 🚀 Stack Tecnológica

- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript e Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones

## 🎨 Design System

### Paleta de Cores Dark Mode

```css
/* Backgrounds */
--background: #0A0A0A (Preto profundo)
--background-dark: #000000
--background-light: #1A1A1A

/* Grays */
--gray-950: #0A0A0A
--gray-900: #1A1A1A
--gray-850: #2A2A2A
--gray-800: #3A3A3A
--gray-700: #4A4A4A
--gray-600: #5A5A5A

/* Accent (Dourado Âmbar) */
--accent: #D4AF37
--accent-light: #E5C158
--accent-dark: #B89621
--accent-muted: #8A7128
```

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do PostgreSQL
```

## 🗄️ Configuração do Banco de Dados

### Usando Docker (Recomendado)

1. Inicie o container PostgreSQL:

```bash
docker-compose up -d
```

2. O banco de dados estará disponível em:
   - **Host**: localhost
   - **Porta**: 5432
   - **Usuário**: usuario
   - **Senha**: senha
   - **Database**: madua

3. Execute as migrações:

```bash
npx prisma migrate dev
```

4. (Opcional) Visualize o banco de dados com Prisma Studio:

```bash
npx prisma studio
```

### Comandos Docker Úteis

```bash
# Iniciar o banco
docker-compose up -d

# Parar o banco
docker-compose down

# Ver logs
docker-compose logs -f

# Remover volumes (apaga os dados)
docker-compose down -v
```

### Usando PostgreSQL Local

Se preferir usar uma instalação local do PostgreSQL:

1. Configure a `DATABASE_URL` no arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/madua?schema=public"
```

2. Execute as migrações:

```bash
npx prisma migrate dev
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Lint
npm run lint

# Prisma Studio
npx prisma studio

# Gerar Prisma Client
npx prisma generate

# Criar nova migração
npx prisma migrate dev --name nome_da_migracao
```

## 📁 Estrutura do Projeto

```
madua/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── lib/
│   └── prisma.ts          # Cliente Prisma singleton
├── prisma/
│   └── schema.prisma      # Schema do banco de dados
├── public/                # Arquivos estáticos
├── .env                   # Variáveis de ambiente
├── tailwind.config.ts     # Configuração Tailwind
└── tsconfig.json          # Configuração TypeScript
```

## 🌐 Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 📝 Prisma

### Modelo de Exemplo

O projeto já inclui um modelo `User` de exemplo no [prisma/schema.prisma](prisma/schema.prisma):

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Uso do Prisma Client

```typescript
import { prisma } from '@/lib/prisma'

// Exemplo: criar um usuário
const user = await prisma.user.create({
  data: {
    email: 'usuario@exemplo.com',
    name: 'Nome do Usuário'
  }
})
```

## 🎯 Tailwind CSS

As cores customizadas estão disponíveis através das classes Tailwind:

```tsx
<div className="bg-background text-foreground">
  <h1 className="text-accent">Título com cor dourada</h1>
  <p className="text-foreground-muted">Texto com cor muted</p>
  <div className="bg-gray-900 border-gray-800">Card escuro</div>
</div>
```

## 📚 Próximos Passos

- [ ] Implementar autenticação
- [ ] Adicionar testes (Jest/Vitest)
- [ ] Configurar CI/CD
- [ ] Adicionar mais modelos no Prisma
- [ ] Implementar API Routes

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
