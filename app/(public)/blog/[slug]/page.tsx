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
  Shield,
  Zap,
  Award,
  ArrowLeft,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const result = await getPostBySlug(params.slug);
  const post = result.post;

  if (!post) {
    return {
      title: 'Post não encontrado | Madua',
    };
  }

  return {
    title: post.metaTitle || `${post.title} | Madua`,
    description: post.metaDescription || post.excerpt || post.title,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.image ? [post.image] : [],
      type: 'article',
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const result = await getPostBySlug(params.slug);
  const post = result.post;
  const session = await auth();

  if (!post || !post.isPublished) {
    notFound();
  }

  // Verificar se usuário tem acesso ao conteúdo premium
  const hasAccess = !post.isPremium || session?.user?.subscriptionStatus === 'ACTIVE';

  // Parsear JSON se for receita
  let ingredients: { name: string; quantity: string; unit: string }[] = [];
  let instructions: string[] = [];

  if (post.recipe) {
    try {
      ingredients = JSON.parse(post.recipe.ingredients);
      instructions = JSON.parse(post.recipe.instructions);
    } catch (error) {
      console.error('Error parsing recipe data:', error);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header com navegação */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#D4AF37] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {post.image && (
        <div className="relative w-full h-[400px] bg-zinc-900">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title & Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-[#D4AF37] font-semibold uppercase tracking-wide">
              {post.category?.name || 'Blog'}
            </span>
            {post.isPremium && (
              <div className="flex items-center gap-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-1 rounded">
                <Lock className="w-3 h-3 text-[#D4AF37]" />
                <span className="text-xs text-[#D4AF37] font-bold">PREMIUM</span>
              </div>
            )}
            {post.recipe && (
              <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 px-2 py-1 rounded">
                <ChefHat className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-orange-500 font-bold">RECEITA</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && <p className="text-xl text-zinc-400 leading-relaxed">{post.excerpt}</p>}

          <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500">
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString('pt-PT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Recipe Info Card */}
        {post.recipe && hasAccess && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {post.recipe.prepTime && (
                <div className="text-center">
                  <Clock className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-xs text-zinc-500">Preparação</p>
                  <p className="text-white font-semibold">{post.recipe.prepTime} min</p>
                </div>
              )}
              {post.recipe.cookTime && (
                <div className="text-center">
                  <Clock className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs text-zinc-500">Cozedura</p>
                  <p className="text-white font-semibold">{post.recipe.cookTime} min</p>
                </div>
              )}
              {post.recipe.servings && (
                <div className="text-center">
                  <Users className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs text-zinc-500">Porções</p>
                  <p className="text-white font-semibold">{post.recipe.servings}</p>
                </div>
              )}
              {post.recipe.difficulty && (
                <div className="text-center">
                  <ChefHat className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-zinc-500">Dificuldade</p>
                  <p className="text-white font-semibold">{post.recipe.difficulty}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paywall / Authwall - Mostrar 30% do conteúdo */}
        {post.isPremium && !hasAccess ? (
          <>
            {/* Preview do Conteúdo (30% do conteúdo) */}
            <div className="relative mb-8">
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
                  prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                  prose-p:text-zinc-300 prose-p:leading-relaxed
                  prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-bold
                  prose-ul:list-disc prose-ul:pl-6
                  prose-li:text-zinc-300"
                dangerouslySetInnerHTML={{
                  __html: post.content.substring(0, Math.floor(post.content.length * 0.3)),
                }}
              />

              {/* Blur Effect Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent backdrop-blur-sm" />
            </div>

            {/* Premium Paywall Card */}
            <div className="relative z-10 -mt-32 mb-12">
              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-2 border-[#D4AF37]/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D4AF37]/20 rounded-full mb-6 animate-pulse">
                    <Crown className="w-10 h-10 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    🔓 Desbloqueie o Protocolo Completo
                  </h3>
                  <p className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                    Tens acesso apenas a 30% deste conteúdo. Junta-te ao <span className="text-[#D4AF37] font-semibold">Clube Madua</span> e desbloqueia o protocolo completo, incluindo todas as estratégias, receitas detalhadas e conteúdo exclusivo.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800">
                    <Zap className="w-6 h-6 text-[#D4AF37] mb-2" />
                    <p className="text-sm font-semibold text-white mb-1">Acesso Imediato</p>
                    <p className="text-xs text-zinc-400">Todo o conteúdo desbloqueado</p>
                  </div>
                  <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800">
                    <Shield className="w-6 h-6 text-[#D4AF37] mb-2" />
                    <p className="text-sm font-semibold text-white mb-1">+100 Artigos</p>
                    <p className="text-xs text-zinc-400">Biblioteca completa premium</p>
                  </div>
                  <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800">
                    <Award className="w-6 h-6 text-[#D4AF37] mb-2" />
                    <p className="text-sm font-semibold text-white mb-1">Cursos Incluídos</p>
                    <p className="text-xs text-zinc-400">Acesso a todo o catálogo</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {session?.user ? (
                    <Link
                      href="/upgrade"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4CF47] text-black px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#D4AF37]/25"
                    >
                      <Crown className="w-5 h-5" />
                      Entrar no Clube Premium
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4CF47] text-black px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#D4AF37]/25"
                      >
                        Fazer Login
                      </Link>
                      <Link
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all"
                      >
                        Criar Conta Grátis
                      </Link>
                    </>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                  <p className="text-sm text-zinc-500">
                    ✓ Cancela quando quiseres • ✓ Acesso imediato • ✓ Garantia de 30 dias
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Conteúdo Completo */}
            <div
              className="prose prose-invert prose-lg max-w-none mb-12
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                prose-li:text-zinc-300 prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-[#D4AF37] prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:text-[#D4AF37] prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Recipe Details */}
            {post.recipe && ingredients.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Ingredientes */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                    Ingredientes
                  </h3>
                  <ul className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2 text-zinc-300">
                        <span className="text-[#D4AF37] mt-1">•</span>
                        <span>
                          {ingredient.quantity} {ingredient.unit} {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Informação Nutricional */}
                {post.recipe.calories && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Informação Nutricional</h3>
                    <div className="space-y-3">
                      {post.recipe.calories && (
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Calorias</span>
                          <span className="font-semibold text-white">{post.recipe.calories} kcal</span>
                        </div>
                      )}
                      {post.recipe.protein && (
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Proteína</span>
                          <span className="font-semibold text-white">{post.recipe.protein}g</span>
                        </div>
                      )}
                      {post.recipe.carbs && (
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Carboidratos</span>
                          <span className="font-semibold text-white">{post.recipe.carbs}g</span>
                        </div>
                      )}
                      {post.recipe.fats && (
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Gorduras</span>
                          <span className="font-semibold text-white">{post.recipe.fats}g</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            {post.recipe && instructions.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-12">
                <h3 className="text-xl font-bold text-white mb-4">Modo de Preparação</h3>
                <ol className="space-y-4">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-zinc-300 pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}

        {/* CTA para não-membros que têm acesso ao conteúdo gratuito */}
        {!post.isPremium && session?.user?.subscriptionStatus !== 'ACTIVE' && (
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-lg p-8 text-center">
            <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Gostaste deste conteúdo?</h3>
            <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
              Junta-te ao Clube Madua e desbloqueia acesso a todo o conteúdo premium, cursos exclusivos
              e a comunidade de homens em transformação.
            </p>
            <Link
              href="/upgrade"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4CF47] text-black px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            >
              <Crown className="w-5 h-5" />
              Conhecer o Clube Madua
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
