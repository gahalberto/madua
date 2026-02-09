import { checkCourseAccess } from '@/app/actions/access';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Lock, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';

interface CourseAccessGuardProps {
  courseId: string;
  children: React.ReactNode;
}

export async function CourseAccessGuard({ courseId, children }: CourseAccessGuardProps) {
  const accessCheck = await checkCourseAccess(courseId);

  // Se tem acesso, renderiza o conteúdo
  if (accessCheck.hasAccess) {
    return <>{children}</>;
  }

  // Se não está autenticado, redireciona para login
  if (accessCheck.reason === 'not_authenticated') {
    redirect(`/login?callbackUrl=/cursos/${courseId}`);
  }

  // Se o curso não existe, mostra 404
  if (accessCheck.reason === 'course_not_found') {
    notFound();
  }

  // Se não tem acesso, mostra página de upgrade
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Conteúdo Exclusivo</h1>
          <p className="text-zinc-400">
            {accessCheck.course?.title ? `"${accessCheck.course.title}"` : 'Este curso'} é um conteúdo premium
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {accessCheck.course?.isInClub && (
            <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Torne-se Membro do Clube</h3>
                  <p className="text-zinc-300 text-sm mb-4">
                    Acesso ilimitado a todos os cursos, vlogs e conteúdos exclusivos da Madua
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-400 mb-4">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      Acesso vitalício a todos os cursos do clube
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      Novos conteúdos toda semana
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      Comunidade exclusiva
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/upgrade"
                className="block w-full px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold text-center rounded-lg transition-colors"
              >
                Aderir ao Clube Madua
              </Link>
            </div>
          )}

          {accessCheck.course?.price && (
            <div className="bg-[#1A1F2E] border border-zinc-800 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Compra Individual</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Adquira acesso vitalício apenas a este curso
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-white">€{accessCheck.course.price}</span>
                  <span className="text-zinc-500">pagamento único</span>
                </div>
              </div>
              <Link
                href={`/cursos/${courseId}/comprar`}
                className="block w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-center rounded-lg transition-colors"
              >
                Comprar Este Curso
              </Link>
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Cursos
          </Link>
        </div>
      </div>
    </div>
  );
}
