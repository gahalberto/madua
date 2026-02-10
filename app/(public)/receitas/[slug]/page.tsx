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

  const title = post.metaTitle || `${post.title} | Madua`;
  const description =
    post.metaDescription ||
    post.excerpt ||
    `Receita completa de ${post.title} com informação nutricional e modo de preparação detalhado.`;
  const imageUrl = post.image || 'https://madua.pt/logo/madua-og.jpg';
  const url = `https://madua.pt/receitas/${params.slug}`;
  const totalTime = (post.recipe.prepTime || 0) + (post.recipe.cookTime || 0);

  return {
    title,
    description,
    keywords: [
      'receitas',
      'culinária ancestral',
      'alimentação saudável',
      'madua',
      post.category?.name,
      post.recipe.difficulty,
      ...(post.metaTitle ? [post.title] : []),
    ].filter(Boolean).join(', '),
    authors: [{ name: 'Madua' }],
    creator: 'Madua',
    publisher: 'Madua',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Madua',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'pt_PT',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ['Madua'],
      tags: [post.category?.name, post.recipe.difficulty].filter(Boolean),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@madua',
      site: '@madua',
    },
    robots: {
      index: post.isPublished,
      follow: post.isPublished,
      googleBot: {
        index: post.isPublished,
        follow: post.isPublished,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'recipe:author': 'Madua',
      'recipe:published_time': post.createdAt.toISOString(),
      'recipe:modified_time': post.updatedAt.toISOString(),
      'recipe:category': post.category?.name || 'Receita',
      ...(totalTime && { 'recipe:duration': `PT${totalTime}M` }),
      ...(post.recipe.servings && { 'recipe:servings': post.recipe.servings.toString() }),
    },
  };
}

