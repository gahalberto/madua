import { checkCourseAccess } from '@/app/actions/access';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Shield,
  Clock,
} from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ComprarCursoPage({ params }: PageProps) {
  const access = await checkCourseAccess(params.id);

  // Se já tem acesso, redireciona para o curso
  if (access.hasAccess) {
    redirect(`/cursos/${params.id}`);
  }

  const { course } = access;

  // Se o curso não existe ou não tem preço, não pode ser comprado
  if (!course || !course.price) {
    notFound();
  }

  const benefits = [
    'Acesso vitalício ao curso',
    'Todos os módulos e aulas',
    'Atualizações futuras incluídas',
    'Certificado de conclusão',
    'Suporte dedicado',
    'Acesso em todos os dispositivos',
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#1A1F2E] border-b border-zinc-800">
        <div className="container mx-auto px-6 py-8">
          <Link
            href={`/cursos/${params.id}`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Curso
          </Link>

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">
              Comprar Curso
            </h1>
            <p className="text-zinc-400">
              Obtenha acesso vitalício a todo o conteúdo
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Course Info */}
          <div>
            <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 overflow-hidden mb-6">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="text-zinc-400 text-sm">{course.description}</p>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                O que está incluído
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Purchase Card */}
          <div>
            <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 p-6 sticky top-6">
              {/* Price */}
              <div className="text-center pb-6 border-b border-zinc-800 mb-6">
                <p className="text-zinc-400 text-sm mb-2">Preço único</p>
                <p className="text-5xl font-bold text-white mb-1">
                  €{course.price.toFixed(2)}
                </p>
                <p className="text-zinc-500 text-sm">Pagamento único</p>
              </div>

              {/* Purchase Button */}
              <button
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold rounded-lg transition-colors mb-4"
              >
                <CreditCard className="w-5 h-5" />
                Comprar Agora
              </button>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 mb-6">
                <Shield className="w-4 h-4" />
                <span>Pagamento 100% seguro</span>
              </div>

              {/* Or Club Option */}
              {course.isInClub && (
                <div className="pt-6 border-t border-zinc-800">
                  <p className="text-sm text-zinc-400 text-center mb-3">
                    Ou ganhe acesso a todos os cursos
                  </p>
                  <Link
                    href="/upgrade"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Ver Clube Madua
                  </Link>
                </div>
              )}

              {/* Money Back Guarantee */}
              <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-400 mb-1">
                      Garantia de 30 dias
                    </p>
                    <p className="text-xs text-zinc-400">
                      Se não ficar satisfeito, devolvemos seu dinheiro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
