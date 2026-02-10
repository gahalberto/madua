import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Tenta pegar o token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  console.log(`[Middleware] Path: ${pathname} | Token encontrado: ${!!token}`);

  // 2. Definição de Rotas Públicas
  // Dica: Use startsWith para liberar sub-rotas (ex: /blog/post-1)
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/sobre') ||
    pathname.startsWith('/receitas') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/termos') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/upgrade') ||
    pathname.startsWith('/assinatura') ||
    pathname.startsWith('/api/') ||     // Libera APIs
    pathname.startsWith('/_next') ||    // Libera arquivos internos do Next
    pathname.startsWith('/static') ||   // Libera pasta static
    pathname.includes('.');             // Libera arquivos (imagens, favicon, etc)

  // 3. Lógica de Redirecionamento
  
  // Se for rota pública, deixa passar
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Se NÃO for pública e NÃO tiver token -> Login
  if (!token) {
    console.log(`[Middleware] Acesso negado a ${pathname}. Redirecionando para login.`);
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Se tiver token, deixa passar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};