'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag, Loader2 } from 'lucide-react';
import { getAllCategories, deleteCategory, createCategory, updateCategory } from '@/app/actions/categories';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  order: number;
  _count: {
    posts: number;
  };
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: '',
  });
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#D4AF37');
  const [icon, setIcon] = useState('🍳');
  const [order, setOrder] = useState('0');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await getAllCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-gerar slug
    const newSlug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(newSlug);
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setColor(category.color || '#D4AF37');
      setIcon(category.icon || '🍳');
      setOrder(category.order.toString());
    } else {
      setEditingCategory(null);
      setName('');
      setSlug('');
      setDescription('');
      setColor('#D4AF37');
      setIcon('🍳');
      setOrder('0');
    }
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const data = {
        name,
        slug,
        description: description || undefined,
        color,
        icon,
        order: parseInt(order) || 0,
      };

      const result = editingCategory
        ? await updateCategory(editingCategory.id, data)
        : await createCategory(data);

      if (result.success) {
        await loadCategories();
        closeModal();
      } else {
        setError(result.error || 'Erro ao salvar categoria');
      }
    } catch (err) {
      setError('Erro ao salvar categoria');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteCategory(deleteModal.id);
      
      if (result.success) {
        await loadCategories();
        setDeleteModal({ open: false, id: '', name: '' });
      } else {
        alert(result.error || 'Erro ao deletar categoria');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Erro ao deletar categoria');
    } finally {
      setDeleting(false);
    }
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
            <h1 className="text-3xl font-bold text-white">Categorias de Receitas</h1>
            <p className="text-zinc-400">Gerir categorias de receitas</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#C4A037] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Categoria
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Total de Categorias</p>
            <p className="text-3xl font-bold text-white">{categories.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Total de Receitas</p>
            <p className="text-3xl font-bold text-[#D4AF37]">
              {categories.reduce((acc, cat) => acc + cat._count.posts, 0)}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Categorias Ativas</p>
            <p className="text-3xl font-bold text-green-400">
              {categories.filter((cat) => cat._count.posts > 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  {category.icon || <Tag className="w-6 h-6" style={{ color: category.color || '#D4AF37' }} />}
                </div>
                <div>
                  <h3 className="font-bold text-white">{category.name}</h3>
                  <p className="text-xs text-zinc-500">{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openModal(category)}
                  className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, id: category.id, name: category.name })}
                  className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-zinc-400 mb-3">{category.description}</p>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Receitas: {category._count.posts}</span>
              <span className="text-zinc-500">Ordem: {category.order}</span>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-400">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma categoria cadastrada.</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 mt-4 text-[#D4AF37] hover:text-[#C4A037] font-medium"
            >
              <Plus className="w-4 h-4" />
              Criar primeira categoria
            </button>
          </div>
        )}
      </div>

      {/* Modal de Criar/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-lg w-full p-6 border border-zinc-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Nome *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Ex: Fundamentos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="fundamentos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Descrição da categoria"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Cor</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Ícone (emoji)</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    maxLength={2}
                    className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white text-center text-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="🍳"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Ordem</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#C4A037] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'A guardar...' : editingCategory ? 'Guardar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6 border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-2">Deletar Categoria</h3>
            <p className="text-zinc-400 mb-4">
              Tem certeza que deseja deletar a categoria <strong>{deleteModal.name}</strong>? As receitas não serão deletadas.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: '', name: '' })}
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
