'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  category: { name: string } | null;
  categoryId: string | null;
  isPublished: boolean;
  isPremium: boolean;
  recipe: {
    prepTime: number | null;
    cookTime: number | null;
    difficulty: string | null;
  } | null;
}

export default function AdminReceitasPage() {
  const [receitas, setReceitas] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; slug: string; title: string }>({
    open: false,
    slug: '',
    title: '',
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadReceitas();
  }, []);

  const loadReceitas = async () => {
    try {
      const response = await fetch('/api/posts?type=recipe');
      const data = await response.json();
      setReceitas(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { deletePost } = await import('@/app/actions/posts');
      const result = await deletePost(deleteModal.slug);
      
      if (result.success) {
        setReceitas(receitas.filter((r) => r.slug !== deleteModal.slug));
        setDeleteModal({ open: false, slug: '', title: '' });
      } else {
        alert(result.error || 'Erro ao deletar receita');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Erro ao deletar receita');
    } finally {
      setDeleting(false);
    }
  };

  const stats = {
    total: receitas.length,
    publicadas: receitas.filter((r) => r.isPublished).length,
    rascunhos: receitas.filter((r) => !r.isPublished).length,
    premium: receitas.filter((r) => r.isPremium).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Receitas</h1>
            <p className="text-zinc-400">Gerir todas as receitas do site</p>
          </div>
          <Link
            href="/admin/receitas/nova"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#C4A037] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Receita
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Total</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Publicadas</p>
            <p className="text-3xl font-bold text-green-400">{stats.publicadas}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Rascunhos</p>
            <p className="text-3xl font-bold text-amber-400">{stats.rascunhos}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Premium</p>
            <p className="text-3xl font-bold text-[#D4AF37]">{stats.premium}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800 border-b border-zinc-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Receita
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Dificuldade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Tempo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-700">
            {receitas.map((receita) => (
              <tr key={receita.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {receita.image && (
                      <img
                        src={receita.image}
                        alt={receita.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-white">{receita.title}</p>
                      <p className="text-sm text-zinc-400">{receita.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300">
                  {receita.category?.name || 'Sem categoria'}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300">
                  {receita.recipe?.difficulty || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300">
                  {receita.recipe?.prepTime && receita.recipe?.cookTime
                    ? `${(receita.recipe.prepTime || 0) + (receita.recipe.cookTime || 0)}min`
                    : '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {receita.isPublished ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/20 text-green-400">
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/20 text-amber-400">
                        Rascunho
                      </span>
                    )}
                    {receita.isPremium && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37]">
                        Premium
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/receitas/${receita.slug}`}
                      target="_blank"
                      className="p-2 text-zinc-400 hover:bg-zinc-700 rounded-lg transition-colors"
                      title="Ver receita"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/receitas/${receita.slug}/editar`}
                      className="p-2 text-zinc-400 hover:bg-zinc-700 rounded-lg transition-colors"
                      title="Editar receita"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ open: true, slug: receita.slug, title: receita.title })}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Deletar receita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {receitas.length === 0 && (
          <div className="py-12 text-center text-zinc-400">
            <p>Nenhuma receita encontrada.</p>
            <Link
              href="/admin/receitas/nova"
              className="inline-flex items-center gap-2 mt-4 text-[#D4AF37] hover:text-[#C4A037] font-medium"
            >
              <Plus className="w-4 h-4" />
              Criar primeira receita
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6 border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-2">Deletar Receita</h3>
            <p className="text-zinc-400 mb-4">
              Tem certeza que deseja deletar a receita <strong>{deleteModal.title}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, slug: '', title: '' })}
                disabled={deleting}
                className="px-4 py-2 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'A deletar...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
