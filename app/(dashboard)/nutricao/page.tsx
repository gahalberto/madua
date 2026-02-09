import { getPublishedPosts } from '@/app/actions/posts';
import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChefHat, Lock, Users, Flame, Crown } from 'lucide-react';
import { RecipeSearch } from '@/components/recipe-search';
import { normalizeString } from '@/lib/utils';

export const metadata = {
  title: 'Receitas | Dashboard Madua',
  description: 'Acesse todas as receitas exclusivas do Clube Madua',
};

interface PageProps {
  searchParams: {
    page?: string;
    categoria?: string;
    q?: string;
  };
}

const ITEMS_PER_PAGE = 12;

export default async function ReceitasDashboardPage({ searchParams }: PageProps) {
  const session = await auth();
  const currentPage = Number(searchParams.page) || 1;
  const categoria = searchParams.categoria;
  const searchQuery = searchParams.q;

  // Buscar apenas posts que são receitas
  const allPosts = await getPublishedPosts();
  let receitas = allPosts.filter((p) => p.recipe);

  // Filtrar por categoria se fornecida
  if (categoria) {
    receitas = receitas.filter((r) => r.category?.name?.toLowerCase() === categoria.toLowerCase());
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

  // Verificar quantas receitas o usuário tem acesso
  const hasActiveSubscription = session?.user?.subscriptionStatus === 'ACTIVE';
  const receitasAcessiveis = receitas.filter(
    (r) => !r.isPremium || hasActiveSubscription
  );

  // Calcular paginação
  const totalPages = Math.ceil(receitas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReceitas = receitas.slice(startIndex, endIndex);

  // Extrair categorias únicas
  const categorias = Array.from(new Set(allPosts.filter((p) => p.recipe && p.category).map((p) => p.category!.name)));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10 rounded-xl">
            <ChefHat className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Receitas Madua
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Nutrição ancestral para performance e saúde
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-[#D4AF37] mb-1">{receitas.length}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Receitas</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-green-500 mb-1">{receitasAcessiveis.length}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Com Acesso</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-orange-500 mb-1">
            {receitas.filter((r) => r.recipe?.difficulty === 'Fácil').length}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Receitas Fáceis</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-500 mb-1">{categorias.length}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Categorias</p>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="mb-8">
        <RecipeSearch />
      </div>

      {/* Filtros de Categoria */}
      {categorias.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/nutricao"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                !categoria
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              Todas
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat}
                href={`/nutricao?categoria=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  categoria === cat
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Receitas */}
      {paginatedReceitas.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedReceitas.map((post) => {
              const temAcesso = !post.isPremium || hasActiveSubscription;

              return (
                <Link
                  key={post.id}
                  href={`/nutricao/${post.slug}`}
                  className="group block bg-white dark:bg-zinc-900/30 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50 hover:border-[#D4AF37]/30 dark:hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                        <ChefHat className="w-16 h-16 text-zinc-300 dark:text-zinc-700" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {post.isPremium && (
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          temAcesso
                            ? 'bg-[#D4AF37] text-black'
                            : 'bg-zinc-900/80 backdrop-blur text-white'
                        }`}>
                          {temAcesso ? <Crown className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          PREMIUM
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">
                        {post.category?.name || 'Nutrição'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Recipe Meta */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                      {post.recipe?.prepTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.recipe.prepTime}m</span>
                        </div>
                      )}
                      {post.recipe?.servings && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{post.recipe.servings}</span>
                        </div>
                      )}
                      {post.recipe?.calories && (
                        <div className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          <span>{post.recipe.calories} kcal</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/nutricao?page=${currentPage - 1}${categoria ? `&categoria=${categoria}` : ''}`}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  Anterior
                </Link>
              )}
              <span className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white rounded-lg border border-zinc-200 dark:border-zinc-800">
                Página {currentPage} de {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/nutricao?page=${currentPage + 1}${categoria ? `&categoria=${categoria}` : ''}`}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  Próxima
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <ChefHat className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-900 dark:text-zinc-400 text-lg mb-2">Nenhuma receita encontrada</p>
          {searchQuery && (
            <p className="text-zinc-600 dark:text-zinc-500 text-sm">
              Não há receitas com &quot;{searchQuery}&quot;.{' '}
              <Link href="/nutricao" className="text-[#D4AF37] hover:underline">
                Limpar busca
              </Link>
            </p>
          )}
        </div>
      )}

      {/* CTA para upgrade se não tiver subscription ativa */}
      {!hasActiveSubscription && receitas.some((r) => r.isPremium) && (
        <div className="mt-12 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-8 text-center">
          <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
            Desbloqueia Receitas Premium
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-xl mx-auto">
            Acede a todas as receitas exclusivas, planos de nutrição personalizados e conteúdo
            premium do Clube Madua.
          </p>
          <Link
            href="/upgrade"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4CF47] text-black px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
          >
            <Crown className="w-5 h-5" />
            Entrar no Clube Madua
          </Link>
        </div>
      )}
    </div>
  );
}
