import { checkCourseAccess } from '@/app/actions/access';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  Crown,
  Lock,
  Play,
  Star,
  Shield,
  Zap,
  Users,
  BookOpen,
  Video,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CountdownTimer } from '@/components/countdown-timer';

interface PageProps {
  params: {
    courseId: string;
  };
}

export default async function CourseBuyPage({ params }: PageProps) {
  // const session = await auth();

  // Buscar curso pelo ID ou slug
  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: params.courseId }, { title: { contains: params.courseId, mode: 'insensitive' } }],
    },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Verificar acesso do usuário
  const access = await checkCourseAccess(course.id);

  // Se já tem acesso, redireciona ou mostra botão
  const hasAccess = access.hasAccess;

  // Calcular estatísticas do curso
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  // const totalDuration = '12h 30min'; // Mock - calcular do videoUrl duration

  // Depoimentos mockados
  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Empresário',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'Este curso transformou completamente minha mentalidade. Em 3 meses consegui implementar tudo e os resultados foram extraordinários.',
    },
    {
      name: 'Miguel Santos',
      role: 'Coach',
      image: 'https://i.pravatar.cc/150?img=33',
      rating: 5,
      text: 'Conteúdo direto ao ponto, sem enrolação. Gabriel entrega exatamente o que promete. Recomendo sem hesitar.',
    },
    {
      name: 'Ricardo Costa',
      role: 'Atleta',
      image: 'https://i.pravatar.cc/150?img=51',
      rating: 5,
      text: 'A metodologia Madua funciona de verdade. Apliquei nos treinos e na vida. Melhor investimento que fiz este ano.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Cursos
            </Link>
            <span>/</span>
            <span className="text-white">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent" />
        
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Transforme sua vida em {totalLessons} aulas práticas
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {course.title}
            </h1>

            {/* Description */}
            {course.description && (
              <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto">
                {course.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 mb-8">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#D4AF37]" />
                <span>{totalLessons} aulas</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <span>{course.modules.length} módulos</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <span>Certificado</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D4AF37]" />
                <span>+5.000 alunos</span>
              </div>
            </div>

            {/* Thumbnail */}
            {course.thumbnail && (
              <div className="rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Course Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">
                  O que vais aprender
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.modules.slice(0, 6).map((module) => (
                    <div
                      key={module.id}
                      className="flex items-start gap-3 p-4 bg-[#1A1F2E] rounded-lg border border-zinc-800"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{module.title}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Course Modules */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Conteúdo do Curso
                </h2>
                <div className="space-y-3">
                  {course.modules.map((module, idx) => (
                    <details
                      key={module.id}
                      className="group bg-[#1A1F2E] rounded-lg border border-zinc-800 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-900/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {module.title}
                            </h3>
                            <p className="text-sm text-zinc-500">
                              {module.lessons.length} aulas
                            </p>
                          </div>
                        </div>
                        <Lock className="w-5 h-5 text-zinc-600 group-open:hidden" />
                      </summary>
                      <div className="px-6 pb-6 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900/30 transition-colors"
                          >
                            <Play className="w-4 h-4 text-zinc-600" />
                            <span className="text-sm text-zinc-400 flex-1">
                              {lesson.title}
                            </span>
                            {lesson.isFree && (
                              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded">
                                Grátis
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Urgency Section */}
              {!hasAccess && (
                <section className="relative overflow-hidden bg-gradient-to-r from-[#D4AF37]/10 via-amber-500/5 to-[#D4AF37]/10 rounded-2xl p-8 border border-[#D4AF37]/20">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center animate-pulse">
                        <Clock className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          Oferta por Tempo Limitado
                        </h3>
                        <p className="text-zinc-400">
                          Garante o teu lugar hoje
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-[#0A0A0A]/50 backdrop-blur rounded-lg p-4 border border-zinc-800">
                        <Sparkles className="w-6 h-6 text-[#D4AF37] mb-2" />
                        <p className="text-sm font-semibold text-white mb-1">
                          Bónus Exclusivos
                        </p>
                        <p className="text-xs text-zinc-400">
                          Material complementar incluído
                        </p>
                      </div>
                      <div className="bg-[#0A0A0A]/50 backdrop-blur rounded-lg p-4 border border-zinc-800">
                        <Users className="w-6 h-6 text-[#D4AF37] mb-2" />
                        <p className="text-sm font-semibold text-white mb-1">
                          +5.000 Alunos
                        </p>
                        <p className="text-xs text-zinc-400">
                          Junta-te à comunidade
                        </p>
                      </div>
                      <div className="bg-[#0A0A0A]/50 backdrop-blur rounded-lg p-4 border border-zinc-800">
                        <TrendingUp className="w-6 h-6 text-[#D4AF37] mb-2" />
                        <p className="text-sm font-semibold text-white mb-1">
                          Resultados Reais
                        </p>
                        <p className="text-xs text-zinc-400">
                          Transformação comprovada
                        </p>
                      </div>
                    </div>
                    
                    {/* Countdown Timer */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/50">
                      <p className="text-center text-sm text-zinc-400 mb-4">
                        Oferta expira em:
                      </p>
                      <CountdownTimer hours={24} />
                    </div>
                  </div>
                </section>
              )}

              {/* Testimonials */}
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">
                  O que dizem os alunos
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800"
                    >
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]"
                          />
                        ))}
                      </div>
                      <p className="text-zinc-300 mb-4">&quot;{testimonial.text}&quot;</p>
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-zinc-500">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Guarantee */}
              <section className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-2xl p-8 border border-[#D4AF37]/20">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Garantia de 30 Dias
                    </h3>
                    <p className="text-zinc-400">
                      Se por qualquer motivo não ficares satisfeito com o curso,
                      devolvemos 100% do teu dinheiro. Sem perguntas, sem
                      complicações. O risco é todo nosso.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Pricing Sticky Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {hasAccess ? (
                  /* Already Has Access */
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-8 border-2 border-emerald-500/20">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Tens Acesso!
                      </h3>
                      <p className="text-zinc-400">
                        {access.reason === 'club_member'
                          ? 'Como membro do Clube Madua'
                          : 'Já compraste este curso'}
                      </p>
                    </div>

                    <Link
                      href={`/cursos/${course.id}`}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Ir para as Aulas
                    </Link>
                  </div>
                ) : (
                  /* Purchase Options */
                  <>
                    {/* Individual Purchase */}
                    {course.isStandalone && course.price && (
                      <div className="bg-[#1A1F2E] rounded-2xl p-6 border-2 border-zinc-800 hover:border-[#D4AF37]/30 transition-colors">
                        <div className="text-center mb-6">
                          <p className="text-zinc-400 text-sm mb-2">
                            Compra Individual
                          </p>
                          <div className="text-5xl font-bold text-white mb-1">
                            €{course.price.toFixed(0)}
                          </div>
                          <p className="text-zinc-500 text-sm">
                            Pagamento único
                          </p>
                        </div>

                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            Acesso vitalício ao curso
                          </li>
                          <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            Todas as {totalLessons} aulas
                          </li>
                          <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            Certificado de conclusão
                          </li>
                          <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            Atualizações futuras incluídas
                          </li>
                        </ul>

                        <button className="w-full py-4 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          Comprar Agora
                          <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-center text-xs text-zinc-500 mt-4">
                          💳 Pagamento 100% seguro
                        </p>
                      </div>
                    )}

                    {/* Club Option */}
                    {course.isInClub && (
                      <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-2xl p-6 border-2 border-[#D4AF37]/40 relative overflow-hidden">
                        {/* Popular Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full">
                          POPULAR
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-6 h-6 text-[#D4AF37]" />
                            <p className="text-[#D4AF37] font-semibold">
                              Clube Madua
                            </p>
                          </div>
                          <div className="text-4xl font-bold text-white mb-1">
                            €29<span className="text-xl text-zinc-400">/mês</span>
                          </div>
                          <p className="text-zinc-400 text-sm">
                            ou €290/ano (economiza 2 meses)
                          </p>
                        </div>

                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start gap-3 text-sm text-white">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <strong>Este curso + TODOS os outros</strong>
                          </li>
                          <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            Vlogs exclusivos semanais
                          </li>
                          <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            Comunidade privada
                          </li>
                          <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            Novos cursos toda semana
                          </li>
                          <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            Suporte prioritário
                          </li>
                        </ul>

                        <Link
                          href="/upgrade"
                          className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#C5A028] hover:to-[#D4AF37] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Crown className="w-5 h-5" />
                          Entrar no Clube
                        </Link>

                        <p className="text-center text-xs text-zinc-400 mt-4">
                          ⚡ Cancela quando quiseres
                        </p>
                      </div>
                    )}

                    {/* Trust Signals */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-[#1A1F2E] rounded-lg p-3 border border-zinc-800">
                        <Zap className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                        <p className="text-xs text-zinc-400">Acesso Imediato</p>
                      </div>
                      <div className="bg-[#1A1F2E] rounded-lg p-3 border border-zinc-800">
                        <Shield className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                        <p className="text-xs text-zinc-400">100% Seguro</p>
                      </div>
                      <div className="bg-[#1A1F2E] rounded-lg p-3 border border-zinc-800">
                        <Award className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                        <p className="text-xs text-zinc-400">Certificado</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-zinc-800 bg-[#0A0A0A]/50">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Posso cancelar a qualquer momento?',
                  a: 'Sim! Se escolheres o Clube Madua, podes cancelar quando quiseres. Sem permanência, sem taxas de cancelamento.',
                },
                {
                  q: 'Como funciona a garantia?',
                  a: 'Tens 30 dias para experimentar o curso. Se não ficares satisfeito, devolvemos 100% do teu dinheiro.',
                },
                {
                  q: 'Tenho acesso para sempre?',
                  a: 'Na compra individual, sim! O acesso é vitalício. No Clube, tens acesso enquanto a subscrição estiver ativa.',
                },
                {
                  q: 'Posso assistir no telemóvel?',
                  a: 'Claro! A plataforma é totalmente responsiva. Podes assistir em qualquer dispositivo.',
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-[#1A1F2E] rounded-lg border border-zinc-800 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-900/50 transition-colors">
                    <h3 className="font-semibold text-white">{faq.q}</h3>
                    <ArrowRight className="w-5 h-5 text-zinc-600 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-zinc-400">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      {!hasAccess && (
        <div className="border-t border-zinc-800 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]/50">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pronto para Transformar a Tua Vida?
              </h2>
              <p className="text-xl text-zinc-400 mb-8">
                Junta-te a milhares de homens que já estão no caminho da excelência
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {course.isStandalone && course.price && (
                  <button className="px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A028] text-black text-lg font-bold rounded-xl transition-colors">
                    Comprar por €{course.price.toFixed(0)}
                  </button>
                )}
                {course.isInClub && (
                  <Link
                    href="/upgrade"
                    className="px-8 py-4 bg-white hover:bg-zinc-200 text-black text-lg font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Crown className="w-6 h-6" />
                    Entrar no Clube
                  </Link>
                )}
              </div>
              <p className="text-sm text-zinc-500 mt-6">
                ✓ Garantia de 30 dias • ✓ Acesso imediato • ✓ Suporte incluído
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
