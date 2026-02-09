import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

interface PageProps {
  params: {
    courseId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: params.courseId }, { title: { contains: params.courseId, mode: 'insensitive' } }],
    },
  });

  if (!course) {
    return {
      title: 'Curso não encontrado | Madua',
    };
  }

  return {
    title: `${course.title} - Comprar | Madua`,
    description: course.description || `Adquire acesso ao curso ${course.title}`,
    openGraph: {
      title: course.title,
      description: course.description || undefined,
      images: course.thumbnail ? [course.thumbnail] : [],
    },
  };
}

export { default } from './page';
