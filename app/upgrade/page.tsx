import { Crown, Check, Sparkles, BookOpen, Video, MessageCircle, Users, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function UpgradeContent() {
  const session = await auth();
  
  let user = null;
  let isActiveMember = false;

  if (session?.user?.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptionStatus: true },
    });
    isActiveMember = user?.subscriptionStatus === 'ACTIVE';
  }

  const plans = [
    {
      name: 'Mensal',
      price: '29',
      period: '/mês',
      priceId: 'price_monthly_xxx',
      description: 'Perfeito para começar',
      popular: false,
    },
    {
      name: 'Anual',
      price: '290',
      period: '/ano',
      priceId: 'price_yearly_xxx',
      description: 'Melhor valor',
      badge: 'Economize 2 meses',
      popular: true,
      savings: 'Equivale a €24.17/mês',
    },
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: 'Todos os Cursos',
      description: 'Acesso ilimitado a todos os cursos premium da plataforma',
    },
    {
      icon: Video,
      title: 'Vlogs Semanais',
      description: 'Conteúdo exclusivo toda semana',
    },
    {
      icon: Sparkles,
      title: 'Atualizações Constantes',
      description: 'Novos cursos e conteúdos regularmente',
    },
    {
      icon: MessageCircle,
      title: 'Comunidade Exclusiva',
      description: 'Grupo privado de membros do Clube',
    },
    {
      icon: Users,
      title: 'Suporte Prioritário',
      description: 'Resposta rápida às suas dúvidas',
    },
    {
      icon: Zap,
      title: 'Acesso Vitalício',
      description: 'Conteúdo assistido permanece disponível',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 via-[#1A1F2E] to-[#0A0A0A]" />
        
        <div className="relative container mx-auto px-6 py-16">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Clube Madua
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Transforme-se com a
              <span className="block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                Comunidade Madua
              </span>
            </h1>

            <p className="text-xl text-zinc-400 mb-8">
              Acesso ilimitado a todos os cursos, vlogs exclusivos e uma comunidade de homens
              comprometidos com a excelência.
            </p>

            {isActiveMember && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-medium">
                <Check className="w-5 h-5" />
                Você já é um membro ativo do Clube!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            O que você ganha como membro
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[#1A1F2E] rounded-xl border border-zinc-800 p-6 hover:border-[#D4AF37]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-zinc-400">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Pricing Plans */}
          {!isActiveMember && (
            <>
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Escolha seu plano
              </h2>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative bg-[#1A1F2E] rounded-xl border ${
                      plan.popular
                        ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                        : 'border-zinc-800'
                    } p-8`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full text-xs font-bold text-black">
                        {plan.badge}
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold text-white">
                          €{plan.price}
                        </span>
                        <span className="text-zinc-400">{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <p className="text-sm text-[#D4AF37] mt-2">
                          {plan.savings}
                        </p>
                      )}
                    </div>

                    <button
                      className={`w-full py-4 rounded-lg font-bold transition-colors mb-6 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#C5A028] hover:to-[#D4AF37] text-black'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      }`}
                    >
                      Começar Agora
                    </button>

                    <ul className="space-y-3">
                      {benefits.slice(0, 4).map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-zinc-300">
                            {benefit.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Guarantee */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 p-8 text-center">
              <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Garantia de Satisfação
              </h3>
              <p className="text-zinc-400">
                Se você não estiver satisfeito nos primeiros 30 dias, devolvemos
                100% do seu investimento. Sem perguntas, sem complicações.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function UpgradePage() {
  return <UpgradeContent />;
}
