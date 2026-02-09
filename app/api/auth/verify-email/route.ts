import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_verification_link", request.url)
      );
    }

    // Buscar o token de verificação
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

    // Verificar se o token existe e não expirou
    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", request.url)
      );
    }

    if (verificationToken.expires < new Date()) {
      // Token expirado - deletar
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: token,
          },
        },
      });

      return NextResponse.redirect(
        new URL("/login?error=token_expired", request.url)
      );
    }

    // Atualizar o usuário para marcar e-mail como verificado
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Deletar o token usado
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

    // Redirecionar para login com sucesso
    return NextResponse.redirect(
      new URL("/login?verified=true", request.url)
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.redirect(
      new URL("/login?error=verification_failed", request.url)
    );
  }
}
