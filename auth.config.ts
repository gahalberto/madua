import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        if (nextUrl.pathname === "/login") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
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
  providers: [],
} satisfies NextAuthConfig;