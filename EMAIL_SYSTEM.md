# 📧 Sistema de Verificação de E-mail - Madua

Sistema completo de verificação de e-mail com estética "Ancestral Luxury" usando React Email + Resend.

## 🚀 Configuração Rápida

### 1. Instalar Dependências
```bash
npm install resend @react-email/components
```

### 2. Configurar Variáveis de Ambiente
Adicione ao seu arquivo `.env`:

```env
# Resend API Key (obtenha em: https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# E-mail remetente (deve ser domínio verificado no Resend)
EMAIL_FROM=Madua <noreply@madua.com>

# URL base da aplicação
NEXT_PUBLIC_APP_URL=https://madua.com
```

### 3. Obter API Key do Resend

1. Acesse: https://resend.com/
2. Crie uma conta (grátis - 100 e-mails/dia)
3. Vá em **API Keys** > **Create API Key**
4. Copie a chave e adicione ao `.env`

### 4. Configurar Domínio (Produção)

Para produção, você precisa verificar seu domínio:

1. No painel Resend, vá em **Domains**
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `madua.com`)
4. Adicione os registros DNS fornecidos
5. Aguarde verificação (até 72h)

**Nota:** Para desenvolvimento, use `onboarding@resend.dev` (sem verificação).

## 📁 Estrutura de Arquivos

```
madua/
├── emails/
│   └── WelcomeMadua.tsx          # Template do e-mail
├── lib/
│   └── mail.ts                   # Funções de envio
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── verify-email/
│   │   │       └── route.ts      # API de verificação
│   │   └── register/
│   │       └── route.ts          # Envia e-mail ao registrar
│   ├── login/
│   │   └── page.tsx              # Mensagens de verificação
│   └── register/
│       └── page.tsx              # Confirmação de envio
```

## 🎨 Design do E-mail

O template segue rigorosamente a estética "Ancestral Luxury":

- **Fundo:** Preto profundo (#050505)
- **Texto:** Off-white (#F5F5F5)
- **Destaque:** Dourado envelhecido (#D4AF37)
- **CTA:** Botão dourado com texto preto
- **Tipografia:** Serifada para títulos

### Copywriting

**Assunto:** "Convocatória Madua: Confirme a sua Lealdade."

**Título:** "BEM-VINDO À RESISTÊNCIA."

**Botão:** "ATIVAR MINHA CONTA AGORA"

## 🔄 Fluxo de Verificação

```
1. Usuário cria conta
   ↓
2. Sistema gera token único (24h de validade)
   ↓
3. E-mail enviado com link de verificação
   ↓
4. Usuário clica no link
   ↓
5. Token validado → E-mail marcado como verificado
   ↓
6. Redirecionamento para login com mensagem de sucesso
```

## 🔗 Links de Verificação

Formato:
```
https://madua.com/api/auth/verify-email?token=abc123&email=usuario@email.com
```

- **Token:** Gerado com `crypto.randomBytes(32).toString('hex')`
- **Validade:** 24 horas
- **Uso único:** Token deletado após verificação

## 📊 Estados de Verificação

### Página de Registro
- ✅ Sucesso: Mostra tela com instruções para verificar e-mail
- ❌ Erro: Mostra mensagem de erro específica

### Página de Login
- ✅ `?verified=true`: E-mail verificado com sucesso
- ❌ `?error=invalid_token`: Token inválido
- ❌ `?error=token_expired`: Token expirado
- ❌ `?error=verification_failed`: Erro na verificação

## 🧪 Testar Localmente

### Modo Desenvolvimento (sem domínio verificado)

Use o domínio de teste do Resend:

```typescript
// lib/mail.ts
from: "onboarding@resend.dev"
```

**Importante:** E-mails enviados do domínio de teste só chegam para o e-mail cadastrado na conta Resend.

### Visualizar Template Localmente

1. Instale o CLI do React Email:
```bash
npm install -g react-email
```

2. Execute o servidor de preview:
```bash
cd emails
react-email preview
```

3. Acesse: http://localhost:3000

## 🛠️ Funções Disponíveis

### `sendVerificationEmail()`
Envia e-mail de verificação ao criar conta.

```typescript
await sendVerificationEmail({
  email: "usuario@email.com",
  verificationUrl: "https://madua.com/verify?token=...",
  userName: "João Silva"
});
```

### `sendWelcomeEmail()`
Envia e-mail de boas-vindas (após verificação).

```typescript
await sendWelcomeEmail({
  email: "usuario@email.com",
  userName: "João Silva"
});
```

### `sendPasswordResetEmail()`
Envia e-mail de recuperação de senha.

```typescript
await sendPasswordResetEmail({
  email: "usuario@email.com",
  resetUrl: "https://madua.com/reset-password?token=...",
  userName: "João Silva"
});
```

### `createVerificationToken()`
Cria token de verificação único.

```typescript
const token = await createVerificationToken("usuario@email.com");
```

## ⚠️ Limitações

### Plano Gratuito Resend
- 100 e-mails/dia
- 3.000 e-mails/mês
- 1 domínio verificado

Para mais, veja: https://resend.com/pricing

## 🔒 Segurança

- ✅ Tokens criptograficamente seguros (`crypto.randomBytes`)
- ✅ Expiração em 24 horas
- ✅ Uso único (token deletado após uso)
- ✅ Validação de e-mail e token
- ✅ Sanitização de inputs

## 🐛 Troubleshooting

### E-mail não chega

1. **Verifique API Key:** Confirme que está correta no `.env`
2. **Confira domínio:** Use `onboarding@resend.dev` para teste
3. **Verifique spam:** E-mails de teste podem cair no spam
4. **Logs:** Confira console do servidor para erros

### Token inválido

1. **Expirou:** Tokens expiram em 24h
2. **Já usado:** Tokens são de uso único
3. **E-mail incorreto:** Verifica se o e-mail do link está correto

### Template não renderiza

1. **Importações:** Verifique imports do `@react-email/components`
2. **Tailwind:** Confirme que está dentro do componente `<Tailwind>`
3. **Estilos inline:** Use `style={{}}` para garantir compatibilidade

## 📚 Recursos

- [Documentação Resend](https://resend.com/docs)
- [React Email Components](https://react.email/docs/components/html)
- [HTML Email Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding/)

## 🎯 Próximos Passos

- [ ] Template de e-mail de reset de senha
- [ ] Template de e-mail de boas-vindas personalizado
- [ ] E-mail de confirmação de assinatura
- [ ] E-mail de notificações (novos cursos, etc)
- [ ] Analytics de abertura de e-mails
