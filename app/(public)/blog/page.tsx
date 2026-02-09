import { getPublishedPosts } from '@/app/actions/posts';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChefHat, Lock, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Blog | Madua - Sabedoria Ancestral para o Homem Moderno',
  description:
    'Artigos, receitas e guias sobre nutrição, treino, mindset e desenvolvimento masculino.',
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  // Separar posts por categoria
  const receitas = posts.filter((p) => p.recipe);
  const artigos = posts.filter((p) => !p.recipe);

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog <span className="text-[#D4AF37]">Madua</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Sabedoria ancestral aplicada à vida moderna. Artigos sobre nutrição, treino, mindset e
            desenvolvimento pessoal.
          </p>
        </div>

        {/* Receitas Section */}
        {receitas.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <ChefHat className="w-6 h-6 text-[#D4AF37]" />
              <h2 className="text-2xl font-bold text-white">Receitas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receitas.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-[#D4AF37]/50 transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-800">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="w-12 h-12 text-zinc-700" />
                      </div>
                    )}
                    {post.isPremium && (
                      <div className="absolute top-3 right-3 bg-[#D4AF37] text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        PREMIUM
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                    )}

                    {/* Recipe Info */}
                    {post.recipe && (
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        {post.recipe.prepTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.recipe.prepTime}min
                          </div>
                        )}
                        {post.recipe.difficulty && (
                          <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">
                            {post.recipe.difficulty}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Artigos Section */}
        {artigos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Artigos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artigos.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-[#D4AF37]/50 transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-800">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-zinc-700 rounded-full" />
                      </div>
                    )}
                    {post.isPremium && (
                      <div className="absolute top-3 right-3 bg-[#D4AF37] text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        PREMIUM
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-zinc-500 uppercase">{post.category?.name || 'Blog'}</span>
                      <span className="text-zinc-700">•</span>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString('pt-PT', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-zinc-400 text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-zinc-400 text-lg">Nenhum post publicado ainda</p>
            <p className="text-zinc-500 text-sm mt-2">Em breve teremos conteúdo incrível aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}
