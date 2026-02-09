import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const subscriptionStatus = request.headers.get('x-subscription-status');

    if (!userId) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar informações do curso
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      select: {
        id: true,
        title: true,
        isPremium: true,
        isPublished: true,
        type: true,
      },
    });

    // Curso não encontrado
    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    // Curso não publicado
    if (!course.isPublished) {
      return NextResponse.json(
        { 
          hasAccess: false,
          reason: 'UNPUBLISHED',
          courseTitle: course.title,
        },
        { status: 403 }
      );
    }

    // Conteúdo gratuito - todos têm acesso
    if (!course.isPremium) {
      return NextResponse.json({
        hasAccess: true,
        courseTitle: course.title,
        isFree: true,
        contentType: course.type,
      });
    }

    // Conteúdo premium - verificar assinatura
    const hasActiveSubscription = subscriptionStatus === 'ACTIVE';

    if (!hasActiveSubscription) {
      return NextResponse.json(
        {
          hasAccess: false,
          reason: 'NO_SUBSCRIPTION',
          courseTitle: course.title,
          isPremium: true,
          contentType: course.type,
        },
        { status: 403 }
      );
    }

    // Usuário com assinatura ativa tem acesso a conteúdo premium
    return NextResponse.json({
      hasAccess: true,
      courseTitle: course.title,
      isPremium: true,
      contentType: course.type,
    });
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
