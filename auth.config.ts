import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  // O SEGREDO É OBRIGATÓRIO AQUI
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  
  // FORÇAR AS CONFIGURAÇÕES DE COOKIE
  // Isso garante que o Middleware use o mesmo "salt" que criou o cookie
  useSecureCookies: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`, // Força o nome exato que está no seu navegador
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: '.madua.com.br' // Garante o domínio
      }
    }
  },
  
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Se tentar ir pro login estando logado, manda pro dashboard
        if (nextUrl.pathname === "/login") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
    // Precisamos desses callbacks aqui para o tipo bater, mesmo que vazios
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.subscriptionStatus = user.subscriptionStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
      }
      return session;
    }
  },
  providers: [], // Mantém vazio aqui para compatibilidade com Edge
} satisfies NextAuthConfig;