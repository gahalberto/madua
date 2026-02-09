import { getAllPosts } from '@/app/actions/posts';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Calendar, Plus, Edit, ChefHat } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="p-8">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog & Receitas</h1>
          <p className="text-zinc-400 mt-1">Gerencie todo o conteúdo SEO</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-[#D4AF37] hover:bg-[#C5A028] text-black px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Total de Posts</p>
          <p className="text-2xl font-bold text-white mt-1">{posts.length}</p>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Publicados</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {posts.filter((p) => p.isPublished).length}
          </p>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Premium</p>
          <p className="text-2xl font-bold text-[#D4AF37] mt-1">
            {posts.filter((p) => p.isPremium).length}
          </p>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Receitas</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            {posts.filter((p) => p.recipe).length}
          </p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <ChefHat className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">Nenhum post criado ainda</p>
            <p className="text-zinc-500 text-sm mt-2">
              Crie o primeiro post para começar a construir sua biblioteca de conteúdo
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-black/30 border-b border-zinc-800">
              <tr>
                <th className="text-left p-4 text-zinc-400 font-medium text-sm">Post</th>
                <th className="text-left p-4 text-zinc-400 font-medium text-sm">Categoria</th>
                <th className="text-left p-4 text-zinc-400 font-medium text-sm">Status</th>
                <th className="text-left p-4 text-zinc-400 font-medium text-sm">Tipo</th>
                <th className="text-left p-4 text-zinc-400 font-medium text-sm">Data</th>
                <th className="text-right p-4 text-zinc-400 font-medium text-sm">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {post.image ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-6 h-6 text-zinc-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{post.title}</p>
                        <p className="text-sm text-zinc-400 truncate">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                      {post.category?.name || 'Sem categoria'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {post.isPublished ? (
                        <>
                          <Eye className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500 font-medium">Publicado</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-zinc-500" />
                          <span className="text-sm text-zinc-500 font-medium">Rascunho</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {post.isPremium && (
                        <div className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="text-xs text-[#D4AF37] font-medium">Premium</span>
                        </div>
                      )}
                      {post.recipe && (
                        <div className="flex items-center gap-1">
                          <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-xs text-orange-500 font-medium">Receita</span>
                        </div>
                      )}
                      {!post.isPremium && !post.recipe && (
                        <span className="text-xs text-zinc-500">Público</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString('pt-PT')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Ver post"
                      >
                        <Eye className="w-4 h-4 text-zinc-400" />
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-zinc-400" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </div>
  );
}
