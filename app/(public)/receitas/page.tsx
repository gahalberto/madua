import { getPublishedPosts } from '@/app/actions/posts';
import { Clock, ChefHat, Lock, Users, Flame, ArrowRight } from 'lucide-react';
import { RecipeSearch } from '@/components/recipe-search';
import { normalizeString } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Receitas | Madua - Nutrição e Receitas para o Homem Moderno',
  description:
    'Receitas saudáveis com informação nutricional completa. Alimentação inteligente para performance e saúde.',
  keywords: 'receitas saudáveis, nutrição ancestral, alimentação masculina, receitas fitness, culinária saudável',
  alternates: {
    canonical: 'https://madua.pt/receitas',
  },
  openGraph: {
    title: 'Receitas | Madua - Nutrição e Receitas para o Homem Moderno',
    description: 'Receitas saudáveis com informação nutricional completa. Alimentação inteligente para performance e saúde.',
    url: 'https://madua.pt/receitas',
    siteName: 'Madua',
    images: [
      {
        url: 'https://madua.pt/logo/madua-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Madua - Receitas',
      },
    ],
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Receitas | Madua',
    description: 'Receitas saudáveis com informação nutricional completa.',
    images: ['https://madua.pt/logo/madua-og.jpg'],
    creator: '@madua',
    site: '@madua',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface PageProps {
  searchParams: {
    page?: string;
    categoria?: string;
    q?: string;
  };
}

const ITEMS_PER_PAGE = 12;

export default async function ReceitasPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const categoria = searchParams.categoria;
  const searchQuery = searchParams.q;

  // Buscar apenas posts que são receitas
  const allPosts = await getPublishedPosts();
  let receitas = allPosts.filter((p) => p.recipe);

  // Filtrar por categoria se fornecida
  if (categoria) {
    receitas = receitas.filter((r) => r.category?.name.toLowerCase() === categoria.toLowerCase());
  }

  // Filtrar por busca se fornecida
  if (searchQuery) {
    const normalizedQuery = normalizeString(searchQuery);
    receitas = receitas.filter((r) => 
      normalizeString(r.title).includes(normalizedQuery) ||
      (r.excerpt && normalizeString(r.excerpt).includes(normalizedQuery)) ||
      normalizeString(r.category?.name || '').includes(normalizedQuery)
    );
  }

  // Calcular paginação
  const totalPages = Math.ceil(receitas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReceitas = receitas.slice(startIndex, endIndex);

  // Extrair categorias únicas
  const categorias = Array.from(new Set(allPosts.filter((p) => p.recipe && p.category).map((p) => p.category!.name)));

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <div className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D4AF37]/10 rounded-2xl mb-6 border border-[#D4AF37]/20">
              <ChefHat className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Receitas <span className="text-[#D4AF37]">Madua</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Nutrição ancestral para o homem moderno. Receitas otimizadas para performance, saúde
              e longevidade.
            </p>
          </div>

          {/* Barra de Busca */}
          <div className="mt-8 flex justify-center">
            <RecipeSearch />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtros de Categoria */}
        {categorias.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <a
                href="/receitas"
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  !categoria
                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/25'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                Todas
              </a>
              {categorias.map((cat) => (
                <a
                  key={cat}
                  href={`/receitas?categoria=${encodeURIComponent(cat)}`}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all capitalize ${
                    categoria === cat
                      ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/25'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center backdrop-blur">
            <p className="text-3xl font-bold text-[#D4AF37] mb-1">{receitas.length}</p>
            <p className="text-sm text-zinc-400">Receitas</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center backdrop-blur">
            <p className="text-3xl font-bold text-green-500 mb-1">
              {receitas.filter((r) => !r.isPremium).length}
            </p>
            <p className="text-sm text-zinc-400">Gratuitas</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center backdrop-blur">
            <p className="text-3xl font-bold text-orange-500 mb-1">
              {receitas.filter((r) => r.recipe?.difficulty === 'Fácil').length}
            </p>
            <p className="text-sm text-zinc-400">Fáceis</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center backdrop-blur">
            <p className="text-3xl font-bold text-blue-500 mb-1">100%</p>
            <p className="text-sm text-zinc-400">Info Nutricional</p>
          </div>
        </div>

        {/* Grid de Receitas - Editorial Luxury Style */}
        {paginatedReceitas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {paginatedReceitas.map((post) => (
                <a
                  key={post.id}
                  href={`/receitas/${post.slug}`}
                  className="group block bg-zinc-900/30 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <ChefHat className="w-16 h-16 text-zinc-700" />
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {post.isPremium && (
                      <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl">
                        <Lock className="w-3.5 h-3.5" />
                        PREMIUM
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <div className="mb-3">
                      <span className="inline-block text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                        {post.category?.name || 'Receita'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-white text-xl mb-3 line-clamp-2 leading-tight group-hover:text-[#D4AF37] transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-4" />

                    {/* Recipe Info Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {post.recipe?.prepTime && (
                        <div className="text-center">
                          <Clock className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                          <p className="text-xs text-zinc-500">{post.recipe.prepTime}min</p>
                        </div>
                      )}
                      {post.recipe?.servings && (
                        <div className="text-center">
                          <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                          <p className="text-xs text-zinc-500">{post.recipe.servings}x</p>
                        </div>
                      )}
                      {post.recipe?.calories && (
                        <div className="text-center">
                          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                          <p className="text-xs text-zinc-500">{post.recipe.calories}</p>
                        </div>
                      )}
                    </div>

                    {/* Read More Link */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-zinc-500 group-hover:text-[#D4AF37] transition-colors">
                      <span>Ver Receita</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-12">
                {currentPage > 1 && (
                  <a
                    href={`/receitas?page=${currentPage - 1}${categoria ? `&categoria=${categoria}` : ''}`}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors font-medium"
                  >
                    Anterior
                  </a>
                )}

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Mostrar apenas páginas próximas
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <a
                          key={page}
                          href={`/receitas?page=${page}${categoria ? `&categoria=${categoria}` : ''}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${
                            page === currentPage
                              ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/25'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          {page}
                        </a>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="text-zinc-600 px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {currentPage < totalPages && (
                  <a
                    href={`/receitas?page=${currentPage + 1}${categoria ? `&categoria=${categoria}` : ''}`}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors font-medium"
                  >
                    Próxima
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-800">
              <ChefHat className="w-10 h-10 text-zinc-700" />
            </div>
            <p className="text-zinc-400 text-lg mb-2">Nenhuma receita encontrada</p>
            <p className="text-zinc-500 text-sm">
              {searchQuery ? (
                <>
                  Não há receitas com &quot;{searchQuery}&quot;.{' '}
                  <a href="/receitas" className="text-[#D4AF37] hover:underline">
                    Limpar busca
                  </a>
                </>
              ) : categoria ? (
                <>
                  Não há receitas na categoria &quot;{categoria}&quot;.{' '}
                  <a href="/receitas" className="text-[#D4AF37] hover:underline">
                    Ver todas
                  </a>
                </>
              ) : (
                'Em breve teremos receitas incríveis aqui'
              )}
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent border border-[#D4AF37]/20 rounded-3xl p-8 md:p-12 text-center backdrop-blur relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/20 rounded-2xl mb-6">
              <ChefHat className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Desbloqueia Todas as Receitas Premium
            </h2>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Mais de 100 receitas exclusivas com planos de refeições semanais, listas de compras
              automáticas e acesso à comunidade de nutrição.
            </p>
            <a
              href="/upgrade"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4CF47] text-black px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#D4AF37]/25 hover:scale-105"
            >
              <Lock className="w-5 h-5" />
              Entrar no Clube Madua
            </a>
            <p className="text-sm text-zinc-500 mt-6">
              ✓ Cancela quando quiseres • ✓ Acesso imediato • ✓ Garantia de 30 dias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
