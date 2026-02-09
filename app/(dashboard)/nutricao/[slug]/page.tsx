import { getPostBySlug } from '@/app/actions/posts';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock,
  Clock,
  Users,
  ChefHat,
  Crown,
  CheckCircle2,
  Zap,
  ArrowLeft,
  Flame,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const result = await getPostBySlug(params.slug);
  const post = result.post;

  if (!post || !post.recipe) {
    return {
      title: 'Receita não encontrada | Madua',
    };
  }

  return {
    title: post.metaTitle || `${post.title} - Receita | Dashboard Madua`,
    description:
      post.metaDescription ||
      post.excerpt ||
      `Receita completa de ${post.title} com informação nutricional e modo de preparação detalhado.`,
  };
}

export default async function ReceitaDashboardPage({ params }: PageProps) {
  const result = await getPostBySlug(params.slug);
  const post = result.post;
  const session = await auth();

  if (!post || !post.isPublished || !post.recipe) {
    notFound();
  }

  // Verificar se usuário tem acesso ao conteúdo premium
  const hasAccess = !post.isPremium || session?.user?.subscriptionStatus === 'ACTIVE';

  // Parsear JSON da receita
  let ingredients: string[] = [];
  let instructions: string[] = [];

  try {
    ingredients = JSON.parse(post.recipe.ingredients);
    instructions = JSON.parse(post.recipe.instructions);
  } catch (error) {
    console.error('Error parsing recipe data:', error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] p-6">
      {/* Header com navegação */}
      <div className="mb-6">
        <Link
          href="/nutricao"
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-[#D4AF37] transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às Receitas
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        {post.image && (
          <div className="relative w-full h-[400px] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges overlay */}
            <div className="absolute top-6 right-6 flex gap-2">
              {post.isPremium && (
                <div
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 ${
                    hasAccess
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-black/60 backdrop-blur text-white'
                  }`}
                >
                  {hasAccess ? <Crown className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  PREMIUM
                </div>
              )}
              {post.recipe.difficulty && (
                <div className="bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  {post.recipe.difficulty}
                </div>
              )}
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-3">
                <ChefHat className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm text-[#D4AF37] font-semibold uppercase tracking-wide">
                  {post.category?.name || 'Nutrição'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
            {post.excerpt}
          </p>
        )}

        {/* Recipe Stats Card */}
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {post.recipe.prepTime && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D4AF37]/20 rounded-full mb-2">
                  <Clock className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                  Preparação
                </p>
                <p className="text-zinc-900 dark:text-white font-bold text-lg">
                  {post.recipe.prepTime} min
                </p>
              </div>
            )}
            {post.recipe.cookTime && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-full mb-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                  Cozedura
                </p>
                <p className="text-zinc-900 dark:text-white font-bold text-lg">
                  {post.recipe.cookTime} min
                </p>
              </div>
            )}
            {post.recipe.servings && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-2">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                  Porções
                </p>
                <p className="text-zinc-900 dark:text-white font-bold text-lg">
                  {post.recipe.servings}
                </p>
              </div>
            )}
            {post.recipe.calories && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-2">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                  Calorias
                </p>
                <p className="text-zinc-900 dark:text-white font-bold text-lg">
                  {post.recipe.calories}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Paywall para conteúdo premium sem acesso */}
        {post.isPremium && !hasAccess ? (
          <>
            {/* Preview do Conteúdo (30%) */}
            {post.content && (
              <div className="relative mb-8">
                <div
                  className="prose prose-zinc dark:prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: post.content.substring(0, Math.floor(post.content.length * 0.3)),
                  }}
                />
                {/* Blur Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white dark:from-[#0A0A0A] via-white/95 dark:via-[#0A0A0A]/95 to-transparent" />
              </div>
            )}

            {/* Premium Paywall Card */}
            <div className="relative z-10 -mt-32 mb-12">
              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-2 border-[#D4AF37]/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D4AF37]/20 rounded-full mb-6">
                    <Crown className="w-10 h-10 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                    🔓 Desbloqueia o Protocolo Completo
                  </h3>
                  <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    Junta-te ao <span className="text-[#D4AF37] font-semibold">Clube Madua</span> e
                    acede à receita completa com ingredientes exatos, modo de preparação detalhado e
                    informação nutricional precisa.
                  </p>
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/upgrade"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4CF47] text-black px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg"
                  >
                    <Crown className="w-5 h-5" />
                    Entrar no Clube Madua
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Conteúdo Completo */}
            {post.content && (
              <div
                className="prose prose-zinc dark:prose-invert prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Ingredientes e Info Nutricional */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Ingredientes */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                  Ingredientes
                </h3>
                <ul className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="text-[#D4AF37] mt-1 text-lg">•</span>
                      <span className="text-base">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Informação Nutricional */}
              {post.recipe.calories && (
                <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
                    Informação Nutricional
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Calorias</span>
                      <span className="font-bold text-zinc-900 dark:text-white text-lg">
                        {post.recipe.calories} kcal
                      </span>
                    </div>
                    {post.recipe.protein && (
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-800">
                        <span className="text-zinc-600 dark:text-zinc-400">Proteína</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {post.recipe.protein}g
                        </span>
                      </div>
                    )}
                    {post.recipe.carbs && (
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-800">
                        <span className="text-zinc-600 dark:text-zinc-400">Carboidratos</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {post.recipe.carbs}g
                        </span>
                      </div>
                    )}
                    {post.recipe.fats && (
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-400">Gorduras</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {post.recipe.fats}g
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modo de Preparação */}
            {instructions.length > 0 && (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
                  Modo de Preparação
                </h3>
                <ol className="space-y-6">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 pt-2 text-base leading-relaxed">
                        {instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