export default async function ReceitaPage({ params }: PageProps) {
  const result = await getPostBySlug(params.slug);
  const post = result.post;
  const session = await auth();

  if (!post || !post.isPublished || !post.recipe) {
    notFound();
  }

  // Verificar se usuário tem acesso ao conteúdo premium
  // Receitas gratuitas (isPremium: false) são acessíveis para todos
  // Receitas premium só para usuários com subscription ativa
  const hasAccess = !post.isPremium || (session?.user && session.user.subscriptionStatus === 'ACTIVE');

  // Parsear JSON da receita
  let ingredients: { name: string; quantity: string; unit: string }[] = [];
  let instructions: string[] = [];

  try {
    ingredients = JSON.parse(post.recipe.ingredients);
    instructions = JSON.parse(post.recipe.instructions);
  } catch (error) {
    console.error('Error parsing recipe data:', error);
  }

  // Calcular tempo total
  const totalTime = (post.recipe.prepTime || 0) + (post.recipe.cookTime || 0);

  // JSON-LD Schema.org Recipe - SEMPRE incluir para SEO
  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: post.title,
    image: post.image ? [post.image] : [],
    author: {
      '@type': 'Organization',
      name: 'Madua',
      url: 'https://madua.pt',
      logo: {
        '@type': 'ImageObject',
        url: 'https://madua.pt/logo/logo-dourado.png',
      },
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    description: post.excerpt || post.title,
    prepTime: post.recipe.prepTime ? `PT${post.recipe.prepTime}M` : undefined,
    cookTime: post.recipe.cookTime ? `PT${post.recipe.cookTime}M` : undefined,
    totalTime: totalTime ? `PT${totalTime}M` : undefined,
    recipeYield: post.recipe.servings ? `${post.recipe.servings} porções` : undefined,
    recipeCategory: post.category?.name || 'Receita',
    recipeCuisine: 'Portuguesa',
    keywords: [post.category?.name, post.recipe.difficulty, 'receita saudável', 'madua'].filter(Boolean).join(', '),
    // Apenas incluir ingredientes e instruções completos se não for premium OU se o usuário tiver acesso
    recipeIngredient: !post.isPremium || hasAccess ? ingredients.map((i) => `${i.quantity} ${i.unit} ${i.name}`) : ['Conteúdo exclusivo para membros'],
    recipeInstructions: !post.isPremium || hasAccess
      ? instructions.map((instruction, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          text: instruction,
        }))
      : [
          {
            '@type': 'HowToStep',
            text: 'Junta-te ao Clube Madua para acesso completo',
          },
        ],
    nutrition: post.recipe.calories
      ? {
          '@type': 'NutritionInformation',
          calories: `${post.recipe.calories} calories`,
          proteinContent: post.recipe.protein ? `${post.recipe.protein}g` : undefined,
          carbohydrateContent: post.recipe.carbs ? `${post.recipe.carbs}g` : undefined,
          fatContent: post.recipe.fats ? `${post.recipe.fats}g` : undefined,
        }
      : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    isAccessibleForFree: !post.isPremium,
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://madua.pt',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Receitas',
        item: 'https://madua.pt/receitas',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://madua.pt/receitas/${params.slug}`,
      },
    ],
  };

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Madua',
    url: 'https://madua.pt',
    logo: {
      '@type': 'ImageObject',
      url: 'https://madua.pt/logo/logo-dourado.png',
    },
    sameAs: [
      'https://twitter.com/madua',
      'https://instagram.com/madua',
      'https://facebook.com/madua',
    ],
  };

  return (
    <>
      {/* JSON-LD Scripts para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Header com navegação */}
        <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/receitas"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#D4AF37] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar às Receitas
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        {post.image && (
          <div className="relative w-full h-[500px] bg-zinc-900">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

            {/* Badges overlay */}
            <div className="absolute top-6 right-6 flex gap-2">
              {post.isPremium && (
                <div className="bg-[#D4AF37] text-black px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-lg">
                  <Lock className="w-4 h-4" />
                  PREMIUM
                </div>
              )}
              {post.recipe.difficulty && (
                <div className="bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  {post.recipe.difficulty}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title & Meta */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <ChefHat className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37] font-semibold uppercase tracking-wide">
                {post.category?.name || 'Receita'}
              </span>
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

          {/* Recipe Stats Card */}
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {post.recipe.prepTime && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#D4AF37]/20 rounded-full mb-2">
                    <Clock className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Preparação</p>
                  <p className="text-white font-bold text-lg">{post.recipe.prepTime} min</p>
                </div>
              )}
              {post.recipe.cookTime && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-full mb-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Cozedura</p>
                  <p className="text-white font-bold text-lg">{post.recipe.cookTime} min</p>
                </div>
              )}
              {post.recipe.servings && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-2">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Porções</p>
                  <p className="text-white font-bold text-lg">{post.recipe.servings}</p>
                </div>
              )}
              {post.recipe.calories && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-2">
                    <Zap className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Calorias</p>
                  <p className="text-white font-bold text-lg">{post.recipe.calories}</p>
                </div>
              )}
            </div>
          </div>

          {/* Paywall Logic - 30% do conteúdo */}
          {post.isPremium && !hasAccess ? (
            <>
              {/* Preview do Conteúdo (30%) */}
              {post.content && (
                <div className="relative mb-8">
                  <div
                    className="prose prose-invert prose-lg max-w-none
                      prose-headings:text-white prose-headings:font-bold
                      prose-p:text-zinc-300 prose-p:leading-relaxed
                      prose-strong:text-white"
                    dangerouslySetInnerHTML={{
                      __html: post.content.substring(0, Math.floor(post.content.length * 0.3)),
                    }}
                  />
                  {/* Blur Effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent backdrop-blur-sm" />
                </div>
              )}

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
                      Estás a ver apenas 30% desta receita. Junta-te ao{' '}
                      <span className="text-[#D4AF37] font-semibold">Clube Madua</span> e acede à
                      receita completa com ingredientes exatos, modo de preparação detalhado e
                      informação nutricional precisa.
                    </p>
                  </div>

                  {/* What You'll Get */}
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-5 border border-zinc-800">
                      <ChefHat className="w-7 h-7 text-[#D4AF37] mb-3" />
                      <p className="text-sm font-semibold text-white mb-1">Lista Completa</p>
                      <p className="text-xs text-zinc-400">
                        Todos os ingredientes com quantidades exatas
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-5 border border-zinc-800">
                      <CheckCircle2 className="w-7 h-7 text-[#D4AF37] mb-3" />
                      <p className="text-sm font-semibold text-white mb-1">Passo a Passo</p>
                      <p className="text-xs text-zinc-400">
                        Instruções detalhadas para resultado perfeito
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-5 border border-zinc-800">
                      <Zap className="w-7 h-7 text-[#D4AF37] mb-3" />
                      <p className="text-sm font-semibold text-white mb-1">Info Nutricional</p>
                      <p className="text-xs text-zinc-400">Macros completos e calorias totais</p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {session?.user ? (
                      <Link
                        href="/upgrade"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4CF47] text-black px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#D4AF37]/25 hover:scale-105"
                      >
                        <Crown className="w-5 h-5" />
                        Entrar no Clube Madua
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4CF47] text-black px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#D4AF37]/25 hover:scale-105"
                        >
                          Fazer Login
                        </Link>
                        <Link
                          href="/register"
                          className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white border-2 border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                        >
                          Criar Conta Grátis
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Trust Signals */}
                  <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                    <p className="text-sm text-zinc-500">
                      ✓ Cancela quando quiseres • ✓ Acesso imediato a +100 receitas • ✓ Garantia de 30
                      dias
                    </p>
                  </div>
                </div>
              </div>

              {/* Teaser de ingredientes (escondidos) */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-md bg-zinc-900/80 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                    <p className="text-white font-semibold">Ingredientes Bloqueados</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      Desbloqueia para ver a lista completa
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 blur-sm">Ingredientes</h3>
                <ul className="space-y-2 blur-sm">
                  <li className="text-zinc-300">• Ingrediente secreto...</li>
                  <li className="text-zinc-300">• Ingrediente secreto...</li>
                  <li className="text-zinc-300">• Ingrediente secreto...</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Conteúdo Completo */}
              {post.content && (
                <div
                  className="prose prose-invert prose-lg max-w-none mb-12
                    prose-headings:text-white prose-headings:font-bold
                    prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
                    prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:text-white prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6
                    prose-li:text-zinc-300"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}

              {/* Ingredientes e Info Nutricional */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Ingredientes */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                    Ingredientes
                  </h3>
                  <ul className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3 text-zinc-300">
                        <span className="text-[#D4AF37] mt-1 text-lg">•</span>
                        <span className="text-base">
                          <span className="font-semibold text-white">
                            {ingredient.quantity} {ingredient.unit}
                          </span>{' '}
                          {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Informação Nutricional */}
                {post.recipe.calories && (
                  <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Informação Nutricional</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                        <span className="text-zinc-400">Calorias</span>
                        <span className="font-bold text-white text-lg">
                          {post.recipe.calories} kcal
                        </span>
                      </div>
                      {post.recipe.protein && (
                        <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                          <span className="text-zinc-400">Proteína</span>
                          <span className="font-semibold text-white">{post.recipe.protein}g</span>
                        </div>
                      )}
                      {post.recipe.carbs && (
                        <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
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

              {/* Modo de Preparação */}
              {instructions.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-12">
                  <h3 className="text-2xl font-bold text-white mb-6">Modo de Preparação</h3>
                  <ol className="space-y-6">
                    {instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <p className="text-zinc-300 pt-2 text-base leading-relaxed">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}

          {/* CTA para não-membros com acesso ao conteúdo gratuito */}
          {!post.isPremium && session?.user?.subscriptionStatus !== 'ACTIVE' && (
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-8 text-center">
              <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Gostaste desta receita?</h3>
              <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
                Junta-te ao Clube Madua e acede a mais de 100 receitas premium, planos de nutrição
                personalizados e a comunidade exclusiva.
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
    </>
  );
}
